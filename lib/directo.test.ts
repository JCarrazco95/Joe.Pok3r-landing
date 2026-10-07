import { describe, expect, it } from 'vitest'
import {
  embedKick,
  estadoManual,
  leerEstadoEnVivo,
  urlCanalKick,
} from './directo'

const VALIDO = {
  enVivo: true,
  origen: 'real',
  slug: 'joe-pok3r',
  titulo: 'Directo',
  espectadores: 10,
  miniatura: 'https://images.kick.com/t.jpg',
  actualizado: '2026-10-07T12:00:00.000Z',
}

describe('embedKick', () => {
  it('arma la URL del reproductor con un slug válido', () => {
    expect(embedKick('joe-pok3r')).toBe('https://player.kick.com/joe-pok3r')
    expect(urlCanalKick('joe-pok3r')).toBe('https://kick.com/joe-pok3r')
  })

  it.each(['', 'a/b', 'a b', '../x', 'x?y=1', 'a'.repeat(26), 'https://evil.com'])(
    'rechaza el slug %j',
    (slug) => {
      expect(embedKick(slug)).toBeNull()
    },
  )
})

describe('estadoManual', () => {
  const MANUAL = { activo: true, evento: 'WSOP', detalle: 'Mesa final', url: 'https://x.com/v' }

  it('activo: lleva evento, detalle y enlace', () => {
    expect(estadoManual(MANUAL, 'canal', new Date('2026-10-07T00:00:00Z'))).toEqual({
      enVivo: true,
      origen: 'manual',
      slug: 'canal',
      titulo: 'WSOP',
      detalle: 'Mesa final',
      enlace: 'https://x.com/v',
      actualizado: '2026-10-07T00:00:00.000Z',
    })
  })

  it('apagado: no arrastra el texto del evento', () => {
    const e = estadoManual({ ...MANUAL, activo: false }, 'canal')
    expect(e).toMatchObject({ enVivo: false, origen: 'manual' })
    expect(e.titulo).toBeUndefined()
    expect(e.enlace).toBeUndefined()
  })
})

describe('leerEstadoEnVivo', () => {
  it('acepta una respuesta válida', () => {
    expect(leerEstadoEnVivo(VALIDO)).toEqual(VALIDO)
  })

  it('descarta campos desconocidos y reconstruye el objeto', () => {
    const e = leerEstadoEnVivo({ ...VALIDO, extra: '<script>' })
    expect(e).not.toHaveProperty('extra')
  })

  it('omite miniatura y enlace que no sean https', () => {
    const e = leerEstadoEnVivo({
      ...VALIDO,
      miniatura: 'http://x.com/a.jpg',
      enlace: 'javascript:alert(1)',
    })
    expect(e?.miniatura).toBeUndefined()
    expect(e?.enlace).toBeUndefined()
  })

  it('omite espectadores negativos o no numéricos', () => {
    expect(leerEstadoEnVivo({ ...VALIDO, espectadores: -1 })?.espectadores).toBeUndefined()
    expect(leerEstadoEnVivo({ ...VALIDO, espectadores: '10' })?.espectadores).toBeUndefined()
  })

  it.each([
    null,
    'texto',
    [],
    {},
    { ...VALIDO, enVivo: 'sí' },
    { ...VALIDO, origen: 'otro' },
    { ...VALIDO, slug: '../x' },
    { ...VALIDO, actualizado: 'ayer' },
  ])('rechaza %j', (dato) => {
    expect(leerEstadoEnVivo(dato)).toBeNull()
  })
})
