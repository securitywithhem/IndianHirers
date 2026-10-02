# Indian Hirers — UI/UX Specification v2: "The Royal Banquet Table"

**Version:** 2.0 · **Phase:** R1, Wave 1 · **Replaces:** `Docs/UI_UX.md` (v1)

This is the single source of truth for how the site looks and moves. Builders read
this file and the rules in `.claude/rules/`; they do not need v1.

Where the tokens live (and the only two files that may hold a raw colour value):

| What | File |
|---|---|
| CSS variables, theme scopes, signature utilities | `indian-hires-website/src/app/globals.css` |
| Tailwind theme that exposes them | `indian-hires-website/tailwind.config.ts` |
| Fonts | `indian-hires-website/src/app/fonts.ts` |
| Ornament components | `indian-hires-website/src/components/ornament/` |
| Colour provenance and full contrast table | `indian-hires-website/docs/color-system.md` |
| Allowed pairs (the rule reviewers score against) | `.claude/rules/a11y.md` |

If this document and a rules file disagree on a number, the rules file wins and this
document is corrected.

---

## 1. Concept

**The Royal Banquet Table.** The site should feel like walking into a candle-lit
banquet hall: deep maroon walls, antique gold detailing, ivory linen. Restrained, never
gaudy. Luxury comes from **space, type and slow, confident motion** — not from ornament
overload. If a page feels busy, remove ornament before adding anything.

**Audience:** hotel banquet managers, caterers, wedding planners and private hosts in
Gujarat, mostly on mid-range Android phones. Design and build at **390px first**, then
scale up to 768, 1280 and 1920.

**Brand source:** the logo (`Docs/LOGO (TM).jpg`; web copy `public/images/brand/logo.webp`)
— a crowned "IH" monogram in deep maroon on white, "GABHAWALAS" in a banner,
"INDIAN HIRERS" in a heavy serif, "Vadodara, Gujarat", and the tagline
"An Occasion with Dignity". The system matches its maroon, its serif character and its
crown motif.

**The logo is never redrawn, recoloured, cropped or distorted.** The supplied file is
used as-is. The `<Crown>` ornament is a separate, original outline drawing inspired by
the logo's crown; it decorates, it never stands in for the logo.

### Decisions already made (do not reopen)

1. **Maroon is logo-warm.** The brief's `#7A1B2D` / `#5C1423` / `#2B0A10` (hue 345–350°)
   were replaced, with the owner's confirmation, by the logo's own family at hue 10–11°.
   Every colour stays in the warm 10°–46° band. `#800020` is not the brand.
2. **Gold is the only accent.** The brief's optional sage green is dropped.
3. **Two font families only** — Cormorant Garamond and Jost (section 4).
4. **No prices anywhere.** Where a rate would appear, the item says "Rates on request"
   (the string lives in a content file).

---

## 2. Palette

All values are bare HSL triplets in `:root`. Hex is shown for reference only — never
write a hex anywhere but this document.

### 2.1 Primitive scales

| Token (utility suffix) | HSL triplet | Hex | Role |
|---|---|---|---|
| `maroon-950` | `11 62% 10%` | `#290F0A` | Deepest wall: footer, hero base |
| `maroon-800` | `11 72% 19%` | `#531A0E` | Primary dark surface; primary-button hover on ivory |
| `maroon-700` | `10 75% 25%` | `#702010` | Brand maroon = the logo exactly; headings, links, buttons on ivory |
| `gold-700` | `42 66% 28%` | `#775A18` | Gold **text on ivory** (eyebrows, small labels) |
| `gold-500` | `42 53% 54%` | `#C8A34C` | Antique gold: rules, hairlines, ornament, fills. Text only on maroon |
| `gold-300` | `43 64% 69%` | `#E3C67D` | Highlight, hover on gold fills, gold text on maroon |
| `ivory-50` | `40 65% 95%` | `#FBF5EA` | Page background, cards |
| `ivory-100` | `40 53% 90%` | `#F3EAD8` | Alternate section background |
| `ivory-300` | `40 32% 78%` | `#D9CDB5` | Quiet structural rule on ivory; secondary text on maroon |
| `espresso-900` | `10 25% 9%` | `#1D1311` | Body text on ivory |
| `espresso-600` | `16 14% 32%` | `#5D4C46` | Secondary text on ivory |
| `whatsapp` | `142 70% 49%` | `#25D466` | WhatsApp elements only |
| `danger` | `10 72% 36%` | `#9E301A` | Form errors, on ivory only |
| `control-border` | `34 22% 42%` | `#836E54` | Input / chip boundary on ivory |

### 2.2 Semantic roles — use these in components

A role is a utility whose colour depends on the surface. On ivory it takes the first
value; inside a `.theme-dark` band it takes the second. Builders write the role and let
the scope choose.

| Role | Utilities | On ivory | Inside `.theme-dark` |
|---|---|---|---|
| `background` | `bg-background`, `ring-offset-background` | `ivory-50` | `maroon-800` |
| `foreground` | `text-foreground` | `espresso-900` | `ivory-50` |
| `muted` | `bg-muted` | `ivory-100` | `maroon-950` |
| `muted-foreground` | `text-muted-foreground` | `espresso-600` | `ivory-300` |
| `card` / `card-foreground` | `bg-card text-card-foreground` | `ivory-50` / `espresso-900` | `maroon-700` / `ivory-50` |
| `popover` / `popover-foreground` | `bg-popover text-popover-foreground` | `ivory-50` / `espresso-900` | `maroon-950` / `ivory-50` |
| `primary` / `primary-foreground` | `bg-primary text-primary-foreground`, `text-primary`, `border-primary` | `maroon-700` / `ivory-50` | `gold-500` / `maroon-950` |
| `primary-hover` | `hover:bg-primary-hover` | `maroon-800` | `gold-300` |
| `secondary` / `secondary-foreground` | `bg-secondary text-secondary-foreground` | `ivory-100` / `maroon-700` | `maroon-700` / `ivory-50` |
| `accent` / `accent-foreground` | `bg-accent text-accent-foreground` | `gold-500` / `maroon-950` | same |
| `heading` | `text-heading` | `maroon-700` | `ivory-50` |
| `kicker` | `text-kicker` | `gold-700` | `gold-300` |
| `link` | `text-link` | `maroon-700` | `gold-300` |
| `hairline` | `border-hairline/40`, `text-hairline` | `gold-500` | `gold-500` |
| `border` | `border-border` (the default border colour) | `ivory-300` | `maroon-700` |
| `input` | `border-input` | `control-border` | `gold-500` |
| `ring` | `ring-ring` | `maroon-700` | `gold-300` |
| `destructive` / `destructive-foreground` | `text-destructive`, `border-destructive` | `danger` / `ivory-50` | `gold-300` / `maroon-950` |

**Scopes**

- `.theme-dark` — put it on every maroon band. It re-maps the roles and sets the text
  colour to ivory. It does **not** paint a background: add `bg-background` (maroon-800)
  or `bg-maroon-950` yourself.
- `.theme-light` — an ivory panel inside a maroon band (a form, a white card). It
  restores the ivory roles. Add `bg-background` or `bg-card`.
- **Forms live on ivory.** No error red is legible on maroon; a form in a maroon band
  sits in a `.theme-light` panel.

**When to use a primitive instead of a role:** only when the colour must not flip —
the footer (`bg-maroon-950`), the WhatsApp button (`bg-whatsapp text-espresso-900`),
the crown placeholder tile, type on a gold fill (`text-maroon-950`).

### 2.3 Gradients, texture and glow

| Class | What it is | Rule |
|---|---|---|
| `bg-gold-gradient` | 135° `gold-700 → gold-500 → gold-300 → gold-500` | Decorative fills only. **Never put type on it** — the dark end fails. Do not combine with a `bg-*` colour inside `cn()` |
| `gold-sheen` | 135° `gold-500 → gold-300 → gold-500` | A gold fill that carries `text-maroon-950`. May be clipped to large display text on maroon: `gold-sheen bg-clip-text text-transparent` (≥ 32px only) |
| `surface-linen` | Two crossed hairline grids of `gold-700` at 3–4% | Ivory surfaces only: `surface-linen bg-background` or `surface-linen bg-muted`. CSS only, no image file |
| `candle-glow` | Radial `gold-500` at 18% fading to 0 | An `aria-hidden` layer behind a heading in a maroon band. Text over it is `ivory-50` or `gold-300`, never `gold-500` |
| `hero-scrim` | `maroon-950` at 62–94%, top to bottom | The only permitted way to place text over a photograph |

`surface-linen`, `candle-glow`, `gold-sheen` and `hero-scrim` are deliberately not
`bg-*` classes: `cn()` uses tailwind-merge, which would treat `bg-linen` as a background
*colour* and delete it or the real colour beside it. The `bg-linen`, `bg-candle-glow`,
`bg-gold-sheen` and `bg-hero-scrim` utilities exist in the theme but are not for use
through `cn()`.

---

## 3. Contrast

Body text ≥ 4.5:1. Large text (≥ 24px, or ≥ 18.66px bold) and UI boundaries ≥ 3:1.
**Measured** = computed from the tokens with `node scripts/contrast.mjs`.
**tbm** = an estimate, to be measured before anyone relies on it.

### 3.1 On ivory

| Foreground | Background | Ratio | Status | Allowed use |
|---|---|---|---|---|
| `espresso-900` | `ivory-50` | 16.76 | measured | all text |
| `espresso-900` | `ivory-100` | 15.23 | measured | all text |
| `espresso-600` | `ivory-50` | 7.45 | measured | secondary text, captions, placeholders |
| `espresso-600` | `ivory-100` | 6.77 | measured | secondary text, captions, placeholders |
| `maroon-700` | `ivory-50` | 10.20 | measured | headings, links, outline button, focus ring |
| `maroon-700` | `ivory-100` | 9.27 | measured | headings, links, outline button, focus ring |
| `gold-700` | `ivory-50` | 5.93 | measured | eyebrows, small gold labels |
| `gold-700` | `ivory-100` | 5.39 | measured | eyebrows, small gold labels |
| `ivory-50` | `maroon-700` | 10.20 | measured | primary button label |
| `ivory-50` | `maroon-800` | 12.65 | measured | primary button label, hover |
| `danger` | `ivory-50` | ~6.7 | **tbm** | error text, invalid border |
| `danger` | `ivory-100` | ~6.1 | **tbm** | error text, invalid border |
| `ivory-50` | `danger` | ~6.7 | **tbm** | label on a destructive fill (not currently used) |
| `control-border` | `ivory-50` | 4.47 | measured | input / chip boundary (UI) |
| `control-border` | `ivory-100` | 4.06 | measured | input / chip boundary (UI) |
| `gold-500` | `ivory-50` | 2.21 | measured | **lines and large ornament only — never text, never a control boundary** |
| `ivory-300` | `ivory-50` | ~1.45 | **tbm** | decorative rule only; no requirement applies |

### 3.2 On maroon

| Foreground | Background | Ratio | Status | Allowed use |
|---|---|---|---|---|
| `ivory-50` | `maroon-950` | 16.51 | measured | all text |
| `ivory-50` | `maroon-800` | 12.65 | measured | all text |
| `ivory-50` | `maroon-700` | 10.20 | measured | all text |
| `ivory-300` | `maroon-950` | ~11.4 | **tbm** | secondary text |
| `ivory-300` | `maroon-800` | ~8.7 | **tbm** | secondary text |
| `ivory-300` | `maroon-700` | ~7.0 | **tbm** | secondary text |
| `gold-300` | `maroon-950` | 10.77 | measured | eyebrows, links, gold text, focus ring |
| `gold-300` | `maroon-800` | 8.26 | measured | eyebrows, links, gold text, focus ring |
| `gold-300` | `maroon-700` | 6.65 | measured | eyebrows, links, gold text, focus ring |
| `gold-500` | `maroon-950` | 7.48 | measured | text, icons, outline button |
| `gold-500` | `maroon-800` | 5.74 | measured | text, icons, outline button |
| `gold-500` | `maroon-700` | 4.62 | measured | text ≥ 16px only — little headroom; prefer `gold-300` |
| `maroon-950` | `gold-500` | 7.48 | measured | type on a gold fill |
| `maroon-950` | `gold-300` | 10.77 | measured | type on a gold fill, hover; type on `gold-sheen` |

### 3.3 Special surfaces

| Foreground | Background | Ratio | Status | Allowed use |
|---|---|---|---|---|
| `espresso-900` | `whatsapp` | 9.30 | measured | the only type or icon colour on WhatsApp green |
| `ivory-50` | `hero-scrim` at its lightest (62%) over a white pixel | ~4.7 | **tbm** | text over a photograph — verify on the real image |
| `gold-300` | `hero-scrim` at ≥ 78% over a white pixel | ~5.4 | **tbm** | only in the lower 40% of a scrimmed photograph |
| `ivory-50` | `candle-glow` peak over `maroon-800` | ~9.3 | **tbm** | headings in the glow |
| `gold-300` | `candle-glow` peak over `maroon-800` | ~6.1 | **tbm** | eyebrow in the glow |
| `gold-500` | `candle-glow` peak over `maroon-800` | ~4.2 | **tbm** | **not allowed as text over the glow** |
| `espresso-600` | `surface-linen` over `ivory-100` | ~6.5 | **tbm** | the weave costs ≤ ~0.3 on any ivory pair |
| `gold-700` | `surface-linen` over `ivory-100` | ~5.1 | **tbm** | the weave costs ≤ ~0.3 on any ivory pair |

Every row except the first involves a gradient or texture under the text, which
`scripts/contrast.mjs` cannot composite directly; they need a screenshot-based check.

### 3.4 Forbidden

- `gold-500` or `gold-300` as text on ivory (2.21 and lower).
- `ivory-50`, `ivory-100` or stock `white` on any gold fill (2.21).
- Any light type on `whatsapp` (~2:1). WhatsApp buttons take `text-espresso-900`.
- `gold-700`, `maroon-700`, `espresso-*` or `danger` as text on any maroon surface.
- Type of any colour on `bg-gold-gradient`.
- Opacity modifiers on text colours (`text-foreground/60`). Use `text-muted-foreground`.
- `control-border`, any gold, or `ivory-300` as a focus ring on ivory.
- Text over a photograph without `hero-scrim`.
- Stock `white` / `black` classes anywhere — `check-tokens` fails the build.

---

## 4. Typography

### 4.1 Families

| Role | Family | Weights loaded | CSS variable | Utility |
|---|---|---|---|---|
| Display | **Cormorant Garamond** | 600 | `--font-display` | `font-display` |
| Body and UI | **Jost** | 400, 500, 600 | `--font-body` | `font-body` |

Declared in `src/app/fonts.ts` as `fontDisplay` and `fontBody` (`next/font/google`,
`display: "swap"`, upright only). Exactly two families — the performance rule.

- **Playfair Display (v1) is replaced by Cormorant Garamond.** Cormorant has higher
  stroke contrast and is more ceremonial at display sizes, and its sharp, bracketed
  serifs are closer to the heavy serif of "INDIAN HIRERS" in the logo.
- **Cinzel was dropped.** The brief proposed it for small-caps eyebrows; a third family
  breaks the two-family rule. Eyebrows are Jost 500, uppercase, `0.2em` tracking.
- **Inter (v1) is replaced by Jost** — a geometric sans whose round forms sit quietly
  under a high-contrast serif.
- **No italics.** No italic face is loaded; a browser-synthesised italic is not
  acceptable. Emphasis is weight (500/600) or colour (`text-heading`).
- Cormorant runs small for its point size. Never set it below `type-h4` (20px); never
  use it for paragraphs, buttons or labels.

### 4.2 Scale

Fluid between 390px and 1440px viewport width with `clamp()`; fixed outside that range.
**Use the `type-*` classes** — each sets family, size, line height, tracking and weight.

| Class | Family / weight | 390px | 1440px+ | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| `type-display` | Cormorant 600 | 40px | 72px | 1.05 | -0.01em | the page `h1` |
| `type-h2` | Cormorant 600 | 32px | 52px | 1.1 | -0.005em | section headings |
| `type-h3` | Cormorant 600 | 24px | 32px | 1.2 | 0 | sub-sections, feature titles |
| `type-h4` | Cormorant 600 | 20px | 24px | 1.25 | 0 | card titles |
| `type-stat` | Cormorant 600, lining tabular numerals | 44px | 64px | 1 | 0 | trust-stat numerals |
| `type-lead` | Jost 400 | 19px | 22px | 1.55 | 0 | one lead paragraph under a heading |
| `type-body` | Jost 400 | 17px | 18px | 1.65 | 0 | paragraphs (also the `body` default) |
| `type-small` | Jost 400 | 15px | 15px | 1.55 | 0 | card descriptions, form help, chips |
| `type-caption` | Jost 400 | 13px | 13px | 1.45 | 0.01em | captions, legal, footer small print |
| `type-eyebrow` | Jost 500, uppercase | 13px | 13px | 1.2 | 0.2em | eyebrows — at most one per section |
| `type-button` | Jost 500 | 16px | 16px | 1.25 | 0.02em | buttons, nav links |

Exact `clamp()` values are in `tailwind.config.ts → fontSize`.

### 4.3 Rules

- The type role follows the meaning, the tag follows the outline: a card title inside an
  `h2` section is an `<h3 class="type-h4">`. One `h1` per page; levels never skip.
- `type-display`, `type-h2`, `type-h3`, `type-h4` already apply `text-balance`
  (no orphans). `type-lead` applies `text-pretty`.
- **Line length 45–75 characters.** Paragraphs take `max-w-measure` (54ch ≈ 70
  characters of Jost — a `ch` is the width of "0", which holds about 1.3 characters of
  running text); a narrow column takes `max-w-measure-tight` (48ch ≈ 63 characters). `h1` takes `max-w-heading` (18ch), `h2`
  and `h3` take `max-w-heading-wide` (28ch).
- Uppercase is for `type-eyebrow` only. Never uppercase a heading or a button.
- Weight for emphasis inside body text: `font-medium` (500) or `font-semibold` (600).
- **Do not pass the raw size utilities (`text-display`, `text-h2`, `text-body` …)
  through `cn()` beside a text colour.** tailwind-merge reads an unknown `text-*` as a
  colour and drops one of the two. The `type-*` classes do not have this problem.
- Tailwind's `font-sans` and `font-serif` now resolve to Jost and Cormorant Garamond,
  so a stray stock class cannot fall back to a system face. Prefer `type-*` anyway.

---

## 5. Space, layout and rhythm

### 5.1 Spacing tokens

Base unit 4px (Tailwind's scale). Named fluid tokens:

| Token | Utilities | 390px | 1440px+ | Use |
|---|---|---|---|---|
| `section` | `py-section`, `pt-section`, `pb-section` | 64px | 112px | vertical padding of every full section |
| `section-sm` | `py-section-sm` | 48px | 72px | compact bands: trust stats, page header, footer top |
| `gutter` | `px-gutter` | 20px | 32px | page side padding |
| `header` | `h-header`, `pt-header`, `top-header` | 72px | 72px | fixed header height (`--header-h`) |

Layout classes:

| Class | Does |
|---|---|
| `shell` | `mx-auto w-full max-w-content px-gutter` — the content column, max 1280px |
| `max-w-content` | 1280px |
| `max-w-measure` / `max-w-measure-tight` | 54ch (≈ 70 characters) / 48ch (≈ 63 characters) |
| `max-w-heading` / `max-w-heading-wide` | 18ch / 28ch |

Inside a section: heading block → content is `mt-10 md:mt-14`; grids use
`gap-4 md:gap-6 lg:gap-8`; a card's inner padding is `p-5 md:p-6`. Bands are full-bleed
at every width; the content inside them is a `shell`. At 1920px the band keeps growing
and the shell stays 1280px.

Touch targets are ≥ 44×44px (`min-h-11`; primary actions `min-h-12`) with ≥ 8px
(`gap-2`) between them.

### 5.2 Light / dark section rhythm

**The page is ivory.** Maroon appears in deliberate bands only — never as random
alternation.

```
header        transparent over the hero  →  ivory + blur + gold hairline after 80px
1 hero        .theme-dark  bg-maroon-950         candle-glow behind the h1
2 section     bg-background (ivory-50)           surface-linen allowed
3 section     bg-muted (ivory-100)
4 section     bg-background
5 MID BAND    .theme-dark  bg-background (maroon-800) + candle-glow   — one per page, optional
6 section     bg-background / bg-muted, alternating
7 closing CTA .theme-dark  bg-background (maroon-800)
8 footer      .theme-dark  bg-maroon-950
```

Rules:

- Every page opens on maroon: the home hero, or on inner pages a compact page header
  band (recipe in 7.11). The transparent header therefore always starts over maroon.
- At most **one** maroon band between the hero and the closing CTA.
- Two ivory sections in a row alternate `bg-background` and `bg-muted`. Never two
  identical tones back to back without a `<CrownDivider>` between them.
- The closing CTA (maroon-800) meets the footer (maroon-950) directly; the tone step
  and a `border-t border-hairline/40` on the footer separate them.
- `surface-linen` on at most two sections per page.

### 5.3 Radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 2px | logo plaque, tags |
| `rounded-md` | 4px | small controls |
| `rounded-lg` | 6px (`--radius`) | buttons, inputs |
| `rounded-card` | 8px | cards, panels, lightbox |
| `rounded-full` | pill | chips, the floating WhatsApp button |

Small radii are deliberate: crisp corners read as stationery and silverware; large
soft corners read as an app.

### 5.4 Shadows

Warm (maroon-tinted), never grey. Built from `hsl(var(--maroon-950) / a)`.

| Token | Use |
|---|---|
| `shadow-card` | resting card on ivory |
| `shadow-lift` | static lifted surfaces (floating WhatsApp, lightbox). For a card's hover lift use `card-royal`, not `hover:shadow-lift` |
| `shadow-header` | the header in its solid state |
| `shadow-bar` | the mobile bottom bar: gold hairline on top plus a soft upward shadow |

**box-shadow is never transitioned** (motion rule). `card-royal` fades a pseudo-element's
opacity instead.

### 5.5 Stacking

`z-bar` (40): mobile bottom bar, floating WhatsApp · `z-header` (50) · `z-drawer` (60)
· `z-lightbox` (70). No other z-index above 10.

---

## 6. Signature elements

Use each one sparingly; the restraint is the luxury.

### 6.1 Crown divider — `<CrownDivider />`

A thin double gold rule with the crown in the centre. Use it between two sections of the
same tone, under a centred section heading (`<SectionHeading divider />`), and above the
footer's small print. **At most three per page.** Decorative, `aria-hidden`.
The double rule on its own is the class `rule-double` (5px tall: two 1px gold lines);
`rule-fade-start` / `rule-fade-end` fade its outer end.

### 6.2 Ivory linen — `surface-linen`

`<section class="surface-linen bg-background py-section">`. Ivory only.

### 6.3 Mehrab arch — `<ArchFrame aspect="3/4">`

A pointed palace arch that masks its child. Used for the **hero image** and the
**category tiles**. The frame has a fixed aspect ratio (`3/4`, `4/5` or `1/1`), so the
box is reserved before the image loads — no layout shift. `framed` adds a thin gold
line following the arch. The child is a `next/image` with `fill`, `object-cover` and a
correct `sizes`. Not for catalogue item cards (those are square, see 7.4) and not for
anything wider than square.

### 6.4 Candle glow — `candle-glow`

```html
<section class="theme-dark relative isolate overflow-hidden bg-background py-section">
  <div aria-hidden="true" class="candle-glow pointer-events-none absolute inset-0 -z-10"></div>
  <div class="shell">…heading…</div>
</section>
```

One glow per maroon band, centred behind the heading. It never moves and never pulses.

### 6.5 Cards — `card-royal`

Ivory, a 1px `gold-500` border at 40% opacity, a resting shadow; on hover or keyboard
focus the card rises 4px and the lifted shadow fades in, and the image zooms to 1.04
over 700ms. Transform and opacity only; the rise and the zoom are off under reduced
motion (the shadow fade, an opacity change of 180ms, remains). Recipe in 7.4.

### 6.6 Header

Transparent over the maroon hero; after 80px of scroll it becomes ivory with a blur and
a gold bottom hairline. Its height (`h-header`, 72px) never changes, so the document
does not shift. Recipe in 7.9.

### 6.7 Crown placeholder — `<CrownPlaceholder aspect="1/1" />`

Where a catalogue piece has no photograph: an ivory linen tile with the crown.
Never a grey box, never a stock photo.

### 6.8 The logo

The file has an opaque white ground. It is always shown complete, inside its own plaque:
`relative block size-12 overflow-hidden rounded-sm ring-1 ring-hairline/40` wrapping a
`next/image` (`fill`, `object-contain`). The same plaque is used in both header states
and in the footer, so the mark never sits bare on maroon and is never filtered, blended
or recoloured. (A transparent-ground master from the owner would remove the need for
the plaque — see section 11.)

---

## 7. Component recipes

Class strings are exact. Where a recipe uses roles it works unchanged on ivory and
inside `.theme-dark`.

### 7.1 Primary button

```
type-button focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg
bg-primary px-6 py-3 text-primary-foreground
transition-colors duration-hover ease-royal hover:bg-primary-hover
motion-safe:active:translate-y-px
disabled:pointer-events-none disabled:opacity-50
```

On ivory: maroon-700 fill, ivory label (10.20), hover maroon-800 (12.65).
Inside `.theme-dark`: gold-500 fill, maroon-950 label (7.48), hover gold-300 (10.77).
One primary button per view.

### 7.2 Secondary button (outline)

```
type-button focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg
border border-primary bg-transparent px-6 py-3 text-link
transition-colors duration-hover ease-royal
hover:bg-primary hover:text-primary-foreground
disabled:pointer-events-none disabled:opacity-50
```

On ivory: maroon outline and label. Inside `.theme-dark`: gold-500 outline, **gold-300
label** (the `link` role: 8.26 on maroon-800, 6.65 on a maroon-700 card, and about 6.1 over
a candle glow, where gold-500 type is forbidden). On hover the fill is `primary` and the
label `primary-foreground`.

The recipes live in `src/components/ui/button-variants.ts`; no class in them conflicts
with another, so they need no tailwind-merge (client components join classes with `cx`).

### 7.3 Text link and WhatsApp button

Text link (inline or standalone):

```
focus-ring text-link underline decoration-hairline/60 underline-offset-4
transition-colors duration-hover ease-royal hover:decoration-link
```

Standalone, add `type-button inline-flex min-h-11 items-center gap-2`.

WhatsApp button — the only place `whatsapp` is used; type and icon are **always**
`espresso-900`:

```
type-button focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg
bg-whatsapp px-6 py-3 text-espresso-900
motion-safe:transition-transform motion-safe:duration-hover motion-safe:ease-royal
motion-safe:hover:-translate-y-0.5
```

There is no hover colour for WhatsApp green (no second green token); the hover is the
small rise. The icon is `aria-hidden`; the label comes from a content file.

Floating WhatsApp (fixed, icon only, needs an `aria-label` from content):

```
focus-ring fixed bottom-24 right-4 z-bar grid size-14 place-items-center rounded-full
bg-whatsapp text-espresso-900 shadow-lift isolate md:bottom-6 md:right-6
```

with the pulse ring as its first child:

```html
<span aria-hidden="true"
  class="pointer-events-none absolute inset-0 -z-10 rounded-full bg-whatsapp opacity-0
         motion-safe:animate-whatsapp-pulse"></span>
```

(`opacity-0` is the resting and reduced-motion state; the animation supplies the
opacity while it runs.)

### 7.4 Card (catalogue item)

```html
<article class="card-royal group flex flex-col rounded-card border border-hairline/40
                bg-card text-card-foreground shadow-card">
  <div class="relative aspect-square overflow-hidden rounded-t-card bg-muted">
    <!-- next/image with fill, sizes and the blur placeholder; never a bare <img> -->
    <Image fill class="object-cover motion-safe:transition-transform motion-safe:duration-zoom
                       motion-safe:ease-royal motion-safe:group-hover:scale-104" />
  </div>
  <div class="flex flex-col gap-2 p-5 md:p-6">
    <h3 class="type-h4 text-heading">…</h3>
    <p class="type-small text-muted-foreground">…</p>
    <p class="type-caption text-kicker">…"Rates on request", from content…</p>
  </div>
</article>
```

- The `<article>` must **not** be `overflow-hidden` (it would clip the lift shadow);
  the image wrapper clips.
- The heading tag comes from a prop; the class stays `type-h4`.
- No photograph: replace the image wrapper's contents with
  `<CrownPlaceholder aspect="1/1" className="rounded-t-card" />`.
- If the whole card is a link, the link is the heading's `<a>` with
  `after:absolute after:inset-0` and `focus-ring`; `card-royal` already lifts on
  `:focus-within`.

Category tile (arch):

```html
<a class="group focus-ring flex flex-col items-center gap-4 text-center">
  <ArchFrame aspect="3/4" framed>
    <!-- next/image fill, class as the card image above -->
  </ArchFrame>
  <span class="type-h4 text-heading">…</span>
  <span class="type-caption text-muted-foreground">…derived count, from content…</span>
</a>
```

### 7.5 Chip / filter

```
type-small focus-ring inline-flex min-h-11 items-center rounded-full
border border-input bg-transparent px-4 text-foreground
transition-colors duration-hover ease-royal hover:border-primary
aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground
```

A filter chip is a `<button aria-pressed>`. Chips sit in a `flex flex-wrap gap-2` row
(a horizontally scrollable row at 390px is acceptable if it is a plain scroll with no
JavaScript). Filter chips are used on ivory only.

### 7.6 Eyebrow

```
type-eyebrow text-kicker
```

A `<p>` directly above its heading. At most one per section, at most about 32
characters, never on consecutive sections of a short page.

### 7.7 Section heading

Always through the component:

```tsx
<SectionHeading as="h2" eyebrow={…} heading={…} lead={…} align="center" tone="light" divider />
```

`tone="dark"` on any maroon surface. By hand, the equivalent is
`type-eyebrow text-kicker` → `type-h2 text-heading max-w-heading-wide` →
`type-lead text-muted-foreground max-w-measure`, stacked with `gap-4`.

### 7.8 Form field

Forms are on ivory (or in a `.theme-light` panel).

| Part | Classes |
|---|---|
| Field wrapper | `flex flex-col gap-2` |
| Label | `type-small font-medium text-foreground` — required marker inside the label text |
| Input / textarea | `type-body focus-ring h-12 w-full rounded-lg border border-input bg-card px-4 text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive disabled:opacity-50` (textarea: `min-h-32 py-3` instead of `h-12`) |
| Help text | `type-small text-muted-foreground` |
| Error text | `type-small font-medium text-destructive`, linked with `aria-describedby` |

The shadcn primitives in `src/components/ui/` read the semantic variables and are
legible on ivory as they stand, but they are sized for a dense dashboard. `ui-builder`
should change, in `ui/input.tsx` and `ui/textarea.tsx`: `h-8` → `h-12`, `px-2.5` → `px-4`,
`text-base … md:text-sm` → `type-body`, `bg-transparent` → `bg-card`, and
`focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` →
`focus-ring`; in `ui/label.tsx`: `text-sm` → `type-small`; in `ui/button.tsx`: replace
the `default`, `outline` and size variants with recipes 7.1–7.3 (`h-8`/`h-9` are below
the 44px touch target). Body-size inputs (17px) also stop iOS from zooming on focus.

### 7.9 Header

```html
<!-- at the top of the page: data-scrolled="false" and the theme-dark class -->
<header data-scrolled="false"
  class="theme-dark group fixed inset-x-0 top-0 z-header h-header text-foreground
         transition-colors duration-hover ease-royal">
  <!-- backdrop: only its opacity changes -->
  <div aria-hidden="true"
    class="absolute inset-0 -z-10 border-b border-hairline/40 bg-ivory-50/90 shadow-header
           opacity-0 backdrop-blur-md transition-opacity duration-hover ease-royal
           group-data-[scrolled=true]:opacity-100"></div>
  <div class="shell flex h-full items-center justify-between">…</div>
</header>
```

- After 80px of scroll the header sets `data-scrolled="true"` **and removes
  `theme-dark`** (passive scroll listener or an IntersectionObserver sentinel; no state
  update per scroll event). Removing the scope flips the header's text, links and focus
  ring from ivory/gold to espresso/maroon in one step, while the ivory backdrop fades
  in. The first paint (and the no-JavaScript state) is the transparent, `theme-dark`
  header over the maroon band.
- The header is `fixed`; the first band of every page adds `pt-header`. The layout's
  `<main>` no longer needs `pt-20`.
- Nav link: `type-button focus-ring relative inline-flex min-h-11 items-center` with an
  underline child
  `absolute inset-x-0 bottom-2 h-px origin-center scale-x-0 bg-hairline motion-safe:transition-transform motion-safe:duration-hover motion-safe:ease-royal group-hover/link:scale-x-100`
  (the link is `group/link`); the current page keeps `scale-x-100` and
  `aria-current="page"`.
- Nav links and icon buttons use roles only (`text-foreground`, `focus-ring`), so they
  are correct in both states without any per-state classes.
- Mobile drawer: `theme-dark bg-maroon-950`, `z-drawer`, full a11y contract in
  `.claude/rules/a11y.md`.

### 7.10 Mobile bottom bar

```
fixed inset-x-0 bottom-0 z-bar grid grid-cols-3 bg-background/95 shadow-bar
backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden
```

Three actions (Call, WhatsApp, Enquire), each
`type-caption focus-ring flex min-h-14 flex-col items-center justify-center gap-1 text-foreground`,
icons `text-primary`. The page reserves its height (`pb-20 md:pb-0` on `body`, as now).

### 7.11 Bands

| Band | Classes |
|---|---|
| Ivory section | `bg-background py-section` |
| Alternate ivory section | `bg-muted py-section` |
| Linen section | `surface-linen bg-background py-section` |
| Maroon band | `theme-dark relative isolate overflow-hidden bg-background py-section` (+ candle glow layer) |
| Hero | `theme-dark relative isolate overflow-hidden bg-maroon-950 pt-header`, content in `shell pb-section pt-section-sm` |
| Inner-page header band | `theme-dark bg-background pt-header`, content in `shell py-section-sm` |
| Footer | `theme-dark border-t border-hairline/40 bg-maroon-950 pt-section-sm` |
| Ivory panel inside a maroon band | `theme-light rounded-card bg-card p-6 md:p-8` |

**Hero layout.** Maroon-950 band, candle glow behind the headline, the banquet
photograph in an `<ArchFrame aspect="4/5" framed>`. At 390px: eyebrow, `h1`, lead,
actions, then the arch at about 80% of the column width, centred. From `lg`: two
columns, copy left (7 of 12), arch right (5 of 12). The hero image is the route's single
`priority` image. **No text is placed over a photograph**; if a later design needs a
full-bleed photo, it goes under `hero-scrim` with copy in the lower 40%.

### 7.12 Focus ring per surface

One class everywhere: **`focus-ring`** =
`outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`.

| Surface | Ring | Offset | Ratio of ring to surface |
|---|---|---|---|
| Ivory (`ivory-50` / `ivory-100`) | `maroon-700` | `ivory-50` | 10.20 / 9.27 |
| Inside `.theme-dark` (`maroon-950` / `800` / `700`) | `gold-300` | `maroon-800` | 10.77 / 8.26 / 6.65 |
| A filled button (maroon, gold, WhatsApp) | as its surrounding surface | as its surrounding surface | the ring is outside the 2px gap, so it is judged against the surface, not the fill |

A base-layer safety net gives any `a`, `button`, `summary` or `[role=button]` without
`focus-ring` a 2px `ring`-coloured outline. It is a fallback, not the recipe.

---

## 8. Ornament components

`src/components/ornament/` — server components, no copy inside, token utilities only.
Import from `@/components/ornament`.

| Component | Props | Notes |
|---|---|---|
| `Crown` | `className?: string` · `title?: string` · `strokeWidth?: number` (default 2) | Outline crown, `currentColor` stroke, viewBox 64×48, default height `h-6`. Decorative (`aria-hidden`) unless `title` is given, then `role="img"` with a `<title>`. Each path has `pathLength={1}` and `data-crown-stroke="band" \| "petal" \| "finial"` |
| `CrownDivider` | `className?: string` | Double rule + crown, `aria-hidden`, gold (`text-hairline`), default `mx-auto max-w-xs`. The rules are `[data-divider-rule="start"]` (`origin-right`) and `[data-divider-rule="end"]` (`origin-left`); the root is `[data-crown-divider]` |
| `ArchFrame` | `aspect: "3/4" \| "4/5" \| "1/1"` · `children: ReactNode` · `framed?: boolean` (default false) · `className?: string` | Fixed-aspect box with the mehrab mask. Inner box is positioned and `overflow-hidden`, so a `fill` image and a hover zoom stay inside the arch |
| `SectionHeading` | `as: "h1" \| "h2" \| "h3"` · `heading: string` · `eyebrow?: string` · `lead?: string` · `align?: "start" \| "center"` (default `start`) · `tone?: "light" \| "dark"` (default `light`) · `divider?: boolean` (default false) · `id?: string` · `className?: string` | Type role follows the level: `h1` → `type-display`, `h2` → `type-h2`, `h3` → `type-h3`. `id` goes on the heading element |
| `CrownPlaceholder` | `aspect: "1/1" \| "4/5" \| "3/4" \| "4/3"` · `className?: string` | Ivory linen tile with the crown, `aria-hidden`. Always ivory, also inside `.theme-dark` |

---

## 9. Motion language

`.claude/rules/motion.md` is the authority on numbers; this is the summary and the
list of where motion is used. Library: `motion` (`motion/react`) through `LazyMotion`.

**Principles**

- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` (`ease-royal`) for anything entering or
  responding; `cubic-bezier(0.65, 0, 0.35, 1)` (`ease-move`) for things moving on screen.
- Durations: press 100–150ms (`duration-press`), hover and colour 150–200ms
  (`duration-hover`), entrances 300–600ms (`duration-enter` 350ms, `duration-enter-lg`
  500ms), hero / signature up to 900ms (`duration-signature`). Card image zoom 700ms
  (`duration-zoom`).
- Stagger 60–80ms between siblings, capped at 6 items; items after the sixth appear with
  the sixth.
- **Transform and opacity only.** Nothing animates width, height, top, left, margin,
  padding, box-shadow or filter.
- **Every animation has a reduced-motion static branch** (`src/lib/useMotionPreference.ts`);
  Tailwind transforms are written `motion-safe:`. The static branch occupies the same box.
- SSR and first paint show the final state. Entrances play once.

**Where**

| Place | Motion |
|---|---|
| Hero image | Slow Ken Burns: `scale` 1.0 → 1.08 over 20s, **one shot, not a loop**, then rests. `motion-safe:animate-ken-burns` on the image inside the `ArchFrame` |
| Hero headline | Lines reveal by a mask slide-up (each line in an `overflow-hidden` wrapper, the line translates up into place), staggered |
| Hero crown | Draws itself once with `stroke-dashoffset` 1 → 0 (band, then petals, then finial; 900ms in total). CSS: add `crown-draw` to a parent of `<Crown>`. Absent under reduced motion. *See section 11 — this needs a line in the motion rule* |
| Sections | Reveal on scroll: fade + 24px rise, once |
| Crown dividers | The two rules grow from the centre: `scaleX` 0 → 1 on `[data-divider-rule]` (origins are already set) |
| Trust stats | Number counters count up once in view; `type-stat` uses tabular numerals so the width does not jitter. Static branch shows the final number |
| Header | Transparent → ivory/blur + gold hairline after 80px (the backdrop's opacity fades); nav underline grows from the centre (`scaleX`) |
| Catalogue | Filter chips animate layout; cards stagger in; hover lift (`card-royal`) and image zoom 1.04 over 700ms |
| Lightbox | Opens with a shared-element zoom from the tile; closes about 25% faster |
| Page transitions | A gentle fade only |
| Floating WhatsApp | A pulse ring every 6 seconds, not constant: `motion-safe:animate-whatsapp-pulse` |
| Mobile bottom bar | Slides up (translateY) 1.2s after load; present and static under reduced motion |

**Approved exceptions to the motion rule** (recorded in `.claude/rules/motion.md`):
the one-shot 20s hero Ken Burns, and the 6-second WhatsApp pulse ring.

**Banned:** janky parallax, auto-playing carousels, bouncing or elastic easing, scroll
hijacking, pinned sections on mobile, anything that animates width, height, top or left,
`animate-ping`, `hover:scale-105` on buttons, `transition-all`.

---

## 10. Builders' cheat-sheet

### 10.1 Use these

**Scopes:** `theme-dark` · `theme-light`

**Colour roles:** `bg-background` · `text-foreground` · `bg-muted` ·
`text-muted-foreground` · `bg-card text-card-foreground` ·
`bg-popover text-popover-foreground` · `bg-primary text-primary-foreground` ·
`text-primary` · `border-primary` · `hover:bg-primary-hover` ·
`bg-secondary text-secondary-foreground` · `bg-accent text-accent-foreground` ·
`text-heading` · `text-kicker` · `text-link` · `border-hairline/40` · `text-hairline` ·
`bg-hairline` · `border-border` · `border-input` · `ring-ring` ·
`ring-offset-background` · `text-destructive` · `border-destructive`

**Fixed colours (only where the colour must not flip):** `maroon-950` · `maroon-800` ·
`maroon-700` · `gold-700` · `gold-500` · `gold-300` · `ivory-50` · `ivory-100` ·
`ivory-300` · `espresso-900` · `espresso-600` · `whatsapp` · `danger` ·
`control-border` — each with `bg-`, `text-`, `border-`, `ring-`, `fill-`, `stroke-`.

**Type:** `type-display` · `type-h2` · `type-h3` · `type-h4` · `type-stat` ·
`type-lead` · `type-body` · `type-small` · `type-caption` · `type-eyebrow` ·
`type-button` · `font-display` · `font-body` · `tracking-eyebrow` · `tracking-display` ·
`text-balance` · `text-pretty`

**Layout:** `shell` · `py-section` · `py-section-sm` · `px-gutter` · `h-header` ·
`pt-header` · `max-w-content` · `max-w-measure` · `max-w-measure-tight` ·
`max-w-heading` · `max-w-heading-wide` · `z-bar` · `z-header` · `z-drawer` · `z-lightbox`

**Shape and depth:** `rounded-sm` · `rounded-md` · `rounded-lg` · `rounded-card` ·
`rounded-full` · `shadow-card` · `shadow-lift` · `shadow-header` · `shadow-bar`

**Signature:** `surface-linen` · `candle-glow` · `gold-sheen` · `hero-scrim` ·
`bg-gold-gradient` · `rule-double` · `rule-fade-start` · `rule-fade-end` · `mask-arch`
(through `<ArchFrame>`) · `card-royal` · `focus-ring` · `crown-draw`

**Motion:** `ease-royal` · `ease-move` · `duration-press` · `duration-hover` ·
`duration-enter` · `duration-enter-lg` · `duration-zoom` · `duration-signature` ·
`scale-104` · `motion-safe:animate-ken-burns` · `motion-safe:animate-whatsapp-pulse`

**Components:** `Crown` · `CrownDivider` · `ArchFrame` · `SectionHeading` ·
`CrownPlaceholder` (from `@/components/ornament`)

**Fonts:** `fontDisplay` · `fontBody` (from `@/app/fonts`)

### 10.2 Removed aliases — no longer compile

The v1 names below were kept as aliases while the old pages were being rewritten. Every
page is now on the new system and the aliases have been **removed from
`tailwind.config.ts`** (R1, iteration 2): a class that uses one generates no CSS.

| Removed | Write instead |
|---|---|
| `cream` (`text-cream`, `bg-cream`, `text-cream/70` …) | `text-foreground` / `text-muted-foreground` in the right scope |
| `text-text` | `text-foreground` |
| `ink` | `text-foreground`, or `text-maroon-950` on a gold fill |
| `night` | `theme-dark bg-maroon-950` |
| `surface`, `surface-2` | `theme-dark bg-background`, or `bg-card` |
| `maroon` (bare), `maroon-deep`, `maroon-dark` | `bg-primary` / `text-heading` / `maroon-700`; `theme-dark bg-background` |
| `gold` (bare), `gold-deep`, `gold-light` | `hairline`, `accent`, `gold-500`; `text-kicker` in `.theme-dark`, or `gold-300` |
| `font-heading` | `type-*`, or `font-display` |
| `animate-glow-pulse` | `candle-glow` (static) |

`container` is Tailwind's own class and still compiles; use `shell`.

### 10.3 Retired — do not use

| Retired | Why | Replacement |
|---|---|---|
| Any stock `white` / `black` class (`text-white`, `bg-black/40`, `ring-white`) | **fails `check-tokens`** | a role or a scale colour |
| Stock palette classes (`text-red-500`, `bg-green-600` …) | not brand tokens (warning) | `text-destructive`, `bg-whatsapp` |
| `bg-[#…]`, `shadow-[…rgba()…]`, `style={{ color }}` | fails `check-tokens` | a token |
| CSS variables `--night`, `--surface`, `--surface-2`, `--maroon`, `--maroon-deep`, `--maroon-dark`, `--gold`, `--gold-light`, `--gold-deep`, `--cream`, `--ink` | removed from `globals.css` | the new scales |
| `.theme` class, `--font-heading`, `--font-sans` variables | removed (the self-referential bug) | `--font-display`, `--font-body` |
| `--font-playfair`, `--font-inter` | removed, including the fallbacks in the font stacks | `fontDisplay`, `fontBody` |
| `text-cream/60`, `text-foreground/70` and any opacity on text | contrast cannot be guaranteed | `text-muted-foreground` |
| `rounded-full` on buttons, `rounded-2xl` on cards | v1 look | `rounded-lg`, `rounded-card` |
| `shadow-md`, `shadow-lg`, `shadow-xl` | neutral grey shadows | `shadow-card`, `shadow-lift` |
| `hover:shadow-*` with a transition | animates box-shadow | `card-royal` |
| `hover:scale-105`, `animate-ping`, `transition-all` | ungated or banned motion | recipes in section 7 |
| `focus:` ring classes, `ring-gold`, `ring-white`, `ring-offset-maroon-deep` | wrong on ivory | `focus-ring` |
| `text-[11px]` and other arbitrary sizes | off the scale | `type-caption` |
| `h-8` / `h-9` controls | below 44px | `min-h-11` / `min-h-12` |
| Raw `text-display` / `text-h2` / `text-body` … and `bg-linen` / `bg-candle-glow` / `bg-gold-sheen` / `bg-hero-scrim` **inside `cn()`** | tailwind-merge drops them | `type-*`, `surface-linen`, `candle-glow`, `gold-sheen`, `hero-scrim` |

Changed values to be aware of: `rounded-card` was 16px, is now 8px. `--radius`
(`rounded-lg`) was 10px, is now 6px. `font-sans` / `font-serif` now mean Jost /
Cormorant Garamond.

---

## 11. Wiring notes and open points

**For `ui-builder` in Wave 3**

1. `src/app/layout.tsx`: import `fontDisplay`, `fontBody` from `./fonts`; put both
   `.variable` classes on `<html>`; delete the Inter / Playfair declarations. Then the
   `--font-playfair` / `--font-inter` fallbacks in `tailwind.config.ts` can go.
2. `layout.tsx` `themeColor`: `#290F0A` (maroon-950), with a
   `// check-tokens-ignore: meta theme-color cannot reference a CSS variable` marker.
3. `<main>`: drop `pt-20`; the first band of each page carries `pt-header`.
4. Skip link: `focus-ring` plus `bg-primary text-primary-foreground`, no `white`.
5. `ui/input.tsx`, `ui/textarea.tsx`, `ui/label.tsx`, `ui/button.tsx`: the changes
   listed in 7.8.
6. Every stock `white` / `black` class in the R0 baseline now fails `check-tokens`;
   each is fixed when its file is rewritten.

**Not decided here**

- **Crown self-draw property.** The brief asks for `stroke-dashoffset`; the motion rule
  allows only `transform` and `opacity`. The crown is built for it (`pathLength={1}`,
  the `crown-draw` class), but the rule file records only the two exceptions that were
  approved. The orchestrator should either add the exception to
  `.claude/rules/motion.md` or have the crown fade in instead.
- **Logo master.** The supplied logo has an opaque white ground, hence the plaque in
  6.8. A transparent-ground PNG or SVG from the owner would let the mark sit directly on
  ivory. To be raised in `docs/OPEN_ISSUES.md`.
- **Error colour on maroon.** None is defined; forms stay on ivory.
- **Hover colour for WhatsApp green.** None is defined; the hover is a 2px rise.
- **Information architecture, section order and copy** belong to the content and page
  builders; section 5.2 fixes only the light/dark order.
- **`performance.md`** still says fonts are declared in `layout.tsx`; they are now
  declared in `src/app/fonts.ts` and applied in `layout.tsx`.
