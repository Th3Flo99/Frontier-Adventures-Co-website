import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: 'https://th3flo99.github.io/Frontier-Adventures-Co-website',
  base: '/Frontier-Adventures-Co-website',
});
