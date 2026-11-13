/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // The home hero puts photo and text side by side only on wide, landscape viewports.
      // On portrait or square screens (e.g. a 1024px-wide tablet held upright) the photo box
      // would be too narrow for the whole group, so those keep the stacked layout.
      screens: {
        hero: { raw: '(min-width: 1024px) and (min-aspect-ratio: 5/4)' },
        'hero-xl': { raw: '(min-width: 1280px) and (min-aspect-ratio: 5/4)' },
      },
      colors: {
        ink: '#0B1419',
        gold: '#E0A84A',
        parchment: '#F5F0E6',
        crimson: '#C4504A',
        teal: '#2A9D8F',
        deep: '#061014',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
