'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef } from 'react'

import { Reels } from '@/components/reels'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { reels } from '@/lib/joe-poker'

const BOTON =
  'grid size-14 place-items-center rounded-full border-2 border-line-strong text-fg transition-colors duration-200 hover:border-violet hover:bg-violet'

/** Sección de reels: título, flechas de 56px (avanzan 520px) y el carrusel. */
export function ReelsSeccion() {
  const pista = useRef<HTMLDivElement>(null)
  const mover = (px: number) => pista.current?.scrollBy({ left: px })

  return (
    <section
      id="reels"
      className="grid scroll-mt-[70px] gap-10 border-y border-line bg-surface py-[clamp(72px,9vw,120px)]"
    >
      <Revelar className="mx-auto flex w-full max-w-[1360px] flex-wrap items-end justify-between gap-6 px-[clamp(20px,4vw,56px)]">
        <div className="grid gap-3">
          <Eyebrow>04 · Reels</Eyebrow>
          <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
            Desde la sala
          </h2>
        </div>
        <div className="flex gap-2.5">
          <button type="button" aria-label="Reels anteriores" onClick={() => mover(-520)} className={BOTON}>
            <ArrowLeft aria-hidden className="size-[22px]" />
          </button>
          <button type="button" aria-label="Más reels" onClick={() => mover(520)} className={BOTON}>
            <ArrowRight aria-hidden className="size-[22px]" />
          </button>
        </div>
      </Revelar>

      <Reels reels={reels} pista={pista} />
    </section>
  )
}
