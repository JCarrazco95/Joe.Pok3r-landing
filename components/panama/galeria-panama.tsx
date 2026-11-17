'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { imagenesPanama, type ImagenPanama } from '@/lib/panama-imagenes'
import { cn } from '@/lib/utils'

/**
 * Sólo las gráficas terminadas. Los cuadros de secuencia (patrocinadores,
 * logos, fotogramas) siguen en R2 y en el índice, pero no son para mostrar.
 */
const FILTROS = [
  { id: 'todas', etiqueta: 'Todas' },
  { id: 'publicaciones', etiqueta: 'Publicaciones' },
  { id: 'felicitaciones', etiqueta: 'Felicitaciones' },
  { id: 'reels-e-historias', etiqueta: 'Reels e historias' },
] as const

type FiltroId = (typeof FILTROS)[number]['id']

const VISIBLES = imagenesPanama.filter((i) => i.grupo !== 'patrocinadores' && i.grupo !== 'logos' && i.grupo !== 'fotogramas')

const legible = (nombre: string) => nombre.replace(/-/g, ' ')
const alt = (i: ImagenPanama) => `Gráfica de Joe.Pok3r en Panamá: ${legible(i.nombre)}`

/** Tarjeta: alto fijo y ancho según la proporción, para que la cinta no salte al cargar. */
function Tarjeta({ img, onAbrir, oculta }: { img: ImagenPanama; onAbrir: (i: ImagenPanama) => void; oculta?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onAbrir(img)}
      tabIndex={oculta ? -1 : 0}
      aria-hidden={oculta || undefined}
      aria-label={oculta ? undefined : `Ver ${alt(img)}`}
      style={{ aspectRatio: `${img.ancho} / ${img.alto}` }}
      className="group relative h-[clamp(300px,34vw,440px)] shrink-0 overflow-hidden rounded-2xl border border-line bg-surface transition-transform duration-300 hover:-translate-y-1.5 focus-visible:-translate-y-1.5 motion-reduce:transition-none"
    >
      <Image
        src={img.src}
        alt={oculta ? '' : alt(img)}
        fill
        sizes="(min-width: 1100px) 25vw, 60vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
      />
    </button>
  )
}

/** Visor a pantalla completa con <dialog>: Esc y clic fuera lo cierran. */
function Visor({ img, onCerrar }: { img: ImagenPanama | null; onCerrar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (img && !d.open) d.showModal()
    if (!img && d.open) d.close()
  }, [img])

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
      className="m-auto max-h-[92vh] max-w-[min(92vw,720px)] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-fg backdrop:bg-canvas/85 backdrop:backdrop-blur-sm"
    >
      {img ? (
        <div className="relative">
          <Image
            src={img.src}
            alt={alt(img)}
            width={img.ancho}
            height={img.alto}
            sizes="92vw"
            className="max-h-[92vh] w-auto object-contain"
          />
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-canvas/80 text-xl leading-none hover:bg-canvas"
          >
            ×
          </button>
        </div>
      ) : null}
    </dialog>
  )
}

/**
 * "Desde la mesa": cinta de gráficas que avanza sola (se detiene al pasar el
 * cursor o con reduced-motion, donde pasa a ser un carrusel con scroll), filtros
 * por tipo y visor al hacer clic.
 */
export function GaleriaPanama() {
  const [filtro, setFiltro] = useState<FiltroId>('todas')
  const [abierta, setAbierta] = useState<ImagenPanama | null>(null)

  const lista = filtro === 'todas' ? VISIBLES : VISIBLES.filter((i) => i.grupo === filtro)
  if (VISIBLES.length === 0) return null

  // La cinta duplica el contenido y recorre la mitad: el bucle no tiene salto.
  // Con pocas tarjetas la mitad no llena la pantalla; se repite hasta que sí.
  const vueltas = Math.max(1, Math.ceil(8 / lista.length))
  const tira = Array.from({ length: vueltas }, () => lista).flat()

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filtrar gráficas" className="flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
              className={cn(
                'rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors',
                filtro === f.id
                  ? 'border-violet bg-violet/20 text-fg'
                  : 'border-line text-fg-muted hover:border-fg-dim hover:text-fg',
              )}
            >
              {f.etiqueta}
              <span className="ml-2 text-fg-dim">
                {f.id === 'todas' ? VISIBLES.length : VISIBLES.filter((i) => i.grupo === f.id).length}
              </span>
            </button>
          ))}
        </div>
        <span className="text-xs text-fg-dim">Toca una gráfica para verla completa</span>
      </div>

      <div className="-mx-[clamp(20px,4vw,56px)] overflow-hidden motion-reduce:overflow-x-auto motion-reduce:px-[clamp(20px,4vw,56px)]">
        <ul
          key={filtro}
          className="flex w-max gap-4 pr-4 motion-safe:animate-marquee-lento motion-safe:hover:[animation-play-state:paused] motion-safe:focus-within:[animation-play-state:paused]"
        >
          {tira.map((img, i) => (
            <li key={`${img.src}-${i}`} className="shrink-0">
              <Tarjeta img={img} onAbrir={setAbierta} oculta={i >= lista.length} />
            </li>
          ))}
          {/* Segunda copia para el bucle sin salto (la animación recorre -50%). */}
          {tira.map((img, i) => (
            <li key={`dup-${img.src}-${i}`} aria-hidden className="shrink-0 motion-reduce:hidden">
              <Tarjeta img={img} onAbrir={setAbierta} oculta />
            </li>
          ))}
        </ul>
      </div>

      <Visor img={abierta} onCerrar={() => setAbierta(null)} />
    </div>
  )
}
