# Phase R6 — founders, gallery, testimonials, contact, 404, final audit

```
PHASE R6 — INCOMPLETE, OPEN ISSUES      iterations: 3/4 (stopped: STOP → OPEN_ISSUES)
verify:      exit 0     docs/evidence/R6/verify-iter3.log
screenshots: docs/evidence/R6/iter3/   (41 full-page: 8 routes × 390/768/1280/1920, 8 reduced-motion at 390, the drawer)
             docs/evidence/R6/iter3/states/   (gallery captions, lightbox, contact errors/sending/success/failed, 320px, 200% zoom)
critique:    docs/evidence/R6/critique-iter3.md   (iter1 35/50 · iter2 37/50 · iter3 37/50)
scores:      1:3 2:4 3:4 4:4 5:4 6:4 7:3 8:4 9:3 10:4   total 37/50   (item 9 scored on iteration-2 numbers; see below)
lighthouse:  gate met — perf ≥ 95 · a11y 100 · SEO 100 on /, /collections, /collections/bone-china, /contact, mobile and desktop
             (docs/lighthouse/iter3/, docs/evidence/R6/qa-a11y-perf-iter3.md)
open issues: R6 section of docs/OPEN_ISSUES.md — O40–O46, E49–E67
```

The brief was written before R1 built these five routes. R6 closed the gaps. Copy
changes are in `docs/COPY_TO_CONFIRM.md` §12; what was not built, and why, is in
`docs/OPEN_ISSUES.md` (Phase R6). How to maintain the site: `docs/HANDOFF.md`.

## Why the loop stopped

Items 1 (luxury feel), 7 (mobile ergonomics) and 9 (performance) scored 3 in three
consecutive iterations; the reviewer's iteration-3 verdict is STOP → OPEN_ISSUES.

- **1** needs photographs: event setups, better product shots, founder portraits (O13, O40).
- **7** needs the owner: the floating WhatsApp button covers content on phones, kept by
  the R4 brief (O31; a proposal in E59). From 768px a gutter would fix it without a
  decision (E61, not built at the stop).
- **9** was scored on iteration-2 numbers (/gallery median 90). The **iteration-3 run on the
  final build came after the scoring**: every route's mobile median is now ≥ 95 (/gallery 96),
  so the "85–94" line no longer applies; LCP is still 2.8 s on four routes under
  localhost slow-4G simulation (E60). Not re-scored.

## Built

| Route / area | What | Files |
|---|---|---|
| /founders | Three generations in "Meet the Family", each in a circular warm-toned portrait frame (a crown cameo until a portrait exists; the photo branch is rendered with `next/image`'s props on the server, so it costs no JavaScript — checked with a stand-in portrait); pull-quotes excerpted from the story, placed away from their source; the timeline of stated years with the year inside each `h3`, unknown years kept as `todo` data | `founders/FounderPortrait*.tsx`, `FoundersStory.tsx`, `MilestoneTimeline.tsx`, `FoundersPeople.tsx`, `content/founders.ts`, `lib/serverImageProps.ts` |
| /gallery | CSS-columns masonry with per-collection frames; order chosen to balance the columns, weak backdrops last; caption slides up on hover and keyboard focus, always shown on touch screens; lightbox with arrows, Esc, swipe, focus return, cropped to the tile's frame; lazy images except the phone's two column heads (one `priority`); alt text required by a test | `gallery/GalleryGrid.tsx`, `galleryLayout.ts`, `app/gallery/page.tsx`, `scripts/test-catalogue.cjs` |
| /testimonials | Gold left-border card; reviews JSON-LD emitted only when real testimonials exist (none do — the honest empty state and `noindex` stay) | `testimonials/*`, `content/testimonials.ts` |
| /contact | Two columns; both phones, WhatsApp, email, address, hours (placeholder, TODO), lazy titled map with a crown-and-address fallback; form: Indian 10-digit mobile validation, honeypot, spinner + `aria-busy`, inline errors with `aria-describedby`, error toasts, success panel with the crown that takes focus | `contact/*`, `lib/validations/contact.ts`, `content/contact.ts` |
| 404 | Crown, links to Home and Collections (and Contact) | `app/not-found.tsx` |
| SEO | robots, sitemap, per-page metadata (from R1); Open Graph image — the logo on maroon — emitted with an absolute URL once `NEXT_PUBLIC_SITE_URL` is set (evidenced with a placeholder domain) | `scripts/make-og-image.py`, `public/images/brand/og-image.png`, `shared/pageMetadata.ts`, `seo-with-site-url.txt` |
| Engineering | Import cycle QuoteBasket ⇄ QuoteSheet removed; image candidate widths trimmed; QA scripts (R6 pass, import cycles, median Lighthouse runs) | `collections/QuoteBasketButton.tsx`, `next.config.mjs`, `scripts/*` |

## Evidence

| What | Where |
|---|---|
| verify, every iteration (exit 0) | `verify-iter1.log`, `verify-iter2.log`, `verify-iter3.log` |
| R6 pass — gallery, lightbox keys and swipe, form states (mocked send), 404, founders, 320px, 200% zoom, reduced motion, robots/sitemap | `r6-pass-iter1.log` (69), `r6-pass-iter2.log` (71), `r6-pass-iter3.log` (73) — all pass |
| keyboard, drawer, reduced motion, CLS (R4 script) | `keyboard-pass-iter2.log`, `keyboard-pass-iter3.log` — 0 failures |
| catalogue, alt text, pull-quote, no-price tests | `test-catalogue.log` — all pass |
| Lighthouse | `docs/lighthouse/iter1/`, `iter2/`, `iter3/` (final), `gallery-check-iter2/` (an unofficial five-run check) |
| axe | `axe.log` (iter 1), `qa2/`, `qa3/` — 0 violations, 8 routes × 2 widths, every iteration |
| contrast | `qa2/contrast.log` — 65 required pairs, 0 under their floor |
| SEO with a site URL | `seo-with-site-url.txt` |
| critiques | `critique-iter1.md`, `critique-iter2.md`, `critique-iter3.md` |
| measurements | `qa-a11y-perf-iter1.md`, `-iter2.md`, `-iter3.md` |
| graphs | `docs/graphs/final.json` / `.html` / `.report.md` (graphify), `final.architecture.json` (code-review-graph), `final.mmd`, `final.cycles.txt` / `.json` — 0 import cycles |

## Final audit checks

| Check | Result |
|---|---|
| `npm run verify` | exit 0 (`verify-iter3.log`) |
| Lighthouse mobile + desktop, /, /collections, /collections/bone-china, /contact: Perf, A11y, SEO ≥ 95 | **met** — mobile medians 96 / 99 / 96 / 98, desktop 100; A11y and SEO 100 |
| Reduced motion | content complete on 8 routes (`r6-pass`), reduced-motion captures at 390 |
| 200% zoom | no horizontal scroll on 8 routes (640 CSS px at 2×) |
| 320px | no horizontal scroll on 8 routes |
| Import cycles (code-review-graph + `import-cycles.mjs`) | 0 (one pre-existing cycle removed) |
| Every route within its First Load JS budget | yes (/founders and /testimonials 99.8 / 100 kB) |
| Screen-reader pass | **not done** (E6, E40) |
| The live map | **not seen** — egress to google.com blocked here (E49) |
| A real Web3Forms send | **not done** — placeholder key; sends mocked (O14) |
| Deployment | **not done**, as instructed |

## PRD cross-check (FR1–FR10, NFR1–NFR5)

| Req | Status | Evidence |
|---|---|---|
| FR1 Homepage: hero, trust badges, featured categories | partial | hero, stats strip, four featured collections (`iter3/home-*.png`); the PRD's trust badges await the owner's wording (O24) |
| FR2 Founders: photos, quotes, history | partial | history, timeline, three named generations (`iter3/founders-*.png`); no portraits (O40); quotes are excerpts of the story (O42) |
| FR3 Products: category grid, no pricing | pass | `iter3/collections-*.png`; price tests in `test-catalogue.log` |
| FR4 Gallery of real event setups | fail — owner | product photographs only; no event photographs exist (O13) |
| FR5 Testimonials, home + page | fail — owner | none supplied; honest empty state, `noindex` (O12) |
| FR6 Contact: form, call, WhatsApp, map | partial | all built and checked (`r6-pass-iter3.log`); needs the Web3Forms key (O14), the live map seen (E49), the hours confirmed (O43) |
| FR7 Floating WhatsApp on all pages | pass, with defect | covers content as it scrolls (O31, E59, E61) |
| FR8 Mobile bottom bar | pass | `keyboard-pass-iter3.log`; every 390 capture |
| FR9 Responsive, Lighthouse ≥ 95 | pass on Performance ≥ 95 (every route's mobile median, iteration 3); 320px and 200% zoom pass | `qa-a11y-perf-iter3.md` |
| FR10 SEO metadata on every page | pass, once `NEXT_PUBLIC_SITE_URL` is set | `seo-with-site-url.txt` |
| NFR1 Mobile-first, app-like | pass | drawer, bottom bar, lightbox swipe |
| NFR2 Load < 2 s on 3G | not met / not verified | mobile LCP 2.0–2.8 s under simulated slow 4G on localhost; needs the deployed origin (E60, E4) |
| NFR3 WCAG 2.1 AA | pass on every automated check; no screen-reader pass | axe 0, Lighthouse A11y 100, keyboard pass, contrast 65/65 |
| NFR4 Maintainable without a developer | partial | typed content files and `docs/HANDOFF.md`; changes need a redeploy, the catalogue the Python pipeline |
| NFR5 Zero infrastructure cost | open — owner | needs a host for redirects and image optimisation; Vercel Hobby is non-commercial (E54) |
