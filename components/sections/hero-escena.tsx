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

const EVENTOS_USO = ['pointerdown', 'pointermove', 'scroll', 'keydown', 'touchstart'] as const

/**
 * ¿Ya toca montar el 3D? Three.js son ~4 s de hilo principal en un móvil medio,
 * y el hero ya se ve completo sin él (fotos + degradado). Así que se monta
 * cuando la página ya cargó y está ociosa (sólo en pantallas ≥ 640 px), o en
 * cuanto la persona interactúa, lo que ocurra primero. En móvil espera a la
 * primera interacción: es un adorno de fondo, no contenido.
 */
function useMontar(): boolean {
  const [montar, setMontar] = useState(false)

  useEffect(() => {
    let off = false
    const activar = () => {
      if (!off) setMontar(true)
    }
    EVENTOS_USO.forEach((e) => window.addEventListener(e, activar, { once: true, passive: true }))

    let id = 0
    let t = 0
    const grande = window.matchMedia('(min-width: 640px)').matches
    const programar = () => {
      if (!grande) return
      t = window.setTimeout(() => {
        id = window.requestIdleCallback ? window.requestIdleCallback(activar, { timeout: 4000 }) : 0
        if (!id) activar()
      }, 1500)
    }
    if (document.readyState === 'complete') programar()
    else window.addEventListener('load', programar, { once: true })

    return () => {
      off = true
      EVENTOS_USO.forEach((e) => window.removeEventListener(e, activar))
      window.removeEventListener('load', programar)
      window.clearTimeout(t)
      if (id && window.cancelIdleCallback) window.cancelIdleCallback(id)
    }
  }, [])

  return montar
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
  const montar = useMontar()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e?.isIntersecting ?? true))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 max-sm:opacity-50">
      {montar ? (
        <SinWebGL>
          <Escena modo={modo} visible={visible} reducir={reducir} burst={burst} />
        </SinWebGL>
      ) : null}
    </div>
  )
}
