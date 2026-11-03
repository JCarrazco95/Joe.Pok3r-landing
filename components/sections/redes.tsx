import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { Seccion } from '@/components/ui/section'
import { enlaces, type Enlace } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

import { RedesFichas } from './redes-fichas'

/**
 * El "@usuario" que se lee a la derecha, sacado de la propia URL para no
 * duplicar el dato. En sitios sin usuario (Hendon Mob) se muestra el dominio.
 */
function etiquetaDe(url: string): string {
  const { hostname, pathname } = new URL(url)
  const segmento = pathname.split('/').filter(Boolean).pop()
  if (!segmento) return hostname.replace(/^www\./, '')
  if (segmento.startsWith('@')) return segmento
  if (hostname.includes('instagram.com')) return `@${segmento}`
  if (hostname.includes('twitch.tv')) return segmento
  return hostname.replace(/^www\./, '')
}

const FILA =
  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-5 py-[26px]'

function Fila({ enlace }: { enlace: Enlace }) {
  const contenido = (
    <>
      <span className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <span className="font-display text-[clamp(40px,5vw,72px)] leading-[0.9]">{enlace.etiqueta}</span>
        <span className="text-[15px] opacity-75">{enlace.detalle}</span>
      </span>
      <span className="whitespace-nowrap text-[15px] font-bold">
        {enlace.url ? `${etiquetaDe(enlace.url)} ↗` : 'Próximamente'}
      </span>
    </>
  )

  // Sin URL no hay <a>: una fila inerte que lo dice con palabras.
  if (!enlace.url) {
    return (
      <div aria-disabled className={cn(FILA, 'cursor-not-allowed border-b border-line text-fg-dim')}>
        {contenido}
      </div>
    )
  }

  // Al pasar el mouse (o enfocar) el contenido sube y entra, desde abajo, una
  // banda violeta con el nombre y el usuario corriendo en marquesina.
  const cinta = `${etiquetaDe(enlace.url)}  ✦  ${enlace.etiqueta}  ✦  `.repeat(3)

  return (
    <a
      href={enlace.url}
      target="_blank"
      rel="me noopener noreferrer"
      className="group relative block overflow-hidden border-b border-line text-fg hover:text-fg"
    >
      <span
        className={cn(
          FILA,
          'transition-transform duration-[450ms] ease-[cubic-bezier(0.6,0,0.2,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full',
        )}
      >
        {contenido}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 flex translate-y-[101%] items-center overflow-hidden bg-violet transition-transform duration-[450ms] ease-[cubic-bezier(0.6,0,0.2,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        <span className="flex w-max whitespace-nowrap font-display text-[clamp(40px,5vw,72px)] leading-none motion-safe:animate-marquee-rapido">
          <span className="pr-8">{cinta}</span>
          <span className="pr-8">{cinta}</span>
        </span>
      </span>
    </a>
  )
}

/**
 * Redes: filas grandes en Bebas. Salen de `enlaces`, sin el de contacto (tiene
 * su propia sección) ni los anclas internos, que ya están en la nav.
 */
export function Redes() {
  const filas = enlaces.filter((e) => e.id !== 'contacto' && !e.url?.startsWith('#'))

  return (
    <Seccion id="redes" className="grid gap-10 pb-[clamp(72px,9vw,120px)] pt-[60px]">
      <Revelar className="flex flex-wrap items-end justify-between gap-8">
        <div className="grid gap-3">
          <Eyebrow>01 · Encuéntralo aquí</Eyebrow>
          <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
            Sigue el grind
          </h2>
        </div>
        <RedesFichas />
      </Revelar>

      <ul className="grid border-t border-line">
        {filas.map((e) => (
          <li key={e.id}>
            <Revelar>
              <Fila enlace={e} />
            </Revelar>
          </li>
        ))}
      </ul>
    </Seccion>
  )
}
