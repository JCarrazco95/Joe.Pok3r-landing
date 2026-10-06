import { Gallery } from '@/components/gallery'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { Seccion } from '@/components/ui/section'
import { galeria } from '@/lib/joe-poker'

export function Galeria() {
  return (
    <Seccion id="galeria" className="pt-[clamp(96px,11vw,140px)]">
      <Revelar>
        <Gallery fotos={galeria}>
          <div className="grid gap-3">
            <Eyebrow>05 · Galería</Eyebrow>
            <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
              En la mesa
            </h2>
          </div>
        </Gallery>
      </Revelar>
    </Seccion>
  )
}
