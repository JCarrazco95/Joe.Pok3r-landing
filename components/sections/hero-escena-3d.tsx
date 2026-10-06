'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'

import { crearTexturas, type Texturas3D } from '@/lib/texturas-3d'

export type Escena3d = 'orbita' | 'lluvia'

type Props = {
  modo: Escena3d
  /** false = el hero salió de pantalla: se detiene el render. */
  visible: boolean
  /** Con reduced-motion la escena queda quieta, sin ratón ni scroll. */
  reducir: boolean
  /** Instante (segundos) del último "burst". Lo escribe el hero al hacer clic. */
  burst: RefObject<number>
}

/** Generador con semilla: la escena se arma igual en cada render. */
function azar(semilla: number) {
  let s = semilla >>> 0
  return (a: number, b: number) => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return a + (((t ^ (t >>> 14)) >>> 0) / 4294967296) * (b - a)
  }
}

type FichaOrbita = { a: number; rad: number; yo: number; sx: number; sz: number; ph: number }
type FichaLluvia = {
  x: number
  y: number
  z: number
  vy: number
  rx: number
  rz: number
  vx: number
  vz: number
}

function datosOrbita(): FichaOrbita[] {
  const rnd = azar(7)
  return Array.from({ length: 18 }, (_, i) => ({
    a: (i / 18) * Math.PI * 2,
    rad: rnd(4.4, 5.6),
    yo: rnd(-0.8, 0.8),
    sx: rnd(0.4, 1.2),
    sz: rnd(-0.8, 0.8),
    ph: rnd(0, 6),
  }))
}

function datosLluvia(): FichaLluvia[] {
  const rnd = azar(11)
  return Array.from({ length: 42 }, () => ({
    x: rnd(-9, 9),
    y: rnd(-9, 10),
    z: rnd(-7, 3),
    vy: rnd(1.4, 3),
    rx: rnd(0, 6),
    rz: rnd(0, 6),
    vx: rnd(-2, 2),
    vz: rnd(-2, 2),
  }))
}

function Mundo({
  modo,
  reducir,
  burst,
  texturas,
}: Omit<Props, 'visible'> & { texturas: Texturas3D }) {
  const grupo = useRef<THREE.Group>(null)
  const cartas = useRef<(THREE.Mesh | null)[]>([])
  const fichas = useRef<(THREE.Mesh | null)[]>([])
  const raton = useRef({ x: 0, y: 0, sx: 0, sy: 0 })
  const ancho = useThree((s) => s.size.width)
  const alto = useThree((s) => s.size.height)

  const orbita = useMemo(() => (modo === 'orbita' ? datosOrbita() : []), [modo])
  const lluvia = useMemo(() => (modo === 'lluvia' ? datosLluvia() : []), [modo])
  const cuantas = orbita.length + lluvia.length

  const geoFicha = useMemo(() => new THREE.CylinderGeometry(1, 1, 0.26, 64), [])
  const geoCarta = useMemo(() => new THREE.BoxGeometry(2.5, 3.5, 0.03), [])
  useEffect(
    () => () => {
      geoFicha.dispose()
      geoCarta.dispose()
    },
    [geoFicha, geoCarta],
  )

  useEffect(() => {
    if (reducir) return
    const alMover = (e: PointerEvent) => {
      raton.current.x = (e.clientX / window.innerWidth) * 2 - 1
      raton.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', alMover, { passive: true })
    return () => window.removeEventListener('pointermove', alMover)
  }, [reducir])

  useFrame((_, delta) => {
    const g = grupo.current
    if (!g) return
    const dt = reducir ? 0 : Math.min(0.05, delta)
    const t = reducir ? 0 : performance.now() / 1000
    const r = raton.current

    r.sx += (r.x - r.sx) * 0.05
    r.sy += (r.y - r.sy) * 0.05

    // Burst: las fichas aceleran ×8 y se abren; las cartas dan una vuelta.
    const bp = reducir ? 0 : Math.max(0, 1 - (t - burst.current) / 1.4)
    const giro = 1 + bp * 8
    const sy = reducir ? 0 : Math.min(1, window.scrollY / window.innerHeight)

    // A la derecha en escritorio (20% del ancho visible); centrado y a .75 en estrecho.
    const aspecto = ancho / alto
    const visW = 2 * Math.tan((32 * Math.PI) / 360) * 20 * aspecto
    const ancha = aspecto > 1.15
    g.position.set(ancha ? visW * 0.2 : 0, sy * 3, 0)
    g.scale.setScalar(ancha ? 1 : 0.75)
    g.rotation.set(r.sy * 0.25 + 0.18, r.sx * 0.45 + sy * 0.8, 0)

    const fp = reducir ? 1 : Math.min(1, (t - burst.current) / 1.1)
    const vuelta = fp < 1 ? (1 - (1 - fp) ** 3) * Math.PI * 2 : 0
    cartas.current.forEach((c, i) => {
      if (!c) return
      c.position.set(i ? 0.85 : -0.85, Math.sin(t * 1.2 + i) * 0.18, i * 0.06)
      c.rotation.set(0, vuelta + Math.sin(t * 0.6 + i) * 0.2, i ? -0.14 : 0.14)
    })

    orbita.forEach((d, i) => {
      const m = fichas.current[i]
      if (!m) return
      d.a += dt * 0.28 * (1 + bp * 3)
      const rr = d.rad + bp * 2.5
      m.position.set(
        Math.cos(d.a) * rr,
        Math.sin(d.a * 2 + d.ph) * 0.9 + d.yo,
        Math.sin(d.a) * rr * 0.55,
      )
      m.rotation.x = Math.PI / 2 + Math.sin(t * d.sx + d.ph) * 0.6
      m.rotation.z += dt * d.sz * giro
      m.rotation.y += dt * 0.6 * giro
    })

    lluvia.forEach((d, i) => {
      const m = fichas.current[i]
      if (!m) return
      d.y -= dt * d.vy * (1 + bp * 2)
      d.rx += dt * d.vx * giro
      d.rz += dt * d.vz * giro
      if (d.y < -10) {
        d.y = 10
        d.x = ((d.x * 7919 + i * 31) % 18) - 9
      }
      m.position.set(d.x, d.y, d.z)
      m.rotation.set(d.rx, 0, d.rz)
    })
  })

  return (
    <group ref={grupo}>
      {texturas.cartas.map((mats, i) => (
        <mesh
          key={i}
          ref={(m) => {
            cartas.current[i] = m
          }}
          geometry={geoCarta}
          material={mats}
        />
      ))}
      {Array.from({ length: cuantas }, (_, i) => (
        <mesh
          key={`${modo}-${i}`}
          ref={(m) => {
            fichas.current[i] = m
          }}
          geometry={geoFicha}
          material={texturas.fichas[i % 5]}
        />
      ))}
    </group>
  )
}

/**
 * Escena del hero en React Three Fiber: fichas orbitando (o cayendo) alrededor
 * de la J♠ y la J♥. Se carga con `next/dynamic` y `ssr: false`; no hay modelos,
 * las texturas se dibujan en canvas.
 */
export default function HeroEscena3D({ modo, visible, reducir, burst }: Props) {
  const [texturas, setTexturas] = useState<Texturas3D | null>(null)

  useEffect(() => {
    let vivo = true
    let hechas: Texturas3D | null = null
    // next/font publica el nombre real de la familia en --font-bebas.
    const fuente = getComputedStyle(document.documentElement).getPropertyValue('--font-bebas').trim()
    void crearTexturas(fuente || 'Bebas Neue').then((t) => {
      if (vivo) {
        hechas = t
        setTexturas(t)
      } else t.dispose()
    })
    return () => {
      vivo = false
      hechas?.dispose()
    }
  }, [])

  return (
    <Canvas
      frameloop={reducir ? 'demand' : visible ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ fov: 32, position: [0, 0, 20], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ opacity: texturas ? 1 : 0, transition: 'opacity 1200ms' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight intensity={2} position={[4, 7, 9]} />
      <pointLight color={0x8b5cf6} intensity={80} distance={40} position={[-7, 3, 6]} />
      <pointLight color={0xd6334b} intensity={80} distance={40} position={[8, -4, 6]} />
      {texturas ? <Mundo modo={modo} reducir={reducir} burst={burst} texturas={texturas} /> : null}
    </Canvas>
  )
}
