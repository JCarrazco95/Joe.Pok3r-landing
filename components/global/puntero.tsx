'use client'

import { useEffect, useRef } from 'react'

import { usePunteroFino, useReduceMotion } from '@/lib/motion'

/** Lo que agranda el anillo del cursor. */
const CLICABLES = '[data-hover],a,button,input,textarea,select,summary,[role="button"]'

/** Los botones con `data-magnet` se acercan al cursor a menos de este margen (px). */
const MARGEN_MAGNETO = 40

/**
 * Cursor ficha y botones magnéticos, en un solo listener de movimiento.
 *
 * - Cursor: punto blanco de 8px más un anillo de 40px que lo sigue con lerp .18
 *   y `mix-blend-mode: difference`. Sobre elementos clicables el anillo crece a
 *   72px con relleno violeta al 25 %. Oculta el cursor nativo (clase en <html>).
 * - Magnetismo: cerca de un `[data-magnet]`, el botón se desplaza hacia el
 *   cursor (×.28 en X, ×.35 en Y). La transición vive en el CSS global.
 *
 * Sólo con puntero fino y sin reduced-motion: en táctil no se monta nada.
 */
export function Puntero() {
  const fino = usePunteroFino()
  const reducir = useReduceMotion()
  const activo = fino && !reducir

  const anillo = useRef<HTMLDivElement>(null)
  const punto = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activo) return
    const raiz = document.documentElement
    raiz.classList.add('cursor-ficha')

    const cursor = { x: -100, y: -100 }
    const lerp = { x: -100, y: -100 }
    let visto = false
    let sobre: Element | null = null
    let raf = 0
    let moverRaf = 0
    let ultimo: MouseEvent | null = null

    const pintar = () => {
      raf = requestAnimationFrame(pintar)
      lerp.x += (cursor.x - lerp.x) * 0.18
      lerp.y += (cursor.y - lerp.y) * 0.18
      if (punto.current) punto.current.style.transform = `translate(${cursor.x}px,${cursor.y}px)`
      if (anillo.current) anillo.current.style.transform = `translate(${lerp.x}px,${lerp.y}px)`
    }

    const crece = (hover: boolean) => {
      const a = anillo.current
      if (!a) return
      a.style.width = a.style.height = hover ? '72px' : '40px'
      a.style.margin = hover ? '-36px 0 0 -36px' : '-20px 0 0 -20px'
      a.style.background = hover ? 'rgb(167 139 250 / 0.25)' : 'transparent'
    }

    const procesar = () => {
      moverRaf = 0
      const e = ultimo
      if (!e) return
      const objetivo = e.target instanceof Element ? e.target.closest(CLICABLES) : null
      if (objetivo !== sobre) {
        sobre = objetivo
        crece(!!objetivo)
      }
      document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const cerca =
          Math.abs(dx) < r.width / 2 + MARGEN_MAGNETO && Math.abs(dy) < r.height / 2 + MARGEN_MAGNETO
        el.style.translate = cerca ? `${dx * 0.28}px ${dy * 0.35}px` : '0 0'
      })
    }

    const alMover = (e: MouseEvent) => {
      cursor.x = e.clientX
      cursor.y = e.clientY
      if (!visto) {
        // Primer movimiento: el anillo aparece donde está el mouse, sin cruzar la pantalla.
        visto = true
        lerp.x = e.clientX
        lerp.y = e.clientY
        if (anillo.current) anillo.current.style.opacity = '1'
        if (punto.current) punto.current.style.opacity = '1'
      }
      ultimo = e
      if (!moverRaf) moverRaf = requestAnimationFrame(procesar)
    }

    const alSalir = (e: MouseEvent) => {
      if (e.relatedTarget) return
      visto = false
      if (anillo.current) anillo.current.style.opacity = '0'
      if (punto.current) punto.current.style.opacity = '0'
    }

    window.addEventListener('mousemove', alMover, { passive: true })
    document.documentElement.addEventListener('mouseleave', alSalir as EventListener)
    raf = requestAnimationFrame(pintar)

    return () => {
      raiz.classList.remove('cursor-ficha')
      window.removeEventListener('mousemove', alMover)
      document.documentElement.removeEventListener('mouseleave', alSalir as EventListener)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(moverRaf)
      document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
        el.style.translate = ''
      })
    }
  }, [activo])

  if (!activo) return null

  return (
    <>
      <div
        ref={anillo}
        aria-hidden
        style={{ opacity: 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[90] -m-5 size-10 rounded-full border-2 border-violet-soft mix-blend-difference transition-[width,height,margin,background-color,opacity] duration-[250ms]"
      />
      <div
        ref={punto}
        aria-hidden
        style={{ opacity: 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[91] -m-1 size-2 rounded-full bg-fg"
      />
    </>
  )
}
