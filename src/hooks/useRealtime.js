// AutomatikPOST — Supabase Realtime hook
// Atualiza notificações e posts em tempo real via WebSocket

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

// Subscribe to realtime notifications for current user
export function useRealtimeNotifications(userId, onNew) {
  useEffect(() => {
    if (!userId) return
    const channel = supabase.channel(`notifs_${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        onNew?.(payload.new)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])
}

// Subscribe to realtime post changes
export function useRealtimePosts(userId, onUpdate) {
  useEffect(() => {
    if (!userId) return
    const channel = supabase.channel(`posts_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        onUpdate?.(payload)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])
}

// Subscribe to automation logs
export function useRealtimeAutomations(userId, onTrigger) {
  useEffect(() => {
    if (!userId) return
    const channel = supabase.channel(`auto_logs_${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'automation_logs',
      }, (payload) => {
        onTrigger?.(payload.new)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])
}

// Generic presence hook (online users)
export function usePresence(roomId, currentUser) {
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!roomId || !currentUser) return

    const channel = supabase.channel(`presence_${roomId}`, {
      config: { presence: { key: currentUser.id } }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnlineUsers(Object.values(state).flat().map(u => u.user))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user: currentUser.id, name: currentUser.name, online_at: new Date().toISOString() })
        }
      })

    return () => { supabase.removeChannel(channel) }
  }, [roomId, currentUser?.id])

  return onlineUsers
}
