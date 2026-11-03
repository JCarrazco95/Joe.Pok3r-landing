'use client'

import { useEffect, useRef } from 'react'

import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { frase, hitos, joe } from '@/lib/joe-poker'
import { useReduceMotion } from '@/lib/motion'

/** Color de cada hito: del violeta de la marca al rojo del presente. */
const COLORES = ['#8b5cf6', '#a78bfa', '#f08a99', '#d6334b']

const PALABRAS = frase.texto.split(' ')

const limitar = (n: number) => Math.max(0, Math.min(1, n))

/**
 * Historia: una frase que se enciende palabra por palabra, un riel fijo con una
 * ficha que rueda y la línea de tiempo vertical. Todo lo mueve el mismo scroll:
 *
 * - Frase: el 0→100 % va de que su borde superior cruza el 85 % de la pantalla
 *   hasta el 35 %.
 * - Línea y riel: progreso `p` a lo largo de la línea de tiempo; la ficha gira
 *   3 vueltas (1080°) de punta a punta y cada nodo se enciende al alcanzarlo.
 *
 * Con reduced-motion (y sin JS) queda el estado final: frase encendida, línea
 * llena y ficha en el último nodo. El scroll lo emite Lenis como evento nativo,
 * así que basta escuchar `scroll`.
 */
export function Historia() {
  const reducir = useReduceMotion()
  const raiz = useRef<HTMLElement>(null)
  const fraseRef = useRef<HTMLParagraphElement>(null)
  const hilo = useRef<HTMLDivElement>(null)
  const linea = useRef<HTMLDivElement>(null)
  const relleno = useRef<HTMLDivElement>(null)
  const ficha = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = fraseRef.current
    const tl = hilo.current
    if (!el || !tl) return
    const palabras = [...el.querySelectorAll<HTMLElement>('[data-w]')]
    const nodos = [...(raiz.current?.querySelectorAll<HTMLElement>('[data-nodo]') ?? [])]

    const pintarRiel = (p: number) => {
      if (relleno.current) relleno.current.style.width = `${p * 100}%`
      if (ficha.current) {
        ficha.current.style.left = `${p * 100}%`
        ficha.current.style.transform = `rotate(${p * 1080}deg)`
      }
      nodos.forEach((n, i) => {
        const encendido = p >= i / (nodos.length - 1) - 0.02
        if (n.dataset.on === String(encendido)) return
        n.dataset.on = String(encendido)
      })
    }

    if (reducir) {
      el.classList.remove('activa')
      if (linea.current) linea.current.style.transform = 'scaleY(1)'
      pintarRiel(1)
      return
    }

    // A partir de aquí la frase empieza apagada y la enciende el scroll.
    el.classList.add('activa')
    let raf = 0
    const actualizar = () => {
      raf = 0
      const h = window.innerHeight

      const r = el.getBoundingClientRect()
      const pf = limitar((h * 0.85 - r.top) / (h * 0.5))
      const n = Math.round(pf * palabras.length)
      palabras.forEach((w, i) => {
        if (i < n) w.dataset.on = ''
        else delete w.dataset.on
      })

      const t = tl.getBoundingClientRect()
      const p = limitar((h * 0.6 - t.top - 200) / (t.height - 300))
      if (linea.current) linea.current.style.transform = `scaleY(${p})`
      pintarRiel(p)
    }
    const alScroll = () => {
      if (!raf) raf = requestAnimationFrame(actualizar)
    }

    actualizar()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
      cancelAnimationFrame(raf)
    }
  }, [reducir])

  return (
    <section
      ref={raiz}
      id="historia"
      className="mx-auto grid w-full max-w-[1100px] scroll-mt-[70px] gap-16 px-[clamp(20px,4vw,56px)] py-[clamp(72px,10vw,130px)]"
    >
      <Revelar className="grid gap-3">
        <Eyebrow>06 · Cómo empecé</Eyebrow>
        <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
          De la mesa de
          <br />
          la casa a Las Vegas
        </h2>
      </Revelar>

      <p
        ref={fraseRef}
        className="frase flex flex-wrap gap-x-[0.28em] font-display text-[clamp(36px,4.6vw,66px)] leading-[1.02]"
      >
        {PALABRAS.map((w, i) => (
          <span
            key={i}
            data-w
            style={frase.resaltes[w] ? ({ '--c': frase.resaltes[w] } as React.CSSProperties) : undefined}
          >
            {w}
          </span>
        ))}
      </p>

      {/* Riel fijo bajo la nav: la ficha rueda de hito en hito mientras se lee. */}
      <div
        aria-hidden
        className="sticky top-16 z-[5] -mx-[clamp(20px,4vw,56px)] bg-[linear-gradient(#0b0b0d_70%,transparent)] px-[clamp(28px,5vw,80px)] pb-[42px] pt-[18px]"
      >
        <div className="relative h-14">
          <div className="absolute inset-x-0 top-[26px] h-1 rounded-sm bg-line" />
          <div
            ref={relleno}
            className="absolute left-0 top-[26px] h-1 rounded-sm bg-gradient-to-r from-violet to-ruby"
            style={{ width: '100%' }}
          />
          {hitos.map((h, i) => (
            <div
              key={h.riel}
              data-nodo
              data-on="true"
              style={{ left: `${(i / (hitos.length - 1)) * 100}%`, ['--nodo' as string]: i === hitos.length - 1 ? '#d6334b' : '#8b5cf6' }}
              className="riel-nodo absolute top-3.5 grid -translate-x-1/2 justify-items-center gap-2"
            >
              <i className="size-7 rounded-full border-[3px] border-line-strong bg-canvas transition-[border-color,box-shadow] duration-300" />
              <span className="whitespace-nowrap text-[11px] font-bold tracking-[0.08em] text-fg-dim transition-colors duration-300">
                {h.riel}
              </span>
            </div>
          ))}
          <div
            ref={ficha}
            style={{ left: '100%', transform: 'rotate(1080deg)' }}
            className="absolute top-1.5 -ml-[22px] size-11 rounded-full shadow-[0_8px_20px_rgb(0_0_0/0.6)] [background:repeating-conic-gradient(#d6334b_0_30deg,#fafafa_30deg_45deg)]"
          >
            <i className="absolute inset-2 rounded-full border-2 border-fg/60 bg-ruby" />
          </div>
        </div>
      </div>

      <div className="grid gap-12">
        <div ref={hilo} className="relative">
          <div aria-hidden className="absolute bottom-2 left-3.5 top-2 w-[3px] rounded-sm bg-line" />
          <div
            ref={linea}
            aria-hidden
            className="absolute bottom-2 left-3.5 top-2 w-[3px] origin-top rounded-sm bg-gradient-to-b from-violet to-ruby"
          />

          <ol className="grid gap-[72px] pl-14">
            {hitos.map((h, i) => {
              const ultimo = i === hitos.length - 1
              return (
                <li key={h.cuando}>
                  <Revelar className="relative grid max-w-[720px] gap-2.5">
                    <i
                      aria-hidden
                      style={{
                        borderColor: COLORES[i],
                        backgroundColor: ultimo ? COLORES[i] : undefined,
                        boxShadow: ultimo ? `0 0 24px ${COLORES[i]}` : undefined,
                      }}
                      className="absolute -left-[52px] top-1.5 size-6 rounded-full border-[3px] bg-canvas"
                    />
                    <span className="font-display text-[28px]" style={{ color: COLORES[i] }}>
                      {h.cuando}
                    </span>
                    <h3 className="text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.2]">{h.titulo}</h3>
                    <p className="text-pretty text-base leading-[1.65] text-fg-muted">{h.texto}</p>
                  </Revelar>
                </li>
              )
            })}
          </ol>
        </div>

        <Revelar className="flex flex-wrap items-center gap-2.5 pl-14">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-fg-dim">En línea</span>
          {joe.plataformas.map((p) => (
            <span
              key={p}
              className="rounded-full border border-line-strong bg-violet/10 px-3.5 py-1.5 text-sm font-semibold text-violet-soft"
            >
              {p}
            </span>
          ))}
        </Revelar>
      </div>
    </section>
  )
}
