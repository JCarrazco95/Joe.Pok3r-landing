import type { RedSocial } from '@/lib/joe-poker'
import { REDES_FEED, type PostSocial, type RedFeed } from '@/lib/social/types'

/** Nombre de cara al visitante. */
export const NOMBRE_RED: Record<RedFeed, string> = {
  youtube: 'YouTube',
  kick: 'Kick',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
}

/** Facebook no tiene glifo propio: nunca trae posts, así que no se llega a ver. */
export const ICONO_RED: Record<RedFeed, RedSocial> = {
  youtube: 'youtube',
  kick: 'kick',
  instagram: 'instagram',
  tiktok: 'tiktok',
  facebook: 'web',
}

export type RedConTotal = { red: RedFeed; total: number }

/** Redes que sí tienen posts, en el orden fijo de `REDES_FEED`. */
export function redesConPosts(posts: readonly PostSocial[]): RedConTotal[] {
  return REDES_FEED.flatMap((red) => {
    const total = posts.filter((p) => p.red === red).length
    return total > 0 ? [{ red, total }] : []
  })
}

export type EmbedPost = {
  src: string
  /** Los verticales (Instagram, TikTok) piden un marco alto; YouTube, 16:9. */
  vertical: boolean
}

const ES_YOUTUBE = new Set(['www.youtube.com', 'youtube.com'])
const ES_INSTAGRAM = new Set(['www.instagram.com', 'instagram.com'])
const ES_TIKTOK = new Set(['www.tiktok.com', 'tiktok.com'])

/**
 * URL del embed oficial, armada desde la URL pública del post y con el id ya
 * validado: nada de lo que viene de fuera se concatena sin comprobar. Son los
 * `<iframe>` de cada red, no sus scripts `embed.js`, así que la página no
 * ejecuta código de terceros. Devuelve `null` si la red no tiene embed (Kick)
 * o la URL no tiene la forma esperada; el visor cae entonces a vista previa y
 * enlace.
 */
export function embedDe(post: Pick<PostSocial, 'red' | 'url'>): EmbedPost | null {
  let u: URL
  try {
    u = new URL(post.url)
  } catch {
    return null
  }
  if (u.protocol !== 'https:') return null

  if (post.red === 'youtube' && ES_YOUTUBE.has(u.hostname) && u.pathname === '/watch') {
    const id = u.searchParams.get('v')
    if (!id || !/^[\w-]{11}$/.test(id)) return null
    return { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, vertical: false }
  }

  if (post.red === 'instagram' && ES_INSTAGRAM.has(u.hostname)) {
    const m = /^\/(p|reel|tv)\/([\w-]+)\/?$/.exec(u.pathname)
    return m ? { src: `https://www.instagram.com/${m[1]}/${m[2]}/embed`, vertical: true } : null
  }

  if (post.red === 'tiktok' && ES_TIKTOK.has(u.hostname)) {
    const m = /^\/@[\w.-]+\/video\/(\d{5,25})\/?$/.exec(u.pathname)
    return m ? { src: `https://www.tiktok.com/embed/v2/${m[1]}`, vertical: true } : null
  }

  return null
}
