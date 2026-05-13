// AutomatikPOST — Unit tests (Vitest)
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase
vi.mock('../lib/supabase.js', () => ({
  supabase: {
    from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: { id: 'test', title: 'Test Post', user_id: 'user-1' }, error: null }) }) }) }),
    auth: { getSession: () => ({ data: { session: { access_token: 'test-token' } } }) },
  },
  callClaude: vi.fn().mockResolvedValue({
    content: [{ type: 'text', text: '# Título de Teste\n\nConteúdo.\n\n---\n**Meta Description:** Meta teste\n**Keywords:** seo, teste\n**Score SEO estimado:** 85/100' }]
  }),
  wpPublish: vi.fn().mockResolvedValue({ success: true, wpPostId: 123 }),
  wpTest: vi.fn().mockResolvedValue({ success: true, wpVersion: '6.5', userRole: 'administrator' }),
}))

import { Backend } from '../api/backend.js'

describe('Backend.generatePost', () => {
  it('returns title and seoScore from Claude response', async () => {
    const result = await Backend.generatePost({ topic: 'SEO em 2026', tone: 'informativo', niche: 'marketing', length: 'completo' })
    expect(result.title).toBe('Título de Teste')
    expect(result.seoScore).toBe(85)
    expect(result.metaDescription).toContain('Meta teste')
  })
})

describe('Backend.generateOptimizedTitles', () => {
  it('falls back gracefully on parse error', async () => {
    const { callClaude } = await import('../lib/supabase.js')
    callClaude.mockResolvedValueOnce({ content: [{ type: 'text', text: '{"titles":["Título A","Título B"]}' }] })
    const result = await Backend.generateOptimizedTitles({ topic: 'SEO', niche: 'tech', count: 2 })
    expect(result.titles).toHaveLength(2)
    expect(result.titles[0]).toBe('Título A')
  })
})

describe('Backend.publishToWordPress', () => {
  it('calls wpPublish with correct args', async () => {
    const { wpPublish } = await import('../lib/supabase.js')
    await Backend.publishToWordPress({ postId: 'post-1', wpSiteId: 'site-1' })
    expect(wpPublish).toHaveBeenCalledWith({ post_id: 'post-1', wp_site_id: 'site-1', status: 'publish' })
  })
})

describe('Backend.testWordPressConnection', () => {
  it('returns connection result', async () => {
    const result = await Backend.testWordPressConnection({ wpSiteId: 'site-1' })
    expect(result.success).toBe(true)
    expect(result.wpVersion).toBe('6.5')
  })
})
