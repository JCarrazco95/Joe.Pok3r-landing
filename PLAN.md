# Plan de rediseño: Joe.Pok3r

Objetivo: pasar de una landing tipo Linktree a un sitio profesional, llamativo e
interactivo, con feed de redes sociales, y renombrar todo a "Joe Vega".

## Decisiones de arquitectura (antes de empezar)

1. **El sitio deja de ser 100 % estático.** Los feeds sociales cambian a diario.
   Se usa ISR de Next.js (`revalidate`) más route handlers: la página sigue
   sirviéndose desde caché, pero se refresca sola cada 15-60 min. El README hay
   que actualizarlo (hoy dice "sitio estático, sin base de datos").
2. **Un adaptador por red, un contrato común.** Todos devuelven `PostSocial[]`
   (`red`, `id`, `url`, `texto`, `media`, `fecha`, `metricas?`). La UI nunca
   conoce la API de cada red.
3. **Cada adaptador cae a contenido manual** (`lib/social/manual.ts`) si falla la
   API, el token expiró o no hay credenciales. La página nunca se rompe ni se
   queda vacía.
4. **Los tokens viven solo en variables de entorno de Vercel**, nunca en el repo.
   Se documentan en `.env.example`.

### Realidad de cada red

| Red | Vía recomendada | Costo / fricción |
| --- | --- | --- |
| YouTube | RSS público `feeds/videos.xml?channel_id=…` (sin API key) o Data API v3 | Baja. RSS no da vistas |
| Kick | API pública oficial (OAuth) para estado en vivo y clips; embed `player.kick.com/<canal>` para el directo | Media. Hay que registrar la app |
| Instagram | **Decidido:** embeds de publicaciones curadas a mano (la cuenta es Creator y no hay Página de Facebook). La Graph API exige una Página ligada; si se crea, se activa el adaptador automático | Baja ahora, media después |
| Facebook | **Fuera por ahora:** no hay Página de Facebook | n/a |
| TikTok | Embed oficial por URL (oEmbed) con IDs curados a mano. La Display API pide revisión de app | Alta si se quiere automático |

**Decisión:** automático en YouTube y Kick. Instagram y TikTok por
embeds curados (lista de URLs en `lib/social/manual.ts`) hasta que valga la pena
pasar la revisión de app. Alternativa más rápida si no se quiere mantener tokens:
un agregador de pago (Behold, Elfsight), a cambio de dependencia y mensualidad.

## Fases y worktrees (una fase por terminal)

```
main
 ├─ fase-0-base        ← se fusiona primero, todo lo demás parte de aquí
 ├─ fase-1-diseno      ┐
 ├─ fase-3-feeds       ├─ en paralelo tras la fase 0
 ├─ fase-5-kick-vivo   ┘
 ├─ fase-2-layout      ← después de fase 1
 ├─ fase-4-feed-ui     ← después de fases 2 y 3
 └─ fase-6-pulido      ← al final
```

### Fase 0: Base y datos (`fase-0-base`)
- Renombrar "Mariano" a "Joe" en `package.json` y `lib/joe-poker.ts` (ver nota
  abajo sobre el `alt` de la placa).
- Agregar el enlace de Hendon Mob (`pokerdb.thehendonmob.com/player.php?a=r&n=541062`)
  al arreglo `enlaces` y retirar el comentario de "no encontrado".
- Completar `resultados` con los datos de Hendon Mob (los `puesto: null`).
  Pokerdb tiene protección anti-bots: hay que copiar los datos a mano o
  pegármelos.
- Alinear README y comentarios con el código (rutas, `/joe`).
- Estructura nueva: `lib/social/`, `components/sections/`, `components/ui/`.
- Gate: `npm run check` y `npm run build` en verde.

### Fase 1: Sistema de diseño con Claude Design (`fase-1-diseno`)
- **Dependencia: tú.** El proyecto de Claude Design pide sesión. Exporta el
  handoff (HTML/CSS o capturas) y déjalo en `design/reference/`.
- Extraer tokens de la referencia (color, tipografía, radios, sombras, escala de
  espaciado, motion) a `app/globals.css` (`@theme` de Tailwind 4).
- Componentes base en `components/ui/`: Button, Card, Badge, Section, Stat.
- Definir en Claude Design: hero, tarjetas de post por red, contador de
  resultados, estado "EN VIVO".
- Gate: página de prueba `/design` con todos los componentes en móvil y escritorio.

### Fase 2: Layout y secciones (`fase-2-layout`)
- Pasar de una columna de 32 rem a layout de sitio completo: hero a pantalla
  completa, navegación fija con anclas, secciones a todo el ancho.
- Rediseñar Resultados (tabla/timeline), Estadísticas (contadores animados) e
  Historia (secciones tipo narrativa).
- Galería y reels con el nuevo sistema; mantener el orden del masonry.
- Gate: Lighthouse móvil ≥ 90 en rendimiento y accesibilidad.

### Fase 3: Backend de feeds (`fase-3-feeds`)
- `lib/social/types.ts` (contrato `PostSocial`) y un adaptador por red:
  `youtube.ts`, `kick.ts`, `instagram.ts`, `facebook.ts`, `tiktok.ts`.
- `lib/social/index.ts` agrega, ordena por fecha y aplica el fallback manual.
- `app/api/social/route.ts` con `revalidate`; refresco del token de Instagram.
- Pruebas con respuestas mockeadas de cada API.
- Gate: cada adaptador devuelve datos reales o cae limpio al manual.

### Fase 4: UI del feed (`fase-4-feed-ui`)
- Sección "Últimas publicaciones": muro con filtro por red, tarjetas con ícono de
  la red, vista previa y apertura en visor.
- Embeds de TikTok/Instagram cargados bajo demanda (clic o lazy) para no penalizar
  rendimiento ni privacidad.
- Estados de carga, vacío y error; skeletons.
- Gate: se ve bien con 0, 1 y 30 posts.

### Fase 5: Kick y directo (`fase-5-kick-vivo`)
- Estado en vivo real (Kick, y Twitch si se quiere) reemplazando el interruptor
  manual de `enVivo`, con el manual como respaldo.
- Reproductor embebido cuando está en directo y últimos clips cuando no.
- Gate: probar con un canal que esté en vivo y con uno apagado.

### Fase 6: Pulido y lanzamiento (`fase-6-pulido`)
- Animaciones (scroll reveal, hover, transiciones) respetando
  `prefers-reduced-motion`.
- SEO: metadatos, JSON-LD con `sameAs` de todas las redes, `sitemap`, OG por
  sección.
- Analítica (Vercel Analytics o Plausible), accesibilidad, QA en dispositivos.
- Variables de entorno en Vercel, preview, dominio y despliegue.

## Riesgos
- **Tokens de Instagram/Facebook:** caducan; sin refresco automático el feed se
  vacía. El fallback manual lo cubre.
- **Hendon Mob:** el nombre de la ficha puede decir "Mariano". Revisarlo.
- **Peso de la página:** ~11 MB de reels y muchas fotos. Los embeds de terceros
  se cargan solo bajo demanda.
- **Derechos de imagen:** fotos con terceros (por ejemplo Negreanu) y logos de
  marcas (WSOP, Big Bola, GGPoker): conviene confirmar permisos.
