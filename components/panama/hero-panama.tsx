'use client'

import { PANAMA } from '@/lib/joe-poker'

import { CeldasCuenta, ESTADO, SelloPanama, useCuentaRegresiva } from './panama-ui'

/** Brillo azul y rojo extra en el fondo del hero. */
export function BrilloPanama() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_100%_0%,rgb(59_111_224/0.28),transparent_70%),radial-gradient(ellipse_35%_45%_at_70%_100%,rgb(214_51_75/0.22),transparent_70%)]"
    />
  )
}

/** Píldora "Rumbo a Panamá", encima del eyebrow del hero. Lleva a #panama. */
export function PildoraPanama() {
  return (
    <a
      href="#panama"
      className="hero-sube pointer-events-auto flex items-center gap-3 self-start rounded-full border border-fg/20 bg-canvas/70 py-[7px] pl-[7px] pr-[18px] text-xs font-bold tracking-[0.16em] text-fg backdrop-blur-[8px] transition-colors duration-200 [--i:0] hover:border-ruby hover:text-fg"
    >
      <SelloPanama tam={26} />
      <span>{ESTADO.pill}</span>
      <span aria-hidden className="text-rose">
        →
      </span>
    </a>
  )
}

/** Línea "En Panamá" con el sello y la cuenta regresiva (o el estado, ya en juego). */
export function LineaPanama() {
  const cuenta = useCuentaRegresiva()
  return (
    <div className="hero-sube pointer-events-auto -mt-1.5 flex flex-wrap items-center gap-[clamp(18px,3vw,40px)] [--i:1]">
      <div className="flex items-center gap-4">
        <SelloPanama tam={54} />
        <span className="pt-[0.06em] font-display text-[clamp(56px,7vw,112px)] leading-[0.85] text-rose [text-shadow:0_2px_24px_rgb(11_11_13/0.8)]">
          En Panamá
        </span>
      </div>
      <div className="grid gap-2">
        <span className="text-xs font-bold tracking-[0.2em] text-fg-2 [text-shadow:0_1px_8px_#0b0b0d]">
          {cuenta?.vivo ? 'MINI MAIN · FLIGHT A' : 'MINI MAIN · FLIGHT A ARRANCA EN'}
        </span>
        {cuenta === null ? (
          <div aria-hidden className="h-[84px]" />
        ) : cuenta.vivo ? (
          <span
            style={{ color: ESTADO.color }}
            className="font-display text-[clamp(40px,4vw,56px)] leading-[0.9]"
          >
            {ESTADO.label}
          </span>
        ) : (
          <CeldasCuenta cuenta={cuenta} />
        )}
      </div>
      <span className="sr-only">
        {PANAMA.serie} · {PANAMA.sede}
      </span>
    </div>
  )
}
