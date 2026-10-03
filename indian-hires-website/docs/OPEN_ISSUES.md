# Open issues

Unresolved items from the redesign. Nothing here is silently dropped; each entry
says what is blocking it. Copy assumptions awaiting the owner's confirmation are
listed separately, with file and key and the original wording, in
`docs/COPY_TO_CONFIRM.md`.

## Needs the owner — Phase R1

| # | Item | Where it shows | What is needed |
|---|---|---|---|
| O1 | Live domain unknown | `NEXT_PUBLIC_SITE_URL` is empty; canonical URLs and JSON-LD `url` are omitted and `/sitemap.xml` is empty until it is set | The domain |
| O2 | Bone china photo ↔ name | "Yellow" is probably the "Haldi Ivory" photo and "Black-White" may be "Spiral Motif". Both names are held back (`status: "unconfirmed"`, not rendered) so no design is listed twice | Confirm or correct |
| O3 | Six melamine photos have no owner name | They sit in Premium Melamine under descriptive names. "Double Color" and "24KT Blue" may be among them and are still listed separately | Owner's name for each, premium or regular, and whether the two duplicates should be merged |
| O4 | Glassware kept as an eighth collection | Not in the owner's collection list, but four photographed pieces exist | Keep or remove; is "8 collections" right |
| O5 | Chat & Snack Plates | Eight entries since R3, from the catalogue's eleven lines; seven shown. Marble and Matt show Small / Big; material is not shown. The plain Small / Big entry has no name in the catalogue and is hidden (`status: "unconfirmed"`; `COPY_TO_CONFIRM.md` §9) | The name of the plain one; plates or bowls; material; what the Blue Handle piece is |
| O6 | Chafing dishes | Six `status: "todo"` placeholders are hidden. Materials are not shown. The five photographed chafers' names and alt text still name metals (brass, copper, silver, gold) because they come from the generated `products.ts` | The six designs with photographs; the material and the business's name for each (then edit the `KEEP` table in `scripts/normalize-images.py` and re-run both scripts) |
| O7 | Cutlery & Serveware | Collection has no items and shows an "ask us" state | Contents and photographs |
| O8 | Heritage Silver | Five named pieces, no photographs; listed as text. Only the plates and cutlery are shown as silver-plated (the owner's own words) | Photographs; which other pieces are silver-plated |
| O9 | Delivery and collection | "How hiring works" step 3 says delivered clean and collected after. Only "stock we hold and deliver ourselves" is carried over from the previous site | Confirm cleaning and collection |
| O10 | Hours and service areas | Carried over from the previous site; service areas reduced to the five named cities | Confirm they are current |
| O11 | Founders' story wording | "one of the leading rental agencies across Gujarat", "exponential growth" and a typed "twenty-five years" were softened; the originals are quoted in `COPY_TO_CONFIRM.md` §5. Roles "Founder" / "Partner" | Approve the softened wording or restore; confirm roles; confirm bone china was introduced in 2015 (now a headline fact) |
| O12 | Testimonials | None published; the old ones read as invented and were not restored. The page shows an honest empty state, is `noindex`, and is out of the navigation until testimonials exist | Real testimonials with permission to credit |
| O13 | Missing assets | Event photographs, founder portraits, a 1200×630 share image, a transparent logo master, and a hero photograph of at least 1000×1250 (the largest source today gives 947px after the 4:5 crop) | The files |
| O14 | Contact form cannot send | `NEXT_PUBLIC_WEB3FORMS_KEY` is empty; the form is hidden and WhatsApp/call are offered instead | The Web3Forms key |
| O15 | Map embed | `NEXT_PUBLIC_MAP_EMBED_URL` is empty; an "open in Google Maps" link is shown instead | The embed URL |
| O16 | Rates | By the owner's decision no rates exist in the code and there is no price flag | Nothing — recorded so the decision is visible |
| O17 | WhatsApp icon | `lucide-react` has no WhatsApp glyph, so buttons use a generic chat bubble | Approve an SVG asset or an icon package |

## Engineering — Phase R1

| # | Item | Rubric | State | Blocking |
|---|---|---|---|---|
| E1 | First Load JS over budget on five routes in iteration 1 (`/collections` 114/110, `/collections/[slug]` 118/110, `/gallery` 136/110, `/founders` 114/100, `/testimonials` 108/100) | 9 | Fixed in iteration 2: every route within its ceiling (`docs/evidence/R1/verify-iter2.log`); headroom is thin on `/founders`, `/testimonials` (99.8/100) and `/collections/[slug]` (109/110) | — |
| E2 | Mobile LCP above 2.5s on seven routes and Performance below 95 on `/` (93), `/collections/bone-china` (94), `/gallery` (89) in iteration 1 | 9 | Being fixed in iteration 2 (hero text painted at first paint, image `sizes`, lazy tiles) | Re-measure after iteration 2 |
| E3 | Quote list reachable only under `/collections` | 5 | Deferred | Mounting the basket in the root layout adds JS to routes already at their budget; needs a budget decision |
| E4 | Lighthouse measured on localhost only (HTTP/1.1, simulated throttling) | 9 | Not measured on a deployed origin | Deploying is out of scope for this phase |
| E5 | INP not measured | 9 | Lab runs produce no INP; TBT is 0ms on every route | Needs field data |
| E6 | No screen-reader pass (VoiceOver/NVDA) on live regions and dialogs | 10 | DOM state checked by script only | Needs a manual pass |
| E7 | Without JavaScript the mobile menu, filters, item drawer, lightbox and quote list do nothing (all content is still shown; footer nav and bottom bar remain) | 7, 10 | Accepted for now | Progressive enhancement of the menu would need a CSS-only fallback |
| E8 | `public/images/Photos/**` (27 source JPEGs, 4.2 MB) is unreferenced but would ship with a deployment | 9 | Left in place | Deleting or moving files needs the owner's go-ahead |
| E9 | `next-themes`, `shadcn`, `@radix-ui/react-label` and `@radix-ui/react-slot` remain in `dependencies` though unused at runtime | 9 | Left in place | Removing a package needs the owner's approval |
| E10 | `src/content/products.ts` is still the generated photo manifest behind `collections.ts` | — | By design this phase | Folding it into one pipeline is a later clean-up |


## Phase R2 — design system

### Needs the owner

| # | Item | Where it shows | What is needed |
|---|---|---|---|
| O18 | The R2 brief asks for things earlier decisions ruled out: `sage-700`, Cinzel and Inter, a 1240px container, the names `--bg` / `--surface` / `--text` | Not built. `Docs/UI_UX_V2.md` §12 maps each to what exists (gold-only accent, Cormorant Garamond + Jost, the 1280px `shell`, shadcn's role names) | Confirm the R1 decisions stand, or say which to reopen |
| O19 | "Ask for rates" as the card's WhatsApp label | `ProductCard` takes the label as a prop; the only specimen uses the catalogue's existing "Ask on WhatsApp" | The wording, if a second label is wanted |
| O20 | The primary button changed on every page: a gold hairline edge and a gold sheen on hover | All routes | A look at `docs/evidence/R2/home-1280.png` and a hover in the browser; say if the hairline or the sheen should go |

### Engineering

| # | Item | Rubric | State | Blocking |
|---|---|---|---|---|
| E11 | `npm run verify` for R2 first ran on a mirror of the app (another session held port 3001) | — | Resolved: re-run in place before the merge, exit 0 (`docs/evidence/R2/verify.log`) | Nothing |
| E12 | `/design-system` was captured from `next dev` only | 9, 10 | The route is development-only and answers 404 in a build, so there is no production capture, no Lighthouse and no axe run for it | By design; drop the `env.isDevelopment` gate if a deployed copy is wanted |
| E13 | R2 changed the primary button and added the reduced-motion net on every route, but only `/`, the 404 and `/design-system` were re-captured | 1, 6 | Not re-scored by `reviewer`; no Lighthouse or axe re-run for R2 | Run the QA loop for R2 (reviewer + qa-a11y-perf) |
| E14 | `scripts/contrast.mjs --check` is not part of `npm run verify` | 4 | Run by hand; output in `docs/evidence/R2/contrast.log` | Adding a step to `verify.sh` changes the harness — needs a yes |
| E15 | `tailwind.config.ts` still carries shadcn's default `container` (2rem, 1400px), unused | — | Left as is; `shell` is the content column | Remove or align in a clean-up |
| E16 | `ArchImage` must not be re-exported from the ornament barrel | 9 | Doing so added about 5 kB (the `next/image` client chunk) to `/founders`, `/testimonials` and `/contact` and put two of them over the 100 kB ceiling; reverted, comment left in `ornament/index.ts` | Nothing — recorded so it is not repeated |


## Phase R3 — catalogue taxonomy and content layer

### Needs the owner

| # | Item | Where it shows | What is needed |
|---|---|---|---|
| O21 | **The R3 brief asks for rates in the data behind a `SHOW_PRICES` flag. Not built.** It reverses O16 and the `NoPricing` rule. This is a static site: anything in `src/content` is compiled into the JavaScript every visitor downloads, so a flag that hides rates in the UI still publishes them. No rate from the brief was written to any file | Nowhere. `scripts/test-catalogue.cjs` reads the content sources and fails on a price-shaped property or a rupee figure in a string | Confirm O16 stands. If rates are wanted, they need somewhere that is not shipped to the browser — a private sheet, or a build-time file outside `src/` |
| O22 | Other things the R3 brief asks for that R1 had already settled differently. Kept as they are: (a) item status is `available` / `todo` / `unconfirmed`, not `live` / `placeholder` — `todo` is the brief's `placeholder`, and `unconfirmed` has no equivalent; (b) an item has one `image` with width, height and blur data, not `images[]`; (c) `products.ts` stays the generated photo manifest and was not rewritten by hand; (d) `env.ts` fallbacks stay empty rather than the real numbers | `src/content/collections.ts`, `src/lib/env.ts` | Say if any should be reopened |
| O23 | The brief lists Vintage Silver-Plated (plates, cutlery, tableware) as a placeholder to hide. Its five entries are still public, as a text list with no tiles, as agreed in R1 iteration 2 | `/collections/heritage-silver` | Hide the list until photographed, or keep it? |
| O24 | Trust badges are in the data, all four `confirmed: false`, and rendered nowhere; "25+ Years of Heritage" sits beside "1977" | `site.ts` → `trustBadges`; `COPY_TO_CONFIRM.md` §9.4 | Wording of all four, and where they should appear |

### Engineering

| # | Item | Rubric | State | Blocking |
|---|---|---|---|---|
| E17 | `npm run test:catalogue` is not part of `npm run verify` | — | Run by hand; output in `docs/evidence/R3/test-catalogue.log` | Adding a step to `verify.sh` changes the harness — needs a yes (same as E14) |
| E18 | `public/images/catalogue/<collection>/<slug>-1.webp` is a naming convention only. Nothing reads that folder; photographs still reach the site through the `KEEP` table and the generated manifest | — | Documented in `scripts/extract-catalogue-images.md` §5 | Part of E10 |
| E20 | Lighthouse and axe: **not measured** for R3 | 9, 10 | R3 changed data and added no component, style or client code; the build table is in `docs/evidence/R3/verify.log` and every route is inside its budget. The three routes whose piece lists changed were captured at four widths | Measure with the next phase that changes a page |
| E21 | Catalogue rendering, seen in the R3 captures and not introduced by R3: the Matt Black Series' seven pieces are cut by `line-clamp-2` on the card (`ItemCard.tsx:92`); a text row repeats the name when a piece or finish label equals it — "Mug / Mug", "Marble / Marble" (`ItemRow.tsx:33`); at 390px the Piece filter group starts off-screen with no scroll cue (`FilterBar.tsx:54`), and Regular Melamine now has one | 5, 7 | Not fixed: component work, outside a content-layer phase | The next phase that touches the catalogue pages |
| E22 | `src/lib/catalogue.ts` exports a `getCollection(slug: string)` that may return undefined and whose `items` are public only; `collections.ts` has a `getCollection(slug: CollectionSlug)` that always returns one, hidden entries included | — | Both names are deliberate (the brief's API; R1's) | Settle on one when the callers move (E19) |
| E19 | `src/lib/catalogue.ts` has no caller yet | — | The catalogue pages still call `collections.ts` directly, and `QuoteSheet` builds its link from `whatsappMessages.basketQuote`, which `buildWhatsAppQuoteUrl` wraps | Switch the callers when those pages are next rewritten |


## Phase R4 — global layout, home page, motion primitives

The R4 brief was written before R1–R3. Most of what it describes was already built
(the six motion primitives, the header, drawer, footer, bottom bar, skip link and all
seven home sections); `motion` was installed in R1 and AOS was already gone, so nothing
was installed or removed. R4 closed the gaps listed in `docs/evidence/R4/README.md`.
What the brief asks for and was **not** built is below, with the reason.

### Needs the owner

| # | Item | Where it shows | What is needed |
|---|---|---|---|
| O25 | **Hero layout.** The brief asks for a full-viewport banquet photograph under a maroon overlay, with the copy on top and a scroll cue. Kept: the maroon band with the photograph in an arch beside the copy (`Docs/UI_UX_V2.md` §7.11 — no text over a photograph). There is no banquet photograph (O13), and the brief's fallback, a gradient, would replace a real photograph with none. The hero is 857px tall at 1280×900, so the next section already shows; no scroll cue was added | `/` | A banquet or table photograph, at least 1920px wide. With it the full-bleed version can be built under `hero-scrim` |
| O26 | **Hero buttons.** The brief: "Explore Collections" in gold first, "WhatsApp for a Quote" as an outline. Kept: WhatsApp first and green (every WhatsApp action on the site is the green button, and the enquiry is the page's job), the collections link as the outline. The brief's two labels are used, in sentence case like every other label on the site ("WhatsApp for a quote", "Explore collections", "Get a quote", "Our story") | `/` hero | Say if the order should swap, or if the labels should be in Title Case |
| O27 | **Hero eyebrow "SINCE 25 YEARS · VADODARA"** not used — see `COPY_TO_CONFIRM.md` 10.2 and 9.8 | `/` hero | Confirm "Since 1977 · Vadodara since 2001" |
| O28 | **Six featured collections — a choice, not a constraint.** The brief names Bone China, Premium Melamine, Regular Melamine, Chat Plates, Heritage Silver and Chafing Dishes. Four tiles are shown: the collections that have a photograph (Bone China, Premium Melamine, Chafing Dishes, Glassware). The brief's six can be shown today — the tile already draws the crown placeholder where there is no photograph — but three of the six arches would then be placeholders, and Glassware, which has photographs, would drop out. No recorded rule forbids it; it was a judgement that a half-empty row is worse than four full tiles and a "See all collections" button. Each tile is one link, so there is no separate "View collection" text | `/` → `home.featured.collections` (derived; `FEATURED_MAX`) | Choose: four photographed tiles (now), or the brief's six with three placeholders. Photographs for Regular Melamine, Chat & Snack Plates and Heritage Silver (O5, O8) settle it either way |
| O29 | **Heritage teaser: founder portrait and a quotation.** Not built. There is no portrait (O13) and no quotation from the family; neither may be invented. The teaser stays as the dated summary of the story | `/` | A portrait and a sentence in the family's own words |
| O30 | **Italic Cormorant** for the quotation and the testimonials. Not loaded: `fonts.ts` loads one upright weight, and an italic file is a second font download on every page for text that does not exist yet (O12, O29) | — | Decide when there is a quotation to set |
| O31 | **Floating WhatsApp on phones.** Built as the brief decides it ("hidden on mobile if the bottom bar already has WhatsApp? No: keep it per PRD (FR7), but position above the bottom bar on mobile"): it now shows below 768px, 16px above the bottom bar, which also carries WhatsApp. The reviewer's finding stands on the record (critique-iter1 F1): a 56px circle over the right edge of a 390px page covers whatever scrolls under it — story text on `/founders`, a card title on a collection page — for an action the bar already offers. One thing was changed after review: on a collection page, once the quote-list button appears it takes the floating button's place, so a phone never shows two round buttons (critique-iter1 F2) | every route below 768px | A look at `docs/evidence/R4/iter2/founders-390.png` and `iter2/states/state-quote-button-390.png` on a phone; confirm the brief's decision, or say the bar is enough on phones |
| O32 | **Social links.** The footer renders Instagram and Facebook only when their env vars are set; both are empty | footer | The profile URLs, if any |

### Engineering

| # | Item | Rubric | State | Blocking |
|---|---|---|---|---|
| E23 | Solid header backdrop is `ivory-50` at 90%, not the brief's 85% | 4 | Kept: the header's contrast pairs in `.claude/rules/a11y.md` are computed at 90% | Recompute the two pairs if 85% is wanted |
| E24 | Screenshots are in `docs/evidence/R4/`, not the brief's `docs/screens/` | — | The project's evidence convention (`docs/QA_LOOP.md`) | Nothing |
| E25 | The primitives gate on `useMotionPreference` and CSS (`motion-safe:`, a `no-preference` query), not on `motion`'s `useReducedMotion` | 6, 9 | By design since R1: scroll reveals, counters, the page fade and drawers load no animation library | Nothing |
| E26 | `HomeTestimonials` was restyled to the brief's gold left border, but it renders nothing while there are no testimonials | 1 | **Not visually checked** — no screenshot exists of it | Check when the first testimonial is published (O12) |
| E27 | Trust strip icons are generic lucide glyphs (shop, people, map pin, cutlery); there is no plate or crockery glyph in the set | 1 | Built as the brief asks ("4 items with gold icons (lucide)"). The reviewer finds they read as a template stat block (critique-iter1 F5) and the builder agrees; kept because the brief names them | The owner: keep, remove, or commission four drawn icons |
| E28 | Featured tiles: every second arch stands 40px lower from 1024px (the brief's "asymmetric grid") | 1 | Kept. The reviewer finds the captions no longer share a baseline across the row (critique-iter1 F6) | The owner: keep the offset or align the row. One class in `FeaturedCollections.tsx` |
| E29 | **Mobile LCP misses the 2.5s target on six of eight routes** — medians of three runs on the final build (`docs/evidence/R4/lighthouse.log`): `/` 2.79s, `/collections` 2.56s, bone-china 4.27s, chafing-dishes 3.86s, gallery 2.94s, testimonials 2.57s; founders 2.26s and contact 2.33s pass. CLS is 0 everywhere | 9 | On `/` unchanged in kind since R1 (2.9s). R4 added a 520px image candidate, which took the hero photograph from 68 kB to 47 kB and `/` from 95 / 2.9s to 96 / 2.8s. AVIF was measured and not kept (no gain on `/`). Lighthouse observes the LCP within tens of milliseconds; the figure is its slow-4G simulation applied to localhost over HTTP/1.1 (E4) | Measure on the deployed origin. If it still misses there: the three render-blocking stylesheets (est. 270 ms) and the hero image's bytes are what is left |
| E33 | **Mobile Performance is below 95 on the two measured collection pages**: bone-china 95 / 86 / 86 (median 86), chafing-dishes 88 / 88 / 88. `/` is 96, `/collections` 97, founders 99, gallery 95 (one run of three at 83), testimonials 97, contact 98 | 9 | The score is bimodal: a run where Lighthouse takes the page heading as the LCP element scores 95–98 (LCP ≈ 2.9s); a run where it takes a catalogue card photograph scores 85–90 (LCP 3.6–4.3s). Ten extra runs per format in `docs/evidence/R4/lighthouse-recheck.log` show the same split with WebP and with AVIF. It predates R4 (R1 recorded glassware at 92 / 3.4s; R4's first full run had chafing-dishes at 92 / 3.4s) and R4 changed nothing in the card or the grid. **Not diagnosed.** A guess, unverified: the grid is rendered statically and then replaced by the interactive catalogue once its script loads, so the photograph's paint is counted late | The next phase that rewrites the catalogue pages (with E21, E31): find why the card photograph paints late, then re-measure |
| E30 | The gold button has no hover feedback under reduced motion: its only hover effect is the sheen, which is off there (critique-iter1 F14) | 4, 6 | Not changed — it predates R4 and there is no second gold fill token to step to | A hover token for the gold fill (design-architect) |
| E31 | E21 (catalogue card clamp, repeated labels, the filter row's missing scroll cue at 390px) is still open | 5, 7 | R4 touched the catalogue only to place the quote-list button; the card and filter components were not rewritten | The next phase that rewrites the catalogue pages |
| E32 | No screen-reader pass; animated states (line draw, drawer stagger) were checked by computed style, not by eye or video | 6, 10 | Scripted checks only (`scripts/keyboard-pass.mjs`) | A manual pass on a phone (E6) |
