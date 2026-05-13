// AutomatikPOST — WordPress Publish Function
// Credenciais do WP nunca expostas no frontend

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
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS })

    const { post_id, wp_site_id, status = 'publish' } = await req.json()

    // Get post from DB
    const { data: post } = await supabase.from('posts').select('*').eq('id', post_id).single()
    if (!post) return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404, headers: CORS })

    // Get WordPress site (credentials stored securely in DB)
    const { data: site } = await supabase.from('wordpress_sites').select('*').eq('id', wp_site_id).single()
    if (!site) return new Response(JSON.stringify({ error: 'WP site not found' }), { status: 404, headers: CORS })

    const { url, wp_user, app_password } = site
    const credentials = btoa(`${wp_user}:${app_password}`)
    const apiUrl = `${url.replace(/\/$/, '')}/wp-json/wp/v2/posts`

    const start = Date.now()
    const wpRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        status,
        meta: { _yoast_wpseo_metadesc: post.meta_desc, _yoast_wpseo_focuskw: post.keyword },
      }),
    })

    const duration_ms = Date.now() - start
    const wpData = await wpRes.json()

    if (!wpRes.ok) {
      await supabase.from('publish_logs').insert({
        post_id, user_id: user.id, wp_site_id, status: 'error',
        error_msg: wpData.message || 'WP API error', duration_ms
      })
      return new Response(JSON.stringify({ error: wpData.message, code: wpData.code }), {
        status: 422, headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }

    const wpPostId = wpData.id
    await supabase.from('posts').update({ status: 'published', wp_post_id: wpPostId, published_at: new Date().toISOString() }).eq('id', post_id)
    await supabase.from('publish_logs').insert({
      post_id, user_id: user.id, wp_site_id, wp_post_id: wpPostId,
      status: 'success', type: 'publicado', duration_ms
    })
    await supabase.from('notifications').insert({
      user_id: user.id, icon: '📤', type: 'success',
      text: `Post "${post.title}" publicado com sucesso (WP #${wpPostId})`
    })

    return new Response(JSON.stringify({ success: true, wpPostId, url: wpData.link, duration_ms }), {
      headers: { ...CORS, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('wp-publish error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: CORS })
  }
})
