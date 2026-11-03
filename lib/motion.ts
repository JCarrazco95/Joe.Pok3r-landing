'use client'

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

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

/**
 * ¿Se ve el elemento? Un IntersectionObserver sobre `ref`, con el umbral dado.
 * En el servidor y antes de montar devuelve `false`.
 */
export function useEnPantalla(ref: RefObject<Element | null>, umbral = 0.25): boolean {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), {
      threshold: umbral,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, umbral])
  return visible
}

/** Puntero fino (mouse) vs. táctil: el cursor y el magnetismo sólo van con fino. */
export function usePunteroFino(): boolean {
  return useMedia(FINO)
}
