'use client'

import { useEffect, useRef } from 'react'

import { Boton } from '@/components/ui/button'
import { CuentaHasta } from '@/components/ui/count-up'
import { Eyebrow } from '@/components/ui/eyebrow'
import { partirCifra } from '@/lib/formato'
import { joe } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

import { HeroEscena } from './hero-escena'
import { HeroFotos } from './hero-fotos'

/** Las tres cifras de `joe.stats` y los años jugando, que el handoff suma aparte. */
const CIFRAS = [
  ...joe.stats.map((s) => ({ valor: s.valor, etiqueta: s.etiqueta, nota: s.nota })),
  { valor: '20+', etiqueta: 'Años', nota: 'Jugando' },
]
const COLOR_CIFRA = ['text-fg', 'text-rose', 'text-fg', 'text-violet-soft']

/**
 * Hero a pantalla completa: H1 por letras, bio, dos acciones, escena 3D detrás
 * y barra de cifras abajo. Un clic en cualquier parte "baraja" las fichas.
 */
export function Hero() {
  const burst = useRef(0)

  // Al cargar, las fichas arrancan con un burst, como en el prototipo.
  useEffect(() => {
    burst.current = performance.now() / 1000
  }, [])

  const alClic = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a,button')) return
    burst.current = performance.now() / 1000
  }

  return (
    <header
      id="top"
      onClick={alClic}
      className="relative min-h-[max(100svh,720px)] overflow-hidden bg-[radial-gradient(ellipse_60%_70%_at_75%_45%,rgb(139_92_246/0.28),transparent_70%),radial-gradient(ellipse_40%_50%_at_95%_90%,rgb(214_51_75/0.22),transparent_70%)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(rgb(250_250_250/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(250_250_250/0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_60%_50%,#000_30%,transparent_75%)]"
      />

      <HeroFotos />

      <HeroEscena burst={burst} />

      <div className="pointer-events-none relative z-[2] mx-auto flex min-h-[max(100svh,720px)] max-w-[1360px] flex-col justify-center gap-[26px] px-[clamp(20px,4vw,56px)] pb-[290px] pt-[120px] sm:pb-[150px]">
        <Eyebrow vivo className="hero-sube [--i:0]">
          {joe.nombre} · {joe.rol} · {joe.ubicacion}
        </Eyebrow>

        <h1
          aria-label={joe.alias}
          className="flex overflow-hidden pt-[0.04em] font-display text-[clamp(84px,15vw,232px)] font-normal uppercase leading-[0.84]"
        >
          {[...joe.alias.toUpperCase()].map((letra, i) => (
            <span
              key={i}
              aria-hidden
              style={{ '--i': i } as React.CSSProperties}
              className={cn('hero-letra', letra === '3' && 'text-violet')}
            >
              {letra}
            </span>
          ))}
        </h1>

        <p className="hero-sube max-w-[520px] text-pretty text-[clamp(17px,1.5vw,21px)] leading-[1.55] text-fg-2 [--i:1]">
          {joe.bio}
        </p>

        <div className="hero-sube pointer-events-auto flex flex-wrap gap-3.5 [--i:2]">
          <Boton
            href="#resultados"
            variante="claro"
            tamano="lg"
            magnetico
            className="hover:shadow-[0_0_0_6px_rgb(250_250_250/0.15)]"
          >
            Ver resultados
          </Boton>
          <Boton
            href="#mano"
            variante="contorno"
            tamano="lg"
            magnetico
            className="border-2 border-fg/30 hover:border-violet hover:bg-violet/15 hover:text-fg"
          >
            Reparte una mano ♠
          </Boton>
        </div>

        <p className="hero-sube text-[13px] font-semibold text-fg-dim [--i:3]">
          <span className="pointer-fine:inline hidden">Mueve el mouse · haz clic para barajar las fichas</span>
          <span className="pointer-fine:hidden">Toca el fondo para barajar las fichas</span>
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[3] border-t border-fg/10 bg-canvas/60 backdrop-blur-[10px]">
        <dl className="mx-auto grid max-w-[1360px] grid-cols-2 px-[clamp(20px,4vw,56px)] sm:grid-cols-4">
          {CIFRAS.map((c, i) => {
            const partes = partirCifra(c.valor)
            return (
              <div
                key={c.etiqueta}
                className={cn(
                  'flex flex-col-reverse justify-end gap-0.5 py-5',
                  i % 2 === 1 && 'border-l border-fg/10 pl-6',
                  i > 0 && 'sm:border-l sm:border-fg/10 sm:pl-6',
                  i === 2 && 'max-sm:border-t max-sm:border-fg/10 max-sm:pl-0 max-sm:[border-left:0]',
                  i === 3 && 'max-sm:border-t max-sm:border-fg/10',
                )}
              >
                <dt className="text-[13px] text-fg-muted">
                  {c.etiqueta} · {c.nota}
                </dt>
                <dd className={cn('font-display text-[48px] leading-[0.9]', COLOR_CIFRA[i])}>
                  {partes ? (
                    <>
                      {partes.prefijo}
                      <CuentaHasta hasta={partes.numero} />
                      {partes.sufijo}
                    </>
                  ) : (
                    c.valor
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </header>
  )
}
