# Scoring rubric

Ten items, each scored 1–5 by the `reviewer` agent. A phase passes when **every
item is ≥ 4** and `npm run verify` exits 0. See `docs/QA_LOOP.md`.

Rules for scoring:

- Score what is in the files and the screenshots, not what was intended.
- Every score below 5 needs at least one finding with `file:line`.
- Items 1–3 and 5–7 cannot score above 3 without screenshots at 390, 768, 1280 and
  1920px. Items 9 and 10 cannot score above 3 without measured numbers.
- Half points are not used. When torn between two scores, give the lower.

| Score | Meaning |
|---|---|
| 1 | Broken or absent |
| 2 | Present but clearly below standard; a visitor would notice |
| 3 | Acceptable; nothing wrong, nothing memorable. Generic |
| 4 | Good; meets the spec with only minor findings. **Pass line** |
| 5 | Excellent; no findings, and would hold up beside a luxury hotel's own site |

## 1. Royal / luxury feel

Does the site look like it belongs to a house that dresses wedding tables?

- **1** — reads as a template or a local-listing page
- **3** — clean and competent, but interchangeable with any rental business
- **5** — restraint, generous space, photography given room, one confident accent;
  feels ceremonial without ornament for its own sake. Nothing gimmicky.

## 2. Brand consistency

- **1** — name, tagline or colours differ between pages
- **3** — consistent, but the logo/crest and palette feel applied rather than native
- **5** — "Indian Hirers", "Gabhawalas" and "An Occasion with Dignity" appear exactly
  as specified everywhere; every colour is a token in the logo's warm band; contact
  details are identical on every surface; GSTIN appears only in the footer.

## 3. Typographic hierarchy

- **1** — no clear order; sizes and weights compete
- **3** — headings and body are distinguishable, but the scale is ad hoc
- **5** — one type scale used throughout; a visitor can tell h1/h2/h3/body/caption
  apart at a glance at 390px; line length 45–75 characters; no orphans in headings;
  both typefaces load and render on every page.

## 4. Colour contrast

- **1** — body text below 3:1 somewhere
- **3** — body text passes; secondary text, hover states or UI boundaries do not
- **5** — every text pair ≥ 4.5:1 (large text and UI ≥ 3:1) including hover, focus,
  disabled and error states; only pairs from the allowed table in
  `.claude/rules/a11y.md` are used.

## 5. Catalogue findability

Can a caterer find "gold-rim bone china dinner plate" in under 15 seconds on a phone?

- **1** — the range is not browsable
- **3** — categories exist, but finding a specific piece means scrolling everything
- **5** — clear taxonomy, category reachable in one tap from the homepage, pieces are
  named and labelled, the route from a piece to an enquiry is one tap, and nothing
  dead-ends. No prices anywhere.

## 6. Motion quality

Purposeful, smooth, reduced-motion safe.

- **1** — janky, layout-shifting, or content invisible without JavaScript
- **3** — smooth but decorative; or good motion with gaps under reduced motion
- **5** — every animation explains something; only `transform`/`opacity`; durations
  and easings from `.claude/rules/motion.md`; no scroll hijacking; the page is whole
  and correct with reduced motion on and with JavaScript still loading.

## 7. Mobile ergonomics

Judged at 390px, one-handed.

- **1** — horizontal scroll, overlapping fixed elements, or untappable controls
- **3** — works, but targets are small or key actions sit out of thumb reach
- **5** — all targets ≥ 44px with spacing; Call / WhatsApp / Enquire always within
  thumb reach and never covering content; the drawer opens, traps focus and closes
  cleanly; no scroll traps; safe-area insets respected.

## 8. Trust signals

- **1** — no evidence the business is real
- **3** — contact details present, but nothing that sets this business apart
- **5** — the 1977 origin and three generations are stated specifically; real
  address, both phones, email and map are easy to find; founders are named; every
  claim is one the business can stand behind. No invented testimonials, no stock
  photos presented as events, no vanity badges.

## 9. Performance

- **1** — Lighthouse Performance < 70, or visible layout shift
- **3** — 85–94, or any route over its JS budget
- **5** — Lighthouse Performance ≥ 95 on mobile for every route; LCP < 2.5s;
  CLS < 0.05; every route within the budget in `.claude/rules/performance.md`;
  all images through `next/image` with correct `sizes`.

## 10. Accessibility

- **1** — keyboard users cannot reach or operate something
- **3** — Lighthouse Accessibility 85–94, or axe reports serious violations
- **5** — Lighthouse Accessibility ≥ 95 and zero axe violations on every route;
  full keyboard path including drawer and any carousel; one `<main>`, one `<h1>`,
  no skipped heading levels; alt text describes the object; visible focus everywhere.

## Score sheet

```
Phase: ____   Iteration: _/4   Reviewer: reviewer   Date: ____
verify exit: _

 1 Royal / luxury feel ........ _/5
 2 Brand consistency .......... _/5
 3 Typographic hierarchy ...... _/5
 4 Colour contrast ............ _/5
 5 Catalogue findability ...... _/5
 6 Motion quality ............. _/5
 7 Mobile ergonomics .......... _/5
 8 Trust signals .............. _/5
 9 Performance ................ _/5
10 Accessibility .............. _/5
                        TOTAL  __/50

Verdict: PASS | ITERATE | STOP → OPEN_ISSUES
```
