'use client'

import { useEffect, useRef, useState } from 'react'

import { Boton } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { COLOR_ACCION, esRoja, repartir, veredicto, type Carta } from '@/lib/mano'
import { useReduceMotion } from '@/lib/motion'

const INICIAL: [Carta, Carta] = [
  { r: 'J', s: '♠' },
  { r: 'J', s: '♥' },
]

/** Circunferencia del medidor: 2π · r, con r = 44. */
const CIRCUNFERENCIA = 276.46

const SOMBRA = 'shadow-card'

/**
 * Una carta con dos caras: el reverso violeta con trama y el frente. `volteada`
 * gira la carta 180° para mostrar el frente. La rotación de la mesa (`giro`) va
 * en el contenedor; el volteo, en el interior.
 */
function CartaVisual({
  carta,
  giro,
  volteada,
}: {
  carta: Carta
  giro: string
  volteada: boolean
}) {
  const roja = esRoja(carta)
  return (
    <div
      data-carta
      style={{ transform: `rotate(${giro})` }}
      className="relative aspect-[5/7] w-[clamp(120px,14vw,170px)]"
    >
      <div
        style={{ transform: volteada ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        className="absolute inset-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.3,1.3,0.5,1)] [transform-style:preserve-3d] motion-reduce:duration-0"
      >
        <div
          aria-hidden
          className={`absolute inset-0 rounded-[14px] border-[6px] border-fg [backface-visibility:hidden] [background:repeating-linear-gradient(45deg,#7c3aed_0_9px,#8b5cf6_9px_18px)] ${SOMBRA}`}
        />
        <div
          className={`absolute inset-0 rounded-[14px] bg-fg [backface-visibility:hidden] [transform:rotateY(180deg)] ${SOMBRA} ${roja ? 'text-ruby' : 'text-surface-2'}`}
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
      </div>
    </div>
  )
}

/**
 * "¿Qué haría Joe con tu mano?": reparte dos cartas de una baraja de 52 y
 * muestra el veredicto con la probabilidad real de recibirla. La mano inicial
 * es fija (J♠ J♥) para que el HTML prerenderizado no dependa del azar.
 *
 * Al repartir: las cartas entran desde arriba boca abajo, se voltean una tras
 * otra (700 y 950 ms), un sello con la acción cae sobre ellas (1350 ms) y el
 * medidor de fuerza se llena. Con reduced-motion todo aparece ya en su sitio.
 */
export function TuMano() {
  const [mano, setMano] = useState<[Carta, Carta]>(INICIAL)
  const [repartidas, setRepartidas] = useState(0)
  /** Cuántas cartas están boca arriba (0, 1 o 2) y si el sello ya cayó. */
  const [volteadas, setVolteadas] = useState(2)
  const [sello, setSello] = useState(true)
  const raiz = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const reducir = useReduceMotion()
  const v = veredicto(mano)
  const color = COLOR_ACCION[v.accion]
  const fuerza = sello ? v.fuerza : 0

  useEffect(() => {
    const pendientes = timers.current
    return () => pendientes.forEach(clearTimeout)
  }, [])

  const alRepartir = () => {
    timers.current.forEach(clearTimeout)
    setMano(repartir())
    setRepartidas((n) => n + 1)
    if (reducir) {
      setVolteadas(2)
      setSello(true)
      return
    }
    setVolteadas(0)
    setSello(false)
    timers.current = [
      setTimeout(() => setVolteadas(1), 700),
      setTimeout(() => setVolteadas(2), 950),
      setTimeout(() => setSello(true), 1350),
    ]
  }

  // Las cartas entran desde arriba girando; el veredicto aparece después.
  useEffect(() => {
    if (repartidas === 0 || reducir || !raiz.current) return
    raiz.current.querySelectorAll('[data-carta]').forEach((el, i) => {
      el.animate(
        [
          {
            transform: `translate(${i ? 160 : -160}px,-260px) rotate(${i ? 40 : -40}deg)`,
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
          <Eyebrow>04 · Tu turno</Eyebrow>
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
            <Boton magnetico tamano="lg" onClick={alRepartir}>
              Repartir ♠
            </Boton>
            <span className="text-sm font-semibold text-fg-dim">
              Manos repartidas: <b className="font-semibold text-fg">{repartidas}</b>
            </span>
          </div>
        </Revelar>

        <div className="grid justify-items-center gap-7">
          <div className="relative flex gap-5 [perspective:1000px]">
            <CartaVisual carta={mano[0]} giro="-7deg" volteada={volteadas > 0} />
            <CartaVisual carta={mano[1]} giro="7deg" volteada={volteadas > 1} />

            {/* Sello: decorativo; la acción también está en el veredicto de abajo. */}
            <div
              aria-hidden
              style={{
                borderColor: color,
                color,
                opacity: sello ? 1 : 0,
                transform: `translate(-50%,-50%) rotate(-12deg) scale(${sello ? 1 : 2.6})`,
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-[3] whitespace-nowrap rounded-xl border-[6px] bg-canvas/85 px-6 pb-0.5 pt-1.5 font-display text-[clamp(52px,6vw,76px)] leading-none transition-[transform,opacity] duration-[280ms,150ms] ease-[cubic-bezier(0.5,1.8,0.6,1)] motion-reduce:duration-0"
            >
              {v.accion}
            </div>
          </div>

          <div
            data-veredicto
            role="status"
            className="grid w-full max-w-[460px] grid-cols-[auto_minmax(0,1fr)] items-center gap-5 rounded-2xl border-2 border-violet/40 bg-surface-2/85 px-[22px] py-5"
          >
            <div aria-hidden className="relative size-[104px]">
              <svg viewBox="0 0 104 104" className="block size-full -rotate-90">
                <circle cx="52" cy="52" r="44" fill="none" stroke="#27272a" strokeWidth="9" />
                <circle
                  cx="52"
                  cy="52"
                  r="44"
                  fill="none"
                  stroke={color}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUNFERENCIA}
                  strokeDashoffset={(CIRCUNFERENCIA * (1 - fuerza / 100)).toFixed(1)}
                  className="transition-[stroke-dashoffset,stroke] duration-[1000ms,400ms] ease-[cubic-bezier(0.3,1,0.4,1)] motion-reduce:duration-0"
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center content-center">
                <span className="font-display text-[34px] leading-[0.9] tabular-nums">{fuerza}%</span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-fg-muted">FUERZA</span>
              </div>
            </div>

            <div className="grid gap-1.5">
              <span className="font-display text-[32px] leading-[0.95]">{v.label}</span>
              <span className="text-[15px] font-semibold text-rose">{v.say}</span>
              <span className="text-xs text-fg-dim">Probabilidad de recibirla: {v.odds}</span>
              <span className="sr-only">
                Acción: {v.accion}. Fuerza de la mano: {v.fuerza}%.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
