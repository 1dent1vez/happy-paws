# Auditoría pre-producción — Happy Paws

_Fecha: 2026-10-12 (ronda 1) · 2026-10-13 (ronda 2) · 2026-10-17 (rondas 3 y 4) · Build verificada: `npm run build` OK · `astro check`: 0 errores / 0 warnings / 0 hints_

Verificado contra la build de producción (`dist/`) servida con `astro preview`, en desktop (1280px), tablet (768px - 1024px) y viewport móvil 390px.

---

## RONDA 4 (2026-10-17) — Optimización Completa de Imágenes para Tablet

### 1. `srcset` inexistente / monocopia por bug de deduplicación de anchos
En los componentes con `astro:assets`, la propiedad `widths` se pasaba como `widths={[individualWalk.width, 800]}`. Al medir la imagen fuente 800px, Astro deduplicaba a `[800]` y generaba un `srcset` con una sola variante `800w`.
- **Impacto en tablet**: En pantallas Retina (DPR 2x, 1536px físicos en iPad), una imagen estirada a 720px en un contenedor colapsado se servía borrosa y pixelada.
- **Resuelto**: Se suministraron assets optimizados de 1600px y se especificaron anchos escalonados `widths={[400, 600, 768, 1024, 1200]}` (y `[640, 768, 1024, 1200]` en el hero). El build ahora genera 26 variantes WebP cubriendo móvil, tablet 1x, tablet 2x Retina y desktop.

### 2. Atributos `sizes` inexactos en tablet
Los componentes declaraban `sizes="(max-width: 992px) 100vw, 50vw"`. En tablets (768px-992px), el contenedor usa padding `var(--space-6)` (48px totales), y el mockup de `PostWalkReport.astro` tiene `max-width: 380px` (la imagen dentro nunca excede 330px). Declarar `100vw` forzaba a los navegadores de tablet a pedir recursos hasta 3x más pesados de lo necesario.
- **Resuelto**:
  - Cards editoriales y banner CTA: `sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 992px) calc(100vw - 48px), 560px"`
  - Hero de `/paseos/`: `sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 992px) calc(100vw - 48px), 480px"`
  - Mockup WhatsApp: `sizes="(max-width: 480px) min(calc(100vw - 80px), 330px), 330px"`

### 3. Deformación y recorte extremo en slit panorámico en tablet (641px - 992px)
Al colapsar el grid a 1 columna en tablet (`@media (max-width: 992px)`), la altura de `.wide-card-media` estaba clavada en `280px` y `.fcta-image-side` en `240px`. En un iPad de 768px a 992px de ancho, el contenedor mide entre 720px y 944px, generando un aspecto de 2.5:1 a 3.4:1. Esto recortaba más del 75% de las fotografías verticales, cortando personas y perros por la mitad.
- **Resuelto**:
  - En tablet (641px a 992px), `.wide-card-media` se fijó en `height: 380px; aspect-ratio: 16 / 9; max-height: 420px; min-height: 320px;`, devolviéndole proporción fotográfica sin recortes excesivos. En móvil (`<= 640px`) se ajusta a `240px`.
  - `.fcta-image-side` se amplió a `height: 360px; min-height: 320px;` en tablet, y `220px` en móvil.
  - En `/paseos/`, `.page-hero-img` se ajustó a `380px` en tablet y `240px` en móvil.

### 4. Encuadre focal (`object-position`) ausente
Con `object-fit: cover` centrado por defecto (`50% 50%`), el punto de interés de `individual-walk` (perro olfateando a 68.5% de altura) y `care-checkin` (cuidador y perro a 35-40%) quedaban fuera del encuadre.
- **Resuelto**:
  - `.benefit-img-individual`: `object-position: center 65%;`
  - `.benefit-img-group`: `object-position: center 55%;`
  - `.fcta-image-side img` y `.page-hero-img`: `object-position: center 35-40%;`

---

## RONDA 3 (2026-10-17) — Preparación para Vercel y Auditoría End-to-End

### 1. Incompatibilidad de `_headers` con Vercel (bloqueante de seguridad en host)
`public/_headers` solo es interpretado por Netlify y Cloudflare Pages. En un despliegue en Vercel, ese archivo es ignorado por el Edge y la web se habría servido en producción sin CSP, HSTS, X-Frame-Options, Permissions-Policy ni políticas de caché para assets inmutables (`/_astro/*`).
- **Resuelto**: Se creó `vercel.json` con el schema oficial de Vercel, replicando todas las directivas de seguridad (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) y reglas de caché (`/_astro/*` inmutable 1 año, `/images/*` y `/fonts/*` con revalidación diaria, CORS en fuentes).
- Se configuró además `cleanUrls: true` y `trailingSlash: true` para alinear el enrutamiento con los canonicals y el sitemap.

### 2. `.vercel/` expuesto en Git
Al ejecutar comandos de Vercel CLI o vincular el proyecto, Vercel genera la carpeta `.vercel/`.
- **Resuelto**: Se añadió `.vercel/` a `.gitignore`.

### 3. Enlace interno inconsistente en Footer (`/paseos` sin slash)
`Footer.astro` contenía `href="/paseos"`, mientras que el resto del sitio, el canonical tag y el sitemap usan `/paseos/`. Al hacer clic requería una redirección en el host y podía generar discrepancias canónicas.
- **Resuelto**: Actualizado a `href="/paseos/"`.

### 4. `currentPath` sin slash en `paseos.astro`
`src/pages/paseos.astro` enviaba `currentPath="/paseos"`, divergente de las demás páginas.
- **Resuelto**: Unificado a `currentPath="/paseos/"`.

### 5. Página 404 sin etiqueta robots `noindex`
`404.astro` carecía de directiva de exclusión de rastreo. Si un bot o enlace externo apuntaba a `/404.html`, la página de error corría el riesgo de ser indexada en Google.
- **Resuelto**: Se añadió la prop `noindex?: boolean` a `BaseLayout.astro` que inyecta `<meta name="robots" content="noindex, nofollow" />`, activada en `404.astro`. Verificado en el HTML compilado de `dist/404.html`.

### 6. Iconos PWA estándar ausentes en `manifest.webmanifest`
El estándar PWA (Google / Lighthouse) requiere iconos de `192x192` y `512x512`. El manifiesto solo listaba 32, 180 y 820.
- **Resuelto**: Se generaron `public/icon-192.png` y `public/icon-512.png` con Pillow a partir de `logo-mark-square.png` y se agregaron a `public/manifest.webmanifest`.

### 7. Feedback visual de hora seleccionada en `HeroOmniBar`
Al seleccionar un día y luego una hora en el calendario de la omnibar, el texto del botón principal no actualizaba la hora (permanecía solo con la fecha), restando claridad antes de pulsar el CTA de WhatsApp.
- **Resuelto**: El botón ahora muestra tanto el día como la hora seleccionada (ej. `14 Oct · 10:00`).

---

## RONDA 2 (2026-10-13) — bugs que la ronda 1 no detectó

La ronda 1 corrigió la conversión sin JS, la guardia del build, imágenes, 404, canonical y la mayoría del contraste. Estos defectos se introdujeron o sobrevivieron a esa ronda.

### 1. Cada conversión se contaba dos veces (bloqueante de métrica)
El CTA del hero emitía **dos** eventos `whatsapp_click` por clic: el listener delegado de `BaseLayout` (`tracking.ts`) más el `dataLayer.push` manual del handler inline de `HeroOmniBar`. Con el KPI único del sitio siendo "clics a WhatsApp", todas las métricas estaban infladas al 100% y no había forma de saber qué sección convertía.
- **Resuelto**: eliminado el push manual. La configuración elegida se publica en `data-hp-detail` vía `syncCta()` (llamado al elegir servicio/fecha/hora/mascotas) y el listener delegado la lee. Verificado: 1 evento por clic con detalle completo.

### 2. El calendario nombraba mal todos los meses desde septiembre (bloqueante funcional)
El array `MONTHS` de `HeroOmniBar` tenía 11 elementos: faltaba `'Septiembre'`. Octubre se mostraba como "Noviembre", y el desplazamiento se propagaba al `aria-label` de cada día, al resumen de la fecha y al mensaje de WhatsApp pre-rellenado (un lead podía agendar "14 de Noviembre" cuando elegía octubre).
- **Resuelto**: array completo de 12 meses. Verificado navegando por meses: Octubre 2026 → Febrero 2027 correctos, y los `aria-label` ("2 de Febrero de 2027") cuadran.

### 3. Ofrecía llegada a las 19:00 en un servicio que cierra a esa hora
El selector iba de 7:00 a 19:00 inclusive, pero los paseos duran 45-60 minutos: una "llegada" a las 19:00 implicaba pasear fuera de la franja declarada, contradiciendo `siteConfig.schedule` y el JSON-LD.
- **Resuelto**: `LAST_ARRIVAL = 18`. Ahora se ofrecen 12 franjas (07:00-18:00) con la etiqueta "llegadas de 07:00 a 18:00". Verificado en el DOM.

### 4. El aviso de fin de jornada sugería un domingo cerrado
Cuando ya no quedaban horas hoy, el mensaje decía "puedes elegir mañana" sin comprobar el día de la semana: si mañana era domingo, mandaba al usuario a un día en que nadie va a pasear al perro.
- **Resuelto**: el bucle avanza hasta el siguiente día no-domingo.

### 5. Los encabezados de seguridad solo cubrían la portada (bloqueante de host)
`public/_headers` declaraba los encabezados bajo la ruta `/`. En Netlify y Cloudflare Pages, `/` a secas **solo aplica a la portada**: `/paseos/`, las legales y el 404 se habrían servido sin CSP, HSTS, `X-Content-Type-Options` ni `Permissions-Policy`.
- **Resuelto**: ruta `/*`. Verificado en el archivo servido.

### 6. Caché inmutable en assets sin hash (bloqueante de despliegue)
`/images/*` y `/fonts/*` se servían con `max-age=31536000, immutable`. Esos archivos se copian tal cual desde `public/`: **no llevan hash en el nombre**. Con `immutable`, un cambio de vídeo del hero, del `og:image` o de la fuente habría tardado hasta un año en llegar a quienes ya los tenían en caché.
- **Resuelto**: `max-age=86400, must-revalidate` para esos prefijos; `immutable` se reserva para `/_astro/*`, que sí lleva hash. También se eliminó un header huérfano de `/favicon.svg` (archivo inexistente).

### 7. Contraste: el CTA de conversión seguía fallando AA
Medición en el navegador (23 elementos):

| Elemento | Antes | Ahora |
|---|---|---|
| `.omni-cta` / `.btn-whatsapp` (blanco sobre `#128C7E`) | **4.14:1** FALLA | 5.01:1 (`#0F7D70`) OK |
| `.btn-primary` (blanco sobre `#EE5D1A`) | **3.38:1** FALLA | 5.18:1 (`#C2410C`) OK |
| `.badge-orange` | 3.08:1 FALLA | 6.13:1 OK |
| `--color-text-subtle` sobre blanco | 4.05:1 FALLA | 5.64:1 OK |
| `.footer-bottom` `#8C8276` sobre `#211D1A` | 4.44:1 FALLA | 5.92:1 OK |
| `.bubble-time`, `.tag-individual`, `.timeline-step-badge`, `.modality-subtitle`, hovers de nav/FAQ/benefit-kicker | 3.0-4.2:1 FALLA | 4.85-5.18:1 OK |

- **Resuelto** con dos tokens nuevos: `--color-whatsapp-strong: #0F7D70` y `--color-primary-action: #C2410C` (+ `--color-primary-text`), aplicados en las 5 páginas. El naranja de marca `#EE5D1A` se conserva solo donde el umbral AA-large (3:1) lo cubre (h1, iconos grandes, `.text-highlight` dentro de un `h1`).
- Falso positivo descartado: `.hero-trust-row` medido sobre el fondo del body daba 1.49:1, pero el texto va sobre el vídeo con degradado oscuro. Medido sobre los píxeles reales de una captura: **9.06:1**.

### 8. Vídeo y póster del hero sin optimizar (4.7 MB en la ruta crítica)
`hero-walk.mp4` pesaba 4.2 MB (1920×1080, 2.4 Mbps) y el póster 476 KB. El `<video>` tiene `autoplay` y es la primera carga del sitio.
- **Resuelto**: re-codificado a 1280×720 con bitrate objetivo (1.6 MB, −62%) y póster re-escalado a 1600×900 q78 (370 KB). `dist` total: 6.3 → 3.6 MB. Calidad verificada visualmente bajo el degradado del hero (no se ven bandas ni bloques).

### 9. Sin `theme-color` ni manifest
- **Resuelto**: `<meta name="theme-color" content="#FAF7F2">` y `public/manifest.webmanifest` con iconos `any` y uno `maskable`. Presentes en las 5 páginas, manifest servido con 200 y `Content-Type: application/manifest+json`.

### 10. Mockup con dato de cliente ficticio
`PostWalkReport.astro` mostraba "Rocky (Golden mix)" en el reporte de ejemplo de una web que promete fotografía ética y autorizada.
- **Resuelto**: "Tu perro", en el nombre y en las observaciones.

### 11. `90vh` en el breakpoint móvil del hero
El fix de `100vh → 100dvh` de la ronda 1 no llegó al `@media (max-width: 640px)`, que seguía en `90vh`.
- **Resuelto**: `90dvh`.

---

## RONDA 1 (2026-10-12) — resuelta y verificada entonces

Mantenido como referencia. Lo confirmado en la ronda 2 sigue en pie:

- **#1 CTA sin JS** — `<a href>` real al `wa.me` servido; el JS solo reescribe el href. Verificado en el HTML servido: el href apunta al número real.
- **#2 Domingos agendables** — deshabilitados con clase `.closed` tachada y `aria-label` explicativo.
- **#3 Build sin variable de WhatsApp** — guardia que aborta con el nombre de la variable. **Verificado de nuevo en la ronda 2 quitando `.env`: el build falla con exit 1.**
- **#4 Enlaces legales muertos** — `/aviso-de-privacidad/` y `/terminos-del-servicio/` existen, con derechos ARCO, plazos LFPDPPP e INAI.
- **#6 Imágenes sin optimizar** — migradas a `astro:assets` (WebP + `width`/`height` + `srcset`).
- **#7 Sin 404 ni robots** — ambos presentes y servidos con 200.
- **#8 Anclas bajo el header sticky** — `scroll-margin-top: calc(var(--header-height) + 16px)` en `section[id]`.
- **#9 canonical/sitemap** — canonical normalizado con slash en las 4 URLs, coincidiendo con el sitemap generado.
- **#10 Instrumentación** — `dataLayer` inicializado al cargar + listener delegado.
- **#11 Encabezados** — `_headers` (corregido en la ronda 2, ver #5 y #6 de arriba).
- **#12 og:image** — `og-cover.jpg` 1200×630 (1.91:1) en las 5 páginas.
- **#13 Accesibilidad omnibar/drawer** — `inert` sincronizado, foco al abrir, devuelto al cerrar con Escape, navegación por flechas en el listbox.
- **#14 SEO local** — `postalAddress`, `geo`, `areaServed` en el JSON-LD; schema `FAQPage` en las 2 páginas con FAQs.
- **#15 Franja horaria** — captura de hora (ver #3 de la ronda 2 para el límite de llegada).
- **#16 Código muerto** — `ServiceCard.astro`, `TrustSection.astro`, `.demo-banner`, `currentPath` sin uso: eliminados.
- **#17-19, 21-23** — `100dvh`, self-hosting de fuentes, `overflow-x: hidden`, mockup ficticio y `engines.node`: resueltos (#10 y #11 de la ronda 2 completan los que quedaban).

---

## Estado actual

- `npm run build`: 5 páginas, 3.6 MB de `dist/`.
- `astro check`: 0 errores, 0 warnings, 0 hints en 18 archivos.
- HTTP 200 verificado en las 5 páginas + robots, sitemap, manifest, vídeo, fuentes y favicons.
- Cero desborde horizontal a 390px; drawer con `inert`/`aria-hidden` sincronizados.
- JSON-LD `LocalBusiness` (con dirección y geo) en las 5 páginas; `FAQPage` donde corresponde.

## Pendiente / no verificado

- **`_headers`**: validado como archivo servido, no como cabeceras HTTP reales — se aplican en el host (Netlify/Cloudflare), no en `astro preview`. Falta confirmarlas tras el primer deploy.
- **Sin tests automatizados**: no hay red que atrape una regresión de layout. No es bloqueante en una landing estática.
- **`engines.node >= 22.12`**: confirmar que el host use Node 22+ (varios hosts estáticos siguen en 20).
- **Analítica real**: los eventos salen al `dataLayer` en formato GA4/GTM, pero no hay snippet de GA4/GTM cargado. Hasta que se cargue uno, los clics se registran en el array sin enviarse a ninguna herramienta.
