import { describe, expect, it } from 'vitest'

import { embedDe, redesConPosts } from './feed'
import type { PostSocial } from './social/types'

describe('embedDe', () => {
  it('YouTube usa youtube-nocookie.com', () => {
    expect(embedDe({ red: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })).toEqual({
      src: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
      vertical: false,
    })
  })

  it('Instagram y TikTok arman el iframe oficial', () => {
    expect(embedDe({ red: 'instagram', url: 'https://www.instagram.com/reel/C1a_b-2/' })?.src).toBe(
      'https://www.instagram.com/reel/C1a_b-2/embed',
    )
    expect(
      embedDe({ red: 'tiktok', url: 'https://www.tiktok.com/@joe.pok3r/video/7300000000000000000' })?.src,
    ).toBe('https://www.tiktok.com/embed/v2/7300000000000000000')
  })

  it('Kick no tiene embed', () => {
    expect(embedDe({ red: 'kick', url: 'https://kick.com/joe-pok3r/clips/clip_1' })).toBeNull()
  })

  it('rechaza hosts parecidos, ids raros y esquemas no https', () => {
    expect(embedDe({ red: 'youtube', url: 'https://www.youtube.com.evil.io/watch?v=dQw4w9WgXcQ' })).toBeNull()
    expect(embedDe({ red: 'youtube', url: 'https://www.youtube.com/watch?v="><script>' })).toBeNull()
    expect(embedDe({ red: 'instagram', url: 'https://instagram.com.evil.io/p/abc/' })).toBeNull()
    expect(embedDe({ red: 'tiktok', url: 'http://www.tiktok.com/@a/video/12345678' })).toBeNull()
    expect(embedDe({ red: 'tiktok', url: 'javascript:alert(1)' })).toBeNull()
    expect(embedDe({ red: 'instagram', url: 'no es url' })).toBeNull()
  })
})

describe('redesConPosts', () => {
  const post = (red: PostSocial['red'], id: string): PostSocial => ({
    red,
    id,
    url: 'https://example.com',
    texto: '',
    media: null,
    fecha: '2026-10-01T00:00:00Z',
  })

  it('devuelve sólo las redes con posts, en orden fijo', () => {
    const r = redesConPosts([post('tiktok', '1'), post('youtube', '2'), post('youtube', '3')])
    expect(r).toEqual([
      { red: 'youtube', total: 2 },
      { red: 'tiktok', total: 1 },
    ])
  })
})
