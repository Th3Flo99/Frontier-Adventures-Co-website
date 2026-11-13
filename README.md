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

The build outputs to `dist/`.

## Deploy to GitHub Pages

The repo is already configured for GitHub Pages:

1. Go to the repo → Settings → Pages
2. Under "Build and deployment" set Source to **GitHub Actions**
3. Push to `main` (or trigger the workflow manually). The workflow in `.github/workflows/deploy.yml` builds the site and deploys it.

Live URL will be: https://th3flo99.github.io/Frontier-Adventures-Co-website/

The `base` in `astro.config.mjs` is already set to `/Frontier-Adventures-Co-website`.

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
- `date` (`YYYY-MM-DD` or `YYYY-MM`; shown as "14 May 2026" or "May 2026")
- `rating` (1–5)
- `body` (original review text)
- `summary` (optional short verdict)
- `sections` (optional list of `{ "title": "…", "body": "…" }` for readable sections)
- `reply` (string or null)
- `url` (link to original)

### Group

Edit `src/data/group.json` for bios and photos. Photos live in `public/photos/<name>/`.

### Socials

Update the links in `src/pages/socials.astro`.

## Deploy notes

- For Cloudflare Pages or a custom domain, set `base` to `/` and update `site` in `astro.config.mjs`.

## Fields still needed from Florian

- Real photos of Megan, Elias, Lotte and Thibeau (put them in `public/photos/<name>/`)
- Actual food reviews and scores from past trips
- Any extra members later

Assumptions made:

- English is the site language
- Dark theme with gold accents (adventure / sea feel)
- No Disney logos or characters

## Structure

```
src/
  data/          JSON content
  layouts/       Base layout with nav
  pages/         Home, About, Food, Reviews, Socials
  styles/        Global CSS + Tailwind
public/
  photos/        Photos per person
```

## Responsive photos

Local group photos use `LocalPhoto.astro` with responsive WebP copies in `public/optimized/`. The original JPEGs remain available. After adding or replacing a local photo, run this from the repository root with Python and Pillow installed:

```bash
python scripts/optimize-images.py
```

Commit the generated WebP files and `src/data/image-sizes.json` together. Pass a public-relative source path to `LocalPhoto`, set `sizes` for its layout, and use `priority` only for above-the-fold hero images. Other photos load lazily.
