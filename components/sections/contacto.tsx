'use client'

import { useState } from 'react'

import { Boton } from '@/components/ui/button'
import { Revelar } from '@/components/ui/reveal'
import { enviarContacto } from '@/lib/contacto'

const CAMPO =
  'w-full rounded-[14px] border-2 border-transparent bg-canvas/85 px-5 py-[18px] text-base text-fg outline-none placeholder:text-fg-dim focus:border-fg'

/**
 * Bloque violeta de contacto y patrocinios. El envío está aislado en
 * `lib/contacto.ts`, que hoy no manda nada: ver ahí antes de publicar.
 */
export function Contacto() {
  const [estado, setEstado] = useState<'inicial' | 'enviando' | 'enviado' | 'error'>('inicial')

  async function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    setEstado('enviando')
    try {
      await enviarContacto({
        nombre: String(datos.get('nombre') ?? ''),
        correo: String(datos.get('correo') ?? ''),
        propuesta: String(datos.get('propuesta') ?? ''),
      })
      setEstado('enviado')
    } catch {
      setEstado('error')
    }
  }

  return (
    <section id="contacto" className="scroll-mt-[70px] px-[clamp(20px,4vw,56px)] pb-[clamp(72px,9vw,120px)]">
      <Revelar>
        <div className="relative mx-auto grid max-w-[1360px] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-12 overflow-hidden rounded-panel bg-violet p-[clamp(32px,6vw,80px)]">
          <div
            aria-hidden
            className="absolute -right-[120px] -top-[120px] size-[420px] rounded-full [background:repeating-conic-gradient(rgb(250_250_250/0.16)_0_20deg,transparent_20deg_45deg)] motion-safe:animate-giro-lento"
          />

          <div className="relative grid content-start gap-[18px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.3em]">08 · Contacto</span>
            <h2 className="font-display text-[clamp(64px,8vw,120px)] font-normal uppercase leading-[0.85]">
              Patrocinios,
              <br />
              staking y prensa
            </h2>
            <p className="max-w-[420px] text-[17px] leading-[1.6]">
              Colaboraciones con salas, marcas y medios. Escríbeme y te contesto.
            </p>
          </div>

          {estado === 'enviado' ? (
            <div
              role="status"
              className="relative grid content-center justify-items-start gap-2.5 rounded-card bg-canvas/85 p-10"
            >
              <span className="font-display text-[clamp(44px,5vw,64px)] leading-[0.9]">
                ¡Fichas al centro!
              </span>
              <span className="text-base text-fg-2">Mensaje recibido. Te respondo pronto.</span>
            </div>
          ) : (
            <form onSubmit={alEnviar} className="relative grid content-start gap-3.5">
              <label className="sr-only" htmlFor="c-nombre">
                Nombre
              </label>
              <input id="c-nombre" name="nombre" required autoComplete="name" placeholder="Nombre" className={CAMPO} />
              <label className="sr-only" htmlFor="c-correo">
                Correo
              </label>
              <input
                id="c-correo"
                name="correo"
                type="email"
                required
                autoComplete="email"
                placeholder="Correo"
                className={CAMPO}
              />
              <label className="sr-only" htmlFor="c-propuesta">
                Propuesta
              </label>
              <textarea
                id="c-propuesta"
                name="propuesta"
                rows={4}
                placeholder="Cuéntame la propuesta"
                className={`${CAMPO} resize-y`}
              />
              <Boton
                type="submit"
                variante="claro"
                tamano="lg"
                magnetico
                disabled={estado === 'enviando'}
                className="justify-self-start px-8 py-[18px] hover:shadow-[0_0_0_6px_rgb(250_250_250/0.25)]"
              >
                Enviar · All-in →
              </Boton>
              {estado === 'error' ? (
                <p role="alert" className="text-sm font-semibold">
                  No se pudo enviar. Inténtalo de nuevo en un momento.
                </p>
              ) : null}
            </form>
          )}
        </div>
      </Revelar>
    </section>
  )
}
