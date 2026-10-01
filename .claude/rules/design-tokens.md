---
paths:
  - "indian-hires-website/src/**/*.{ts,tsx,css}"
  - "indian-hires-website/tailwind.config.ts"
---

# Design tokens

Colour, radius, spacing scale, shadow and font families are defined in **two files
only**: the `:root` block of `src/app/globals.css` and `tailwind.config.ts`.
Components consume them as Tailwind utilities.

- Never write a raw hex, `rgb()`, `hsl()` or `oklch()` literal in `src/components` or
  `src/app`. No `bg-[#…]`, no `shadow-[…rgba(…)]`, no `style={{ color: … }}`.
- CSS variables hold **bare HSL triplets** (`46 68% 47%`), never a hex. Tailwind wraps
  them as `hsl(var(--x))`; a hex there renders as nothing, silently.
- Need a colour, gradient stop or shadow that doesn't exist? Add a named token to
  `globals.css`, expose it in `tailwind.config.ts`, then use the utility. Record its
  contrast ratios in `docs/color-system.md`.
- Stock Tailwind palette classes (`text-white`, `bg-black/40`, `text-red-500`) are not
  brand tokens. Use `cream`, `night`, `ink` and friends.
- **Scheduled gate — do this in the phase that lands the redesign tokens.** As soon as
  the tokens and the `.theme-dark` scope exist, edit `scripts/check-tokens.mjs` so stock
  `white`/`black` classes (`bg-white`, `text-black`, `border-white`, any variant or
  opacity) are **failures**, not warnings. Two exemptions only: elements inside the
  `.theme-dark` scope, and the WhatsApp button. Fix every existing offender in the same
  phase — the R0 baseline has 13 (`docs/evidence/R0/verify-baseline.log`). The phase is
  not done until `npm run verify` passes with the stricter rule.
- New colours stay inside the warm 10°–46° hue band. `#800020` is not the brand maroon.
- Type sizes, tracking and leading come from the theme scale. Arbitrary sizes such as
  `text-[11px]` need a named token once they repeat.
- One accent: gold. Do not introduce a second.

Enforced by `node scripts/check-tokens.mjs` (step 4 of `npm run verify`).

Escape hatch — only where a CSS variable is impossible (e.g. the `themeColor` meta
tag), on the same line or the line above, with a reason:

```ts
// check-tokens-ignore: meta theme-color cannot reference a CSS variable
```
