import { REDES_FEED, type EstadoFuente, type PostSocial, type RedFeed } from '@/lib/social/types'

/**
 * DATOS DE EJEMPLO para probar el muro (0, 1 y 30 posts). Son inventados y sólo
 * los importa `/design`: nunca van a la página pública ni a `manual.ts`.
 */

const REDES_CON_POSTS = REDES_FEED.filter((r) => r !== 'facebook')

/** Cada red con una URL que respeta la forma real, para ejercitar los embeds. */
const URL_DE: Record<RedFeed, (n: number) => string> = {
  youtube: (n) => `https://www.youtube.com/watch?v=EJEMPLO${String(n).padStart(4, '0')}`,
  instagram: (n) => `https://www.instagram.com/p/EJEMPLO${n}/`,
  tiktok: (n) => `https://www.tiktok.com/@joe.pok3r/video/73000000000000${String(n).padStart(5, '0')}`,
  kick: (n) => `https://kick.com/joe-pok3r/clips/ejemplo_${n}`,
  facebook: (n) => `https://www.facebook.com/ejemplo/posts/${n}`,
}

const COLOR_DE: Record<RedFeed, string> = {
  youtube: '#7c3aed',
  instagram: '#d6334b',
  tiktok: '#3b6fe0',
  kick: '#c2410c',
  facebook: '#3f3f46',
}

/** Textos de largo y carácter distintos, incluido uno que intenta ser HTML. */
const TEXTOS = [
  'Final table en el Main Event: así jugué la mano clave',
  'Día 2 completado, seguimos en pie',
  'Bad beat de la semana. Sí, otra vez.',
  '',
  'Un título larguísimo para comprobar que la tarjeta lo trunca a tres líneas y no deforma la rejilla ni empuja a sus vecinas hacia abajo, aunque siga y siga y siga',
  '<img src=x onerror=alert(1)> <b>texto no confiable</b>: debe verse literal',
  'Palabraexcesivamentelargasinespaciosparaverificarquenorompaellayoutdelatarjetaniseescapedelcontenedor',
  'Clip: all-in con J♠ T♠',
]

/** Miniatura inline (SVG): sin red, para ver tarjetas con imagen sin pedirla a nadie. */
function miniatura(red: RedFeed, n: number): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">` +
    `<rect width="320" height="180" fill="${COLOR_DE[red]}"/>` +
    `<text x="160" y="105" font-family="Arial" font-size="48" font-weight="700" fill="white" fill-opacity=".85" text-anchor="middle">${n}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const BASE = Date.parse('2026-10-01T12:00:00Z')

export function postsDeEjemplo(cantidad: number): PostSocial[] {
  return Array.from({ length: cantidad }, (_, i): PostSocial => {
    const red = REDES_CON_POSTS[i % REDES_CON_POSTS.length] ?? 'youtube'
    const n = i + 1
    return {
      red,
      id: `ejemplo-${n}`,
      url: URL_DE[red](n),
      texto: TEXTOS[i % TEXTOS.length] ?? '',
      // Cada 4.º post sin miniatura, para ver el respaldo con el ícono.
      media: {
        tipo: red === 'instagram' ? 'imagen' : red === 'tiktok' ? 'embed' : 'video',
        ...(i % 4 === 3 ? {} : { miniatura: miniatura(red, n) }),
      },
      fecha: new Date(BASE - i * 7 * 3_600_000).toISOString(),
      // YouTube no trae métricas: se ve la tarjeta sin ellas.
      ...(red === 'youtube'
        ? {}
        : { metricas: { vistas: 900 * n * n, ...(n % 2 ? { likes: 40 * n, comentarios: 3 * n } : {}) } }),
    }
  })
}

/** Kick figura como respaldo manual para ver el indicador «Selección». */
export function fuentesDeEjemplo(posts: PostSocial[]): EstadoFuente[] {
  return REDES_FEED.map((red) => {
    const total = posts.filter((p) => p.red === red).length
    return { red, total, origen: total === 0 ? 'vacio' : red === 'kick' ? 'manual' : 'real' }
  })
}
