import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  // https://wgghspuoffoedvkifacq.supabase.co
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// ── Claude proxy call (key never leaves backend) ──────────────
const proxyUrl = `${supabaseUrl}/functions/v1/claude-proxy`

export async function callClaude({ model = 'claude-sonnet-4-20250514', max_tokens = 1000, messages, system, stream = false, tools }) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ model, max_tokens, messages, system, stream, tools }),
  })

  if (stream) return res  // caller handles SSE stream

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Claude proxy error ${res.status}`)
  }
  return res.json()
}

// ── WordPress functions via Edge ──────────────────────────────
export async function wpPublish(payload) {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(`${supabaseUrl}/functions/v1/wp-publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error((await res.json()).error || 'WP publish failed')
  return res.json()
}

export async function wpTest(wpSiteId) {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(`${supabaseUrl}/functions/v1/wp-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ wp_site_id: wpSiteId }),
  })
  return res.json()
}
