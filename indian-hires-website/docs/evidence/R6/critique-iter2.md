# Phase R6 — critique, iteration 2

Written by the `reviewer` agent (read-only; given only the rubric, screenshots and
command output). Saved by the orchestrator: scores, statuses, findings, file:line
references and the PRD table as the reviewer gave them, wording lightly condensed.
Reviewed on HEAD 2be3655 (source identical to 140119f; verify-iter2 ran after the last
source change).

```
Phase: R6   Iteration: 2/4   Reviewer: reviewer   Date: 2026-10-03
verify exit: 0 (docs/evidence/R6/verify-iter2.log)

 1 Royal / luxury feel ........ 3/5
 2 Brand consistency .......... 4/5
 3 Typographic hierarchy ...... 4/5
 4 Colour contrast ............ 4/5
 5 Catalogue findability ...... 4/5
 6 Motion quality ............. 4/5
 7 Mobile ergonomics .......... 3/5
 8 Trust signals .............. 4/5   (was 3)
 9 Performance ................ 3/5   (iteration-1 numbers: /gallery 93)
10 Accessibility .............. 4/5   (was 3; iteration-1 numbers, older build)
                        TOTAL  37/50

Verdict: ITERATE. Items 1, 7 and 9 have scored 3 in two consecutive iterations →
written to OPEN_ISSUES now (QA_LOOP).
```

Build table (verify-iter2): every route within budget; `/founders` and `/testimonials`
at 99.8/100 kB.

## Iteration-1 findings

| # | Status | Evidence |
|---|---|---|
| B1 stale verify | **Fixed** | verify-iter2 after the last source change; captures in `iter2/` |
| M1 floating WhatsApp covers content | **Partly fixed** — rest is an owner decision (O31, E56) | Below 768px it hides while a field has focus (`FloatingWhatsApp.tsx:39`). Still over content: `contact-1280.png` (helper text), `founders-768.png` (timeline heading), `testimonials-390.png` ("Call us"), `home-390.png` (hero arch). The md+ part needs no owner decision |
| M2 founder role contradiction | **Fixed** (wording to the owner, COPY §12.1–12.2) | third card; `founders.ts:216`; `founders-1280.png` |
| M3 unconfirmed hours | **Not fixed** — kept by the builder (E55, O43) | `contact.ts:166–172`; no caveat in `contact-390/1280.png` |
| M4 empty map box | **Fixed** | `ContactMap.tsx:24–37`; the live embed is unseen (E49) |
| M5 OG / canonical / sitemap | **Fixed** | `seo-with-site-url.txt` |
| M7 static export | **Recorded, not decided** | E54 says "Vercel host", against non-negotiable 1; with Vercel Hobby non-commercial it conflicts with NFR5 until the owner chooses |
| M6 gallery photography | **Not fixed** (E57 → O13) | `gallery-1280.png`: columns end ~400px apart; weak shots sit high (red cloth, shop shelves); `states/gallery-1280-lightbox.png` shows blur bars and a laser dot. Balance, order and crop need no new photographs |
| m1 logo tile | Not fixed (O13) | `BrandLogo.tsx:38–53` |
| m2 footer logo | **Fixed** | `Footer.tsx:52` |
| m3 404 colour | **Fixed** | `not-found.tsx:28` |
| m4 literal years | **Partly** | still literal: `founders.ts:144` ("In 2023 … in 1977"), milestone `year: 1977` / `2001` (`:158, :164`) |
| m5 success toast | **Partly** | below the header now (`Providers.tsx:26`) but repeats the panel and covers "Open in Google Maps" (`states/contact-390-success.png`) |
| m6 gallery tab order | accepted, documented in code only | `galleryLayout.ts:14–15` |
| m7 captions on pointer devices | accepted | — |
| m8 touch-captions capture | **Fixed** | `iter2/states/gallery-390-touch-captions.png`; E52 cites the `iter1/` path |
| m9 metals | recorded (O6) | — |
| m10 landlines | recorded (COPY §12.6) | — |
| m11 `allLabel` | **Fixed** | — |

## New findings

**Major — 9.** The measured numbers predate the code: iteration-1 Lighthouse and axe ran
on the 07:32 build; the R5 merge (`59d4b62` via `3b4a5f1`) changed `/collections*`,
which have not been measured in their R6 form (E48 recorded 85–92 for an R5 state). The
commit 140119f's "93 → 96 over five local runs" has no file in `docs/lighthouse/`. Fix:
iteration-2 run on all routes on HEAD, JSON under `docs/lighthouse/iter2/`.

**Major — 7.** From 768px the floating button reserves no space
(`FloatingWhatsApp.tsx:39`, `md:bottom-6 md:right-6`): over helper text at 1280
(`contact-1280.png`), the timeline heading at 768 (`founders-768.png`). Fix: a right
gutter / `scroll-padding` from 768px, or move it off text columns; keep 390 with O31.

**Major — 1.** Gallery presentation (from M6): `interleaveByCollection`
(`galleryLayout.ts:54–71`) ignores column height and photo quality. Fix: an order that
ends the four columns within a tile at 1280, the weak shots last, the letterboxed
sources cropped so the lightbox shows no blur bars.

**Major — 8 / FR6.** Unconfirmed hours as fact (M3) — and the success copy
(`contact.ts:243`) promises a reply "during working hours". Fix: sign-off or hide.

**Minor — 2.** `founders.ts:207` writes "Malad (East), Mumbai" while the role above it
reads `brand.foundedPlace` ("Malad, Mumbai"). One source.

**Minor — 3.** Pull-quotes repeat the sentence just above them (`FoundersStory.tsx:48–52`;
"Carried forward across generations…" a few lines under the same words). Place them
away from their source sentence, or drop them until O42.

**Minor — 3.** Milestone years (`type-stat`) compete with the "Milestones" h2 and sit
outside the h3, so heading navigation hears titles without years
(`MilestoneTimeline.tsx:44–48`). Put the `<time>` in the h3 or use a smaller size.

**Minor — 1 / 8.** Three identical crown cameos (`founders-1280.png`) read as
unfinished. O40 (portraits).

**Minor — 4.** The quote-count badge, `maroon-950` on `gold-500` outside `.theme-dark`
(R5 E45 N10), is not in `a11y.md`.

**Minor — 10.** Breadcrumb has no `aria-current` item below 768px (R5 E45 N12); eleven
tab stops before the first filter chip (R5 E42); no axe or Lighthouse on HEAD.

**Minor — 6.** Gallery tiles use the 700ms `duration-zoom` (`GalleryGrid.tsx:388`);
the motion rule's exception names card images. List the tiles in the exception or use
`duration-enter`.

**Minor — housekeeping.** `gallery/page.tsx:41` says heads at 2, 3 and 4 columns load
eagerly; `galleryLayout.ts:120` uses the phone's two only. E52 cites a non-existent path.

## PRD cross-check

| Req | Status | Evidence |
|---|---|---|
| FR1 | partial | hero, stats strip, four collections; PRD badges owner-gated |
| FR2 | partial | history, timeline, three named people; no photos (O40); quotes are story excerpts (O42) |
| FR3 | pass | `collections-390.png`, `collections-bone-china-1280.png`; price tests |
| FR4 | fail (owner-blocked) | product shots only; `eventPhotos` empty (O13) |
| FR5 | fail (owner-blocked) | honest empty state, noindex (O12, O44) |
| FR6 | partial | links and form states pass (`r6-pass-iter2.log`); placeholder Web3Forms key (O14); live map unseen (E49); unconfirmed hours |
| FR7 | pass, with defect | covers content at 768 and 1280 |
| FR8 | pass | `keyboard-pass-iter2.log` |
| FR9 | partial | 320px and 200% zoom pass on 8 routes; Lighthouse: iteration-1 /gallery 93, /collections* unmeasured on HEAD |
| FR10 | pass, conditional | `seo-with-site-url.txt`; production must set `NEXT_PUBLIC_SITE_URL` |
| NFR1 | pass | drawer, bar, lightbox swipe |
| NFR2 | not met / not verified | mobile LCP 2.2–3.3 s under simulated slow 4G |
| NFR3 | partial | iteration-1 axe 0, Lighthouse A11y 100 (older build); keyboard pass on HEAD; no screen-reader pass (E40) |
| NFR4 | partial | typed content needs a redeploy; catalogue needs the Python pipeline |
| NFR5 | open (owner) | redirects and image optimisation need a host (E54) |

## For iteration 3

The md+ button gutter, gallery order / balance / crop, pull-quote placement, literal
years; item 9 needs HEAD Lighthouse JSON for all routes. If items 1 and 7 still sit at 3
after that, only the owner can move them (O13, O31) → STOP → OPEN_ISSUES.
