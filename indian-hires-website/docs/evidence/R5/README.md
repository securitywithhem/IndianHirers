# Phase R5 — collections experience

The brief predates R1–R4. Filters in the URL, the layout animation, the item dialog,
the quote list with `sessionStorage`, per-collection metadata, `notFound` for unknown
slugs and the sitemap entries already existed. R5 closed the gaps between the brief and
the site. What was not built, and why: `docs/OPEN_ISSUES.md` → Phase R5. Copy:
`docs/COPY_TO_CONFIRM.md` §11. Keyboard walkthrough: `docs/QA_NOTES.md`.

## Changed

| Area | Change | Files |
|---|---|---|
| Collection tabs | A row of links — "All" and the eight collections — on both catalogue routes. From 768px it sticks under the header; on a phone it scrolls sideways with snap and is not sticky (iteration 2). A current tab past the right edge is brought into view. Not prefetched | `collections/CollectionTabs.tsx`, `collections/TabStrip.tsx`, `collections/classes.ts` |
| `/collections` | `h1` "Our collections"; a closing maroon strip, "Not sure what you need?", with a WhatsApp button that asks for the guest count | `app/collections/page.tsx`, `content/collections.ts`, `content/site.ts` |
| Breadcrumb | Home / Collections / title, replacing the single back link | `collections/Breadcrumb.tsx`, `app/collections/[slug]/page.tsx` |
| Filter bar | Each group is its own row with its label always visible; on a phone a row's chips scroll sideways with snap (closes the scroll-cue part of E21) | `collections/FilterBar.tsx` |
| Cards and rows | A material, finish or piece that is already a whole word of the item's name, singular or plural, is not printed under it ("Mug / Mug", "Serving Spoons / Serving Spoon"; E21), nor a piece that repeats the line above it ("Glass / Glass") | `collections/catalogueView.ts` |
| Item dialog | Finishes as chips; "Add to quote" above "Ask on WhatsApp"; the App_Flow message where no piece is confirmed | `collections/ItemDrawer.tsx`, `collections/ItemRow.tsx` |
| Quote list | The floating button is named "Quote list (n)": a labelled pill from 768px, a 56px circle with a count badge on a phone (iteration 2); the sheet has a free-text field for the event date and guest count, kept in `sessionStorage` and sent as the last line of the one message | `collections/QuoteBasket.tsx`, `collections/QuoteSheet.tsx`, `lib/catalogue.ts` |
| Empty collection | "Collection coming soon — WhatsApp us for current stock", larger crown | `app/collections/[slug]/page.tsx` |
| SEO | `ItemList` JSON-LD on every collection page that lists items (no offers, no prices). **In the build that was verified `NEXT_PUBLIC_SITE_URL` is empty (O1), so each entry carries a name and a position only, and `/sitemap.xml` is empty**; absolute `url` and `image`, and the eight collection URLs in the sitemap, are covered by the unit tests with a test domain | `lib/catalogue.ts`, `app/collections/[slug]/page.tsx` |
| Performance | One preloaded photograph per collection page instead of two; the quote sheet is loaded with `React.lazy` instead of `next/dynamic` (iteration 2: 1.2 kB off both routes) | `app/collections/[slug]/page.tsx` |
| Tests and QA tooling | Note in the message, `ItemList`, sitemap covers all eight collections; a scripted catalogue pass | `scripts/test-catalogue.cjs`, `scripts/collections-pass.mjs` |

## Evidence

Everything below was run in place. **Final state: the owner's four decisions of 3 Oct
2026** (one column on phones, "Vintage Collection" tab, sticky tabs and the labelled
pill on phones) — `verify.log` (= `verify-iter3.log`), every log, `iter3/` and
`lighthouse.log` are from that code. It has not been scored by the reviewer (E47). The
paragraph and the rows below describe iteration 2 where they say so.

After the second review three small changes were
made (a piece label that repeats the line above it is not printed; the character limit
in the hint is derived; a comment). `verify.log`, `test-catalogue.log`,
`collections-pass.log`, `keyboard-reduced-motion.log`, `axe.log` and the glassware
captures are from that final code. **Lighthouse and the other captures are from the
iteration 2 build, before those three changes, and the changes were not re-scored by
the reviewer.**

| What | Where | Result |
|---|---|---|
| verify (lint, typecheck, build, tokens) | `verify.log` (iterations: `verify-iter1.log`, `verify-iter2.log`) | exit 0 |
| catalogue unit tests | `test-catalogue.log` | all pass |
| deep link, keyboard walkthrough at 1280 and 390, structure, storage blocked, reduced motion, tap check under the quote button, axe on five states × two widths | `collections-pass.log` | 112 pass, 0 fail |
| R4 keyboard / drawer / reduced-motion / CLS pass, re-run | `keyboard-reduced-motion.log` | 43 pass, 0 fail |
| axe, 8 routes × 390 and 1280 | `axe.log`, `audit/axe.json` | 0 violations |
| Lighthouse, production build on localhost, three sequential runs, nothing else running | `lighthouse.log`, `audit/run1..3/` (earlier: `lighthouse-iter1.log`, `lighthouse-iter2.log`) | below |
| `/collections` and all eight collection pages × 390 / 768 / 1280 / 1920, reduced motion at 390 | `iter3/` (earlier: `iter1/`, `iter2/`) | 46 files, 0 failures |
| states: deep link, tabs stuck at 1280, item dialog (also reduced motion), pending-detail note, quote button, quote list with the note | `iter2/states/` | 25 files |
| reviewer's critiques | `critique-iter1.md`, `critique-iter2.md` | 38/50, then 39/50; item 9 (Performance) 3/5 both times |

All measurements are from `next start` on `http://localhost:3001` (HTTP/1.1, Lighthouse's
simulated slow 4G). Nothing was measured on a deployed origin (E4).

**Iteration 1 capture failure.** `/collections/premium-melamine` timed out waiting for
network idle at 1280 and 1920 in iteration 1 (`iter1/screenshots.log`), so those two
files do not exist in `iter1/`. It did not happen in the run before it or in iteration 2
(`iter2/screenshots.log`: 46 ok, 0 problems), and Lighthouse loads the page in all
three runs. **Not explained** (OPEN_ISSUES E43).

### First Load JS

| Route | R4 | R5 iteration 1 | R5 final | Ceiling |
|---|---|---|---|---|
| `/collections` | 108 kB | 108 kB | 107 kB | 110 kB |
| `/collections/[slug]` | 109 kB | 110 kB | 108 kB | 110 kB |
| shared by all | 87.6 kB | 87.6 kB | 87.6 kB | 90 kB |

### Lighthouse, mobile — three runs, median (final state, after the owner's decisions)

| Route | Performance | LCP | Accessibility | CLS |
|---|---|---|---|---|
| `/collections` | 97 / 93 / 97 → **97** | 2.6 / 3.2 / 2.6s | 100 | 0 |
| `/collections/bone-china` | 89 / 85 / 85 → **85** | 3.7 / 4.4 / 4.4s | 100 | 0 |
| `/collections/premium-melamine` | 89 / 87 / 87 → **87** | 3.7 / 4.1 / 4.1s | 100 | 0 |
| `/collections/chafing-dishes` | 91 / 92 / 96 → **92** | 3.5 / 3.3 / 2.8s | 100 | 0 |
| `/collections/glassware` | 90 / 88 / 88 → **88** | 3.7 / 4.0 / 4.0s | 100 | 0 |
| `/collections/heritage-silver` | 97 / 95 / 95 → **95** | 2.6 / 2.9 / 2.9s | 100 | 0 |

Desktop: Performance 100, Accessibility 100 on all six, all three runs.

**The four photographed collection pages are below the 95 target on mobile (85–92), and
lower than in iteration 2** (`lighthouse-iter2.log`: medians 95 / 96 / 96 / 92 with two
columns). With one column the first photograph is the full width of the phone — about
four times the area and a larger file — and is now the LCP element on almost every
run. LCP is above the 2.5s target on every mobile run. See OPEN_ISSUES E33.
