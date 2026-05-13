// AutomatikPOST — Supabase data hooks
// Substitui o DB store in-memory por chamadas reais ao banco

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

// Generic hook: read table with optional filter
export function useTable(table, { filter, orderBy = 'created_at', ascending = false, enabled = true } = {}) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    if (!enabled) { setLoading(false); return }
    setLoading(true)
    let query = supabase.from(table).select('*').order(orderBy, { ascending })
    if (filter) Object.entries(filter).forEach(([k,v]) => { query = query.eq(k, v) })
    const { data: rows, error: err } = await query
    if (err) setError(err.message)
    else setData(rows ?? [])
    setLoading(false)
  }, [table, JSON.stringify(filter), orderBy, ascending, enabled])

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch, setData }
}

// ── Posts ────────────────────────────────────────────────────
export function usePosts(filter) {
  return useTable('posts', { filter, orderBy: 'created_at' })
}

export async function createPost(post) {
  const { data, error } = await supabase.from('posts').insert(post).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updatePost(id, updates) {
  const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ── Post Tasks ───────────────────────────────────────────────
export function usePostTasks(postId) {
  return useTable('post_tasks', { filter: postId ? { post_id: postId } : undefined, orderBy: 'created_at', ascending: true, enabled: !!postId })
}
export const createTask  = (t)      => supabase.from('post_tasks').insert(t).select().single().then(r => { if(r.error) throw r.error; return r.data })
export const updateTask  = (id, u)  => supabase.from('post_tasks').update(u).eq('id', id)
export const deleteTask  = (id)     => supabase.from('post_tasks').delete().eq('id', id)

// ── Post Versions ────────────────────────────────────────────
export function useVersions(postId) {
  return useTable('post_versions', { filter: postId ? { post_id: postId } : undefined, orderBy: 'created_at', enabled: !!postId })
}
export async function saveVersion(postId, title, content, savedBy) {
  const { data: last } = await supabase.from('post_versions').select('version_num').eq('post_id', postId).order('version_num', { ascending: false }).limit(1).single()
  const version_num = (last?.version_num ?? 0) + 1
  return supabase.from('post_versions').insert({ post_id: postId, version_num, title, content, saved_by: savedBy }).select().single()
}

// ── Post Comments ────────────────────────────────────────────
export function useComments(postId) {
  return useTable('post_comments', { filter: postId ? { post_id: postId } : undefined, orderBy: 'created_at', ascending: true, enabled: !!postId })
}
export const createComment = (c) => supabase.from('post_comments').insert(c).select().single().then(r => { if(r.error) throw r.error; return r.data })
export const resolveComment = (id) => supabase.from('post_comments').update({ resolved: true }).eq('id', id)
export const deleteComment  = (id) => supabase.from('post_comments').delete().eq('id', id)

// ── WordPress Sites ──────────────────────────────────────────
export function useWPSites() { return useTable('wordpress_sites', { orderBy: 'created_at' }) }
export async function createWPSite(site) {
  const { data, error } = await supabase.from('wordpress_sites').insert(site).select().single()
  if (error) throw new Error(error.message)
  return data
}
export const deleteWPSite = (id) => supabase.from('wordpress_sites').delete().eq('id', id)

// ── Automations ──────────────────────────────────────────────
export function useAutomations() { return useTable('automations') }
export const createAutomation = (a) => supabase.from('automations').insert(a).select().single().then(r => { if(r.error) throw r.error; return r.data })
export const updateAutomation = (id, u) => supabase.from('automations').update(u).eq('id', id)
export const deleteAutomation = (id) => supabase.from('automations').delete().eq('id', id)
export const incrementRuns    = (id) => supabase.rpc('increment_automation_runs', { automation_id: id })

// ── Notifications ────────────────────────────────────────────
export function useNotifications() { return useTable('notifications', { orderBy: 'created_at' }) }
export const markRead     = (id)   => supabase.from('notifications').update({ read: true }).eq('id', id)
export const markAllRead  = ()     => supabase.from('notifications').update({ read: true }).eq('read', false)
export const deleteNotif  = (id)   => supabase.from('notifications').delete().eq('id', id)
export const clearNotifs  = ()     => supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000')

// ── Media ────────────────────────────────────────────────────
export function useMedia() { return useTable('media', { orderBy: 'created_at' }) }
export async function uploadMedia(file, userId) {
  const ext  = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error: storageErr } = await supabase.storage.from('media').upload(path, file, { contentType: file.type })
  if (storageErr) throw new Error(storageErr.message)
  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
  const { data, error } = await supabase.from('media').insert({
    user_id: userId, name: file.name,
    type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : file.type === 'application/pdf' ? 'pdf' : 'other',
    size_bytes: file.size, url: publicUrl, storage_path: path
  }).select().single()
  if (error) throw new Error(error.message)
  return data
}
export const deleteMedia  = async (id, path) => {
  await supabase.storage.from('media').remove([path])
  await supabase.from('media').delete().eq('id', id)
}

// ── Backups ──────────────────────────────────────────────────
export function useBackups() { return useTable('backups', { orderBy: 'created_at' }) }
export async function createBackup(userId, type = 'manual') {
  const { count } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  const { data, error } = await supabase.from('backups').insert({
    user_id: userId,
    name: `backup-${type}-${new Date().toISOString().slice(0, 10)}`,
    posts_count: count ?? 0,
    size_bytes: (count ?? 0) * 52000,  // rough estimate
    type, status: 'ok'
  }).select().single()
  if (error) throw new Error(error.message)
  return data
}

// ── Sources ──────────────────────────────────────────────────
export function useSources() { return useTable('sources') }
export const createSource = (s)    => supabase.from('sources').insert(s).select().single().then(r => { if(r.error) throw r.error; return r.data })
export const updateSource = (id,u) => supabase.from('sources').update(u).eq('id', id)
export const deleteSource = (id)   => supabase.from('sources').delete().eq('id', id)

// ── Publish Logs ─────────────────────────────────────────────
export function usePublishLogs() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('publish_logs').select('*, posts(title), wordpress_sites(name)').order('created_at', { ascending: false })
      .then(({ data: rows }) => { setData(rows ?? []); setLoading(false) })
  }, [])
  return { data, loading }
}

// ── Projects ─────────────────────────────────────────────────
export function useProjects() { return useTable('projects') }
export function useProjectTasks(projectId) {
  return useTable('project_tasks', { filter: projectId ? { project_id: projectId } : undefined, enabled: !!projectId })
}
export const createProject     = (p)    => supabase.from('projects').insert(p).select().single().then(r => { if(r.error) throw r.error; return r.data })
export const createProjectTask = (t)    => supabase.from('project_tasks').insert(t).select().single().then(r => { if(r.error) throw r.error; return r.data })
export const updateProjectTask = (id,u) => supabase.from('project_tasks').update(u).eq('id', id)

// ── Realtime subscription helper ─────────────────────────────
export function subscribeToTable(table, filter, callback) {
  const channel = supabase.channel(`rt_${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table, filter }, callback)
    .subscribe()
  return () => supabase.removeChannel(channel)
}

// ── Profiles ─────────────────────────────────────────────────
export function useProfiles() { return useTable('profiles', { orderBy: 'created_at', ascending: true }) }
export const updateProfileDB = (id, u) => supabase.from('profiles').update(u).eq('id', id)

// ── Webhooks ─────────────────────────────────────────────────
export function useWebhooks() { return useTable('webhooks') }
export const createWebhook = (w)    => supabase.from('webhooks').insert(w).select().single().then(r => { if(r.error) throw r.error; return r.data })
export const updateWebhook = (id,u) => supabase.from('webhooks').update(u).eq('id', id)
export const deleteWebhook = (id)   => supabase.from('webhooks').delete().eq('id', id)
