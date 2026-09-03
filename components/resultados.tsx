import { resultados } from '@/lib/joe-poker'
import { cn } from '@/lib/utils'

const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

/**
 * Formatea sin `Date`, a propósito.
 *
 * `new Date('2026-09-02')` se interpreta como UTC y al renderizar en un huso
 * al oeste retrocede un día: el torneo del 2 saldría como 1 de septiembre.
 * La cadena ya viene en el formato que necesitamos, así que se parte y ya.
 */
function fechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.split('-')
  return `${Number(dia)} ${MESES[Number(mes) - 1]} ${anio}`
}

function ordinal(n: number): string {
  return `${n}.º`
}

/**
 * Historial de resultados.
 *
 * La distinción que carga toda la sección: un torneo sin `puesto` NO es un
 * torneo sin cobro, es uno cuyo resultado no se ha registrado. Se dice con
 * palabras ("Sin registrar") en vez de con un guion, porque un guion en una
 * tabla de resultados se lee como cero.
 */
export function Resultados() {
  if (resultados.length === 0) return null

  const cobros = resultados.filter((r) => r.puesto !== null)

  return (
    <div className="flex flex-col gap-2.5">
      {resultados.map((r) => {
        const cobro = r.puesto !== null
        return (
          <article
            key={`${r.fecha}-${r.torneo}`}
            className={cn(
              'joe-panel flex items-start gap-3.5 rounded-xl px-4 py-3.5',
              cobro && 'border-[var(--stroke)]',
            )}
          >
            {/* El puesto manda: es lo primero que busca quien lee esto. */}
            <div className="flex w-14 shrink-0 flex-col items-center pt-0.5">
              {cobro ? (
                <span className="font-[family-name:var(--font-display)] text-2xl leading-none text-[var(--accent-bright)]">
                  {ordinal(r.puesto as number)}
                </span>
              ) : (
                <span className="text-center text-[0.6rem] uppercase leading-tight tracking-[0.08em] text-[var(--ink-muted)]">
                  Sin registrar
                </span>
              )}
              {r.field ? (
                <span className="mt-1 text-[0.65rem] tabular-nums text-[var(--ink-muted)]">
                  de {r.field}
                </span>
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[0.95rem] leading-tight text-[var(--ink)]">
                {r.torneo}
              </h3>
              <p className="mt-1 text-xs leading-snug text-[var(--ink-muted)]">
                {r.serie ? (
                  <>
                    {r.serie}
                    <span className="mx-1.5 text-[var(--sep)]">·</span>
                  </>
                ) : null}
                {r.sede}
              </p>
              <p className="mt-1.5 text-[0.7rem] leading-snug text-[var(--ink-muted)]">
                {fechaCorta(r.fecha)}
                {r.buyIn ? (
                  <>
                    <span className="mx-1.5 text-[var(--sep)]">·</span>
                    Buy-in {r.buyIn}
                  </>
                ) : null}
              </p>
              {r.nota ? (
                <p className="mt-1.5 text-xs leading-snug text-[var(--ink-muted)]/80">
                  {r.nota}
                </p>
              ) : null}
            </div>

            {r.premio ? (
              <div className="shrink-0 pt-0.5 text-right">
                <span className="font-[family-name:var(--font-display)] text-xl leading-none text-[var(--accent-bright)]">
                  {r.premio}
                </span>
              </div>
            ) : null}
          </article>
        )
      })}

      <p className="mt-1 px-1 text-center text-xs leading-relaxed text-[var(--ink-muted)]">
        {cobros.length === 1
          ? 'Un cobro registrado.'
          : `${cobros.length} cobros registrados.`}{' '}
        El historial se está armando: los torneos sin puesto son partidas
        jugadas cuyo resultado todavía no se captura.
      </p>
    </div>
  )
}
