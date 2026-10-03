# Colour System — The Royal Banquet Table

Single source of truth: the `:root` block in `src/app/globals.css`.
`tailwind.config.ts` only wraps those variables in `hsl()`.
The design spec that uses these colours is `Docs/UI_UX_V2.md`.

The picture: a candle-lit banquet hall. **Ivory linen** is the page, **deep maroon**
is the wall behind a few deliberate bands, **antique gold** is the detailing.
This replaces the all-dark "Deep Oxblood" set (R0).

## Where these colours came from

Every hue was **sampled out of the brand's own assets**, not chosen by eye.

| Measured from | Result |
|---|---|
| `Docs/LOGO (TM).jpg` | maroon `#702010` — **hue 10°** |
| chafing dish photography | brass / copper — hue 30–40° |
| bone china photography | warm off-white |
| studio backdrops | warm olive-neutral, hue ~60° |

Those four measurements were taken in R0 and are unchanged. The R1 values built on
them — the maroon scale at 10–11°, the gold scale at 42–43°, the ivory scale at 40° —
were set by the owner's brief and checked for contrast, not re-sampled; they were
reviewed by eye against the logo and the gold-rim china and brass chafer photographs.

**The whole palette lives in the warm 10°–46° band, because that is where the
business actually sits.** Nothing here is magenta-leaning; keep new colours in band.
The only value outside it is WhatsApp green, which belongs to WhatsApp.

Two wrong maroons have been proposed and rejected:

- `Docs/UI_UX.md` v1 specified `#800020` — hue 345, a cool magenta-crimson. **That is
  not the logo.** A build that derived its surfaces from 345 read visibly off-brand.
- The R1 brief listed `#7A1B2D` / `#5C1423` / `#2B0A10` (hue 345–350). The owner
  confirmed these are replaced by the logo's own family at hue 10–11°.

## Tokens

### Maroon — the wall
| Token | HSL | Hex | Role |
|---|---|---|---|
| `maroon-950` | `11 62% 10%` | `#290F0A` | Deepest wall: footer, hero base, darkest band |
| `maroon-800` | `11 72% 19%` | `#531A0E` | Primary dark surface (`background` inside `.theme-dark`); primary-button hover on ivory |
| `maroon-700` | `10 75% 25%` | `#702010` | **The logo mark exactly.** Headings, links, primary button and focus ring on ivory; card surface inside `.theme-dark` |

### Gold — the only accent
| Token | HSL | Hex | Role |
|---|---|---|---|
| `gold-700` | `42 66% 28%` | `#775A18` | Gold as **text on ivory** (eyebrows, small labels). The brief's `#8A6A1F` reached only 4.26 on `ivory-100`, so it was darkened |
| `gold-500` | `42 53% 54%` | `#C8A34C` | Antique gold: rules, hairlines, ornament, fills; text **only on maroon** |
| `gold-300` | `43 64% 69%` | `#E3C67D` | Highlight, hover on gold fills, gold text and focus ring on maroon |

One accent used sparingly is most of what separates this from a template.
There is no second accent; the brief's optional sage green was dropped.

### Ivory — the linen
| Token | HSL | Hex | Role |
|---|---|---|---|
| `ivory-50` | `40 65% 95%` | `#FBF5EA` | Page background, cards, all primary type on maroon |
| `ivory-100` | `40 53% 90%` | `#F3EAD8` | Alternate section background, quiet fills |
| `ivory-300` | `40 32% 78%` | `#D9CDB5` | Quiet structural rule on ivory (decorative); secondary text on maroon |

### Espresso — type on ivory
| Token | HSL | Hex | Role |
|---|---|---|---|
| `espresso-900` | `10 25% 9%` | `#1D1311` | Body text |
| `espresso-600` | `16 14% 32%` | `#5D4C46` | Secondary text, captions, placeholders |

Never pure `#000` and never neutral grey — the darkest type is a brown-black at hue 10°.

### Functional
| Token | HSL | Hex | Role |
|---|---|---|---|
| `whatsapp` | `142 70% 49%` | `#25D466` | WhatsApp buttons only; always dark type on it |
| `danger` | `10 72% 36%` | `#9E301A` | Form error text and invalid-field border, on ivory only |
| `control-border` | `34 22% 42%` | `#836E54` | Input / textarea / chip boundary on ivory |

`danger` was first proposed at hue 4° (`4 72% 36%`, `#9E231A`). It was moved to hue 10°
so that every token except `whatsapp` sits inside the 10°–46° band. Errors never rely on
the colour alone: they are always a text message linked to the field.

### Semantic roles

Components use these, not the scales. `.theme-dark` re-maps them; `.theme-light`
restores the ivory values for a panel nested inside a maroon band.

| Role (utility) | Ivory (default) | Inside `.theme-dark` |
|---|---|---|
| `background` | `ivory-50` | `maroon-800` |
| `foreground` | `espresso-900` | `ivory-50` |
| `card` / `card-foreground` | `ivory-50` / `espresso-900` | `maroon-700` / `ivory-50` |
| `popover` / `popover-foreground` | `ivory-50` / `espresso-900` | `maroon-950` / `ivory-50` |
| `primary` / `primary-foreground` | `maroon-700` / `ivory-50` | `gold-500` / `maroon-950` |
| `primary-hover` | `maroon-800` | `gold-300` |
| `secondary` / `secondary-foreground` | `ivory-100` / `maroon-700` | `maroon-700` / `ivory-50` |
| `muted` / `muted-foreground` | `ivory-100` / `espresso-600` | `maroon-950` / `ivory-300` |
| `accent` / `accent-foreground` | `gold-500` / `maroon-950` | `gold-500` / `maroon-950` |
| `destructive` / `destructive-foreground` | `danger` / `ivory-50` | `gold-300` / `maroon-950` (forms stay on ivory) |
| `border` | `ivory-300` | `maroon-700` |
| `input` | `control-border` | `gold-500` |
| `ring` | `maroon-700` | `gold-300` |
| `heading` | `maroon-700` | `ivory-50` |
| `kicker` | `gold-700` | `gold-300` |
| `link` | `maroon-700` | `gold-300` |
| `hairline` | `gold-500` | `gold-500` |

### Composite tokens

| Token | Utility | Made of | Use |
|---|---|---|---|
| `--gradient-gold` | `bg-gold-gradient` | `gold-700 → gold-500 → gold-300 → gold-500`, 135° | Decorative fills only. **Never carries type.** |
| `--gradient-gold-sheen` | `.gold-sheen` | `gold-500 → gold-300 → gold-500`, 135° | Gold fill that carries `maroon-950` type; display text on maroon |
| `--sheen-sweep` | `.btn-sheen` (`bg-sheen-sweep`) | 105° band of `gold-300`, 0 → 30% → 0 | Crosses a filled button on hover. Under its peak `ivory-50` on `maroon-700` is 5.58 |
| `--glow-candle` | `.candle-glow` | radial `gold-500` at 18% → 0 | Behind a heading in a maroon band |
| `--texture-linen` | `.surface-linen` | two `gold-700` hairline grids at 3–4% | Ivory surfaces only |
| `--scrim-hero` | `.hero-scrim` | `maroon-950` at 62–94% | Over the hero photograph |

## Page rhythm

The page is ivory. Maroon appears in **deliberate bands only**: the hero, at most one
mid-page band, the closing call to action, and the footer. Random light/dark alternation
is what made an earlier build feel like several websites stitched together, so the
order is fixed:

```
header        transparent over the hero → ivory + blur + gold hairline after 80px
hero          maroon-950 + photograph + hero-scrim      .theme-dark
…             ivory-50   (surface-linen allowed)
…             ivory-100
…             ivory-50
mid band      maroon-800 + candle-glow                  .theme-dark   (one per page, optional)
…             ivory-50 / ivory-100, alternating
closing CTA   maroon-800                                .theme-dark
footer        maroon-950                                .theme-dark
```

Inner pages open with a compact maroon-800 page header in place of the hero, so the
transparent header always starts over maroon.

## Three hard constraints

1. **Gold fills take dark type.** `ivory-50` on `gold-500` is **2.21:1**;
   `maroon-950` on `gold-500` is **7.48:1**. Any gold fill pairs with
   `text-maroon-950` (inside `.theme-dark`: `bg-primary text-primary-foreground`).
   The four-stop `bg-gold-gradient` takes no type at all — its `gold-700` end fails.
2. **Maroon is a surface, not body text, on dark.** `maroon-700` on `maroon-950` is
   about 1.6:1. On maroon, text is `ivory-50`, `ivory-300`, `gold-300` or `gold-500`.
   (On ivory the reverse holds: `maroon-700` is the heading and link colour at 10.20:1,
   and gold is text only as `gold-700`.)
3. **Never put a hex in these variables.** Tailwind wraps them as
   `hsl(var(--x))`; a hex produces invalid CSS and the utility silently renders
   nothing. That bug once left the sticky header fully transparent, so page
   content collided with the nav. Triplets also enable alpha (`border-hairline/40`).

## Measured contrast

Every row is computed from the token values (R2): `node scripts/contrast.mjs --table`
prints the full table — it is reproduced in `Docs/UI_UX_V2.md` §3 — and `--check` exits 1
if any required pair is under its floor (62 pairs, 0 failures). Layered surfaces are
measured at their worst point.

### On ivory
| Pair | Ratio | Status | Grade |
|---|---|---|---|
| espresso-900 on ivory-50 | 16.76 | measured | AA body |
| espresso-900 on ivory-100 | 15.23 | measured | AA body |
| espresso-600 on ivory-50 | 7.45 | measured | AA body |
| espresso-600 on ivory-100 | 6.77 | measured | AA body |
| maroon-700 on ivory-50 | 10.20 | measured | AA body |
| maroon-700 on ivory-100 | 9.27 | measured | AA body |
| gold-700 on ivory-50 | 5.93 | measured | AA body |
| gold-700 on ivory-100 | 5.39 | measured | AA body |
| ivory-50 on maroon-700 (primary button) | 10.20 | measured | AA body |
| ivory-50 on maroon-800 (primary button, hover) | 12.65 | measured | AA body |
| danger on ivory-50 | 6.70 | measured | AA body |
| danger on ivory-100 | 6.09 | measured | AA body |
| ivory-50 on danger | 6.70 | measured | AA body |
| control-border on ivory-50 | 4.47 | measured | UI boundary (≥ 3) |
| control-border on ivory-100 | 4.06 | measured | UI boundary (≥ 3) |
| gold-500 on ivory-50 | 2.21 | measured | **lines and large shapes only — never text** |
| ivory-300 on ivory-50 | 1.45 | measured | decorative rule, no requirement |

### On maroon
| Pair | Ratio | Status | Grade |
|---|---|---|---|
| ivory-50 on maroon-950 | 16.51 | measured | AA body |
| ivory-50 on maroon-800 | 12.65 | measured | AA body |
| ivory-50 on maroon-700 | 10.20 | measured | AA body |
| ivory-300 on maroon-950 | 11.39 | measured | AA body |
| ivory-300 on maroon-800 | 8.73 | measured | AA body |
| ivory-300 on maroon-700 | 7.03 | measured | AA body |
| gold-300 on maroon-950 | 10.77 | measured | AA body |
| gold-300 on maroon-800 | 8.26 | measured | AA body |
| gold-300 on maroon-700 | 6.65 | measured | AA body |
| gold-500 on maroon-950 | 7.48 | measured | AA body |
| gold-500 on maroon-800 | 5.74 | measured | AA body |
| gold-500 on maroon-700 | 4.62 | measured | AA body, ≥ 16px only — little headroom |
| maroon-950 on gold-500 (gold button) | 7.48 | measured | AA body |
| maroon-950 on gold-300 (gold button, hover) | 10.77 | measured | AA body |

### Special surfaces
| Pair | Ratio | Status | Note |
|---|---|---|---|
| espresso-900 on whatsapp | 9.30 | measured | the only type colour on WhatsApp green |
| ivory-50 on hero-scrim, worst case (62% maroon-950 over a white pixel) | 4.70 | measured | 0.2 of headroom — never lighten the scrim |
| gold-300 on hero-scrim at ≥ 78% over a white pixel | 5.43 | measured | lower 40% of the hero only |
| ivory-50 on candle-glow peak over maroon-800 | 9.31 | measured | |
| ivory-300 on candle-glow peak over maroon-800 | 6.42 | measured | |
| gold-300 on candle-glow peak over maroon-800 | 6.07 | measured | |
| gold-500 on candle-glow peak over maroon-800 | 4.22 | measured | **not allowed as text over the glow** (icons and lines only) |
| ivory-50 / ivory-300 / gold-300 on candle-glow peak over maroon-950 | 12.08 / 8.33 / 7.88 | measured | the hero, and the footer's top edge (R4) |
| gold-500 icons on candle-glow peak over maroon-950 | 5.47 | measured | footer contact icons (UI, floor 3:1) |
| gold-700 edge of the gold button on ivory-50 / the solid header | 5.93 / 4.83 | measured | the button's boundary where its fill alone is 2.21 (R4) |
| espresso-600 on surface-linen over ivory-100 | 6.18 | measured | at a crossing of the weave; it costs up to 0.6 |
| gold-700 on surface-linen over ivory-100 | 4.92 | measured | at a crossing of the weave — the thinnest text pair on ivory |
| ivory-50 on a primary button under the sheen's peak (maroon-700 / maroon-800) | 5.58 / 6.41 | measured | `--sheen-sweep` peaks at 30% gold-300 |
| maroon-950 on `::selection` over maroon-950 / maroon-800 / maroon-700 | 5.19 / 5.65 / 5.95 | measured | gold-300 at 65%; 12.57 over ivory-50 |
| espresso-900 / maroon-700 on the solid header (ivory-50 at 90%) over maroon-950 | 13.66 / 8.31 | measured | worst case behind the header |
| espresso-900 / maroon-700 on the mobile bottom bar (ivory-50 at 95%) over maroon-950 | 15.16 / 9.22 | measured | worst case behind the bar |

### Never use
| Pair | Ratio | |
|---|---|---|
| ivory-50 on gold-500 | 2.21 | **fail** |
| gold-500 as text on ivory-50 | 2.21 | **fail** |
| gold-300 as text on ivory-50 | 1.53 | **fail** |
| ivory-50 or white on whatsapp | 1.80 | **fail** |
| gold-700 on maroon-950 | 2.79 | **fail** (and any type on `bg-gold-gradient`) |
| maroon-700 on maroon-950 | 1.62 | **fail** |
| danger on any maroon | 1.89 on maroon-800 | **fail** — forms stay on ivory |

To re-measure a pair: `node scripts/contrast.mjs <fg> <bg> [<fg> <bg> …]`, for example
`node scripts/contrast.mjs ivory-300 maroon-800 danger ivory-50`.

## Deprecated names

`cream`, `text` (→ `ivory-50`), `ink` (→ `espresso-900`), `night` (→ `maroon-950`),
`surface`, `surface-2` (→ `maroon-800`), `maroon` (→ `maroon-700`), `maroon-deep`,
`maroon-dark` (→ `maroon-800`), `gold`, `gold-deep` (→ `gold-500`), `gold-light`
(→ `gold-300`). They are Tailwind aliases only — there is no CSS variable behind them
any more — kept so un-rewritten pages compile. Remove them when Wave 3 is complete.

## Motion

Motion is specified in `.claude/rules/motion.md` and summarised in `Docs/UI_UX_V2.md`.
The library is `motion` (`motion/react`); `framer-motion` and `gsap` are legacy.
