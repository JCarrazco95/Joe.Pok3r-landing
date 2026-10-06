'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { hitos, joe } from '@/lib/joe-poker'
import { useReduceMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Color de cada hito: del violeta de la marca al rojo del presente. */
const COLORES = ['#8b5cf6', '#a78bfa', '#f08a99', '#d6334b']

/**
 * Línea de tiempo vertical. La línea de color crece con el scroll (scrub de
 * ScrollTrigger); con reduced-motion aparece completa.
 */
export function Historia() {
  const linea = useRef<HTMLDivElement>(null)
  const hilo = useRef<HTMLDivElement>(null)
  const reducir = useReduceMotion()

  useGSAP(
    () => {
      if (reducir || !linea.current || !hilo.current) return
      gsap.fromTo(
        linea.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: hilo.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true,
          },
        },
      )
    },
    { dependencies: [reducir], scope: hilo },
  )

  return (
    <section
      id="historia"
      className="mx-auto grid w-full max-w-[1100px] scroll-mt-[70px] gap-16 px-[clamp(20px,4vw,56px)] py-[clamp(72px,10vw,130px)]"
    >
      <Revelar className="grid gap-3">
        <Eyebrow>03 · Cómo empecé</Eyebrow>
        <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
          De la mesa de
          <br />
          la casa a Las Vegas
        </h2>
      </Revelar>

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
