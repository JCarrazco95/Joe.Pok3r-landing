import { SITE_URL } from '@/lib/env'
import { enlaces, joe } from '@/lib/joe-poker'

export const TITULO = `${joe.alias} · ${joe.nombre}`
export const DESCRIPCION = `${joe.rol}. ${joe.logroTitulo}: 6.º lugar y $160,000 en la mesa final. Enlaces, resultados y galería.`

/**
 * Perfiles propios de Joe en redes y registros, para `sameAs` del JSON-LD.
 * Lista explícita (no "todos los enlaces con URL"): `resultados` es un ancla de
 * esta misma página y `codigo-poker` es la cuenta de un tercero. No hay
 * Facebook porque no existe.
 */
const PERFILES_PROPIOS = ['instagram', 'tiktok', 'youtube', 'twitch', 'kick', 'hendon-mob']

export function perfilesSameAs(): string[] {
  return enlaces.flatMap((e) =>
    PERFILES_PROPIOS.includes(e.id) && e.url?.startsWith('https://') ? [e.url] : [],
  )
}

/** Datos estructurados `Person` para Google y las tarjetas enriquecidas. */
export function jsonLdPersona() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#joe`,
    name: joe.nombre,
    alternateName: joe.alias,
    jobTitle: joe.rol,
    description: joe.bio,
    image: `${SITE_URL}${joe.avatar}`,
    url: SITE_URL,
    nationality: joe.ubicacion,
    sameAs: perfilesSameAs(),
  }
}
