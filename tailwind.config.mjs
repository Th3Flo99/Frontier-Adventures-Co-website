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
      // Frontier Adventurers palette. Gold is an accent for dark surfaces only:
      // on parchment it does not have enough contrast for text, use mahogany there.
      colors: {
        jungle: { DEFAULT: '#142A24', deep: '#0C1B17', light: '#1E3B33' },
        gold: { DEFAULT: '#C49A50', bright: '#DDB96F', dim: '#8E7038' },
        parchment: { DEFAULT: '#E8D3A5', light: '#F3E8CC', dark: '#D4BC88' },
        mahogany: { DEFAULT: '#482A1B', deep: '#2C190F' },
        midnight: { DEFAULT: '#192338', deep: '#101828' },
      },
      fontFamily: {
        display: ['"Besley Variable"', 'Besley', 'Georgia', 'serif'],
        fell: ['"IM Fell English"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans Variable"', '"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.22em',
      },
      maxWidth: {
        site: '76rem',
      },
    },
  },
  plugins: [],
};
