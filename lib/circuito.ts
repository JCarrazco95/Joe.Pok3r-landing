import { galeriaR2, reelsR2 } from './medios'
import { resultados, type Resultado } from './joe-poker'

/**
 * El circuito dividido por parada. No guarda resultados: los toma de
 * `resultados` (lib/joe-poker.ts) por rango de fechas, así hay una sola fuente
 * de verdad. Aquí sólo viven la parada, su carpeta de medios y lo que falta.
 * Ver también CIRCUITO.md.
 */
export type Parada = {
  id: string
  nombre: string
  lugar: string
  /** Rango en ISO, inclusivo. Un resultado cae en la parada cuya ventana lo contiene. */
  desde: string
  hasta: string
  /** Etiqueta de fechas, ya formateada. */
  fechas: string
  /** Carpeta en R2 (`web/<carpeta>/`) con los medios de la parada. */
  carpeta?: string
  /** Lo que falta registrar, sin completarlo con suposiciones. */
  pendiente?: string
}

/** De la más reciente a la más vieja. */
export const paradas: Parada[] = [
  {
    id: 'panama',
    nombre: 'WSOP Circuit Panamá',
    lugar: 'Ciudad de Panamá',
    desde: '2026-11-05',
    hasta: '2026-11-15',
    fechas: '5–15 nov 2026',
    carpeta: 'panama',
  },
  {
    id: 'houston',
    nombre: 'Texas Card House',
    lugar: 'Houston, Texas',
    desde: '2026-10-24',
    hasta: '2026-10-25',
    fechas: '24 oct 2026',
    carpeta: 'houston',
    pendiente: 'Falta el puesto final y el premio.',
  },
  {
    id: 'austin',
    nombre: 'WSOP Circuit Austin',
    lugar: 'Austin, Texas',
    desde: '2026-09-10',
    hasta: '2026-09-20',
    fechas: '14–17 sep 2026',
    carpeta: 'austin',
  },
  {
    id: 'cdmx',
    nombre: 'CDMX · WSOP Circuit México',
    lugar: 'Big Bola Casinos y Jubilee Poker Room',
    desde: '2026-08-25',
    hasta: '2026-09-09',
    fechas: '31 ago–7 sep 2026',
    carpeta: 'cdmx',
    pendiente: 'Falta el puesto del Opener Mystery Bounty.',
  },
  {
    id: 'online',
    nombre: 'WSOP Online',
    lugar: 'En línea',
    desde: '2026-08-01',
    hasta: '2026-08-20',
    fechas: '10 ago 2026',
  },
  {
    id: 'las-vegas',
    nombre: 'Las Vegas',
    lugar: 'Aria, Rio y Horseshoe & Paris',
    desde: '2000-01-01',
    hasta: '2025-12-31',
    fechas: '2017 y 2023',
    pendiente: 'Falta el puesto del Main Event 2023.',
  },
]

export type ParadaConDatos = Parada & {
  torneos: Resultado[]
  reels: number
  fotos: number
  /** Torneos con puesto registrado. */
  conPuesto: number
  /** Torneos con premio registrado. */
  cobros: number
}

const enCarpeta = (src: string, carpeta: string) => src.includes(`/web/${carpeta}/`)

/** Agrupa `lista` por parada. Un resultado fuera de toda ventana no se pierde en silencio: se descarta aquí y lo atrapa el test. */
export function armarCircuito(
  lista: readonly Resultado[] = resultados,
  defs: readonly Parada[] = paradas,
): ParadaConDatos[] {
  return defs.map((p) => {
    const torneos = lista
      .filter((r) => r.fecha >= p.desde && r.fecha <= p.hasta)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
    return {
      ...p,
      torneos,
      reels: p.carpeta ? reelsR2.filter((r) => enCarpeta(r.src, p.carpeta!)).length : 0,
      fotos: p.carpeta ? galeriaR2.filter((f) => enCarpeta(f.src, p.carpeta!)).length : 0,
      conPuesto: torneos.filter((r) => r.puesto !== null).length,
      cobros: torneos.filter((r) => r.premio).length,
    }
  })
}

export const circuito = armarCircuito()
