import { Palo } from '@/components/icons'
import { cn } from '@/lib/utils'

export type PaloId = 'spade' | 'heart' | 'diamond' | 'club'

/** Color fijo de cada palo, tal como lo define el diseño. */
export const COLOR_PALO: Record<PaloId, string> = {
  heart: 'bg-ruby',
  spade: 'bg-violet',
  club: 'bg-azure',
  diamond: 'bg-ember',
}

/** Ficha circular con el palo dentro. */
export function InsigniaPalo({
  palo,
  className,
}: {
  palo: PaloId
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-grid size-9 place-items-center rounded-full text-fg',
        COLOR_PALO[palo],
        className,
      )}
    >
      <Palo palo={palo} className="size-4" />
    </span>
  )
}

/** Mismo color fijo, para texto (cifras sobre fondo oscuro). */
export const TEXTO_PALO: Record<PaloId, string> = {
  heart: 'text-ruby',
  spade: 'text-violet',
  club: 'text-azure',
  diamond: 'text-ember',
}

export const SIMBOLO_PALO: Record<PaloId, string> = {
  heart: '♥',
  spade: '♠',
  club: '♣',
  diamond: '♦',
}
