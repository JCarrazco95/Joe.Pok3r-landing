'use client'

import { useMemo, useState } from 'react'

import { postsDeEjemplo } from '@/components/feed/ejemplos'
import { Chip, Insignia } from '@/components/ui/chip'
import type { EstadoEnVivo } from '@/lib/directo'

import { AvisoEnVivo } from '../en-vivo'
import { PanelDirecto } from './panel-directo'

const SLUG = 'joe-pok3r'
const AHORA = '2026-10-07T12:00:00.000Z'

/** Miniatura inline (SVG): sin red, para ver la portada sin pedirla a nadie. */
const MINIATURA = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="#1e1b4b"/><text x="160" y="105" font-family="Arial" font-size="28" font-weight="700" fill="white" fill-opacity=".8" text-anchor="middle">Portada de ejemplo</text></svg>',
)}`

type Caso = {
  id: string
  etiqueta: string
  estado: EstadoEnVivo
  comprobando: boolean
  clips: boolean
}

const CASOS: Caso[] = [
  {
    id: 'real',
    etiqueta: 'En vivo (Kick)',
    estado: {
      enVivo: true,
      origen: 'real',
      slug: SLUG,
      titulo: 'Día 2 del Main Event · vamos por la mesa final',
      espectadores: 1280,
      miniatura: MINIATURA,
      actualizado: AHORA,
    },
    comprobando: false,
    clips: true,
  },
  {
    id: 'real-sin-datos',
    etiqueta: 'En vivo sin título ni cifra',
    estado: { enVivo: true, origen: 'real', slug: SLUG, actualizado: AHORA },
    comprobando: false,
    clips: false,
  },
  {
    id: 'manual',
    etiqueta: 'Jugando ahora (manual)',
    estado: {
      enVivo: true,
      origen: 'manual',
      slug: SLUG,
      titulo: 'WSOP Circuit México · #2 Mini Main Event',
      detalle: 'Nivel 12 · mesa final',
      enlace: 'https://ejemplo.com/cobertura',
      actualizado: AHORA,
    },
    comprobando: false,
    clips: true,
  },
  {
    id: 'apagado-clips',
    etiqueta: 'Apagado con clips',
    estado: { enVivo: false, origen: 'real', slug: SLUG, actualizado: AHORA },
    comprobando: false,
    clips: true,
  },
  {
    id: 'apagado-vacio',
    etiqueta: 'Apagado sin clips',
    estado: { enVivo: false, origen: 'real', slug: SLUG, actualizado: AHORA },
    comprobando: false,
    clips: false,
  },
  {
    id: 'comprobando',
    etiqueta: 'Comprobando',
    estado: { enVivo: false, origen: 'manual', slug: SLUG, actualizado: AHORA },
    comprobando: true,
    clips: false,
  },
  {
    id: 'sin-confirmar',
    etiqueta: 'Kick no responde',
    estado: { enVivo: false, origen: 'manual', slug: SLUG, actualizado: AHORA },
    comprobando: false,
    clips: true,
  },
]

/**
 * Banco de pruebas del directo con estados inventados. Solo vive en /design:
 * así se ven todos los estados sin depender de Kick ni de variables de entorno.
 * (Para probar la página real: EN_VIVO_SIMULADO=en-vivo|apagado en desarrollo.)
 */
export function ProbadorDirecto() {
  const [id, setId] = useState(CASOS[0]?.id ?? 'real')
  const caso = CASOS.find((c) => c.id === id) ?? CASOS[0]
  const clips = useMemo(
    () => postsDeEjemplo(30).filter((p) => p.red === 'kick').slice(0, 3),
    [],
  )

  if (!caso) return null

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Insignia tono="rojo">Datos de ejemplo</Insignia>
        <div role="group" aria-label="Estado del directo" className="flex flex-wrap gap-2">
          {CASOS.map((c) => (
            <Chip key={c.id} activo={id === c.id} onClick={() => setId(c.id)}>
              {c.etiqueta}
            </Chip>
          ))}
        </div>
      </div>

      {caso.estado.enVivo ? (
        <div className="grid grid-cols-[minmax(0,1fr)] justify-items-center rounded-card border border-dashed border-line-strong bg-canvas p-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-fg-dim">
            Aviso bajo la nav
          </p>
          <AvisoEnVivo estado={caso.estado} />
        </div>
      ) : null}

      {/* `key` reinicia el visor abierto al cambiar de estado. */}
      <PanelDirecto
        key={caso.id}
        estado={caso.estado}
        comprobando={caso.comprobando}
        clips={caso.clips ? clips : []}
        clipsManuales
      />
    </div>
  )
}
