import { Chip } from '@/components/ui/chip'
import { NOMBRE_RED, type RedConTotal } from '@/lib/feed'
import type { RedFeed } from '@/lib/social/types'

/**
 * Chips de filtro: "Todas" y sólo las redes con posts. Es un grupo de botones
 * con `aria-pressed` (los <Chip>), así que se recorre con Tab y se activa con
 * Enter o Espacio. Con una sola red no hay nada que filtrar y no se pinta.
 */
export function FiltroRedes({
  redes,
  total,
  activa,
  onCambiar,
}: {
  redes: RedConTotal[]
  total: number
  activa: RedFeed | null
  onCambiar: (red: RedFeed | null) => void
}) {
  if (redes.length < 2) return null

  return (
    <div role="group" aria-label="Filtrar publicaciones por red" className="flex flex-wrap gap-2">
      <Chip activo={activa === null} onClick={() => onCambiar(null)} className="border-[1.5px]">
        Todas <span className="opacity-60">{total}</span>
      </Chip>
      {redes.map((r) => (
        <Chip
          key={r.red}
          activo={activa === r.red}
          onClick={() => onCambiar(r.red)}
          className="border-[1.5px]"
        >
          {NOMBRE_RED[r.red]} <span className="opacity-60">{r.total}</span>
        </Chip>
      ))}
    </div>
  )
}
