# Landing de Joe.Pok3r

Sitio público de Mariano Vega (Joe.Pok3r), operado por Analy·sys.

Vivía dentro del HUB privado, en la ruta `/joe`. Se separó porque no compartía
nada con él: cero Supabase, cero sesión, cero middleware. Lo único que
importaba de fuera eran `cn()` y una constante. Compartir despliegue obligaba a
darle a una página pública la misma configuración de acceso que a una
herramienta privada.

**Es un sitio estático.** Las cuatro rutas se prerenderizan; no hay middleware
ni base de datos.

## Arrancar

```bash
npm install
npm run dev
```

`npm run check` corre typecheck y lint.

## Editar el contenido

**Todo está en [`lib/joe-poker.ts`](lib/joe-poker.ts)** — textos, estadísticas,
enlaces, reels y pies de foto. No hace falta tocar JSX.

El bloque `historia` es la bio dictada por Joe, en primera persona. Si se edita,
que sea con sus palabras: el tono es parte del punto.

Los enlaces con `url: null` se pintan deshabilitados con la etiqueta
"Próximamente". En cuanto se pega la URL real, el botón se activa solo.

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
| `components/` | Galería con visor y filtro, carrusel de reels, filas de enlace |
| `public/` | Fotos, clips, pósters y la imagen de Open Graph |

## Variables de entorno

Una sola, documentada en [`.env.example`](.env.example):
`NEXT_PUBLIC_SITE_URL`, la URL absoluta del sitio. La usan las imágenes de Open
Graph —WhatsApp e Instagram no resuelven rutas relativas—, el canonical y el
sitemap. Si falta, cae en localhost y el enlace se comparte sin vista previa.

## Desplegar

Vercel, importando el repo. Carga `NEXT_PUBLIC_SITE_URL` con el dominio real.

Al ser un proyecto aparte del HUB, su protección de despliegues es
independiente: los previews pueden ser públicos para enseñárselos a alguien sin
exponer los del HUB.
