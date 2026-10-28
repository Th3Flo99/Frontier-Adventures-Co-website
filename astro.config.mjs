import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://th3flo99.github.io/Frontier-Adventures-Co-website',
  base: '/Frontier-Adventures-Co-website',
});
