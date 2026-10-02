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
- CSS variables hold **bare HSL triplets** (`42 53% 54%`), never a hex. Tailwind wraps
  them as `hsl(var(--x))`; a hex there renders as nothing, silently.
- Need a colour, gradient stop or shadow that doesn't exist? Add a named token to
  `globals.css`, expose it in `tailwind.config.ts`, then use the utility. Record its
  contrast ratios in `docs/color-system.md`.
- Stock Tailwind palette classes (`text-white`, `bg-black/40`, `text-red-500`) are not
  brand tokens. Use the semantic roles (`background`, `foreground`, `card`, `muted`,
  `muted-foreground`, `primary`, `heading`, `kicker`, `link`, `hairline`, `border`,
  `input`, `ring`) or, where a fixed colour is meant, the scales (`maroon-950/800/700`,
  `gold-700/500/300`, `ivory-50/100/300`, `espresso-900/600`). The full list and the
  recipes are in `Docs/UI_UX_V2.md`.
- The page is ivory. A maroon band carries the **`.theme-dark`** class, which re-maps the
  semantic roles to ivory-and-gold-on-maroon; an ivory panel inside a maroon band carries
  `.theme-light`. Write the semantic utilities and let the scope pick the colour.
- The old names `cream`, `night`, `surface`, `surface-2`, `ink`, `maroon`, `maroon-deep`,
  `maroon-dark`, `gold`, `gold-light`, `gold-deep`, `text-text` and `font-heading` are
  **deprecated aliases**. They exist only so un-rewritten pages compile; never use them
  in new code, and remove each one when the last page using it is rewritten.
- **Gate (live since R1).** `scripts/check-tokens.mjs` **fails** on stock `white`/`black`
  classes (`bg-white`, `text-black`, `border-white/20`, any variant or opacity). The
  script cannot see the `.theme-dark` scope, so the only exemption is the
  `check-tokens-ignore` marker below, with a reason. Every existing offender is fixed
  in the phase that rewrites its page — the R0 baseline has 13
  (`docs/evidence/R0/verify-baseline.log`). A phase is not done until `npm run verify`
  passes with this rule.
- New colours stay inside the warm 10°–46° hue band. `#800020` is not the brand maroon.
- Type comes from the `.type-*` classes (`type-display`, `type-h2`, `type-h3`, `type-h4`,
  `type-lead`, `type-body`, `type-small`, `type-caption`, `type-eyebrow`, `type-button`,
  `type-stat`). Do not pass the raw `text-display` / `text-h2` size utilities through
  `cn()` next to a text colour — tailwind-merge reads an unknown `text-*` as a colour and
  drops one of them. Arbitrary sizes such as `text-[11px]` need a named token once they
  repeat.
- One accent: gold. Do not introduce a second.

Enforced by `node scripts/check-tokens.mjs` (step 4 of `npm run verify`).

Escape hatch — only where a CSS variable is impossible (e.g. the `themeColor` meta
tag), on the same line or the line above, with a reason:

```ts
// check-tokens-ignore: meta theme-color cannot reference a CSS variable
```
