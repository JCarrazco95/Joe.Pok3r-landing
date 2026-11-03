import type { Metadata, Viewport } from 'next'
import { Bebas_Neue } from 'next/font/google'
import localFont from 'next/font/local'

import { CLAVE_INTRO, Intro } from '@/components/global/intro'
import { Puntero } from '@/components/global/puntero'
import { ScrollSuave } from '@/components/global/scroll-suave'
import { SITE_URL } from '@/lib/env'
import { joe } from '@/lib/joe-poker'

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
    // `data-intro-vista` lo pone el script de abajo antes del primer pintado,
    // así que el servidor y el cliente no coinciden en ese atributo a propósito.
    <html lang="es-MX" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <body className="joe-theme">
        {/* Quien ya vio la intro (o pide menos movimiento) no la ve ni un instante. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('${CLAVE_INTRO}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.introVista='1'}catch(e){}`,
          }}
        />
        <Intro />
        <Puntero />
        <ScrollSuave />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-2 focus:px-3 focus:py-2 focus:text-sm focus:outline-2 focus:outline-offset-2 focus:outline-violet"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  )
}
