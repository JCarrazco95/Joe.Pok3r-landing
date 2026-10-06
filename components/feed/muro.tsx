'use client'

import { useCallback, useMemo, useState } from 'react'

import { Revelar } from '@/components/ui/reveal'
import { NOMBRE_RED, redesConPosts } from '@/lib/feed'
import type { EstadoFuente, PostSocial, RedFeed } from '@/lib/social/types'

import { EstadoVacio } from './estados'
import { FiltroRedes } from './filtro-redes'
import { TarjetaPost } from './tarjeta-post'
import { VisorPost } from './visor-post'

/**
 * Muro de publicaciones: filtro por red, rejilla de tarjetas y visor.
 *
 * Recibe los datos ya resueltos (el servidor llama a `obtenerFeed`). Sin posts
 * pinta el estado vacío, o el de error si la carga falló: nunca rompe.
 */
export function Muro({
  posts,
  fuentes,
  error,
}: {
  posts: PostSocial[]
  fuentes: EstadoFuente[]
  error?: boolean
}) {
  const [filtro, setFiltro] = useState<RedFeed | null>(null)
  const [abierto, setAbierto] = useState<PostSocial | null>(null)
  const cerrar = useCallback(() => setAbierto(null), [])

  const redes = useMemo(() => redesConPosts(posts), [posts])
  const manuales = useMemo(
    () => new Set(fuentes.filter((f) => f.origen === 'manual').map((f) => f.red)),
    [fuentes],
  )

  if (posts.length === 0) return <EstadoVacio error={error} />

  const visibles = filtro ? posts.filter((p) => p.red === filtro) : posts
  const conRespaldo = redes.filter((r) => manuales.has(r.red) && (!filtro || r.red === filtro))

  return (
    <div className="grid gap-8">
      <FiltroRedes redes={redes} total={posts.length} activa={filtro} onCambiar={setFiltro} />

      <p className="sr-only" role="status">
        {visibles.length} {visibles.length === 1 ? 'publicación' : 'publicaciones'}
        {filtro ? ` de ${NOMBRE_RED[filtro]}` : ''}
      </p>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((p, i) => (
          <li key={`${p.red}:${p.id}`}>
            <Revelar retraso={(i % 3) * 80} className="h-full">
              <TarjetaPost post={p} manual={manuales.has(p.red)} onAbrir={() => setAbierto(p)} />
            </Revelar>
          </li>
        ))}
      </ul>

      {conRespaldo.length > 0 ? (
        <p className="text-[13px] text-fg-dim">
          Las publicaciones de {conRespaldo.map((r) => NOMBRE_RED[r.red]).join(' y ')} marcadas como
          «Selección» están elegidas a mano: puede que no sean lo más reciente de la red.
        </p>
      ) : null}

      {abierto ? <VisorPost post={abierto} onCerrar={cerrar} /> : null}
    </div>
  )
}
