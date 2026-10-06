import { IconoRed } from '@/components/icons'
import { Boton } from '@/components/ui/button'
import { Tarjeta } from '@/components/ui/card'
import { enlaces } from '@/lib/joe-poker'

/** Redes donde se publica: las que se ofrecen cuando no hay nada que mostrar. */
const REDES_QUE_SE_SIGUEN = new Set(['instagram', 'tiktok', 'youtube', 'kick', 'twitch'])

/**
 * Esqueleto del muro mientras llegan los datos. Mantiene la forma de las
 * tarjetas para que la página no salte al cargar; el pulso se apaga con
 * `prefers-reduced-motion`.
 */
export function EsqueletoMuro({ cantidad = 6 }: { cantidad?: number }) {
  return (
    <div role="status" aria-busy="true" aria-label="Cargando publicaciones">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cantidad }, (_, i) => (
          <li key={i}>
            <Tarjeta className="overflow-hidden motion-safe:animate-pulse">
              <div className="aspect-video bg-surface" />
              <div className="grid gap-3 p-5">
                <div className="h-4 w-11/12 rounded-full bg-line" />
                <div className="h-4 w-2/3 rounded-full bg-line" />
                <div className="mt-2 h-3 w-1/4 rounded-full bg-line" />
              </div>
            </Tarjeta>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Sin publicaciones: o la red no tiene nada todavía, o la carga falló (`error`).
 * En los dos casos la salida es la misma: ir a las redes.
 */
export function EstadoVacio({ error }: { error?: boolean }) {
  const redes = enlaces.filter(
    (e) => e.url && !e.url.startsWith('#') && REDES_QUE_SE_SIGUEN.has(e.icono),
  )

  return (
    <Tarjeta className="grid justify-items-center gap-6 px-6 py-14 text-center sm:py-20">
      <div className="grid gap-2">
        <p className="font-display text-[clamp(32px,4vw,52px)] uppercase leading-none">
          Aún no hay publicaciones
        </p>
        <p className="mx-auto max-w-[46ch] text-[15px] text-fg-muted">
          {error
            ? 'No pudimos cargar las publicaciones en este momento. Mientras tanto, lo encuentras directo en sus redes.'
            : 'Cuando haya algo nuevo aparecerá aquí. Mientras tanto, síguelo en sus redes.'}
        </p>
      </div>
      <ul className="flex flex-wrap justify-center gap-3">
        {redes.map((e) => (
          <li key={e.id}>
            <Boton
              href={e.url ?? '#'}
              target="_blank"
              rel="me noopener noreferrer"
              variante="contorno"
              tamano="sm"
            >
              <IconoRed nombre={e.icono} className="mr-2 size-4" aria-hidden />
              {e.etiqueta}
            </Boton>
          </li>
        ))}
      </ul>
    </Tarjeta>
  )
}
