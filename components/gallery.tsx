'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Boton } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { eventos, type EventoId, type Foto } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

const FLECHA =
  'grid size-12 shrink-0 place-items-center rounded-full border-2 border-line-strong text-fg transition-colors hover:border-violet hover:bg-violet'

/** Cuántas fotos se ven antes de "Ver las N fotos". */
const PRIMERAS = 12

/**
 * Galería: filtro por torneo, grid denso de filas de 220px (1 de cada 7 fotos
 * ocupa 2×2) y visor a pantalla completa con teclado. Muestra las primeras 12 y
 * "Ver las N fotos" despliega el resto. El visor navega sobre la lista completa
 * del filtro, no sólo sobre lo visible.
 *
 * `children` es el título de la sección: va a la izquierda de los chips.
 *
 * El filtro no toca la URL a propósito: es una landing que se abre desde una
 * historia de Instagram y se cierra, no algo que alguien vaya a compartir.
 */
export function Gallery({ fotos, children }: { fotos: Foto[]; children?: React.ReactNode }) {
  const [filtro, setFiltro] = useState<EventoId | null>(null)
  const [abierta, setAbierta] = useState<number | null>(null)
  const [verTodas, setVerTodas] = useState(false)

  const visibles = useMemo(
    () => (filtro ? fotos.filter((f) => f.evento === filtro) : fotos),
    [fotos, filtro],
  )
  const mostradas = verTodas ? visibles : visibles.slice(0, PRIMERAS)
  const hayMas = !verTodas && visibles.length > PRIMERAS

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
    setVerTodas(false)
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

  // Al cerrar, el foco regresa a la miniatura desde la que se abrió (si está a la vista).
  useEffect(() => {
    if (abierta !== null) return
    const i = ultimoDisparador.current
    if (i !== null) {
      disparadores.current[i]?.focus({ preventScroll: true })
      ultimoDisparador.current = null
    }
  }, [abierta])

  const foto = abierta === null ? null : visibles[abierta]

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        {children}
        {conFotos.length > 1 ? (
          <div role="group" aria-label="Filtrar fotos por torneo" className="flex flex-wrap gap-2">
            {[{ id: null, corto: 'Todas', total: fotos.length }, ...conFotos].map((e) => (
              <Chip
                key={e.id ?? 'todas'}
                activo={filtro === e.id}
                onClick={() => cambiarFiltro(e.id as EventoId | null)}
                className="border-[1.5px]"
              >
                {e.corto} <b className="font-semibold opacity-60">{e.total}</b>
              </Chip>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-10 grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3.5 sm:auto-rows-[220px] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {mostradas.map((f, i) => (
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
            className={cn(
              'group relative overflow-hidden rounded-photo bg-surface-2 text-left',
              i % 7 === 0 && 'col-span-2 row-span-2',
            )}
          >
            <Image
              src={f.src}
              alt={f.alt}
              fill
              sizes={
                i % 7 === 0 ? '(min-width: 640px) 440px, 100vw' : '(min-width: 640px) 220px, 50vw'
              }
              className="object-cover saturate-[0.85] transition-[transform,filter] duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.08] group-hover:saturate-[1.1] motion-reduce:transition-none"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/90 to-transparent px-3.5 pb-3 pt-7 text-[13px] font-semibold">
              {f.pie}
            </span>
          </button>
        ))}
      </div>

      {hayMas ? (
        <div className="mt-10 flex justify-center">
          <Boton
            variante="contorno"
            onClick={() => setVerTodas(true)}
            className="border-2 hover:bg-violet/15 hover:text-fg"
          >
            Ver las {visibles.length} fotos
          </Boton>
        </div>
      ) : null}

      {foto ? (
        <div
          ref={visor}
          role="dialog"
          aria-modal="true"
          aria-label={foto.pie}
          tabIndex={-1}
          onClick={cerrar}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-canvas/95 p-4 backdrop-blur-lg focus:outline-none sm:p-10"
        >
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid size-12 place-items-center rounded-full border-2 border-line-strong text-fg transition-colors hover:border-violet hover:bg-violet"
          >
            <X className="size-5" aria-hidden />
          </button>

          <Image
            src={foto.src}
            alt={foto.alt}
            width={foto.ancho}
            height={foto.alto}
            sizes="92vw"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[74dvh] w-auto max-w-[min(100%,1100px)] rounded-photo object-contain shadow-[0_40px_100px_rgb(0_0_0/0.6)]"
          />

          <div className="flex items-center gap-3 sm:gap-5" onClick={(e) => e.stopPropagation()}>
            {visibles.length > 1 ? (
              <button type="button" aria-label="Foto anterior" onClick={() => mover(-1)} className={FLECHA}>
                <ChevronLeft className="size-5" aria-hidden />
              </button>
            ) : null}
            <p className="min-w-0 text-center text-[15px] font-semibold sm:min-w-[260px]">
              {foto.pie} ·{' '}
              <span className="text-fg-dim">
                {(abierta ?? 0) + 1} / {visibles.length}
              </span>
            </p>
            {visibles.length > 1 ? (
              <button type="button" aria-label="Foto siguiente" onClick={() => mover(1)} className={FLECHA}>
                <ChevronRight className="size-5" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
