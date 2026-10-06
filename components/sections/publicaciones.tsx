import { Suspense } from 'react'

import { EsqueletoMuro } from '@/components/feed/estados'
import { Muro } from '@/components/feed/muro'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { Seccion } from '@/components/ui/section'
import { obtenerFeed } from '@/lib/social'
import type { RespuestaSocial } from '@/lib/social/types'

/**
 * Lee el feed en el servidor (ISR de la página; no hay fetch al propio
 * /api/social). `obtenerFeed` no lanza, pero si algo se escapara la sección se
 * degrada a "vacío con error" en vez de tumbar la página.
 */
async function MuroConDatos() {
  let feed: RespuestaSocial | null = null
  try {
    feed = await obtenerFeed()
  } catch {
    feed = null
  }
  return <Muro posts={feed?.posts ?? []} fuentes={feed?.fuentes ?? []} error={feed === null} />
}

export function Publicaciones() {
  return (
    <Seccion id="publicaciones" className="grid gap-10 pb-[clamp(48px,6vw,80px)]">
      <Revelar className="grid gap-3">
        <Eyebrow>06 · Últimas publicaciones</Eyebrow>
        <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
          Lo último
        </h2>
      </Revelar>

      <Suspense fallback={<EsqueletoMuro />}>
        <MuroConDatos />
      </Suspense>
    </Seccion>
  )
}
