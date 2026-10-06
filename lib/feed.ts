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
