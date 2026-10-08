import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { _reiniciarTokenKick, obtenerCanalKick, obtenerKick, type CredencialesKick } from './kick'
import { fetchColgado, mockFetch, respuestaJson } from './test-utils'

const CRED: CredencialesKick = { clientId: 'id', clientSecret: 'secreto', slug: 'canal_demo' }
const TOKEN = { access_token: 'tok', token_type: 'Bearer', expires_in: 3600 }
const CANAL = {
  data: [
    {
      slug: 'canal_demo',
      stream_title: 'En\u0000 vivo\n  ahora',
      banner_picture: 'http://inseguro.example/b.jpg',
      stream: { is_live: true, viewer_count: 42, thumbnail: 'https://images.kick.com/t.jpg' },
    },
  ],
}

beforeEach(() => _reiniciarTokenKick())
afterEach(() => vi.unstubAllGlobals())

describe('kick', () => {
  it('sin credenciales: vacío y sin tocar la red', async () => {
    const f = mockFetch(respuestaJson(TOKEN))
    const r = await obtenerKick({ clientId: '', clientSecret: '', slug: '' })
    expect(r).toMatchObject({ origen: 'vacio', posts: [] })
    expect(f).not.toHaveBeenCalled()
  })

  it('éxito: valida el canal; sin clips en la API devuelve real con 0 posts', async () => {
    const f = mockFetch(respuestaJson(TOKEN), respuestaJson(CANAL))
    const r = await obtenerKick(CRED)
    expect(r).toMatchObject({ origen: 'real', posts: [] })
    expect(f).toHaveBeenCalledTimes(2)
  })

  it('obtenerCanalKick limpia el texto y exige https', async () => {
    mockFetch(respuestaJson(TOKEN), respuestaJson(CANAL))
    const c = await obtenerCanalKick(CRED)
    expect(c).toEqual({
      slug: 'canal_demo',
      titulo: 'En vivo ahora',
      enVivo: true,
      espectadores: 42,
      miniatura: 'https://images.kick.com/t.jpg',
    })
  })

  it('la revalidación del canal es la del feed por defecto y la corta si se pide', async () => {
    type Llamada = [string, RequestInit & { next?: { revalidate?: number } }]
    const f = mockFetch(respuestaJson(TOKEN), respuestaJson(CANAL))
    await obtenerCanalKick(CRED)
    expect((f.mock.calls.at(-1) as unknown as Llamada)[1].next?.revalidate).toBe(1800)

    _reiniciarTokenKick()
    const g = mockFetch(respuestaJson(TOKEN), respuestaJson(CANAL))
    await obtenerCanalKick(CRED, 60)
    expect((g.mock.calls.at(-1) as unknown as Llamada)[1].next?.revalidate).toBe(60)
  })

  it('error HTTP al pedir el token', async () => {
    mockFetch(respuestaJson({}, 401))
    expect(await obtenerKick(CRED)).toMatchObject({ origen: 'vacio', motivo: 'HTTP 401' })
  })

  it('timeout', async () => {
    vi.useFakeTimers()
    fetchColgado()
    const p = obtenerKick(CRED)
    await vi.advanceTimersByTimeAsync(9000)
    expect(await p).toMatchObject({ origen: 'vacio', motivo: 'Tiempo de espera agotado' })
    vi.useRealTimers()
  })

  it('payload malformado: token ausente y canal sin forma', async () => {
    mockFetch(respuestaJson({ nada: true }))
    expect(await obtenerKick(CRED)).toMatchObject({ origen: 'vacio' })

    _reiniciarTokenKick()
    mockFetch(respuestaJson(TOKEN), respuestaJson({ data: 'x' }))
    expect(await obtenerKick(CRED)).toMatchObject({ origen: 'vacio', motivo: 'Kick no devolvió el canal' })
  })

  it('slug inválido no llega a la red', async () => {
    const f = mockFetch(respuestaJson(TOKEN))
    const r = await obtenerKick({ ...CRED, slug: 'a&b=c' })
    expect(r.origen).toBe('vacio')
    expect(f).not.toHaveBeenCalled()
  })
})
