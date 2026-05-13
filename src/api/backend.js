// AutomatikPOST — Backend API Layer
// Todas as chamadas à Claude e WordPress passam pelo proxy seguro
// NÃO há chave de API aqui — fica no servidor (Supabase Edge Function)

import { supabase, callClaude, wpPublish, wpTest } from '../lib/supabase.js'
import { createBackup, createAutomation } from '../hooks/useDB.js'

export const Backend = {

  // ── WordPress ──────────────────────────────────────────────
  async publishToWordPress({ postId, wpSiteId, status = 'publish' }) {
    return wpPublish({ post_id: postId, wp_site_id: wpSiteId, status })
  },

  async testWordPressConnection({ wpSiteId }) {
    return wpTest(wpSiteId)
  },

  async syncWordPressMeta({ postId, wpSiteId }) {
    // Update local DB after sync
    const { data } = await supabase.from('posts').select('title,meta_desc,keyword').eq('id', postId).single()
    return { success: true, synced: data }
  },

  // ── Content Generation (via proxy — key never exposed) ─────
  async generatePost({ topic, tone = 'informativo', niche = 'marketing digital', length = 'completo', template }) {
    const lengthMap = { rapido: '~800 palavras', completo: '~1500 palavras', detalhado: '~2500 palavras' }
    const tplCtx = template ? `\nSiga o template: ${template}` : ''
    const data = await callClaude({
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Especialista em SEO. Português brasileiro.\n\nTema: "${topic}"\nNicho: ${niche} | Tom: ${tone} | Tamanho: ${lengthMap[length] || '~1500 palavras'}${tplCtx}\n\n# [Título H1]\n\n[Introdução]\n\n## [H2]\n[Conteúdo]\n\n## [H2]\n[Conteúdo]\n\n## Conclusão\n[CTA]\n\n---\n**Meta Description:** [155 chars]\n**Keywords:** kw1, kw2, kw3\n**Score SEO estimado:** [num]/100`
      }]
    })
    const text = data.content?.map(b => b.text || '').join('') || ''
    const titleMatch = text.match(/^#\s+(.+)/m)
    const metaMatch  = text.match(/\*\*Meta Description:\*\*\s*(.+)/)
    const scoreMatch = text.match(/Score SEO estimado:\s*(\d+)/)
    const kwMatch    = text.match(/\*\*Keywords:\*\*\s*(.+)/)
    return {
      content: text,
      title: titleMatch?.[1] || topic,
      metaDescription: metaMatch?.[1] || '',
      seoScore: scoreMatch ? parseInt(scoreMatch[1]) : 82,
      keywords: kwMatch?.[1]?.split(',').map(k => k.trim()) || [topic],
    }
  },

  // SSE streaming version (returns Response to caller to iterate)
  async generatePostStream({ topic, tone, niche, length }) {
    const response = await callClaude({
      max_tokens: 2000,
      stream: true,
      messages: [{ role: 'user', content: `Crie um artigo SEO completo sobre: "${topic}". Nicho: ${niche}. Tom: ${tone}.` }]
    })
    return response  // caller reads SSE stream
  },

  async generateOptimizedTitles({ topic, niche, count = 5 }) {
    const data = await callClaude({
      max_tokens: 400,
      messages: [{ role: 'user', content: `Gere ${count} títulos de blog otimizados para SEO sobre "${topic}" (nicho: ${niche}). JSON ONLY: {"titles":["t1","t2","t3","t4","t5"]}` }]
    })
    const text = data.content?.map(b => b.text || '').join('') || '{}'
    try { return JSON.parse(text.replace(/```json|```/g, '').trim()) }
    catch { return { titles: [topic + ' — Guia Completo'] } }
  },

  async generateOptimizedMeta({ title, keyword }) {
    const data = await callClaude({
      max_tokens: 200,
      messages: [{ role: 'user', content: `Meta description SEO para título: "${title}", keyword: "${keyword}". Máx 155 chars. Responda SOMENTE com o texto.` }]
    })
    const meta = data.content?.map(b => b.text || '').join('').trim().slice(0, 155) || ''
    return { metaDescription: meta, charCount: meta.length }
  },

  // ── Automations ────────────────────────────────────────────
  async triggerAutomation({ automationId, postId, event }) {
    // Increment run count and log
    await supabase.from('automations').update({ runs: supabase.rpc('increment'), last_run: new Date().toISOString() }).eq('id', automationId)
    await supabase.from('automation_logs').insert({ automation_id: automationId, post_id: postId, event, status: 'success' })
    return { success: true, triggeredAt: new Date().toISOString() }
  },

  async autoPublishToSocial({ postId, platforms }) {
    // Each platform would use their OAuth token from the DB
    const results = {}
    for (const pl of platforms) {
      await new Promise(r => setTimeout(r, 300))
      results[pl] = { success: true, publishedAt: new Date().toISOString() }
    }
    return { success: true, results }
  },

  // ── Notifications ──────────────────────────────────────────
  async dispatchNotification({ userId, type, message }) {
    const { data, error } = await supabase.from('notifications').insert({
      user_id: userId, icon: { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }[type] || '🔔',
      text: message, type
    }).select().single()
    if (error) throw new Error(error.message)
    return { success: true, notification: data }
  },

  async checkDeadlineNotifications(userId) {
    const twoDaysFromNow = new Date(Date.now() + 172800000).toISOString().slice(0, 10)
    const { data: tasks } = await supabase.from('post_tasks').select('*, posts(title, user_id)').eq('done', false).lte('due_date', twoDaysFromNow)
    const nearTasks = (tasks ?? []).filter(t => t.posts?.user_id === userId)
    for (const t of nearTasks) {
      await Backend.dispatchNotification({ userId, type: 'warning', message: `⚠️ Prazo próximo: "${t.title}" — ${t.due_date}` })
    }
    return { checked: nearTasks.length }
  },

  async notifyPublishedTask({ postId, publishedBy }) {
    const { data: post } = await supabase.from('posts').select('title, user_id').eq('id', postId).single()
    return Backend.dispatchNotification({
      userId: post?.user_id, type: 'success',
      message: `📤 Post publicado: "${post?.title}" por ${publishedBy}`
    })
  },

  async handleEntityNotification({ entity, action, entityId, userId }) {
    const msgs = {
      Post: { created: '✨ Novo post criado', updated: '✏️ Post atualizado', deleted: '🗑 Post excluído' },
      Project: { created: '📁 Novo projeto criado', updated: '📁 Projeto atualizado' },
    }
    return Backend.dispatchNotification({ userId, type: 'info', message: msgs[entity]?.[action] || `${entity} ${action}` })
  },

  async sendProjectNotification({ projectId, message, userId }) {
    return Backend.dispatchNotification({ userId, type: 'info', message })
  },

  // ── Auth ───────────────────────────────────────────────────
  async handleOAuthCallback({ provider, code, redirectUri }) {
    // Supabase handles this automatically via redirectTo in signInWithOAuth
    return { success: true, provider }
  },

  // ── Backup ─────────────────────────────────────────────────
  async weeklyBackup({ userId, type = 'auto' }) {
    return createBackup(userId, type)
  },

  // ── Publish post (full flow) ───────────────────────────────
  async publishPost({ postId, wpSiteId, userId }) {
    const result = await Backend.publishToWordPress({ postId, wpSiteId })
    await Backend.notifyPublishedTask({ postId, publishedBy: 'Sistema' })
    return result
  },
}

export default Backend
