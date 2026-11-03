import Image from 'next/image'

import { PANAMA } from '@/lib/joe-poker'

import { EstadoPanama } from './panama-ui'

/** Tarjeta "Próximo torneo" de Resultados: flyer + datos, y lleva a #panama. */
export function ProximoPanama() {
  return (
    <a
      href="#panama"
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] overflow-hidden rounded-[20px] border border-azure bg-surface text-fg shadow-[0_0_0_1px_rgb(214_51_75/0.25),0_20px_60px_rgb(59_111_224/0.15)] transition-transform duration-300 hover:-translate-y-1 hover:text-fg"
    >
      <div className="relative min-h-[240px] bg-canvas">
        <Image
          src={PANAMA.flyer.src}
          alt={PANAMA.flyer.alt}
          fill
          sizes="(min-width: 900px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="grid content-center gap-4 p-[clamp(24px,3vw,40px)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold tracking-[0.24em] text-rose">PRÓXIMO TORNEO</span>
          <EstadoPanama className="px-[11px] py-[5px]" />
        </div>
        <span className="font-display text-[clamp(40px,4.4vw,64px)] leading-[0.9]">{PANAMA.torneoProximo}</span>
        <span className="text-[15px] font-semibold text-fg-2">
          {PANAMA.dia} · 5 nov 2026 · {PANAMA.sede} · {PANAMA.ciudad}
        </span>
        <span className="text-sm font-bold text-violet-soft">Seguir en vivo →</span>
      </div>
    </a>
  )
}
