import { describe, expect, it } from 'vitest'

import { enlaces } from '@/lib/joe-poker'
import { jsonLdPersona, perfilesSameAs } from '@/lib/seo'

describe('sameAs del JSON-LD', () => {
  const urls = perfilesSameAs()

  it('sólo trae URLs absolutas https', () => {
    expect(urls.length).toBeGreaterThan(0)
    for (const u of urls) expect(u).toMatch(/^https:\/\//)
  })

  it('incluye las redes propias de Joe', () => {
    for (const id of ['instagram', 'tiktok', 'youtube', 'twitch', 'kick']) {
      const url = enlaces.find((e) => e.id === id)?.url
      expect(url).toBeTruthy()
      expect(urls).toContain(url)
    }
  })

  it('excluye anclas internas, cuentas de terceros y Facebook', () => {
    expect(urls.some((u) => u.includes('#'))).toBe(false)
    expect(urls.some((u) => u.includes('codigopokermx'))).toBe(false)
    expect(urls.some((u) => /facebook\.com/.test(u))).toBe(false)
  })

  it('el Person lo expone', () => {
    const ld = jsonLdPersona()
    expect(ld['@type']).toBe('Person')
    expect(ld.sameAs).toEqual(urls)
  })
})
