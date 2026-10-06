# Handoff: Landing Joe.Pok3r — versión interactiva "Fichas 3D"

## Overview
Rediseño de la landing pública de Joe.Pok3r (Joe Vega) en el repo **JCarrazco95/Joe.Pok3r-landing** (Next.js 15 · React 19 · Tailwind 4, sitio estático en Vercel). Sustituye el layout actual tipo "Linktree" de una columna (`app/page.tsx`) por una página de secciones a pantalla completa, con hero 3D (three.js), animaciones al hacer scroll y varias interacciones.

## About the Design Files
Los archivos de `prototipo/` son **referencias de diseño hechas en HTML**: muestran el look y el comportamiento, **no son código para copiar tal cual**. La tarea es **recrear el diseño dentro del repo existente** con sus patrones: componentes en `components/`, contenido en `lib/joe-poker.ts`, Tailwind 4, `next/image`, `lucide-react`.

- `prototipo/Joe.Pok3r Landing (abrir en navegador).html` — versión autocontenida; ábrela con doble clic para verla funcionando.
- `prototipo/Landing Joe.Pok3r.dc.html` — fuente legible del prototipo (marcado + clase de lógica al final del archivo). Es la referencia exacta de estilos, tiempos y lógica.

## Fidelity
**High-fidelity.** Colores, tipografía, espaciados, tiempos y easings son finales. Recrear pixel-perfect.

## Reglas para Claude Code
1. **Todo el contenido sale de `lib/joe-poker.ts`** (`joe`, `resultados`, `enlaces`, `reels`, `galeria`, `eventos`, `enVivo`). No hardcodear textos en JSX. El prototipo tiene copias de esos datos; si difieren, manda `lib/joe-poker.ts` (p. ej. los `evento` de cada foto).
2. Respetar las decisiones documentadas en el repo: `puesto: null` = "sin registrar" (no inventar), enlaces con `url: null` = "Próximamente" deshabilitado, `enVivo.activo` = aviso de "jugando ahora" (mantener `components/en-vivo.tsx` arriba del hero), reels con `preload="none"` + póster, `vertical: true`.
3. Mantener SEO de `app/layout.tsx` y el JSON-LD de `app/page.tsx`.
4. `prefers-reduced-motion: reduce` → apagar intro, cursor, tilt, magnetismo, marquesinas y dejar el 3D estático.
5. Táctil (`pointer: coarse`) → sin cursor personalizado ni magnetismo; el volteo de tarjetas se hace con tap.

## Stack a añadir
```bash
npm i three @react-three/fiber @react-three/drei gsap @gsap/react lenis
```
- **Hero 3D:** React Three Fiber + Drei, cargado con `next/dynamic(..., { ssr:false })`.
- **Scroll:** Lenis (scroll suave) + GSAP ScrollTrigger (revelados, línea de tiempo, barra de progreso).
- **Contadores / microinteracciones:** GSAP o `requestAnimationFrame`.
- Opcional: `@react-three/rapier` si se quieren fichas con física real en el modo "torre".

## Design Tokens
Colores
- Fondo `#0b0b0d` · superficie `#131316` / `#18181B` · borde `#27272A` / `#3F3F46`
- Texto `#FAFAFA` · secundario `#D4D4D8` · muted `#A1A1AA` · tenue `#71717A`
- Violeta (marca) `#8B5CF6` · hover `#7C3AED` · claro `#A78BFA`
- Rojo `#D6334B` · rosa `#F08A99` · azul `#3B6FE0` · naranja `#C2410C`
- Fondo de mesa (sección "Tu mano"): `radial-gradient(ellipse 70% 80% at 50% 50%, #2a1f4a 0%, #18181B 60%, #0b0b0d 100%)`

Tipografía
- Display: **Bebas Neue** 400 (ya está en `next/font/google`). Títulos de sección `clamp(64px, 8vw, 120px)`, line-height .85. H1 hero `clamp(96px, 15vw, 232px)`, line-height .84.
- Texto: **Mont** 500/600/700 (archivos en `fonts-para-public/` → copiar a `public/fonts/` y cargar con `next/font/local`, variable `--font-body`). Sustituye a Inter en esta versión.
  ⚠ El layout actual dice "la marca no usa negritas". El diseño usa 600/700 en etiquetas y botones: confirmar con Joe; si no, bajar a 500.
- Eyebrows: 13px, 700, `letter-spacing: .3em`, mayúsculas, `#A78BFA`.
- Cuerpo: 15–17px, line-height 1.55–1.65, `text-wrap: pretty`.

Forma
- Radios: botones/pills 999px · tarjetas 16–20px · contacto 28px · galería 14px.
- Sombras: tarjeta destacada `0 30px 80px rgba(0,0,0,.5)` · cartas `0 30px 60px rgba(0,0,0,.55)` · glow violeta `0 0 40px rgba(139,92,246,.6)`.
- Contenedor: `max-width: 1360px`, padding lateral `clamp(20px, 4vw, 56px)`. Separación entre secciones ≈ 120–140px.
- Easing estándar: `cubic-bezier(.2,.8,.2,1)`. Rebote: `cubic-bezier(.2,.9,.25,1.15)`.

## Secciones (en orden)

**0. Intro "Barajando"** (overlay fijo, z 100, fondo `#0b0b0d`)
Ficha de 120px girando (conic-gradient violeta/gris, 1.2s/vuelta) con "J" en Bebas y contador `0%→100%` en 1.5s. Al terminar se recoge hacia arriba con `clip-path: inset(0 0 100% 0)` en 700ms `cubic-bezier(.7,0,.2,1)`. Una sola vez por sesión (`sessionStorage`).

**1. Nav fija** (72px)
Logo "JOE.POK3R" (el 3 en violeta) · anclas Resultados / Tu mano / Historia / Reels / Galería / Redes · botón pill "Patrocinios" violeta. Transparente arriba; con `scrollY > 40` pasa a `rgba(11,11,13,.82)` + `backdrop-filter: blur(14px)` + borde inferior `#27272A`. Barra de progreso de 3px arriba (gradiente violeta→rojo, `scaleX` = progreso del scroll).

**2. Hero** (`min-height: max(100vh, 720px)`)
- Fondo: dos radiales (violeta 28% a 75%/45%, rojo 22% a 95%/90%) + retícula de 64px al 3.5% con máscara radial.
- Canvas 3D a pantalla completa detrás del texto (ver "Escena 3D").
- Texto a la izquierda: eyebrow con punto rojo parpadeante "JOE VEGA · TEXAS HOLD'EM · MÉXICO", H1 por letras (cada letra entra con `translateY(105%) rotate(8deg)` → 0, 900ms, 55ms de desfase), bio de `joe.bio`, botones "Ver resultados" (blanco) y "Reparte una mano ♠" (borde), y la nota "Mueve el mouse · haz clic para barajar las fichas".
- Barra inferior de 4 stats con contadores (1.6s, ease-out expo): 6.º · $160K · 9/112 · 20+ años. Fuente: `joe.stats` + "20+ años".
- Debajo: marquesina roja `#D6334B` girada −1.2deg, Bebas 30px, 34s/loop, con resultados separados por ♠ ♥ ♣ ♦.

**Escena 3D** (three r160 / R3F)
- Cámara: perspectiva, FOV 32, z = 20. Luces: ambiental 0.8, direccional 2 en (4,7,9), puntuales violeta y roja (intensidad 80, alcance 40).
- Fichas: `CylinderGeometry(1, 1, .26, 64)`. Texturas generadas en canvas: cara con 8 franjas, anillo punteado, anillo sólido y "J" Bebas; canto con 8 franjas. Cinco combinaciones: violeta/blanco, rojo/blanco, azul/blanco, negro/violeta claro, blanco/rojo. Material estándar con rugosidad .42.
- Cartas J♠ y J♥: `BoxGeometry(2.5, 3.5, .03)`, reverso violeta con trama y "J".
- Grupo desplazado a la derecha (20% del ancho visible) en escritorio; centrado y escalado .75 en pantallas estrechas. Sigue al mouse con lerp .05 (rotY ±.45, rotX ±.25). Al hacer scroll sube y gira.
- Clic en el hero = "burst": las fichas aceleran ×8 y se abren, las cartas dan una vuelta completa (1.1s, ease-out cúbico).
- Prop/flag `escena3d`, **por defecto `'orbita'`**:
  - `orbita`: 18 fichas orbitando en elipse (radio 4.4–5.6) alrededor de las cartas.
  - `lluvia`: 42 fichas cayendo y girando sin fin.
  - `torre`: 5 columnas que se apilan ficha a ficha con gravedad y, al llenarse, salen volando.
- Pausar el render cuando el hero sale de pantalla (IntersectionObserver).

**Fotos de fondo del hero** (nuevo · v1.1)
- 3 fotos de Joe (`public/hero/joe-1.jpg`, `joe-2.jpg`, `joe-3.jpg`) detrás del texto y del canvas 3D. Agregarlas a `lib/joe-poker.ts` como `joe.fotosHero` con su foco horizontal (`.5`, `.47`, `.5`).
- Capa absoluta pegada a la izquierda: `top:0; bottom:0; left:0; width:min(100%, max(62%, 640px))`, con `mask-image: linear-gradient(90deg,#000 25%,transparent 100%)` (+ `-webkit-`) para que se desvanezca hacia las fichas.
- Cada foto: `next/image` con `fill`, `object-fit: cover`, `object-position: {foco}% 30%`, `filter: grayscale(.25) contrast(1.05)`. La primera con `priority`.
- Rotación cada **5 s**. La activa queda en `opacity: .5; transform: scale(1.08)` y las demás en `opacity: 0; scale(1)`. Transición `opacity 1.6s ease, transform 7s linear` (crossfade + zoom lento).
- Encima, un overlay: `linear-gradient(0deg,#0b0b0d,transparent 35%), linear-gradient(90deg,rgba(11,11,13,.35),rgba(11,11,13,.1) 50%,#0b0b0d 100%)`.
- Orden de capas: fondo radial → rejilla → **fotos** → canvas 3D → texto (z 2) → barra de stats (z 3).
- Con `prefers-reduced-motion`: sin zoom y cambio de foto sin transición (o solo la primera foto fija).

**3. Resultados** (`#resultados`)
Dos columnas (`auto-fit, minmax(min(100%,520px),1fr)`).
- Izquierda: tarjeta destacada con foto `mesa-final.webp`, degradado a negro, badge rojo "DESTACADO · 31 AGO 2026", título, nota y 3 mini-stats. **Tilt 3D** con el mouse (±12°, scale 1.02, perspective 1200px).
- Derecha: 4 tarjetas (una por `resultados`) que **se voltean en Y** al pasar el mouse (700ms). Frente: fecha, palo, torneo, sede, resultado. Reverso a color pleno del palo con la `nota`. Palo/color fijo: ♥ `#D6334B`, ♠ `#8B5CF6`, ♣ `#3B6FE0`, ♦ `#C2410C`. Si `puesto` es null, mostrar el dato disponible (Day 1A, Day 1C, buy-in), nunca un puesto inventado.

**4. "¿Qué haría Joe con tu mano?"** (`#mano`)
Fondo de mesa con óvalo de borde violeta. Botón "Repartir ♠" → dos cartas al azar de una baraja de 52 (sin repetir). Las cartas entran desde arriba girando (750ms, 150ms de desfase, easing de rebote) y aparece un veredicto: nombre de la mano, frase de Joe y probabilidad real de recibirla (pareja 0.45%, mismo palo 0.30%, distinto palo 0.90%). Reglas: JJ+ "¡All-in sin pensarlo!" · pareja baja "a buscar el set" · dos broadway "Subo" · conectores del mismo palo "en posición, la juego" · As débil "depende de la posición" · resto "Fold. Paciencia, la buena viene." Mostrar contador "Manos repartidas". Lógica exacta: `verdict()` en el prototipo.

**5. Historia** (`#historia`)
4 hitos sacados de `joe.historia` en una línea de tiempo vertical. La línea de color (gradiente violeta→rojo) crece con el scroll (`scaleY` con ScrollTrigger scrub). Puntos de 24px con borde de color; el último, rojo y con brillo. Debajo, chips de `joe.plataformas`.

**6. Reels** (`#reels`)
Carrusel horizontal con scroll-snap y botones ←/→ de 56px (avanzan 520px). Usar el `<Reels>` actual o recrearlo: póster obligatorio, **reproducción en silencio al pasar el mouse** y pausa al salir, badge de duración, la tarjeta sube 8px en hover. Respetar `vertical`.

**7. Galería** (`#galeria`)
Chips de filtro desde `eventos` (activo = violeta pleno). Grid `auto-fill minmax(220px,1fr)`, filas de 220px, `grid-auto-flow: dense`; 1 de cada 7 fotos ocupa 2×2. Hover: zoom 1.08 (600ms) y más saturación. Primeras 12 fotos + botón "Ver las N fotos". Visor a pantalla completa con ←/→, teclado (Esc, flechas) y pie de foto "n / total". Se puede adaptar el `<Gallery>` actual (masonry) si se prefiere; lo importante son el filtro, el visor y los hovers.

**8. Redes** (`#redes`)
Lista desde `enlaces` (excepto `contacto`). Cada fila: nombre en Bebas `clamp(40px,5vw,72px)` + detalle + handle ↗. Hover: fondo violeta pleno y el contenido se desplaza 20px a la derecha (350ms). `url: null` → deshabilitado con "Próximamente".

**9. Contacto / patrocinios** (`#contacto`)
Bloque violeta `#8B5CF6`, radio 28px, ficha gigante girando en la esquina (40s/vuelta). Formulario: nombre, correo, propuesta. Botón "Enviar · All-in →". Estado de éxito: "¡Fichas al centro!". **El prototipo no envía nada**: conectar a un servicio (Formspree, Resend con una route handler o WhatsApp) y, cuando exista, rellenar `enlaces.contacto.url`.

**10. Pie**
"JOE.POK3R" gigante solo con contorno (`-webkit-text-stroke: 2px #3F3F46`), badge +18, aviso de juego responsable y "© {año} Joe.Pok3r · Operado por Analy·sys".

## Interacciones globales
- **Cursor ficha** (solo con puntero fino): punto blanco de 8px + anillo de 40px que lo sigue con lerp .18 y `mix-blend-mode: difference`. Sobre elementos clicables el anillo crece a 72px con relleno violeta al 25%.
- **Botones magnéticos** (`data-magnet`): a menos de 40px del botón, se desplazan hacia el cursor (×.28 en X, ×.35 en Y), 350ms.
- **Revelado al hacer scroll**: `opacity 0 → 1`, `translateY(48px) → 0`, 900ms, al entrar el 15% del elemento.
- Anclas de la nav con scroll suave y offset de 70px.

## Estado (cliente)
`scrolled`, `introVista`, `tarjetaVolteada`, `mano` (2 cartas) + `manosRepartidas`, `filtroGaleria`, `verTodas`, `fotoAbierta`, `formEnviado`. Todo local, sin backend. Aislar en componentes cliente (`'use client'`); la página sigue estática.

## Assets
Todo ya está en `public/` del repo: fotos `.webp`, `avatar.webp`, `logo.png`, `reels/*.mp4` y pósters, `og.jpg`. Lo nuevo: las fuentes Mont (`fonts-para-public/`) y las fotos del hero (`fotos-para-public/hero/` → copiar a `public/hero/`; conviene convertirlas a `.webp`). Las texturas de fichas y cartas se generan por código (canvas), no hay modelos 3D.

## Files
- `prototipo/Joe.Pok3r Landing (abrir en navegador).html` — demo funcional.
- `prototipo/Landing Joe.Pok3r.dc.html` — fuente de referencia (estilos inline + lógica).
- `fonts-para-public/` — Mont 500/600/700 y Bebas (woff2).
- `fotos-para-public/hero/` — las 3 fotos de fondo del hero.

## Prompt sugerido para Claude Code
> Lee `design_handoff_landing_joepok3r/README.md` y abre el prototipo como referencia. Reimplementa `app/page.tsx` siguiendo el diseño, con un componente por sección en `components/`, todo el contenido desde `lib/joe-poker.ts` y el hero 3D en React Three Fiber cargado sin SSR. Instala three, @react-three/fiber, @react-three/drei, gsap, @gsap/react y lenis. Respeta reduced-motion y táctil. Al terminar, corre `npm run check` y `npm run build`.
