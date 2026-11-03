'use client'

import { useEffect, useRef, useState } from 'react'

import { useReduceMotion } from '@/lib/motion'

/** Clave de `sessionStorage`: la intro corre una sola vez por sesión. */
export const CLAVE_INTRO = 'joe-intro-vista'

const CUENTA_MS = 1500
const SALIDA_MS = 700

/**
 * Intro "Barajando": ficha girando con un contador 0→100 % y, al terminar, el
 * telón se recoge hacia arriba.
 *
 * Una vez por sesión y nunca con reduced-motion. Para que quien ya la vio no la
 * vea parpadear antes de hidratar, un script en el layout marca `<html>` con
 * `data-intro-vista` y el CSS oculta el overlay desde el primer pintado. Si el
 * JS falla del todo, el CSS lo retira solo a los 4 s (`.intro-barajando`).
 */
export function Intro() {
  const reducir = useReduceMotion()
  const [activa, setActiva] = useState(true)
  const telon = useRef<HTMLDivElement>(null)
  const pct = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const vista = document.documentElement.dataset.introVista === '1'
    if (vista || reducir) {
      setActiva(false)
      return
    }

    let raf = 0
    let salida: Animation | undefined
    const terminar = () => {
      try {
        sessionStorage.setItem(CLAVE_INTRO, '1')
      } catch {
        // Sin storage (modo privado): la intro vuelve en la próxima carga y ya.
      }
      document.documentElement.dataset.introVista = '1'
      setActiva(false)
    }

    const t0 = performance.now()
    const paso = (ahora: number) => {
      const p = Math.min(1, (ahora - t0) / CUENTA_MS)
      if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`
      if (p < 1) {
        raf = requestAnimationFrame(paso)
        return
      }
      const el = telon.current
      if (!el) return terminar()
      salida = el.animate(
        [{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }],
        { duration: SALIDA_MS, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', fill: 'forwards' },
      )
      salida.onfinish = terminar
    }
    raf = requestAnimationFrame(paso)

    return () => {
      cancelAnimationFrame(raf)
      salida?.cancel()
    }
  }, [reducir])

  if (!activa) return null

  return (
    <div
      ref={telon}
      role="status"
      aria-live="polite"
      aria-label="Cargando"
      className="intro-barajando fixed inset-0 z-[100] grid place-items-center bg-canvas"
    >
      <div className="grid justify-items-center gap-[26px]">
        <div className="relative size-[120px] rounded-full shadow-[0_0_60px_rgb(139_92_246/0.5)]">
          <i
            aria-hidden
            className="absolute inset-0 rounded-full [background:repeating-conic-gradient(#8b5cf6_0_20deg,#27272a_20deg_45deg)] animate-[spin_1.2s_linear_infinite]"
          />
          <i
            aria-hidden
            className="absolute inset-[10%] rounded-full bg-surface-2 shadow-[inset_0_0_0_3px_#8b5cf6]"
          />
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center font-display text-[48px] text-violet-soft"
          >
            J
          </span>
        </div>
        <div aria-hidden className="flex items-baseline gap-3.5 font-display">
          <span className="text-[28px] tracking-[0.2em] text-fg-muted">BARAJANDO</span>
          <span ref={pct} className="min-w-[70px] text-[40px] tabular-nums">
            0%
          </span>
        </div>
      </div>
    </div>
  )
}
