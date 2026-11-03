'use client'

import { useEffect, useState } from 'react'

import { PANAMA, PANAMA_ESTADOS, panamaEstado } from '@/lib/joe-poker'
import { cuentaRegresiva } from '@/lib/panama'
import { cn } from '@/lib/utils'

export const ESTADO = PANAMA_ESTADOS[panamaEstado]

/** Sello con los cuadrantes de la bandera: blanco/★azul, rojo, azul, blanco/★rojo. */
export function SelloPanama({ tam, className }: { tam: number; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: tam, height: tam, fontSize: tam * 0.35, borderRadius: tam * 0.13 }}
      className={cn(
        'grid shrink-0 grid-cols-2 grid-rows-2 overflow-hidden shadow-[0_0_0_1px_rgb(250_250_250/0.25)]',
        className,
      )}
    >
      <i className="grid place-items-center bg-fg not-italic leading-none text-azure">★</i>
      <i className="bg-ruby" />
      <i className="bg-azure" />
      <i className="grid place-items-center bg-fg not-italic leading-none text-ruby">★</i>
    </span>
  )
}

/** Punto de color del estado; parpadea mientras Joe juega. */
export function PuntoEstado({ className }: { className?: string }) {
  return (
    <i
      aria-hidden
      style={{ background: ESTADO.color }}
      className={cn('size-[7px] shrink-0 rounded-full', ESTADO.parpadea && 'motion-safe:animate-pulse', className)}
    />
  )
}

/** Cápsula con el estado de Joe en el torneo (PREVIA, JUGANDO, EN EL DINERO…). */
export function EstadoPanama({ className }: { className?: string }) {
  return (
    <span
      style={{ borderColor: ESTADO.color, color: ESTADO.color }}
      className={cn(
        'flex items-center gap-2 rounded-full border text-[11px] font-bold tracking-[0.16em]',
        className,
      )}
    >
      <PuntoEstado />
      {ESTADO.label}
    </span>
  )
}

/**
 * Cuenta regresiva al arranque. Arranca en `null` para que el HTML del servidor
 * (ISR, con hora vieja) no choque con el del navegador; se corrige al montar y
 * cada 30 s.
 */
export function useCuentaRegresiva() {
  const [ahora, setAhora] = useState<number | null>(null)
  useEffect(() => {
    const tic = () => setAhora(Date.now())
    tic()
    const id = setInterval(tic, 30_000)
    return () => clearInterval(id)
  }, [])
  return ahora === null ? null : cuentaRegresiva(PANAMA.inicio, ahora)
}

/** Las tres celdas D/H/M. `grande` es la de la sección; la chica, la del hero. */
export function CeldasCuenta({
  cuenta,
  grande,
}: {
  cuenta: NonNullable<ReturnType<typeof useCuentaRegresiva>>
  grande?: boolean
}) {
  const celdas = [
    { n: cuenta.dias, l: 'DÍAS' },
    { n: cuenta.horas, l: 'HORAS' },
    { n: cuenta.minutos, l: 'MIN' },
  ]
  return (
    <div
      role="timer"
      aria-label={`Faltan ${cuenta.dias} días, ${cuenta.horas} horas y ${cuenta.minutos} minutos`}
      className={cn('flex', grande ? 'grid grid-cols-3 gap-[clamp(8px,1.2vw,16px)]' : 'gap-2')}
    >
      {celdas.map((c) => (
        <div
          key={c.l}
          className={cn(
            'grid justify-items-center',
            grande
              ? 'gap-2.5 rounded-2xl border border-line bg-canvas pb-4 pt-[clamp(18px,2vw,26px)]'
              : 'min-w-[clamp(64px,6vw,84px)] gap-0.5 rounded-xl border border-fg/15 bg-canvas/70 px-2.5 pb-2 pt-2.5 backdrop-blur-[8px]',
          )}
        >
          <span
            className={cn(
              'font-display leading-[0.85]',
              grande ? 'text-[clamp(72px,8vw,128px)] leading-[0.8]' : 'text-[clamp(40px,4vw,56px)]',
            )}
          >
            {c.n}
          </span>
          <span
            className={cn(
              'font-bold',
              grande ? 'text-xs tracking-[0.2em] text-fg-dim' : 'text-[11px] tracking-[0.14em] text-fg-muted',
            )}
          >
            {c.l}
          </span>
        </div>
      ))}
    </div>
  )
}
