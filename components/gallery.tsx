'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { eventos, type EventoId, type Foto } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

/**
 * Galería masonry con visor a pantalla completa.
 *
 * El masonry es `column-count` puro (ver `.joe-masonry` en joe.css): sin JS y
 * sin librería, cada foto conserva su proporción real. El visor sí necesita
 * cliente por el teclado y el bloqueo de scroll.
 *
 * El filtro por torneo no toca la URL a propósito: es una landing que se abre
 * desde una historia de Instagram y se cierra, no algo que alguien vaya a
 * compartir filtrado.
 */
export function Gallery({ fotos }: { fotos: Foto[] }) {
  const [filtro, setFiltro] = useState<EventoId | null>(null)
  const [abierta, setAbierta] = useState<number | null>(null)

  const visibles = useMemo(
    () => (filtro ? fotos.filter((f) => f.evento === filtro) : fotos),
    [fotos, filtro],
  )

  /** Sólo se ofrecen los torneos que de verdad tienen fotos. */
  const conFotos = useMemo(
    () =>
      eventos
        .map((e) => ({ ...e, total: fotos.filter((f) => f.evento === e.id).length }))
        .filter((e) => e.total > 0),
    [fotos],
  )

  const cambiarFiltro = useCallback((id: EventoId | null) => {
    // Si el visor sigue abierto su índice apunta a la lista vieja: se cierra.
    setAbierta(null)
    setFiltro(id)
  }, [])
  const disparadores = useRef<(HTMLButtonElement | null)[]>([])
  const visor = useRef<HTMLDivElement>(null)
  const ultimoDisparador = useRef<number | null>(null)

  const cerrar = useCallback(() => setAbierta(null), [])
  const mover = useCallback(
    (paso: number) =>
      setAbierta((i) => (i === null ? i : (i + paso + visibles.length) % visibles.length)),
    [visibles.length],
  )

  useEffect(() => {
    if (abierta === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
      else if (e.key === 'ArrowRight') mover(1)
      else if (e.key === 'ArrowLeft') mover(-1)
    }

    document.addEventListener('keydown', onKey)
    const scrollPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    visor.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = scrollPrevio
    }
  }, [abierta, cerrar, mover])

  // Al cerrar, el foco regresa a la miniatura desde la que se abrió.
  useEffect(() => {
    if (abierta !== null) return
    const i = ultimoDisparador.current
    if (i !== null) {
      disparadores.current[i]?.focus()
      ultimoDisparador.current = null
    }
  }, [abierta])

  const foto = abierta === null ? null : visibles[abierta]

  return (
    <>
      {conFotos.length > 1 ? (
        <div
          role="group"
          aria-label="Filtrar fotos por torneo"
          className="mb-5 flex flex-wrap justify-center gap-2"
        >
          {[{ id: null, corto: 'Todas', total: fotos.length }, ...conFotos].map((e) => {
            const activo = filtro === e.id
            return (
              <button
                key={e.id ?? 'todas'}
                type="button"
                aria-pressed={activo}
                onClick={() => cambiarFiltro(e.id as EventoId | null)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs transition duration-200',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]',
                  activo
                    ? 'border-[var(--stroke)] bg-[rgb(217_182_92_/_0.14)] text-[var(--gold-bright)]'
                    : 'border-[var(--stroke-soft)] text-[var(--ink-muted)] hover:border-[var(--stroke)] hover:text-[var(--ink)]',
                )}
              >
                {e.corto}
                <span className="ml-1.5 tabular-nums opacity-60">{e.total}</span>
              </button>
            )
          })}
        </div>
      ) : null}

      <div
        className="joe-masonry"
        // Con 4 fotos o menos las tres columnas de escritorio siempre quedan
        // escalonadas: una carga dos piezas y las otras una. Ver joe.css.
        data-pocas={visibles.length <= 4 ? 'true' : undefined}
      >
        {visibles.map((f, i) => (
          <button
            key={f.src}
            type="button"
            ref={(el) => {
              disparadores.current[i] = el
            }}
            onClick={() => {
              ultimoDisparador.current = i
              setAbierta(i)
            }}
            className="group relative block w-full overflow-hidden rounded-xl border border-[var(--stroke-soft)] bg-[var(--felt-deep)] transition duration-300 hover:border-[var(--stroke)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
          >
            <Image
              src={f.src}
              alt={f.alt}
              width={f.ancho}
              height={f.alto}
              sizes="(min-width: 768px) 30vw, 45vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {/* El pie sólo aparece al hover/foco; en móvil el alt hace el trabajo. */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-[rgb(0_0_0_/_0.85)] to-transparent px-2.5 pb-2 pt-6 text-left text-[0.7rem] leading-tight text-[var(--ink)] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              {f.pie}
            </span>
          </button>
        ))}
      </div>

      {foto ? (
        <div
          ref={visor}
          role="dialog"
          aria-modal="true"
          aria-label={foto.pie}
          tabIndex={-1}
          onClick={cerrar}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[rgb(2_10_7_/_0.94)] p-4 backdrop-blur-sm focus:outline-none"
        >
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-[var(--stroke-soft)] text-[var(--ink)] transition hover:border-[var(--stroke)] hover:text-[var(--gold-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
          >
            <X className="size-5" aria-hidden />
          </button>

          {visibles.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(e) => {
                  e.stopPropagation()
                  mover(-1)
                }}
                className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--stroke-soft)] bg-[rgb(2_10_7_/_0.6)] text-[var(--ink)] transition hover:border-[var(--stroke)] hover:text-[var(--gold-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] sm:left-6"
              >
                <ChevronLeft className="size-6" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                onClick={(e) => {
                  e.stopPropagation()
                  mover(1)
                }}
                className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--stroke-soft)] bg-[rgb(2_10_7_/_0.6)] text-[var(--ink)] transition hover:border-[var(--stroke)] hover:text-[var(--gold-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] sm:right-6"
              >
                <ChevronRight className="size-6" aria-hidden />
              </button>
            </>
          ) : null}

          <Image
            src={foto.src}
            alt={foto.alt}
            width={foto.ancho}
            height={foto.alto}
            sizes="90vw"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[78dvh] w-auto max-w-[min(100%,52rem)] rounded-lg object-contain"
          />

          <p className="text-center text-sm text-[var(--ink-muted)]">
            <span className="text-[var(--ink)]">{foto.pie}</span>
            <span className="mx-2 text-[var(--sep)]">·</span>
            {(abierta ?? 0) + 1} de {visibles.length}
          </p>
        </div>
      ) : null}
    </>
  )
}
