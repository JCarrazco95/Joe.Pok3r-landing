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
