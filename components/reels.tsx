'use client'

import { Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type Ref } from 'react'

import { usePunteroFino } from '@/lib/motion'
import type { Reel } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

function duracion(seg: number): string {
  const m = Math.floor(seg / 60)
  const s = Math.round(seg % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Póster diferido: el atributo `poster` del <video> no admite `loading="lazy"`,
 * y nueve portadas (~300 KB) competían con el JS del primer pintado. Se asigna
 * cuando la tarjeta está a menos de una pantalla de distancia.
 */
function usePosterCerca() {
  const [cerca, setCerca] = useState<Set<number>>(new Set())
  const io = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    io.current = new IntersectionObserver(
      (entradas) => {
        const nuevas = entradas.filter((e) => e.isIntersecting)
        if (!nuevas.length) return
        nuevas.forEach((e) => io.current?.unobserve(e.target))
        setCerca((prev) => new Set([...prev, ...nuevas.map((e) => Number((e.target as HTMLElement).dataset.i))]))
      },
      { rootMargin: '100% 100%' },
    )
    return () => io.current?.disconnect()
  }, [])

  const observar = useCallback((el: Element | null) => {
    if (el) io.current?.observe(el)
  }, [])
  return { cerca, observar }
}

/**
 * Carrusel horizontal de clips, con scroll por snap.
 *
 * Los videos van con `preload="none"` y póster: hasta que alguien interactúa,
 * la página no baja un solo byte de los ~11 MB de video.
 *
 * Con mouse, pasar el cursor reproduce el clip en silencio (en bucle) y salir
 * lo pausa. Un clic (o un tap, en táctil) lo reproduce con sonido y controles.
 * Sólo uno suena a la vez, y se pausa solo al salir de pantalla.
 */
export function Reels({ reels, pista }: { reels: Reel[]; pista?: Ref<HTMLDivElement> }) {
  /** Clip con sonido y controles (por clic o tap). */
  const [activo, setActivo] = useState<number | null>(null)
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const fino = usePunteroFino()
  const { cerca, observar } = usePosterCerca()

  const detener = useCallback((i: number) => {
    const v = videos.current[i]
    if (!v) return
    v.pause()
    v.currentTime = 0
  }, [])

  const reproducirConSonido = useCallback(
    (i: number) => {
      videos.current.forEach((_, j) => j !== i && detener(j))
      const v = videos.current[i]
      if (!v) return
      v.muted = false
      v.loop = false
      setActivo(i)
      void v.play().catch(() => setActivo(null))
    },
    [detener],
  )

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
      ref={pista}
      tabIndex={0}
      aria-label="Reels"
      className="scrollbar-none flex snap-x snap-mandatory scroll-px-[clamp(20px,4vw,56px)] gap-5 overflow-x-auto scroll-smooth px-[clamp(20px,4vw,56px)] pb-3 pt-2"
    >
      {reels.map((reel, i) => {
        const conSonido = activo === i
        return (
          <figure
            key={reel.src}
            ref={observar}
            data-i={i}
            onMouseEnter={() => {
              if (!fino || activo !== null) return
              const v = videos.current[i]
              if (!v) return
              v.muted = true
              v.loop = true
              void v.play().catch(() => {})
            }}
            onMouseLeave={() => {
              if (fino && activo !== i) detener(i)
            }}
            className="group w-[78vw] max-w-[24rem] shrink-0 snap-start transition-transform duration-300 hover:-translate-y-2 sm:w-[24rem]"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-surface-2">
              <video
                ref={(el) => {
                  videos.current[i] = el
                }}
                src={reel.src}
                poster={cerca.has(i) ? reel.poster : undefined}
                preload="none"
                muted
                playsInline
                controls={conSonido}
                onEnded={() => setActivo(null)}
                aria-label={reel.titulo}
                className={cn(
                  'size-full',
                  // Un clip vertical se muestra completo con barras a los lados;
                  // recortarlo a 16:9 le comería la mitad del encuadre.
                  reel.vertical ? 'bg-black object-contain' : 'object-cover',
                )}
              />

              {!conSonido ? (
                <button
                  type="button"
                  onClick={() => reproducirConSonido(i)}
                  className="absolute inset-0 grid place-items-center bg-gradient-to-b from-transparent from-55% to-canvas/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                >
                  <span className="sr-only">Reproducir: {reel.titulo}</span>
                  <span className="grid size-14 place-items-center rounded-full border border-violet/40 bg-canvas/60 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                    <Play aria-hidden className="size-6 translate-x-px fill-violet-soft text-violet-soft" />
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-canvas/70 px-2.5 py-1 text-xs font-bold tabular-nums">
                    {duracion(reel.seg)}
                  </span>
                </button>
              ) : null}
            </div>

            <figcaption className="mt-3 px-0.5 text-[15px] font-bold leading-[1.3]">
              {reel.titulo}
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
