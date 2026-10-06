import { joe } from '@/lib/joe-poker'

/**
 * Pie: el alias gigante sólo en contorno, el badge +18 con el aviso de juego
 * responsable y el crédito de quien opera el sitio.
 */
export function Pie() {
  return (
    <footer className="overflow-hidden border-t border-line px-[clamp(20px,4vw,56px)] pb-10 pt-14">
      <div className="mx-auto grid max-w-[1360px] gap-9">
        <span
          aria-hidden
          className="whitespace-nowrap font-display text-[clamp(64px,19vw,300px)] leading-[0.8] text-transparent [-webkit-text-stroke:2px_var(--color-line-strong)]"
        >
          {joe.alias.toUpperCase()}
        </span>

        <div className="flex flex-wrap justify-between gap-5 text-[13px] text-fg-dim">
          <p className="flex items-center gap-3">
            <b className="grid size-[34px] shrink-0 place-items-center rounded-full border-2 border-fg-dim font-display text-base font-normal text-fg-muted">
              +18
            </b>
            Contenido sobre poker deportivo. Juega con responsabilidad: sólo mayores de 18 años.
          </p>
          <p>
            © {new Date().getFullYear()} {joe.alias} · Operado por Analy·sys
          </p>
        </div>
      </div>
    </footer>
  )
}
