import type { Metadata, Viewport } from 'next'
import { Bebas_Neue } from 'next/font/google'
import localFont from 'next/font/local'

import { Analitica } from '@/components/analitica'
import { EfectoMagnetico } from '@/components/ui/efecto-magnetico'
import { SITE_URL } from '@/lib/env'
import { joe } from '@/lib/joe-poker'
import { DESCRIPCION, TITULO } from '@/lib/seo'

import './globals.css'

/** Texto corrido: Mont 500/600/700, servida desde public/fonts. */
const body = localFont({
  src: [
    { path: '../public/fonts/Mont-500.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Mont-600.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/Mont-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-mont',
  display: 'swap',
})

/** Display condensada, sólo para titulares y cifras. */
const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITULO, template: `%s · ${joe.alias}` },
  description: DESCRIPCION,
  applicationName: joe.alias,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  // Las imágenes salen de app/opengraph-image.jpg y app/twitter-image.jpg
  // (convención de archivos de Next): no se declaran aquí.
  openGraph: {
    type: 'profile',
    locale: 'es_MX',
    siteName: joe.alias,
    url: '/',
    title: TITULO,
    description: DESCRIPCION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: DESCRIPCION,
  },
}

export const viewport: Viewport = {
  themeColor: '#131316',
  colorScheme: 'dark',
}

/**
 * Layout raíz del sitio.
 *
 * Antes la landing colgaba del layout del HUB y heredaba cosas que no usaba:
 * los tokens de shadcn, el Toaster y la clase `dark`. Aquí sólo va lo suyo.
 * `.joe-theme` se queda en el <body> para que el tema siga acotado a una clase
 * y el CSS pueda compararse con el del HUB sin traducir.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${body.variable} ${display.variable}`}>
      <body className="joe-theme">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-2 focus:px-3 focus:py-2 focus:text-sm focus:outline-2 focus:outline-offset-2 focus:outline-violet"
        >
          Saltar al contenido
        </a>
        {children}
        <EfectoMagnetico />
        <Analitica />
      </body>
    </html>
  )
}
