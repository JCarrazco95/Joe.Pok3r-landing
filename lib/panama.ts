/**
 * Cuenta regresiva al arranque del torneo. `ahora` y `inicio` se comparan como
 * instantes: el huso de `inicio` (-05:00) no hace falta convertirlo.
 */
export function cuentaRegresiva(inicio: string, ahora: number) {
  const ms = new Date(inicio).getTime() - ahora
  const t = Math.max(0, ms)
  const dos = (n: number) => String(n).padStart(2, '0')
  return {
    /** `true` desde que arranca: la cuenta cede su lugar al estado de Joe. */
    vivo: ms <= 0,
    dias: dos(Math.floor(t / 864e5)),
    horas: dos(Math.floor(t / 36e5) % 24),
    minutos: dos(Math.floor(t / 6e4) % 60),
  }
}

/** Un dato vacío se lee "—": falta el dato, no vale cero. */
export const dato = (v: string) => v.trim() || '—'

/**
 * Suma premios en USD ("$4,220 USD"). Si alguno falta o viene en otra moneda
 * devuelve `null`: mejor no mostrar un total que sumar monedas distintas.
 */
export function totalUSD(premios: readonly (string | undefined)[]): number | null {
  let total = 0
  for (const p of premios) {
    const m = p ? /^\$([\d,]+(?:\.\d+)?)\s+USD$/.exec(p) : null
    if (!m?.[1]) return null
    total += Number(m[1].replace(/,/g, ''))
  }
  return premios.length ? total : null
}
