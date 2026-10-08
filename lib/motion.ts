'use client'

import { useSyncExternalStore } from 'react'

/**
 * Tokens de movimiento para lo que se anima desde JS. Sus gemelos en CSS viven
 * en `@theme` (`--ease-out`, `--duration-*` en globals.css); si cambia uno,
 * cambia el otro. Sólo se animan `transform` y `opacity`: nada que dispare layout.
 */
export const MOVIMIENTO = {
  /** Hover y foco: respuesta inmediata. */
  rapido: 200,
  /** Tarjetas, giros y zoom de fotos. */
  medio: 600,
  /** Revelado al scroll y entrada de secciones. */
  lento: 900,
  /** Magnetismo: radio de captura (px) y fracción del desplazamiento que sigue. */
  magnetoRadio: 90,
  magnetoFuerza: 0.3,
} as const

const REDUCIR = '(prefers-reduced-motion: reduce)'
const FINO = '(pointer: fine)'

function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * ¿Pidió el usuario menos movimiento? En el servidor devuelve `false`; el
 * cliente corrige tras hidratar. Apaga intro, cursor, tilt, magnetismo,
 * marquesinas y el 3D en movimiento.
 */
export function useReduceMotion(): boolean {
  return useMedia(REDUCIR)
}

/** Puntero fino (mouse) vs. táctil: el cursor y el magnetismo sólo van con fino. */
export function usePunteroFino(): boolean {
  return useMedia(FINO)
}
