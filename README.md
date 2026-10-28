# Frontier Adventures Co.

Modern static site for the Belgian friend group that visits Disney parks and Disney Cruise Line together.

Built with Astro + Tailwind. Content lives in JSON so you can add reviews without touching components.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:4321

## Build

```bash
npm run build
npm run preview
```

The build outputs to `dist/`. Deploy that folder to Cloudflare Pages, Netlify, or GitHub Pages.

## How to add content

### Food reviews

Edit `src/data/food.json`. Each item:

- `id` (unique string)
- `name`
- `location` (park or ship)
- `type` ("snack" or "restaurant")
- `trip` (optional)
- `review` (short text)
- `scores` object with person names and 1–5 numbers
- `image` (URL or path in `public/`)

### Florian’s reviews

Edit `src/data/reviews.json`:

- `id`
- `title`
- `platform` (TripAdvisor, Google, etc.)
- `date` (YYYY-MM-DD)
- `rating` (1–5)
- `body`
- `reply` (string or null)
- `url` (link to original)

### Group

Edit `src/data/group.json` for bios and photos.

### Socials

Update the links in `src/pages/socials.astro`.

## Deploy notes

- For GitHub Pages from the repo root, the `base` in `astro.config.mjs` is already set to `/Frontier-Adventures-Co-website`.
- For Cloudflare Pages or a custom domain, set `base` to `/` and update `site`.

## Fields still needed from Florian

- Real Instagram, YouTube, TikTok, and X handles
- Real photos of the group (replace Unsplash placeholders)
- Actual food reviews and scores from past trips
- Real TripAdvisor / platform review texts and URLs
- Any extra members later

Assumptions made:

- English is the site language
- Dark theme with gold accents (adventure / sea feel)
- Sample data is fictional but realistic Disney food and review style
- Images are Unsplash placeholders until real photos are added
- No Disney logos or characters

## Structure

```
src/
  data/          JSON content
  layouts/       Base layout with nav
  pages/         Home, About, Food, Reviews, Socials
  styles/        Global CSS + Tailwind
```
