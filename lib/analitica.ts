import { track } from '@vercel/analytics'

import { enlaces } from '@/lib/joe-poker'

/**
 * Eventos de analítica (Vercel Analytics). Son pocos y a propósito: lo que
 * Joe necesita para saber qué le sirve a la página. No llevan datos personales
 * ni identificadores: sólo el nombre de la red.
 *
 * Vercel Analytics no usa cookies ni guarda IP, así que no hace falta banner.
 * `track` no hace nada fuera de Vercel (local, `next start` sin la variable de
 * entorno de Analytics), por lo que es seguro llamarlo siempre.
 */
export type EventoAnalitica =
  /** Clic en un enlace a una red o perfil de Joe. `red` = id en `enlaces`. */
  | { nombre: 'clic_red'; red: string }
  /** Apertura del visor de un post del feed. `red` = instagram, youtube… */
  | { nombre: 'abrir_post'; red: string }
  /** Carga del reproductor (iframe) de Kick, siempre por clic del visitante. */
  | { nombre: 'cargar_kick' }

export function registrar(evento: EventoAnalitica): void {
  const { nombre, ...props } = evento
  try {
    track(nombre, props as Record<string, string>)
  } catch {
    // La analítica nunca debe romper la página.
  }
}

/** Perfiles externos de `enlaces` (https) y su id, para reconocerlos al hacer clic. */
const PERFILES = enlaces.flatMap((e) =>
  e.url?.startsWith('https://') ? [{ id: e.id, url: e.url.replace(/\/$/, '') }] : [],
)

/** ¿A qué red apunta esta URL? `null` si no es un perfil de `enlaces`. */
export function redDeUrl(href: string): string | null {
  const limpia = href.replace(/\/$/, '')
  return PERFILES.find((p) => limpia === p.url || limpia.startsWith(`${p.url}/`))?.id ?? null
}
