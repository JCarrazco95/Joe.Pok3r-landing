'use client'

import { useEffect } from 'react'

import { MOVIMIENTO, usePunteroFino, useReduceMotion } from '@/lib/motion'

/**
 * Efecto magnético global: los elementos con `data-magnet` (los `Boton` con la
 * prop `magnetico`) se arrastran un poco hacia el puntero cuando éste se acerca,
 * y vuelven a su sitio al alejarse.
 *
 * Un solo listener en el documento, no uno por botón. Sólo escribe la propiedad
 * `translate` (no pisa el `transform` de nadie) y no toca el layout. Se apaga
 * con `prefers-reduced-motion` y en táctil, donde no hay puntero que seguir.
 */
export function EfectoMagnetico() {
  const reducir = useReduceMotion()
  const fino = usePunteroFino()

  useEffect(() => {
    if (reducir || !fino) return

    const { magnetoRadio: radio, magnetoFuerza: fuerza } = MOVIMIENTO
    let activo: HTMLElement | null = null
    let raf = 0
    let x = 0
    let y = 0

    const soltar = () => {
      if (!activo) return
      activo.style.translate = ''
      activo.style.transition = ''
      activo = null
    }

    const pintar = () => {
      raf = 0
      const candidatos = document.querySelectorAll<HTMLElement>('[data-magnet]')
      let mejor: HTMLElement | null = null
      let dx = 0
      let dy = 0
      let min: number = radio
      for (const el of candidatos) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        // Distancia del puntero al borde del botón (0 si está encima).
        const ex = Math.max(Math.abs(x - cx) - r.width / 2, 0)
        const ey = Math.max(Math.abs(y - cy) - r.height / 2, 0)
        const d = Math.hypot(ex, ey)
        if (d < min) {
          min = d
          mejor = el
          dx = x - cx
          dy = y - cy
        }
      }
      if (mejor !== activo) soltar()
      if (!mejor) return
      activo = mejor
      mejor.style.transition = 'translate 120ms var(--ease-out)'
      mejor.style.translate = `${dx * fuerza}px ${dy * fuerza}px`
    }

    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(pintar)
    }

    document.addEventListener('pointermove', alMover, { passive: true })
    document.addEventListener('pointerleave', soltar)
    window.addEventListener('blur', soltar)
    return () => {
      document.removeEventListener('pointermove', alMover)
      document.removeEventListener('pointerleave', soltar)
      window.removeEventListener('blur', soltar)
      cancelAnimationFrame(raf)
      soltar()
    }
  }, [reducir, fino])

  return null
}
