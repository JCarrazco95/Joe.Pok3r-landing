/**
 * YouTube vía RSS público: `feeds/videos.xml?channel_id=…`. Sin API key ni
 * cuota. Devuelve los ~15 videos más recientes.
 *
 * Limitaciones conocidas:
 *  · El RSS no trae vistas, así que `metricas` queda sin definir.
 *  · El endpoint responde 404 de forma intermitente aun con un canal válido
 *    (comprobado en octubre de 2026); por eso hay un reintento. Si persiste, el
 *    feed cae al respaldo manual.
 *
 * El XML se lee con regex sobre el formato Atom fijo de YouTube: evita una
 * dependencia, y todo lo extraído pasa por las mismas guardas que un JSON.
 */

import { YOUTUBE_CHANNEL_ID } from '@/lib/env'
import { ErrorFuente, fechaIso, fetchSeguro, limpiarTexto, mensajeDe, urlHttps, vacio } from './http'
import type { PostSocial, ResultadoAdaptador } from './types'

const URL_RSS = 'https://www.youtube.com/feeds/videos.xml'
const ID_VIDEO = /^[A-Za-z0-9_-]{11}$/
const ID_CANAL = /^UC[A-Za-z0-9_-]{22}$/

const ENTIDADES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
}

function decodificar(xml: string): string {
  return xml.replace(/&(?:amp|lt|gt|quot|apos|#39);/g, (e) => ENTIDADES[e] ?? e)
}

/** Contenido de la primera etiqueta `<nombre>…</nombre>` dentro de un bloque. */
function etiqueta(bloque: string, nombre: string): string | undefined {
  const m = bloque.match(new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`))
  return m?.[1] === undefined ? undefined : decodificar(m[1])
}

function atributo(bloque: string, nombre: string, attr: string): string | undefined {
  const m = bloque.match(new RegExp(`<${nombre}\\s[^>]*?${attr}="([^"]*)"`))
  return m?.[1] === undefined ? undefined : decodificar(m[1])
}

/** Convierte el XML del RSS en posts. Descarta las entradas inválidas. */
export function parsearRss(xml: string): PostSocial[] {
  if (!xml.includes('<feed')) throw new ErrorFuente('Respuesta que no es un RSS de YouTube')
  const posts: PostSocial[] = []
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const bloque = m[1] ?? ''
    const id = etiqueta(bloque, 'yt:videoId')
    const titulo = etiqueta(bloque, 'title')
    const fecha = fechaIso(etiqueta(bloque, 'published'))
    if (!id || !ID_VIDEO.test(id) || !titulo || !fecha) continue
    const miniatura = urlHttps(atributo(bloque, 'media:thumbnail', 'url'), ['ytimg.com'])
    posts.push({
      red: 'youtube',
      id,
      // La URL se arma desde el id ya validado, no se confía en el <link>.
      url: `https://www.youtube.com/watch?v=${id}`,
      texto: limpiarTexto(titulo),
      media: { tipo: 'video', ...(miniatura ? { miniatura } : {}) },
      fecha,
    })
  }
  return posts
}

async function pedirRss(canal: string): Promise<string> {
  const url = `${URL_RSS}?channel_id=${encodeURIComponent(canal)}`
  try {
    return await (await fetchSeguro(url)).text()
  } catch (error) {
    // El 404 intermitente de YouTube suele resolverse al reintentar.
    if (error instanceof ErrorFuente && error.message === 'HTTP 404') {
      return await (await fetchSeguro(url)).text()
    }
    throw error
  }
}

export async function obtenerYoutube(
  canal: string = YOUTUBE_CHANNEL_ID,
): Promise<ResultadoAdaptador> {
  if (!ID_CANAL.test(canal)) return vacio('youtube', 'channel_id de YouTube inválido')
  try {
    const posts = parsearRss(await pedirRss(canal))
    return { red: 'youtube', origen: 'real', posts }
  } catch (error) {
    return vacio('youtube', mensajeDe(error))
  }
}
