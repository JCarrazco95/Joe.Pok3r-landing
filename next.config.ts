import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Fotos de la galería alojadas en Cloudflare R2 (dominio propio y r2.dev).
    remotePatterns: [
      { protocol: 'https', hostname: 'media.joepok3r.com' },
      { protocol: 'https', hostname: 'pub-254d3ca3622e472b902a6444f289c512.r2.dev' },
    ],
  },
}

export default nextConfig
