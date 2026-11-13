# Frontier Adventurers design guide

The site should feel like the headquarters of an explorers' society: an expedition lodge with maps, brass and travel journals, built with the restraint of a good travel magazine. Every page follows the rules below so the site reads as one piece of work.

## The idea in one line

Jungle-green walls, parchment pages, mahogany wood and aged brass. Real photographs, strong typography, a little dry humour. Nothing that looks like a template.

## Palette

| Token (Tailwind / CSS variable) | Hex | Use |
|---|---|---|
| `jungle` / `--jungle` | `#142A24` | Default page background |
| `jungle-deep` / `--jungle-deep` | `#0C1B17` | Deeper panels, header, photo backdrops |
| `jungle-light` / `--jungle-light` | `#1E3B33` | Raised surfaces, hairlines on dark |
| `gold` / `--gold` | `#C49A50` | Accent on dark surfaces: labels, rules, links |
| `gold-bright` / `--gold-bright` | `#DDB96F` | Hover state of gold |
| `parchment` / `--parchment` | `#E8D3A5` | Text on dark; paper background |
| `parchment-light` | `#F3E8CC` | Headings on dark; top of paper gradient |
| `mahogany` / `--mahogany` | `#482A1B` | Headings and accents on paper; footer |
| `mahogany-deep` | `#2C190F` | Body text on paper |
| `midnight` / `--midnight` | `#192338` | Evening sections (videos) |

Rules:

- **Gold is for dark surfaces only.** On parchment it fails contrast. Use `mahogany` there.
- Body text on dark is `text-parchment/85` or stronger. Never go below `/70` for readable text.
- Body text on paper is `mahogany-deep`, secondary text `rgb(72 42 27 / 0.82)`.
- Parchment sections are the exception, not the rule: at most one or two per page.

## Typography

| Class | Face | Use |
|---|---|---|
| `.display` | Besley (Clarendon) | All headings. Big, tight, sentence or title case |
| `.fell` | IM Fell English italic | Journal notes, captions, numerals, asides. Short lines only |
| (default) | Instrument Sans | Body, navigation, interface |
| `.eyebrow` | Instrument Sans caps | Small label above a heading. Add `no-rule` to drop the leading line |
| `.lede` | Instrument Sans | Intro paragraph under a heading |
| `.page-title` | size only | h1 of a page (use with `.display`) |
| `.chapter-title` | size only | h2 of a section (use with `.display`) |

Do not add other fonts. Do not use all-caps Besley. Do not set long paragraphs in `.fell`.

IM Fell English has old-style figures: a `1` reads like a small capital I and a `5` drops below the baseline. Set scores and other numbers that must be read at a glance in Besley, or spell them out ("One entry", "out of five").

## Ready-made classes (see `src/styles/global.css`)

- Layout: `.shell` (page container with side padding), `.section` (vertical rhythm).
- Surfaces: `.surface-jungle`, `.surface-deep`, `.surface-paper`, `.surface-midnight`, `.surface-mahogany`. Add `.grain` for the paper/film grain. `.lantern` adds one soft warm light pool.
- Buttons: `.btn .btn-brass` (primary), `.btn .btn-ghost` (secondary on dark), `.btn .btn-ink` (on paper). Put `<span class="arrow" aria-hidden="true">→</span>` inside for the moving arrow.
- Text link: `.link` (works on dark and on paper).
- Ornaments: `.ornament` (diamond between hairlines: `<div class="ornament" aria-hidden="true"><span></span></div>`), `.rule-double`, `.stamp` (do not put `.stamp` and `.reveal` on the same element: both set `transform`).
- Photographs: `.frame` (brass keyline inset over a photo, put it on a wrapper that contains the image), `.photo-grade` (the shared warm grade, lifts on hover).
- Motion: `.reveal` (fade up on scroll), `.unveil` (image wipes in), `style="--reveal-delay: 120ms"` to stagger.

## Layout principles

- Editorial, not a card grid. Vary the composition: asymmetric columns, one large image against a narrow text column, numbered lists with hairlines, pull quotes. Avoid rows of identical boxes.
- No rounded cards, no glass panels, no drop-shadow glows, no gradient text, no emoji as icons.
- Corners are square. Lines are 1px. Depth comes from layering and texture, not shadows.
- Generous whitespace. Headings are large; body copy stays 60 to 70 characters wide.
- Each section opens with an `.eyebrow` (often a chapter mark such as "Chapter II · The Crew") and a `.display` heading.
- Mobile is designed first: single column, 24px side padding, touch targets at least 44px, no horizontal scrolling of the page.

## Motion

- CSS handles entrances (`.reveal`, `.unveil`, hover states). Timing: 0.4 to 1.2s, `var(--ease-out)`.
- GSAP + ScrollTrigger (`src/scripts/motion.ts`) handle scroll-linked work: `data-parallax="8"` on an image that is taller than its overflow-hidden box, `data-scrub-words` on a paragraph that inks in while read. Import `gsap` from `../scripts/motion` in a component script if you need a tween.
- Everything must work with JavaScript off and with `prefers-reduced-motion: reduce` (no movement, content visible).
- Never animate layout properties in a loop. No autoplaying video or audio.

## Voice

Friendly, curious, a bit dry. We are five friends, not a travel agency. Write "we" and "our crew". Short sentences. One joke per section at most.

## Content honesty

- Never invent trips, reviews, scores, dates, quotes or personal details. If the data does not have it, the page does not claim it.
- Unknown profile fields are shown as an obvious blank ("Not yet logged"), and stay easy to fill in the JSON.
- Use the real photographs in `public/` through `LocalPhoto.astro`. No stock or generated imagery.
- No Disney logos, characters or artwork. Place names are fine.
- The old name "The Frontier Adventures Co" appears only where it explains the rename.

## Accessibility

- Semantic landmarks and one `h1` per page; heading levels never skip.
- Visible focus (already styled globally). Everything interactive is reachable and usable by keyboard.
- Text contrast at least 4.5:1 (3:1 for text 24px and larger).
- Decorative SVG gets `aria-hidden="true"`. Images get real alt text.
- Do not put `aria-label` on a plain `div` or `span` without a role.

## Where things live

- `src/data/*.json`: all content (crew, food, reviews, destinations, videos, site details).
- `src/lib/adventures.ts`: one combined list of entries, categories and destinations.
- `src/lib/paths.ts`: `href('about')` builds links that respect the deploy base path. Always use it for internal links.
- Scoped class names: do not reuse Tailwind utility names (`contents`, `container`, `hidden`, `block`, `grid`, `table`) as component class names. Tailwind's utility of the same name wins and silently changes the layout.
- Anchor targets: `html` already has `scroll-padding-top` for the fixed header. Give a target at most a small `scroll-margin-top` (1.5rem); a full header height on top of it lands too low.
- `src/components/Logo.astro`: the logo slot. Put the official file in `public/brand/` (see the comment in that file).
