import { describe, expect, it } from 'vitest'

import { PANAMA, PANAMA_ESTADOS, panamaEstado } from './joe-poker'
import { cuentaRegresiva, dato } from './panama'

describe('cuentaRegresiva', () => {
  const inicio = '2026-11-05T11:00:00-05:00'
  const t0 = Date.parse(inicio)

  it('parte los días, horas y minutos que faltan', () => {
    const c = cuentaRegresiva(inicio, t0 - (2 * 864e5 + 3 * 36e5 + 7 * 6e4))
    expect(c).toEqual({ vivo: false, dias: '02', horas: '03', minutos: '07' })
  })

  it('al arrancar queda en ceros y vivo', () => {
    expect(cuentaRegresiva(inicio, t0)).toEqual({ vivo: true, dias: '00', horas: '00', minutos: '00' })
    expect(cuentaRegresiva(inicio, t0 + 5e6).vivo).toBe(true)
  })

  it('respeta el huso de Panamá (16:00 UTC)', () => {
    expect(cuentaRegresiva(inicio, Date.parse('2026-11-05T15:00:00Z')).horas).toBe('01')
  })
})

describe('panama', () => {
  it('un dato vacío se lee "—"', () => {
    expect(dato('')).toBe('—')
    expect(dato('Flight A')).toBe('Flight A')
  })

  it('el estado activo existe', () => {
    expect(PANAMA_ESTADOS[panamaEstado]).toBeDefined()
  })

  it('los datos por confirmar no traen números inventados', () => {
    expect(PANAMA.puesto).toBe('')
  })
})
