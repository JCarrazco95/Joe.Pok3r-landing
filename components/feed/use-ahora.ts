'use client'

import { useSyncExternalStore } from 'react'

const sinSuscripcion = () => () => {}

/**
 * El "ahora" para las fechas relativas, redondeado al minuto.
 *
 * En el servidor (y al hidratar) es `null`: la página es ISR y su HTML puede
 * tener horas, así que "hace 5 min" pintado allí mentiría. Con `null` se
 * muestra la fecha absoluta y el cliente la sustituye por la relativa.
 */
export function useAhora(): number | null {
  return useSyncExternalStore(
    sinSuscripcion,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => null,
  )
}
