# Phase R4 — critique, iteration 1

Phase: R4   Iteration: 1/4   Reviewer: reviewer   Date: 2026-10-02
verify exit: 0

 1 Royal / luxury feel ........ 4/5
 2 Brand consistency .......... 4/5
 3 Typographic hierarchy ...... 4/5
 4 Colour contrast ............ 4/5
 5 Catalogue findability ...... 4/5
 6 Motion quality ............. 4/5
 7 Mobile ergonomics .......... 3/5
 8 Trust signals .............. 4/5
 9 Performance ................ 3/5
10 Accessibility .............. 4/5
                        TOTAL  38/50

Verdict: ITERATE

Verify: exit 0, all four steps pass. First Load JS: / 105, /collections 108,
/collections/[slug] 109, /gallery 109, /contact 97.6, /founders 99.9,
/testimonials 99.9, 404 87.8, shared 87.7 kB — all within budget; /founders and
/testimonials have 0.1 kB of headroom.

## Findings (major first, then minor)

Must fix for a pass: F1–F4.

F1 [major] 7 — src/components/layout/FloatingWhatsApp.tsx:31 — below md the
floating button covers content on every route (story text on founders-390, the
bone-china label in state-header-scrolled-390, the card title in
state-filtered-grid-390, "Surat" in state-contact-panel-390), 16px above a bar
that already carries WhatsApp. Built per PRD FR7, UI_UX_V2 §7.3 and the brief,
so this is quality, not a rule breach. Fixed: the owner's recorded answer to
O31 plus F2's evidence, or only the header and bar over content below md.

F2 [major] 7, 5 — src/components/collections/QuoteBasket.tsx:228 — the stacked
quote-list + WhatsApp buttons at 390px have no screenshot (the basket is empty
in state-filtered-grid-390; the sheet is open in state-quote-list-390). By
geometry the circles (x 318–374) overlap the right ~35px of a right-column
"Add to quote" button in the 80–208px band from the bottom. Fixed: a capture
with an item in the basket, an elementFromPoint tap check, and a change if the
card action is intercepted.

F3 [major] 9 — docs/evidence/R4/lighthouse.log; next.config.mjs:29 — the only
full run has /collections/chafing-dishes at 92 (LCP 3.4s); re-runs are single
samples at exactly 95 (chafing-dishes, gallery); the 520 image candidate was
added afterwards and only / was re-measured (96, 2.8s). Fixed: three
sequential uncontended runs of all 8 mobile routes on the final build, medians
recorded, all ≥ 95.

F4 [major] 9 — .claude/rules/performance.md:9 — LCP misses 2.5s on 5 of 8
mobile routes (/ 2.8–2.9, /collections 2.6, bone-china 2.7, chafing-dishes
2.9, gallery 2.9). On / the LCP element is the arch photograph (48 kB at
w=520); the value is the simulated-throttling model on localhost. Caps the
item at 4. Fixed: an OPEN_ISSUES line with the numbers, and a deployed-origin
measurement or fewer bytes (next.config.mjs:23 serves WebP only).

F5 [minor] 1 — src/components/home/TrustStrip.tsx:8-13,41 — stock lucide
icons over four numbers read as a template stat block; Utensils is a fork and
knife on a bone-china fact; faint at 2.21:1. Fixed: no icons, or the house's
own ornament.

F6 [minor] 1 — src/components/home/FeaturedCollections.tsx:48,52 — the 40px
offset breaks the caption baseline across the row and leaves dead space in
tiles 2 and 4. Fixed: aligned tiles, or offset the arch only.

F7 [minor] 1, 2 — src/components/layout/Header.tsx:53-60;
src/components/home/HomeHero.tsx:64 — three calls to action with the same
WhatsApp destination in the first viewport at every width; §7.1a describes
the gold button as the one action on an ivory page. Fixed: one of the three
does a different job.

F8 [minor] 2 — src/content/home.ts:209,228; src/content/site.ts:283,290,297,316
— five labels for the same WhatsApp action; R4's labels are Title Case, the
rest of the site is sentence case. Fixed: one casing rule, at most two wordings.

F9 [minor] 2 — src/content/site.ts:152 vs :438 — nav says "Our Story", the
page title says "Founders —" and the h1 "Three Generations, One Promise"
(COPY_TO_CONFIRM 10.5).

F10 [minor] 3 — tailwind.config.ts:126,130 — at 390px the h1 is 40px and the
trust numerals 44px; h1 to h2 is 40 to 32.

F11 [minor] 3 — src/components/home/HowItWorks.tsx:53 — step titles wrap
1/2/1 lines at 1280 and 1/2/2 at 768, so bodies start at different heights;
"Generations of the / family" orphan at 768 (TrustStrip.tsx:46).

F12 [minor] 4 — src/components/ui/button-variants.ts:37 (Header.tsx:55) — the
gold fill's edge on the solid header is 1.80–2.21:1; a11y.md:30 says gold-500
on ivory is never a control boundary; the pair is listed only under "On
maroon" (a11y.md:42). Label is 7.48–10.77. Fixed: a table row for this button
on ivory, or a 1px gold-700 edge.

F13 [minor] 4 — src/components/layout/Footer.tsx:44-47; .claude/rules/a11y.md:51
— the glow over maroon-950 is not in the allowed-pairs table. Ratios pass
(ivory-50 12.08, ivory-300 8.33, gold-300 7.88, gold-500 icons 5.47). Fixed:
add the row to a11y.md and color-system.md.

F14 [minor] 4, 6 — src/components/ui/button-variants.ts:37 — the gold button
has no hover feedback under reduced motion (sheen only, no hover colour).

F15 [minor] 5 — src/content/home.ts:194,200-203 — four of eight collections
are one tap from home; the brief asked for six; "no blank arch" is a
preference, not a recorded rule (CollectionTile supports CrownPlaceholder).
O28 is the least-justified "not built".

F16 [minor] 5 — E21 (ItemCard.tsx:92, FilterBar.tsx:54 as cited there; not
re-read) is still open after a phase that touched the catalogue; the filter
chips run off the right edge at 390 with no cue.

F17 [minor] 6 — src/components/home/HowItWorks.tsx:43-46 — beads ride the
list items' 16px rise while the line draws separately. No capture of the
animated states.

F18 [minor] 6, 10 — src/components/layout/MobileDrawer.tsx:196,210-213;
src/app/globals.css:592-595 — the drawer's contact actions are invisible but
focusable for up to 440ms. Values comply with motion.md.

F19 [minor] 8 — src/content/home.ts:307 — "We deliver and collect" is an h3
while unconfirmed (O9); 2015 is a headline figure awaiting confirmation (O11).

F20 [minor] 10 — scripts/keyboard-pass.mjs — no keyboard evidence at
768–1023px, for the quote-list sheet or the item drawer; no screen-reader
pass (E6); the same WhatsApp destination under three names on phones.

F21 [minor] process — verify log is verify-iter1.log, not verify.log; E26
(HomeTestimonials.tsx:49-56) restyled with no render to check.

## "Not built" decisions

Justified by a recorded rule or decision: O25, O26, O27, O29, O30, O32, E23,
E24, E25. Weak: O28 (see F15). Honest and still open: O31 (F1, F2), E26, E27 (F5).

## Not verified

Stacked quote-list + WhatsApp buttons at 390px; animated states; Lighthouse on
the final build for 7 routes; LCP on a deployed origin; INP; HomeTestimonials
and social links rendering; gold button hover; screen reader; viewports
smaller than 390×844.
