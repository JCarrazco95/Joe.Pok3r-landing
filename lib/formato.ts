import type { Resultado } from '@/lib/joe-poker'

const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

/**
 * Formatea sin `Date`, a propósito.
 *
 * `new Date('2026-09-02')` se interpreta como UTC y al renderizar en un huso
 * al oeste retrocede un día: el torneo del 2 saldría como 1 de septiembre.
 * La cadena ya viene en el formato que necesitamos, así que se parte y ya.
 */
export function fechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.split('-')
  return `${Number(dia)} ${MESES[Number(mes) - 1]} ${anio}`
}

export function ordinal(n: number): string {
  return `${n}.º`
}

/**
 * Parte "$160,000 MXN" en cifra y moneda. Si el formato no es el esperado
 * devuelve todo como cifra: mejor mostrarlo entero que adivinar.
 */
export function partirPremio(premio: string): { cifra: string; moneda?: string } {
  const m = /^(\S+)\s+([A-Z]{3})$/.exec(premio)
  return m?.[1] ? { cifra: m[1], moneda: m[2] } : { cifra: premio }
}

/**
 * Parte una cifra de `joe.stats` ("6.º", "$160K", "9/112") en prefijo, número y
 * sufijo, para animar sólo el número. Sin dígitos, no hay nada que contar.
 */
export function partirCifra(
  valor: string,
): { prefijo: string; numero: number; sufijo: string } | null {
  const m = /^(\D*)(\d+)(.*)$/.exec(valor)
  return m ? { prefijo: m[1] ?? '', numero: Number(m[2]), sufijo: m[3] ?? '' } : null
}

/**
 * El dato que SÍ se conoce de un torneo, para mostrarlo en grande.
 *
 * Con puesto, el puesto (y el field si lo hay). Sin puesto no se inventa
 * nada: se busca el Day en la nota, y si no hay, el buy-in.
 */
export function resultadoVisible(r: Resultado): {
  principal: string
  sinRegistrar: boolean
} {
  if (r.puesto !== null) {
    return {
      principal: r.field ? `${ordinal(r.puesto)} de ${r.field}` : ordinal(r.puesto),
      sinRegistrar: false,
    }
  }
  const dia = r.nota ? /Day \d+[A-Z]?/.exec(r.nota)?.[0] : undefined
  return { principal: dia ?? r.buyIn ?? 'Sin registrar', sinRegistrar: true }
}
