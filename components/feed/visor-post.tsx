'use client'

import { X } from 'lucide-react'
import { useRef } from 'react'
import { createPortal } from 'react-dom'

import { IconoRed } from '@/components/icons'
import { Boton } from '@/components/ui/button'
import { embedDe, ICONO_RED, NOMBRE_RED } from '@/lib/feed'
import { fechaCorta } from '@/lib/formato'
import type { PostSocial } from '@/lib/social/types'

import { Miniatura } from './tarjeta-post'
import { useModal } from './use-modal'

/**
 * Visor modal de un post.
 *
 * - Foco, Escape y scroll del <body>: ver `useModal`. El clic en el fondo cierra
 *   igual que Escape.
 * - El embed (iframe oficial de la red) existe sólo mientras el visor está
 *   abierto: nunca se carga al renderizar la página. YouTube va por
 *   youtube-nocookie.com. Sin embed (Kick) se muestra la vista previa y el
 *   enlace a la red.
 */
export function VisorPost({ post, onCerrar }: { post: PostSocial; onCerrar: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  useModal(panel, onCerrar)

  const red = NOMBRE_RED[post.red]
  const embed = embedDe(post)

  return createPortal(
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-canvas/90 p-4 backdrop-blur-lg sm:p-8"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Publicación de ${red}`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto flex w-full max-w-[720px] flex-col gap-5 rounded-panel border border-line-strong bg-surface-2 p-5 shadow-feature focus:outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border-2 border-line-strong text-fg transition-colors hover:border-violet hover:bg-violet"
        >
          <X className="size-5" aria-hidden />
        </button>

        <p className="flex items-center gap-3 pr-14 text-sm font-bold text-fg-2">
          <IconoRed nombre={ICONO_RED[post.red]} className="size-5 text-violet-soft" aria-hidden />
          {red}
          <span className="font-medium text-fg-muted">
            · <time dateTime={post.fecha}>{fechaCorta(post.fecha.slice(0, 10))}</time>
          </span>
        </p>

        {embed ? (
          <iframe
            src={embed.src}
            title={`Publicación de ${red}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
            className={
              embed.vertical
                ? 'mx-auto h-[min(72dvh,700px)] w-full max-w-[420px] rounded-photo border-0 bg-surface'
                : 'aspect-video w-full rounded-photo border-0 bg-surface'
            }
          />
        ) : (
          <Miniatura post={post} className="aspect-video w-full rounded-photo" />
        )}

        {post.texto ? (
          <p className="whitespace-pre-line [overflow-wrap:anywhere] text-[15px] leading-relaxed text-fg-2">
            {post.texto}
          </p>
        ) : null}

        <div>
          <Boton href={post.url} target="_blank" rel="noopener noreferrer" variante="contorno" tamano="sm">
            Ver en {red} ↗
          </Boton>
        </div>
      </div>
    </div>,
    document.body,
  )
}
