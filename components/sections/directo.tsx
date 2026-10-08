import { DirectoConectado } from '@/components/directo/panel-directo'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { Seccion } from '@/components/ui/section'
import { obtenerFeed } from '@/lib/social'
import type { PostSocial } from '@/lib/social/types'

/**
 * Clips de Kick para cuando no hay directo. Salen del feed (hoy, de la lista
 * manual: Kick no tiene endpoint público de clips). `obtenerFeed` no lanza, pero
 * si algo se escapara la sección sigue en pie, solo sin clips.
 */
async function clipsDeKick(): Promise<{ clips: PostSocial[]; manuales: boolean }> {
  try {
    const feed = await obtenerFeed()
    const clips = feed.posts.filter((p) => p.red === 'kick')
    const manuales = feed.fuentes.some((f) => f.red === 'kick' && f.origen === 'manual')
    return { clips, manuales }
  } catch {
    return { clips: [], manuales: false }
  }
}

/**
 * «En directo»: el HTML es ISR, así que el estado lo decide el navegador con
 * `/api/en-vivo` (ver `ProveedorEnVivo`). El reproductor de Kick solo se monta
 * cuando el visitante lo pide.
 */
export async function Directo() {
  const { clips, manuales } = await clipsDeKick()

  return (
    <Seccion id="directo" className="grid gap-10 pb-[clamp(24px,4vw,48px)]">
      <Revelar className="grid gap-3">
        <Eyebrow vivo>Kick · Canal de Joe</Eyebrow>
        <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
          En directo
        </h2>
      </Revelar>

      <DirectoConectado clips={clips} clipsManuales={manuales} />
    </Seccion>
  )
}
