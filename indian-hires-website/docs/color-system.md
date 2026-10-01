# Colour System — Deep Oxblood

Single source of truth: the `:root` block in `src/app/globals.css`.
`tailwind.config.ts` only wraps those variables in `hsl()`.

## Where these colours came from

Every hue was **sampled out of the brand's own assets**, not chosen by eye.

| Measured from | Result |
|---|---|
| `Docs/LOGO (TM).jpg` | maroon `#702010` — **hue 10°** |
| chafing dish photography | brass / copper — hue 30–40° |
| bone china photography | warm off-white |
| studio backdrops | warm olive-neutral, hue ~60° |

**The whole palette lives in the warm 10°–46° band, because that is where the
business actually sits.** Nothing here is magenta-leaning; keep new colours in
band.

`Docs/UI_UX.md` originally specified maroon as `#800020` — hue 345, a cool
magenta-crimson. **That is not the logo.** A build that derived its entire
surface family from 345 read visibly off-brand. That spec file has been
corrected; this document is authoritative.

## Tokens

### Surfaces — one warm brown-black family
| Token | HSL | Hex | Role |
|---|---|---|---|
| `night` / `background` | `14 30% 7%` | `#170F0C` | Base canvas |
| `surface` | `12 32% 11%` | `#251713` | Alternating band |
| `surface-2` | `12 30% 16%` | `#35211D` | Cards, raised panels |
| `border` | `36 25% 22%` | `#463B2A` | Warm hairlines, never neutral grey |

Never pure `#000` and never neutral grey — the base is brown-black at hue 14°,
inside the logo's own family.

### Brand reds
| Token | HSL | Hex | Role |
|---|---|---|---|
| `maroon` | `10 75% 25%` | `#702010` | The logo mark exactly. CTA band |
| `maroon-deep` | `11 78% 16%` | `#491509` | Hero, footer, type on gold fills |

### Accent — gold only
| Token | HSL | Hex | Role |
|---|---|---|---|
| `gold` | `46 68% 47%` | `#C9A326` | Eyebrows, hairlines, small caps, fills |
| `gold-light` | `44 58% 74%` | `#E3CF96` | Hover, ledger numerals |

One accent used sparingly is most of what separates this from a template.
Resist adding a second.

### Type
| Token | HSL | Hex | Role |
|---|---|---|---|
| `cream` | `36 48% 94%` | `#F7F1E8` | All type |
| `ink` | `14 30% 7%` | `#170F0C` | Dark type, only ever on a gold fill |

## Page rhythm

Sections step through the dark scale; the page never flips to a light band.
Random light/dark alternation is exactly what made an earlier build feel like
several different websites stitched together.

```
hero        maroon-deep   ← the one red-lit band, with the china
ledger      surface       ← hairline-ruled facts
about       background
the range   surface
crest       maroon-deep
closing CTA maroon        ← strongest red, the close
footer      maroon-deep
```

## Three hard constraints

1. **Gold fills take dark type.** `cream` on `gold` is **2.31:1**;
   `maroon-deep` on `gold` is **6.32:1**. Any `bg-gold` pairs with
   `text-maroon-deep`.
2. **Maroon is a surface, not body text.** `maroon` on `night` is ~1.8:1.
   Headings are `text-cream`; small caps and links are `text-gold`.
3. **Never put a hex in these variables.** Tailwind wraps them as
   `hsl(var(--x))`; a hex produces invalid CSS and the utility silently renders
   nothing. That bug once left the sticky header fully transparent, so page
   content collided with the nav. Triplets also enable alpha (`bg-background/85`).

## Measured contrast

| Pair | Ratio | AA body |
|---|---|---|
| cream on night | 16.86 | pass |
| cream on surface | 15.50 | pass |
| cream on surface-2 | 13.46 | pass |
| cream on maroon-deep | 13.48 | pass |
| cream on maroon | 9.88 | pass |
| cream/75 on night | 9.69 | pass |
| cream/65 on night | 7.49 | pass |
| gold on night | 7.91 | pass |
| gold on surface | 7.27 | pass |
| gold on surface-2 | 6.31 | pass |
| gold on maroon-deep | 6.32 | pass |
| gold on maroon | 4.63 | pass |
| gold-light on night | 12.25 | pass |
| maroon-deep on gold (button) | 6.32 | pass |
| — cream on gold | 2.31 | **fail — never use** |
| — maroon on night | ~1.8 | **fail — never use** |

## Motion

One system per job, after AOS was removed from fourteen files:
**gsap + ScrollTrigger** for scroll-driven work, **framer-motion** for discrete
entrances. Both gate on `src/lib/useMotionPreference.ts`, which branches to a
separate static component so no scroll listener mounts under reduced motion.
