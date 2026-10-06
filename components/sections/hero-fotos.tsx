'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { joe } from '@/lib/joe-poker'
import { useReduceMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** Cada cuánto cambia la foto. */
const CADA_MS = 5000

/** Máscara que desvanece las fotos hacia las fichas. Con prefijo para Safari. */
const MASCARA = 'linear-gradient(90deg, #000 25%, transparent 100%)'

/**
 * Fotos de Joe detrás del texto y del canvas 3D. Pegadas a la izquierda y
 * desvanecidas hacia la derecha, rotan con crossfade y un zoom lento.
 *
 * La activa queda a opacidad .5 y escala 1.08; las demás a 0 y 1. Con
 * `prefers-reduced-motion` se queda la primera foto fija, sin zoom ni cambio.
 * Es decorativa: `alt=""` y fuera del árbol de accesibilidad.
 */
export function HeroFotos() {
  const reducir = useReduceMotion()
  const [activa, setActiva] = useState(0)
  const fotos = joe.fotosHero

  useEffect(() => {
    if (reducir || fotos.length < 2) return
    const id = setInterval(() => setActiva((i) => (i + 1) % fotos.length), CADA_MS)
    return () => clearInterval(id)
  }, [reducir, fotos.length])

  const visible = reducir ? 0 : activa

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-[min(100%,max(62%,640px))]"
      style={{ maskImage: MASCARA, WebkitMaskImage: MASCARA }}
    >
      {fotos.map((f, i) => (
        <Image
          key={f.src}
          src={f.src}
          alt=""
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 62vw, 100vw"
          style={{ objectPosition: `${f.foco * 100}% 30%` }}
          className={cn(
            'object-cover [filter:grayscale(.25)_contrast(1.05)]',
            !reducir &&
              'transition-[opacity,transform] duration-[1600ms,7000ms] ease-[ease,linear]',
            i === visible ? 'scale-[1.08] opacity-50' : 'scale-100 opacity-0',
            reducir && 'scale-100',
          )}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#0b0b0d,transparent_35%),linear-gradient(90deg,rgb(11_11_13/0.35),rgb(11_11_13/0.1)_50%,#0b0b0d_100%)]" />
    </div>
  )
}
