# Phase R4 — global layout, home page, motion primitives

The brief predates R1–R3. Its six motion primitives, the header, drawer, footer,
bottom bar, skip link and the seven home sections already existed; `motion` was
installed in R1 and AOS was already gone (nothing installed, nothing removed).
R4 closed the gaps between the brief and the site. What was not built, and why:
`docs/OPEN_ISSUES.md` → Phase R4 (O25–O32, E23–E27). Copy: `docs/COPY_TO_CONFIRM.md` §10.

## Changed

| Area | Change | Files |
|---|---|---|
| Hero | `h1` is the tagline, "An Occasion with Dignity"; buttons relabelled; the display size floor is 44px (was 40) so the `h1` is never smaller than the stat numerals | `src/content/home.ts`, `tailwind.config.ts` |
| Header | gold "Get a quote" → WhatsApp with a quote request to fill in, from `md`; nav label "Our story"; the gold button has a `gold-700` edge | `layout/Header.tsx`, `content/site.ts`, `ui/button-variants.ts` |
| Drawer | links at `type-h2` (32px at 390) staggered in; the contact actions stay out of the stagger | `layout/MobileDrawer.tsx`, `app/globals.css` |
| Floating WhatsApp | shown at every width; 16px above the bottom bar below `md`; own landmark label. Below `md` it gives its slot to the quote-list button when that is on the page | `layout/FloatingWhatsApp.tsx`, `collections/QuoteBasket.tsx`, `shared/README.md` |
| Trust strip | a gold icon over each figure | `home/TrustStrip.tsx` |
| Featured collections | every second arch 40px lower from `lg` | `home/FeaturedCollections.tsx` |
| How hiring works | one gold line drawn through the steps from `md`, a still bead per step on the line; the brief's step titles, with room for two lines so the bodies start level | `home/HowItWorks.tsx`, `motion/DrawLine.tsx` |
| Testimonials preview | gold left border (renders nothing today — not visually checked) | `home/HomeTestimonials.tsx` |
| Closing band | gold-gradient hairline on top; heading "Planning an event? Let us set the table." | `home/HomeClosingCta.tsx` |
| Footer | three columns; gold-gradient hairline and candle glow on the top edge; social links only when their env vars are set | `layout/Footer.tsx`, `lib/env.ts`, `.env.example` |
| Images | a 520px candidate for the hero photograph (68 kB → 47 kB on a phone). AVIF was tried and not kept: no gain on `/` | `next.config.mjs` |
| Contrast | three new computed pairs: the gold button's edge on ivory and on the solid header, icons under the footer glow | `scripts/contrast.mjs`, `.claude/rules/a11y.md`, `docs/color-system.md` |
| QA tooling | scripted keyboard / drawer / reduced-motion / CLS pass | `scripts/keyboard-pass.mjs` |

## Evidence

| What | Where |
|---|---|
| verify, final (exit 0) | `verify.log` (same run as `verify-iter2.log`); iteration 1: `verify-iter1.log` |
| every route × 390 / 768 / 1280 / 1920, reduced motion at 390, drawer open | `iter2/` (iteration 1: `iter1/`) |
| interactive states; the quote-list button on a phone | `iter2/states/` (viewport crops of the home page: `iter1/states/crop-*.png`) |
| Lighthouse mobile, production server on localhost, **three sequential runs per route on the final build, medians** | `lighthouse.log`, `audit-final/` |
| Lighthouse, iteration 1 (mobile + desktop, one run; overlapped with another script) | `audit/lh-*.json`, `audit-rerun/` |
| Five-run checks of the two collection routes, AVIF and WebP (the bimodal LCP, E33) | `lighthouse-recheck.log` |
| axe, 8 routes × 2 widths, final build | `axe.log`, `audit/axe.json` |
| keyboard (1280, 900, 390), drawer, reduced motion, fixed buttons, CLS — final build | `keyboard-reduced-motion.log` |
| reviewer's critique (iteration 1 only) | `critique-iter1.md` |

## Iteration 2 — what the first critique changed

F2 one round button on phones · F3 three-run medians · F4 recorded as E29 and E33 (AVIF measured, not kept) · F7 the header
button's own message · F8 sentence case · F9 page title · F10 display floor 44px ·
F11 step titles, trust label balance · F12 gold button edge · F13 pairs computed ·
F17 beads on the line · F18 drawer actions out of the stagger · F20 keyboard at 900px ·
F21 `verify.log`. Left to the owner, with the reviewer's finding quoted: F1 (O31),
F5 (E27), F6 (E28), F15 (O28). Not changed: F14 (E30), F16 (E31), F19 (O9, O11).

## Where the phase stands

**INCOMPLETE, with open issues.** Iteration 1 was scored by `reviewer` (38/50, ITERATE:
`critique-iter1.md`). Iteration 2 was built and measured but **has not been scored** — there
is no `critique-iter2.md`.

Final build, measured:

| | |
|---|---|
| verify | exit 0 (`verify.log`) |
| keyboard / drawer / reduced motion / CLS | 43 pass, 0 fail (`keyboard-reduced-motion.log`) |
| axe | 0 violations, 8 routes × 2 widths (`axe.log`) |
| Lighthouse Accessibility | 100 on all 8 routes |
| Lighthouse Performance, mobile, median of 3 | `/` 96 · `/collections` 97 · bone-china **86** · chafing-dishes **88** · founders 99 · gallery 95 · testimonials 97 · contact 98 |
| LCP, mobile, median of 3 | `/` **2.79s** · `/collections` **2.56s** · bone-china **4.27s** · chafing-dishes **3.86s** · founders 2.26s · gallery **2.94s** · testimonials **2.57s** · contact 2.33s (target < 2.5s) |
| CLS | 0 on every route |

Missed targets are in bold: OPEN_ISSUES E29 (LCP) and E33 (the two collection pages).
