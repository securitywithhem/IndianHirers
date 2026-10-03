# Phase R6 — critique, iteration 1

Written by the `reviewer` agent (read-only, given only the rubric, screenshots and
command output). The reviewer may not write files, so the orchestrator saved its report
here: scores, findings, file:line references and the PRD table as the reviewer gave
them, the wording lightly condensed.

```
Phase: R6 (final audit)   Iteration: 1/4   Reviewer: reviewer   Date: 2026-10-03
verify exit: 0 (docs/evidence/R6/verify-iter1.log) — STALE, see B1

 1 Royal / luxury feel ........ 3/5
 2 Brand consistency .......... 4/5
 3 Typographic hierarchy ...... 4/5
 4 Colour contrast ............ 4/5
 5 Catalogue findability ...... 4/5
 6 Motion quality ............. 4/5
 7 Mobile ergonomics .......... 3/5
 8 Trust signals .............. 3/5
 9 Performance ................ 3/5   (capped: no measured Lighthouse numbers)
10 Accessibility .............. 3/5   (capped: no measured Lighthouse/axe numbers)
                        TOTAL  35/50

Verdict: ITERATE
```

## Findings

### Blocker

**B1 — Process / items 9, 10 — verify log and screenshots predate the committed code.**
`verify-iter1.log` (07:32:34) predates the QuoteBasket → QuoteBasketButton split
(07:37:36) and its two importers, all in commit 777c5aa; the `/collections*` routes in
the commit therefore have no build-table, lint or typecheck evidence. Fixed looks like:
re-run `npm run verify` on HEAD as `verify-iter2.log`; re-capture `/collections*`.

### Major

**M1 — Item 7 — floating WhatsApp covers content and controls.**
`src/components/layout/FloatingWhatsApp.tsx:36`. `states/contact-390-errors.png`: over
the right edge of the textarea while fixing errors; `testimonials-390.png`: covers the
"Call us" button; `founders-768.png`: clips the "A new chapter in Vadodara" heading;
`contact-1280.png`: overlaps the phone helper text. Below `md` it duplicates the bottom
bar's WhatsApp. Violates rubric 7 anchor 5 ("never covering content"). Fixed: below
`md` hide it where the bar is shown; from `md` reserve a right gutter or bottom padding.

**M2 — Item 8 — founders page contradicts itself.** `src/content/founders.ts:133,159`:
Mr. Jasvantlal Satilal Gabhawala set up the first shop in 1977; `founders.ts:203`
labels Nikesh "Founder", shown on `founders-1280.png`. "Three Generations" is promised
but two people are named; the 1977 founder has no card. Fixed: a role that matches the
story (e.g. "Vadodara, since 2001") or the owner's confirmed wording in COPY_TO_CONFIRM.

**M3 — Item 8 / FR6 — unconfirmed hours shown as fact.** `src/content/contact.ts:166–173`
has `TODO(owner): confirm the hours … placeholder`, but `contact-390.png` /
`contact-1280.png` show "Mon–Sat: 9:00 AM – 7:00 PM" and five service cities with no
caveat. Fixed: hide Hours and Service areas until O10 is confirmed, or get sign-off.

**M4 — Item 1 / FR6 — the map renders as an empty 4:3 box.** `contact-390.png`,
`contact-1280.png`: a blank `bg-muted` rectangle above "Open in Google Maps"
(`src/components/contact/ContactMap.tsx:15–23`). There is no fallback, so a blocked or
slow embed looks broken. Fixed: a static, labelled placeholder inside the box (address
and "Open in Google Maps") that the iframe paints over, and a capture with the map loaded.

**M5 — FR10 / item 10 — OG image, canonical and sitemap are not emitted.**
`NEXT_PUBLIC_SITE_URL` is empty in `.env.local`, so `pageMetadata.ts:28` returns no
images, `:44,:51` drop canonical and `og:url`, `sitemap.ts:15` returns `[]`; robots.txt
has no `Sitemap:` line. The gating is correct; nothing is evidenced with the variable
set. Fixed: a build with a staging `NEXT_PUBLIC_SITE_URL`, the `<head>` of two routes
showing `og:image`, `twitter:card=summary_large_image` and the canonical, and a
populated sitemap.xml.

**M6 — Item 1 — gallery photography reads as non-premium.** `gallery-1280.png`,
`states/gallery-1280-lightbox.png`: phone photos on mismatched backdrops (gravel and
plastic sheet under "Hammered Gold", red cloth under "Silver Chafer", shop shelves with
a laser dot under "Round Brass"); the lightbox shows baked-in blurred letterbox bars;
at 1280 the columns end ragged (column 4 about 400px above column 1). Photos are O13;
presentation is not. Fixed: crop to subject, lead with the strongest images, balance
column lengths.

**M7 — Static-export non-negotiable / NFR5 — `next.config.mjs` is not static-export
friendly.** `next.config.mjs:36–38` uses `redirects()`, and the default `next/image`
optimiser needs a server; neither works with `output: "export"`. CLAUDE.md
non-negotiable 1 requires "Static-export friendly". Fixed: record the decision ("Vercel
host, not static export") in OPEN_ISSUES, or switch to `output: "export"` with
`images.unoptimized` or a static loader and page-level redirects.

### Minor

- **m1 — Item 2.** Header and footer logo is the JPEG on a white tile
  (`src/components/shared/BrandLogo.tsx:18–20`); at 80px the wordmark is unreadable.
  Needs the transparent logo master (O13) or a crest-only crop.
- **m2 — Item 10.** Footer logo is not decorative (`src/components/layout/Footer.tsx:52`),
  so screen readers hear the crest name right before the visible "Indian Hirers".
  `a11y.md`: repeated logos `alt=""`. Fixed: `decorative`.
- **m3 — Item 4.** The 404 "404" is `gold-sheen bg-clip-text text-transparent`
  (`src/app/not-found.tsx:28`); gold-500 over the candle glow is listed "not allowed"
  (4.22). Passes 3:1 as large text, but the pair is not in the allowed table. Fixed:
  `text-kicker`.
- **m4 — Item 3 / content rule.** Story paragraphs hard-code "1977" and "2001"
  (`src/content/founders.ts:133,134,143`) rather than `brand.foundedYear` /
  `brand.vadodaraSinceYear`. One fact, one place.
- **m5 — Item 7.** On the success state the toast covers the header and logo
  (`states/contact-390-success.png`) and repeats the panel. Fixed: drop the success
  toast when the panel shows, or anchor toasts below the header.
- **m6 — Item 10.** Gallery tab order runs down each CSS column, while at 1280 people
  read across rows. Borderline for "focus order follows visual order". Fixed: accept
  and document it, or a row-major masonry.
- **m7 — Item 5.** On pointer devices gallery captions are hidden at rest, so a desktop
  visitor scanning for a name must hover each tile. Acceptable.
- **m8 — Item 6.** The 390 full-page gallery capture shows half-faded captions; the
  promised `states/gallery-390-touch-captions.png` does not exist (`w320-gallery.png`
  shows legible captions — treated as a capture artefact).
- **m9 — Item 8.** Gallery and catalogue names state metals O6 says are unconfirmed.
- **m10 — FR6.** The phone check accepts Indian mobiles only
  (`src/lib/validations/contact.ts`); a banquet-desk landline (0265-…) is rejected.
- **m11 — Housekeeping.** `gallery.allLabel` ("All") is unused (`src/content/gallery.ts:104`).

## PRD cross-check

| Req | Status | Evidence |
|---|---|---|
| FR1 Homepage: hero, trust badges, featured categories | partial | Hero and 4 featured collections in `home-390/1280.png`; trust is the stats strip; the four PRD badges are unconfirmed and not rendered (`site.ts`, O24) |
| FR2 Founders: photos, quotes, history | partial | History and timeline in `founders-1280.png`; no photos (`founders.ts` `portrait: null`); "quotes" are story excerpts, not founder quotations; role contradiction M2 |
| FR3 Category grid, no pricing | pass | `collections-390.png`, `collections-bone-china-390.png`; `test-catalogue.log` price checks |
| FR4 Gallery of real event setups | fail | `gallery.ts` `eventPhotos = []`; product shots only |
| FR5 Testimonials, home and page | fail (owner-blocked) | `testimonialList.ts` empty; honest empty state, noindex (O12) |
| FR6 Contact: form, call, WhatsApp, map | partial | tel and wa.me pass (`r6-pass-iter1.log`); form uses a placeholder Web3Forms key (live send unverified, O14); map box blank (M4); unconfirmed hours (M3) |
| FR7 Floating WhatsApp on all pages | pass, with defect | `layout.tsx`, `FloatingWhatsApp.tsx`; covers content (M1) |
| FR8 Mobile bottom bar | pass | `MobileBottomBar.tsx`; 56px targets; every 390 capture |
| FR9 Responsive, Lighthouse ≥ 95 | partial | 320px and 200% zoom: no horizontal scroll on every route (`r6-pass-iter1.log`); Lighthouse not available to the reviewer |
| FR10 SEO metadata on every page | partial | per-route title/description in `site.ts`; canonical / og:url / og:image / sitemap suppressed without SITE_URL (M5) |
| NFR1 Mobile-first, app-like | pass | bottom bar, drawer (`home-390-drawer-open.png`), lightbox swipe |
| NFR2 < 2s on 3G | not verified | no measurements available to the reviewer |
| NFR3 WCAG 2.1 AA | partial | scripted keyboard/lightbox/form pass; no axe, Lighthouse or screen-reader pass available (E6); m2, m3, m6 |
| NFR4 Maintainable without a developer | partial | copy in typed `src/content/*.ts`, but changes need TS edits and a redeploy; the catalogue needs the Python pipeline |
| NFR5 Zero infrastructure cost | partial | no API routes or DB; relies on redirects and image optimisation (`next.config.mjs`) and Vercel Hobby (M7) |

## Not verified by the reviewer

Lighthouse and axe (measured by `qa-a11y-perf`, not available at scoring time); verify
on HEAD (told not to run it — server live); the map embed; real Web3Forms delivery;
`<head>` with SITE_URL set; a screen-reader pass (E6).

## For iteration 2, in order

Re-verify HEAD (B1) → fix M1–M4 → SITE_URL-on metadata evidence (M5) → record the
static-export decision (M7) → bring in Lighthouse/axe so items 9 and 10 can be scored.
