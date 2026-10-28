/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
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
