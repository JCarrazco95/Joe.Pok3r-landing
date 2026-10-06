import { afterEach, describe, expect, it, vi } from 'vitest'
import { manual } from './manual'
import { fetchColgado, mockFetch, respuestaJson, respuestaTexto } from './test-utils'
import { obtenerTiktok } from './tiktok'

const URL1 = 'https://www.tiktok.com/@joe.pok3r/video/111'

afterEach(() => {
  vi.unstubAllGlobals()
  manual.tiktok.length = 0
})

describe('obtenerTiktok', () => {
  it('lista vacía: vacío y sin red', async () => {
    const f = mockFetch(respuestaJson({}))
    expect(await obtenerTiktok()).toMatchObject({ origen: 'vacio', posts: [] })
    expect(f).not.toHaveBeenCalled()
  })

  it('éxito: el oEmbed completa título y miniatura', async () => {
    manual.tiktok.push({ url: URL1, fecha: '2026-09-01' })
    mockFetch(
      respuestaJson({ title: 'Mano\u0000 épica', thumbnail_url: 'https://p16.tiktokcdn.com/x.jpg' }),
    )
    const r = await obtenerTiktok()
    expect(r.origen).toBe('manual')
    expect(r.motivo).toBeUndefined()
    expect(r.posts[0]).toMatchObject({
      red: 'tiktok',
      texto: 'Mano épica',
      media: { tipo: 'embed', miniatura: 'https://p16.tiktokcdn.com/x.jpg' },
    })
  })

  it('error HTTP: el post sale igual, con motivo', async () => {
    manual.tiktok.push({ url: URL1, fecha: '2026-09-01', texto: 'Mío' })
    mockFetch(respuestaJson({}, 500))
    const r = await obtenerTiktok()
    expect(r.posts).toHaveLength(1)
    expect(r.posts[0]?.texto).toBe('Mío')
    expect(r.motivo).toMatch(/HTTP 500/)
  })

  it('timeout', async () => {
    manual.tiktok.push({ url: URL1, fecha: '2026-09-01' })
    vi.useFakeTimers()
    fetchColgado()
    const p = obtenerTiktok()
    await vi.advanceTimersByTimeAsync(9000)
    const r = await p
    expect(r.posts).toHaveLength(1)
    expect(r.motivo).toMatch(/Tiempo de espera/)
    vi.useRealTimers()
  })

  it('payload malformado: JSON roto o miniatura insegura', async () => {
    manual.tiktok.push({ url: URL1, fecha: '2026-09-01' })
    mockFetch(respuestaTexto('<html>'))
    expect((await obtenerTiktok()).motivo).toMatch(/malformado/)

    mockFetch(respuestaJson({ title: 'ok', thumbnail_url: 'javascript:alert(1)' }))
    const r = await obtenerTiktok()
    expect(r.posts[0]?.media?.miniatura).toBeUndefined()
    expect(r.posts[0]?.texto).toBe('ok')
  })
})
