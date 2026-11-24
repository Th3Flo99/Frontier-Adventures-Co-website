import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  // Served from the custom domain set in the repository's GitHub Pages settings, at the root
  site: 'https://frontieradventurers.com',
  base: '/',
});
