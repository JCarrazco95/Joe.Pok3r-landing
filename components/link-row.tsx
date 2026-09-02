import { ArrowUpRight } from 'lucide-react'

import { IconoRed } from '@/components/icons'
import type { Enlace } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

/**
 * Una fila del "Linktree". Si el enlace todavía no tiene URL se renderiza como
 * <div> inerte con la etiqueta "Próximamente": nunca un <a> a ningún lado.
 */
export function LinkRow({ enlace }: { enlace: Enlace }) {
  const contenido = (
    <>
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-full border transition-colors',
          enlace.destacado
            ? 'border-[var(--stroke)] bg-[rgb(217_182_92_/_0.12)] text-[var(--gold-bright)]'
            : 'border-[var(--stroke-soft)] bg-[rgb(255_255_255_/_0.04)] text-[var(--ink)]',
        )}
      >
        <IconoRed nombre={enlace.icono} className="size-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[0.95rem] leading-tight text-[var(--ink)]">
          {enlace.etiqueta}
        </span>
        <span className="mt-1 block text-xs leading-snug text-[var(--ink-muted)]">
          {enlace.detalle}
        </span>
      </span>

      {enlace.url ? (
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 text-[var(--ink-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold-bright)]"
        />
      ) : (
        <span className="shrink-0 rounded-full border border-[var(--stroke-soft)] px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.08em] text-[var(--ink-muted)]">
          Próximamente
        </span>
      )}
    </>
  )

  const clases = cn(
    'joe-panel flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left',
    enlace.destacado && 'border-[var(--stroke)]',
  )

  if (!enlace.url) {
    return <div className={cn(clases, 'opacity-60')}>{contenido}</div>
  }

  return (
    <a
      href={enlace.url}
      target="_blank"
      rel="me noopener noreferrer"
      className={cn(
        clases,
        'joe-link group transition duration-200',
        'hover:-translate-y-0.5 hover:border-[var(--stroke)] hover:bg-[rgb(4_21_15_/_0.75)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]',
      )}
    >
      {contenido}
    </a>
  )
}
