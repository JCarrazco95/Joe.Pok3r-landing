/**
 * URL absoluta del sitio.
 *
 * La necesitan las imágenes de Open Graph (las redes no resuelven rutas
 * relativas), el canonical y el sitemap. Si falta, cae en localhost: es
 * preferible a que el build reviente.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * Feeds sociales (fase 3). Todo esto vive SOLO en las variables de entorno de
 * Vercel; nunca se versiona. Cada variable está documentada en `.env.example`.
 *
 * Ninguna es obligatoria: sin ellas el adaptador de esa red devuelve vacío y el
 * feed cae al contenido manual de `lib/social/manual.ts`.
 */

/**
 * ID del canal de YouTube (@Joe.Pok3r). No es un secreto: es público en la
 * página del canal. Se puede sobreescribir si el canal cambia.
 */
export const YOUTUBE_CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID || 'UCdBkZEh892cu--dzwC4WYKw'

/** Credenciales de la app de Kick (OAuth client credentials). */
export const KICK_CLIENT_ID = process.env.KICK_CLIENT_ID || ''
export const KICK_CLIENT_SECRET = process.env.KICK_CLIENT_SECRET || ''

/**
 * Slug del canal de Kick (https://kick.com/joe-pok3r). Es público, no un
 * secreto; la variable solo sirve para sobreescribirlo. El adaptador sigue
 * apagado sin KICK_CLIENT_ID y KICK_CLIENT_SECRET.
 */
export const KICK_CHANNEL_SLUG = process.env.KICK_CHANNEL_SLUG || 'joe-pok3r'

/**
 * Token de larga duración de Instagram (Graph API). Hoy el adaptador automático
 * está apagado (la cuenta es Creator, sin Página de Facebook); ver instagram.ts.
 */
export const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || ''

/** Interruptor del camino automático de Instagram. Solo `'true'` lo enciende. */
export const INSTAGRAM_AUTO = process.env.INSTAGRAM_AUTO === 'true'
