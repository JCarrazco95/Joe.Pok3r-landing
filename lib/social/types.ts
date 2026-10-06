/**
 * Contrato común de los feeds sociales.
 *
 * Cada red tiene su adaptador, pero la UI solo conoce estos tipos: nunca la API
 * de una red concreta.
 */

/** Redes con adaptador. `facebook` existe en el tipo pero está apagada. */
export type RedFeed = 'youtube' | 'kick' | 'instagram' | 'tiktok' | 'facebook'

export const REDES_FEED: readonly RedFeed[] = [
  'youtube',
  'kick',
  'instagram',
  'tiktok',
  'facebook',
]

export type MediaSocial = {
  /** `embed` = la UI debe cargar el embed oficial de la red bajo demanda. */
  tipo: 'imagen' | 'video' | 'embed'
  /** Vista previa. Siempre una URL https; si no se pudo validar, se omite. */
  miniatura?: string
}

export type MetricasSocial = {
  vistas?: number
  likes?: number
  comentarios?: number
}

export type PostSocial = {
  red: RedFeed
  /** Estable dentro de la red; junto con `red` identifica el post. */
  id: string
  /** URL pública del post en la red (https). */
  url: string
  /**
   * Texto o título. Viene de fuera: es NO confiable. Ya va limpio de caracteres
   * de control y truncado, pero la UI debe pintarlo como texto, nunca como HTML.
   */
  texto: string
  media: MediaSocial | null
  /** ISO 8601 (UTC). Es lo que ordena el feed. */
  fecha: string
  /** Opcional: no todas las redes dan métricas (el RSS de YouTube no). */
  metricas?: MetricasSocial
}

/**
 * De dónde salieron los posts de una red:
 * - `real`: la API respondió y los datos son frescos.
 * - `manual`: contenido curado a mano en `manual.ts` (fallback o por diseño).
 * - `vacio`: no hay nada que mostrar de esta red.
 */
export type OrigenFuente = 'real' | 'manual' | 'vacio'

/** Lo que devuelve cada adaptador. Nunca lanza: los fallos viajan en `motivo`. */
export type ResultadoAdaptador = {
  red: RedFeed
  origen: OrigenFuente
  posts: PostSocial[]
  /** Por qué no hay datos reales (sin credenciales, HTTP 500, timeout…). */
  motivo?: string
}

export type Adaptador = () => Promise<ResultadoAdaptador>

/** Estado de una fuente tal como lo ve la UI. */
export type EstadoFuente = {
  red: RedFeed
  origen: OrigenFuente
  /** Cantidad de posts de esta red que entraron al feed. */
  total: number
  motivo?: string
}

/** Respuesta de `GET /api/social`. */
export type RespuestaSocial = {
  posts: PostSocial[]
  fuentes: EstadoFuente[]
  /** ISO de cuándo se armó el feed. */
  generado: string
}
