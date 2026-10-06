'use client'

import { useEffect, useRef, useState } from 'react'

import { Boton } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { esRoja, repartir, veredicto, type Carta } from '@/lib/mano'
import { useReduceMotion } from '@/lib/motion'

const INICIAL: [Carta, Carta] = [
  { r: 'J', s: '♠' },
  { r: 'J', s: '♥' },
]

function CartaVisual({ carta, giro }: { carta: Carta; giro: string }) {
  const roja = esRoja(carta)
  return (
    <div
      data-carta
      style={{ transform: `rotate(${giro})` }}
      className={`relative aspect-[5/7] w-[clamp(120px,14vw,170px)] rounded-[14px] bg-fg shadow-card ${roja ? 'text-ruby' : 'text-surface-2'}`}
    >
      <div className="absolute left-3.5 top-3 grid justify-items-center leading-[0.9]">
        <span className="font-display text-[44px]">{carta.r}</span>
        <span className="text-[26px]">{carta.s}</span>
      </div>
      <div className="absolute bottom-3 right-3.5 grid rotate-180 justify-items-center leading-[0.9]">
        <span className="font-display text-[44px]">{carta.r}</span>
        <span className="text-[26px]">{carta.s}</span>
      </div>
      <span className="absolute inset-0 grid place-items-center text-[clamp(64px,7vw,88px)]">
        {carta.s}
      </span>
    </div>
  )
}

/**
 * "¿Qué haría Joe con tu mano?": reparte dos cartas de una baraja de 52 y
 * muestra el veredicto con la probabilidad real de recibirla. La mano inicial
 * es fija (J♠ J♥) para que el HTML prerenderizado no dependa del azar.
 */
export function TuMano() {
  const [mano, setMano] = useState<[Carta, Carta]>(INICIAL)
  const [repartidas, setRepartidas] = useState(0)
  const raiz = useRef<HTMLDivElement>(null)
  const reducir = useReduceMotion()
  const v = veredicto(mano)

  // Las cartas entran desde arriba girando; el veredicto aparece después.
  useEffect(() => {
    if (repartidas === 0 || reducir || !raiz.current) return
    raiz.current.querySelectorAll('[data-carta]').forEach((el, i) => {
      el.animate(
        [
          {
            transform: `translate(${i ? 160 : -160}px,-260px) rotate(${i ? 40 : -40}deg) rotateY(180deg)`,
            opacity: 0,
          },
          { opacity: 1, offset: 0.3 },
          { transform: i ? 'rotate(7deg)' : 'rotate(-7deg)' },
        ],
        { duration: 750, delay: i * 150, easing: 'cubic-bezier(.2,.9,.25,1.15)', fill: 'backwards' },
      )
    })
    raiz.current.querySelector('[data-veredicto]')?.animate(
      [
        { opacity: 0, transform: 'scale(.9)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 500, delay: 500, easing: 'cubic-bezier(.2,.9,.2,1.3)', fill: 'backwards' },
    )
  }, [repartidas, reducir])

  return (
    <section
      id="mano"
      className="relative scroll-mt-[70px] overflow-hidden px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,120px)] [background:radial-gradient(ellipse_70%_80%_at_50%_50%,#2a1f4a_0%,#18181B_60%,#0b0b0d_100%)]"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 aspect-[2/1] w-[min(1100px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-violet-soft/20 shadow-[inset_0_0_120px_rgb(139_92_246/0.18)]"
      />

      <div
        ref={raiz}
        className="relative mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-14"
      >
        <Revelar className="grid gap-5">
          <Eyebrow>02 · Tu turno</Eyebrow>
          <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
            ¿Qué haría
            <br />
            Joe con
            <br />
            tu mano?
          </h2>
          <p className="max-w-[420px] text-base leading-[1.6] text-fg-muted">
            Reparte dos cartas y descubre si la juega o la tira.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Boton
              magnetico
              tamano="lg"
              onClick={() => {
                setMano(repartir())
                setRepartidas((n) => n + 1)
              }}
            >
              Repartir ♠
            </Boton>
            <span className="text-sm font-semibold text-fg-dim">
              Manos repartidas: <b className="font-semibold text-fg">{repartidas}</b>
            </span>
          </div>
        </Revelar>

        <div className="grid justify-items-center gap-7">
          <div className="flex gap-5 [perspective:1000px]">
            <CartaVisual carta={mano[0]} giro="-7deg" />
            <CartaVisual carta={mano[1]} giro="7deg" />
          </div>

          <div
            data-veredicto
            role="status"
            className="grid w-full max-w-[440px] gap-2 rounded-2xl border-2 border-violet/40 bg-surface-2/85 px-6 py-[22px] text-center"
          >
            <span className="font-display text-[38px] leading-[0.95]">{v.label}</span>
            <span className="text-base font-semibold text-rose">{v.say}</span>
            <span className="text-[13px] text-fg-dim">Probabilidad de recibirla: {v.odds}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
