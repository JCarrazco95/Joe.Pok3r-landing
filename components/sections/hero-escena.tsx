'use client'

import dynamic from 'next/dynamic'
import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'

import { useReduceMotion } from '@/lib/motion'

import type { Escena3d } from './hero-escena-3d'

/** Three.js pesa: sólo se descarga en el cliente y no bloquea el primer pintado. */
const Escena = dynamic(() => import('./hero-escena-3d'), { ssr: false })

/** Sin WebGL (o si el contexto falla) el hero se queda con su fondo. */
class SinWebGL extends Component<{ children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false }
  static getDerivedStateFromError() {
    return { fallo: true }
  }
  render() {
    return this.state.fallo ? null : this.props.children
  }
}

/**
 * Contenedor del 3D. Pausa el render cuando el hero sale de pantalla
 * (IntersectionObserver) y lo deja estático con prefers-reduced-motion.
 */
export function HeroEscena({
  modo = 'orbita',
  burst,
}: {
  /** 'orbita' por defecto; 'lluvia' es la otra variante implementada. */
  modo?: Escena3d
  burst: RefObject<number>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const reducir = useReduceMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e?.isIntersecting ?? true))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      <SinWebGL>
        <Escena modo={modo} visible={visible} reducir={reducir} burst={burst} />
      </SinWebGL>
    </div>
  )
}
