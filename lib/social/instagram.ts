/**
 * Instagram: embeds curados a mano (decisión del PLAN). La cuenta es Creator y
 * no hay Página de Facebook; la Graph API de Instagram con Facebook Login exige
 * una Página ligada.
 *
 * Camino por defecto: lee las URLs de `manual.ts` y las entrega como posts de
 * tipo `embed` (la UI carga el embed oficial bajo demanda, fase 4).
 *
 * Camino automático (Graph API): YA ESCRITO pero APAGADO. Se enciende solo con
 * INSTAGRAM_AUTO=true y un INSTAGRAM_ACCESS_TOKEN válido (ver `.env.example`).
 * Si falla, cae al manual. El token caduca a los 60 días: ver
 * `refrescarTokenInstagram`.
 */

import { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_AUTO } from '@/lib/env'
import {
  ErrorFuente,
  esObjeto,
  fechaIso,
  fetchSeguro,
  leerJson,
  limpiarTexto,
  mensajeDe,
  numero,
  texto,
  urlHttps,
} from './http'
import { postsManuales } from './manual-posts'
import type { PostSocial, ResultadoAdaptador } from './types'

const URL_MEDIA = 'https://graph.instagram.com/me/media'
const URL_REFRESCO = 'https://graph.instagram.com/refresh_access_token'
const HOSTS = ['instagram.com', 'cdninstagram.com', 'fbcdn.net']

/** Convierte la respuesta de `/me/media` en posts, descartando lo inválido. */
export function parsearMediaInstagram(datos: unknown): PostSocial[] {
  const lista = esObjeto(datos) && Array.isArray(datos.data) ? datos.data : undefined
  if (!lista) throw new ErrorFuente('Respuesta de Instagram con forma inesperada')
  const posts: PostSocial[] = []
  for (const item of lista as unknown[]) {
    if (!esObjeto(item)) continue
    const id = texto(item.id)
    const url = urlHttps(item.permalink, ['instagram.com'])
    const fecha = fechaIso(item.timestamp)
    if (!id || !url || !fecha) continue
    const tipo = texto(item.media_type)
    const miniatura = urlHttps(tipo === 'VIDEO' ? item.thumbnail_url : item.media_url, HOSTS)
    const likes = numero(item.like_count)
    const comentarios = numero(item.comments_count)
    posts.push({
      red: 'instagram',
      id,
      url,
      texto: limpiarTexto(texto(item.caption) ?? ''),
      media: { tipo: tipo === 'VIDEO' ? 'video' : 'imagen', ...(miniatura ? { miniatura } : {}) },
      fecha,
      ...(likes !== undefined || comentarios !== undefined
        ? {
            metricas: {
              ...(likes !== undefined ? { likes } : {}),
              ...(comentarios !== undefined ? { comentarios } : {}),
            },
          }
        : {}),
    })
  }
  return posts
}

/** Camino automático. Lanza `ErrorFuente`; el llamador decide el fallback. */
export async function obtenerInstagramGraph(token: string): Promise<PostSocial[]> {
  const campos = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'
  // La Graph API pide el token en la query; no se registra en ningún log.
  const url = `${URL_MEDIA}?fields=${campos}&limit=12&access_token=${encodeURIComponent(token)}`
  return parsearMediaInstagram(await leerJson(await fetchSeguro(url)))
}

export type TokenRefrescado = {
  token: string
  /** Segundos de vida del token nuevo (~60 días). */
  expiraEnSeg: number
}

/**
 * Refresca un token de larga duración de Instagram (vale 60 días y solo se
 * puede refrescar si tiene más de 24 h y no ha caducado).
 *
 * AISLADA: nada la llama automáticamente. Un route handler no puede reescribir
 * las variables de entorno de Vercel, así que el flujo es:
 *   1. Cada ~50 días, ejecutar esta función (cron, script o REPL).
 *   2. Copiar `token` a INSTAGRAM_ACCESS_TOKEN en Vercel y redesplegar.
 * Mientras INSTAGRAM_AUTO esté apagado, no hace falta.
 */
export async function refrescarTokenInstagram(tokenActual: string): Promise<TokenRefrescado> {
  if (!tokenActual) throw new ErrorFuente('Falta el token de Instagram')
  const url = `${URL_REFRESCO}?grant_type=ig_refresh_token&access_token=${encodeURIComponent(tokenActual)}`
  // Sin caché: es una operación con efecto (extiende la vida del token).
  const datos = await leerJson(await fetchSeguro(url, { revalidate: 0 }))
  const token = esObjeto(datos) ? texto(datos.access_token) : undefined
  const expiraEnSeg = esObjeto(datos) ? numero(datos.expires_in) : undefined
  if (!token || expiraEnSeg === undefined) {
    throw new ErrorFuente('Instagram no devolvió un token refrescado válido')
  }
  return { token, expiraEnSeg }
}

export async function obtenerInstagram(
  auto: boolean = INSTAGRAM_AUTO,
  token: string = INSTAGRAM_ACCESS_TOKEN,
): Promise<ResultadoAdaptador> {
  let motivo: string | undefined
  if (auto && token) {
    try {
      const posts = await obtenerInstagramGraph(token)
      return { red: 'instagram', origen: 'real', posts }
    } catch (error) {
      motivo = mensajeDe(error)
    }
  }
  const posts = postsManuales('instagram')
  return {
    red: 'instagram',
    origen: posts.length > 0 ? 'manual' : 'vacio',
    posts,
    ...(motivo ? { motivo } : {}),
  }
}
