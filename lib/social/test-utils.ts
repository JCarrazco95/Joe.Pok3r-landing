import { vi } from 'vitest'

/** Respuestas mockeadas de `fetch` para las pruebas de los adaptadores. */
export const respuestaJson = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'content-type': 'application/json' } })

export const respuestaTexto = (cuerpo: string, status = 200) => new Response(cuerpo, { status })

/** Sustituye `fetch` global; cada llamada consume la siguiente respuesta. */
export function mockFetch(...pasos: Array<Response | Error | (() => Promise<Response>)>) {
  const mock = vi.fn(async () => {
    const paso = pasos.length > 1 ? pasos.shift() : pasos[0]
    if (paso instanceof Error) throw paso
    if (typeof paso === 'function') return paso()
    return (paso as Response).clone()
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

/** Un fetch que nunca responde y respeta el `signal`: simula un timeout. */
export function fetchColgado() {
  const mock = vi.fn(
    (_url: unknown, init?: RequestInit) =>
      new Promise<Response>((_res, rej) => {
        init?.signal?.addEventListener('abort', () => rej(new DOMException('abort', 'AbortError')))
      }),
  )
  vi.stubGlobal('fetch', mock)
  return mock
}
