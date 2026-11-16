import { describe, expect, it } from 'vitest'

import { armarCircuito, circuito } from './circuito'
import { resultados } from './joe-poker'

describe('circuito', () => {
  it('ubica cada resultado en una sola parada', () => {
    const total = circuito.reduce((n, p) => n + p.torneos.length, 0)
    expect(total).toBe(resultados.length)
  })

  it('separa Panamá, Austin, CDMX y Houston por fechas', () => {
    const por = (id: string) => circuito.find((p) => p.id === id)!
    expect(por('panama').torneos).toHaveLength(2)
    expect(por('panama').cobros).toBe(2)
    expect(por('online').torneos).toHaveLength(1)
    expect(por('austin').torneos).toHaveLength(2)
    expect(por('cdmx').torneos).toHaveLength(4)
    expect(por('houston').torneos).toHaveLength(1)
  })

  it('cuenta los medios de R2 por carpeta', () => {
    const cdmx = circuito.find((p) => p.id === 'cdmx')!
    expect(cdmx.reels).toBeGreaterThan(0)
    expect(cdmx.fotos).toBeGreaterThan(0)
  })

  it('no inventa cobros: Houston sin premio cuenta cero', () => {
    const h = circuito.find((p) => p.id === 'houston')!
    expect(h.cobros).toBe(0)
    expect(h.conPuesto).toBe(0)
  })

  it('una parada sin resultados queda vacía, no desaparece', () => {
    const p = armarCircuito([]).find((x) => x.id === 'panama')!
    expect(p.torneos).toEqual([])
  })
})
