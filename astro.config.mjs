// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://happypaws.mx',
  // 'ignore' + directory: la combinación que recomiendan Netlify, Cloudflare
  // Pages y Vercel. Sirve /paseos y /paseos/ sin forzar redirecciones que el
  // host pueda interpretar de otra forma.
  //
  // Antes estaba 'always' para alinear el canonical con el sitemap, pero rompe
  // el 404 personalizado (Astro sirve su propia página de error, ver
  // withastro/astro#9079) y activa una página de error en el dev server con
  // XSS reflejado (GHSA-w2vj-39qv-7vh7). La alineación canónica se resuelve
  // normalizando la ruta en BaseLayout, no aquí.
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  },
  integrations: [sitemap()]
});
