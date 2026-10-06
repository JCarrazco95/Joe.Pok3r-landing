/**
 * Kick vía API pública oficial (https://docs.kick.com), con OAuth 2.1 de
 * aplicación (client credentials).
 *
 * HALLAZGO (octubre de 2026): la API pública de Kick NO tiene endpoint de clips
 * ni de VODs; solo canal, livestreams, chat, moderación y eventos. Por eso este
 * adaptador autentica y valida el canal, pero no puede producir posts
 * automáticos: los clips salen de `manual.ts` (el índice los aplica como
 * respaldo). Si Kick publica un endpoint de clips, se agrega aquí.
 *
 * El estado en vivo es de la fase 5; `obtenerCanalKick` ya trae el canal
 * validado (incluido `stream.is_live`) para que esa fase solo lo consuma.
 *
 * Sin KICK_CLIENT_ID / KICK_CLIENT_SECRET / KICK_CHANNEL_SLUG devuelve vacío sin
 * tocar la red.
 */

import { KICK_CHANNEL_SLUG, KICK_CLIENT_ID, KICK_CLIENT_SECRET } from '@/lib/env'
import {
  ErrorFuente,
  esObjeto,
  fetchSeguro,
  leerJson,
  limpiarTexto,
  mensajeDe,
  numero,
  texto,
  urlHttps,
  vacio,
} from './http'
import type { ResultadoAdaptador } from './types'

const URL_TOKEN = 'https://id.kick.com/oauth/token'
const URL_CANALES = 'https://api.kick.com/public/v1/channels'
const SLUG = /^[A-Za-z0-9_-]{1,25}$/

export type CredencialesKick = {
  clientId: string
  clientSecret: string
  slug: string
}

export type CanalKick = {
  slug: string
  titulo: string
  enVivo: boolean
  espectadores?: number
  miniatura?: string
}

const porDefecto = (): CredencialesKick => ({
  clientId: KICK_CLIENT_ID,
  clientSecret: KICK_CLIENT_SECRET,
  slug: KICK_CHANNEL_SLUG,
})

// El token dura horas; se reutiliza dentro de la misma instancia.
let tokenEnCache: { valor: string; expira: number } | null = null

/** Solo para pruebas. */
export function _reiniciarTokenKick() {
  tokenEnCache = null
}

async function obtenerToken(c: CredencialesKick): Promise<string> {
  if (tokenEnCache && tokenEnCache.expira > Date.now()) return tokenEnCache.valor
  const cuerpo = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: c.clientId,
    client_secret: c.clientSecret,
  })
  // Un token no se cachea en el Data Cache de Next: revalidate 0.
  const datos = await leerJson(
    await fetchSeguro(URL_TOKEN, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: cuerpo,
      revalidate: 0,
    }),
  )
  const valor = esObjeto(datos) ? texto(datos.access_token) : undefined
  if (!valor) throw new ErrorFuente('Kick no devolvió un token válido')
  const segundos = (esObjeto(datos) ? numero(datos.expires_in) : undefined) ?? 3600
  // Margen de 60 s para no usar un token a punto de caducar.
  tokenEnCache = { valor, expira: Date.now() + Math.max(segundos - 60, 0) * 1000 }
  return valor
}

/** Canal validado de Kick. Lanza `ErrorFuente` si algo no cuadra. */
export async function obtenerCanalKick(
  credenciales: CredencialesKick = porDefecto(),
): Promise<CanalKick> {
  const { clientId, clientSecret, slug } = credenciales
  if (!clientId || !clientSecret || !slug) throw new ErrorFuente('Kick sin credenciales o canal')
  if (!SLUG.test(slug)) throw new ErrorFuente('Slug de canal de Kick inválido')

  const token = await obtenerToken(credenciales)
  const datos = await leerJson(
    await fetchSeguro(`${URL_CANALES}?slug=${encodeURIComponent(slug)}`, {
      headers: { authorization: `Bearer ${token}` },
    }),
  )
  const lista = esObjeto(datos) && Array.isArray(datos.data) ? datos.data : undefined
  const canal: unknown = lista?.[0]
  if (!esObjeto(canal)) throw new ErrorFuente('Kick no devolvió el canal')

  const stream = esObjeto(canal.stream) ? canal.stream : undefined
  const espectadores = stream ? numero(stream.viewer_count) : undefined
  const miniatura = urlHttps(stream?.thumbnail) ?? urlHttps(canal.banner_picture)
  return {
    slug: texto(canal.slug) ?? slug,
    titulo: limpiarTexto(texto(canal.stream_title) ?? ''),
    enVivo: stream?.is_live === true,
    ...(espectadores !== undefined ? { espectadores } : {}),
    ...(miniatura ? { miniatura } : {}),
  }
}

export async function obtenerKick(
  credenciales: CredencialesKick = porDefecto(),
): Promise<ResultadoAdaptador> {
  const { clientId, clientSecret, slug } = credenciales
  if (!clientId || !clientSecret || !slug) return vacio('kick', 'Kick sin credenciales o canal')
  try {
    await obtenerCanalKick(credenciales)
    // Canal OK, pero la API pública no expone clips: el índice usa el manual.
    return {
      red: 'kick',
      origen: 'real',
      posts: [],
      motivo: 'La API pública de Kick no expone clips',
    }
  } catch (error) {
    return vacio('kick', mensajeDe(error))
  }
}
