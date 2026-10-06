import { cn } from '@/lib/utils'

/** Tarjeta de superficie: borde fino, radio de 20px. */
export function Tarjeta({
  destacada,
  className,
  ...props
}: { destacada?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-surface-2',
        destacada && 'shadow-feature',
        className,
      )}
      {...props}
    />
  )
}
