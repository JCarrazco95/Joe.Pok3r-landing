/**
 * URL absoluta del sitio.
 *
 * La necesitan las imágenes de Open Graph (las redes no resuelven rutas
 * relativas), el canonical y el sitemap. Si falta, cae en localhost: es
 * preferible a que el build reviente.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
