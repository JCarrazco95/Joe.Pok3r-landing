import { fechaIso, limpiarTexto, urlHttps } from './http'
import { manual, type EntradaManual } from './manual'
import type { PostSocial, RedFeed } from './types'

/** Hosts válidos por red para las URLs. */
export const HOSTS: Record<RedFeed, readonly string[]> = {
  instagram: ['instagram.com'],
  tiktok: ['tiktok.com'],
  youtube: ['youtube.com', 'youtu.be'],
  kick: ['kick.com'],
  facebook: ['facebook.com'],
}

const TIPO_MEDIA: Record<RedFeed, 'embed' | 'video'> = {
  instagram: 'embed',
  tiktok: 'embed',
  youtube: 'video',
  kick: 'video',
  facebook: 'embed',
}

/** El id es el path de la URL: estable y único dentro de la red. */
export function idDeUrl(url: string): string {
  const u = new URL(url)
  return `${u.pathname}${u.search}`.replace(/^\/+|\/+$/g, '') || u.hostname
}

/** Convierte una entrada curada en post; `undefined` si es inválida. */
export function postDeEntrada(red: RedFeed, entrada: EntradaManual): PostSocial | undefined {
  const url = urlHttps(entrada.url, HOSTS[red])
  const fecha = fechaIso(entrada.fecha)
  if (!url || !fecha) return undefined
  const miniatura = urlHttps(entrada.miniatura)
  return {
    red,
    id: idDeUrl(url),
    url,
    texto: limpiarTexto(entrada.texto ?? ''),
    media: { tipo: TIPO_MEDIA[red], ...(miniatura ? { miniatura } : {}) },
    fecha,
  }
}

/** La lista curada de una red como `PostSocial[]`, sin las entradas inválidas. */
export function postsManuales(red: RedFeed): PostSocial[] {
  return manual[red].flatMap((e) => postDeEntrada(red, e) ?? [])
}
