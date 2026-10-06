'use client'

import { useEffect, useRef, useState } from 'react'

import { useReduceMotion } from '@/lib/motion'

/** Ease-out exponencial: arranca rápido y se asienta, como en el diseño. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))

/**
 * Cuenta de 0 a `hasta` cuando entra en pantalla (1.6s por defecto).
 * Con `prefers-reduced-motion` muestra el valor final de inmediato. El valor
 * final también es el que ve el HTML inicial, así que sin JS no queda un 0.
 */
export function CuentaHasta({
  hasta,
  duracion = 1600,
}: {
  hasta: number
  duracion?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [valor, setValor] = useState(hasta)
  const reducir = useReduceMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reducir) return

    let raf = 0
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const paso = (ahora: number) => {
          const t = Math.min((ahora - t0) / duracion, 1)
          setValor(Math.round(hasta * easeOutExpo(t)))
          if (t < 1) raf = requestAnimationFrame(paso)
        }
        raf = requestAnimationFrame(paso)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [hasta, duracion, reducir])

  return (
    <span ref={ref} className="tabular-nums">
      {valor}
    </span>
  )
}
