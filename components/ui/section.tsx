import { cn } from '@/lib/utils'

import { Eyebrow } from './eyebrow'

/**
 * Contenedor de sección: ancho máximo 1360, gutter fluido y la separación
 * vertical del diseño. `id` es el ancla de la nav; `scroll-mt` deja sitio a la
 * barra fija de 72px.
 */
export function Seccion({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'mx-auto w-full max-w-[1360px] scroll-mt-[70px] px-[clamp(20px,4vw,56px)] py-[clamp(72px,10vw,130px)]',
        className,
      )}
    >
      {children}
    </section>
  )
}

/** Eyebrow + título display. El h2 usa Bebas a `clamp(64px, 8vw, 120px)`. */
export function TituloSeccion({
  eyebrow,
  children,
  className,
}: {
  eyebrow?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn('mb-12 flex flex-col gap-4', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85] text-fg">
        {children}
      </h2>
    </header>
  )
}
