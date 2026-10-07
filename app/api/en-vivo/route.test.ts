import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { REVALIDAR_EN_VIVO_SEG } from '@/lib/directo'

describe('ruta /api/en-vivo', () => {
  it('su `revalidate` literal coincide con REVALIDAR_EN_VIVO_SEG', () => {
    const ruta = readFileSync(new URL('./route.ts', import.meta.url), 'utf8')
    const m = /export const revalidate = (\d+)/.exec(ruta)
    expect(Number(m?.[1])).toBe(REVALIDAR_EN_VIVO_SEG)
  })
})
