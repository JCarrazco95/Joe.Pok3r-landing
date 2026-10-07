'use client'

import { Eye, Play } from 'lucide-react'
import { useCallback, useState } from 'react'

import { IconoRed } from '@/components/icons'
import { MiniaturaRemota, TarjetaPost } from '@/components/feed/tarjeta-post'
import { VisorPost } from '@/components/feed/visor-post'
import { Boton } from '@/components/ui/button'
import { Tarjeta } from '@/components/ui/card'
import { Insignia } from '@/components/ui/chip'
import { urlCanalKick, type EstadoEnVivo } from '@/lib/directo'
import { cifraCompacta } from '@/lib/formato'
import type { PostSocial } from '@/lib/social/types'

import { useEnVivo } from './proveedor'
import { VisorDirecto } from './visor-directo'

/**
 * Contenido de la sección «En directo», conectado al proveedor de la página.
 * `clips` llega del servidor (feed de Kick); el estado, del proveedor.
 */
export function DirectoConectado({
  clips,
  clipsManuales,
}: {
  clips: PostSocial[]
  clipsManuales: boolean
}) {
  const directo = useEnVivo()
  if (!directo) return null
  return (
    <PanelDirecto
      estado={directo.estado}
      comprobando={directo.comprobando}
      clips={clips}
      clipsManuales={clipsManuales}
    />
  )
}

/**
 * Tres estados, y solo el primero afirma «en vivo en Kick» y monta un
 * reproductor:
 * - Kick confirma el directo (`origen: 'real'`): portada → visor con el embed.
 * - Directo anunciado a mano (`origen: 'manual'`): texto y enlace, sin embed.
 * - Sin directo: últimos clips, o el estado vacío con las redes.
 *
 * Es presentacional: `/design` lo alimenta con estados de ejemplo.
 */
export function PanelDirecto({
  estado,
  comprobando,
  clips,
  clipsManuales,
}: {
  estado: EstadoEnVivo
  comprobando: boolean
  clips: PostSocial[]
  /** Los clips son una selección curada a mano, no el feed real de Kick. */
  clipsManuales: boolean
}) {
  if (estado.enVivo && estado.origen === 'real') return <DirectoReal estado={estado} />
  if (estado.enVivo) return <DirectoManual estado={estado} />
  return (
    <SinDirecto
      estado={estado}
      comprobando={comprobando}
      clips={clips}
      clipsManuales={clipsManuales}
    />
  )
}

function DirectoReal({ estado }: { estado: EstadoEnVivo }) {
  const [abierto, setAbierto] = useState(false)
  const cerrar = useCallback(() => setAbierto(false), [])
  const espectadores = estado.espectadores

  return (
    <Tarjeta destacada className="grid grid-cols-1 gap-0 overflow-hidden md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-haspopup="dialog"
        aria-label="Ver el directo en esta página"
        className="group relative block aspect-video w-full overflow-hidden bg-surface"
      >
        <MiniaturaRemota
          src={estado.miniatura}
          red="kick"
          className="size-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
        <span className="absolute left-4 top-4">
          <Insignia tono="rojo">
            <span aria-hidden className="mr-2 size-2 rounded-full bg-fg motion-safe:animate-pulse" />
            En vivo
          </Insignia>
        </span>
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center bg-canvas/20 transition-colors group-hover:bg-canvas/35"
        >
          <span className="grid size-16 place-items-center rounded-full bg-violet text-fg shadow-glow">
            <Play className="size-7 fill-current" />
          </span>
        </span>
      </button>

      <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
        <div className="grid gap-2">
          <p className="flex items-center gap-2 text-sm font-bold text-fg-2">
            <IconoRed nombre="kick" className="size-5 text-violet-soft" aria-hidden />
            En vivo en Kick
          </p>
          <h3 className="font-display text-[clamp(32px,3.4vw,48px)] uppercase leading-[0.95] [overflow-wrap:anywhere]">
            {estado.titulo || 'Joe está en directo'}
          </h3>
          {espectadores !== undefined ? (
            <p className="flex items-center gap-1.5 text-sm text-fg-muted">
              <Eye className="size-4" aria-hidden />
              {cifraCompacta(espectadores)} {espectadores === 1 ? 'espectador' : 'espectadores'}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Boton onClick={() => setAbierto(true)} aria-haspopup="dialog">
            Ver aquí
          </Boton>
          <Boton href={urlCanalKick(estado.slug)} variante="contorno">
            Abrir en Kick ↗
          </Boton>
        </div>
      </div>

      {abierto ? <VisorDirecto slug={estado.slug} onCerrar={cerrar} /> : null}
    </Tarjeta>
  )
}

function DirectoManual({ estado }: { estado: EstadoEnVivo }) {
  return (
    <Tarjeta destacada className="grid grid-cols-1 gap-5 p-6 sm:p-8">
      <div className="grid gap-2">
        <p className="flex items-center gap-2 text-sm font-bold text-rose">
          <span aria-hidden className="size-2.5 rounded-full bg-ruby motion-safe:animate-pulse" />
          Jugando ahora
        </p>
        {estado.titulo ? (
          <h3 className="font-display text-[clamp(32px,3.4vw,48px)] uppercase leading-[0.95] [overflow-wrap:anywhere]">
            {estado.titulo}
          </h3>
        ) : null}
        {estado.detalle ? <p className="text-fg-muted">{estado.detalle}</p> : null}
      </div>
      <div className="flex flex-wrap gap-3">
        {estado.enlace ? <Boton href={estado.enlace}>Seguir la cobertura ↗</Boton> : null}
        <Boton href={urlCanalKick(estado.slug)} variante="contorno">
          Canal de Kick ↗
        </Boton>
      </div>
    </Tarjeta>
  )
}

function SinDirecto({
  estado,
  comprobando,
  clips,
  clipsManuales,
}: {
  estado: EstadoEnVivo
  comprobando: boolean
  clips: PostSocial[]
  clipsManuales: boolean
}) {
  const [abierto, setAbierto] = useState<PostSocial | null>(null)
  const cerrar = useCallback(() => setAbierto(null), [])

  // Sin Kick confirmando no se afirma que esté apagado: se dice lo que se sabe.
  const mensaje =
    estado.origen === 'real'
      ? 'Sin directo ahora'
      : comprobando
        ? 'Comprobando el estado del canal…'
        : 'No pudimos confirmar el estado del canal'

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p role="status" className="flex items-center gap-3 text-[15px] font-bold text-fg-2">
          <span aria-hidden className="size-2.5 rounded-full bg-line-strong" />
          {mensaje}
        </p>
        <Boton href={urlCanalKick(estado.slug)} variante="contorno" tamano="sm">
          <IconoRed nombre="kick" className="mr-2 size-4" aria-hidden />
          Canal de Kick
        </Boton>
      </div>

      {clips.length > 0 ? (
        <div className="grid gap-5">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-fg-muted">
            Últimos clips
          </h3>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clips.map((c) => (
              <li key={`${c.red}:${c.id}`} className="min-w-0">
                <TarjetaPost post={c} manual={clipsManuales} onAbrir={() => setAbierto(c)} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Tarjeta className="px-6 py-12 text-center">
          <p className="mx-auto max-w-[46ch] text-[15px] text-fg-muted">
            Todavía no hay clips de Kick. Cuando Joe esté en directo aparecerá aquí; mientras
            tanto, síguelo en sus redes.
          </p>
        </Tarjeta>
      )}

      {abierto ? <VisorPost post={abierto} onCerrar={cerrar} /> : null}
    </div>
  )
}
