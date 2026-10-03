# Phase R6 — critique, iteration 3

Written by the `reviewer` agent (read-only; given only the rubric, screenshots and
command output). Saved by the orchestrator, wording lightly condensed. Reviewed on HEAD
d8ff356; `verify-iter3.log` (08:16:32) postdates the last source change, and every
iteration-3 capture (08:16:50–08:19:56) is of that build.

```
Phase: R6   Iteration: 3/4   Reviewer: reviewer   Date: 2026-10-03
verify exit: 0

 1 Royal / luxury feel ........ 3/5
 2 Brand consistency .......... 4/5
 3 Typographic hierarchy ...... 4/5
 4 Colour contrast ............ 4/5
 5 Catalogue findability ...... 4/5
 6 Motion quality ............. 4/5
 7 Mobile ergonomics .......... 3/5
 8 Trust signals .............. 4/5
 9 Performance ................ 3/5   (iteration-2 numbers, build 140119f)
10 Accessibility .............. 4/5
                        TOTAL  37/50

VERDICT: STOP → OPEN_ISSUES. Items 1, 7 and 9 have scored 3 in three consecutive
iterations. 1 cannot reach 4 without photographs and portraits (O13, O40); 7 cannot
while the phone-width cover stands (O31); 9 depends on the iteration-3 numbers on HEAD,
and the 2.5 s LCP target needs a deployed origin. A fourth iteration would not move 1 or 7.
```

## Iteration-2 findings

| Finding | Status |
|---|---|
| Major 9 — numbers predate the code | Fixed for 140119f (`docs/lighthouse/iter2/`); open again for HEAD (gallery order and srcsets changed, unmeasured) |
| Major 7 — floating button covers content from 768px | Not fixed; recorded as an owner decision (E59, O31). `founders-768.png`, `contact-1280.png` |
| Major 1 — gallery presentation | Partly fixed: columns end ~235px apart at 1280 (was ~400, under a tile); no blur bars in the viewer. Photography unchanged (E58, O13) |
| Major 8 — unconfirmed hours | Not fixed; owner decision (E55, O43); "during working hours" still promised (`contact.ts:204, 243`) |
| Minor 2 — "Malad (East)" | Partly: card fixed (`founders.ts:219`); still "Malad (East), Mumbai" at `founders.ts:141` (story) and `:172` (milestone) |
| Minor 3 — pull-quotes beside their source | Fixed |
| Minor 3 — milestone years outside the heading | Fixed |
| Minor 1/8 — crown cameos for portraits | Not fixed (O40) |
| Minor 4 — badge pair not in `a11y.md` | Not fixed |
| Minor 10 — breadcrumb `aria-current` below 768px; 11 tab stops before the chips | Not fixed (R5; documented in `Breadcrumb.tsx`) |
| Minor 6 — gallery 700ms zoom | Recorded by editing the rule — see N4 |
| Housekeeping — page comment, E52 path | Fixed |
| m5 — success toast | Fixed |
| m1, m6, m7, m9, m10 | Accepted / recorded |

## New findings

1. **Major — 9.** E60 cites the five-run "median 96" (`gallery-check-iter2/`) rather than
   the official iteration-2 median of **90** (86–97); HEAD then changed the gallery's
   priority tile and every srcset, unmeasured, and E60 cites a `docs/lighthouse/iter3/`
   that does not exist yet. Fix: state the 90; file iteration-3 JSON before citing it.
   Builder: the record. Owner/host: the 2.5 s LCP on a deployed origin.
2. **Major — 7.** The floating button covers text or a CTA at every width: story text at
   320 (`states/w320-founders.png`), "Call us" at 390 (`testimonials-390.png`), a
   milestone heading at 768, form help at 1280 (`FloatingWhatsApp.tsx:39`). From 768px a
   right gutter on content columns, or the button in the side margin, keeps it "on every
   width" and needs no decision. Builder: 768px up. Owner: below 768px (O31).
3. **Major — 1.** The three weak photographs now sit together at the bottom of column 4
   at 1280 — about 1.5 screens down, a run of shelf / red cloth / gravel
   (`galleryLayout.ts:138–142`, `gallery-1280.png`). Spread them, one per column end, or
   leave them out of the gallery until re-shot. Builder: placement. Owner: photographs.
4. **Minor — 1/5.** The viewer shows the tile's crop (`GalleryGrid.tsx:445, 462`), not the
   whole photograph the lead promises. Trim the letterbox bars in the pipeline and use
   `object-contain`.
5. **Minor — 10 / FR6.** A failed send is shown only by a toast that disappears, and it
   covers the Event date label (`states/contact-390-send-failed.png`;
   `ContactForm.tsx:127–131`). Add a persistent inline `role="alert"` message.
6. **Minor — 3.** Pull-quotes share `type-h3 text-heading` with the section headings
   (`FoundersStory.tsx:52` vs `:35`); at 390 the first reads as a heading. Give them their
   own style.
7. **Minor — 2.** "Malad (East)" vs "Malad, Mumbai" (`founders.ts:141, 172`).
8. **Minor — 6 / process.** The builder extended the owner's "card hover" exception to the
   gallery tiles (`.claude/rules/motion.md:79–80`, f567844) with no owner approval
   recorded. Fix: an O-entry asking the owner, or `duration-enter` on the tiles.
9. **Minor — housekeeping.** `COPY_TO_CONFIRM.md:401` quotes the old card copy
   ("Malad (East)"); `:403` names `pullQuote` with the old placements; stale comments at
   `ContactForm.tsx:54` ("answered with a toast") and `FoundersStory.tsx:15`.
10. **Minor — 4.** The quote-count badge pair (`maroon-950` on `gold-500`) is still not in
    the allowed table in `a11y.md`.

## PRD cross-check

| Req | Status | Evidence |
|---|---|---|
| FR1 | partial | hero, stats, four collections; PRD badges owner-gated |
| FR2 | partial | history, timeline, three named people; no portraits (O40); quotes are story excerpts (O42) |
| FR3 | pass | `collections-bone-china-390.png`; test-catalogue; no prices |
| FR4 | fail (owner-blocked) | product shots only (O13) |
| FR5 | fail (owner-blocked) | honest empty state, noindex (O12, O44) |
| FR6 | partial | form states pass (`r6-pass-iter3.log`); placeholder Web3Forms key (O14); live map unseen (E49); unconfirmed hours (O43); failure by toast only |
| FR7 | pass, with defect | covers content 320–1280 |
| FR8 | pass | `keyboard-pass-iter3.log`; drawer capture |
| FR9 | partial | 320 / 200% zoom pass; Lighthouse /gallery 90 on 140119f; HEAD unmeasured at review time |
| FR10 | pass, conditional | `seo-with-site-url.txt`; production must set `NEXT_PUBLIC_SITE_URL` |
| NFR1 | pass | bar, drawer, swipe |
| NFR2 | not met / not verified | LCP 2.3–3.2 s under simulated slow 4G |
| NFR3 | partial | axe 0 and A11y 100 on 140119f; keyboard on HEAD; no screen-reader pass (E40) |
| NFR4 | partial | typed content needs a redeploy; catalogue needs the Python pipeline |
| NFR5 | open (owner) | Vercel Hobby non-commercial, or static export (E54) |

## What remains, and who can move it

**Builder, no owner input:** the floating button's gutter from 768px; spread the weak
photographs; the viewer crop (`object-contain` with bars trimmed at source); an inline
failed-send message; the pull-quote style; "Malad (East)"; the E60 figure and its
citation; COPY §12.1 / §12.3 and the stale comments; the badge pair in `a11y.md`; an
owner entry for the gallery zoom exception. Done or written into `OPEN_ISSUES.md`.

**Owner only:** O13 photographs and O40 portraits (item 1); O31 the floating button on
phones (item 7); O43 hours (item 8, FR6); O14 Web3Forms key; O12 testimonials (FR5);
E54 hosting plan or static export (NFR5); a deployed origin to measure LCP (item 9, NFR2).
