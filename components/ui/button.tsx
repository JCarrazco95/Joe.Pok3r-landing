import Link from 'next/link'

import { cn } from '@/lib/utils'

const variantes = {
  /** Violeta de marca (el profundo: el claro no llega a AA con texto blanco), con brillo al pasar el cursor. */
  primario: 'bg-violet-deep text-fg hover:bg-[#6d28d9] hover:shadow-glow',
  /** Blanco pleno: el contraste más alto, para la acción principal del hero. */
  claro: 'bg-fg text-canvas hover:bg-fg-2',
  /** Sólo borde, para la acción secundaria. */
  contorno:
    'border border-line-strong text-fg hover:border-violet-soft hover:text-violet-soft',
} as const

const tamanos = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-[0.95rem]',
  lg: 'px-8 py-4 text-base',
} as const

type Comun = {
  variante?: keyof typeof variantes
  tamano?: keyof typeof tamanos
  className?: string
  children: React.ReactNode
  /** Lo lee el efecto magnético global (fase 6). No hace nada por sí solo. */
  magnetico?: boolean
}

type ComoEnlace = Comun & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'className' | 'children'
  >
type ComoBoton = Comun & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >

export type BotonProps = ComoEnlace | ComoBoton

/**
 * Botón pill. Con `href` es un enlace (interno con next/link, externo con <a>);
 * sin él, un <button>. Una sola pieza para que botones y enlaces con forma de
 * botón se vean y se comporten igual.
 */
export function Boton(props: BotonProps) {
  const {
    variante = 'primario',
    tamano = 'md',
    magnetico,
    className,
    children,
    ...resto
  } = props

  const clases = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-bold',
    'transition-[background-color,box-shadow,border-color,color] duration-200',
    'disabled:pointer-events-none disabled:opacity-50',
    variantes[variante],
    tamanos[tamano],
    className,
  )
  const dataMagnet = magnetico ? { 'data-magnet': '1' } : {}

  if (resto.href !== undefined) {
    const { href, ...a } = resto as Omit<ComoEnlace, keyof Comun>
    if (/^https?:\/\//.test(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={clases}
          {...dataMagnet}
          {...a}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={clases} {...dataMagnet} {...a}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={clases}
      {...dataMagnet}
      {...(resto as Omit<ComoBoton, keyof Comun>)}
    >
      {children}
    </button>
  )
}
