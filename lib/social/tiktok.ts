/**
 * TikTok: oEmbed oficial (https://www.tiktok.com/oembed?url=…) sobre la lista
 * curada de `manual.ts`. La Display API exige revisión de app, así que no se
 * usa (decisión del PLAN).
 *
 * El oEmbed completa título y miniatura de cada URL curada. Si falla para una,
 * el post se entrega igual con lo que dice `manual.ts` (la URL y la fecha son
 * suficientes para el embed): un oEmbed caído no vacía la lista.
 *
 * Los posts salen siempre con origen `manual`: la lista es curada, el oEmbed
 * solo la enriquece.
 */

import {
  esObjeto,
  fetchSeguro,
  leerJson,
  limpiarTexto,
  mensajeDe,
  texto,
  urlHttps,
} from './http'
import { postsManuales } from './manual-posts'
import type { PostSocial, ResultadoAdaptador } from './types'

const URL_OEMBED = 'https://www.tiktok.com/oembed'
/** Tope de llamadas oEmbed por revalidación. */
const MAX_OEMBED = 12

async function enriquecer(post: PostSocial): Promise<{ post: PostSocial; motivo?: string }> {
  try {
    const datos = await leerJson(await fetchSeguro(`${URL_OEMBED}?url=${encodeURIComponent(post.url)}`))
    if (!esObjeto(datos)) return { post, motivo: 'oEmbed de TikTok con forma inesperada' }
    const titulo = texto(datos.title)
    const miniatura = urlHttps(datos.thumbnail_url)
    return {
      post: {
        ...post,
        texto: post.texto || (titulo ? limpiarTexto(titulo) : ''),
        media: {
          tipo: 'embed',
          ...((post.media?.miniatura ?? miniatura)
            ? { miniatura: post.media?.miniatura ?? miniatura }
            : {}),
        },
      },
    }
  } catch (error) {
    return { post, motivo: mensajeDe(error) }
  }
}

export async function obtenerTiktok(): Promise<ResultadoAdaptador> {
  const base = postsManuales('tiktok')
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, MAX_OEMBED)
  if (base.length === 0) return { red: 'tiktok', origen: 'vacio', posts: [] }

  const resultados = await Promise.all(base.map(enriquecer))
  const fallos = resultados.filter((r) => r.motivo)
  return {
    red: 'tiktok',
    origen: 'manual',
    posts: resultados.map((r) => r.post),
    ...(fallos.length > 0
      ? { motivo: `oEmbed falló en ${fallos.length} de ${resultados.length}: ${fallos[0]?.motivo}` }
      : {}),
  }
}
