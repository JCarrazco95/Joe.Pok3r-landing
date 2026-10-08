/**
 * Estado en vivo (fase 5): Kick manda; el interruptor manual de `enVivo`
 * (lib/joe-poker.ts) cubre los directos que no pasan por Kick y el caso de que
 * Kick no responda.
 *
 * Precedencia:
 *   1. Kick confirma directo         → `real`, en vivo.
 *   2. Interruptor manual activo     → `manual`, en vivo (p. ej. juega el WSOP y
 *      no transmite por Kick). Sin reproductor ni espectadores.
 *   3. Kick respondió y está apagado → `real`, apagado.
 *   4. Kick falló o no hay credenciales → `manual`, apagado: no hay certeza.
 *
 * Garantía: `obtenerEstadoEnVivo` nunca lanza.
 */

import {
  EN_VIVO_SIMULADO,
  KICK_CHANNEL_SLUG,
  KICK_CLIENT_ID,
  KICK_CLIENT_SECRET,
} from '@/lib/env'
import { enVivo as interruptorManual } from '@/lib/joe-poker'
import { obtenerCanalKick, type CanalKick } from '@/lib/social/kick'

import {
  estadoManual,
  REVALIDAR_EN_VIVO_SEG,
  type EstadoEnVivo,
  type InterruptorManual,
} from './directo'

export type DependenciasEnVivo = {
  /** Consulta a Kick; lanza si no puede confirmar el estado. */
  obtenerCanal: () => Promise<CanalKick>
  manual: InterruptorManual
  slug: string
  simulado: string
  /** `NODE_ENV`: con `production` el simulador no se obedece. */
  entorno: string | undefined
  ahora: () => Date
}

const porDefecto = (): DependenciasEnVivo => ({
  obtenerCanal: () =>
    obtenerCanalKick(
      { clientId: KICK_CLIENT_ID, clientSecret: KICK_CLIENT_SECRET, slug: KICK_CHANNEL_SLUG },
      REVALIDAR_EN_VIVO_SEG,
    ),
  manual: interruptorManual,
  slug: KICK_CHANNEL_SLUG,
  simulado: EN_VIVO_SIMULADO,
  entorno: process.env.NODE_ENV,
  ahora: () => new Date(),
})

/** Estado de mentira para probar la UI en local. Nunca se usa en producción. */
function simular(modo: string, slug: string, ahora: Date): EstadoEnVivo | null {
  if (modo === 'en-vivo') {
    return {
      enVivo: true,
      origen: 'real',
      slug,
      titulo: 'Directo de prueba · torneo simulado',
      espectadores: 128,
      actualizado: ahora.toISOString(),
    }
  }
  if (modo === 'apagado') {
    return { enVivo: false, origen: 'real', slug, actualizado: ahora.toISOString() }
  }
  return null
}

export async function obtenerEstadoEnVivo(
  deps: Partial<DependenciasEnVivo> = {},
): Promise<EstadoEnVivo> {
  const d = { ...porDefecto(), ...deps }
  const ahora = d.ahora()

  if (d.entorno !== 'production') {
    const simulado = simular(d.simulado, d.slug, ahora)
    if (simulado) return simulado
  }

  const manual = estadoManual(d.manual, d.slug, ahora)

  let canal: CanalKick
  try {
    canal = await d.obtenerCanal()
  } catch {
    // Sin certeza: queda lo que diga el interruptor, marcado como manual.
    return manual
  }

  if (canal.enVivo) {
    return {
      enVivo: true,
      origen: 'real',
      slug: canal.slug,
      ...(canal.titulo ? { titulo: canal.titulo } : {}),
      ...(canal.espectadores !== undefined ? { espectadores: canal.espectadores } : {}),
      ...(canal.miniatura ? { miniatura: canal.miniatura } : {}),
      actualizado: ahora.toISOString(),
    }
  }

  if (manual.enVivo) return manual
  return { enVivo: false, origen: 'real', slug: canal.slug, actualizado: ahora.toISOString() }
}
