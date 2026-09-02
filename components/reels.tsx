'use client'

import { Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { Reel } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

function duracion(seg: number): string {
  const m = Math.floor(seg / 60)
  const s = Math.round(seg % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Carrusel horizontal de clips, con scroll por snap.
 *
 * Los videos van con `preload="none"`: hasta que alguien toca uno, la página no
 * baja un solo byte de los ~11 MB de video. Lo que se ve mientras tanto es el
 * póster, que son ~40 KB cada uno.
 *
 * Sólo puede sonar un video a la vez, y se pausa solo al salir de pantalla:
 * si no, al seguir haciendo scroll se queda oyendo audio de una tarjeta que ya
 * no está a la vista.
 */
export function Reels({ reels }: { reels: Reel[] }) {
  const [activo, setActivo] = useState<number | null>(null)
  const videos = useRef<(HTMLVideoElement | null)[]>([])

  const reproducir = useCallback((i: number) => {
    videos.current.forEach((v, j) => {
      if (v && j !== i) {
        v.pause()
        v.currentTime = 0
      }
    })
    const v = videos.current[i]
    if (!v) return
    setActivo(i)
    void v.play().catch(() => setActivo(null))
  }, [])

  useEffect(() => {
    if (activo === null) return
    const v = videos.current[activo]
    if (!v) return

    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => !e.isIntersecting)) {
          v.pause()
          setActivo(null)
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [activo])

  return (
    <div
      className="scrollbar-thin -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:gap-4"
      // El carrusel se sale del contenedor a propósito: en móvil el último clip
      // debe poder llegar al centro, y el borde de la pantalla no debe cortar
      // la tarjeta en seco.
    >
      {reels.map((reel, i) => {
        const jugando = activo === i
        return (
          <figure
            key={reel.src}
            className="w-[78vw] max-w-[22rem] shrink-0 snap-center sm:w-[22rem]"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--stroke-soft)] bg-black">
              <video
                ref={(el) => {
                  videos.current[i] = el
                }}
                src={reel.src}
                poster={reel.poster}
                preload="none"
                playsInline
                controls={jugando}
                onEnded={() => setActivo(null)}
                onPause={() => setActivo((a) => (a === i ? null : a))}
                aria-label={reel.titulo}
                className={cn(
                  'size-full',
                  // El único clip vertical se muestra completo con barras a los
                  // lados; recortarlo a 16:9 le comería la mitad del encuadre.
                  reel.vertical ? 'object-contain' : 'object-cover',
                )}
              />

              {!jugando ? (
                <button
                  type="button"
                  onClick={() => reproducir(i)}
                  className="group/play absolute inset-0 grid place-items-center bg-[rgb(2_10_7_/_0.35)] transition-colors hover:bg-[rgb(2_10_7_/_0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                >
                  <span className="sr-only">Reproducir: {reel.titulo}</span>
                  <span className="grid size-14 place-items-center rounded-full border border-[var(--stroke)] bg-[rgb(2_10_7_/_0.6)] backdrop-blur-sm transition-transform duration-200 group-hover/play:scale-105">
                    <Play
                      aria-hidden
                      className="size-6 translate-x-px fill-[var(--gold-bright)] text-[var(--gold-bright)]"
                    />
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-full bg-[rgb(2_10_7_/_0.75)] px-2 py-0.5 text-[0.65rem] tabular-nums text-[var(--ink)]">
                    {duracion(reel.seg)}
                  </span>
                </button>
              ) : null}
            </div>

            <figcaption className="mt-2 px-0.5 text-xs leading-snug text-[var(--ink-muted)]">
              {reel.titulo}
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
