import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { Seccion } from '@/components/ui/section'
import { enlaces, type Enlace } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

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
  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-b border-line px-5 py-[26px] transition-[background-color,padding] duration-[350ms]'

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
      <div aria-disabled className={cn(FILA, 'cursor-not-allowed text-fg-dim')}>
        {contenido}
      </div>
    )
  }

  return (
    <a
      href={enlace.url}
      target="_blank"
      rel="me noopener noreferrer"
      className={cn(FILA, 'text-fg hover:bg-violet hover:pl-10 hover:text-fg')}
    >
      {contenido}
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
      <Revelar className="grid gap-3">
        <Eyebrow>06 · Encuéntralo aquí</Eyebrow>
        <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
          Sigue el grind
        </h2>
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
