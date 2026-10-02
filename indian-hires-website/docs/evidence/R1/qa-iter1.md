# QA measurements — Phase R1, iteration 1

Measured by the `qa-a11y-perf` agent on 2026-10-02 against the **production build
(`next start`, localhost:3001)**, not a dev server. Condensed by the orchestrator from the
agent's report; raw output is in `docs/evidence/R1/iter1/audit/` (Lighthouse JSON ×44,
`axe.json`, `axe-states.json`, `keyboard.json`, `focus-indicators.json`,
`reduced-motion.json`, `no-js.json`, `slow-network.json`, `redirects.json`,
`colour-pairs.json`, screenshots of every interactive state).

Tools: lighthouse 13.5.0 · @axe-core/playwright 4.13.0 · playwright 1.63.0.

## Lighthouse — mobile (median of 3 runs; simulated 150ms RTT, 1638 kbps, 4× CPU)

| Route | Perf | A11y | BP | SEO | LCP | CLS | TBT | Target |
|---|---|---|---|---|---|---|---|---|
| `/` | 93 | 100 | 100 | 100 | 3.25s | 0.00 | 0ms | FAIL perf, LCP |
| `/collections` | 96 | 100 | 100 | 100 | 2.83s | 0.00 | 0ms | FAIL LCP |
| `/collections/bone-china` | 94 | 100 | 100 | 100 | 3.09s | 0.00 | 0ms | FAIL perf, LCP |
| `/collections/chafing-dishes` | 95 | 100 | 100 | 100 | 2.94s | 0.00 | 0ms | FAIL LCP |
| `/collections/heritage-silver` | 96 | 100 | 100 | 100 | 2.71s | 0.00 | 0ms | FAIL LCP |
| `/collections/cutlery-and-serveware` | 96 | 100 | 100 | 100 | 2.78s | 0.00 | 0ms | FAIL LCP |
| `/founders` | 98 | 100 | 100 | 100 | 2.41s | 0.00 | 0ms | ok |
| `/gallery` | 89 | 100 | 100 | 100 | 3.76s | 0.00 | 0ms | FAIL perf, LCP |
| `/testimonials` | 98 | 100 | 100 | 66 | 2.41s | 0.00 | 0ms | ok (SEO: noindex by design) |
| `/contact` | 98 | 93 | 100 | 100 | 2.41s | 0.00 | 0ms | FAIL a11y |
| 404 | 98 | 100 | 96 | 58 | 2.48s | 0.00 | 0ms | ok (noindex + 404 status) |

## Lighthouse — desktop (1 run each)

Performance 100 on all 11 routes; LCP 0.51–0.76s; CLS 0.00; TBT 0ms. Accessibility 100
except `/contact` 93. Best Practices 100 (404: 96). SEO 100 (testimonials 66, 404 58, both noindex).

## Causes identified

- `/`: the LCP element is the hero lead paragraph, held at opacity 0 by its entrance
  animation (`HomeHero.tsx:69`, ~850ms render delay).
- `/gallery`: 70 requests and 838 kB on first load; 43 images (505 kB); images served
  2× larger than their boxes; engine chunk in first load.
- Collection routes: text LCP; 22 scripts (202 kB) and 16–18 images in flight at load;
  images served 384px for 176px boxes.
- All routes: three render-blocking stylesheets (14 kB); 11 kB of legacy polyfills.
- `/contact` a11y 93: invalid `<dl>` structure (`ContactDetails.tsx`).

## First Load JS against budget

| Route | Size | Ceiling | |
|---|---|---|---|
| shared | 87.6 kB | 90 | OK |
| `/` | 114 | 185 | OK |
| `/contact` | 97.6 | 140 | OK |
| `/collections` | 114 | 110 | OVER |
| `/collections/[slug]` | 118 | 110 | OVER |
| `/gallery` | 136 | 110 | OVER |
| `/founders` | 114 | 100 | OVER |
| `/testimonials` | 108 | 100 | OVER |
| 404 | 87.8 | 100 | OK |

## axe (11 routes × 390 and 1280, plus interactive states)

- `/contact`: `definition-list` (serious ×1), `dlitem` (serious ×14).
- Every route at 1280: `region` (moderate ×1) — floating WhatsApp link outside a landmark.
- All other route/width pairs: 0 violations. Open drawer, item drawer, quote sheet,
  lightbox, pressed filter chip: 0 violations.
- Needs review: `aria-controls` on the basket and menu buttons point at ids not in the DOM
  until first opened.

## Keyboard — 100 scripted steps, 0 failures

Skip link first and working; header order matches visual order; mobile drawer, item
drawer, quote sheet and lightbox all move focus in, trap it, close on Esc and return focus;
filter chips toggle `aria-pressed`; contact form empty submit shows linked inline errors
and focuses the first invalid field. Every Tab stop shows a visible focus ring.

Findings: the skip link loses its padding when focused (110×20px, `layout.tsx:79`); at
390px some focused footer links sit under the bottom bar (WCAG 2.2, informational).

## Reduced motion — PASS on 11 routes × 2 widths

No element left hidden or translated; `document.getAnimations()` is 0; the `domMax` chunk
is never requested; drawers and lightbox open and close.

## No JavaScript — content PASS

Every route shows its full content, one `<main>`, one `<h1>`, no heading skips. Not
working without JS: mobile menu button (footer nav and bottom bar remain), filters, card
detail links, gallery lightbox, add to quote, old-URL redirects.

## Redirects — FAIL

`/products` and the five `/products/<slug>` URLs answer 308 with **no `Location` header**;
they redirect only in a browser with JavaScript.

## Slow network (4× CPU, 390px, one run each)

| Profile | Route | FCP | LCP | CLS | Transferred |
|---|---|---|---|---|---|
| Slow 3G (50 kB/s, 2000ms) | `/` | 4.98s | 5.82s | 0.0004 | 427 kB |
| Slow 3G | `/collections/bone-china` | 4.92s | 4.92s | 0.0010 | 728 kB |
| Fast 3G (180 kB/s, 562ms) | `/` | 1.53s | 2.37s | 0 | 427 kB |
| Fast 3G | `/collections/bone-china` | 1.53s | 1.53s | 0 | 639 kB |

Text is visible before the web fonts arrive (`font-display: swap`); images have blur
placeholders and reserved boxes.

## Contrast

All 25 rendered text pairs are in the allowed table; lowest 5.39. Every "tbm" row was
measured. One rule breach with a passing measurement: `gold-500` button label over candle
glow, 4.89:1.

## Not measured

A deployed origin (HTTP/2, CDN); INP; screen-reader output; a real form submission;
Lighthouse on `premium-melamine`, `regular-melamine`, `glassware`, `chat-and-snack-plates`.
