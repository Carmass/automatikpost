// AutomatikPOST — WordPress Connection Test
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  try {
    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader ?? '' } } })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS })

    const { wp_site_id } = await req.json()
    const { data: site } = await supabase.from('wordpress_sites').select('*').eq('id', wp_site_id).single()
    if (!site) return new Response(JSON.stringify({ error: 'Site not found' }), { status: 404, headers: CORS })

    const credentials = btoa(`${site.wp_user}:${site.app_password}`)
    const apiUrl = `${site.url.replace(/\/$/, '')}/wp-json/wp/v2/users/me`

    const wpRes = await fetch(apiUrl, { headers: { Authorization: `Basic ${credentials}` } })
    if (!wpRes.ok) {
      const err = await wpRes.json().catch(() => ({}))
      await supabase.from('wordpress_sites').update({ status: 'offline' }).eq('id', wp_site_id)
      return new Response(JSON.stringify({ success: false, error: err.code || 'Connection failed' }), { status: 422, headers: { ...CORS, 'Content-Type': 'application/json' } })
    }
    const userData = await wpRes.json()

    // Get WP info
    const infoRes = await fetch(`${site.url.replace(/\/$/, '')}/wp-json/`)
    const info = infoRes.ok ? await infoRes.json().catch(() => ({})) : {}

    await supabase.from('wordpress_sites').update({
      status: 'online', wp_version: info.version, last_sync: new Date().toISOString()
    }).eq('id', wp_site_id)

    return new Response(JSON.stringify({
      success: true, userRole: userData.roles?.[0] || 'unknown',
      wpVersion: info.version || 'unknown', name: userData.name
    }), { headers: { ...CORS, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: CORS })
  }
})
