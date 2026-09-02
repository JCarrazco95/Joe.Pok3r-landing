import { ArrowUpRight } from 'lucide-react'

import { enVivo } from '@/lib/joe-poker'

/**
 * Aviso de "jugando ahora", arriba de todo.
 *
 * No se renderiza nada cuando está apagado: no ocupa espacio ni deja un hueco
 * que empuje el logo hacia abajo, así que encenderlo y apagarlo no mueve el
 * resto de la página más de lo necesario.
 *
 * Va como <aside role="status"> para que un lector de pantalla lo anuncie como
 * información de estado y no como parte del encabezado.
 */
export function EnVivo() {
  if (!enVivo.activo) return null

  const contenido = (
    <>
      {/* El punto es decorativo: "Jugando ahora" ya lo dice con palabras. */}
      <span aria-hidden className="relative grid size-2.5 shrink-0 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-70" />
        <span className="relative size-2.5 rounded-full bg-[var(--accent-bright)]" />
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--accent-bright)]">
          Jugando ahora
        </span>
        <span className="mt-0.5 block text-sm leading-tight text-[var(--ink)]">
          {enVivo.evento}
        </span>
        {enVivo.detalle ? (
          <span className="mt-0.5 block text-xs leading-tight text-[var(--ink-muted)]">
            {enVivo.detalle}
          </span>
        ) : null}
      </span>

      {enVivo.url ? (
        <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--accent-bright)]">
          Seguir
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      ) : null}
    </>
  )

  const clases =
    'mx-auto mb-7 flex w-full max-w-lg items-center gap-3 rounded-xl border border-[var(--stroke)] bg-[rgb(139_92_246_/_0.10)] px-4 py-3'

  if (!enVivo.url) {
    return (
      <aside role="status" className={clases}>
        {contenido}
      </aside>
    )
  }

  return (
    <aside role="status" className="contents">
      <a
        href={enVivo.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${clases} joe-link group transition duration-200 hover:-translate-y-0.5 hover:bg-[rgb(139_92_246_/_0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
      >
        {contenido}
      </a>
    </aside>
  )
}
