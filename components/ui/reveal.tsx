'use client'

import { useEffect, useRef, useState } from 'react'

import { useReduceMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Revelado al hacer scroll: opacidad 0→1 y translateY(48px)→0 en 900ms al
 * entrar el 15% del elemento. Con reduced-motion el contenido se ve desde el
 * principio: el efecto nunca esconde información.
 */
export function Revelar({
  children,
  retraso = 0,
  className,
}: {
  children: React.ReactNode
  /** Desfase en ms, para escalonar hermanos. */
  retraso?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reducir = useReduceMotion()
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reducir) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setListo(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reducir])

  const oculto = !reducir && !listo

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${retraso}ms` }}
      className={cn(
        'transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out)]',
        oculto && 'translate-y-12 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
