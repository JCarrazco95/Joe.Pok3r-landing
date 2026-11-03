import type { Foto, Reel } from './joe-poker'

/**
 * Medios en Cloudflare R2, ya comprimidos (ver media-web/). Generado a partir de
 * los archivos de torneos/; los títulos salen del nombre de cada archivo, sin
 * agregar datos que no estén ahí. Sólo se muestran los que el nombre o la propia
 * imagen respaldan.
 *
 * La base se cambia con NEXT_PUBLIC_MEDIA_URL (por ejemplo https://media.joepok3r.com).
 * Los archivos viven en la carpeta `web/` del bucket.
 */
export const MEDIA_URL = (process.env.NEXT_PUBLIC_MEDIA_URL ?? 'https://pub-254d3ca3622e472b902a6444f289c512.r2.dev').replace(/\/$/, '')

const medio = (ruta: string) => `${MEDIA_URL}/web/${ruta}`

export const reelsR2: Reel[] = [
  { src: medio("houston/joe-houston-1-editado.mp4"), poster: medio("houston/joe-houston-1-editado.jpg"), titulo: "Houston · Arranque del torneo", seg: 27, vertical: true },
  { src: medio("houston/joe-houston-chip-count.mp4"), poster: medio("houston/joe-houston-chip-count.jpg"), titulo: "Houston · Chip count", seg: 32, vertical: true },
  { src: medio("houston/joe-houston-cobramos.mp4"), poster: medio("houston/joe-houston-cobramos.jpg"), titulo: "Houston · Cobramos", seg: 18, vertical: true },
  { src: medio("houston/joe-sesion-de-cash-cierre-1596.mp4"), poster: medio("houston/joe-sesion-de-cash-cierre-1596.jpg"), titulo: "Sesión de cash · Cierre en 1,596", seg: 15, vertical: true },
  { src: medio("houston/joe-sesion-de-cash-resumen-completo.mp4"), poster: medio("houston/joe-sesion-de-cash-resumen-completo.jpg"), titulo: "Sesión de cash · Resumen completo", seg: 42, vertical: true },
  { src: medio("houston/joe-sesion-de-cash-secuencia-500-650-950.mp4"), poster: medio("houston/joe-sesion-de-cash-secuencia-500-650-950.jpg"), titulo: "Sesión de cash · 500, 650, 950", seg: 17, vertical: true },
  { src: medio("houston/joe-sesion-de-cash-updates-4-5-break.mp4"), poster: medio("houston/joe-sesion-de-cash-updates-4-5-break.jpg"), titulo: "Sesión de cash · Updates y break", seg: 18, vertical: true },
  { src: medio("houston/joe-torneo-houston-historia.mp4"), poster: medio("houston/joe-torneo-houston-historia.jpg"), titulo: "Houston · La historia del torneo", seg: 12, vertical: true },
  { src: medio("houston/joe-ya-empezamos-houston.mp4"), poster: medio("houston/joe-ya-empezamos-houston.jpg"), titulo: "Houston · Ya empezamos", seg: 15, vertical: true },
  { src: medio("houston/joe-pok3r-video-noche-de-cash-black-gold.mp4"), poster: medio("houston/joe-pok3r-video-noche-de-cash-black-gold.jpg"), titulo: "Houston · Noche de cash", seg: 10, vertical: true },
  { src: medio("houston/reel-de-recap.mp4"), poster: medio("houston/reel-de-recap.jpg"), titulo: "Houston · Reel de recap", seg: 32, vertical: true },
  { src: medio("austin/2do-brake.mp4"), poster: medio("austin/2do-brake.jpg"), titulo: "Austin · Segundo break", seg: 48, vertical: true },
  { src: medio("austin/all-in-mano.mp4"), poster: medio("austin/all-in-mano.jpg"), titulo: "Austin · All in, la mano", seg: 73, vertical: true },
  { src: medio("austin/dia-2-abr.mp4"), poster: medio("austin/dia-2-abr.jpg"), titulo: "Austin · Día 2 (abr.)", seg: 49 },
  { src: medio("austin/dia-2-monster.mp4"), poster: medio("austin/dia-2-monster.jpg"), titulo: "Austin · Día 2 (monster)", seg: 35 },
  { src: medio("austin/dia-2-vert.mp4"), poster: medio("austin/dia-2-vert.jpg"), titulo: "Austin · Día 2 (vertical)", seg: 48, vertical: true },
  { src: medio("austin/dia-2.mp4"), poster: medio("austin/dia-2.jpg"), titulo: "Austin · Día 2", seg: 15, vertical: true },
  { src: medio("austin/editado-71-lugar.mp4"), poster: medio("austin/editado-71-lugar.jpg"), titulo: "Austin · 71.º lugar (editado)", seg: 29, vertical: true },
  { src: medio("austin/empezando-main-event.mp4"), poster: medio("austin/empezando-main-event.jpg"), titulo: "Austin · Empezando el Main Event", seg: 34, vertical: true },
  { src: medio("austin/inicio-main-event-dia-2.mp4"), poster: medio("austin/inicio-main-event-dia-2.jpg"), titulo: "Austin · Main Event, inicio del día 2", seg: 50, vertical: true },
  { src: medio("austin/llegando-a-austin.mp4"), poster: medio("austin/llegando-a-austin.jpg"), titulo: "Llegando a Austin", seg: 16, vertical: true },
  { src: medio("cdmx/31.mp4"), poster: medio("cdmx/31.jpg"), titulo: "CDMX · #31", seg: 12, vertical: true },
  { src: medio("cdmx/71-lugares.mp4"), poster: medio("cdmx/71-lugares.jpg"), titulo: "CDMX · 71 lugares", seg: 29, vertical: true },
  { src: medio("cdmx/burbuja.mp4"), poster: medio("cdmx/burbuja.jpg"), titulo: "CDMX · La burbuja", seg: 54, vertical: true },
  { src: medio("cdmx/eliminacion.mp4"), poster: medio("cdmx/eliminacion.jpg"), titulo: "CDMX · Eliminación", seg: 73, vertical: true },
  { src: medio("cdmx/empezando-dia-2.mp4"), poster: medio("cdmx/empezando-dia-2.jpg"), titulo: "CDMX · Empezando el día 2", seg: 20, vertical: true },
  { src: medio("cdmx/entramos-al-top-25.mp4"), poster: medio("cdmx/entramos-al-top-25.jpg"), titulo: "CDMX · Entramos al top 25", seg: 34, vertical: true },
  { src: medio("cdmx/fuera.mp4"), poster: medio("cdmx/fuera.jpg"), titulo: "CDMX · Fuera", seg: 32 },
  { src: medio("cdmx/inicio-torneo-highroller.mp4"), poster: medio("cdmx/inicio-torneo-highroller.jpg"), titulo: "CDMX · Inicio del High Roller", seg: 62 },
  { src: medio("cdmx/nivel-9.mp4"), poster: medio("cdmx/nivel-9.jpg"), titulo: "CDMX · Nivel 9", seg: 30 },
  { src: medio("cdmx/poker-3.mp4"), poster: medio("cdmx/poker-3.jpg"), titulo: "CDMX · Poker", seg: 60, vertical: true },
  { src: medio("cdmx/pot-limit-omaha.mp4"), poster: medio("cdmx/pot-limit-omaha.jpg"), titulo: "CDMX · Pot Limit Omaha", seg: 15, vertical: true },
  { src: medio("cdmx/top-10.mp4"), poster: medio("cdmx/top-10.jpg"), titulo: "CDMX · Top 10", seg: 39, vertical: true },
  { src: medio("cdmx/vamos-por-la-mesa-final.mp4"), poster: medio("cdmx/vamos-por-la-mesa-final.jpg"), titulo: "CDMX · Vamos por la mesa final", seg: 19, vertical: true },
  { src: medio("cdmx/whatsapp-video-2026-09-06-at-8-15-42-pm.mp4"), poster: medio("cdmx/whatsapp-video-2026-09-06-at-8-15-42-pm.jpg"), titulo: "CDMX · 6 de septiembre", seg: 56, vertical: true },
  { src: medio("cdmx/whatsapp-video-2026-09-07-at-12-44-22-pm.mp4"), poster: medio("cdmx/whatsapp-video-2026-09-07-at-12-44-22-pm.jpg"), titulo: "CDMX · 7 de septiembre (1)", seg: 12, vertical: true },
  { src: medio("cdmx/whatsapp-video-2026-09-07-at-12-53-13-pm.mp4"), poster: medio("cdmx/whatsapp-video-2026-09-07-at-12-53-13-pm.jpg"), titulo: "CDMX · 7 de septiembre (2)", seg: 24, vertical: true },
]

export const galeriaR2: Foto[] = [
  { src: medio("cdmx/joe-relleno-1.jpg"), alt: "Joe Vega junto a la escultura de la carta en la entrada del casino", pie: "Joe en Big Bola Casinos", ancho: 1200, alto: 1600, evento: "wsop-circuit" },
  { src: medio("cdmx/joe-relleno-3.jpg"), alt: "Cartel de la World Series of Poker en el vestíbulo del casino", pie: "World Series of Poker · CDMX", ancho: 1200, alto: 1600, evento: "wsop-circuit" },
  { src: medio("cdmx/whatsapp-image-2026-09-03-at-2-12-40-pm.jpg"), alt: "Lista de jugadores de la app del torneo con Joe Vega empatado en 2.º lugar con 120.0K (200 BB)", pie: "2.º con 120K · 200 BB", ancho: 783, alto: 1280, evento: "wsop-circuit" },
  { src: medio("cdmx/whatsapp-image-2026-09-03-at-4-27-12-pm.jpg"), alt: "Lista de jugadores de la app del torneo con Joe Vega en 8.º lugar con 174.0K (116 BB)", pie: "8.º con 174K · 116 BB", ancho: 772, alto: 1280, evento: "wsop-circuit" },
  { src: medio("cdmx/whatsapp-image-2026-09-04-at-11-13-49-am.jpg"), alt: "Asignación de mesa 19, asiento 3 en el Salón México, con Joe Vega y 146.0K", pie: "Mesa 19 · asiento 3", ancho: 962, alto: 1280, evento: "wsop-circuit" },
  { src: medio("cdmx/whatsapp-image-2026-09-04-at-11-14-27-am.jpg"), alt: "Lista de jugadores del Mini Main Event, día final, con Joe Vega en el puesto 123 con 146.0K (14 BB)", pie: "Mini Main Event · día final", ancho: 633, alto: 1280, evento: "wsop-circuit" },
  { src: medio("houston/1234.jpg"), alt: "Pantalla del reloj de TCH Houston: Single Day $100K, nivel 17, quedan 38 de 265", pie: "Nivel 17 · quedan 38 de 265", ancho: 471, alto: 1024, evento: "houston-tch" },
  { src: medio("houston/whatsapp-image-2026-10-24-at-10-15-37-pm-1.jpg"), alt: "Sala de torneos de Texas Card House llena de mesas", pie: "Texas Card House · Houston", ancho: 1600, alto: 1200, evento: "houston-tch" },
  { src: medio("houston/whatsapp-image-2026-10-24-at-4-24-05-pm.jpg"), alt: "Dos torres de fichas de Texas Card House: de 5,000, de 500 y de 1,000", pie: "Torres de fichas · TCH", ancho: 1200, alto: 1600, evento: "houston-tch" },
  { src: medio("houston/whatsapp-image-2026-10-24-at-6-14-52-pm.jpg"), alt: "Tabla de premios del torneo de $400 NL Hold’em de las 12:00 pm en TCH Houston", pie: "Tabla de premios · $400 NL", ancho: 471, alto: 1024, evento: "houston-tch" },
]
