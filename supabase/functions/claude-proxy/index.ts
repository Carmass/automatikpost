import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Key comes from Supabase Secret — NEVER hardcoded
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
const SUPABASE_URL       = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY  = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  try {
    // Validate user JWT
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabase   = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS })

    const { model, max_tokens, messages, system, stream, tools } = await req.json()
    if (!messages) return new Response(JSON.stringify({ error: 'messages required' }), { status: 400, headers: CORS })

    const body: Record<string, unknown> = {
      model:      model ?? 'claude-sonnet-4-20250514',
      max_tokens: Math.min(max_tokens ?? 1000, 4000),
      messages,
    }
    if (system) body.system = system
    if (tools)  body.tools  = tools
    if (stream) body.stream = true

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    if (stream) {
      return new Response(res.body, {
        headers: { ...CORS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
      })
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('claude-proxy error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: CORS })
  }
})
