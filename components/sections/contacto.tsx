import { Boton } from '@/components/ui/button'
import { Revelar } from '@/components/ui/reveal'

/**
 * Bloque violeta de contacto y patrocinios. El formulario está fuera hasta que
 * exista un endpoint de envío: `enviarContacto` en `lib/contacto.ts` sigue ahí
 * para reconectarlo.
 */
export function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-[70px] px-[clamp(20px,4vw,56px)] pb-[clamp(72px,9vw,120px)]">
      <Revelar>
        <div className="relative mx-auto grid max-w-[1360px] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-12 overflow-hidden rounded-panel bg-violet p-[clamp(32px,6vw,80px)]">
          <div
            aria-hidden
            className="absolute -right-[120px] -top-[120px] size-[420px] rounded-full [background:repeating-conic-gradient(rgb(250_250_250/0.16)_0_20deg,transparent_20deg_45deg)] motion-safe:animate-giro-lento"
          />

          <div className="relative grid content-start gap-[18px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.3em]">07 · Contacto</span>
            <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
              Patrocinios,
              <br />
              staking y prensa
            </h2>
            <p className="max-w-[420px] text-[17px] leading-[1.6]">
              Colaboraciones con salas, marcas y medios. Escríbeme y te contesto.
            </p>
          </div>

          {/* Formulario oculto hasta tener un endpoint (ver `lib/contacto.ts`): un
              formulario que no envía es peor que no tenerlo. */}
          <div className="relative grid content-center justify-items-start gap-3">
            <Boton
              variante="claro"
              tamano="lg"
              disabled
              className="px-8 py-[18px]"
            >
              Contacto · Próximamente
            </Boton>
          </div>
        </div>
      </Revelar>
    </section>
  )
}
