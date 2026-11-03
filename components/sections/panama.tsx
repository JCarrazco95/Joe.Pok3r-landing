'use client'

import Image from 'next/image'

import { CeldasCuenta, ESTADO, EstadoPanama, SelloPanama, useCuentaRegresiva } from '@/components/panama/panama-ui'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Revelar } from '@/components/ui/reveal'
import { PANAMA, panamaEstado } from '@/lib/joe-poker'
import { dato } from '@/lib/panama'
import { cn } from '@/lib/utils'

/** Las cuatro cifras de la sección. Sin dato salen en gris, con "—". */
const CELDAS = [
  { k: 'EVENTO', v: PANAMA.evento, sub: `Buy-in ${PANAMA.buyIn}` },
  { k: 'VUELO', v: PANAMA.dia, sub: '5 nov · 11:00' },
  { k: 'STACK', v: PANAMA.stack, sub: PANAMA.field ? `${PANAMA.field} inscritos` : 'Se actualiza en los breaks' },
  { k: 'PUESTO', v: PANAMA.puesto, sub: PANAMA.premio || 'Al cierre del día' },
]

/**
 * Sección #panama (modo Panamá): título con el sello de la bandera, cuenta
 * regresiva grande junto a la imagen del anillo, cuatro datos y, cuando lleguen,
 * las fotos "Desde la mesa". Va entre el hero y Redes.
 */
export function Panama() {
  const cuenta = useCuentaRegresiva()
  const enJuego = panamaEstado !== 'previa'

  return (
    <section
      id="panama"
      className="relative scroll-mt-[70px] overflow-hidden border-b border-line bg-[radial-gradient(ellipse_50%_60%_at_100%_0%,rgb(214_51_75/0.18),transparent_70%),radial-gradient(ellipse_45%_55%_at_0%_100%,rgb(59_111_224/0.18),transparent_70%)]"
    >
      <div className="mx-auto grid max-w-[1360px] gap-[clamp(56px,7vw,96px)] px-[clamp(20px,4vw,56px)] pb-[130px] pt-[clamp(110px,12vw,160px)]">
        <Revelar className="grid gap-[22px]">
          <div className="flex flex-wrap items-center gap-3.5">
            <Eyebrow className="tracking-[0.3em] text-rose">
              {enJuego ? 'En vivo · Ciudad de Panamá' : PANAMA.ciudad}
            </Eyebrow>
            <EstadoPanama className="px-3 py-1.5" />
          </div>
          <div className="flex flex-wrap items-center gap-[clamp(16px,2.4vw,32px)]">
            <SelloPanama tam={76} />
            <h2 className="pt-[0.06em] font-display text-[clamp(84px,11vw,176px)] font-normal uppercase leading-[0.82]">
              Panamá
            </h2>
          </div>
          <span className="text-base font-semibold text-fg-muted">
            {PANAMA.serie} · {PANAMA.sede} · {PANAMA.fechas}
          </span>
        </Revelar>

        <Revelar className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-6">
          <div className="grid content-between gap-7 rounded-3xl border border-line bg-surface p-[clamp(28px,3.4vw,44px)]">
            <div className="grid gap-2">
              <span className="text-xs font-bold tracking-[0.24em] text-rose">
                {cuenta?.vivo ? 'MINI MAIN · FLIGHT A' : 'MINI MAIN · FLIGHT A ARRANCA EN'}
              </span>
              <span className="text-[15px] text-fg-muted">5 nov · 11:00 hora de Panamá</span>
            </div>
            {cuenta === null ? (
              <div aria-hidden className="h-[clamp(120px,12vw,180px)]" />
            ) : cuenta.vivo ? (
              <span
                style={{ color: ESTADO.color }}
                className="font-display text-[clamp(80px,9vw,140px)] leading-[0.85]"
              >
                {ESTADO.label}
              </span>
            ) : (
              <CeldasCuenta cuenta={cuenta} grande />
            )}
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-line bg-surface">
            <Image
              src={PANAMA.anillo.src}
              alt="WSOP · anillo del Circuit"
              fill
              sizes="(min-width: 1100px) 50vw, 100vw"
              className="object-cover [object-position:center_40%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/90 to-transparent px-[26px] pb-[22px] pt-10">
              <span className="text-xs font-bold tracking-[0.2em] text-fg-2">{PANAMA.anillo.pie}</span>
            </div>
          </div>
        </Revelar>

        <Revelar>
          <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[clamp(24px,3vw,48px)]">
            {CELDAS.map((c) => (
              <div
                key={c.k}
                className={cn('grid content-start gap-2.5 border-t-2 pt-5', c.v ? 'border-ruby' : 'border-line')}
              >
                <dt className="text-xs font-bold tracking-[0.2em] text-fg-dim">{c.k}</dt>
                <dd
                  className={cn(
                    'font-display text-[clamp(36px,3.4vw,48px)] leading-[0.95]',
                    c.v ? 'text-fg' : 'text-[#52525b]',
                  )}
                >
                  {dato(c.v)}
                </dd>
                <span className="text-sm text-fg-muted">{c.sub}</span>
              </div>
            ))}
          </dl>
        </Revelar>

        {PANAMA.fotos.length > 0 ? (
          <Revelar className="grid gap-5">
            <Eyebrow>Desde la mesa</Eyebrow>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
              {PANAMA.fotos.map((f) => (
                <div key={f.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1100px) 33vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          </Revelar>
        ) : null}
      </div>
    </section>
  )
}
