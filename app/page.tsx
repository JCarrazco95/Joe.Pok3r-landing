import { EnVivo } from '@/components/en-vivo'
import { Hero } from '@/components/sections/hero'
import { Marquesina } from '@/components/sections/marquesina'
import { Galeria } from '@/components/sections/galeria'
import { Historia } from '@/components/sections/historia'
import { Nav } from '@/components/sections/nav'
import { Pie } from '@/components/sections/pie'
import { ReelsSeccion } from '@/components/sections/reels'
import { Resultados } from '@/components/sections/resultados'
import { TuMano } from '@/components/sections/tu-mano'
import { SITE_URL } from '@/lib/env'
import { enVivo, enlaces, joe } from '@/lib/joe-poker'

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

export default function JoePokerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      <main id="contenido" className="overflow-x-clip">
        {/* Aviso de "jugando ahora": arriba del hero, bajo la nav fija. */}
        {enVivo.activo ? (
          <div className="px-4 pt-[88px]">
            <EnVivo />
          </div>
        ) : null}

        <Hero />
        <Marquesina />
        <Resultados />
        <TuMano />
        <Historia />
        <ReelsSeccion />
        <Galeria />
      </main>

      <Pie />
    </>
  )
}
