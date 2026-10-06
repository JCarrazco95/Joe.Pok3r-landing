/**
 * Contenido curado a mano: la fuente de Instagram y TikTok, y el respaldo de
 * YouTube y Kick cuando su API falla o no hay credenciales.
 *
 * Empieza VACÍA a propósito: no se inventan publicaciones. Para agregar una,
 * pega su URL pública y su fecha de publicación (ISO, `AAAA-MM-DD`). Con eso
 * basta; `texto` y `miniatura` son opcionales (TikTok completa los suyos vía
 * oEmbed).
 *
 * Formato de URL por red:
 *   · instagram: https://www.instagram.com/p/<código>/  (o /reel/<código>/)
 *   · tiktok:    https://www.tiktok.com/@joe.pok3r/video/<id>
 *   · youtube:   https://www.youtube.com/watch?v=<id>
 *   · kick:      https://kick.com/<canal>/clips/<id>
 *
 * Las entradas con URL de otra red, sin https o con fecha inválida se
 * descartan en silencio.
 */

import type { RedFeed } from './types'

export type EntradaManual = {
  url: string
  /** Fecha de publicación, ISO. Ordena el feed. */
  fecha: string
  texto?: string
  /** URL https de una imagen de vista previa. */
  miniatura?: string
}

export const manual: Record<RedFeed, EntradaManual[]> = {
  instagram: [],
  tiktok: [],
  youtube: [],
  kick: [],
  // Sin Página de Facebook (ver facebook.ts): se queda vacía.
  facebook: [],
}
