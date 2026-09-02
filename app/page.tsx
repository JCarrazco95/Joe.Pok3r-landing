import { MapPin } from 'lucide-react'
import Image from 'next/image'

import { EnVivo } from '@/components/en-vivo'
import { Gallery } from '@/components/gallery'
import { Palo } from '@/components/icons'
import { LinkRow } from '@/components/link-row'
import { Reels } from '@/components/reels'
import { SITE_URL } from '@/lib/env'
import { enlaces, galeria, joe, reels } from '@/lib/joe-poker'

/** Datos estructurados para Google y para las tarjetas enriquecidas. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: joe.nombre,
  alternateName: joe.alias,
  jobTitle: joe.rol,
  description: joe.bio,
  image: `${SITE_URL}/avatar.webp`,
  url: SITE_URL,
  nationality: joe.ubicacion,
  sameAs: enlaces.flatMap((e) => (e.url ? [e.url] : [])),
}

/** Cenefa de palos: separa secciones sin meter una línea más. */
function Cenefa() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center gap-3 text-[var(--accent)]/45"
    >
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--stroke)]" />
      <Palo palo="spade" className="size-3" />
      <Palo palo="heart" className="size-3" />
      <Palo palo="diamond" className="size-3" />
      <Palo palo="club" className="size-3" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--stroke)]" />
    </div>
  )
}

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-center text-[0.7rem] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
      {children}
    </h2>
  )
}

export default function JoePokerPage() {
  return (
    <main id="contenido" className="px-4 pb-16 pt-10 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------- Hero ---------- */}
      <EnVivo />

      <header className="mx-auto flex max-w-lg flex-col items-center text-center">
        {/*
          El logo ES el titular: por eso va dentro del h1 y su texto accesible
          sale del alt. Antes aquí había un h1 escrito en Bebas Neue y un par de
          jotas tapadas; las dos cosas repetían lo que el letrero ya dice.
        */}
        <h1 className="w-full max-w-[20rem] sm:max-w-[24rem]">
          <Image
            src={joe.logo}
            alt={joe.alias}
            width={900}
            height={438}
            sizes="(min-width: 640px) 24rem, 80vw"
            priority
            className="h-auto w-full drop-shadow-[0_12px_28px_rgb(0_0_0_/_0.55)]"
          />
        </h1>

        <div className="joe-chip-ring mt-7 rounded-full p-[3px]">
          <Image
            src={joe.avatar}
            alt={`Retrato de ${joe.nombre}, ${joe.alias}`}
            width={640}
            height={640}
            sizes="128px"
            priority
            className="size-28 rounded-full border-2 border-[var(--ground-deep)] object-cover sm:size-32"
          />
        </div>

        <p className="mt-4 text-sm text-[var(--ink-muted)]">
          {joe.nombre}
          <span className="mx-2 text-[var(--sep)]">·</span>
          {joe.rol}
        </p>

        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--stroke)] bg-[rgb(139_92_246_/_0.08)] px-3 py-1 text-xs text-[var(--accent-bright)]">
          <MapPin aria-hidden className="size-3.5" />
          {joe.ubicacion}
        </p>

        <p className="mt-5 text-pretty text-sm leading-relaxed text-[var(--ink-muted)]">
          {joe.bio}
        </p>
      </header>

      {/* ---------- Resultados ---------- */}
      <section aria-labelledby="resultados" className="mx-auto mt-10 max-w-lg">
        <h2 id="resultados" className="sr-only">
          Resultados destacados
        </h2>

        <dl className="grid grid-cols-3 gap-2 sm:gap-3">
          {joe.stats.map((s) => (
            <div
              key={s.etiqueta}
              className="joe-panel flex flex-col items-center rounded-xl px-2 py-4 text-center"
            >
              <dd className="font-[family-name:var(--font-display)] text-3xl leading-none text-[var(--accent-bright)] sm:text-4xl">
                {s.valor}
              </dd>
              <dt className="mt-2 text-[0.7rem] uppercase tracking-[0.14em] text-[var(--ink)]">
                {s.etiqueta}
              </dt>
              <p className="mt-1 text-[0.65rem] leading-tight text-[var(--ink-muted)]">
                {s.nota}
              </p>
            </div>
          ))}
        </dl>

        <p className="mt-3 text-center text-xs text-[var(--ink-muted)]">
          <span className="text-[var(--ink)]">{joe.logroTitulo}</span>
          <span className="mx-2 text-[var(--sep)]">·</span>
          {joe.logroSede}
        </p>
      </section>

      <div className="my-10">
        <Cenefa />
      </div>

      {/* ---------- La historia, en primera persona ---------- */}
      <section aria-labelledby="historia" className="mx-auto max-w-lg">
        <Titulo>
          <span id="historia">Cómo empecé</span>
        </Titulo>

        <div className="joe-panel rounded-xl px-5 py-5">
          {joe.historia.map((parrafo) => (
            <p
              key={parrafo.slice(0, 24)}
              className="text-pretty text-sm leading-relaxed text-[var(--ink-muted)] [&+p]:mt-3"
            >
              {parrafo}
            </p>
          ))}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--stroke-soft)] pt-4">
            <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              En línea
            </span>
            {joe.plataformas.map((plataforma) => (
              <span
                key={plataforma}
                className="rounded-full border border-[var(--stroke)] bg-[rgb(139_92_246_/_0.08)] px-2.5 py-0.5 text-xs text-[var(--accent-bright)]"
              >
                {plataforma}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="my-10">
        <Cenefa />
      </div>

      {/* ---------- Enlaces (el corazón del Linktree) ---------- */}
      <section aria-labelledby="enlaces" className="mx-auto max-w-lg">
        <Titulo>
          <span id="enlaces">Encuéntralo aquí</span>
        </Titulo>

        <ul className="flex flex-col gap-2.5">
          {enlaces.map((enlace) => (
            <li key={enlace.id}>
              <LinkRow enlace={enlace} />
            </li>
          ))}
        </ul>
      </section>

      <div className="my-10">
        <Cenefa />
      </div>

      {/* ---------- Reels ---------- */}
      <section aria-labelledby="reels" className="mx-auto max-w-3xl">
        <Titulo>
          <span id="reels">Reels</span>
        </Titulo>

        <Reels reels={reels} />

        <p className="mt-1 text-center text-xs text-[var(--ink-muted)]">
          Desliza para ver más. Los clips se cargan sólo al reproducirlos.
        </p>
      </section>

      <div className="my-10">
        <Cenefa />
      </div>

      {/* ---------- Galería ---------- */}
      <section aria-labelledby="galeria" className="mx-auto max-w-3xl">
        <Titulo>
          <span id="galeria">En la mesa</span>
        </Titulo>

        <Gallery fotos={galeria} />

        <p className="mt-4 text-center text-xs text-[var(--ink-muted)]">
          Toca cualquier foto para verla en grande.
        </p>
      </section>

      {/* ---------- Pie ---------- */}
      <footer className="mx-auto mt-14 max-w-lg text-center text-xs text-[var(--ink-muted)]">
        <Cenefa />
        <p className="mt-6">
          © {new Date().getFullYear()} {joe.alias}
        </p>
        <p className="mt-1">
          Contenido operado por{' '}
          <span className="text-[var(--ink)]">Analy·sys</span>
        </p>
        <p className="mt-4 text-[0.65rem] leading-relaxed text-[var(--ink-muted)]/70">
          Contenido sobre poker deportivo. Juega con responsabilidad: sólo
          mayores de 18 años.
        </p>
      </footer>
    </main>
  )
}
