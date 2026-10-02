# Critique — Phase R1, iteration 2 of 4

Reviewer: `reviewer` agent · Date: 2026-10-02 · Saved by the orchestrator from the
reviewer's report (paths relative to `indian-hires-website/` unless they start with
`.claude/` or `Docs/`; wording condensed, findings and scores unchanged).

VERIFY: exit 0 — all pass (from `docs/evidence/R1/verify-iter2.log`; not re-run by the reviewer).
Screenshots: `docs/evidence/R1/iter2/` (78 files, production build; `screenshots.log` and
`screenshots-states.log` report 0 problems).

Every route is inside its First Load JS ceiling. Headroom is thin: `/founders` and
`/testimonials` 99.8 of 100 kB, `/collections/[slug]` 109 of 110 kB.

```
 1 Royal / luxury feel ........ 4/5
 2 Brand consistency .......... 4/5
 3 Typographic hierarchy ...... 4/5
 4 Colour contrast ............ 4/5
 5 Catalogue findability ...... 4/5
 6 Motion quality ............. 4/5
 7 Mobile ergonomics .......... 4/5
 8 Trust signals .............. 4/5
 9 Performance ................ 3/5  (capped: iteration-2 measurements not available at review time)
10 Accessibility .............. 3/5  (capped: iteration-2 measurements not available at review time)
                        TOTAL  38/50
Verdict: ITERATE (becomes PASS if QA shows Lighthouse Performance and Accessibility ≥ 95 on
every route and no serious axe violations)
```

## Status of the 34 iteration-1 findings

27 fixed · 5 partly fixed · 2 not fixed.

| # | Status | Note |
|---|---|---|
| 1 | FIXED | All routes within ceiling |
| 2 | FIXED | Residual: `docs/OPEN_ISSUES.md` E1/E2 still said "being fixed" |
| 3 | PARTLY | Hero is Golden Rim, sharper, not repeated; 947px after the 4:5 crop is under 2× on high-DPR desktops (O13). `src/content/home.ts:149-158` |
| 4 | FIXED | Photographed collections as tiles; the rest as text row / text list |
| 5 | FIXED | WhatsApp is a text link in the card body |
| 6 | FIXED | Form not rendered without a key |
| 7 | PARTLY | Unconfirmed materials/finishes/pieces not rendered; chafing-dish names still state metals (generated `products.ts`, O6) |
| 8 | PARTLY | Unevidenced claims and the "41" stat gone; hours, service areas, "delivered clean, collected after" still unconfirmed (O9, O10). `src/content/contact.ts:165-166`, `home.ts:297-298` |
| 9 | FIXED | `dl > div > dt + dd` in served HTML; axe confirmation pending |
| 10 | FIXED | |
| 11 | FIXED | Transparent header on every route; see N1 |
| 12–18 | FIXED | 16: new repetition between lines (N6); 18: spec still promises the old behaviour (N11) |
| 19 | NOT FIXED | `.claude/rules/a11y.md:27,30,37,48-51` and `Docs/UI_UX_V2.md` still carry "tbm" rows |
| 20, 21 | FIXED | 21: "Double Color"/"24KT Blue" may still duplicate photographed designs (O3) |
| 22 | NOT FIXED | Quote list only under `/collections`; deferred, declared as E3 |
| 23–31 | FIXED | 24–26 by recorded clarifications in `motion.md` |
| 32 | PARTLY | Images now in the first viewport, but two are `priority` per route (N9) |
| 33, 34 | FIXED | |

## New findings (all minor)

| # | Item | Where | What is wrong | Fixed looks like |
|---|---|---|---|---|
| N1 | 6 / 10 | `src/components/layout/HeaderFrame.tsx:27-35` | Header is transparent with ivory type until `useScrolled` runs; before hydration or with JS off, scrolling past the maroon band leaves ivory text on ivory | Scrolled header legible without JavaScript |
| N2 | 5 | `src/content/collections.ts` (premium-melamine seeds with `finishes: []`); `collections/catalogueView.ts:80-108` | A facet is offered when only some items have a confirmed value: Finish "Blue" omits "Blue Rim" and "Sky Blue"; "Gold" omits Haldi Ivory | Facet offered only when every public item has a confirmed value, or unvalued items stay visible |
| N3 | 5 | `collections/CollectionCatalogue.tsx:178` | `hidden` on a `<ul>` with `flex` does not hide it; an empty bordered panel remains above the empty-result card | List not rendered when it has no rows |
| N4 | 5 / 7 | `collections/FilterBar.tsx:54` | Below `md` the second filter group starts off-screen with only a clipped chip to suggest it | Second group visible or clearly signalled at 390px |
| N5 | 5 | `app/collections/[slug]/page.tsx:83` | Heritage Silver's five-row list has a "Piece" filter where each chip matches one row and one matches none | No filter bar where each option maps to a single row |
| N6 | 3 | `collections/ItemCard.tsx:90-93`; `ItemRow.tsx:32-33` | Pieces line repeats the title or specs ("Mug / Mug", "Glass / Glass", "Chafing Dish" under every chafer) | A line that only restates the one above is not rendered |
| N7 | 1 | `scripts/normalize-images.py:108-126` | Tall/wide product shots are letterboxed onto blurred side bars, visible in cards and gallery | No synthetic blurred bars |
| N8 | 1 | `layout/HeaderFrame.tsx:39-42` | Just past 80px the 90% ivory backdrop over maroon shows a mottled grey-brown bar | Solid header reads as clean ivory over any band |
| N9 | 9 | `app/collections/[slug]/page.tsx:75-78` | Two `priority` images per collection route; rule allows the single LCP image | One priority image, or the rule amended |
| N10 | 8 | `src/content/home.ts:253-258` | "2015 — Bone china introduced on hire" promoted to a headline fact before confirmation; the story says "By 2015" | Confirmed, or replaced by a brand fact |
| N11 | 6 | `Docs/UI_UX_V2.md:740` | Spec still says filter chips animate layout | Spec and code agree |
| N12 | 2 | `package.json:16-17`; `founders/FoundersStory.tsx:9` | `@radix-ui/react-label` and `@radix-ui/react-slot` orphaned; comment says the story is "word for word" after edits | E9 lists all unused packages; comment corrected |
| N13 | 2 | `shared/BrandLogo.tsx:18-21`; `layout/Footer.tsx:40` | "Gabhawalas" is legible nowhere (only inside the small logo plaque); the tagline appears once per page as small footer text | Mark and tagline legible at least once in the page body, without redrawing the logo |
| N14 | 6 | `gallery/GalleryGrid.tsx:132-135,295-300` | The idle-time engine swap remounts all 21 tiles 1–3s after load; unverified whether placeholders flash | Swap does not remount the tiles, or a capture shows no visible change |

No class conflicts from the `cn` → `cx` change show in the captures.

## Not verified by the reviewer

- Iteration-2 Lighthouse, axe, keyboard and reduced-motion numbers (see `qa-iter2.md`).
- N1, N3 and N14 come from reading code and CSS, not from a capture.
- Dialog runtime behaviour; widths at or below 360px; `/collections/regular-melamine`,
  `chat-and-snack-plates` and `glassware` have no captures.
