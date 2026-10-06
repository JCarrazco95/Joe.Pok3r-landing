'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Boton } from '@/components/ui/button'
import { Insignia } from '@/components/ui/chip'
import { Revelar } from '@/components/ui/reveal'
import { Seccion, TituloSeccion } from '@/components/ui/section'
import {
  COLOR_PALO,
  SIMBOLO_PALO,
  TEXTO_PALO,
  type PaloId,
} from '@/components/ui/suit-badge'
import { fechaCorta, ordinal, partirPremio, resultadoVisible } from '@/lib/formato'
import { galeria, joe, resultados, type Resultado } from '@/lib/joe-poker'
import { usePunteroFino, useReduceMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** Los cuatro torneos de las tarjetas y su palo, fijos según el handoff. */
const TARJETAS: { fecha: string; palo: PaloId }[] = [
  { fecha: '2026-08-31', palo: 'heart' },
  { fecha: '2026-09-02', palo: 'spade' },
  { fecha: '2026-09-01', palo: 'club' },
  { fecha: '2023-07-03', palo: 'diamond' },
]

/** Foto de la tarjeta destacada: la mesa final, con su texto alternativo. */
const FOTO_DESTACADA = galeria.find((f) => f.src === '/mesa-final.webp')

const destacado = resultados.find((r) => r.torneo === joe.logroTitulo)

/** Texto del reverso: lo que se sabe del torneo, sin completar lo que falta. */
function detalle(r: Resultado): string {
  const partes = [r.nota, r.premio ? `Cobró ${r.premio}.` : undefined].filter(Boolean)
  if (partes.length) return partes.join(' ')
  return [r.buyIn && `Buy-in de ${r.buyIn}.`, r.serie, r.sede].filter(Boolean).join(' · ')
}

/** Tarjeta grande con foto y tilt 3D que sigue al mouse (±12°). */
function Destacada({ r }: { r: Resultado }) {
  const fino = usePunteroFino()
  const reducir = useReduceMotion()
  const inclinar = fino && !reducir
  const premio = r.premio ? partirPremio(r.premio) : null

  const alMover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!inclinar) return
    const el = e.currentTarget
    const b = el.getBoundingClientRect()
    const x = (e.clientX - b.left) / b.width - 0.5
    const y = (e.clientY - b.top) / b.height - 0.5
    el.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`
  }

  return (
    <div className="[perspective:1200px]">
      <div
        onMouseMove={alMover}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
        className="relative h-full min-h-[540px] overflow-hidden rounded-card shadow-feature transition-transform duration-200 ease-out [transform-style:preserve-3d]"
      >
        {FOTO_DESTACADA ? (
          <Image
            src={FOTO_DESTACADA.src}
            alt={FOTO_DESTACADA.alt}
            fill
            sizes="(min-width: 1100px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/20 via-canvas/50 to-canvas/[0.97]" />

        <div className="absolute inset-x-8 bottom-8 grid gap-[18px]">
          <Insignia tono="rojo" className="justify-self-start px-3 py-1.5 text-xs tracking-[0.2em]">
            Destacado · {fechaCorta(r.fecha).toUpperCase()}
          </Insignia>
          <h3 className="max-w-[10ch] font-display text-[clamp(56px,6vw,88px)] font-normal uppercase leading-[0.85]">
            {r.torneo}
          </h3>
          <p className="text-[15px] text-fg-2">
            {r.sede}
            {r.nota ? ` · ${r.nota.charAt(0).toLowerCase()}${r.nota.slice(1)}` : ''}
          </p>

          <dl className="grid grid-cols-3 gap-3 border-t border-fg/15 pt-[18px]">
            {r.puesto !== null ? (
              <Mini valor={ordinal(r.puesto)} etiqueta="Lugar" />
            ) : null}
            {premio ? (
              <Mini
                valor={premio.cifra}
                etiqueta={premio.moneda ? `Premio ${premio.moneda}` : 'Premio'}
                color="text-rose"
              />
            ) : null}
            {r.field ? <Mini valor={String(r.field)} etiqueta="Jugadores" /> : null}
          </dl>
        </div>
      </div>
    </div>
  )
}

function Mini({ valor, etiqueta, color }: { valor: string; etiqueta: string; color?: string }) {
  return (
    <div className="grid gap-0.5">
      <dd className={cn('font-display text-[clamp(32px,3.4vw,44px)] leading-[0.9]', color)}>{valor}</dd>
      <dt className="text-xs text-fg-muted">{etiqueta}</dt>
    </div>
  )
}

/**
 * Tarjeta que se voltea en Y. Con mouse, al pasar el cursor; en táctil, con tap.
 * Es un <button>: el teclado también la voltea.
 */
function TarjetaVolteable({ r, palo }: { r: Resultado; palo: PaloId }) {
  const [volteada, setVolteada] = useState(false)
  const fino = usePunteroFino()
  const { principal, sinRegistrar } = resultadoVisible(r)

  return (
    <button
      type="button"
      aria-pressed={volteada}
      onClick={() => setVolteada((v) => !v)}
      onMouseEnter={() => fino && setVolteada(true)}
      onMouseLeave={() => fino && setVolteada(false)}
      className="min-h-[258px] text-left [perspective:1000px]"
    >
      <span
        style={{ transform: volteada ? 'rotateY(180deg)' : 'none' }}
        className="relative block h-full min-h-[258px] transition-transform duration-700 ease-[var(--ease-out)] [transform-style:preserve-3d] motion-reduce:duration-0"
      >
        <span className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-line bg-surface-2 p-6 [backface-visibility:hidden]">
          <span className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-fg-dim">{fechaCorta(r.fecha)}</span>
            <span aria-hidden className={cn('text-[22px]', TEXTO_PALO[palo])}>
              {SIMBOLO_PALO[palo]}
            </span>
          </span>
          <span className="grid gap-1.5">
            <span className="text-[19px] font-bold leading-[1.25]">{r.torneo}</span>
            <span className="text-[13px] leading-[1.4] text-fg-muted">
              {[r.serie, r.sede].filter(Boolean).join(' · ')}
            </span>
          </span>
          <span className="grid gap-1">
            <span className={cn('font-display text-[46px] leading-[0.9]', TEXTO_PALO[palo])}>
              {principal}
            </span>
            {sinRegistrar ? (
              <span className="text-xs text-fg-dim">Puesto sin registrar</span>
            ) : null}
          </span>
        </span>

        <span
          className={cn(
            'absolute inset-0 flex flex-col justify-between rounded-2xl p-6 text-fg [backface-visibility:hidden] [transform:rotateY(180deg)]',
            COLOR_PALO[palo],
          )}
        >
          <span aria-hidden className="font-display text-[64px] leading-[0.8]">
            {SIMBOLO_PALO[palo]}
          </span>
          <span className="text-pretty text-base font-semibold leading-[1.5]">{detalle(r)}</span>
        </span>
      </span>
    </button>
  )
}

/** Historial completo, para no perder los cobros que no caben en las tarjetas. */
function Historial() {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="grid justify-items-center gap-6">
      <Boton
        variante="contorno"
        aria-expanded={abierto}
        aria-controls="historial-completo"
        onClick={() => setAbierto((a) => !a)}
        className="border-2 hover:bg-violet/15"
      >
        {abierto ? 'Ocultar el historial' : `Ver el historial completo (${resultados.length})`}
      </Boton>

      {abierto ? (
        <ul id="historial-completo" className="grid w-full border-t border-line">
          {resultados.map((r) => {
            const { principal, sinRegistrar } = resultadoVisible(r)
            return (
              <li
                key={`${r.fecha}-${r.torneo}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-4"
              >
                <span className="grid gap-0.5">
                  <span className="text-[13px] font-semibold text-fg-dim">
                    {fechaCorta(r.fecha)}
                  </span>
                  <span className="font-bold">{r.torneo}</span>
                  <span className="text-[13px] text-fg-muted">
                    {[r.serie, r.sede, r.buyIn && `Buy-in ${r.buyIn}`].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span className="grid justify-items-end gap-0.5 text-right">
                  <span
                    className={cn(
                      'font-display text-[32px] leading-none',
                      sinRegistrar ? 'text-fg-muted' : 'text-violet-soft',
                    )}
                  >
                    {sinRegistrar ? 'Sin registrar' : principal}
                  </span>
                  {r.premio ? <span className="text-[13px] text-rose">{r.premio}</span> : null}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export function Resultados() {
  const tarjetas = TARJETAS.flatMap((t) => {
    const r = resultados.find((x) => x.fecha === t.fecha)
    return r ? [{ r, palo: t.palo }] : []
  })

  return (
    <Seccion id="resultados" className="grid gap-12 pt-[clamp(96px,11vw,140px)]">
      <Revelar className="flex flex-wrap items-end justify-between gap-6">
        <TituloSeccion eyebrow="01 · Resultados" className="mb-0">
          En la mesa
          <br />
          final
        </TituloSeccion>
        <p className="max-w-[380px] text-[15px] leading-[1.6] text-fg-muted">
          Pasa el mouse (o toca) cada torneo para ver el detalle. El historial se sigue armando.
        </p>
      </Revelar>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,520px),1fr))] gap-6">
        <Revelar>{destacado ? <Destacada r={destacado} /> : null}</Revelar>
        <Revelar>
          <div className="grid h-full grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            {tarjetas.map(({ r, palo }) => (
              <TarjetaVolteable key={r.fecha} r={r} palo={palo} />
            ))}
          </div>
        </Revelar>
      </div>

      <Revelar>
        <Historial />
      </Revelar>
    </Seccion>
  )
}
