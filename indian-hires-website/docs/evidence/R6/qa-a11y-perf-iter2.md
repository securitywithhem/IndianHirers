# Phase R6 — qa-a11y-perf, iteration 2

Measured by the `qa-a11y-perf` agent on the `next start` build of HEAD 140119f
(`verify-iter2.log`), localhost, HTTP/1.1, Lighthouse's simulated slow 4G. The agent may
not write files; the orchestrator copied its output here and saved this report.

Files: `docs/lighthouse/iter2/` (every run in `lighthouse.log`, medians in
`lighthouse-summary.json`, the median run's JSON per route), `docs/lighthouse/iter2/r6-routes/`;
`docs/evidence/R6/qa2/` (axe, keyboard pass, contrast, the Playwright LCP probe, the
per-run main-thread comparison).

## Lighthouse

| Preset | Route | Perf (runs) | Median | A11y | BP | SEO | LCP median |
|---|---|---|---|---|---|---|---|
| mobile | / | 98 · 96 · 96 | 96 | 100 | 100 | 100 | 2.8 s |
| mobile | /collections | 97 · 97 · 97 | 97 | 100 | 100 | 100 | 2.6 s |
| mobile | /collections/bone-china | 95 · 99 · 96 | 96 | 100 | 100 | 100 | 2.8 s |
| mobile | /contact | 98 · 98 · 98 | 98 | 100 | 100 | 100 | 2.3 s |
| mobile | /founders | 98 · 98 · 98 | 98 | 100 | 100 | 100 | 2.46 s |
| mobile | /gallery | 90 · 97 · 86 | **90** | 100 | 100 | 100 | 3.2 s |
| mobile | /testimonials | 97 · 98 · 98 | 98 | 100 | 100 | **63** | 2.3 s |
| mobile | /collections/chafing-dishes | 95 · 96 · 96 | 96 | 100 | 100 | 100 | 2.8 s |
| desktop | /, /collections, /collections/bone-china, /contact | 100 in all 12 runs | 100 | 100 | 100 | 100 | 0.49–0.70 s |

**The brief's gate (Perf, A11y, SEO ≥ 95 on /, /collections, /collections/bone-china,
/contact, mobile and desktop) is met.** CLS is 0 and FCP ≤ 1.11 s everywhere. The
performance rule's LCP < 2.5 s is missed on /, the three collection routes and /gallery.

## Failures

**/gallery, Performance median 90 (86–97).** The LCP element is the rocks-tumbler tile,
correctly prioritised (`fetchpriority="high"`, eager, in the initial HTML; Lighthouse's
discovery checklist passes). The spread is render delay, 119–1139 ms, which follows
main-thread time on the host (failing runs 2329–2450 ms of main-thread work against
1501 ms in the passing run; script evaluation 888–1103 ms against 516 ms). /gallery is
the heaviest page: 532 KiB, 38 image requests, a 179 KB HTML document (23 KB gzipped).
Opportunities: render-blocking CSS (130–240 ms on FCP), 28 KiB image delivery,
11 KiB legacy JS in a shared chunk.

**/testimonials, SEO 63.** `is-crawlable` only: the page is `noindex, follow` while no
testimonial exists, by design. Not a gate route.

## axe, keyboard, contrast

axe: 0 violations, 8 routes × 390 and 1280px. Keyboard pass: 0 failures (skip link,
header order, drawer at 390 and 900px with trap / Esc / focus return / inert background,
reduced motion, catalogue targets, CLS 0 on / at 390). Contrast: 65 required pairs, 0
under their floor.

## Static checks

One `<main>` and one `<h1>` per route, no skipped levels; one bare `<img>`
(`FounderPortraitPhoto.tsx`, props from `next/image`); no bare `focus:`; every
`animate-` / `hover:scale` is `motion-safe:`.

## Rubric support

Item 9: "3 — 85–94" (/gallery median 90; LCP over 2.5 s on five routes; no route over
budget). Item 10: every measured clause of the 5 line met on all eight routes.

## Not measured

Desktop on the four other R6 routes; 404 and `/products*`; INP (needs field data); the
map frame (egress blocked); HTTP/2 or a CDN (needs a deployment).
