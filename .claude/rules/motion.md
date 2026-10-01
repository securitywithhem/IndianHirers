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
- Every animation must answer "what does this help the visitor understand?" If the
  answer is "nothing", remove it.
- `will-change` only on the element being animated, only while it animates.
