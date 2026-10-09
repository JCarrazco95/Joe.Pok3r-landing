# Despliegue a Vercel

Lo ejecuta Joe / Analy·sys. Nada de esto lo hace el código ni un agente.

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Entornos | Obligatoria | Valor |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production (y Preview si se quiere) | **Sí, en producción** | El dominio definitivo con `https://` y sin barra final |
| `KICK_CLIENT_ID` | Production, Preview | Para el estado «En vivo» real | De la app de Kick |
| `KICK_CLIENT_SECRET` | Production, Preview | Ídem (marcar **Sensitive**) | De la app de Kick |
| `KICK_CHANNEL_SLUG` | — | No | Solo si el canal deja de ser `joe-pok3r` |
| `YOUTUBE_CHANNEL_ID` | — | No | Solo para sobreescribir el canal por defecto |
| `INSTAGRAM_AUTO`, `INSTAGRAM_ACCESS_TOKEN` | — | No | Apagado; no cargar |
| `EN_VIVO_SIMULADO` | — | **No cargar nunca** | Solo desarrollo local |

Sin las de Kick el sitio funciona: el aviso cae al interruptor manual y no hay reproductor.

## 1. Antes

- [ ] La rama `fase-6-pulido` está fusionada en `main` y `npm run check`, `npm test` y `npm run build` pasan.
- [ ] Decidido lo de derechos de imagen (Negreanu, logos de WSOP, Big Bola, GGPoker): ver el PR.
- [ ] Decidido si se recomprimen los reels (~38 MB).
- [ ] Revisado el nombre en Hendon Mob (puede decir «Mariano»).

## 2. Preview

- [ ] Importar el repo en Vercel (o abrir el preview de la rama).
- [ ] Cargar las variables de arriba.
- [ ] Activar **Analytics** (proyecto → Analytics → Enable).
- [ ] Abrir el preview en el móvil y en escritorio: hero, reels, galería, muro, «En directo», contacto.
- [ ] Pasar Lighthouse móvil en el preview: ≥ 90 en las cuatro categorías.

## 3. Dominio

- [ ] Settings → Domains: añadir el dominio y poner los DNS que indique Vercel.
- [ ] Fijar `NEXT_PUBLIC_SITE_URL` al dominio definitivo y **redesplegar** (la variable se lee en el build).
- [ ] Decidir la redirección `www` ↔ apex.

## 4. Verificación posterior

- [ ] `https://DOMINIO/robots.txt` y `/sitemap.xml` muestran el dominio real (no localhost ni `*.vercel.app`).
- [ ] Ver código fuente: `<link rel="canonical">` y `og:image` con el dominio real.
- [ ] Probar la tarjeta en [opengraph.xyz](https://www.opengraph.xyz) y compartiendo el enlace en WhatsApp/Instagram.
- [ ] Rich Results Test / validator.schema.org con la URL: `Person` sin errores y `sameAs` con 6 perfiles.
- [ ] `/api/en-vivo` y `/api/social` responden 200.
- [ ] Analytics: aparecen visitas; hacer clic en una red y abrir un post y comprobar los eventos `clic_red` / `abrir_post` (requiere un plan que los incluya).
- [ ] Search Console: verificar el dominio y enviar `sitemap.xml`.
- [ ] `/design` sigue con `noindex`.
