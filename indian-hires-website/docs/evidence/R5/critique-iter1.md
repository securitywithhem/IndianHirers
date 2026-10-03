# Phase R5 — critique, iteration 1

Phase: R5   Iteration: 1/4   Reviewer: reviewer   Date: 2026-10-03
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
                        TOTAL  38/50   LOWEST: 7 Mobile ergonomics, 9 Performance

Verdict: ITERATE

Verify: port 3001 was free; I ran `npm run verify` twice in place, exit 0 both times, all four steps pass. My output matches `docs/evidence/R5/verify.log` apart from blank lines. `npm run test:catalogue` exit 0, ALL PASS. No server was started; the port is free at hand-back.

```
├ ○ /collections                         488 B           108 kB
├ ● /collections/[slug]                  1.76 kB         110 kB
├ ○ /contact                             1.22 kB        97.6 kB
├ ○ /founders                            218 B          99.9 kB
├ ○ /gallery                             3.72 kB         109 kB
└ ○ /testimonials                        218 B          99.9 kB
+ First Load JS shared by all            87.6 kB
==> [3/4 build] PASS
==> [4/4 tokens] node scripts/check-tokens.mjs
check-tokens: scanned 113 files in src/components, src/app
check-tokens: PASS — no raw colours or stock white/black outside the token files
==> [4/4 tokens] PASS
verify: ALL PASS
```

Clean on the points you asked about:
- No hard-coded visitor-readable strings in the R5 components or pages.
- No raw colours or stock white/black.
- No `cn` in any client component; `cn` appears only in the server components `PageHero.tsx:2` and `Band.tsx:2`.
- Nothing price-shaped; the ItemList JSON-LD has no offers.
- One `h1` per route and no skipped heading levels on either route or in either dialog.
- Five distinct nav labels (Primary, Quick contact, footer, Breadcrumb, Browse by collection).
- Tabs are 44px tall with 8px gaps; breadcrumb links are 44px tall.
- The 92 and 43 check counts match the logs, and evidence timestamps all follow the last source edit (11:15:40).

## Findings (major first, then minor)

Must fix for a pass: F1–F5.

F1 [major] 7 — `src/components/collections/QuoteBasket.tsx:22-23` — at 390px the "Quote list (1)" pill covers most of the right-column card's "Add to quote" button (`states/state-quote-button-390.png`: pill at about x 215–374 over the Green Golden card's button). The check quoted in E35 ("all 7 card buttons take a tap … when scrolled to mid-screen") tests where the pill is not. The round button it replaced covered less, as E35 admits. Breaks rubric 7 "never covering content". Fixed: the pill never overlaps a card action at 390 (icon with count below `md`, or a full-width strip docked on the bar), with an elementFromPoint check in the bottom 80–210px band.

F2 [major] 7 — `src/components/collections/CollectionTabs.tsx:34` — header (72px) plus stuck tab row (57px) plus bottom bar (64px) is 193px of fixed chrome on an 844px viewport, before Safari's own bars. On top of that sits the floating WhatsApp button, which still covers card titles (`collections-chafing-dishes-390.png` "Silver Chafer…", `collections-390.png` "Premium Melamine"; R4 F1 / O31 unanswered). E36 records it and changes nothing. Fixed: the row not sticky below `md`, or hidden on scroll-down; and O31 answered.

F3 [major] 9 — `docs/evidence/R5/lighthouse.log`; `src/app/collections/[slug]/page.tsx:44,77-80` — mobile bone-china is 96 / 88 / 90, median 90, with LCP 2.8 / 3.9 / 3.6s. That is rubric anchor 3 (85–94). LCP misses 2.5s on every mobile run of every measured route (2.6–3.9s). E33 is honest but "partly diagnosed" is not a fix. Fixed: median ≥ 95 on every catalogue route, or a deployed-origin measurement showing it.

F4 [major] 9, process — `docs/evidence/R5/iter1/screenshots.log` (last 8 lines); `docs/evidence/R5/README.md:35` — `/collections/premium-melamine` timed out on `networkidle` after 60s at both 1280 and 1920, so those two captures do not exist. The README still says "seven catalogue routes × 390 / 768 / 1280 / 1920" and never mentions the failure. A production page that does not reach network idle in 60s is unexplained and may be a real defect. Premium Melamine (9 designs, 7 photographs, the heaviest collection), Glassware, Regular Melamine and Chat Plates have no Lighthouse run. Glassware and Regular Melamine have no screenshot at any width. Fixed: the timeout explained, all eight slugs captured at four widths, Lighthouse on at least premium-melamine and glassware, and the README corrected.

F5 [major] 9 — `.claude/rules/performance.md:53`; OPEN_ISSUES E34 — `/collections/[slug]` is 110 kB against a 110 kB ceiling (R4: 109). R5 spent the last kilobyte on `TabStrip.tsx`, a client component whose only job is one `scrollLeft` assignment. Not over, so not a fail, but the next byte fails the phase. Fixed: headroom restored (see F12 for a way that also removes the jump).

F6 [minor] 1, 8 — `src/content/collections.ts:1524` (`detailPending`), `src/components/collections/ItemDrawer.tsx:136-138`, `ItemRow.tsx:34` — "Full catalogue coming soon – WhatsApp us!" sits in a boxed note under a photographed design that can be hired today (`state-item-detail-pending-390.png`), on nine of 39 public items. The exclamation and "coming soon" read as the old listing site and as "not available". O37 records it honestly, and it is the brief's wording. Fixed: the owner's answer to O37, or a line that says the pieces are confirmed on request.

F7 [minor] 8, 1 — `src/content/collections.ts:1476,1572-1573` — Cutlery & Serveware shows "COMING SOON" as eyebrow, "Collection coming soon" as heading and "Coming soon" on its card, next to "WhatsApp us for current stock". The page says the collection does not exist yet and that stock exists. The replaced wording ("This list is not on the website yet") was the true statement. It is in COPY_TO_CONFIRM 11.5 only, with no owner item in OPEN_ISSUES. Fixed: an O-item, and one "coming soon" at most on the page.

F8 [minor] 3 — `src/components/collections/Breadcrumb.tsx:25-28` — at 390px a long title wraps the trail so the second line starts with an orphaned chevron ("Home > Collections" / "> Vintage & Heritage Silver"), directly above an `h1` that repeats the same words (`collections-heritage-silver-390.png`, `collections-chafing-dishes-390.png`). The `h1` breaks as "Vintage &" / "Heritage Silver" and "Cutlery &" / "Serveware" with a dangling ampersand (rubric 3: no orphans in headings). Fixed: the current crumb truncated or dropped below `md`, and balanced or non-breaking "& Word" in titles.

F9 [minor] 3 — `src/components/collections/classes.ts:25` — the tab's `px-3` insets the first label 12px from the shell edge, so "All" sits at x=32 while every other left edge on the page sits at 20 (390px), and at 36 against 24 (768px). Fixed: the first tab's text on the gutter.

F10 [minor] 4 — `src/components/collections/CollectionTabs.tsx:34`, `classes.ts:25`; `.claude/rules/a11y.md:71` — the tab row is `bg-background/95` with `muted-foreground` and `heading` text, and it sticks over dark photographs and the maroon bands. Neither pair is in the allowed table or `docs/color-system.md` (only `espresso-900` and `maroon-700` on the 95% bar are, and only "over maroon-950"). My estimate is about 6.7:1 for espresso-600, so it passes, but it is not computed, and the rule says computed and added first. Fixed: two rows in `contrast.mjs`, a11y.md and color-system.md.

F11 [minor] 4 — `src/components/collections/classes.ts:25` — the current tab is marked by a `gold-500` rule (2.21:1 on ivory), weight 500, and a colour change from espresso-600 to maroon-700 that is itself low-contrast. a11y.md:30 allows gold-500 for ornament lines only; here it carries state (WCAG 1.4.11). Fixed: the rule in `gold-700` or `maroon-700`.

F12 [minor] 5, 6 — `src/components/collections/TabStrip.tsx:22-29` — the current tab is centred even when it is already fully visible. On bone-china at 390 this pushes "All" off the left edge, with "Heritage Silver" flush at the gutter and no cue that anything is to the left (`collections-bone-china-390.png`, `state-deep-link-finish-gold-390.png`). It also runs after hydration, so the row paints at its start and then jumps (motion.md:45: first paint is the final state). Fixed: scroll only when the current tab is clipped, and keep a cut tab visible on the left; or drop the client component and order or anchor the row on the server.

F13 [minor] 5 — `src/components/collections/catalogueView.ts:47-52,64` — README and E37 say the repeated labels are fixed. Only exact matches are. Heritage Silver still reads "Silver-Plated Cutlery / Silver-plated / Cutlery" and "Serving Spoons / Serving Spoon" (`collections-heritage-silver-390.png`). `ItemCard.tsx:92` still clamps Matt Black Series to "Dinner Set, Soup Set, Chat Bowl (Bi…" (E37, open since R3). Fixed: a rule that also catches substring and plural repeats, and the claim corrected.

F14 [minor] 5, process — `src/content/collections.ts` (`filters.clear`), `src/components/collections/QuoteBasket.tsx:247` — two deviations from the brief are unrecorded. "Clear all" is built as "Clear filters". The "Quote list (n)" pill does not exist at n = 0. Neither is in O33–O38, E34–E41 or COPY_TO_CONFIRM §11. Fixed: two lines in OPEN_ISSUES.

F15 [minor] 2 — `src/content/collections.ts:1557-1570` — four tab labels are not the collection's name ("Cutlery" opens "Cutlery & Serveware", "Chat Plates" opens "Chat & Snack Plates"). O36 records it and awaits the owner. In the item dialog "Collection: Bone China" sits above "Material: Bone china" (`state-item-drawer-390.png`; `ItemDrawer.tsx:104,108`).

F16 [minor] 2 — `src/content/collections.ts:1482,1543,1574` — R5 adds "Ask us on WhatsApp" and "Send on WhatsApp" to "Ask on WhatsApp", "Message us on WhatsApp", "WhatsApp" and "Get a quote" for the same destination. R4 F8 asked for at most two wordings; there are now more.

F17 [minor] 2, content — `src/content/site.ts:616` vs `src/content/collections.ts:1541` — "Event date and guest count" is typed twice, once as the field label and once in the message (content.md:19, one fact one place). Fixed: the message line built from the label.

F18 [minor] 6, 10 — `scripts/collections-pass.mjs` — no run with reduced motion emulated. The item dialog, the quote sheet and the filter layout animation have no reduced-motion evidence; `keyboard-reduced-motion.log` covers the home page and the nav drawer only, and the `*-reduced-motion.png` files are static pages. No capture of any animated state.

F19 [minor] 10 — `src/app/collections/[slug]/page.tsx:99-113` — after the skip link a keyboard user passes two breadcrumb links and nine tabs before the first filter chip, on every collection page, with no way past them. `docs/QA_NOTES.md:23` says "Tab ×10 from Home"; by `collections-pass.mjs:109-115` it is 10 from the "All" tab, 12 from "Home".

F20 [minor] 10 — `src/components/collections/QuoteSheet.tsx:119-130`, `QuoteBasket.tsx:167-170` — the note is cut at 300 characters with nothing visible or announced (`maxLength`, hint line 129). "Clear list" announces "Quote list cleared" but keeps the note in state and `sessionStorage`, so it is sent with the next list. `QuoteSheet.tsx:65`: removing a row sends focus to "Close quote list", not to the next row.

F21 [minor] 10 — OPEN_ISSUES E40 — no screen-reader pass on the tab row, the filter live region, the two dialogs or the new field. Third phase running (E6, E32).

F22 [minor] 8, process — `src/lib/catalogue.ts:108-124`, `src/app/sitemap.ts:15` — `NEXT_PUBLIC_SITE_URL` is not in `.env.local`. In the build that was verified, `/sitemap.xml` is empty and each `ListItem` has a name and position only (no `url`, `item` or `image`). The README's "SEO" row and the brief's "sitemap" hold only in the unit test with a fake domain. O1 records the cause; the README does not say the shipped output is empty.

## "Not built" decisions

- **Justified by a recorded rule or decision:** O33 (no rates; `NoPricing`, O16/O21 — correct to refuse), O34 (one photograph per item, O22b), O38/E3 (budget), E38, E39, E41.
- **Honest but weak:** O35. "Two designs can be compared" is the builder's preference, not a recorded rule, and the brief said one column. It needs the owner's answer, not a default.
- **Honest and still open:** O36, O37, E33, E34, E35, E36, E37, E40.
- **Missing and unrecorded:** "Clear all" wording; the pill hidden at zero (F14); the "Coming soon" wording as an owner item (F7); the failed premium-melamine captures and the four unmeasured collections (F4).

## Not verified

- Anything in a live browser. I was told not to start a server, so all visual judgement is from the builder's captures.
- Why premium-melamine never reached network idle at 1280 and 1920.
- Glassware and Regular Melamine at any width; premium-melamine at 1280 and 1920.
- Lighthouse on premium-melamine, regular-melamine, chat-and-snack-plates and glassware; any deployed-origin number; INP.
- Reduced-motion behaviour of the dialog, the sheet and the filter animation; all animated states.
- The post-hydration tab jump (read from code, not seen).
- The F10 ratio (estimated, not run through `contrast.mjs`).
- Tap interception by the pill in the bottom band; the `:has()` fallback position of the pill.
- Screen-reader output.
- Viewports smaller than 390×844.
- Routes outside `/collections` (not re-captured in R5).
