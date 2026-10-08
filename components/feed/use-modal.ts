'use client'

import { useEffect, useRef, type RefObject } from 'react'

const FOCALIZABLES = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

/**
 * Comportamiento de un modal accesible sobre el `panel` (que debe llevar
 * `tabIndex={-1}`), compartido por el visor de posts y el del directo:
 *
 * - Foco: entra al panel, Tab y Shift+Tab no salen de él y al cerrar vuelve a
 *   quien lo abrió. Escape cierra.
 * - Scroll del <body> bloqueado mientras está abierto.
 *
 * Con el foco dentro de un iframe el teclado es del iframe y Escape no llega
 * aquí; por eso el botón de cerrar debe ser siempre alcanzable.
 */
export function useModal(panel: RefObject<HTMLDivElement | null>, onCerrar: () => void) {
  const cerrar = useRef(onCerrar)
  useEffect(() => {
    cerrar.current = onCerrar
  })

  useEffect(() => {
    const previo = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        cerrar.current()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCALIZABLES)]
      const primero = items[0]
      const ultimo = items[items.length - 1]
      if (!primero || !ultimo) return
      const activo = document.activeElement
      if (e.shiftKey && (activo === primero || activo === panel.current)) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && activo === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    // Red de seguridad: si el foco sale del panel (p. ej. al tabular fuera de un
    // iframe, donde el teclado no pasa por aquí) se devuelve al panel.
    const onFocusIn = (e: FocusEvent) => {
      if (panel.current && e.target instanceof Node && !panel.current.contains(e.target)) {
        panel.current.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocusIn)
      document.body.style.overflow = overflow
      previo?.focus({ preventScroll: true })
    }
  }, [panel])
}
