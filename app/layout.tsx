import type { Metadata, Viewport } from 'next'
import { Bebas_Neue } from 'next/font/google'
import { Inter } from 'next/font/google'

import { SITE_URL } from '@/lib/env'
import { joe } from '@/lib/joe-poker'

import './globals.css'

/** Texto corrido. Sólo 400 y 500: la marca no usa negritas. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

/** Display condensada, sólo para titulares y cifras. */
const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const titulo = `${joe.alias} · ${joe.nombre}`
const descripcion = `${joe.rol}. ${joe.logroTitulo}: 6.º lugar y $160,000 en la mesa final. Enlaces, resultados y galería.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: titulo,
  description: descripcion,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    locale: 'es_MX',
    url: '/',
    title: titulo,
    description: descripcion,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: titulo }],
  },
  twitter: {
    card: 'summary_large_image',
    title: titulo,
    description: descripcion,
    images: ['/og.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#04150f',
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
    <html lang="es-MX" className={`${inter.variable} ${display.variable}`}>
      <body className="joe-theme">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--panel)] focus:px-3 focus:py-2 focus:text-sm focus:outline-2 focus:outline-offset-2 focus:outline-[var(--gold)]"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  )
}
