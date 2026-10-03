# Phase R6 — qa-a11y-perf, iteration 1

Measured by the `qa-a11y-perf` agent (read + bash; it may not write files, so the
orchestrator saved its report and copied its output into the repo). Server: `next start`
on :3001, the iteration-1 build of 07:32:28 (`verify-iter1.log`). These numbers predate
the iteration-2 source changes. Lighthouse 13.5.0, axe-core 4.13.0, Chromium
`/opt/pw-browsers/chromium`. Localhost over HTTP/1.1 with simulated throttling (E4).

Files: `docs/lighthouse/iter1/lighthouse.log` and `r6-routes/lighthouse.log` (every run),
`lighthouse-summary.json` (medians), one JSON per route and preset (the median run);
`docs/evidence/R6/axe.log`, `docs/evidence/R6/axe/axe.json`.

## Lighthouse — gate routes, 3 runs each

| Preset | Route | Perf (runs) | Median | A11y | BP | SEO | LCP (runs) | CLS |
|---|---|---|---|---|---|---|---|---|
| mobile | / | 96 · 98 · 98 | 98 | 100 | 100 | 100 | 2.71 · 2.33 · 2.42 s | 0 |
| mobile | /collections | 98 · 96 · 98 | 98 | 100 | 100 | 100 | 2.42 · 2.67 · 2.41 s | 0 |
| mobile | /collections/bone-china | 95 · 95 · 95 | **95** | 100 | 100 | 100 | 2.92 · 2.92 · 2.86 s | 0 |
| mobile | /contact | 98 · 99 · 98 | 98 | 100 | 100 | 100 | 2.35 · 2.24 · 2.34 s | 0 |
| desktop | all four | 100 every run | 100 | 100 | 100 | 100 | 0.50–0.65 s | 0 |

Gates (Perf, A11y, SEO ≥ 95) are met on all four routes, mobile and desktop.
bone-china is at 95 with no margin.

## Lighthouse — other R6 routes, mobile, 3 runs

| Route | Perf (runs) | Median | A11y | BP | SEO | LCP (runs) |
|---|---|---|---|---|---|---|
| /founders | 97 · 98 · 98 | 98 | 100 | 100 | 100 | 2.51 · 2.38 · 2.46 s |
| /gallery | 93 · 95 · 93 | **93** | 100 | 100 | 100 | 3.01 · 2.92 · 3.27 s |
| /testimonials | 98 · 98 · 98 | 98 | 100 | 100 | **66** | 2.29 · 2.34 · 2.28 s |

## axe

0 violations on /, /collections, /collections/bone-china, /collections/chafing-dishes,
/founders, /gallery, /testimonials and /contact, at 390 and 1280px (wcag2a, wcag2aa,
wcag21a, wcag21aa, best-practice).

## Failure analysis

**/gallery, Performance 93, LCP 2.9–3.3 s, consistent across runs.** The LCP element is
`glassware/rocks-tumbler.webp` (320w), `loading="lazy"`, no fetch priority: in the
two-column masonry it heads column 2 at 182×242, taller than the one `priority` tile
(index 0, 182×182, `src/app/gallery/page.tsx` `priorityIndex={0}`). Found with
Playwright; Lighthouse's JSON does not name the node, but run 3's
`lcp-discovery-insight` reports `priorityHinted: false, eagerlyLoaded: false`. Other
opportunities: two render-blocking stylesheets (11 KiB + 3 KiB, est. 90–130 ms), 28 KiB
image delivery, 11 KiB legacy JS in a shared chunk.

**/testimonials, SEO 66.** The one failing audit is `is-crawlable`: the page is
`noindex, follow` by design while it has no testimonials
(`src/app/testimonials/page.tsx`, `pageMetadata.ts`). Not one of the brief's four gate
routes.

**/collections/bone-china, 95.** The LCP image is correctly prioritised (fetchpriority
high, eager). Render delay 143–153 ms; the same render-blocking CSS opportunity.

**/contact.** The Google Maps request fails here (status −1, egress blocked), so the
scores exclude whatever the map frame costs on a real network. `errors-in-console` passed.

## Rubric support

- Item 9: the numbers match the 3 line ("85–94") because of /gallery's 93, and LCP is
  above 2.5 s on /gallery and bone-china. CLS is 0 everywhere.
- Item 10: the measured parts of the 5 line are met — Lighthouse Accessibility 100 on all
  seven routes tested, zero axe violations on eight routes × two widths.

## Static checks

One bare `<img>`, intentional (`FounderPortraitPhoto.tsx`, `next/image` props from the
server). One `<main>`. No bare `focus:` classes. No ungated animation classes. Three
product WebPs over 200 kB (`golden-rim` 231 kB, `blue-gold-border` 216 kB, `emerald-gold`
207 kB — the 1200px masters; the site serves resized variants).

## Not measured

Current HEAD (rebuild not allowed while the server ran); desktop on /founders,
/gallery, /testimonials; the map frame's cost (egress blocked); keyboard,
reduced-motion and contrast (outside the task).
