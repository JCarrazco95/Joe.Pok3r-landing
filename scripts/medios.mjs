#!/usr/bin/env node
/**
 * Sube los medios nuevos de media-web/ a Cloudflare R2 y suma los reels nuevos
 * a lib/medios.ts.
 *
 *   npm run medios -- --dry     muestra qué haría, sin subir ni escribir nada
 *   npm run medios              sube y actualiza lib/medios.ts
 *
 * Estructura esperada: media-web/<torneo>/<nombre>.mp4 (+ <nombre>.jpg de poster).
 * El poster y los datos del video (duración, vertical) salen con ffmpeg/ffprobe.
 * Las fotos sólo se suben: necesitan alt y pie escritos a mano en lib/medios.ts.
 *
 * Credenciales en .env.local (nunca en el repo): ver .env.example.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

const RAIZ = resolve(import.meta.dirname, '..')
const CARPETA = join(RAIZ, 'media-web')
const MEDIOS_TS = join(RAIZ, 'lib', 'medios.ts')
const DRY = process.argv.includes('--dry')

// ── .env.local ──────────────────────────────────────────────────────────────
const envPath = join(RAIZ, '.env.local')
if (existsSync(envPath)) {
  for (const linea of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET = 'joepok3r-media' } = process.env
if (!DRY && !(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY)) {
  console.error('Faltan R2_ACCOUNT_ID, R2_ACCESS_KEY_ID o R2_SECRET_ACCESS_KEY en .env.local')
  process.exit(1)
}

const tiene = (cmd) => {
  try {
    execFileSync(cmd, ['-version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// ── ffmpeg: del PATH o, si la terminal es vieja, de la carpeta de winget ────
const WINGET = join(process.env.LOCALAPPDATA ?? '', 'Microsoft', 'WinGet', 'Packages')
const binario = (nombre) => {
  if (tiene(nombre)) return nombre
  if (existsSync(WINGET)) {
    for (const p of readdirSync(WINGET).filter((d) => d.startsWith('Gyan.FFmpeg'))) {
      for (const v of readdirSync(join(WINGET, p)).filter((d) => d.startsWith('ffmpeg-'))) {
        const exe = join(WINGET, p, v, 'bin', `${nombre}.exe`)
        if (existsSync(exe)) return exe
      }
    }
  }
  return null
}
const FFMPEG = binario('ffmpeg')
const FFPROBE = binario('ffprobe')

// ── Originales: media-origen/<torneo>/ + seleccion.txt → media-web/<torneo>/ ─
// seleccion.txt: una línea por video, "archivo.mp4 | Título". Se comprimen a
// 720p y se les pone un nombre limpio (sin acentos ni mayúsculas).
const ORIGEN = join(RAIZ, 'media-origen')
const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const titulos = new Map() // "torneo/slug" → título
if (existsSync(ORIGEN)) {
  for (const torneo of readdirSync(ORIGEN, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const sel = join(ORIGEN, torneo.name, 'seleccion.txt')
    if (!existsSync(sel)) continue
    if (!FFMPEG) {
      console.error('Falta ffmpeg: winget install Gyan.FFmpeg (y abre una terminal nueva)')
      process.exit(1)
    }
    for (const linea of readFileSync(sel, 'utf8').split(/\r?\n/)) {
      if (!linea.trim() || linea.startsWith('#')) continue
      const [archivo, tit] = linea.split('|').map((s) => s.trim())
      const entrada = join(ORIGEN, torneo.name, archivo)
      if (!existsSync(entrada)) {
        console.warn(`No existe ${torneo.name}/${archivo}, lo salto.`)
        continue
      }
      const nombre = slug(basename(archivo, '.mp4'))
      if (tit) titulos.set(`${torneo.name}/${nombre}`, tit)
      const salida = join(CARPETA, torneo.name, `${nombre}.mp4`)
      if (existsSync(salida)) continue
      mkdirSync(join(CARPETA, torneo.name), { recursive: true })
      console.log(`comprimiendo ${torneo.name}/${archivo} → ${nombre}.mp4`)
      execFileSync(FFMPEG, ['-y', '-v', 'error', '-i', entrada, '-vf', 'scale=720:-2,fps=30', '-c:v', 'libx264', '-crf', '28', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', salida], { stdio: 'inherit' })
    }
  }
}

// ── Qué hay en la carpeta y qué ya está en lib/medios.ts ────────────────────
const codigo = readFileSync(MEDIOS_TS, 'utf8')
const yaListados = new Set([...codigo.matchAll(/medio\("([^"]+\.mp4)"\)/g)].map((m) => m[1]))

const NOMBRES = { houston: 'Houston', austin: 'Austin', cdmx: 'CDMX', panama: 'Panamá' }
const titulo = (torneo, nombre) => {
  const base = nombre.replace(/[-_]+/g, ' ').trim()
  return `${NOMBRES[torneo] ?? torneo.charAt(0).toUpperCase() + torneo.slice(1)} · ${base.charAt(0).toUpperCase() + base.slice(1)}`
}

const nuevos = []
if (!FFPROBE) console.warn('Aviso: no encuentro ffprobe; si hay reels nuevos, el script se detendrá.')
for (const torneo of readdirSync(CARPETA, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const f of readdirSync(join(CARPETA, torneo.name)).filter((n) => n.endsWith('.mp4')).sort()) {
    const ruta = `${torneo.name}/${f}`
    if (!yaListados.has(ruta)) nuevos.push({ torneo: torneo.name, nombre: basename(f, '.mp4'), ruta })
  }
}

// ── Poster y datos de los reels nuevos ──────────────────────────────────────
const lineas = []
if (nuevos.length && !FFPROBE) {
  console.error(`Hay ${nuevos.length} reel(s) nuevo(s) pero falta ffmpeg: winget install Gyan.FFmpeg`)
  process.exit(1)
}
for (const n of nuevos) {
  const mp4 = join(CARPETA, n.ruta)
  const jpg = mp4.replace(/\.mp4$/, '.jpg')
  const sonda = JSON.parse(
    execFileSync(FFPROBE, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', mp4], { encoding: 'utf8' }),
  )
  const { width, height } = sonda.streams[0]
  const seg = Math.round(Number(sonda.format.duration))
  if (!existsSync(jpg)) {
    execFileSync(FFMPEG, ['-y', '-v', 'error', '-ss', '1', '-i', mp4, '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '4', jpg])
  }
  const vertical = height > width ? ', vertical: true' : ''
  const ruta = n.ruta.replace(/\.mp4$/, '')
  lineas.push(`  { src: medio("${ruta}.mp4"), poster: medio("${ruta}.jpg"), titulo: ${JSON.stringify(titulos.get(`${n.torneo}/${n.nombre}`) ?? titulo(n.torneo, n.nombre))}, seg: ${seg}${vertical} },`)
  console.log(`${DRY ? '[dry] ' : ''}reel nuevo: ${n.ruta} (${seg} s, ${width}x${height})`)
}

// ── Subida a R2 (sólo lo que cambió) ────────────────────────────────────────
const args = [
  's3', 'sync', CARPETA, `s3://${R2_BUCKET}/web`,
  '--endpoint-url', `https://${R2_ACCOUNT_ID ?? '<ACCOUNT_ID>'}.r2.cloudflarestorage.com`,
  '--exclude', 'manifiesto.json',
  '--cache-control', 'public, max-age=604800',
  ...(DRY ? ['--dryrun'] : []),
]
if (DRY && !R2_ACCESS_KEY_ID) {
  console.log('[dry] Sin credenciales en .env.local: no consulto R2, sólo listé los reels nuevos.')
  process.exit(0)
}
execFileSync('aws', args, {
  stdio: 'inherit',
  env: { ...process.env, AWS_ACCESS_KEY_ID: R2_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY: R2_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION: 'auto', AWS_REQUEST_CHECKSUM_CALCULATION: 'when_required', AWS_RESPONSE_CHECKSUM_VALIDATION: 'when_required' },
})

// ── lib/medios.ts: los nuevos van al principio de la lista ──────────────────
if (lineas.length && !DRY) {
  const marca = 'export const reelsR2: Reel[] = [\n'
  if (!codigo.includes(marca)) throw new Error('No encontré reelsR2 en lib/medios.ts')
  writeFileSync(MEDIOS_TS, codigo.replace(marca, marca + lineas.join('\n') + '\n'))
  console.log(`lib/medios.ts: ${lineas.length} reel(s) agregado(s). Revisa los títulos, haz commit y push.`)
} else if (!nuevos.length) {
  console.log('No hay reels nuevos en media-web/.')
}
