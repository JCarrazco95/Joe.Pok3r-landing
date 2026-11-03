'use client'

import { useEffect, useRef, useState } from 'react'

import { numeros } from '@/lib/joe-poker'
import { useReduceMotion } from '@/lib/motion'

/** Cuánto dura cada cifra en pantalla, y lo que tarda en contar hasta su valor. */
const TURNO_MS = 3800
const CUENTA_MS = 1400

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
const formato = (n: number) => n.toLocaleString('en-US')

/**
 * Banda "En números": una cifra gigante que cuenta hasta su valor y rota cada
 * 3.8s mientras la banda está en pantalla, con una barra violeta→roja que marca
 * el turno. Con reduced-motion se muestran las cuatro cifras ya contadas.
 */
export function Numeros() {
  const reducir = useReduceMotion()
  const banda = useRef<HTMLElement>(null)
  const barra = useRef<HTMLDivElement>(null)
  const [indice, setIndice] = useState(0)
  const [valor, setValor] = useState<number>(numeros[0].hasta)
  const [visible, setVisible] = useState(false)
  const [dentro, setDentro] = useState(true)

  useEffect(() => {
    const el = banda.current
    if (!el || reducir) return
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), {
      threshold: 0.25,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reducir])

  // Pasa a la siguiente cifra mientras la banda se ve.
  useEffect(() => {
    if (!visible || reducir) return
    const id = setInterval(() => setIndice((i) => (i + 1) % numeros.length), TURNO_MS)
    return () => clearInterval(id)
  }, [visible, reducir])

  // Cuenta, entrada del rótulo y barra de turno, cada vez que cambia la cifra.
  useEffect(() => {
    if (!visible || reducir) return
    const { hasta } = numeros[indice]!
    let raf = 0
    const t0 = performance.now()
    const paso = (ahora: number) => {
      const p = Math.min(1, (ahora - t0) / CUENTA_MS)
      setValor(Math.round(hasta * easeOutCubic(p)))
      if (p < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)

    setDentro(false)
    const entrada = setTimeout(() => setDentro(true), 60)

    const b = barra.current
    if (b) {
      b.style.transition = 'none'
      b.style.width = '0'
      void b.offsetWidth
      b.style.transition = `width ${TURNO_MS}ms linear`
      b.style.width = '100%'
    }
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(entrada)
    }
  }, [indice, visible, reducir])

  const actual = numeros[indice]!

  if (reducir) {
    return (
      <section
        aria-label="En números"
        className="border-t border-line bg-surface"
      >
        <dl className="mx-auto grid max-w-[1360px] gap-12 px-[clamp(20px,4vw,56px)] py-[clamp(64px,9vw,120px)] sm:grid-cols-2">
          {numeros.map((n) => (
            <div key={n.etiqueta} className="grid gap-2">
              <dd className="font-display text-[clamp(72px,10vw,140px)] leading-[0.85] tabular-nums">
                {n.prefijo}
                {formato(n.hasta)}
                {n.sufijo}
              </dd>
              <dt className="text-[13px] font-bold uppercase tracking-[0.3em] text-violet-soft">
                {n.etiqueta}
              </dt>
              <dd className="text-fg-muted">{n.detalle}</dd>
            </div>
          ))}
        </dl>
      </section>
    )
  }

  return (
    <section
      ref={banda}
      aria-label="En números"
      className="relative overflow-hidden border-t border-line bg-surface"
    >
      <div
        ref={barra}
        aria-hidden
        className="absolute left-0 top-0 h-1.5 w-0 bg-gradient-to-r from-violet to-ruby"
      />

      <div className="mx-auto grid max-w-[1360px] gap-3.5 px-[clamp(20px,4vw,56px)] py-[clamp(64px,9vw,120px)]">
        <div className="flex flex-wrap justify-between gap-4">
          <span
            className="text-[13px] font-bold uppercase tracking-[0.3em] text-violet-soft transition-[opacity,transform] duration-500"
            style={{ opacity: dentro ? 1 : 0, transform: dentro ? 'none' : 'translateY(20px)' }}
          >
            {actual.etiqueta}
          </span>
          <span className="text-[13px] font-bold uppercase text-fg-dim">
            En números · {indice + 1}/{numeros.length}
          </span>
        </div>

        {/* Lector de pantalla: la cifra final, sin el conteo intermedio. */}
        <span className="sr-only">
          {actual.prefijo}
          {formato(actual.hasta)}
          {actual.sufijo}
        </span>
        <span
          aria-hidden
          className="whitespace-nowrap font-display text-[clamp(110px,22vw,320px)] leading-[0.8] tabular-nums"
        >
          {actual.prefijo}
          {formato(valor)}
          {actual.sufijo}
        </span>

        <span
          className="text-[clamp(16px,1.5vw,20px)] text-fg-muted transition-[opacity,transform] duration-500"
          style={{ opacity: dentro ? 1 : 0, transform: dentro ? 'none' : 'translateY(20px)' }}
        >
          {actual.detalle}
        </span>
      </div>
    </section>
  )
}
