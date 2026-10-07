/**
 * Tipos y utilidades del directo (fase 5) que se comparten entre servidor y
 * cliente. No importa nada de `lib/env` ni de `lib/social`: así el bundle del
 * navegador no arrastra credenciales ni adaptadores. La lógica que consulta a
 * Kick vive en `lib/en-vivo.ts` (solo servidor).
 */

/** Vida del estado en la CDN y en la caché de datos de Next (s). */
export const REVALIDAR_EN_VIVO_SEG = 60

/** Cada cuánto vuelve a preguntar el navegador mientras la pestaña está visible. */
export const INTERVALO_CLIENTE_MS = 60_000

/** Slug de canal de Kick tal como lo acepta `lib/social/kick.ts`. */
const SLUG = /^[A-Za-z0-9_-]{1,25}$/

/**
 * De dónde sale el estado:
 * - `real`: Kick respondió; el estado (en vivo o no) está confirmado.
 * - `manual`: lo dice el interruptor `enVivo` de `lib/joe-poker.ts`, o Kick no
 *   respondió y no hay certeza. Nunca se muestra reproductor ni espectadores.
 */
export type OrigenEnVivo = 'real' | 'manual'

export type EstadoEnVivo = {
  enVivo: boolean
  origen: OrigenEnVivo
  /** Canal de Kick. */
  slug: string
  /** Texto del directo: el título del stream (real) o el evento (manual). */
  titulo?: string
  /** Solo manual: nivel, stack, mesa. */
  detalle?: string
  /** Solo manual: enlace de la cobertura, si existe. */
  enlace?: string
  /** Solo real. */
  espectadores?: number
  /** Solo real; siempre https. */
  miniatura?: string
  /** ISO de cuándo se armó el estado. */
  actualizado: string
}

export function urlCanalKick(slug: string): string {
  return `https://kick.com/${slug}`
}

/**
 * URL del reproductor embebido de Kick. OJO: `player.kick.com` no está
 * documentado como API oficial y puede cambiar; por eso es la única función que
 * lo conoce y el visor siempre ofrece además el enlace al canal. Devuelve
 * `null` si el slug no es válido: nada externo se concatena sin comprobar.
 */
export function embedKick(slug: string): string | null {
  return SLUG.test(slug) ? `https://player.kick.com/${slug}` : null
}

export type InterruptorManual = {
  activo: boolean
  evento: string
  detalle: string
  url: string | null
}

/** Estado del interruptor manual. También es el del HTML de la página (ISR). */
export function estadoManual(
  manual: InterruptorManual,
  slug: string,
  ahora: Date = new Date(),
): EstadoEnVivo {
  return {
    enVivo: manual.activo,
    origen: 'manual',
    slug,
    ...(manual.activo && manual.evento ? { titulo: manual.evento } : {}),
    ...(manual.activo && manual.detalle ? { detalle: manual.detalle } : {}),
    ...(manual.activo && manual.url ? { enlace: manual.url } : {}),
    actualizado: ahora.toISOString(),
  }
}

const esObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const esHttps = (v: unknown): v is string => {
  if (typeof v !== 'string') return false
  try {
    return new URL(v).protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Valida la respuesta de `/api/en-vivo` en el navegador y la reconstruye campo
 * por campo (nada de pasar el objeto tal cual). Devuelve `null` si no cuadra.
 */
export function leerEstadoEnVivo(dato: unknown): EstadoEnVivo | null {
  if (!esObjeto(dato)) return null
  const { enVivo, origen, slug, titulo, detalle, enlace, espectadores, miniatura, actualizado } =
    dato
  if (typeof enVivo !== 'boolean') return null
  if (origen !== 'real' && origen !== 'manual') return null
  if (typeof slug !== 'string' || !SLUG.test(slug)) return null
  if (typeof actualizado !== 'string' || Number.isNaN(Date.parse(actualizado))) return null
  return {
    enVivo,
    origen,
    slug,
    ...(typeof titulo === 'string' && titulo ? { titulo } : {}),
    ...(typeof detalle === 'string' && detalle ? { detalle } : {}),
    ...(esHttps(enlace) ? { enlace } : {}),
    ...(typeof espectadores === 'number' && Number.isFinite(espectadores) && espectadores >= 0
      ? { espectadores }
      : {}),
    ...(esHttps(miniatura) ? { miniatura } : {}),
    actualizado,
  }
}
