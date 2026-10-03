# Handoff — Indian Hirers website

For whoever looks after the site next: the owner, a developer, or an agent. Every
command runs from `indian-hires-website/`. The rules the code follows are in
`../CLAUDE.md` and `../.claude/rules/`; the design system is `../Docs/UI_UX_V2.md`.

| | |
|---|---|
| Stack | Next.js 14 (App Router, static pages) · TypeScript · Tailwind 3 · Web3Forms · Vercel |
| Check everything | `npm run verify` (lint → typecheck → build → token check), then `npm run test:catalogue` |
| Run locally | `npm run dev` → http://localhost:3001 |
| Where the words live | `src/content/*.ts` — never in components |
| Where the colours live | `src/app/globals.css` (`:root`) and `tailwind.config.ts` — nowhere else |

Before a change goes live: `npm run verify` exits 0 and `npm run test:catalogue` prints
`ALL PASS`. A route over its JavaScript budget fails the build table check in
`.claude/rules/performance.md`.

---

## 1. Add a product (a design in a collection)

The catalogue is `src/content/collections.ts`. Each collection has a list of item
*seeds*; the public pages, the gallery, the sitemap and the counts on the home page are
all derived from it, so a design is added in one place.

**Without a photograph** — add a seed to the collection's `items` in `collectionSeeds`:

```ts
{
  slug: "rose-gold",                 // unique within the collection, lower-case, hyphens
  name: "Rose Gold",
  material: "bone-china",            // a Material from the same file, or null if unconfirmed
  finishes: ["gold-rim"],            // Finish values; [] if none confirmed
  pieces: DINNER_SET_PIECES,         // or a Piece[] of its own
}
```

It shows with the crown placeholder and "Photograph to follow". Leave `status` out
(it defaults to available). `status: "todo"` or `"unconfirmed"` keeps a seed in the
file but off the site.

**With a photograph** — the photograph goes through the image pipeline first, so it gets
its size, its blur placeholder and its alt text:

1. Check the picture: no rate, no "/-" figure, no price table anywhere in the frame,
   one design only. Catalogue PDFs carry wholesale rates; they never enter the repo
   (`scripts/extract-catalogue-images.md` §1–2).
2. Put the source JPEG in `public/images/Photos/<Category>/`.
3. Add a row to the `KEEP` table in `scripts/normalize-images.py`:
   `("source-file.jpeg", "slug", "Display Name", "Alt text that describes the frame")`.
   Alt text says what is in the picture — material, colour, pattern, piece — never
   "image of" (`npm run test:catalogue` rejects that, or a file name, or fewer than 12
   characters).
4. `pip install pillow` once, then
   `python3 scripts/normalize-images.py && python3 scripts/generate-products-content.py`.
   `src/content/products.ts` is regenerated — never edit it by hand.
5. On the seed, add `photo: { category: "bone-china", slug: "rose-gold" }`.
6. `npm run test:catalogue` and `npm run verify`.

The gallery picks the photograph up by itself, in its collection's frame (square for
dinner sets, 4:5 for chafing dishes, 3:4 for glassware — `src/components/gallery/galleryLayout.ts`).

## 2. Add the chafing dish photographs

Six chafing dish designs are waiting as placeholders (`CHAFING_DISH_PLACEHOLDERS` in
`src/content/collections.ts`, `status: "todo"`, invisible on the site). Five other
chafers are already photographed. For each new design:

1. Run steps 1–4 of section 1 with the category `chafing-dishes` and the source folder
   `public/images/Photos/Chrafering-dish/` (the folder name is misspelt on purpose — it is
   the owner's original folder; the `KEEP` table points at it).
   A tall chafer whose lid or stand fills the frame height goes in the `PAD` set in
   `normalize-images.py`, so it is letterboxed rather than cropped.
2. Replace one placeholder in `CHAFING_DISH_PLACEHOLDERS` with a real seed: the owner's
   name for the design, its material (only if the owner has confirmed it — OPEN_ISSUES O6),
   `photo: { category: "chafing-dishes", slug: "…" }`, and no `status` (or
   `status: "available"`).
3. When all six are done, delete the placeholder helper.
4. `npm run test:catalogue` — its placeholder test counts the six `todo` entries and must
   be updated in the same change.

## 3. Change the colours

All colour is in **two files**:

- `src/app/globals.css`, the `:root` block: bare HSL triplets, e.g.
  `--maroon-700: 10 75% 25%;`. `.theme-dark` (maroon bands) and `.theme-light` re-map the
  semantic roles (`--primary`, `--heading`, `--kicker` …) to those primitives.
- `tailwind.config.ts` exposes them as utilities (`bg-maroon-700`, `text-heading`).

To change a colour:

1. Edit the triplet in `:root`. Keep it in the logo's warm band (hue 10°–46°;
   `#800020` is not the brand) — `docs/color-system.md` says why.
2. `node scripts/contrast.mjs --check` — exits 1 if any required text/background pair falls
   under 4.5:1 (3:1 for large text and borders). Then `node scripts/contrast.mjs --table`
   and paste the tables into `docs/color-system.md`, `.claude/rules/a11y.md` and
   `../Docs/UI_UX_V2.md` §3.
3. If it is maroon-950, also change `themeColor` in `src/app/layout.tsx` (the one place a
   hex is allowed, marked `check-tokens-ignore`) and regenerate the share image:
   `python3 scripts/make-og-image.py` (it reads the colours from `globals.css`).
4. `npm run verify` — its last step, `check-tokens`, fails on any raw colour or stock
   `white`/`black` class in a component.

Never write a hex, `rgb()` or `hsl()` value in a component.

## 4. "Turn prices on"

**There is no switch, by the owner's decision (OPEN_ISSUES O16, O21).** No rate exists
anywhere in the code, and the code is built so one cannot be added by accident:

- every catalogue type extends `NoPricing` (`src/content/products.ts`), which makes a
  `price`, `rate`, `cost`, `mrp`, `amount`, `currency` or `discount` field a compile error;
- `npm run test:catalogue` fails on a price-shaped property or a rupee figure in any string.

Why there is no hidden flag either: this is a static site. Everything in `src/content` is
compiled into the JavaScript every visitor downloads, so a rate hidden by a flag is still
published. The catalogue PDFs' rates are **wholesale** rates.

If the owner decides, in writing, to publish rates:

1. Decide which rates are public (not the wholesale ones) and where they are kept.
2. Add a `rate` field only to the item type that needs it, with `NoPricing` removed from
   that one type, in the same change as the test update in step 3 — never a blanket removal.
3. Update the two price tests in `scripts/test-catalogue.cjs` so they still guard
   everything else, and update `.claude/rules/content.md` ("No pricing, ever").
4. Render it on the item card (`src/components/collections/ItemCard.tsx`) in place of
   "Rates on request", from a content string — never a typed figure in a component.

Until then every item says "Rates on request" and the enquiry goes to WhatsApp.

## 5. Deploy to Vercel

Not deployed in this phase. To deploy:

1. Import the GitHub repository in Vercel. **Root directory: `indian-hires-website`.**
   Framework preset: Next.js (detected). Build command `next build`, output default.
   Node 20 or 22.
2. Set these environment variables (Project → Settings → Environment Variables), for
   Production and Preview. `.env.example` lists the same names.

   | Variable | Value | If empty |
   |---|---|---|
   | `NEXT_PUBLIC_PHONE` | `+919825037478` | no primary phone link anywhere |
   | `NEXT_PUBLIC_PHONE_ALT` | `+918734090908` | no second phone link |
   | `NEXT_PUBLIC_WHATSAPP` | `919825037478` (digits only, with 91) | WhatsApp buttons fall back to the contact page |
   | `NEXT_PUBLIC_EMAIL` | `indianhires@gmail.com` | no email link |
   | `NEXT_PUBLIC_WEB3FORMS_KEY` | the access key from web3forms.com (free; sends to the email it was created with) | the enquiry form is hidden; WhatsApp and call buttons are shown instead |
   | `NEXT_PUBLIC_MAP_EMBED_URL` | Google Maps → Share → Embed a map → the `src` of the iframe | an "Open in Google Maps" link replaces the map |
   | `NEXT_PUBLIC_SITE_URL` | the live origin, e.g. `https://www.example.in`, no trailing slash | no canonical URLs, an **empty sitemap**, no `og:image` (it must be absolute) |
   | `NEXT_PUBLIC_INSTAGRAM_URL` | profile URL (optional) | no Instagram link in the footer |
   | `NEXT_PUBLIC_FACEBOOK_URL` | page URL (optional) | no Facebook link |

   All are `NEXT_PUBLIC_*`: they are baked in at build time, so **redeploy after changing
   one**. None is a secret — the Web3Forms key is public by design.
3. Deploy. Then check: `/robots.txt`, `/sitemap.xml` (lists every page and collection once
   `NEXT_PUBLIC_SITE_URL` is set), a share preview of the home page (the logo on maroon,
   `public/images/brand/og-image.png`), the form (send one test enquiry), the map.
4. Run Lighthouse on the deployed URL — the numbers in `docs/lighthouse/` were measured on
   localhost (OPEN_ISSUES E4, E29).

Before the first deployment, ask the owner about `public/images/Photos/**` (27 source
JPEGs, 4.2 MB, unreferenced; OPEN_ISSUES E8): they ship with the site unless removed.

## 6. Other everyday changes

| Change | Where |
|---|---|
| Any visible text, a button label, an alt text, a page title or description | `src/content/*.ts` (`site.ts` holds the brand, navigation and per-page metadata) |
| Opening hours | `HOURS` in `src/content/contact.ts` (still a placeholder: O10) |
| A testimonial | `src/content/testimonialList.ts` — real words, a named customer who agreed. The home section, the nav link, the page's indexing and its JSON-LD all switch on with the first one |
| A founder's portrait | `portrait` on the profile in `src/content/founders.ts` (an image with `src`, `width`, `height`, `blurDataURL`, made like a product photo). It appears in the circular frame with a warm gold wash; it costs no JavaScript |
| A milestone year the story doesn't state | `founders.ts` → `milestones`: give the `todo` entry its `year` and set `status: "shown"` |
| Event photographs for the gallery | `eventPhotos` in `src/content/gallery.ts`; a section "At events" appears with them |
| The share image | `python3 scripts/make-og-image.py` |

## 7. QA tooling

| Script | Does |
|---|---|
| `npm run verify` | lint, typecheck, build (with the First Load JS table), token check |
| `npm run test:catalogue` | catalogue data, no prices, alt text, founders' pull-quotes |
| `node scripts/import-cycles.mjs` | fails on any circular import in `src/` |
| `node scripts/contrast.mjs --check` | every required colour pair |
| `node scripts/screenshots.mjs <dir>` | every route at 390/768/1280/1920, reduced motion, the drawer |
| `node scripts/r6-pass.mjs <dir>` | gallery, lightbox, swipe, form (mocked send), 404, 320px, 200% zoom, reduced motion |
| `node scripts/keyboard-pass.mjs` | skip link, nav, drawer, fixed buttons, layout shift |
| `node scripts/audit.mjs lighthouse\|axe` | Lighthouse (`LH_RUNS=3` for medians) and axe |

The browser scripts need a running server (`npm run build && npx next start -p 3001`).
Where Playwright's own Chromium is not installed, set `PW_CHROMIUM` (and `CHROME_PATH`
for Lighthouse) to a Chromium binary.

## 8. Open issues

The live list, with what each one is waiting for, is `docs/OPEN_ISSUES.md`. Copy
waiting for the owner's confirmation, with the original wording, is
`docs/COPY_TO_CONFIRM.md`. The state at the end of the redesign is summarised below.

<!-- OPEN-ISSUES-SUMMARY -->
