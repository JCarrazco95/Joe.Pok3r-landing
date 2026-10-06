import { resultados } from '@/lib/joe-poker'
import { ordinal } from '@/lib/formato'

const PALOS = ['♠', '♥', '♣', '♦']

/** Los mejores cobros (top 10), con su torneo, para la cinta. */
const TITULARES = resultados
  .filter((r) => r.puesto !== null && r.puesto <= 10)
  .map((r) =>
    [r.torneo, ordinal(r.puesto as number), r.premio].filter(Boolean).join(' · ').toUpperCase(),
  )

/**
 * Marquesina roja girada −1.2°. El contenido se duplica y la animación recorre
 * la mitad, para que el bucle no tenga salto. Con reduced-motion no se mueve
 * (`motion-safe:`) y se ve sólo la primera copia.
 */
export function Marquesina() {
  if (TITULARES.length === 0) return null

  const tira = (oculta?: boolean) => (
    <span aria-hidden={oculta || undefined} className="flex gap-10 pr-10">
      {TITULARES.map((t, i) => (
        <span key={t} className="flex gap-10">
          <span>{t}</span>
          <span>{PALOS[i % 4]}</span>
        </span>
      ))}
    </span>
  )

  return (
    <div className="relative z-[4] -mx-5 -mt-3.5 -rotate-[1.2deg] overflow-hidden bg-ruby py-4">
      <div className="flex w-max whitespace-nowrap font-display text-[30px] tracking-[0.04em] motion-safe:animate-marquee">
        {tira()}
        {tira(true)}
      </div>
    </div>
  )
}
