import { describe, expect, it } from 'vitest'

import { veredicto, type Carta } from './mano'

const c = (r: Carta['r'], s: Carta['s']): Carta => ({ r, s })

describe('veredicto', () => {
  it('pareja alta: all-in, fuerza alta', () => {
    const v = veredicto([c('J', '♠'), c('J', '♥')])
    expect(v.accion).toBe('ALL-IN')
    expect(v.odds).toBe('0.45%')
    expect(v.fuerza).toBe(Math.round(52 + 9 * 3.4))
  })

  it('pareja chica: call', () => {
    expect(veredicto([c('5', '♠'), c('5', '♦')]).accion).toBe('CALL')
  })

  it('dos broadway: raise', () => {
    expect(veredicto([c('A', '♠'), c('K', '♥')]).accion).toBe('RAISE')
  })

  it('conectores del mismo palo: call', () => {
    expect(veredicto([c('8', '♣'), c('7', '♣')]).accion).toBe('CALL')
  })

  it('as débil: call; el resto: fold', () => {
    expect(veredicto([c('A', '♠'), c('4', '♥')]).accion).toBe('CALL')
    expect(veredicto([c('9', '♠'), c('2', '♥')]).accion).toBe('FOLD')
  })

  it('la fuerza de una mano sin pareja nunca pasa de 80', () => {
    expect(veredicto([c('A', '♠'), c('K', '♠')]).fuerza).toBeLessThanOrEqual(80)
  })

  it('no depende del orden de las cartas', () => {
    expect(veredicto([c('2', '♥'), c('9', '♠')])).toEqual(veredicto([c('9', '♠'), c('2', '♥')]))
  })
})
