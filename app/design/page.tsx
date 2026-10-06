import type { Metadata } from 'next'

import { Boton } from '@/components/ui/button'
import { Tarjeta } from '@/components/ui/card'
import { Chip, Insignia } from '@/components/ui/chip'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { Seccion, TituloSeccion } from '@/components/ui/section'
import { Cifra } from '@/components/ui/stat'
import { InsigniaPalo, type PaloId } from '@/components/ui/suit-badge'

/** Catálogo interno del sistema de diseño. No se indexa. */
export const metadata: Metadata = {
  title: 'Sistema de diseño',
  robots: { index: false, follow: false },
}

const colores = [
  ['canvas', 'bg-canvas', '#0b0b0d'],
  ['surface', 'bg-surface', '#131316'],
  ['surface-2', 'bg-surface-2', '#18181b'],
  ['line', 'bg-line', '#27272a'],
  ['line-strong', 'bg-line-strong', '#3f3f46'],
  ['fg', 'bg-fg', '#fafafa'],
  ['fg-2', 'bg-fg-2', '#d4d4d8'],
  ['fg-muted', 'bg-fg-muted', '#a1a1aa'],
  ['fg-dim', 'bg-fg-dim', '#71717a'],
  ['violet', 'bg-violet', '#8b5cf6'],
  ['violet-deep', 'bg-violet-deep', '#7c3aed'],
  ['violet-soft', 'bg-violet-soft', '#a78bfa'],
  ['ruby', 'bg-ruby', '#d6334b'],
  ['rose', 'bg-rose', '#f08a99'],
  ['azure', 'bg-azure', '#3b6fe0'],
  ['ember', 'bg-ember', '#c2410c'],
] as const

const palos: PaloId[] = ['heart', 'spade', 'club', 'diamond']

function Bloque({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-14">
      <h3 className="mb-5 border-b border-line pb-3 text-xs font-bold uppercase tracking-[0.2em] text-fg-muted">
        {titulo}
      </h3>
      {children}
    </div>
  )
}

export default function DisenoPage() {
  return (
    <main id="contenido" className="bg-canvas text-fg">
      <Seccion>
        <TituloSeccion eyebrow="Fichas 3D · fase 1">
          Sistema de diseño
        </TituloSeccion>

        <Bloque titulo="Color">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {colores.map(([nombre, clase, hex]) => (
              <li key={nombre} className="flex flex-col gap-2">
                <span
                  className={`${clase} h-16 rounded-photo border border-line-strong`}
                />
                <span className="text-xs font-semibold">{nombre}</span>
                <span className="text-[0.7rem] text-fg-dim">{hex}</span>
              </li>
            ))}
          </ul>
        </Bloque>

        <Bloque titulo="Tipografía">
          <div className="flex flex-col gap-6">
            <p className="font-display text-[clamp(96px,15vw,232px)] leading-[0.84]">
              JOE.POK<span className="text-violet">3</span>R
            </p>
            <p className="font-display text-[clamp(64px,8vw,120px)] uppercase leading-[0.85]">
              Título de sección
            </p>
            <Eyebrow vivo>Joe Vega · Texas Hold’em · México</Eyebrow>
            <p className="max-w-[60ch] text-pretty text-[1.05rem] leading-relaxed text-fg-2">
              Cuerpo en Mont 500. Más de 20 años en las mesas, siempre por
              gusto. Torneos y cash, en vivo y en línea.
            </p>
            <p className="text-sm font-semibold text-fg-muted">
              Mont 600 · etiquetas
              <span className="mx-3 text-fg-dim">·</span>
              <span className="font-bold">Mont 700 · botones</span>
            </p>
          </div>
        </Bloque>

        <Bloque titulo="Botones">
          <div className="flex flex-wrap items-center gap-4">
            <Boton variante="primario">Patrocinios</Boton>
            <Boton variante="claro">Ver resultados</Boton>
            <Boton variante="contorno">Reparte una mano ♠</Boton>
            <Boton variante="primario" tamano="sm">
              Pequeño
            </Boton>
            <Boton variante="primario" tamano="lg">
              Grande
            </Boton>
            <Boton variante="primario" disabled>
              Deshabilitado
            </Boton>
            <Boton variante="contorno" href="#colores-tarjetas">
              Como enlace
            </Boton>
          </div>
        </Bloque>

        <Bloque titulo="Chips e insignias">
          <div className="flex flex-wrap items-center gap-3">
            <Chip activo>Todas</Chip>
            <Chip>WSOP Circuit</Chip>
            <Chip>WSOP Las Vegas</Chip>
            <Chip>High Roller</Chip>
            <Insignia>Violeta</Insignia>
            <Insignia tono="rojo">Destacado · 31 ago 2026</Insignia>
            <Insignia tono="neutro">Neutro</Insignia>
          </div>
        </Bloque>

        <Bloque titulo="Palos">
          <div className="flex gap-3">
            {palos.map((p) => (
              <InsigniaPalo key={p} palo={p} />
            ))}
          </div>
        </Bloque>

        <Bloque titulo="Cifras (la numérica cuenta al entrar en pantalla)">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <Cifra valor="6.º" etiqueta="Lugar" nota="High Roller 2.5M GTD" />
            <Cifra valor={160} sufijo="K" etiqueta="Premio" />
            <Cifra valor="9/112" etiqueta="Mesa final" />
            <Cifra valor={20} sufijo="+" etiqueta="Años" />
          </div>
        </Bloque>

        <Bloque titulo="Tarjetas y revelado">
          <div
            id="colores-tarjetas"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <Revelar>
              <Tarjeta className="p-6">
                <h4 className="font-display text-3xl">Tarjeta</h4>
                <p className="mt-2 text-sm text-fg-muted">
                  Superficie, borde fino y radio de 20px.
                </p>
              </Tarjeta>
            </Revelar>
            <Revelar retraso={120}>
              <Tarjeta destacada className="p-6">
                <h4 className="font-display text-3xl">Destacada</h4>
                <p className="mt-2 text-sm text-fg-muted">
                  Con la sombra grande de 80px.
                </p>
              </Tarjeta>
            </Revelar>
            <Revelar retraso={240}>
              <Tarjeta className="p-6 shadow-glow">
                <h4 className="font-display text-3xl">Brillo</h4>
                <p className="mt-2 text-sm text-fg-muted">
                  Glow violeta, para el hover.
                </p>
              </Tarjeta>
            </Revelar>
          </div>
        </Bloque>
      </Seccion>
    </main>
  )
}
