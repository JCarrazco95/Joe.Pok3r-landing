'use client'

import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Boton } from '@/components/ui/button'
import { joe } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

const ANCLAS = [
  { id: 'resultados', etiqueta: 'Resultados' },
  { id: 'mano', etiqueta: 'Tu mano' },
  { id: 'historia', etiqueta: 'Historia' },
  { id: 'reels', etiqueta: 'Reels' },
  { id: 'galeria', etiqueta: 'Galería' },
  { id: 'redes', etiqueta: 'Redes' },
] as const

/** El alias en mayúsculas, partido en el 3 que va en violeta. */
const logo = joe.alias.toUpperCase().split('3')

/**
 * Nav fija de 72px, con barra de progreso de scroll.
 *
 * Transparente arriba; con `scrollY > 40` toma fondo, blur y borde. Las anclas
 * son enlaces `#id` de verdad: el desplazamiento suave y el offset de 70px los
 * pone el CSS (`scroll-behavior` y `scroll-mt` de <Seccion>), así que funcionan
 * aunque falle el JS. En pantallas estrechas las anclas pasan a un menú.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const barra = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const actualizar = () => {
      raf = 0
      const alto = document.documentElement.scrollHeight - window.innerHeight
      const p = alto > 0 ? Math.min(1, window.scrollY / alto) : 0
      if (barra.current) barra.current.style.transform = `scaleX(${p})`
      setScrolled(window.scrollY > 40)
    }
    const alScroll = () => {
      if (!raf) raf = requestAnimationFrame(actualizar)
    }
    actualizar()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [abierto])

  const fondo = scrolled || abierto

  return (
    <>
      <div
        ref={barra}
        aria-hidden
        className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-ruby"
      />

      <nav
        aria-label="Principal"
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between gap-6 border-b px-[clamp(20px,4vw,56px)] backdrop-blur-[14px] transition-[background-color,border-color] duration-300',
          fondo ? 'border-line bg-canvas/80' : 'border-transparent bg-transparent',
        )}
      >
        <a
          href="#top"
          onClick={() => setAbierto(false)}
          className="font-display text-[30px] leading-none tracking-[0.02em] text-fg hover:text-fg"
        >
          {logo[0]}
          <span className="text-violet">3</span>
          {logo[1]}
        </a>

        <ul className="hidden flex-wrap justify-center gap-[clamp(14px,2.2vw,32px)] text-sm font-semibold text-fg-2 lg:flex">
          {ANCLAS.map((a) => (
            <li key={a.id}>
              <a href={`#${a.id}`} className="transition-colors duration-200 hover:text-violet-soft">
                {a.etiqueta}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Boton href="#contacto" tamano="sm" magnetico className="px-5 py-[11px]">
            Patrocinios
          </Boton>
          <button
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto((a) => !a)}
            className="grid size-11 place-items-center rounded-full text-fg hover:text-violet-soft lg:hidden"
          >
            {abierto ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
          </button>
        </div>
      </nav>

      {abierto ? (
        <ul
          id="menu-movil"
          className="fixed inset-x-0 top-[72px] z-40 grid gap-1 border-b border-line bg-canvas/95 px-[clamp(20px,4vw,56px)] py-4 backdrop-blur-[14px] lg:hidden"
        >
          {ANCLAS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                onClick={() => setAbierto(false)}
                className="block py-3 font-display text-3xl tracking-wide text-fg hover:text-violet-soft"
              >
                {a.etiqueta}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
