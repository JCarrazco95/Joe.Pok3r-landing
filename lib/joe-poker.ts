/**
 * Contenido de la landing pública de Joe.Pok3r (/joe).
 *
 * Este archivo es la ÚNICA fuente de verdad de la página: textos, enlaces,
 * estadísticas y galería. Para actualizar la landing no hace falta tocar JSX.
 *
 * TODO (Joe / Analy·sys): las entradas marcadas con `url: null` salen como
 * "Próximamente" porque todavía no tenemos la URL real. En cuanto la tengas,
 * pega la URL y el botón se activa solo.
 */

export type RedSocial =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'x'
  | 'twitch'
  | 'whatsapp'
  | 'trofeo'
  | 'web'

export type Enlace = {
  id: string
  etiqueta: string
  /** Línea de apoyo que se lee debajo de la etiqueta. */
  detalle: string
  icono: RedSocial
  /** `null` = aún no tenemos la URL; el botón se muestra deshabilitado. */
  url: string | null
  /** Resalta el enlace con el borde dorado. Máximo uno o dos. */
  destacado?: boolean
}

export type Reel = {
  src: string
  poster: string
  titulo: string
  /** Duración en segundos, para el badge de la tarjeta. */
  seg: number
  /** Proporción real del archivo. Los verticales se muestran con barras. */
  vertical?: boolean
}

/**
 * Los torneos que cubre la galería. El orden es el del filtro, de más reciente
 * a más viejo; `corto` es lo que cabe en el chip en un teléfono.
 */
export const eventos = [
  { id: 'wsop-circuit', corto: 'WSOP Circuit', nombre: 'WSOP Circuit CDMX · Big Bola Casinos' },
  { id: 'high-roller', corto: 'High Roller', nombre: 'High Roller 2.5M GTD · Jubilee Poker Room' },
] as const

export type EventoId = (typeof eventos)[number]['id']

export type Foto = {
  src: string
  alt: string
  pie: string
  ancho: number
  alto: number
  evento: EventoId
}

/**
 * Aviso de "jugando ahora".
 *
 * Se enciende cuando Joe entra a un torneo y se apaga cuando sale. Es lo único
 * de la landing que cambia en horas y no en semanas: por eso vive suelto arriba
 * del todo, para encontrarlo rápido desde el teléfono en el casino.
 *
 * Cambiar `activo` y empujar el commit basta — Vercel redespliega solo. Si algún
 * día hace falta encenderlo sin desplegar, habría que mover esto a una fuente
 * que la página consulte en caliente; hoy no compensa.
 */
export const enVivo = {
  /** El interruptor. En false el aviso no se renderiza. */
  activo: false,

  /** Qué está jugando. Sale tal cual, así que escríbelo como quieres leerlo. */
  evento: 'WSOP Circuit México · #2 Mini Main Event',

  /** Detalle opcional: nivel, stack, mesa. Vacío se omite. */
  detalle: '',

  /**
   * Enlace a la cobertura en vivo. `null` deja el aviso sin enlace, que es lo
   * correcto cuando no hay una página pública que seguir.
   */
  url: null as string | null,
} as const

export const joe = {
  alias: 'Joe.Pok3r',
  nombre: 'Mariano Vega',
  rol: 'Jugador recreativo de Texas Hold’em',
  ubicacion: 'México',
  avatar: '/avatar.webp',
  /** Marquesina de la marca. PNG con fondo recortado: va sobre el paño. */
  logo: '/logo.png',

  /** Dos frases. Es lo primero que lee alguien que llega desde Instagram. */
  bio:
    'Más de 20 años en las mesas, siempre por gusto. Empecé jugando en casa ' +
    'con amigos y familia; hoy juego torneos y cash, en vivo y en línea.',

  /**
   * La historia larga, en párrafos. Es la bio que dictó Joe: si se edita, que
   * sea con sus palabras — el tono de primera persona es parte del punto.
   */
  historia: [
    'Empecé a jugar poker hace poco más de 20 años de manera recreativa, en ' +
      'casa de amigos y con familia, porque no tenía la edad para entrar a ' +
      'casinos. Me sirvió para entender las reglas del juego.',
    'Cuando tuve la edad legal para jugar en casinos, probé suerte en Las ' +
      'Vegas. Ahí el aprendizaje fue más duro: va gente de todo el mundo, con ' +
      'estrategias distintas y muchos jugando a nivel profesional.',
    'Lo mío siempre ha sido recreativo, pero he participado en torneos de gran ' +
      'envergadura, como el Main Event de la WSOP.',
    'Me gusta jugar en plataformas en línea, y también cash en línea y en vivo.',
  ],

  /** Dónde juega en línea. No son enlaces: no tenemos su usuario en cada una. */
  plataformas: ['GGPoker', 'PokerStars'],

  /** Aparece bajo las estadísticas, como pie del bloque de resultados. */
  logroTitulo: 'High Roller 2.5M GTD',
  logroSede: 'WSOP Circuit · Big Bola Casinos, CDMX',

  stats: [
    { valor: '6.º', etiqueta: 'Lugar', nota: 'High Roller 2.5M GTD' },
    { valor: '$160K', etiqueta: 'Premio', nota: 'Bolsa del evento' },
    { valor: '9/112', etiqueta: 'Mesa final', nota: 'Field completo' },
  ],

} as const

export const enlaces: Enlace[] = [
  {
    id: 'instagram',
    etiqueta: 'Instagram',
    detalle: 'Día a día del grind y las series',
    icono: 'instagram',
    url: 'https://www.instagram.com/joe.pok3r/',
    destacado: true,
  },
  {
    id: 'tiktok',
    etiqueta: 'TikTok',
    detalle: 'Manos, bad beats y clips de mesa',
    icono: 'tiktok',
    url: 'https://www.tiktok.com/@joe.pok3r',
  },
  {
    id: 'youtube',
    etiqueta: 'YouTube',
    detalle: 'Análisis de manos y vlogs de torneo',
    icono: 'youtube',
    url: 'https://www.youtube.com/@Joe.Pok3r',
  },
  {
    id: 'twitch',
    etiqueta: 'Twitch',
    detalle: 'Sesiones en vivo',
    icono: 'twitch',
    url: 'https://www.twitch.tv/joe_pok3r',
  },
  {
    id: 'resultados',
    etiqueta: 'Resultados en vivo',
    detalle: 'Historial de premios y cobertura',
    icono: 'trofeo',
    url: null,
  },
  {
    id: 'codigo-poker',
    etiqueta: 'Cobertura · Código Poker MX',
    detalle: 'Reportes del High Roller y del Main Event',
    icono: 'web',
    url: 'https://www.instagram.com/codigopokermx/',
  },
  {
    id: 'contacto',
    etiqueta: 'Contacto y patrocinios',
    detalle: 'Staking, colaboraciones y prensa',
    icono: 'whatsapp',
    url: null,
    destacado: true,
  },
]

/**
 * Clips del WSOP Circuit en Big Bola Casinos.
 *
 * Ojo: los clips de aquí son 16:9 horizontal, no 9:16, y por eso las tarjetas
 * también son 16:9. El soporte para verticales sigue vivo (`vertical: true`,
 * que los muestra completos con barras en vez de recortarlos), aunque hoy no lo
 * use ninguno. Si llegan varios verticales, conviene reconsiderar la tarjeta.
 *
 * Los pósters se sacaron de un fotograma de cada video: sin ellos las tarjetas
 * se ven negras hasta que el navegador decide cargar metadata.
 */
export const reels: Reel[] = [
  {
    src: '/reels/reel-8.mp4',
    poster: '/reels/poster-8.webp',
    titulo: 'El anillo del Circuit en pantalla',
    seg: 19,
    vertical: true,
  },
  {
    src: '/reels/reel-7.mp4',
    poster: '/reels/poster-7.webp',
    titulo: 'Mini Main Event · antes de sentarse',
    seg: 54,
  },
  {
    src: '/reels/reel-6.mp4',
    poster: '/reels/poster-6.webp',
    titulo: 'Día 1C · The Opener Mystery Bounty',
    seg: 29,
  },
  {
    src: '/reels/reel-5.mp4',
    poster: '/reels/poster-5.webp',
    titulo: 'Ocho minutos para el arranque',
    seg: 55,
  },
  {
    src: '/reels/reel-4.mp4',
    poster: '/reels/poster-4.webp',
    titulo: 'Recorrido por la sala de torneo',
    seg: 28,
  },
  {
    src: '/reels/reel-1.mp4',
    poster: '/reels/poster-1.webp',
    titulo: 'Mural de fichas · WSOP Circuit Events',
    seg: 9,
  },
  {
    src: '/reels/reel-3.mp4',
    poster: '/reels/poster-3.webp',
    titulo: 'World Series of Poker · CDMX',
    seg: 15,
  },
  {
    src: '/reels/reel-2.mp4',
    poster: '/reels/poster-2.webp',
    titulo: 'Entrada a Big Bola Casinos',
    seg: 2,
  },
]

/**
 * El orden NO es decorativo: `column-count` llena las columnas en secuencia, así
 * que esta secuencia es la que hace que el masonry cierre parejo con 2 columnas
 * (móvil) y con 3 (escritorio). Si agregas fotos, revisa cómo quedan los pies
 * de columna antes de dar por buena la mezcla.
 */
export const galeria: Foto[] = [
  {
    src: '/sexto-lugar.webp',
    alt: 'Placa oficial: Mariano Vega, 6.º lugar, premio de $160,000',
    pie: '6.º lugar · $160,000',
    ancho: 475,
    alto: 794,
    evento: 'high-roller',
  },
  {
    src: '/wsop-live-mesa-22.webp',
    alt: 'App WSOP Live: Salón México, mesa 22, asiento 2, con los ocho jugadores arrancando en 40,000',
    pie: 'Mesa 22 · todos en 40K',
    ancho: 969,
    alto: 1229,
    evento: 'wsop-circuit',
  },
  {
    src: '/boton-dealer-wsop.webp',
    alt: 'Botón de dealer de la WSOP junto a una torre de fichas de Big Bola sobre el tapete',
    pie: 'Botón de dealer · WSOP',
    ancho: 1050,
    alto: 1400,
    evento: 'wsop-circuit',
  },
  {
    src: '/sala-wsop-circuit.webp',
    alt: 'Sala de torneo llena de mesas bajo los letreros de WSOP, GGPoker y Big Bola',
    pie: 'La sala, antes del primer reparto',
    ancho: 960,
    alto: 1280,
    evento: 'wsop-circuit',
  },
  {
    src: '/bluff-central.webp',
    alt: 'Joe.Pok3r concentrado durante una mano, cobertura de Bluff Central',
    pie: 'Cobertura · Bluff Central',
    ancho: 1400,
    alto: 933,
    evento: 'high-roller',
  },
  {
    src: '/conteo-mesa-final.webp',
    alt: 'Gráfico de conteo de fichas de la mesa final del High Roller 2.5M GTD',
    pie: 'Conteo de fichas · mesa final',
    ancho: 736,
    alto: 905,
    evento: 'high-roller',
  },
  {
    src: '/jubilee-mesa-19.webp',
    alt: 'Joe.Pok3r en la mesa 19 del Jubilee Casino con su stack de fichas',
    pie: 'Mesa 19 · Jubilee Casino',
    ancho: 1024,
    alto: 1280,
    evento: 'high-roller',
  },
  {
    src: '/fichas-tapete-circuit.webp',
    alt: 'Cuatro torres de fichas sobre el tapete del WSOP Circuit CDMX en pleno juego',
    pie: 'Stack en juego',
    ancho: 1050,
    alto: 1400,
    evento: 'wsop-circuit',
  },
  {
    src: '/retrato-gorra-j.webp',
    alt: 'Joe.Pok3r con gorra blanca "J" apilando fichas en la mesa',
    pie: 'Día 1 · en acción',
    ancho: 960,
    alto: 1280,
    evento: 'high-roller',
  },
  {
    src: '/wsop-circuit-cdmx.webp',
    alt: 'Botón de dealer de la WSOP sobre el logo del WSOP Circuit Events México CDMX impreso en el tapete',
    pie: 'WSOP Circuit · CDMX',
    ancho: 1050,
    alto: 1400,
    evento: 'wsop-circuit',
  },
  {
    src: '/fichas-big-bola.webp',
    alt: 'Fichas de Big Bola Casinos sobre el tapete de la mesa de torneo',
    pie: 'Big Bola Casinos',
    ancho: 1050,
    alto: 1400,
    evento: 'wsop-circuit',
  },
  {
    src: '/wsop-live-mesa-25.webp',
    alt: 'Pantalla de la app WSOP Live: Salón México, mesa 25, asiento 3, con Joe Vega y 52,000 en fichas',
    pie: 'WSOP Live · mesa 25, asiento 3',
    ancho: 777,
    alto: 1130,
    evento: 'wsop-circuit',
  },
  {
    src: '/fichas-wsop-dealer.webp',
    alt: 'Botón de dealer de la WSOP junto a torres de fichas con el logo del evento',
    pie: 'Fichas del WSOP Circuit',
    ancho: 1050,
    alto: 1400,
    evento: 'wsop-circuit',
  },
  {
    src: '/conteo-mini-main.webp',
    alt: 'Conteo de fichas del Mini Main Event con Joe Vega en el puesto 13 con 64,200',
    pie: '13.º con 64.2K',
    ancho: 844,
    alto: 1229,
    evento: 'wsop-circuit',
  },
  {
    src: '/mesa-final.webp',
    alt: 'Foto grupal de los nueve finalistas alrededor de la mesa final',
    pie: 'Los 9 de la mesa final',
    ancho: 1400,
    alto: 1400,
    evento: 'high-roller',
  },
  {
    src: '/escenario-wsop-circuit.webp',
    alt: 'Mesa final montada frente a la pantalla del WSOP Circuit México presentado por Big Bola Casinos',
    pie: 'La mesa final, montada',
    ancho: 960,
    alto: 1280,
    evento: 'wsop-circuit',
  },
]
