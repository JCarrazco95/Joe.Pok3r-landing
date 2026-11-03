import { describe, expect, it } from 'vitest'

import { resultados, tablero } from './joe-poker'

describe('tablero', () => {
  it('cada línea cabe en las 16 casillas', () => {
    for (const [a, b] of tablero) {
      expect([...a].length).toBeLessThanOrEqual(16)
      expect([...b].length).toBeLessThanOrEqual(16)
    }
  })
})

describe('resultados', () => {
  it('van del más reciente al más viejo', () => {
    const fechas = resultados.map((r) => r.fecha)
    expect(fechas).toEqual([...fechas].sort().reverse())
  })

  it('un puesto registrado es un entero positivo y cabe en el field, si lo hay', () => {
    for (const r of resultados) {
      if (r.puesto === null) continue
      expect(Number.isInteger(r.puesto) && r.puesto > 0).toBe(true)
      if (r.field) expect(r.puesto).toBeLessThanOrEqual(r.field)
    }
  })
})
