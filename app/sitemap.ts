import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/env'

/** Una sola página: la landing vive en la raíz de su propio sitio. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
