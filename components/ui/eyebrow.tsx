import { cn } from '@/lib/utils'

/** Etiqueta sobre un título: 13px, 700, mayúsculas con mucho tracking. */
export function Eyebrow({
  children,
  vivo,
  className,
}: {
  children: React.ReactNode
  /** Punto rojo parpadeante, para "en vivo" o el hero. */
  vivo?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex items-center gap-3 text-[0.8rem] font-bold uppercase tracking-[0.3em] text-violet-soft',
        className,
      )}
    >
      {vivo ? (
        <i
          aria-hidden
          className="size-[9px] shrink-0 rounded-full bg-ruby motion-safe:animate-pulse"
        />
      ) : null}
      {children}
    </span>
  )
}
