import { ProveedorEnVivo } from '@/components/directo/proveedor'
import { EnVivo } from '@/components/en-vivo'
import { Hero } from '@/components/sections/hero'
import { Marquesina } from '@/components/sections/marquesina'
import { Contacto } from '@/components/sections/contacto'
import { Galeria } from '@/components/sections/galeria'
import { Historia } from '@/components/sections/historia'
import { Nav } from '@/components/sections/nav'
import { Pie } from '@/components/sections/pie'
import { Publicaciones } from '@/components/sections/publicaciones'
import { Redes } from '@/components/sections/redes'
import { ReelsSeccion } from '@/components/sections/reels'
import { Resultados } from '@/components/sections/resultados'
import { TuMano } from '@/components/sections/tu-mano'
import { estadoManual } from '@/lib/directo'
import { KICK_CHANNEL_SLUG, SITE_URL } from '@/lib/env'
import { enVivo, enlaces, joe } from '@/lib/joe-poker'

/**
 * ISR: la página se regenera cada 30 min para refrescar el feed social. Debe ser
 * un literal y coincidir con `REVALIDAR_SEG` de `lib/social/config.ts`.
 */
export const revalidate = 1800

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

      <ProveedorEnVivo inicial={estadoManual(enVivo, KICK_CHANNEL_SLUG)}>
        <main id="contenido" className="relative overflow-x-clip">
          {/* Aviso de directo: superpuesto bajo la nav fija. El HTML trae solo el
              interruptor manual; el navegador lo corrige con Kick (/api/en-vivo). */}
          <EnVivo />
  
          <Hero />
          <Marquesina />
          <Resultados />
          <TuMano />
          <Historia />
          <ReelsSeccion />
          <Galeria />
          <Publicaciones />
          <Redes />
          <Contacto />
        </main>
      </ProveedorEnVivo>

      <Pie />
    </>
  )
}
