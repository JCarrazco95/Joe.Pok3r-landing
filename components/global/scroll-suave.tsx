'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'

import { useReduceMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll suave con Lenis, sincronizado con ScrollTrigger (la línea de tiempo de
 * Historia y los revelados leen el mismo scroll).
 *
 * - Con reduced-motion no se monta: queda el scroll nativo, y las anclas saltan.
 * - En táctil Lenis no toca el scroll (`syncTouch` apagado): el deslizamiento
 *   nativo ya es el que el usuario espera.
 * - Con un modal abierto (que bloquea el scroll poniendo `overflow: hidden` en
 *   el <body>) Lenis se aparta.
 */
export function ScrollSuave() {
  const reducir = useReduceMotion()

  useEffect(() => {
    if (reducir) return

    const lenis = new Lenis({
      lerp: 0.1,
      // El offset de 70px de la nav lo pone cada sección con `scroll-mt-[70px]`;
      // Lenis lo respeta, así que sumar otro aquí las dejaría a 140px.
      anchors: true,
      prevent: () => document.body.style.overflow === 'hidden',
      autoRaf: false,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const alTick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(alTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(alTick)
      lenis.destroy()
    }
  }, [reducir])

  return null
}
