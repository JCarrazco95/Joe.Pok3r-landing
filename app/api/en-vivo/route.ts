import { NextResponse } from 'next/server'

import type { EstadoEnVivo } from '@/lib/directo'
import { obtenerEstadoEnVivo } from '@/lib/en-vivo'

/**
 * Estado en vivo de Kick con el interruptor manual de respaldo.
 *
 * Caduca a los 60 s: la página es ISR de 30 min y no puede decir si Joe está en
 * directo, así que el navegador pregunta aquí. Debe ser un literal (Next no
 * acepta una constante importada) y coincidir con `REVALIDAR_EN_VIVO_SEG` de
 * `lib/directo.ts`; `lib/directo.test.ts` lo comprueba.
 */
export const revalidate = 60

/**
 * La CDN sirve la copia 60 s y, vencida, la entrega igual mientras regenera
 * (hasta 2 min): los visitantes comparten una sola consulta a Kick por minuto
 * y nadie espera a su API.
 */
const CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=120'

export async function GET(): Promise<NextResponse<EstadoEnVivo>> {
  const estado = await obtenerEstadoEnVivo()
  return NextResponse.json(estado, { headers: { 'Cache-Control': CACHE_CONTROL } })
}
