'use client'

import { Eye, Heart, MessageCircle, Play } from 'lucide-react'
import { useState } from 'react'

import { IconoRed } from '@/components/icons'
import { Insignia } from '@/components/ui/chip'
import { ICONO_RED, NOMBRE_RED } from '@/lib/feed'
import { cifraCompacta, fechaCorta, fechaRelativa } from '@/lib/formato'
import type { PostSocial } from '@/lib/social/types'

import { useAhora } from './use-ahora'

/** Vista previa de la tarjeta y del visor: con la imagen rota cae al ícono de la red. */
export function Miniatura({ post, className }: { post: PostSocial; className?: string }) {
  const [rota, setRota] = useState(false)
  const src = post.media?.miniatura

  if (!src || rota) {
    return (
      <span
        aria-hidden
        className={`grid place-items-center bg-surface text-fg-dim ${className ?? ''}`}
      >
        <IconoRed nombre={ICONO_RED[post.red]} className="size-10" />
      </span>
    )
  }

  return (
    // <img> y no next/image: las miniaturas vienen de CDN de cada red (hosts
    // variables y a veces con firma que caduca), que no se pueden fijar en
    // next.config. `no-referrer` evita contarle a la red desde qué página se ve.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setRota(true)}
      className={`object-cover ${className ?? ''}`}
    />
  )
}

function Metrica({ icono: Icono, etiqueta, valor }: { icono: typeof Eye; etiqueta: string; valor: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icono className="size-3.5" aria-hidden />
      <span className="sr-only">{etiqueta}: </span>
      {cifraCompacta(valor)}
    </span>
  )
}

/**
 * Tarjeta de un post. Toda ella es un <button> que abre el visor: así hay un
 * solo destino de foco y de clic. El texto viene de fuera y se pinta como texto
 * de React, nunca como HTML.
 */
export function TarjetaPost({
  post,
  manual,
  onAbrir,
}: {
  post: PostSocial
  /** La red de este post muestra contenido curado a mano, no el feed real. */
  manual: boolean
  onAbrir: () => void
}) {
  const ahora = useAhora()
  const red = NOMBRE_RED[post.red]
  const reproducible = post.media?.tipo === 'video' || post.media?.tipo === 'embed'
  const m = post.metricas

  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-haspopup="dialog"
      className="group flex h-full w-full flex-col overflow-hidden rounded-card border border-line bg-surface-2 text-left transition-[border-color,transform] duration-300 hover:border-violet-soft motion-safe:hover:-translate-y-1"
    >
      <span className="relative block aspect-video w-full overflow-hidden bg-surface">
        <Miniatura
          post={post}
          className="size-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-canvas/85 text-fg backdrop-blur">
          <IconoRed nombre={ICONO_RED[post.red]} className="size-[18px]" aria-hidden />
          <span className="sr-only">{red}</span>
        </span>
        {reproducible ? (
          <span
            aria-hidden
            className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-violet text-fg"
          >
            <Play className="size-4 fill-current" />
          </span>
        ) : null}
      </span>

      <span className="flex flex-1 flex-col gap-3 p-5">
        <span className="line-clamp-3 [overflow-wrap:anywhere] text-[15px] font-semibold leading-snug text-fg">
          {post.texto || `Publicación en ${red}`}
        </span>

        <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[13px] text-fg-muted">
          <time dateTime={post.fecha} title={fechaCorta(post.fecha.slice(0, 10))}>
            {ahora === null ? fechaCorta(post.fecha.slice(0, 10)) : fechaRelativa(post.fecha, ahora)}
          </time>
          {m?.vistas !== undefined ? <Metrica icono={Eye} etiqueta="Vistas" valor={m.vistas} /> : null}
          {m?.likes !== undefined ? <Metrica icono={Heart} etiqueta="Me gusta" valor={m.likes} /> : null}
          {m?.comentarios !== undefined ? (
            <Metrica icono={MessageCircle} etiqueta="Comentarios" valor={m.comentarios} />
          ) : null}
          {manual ? (
            <Insignia tono="neutro" className="ml-auto">
              <span title="Publicación elegida a mano: puede no ser la más reciente de la red">
                Selección
              </span>
            </Insignia>
          ) : null}
        </span>
      </span>
    </button>
  )
}
