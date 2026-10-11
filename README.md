# Happy Paws — Website V1

Sitio web oficial de **Happy Paws**, marca local de paseos caninos prémium en comunidades residenciales. Diseñado para generar confianza en papás perrunos y convertir visitas en conversaciones directas a través de WhatsApp.

---

## 🌟 Características

- **Rutas públicas:**
  - `/`: Landing principal de Happy Paws (propuesta de valor, modalidades, beneficios, proceso en 4 pasos, pilares de confianza y reporte post-paseo ilustrado).
  - `/paseos`: Landing especializada (comparativa individual vs. grupal, protocolo paso a paso, información y requisitos previos, seguridad climática y preguntas frecuentes).
- **Canal de conversión:** Enlaces a WhatsApp centralizados en `src/config/site.ts` con número internacional y mensajes prellenados contextuales.
- **Identidad visual:** Naranja cálido (`#EE5D1A`), fondos crema (`#FAF7F2`), texto carbón (`#1C1917`), fotografías reales y tipografía moderna (`Plus Jakarta Sans`).
- **SEO & Rendimiento:** Generación estática con Astro 7, metadatos Open Graph, Twitter Cards, Schema.org `LocalBusiness` y `@astrojs/sitemap`.

---

## 🚀 Comandos de Desarrollo y Operación

Todos los comandos se ejecutan desde la raíz del proyecto:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en modo background (regla de entorno)
npx astro dev --background

# Consultar estado del servidor en background
npx astro dev status

# Ver logs del servidor
npx astro dev logs

# Detener el servidor
npx astro dev stop

# Validar tipos TypeScript y componentes Astro
npx astro check

# Compilar para producción (carpeta dist/)
npm run build

# Previsualizar el bundle de producción
npm run preview
```

---

## ⚙️ Configuración de WhatsApp y Variables de Entorno

El archivo `.env.example` incluye las variables necesarias:

```env
PUBLIC_WHATSAPP_PHONE=525500000000
PUBLIC_WHATSAPP_PHONE_DISPLAY=+52 55 0000 0000
```

1. Para configurar tu número real de producción, copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Asigna tu número internacional (solo dígitos) en `PUBLIC_WHATSAPP_PHONE`.
3. Al compilar o reiniciar, el banner de modo demostración se ocultará automáticamente y todos los botones redirigirán a tu línea oficial.

---

## 📁 Estructura del Código

- `src/config/site.ts`: Parámetros de marca, zonas de cobertura, horarios y mensajes de WhatsApp.
- `src/styles/global.css`: Tokens de diseño CSS, reset y componentes utilitarios.
- `src/components/`: Componentes reutilizables (Header, Footer, WhatsAppButton, ServiceCard, TrustSection, PostWalkReport, FAQAccordion).
- `src/layouts/BaseLayout.astro`: Layout base accesible con SEO y meta tags.
- `src/pages/index.astro`: Landing principal.
- `src/pages/paseos.astro`: Landing de servicio y comparativa de paseos.
- `public/images/`: Fotografías locales de paseos y cuidados caninos.
