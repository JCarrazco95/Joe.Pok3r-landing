import * as THREE from 'three'

/**
 * Texturas de fichas y cartas del hero, dibujadas con canvas: no hay modelos ni
 * imágenes que descargar. Es la `makeAssets()` del prototipo.
 */

/** Pares [color de la ficha, color de las franjas]. */
const FICHAS: [string, string][] = [
  ['#8B5CF6', '#FAFAFA'],
  ['#D6334B', '#FAFAFA'],
  ['#3B6FE0', '#FAFAFA'],
  ['#18181B', '#A78BFA'],
  ['#FAFAFA', '#D6334B'],
]

export type Texturas3D = {
  /** Una terna [canto, cara, cara] por combinación de color. */
  fichas: THREE.Material[][]
  /** Material de cada carta: [canto×4, frente, reverso]. */
  cartas: THREE.Material[][]
  dispose: () => void
}

function lienzo(w: number, h: number, dibujar: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  if (g) dibujar(g, w, h)
  return c
}

/**
 * `fuente` es el `font-family` de Bebas tal como lo registró next/font. Hay que
 * esperar a que cargue antes de dibujar, o el canvas pinta con la de respaldo.
 */
export async function crearTexturas(fuente: string): Promise<Texturas3D> {
  const display = `${fuente}, Impact, sans-serif`
  try {
    await document.fonts.load(`400 120px ${display}`)
  } catch {
    // Sin la fuente se dibuja con Impact: se ve peor, pero se ve.
  }

  const texturas: THREE.Texture[] = []
  const tex = (c: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    texturas.push(t)
    return t
  }

  const fichas = FICHAS.map(([base, trazo]) => {
    const cara = lienzo(512, 512, (g, w) => {
      const c = w / 2
      g.fillStyle = base
      g.beginPath()
      g.arc(c, c, c, 0, 7)
      g.fill()

      g.fillStyle = trazo
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4
        g.beginPath()
        g.arc(c, c, c, a - 0.17, a + 0.17)
        g.arc(c, c, c * 0.74, a + 0.2, a - 0.2, true)
        g.fill()
      }

      g.strokeStyle = trazo
      g.lineWidth = 6
      g.setLineDash([16, 12])
      g.beginPath()
      g.arc(c, c, c * 0.64, 0, 7)
      g.stroke()
      g.setLineDash([])
      g.lineWidth = 4
      g.beginPath()
      g.arc(c, c, c * 0.55, 0, 7)
      g.stroke()

      g.fillStyle = trazo
      g.font = `400 210px ${display}`
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillText('J', c, c + 12)
    })

    const canto = lienzo(1024, 64, (g, w, h) => {
      g.fillStyle = base
      g.fillRect(0, 0, w, h)
      g.fillStyle = trazo
      for (let i = 0; i < 8; i++) g.fillRect((i * w) / 8, 0, w / 22, h)
    })

    const material = (c: HTMLCanvasElement) =>
      new THREE.MeshStandardMaterial({ map: tex(c), roughness: 0.42, metalness: 0.08 })
    return [material(canto), material(cara), material(cara)] as THREE.Material[]
  })

  const frente = (rango: string, palo: string, color: string) =>
    lienzo(500, 700, (g, w, h) => {
      g.fillStyle = '#FAFAFA'
      g.beginPath()
      g.roundRect(0, 0, w, h, 40)
      g.fill()

      g.fillStyle = color
      g.textAlign = 'center'
      const esquina = () => {
        g.font = `400 120px ${display}`
        g.fillText(rango, 70, 130)
        g.font = '70px serif'
        g.fillText(palo, 70, 200)
      }
      esquina()
      g.save()
      g.translate(w, h)
      g.rotate(Math.PI)
      esquina()
      g.restore()

      g.font = '300px serif'
      g.textBaseline = 'middle'
      g.fillText(palo, w / 2, h / 2 + 10)
    })

  const reverso = lienzo(500, 700, (g, w, h) => {
    g.fillStyle = '#8B5CF6'
    g.beginPath()
    g.roundRect(0, 0, w, h, 40)
    g.fill()

    g.strokeStyle = 'rgba(250,250,250,.35)'
    g.lineWidth = 3
    for (let i = -h; i < w + h; i += 34) {
      g.beginPath()
      g.moveTo(i, 0)
      g.lineTo(i + h, h)
      g.stroke()
      g.beginPath()
      g.moveTo(i, h)
      g.lineTo(i + h, 0)
      g.stroke()
    }

    g.fillStyle = '#18181B'
    g.beginPath()
    g.arc(w / 2, h / 2, 120, 0, 7)
    g.fill()
    g.fillStyle = '#FAFAFA'
    g.font = `400 170px ${display}`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('J', w / 2, h / 2 + 8)
  })

  const canto = new THREE.MeshStandardMaterial({ color: 0xf4f4f5, roughness: 0.5 })
  const dorso = new THREE.MeshStandardMaterial({ map: tex(reverso), roughness: 0.45, transparent: true })
  const cara = (c: HTMLCanvasElement) =>
    new THREE.MeshStandardMaterial({ map: tex(c), roughness: 0.35, transparent: true })
  const cartas: THREE.Material[][] = [
    [canto, canto, canto, canto, cara(frente('J', '♠', '#18181B')), dorso],
    [canto, canto, canto, canto, cara(frente('J', '♥', '#D6334B')), dorso],
  ]

  return {
    fichas,
    cartas,
    dispose: () => {
      texturas.forEach((t) => t.dispose())
      fichas.flat().forEach((m) => m.dispose())
      cartas.flat().forEach((m) => m.dispose())
    },
  }
}
