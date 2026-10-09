'use client'

import { useMemo, useState } from 'react'

import { Chip, Insignia } from '@/components/ui/chip'

import { EsqueletoMuro } from './estados'
import { fuentesDeEjemplo, postsDeEjemplo } from './ejemplos'
import { Muro } from './muro'

const MODOS = [
  { id: 'cero', etiqueta: '0 posts', cantidad: 0 },
  { id: 'uno', etiqueta: '1 post', cantidad: 1 },
  { id: 'treinta', etiqueta: '30 posts', cantidad: 30 },
  { id: 'cargando', etiqueta: 'Cargando', cantidad: 0 },
  { id: 'error', etiqueta: 'Error', cantidad: 0 },
] as const

type ModoId = (typeof MODOS)[number]['id']

/** Banco de pruebas del muro con datos inventados. Sólo vive en /design. */
export function ProbadorMuro() {
  const [modo, setModo] = useState<ModoId>('treinta')
  const cantidad = MODOS.find((m) => m.id === modo)?.cantidad ?? 0
  const posts = useMemo(() => postsDeEjemplo(cantidad), [cantidad])
  const fuentes = useMemo(() => fuentesDeEjemplo(posts), [posts])

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Insignia tono="rojo">Datos de ejemplo</Insignia>
        <div role="group" aria-label="Estado del muro" className="flex flex-wrap gap-2">
          {MODOS.map((m) => (
            <Chip key={m.id} activo={modo === m.id} onClick={() => setModo(m.id)}>
              {m.etiqueta}
            </Chip>
          ))}
        </div>
      </div>

      {modo === 'cargando' ? (
        <EsqueletoMuro />
      ) : (
        // `key` para reiniciar filtro y visor al cambiar de estado.
        <Muro key={modo} posts={posts} fuentes={fuentes} error={modo === 'error'} />
      )}
    </div>
  )
}
