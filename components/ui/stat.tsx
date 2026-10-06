import { cn } from '@/lib/utils'

import { CuentaHasta } from './count-up'

/**
 * Cifra grande + etiqueta. Si `valor` es un número se anima al entrar en
 * pantalla; si es texto ("6.º", "9/112") se pinta tal cual: el contador sólo
 * tiene sentido para cantidades.
 */
export function Cifra({
  valor,
  sufijo,
  etiqueta,
  nota,
  className,
}: {
  valor: string | number
  sufijo?: string
  etiqueta: string
  nota?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="font-display text-[clamp(44px,5vw,72px)] leading-none text-fg">
        {typeof valor === 'number' ? <CuentaHasta hasta={valor} /> : valor}
        {sufijo}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-violet-soft">
        {etiqueta}
      </span>
      {nota ? <span className="text-xs text-fg-muted">{nota}</span> : null}
    </div>
  )
}
