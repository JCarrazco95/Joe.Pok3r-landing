/**
 * Parámetros compartidos de la capa social. Los límites de posts viven en
 * `index.ts`.
 */

/**
 * Segundos entre revalidaciones del feed (30 min).
 *
 * Justificación: YouTube y Kick no cambian por minuto; 30 min mantiene el feed
 * fresco, deja margen en cuotas y son ~48 llamadas por día por red.
 *
 * OJO: Next exige que `export const revalidate` de `app/api/social/route.ts`
 * sea un literal, así que NO puede importar esta constante. Una prueba
 * (`route.test.ts`) falla si los dos valores se separan: al cambiar uno,
 * cambia el otro.
 */
export const REVALIDAR_SEG = 1800

/** Tiempo máximo de cada petición a una red externa. */
export const TIMEOUT_MS = 8000

/** Largo máximo del texto de un post. */
export const TEXTO_MAX = 280
