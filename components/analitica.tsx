'use client'

import { Analytics } from '@vercel/analytics/next'
import { useEffect } from 'react'

import { redDeUrl, registrar } from '@/lib/analitica'

/**
 * Vercel Analytics + el evento `clic_red`. Un solo listener delegado en el
 * documento cubre los enlaces del hero, la nav, Redes, el pie y el visor, sin
 * cablear cada uno. Los enlaces se reconocen contra `enlaces` de joe-poker.ts.
 */
export function Analitica() {
  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]')
      if (!(a instanceof HTMLAnchorElement)) return
      const red = redDeUrl(a.href)
      if (red) registrar({ nombre: 'clic_red', red })
    }
    document.addEventListener('click', alClic)
    return () => document.removeEventListener('click', alClic)
  }, [])

  return <Analytics />
}
