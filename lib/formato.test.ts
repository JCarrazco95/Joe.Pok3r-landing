import { describe, expect, it } from 'vitest'

import { cifraCompacta, fechaRelativa } from './formato'

const AHORA = Date.parse('2026-10-06T12:00:00Z')

describe('fechaRelativa', () => {
  it('cuenta minutos, horas y días', () => {
    expect(fechaRelativa('2026-10-06T11:55:00Z', AHORA)).toMatch(/5 min/)
    expect(fechaRelativa('2026-10-06T09:00:00Z', AHORA)).toMatch(/3 h/)
    expect(fechaRelativa('2026-10-05T12:00:00Z', AHORA)).toBe('ayer')
    expect(fechaRelativa('2026-10-03T12:00:00Z', AHORA)).toMatch(/3 d/)
  })

  it('pasada una semana muestra la fecha', () => {
    expect(fechaRelativa('2026-09-17T10:00:00Z', AHORA)).toBe('17 sep 2026')
  })

  it('tolera relojes desfasados y fechas inválidas', () => {
    expect(fechaRelativa('2026-10-06T12:00:30Z', AHORA)).not.toMatch(/dentro/)
    expect(fechaRelativa('no es fecha', AHORA)).toBe('')
  })
})

describe('cifraCompacta', () => {
  it('abrevia las cifras grandes', () => {
    expect(cifraCompacta(950)).toBe('950')
    expect(cifraCompacta(1234567)).toMatch(/1,2/)
  })
})
