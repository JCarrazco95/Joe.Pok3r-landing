'use client'

import { useEffect, useRef, useState } from 'react'

import { centrar } from '@/lib/formato'
import { tablero } from '@/lib/joe-poker'
import { useEnPantalla, useReduceMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

const TURNO_MS = 3600
/** Lo que tardan las letras en caer antes de cambiar el texto. */
const CAIDA_MS = 760

function Fila({ texto, giro, className }: { texto: string; giro: boolean; className?: string }) {
  return (
    <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1">
      {centrar(texto).map((ch, i) => (
        <span
          key={i}
          style={{
            transform: giro ? 'rotateX(90deg)' : 'rotateX(0deg)',
            transition: `transform 220ms ease-in ${i * 0.03}s`,
          }}
          className={cn(
            'grid aspect-[3/4] place-items-center rounded-md font-display text-[clamp(13px,3.4vw,52px)] leading-none [background:linear-gradient(#202024_49%,#0b0b0d_49%_51%,#18181b_51%)]',
            className,
          )}
        >
          {ch.trim()}
        </span>
      ))}
    </div>
  )
}

/**
 * Tablero tipo aeropuerto: las letras se voltean y cambian de torneo cada 3.6s
 * mientras el tablero se ve. Con reduced-motion se queda en el primero, quieto.
 * Es decoración de lo que ya dicen las tarjetas: va oculto a lectores de pantalla.
 */
export function Tablero() {
  const reducir = useReduceMotion()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useEnPantalla(ref, 0.25)
  const [indice, setIndice] = useState(0)
  const [giro, setGiro] = useState(false)

  useEffect(() => {
    if (!visible || reducir) return
    let caida: ReturnType<typeof setTimeout> | undefined
    const id = setInterval(() => {
      setGiro(true)
      caida = setTimeout(() => {
        setIndice((n) => (n + 1) % tablero.length)
        setGiro(false)
      }, CAIDA_MS)
    }, TURNO_MS)
    return () => {
      clearInterval(id)
      clearTimeout(caida)
    }
  }, [visible, reducir])

  const [linea1, linea2] = tablero[indice] ?? ['', '']

  return (
    <div
      ref={ref}
      aria-hidden
      className="grid gap-3.5 rounded-[20px] border border-line bg-surface p-[clamp(16px,3vw,32px)] [perspective:900px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
        <span className="flex items-center gap-2.5 tracking-[0.25em] text-fg-muted">
          <i className="size-2 rounded-full bg-ruby motion-safe:animate-pulse" />
          TABLERO · RESULTADOS
        </span>
        <span className="text-fg-dim">
          {indice + 1} / {tablero.length}
        </span>
      </div>
      <Fila texto={linea1} giro={giro} />
      <Fila texto={linea2} giro={giro} className="text-rose" />
    </div>
  )
}
