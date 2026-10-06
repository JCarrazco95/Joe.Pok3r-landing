import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchColgado, mockFetch, respuestaTexto } from './test-utils'
import { obtenerYoutube } from './youtube'

const CANAL = 'UCdBkZEh892cu--dzwC4WYKw'

// Fixture sintético con el formato Atom de YouTube; no son videos reales.
const RSS = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <entry>
  <id>yt:video:AAAAAAAAAAA</id>
  <yt:videoId>AAAAAAAAAAA</yt:videoId>
  <title>Prueba &amp; ejemplo &lt;b&gt;uno&lt;/b&gt;</title>
  <link rel="alternate" href="https://evil.example/x"/>
  <published>2026-09-10T12:00:00+00:00</published>
  <media:group><media:thumbnail url="https://i2.ytimg.com/vi/AAAAAAAAAAA/hqdefault.jpg" width="480" height="360"/></media:group>
 </entry>
 <entry>
  <yt:videoId>nope</yt:videoId>
  <title>ID inválido</title>
  <published>2026-09-11T12:00:00+00:00</published>
 </entry>
 <entry>
  <yt:videoId>BBBBBBBBBBB</yt:videoId>
  <title>Sin miniatura válida</title>
  <published>2026-09-12T12:00:00+00:00</published>
  <media:group><media:thumbnail url="http://evil.example/a.jpg"/></media:group>
 </entry>
</feed>`

afterEach(() => vi.unstubAllGlobals())

describe('obtenerYoutube', () => {
  it('parsea el RSS y descarta entradas inválidas', async () => {
    mockFetch(respuestaTexto(RSS))
    const r = await obtenerYoutube(CANAL)
    expect(r.origen).toBe('real')
    expect(r.posts).toHaveLength(2)
    const [a, b] = r.posts
    expect(a).toMatchObject({
      red: 'youtube',
      id: 'AAAAAAAAAAA',
      url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA',
      texto: 'Prueba & ejemplo <b>uno</b>',
      fecha: '2026-09-10T12:00:00.000Z',
    })
    expect(a?.media?.miniatura).toContain('ytimg.com')
    expect(a?.metricas).toBeUndefined()
    expect(b?.media?.miniatura).toBeUndefined()
  })

  it('reintenta un 404 intermitente', async () => {
    const f = mockFetch(respuestaTexto('no', 404), respuestaTexto(RSS))
    const r = await obtenerYoutube(CANAL)
    expect(f).toHaveBeenCalledTimes(2)
    expect(r.origen).toBe('real')
  })

  it('error HTTP persistente: vacío con motivo', async () => {
    mockFetch(respuestaTexto('x', 500))
    const r = await obtenerYoutube(CANAL)
    expect(r).toMatchObject({ origen: 'vacio', posts: [], motivo: 'HTTP 500' })
  })

  it('timeout: vacío con motivo', async () => {
    vi.useFakeTimers()
    fetchColgado()
    const promesa = obtenerYoutube(CANAL)
    await vi.advanceTimersByTimeAsync(9000)
    expect(await promesa).toMatchObject({ origen: 'vacio', motivo: 'Tiempo de espera agotado' })
    vi.useRealTimers()
  })

  it('payload malformado: vacío con motivo', async () => {
    mockFetch(respuestaTexto('<html>no soy un feed</html>'))
    expect(await obtenerYoutube(CANAL)).toMatchObject({ origen: 'vacio', posts: [] })
  })

  it('channel_id inválido no llega a la red', async () => {
    const f = mockFetch(respuestaTexto(RSS))
    expect((await obtenerYoutube('../etc')).origen).toBe('vacio')
    expect(f).not.toHaveBeenCalled()
  })
})
