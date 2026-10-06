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
| `app/layout.tsx` | Metadatos, Open Graph y las dos fuentes |
| `app/globals.css` | Base de Tailwind y el tema, acotado a `.joe-theme` |
| `app/page.tsx` | Composición de las secciones y datos estructurados |
| `lib/social/` | Feeds sociales: un adaptador por red, contrato `PostSocial`, agregador y lista manual |
| `app/api/social/route.ts` | `GET /api/social`: el feed agregado, con ISR |
| `components/` | Galería con visor y filtro, carrusel de reels, filas de enlace |
| `public/` | Fotos, clips, pósters y la imagen de Open Graph |

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

## Variables de entorno

Documentadas en [`.env.example`](.env.example) y leídas desde
[`lib/env.ts`](lib/env.ts). Los tokens viven **solo** en las variables de entorno
de Vercel, nunca en el repo. Todas son opcionales: sin ellas el sitio funciona y
los feeds caen al contenido manual.

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL absoluta del sitio: Open Graph (WhatsApp e Instagram no resuelven rutas relativas), canonical y sitemap. Si falta, cae en localhost |
| `YOUTUBE_CHANNEL_ID` | Sobreescribe el canal de YouTube (ya hay uno por defecto, es público) |
| `KICK_CLIENT_ID`, `KICK_CLIENT_SECRET` | App de Kick (OAuth client credentials) |
| `KICK_CHANNEL_SLUG` | Canal de Kick. Pendiente de decidir |
| `INSTAGRAM_AUTO`, `INSTAGRAM_ACCESS_TOKEN` | Camino automático de Instagram. Apagado; solo con una Página de Facebook |

## Desplegar

Vercel, importando el repo. Carga `NEXT_PUBLIC_SITE_URL` con el dominio real y, cuando existan, las variables de los feeds.

Al ser un proyecto aparte del HUB, su protección de despliegues es
independiente: los previews pueden ser públicos para enseñárselos a alguien sin
exponer los del HUB.
