---
paths:
  - "indian-hires-website/src/**/*.{ts,tsx,css}"
  - "indian-hires-website/next.config.mjs"
---

# Performance

Targets: Lighthouse Performance ≥ 95 (mobile), LCP < 2.5s, CLS < 0.05, INP < 200ms,
FCP < 1.5s.

## Images

- Always `next/image`. Never a bare `<img>` or a CSS `background-image` for content.
- Every image has intrinsic `width` and `height` (or `fill` inside a box with a fixed
  `aspect-*`), **and** a `sizes` attribute that matches its real rendered width at each
  breakpoint.
- `priority` only on the single LCP image of a route. Everything below the fold stays
  lazy (the default).
- Use `placeholder="blur"` with the `blurDataURL` from the content file.
- Sources are local WebP under `public/images/`. No remote images.
- Stay static-export friendly: no feature that needs a running server.

## Fonts

- `next/font` only, declared once in `src/app/fonts.ts` and applied in `src/app/layout.tsx`, exposed as CSS variables.
  No `<link>` to Google Fonts, no `@import url()`, no `@font-face` by hand.
- At most two families; load only the weights that are used; `display: "swap"`.

## No layout shift

- Reserve space for every image, embed, map iframe and late-loading block.
- The header's height must not change the document flow when it changes state.
- Nothing is injected above existing content after first paint.
- Reduced-motion and animated branches of a component occupy the same box.

## JavaScript

- Server Components by default. Add `"use client"` only for state, effects or event
  handlers, and push it down to the smallest leaf.
- Lazy-load below-the-fold client components with `next/dynamic`; the map iframe uses
  `loading="lazy"`.
- Animation code is loaded through `LazyMotion`; no animation library in the shared chunk.
- No new dependency without asking. One library per job.

## Budget — First Load JS per route, from `next build` output

| Route | Ceiling | Baseline (R0) |
|---|---|---|
| Shared by all | 105 kB | 87.3 kB |
| `/` | 185 kB, target ≤ 160 kB | 182 kB |
| `/contact` | 140 kB | 138 kB |
| `/collections`, `/collections/[slug]`, `/gallery` (R0: `/products`, `/products/[slug]`) | 120 kB | 101 kB |
| `/founders`, `/testimonials`, 404 | 110 kB | 87.5–96.2 kB |

A route over its ceiling fails the phase. Paste the build table into the phase's
evidence so the comparison is visible. `scripts/check-budgets.mjs` enforces these in CI.

The shared, collection, gallery, founders, testimonials and 404 ceilings rose by 10–15 kB
with the move to Next 15, which added that much framework code to every route (shared
87.6 → 103 kB) to close its security advisories. Its Lighthouse effect is not settled:
level locally, lower on `/` and `/gallery` in CI (`docs/OPEN_ISSUES.md`, CI/CD). That
headroom is the framework's, not for features.
