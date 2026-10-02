---
paths:
  - "indian-hires-website/src/**/*.{ts,tsx,css}"
---

# Motion

Library: `motion` (`import { … } from "motion/react"`), loaded through `LazyMotion`
with `domAnimation`. No AOS. No new `framer-motion` or `gsap` imports — those two are
legacy and scheduled for removal. Shared primitives live in `src/components/motion/`;
pages compose primitives, they do not hand-roll animation values.

## Durations

| Use | Duration |
|---|---|
| Press / tap feedback | 100–150ms |
| Hover, focus, colour change | 150–200ms |
| Small entrance (fade, 8–16px rise) | 300–400ms |
| Large entrance, drawer, overlay | 400–600ms |
| Hero / signature moment (once per page) | 600–900ms |
| Stagger between siblings | 40–80ms, capped at 6 items |

Exits run about 25% faster than their entrance. Nothing over 900ms.

## Easings

| Name | Curve | Use |
|---|---|---|
| ease-out (default) | `cubic-bezier(0.23, 1, 0.32, 1)` | anything entering or responding |
| ease-in-out | `cubic-bezier(0.65, 0, 0.35, 1)` | elements moving on screen |
| linear | `linear` | scroll-scrubbed motion only |

No `ease-in` on entrances. No bounce or elastic — it reads as playful, not dignified.

## Rules

- **Animate `transform` and `opacity` only.** Never width, height, top, left, margin,
  padding, box-shadow or filter. No layout-thrashing: no reading layout
  (`offsetWidth`, `getBoundingClientRect`) inside an animation frame or scroll handler.
- **Reduced motion is mandatory.** Gate on `src/lib/useMotionPreference.ts` and render
  a separate static branch, so no observer or scroll listener mounts at all. Opacity
  fades ≤ 200ms may remain; movement, parallax, pinning and loops may not. Tailwind
  transforms use `motion-safe:`.
- SSR and first paint show the final, static state. Content is never hidden waiting
  for JavaScript.
- Entrances play once (`viewport={{ once: true }}`). Never start from `scale(0)`;
  0.92–0.97 is the floor.
- No scroll hijacking, no smooth-scroll libraries, no pinned sections on mobile.
- No infinite loops except a purely decorative opacity pulse, off under reduced motion.
- **Approved exceptions (R1, owner's brief) — these three only:** the crown ornament's one-time self-draw (`stroke-dashoffset` 1 → 0, paint only, no layout; `crown-draw`), and the hero photograph's one-shot 20s Ken Burns (`scale` 1 → 1.08, plays once, never loops; `animate-ken-burns`) and the floating WhatsApp button's pulse ring on a 6s cycle (`transform` + `opacity`; `animate-whatsapp-pulse`); all are off under reduced motion (`motion-safe:` or a `prefers-reduced-motion` media query).
- Every animation must answer "what does this help the visitor understand?" If the
  answer is "nothing", remove it.
- `will-change` only on the element being animated, only while it animates.

## Recorded clarifications (R1)

- **Engine scope.** Scroll reveals, counters, the page fade and drawers are CSS-driven
  (`@/components/motion`) and load no animation library. `motion` is loaded only inside
  `MotionMaxProvider` (`@/components/motion/engine`, async `domMax`) around the catalogue
  grid and the gallery lightbox, because layout animation and `layoutId` need `domMax`.
  It is never mounted in the root layout.
- **Hero entrance (owner's brief).** The home `<h1>` lines may enter by a CSS mask
  slide-up and the eyebrow may fade in, starting at first paint, ≤ 900ms in total. The
  lead paragraph and the hero's calls to action are painted at first paint and never
  wait on an entrance. The mobile bottom bar may slide up 1.2s after load.
- **Button sheen (owner's brief, R2).** A filled button (`default`, `gold`) may send one
  band of gold light across itself on hover or keyboard focus: a pseudo-element's
  `transform`, 600ms, `ease-royal`, once per hover (`.btn-sheen`). It sits outside the
  150–200ms hover row, which still applies to the button's colour. Absent under reduced
  motion. The label stays ≥ 5.58:1 under the band's peak.
- **Reduced-motion safety net (R2).** `globals.css` ends with a
  `prefers-reduced-motion: reduce` block that cuts every animation and transition to a
  single frame, stops loops and turns off smooth scrolling. It is a net, not the gate:
  each animation must still be written `motion-safe:` or behind a primitive. With the net
  in place the permitted ≤ 200ms opacity fades are instant under reduced motion.
- **Card hover (owner's brief).** The card image zoom runs 700ms (`duration-zoom`, scale
  1.04) and the card lift 350ms; both are `motion-safe:` and outside the 150–200ms hover
  row, which still applies to colour and focus changes.
