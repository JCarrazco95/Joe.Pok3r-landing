/**
 * Lógica de "¿Qué haría Joe con tu mano?". Es la `verdict()` del prototipo,
 * sin cambios de criterio: sólo tipada y fuera del componente.
 */

export const RANGOS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const
export const PALOS = ['♠', '♥', '♦', '♣'] as const

export type Rango = (typeof RANGOS)[number]
export type PaloCarta = (typeof PALOS)[number]
export type Carta = { r: Rango; s: PaloCarta }

const NOMBRE_PAR: Record<Rango, string> = {
  A: 'Ases', K: 'Reyes', Q: 'Reinas', J: 'Jotas', '10': 'Dieces', '9': 'Nueves',
  '8': 'Ochos', '7': 'Sietes', '6': 'Seises', '5': 'Cincos', '4': 'Cuatros',
  '3': 'Treses', '2': 'Doses',
}

const BROADWAY: Rango[] = ['A', 'K', 'Q', 'J', '10']

/** Carta `n` de 0 a 51: 13 rangos por palo. */
export function cartaDe(n: number): Carta {
  return { r: RANGOS[n % 13] ?? '2', s: PALOS[Math.floor(n / 13)] ?? '♠' }
}

/** Dos cartas al azar de una baraja de 52, sin repetir. */
export function repartir(): [Carta, Carta] {
  const a = Math.floor(Math.random() * 52)
  let b: number
  do b = Math.floor(Math.random() * 52)
  while (b === a)
  return [cartaDe(a), cartaDe(b)]
}

export function esRoja(c: Carta): boolean {
  return c.s === '♥' || c.s === '♦'
}

export type Accion = 'ALL-IN' | 'RAISE' | 'CALL' | 'FOLD'

/** Color del sello y del medidor para cada acción. */
export const COLOR_ACCION: Record<Accion, string> = {
  'ALL-IN': '#d6334b',
  RAISE: '#a78bfa',
  CALL: '#f08a99',
  FOLD: '#a1a1aa',
}

export type Veredicto = {
  label: string
  say: string
  odds: string
  /** Lo que sale en el sello. */
  accion: Accion
  /** 0–100, para el medidor de fuerza. Es una escala de la landing, no un equity. */
  fuerza: number
}

export function veredicto(mano: readonly [Carta, Carta]): Veredicto {
  const v = (c: Carta) => RANGOS.indexOf(c.r)
  const [a, b] = v(mano[0]) >= v(mano[1]) ? mano : [mano[1], mano[0]]
  const pareja = a.r === b.r
  const mismoPalo = a.s === b.s

  const label = pareja
    ? `Pareja de ${NOMBRE_PAR[a.r]}`
    : `${a.r}${a.r === '10' || b.r === '10' ? '-' : ''}${b.r}${mismoPalo ? ' del mismo palo' : ' de distinto palo'}`
  const odds = pareja ? '0.45%' : mismoPalo ? '0.30%' : '0.90%'

  let say: string
  let accion: Accion
  if (pareja && ['A', 'K', 'Q', 'J'].includes(a.r)) {
    say = '¡All-in sin pensarlo!'
    accion = 'ALL-IN'
  } else if (pareja) {
    say = 'Pareja chica: a buscar el set en el flop.'
    accion = 'CALL'
  } else if (BROADWAY.includes(a.r) && BROADWAY.includes(b.r)) {
    say = mismoPalo ? 'Broadway del mismo palo. Subo.' : 'Broadway. Subo 3x.'
    accion = 'RAISE'
  } else if (mismoPalo && v(a) - v(b) === 1) {
    say = 'Conectores del mismo palo: en posición, la juego.'
    accion = 'CALL'
  } else if (a.r === 'A') {
    say = 'As con kicker débil: depende de la posición.'
    accion = 'CALL'
  } else {
    say = 'Fold. Paciencia, la buena viene.'
    accion = 'FOLD'
  }

  const va = v(a)
  const vb = v(b)
  const fuerza = pareja
    ? Math.round(52 + va * 3.4)
    : Math.min(
        80,
        Math.round(8 + va * 3.4 + vb * 1.8 + (mismoPalo ? 6 : 0) + (va - vb === 1 ? 4 : 0)),
      )

  return { label, say, odds, accion, fuerza }
}
