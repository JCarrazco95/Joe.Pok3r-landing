import { describe, expect, it, vi } from 'vitest'

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))

import { redDeUrl } from '@/lib/analitica'

describe('redDeUrl', () => {
  it('reconoce perfiles de enlaces', () => {
    expect(redDeUrl('https://kick.com/joe-pok3r')).toBe('kick')
    expect(redDeUrl('https://www.instagram.com/joe.pok3r/')).toBe('instagram')
  })
  it('ignora otros destinos', () => {
    expect(redDeUrl('https://example.com')).toBeNull()
    expect(redDeUrl('https://kick.com/otro-canal')).toBeNull()
  })
})
