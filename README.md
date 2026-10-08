# Landing de Joe.Pok3r

Sitio público de Joe Vega (Joe.Pok3r), operado por Analy·sys.

Vivía dentro del HUB privado. Se separó porque no compartía
nada con él: cero Supabase, cero sesión, cero middleware. Lo único que
importaba de fuera eran `cn()` y una constante. Compartir despliegue obligaba a
darle a una página pública la misma configuración de acceso que a una
herramienta privada.

**Ya no es 100 % estático.** Las páginas se siguen prerenderizando, pero el feed
de redes sociales sale de un route handler (`/api/social`) con ISR: se sirve
desde caché y se regenera solo cada 30 min. Sigue sin haber middleware ni base
de datos. Contexto en [PLAN.md](PLAN.md).

## Arrancar

```bash
npm install
npm run dev
```

`npm run check` corre typecheck y lint; `npm test` corre las pruebas (vitest) de
la capa de feeds.

## Editar el contenido

**Todo está en [`lib/joe-poker.ts`](lib/joe-poker.ts)** — textos, estadísticas,
enlaces, reels y pies de foto. No hace falta tocar JSX.

El bloque `historia` es la bio dictada por Joe, en primera persona. Si se edita,
que sea con sus palabras: el tono es parte del punto.

Los enlaces con `url: null` se pintan deshabilitados con la etiqueta
"Próximamente". En cuanto se pega la URL real, el botón se activa solo.

## Encender el aviso de "jugando ahora"

Arriba del todo en [`lib/joe-poker.ts`](lib/joe-poker.ts) está el bloque
`enVivo`. Es lo único de la landing que cambia en horas y no en semanas, por eso
vive suelto al principio del archivo.

```ts
export const enVivo = {
  activo: true,                                    // el interruptor
  evento: 'WSOP Circuit México · #2 Mini Main Event',
  detalle: 'Day 1A · mesa 22 · 64.2K (80 BB)',     // opcional
  url: null,                                       // enlace a la cobertura
}
```

Pon `activo: true`, empuja el commit y Vercel redespliega solo — un par de
minutos. Se puede editar desde github.com en el teléfono, que es la idea: que
funcione estando en el casino.

Apágalo cuando Joe salga del torneo. Con `activo: false` el aviso no se
renderiza: no queda hueco ni marcado en el HTML.

`detalle` y `url` son opcionales.

**`url` está en `null` a propósito.** Para el WSOP Circuit CDMX 2026 no existe
una página pública donde se vea el stack de un jugador: wsop.com sólo publica el
calendario, WSOP LIVE es app móvil sin web, PokerNews no cubrió esta parada, y
Código Poker —el aliado oficial— no abrió liveblog, sino que cubrió por redes y
por el stream de PokerGO en Español.

Si en otra serie sí hay liveblog público, se pega la URL ahí y el aviso se
convierte en enlace solo.

## Agregar fotos

1. Optimiza a `.webp` (máximo 1400 px de lado) y déjala en `public/`.
2. Agrégala a `galeria` **con su ancho y alto reales**: fijan la proporción de
   la tarjeta y evitan el salto de layout al cargar.
3. Ponle su `evento`, que es lo que alimenta los chips del filtro.
4. Revisa dónde la insertas. El masonry es `column-count` de CSS, que llena las
   columnas en secuencia: el orden del arreglo decide qué tan parejo cierran,
   y hay que revisarlo en cada filtro, no sólo en "Todas".

## Agregar reels

Los clips van en `public/reels/` junto a su póster, y se listan en `reels`.

- **El póster no es opcional.** Los `<video>` usan `preload="none"` para que la
  página no descargue los ~11 MB de clips hasta que alguien toque uno. Sin
  póster las tarjetas se ven negras. Saca un fotograma del propio video.
- **Las tarjetas son 16:9.** Si subes uno vertical, márcalo con `vertical: true`
  y se mostrará completo con barras en vez de recortado.

## Cómo está armado

| Archivo | Qué hace |
| --- | --- |
| `lib/joe-poker.ts` | Contenido: perfil, stats, enlaces, reels y galería |
| `app/layout.tsx` | Metadatos, `lang="es"`, fuentes, efecto magnético y analítica |
| `lib/seo.ts` | Título, descripción y JSON-LD `Person` con `sameAs` (solo perfiles propios) |
| `app/opengraph-image.jpg`, `app/twitter-image.jpg` | Imagen social (1200×630), por convención de archivos de Next |
| `lib/motion.ts` | Tokens de movimiento y hooks de `prefers-reduced-motion` / puntero fino |
| `lib/analitica.ts` | Eventos de Vercel Analytics (`clic_red`, `abrir_post`, `cargar_kick`) |
| `app/globals.css` | Base de Tailwind y el tema, acotado a `.joe-theme` |
| `app/page.tsx` | Composición de las secciones y datos estructurados |
| `lib/social/` | Feeds sociales: un adaptador por red, contrato `PostSocial`, agregador y lista manual |
| `app/api/social/route.ts` | `GET /api/social`: el feed agregado, con ISR |
| `components/` | Galería con visor y filtro, carrusel de reels, filas de enlace |
| `public/` | Fotos, clips y pósters |

## Feeds sociales

`GET /api/social` devuelve `{ posts, fuentes, generado }`. Cada post cumple el
contrato `PostSocial` de [`lib/social/types.ts`](lib/social/types.ts); `fuentes`
dice, por red, si los datos son `real`, `manual` o `vacio`, para que la UI pueda
avisarlo.

| Red | Fuente | Sin credenciales o si falla |
| --- | --- | --- |
| YouTube | RSS público del canal (sin API key; no trae vistas) | Respaldo manual |
| Kick | API oficial con OAuth de aplicación. **No existe endpoint de clips** | Clips del manual |
| Instagram | Embeds curados a mano. Camino Graph API listo pero apagado | Siempre manual |
| TikTok | oEmbed oficial sobre la lista curada | Post sin título/miniatura |
| Facebook | Apagado: no hay Página | Vacío |

Un adaptador roto nunca tumba a los demás ni a la página: si una red se queda sin
datos, se usa su lista de [`lib/social/manual.ts`](lib/social/manual.ts), y si
tampoco hay, esa red simplemente no aparece. `manual.ts` empieza vacío: se llena
pegando URLs reales y su fecha.

Ajustes: frecuencia de refresco en `lib/social/config.ts` (`REVALIDAR_SEG`, y el
literal gemelo de `app/api/social/route.ts`, que una prueba vigila), y límites de
posts en `lib/social/index.ts` (`MAX_POSTS_POR_RED`, `MAX_POSTS_TOTAL`).

### Sección «Últimas publicaciones»

[`components/sections/publicaciones.tsx`](components/sections/publicaciones.tsx) lee el
feed en el servidor con `obtenerFeed()` (la página es ISR, `revalidate = 1800`, literal gemelo
de `REVALIDAR_SEG`) y se lo pasa al muro de [`components/feed/`](components/feed/): filtro por
red, tarjetas y visor. Si el fetch fallara o no hubiera posts, la sección muestra el estado
vacío con enlaces a las redes; nunca rompe la página.

- El texto de los posts es de terceros: se pinta siempre como texto de React.
- Los embeds (YouTube por `youtube-nocookie.com`, Instagram y TikTok por su iframe oficial)
  se crean solo al abrir el visor, nunca al cargar la página, y no se carga ningún script de
  terceros. Kick no tiene embed: el visor muestra la vista previa y el enlace.
- Las miniaturas son `<img>` perezosas con `no-referrer`: salen de las CDN de cada red.
- Probar los estados (0, 1 y 30 posts, cargando, error) con datos de ejemplo: `/design`,
  bloque «Muro de publicaciones». Los ejemplos viven en `components/feed/ejemplos.ts` y
  solo los importa esa página.

### Directo de Kick («En directo»)

El HTML de la página es ISR (30 min) y no puede saber si Joe está transmitiendo, así que el estado
se pregunta aparte:

- [`lib/en-vivo.ts`](lib/en-vivo.ts) combina Kick con el interruptor manual `enVivo` de
  `lib/joe-poker.ts`. Nunca lanza. Si Kick confirma directo → `real`; si no, y el interruptor está
  activo → `manual` (directos que no pasan por Kick, p. ej. un torneo); si Kick responde apagado →
  `real` apagado; si Kick falla o no hay credenciales → `manual` apagado (sin certeza).
- `GET /api/en-vivo` ([`app/api/en-vivo/route.ts`](app/api/en-vivo/route.ts)) cachea 60 s en la CDN
  (`s-maxage=60`, `stale-while-revalidate=120`): a Kick le llega ~1 consulta por minuto sin
  importar las visitas. El `revalidate` literal debe coincidir con `REVALIDAR_EN_VIVO_SEG`
  (`lib/directo.ts`); una prueba lo vigila.
- [`ProveedorEnVivo`](components/directo/proveedor.tsx) arranca con el estado manual del HTML,
  consulta al montar y cada 60 s con la pestaña visible, y conserva el último estado si falla.
- Solo el origen `real` dice «En vivo en Kick», muestra espectadores y ofrece reproductor.
- El aviso ([`components/en-vivo.tsx`](components/en-vivo.tsx)) va superpuesto bajo la nav, así que
  no empuja el hero. La sección [`#directo`](components/sections/directo.tsx) muestra la portada,
  y sin directo los clips de Kick (de `manual.ts`: Kick no tiene endpoint público de clips).
- El reproductor (`player.kick.com`, **no documentado como oficial**) se monta solo al hacer clic
  en la portada, en un visor modal con el mismo foco/Escape/aria que el de posts (`useModal`).
  El visor siempre ofrece «Abrir en Kick»; la URL del embed vive solo en `embedKick`
  (`lib/directo.ts`), por si hay que cambiarla.

Probar los estados:

- Todos los casos (en vivo, manual, comprobando, apagado con y sin clips, Kick sin respuesta):
  `/design`, bloque «Directo de Kick».
- La página real en local: `EN_VIVO_SIMULADO=en-vivo` (o `apagado`) en `.env.local`. Se ignora
  cuando `NODE_ENV=production`, así que nunca afecta al sitio publicado.

## Variables de entorno

Documentadas en [`.env.example`](.env.example) y leídas desde
[`lib/env.ts`](lib/env.ts). Los tokens viven **solo** en las variables de entorno
de Vercel, nunca en el repo. Todas son opcionales: sin ellas el sitio funciona y
los feeds caen al contenido manual.

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL absoluta del sitio (sin barra final): Open Graph, canonical, sitemap y JSON-LD. Si falta usa el dominio de producción que inyecta Vercel y, en local, localhost. **Ponla en producción** |
| `YOUTUBE_CHANNEL_ID` | Sobreescribe el canal de YouTube (ya hay uno por defecto, es público) |
| `KICK_CLIENT_ID`, `KICK_CLIENT_SECRET` | App de Kick (OAuth client credentials) |
| `KICK_CHANNEL_SLUG` | Sobreescribe el canal de Kick (por defecto `joe-pok3r`) |
| `EN_VIVO_SIMULADO` | Solo desarrollo: `en-vivo` o `apagado` simula el estado de Kick. Se ignora en producción |
| `INSTAGRAM_AUTO`, `INSTAGRAM_ACCESS_TOKEN` | Camino automático de Instagram. Apagado; solo con una Página de Facebook |

## Movimiento, SEO y analítica (fase 6)

- **Movimiento.** Un solo conjunto de tokens: `--ease-out` y `--duration-*` en
  `globals.css`, y `MOVIMIENTO` en `lib/motion.ts` para lo que va en JS. Solo se
  animan `transform` y `opacity`. `Revelar` hace el scroll reveal;
  `EfectoMagnetico` (montado en el layout) arrastra los `Boton magnetico` hacia
  el puntero. Con `prefers-reduced-motion` no hay magnetismo, ni marquesinas, ni
  zoom de fotos, ni 3D en movimiento (queda quieto), y el contenido se ve desde
  el primer momento.
- **3D del hero.** Three.js se monta cuando la página está en reposo (≥ 640 px)
  o en el primer gesto (en móvil, en la primera interacción). Es un adorno: el
  hero ya se ve completo sin él.
- **SEO.** Metadatos y Open Graph en `app/layout.tsx`; JSON-LD en `lib/seo.ts`
  (`sameAs`: Instagram, TikTok, YouTube, Twitch, Kick y Hendon Mob; Facebook no
  existe y la cuenta de Código Poker es de un tercero). `app/sitemap.ts` y
  `app/robots.ts` salen de `NEXT_PUBLIC_SITE_URL`. `/design` está en `noindex`.
- **Analítica.** Vercel Analytics, sin cookies ni banner. Eventos: `clic_red`
  (`red`), `abrir_post` (`red`) y `cargar_kick`. Ningún dato personal.
- **Instalación.** `.npmrc` trae `legacy-peer-deps=true`: sin él `npm install`
  falla por peers opcionales de `@vercel/analytics`.

### Peso de los reels

Los 9 clips suman **~38 MB** (el más grande, 6.8 MB). No se descargan al cargar la
página (`preload="none"`, y los pósters solo al acercarse), pero sí al reproducirlos.
Conviene recomprimirlos (480–720 px de alto, H.264, `faststart`), por ejemplo:

```bash
ffmpeg -i reel-5.mp4 -vf "scale=-2:720" -c:v libx264 -crf 28 -preset slow   -movflags +faststart -c:a aac -b:a 96k reel-5.min.mp4
```

## Desplegar

Vercel, importando el repo. Variables a cargar y checklist completo en
[`docs/despliegue.md`](docs/despliegue.md).

Al ser un proyecto aparte del HUB, su protección de despliegues es
independiente: los previews pueden ser públicos para enseñárselos a alguien sin
exponer los del HUB.
