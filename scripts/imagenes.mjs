#!/usr/bin/env node
/**
 * Convierte los PNG de media-origen/<torneo>/ a WebP, los ordena por grupo en
 * media-web/<torneo>/img/<grupo>/ y genera lib/<torneo>-imagenes.ts con el
 * índice. La subida a R2 sigue siendo `npm run medios`.
 *
 *   node scripts/imagenes.mjs panama
 *
 * Es idempotente: no vuelve a convertir lo que ya existe en media-web/.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

const RAIZ = resolve(import.meta.dirname, '..')
const torneo = process.argv[2]
if (!torneo) {
  console.error('Uso: node scripts/imagenes.mjs <torneo>   (por ejemplo: panama)')
  process.exit(1)
}

const WINGET = join(process.env.LOCALAPPDATA ?? '', 'Microsoft', 'WinGet', 'Links')
const bin = (n) => (existsSync(join(WINGET, `${n}.exe`)) ? join(WINGET, `${n}.exe`) : n)
const FFMPEG = bin('ffmpeg')
const FFPROBE = bin('ffprobe')

const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Grupo según el prefijo del nombre. Lo que no encaja cae en "otras". */
const GRUPOS = [
  [/^patro/i, 'patrocinadores', 'Patrocinadores (secuencia)'],
  [/^logos/i, 'logos', 'Logos (secuencia)'],
  [/^fd-/i, 'fotogramas', 'Fotogramas del all-in'],
  [/^post-/i, 'publicaciones', 'Publicaciones'],
  [/^felicitacion/i, 'felicitaciones', 'Felicitaciones'],
  [/^(check-reel|hoyjuego|itm|outro)/i, 'reels-e-historias', 'Gráficas de reels e historias'],
]
const grupoDe = (base) => {
  for (const [re, id, etiqueta] of GRUPOS) if (re.test(base)) return { id, etiqueta }
  return { id: 'otras', etiqueta: 'Otras' }
}

const origen = join(RAIZ, 'media-origen', torneo)
const pngs = readdirSync(origen).filter((f) => f.toLowerCase().endsWith('.png')).sort()
const items = []

for (const f of pngs) {
  const base = basename(f, '.png')
  const g = grupoDe(base)
  const nombre = slug(base)
  const dir = join(RAIZ, 'media-web', torneo, 'img', g.id)
  const salida = join(dir, `${nombre}.webp`)
  mkdirSync(dir, { recursive: true })
  if (!existsSync(salida)) {
    execFileSync(FFMPEG, ['-y', '-v', 'error', '-i', join(origen, f), '-vf', "scale='min(1080,iw)':-2", '-c:v', 'libwebp', '-quality', '82', salida])
  }
  const s = JSON.parse(
    execFileSync(FFPROBE, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', salida], { encoding: 'utf8' }),
  ).streams[0]
  items.push({ grupo: g, nombre, base, ancho: s.width, alto: s.height })
}

// Orden natural (patro-2 antes que patro-10) dentro de cada grupo.
const natural = new Intl.Collator('es', { numeric: true })
items.sort((a, b) => natural.compare(a.grupo.id, b.grupo.id) || natural.compare(a.base, b.base))

const ids = [...new Set(items.map((i) => i.grupo.id))]
const etiquetas = Object.fromEntries(items.map((i) => [i.grupo.id, i.grupo.etiqueta]))
const NOMBRE = torneo.charAt(0).toUpperCase() + torneo.slice(1)

const salidaTs = `import { MEDIA_URL } from './medios'

/**
 * Imágenes de ${NOMBRE} en R2, ya en WebP (generado por scripts/imagenes.mjs; no
 * editar a mano). Las gráficas terminadas son \`publicaciones\`, \`felicitaciones\`
 * y \`reels-e-historias\`; el resto son cuadros de secuencias de animación.
 */
export type GrupoImagen${NOMBRE} = ${ids.map((i) => `'${i}'`).join(' | ')}

export type Imagen${NOMBRE} = { src: string; nombre: string; grupo: GrupoImagen${NOMBRE}; ancho: number; alto: number }

export const grupos${NOMBRE}: Record<GrupoImagen${NOMBRE}, string> = ${JSON.stringify(etiquetas, null, 2)}

const img = (grupo: GrupoImagen${NOMBRE}, nombre: string, ancho: number, alto: number): Imagen${NOMBRE} => ({
  src: \`\${MEDIA_URL}/web/${torneo}/img/\${grupo}/\${nombre}.webp\`,
  nombre,
  grupo,
  ancho,
  alto,
})

export const imagenes${NOMBRE}: Imagen${NOMBRE}[] = [
${items.map((i) => `  img('${i.grupo.id}', '${i.nombre}', ${i.ancho}, ${i.alto}),`).join('\n')}
]
`
writeFileSync(join(RAIZ, 'lib', `${torneo}-imagenes.ts`), salidaTs)

const por = ids.map((id) => `${id}: ${items.filter((i) => i.grupo.id === id).length}`).join(', ')
console.log(`${items.length} imágenes → media-web/${torneo}/img/ (${por})`)
