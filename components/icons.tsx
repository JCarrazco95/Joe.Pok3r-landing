import type { SVGProps } from 'react'

import type { RedSocial } from '@/lib/joe-poker'

type Props = SVGProps<SVGSVGElement>

/**
 * Marcas de redes dibujadas a mano.
 *
 * lucide-react v1 ya no trae iconos de marca, y no queremos otra dependencia
 * sólo por siete glifos. Son versiones geométricas simplificadas: se leen bien
 * a 20 px, que es el único tamaño en el que se usan.
 */

const base: Props = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

function Instagram(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTok(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3v10.8a3.6 3.6 0 1 1-3-3.55" />
      <path d="M14 3c.4 2.4 2 4 4.4 4.3" />
    </svg>
  )
}

function YouTube(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.6 15 12l-4.5 2.4z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Equis(props: Props) {
  return (
    <svg {...base} {...props} strokeWidth={1.9}>
      <path d="M4 4 20 20" />
      <path d="M20 4 4 20" />
    </svg>
  )
}

function Twitch(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 3h15v11l-4 4h-3.5l-3 3v-3H4.5z" />
      <path d="M11 7.5v4" />
      <path d="M15 7.5v4" />
    </svg>
  )
}

function WhatsApp(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7z" />
      <path d="M9.2 8.6c.5-.1.8.1 1 .5l.6 1.2c.1.3.1.5-.1.8l-.4.5c-.2.2-.2.4 0 .7a6 6 0 0 0 2.2 2.1c.3.2.5.1.7-.1l.5-.5c.2-.2.5-.3.8-.2l1.2.6c.4.2.5.5.5 1a2 2 0 0 1-2.3 1.6c-2.6-.4-5.4-3.2-5.9-5.8a2 2 0 0 1 1.2-2.4z" />
    </svg>
  )
}

function Trofeo(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 5.5H4.5V7A3.5 3.5 0 0 0 7.6 10.5" />
      <path d="M17 5.5h2.5V7a3.5 3.5 0 0 1-3.1 3.5" />
      <path d="M12 14v3.5" />
      <path d="M8.5 20h7l-.8-2.5h-5.4z" />
    </svg>
  )
}

function Web(props: Props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
    </svg>
  )
}

const iconos: Record<RedSocial, (props: Props) => React.ReactElement> = {
  instagram: Instagram,
  tiktok: TikTok,
  youtube: YouTube,
  x: Equis,
  twitch: Twitch,
  whatsapp: WhatsApp,
  trofeo: Trofeo,
  web: Web,
}

export function IconoRed({ nombre, ...props }: { nombre: RedSocial } & Props) {
  const Componente = iconos[nombre]
  return <Componente {...props} />
}

/** Palos de la baraja. Se usan como ornamento, nunca como único contenido. */
export function Palo({
  palo,
  ...props
}: { palo: 'spade' | 'heart' | 'diamond' | 'club' } & Props) {
  const d = {
    spade: 'M12 2.6c2.6 3.4 7 5.6 7 9.2a3.7 3.7 0 0 1-5.9 3c.2 1.9.9 3.4 1.9 4.6H9c1-1.2 1.7-2.7 1.9-4.6A3.7 3.7 0 0 1 5 11.8c0-3.6 4.4-5.8 7-9.2z',
    heart:
      'M12 20.5S3.5 15 3.5 9.4a4.6 4.6 0 0 1 8.5-2.5 4.6 4.6 0 0 1 8.5 2.5C20.5 15 12 20.5 12 20.5z',
    diamond: 'M12 2.2 20 12l-8 9.8L4 12z',
    club: 'M12 2.8a3.6 3.6 0 0 1 2.7 6 3.6 3.6 0 1 1 1.6 6.7 3.6 3.6 0 0 1-3.4-2.4c.1 2 .8 3.6 1.9 4.9H9.2c1.1-1.3 1.8-2.9 1.9-4.9a3.6 3.6 0 0 1-3.4 2.4 3.6 3.6 0 1 1 1.6-6.7 3.6 3.6 0 0 1 2.7-6z',
  }[palo]

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d={d} />
    </svg>
  )
}
