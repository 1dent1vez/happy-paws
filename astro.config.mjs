// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://happypaws.mx',
  // 'always' keeps the canonical URL, the sitemap entry and the served path in
  // agreement (/paseos/). Left unset, Astro emits canonical without the slash
  // while @astrojs/sitemap lists it with one — two canonical URLs for one page.
  trailingSlash: 'always',
  integrations: [sitemap()],
});
