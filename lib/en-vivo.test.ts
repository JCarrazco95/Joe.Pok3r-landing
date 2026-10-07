import { describe, expect, it, vi } from 'vitest'
import { obtenerEstadoEnVivo, type DependenciasEnVivo } from './en-vivo'
import type { CanalKick } from './social/kick'

const AHORA = new Date('2026-10-07T12:00:00.000Z')
const MANUAL_OFF = { activo: false, evento: 'Evento X', detalle: '', url: null }
const MANUAL_ON = {
  activo: true,
  evento: 'Evento X',
  detalle: 'Nivel 12',
  url: 'https://ejemplo.com/vivo',
}
const CANAL_ON: CanalKick = {
  slug: 'canal_demo',
  titulo: 'Torneo en directo',
  enVivo: true,
  espectadores: 42,
  miniatura: 'https://images.kick.com/t.jpg',
}
const CANAL_OFF: CanalKick = { slug: 'canal_demo', titulo: '', enVivo: false }

const base = (
  canal: () => Promise<CanalKick>,
  extra: Partial<DependenciasEnVivo> = {},
): Partial<DependenciasEnVivo> => ({
  obtenerCanal: canal,
  manual: MANUAL_OFF,
  slug: 'canal_demo',
  simulado: '',
  entorno: 'development',
  ahora: () => AHORA,
  ...extra,
})

const falla = (mensaje: string) => async (): Promise<CanalKick> => {
  throw new Error(mensaje)
}

describe('obtenerEstadoEnVivo', () => {
  it('Kick en directo: real, con espectadores, título y miniatura', async () => {
    const e = await obtenerEstadoEnVivo(base(async () => CANAL_ON))
    expect(e).toEqual({
      enVivo: true,
      origen: 'real',
      slug: 'canal_demo',
      titulo: 'Torneo en directo',
      espectadores: 42,
      miniatura: 'https://images.kick.com/t.jpg',
      actualizado: AHORA.toISOString(),
    })
  })

  it('Kick en directo gana al interruptor manual', async () => {
    const e = await obtenerEstadoEnVivo(base(async () => CANAL_ON, { manual: MANUAL_ON }))
    expect(e.origen).toBe('real')
    expect(e.titulo).toBe('Torneo en directo')
  })

  it('Kick apagado y manual apagado: real apagado', async () => {
    const e = await obtenerEstadoEnVivo(base(async () => CANAL_OFF))
    expect(e).toMatchObject({ enVivo: false, origen: 'real' })
  })

  it('Kick apagado con manual activo: manual en vivo, sin espectadores', async () => {
    const e = await obtenerEstadoEnVivo(base(async () => CANAL_OFF, { manual: MANUAL_ON }))
    expect(e).toMatchObject({
      enVivo: true,
      origen: 'manual',
      titulo: 'Evento X',
      detalle: 'Nivel 12',
      enlace: 'https://ejemplo.com/vivo',
    })
    expect(e.espectadores).toBeUndefined()
  })

  it('Kick falla: nunca lanza y cae al manual apagado', async () => {
    const e = await obtenerEstadoEnVivo(base(falla('HTTP 500')))
    expect(e).toMatchObject({ enVivo: false, origen: 'manual' })
  })

  it('Kick falla con manual activo: manual en vivo', async () => {
    const e = await obtenerEstadoEnVivo(base(falla('timeout'), { manual: MANUAL_ON }))
    expect(e).toMatchObject({ enVivo: true, origen: 'manual' })
  })

  it('el simulador funciona fuera de producción y no toca la red', async () => {
    const canal = vi.fn(async () => CANAL_OFF)
    const e = await obtenerEstadoEnVivo(base(canal, { simulado: 'en-vivo' }))
    expect(e).toMatchObject({ enVivo: true, origen: 'real', espectadores: 128 })
    expect(canal).not.toHaveBeenCalled()
  })

  it('el simulador "apagado" devuelve real apagado', async () => {
    const e = await obtenerEstadoEnVivo(base(async () => CANAL_ON, { simulado: 'apagado' }))
    expect(e).toMatchObject({ enVivo: false, origen: 'real' })
  })

  it('en producción el simulador se ignora', async () => {
    const e = await obtenerEstadoEnVivo(
      base(async () => CANAL_OFF, { simulado: 'en-vivo', entorno: 'production' }),
    )
    expect(e).toMatchObject({ enVivo: false, origen: 'real' })
  })

  it('un valor desconocido del simulador no hace nada', async () => {
    const e = await obtenerEstadoEnVivo(base(async () => CANAL_OFF, { simulado: 'quizas' }))
    expect(e).toMatchObject({ enVivo: false, origen: 'real' })
  })
})
