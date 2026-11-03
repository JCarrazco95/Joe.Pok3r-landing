'use client'

import { useEffect, useRef, useState } from 'react'

import { useEnPantalla, useReduceMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

const DIGITOS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * Cifra tipo tragamonedas: cada dígito es una columna del 0 al 9 que rueda hasta
 * su valor al entrar en pantalla (1.8s, con un desfase por dígito). Lo que no es
 * dígito ("$", ",", ".º") se queda fijo.
 *
 * Hasta que el navegador hidrata, y siempre con reduced-motion, se ve el texto
 * plano: sin JS no queda un 0 donde iba un puesto. El lector de pantalla lee el
 * texto real, no las columnas.
 *
 * `desfase` (s) escalona varias cifras entre sí.
 */
export function Odometro({
  texto,
  desfase = 0,
  className,
}: {
  texto: string
  desfase?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducir = useReduceMotion()
  const visible = useEnPantalla(ref, 0.4)
  const [montado, setMontado] = useState(false)
  const [rodando, setRodando] = useState(false)

  useEffect(() => setMontado(true), [])

  // Un breve retardo tras entrar en pantalla, y ya no vuelve a empezar.
  useEffect(() => {
    if (!visible || rodando) return
    const id = setTimeout(() => setRodando(true), 300)
    return () => clearTimeout(id)
  }, [visible, rodando])

  const plano = reducir || !montado

  return (
    <span ref={ref} className={cn('block', className)}>
      <span className="sr-only">{texto}</span>
      {plano ? (
        <span aria-hidden className="block">
          {texto}
        </span>
      ) : (
        <span aria-hidden className="flex h-[1em] items-start overflow-hidden leading-none">
          {[...texto].map((ch, i) => {
            if (!/\d/.test(ch)) {
              return (
                <span key={i} className="block h-[1em]">
                  {ch}
                </span>
              )
            }
            return (
              <span key={i} className="block h-[1em] overflow-hidden">
                <span
                  className="grid"
                  style={{
                    transform: `translateY(${rodando ? -Number(ch) * 10 : 0}%)`,
                    transition: `transform 1800ms cubic-bezier(0.2, 0.9, 0.2, 1) ${desfase + i * 0.12}s`,
                  }}
                >
                  {DIGITOS.map((d) => (
                    <span key={d} className="block h-[1em]">
                      {d}
                    </span>
                  ))}
                </span>
              </span>
            )
          })}
        </span>
      )}
    </span>
  )
}
