import { cn } from '@/lib/utils'

/** Pastilla de filtro. Activa = violeta pleno. Es un <button>: va en un grupo. */
export function Chip({
  activo,
  className,
  ...props
}: { activo?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200',
        activo
          ? 'border-violet bg-violet text-fg'
          : 'border-line bg-surface text-fg-2 hover:border-violet-soft hover:text-violet-soft',
        className,
      )}
      {...props}
    />
  )
}

/** Etiqueta informativa, no interactiva. */
export function Insignia({
  tono = 'violeta',
  className,
  children,
}: {
  tono?: 'violeta' | 'rojo' | 'neutro'
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em]',
        tono === 'violeta' && 'bg-violet/15 text-violet-soft',
        tono === 'rojo' && 'bg-ruby text-fg',
        tono === 'neutro' && 'bg-line text-fg-2',
        className,
      )}
    >
      {children}
    </span>
  )
}
