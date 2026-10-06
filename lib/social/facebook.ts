/**
 * Facebook: FUERA por ahora.
 *
 * No hay Página de Facebook de Joe.Pok3r, y la Graph API solo lee Páginas (no
 * perfiles personales). Sin Página no hay nada que leer ni que curar, así que
 * el adaptador existe para que el índice trate a las cinco redes igual, pero
 * siempre devuelve vacío y no toca la red.
 *
 * Si se crea una Página: implementar aquí la lectura de `/{page-id}/posts`
 * (mismo patrón que `obtenerInstagramGraph`) y añadir su enlace a `enlaces`.
 */

import { vacio } from './http'
import type { ResultadoAdaptador } from './types'

export async function obtenerFacebook(): Promise<ResultadoAdaptador> {
  return vacio('facebook', 'Sin Página de Facebook')
}
