'use client'

import { useEffect, useRef, useState } from 'react'

import { enlaces } from '@/lib/joe-poker'
import { useEnPantalla, useReduceMotion } from '@/lib/motion'

/** Las redes que llevan ficha (las que traen `ficha` en `lib/joe-poker.ts`). */
const FICHAS = enlaces.flatMap((e) => (e.url && e.ficha ? [{ ...e, url: e.url, ficha: e.ficha }] : []))

const TURNO_MS = 1500
/** Tras pasar el mouse por una ficha, el ciclo automático espera este rato. */
const PAUSA_MS = 2500

/**
 * Fila de fichas de redes. Una ficha a la vez sube 14px y da una vuelta completa
 * (cada vez que le toca suma 360°), y el turno pasa a la siguiente cada 1.5s
 * mientras la fila se ve. Pasar el mouse por una ficha le da el turno y pausa el
 * ciclo 2.5s. Con reduced-motion se quedan quietas.
 */
export function RedesFichas() {
  const reducir = useReduceMotion()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useEnPantalla(ref, 0.25)
  const [activa, setActiva] = useState(-1)
  const [vueltas, setVueltas] = useState<number[]>(() => FICHAS.map(() => 0))
  /** Espejo de `activa` para leerlo sin meter efectos dentro de un updater. */
  const turno = useRef(-1)
  const pausada = useRef(false)
  const reanudar = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const dar = (k: number) => {
    if (turno.current === k) return
    turno.current = k
    setActiva(k)
    setVueltas((v) => v.map((n, i) => (i === k ? n + 1 : n)))
  }

  useEffect(() => {
    if (!visible || reducir || FICHAS.length === 0) return
    const id = setInterval(() => {
      if (!pausada.current) dar((turno.current + 1) % FICHAS.length)
    }, TURNO_MS)
    return () => clearInterval(id)
  }, [visible, reducir])

  useEffect(() => () => clearTimeout(reanudar.current), [])

  if (FICHAS.length === 0) return null

  return (
    <div
      ref={ref}
      className="flex flex-wrap gap-[clamp(8px,1.4vw,16px)] pt-6 [perspective:800px]"
    >
      {FICHAS.map((e, k) => {
        const encendida = activa === k
        return (
          <a
            key={e.id}
            href={e.url}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={e.ficha.nombre ?? e.etiqueta}
            onMouseEnter={() => {
              if (reducir) return
              pausada.current = true
              clearTimeout(reanudar.current)
              reanudar.current = setTimeout(() => (pausada.current = false), PAUSA_MS)
              dar(k)
            }}
            className="grid justify-items-center gap-2.5 text-fg hover:text-fg"
          >
            <span
              aria-hidden
              style={{
                background: e.ficha.color,
                transform: `translateY(${encendida ? -14 : 0}px) rotateY(${vueltas[k]! * 360}deg)`,
              }}
              className="grid aspect-square w-[clamp(56px,6vw,76px)] place-items-center rounded-full border-[6px] border-dashed border-fg/85 shadow-[0_12px_24px_rgb(0_0_0/0.55)] transition-transform duration-[900ms] ease-[cubic-bezier(0.3,1.2,0.4,1)] motion-reduce:duration-0"
            >
              <span className="grid aspect-square w-[64%] place-items-center rounded-full border-2 border-fg/60 font-display text-[clamp(16px,1.6vw,20px)]">
                {e.ficha.sigla}
              </span>
            </span>
            <span
              aria-hidden
              className={`text-[11px] font-bold transition-colors duration-300 ${encendida ? 'text-fg' : 'text-fg-dim'}`}
            >
              {e.ficha.nombre ?? e.etiqueta}
            </span>
          </a>
        )
      })}
    </div>
  )
}
