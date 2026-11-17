# Registro del circuito · Joe Vega

Bitácora de la gira, dividida por parada y, dentro de cada una, por torneo.
Va del más reciente al más viejo.

**Fuente de verdad de los datos:** `resultados` en `lib/joe-poker.ts` (cobros, puestos,
premios) y `lib/medios.ts` (reels y fotos). La sección **Circuito** del sitio
(`components/sections/circuito.tsx`, paradas en `lib/circuito.ts`) los agrupa sola. Este
archivo es la copia legible; si un dato cambia en `joe-poker.ts`, se corrige aquí.

**Reglas del registro**
- Sólo entra lo comprobado. Lo que sólo se infiere del nombre de un reel va en *Por confirmar*.
- `—` = falta el dato. No significa cero ni "no cobró".
- Los premios van en la moneda del torneo; no se convierten.

## Resumen

| # | Parada | Fechas | Torneos jugados | Cobros | Medios (reels / fotos) |
| --- | --- | --- | --- | --- | --- |
| 1 | WSOP Circuit Panamá | 5–15 nov 2026 | 2 | 2 (5.º, 32.º) | 16 / 0 |
| 2 | Texas Card House · Houston | 24 oct 2026 | 1 | — | 11 / 4 |
| 3 | WSOP Circuit Austin | 14–17 sep 2026 | 2 | 2 (92.º, 43.º) | 10 / 0 |
| 4 | CDMX · WSOP Circuit México + Jubilee | 31 ago–7 sep 2026 | 4 | 3 cobros confirmados + 1 sin puesto | 16 / 6 |
| 5 | WSOP Online | 10 ago 2026 | 1 | 1 (486.º) | — |
| 6 | Las Vegas (histórico) | 2017 y 2023 | 5 | 4 (2017) | — |

Conteos de medios: reels y fotos de `lib/medios.ts` (`reelsR2`, `galeriaR2`). Los reels y fotos
locales de `public/` no se cuentan aquí.

---

## 1 · WSOP Circuit Panamá · 5–15 nov 2026

Sede: Ciudad de Panamá. Arranque de Joe: Mini Main · Flight A, 5 nov, 11:00 (hora de Panamá).
Main Event $500K GTD.

Fuente: app de la WSOP (perfil de Joe Vega, captura del 16 nov 2026). Premios en USD.

| Fecha | Torneo | Buy-in | Puesto | Premio |
| --- | --- | --- | --- | --- |
| 9 nov | #4 Mystery Bounty | $600 USD | 5.º de 376 | $4,220 USD |
| 7 nov | #3 No-Limit Hold'em Main Event | $1,700 USD | 32.º de 596 | $7,690 USD |

- **Qué pasó:** cobró los dos. El Mystery Bounty lo cerró 5.º.
- `panamaEstado` pasó a `'eliminado'` (16 nov). Si Joe jugó algo después del 9 nov, falta
  registrarlo.
- **Por confirmar:** los títulos de los reels (`puesto12-b-reel`, `mesafinal-*`,
  `cierremainevent-reel`, `mystery-final-day-reel`) no coinciden claramente con los puestos
  de arriba (5.º y 32.º). Falta definir cuál es de Joe y cuál es cobertura.

**Imágenes:** 160 en WebP en R2 (`web/panama/img/<grupo>/`), indexadas en
`lib/panama-imagenes.ts`: 19 publicaciones, 9 felicitaciones, 10 gráficas de reels e
historias, y 122 cuadros de secuencias (patrocinadores 85, logos 32, fotogramas 5). Se
regeneran con `node scripts/imagenes.mjs panama` y se suben con `npm run medios`.

**Medios:** 16 reels en `panama/` (llegada, bitácora, stack día 1 y 2, ITM, burbuja, casino,
all-in con 77, par de 6, mesa final, cierre).

---

## 2 · Texas Card House · Houston · 24 oct 2026

| Torneo | Buy-in | Puesto | Field | Premio |
| --- | --- | --- | --- | --- |
| $400 NL Hold'em · Single Day $100K | $400 USD | — | 265 | — |

- **Qué pasó:** jugó el torneo de $100,000 GTD, 265 entradas. Las capturas son de mitad de
  torneo (nivel 17, quedaban 38 de 265, y la tabla de premios), no del cierre. El puesto
  quedó en `null` a propósito.
- **Por llenar:** puesto final y premio, si cobró.
- **Extra:** sesión de cash y "noche de cash" en Black & Gold (reels de cash, cierre en 1,596).
- **Medios:** 11 reels y 4 fotos en `houston/`.

---

## 3 · WSOP Circuit Austin · 14–17 sep 2026

Sede: Austin, Texas.

| Fecha | Torneo | Buy-in | Puesto | Premio |
| --- | --- | --- | --- | --- |
| 17 sep | Main Event · Ring Event #13 | $1,700 USD | 92.º de 2,090 | $4,780 USD |
| 14 sep | Monster Stack · Ring Event #9 | $400 USD | 43.º de 1,702 | $1,950 USD |

- **Qué pasó:** cobró los dos. El Main Event cerró en 92.º.
- **Por confirmar:** el reel `editado-71-lugar` menciona el 71.º lugar y el cierre fue 92.º;
  es probable que sea un punto intermedio del torneo, pero conviene aclararlo antes de usarlo.
- **Medios:** 10 reels en `austin/` (llegada, Main Event, día 2, all-in, breaks).

---

## 4 · CDMX · 31 ago–7 sep 2026

Dos sedes: Jubilee Poker Room y Big Bola Casinos (WSOP Circuit México).

| Fecha | Torneo | Sede | Buy-in | Puesto | Field | Premio |
| --- | --- | --- | --- | --- | --- | --- |
| 7 sep | Pot Limit Omaha Championship · Ring Event #9 | Big Bola | $12,800 MXN | 10.º | 166 | $30,900 MXN |
| 2 sep | #2 Mini Main Event | Big Bola | $8,000 MXN | 138.º | 1,190 | $16,000 MXN |
| 1 sep | #1 The Opener Mystery Bounty | Big Bola | — | — | — | — |
| 31 ago | High Roller 2.5M GTD | Jubilee | — | 6.º | 112 | $160,000 MXN |

- **High Roller:** llegó a la mesa final con 615,000 en fichas y cerró 6.º.
- **Mini Main Event:** cerró el Day 1A 5.º del field con 296,000 en fichas; terminó 138.º y cobró.
  Capturas del 3 y 4 sep: 2.º con 120K, 8.º con 174K, y el día final en el puesto 123 con 146K (14 BB).
- **Opener Mystery Bounty:** jugó el Day 1C. Puesto sin registrar.
- **PLO Championship:** 10.º de 166. La app de la WSOP lo muestra como $1,814 USD; aquí se
  conserva el premio en pesos. Lo mismo con el Mini Main ($939 USD).
- **Field del Mini Main:** 1,190 es el total de entradas (app de la WSOP). El 184 que se usaba
  era sólo el Day 1A.
- **Por confirmar:** a cuál torneo corresponde cada reel de CDMX (`burbuja`, `eliminacion`, `fuera`,
  `top-10`, `entramos-al-top-25`, `vamos-por-la-mesa-final`, `31`, `71-lugares`, `nivel-9`).
  Sólo dos nombres lo dicen: `inicio-torneo-highroller` (High Roller) y `pot-limit-omaha` (PLO).
- **Medios:** 16 reels y 6 fotos en `cdmx/`.

---

## 5 · WSOP Online · 10 ago 2026

| Torneo | Buy-in | Puesto | Premio |
| --- | --- | --- | --- |
| #2 $300 Gladiators of Poker $3M GTD | $300 USD | 486.º de 17,077 | $1,136.32 USD |

---

## 6 · Las Vegas · histórico

| Fecha | Torneo | Sede | Buy-in | Puesto | Premio |
| --- | --- | --- | --- | --- | --- |
| 3 jul 2023 | WSOP Main Event · Evento #76 | Horseshoe & Paris | $10,000 USD | — | — |
| 22 jul 2017 | Nightly Event | Aria | $125 USD | 9.º | $231 USD |
| 18 jun 2017 | 7PM Turbo · Rio Daily Deepstacks | Rio | $365 USD | 3.º | $5,972 USD |
| 5 may 2017 | Daily Event | Aria | $240 USD | 4.º | $1,435 USD |
| 4 may 2017 | Daily Event | Aria | $125 USD | 7.º | $359 USD |

- Cobros de 2017 tomados de The Hendon Mob (jugador n=541062).
- **Por llenar:** puesto del Main Event 2023.

---

## Pendientes, en orden de importancia

1. **Panamá:** confirmar si hubo más torneos que los dos de la app y pasar `panamaEstado`
   a su estado real.
2. **Houston:** puesto final y premio del Single Day $100K.
3. **CDMX:** puesto del Opener Mystery Bounty (Day 1C).
4. **Reels de CDMX y Panamá:** asignar cada uno a su torneo.
5. **Las Vegas 2023:** puesto del Main Event.
6. **Austin:** aclarar el reel del "71.º lugar".

## Cómo mantenerlo

Al cerrar un torneo, en este orden: (1) agregar la fila a `resultados` en `lib/joe-poker.ts`,
(2) agregarla a la tabla de su parada aquí, (3) pasar lo "por confirmar" a hecho o quitarlo.
Los medios nuevos se suben con `npm run medios` y se suman al conteo del resumen.
