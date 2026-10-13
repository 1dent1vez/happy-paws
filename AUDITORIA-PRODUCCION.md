# Auditoría pre-producción — Happy Paws

_Fecha: 2026-10-12 · Build verificada: `npm run build` OK · `astro check`: 0 errores / 0 warnings_

Verificado contra la build de producción (`dist/`) servida con `astro preview`, en desktop y viewport móvil 390px.

---

## BLOQUEANTES — no mandar a producción sin resolver

### 1. El CTA principal del hero no funciona sin JavaScript
`HeroOmniBar.astro:135` — el botón "Consultar" es un `<button>` que llama a `window.open()` (línea 372). Sin JS el hero queda **sin ninguna vía de contacto**, y con bloqueador de popups el clic se pierde en silencio.
- Fix: convertir a `<a href="wa.me/..." target="_blank" rel="noopener">` con el href base, y que el JS solo lo reescriba con los parámetros elegidos.

### 2. El calendario permite agendar domingos (el servicio no opera domingos)
`HeroOmniBar.astro:295-331` — solo se deshabilitan días pasados. Verificado: noviembre 2026 ofrece los 30 días habilitados, incluyendo domingos 1, 8, 15, 22 y 29. Contradice `siteConfig.schedule.days` ("Lunes a Sábado") y el JSON-LD de `BaseLayout.astro:39`.
- Fix: deshabilitar `dayDate.getDay() === 0`.

### 3. El build cae en silencio a un número de WhatsApp falso
`src/config/site.ts:46-47` — si `PUBLIC_WHATSAPP_PHONE` no está en el entorno del build, `rawPhone` = `525500000000` y `isConfigured` = `false`, **sin error**. La web compila, se ve perfecta y todos los `wa.me` apuntan a un número inexistente.
- Crítico porque `.env` está en `.gitignore` (correcto) → cualquier CI/host que no declare la variable rompe la conversión sin avisar.
- Fix: lanzar error en el build si la variable falta, o usar una variable obligatoria en el host.

### 4. Enlaces legales muertos + obligación LFPDPPP
`Footer.astro:91,93` — `#aviso-privacidad` y `#terminos-servicio` no existen en ninguna página. Son anchors vacíos.
- Un negocio mexicano que recaba datos de clientes requiere Aviso de Privacidad conforme la LFPDPPP. Riesgo legal, no solo UX.

### 5. Contraste WCAG fallando en el propio CTA de conversión
| Elemento | Ratio | Estado |
|---|---|---|
| `.btn-whatsapp` blanco sobre `#25D366` | **1.98:1** | FALLA total |
| `.btn-primary` blanco sobre `#EE5D1A` | 3.38:1 | FALLA AA |
| `.badge-orange` `#EE5D1A` sobre `#FFF2EB` | 3.08:1 | FALLA AA |
| `--color-text-subtle` `#857D75` sobre blanco | 4.05:1 | FALLA AA |
| `.footer-bottom` `#8C8276` sobre `#211D1A` | 4.44:1 | FALLA AA (marginal) |

El verde WhatsApp con texto blanco es el botón más repetido del sitio.

### 6. Imágenes sin optimizar (~620 KB en JPG)
- `hero-walk.jpg` = **287 KB** servido tal cual, `loading="eager"`, `fetchpriority="high"` → es el LCP.
- Las 5 imágenes no tienen `width`/`height` → Cumulative Layout Shift.
- Sin WebP/AVIF, sin `srcset`, sin `astro:assets`. Una imagen de `public/` no lleva hash, así que tampoco es cacheable de forma inmutable.
- Fix: migrar a `astro:assets` / `<Image>` y exportar a WebP con fallback.

### 7. Sin 404 ni robots.txt
`dist/` no contiene `404.html` ni `robots.txt`. El host servirá su 404 genérico (roto visualmente, sin salida a WhatsApp).

---

## IMPORTANTES — salir a producción con estos lastima conversión o SEO

### 8. Anclas bajo el header sticky
`Header.astro:97` es `position: sticky` con altura real de 77px. Ninguna sección tiene `scroll-margin-top` (verificado: todas en `0px`). Al pulsar "Beneficios" la sección aterriza a `top: 0`, tapada por el header.
- Fix: `scroll-margin-top: calc(var(--header-height) + 16px)` en `section[id]`, o `scroll-padding-top` en `html`.

### 9. canonical y sitemap disociados
- `BaseLayout.astro:22` genera canonical `https://happypaws.mx/paseos` (**sin** slash).
- El sitemap generado lista `https://happypaws.mx/paseos/` (**con** slash).
- No hay `trailingSlash` en `astro.config.mjs`. Dos URLs canónicas distintas para la misma página diluyen señales SEO.
- Fix: fijar `trailingSlash: 'always'` (o `'never'`) explícitamente.

### 10. Cero instrumentación de conversión
No hay analytics, ni eventos, ni UTMs. El único KPI del sitio es "clics a WhatsApp" y hoy es imposible medirlo. No se puede saber de dónde viene el tráfico ni qué sección convierte.

### 11. Sin encabezados de seguridad ni política de caché
No existe `public/_headers`, `netlify.toml` ni `vercel.json`.
- Sin CSP → sin mitigación de inyección.
- `_astro/*` lleva hash de contenido pero se sirve sin `Cache-Control: immutable` → cada visita revalida assets que nunca cambian.
- Sin HSTS ni `X-Content-Type-Options`.

### 12. `og:image` en proporción incorrecta
`BaseLayout.astro:19` apunta a `hero-walk.jpg`, que mide **1200x1798 (2:3 portrait)**. WhatsApp y Facebook esperan 1.91:1 (1200x630) → la tarjeta se recorta justo en el canal por donde se comparte este sitio.

### 13. Accesibilidad del omnibar y del drawer móvil
- **Drawer**: `aria-hidden="true"` con `max-height: 0`, pero los 3 enlaces siguen siendo focusables por teclado (verificado). Violación ARIA: un lector de pantalla navega a contenido "oculto".
- **Popovers**: `role="listbox"`/`role="dialog"` sin navegación por flechas, sin mover el foco al abrir, sin atraparlo. `role="search"` en un contenedor que no es formulario de búsqueda.
- **Sin `prefers-reduced-motion`** en ningún lado, con `scroll-behavior: smooth` global y decenas de transiciones.

### 14. SEO local subexplotado
- El JSON-LD `LocalBusiness` no tiene `postalAddress` ni `geo` → pierde fuerza en búsquedas "paseos para perros Metepec".
- Hay 7 FAQs renderizadas y **no hay schema `FAQPage`** (quick win perdido para rich results).

### 15. Sin validación de franja horaria
El hero captura fecha pero no hora, y acepta el mismo día. El servicio es 7:00-19:00 con cita previa. Un lead puede "agendar" las 23:00.

### 16. Código muerto en el repo
- `ServiceCard.astro` (261 líneas) y `TrustSection.astro` (153) — **0 usos**.
- `.demo-banner` en `global.css:452` — nunca renderizado.
- `Header.astro:4` declara `currentPath` y no lo usa → nunca hay estado activo en la nav.
- `siteConfig.whatsapp.messages.header` — nunca referenciado.

---

## MENORES — higiene

17. **`100vh` en lugar de `100dvh`** (`index.astro:298`) → el hero se desborda con la barra dinámica del navegador móvil.
18. **Sin `theme-color`, `manifest`, `apple-touch-icon`** → mala integración al añadir a inicio en iOS/Android.
19. **Google Fonts desde CDN** — dependencia de terceros en la ruta crítica de render, más implicaciones GDPR. Self-hostear sirve los 2 pesos.
20. **`body { overflow-x: hidden }`** (`global.css:109`) enmascara desbordes reales en vez de corregirlos y puede afectar `sticky`.
21. **Mockup del reporte con "Rocky (Golden mix)"** (`PostWalkReport.astro:108`) — dato de cliente ficticio en una web que promete "fotografía ética y autorizada".
22. **Sin tests automatizados.** No es bloqueante en una landing estática, pero no hay red que atrape una regresión de layout.
23. **`astro ^7.3.8` exige Node ≥ 22.12** (`package.json:6`). Confirmar que el host use Node 22+; varios hosts estáticos siguen en 20 por defecto.

---

## Verificado y correcto

- `npm run build` compila limpio (2 páginas, 808 KB de `dist/`).
- `astro check`: 0 errores, 0 warnings, 0 hints en 14 archivos.
- Todos los enlaces `wa.me` llevan `target="_blank"` + `rel="noopener noreferrer"` y mensajes contextuales prellenados.
- `.env` correctamente gitignado y **nunca commiteado** (0 commits lo tocan).
- `dist/` gitignored, no trackeado.
- Sitemap generado con `site` correcto.
- Skip-link, `lang="es-MX"`, `aria-label` en CTAs, alts descriptivos en todas las imágenes.
- El omnibar funciona end-to-end: selección de servicio, fecha (bloquea pasados, deshabilita "mes anterior" en el mes actual) y contador de mascotas (1-5) alimentan correctamente el mensaje de WhatsApp.

---

## Orden de ataque sugerido

1. Bugs funcionales: #1, #2, #3, #4, #8, #9, #15
2. Rendimiento y LCP: #6, #19, #11
3. Cumplimiento: #5 (contraste), #10 (analytics), #14 (schema), #7 (404/robots)
4. Limpieza: #16, #17-#23
