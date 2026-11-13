# Frontier Adventurers

The website of Frontier Adventurers (formerly The Frontier Adventures Co): a Belgian crew of five friends and family sharing theme park adventures, Disney cruises, food reviews and travel stories.

Built with Astro and Tailwind as a fully static site. All content lives in JSON files, so you can add a review, a food entry or a video without touching a component.

The look and feel is described in [DESIGN.md](DESIGN.md). Read it before changing or adding a page.

## Run locally

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321/Frontier-Adventures-Co-website/

## Build

```bash
npm run build
```

```bash
npm run preview
```

The build outputs to `dist/`.

## Deploy

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

Live URL: https://th3flo99.github.io/Frontier-Adventures-Co-website/

The repository name and the `base` in `astro.config.mjs` still carry the former name. That is deliberate: changing them changes the public URL. For a custom domain, set `base` to `/` and update `site`.

## The logo

Put the official logo in `public/brand/` as `logo.svg`, `logo.png` or `logo.webp`. It is then used in the header, the hero, the menu and the footer automatically. Optional variants: `logo-light.*` for dark backgrounds and `logo-dark.*` for parchment. Until a file is there, the site shows a plain text wordmark.

## Content

| What | File |
|---|---|
| Name, description, social links | `src/data/site.json` |
| The crew | `src/data/group.json` |
| Food and snack entries | `src/data/food.json` |
| Reviews | `src/data/reviews.json` |
| Map destinations | `src/data/destinations.json` |
| Videos | `src/data/videos.json` |

`src/lib/adventures.ts` combines these into one list that the archive, the home page and the expedition map all read from.

### The crew (`group.json`)

- `name`, `role`, `bio`
- `image` and `photos`: paths inside `public/`, for example `photos/megan/food.jpg`
- `favoriteDestination`, `favoriteAttraction`, `travelStyle`: leave empty (`""`) until you know them. An empty field shows as "not yet logged".
- `socials` (optional), for example `{ "x": "https://x.com/..." }`

### Food (`food.json`)

- `id` (unique), `name`, `location`, `type` (`snack` or `restaurant`), `trip`, `review`
- `scores`: one 1 to 5 score per person
- `image`: a path inside `public/`. Remote URLs are kept in the data but not displayed; the site only shows your own photographs.
- `destination`: the `id` of an entry in `destinations.json`, or `null`

### Reviews (`reviews.json`)

- `id`, `title`, `platform`, `rating` (1 to 5), `url` (link to the original)
- `date`: `YYYY-MM-DD` or `YYYY-MM`, shown as "14 May 2026" or "May 2026"
- `summary` (optional short verdict), `sections` (optional list of `{ "title", "body" }`), `body` (original text, used when there are no sections)
- `images`: paths inside `public/`. Remote URLs are not displayed.
- `reply` (text or `null`), `destination`, `category` (`theme-parks`, `cruises`, `food` or `journals`)

### Map destinations (`destinations.json`)

Only add places you have actually published content about.

- `id`, `name`, `kind` (`park` or `cruise`), `region`, `lat`, `lon`
- `approximate`: `true` when the marker is symbolic, for example a ship at sea
- `blurb`: one or two factual sentences
- `photo` (optional): `{ "src", "alt" }`

### Videos (`videos.json`)

The entry format is described inside the file. YouTube videos only load after a visitor presses play.

## Photos

Local photos go through `LocalPhoto.astro`, which serves responsive WebP copies from `public/optimized/`. After adding or replacing a photo, run this from the repository root (needs Python with Pillow):

```bash
python scripts/optimize-images.py
```

Commit the generated WebP files together with `src/data/image-sizes.json`.

## Privacy

The site sets no cookies and loads nothing from third parties: fonts are self-hosted, there is no analytics, and video embeds are click-to-load. Keep it that way, or add a consent step before introducing anything that tracks visitors. The public statement is in `src/pages/privacy.astro`.

## Structure

```
src/
  components/    Logo, compass, expedition map, carousels, section teasers
  data/          JSON content
  layouts/       Page shell: header, journal menu, footer, metadata
  lib/           Content library and link helper
  pages/         Home, crew, adventures, food, reviews, contact, privacy, 404
  scripts/       Scroll-linked motion (GSAP)
  styles/        Design system
public/
  brand/         The official logo goes here
  photos/        Original photos per person
  optimized/     Generated WebP copies
```
