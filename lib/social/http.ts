import { REVALIDAR_SEG, TEXTO_MAX, TIMEOUT_MS } from './config'
import type { RedFeed, ResultadoAdaptador } from './types'

/** Error con mensaje en español, seguro de mostrar en `motivo`. */
export class ErrorFuente extends Error {}

type OpcionesFetch = RequestInit & {
  timeoutMs?: number
  /** `0` desactiva la caché (p. ej. peticiones POST de token). */
  revalidate?: number
}

/**
 * fetch con timeout y revalidación de Next. Lanza `ErrorFuente` ante timeout,
 * fallo de red o respuesta no 2xx; nunca devuelve una respuesta fallida.
 */
export async function fetchSeguro(
  url: string,
  { timeoutMs = TIMEOUT_MS, revalidate = REVALIDAR_SEG, ...init }: OpcionesFetch = {},
): Promise<Response> {
  const control = new AbortController()
  const temporizador = setTimeout(() => control.abort(), timeoutMs)
  try {
    const respuesta = await fetch(url, {
      ...init,
      signal: control.signal,
      next: { revalidate },
    })
    if (!respuesta.ok) throw new ErrorFuente(`HTTP ${respuesta.status}`)
    return respuesta
  } catch (error) {
    if (error instanceof ErrorFuente) throw error
    if (control.signal.aborted) throw new ErrorFuente('Tiempo de espera agotado')
    throw new ErrorFuente('Fallo de red')
  } finally {
    clearTimeout(temporizador)
  }
}

/** Lee JSON como `unknown`: quien llama debe validarlo con guardas. */
export async function leerJson(respuesta: Response): Promise<unknown> {
  try {
    return (await respuesta.json()) as unknown
  } catch {
    throw new ErrorFuente('Respuesta con JSON malformado')
  }
}

export function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

export function texto(valor: unknown): string | undefined {
  return typeof valor === 'string' ? valor : undefined
}

export function numero(valor: unknown): number | undefined {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor : undefined
}

/**
 * Limpia un texto externo: quita caracteres de control, colapsa espacios y
 * trunca. No escapa HTML: la UI lo pinta como texto (React ya escapa).
 */
export function limpiarTexto(valor: string, max = TEXTO_MAX): string {
  const limpio = valor.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim()
  return limpio.length > max ? `${limpio.slice(0, max - 1).trimEnd()}…` : limpio
}

/** Devuelve la URL normalizada si es https (y, si se dan `hosts`, de ese host). */
export function urlHttps(valor: unknown, hosts?: readonly string[]): string | undefined {
  if (typeof valor !== 'string') return undefined
  try {
    const url = new URL(valor)
    if (url.protocol !== 'https:') return undefined
    const host = url.hostname.toLowerCase()
    if (hosts && !hosts.some((h) => host === h || host.endsWith(`.${h}`))) return undefined
    return url.toString()
  } catch {
    return undefined
  }
}

/** Fecha ISO normalizada, o `undefined` si no es una fecha válida. */
export function fechaIso(valor: unknown): string | undefined {
  if (typeof valor !== 'string') return undefined
  const t = Date.parse(valor)
  return Number.isNaN(t) ? undefined : new Date(t).toISOString()
}

export function mensajeDe(error: unknown): string {
  return error instanceof ErrorFuente ? error.message : 'Error inesperado'
}

export function vacio(red: RedFeed, motivo: string): ResultadoAdaptador {
  return { red, origen: 'vacio', posts: [], motivo }
}
