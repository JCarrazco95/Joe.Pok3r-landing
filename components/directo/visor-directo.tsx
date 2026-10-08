'use client'

import { X } from 'lucide-react'
import { useRef } from 'react'
import { createPortal } from 'react-dom'

import { IconoRed } from '@/components/icons'
import { useModal } from '@/components/feed/use-modal'
import { Boton } from '@/components/ui/button'
import { embedKick, urlCanalKick } from '@/lib/directo'

/**
 * Visor modal del directo de Kick. Mismo comportamiento que el visor de posts
 * (`useModal`: foco atrapado, Escape, clic en el fondo, scroll bloqueado).
 *
 * El iframe existe solo mientras el visor está abierto: se crea por el clic del
 * visitante en la portada, nunca al renderizar la página, y no se carga ningún
 * script de terceros. `player.kick.com` no es un embed documentado como oficial,
 * así que el visor siempre ofrece el enlace al canal por si falla o cambia.
 */
export function VisorDirecto({ slug, onCerrar }: { slug: string; onCerrar: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  useModal(panel, onCerrar)

  const embed = embedKick(slug)

  return createPortal(
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-canvas/90 p-4 backdrop-blur-lg sm:p-8"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Directo de Joe en Kick"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto flex w-full max-w-[1000px] flex-col gap-5 rounded-panel border border-line-strong bg-surface-2 p-5 shadow-feature focus:outline-none sm:p-8"
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
          <IconoRed nombre="kick" className="size-5 text-violet-soft" aria-hidden />
          Directo en Kick
        </p>

        {embed ? (
          <iframe
            src={embed}
            title="Directo de Joe en Kick"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
            className="aspect-video w-full rounded-photo border-0 bg-surface"
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Boton
            href={urlCanalKick(slug)}
            target="_blank"
            rel="noopener noreferrer"
            variante="contorno"
            tamano="sm"
          >
            Abrir en Kick ↗
          </Boton>
          <p className="text-[13px] text-fg-dim">
            ¿No carga el reproductor? Míralo directo en Kick.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
