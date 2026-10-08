'use client'

import { ArrowUpRight } from 'lucide-react'

import { useEnVivo } from '@/components/directo/proveedor'
import type { EstadoEnVivo } from '@/lib/directo'
import { cifraCompacta } from '@/lib/formato'
import { cn } from '@/lib/utils'

/** Ancla de la sección del reproductor (`components/sections/directo.tsx`). */
export const ANCLA_DIRECTO = '#directo'

const CLASES_PASTILLA =
  'pointer-events-auto flex w-full max-w-lg items-center gap-3 rounded-card border border-line-strong bg-surface-2/90 px-4 py-3 text-left backdrop-blur-md'

/**
 * Aviso de directo de la página. Lee el estado del proveedor: el HTML (ISR)
 * trae solo el interruptor manual y el navegador lo corrige con Kick.
 *
 * El contenedor `role="status"` existe siempre y vacío: un lector de pantalla
 * anuncia los cambios dentro de una región que ya estaba en la página, no una
 * región que aparece ya llena. Va superpuesto (`absolute`) bajo la nav fija, así
 * que aparecer o desaparecer no empuja el hero.
 */
export function EnVivo() {
  const directo = useEnVivo()
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-x-0 top-[84px] z-[5] flex justify-center px-4"
    >
      {directo?.estado.enVivo ? <AvisoEnVivo estado={directo.estado} /> : null}
    </div>
  )
}

/**
 * La pastilla en sí. Solo el origen `real` afirma "en vivo en Kick" y muestra
 * espectadores; el `manual` es la palabra del interruptor y dice "Jugando ahora".
 */
export function AvisoEnVivo({ estado }: { estado: EstadoEnVivo }) {
  const real = estado.origen === 'real'
  const etiqueta = real ? 'En vivo en Kick' : 'Jugando ahora'
  const titulo = estado.titulo ?? (real ? 'Joe está en directo' : '')
  const detalle = real
    ? estado.espectadores !== undefined
      ? `${cifraCompacta(estado.espectadores)} ${estado.espectadores === 1 ? 'espectador' : 'espectadores'}`
      : ''
    : (estado.detalle ?? '')
  const enlace = real ? ANCLA_DIRECTO : estado.enlace
  const externo = enlace !== undefined && enlace !== ANCLA_DIRECTO

  const contenido = (
    <>
      {/* El punto es decorativo: la etiqueta ya lo dice con palabras. */}
      <span aria-hidden className="relative grid size-2.5 shrink-0 place-items-center">
        <span className="absolute inset-0 rounded-full bg-ruby opacity-70 motion-safe:animate-ping" />
        <span className="relative size-2.5 rounded-full bg-ruby" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-rose">
          {etiqueta}
        </span>
        {titulo ? (
          <span className="mt-0.5 block truncate text-sm font-semibold leading-tight text-fg">
            {titulo}
          </span>
        ) : null}
        {detalle ? (
          <span className="mt-0.5 block truncate text-xs leading-tight text-fg-muted">
            {detalle}
          </span>
        ) : null}
      </span>

      {enlace ? (
        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-violet-soft">
          {real ? 'Ver' : 'Seguir'}
          <ArrowUpRight
            aria-hidden
            className="size-3.5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          />
        </span>
      ) : null}
    </>
  )

  if (!enlace) return <p className={CLASES_PASTILLA}>{contenido}</p>

  return (
    <a
      href={enlace}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        CLASES_PASTILLA,
        'group transition-colors duration-200 hover:border-violet-soft',
      )}
    >
      {contenido}
    </a>
  )
}
