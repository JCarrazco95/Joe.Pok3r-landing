/**
 * Agregador del feed social: ejecuta los adaptadores en paralelo, aplica el
 * fallback manual por red, ordena por fecha y reporta el estado de cada fuente.
 *
 * Garantía: `obtenerFeed` nunca lanza. Un adaptador roto o ausente solo deja su
 * red sin datos reales; no afecta a las demás ni a la página.
 */

import { obtenerFacebook } from './facebook'
import { mensajeDe } from './http'
import { obtenerInstagram } from './instagram'
import { obtenerKick } from './kick'
import { postsManuales } from './manual-posts'
import { obtenerTiktok } from './tiktok'
import {
  REDES_FEED,
  type Adaptador,
  type EstadoFuente,
  type PostSocial,
  type RedFeed,
  type RespuestaSocial,
  type ResultadoAdaptador,
} from './types'
import { obtenerYoutube } from './youtube'

/** Máximo de posts que aporta cada red (los más recientes). */
export const MAX_POSTS_POR_RED = 6
/** Máximo de posts en el feed completo. */
export const MAX_POSTS_TOTAL = 24

export const ADAPTADORES: Record<RedFeed, Adaptador> = {
  youtube: () => obtenerYoutube(),
  kick: () => obtenerKick(),
  instagram: () => obtenerInstagram(),
  tiktok: () => obtenerTiktok(),
  facebook: () => obtenerFacebook(),
}

const masReciente = (a: PostSocial, b: PostSocial) => b.fecha.localeCompare(a.fecha)

/** Si la red quedó sin posts, usa su lista curada; si tampoco hay, queda vacía. */
function conRespaldo(red: RedFeed, resultado: ResultadoAdaptador): ResultadoAdaptador {
  if (resultado.posts.length > 0) return resultado
  const respaldo = postsManuales(red)
  if (respaldo.length === 0) {
    // "real" sin posts ni respaldo es, para la UI, una red vacía.
    return { ...resultado, origen: 'vacio' }
  }
  return { ...resultado, origen: 'manual', posts: respaldo }
}

export async function obtenerFeed(
  adaptadores: Record<RedFeed, Adaptador> = ADAPTADORES,
): Promise<RespuestaSocial> {
  const resultados = await Promise.allSettled(REDES_FEED.map((red) => adaptadores[red]()))

  const porRed = resultados.map((r, i): ResultadoAdaptador => {
    const red = REDES_FEED[i] as RedFeed
    const base: ResultadoAdaptador =
      r.status === 'fulfilled'
        ? r.value
        : { red, origen: 'vacio', posts: [], motivo: mensajeDe(r.reason) }
    // La red de un resultado la fija el índice, no lo que diga el adaptador.
    return conRespaldo(red, { ...base, red })
  })

  const vistos = new Set<string>()
  const posts: PostSocial[] = []
  const fuentes: EstadoFuente[] = []

  for (const r of porRed) {
    const elegidos = r.posts
      .filter((p) => {
        const clave = `${p.red}:${p.id}`
        if (p.red !== r.red || vistos.has(clave)) return false
        vistos.add(clave)
        return true
      })
      .sort(masReciente)
      .slice(0, MAX_POSTS_POR_RED)
    posts.push(...elegidos)
    fuentes.push({
      red: r.red,
      origen: elegidos.length > 0 ? r.origen : 'vacio',
      total: elegidos.length,
      ...(r.motivo ? { motivo: r.motivo } : {}),
    })
  }

  return {
    posts: posts.sort(masReciente).slice(0, MAX_POSTS_TOTAL),
    fuentes,
    generado: new Date().toISOString(),
  }
}

export type { PostSocial, RespuestaSocial } from './types'
