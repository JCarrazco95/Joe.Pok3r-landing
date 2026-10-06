import { NextResponse } from 'next/server'
import { obtenerFeed } from '@/lib/social'
import type { RespuestaSocial } from '@/lib/social/types'

/**
 * Feed social agregado (YouTube, Kick, Instagram, TikTok, Facebook).
 *
 * ISR: Next regenera la respuesta como máximo cada 30 min. Debe ser un literal
 * (Next no acepta una constante importada) y coincidir con `REVALIDAR_SEG` de
 * `lib/social/config.ts`; `route.test.ts` lo comprueba.
 */
export const revalidate = 1800

/**
 * La CDN sirve la copia 30 min y, si está vencida, la entrega igual mientras
 * regenera (hasta 1 h): el visitante nunca espera a las APIs de las redes.
 */
const CACHE_CONTROL = 'public, s-maxage=1800, stale-while-revalidate=3600'

export async function GET(): Promise<NextResponse<RespuestaSocial>> {
  const feed = await obtenerFeed()
  return NextResponse.json(feed, { headers: { 'Cache-Control': CACHE_CONTROL } })
}
