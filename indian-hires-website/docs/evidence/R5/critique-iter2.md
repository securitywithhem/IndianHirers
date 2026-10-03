# Phase R5 — critique, iteration 2

Phase: R5   Iteration: 2/4   Reviewer: reviewer   Date: 2026-10-03
verify exit: 0

 1 Royal / luxury feel ........ 4/5
 2 Brand consistency .......... 4/5
 3 Typographic hierarchy ...... 4/5
 4 Colour contrast ............ 4/5
 5 Catalogue findability ...... 4/5
 6 Motion quality ............. 4/5
 7 Mobile ergonomics .......... 4/5   (iter 1: 3)
 8 Trust signals .............. 4/5
 9 Performance ................ 3/5   (iter 1: 3 — not moved)
10 Accessibility .............. 4/5
                        TOTAL  39/50   LOWEST: 9 Performance

Verdict: ITERATE

Item 9 is the only item below 4, and it has now sat at 3 for two iterations. Per QA_LOOP that goes to OPEN_ISSUES straight away; E33 already carries it. Another code-only iteration is unlikely to move it without a deployed-origin measurement or a change to what Lighthouse picks as the LCP element.

Verify: port 3001 was free. I ran `npm run verify` in place: exit 0, all four steps pass. My output matches `docs/evidence/R5/verify.log` (which is identical to `verify-iter2.log`) apart from blank lines. `npm run test:catalogue`: exit 0, ALL PASS. No server was started; the port is free at hand-back.

```
├ ○ /collections                         2.61 kB         107 kB
├ ● /collections/[slug]                  3.62 kB         108 kB
+ First Load JS shared by all            87.6 kB
==> [1/4 lint] PASS
==> [2/4 typecheck] PASS
==> [3/4 build] PASS
check-tokens: PASS — no raw colours or stock white/black outside the token files
==> [4/4 tokens] PASS
verify: ALL PASS
```

Evidence timestamps all follow the last source edit (11:38:07; `collections-pass.mjs` 11:39:02). The 111 and 43 check counts, the 46 captures with 0 problems, and the Lighthouse table in the README all match the logs and the `audit/run1..3` JSON scores.

## Iteration-1 findings: status

- **Fixed, confirmed in code and captures:**
  - F1: 56px circle below `md` (`QuoteBasket.tsx:25-26,272-279`; `iter2/states/state-quote-button-390.png`); the tap check at `collections-pass.mjs:176-191` now tests the right band.
  - F2, sticky part: `CollectionTabs.tsx:39` is `md:sticky`.
  - F4: all nine catalogue pages captured at four widths.
  - F5: 108 kB and 107 kB.
  - F7: one "coming soon" on the empty page.
  - F8: no orphaned chevron, no dangling ampersand.
  - F9: first tab label on the gutter.
  - F10: the row is opaque.
  - F11: the current-tab rule is `after:bg-primary` (`classes.ts:25`).
  - F14: "Clear filters" recorded in COPY_TO_CONFIRM 11.10.
  - F17: `QUOTE_NOTE_LABEL` at `site.ts:565` is the single source.
  - F18: reduced-motion section, `collections-pass.log` lines 108–117.
  - F19: QA_NOTES count corrected.
  - F20: "Clear list" clears the note (`QuoteBasket.tsx:172-176`); focus moves to the next row (`QuoteSheet.tsx:66-73`).
  - F22: the README says the verified build has an empty sitemap.
- **Not fixed, honestly recorded:** F3 (E33), F6 (O37), F15 and F16 (E44), F21 (E40), E42, E43, O35.
- **Partly fixed:** F12 and F13 — see N2 and N3 below.

## Findings (major first, then minor)

Must fix for a pass: N1.

N1 [major] 9 — `docs/evidence/R5/lighthouse.log`; `src/app/collections/[slug]/page.tsx:44` — mobile glassware is 96 / 90 / 92, median 92, which is rubric anchor 3 (85–94).
- Every photographed collection has a run at 87–90: bone-china 87, premium-melamine 87, chafing-dishes 90.
- `/collections` has a run at 93 with LCP 3.2s.
- LCP is above 2.5s on all 21 mobile runs (2.6–4.1s).
- The medians moved between iterations with no relevant code change (bone-china 90 → 95), so the 95s are within noise of failing.
- E33 says "`/collections`, heritage-silver and cutlery are 96–97"; the log has `/collections` at 93 in run 3.
- Fixed: median ≥ 95 with no run below 90 on every photographed collection, or a deployed-origin measurement; and E33's sentence corrected.

N2 [minor] 5 — `src/components/collections/catalogueView.ts:59-62,72-74` — Glassware, captured for the first time, prints the same word on two lines under three of four cards: "Highball Tumbler / Glass / Glass", "Rocks Tumbler / Glass / Glass", "Straight Water Tumbler / Glass / Glass" (`iter2/collections-glassware-390.png`). The material and the piece label are both "Glass" and are only de-duplicated against the name, not against each other. The README's "Cards and rows" line and E37 claim the repeats are fixed. Fixed: a piece label equal to a printed spec is not printed again, and the claim corrected.

N3 [minor] 5, 6 — `src/components/collections/TabStrip.tsx:12-23,34-35`; `CollectionTabs.tsx:42` — the comment says the tabs before the current one "stay cut by the left edge, which is the cue". In the captures scroll snap lands a whole tab on the gutter instead.
- Chafing Dishes at 390 shows exactly "Regular Melamine · Chat Plates · Chafing Dishes" with clean edges on both sides and no sign of six more tabs (`iter2/collections-chafing-dishes-390.png`). The 48px peek is also lost there.
- Regular Melamine and Cutlery have a clean left edge.
- Only Glassware shows a cut label.
- The scroll still happens after hydration (motion.md:45).
- Fixed: a cut label or edge fade on any side that has more tabs, checked on all eight pages.

N4 [minor] 7 — `src/components/layout/FloatingWhatsApp.tsx:36` (not changed by R5); `QuoteBasket.tsx:25-26` — with an empty list the floating WhatsApp button sits on a card title in the first screen of a collection ("Silver Chafer… Carved Stand", `iter2/collections-chafing-dishes-390.png`). With an item in the list the circle clips the right 35px of a right-column "Add to quote" label when level with it ("Add to quo", `iter2/states/state-quote-button-390.png`); the centre still takes a tap. O31 has had no owner answer since R4. I scored this 4, not 3: the two regressions R5 itself introduced are gone, and what remains is the PRD's own element awaiting the owner. It keeps the item off 5.

N5 [minor] 7, process — OPEN_ISSUES E35, E36 — two brief requirements now hold from 768px only: the visible "Quote list (n)" label and "sticky" tabs. Both are recorded honestly but as engineering items. They are deviations from the brief on the primary device and belong in "Needs the owner", next to O31.

N6 [minor] 1, 8 — `src/content/collections.ts` (`item.detailPending`); `src/components/collections/ItemDrawer.tsx:136-138` — "Full catalogue coming soon – WhatsApp us!" still sits under photographed designs that can be hired today (O37, unchanged).

N7 [minor] 8, 1 — `src/content/collections.ts:1234,1478,1575-1576` — the empty collection still says "Collection coming soon" beside "WhatsApp us for current stock" (O39, now recorded). The eyebrow above the `h1` is an instruction, "ASK US FOR THE LIST", because the card's count label is reused as the hero eyebrow (`iter2/collections-cutlery-and-serveware-390.png`).

N8 [minor] 3 — `src/components/collections/ItemCard.tsx:92` — card rows are uneven. On Glassware and Premium Melamine one card has two or three text lines and its neighbour none, so "Rates on request" sits at different heights in a row. Matt Black Series is still clamped to "Snack…" (E37).

N9 [minor] 2 — `src/content/collections.ts:1561-1572`; `ItemDrawer.tsx:104,108` — the short tab names are unconfirmed (O36); "Bone China" sits above "Bone china" in the dialog; the WhatsApp action has four wordings (E44).

N10 [minor] 4 — `src/components/collections/QuoteBasket.tsx:276`; `.claude/rules/a11y.md:43` — the count badge is `accent-foreground` on `accent` (maroon-950 on gold-500, 7.48). The table lists that pair only under "On maroon (inside `.theme-dark`)"; here it is used in the ivory scope. The ratio passes; the row is missing. The same button's focus ring is maroon-700 and is carried only by its 2px ivory offset when the button is over a maroon band.

N11 [minor] content — `src/content/collections.ts:1544-1545` — "up to 300 characters" is typed by hand beside `noteMaxLength: 300` (content.md:20: numbers are derived). `QuoteBasket.tsx:94` still says "Send list on WhatsApp" in its comment; the label is "Send on WhatsApp".

N12 [minor] 10 — OPEN_ISSUES E40, E42, E44 —
- No screen-reader pass, for the third phase running.
- Eleven links stand between the skip target and the first filter.
- Nothing is announced at the 300-character limit.
- Below `md` the breadcrumb's current crumb is `display: none` (`Breadcrumb.tsx:30`), so the trail has no `aria-current` item on a phone.

N13 [minor] process — OPEN_ISSUES E43 — the iteration-1 timeout on premium-melamine is unexplained and unreproduced. It is recorded honestly; nothing more can be asked without a recurrence.

## "Not built" decisions

- **Justified by a recorded rule or decision:** O33, O34, O38/E3, E38, E39, E41.
- **Honest and waiting on the owner:** O35 (now worded as the builder's judgement), O36, O37, O39, O31.
- **Honest and open:** E33, E37, E40, E42, E43, E44.
- **Mis-filed:** E35 and E36 are owner decisions (N5).
- **Nothing found that the brief asks for and that is missing and unrecorded.**

## Not verified

- Anything in a live browser; all visual judgement is from the builder's `iter2/` captures.
- E33's diagnosis of which LCP element each run picked. My script could not read the element from this Lighthouse version's JSON; only the scores and LCP values were confirmed.
- Lighthouse on regular-melamine and chat-and-snack-plates; any deployed-origin number; INP.
- N10's ratios through `contrast.mjs`.
- N3 on Bone China, Premium Melamine and Chat Plates beyond the captures I opened.
- Animated states (no video or mid-animation capture).
- The `:has()` fallback position of the quote button.
- Screen-reader output.
- Viewports below 390×844.
- Routes outside `/collections`.
