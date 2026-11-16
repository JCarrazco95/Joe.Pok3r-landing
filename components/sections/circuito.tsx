import { Revelar } from '@/components/ui/reveal'
import { Seccion, TituloSeccion } from '@/components/ui/section'
import { circuito, type ParadaConDatos } from '@/lib/circuito'
import { fechaCorta, resultadoVisible } from '@/lib/formato'
import { cn } from '@/lib/utils'

function Parada({ p }: { p: ParadaConDatos }) {
  return (
    <article className="grid content-start gap-5 rounded-2xl border border-line bg-surface-2 p-6">
      <header className="grid gap-1">
        <span className="text-[13px] font-semibold text-fg-dim">{p.fechas}</span>
        <h3 className="font-display text-[clamp(32px,3vw,40px)] font-normal uppercase leading-[0.95]">
          {p.nombre}
        </h3>
        <span className="text-[13px] text-fg-muted">{p.lugar}</span>
      </header>

      <dl className="grid grid-cols-3 gap-3 border-y border-line py-3 text-center">
        <Dato valor={p.torneos.length} etiqueta="Torneos" />
        <Dato valor={p.cobros} etiqueta="Cobros" />
        <Dato valor={p.reels + p.fotos} etiqueta="Medios" />
      </dl>

      {p.torneos.length ? (
        <ul className="grid">
          {p.torneos.map((r) => {
            const { principal, sinRegistrar } = resultadoVisible(r)
            return (
              <li
                key={`${r.fecha}-${r.torneo}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-3 last:border-b-0"
              >
                <span className="grid gap-0.5">
                  <span className="text-sm font-bold leading-snug">{r.torneo}</span>
                  <span className="text-xs text-fg-dim">{fechaCorta(r.fecha)}</span>
                </span>
                <span className="grid justify-items-end gap-0.5 text-right">
                  <span
                    className={cn(
                      'font-display text-[24px] leading-none',
                      sinRegistrar ? 'text-fg-muted' : 'text-violet-soft',
                    )}
                  >
                    {sinRegistrar ? 'Sin registrar' : principal}
                  </span>
                  {r.premio ? <span className="text-xs text-rose">{r.premio}</span> : null}
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-fg-muted">Todavía sin torneos registrados.</p>
      )}

      {p.pendiente ? <p className="text-xs text-fg-dim">Pendiente: {p.pendiente}</p> : null}
    </article>
  )
}

function Dato({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="grid gap-0.5">
      <dd className="font-display text-[32px] leading-none">{valor}</dd>
      <dt className="text-xs text-fg-muted">{etiqueta}</dt>
    </div>
  )
}

/** Bitácora del circuito: los torneos de Joe agrupados por parada. */
export function Circuito() {
  return (
    <Seccion id="circuito" className="grid gap-12 pt-[clamp(96px,11vw,140px)]">
      <Revelar className="flex flex-wrap items-end justify-between gap-6">
        <TituloSeccion eyebrow="05 · Circuito" className="mb-0">
          Parada
          <br />
          por parada
        </TituloSeccion>
        <p className="max-w-[380px] text-[15px] leading-[1.6] text-fg-muted">
          Lo que pasó en cada torneo de la gira, ordenado por ciudad. Lo que aún no está
          registrado se marca como pendiente.
        </p>
      </Revelar>

      <Revelar>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
          {circuito.map((p) => (
            <Parada key={p.id} p={p} />
          ))}
        </div>
      </Revelar>
    </Seccion>
  )
}
