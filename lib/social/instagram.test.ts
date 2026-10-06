import { afterEach, describe, expect, it, vi } from 'vitest'
import { obtenerInstagram, refrescarTokenInstagram } from './instagram'
import { manual } from './manual'
import { fetchColgado, mockFetch, respuestaJson, respuestaTexto } from './test-utils'

const MEDIA = {
  data: [
    {
      id: '1',
      caption: 'Hola\u0007 mundo',
      media_type: 'IMAGE',
      media_url: 'https://scontent.cdninstagram.com/a.jpg',
      permalink: 'https://www.instagram.com/p/EJEMPLO/',
      timestamp: '2026-09-20T10:00:00+0000',
      like_count: 5,
    },
    { id: '2', permalink: 'https://evil.example/p/x/', timestamp: '2026-09-21T10:00:00+0000' },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
  manual.instagram.length = 0
})

describe('instagram (manual por defecto)', () => {
  it('lista vacía: origen vacío y sin red', async () => {
    const f = mockFetch(respuestaJson(MEDIA))
    expect(await obtenerInstagram(false, '')).toMatchObject({ origen: 'vacio', posts: [] })
    expect(f).not.toHaveBeenCalled()
  })

  it('lee manual.ts, descarta lo inválido y ordena como embed', async () => {
    manual.instagram.push(
      { url: 'https://www.instagram.com/p/EJEMPLO/', fecha: '2026-09-01' },
      { url: 'https://evil.example/p/x/', fecha: '2026-09-01' },
      { url: 'https://www.instagram.com/p/OTRO/', fecha: 'no-es-fecha' },
    )
    const r = await obtenerInstagram(false, '')
    expect(r.origen).toBe('manual')
    expect(r.posts).toHaveLength(1)
    expect(r.posts[0]).toMatchObject({ id: 'p/EJEMPLO', media: { tipo: 'embed' } })
  })

  it('auto encendido pero sin token: sigue en manual', async () => {
    const f = mockFetch(respuestaJson(MEDIA))
    expect((await obtenerInstagram(true, '')).origen).toBe('vacio')
    expect(f).not.toHaveBeenCalled()
  })
})

describe('instagram (Graph API, apagada por defecto)', () => {
  it('éxito', async () => {
    mockFetch(respuestaJson(MEDIA))
    const r = await obtenerInstagram(true, 'tok')
    expect(r.origen).toBe('real')
    expect(r.posts).toHaveLength(1)
    expect(r.posts[0]).toMatchObject({
      texto: 'Hola mundo',
      fecha: '2026-09-20T10:00:00.000Z',
      metricas: { likes: 5 },
    })
  })

  it('error HTTP: cae al manual con motivo', async () => {
    manual.instagram.push({ url: 'https://www.instagram.com/p/EJEMPLO/', fecha: '2026-09-01' })
    mockFetch(respuestaJson({ error: 'token' }, 400))
    const r = await obtenerInstagram(true, 'tok')
    expect(r).toMatchObject({ origen: 'manual', motivo: 'HTTP 400' })
    expect(r.posts).toHaveLength(1)
  })

  it('timeout', async () => {
    vi.useFakeTimers()
    fetchColgado()
    const p = obtenerInstagram(true, 'tok')
    await vi.advanceTimersByTimeAsync(9000)
    expect(await p).toMatchObject({ motivo: 'Tiempo de espera agotado' })
    vi.useRealTimers()
  })

  it('payload malformado', async () => {
    mockFetch(respuestaTexto('<html>'))
    expect(await obtenerInstagram(true, 'tok')).toMatchObject({ motivo: 'Respuesta con JSON malformado' })
    mockFetch(respuestaJson({ data: 'x' }))
    expect((await obtenerInstagram(true, 'tok')).motivo).toMatch(/forma inesperada/)
  })
})

describe('refrescarTokenInstagram', () => {
  it('éxito', async () => {
    mockFetch(respuestaJson({ access_token: 'nuevo', token_type: 'bearer', expires_in: 5184000 }))
    expect(await refrescarTokenInstagram('viejo')).toEqual({ token: 'nuevo', expiraEnSeg: 5184000 })
  })

  it('error HTTP, payload malformado y token vacío', async () => {
    mockFetch(respuestaJson({}, 400))
    await expect(refrescarTokenInstagram('viejo')).rejects.toThrow('HTTP 400')
    mockFetch(respuestaJson({ access_token: 'x' }))
    await expect(refrescarTokenInstagram('viejo')).rejects.toThrow(/refrescado válido/)
    await expect(refrescarTokenInstagram('')).rejects.toThrow(/Falta el token/)
  })

  it('timeout', async () => {
    vi.useFakeTimers()
    fetchColgado()
    const p = refrescarTokenInstagram('viejo')
    const espera = expect(p).rejects.toThrow('Tiempo de espera agotado')
    await vi.advanceTimersByTimeAsync(9000)
    await espera
    vi.useRealTimers()
  })
})
