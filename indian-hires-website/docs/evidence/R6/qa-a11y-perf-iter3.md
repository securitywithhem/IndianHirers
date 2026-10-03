# Phase R6 — qa-a11y-perf, iteration 3 (final build)

Measured by the `qa-a11y-perf` agent on the `next start` build of HEAD d8ff356
(`verify-iter3.log`; no source changed after the build), localhost, HTTP/1.1,
Lighthouse 13.5.0 simulated slow 4G, mobile 412×823 at 1.75 DPR. Production-server
numbers. The agent may not write files; the orchestrator copied its output here.

Files: `docs/lighthouse/iter3/` (gate routes), `iter3/r6-routes/`, `iter3/gallery/`
(five runs) — every run in each `lighthouse.log`, medians in `lighthouse-summary.json`,
the median run's JSON per route; `docs/evidence/R6/qa3/` (axe, the LCP probe, tile
positions, structure checks).

## Lighthouse

| Preset | Route | Perf runs | Median | A11y | BP | SEO | LCP (median run) | CLS |
|---|---|---|---|---|---|---|---|---|
| mobile | / | 95 · 96 · 96 | **96** | 100 | 100 | 100 | 2.8 s | 0 |
| mobile | /collections | 99 · 99 · 97 | **99** | 100 | 100 | 100 | 2.0 s | 0 |
| mobile | /collections/bone-china | 96 · 96 · 95 | **96** | 100 | 100 | 100 | 2.8 s | 0 |
| mobile | /contact | 98 · 98 · 98 | **98** | 100 | 100 | 100 | 2.3 s | 0 |
| desktop | /, /collections, /collections/bone-china, /contact | 100 in all 12 runs | **100** | 100 | 100 | 100 | 0.5–0.7 s | 0 |
| mobile | /founders | 98 · 98 · 98 | **98** | 100 | 100 | 100 | 2.4 s | 0 |
| mobile | /testimonials | 98 · 98 · 98 | **98** | 100 | 100 | **63** | 2.3 s | 0 |
| mobile | /collections/chafing-dishes | 99 · 96 · 96 | **96** | 100 | 100 | 100 | 2.8 s | 0 |
| mobile | /gallery (5 runs) | 98 · 95 · 98 · 96 · 93 | **96** | 100 | 100 | 100 | 2.8 s | 0 |

- **The brief's gate is met** — Performance, Accessibility and SEO ≥ 95 on /, /collections,
  /collections/bone-china and /contact, mobile and desktop — in every median and every run
  (lowest single run 95).
- **Every measured route's mobile median is ≥ 95** (iteration 2: /gallery 90).
- **/testimonials SEO 63** is `noindex` by design while it has no testimonial (not a gate route).
- **LCP over 2.5 s** (2.8 s median) on /, bone-china, chafing-dishes and /gallery. CLS 0
  everywhere. Every route within its First Load JS budget (`verify-iter3.log`).

## /gallery

The five runs (93–98) do not follow main-thread time this time (the 93 had the least),
nor requests before LCP; the measured LCP subparts are the same in every run and the
discovery checklist passes. A Playwright probe (4× CPU, 8 loads) found the LCP to be the
`golden-rim` tile (priority, eager) in 6 of 8 loads, and in 2 the blur-placeholder SVG of
a lazy tile far below the fold — an unconfirmed lead for the spread (a saved trace would
show which candidate each Lighthouse run took).

## axe and structure

axe: 0 violations, 8 routes × 390 and 1280px. One `<main>` and one `<h1>` per route, no
skipped levels, no `img[srcset]` without `sizes`. One bare `<img>`
(`FounderPortraitPhoto.tsx`, props from `next/image`'s `getImgProps`).

## Rubric support

Item 9: the "3 — 85–94" line no longer applies (every mobile median ≥ 95, every route in
budget); the 5 line is not fully met (LCP 2.8 s on four routes). Item 10: every measured
clause of the 5 line met. The scores are the reviewer's.

## Not measured

Desktop on the four non-gate routes; 404, `/products*`; INP (field data); the map frame
(egress blocked); HTTP/2 or a CDN (needs a deployment); the LCP candidate per Lighthouse
run (needs `--save-assets`).
