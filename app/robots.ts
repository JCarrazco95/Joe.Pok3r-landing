import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/env'

/**
 * Sitio público entero: no hay nada que esconder. El `disallow` que había antes
 * existía porque la landing compartía despliegue con el HUB privado.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
