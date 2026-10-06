'use client'

import { useSyncExternalStore } from 'react'

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
