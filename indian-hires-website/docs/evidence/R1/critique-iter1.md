# Critique — Phase R1, iteration 1 of 4

Reviewer: `reviewer` agent · Date: 2026-10-02 · Saved by the orchestrator from the
reviewer's report (paths shortened to be relative to `indian-hires-website/` unless they
start with `.claude/` or `Docs/`; wording condensed, findings and scores unchanged).

VERIFY: exit 0 — all pass (from `docs/evidence/R1/verify-iter1.log`; not re-run by the reviewer).
Screenshots: `docs/evidence/R1/iter1/` (61 files, production build).

```
 1 Royal / luxury feel ........ 3/5
 2 Brand consistency .......... 4/5
 3 Typographic hierarchy ...... 4/5
 4 Colour contrast ............ 4/5
 5 Catalogue findability ...... 4/5
 6 Motion quality ............. 4/5
 7 Mobile ergonomics .......... 4/5
 8 Trust signals .............. 3/5
 9 Performance ................ 3/5  (capped: no measured numbers at review time; routes over budget)
10 Accessibility .............. 3/5  (capped: no Lighthouse/axe numbers at review time)
                        TOTAL  36/50
Verdict: ITERATE
```

Sound: tokens clean (no raw colour, no deprecated or retired class in components/app);
brand facts exact on every served page; one `<main>`, one `<h1>`, no skipped levels on
the ten routes fetched; 390px reduced-motion captures identical to the normal ones apart
from the hero Ken Burns scale.

## Findings (most severe first)

| # | Sev | Item | Where | What is wrong | Fixed looks like |
|---|---|---|---|---|---|
| 1 | blocker | 9 | build table vs `.claude/rules/performance.md:52-53`; `src/components/gallery/GalleryGrid.tsx:9-15` | Five routes over their First Load JS ceiling: `/collections` 114 (110), `/collections/[slug]` 118 (110), `/gallery` 136 (110), `/founders` 114 (100), `/testimonials` 108 (100). Gallery imports the motion engine statically (18.4 kB). ~25 kB of layout client chunks on every route | Every route at or under its ceiling; gallery lightbox/engine loads on first open. Raising a ceiling is the owner's decision, recorded in `performance.md` |
| 2 | major | 9 | `docs/OPEN_ISSUES.md:30-32` | Engineering section empty although the overrun and spec deviations exist; budget table still names `/products` | Each overrun/deviation listed; budget table names the real routes |
| 3 | major | 1 | `src/components/home/HomeHero.tsx:24-27`; `src/content/collections.ts:437` | Hero photo is the 864px bone china cover, soft at 1280/1920 and on DPR ≥ 2 phones; the same photo is the Bone China tile below | A sharp source ≥ 1000px wide after the 4:5 crop (e.g. `golden-rim.webp`, 1184px); no photo repeated on the home page |
| 4 | major | 1 | `src/content/home.ts:206-211`; `src/content/collections.ts:391,604,633,755` | First featured tile is an empty crown arch; four of eight tiles on `/collections` are blank arches (repeated as "Other collections"); `/collections/heritage-silver` is five blank tiles. Reads as unfinished | Home features only photographed collections; photo-less collections shown as a compact text/"on request" row; a collection with no photos shows a list, not blank squares |
| 5 | major | 1 | `src/components/collections/ItemCard.tsx:66-73` | A 44px WhatsApp-green disc on every card photo makes green the dominant accent and covers the product; spec says gold is the only accent | One-tap enquiry stays, off the photograph and not a green fill on every card |
| 6 | major | 8 | `src/components/contact/ContactFormPanel.tsx:40-53`; `ContactForm.tsx:88-91` | With no Web3Forms key the page says the form is unavailable yet renders a full enabled form that ends in an error toast | When the key is empty the form is not rendered; only the WhatsApp/call panel shows |
| 7 | major | 8 | `src/content/collections.ts:716,723` (also 386-429, 628-694); `ItemCard.tsx:89-92` | Guessed materials published as facts ("Steel" on two chafers, "Silver-plated" on every heritage piece, "Melamine" on all chat & snack plates) | An inferred material/finish is not rendered and not offered as a filter until confirmed |
| 8 | major | 8 | `src/content/founders.ts:102,109,151`; `contact.ts:144-146`; `home.ts:186-190,205,240-243` | Claims the site cannot stand behind: "one of the leading rental agencies across Gujarat", "exponential growth", typed "twenty-five years", unconfirmed hours/service areas, assumed delivery and collection, headline "41" that may double-count | Owner-confirmed, or removed from the rendered page until confirmed; the 41 stat dropped or counts only confirmed designs |
| 9 | major | 10 | `src/components/contact/ContactDetails.tsx:25-36,61` | Invalid definition list (`dl > div > (span, div > (dt, dd))`) | `dt`/`dd` direct children of the `dl` or of one group `div` |
| 10 | major | 10 | `src/content/site.ts:263`; `MobileBottomBar.tsx:40` | Visible label "Enquire", accessible name "Go to the enquiry form" (WCAG 2.5.3) | Accessible name begins with the visible word, or no `aria-label` |
| 11 | minor | 2 | `layout/Header.tsx:14`; `HeaderFrame.tsx:32`; `app/layout.tsx:92` | Header transparent only on `/`; spec §5.2/§6.6/§7.9/§11.3 say transparent over the maroon band on every page | Built as specified, or spec amended and recorded |
| 12 | minor | 2 | `src/content/site.ts:385` | Contact title carries the brand name twice | One occurrence |
| 13 | minor | 2 | `tailwind.config.ts:14-18,55-67,126-131,141,239-243,281`; `content/home.ts:317`; `founders.ts:203`; `contact.ts:263`; `ui/form.tsx` | Deprecated aliases, dead legacy exports and an unused component remain | Removed |
| 14 | minor | 3 | `founders/MilestoneTimeline.tsx:23,40`; `FoundersStory.tsx:30` | h2 "Milestones" set as `type-h3`; years larger than their section heading | h2 reads as an h2; numerals `type-stat` or below the heading |
| 15 | minor | 3 | `home/FeaturedCollections.tsx:30`; `HeritageTeaser.tsx:27`; `HowItWorks.tsx:22` | Eyebrows on three consecutive sections (spec §7.6) | At most alternate sections |
| 16 | minor | 3 | `collections/ItemCard.tsx:89-92` | Material/finish row breaks raggedly at 390px; duplicates ("Brass \| Brass") | One clean line or stacked pair; duplicate suppressed |
| 17 | minor | 4 | `home/HomeClosingCta.tsx:19,33`; `HomeHero.tsx:75` | `gold-500` outline-button label over candle glow: 4.59–5.3 measured, pair not in the allowed table | `gold-300` over glow, or measured row added and prohibition lifted |
| 18 | minor | 4 | `collections/FilterBar.tsx:25`; `CollectionCatalogue.tsx:160-162` | Chip label colour flips instantly while the fill glides 350ms (momentary ivory-on-ivory) | Label colour follows the fill |
| 19 | minor | 4 | `.claude/rules/a11y.md:26,36` | Eight rows still "tbm" although measurable | Measured values recorded |
| 20 | minor | 5 | `app/collections/[slug]/page.tsx:61-75` | At 390×844 no product is visible on the first screen of a collection | First row of cards starts inside the first viewport |
| 21 | minor | 5 | `src/content/collections.ts:501-515` | Mixed naming inside Bone China; probable duplicates shown as blank tiles | One naming convention; suspected duplicates not shown twice |
| 22 | minor | 5 | `app/collections/layout.tsx:12-15` | Quote list reachable only under `/collections` | Reachable from every route while it has items |
| 23 | minor | 5 | `collections/StaticCatalogue.tsx:38` | Without JS each card title links to `?item=<id>`, which does nothing | Useful link or not a link |
| 24 | minor | 6 | `home/HomeHero.tsx:61-79`; `motion/MaskLines.tsx:40`; `tailwind.config.ts:289-292` | h1 lines, eyebrow, lead and hero CTAs hidden for up to ~900ms; bottom bar off-screen 1.2s. `motion.md` says first paint shows the final state; spec §9 asks for the entrances | Primary actions and h1 painted at first paint, or an explicit recorded exception |
| 25 | minor | 6 | `tailwind.config.ts:227`; `globals.css:395` | Hover zoom 700ms and card lift 350ms exceed the hover table | Within the table or added to the exceptions |
| 26 | minor | 6 | `motion/features-max.ts:7` | Loads `domMax`; rule says `domAnimation` | Rule text and code agree |
| 27 | minor | 7 | `motion/SlidePanel.tsx:41` | Right drawer `max-w-sm` leaves a 6px sliver at 390px | Full width below `sm` |
| 28 | minor | 7 | `layout/Footer.tsx:47,60-61`; `MobileDrawer.tsx:172` | Stacked link targets with 0px between them | `gap-2` |
| 29 | minor | 8 | `src/content/site.ts:152` | "Testimonials" in nav leads to a page that says there are none | Out of navigation until `hasTestimonials` |
| 30 | minor | 8 | `src/content/founders.ts:90` vs `109` | Hero subtitle repeats the story's closing sentence verbatim | Said once |
| 31 | minor | 9 | `src/app/fonts.ts:15` | Cormorant 500 and 700 loaded but only 600 used | `["600"]` |
| 32 | minor | 9 | `app/collections/[slug]/page.tsx:56` | `priority` on a card image that is below the fold at 390px | `priority` only on the LCP candidate |
| 33 | minor | 9 | `shared/CollectionTile.tsx:24` | `sizes` says 42vw; renders ~35vw | `sizes` matches rendered width |
| 34 | minor | evidence | `docs/evidence/R1/iter1/` | No captures of item drawer, quote sheet, lightbox, filtered grid, scrolled header, form errors, focus states; no keyboard/reduced-motion log; screenshot script output not saved | Captured at 390 and 1280; script output saved |

## Not verified by the reviewer

- Lighthouse, LCP, CLS, INP and axe: measured separately by `qa-a11y-perf`
  (see `docs/evidence/R1/qa-iter1.md`).
- Runtime behaviour of the drawers, quote sheet and lightbox (read from code only).
- Lightbox/layout animation under reduced motion at runtime.
- Animation smoothness (still screenshots only).
- Text over linen and candle glow sampled from two screenshots only.
- Whether the owner approved the package changes — **orchestrator's note: yes, approved
  in the R1 kickoff (motion added, framer-motion and gsap removed, QA tooling added).**
