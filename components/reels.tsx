'use client'

import { Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { usePunteroFino } from '@/lib/motion'
import type { Reel } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

function duracion(seg: number): string {
  const m = Math.floor(seg / 60)
  const s = Math.round(seg % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Distancia circular de la tarjeta `i` a la central: negativa a la izquierda. */
function distancia(i: number, centro: number, total: number): number {
  let d = (((i - centro) % total) + total) % total
  if (d > total / 2) d -= total
  return d
}

/** Cuánto se separa cada tarjeta de su vecina. */
const SEPARACION = 'min(240px,30vw)'

/**
 * Coverflow 3D de clips. La tarjeta central va al frente; las vecinas se abren a
 * los lados, giradas 38° y empujadas hacia atrás, y las lejanas se desvanecen.
 * Un clic en una vecina la trae al centro; ←/→ del teclado, las flechas de la
 * sección y el deslizamiento en táctil también.
 *
 * Los videos van con `preload="none"` y póster: hasta que alguien interactúa,
 * la página no baja un solo byte de los ~11 MB de video.
 *
 * En la tarjeta central, pasar el mouse reproduce el clip en silencio (en
 * bucle) y salir lo pausa. Un clic (o un tap) lo reproduce con sonido y
 * controles. Sólo uno suena a la vez y se pausa solo al salir de pantalla o al
 * cambiar de tarjeta.
 *
 * Los clips verticales usan tarjeta 9:16; los horizontales, 16:9. Así ninguno se
 * recorta ni queda con barras.
 */
export function Reels({
  reels,
  actual,
  onElegir,
}: {
  reels: Reel[]
  actual: number
  onElegir: (i: number) => void
}) {
  /** Clip con sonido y controles (por clic o tap). */
  const [activo, setActivo] = useState<number | null>(null)
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const inicioToque = useRef(0)
  const fino = usePunteroFino()
  const total = reels.length

  const detener = useCallback((i: number) => {
    const v = videos.current[i]
    if (!v) return
    v.pause()
    v.currentTime = 0
  }, [])

  // Al cambiar de tarjeta, todo lo que sonaba o se movía se detiene.
  useEffect(() => {
    videos.current.forEach((_, j) => detener(j))
    setActivo(null)
  }, [actual, detener])

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

  const paso = (d: number) => onElegir((actual + d + total) % total)

  return (
    <div
      tabIndex={0}
      role="group"
      aria-roledescription="carrusel"
      aria-label="Reels"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          paso(-1)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          paso(1)
        }
      }}
      onTouchStart={(e) => {
        inicioToque.current = e.touches[0]?.clientX ?? 0
      }}
      onTouchEnd={(e) => {
        const dx = (e.changedTouches[0]?.clientX ?? 0) - inicioToque.current
        if (Math.abs(dx) > 40) paso(dx < 0 ? 1 : -1)
      }}
      className="relative h-[clamp(440px,52vw,560px)] overflow-hidden [perspective:1100px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet"
    >
      {reels.map((reel, i) => {
        const d = distancia(i, actual, total)
        const ad = Math.abs(d)
        const central = d === 0
        const conSonido = activo === i
        const ancho = reel.vertical ? 'clamp(220px,22vw,280px)' : 'clamp(300px,34vw,440px)'

        return (
          <figure
            key={reel.src}
            // Las que quedan fuera de vista no se enfocan ni se leen.
            inert={ad > 2}
            aria-hidden={ad > 2 || undefined}
            onMouseEnter={() => {
              if (!fino || !central || activo !== null) return
              const v = videos.current[i]
              if (!v) return
              v.muted = true
              v.loop = true
              void v.play().catch(() => {})
            }}
            onMouseLeave={() => {
              if (fino && central && activo !== i) detener(i)
            }}
            style={{
              width: ancho,
              marginLeft: `calc(${ancho} / -2)`,
              zIndex: 10 - ad,
              opacity: ad > 2 ? 0 : ad === 2 ? 0.4 : 1,
              pointerEvents: ad > 2 ? 'none' : 'auto',
              transform: `translateY(-50%) translateX(calc(${SEPARACION} * ${d})) translateZ(${
                ad ? -140 * Math.min(ad, 2) : 40
              }px) rotateY(${-Math.sign(d) * Math.min(ad, 1) * 38}deg)`,
            }}
            className={cn(
              'group absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-line-strong bg-surface-2 shadow-[0_30px_60px_rgb(0_0_0/0.6)]',
              'transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.3,1,0.4,1)] motion-reduce:duration-0',
              reel.vertical ? 'aspect-[9/16]' : 'aspect-video',
            )}
          >
            <video
              ref={(el) => {
                videos.current[i] = el
              }}
              src={reel.src}
              poster={reel.poster}
              preload="none"
              muted
              playsInline
              controls={conSonido}
              onEnded={() => setActivo(null)}
              aria-label={reel.titulo}
              className="absolute inset-0 size-full bg-black object-cover"
            />

            {!conSonido ? (
              <button
                type="button"
                onClick={() => (central ? reproducirConSonido(i) : onElegir(i))}
                className="absolute inset-0 grid place-items-center bg-gradient-to-b from-transparent from-55% to-canvas/90 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet"
              >
                <span className="sr-only">
                  {central ? 'Reproducir' : 'Ver'}: {reel.titulo}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-canvas/70 px-2.5 py-1 text-xs font-bold tabular-nums">
                  {duracion(reel.seg)}
                </span>
                <span className="absolute inset-x-4 bottom-4 grid justify-items-start gap-1.5 text-left">
                  <Play aria-hidden className="size-[22px] fill-violet-soft text-violet-soft" />
                  <span className="text-[15px] font-bold leading-[1.3]">{reel.titulo}</span>
                </span>
              </button>
            ) : null}
          </figure>
        )
      })}
    </div>
  )
}
