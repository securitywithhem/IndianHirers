# Copy and catalogue data to confirm with the owner

**Written:** Phase R1, Wave 1 (content layer). **Revised:** Phase R1, iteration 2.
Paths are relative to `indian-hires-website/`.

**The rule since iteration 2:** a fact the owner has not confirmed is **not rendered**.
Listing an assumption here is not enough to publish it. So this file now has two
kinds of entry:

- **HIDDEN** — a value we inferred. It is kept in the code in a field the site never
  reads (`assumed` on a catalogue seed, or `status: "unconfirmed"`) and appears nowhere
  on the site until the owner confirms it.
- **SHOWN** — text that is on the site and still wants the owner's eye: wording we
  wrote, or text carried over from the previous site.

Status key: **MATCHED** = photo attached to an owner-listed name · **SEPARATE** =
photo kept as its own item · **HIDDEN** = inferred, not rendered · **CARRIED OVER** =
from the previous site, rendered, to be confirmed as still current · **NEW COPY** =
written in this phase · **CHANGED** = the family's or the previous wording was edited;
the original is quoted so it can be restored.

Section 0 lists what iteration 2 changed. Sections 1–8 are the standing list.

---

## 0. What iteration 2 changed

| # | Change | Where | Original, for restoring |
|---|---|---|---|
| 0.1 | Inferred materials are no longer shown or offered as filters. Hidden: "Steel" (two chafing dishes), "Brass" / "Copper" (three chafing dishes), "Silver-plated" on Serving Spoons, Trays and Tableware, "Melamine" on all Chat & Snack entries (seven then; eight since R3, §9) | `src/content/collections.ts` → `collectionSeeds[*].items[*].material` is `null`; the guess is in `.assumed.material` | §2.2, §2.10, §2.12 |
| 0.2 | Inferred finishes are no longer shown or offered as filters. Hidden: silver (heritage), ivory + gold (Haldi Ivory), black + white (Spiral Motif), the six photographed melamine designs' colours, brass / silver / gold / copper (chafing dishes), clear (glassware) | `…items[*].finishes` is `[]`; the guess is in `.assumed.finishes` | §2.5, §2.8, §2.12 |
| 0.3 | Inferred pieces are no longer shown. Hidden: "Dinner Set" on the six photographed melamine designs; "Rectangular Plate"; "Small / Big" on Snack Plate, Marble and Matt | `…items[*].pieces`; the guess is in `.assumed.pieces` | §2.8, §2.11 |
| 0.4 | "Yellow" and "Black-White" (bone china) are hidden. Each is probably a design already shown under another name; showing both would list one design twice | `collectionSeeds["bone-china"].items` → `status: "unconfirmed"` | §1, OPEN_ISSUES O2 |
| 0.5 | One naming rule per collection: the collection's name is not repeated in an item's name | `…items[*].name` | See the "Name shown" columns in §1 |
| 0.6 | The count of designs is gone from the home page and the catalogue landing | `src/content/home.ts` → `home.trust.items`, `home.featured.lead`; `collections.ts` → `catalogueCopy.landing.lead`; the `designCount` export is deleted | Was: trust item "41 · Designs and pieces listed"; leads "41 designs and pieces across 8 collections. Rates on request." and "41 designs and pieces across 8 collections. Add what you like to a quote list and send it to us on WhatsApp." |
| 0.7 | The "Collections" number left the home trust strip; "2015 · Bone china introduced on hire" joined it. The strip now has four facts | `home.trust.items` | Was five: 1977 · 3 · years in Vadodara · designs · collections |
| 0.8 | Collections that list kinds of piece are counted as "items", not "designs" (Heritage Silver, Chat & Snack Plates, Cutlery & Serveware) | `collections.ts` → `Collection.countAs`, `collectionCountLabel()` | Was "5 designs", "7 designs" |
| 0.9 | Home featured collections are derived: only collections with a photograph, four at most | `home.ts` → `FEATURED_COLLECTIONS` | Was hand-picked: Heritage Silver, Bone China, Premium Melamine, Chafing Dishes. Now: Bone China, Premium Melamine, Chafing Dishes, Glassware |
| 0.10 | Home hero photograph is the Golden Rim bone china photograph | `home.ts` → `HERO_ITEM_ID`, `HERO_ALT` | Was `/images/brand/hero-backdrop.webp` in content; the component showed the bone china cover |
| 0.11 | Founders' story: four edits | `src/content/founders.ts` | §5, originals quoted in full |
| 0.12 | Founders hero subtitle no longer repeats the story's closing sentence | `founders.hero.subtitle` | §5.7 |
| 0.13 | Service areas: the forward-looking ending was removed | `src/content/contact.ts` → `SERVICE_AREAS` | §6.2 |
| 0.14 | Testimonials link removed from the header, drawer and footer while there are no testimonials. The page still exists | `src/content/site.ts` → `mainNav`, `footerNav` | Was always listed |
| 0.15 | Page titles no longer contain the brand name twice | `site.ts` → `routeMetadata` | Contact was "Contact Indian Hirers — Vadodara, Gujarat"; Founders was "Founders — The Family Behind Indian Hirers" (each then had " \| Indian Hirers" appended) |
| 0.16 | Accessible names now begin with the visible label, or are removed | `site.ts` → `shell.header`, `shell.bottomBar`; `collections.ts` → `catalogueCopy` | §8.9 |
| 0.17 | Eyebrows removed from the home heritage teaser and the home testimonials section | `home.heritage`, `home.testimonials` | Were "Our story" and "In their words" |
| 0.18 | Collection descriptions no longer state unconfirmed materials or finishes | `collectionSeeds[*].description` | §3 |
| 0.19 | Pre-redesign content objects deleted (`homeContent`, `foundersContent`, `contactContent` and their types) | `home.ts`, `founders.ts`, `contact.ts` | Not rendered by any component |

---

## 1. Photo ↔ design-name mapping (`src/content/collections.ts`, `collectionSeeds`)

The catalogue PDFs are not in the repo, so photographs were matched to the
owner's design names by name and by the source filename recorded in
`scripts/normalize-images.py`. A photo was attached only where the names agree.

### Bone China — `collectionSeeds["bone-china"].items`

| Owner-listed design | Photograph (manifest slug · manifest name · source file) | Name shown | Decision | Confirm |
|---|---|---|---|---|
| Golden Rim | `bone-china/golden-rim` · "Golden Rim Bone China" · `Golden-Broder.jpeg` | Golden Rim | **MATCHED** — same name | Is this the Golden Rim design? |
| Green Golden | `bone-china/emerald-gold` · "Emerald & Gold Bone China" · `Green-Golden.jpeg` | Green Golden | **MATCHED** — the owner's own filename is the design name | Is this the Green Golden design? |
| White | `bone-china/classic-white` · "Classic White Bone China" · `Plain-White.jpeg` | White | **MATCHED** — plain white, same name | Is this the White design? |
| Clay Craft Golden | none | Clay Craft Golden | No photo; crown placeholder | Photograph needed |
| Rose Gold | none | Rose Gold | No photo; crown placeholder | Photograph needed |
| Yellow | none attached | *(not shown)* | **HIDDEN** — `status: "unconfirmed"`. See next row | — |
| *(not in owner's list)* | `bone-china/haldi-ivory` · "Haldi Ivory Bone China" · `Haldi.jpeg` | Haldi Ivory | **SEPARATE** — shown under the previous site's name. Very likely the "Yellow" design (haldi = turmeric; the china in the photo is pale yellow with a gold line) | **Is "Haldi Ivory" the same design as "Yellow"?** If yes: delete the hidden "Yellow" entry and say which name to show. If no: set "Yellow" to `status: "available"` |
| Black-White | none attached | *(not shown)* | **HIDDEN** — `status: "unconfirmed"`. See next row | — |
| *(not in owner's list)* | `bone-china/spiral-motif` · "Spiral Motif Bone China" · `Spider.jpeg` | Spiral Motif | **SEPARATE** — shown under the previous site's name. White china with black spirals, so it may be "Black-White" | **Is "Spiral Motif" the same design as "Black-White"?** Same handling as above |

Bone China therefore shows **seven** designs today (it showed nine, two of them
probably duplicates).

The collection hero image is the old category cover (`/images/products/bone-china/cover.webp`,
a close detail of the emerald-and-gold setting).

### Premium Melamine — `collectionSeeds["premium-melamine"].items`

| Owner-listed design | Photograph | Name shown | Decision | Confirm |
|---|---|---|---|---|
| Matt Black Series | `melamine/matt-black` · "Matt Black Melamine" · `Black.jpeg` | Matt Black Series | **MATCHED** — same name | Is this the Matt Black Series? |
| Double Color | none attached | Double Color | No photo; crown placeholder | Which two colours? Is it one of the photographed designs below (e.g. "Blue Rim" or "Sky Blue")? |
| 24KT Blue | none attached | 24KT Blue | No photo; crown placeholder | Is it "Blue & Gold Border" below? |
| *(not in list)* | `melamine/blue-rim` · "Blue Rim Melamine Set" · `Blue-border.jpeg` | Blue Rim | **SEPARATE** — previous site's name, without "Melamine Set" | Owner's name for this design? Premium or Regular? |
| *(not in list)* | `melamine/sky-blue` · "Sky Blue Melamine Set" · `LightBlue.jpeg` | Sky Blue | **SEPARATE** | same |
| *(not in list)* | `melamine/ribbed-white` · "Ribbed White Melamine" · `Plain-white.jpeg` | Ribbed White | **SEPARATE** | same |
| *(not in list)* | `melamine/textured-ivory` · "Textured Ivory Melamine" | Textured Ivory | **SEPARATE** | same |
| *(not in list)* | `melamine/gold-medallion` · "Gold Medallion Melamine" | Gold Medallion | **SEPARATE** | same — could this be "24KT Gold Melamine" (Regular)? |
| *(not in list)* | `melamine/blue-gold-border` · "Blue & Gold Border Melamine" | Blue & Gold Border | **SEPARATE** | same — could this be "24KT Blue"? |

"Double Color" and "24KT Blue" may also turn out to be duplicates of photographed
designs. They are still shown, because — unlike Yellow and Black-White — no single
photograph is the likely match. Say if you would rather hide them too.

**All six unmatched melamine photographs were placed in Premium Melamine** because the
old `/products/melamine` page redirects there. Nothing tells us whether each is a
premium or a regular design. If any is regular, move its entry to
`collectionSeeds["regular-melamine"]`. (`manifestHome.melamine` in the same file.)

### Regular Melamine — `collectionSeeds["regular-melamine"].items`

| Owner-listed design | Photograph | Name shown | Decision |
|---|---|---|---|
| Matt Melamine | none | Matt | No photo. The owner's name is shown without "Melamine" (naming rule, 0.5) |
| 24KT Gold Melamine | none | 24KT Gold | same |

### Chafing Dishes & Buffet Display — `collectionSeeds["chafing-dishes"].items`

The owner has not supplied design names. The five photographed chafing dishes are
public under the names the previous site gave them:

| Manifest slug | Name shown | Decision |
|---|---|---|
| `chafing-dishes/brass-round` | Round Brass Chafing Dish | **SEPARATE** — manifest name kept |
| `chafing-dishes/silver-carved-stand` | Silver Chafer on Carved Stand | **SEPARATE** |
| `chafing-dishes/gold-hammered-square` | Hammered Gold Square Chafer | **SEPARATE** |
| `chafing-dishes/brass-handi` | Large Brass Handi Chafer | **SEPARATE** |
| `chafing-dishes/copper-ribbed-dome` | Ribbed Copper Dome Chafer | **SEPARATE** |

**Still open — these names say "Brass", "Copper", "Silver" and "Gold".** The material
labels and filters are hidden (0.1), but the names themselves, and the photographs'
alt text, still name a metal. Both are **CARRIED OVER** from the previous site and
live in the generated photo manifest (`src/content/products.ts`, from the `KEEP` table
in `scripts/normalize-images.py`), which was out of scope for this iteration.
Confirm: what is each chafing dish made of, and what does the business call it?
If the metals cannot be confirmed, the names and alt text should be changed in the
`KEEP` table and the scripts re-run.

Six placeholders (`CHAFING_DISH_PLACEHOLDERS`, `status: "todo"`) wait for the owner's
designs. They are excluded from every public helper and never render.

### Glassware — `collectionSeeds.glassware.items`

| Manifest slug | Name shown | Decision |
|---|---|---|
| `glassware/highball` | Highball Tumbler | **SEPARATE** — manifest name kept |
| `glassware/wine-glass` | Wine Glass | **SEPARATE** |
| `glassware/rocks-tumbler` | Rocks Tumbler | **SEPARATE** |
| `glassware/water-tumbler` | Straight Water Tumbler | **SEPARATE** |

### Collections with no photographs

Vintage & Heritage Silver, Regular Melamine, Chat & Snack Plates, Cutlery & Serveware:
no photographs exist. They are no longer shown as blank image tiles: on the home page
they are not featured, and on the catalogue landing they are meant to appear as a text
row under "Also on hire — ask us for photographs" (`catalogueCopy.textOnly.rowHeading`).
Their own pages list the items as text with the note "This collection has not been
photographed yet. Photographs on request — ask us on WhatsApp."
(`catalogueCopy.textOnly.listNote`).

---

## 2. Collections and taxonomy

"HIDDEN" rows are in the code but not on the site. To publish one, move the value out
of `assumed` into the real field of the same seed.

| # | Item | Where | Status | Confirm |
|---|---|---|---|---|
| 2.1 | **Glassware is kept as an eighth collection.** It is not in the owner's list of collections; it is kept because four photographed glasses exist and the founders' story mentions glassware | `collectionSeeds.glassware` | SHOWN | Keep Glassware as a collection? |
| 2.2 | Heritage Silver material. Shown: "Silver-plated" on Silver-Plated Plates and Silver-Plated Cutlery only (the owner's words: "silver-plated plates, silver-plated cutlery, serving spoons, trays, tableware"). Hidden: "Silver-plated" on Serving Spoons, Trays, Tableware; finish "Silver" on all five | `collectionSeeds["heritage-silver"].items[*].material / .assumed` | part HIDDEN | Are the serving spoons, trays and tableware silver-plated too? |
| 2.3 | Heritage Silver "Tableware" has no pieces listed | `…items[4].pieces` (empty) | SHOWN as a name only | What does "tableware" cover? |
| 2.4 | Bone China: the three pieces (Dinner Set, Soup Set, Quarter Plate) are applied to every design, including the two photographed designs not in the owner's list, on the owner's statement that every bone china design comes as these three | `BONE_CHINA_PIECES` | SHOWN | Do Haldi Ivory and Spiral Motif come in all three? |
| 2.5 | Bone China finishes. Shown — stated by the owner's design name: Clay Craft Golden → gold; Rose Gold → rose gold; Golden Rim → gold; Green Golden → green + gold; White → white. Hidden — read from the photograph: Haldi Ivory → ivory + gold; Spiral Motif → black + white. (Yellow → yellow and Black-White → black + white sit on the two hidden entries) | `collectionSeeds["bone-china"].items[*].finishes / .assumed` | part HIDDEN | Correct? "Clay Craft Golden → gold" follows the same rule as "Golden Rim → gold"; say if it is wrong |
| 2.6 | **(Superseded in R3 — see §9.)** Premium Melamine: the full piece list (Dinner Set, Soup Set, Chat Bowl Big/Small, Snack Plate Big/Small, Nasta Plate 9") is applied to each of the three owner-listed designs | `PREMIUM_MELAMINE_PIECES` | SHOWN | Does every premium design come in every piece? |
| 2.7 | Premium Melamine finishes, from the owner's names: Double Color → none (colours unknown); 24KT Blue → blue only (gold not tagged although "24KT" suggests it); Matt Black Series → matt + black | `…items[0..2].finishes` | SHOWN | Colours of Double Color? Is 24KT Blue gold-lined? |
| 2.8 | The six photographed melamine designs: material Melamine is shown (everything in the melamine collections is melamine). Hidden: the piece "Dinner Set" and the finishes read from the photographs (Blue Rim → blue; Sky Blue → blue; Ribbed White → white; Textured Ivory → ivory; Gold Medallion → gold; Blue & Gold Border → blue + gold) | `…items[3..8].assumed` | HIDDEN | Which pieces does each come in? Colours right? |
| 2.9 | **(Superseded in R3 — see §9.)** Regular Melamine: Matt Melamine → matt; 24KT Gold Melamine → gold (both from the owner's names). No pieces listed | `collectionSeeds["regular-melamine"].items` | SHOWN | Which pieces does the regular range come in? |
| 2.10 | **(Superseded in R3 — see §9.)** Chat & Snack Plates: **material assumed to be melamine** for all seven entries. The owner's list does not state a material | `collectionSeeds["chat-and-snack-plates"].items[*].assumed.material` | HIDDEN | Material? |
| 2.11 | **(Superseded in R3 — see §9.)** Chat & Snack Plates: the owner's short-hand list "rectangular, dessert bowl, snack plate, mug, small/big, blue handle, marble small/big, matt small/big" is shown as seven entries: Rectangular · Dessert Bowl · Snack Plate · Mug · Blue Handle (finish blue) · Marble (finish marble) · Matt (finish matt). Hidden: that "Rectangular" is a plate (it was named "Rectangular Plate"); that "small/big" on its own belongs to Snack Plate; that Marble and Matt are plates in Small and Big. The collection description still says "in small and big sizes", which is the owner's wording | `collectionSeeds["chat-and-snack-plates"].items` | part HIDDEN | Please correct this list — what is each item, and which have small/big sizes? |
| 2.12 | Chafing dish materials read from the photographs and the previous site's names: brass (Round Brass, Brass Handi), copper (Ribbed Copper Dome), steel (Silver Chafer on Carved Stand, Hammered Gold Square — the weakest guesses in the file). Finishes: brass / silver / gold / brass / copper | `collectionSeeds["chafing-dishes"].items[0..4].assumed` | HIDDEN (but see the note on names in §1) | Actual material of each? |
| 2.13 | Cutlery & Serveware has no items; the page shows "This list is not on the website yet" | `collectionSeeds["cutlery-and-serveware"]`, `catalogueCopy.emptyCollection` | SHOWN | Item list needed |
| 2.14 | Featured on the home page — collections: derived, the first four collections that have a photograph (today Bone China, Premium Melamine, Chafing Dishes & Buffet Display, Glassware). Items flagged `featured`: Golden Rim, Green Golden, Matt Black Series, Large Brass Handi Chafer, Ribbed Copper Dome Chafer, Wine Glass | `home.ts` → `FEATURED_COLLECTIONS`; `collections.ts` → `featured: true` | SHOWN | Right collections to lead with? |
| 2.15 | **(Superseded in R3 — see §9.)** Counts. No total is shown anywhere. Each collection shows its own count of public entries: Bone China 7 designs · Premium Melamine 9 designs · Regular Melamine 2 designs · Chafing Dishes 5 designs · Glassware 4 designs · Heritage Silver 5 items · Chat & Snack Plates 7 items · Cutlery & Serveware "Ask us for the list". Hidden entries are not counted. The home page and the catalogue landing state the number of collections (8), derived | `collections.ts` → `collectionCountLabel()`, `collectionCount` | SHOWN | Is "8 collections" right, given 2.1 and 2.13? |
| 2.16 | Old URLs redirect: `/products` → `/collections`; `vintage` → heritage-silver; `bone-china` → bone-china; `melamine` → premium-melamine; `glassware` → glassware; `chafing-dishes` → chafing-dishes | `collections.ts` → `legacyRedirects` | — | — |
| 2.17 | Glassware: material Glass is shown. Hidden: finish "Clear", read from the photographs | `collectionSeeds.glassware.items[*].assumed` | part HIDDEN | — |

---

## 3. Collection copy (`collections.ts` → `collectionSeeds[*].tagline / .description`)

| Collection | Statement to confirm | Changed in iteration 2 |
|---|---|---|
| Vintage & Heritage Silver | "Silver-plated plates and silver-plated cutlery, with serving spoons, trays and tableware, for weddings and formal dinners. Ask us on WhatsApp which pieces are available for your date." Tagline "Silver-plated service for the formal table". "for weddings and formal dinners" is CARRIED OVER from the previous site's Vintage description | **CHANGED.** Was: "Silver-plated plates, cutlery, serving spoons, trays and tableware for weddings and formal dinners. This range has not been photographed yet — ask us on WhatsApp and we will tell you which pieces are available for your date." (It read as if all five were silver-plated; the photography sentence moved to `catalogueCopy.textOnly.listNote`.) |
| Bone China | "Bone china in gold-rimmed, patterned and plain white designs. Each design is hired as a dinner set, a soup set and quarter plates." | — |
| Premium Melamine | tagline "Melamine with a finer finish"; description reworded in R3 — see §9.2 | — |
| Regular Melamine | "straightforward melamine service for everyday functions"; last sentence reworded in R3 — see §9.2 | — |
| Chat & Snack Plates | "for counters and starters"; "in small and big sizes and in marble and matt finishes" | — |
| Chafing Dishes & Buffet Display | "Chafing dishes for the buffet line, in round, square and handi shapes. We hold more designs than are photographed here."; note "More chafing dish designs are available on request — ask us for the full list." | **CHANGED.** Was: "Chafing dishes in brass, copper, gold and silver finishes, in round, square and handi shapes. We hold more designs than are photographed here." (Metals unconfirmed.) |
| Cutlery & Serveware | "Cutlery and serving pieces to go with the crockery" | — |
| Glassware | "Plain glassware: water tumblers, highball and rocks tumblers, and wine glasses." | **CHANGED.** Was: "Plain clear glassware: …" |

Also:

- `catalogueCopy.landing.footnote` — "Rates depend on your dates, quantities and
  delivery location." Confirm that these are what the rate depends on.
- `catalogueCopy.textOnly.listNote` — "This collection has not been photographed yet.
  Photographs on request — ask us on WhatsApp." and `catalogueCopy.item.photoPending` —
  "Photograph to follow — ask us for a picture". **NEW COPY.** Will the business send
  photographs on request? (The heritage-only note it replaces read: "This range has not
  been photographed yet. Ask us and we will send pictures of the pieces.")
- `catalogueCopy.landing.lead` — "Our crockery and tableware on hire, in 8 collections.
  Add what you like to a quote list and send it to us on WhatsApp." NEW COPY; the 8 is derived.

---

## 4. Home page (`src/content/home.ts` → `home`)

| # | Statement | Key | Status |
|---|---|---|---|
| 4.1 | **"Delivered clean, collected after" — "The crockery is delivered clean and ready to use, and collected once your event is over."** | `home.howItWorks.steps[2]` | **Part CARRIED OVER — confirm it is still current.** That the business delivers comes from the previous site's home page ("Everything below is stock we hold and deliver ourselves"); the previous Glassware text also said "counted out and counted back". **"clean and ready to use" and "collected once your event is over" are not in the carried-over text** — confirm that the business collects, or the sentence should say only what it does |
| 4.2 | "We check what is available for your dates and confirm the pieces, the quantities and the rates with you." | `home.howItWorks.steps[1]` | NEW COPY |
| 4.3 | "Send us the designs you like, your event date and your guest count on WhatsApp, or call us." | `home.howItWorks.steps[0]` | NEW COPY |
| 4.4 | Headline "Since 1977, one family has laid the table." (three lines) | `home.hero.headline` | CARRIED OVER |
| 4.5 | "on hire for hotels, caterers and wedding planners" — the customer types | `home.hero.lead`; also `site.ts` → `siteMetadata.description` | From the PRD; confirm |
| 4.6 | Heritage teaser: "In 2001 Nikesh Gabhawala brought the business to Vadodara, starting with steel plates and simple melamine. Bone china followed in 2015, and in 2023 his son Jay joined him." | `home.heritage.body` (years from `brand` and `founders.ts` → `storyYears`) | Condensed from the founders' story |
| 4.7 | "We will reply with availability and rates." | `home.closingCta.body`, `catalogueCopy.basket.lead` | NEW COPY |
| 4.8 | Trust strip, four facts: 1977 "First shop opened in Malad, Mumbai" · 3 "Generations of the family" · years "In Vadodara" (derived from 2001) · 2015 "Bone china introduced on hire". No catalogue counts. GSTIN is not shown here | `home.trust.items` | Facts from CLAUDE.md and the founders' story. The story says "**By** 2015, he had introduced bone china" — is 2015 the year? (also 5.5) |
| 4.9 | Hero image: the Golden Rim photograph (`/images/products/bone-china/golden-rim.webp`, 1184×1184). Alt: "White bone china dinner plate, quarter plate, saucer and two bowls with a gold lattice border, on a dark cloth" — written from the photograph | `home.ts` → `HERO_ITEM_ID`, `HERO_ALT` | Alt is INFERRED from the photograph. A 4:5 crop of this square leaves 947px of width — no photograph in the library gives 1000px. **A larger hero photograph is needed** (at least 1250×1250, or 1000×1250 portrait) |
| 4.10 | Featured lead: "8 collections of crockery and tableware. Rates on request." | `home.featured.lead` | NEW COPY; the 8 is derived |

---

## 5. Founders page (`src/content/founders.ts` → `founders`)

The story text is the family's own. Iteration 2 made four edits to it so that the
page states only what the site can stand behind. **The family's original sentences
are below, word for word; restore any of them by pasting it back.**

| # | Key | Original (the family's words) | Now on the site | Why |
|---|---|---|---|---|
| 5.1 | `founders.story.sections[0].paragraphs[2]` | "Today, his twenty-five years of dedication — built on the foundation his father laid in Mumbai decades earlier — stand as the bedrock of everything we are." | "Today, his dedication since 2001 — built on the foundation his father laid in Mumbai decades earlier — stands as the bedrock of everything we are." | A typed count of years is right in 2026 and wrong from 2027. 2001 comes from `brand.vadodaraSinceYear` |
| 5.1b | `founders.people.profiles[0].description` | "Built the foundation of Indian Hirers piece by piece over twenty-five years with dedication and a will to serve." | "Built the foundation of Indian Hirers piece by piece since 2001, with dedication and a will to serve." | same |
| 5.2 | `founders.story.sections[1].paragraphs[0]` | "Under their combined leadership, Indian Hirers has become one of the leading rental agencies across Gujarat, trusted for quality crockery and dependable service." | "Under their combined leadership, Indian Hirers serves hotels and caterers across Gujarat from Vadodara, with quality crockery and dependable service." | A ranking the site cannot evidence. **The replacement makes its own claims — "hotels and caterers" (from the PRD) and "across Gujarat" (from the service-area list in 6.2) — confirm both** |
| 5.3a | `founders.story.sections[0].paragraphs[2]` | "The years that followed brought steady, exponential growth." | "The years that followed brought steady growth." | Growth stated plainly |
| 5.3b | `founders.story.sections[1].paragraphs[0]` | "Together, they have grown the business exponentially, bringing fresh energy and renewed ambition to a legacy that now spans three generations." | "Together, they have grown the business steadily, bringing fresh energy and renewed ambition to a legacy that now spans three generations." | same |

Everything else in the two story sections is unchanged. Not edited, but worth the
owner's eye: "a bold step that set us apart in the market" (section 1) and "is now a
growing name across Gujarat" (the story's closing sentence).

| # | Item | Key | Confirm |
|---|---|---|---|
| 5.4 | Roles: Nikesh = "Founder", Jay = "Partner". The story says Nikesh's father founded the first shop in 1977 | `founders.people.profiles[*].role` | Correct titles? Should Mr. Jasvantlal Satilal Gabhawala have a profile? |
| 5.5 | Milestones 1977, 2001, 2015, 2023 — each restates the story. The story says "By 2015" for bone china | `founders.milestones.items`, `storyYears` | Is 2015 the year bone china was introduced? |
| 5.6 | No portraits exist; the UI shows a monogram | `founders.people.profiles[*].portrait` (null) | Photographs of Nikesh and Jay |
| 5.7 | Hero subtitle. **CHANGED** — it repeated the story's closing sentence word for word. Was: "What started as a very small shop in Malad, Mumbai, in 1977 is now a growing name across Gujarat — carried forward across generations, from grandfather to father to son." Now: "A family crockery hire business that began in Malad, Mumbai, in 1977 and has been in Vadodara since 2001." (brand facts only). The closing sentence is still in the story, once | `founders.hero.subtitle` | Acceptable? |

---

## 6. Contact page (`src/content/contact.ts` → `contact`)

| # | Item | Key | Status |
|---|---|---|---|
| 6.1 | **Hours: "Mon–Sat: 9:00 AM – 7:00 PM"** | `contact.details.hours.value` | **CARRIED OVER from the previous site — confirm it is still current.** Left out of the JSON-LD until confirmed |
| 6.2 | **Service areas: "Vadodara · Ahmedabad · Surat · Bharuch · Anand"** | `contact.details.serviceAreas.value` | **CARRIED OVER from the previous site — confirm it is still current.** **CHANGED:** the previous site's line was "Vadodara · Ahmedabad · Surat · Bharuch · Anand · and growing across Gujarat"; the last phrase is a forward-looking claim and was removed |
| 6.3 | "we will reply as soon as we can during working hours" (the old site promised "within a few hours"; that promise was removed) | `contact.form.lead`, `contact.form.toasts.success.description` | NEW COPY — is there a response time the business wants to state? |
| 6.4 | "We will call or WhatsApp you on this number." | `contact.form.fields.phone.helper` | NEW COPY |
| 6.5 | Map title says "in Akota, Vadodara"; the fallback link searches Google Maps for the brand name plus the address | `contact.map` | Is there a Google Maps listing? Its embed URL goes in `NEXT_PUBLIC_MAP_EMBED_URL` |
| 6.6 | Address shown is the brand address (Akota, 390020). The different address the old contact page fell back to has been removed | `site.ts` → `brand.address` | — |
| 6.7 | While the form cannot send (no Web3Forms key) it is not shown at all. In its place: "Enquire by WhatsApp or phone" — "The enquiry form is not available right now. Message us on WhatsApp or call us and we will take the details from you." The page lead becomes "Have an event coming up? Message us on WhatsApp or call us with your date and guest count." | `contact.form.unavailable`, `contact.leadWithoutForm`, `hasEnquiryForm` | NEW COPY. Goes away once the key is set (OPEN_ISSUES O14) |

---

## 7. Gallery and testimonials

| # | Item | Key | Status |
|---|---|---|---|
| 7.1 | Gallery is "The range, close up" — product photographs only (21 today). No event photographs exist. Captions follow the new item names ("Golden Rim", "Blue Rim") | `gallery.ts` → `gallery`, `galleryPhotos`, `eventPhotos` (empty) | Event photographs needed |
| 7.2 | "Not everything we hold has been photographed. Ask us and we will send you a picture." | `gallery.cta.body` | NEW COPY — will the business send photos on request? |
| 7.3 | Testimonials list is empty; the page says "We have not published any testimonials yet. When we do, each one will carry the name of the customer who gave it" and invites the visitor to call or message. The page is not linked from the header, drawer or footer, and is `noindex`, until the list has an entry — all three switch on by themselves | `testimonialList.ts` → `testimonials` (empty), `hasTestimonials`; `testimonials.ts` → `testimonialsPage.empty`; `site.ts` → `mainNav`, `routeMetadata` | Real, attributed testimonials needed |

---

## 8. Site-wide (`src/content/site.ts`)

| # | Item | Key | Status |
|---|---|---|---|
| 8.1 | Site description: "Indian Hirers hires out bone china, melamine, glassware and chafing dishes to hotels, caterers and wedding planners. A family business since 1977, in Vadodara, Gujarat since 2001." | `siteMetadata.description` | NEW COPY |
| 8.2 | Search keywords | `siteMetadata.keywords` | NEW COPY |
| 8.3 | No social share image exists (`/og-image.jpg` was referenced by the old layout but is not in `public/`) | `siteMetadata.ogImage.src` (null) | A 1200×630 image is needed |
| 8.4 | Site address is unknown. The old code fell back to two different domains; both fallbacks are gone and `NEXT_PUBLIC_SITE_URL` is empty | `.env.example`, `src/lib/env.ts` → `env.siteUrl` | **What is the live domain?** |
| 8.5 | JSON-LD `areaServed` is "Vadodara, Gujarat" (not the unconfirmed list in 6.2) | `localBusinessJsonLd()` | — |
| 8.6 | Footer line: "Crockery and event tableware on hire. In Vadodara since 2001." | `shell.footer.blurb` | NEW COPY |
| 8.7 | WhatsApp prefill messages | `whatsappMessages` | Item quote wording is the owner's; the others are NEW COPY |
| 8.8 | Catalogue wording uses the owner's spellings "Chat" and "Nasta" | `collections.ts` | Preferred over "Chaat" / "Nashta"? |
| 8.9 | Accessible names (read by screen readers, used by voice control). **CHANGED** so each begins with the visible label: home link — label removed, the link is named by its text "Indian Hirers" (was "Indian Hirers — home"); bottom bar WhatsApp — "WhatsApp Indian Hirers" (was "Message Indian Hirers on WhatsApp"); bottom bar Enquire — label removed (was "Go to the enquiry form"); collection card — "Bone China collection" (was "View Bone China"); item WhatsApp action — "Ask on WhatsApp about Golden Rim" (was "Ask about Golden Rim on WhatsApp") | `shell.header.homeLinkLabel` (unset), `shell.bottomBar`, `catalogueCopy.landing.cardLinkLabel`, `catalogueCopy.item.askOnWhatsAppLabel` | Not owner-facing; recorded for completeness |
| 8.10 | Page titles: Contact — "Contact — Call, WhatsApp or Enquire in Vadodara"; Founders — "Founders — A Family Business Since 1977" (each followed by " \| Indian Hirers") | `routeMetadata` | NEW COPY |

---

## 9. Phase R3 — catalogue transcription and trust badges

The R3 brief transcribed the owner's four-page catalogue line by line. Where it says
more than the earlier short-hand list did, the data now follows it. Rates were in the
brief and are **not** in the code (OPEN_ISSUES O21). This section replaces rows 2.6,
2.9, 2.10, 2.11 and 2.15 above.

### 9.1 Pieces — now from the catalogue

| # | Change | Where | Status | Confirm |
|---|---|---|---|---|
| 9.1 | Premium Melamine: **Double Color** and **24KT Blue** are hired as Dinner Set and Soup Set only. The seven-piece list (Dinner Set, Soup Set, Chat Bowl Big / Small, Snack Plate Big / Small, Nasta Plate 9") belongs to the **Matt Black Series** alone. Before R3 all three designs showed all seven pieces | `collections.ts` → `MELAMINE_SET_PIECES`, `MATT_BLACK_SERIES_PIECES` | SHOWN | Right? |
| 9.2 | Regular Melamine: **Matt** and **24KT Gold** now show Dinner Set and Soup Set. Before R3 they showed "Ask us which pieces are available" | `collectionSeeds["regular-melamine"].items` | SHOWN | Right? |
| 9.3 | The melamine catalogue lines read "Dinner" and "Soup", sold together as a set. The site labels them "Dinner Set" and "Soup Set", as it has since R1 for the premium range and the same words as the bone china pieces | `MELAMINE_SET_PIECES`, `MATT_BLACK_SERIES_PIECES` | SHOWN | Is a melamine "Dinner" a dinner set, or a single dinner plate? If a plate, the labels should say so |
| 9.4 | Chat & Snack Plates: the catalogue's eleven lines are eight entries in the data — Rectangular · Dessert Bowl · Snack Plate · Mug · Chat Plate (Small, Big) · Blue Handle · **Marble** (Small, Big) · **Matt** (Small, Big). Seven are shown; Marble and Matt now show their two sizes. Before R3 the sizes were hidden and the plain "Small" and "Big" lines had been read as sizes of the Snack Plate | `collectionSeeds["chat-and-snack-plates"].items` | SHOWN, one HIDDEN | See 9.5 and 9.6 |
| 9.5 | The entry for the plain "Small" and "Big" lines is named "Chat Plate" by us, after the catalogue's heading "Chat Plates"; the catalogue gives those two lines no name. Because the name is ours the entry is not shown | `…items[4]` → `status: "unconfirmed"` | **HIDDEN** | What do you call the plain one? Then set `status: "available"` |
| 9.6 | Marble and Matt are filed as **plates**, so they answer the "Plates" filter. This is the one value on the site read from a heading ("Chat Plates") rather than stated; the Matt Black Series has chat *bowls*, so these could be bowls | `CHAT_PLATE_SIZES` (`type: "plate"`) | SHOWN | Plates or bowls? |
| 9.7 | Also hidden in Chat & Snack Plates: the material (assumed melamine) on all eight entries; that "Rectangular" is a plate. "Blue Handle" still lists no piece | `…items[*].assumed` | HIDDEN | Material? What is the Blue Handle piece? |

### 9.2 Copy changed in R3

| Collection | Now | Was |
|---|---|---|
| Premium Melamine | "Our premium melamine designs. Double Color and 24KT Blue are hired as dinner sets and soup sets; the Matt Black Series also comes as chat bowls, snack plates and a 9\" nasta plate." | "Our premium melamine designs, including the Matt Black Series. Hired as dinner sets, soup sets, chat bowls, snack plates and a 9\" nasta plate." |
| Regular Melamine | "Matt Melamine and 24KT Gold Melamine — straightforward melamine service for everyday functions. Each is hired as a dinner set and a soup set." | "… Ask us which pieces are available in each." |

### 9.3 Counts after R3

Derived by `npm run test:catalogue`; nothing below is typed into the site. "Hidden" is
in the code and not on the site.

| Collection | Public | Hidden | Total | With photograph |
|---|---:|---:|---:|---:|
| Vintage & Heritage Silver | 5 | 0 | 5 | 0 |
| Bone China | 7 | 2 | 9 | 5 |
| Premium Melamine | 9 | 0 | 9 | 7 |
| Regular Melamine | 2 | 0 | 2 | 0 |
| Chat & Snack Plates | 7 | 1 | 8 | 0 |
| Chafing Dishes & Buffet Display | 5 | 6 | 11 | 5 |
| Cutlery & Serveware | 0 | 0 | 0 | 0 |
| Glassware | 4 | 0 | 4 | 4 |
| **Total** | 39 | 9 | 48 | 21 |

Bone China's two hidden entries are "Yellow" and "Black-White" (§1, O2). Its nine
entries are the catalogue's seven designs plus the two photographed designs that are
not in the catalogue under those names (Haldi Ivory, Spiral Motif).

### 9.4 Trust badges (`src/content/site.ts` → `trustBadges`)

In the data, **rendered nowhere**. The home trust strip is still `home.trust` (§4).

| # | Badge | `confirmed` | To confirm |
|---|---|---|---|
| 9.8 | "25+ Years of Heritage" | **false** | The brief's wording, but the family's first shop opened in **1977** — 49 years — and the home strip leads with 1977. Twenty-five years is the time in Vadodara (since 2001). Should this read "in Vadodara", or use the longer history? |
| 9.9 | "Hotels & Caterers Trust Us" | **false** | The brief's wording. No hotel or caterer is named anywhere on the site (O12) |
| 9.10 | "Complete Event Tableware" | **false** | Flagged by the brief itself. "Complete" is a claim: Cutlery & Serveware has no list yet and there is no linen or furniture |
| 9.11 | "Careful Handling & On-time Delivery" | **false** | Flagged by the brief itself. Delivery and collection are themselves unconfirmed (O9) |

---

## 10. Phase R4 — home page and shell wording from the R4 brief

Everything here is the brief's own wording, or a rewrite it made necessary. Where it
replaced copy, the earlier wording is quoted so it can be restored.

| # | Now | Key | Was | Status |
|---|---|---|---|---|
| 10.1 | Home `h1`: **"An Occasion with Dignity"** (the tagline, on two lines) | `home.hero.headline` (split from `brand.tagline`) | "Since 1977, one family has laid the table." (4.4) | The brief's. 1977 is still stated in the eyebrow, the lead and the trust strip |
| 10.2 | Hero eyebrow stays "Since 1977 · Vadodara since 2001" | `home.hero.eyebrow` | — | **The brief's "SINCE 25 YEARS · VADODARA" was not used**: the business dates from 1977; 25 years is the time in Vadodara, which the eyebrow already says (same point as 9.8) |
| 10.3 | Hero buttons: "WhatsApp for a quote" · "Explore collections" (the brief's words, in the site's sentence case) | `home.hero.primaryCta.label`, `.secondaryCta.label` | "Enquire on WhatsApp" · "See the collections" | The brief's labels. Order and colours unchanged (OPEN_ISSUES O25) |
| 10.4 | Header button, from 768px: "Get a quote" — opens WhatsApp with a quote request to fill in: "Hello Indian Hirers, I'd like a quote for crockery on hire. / Event date: / Number of guests: / Pieces or designs:" | `shell.header.quoteCta`, `whatsappMessages.quoteRequest` | "Enquire", to the contact page | The label is the brief's; the message is NEW COPY, so this button does a different job from the general enquiry buttons beside it |
| 10.5 | Menu and footer link: "Our story". The page title is now "Our Story — A Family Business Since 1977"; the route is still `/founders` and the page's `h1` is unchanged ("Three Generations, One Promise") | `site.ts` → `NAV_ITEMS`, `routeMetadata["/founders"]` | "Founders" · "Founders — A Family Business Since 1977" | The brief's |
| 10.6 | Heritage teaser link: "Read our story" | `home.heritage.link.label` | "Read the founders' story" | The brief's |
| 10.7 | How hiring works — titles: "Choose your pieces" · "WhatsApp us the quantity and date" · "We deliver and collect" | `home.howItWorks.steps[*].title` | "Tell us what you need" · "We confirm pieces, quantities and dates" · "Delivered clean, collected after" | The brief's titles |
| 10.8 | Step 1 body: "Browse the collections and add the designs you like to your quote list." | `home.howItWorks.steps[0].body` | 4.3 | NEW COPY (the quote list is the one on the collection pages) |
| 10.9 | Step 2 body: "Send us your list with the quantities, your event date and your guest count. We confirm what is available and the rates." | `home.howItWorks.steps[1].body` | 4.2 | NEW COPY |
| 10.10 | Step 3 body unchanged; **"We deliver and collect" is still unconfirmed** | `home.howItWorks.steps[2]` | — | See 4.1 and OPEN_ISSUES O9 |
| 10.11 | Closing band heading: "Planning an event? Let us set the table." | `home.closingCta.heading` | "Planning an event?" | The brief's |
| 10.12 | Footer social links: accessible names "Indian Hirers on Instagram" / "Indian Hirers on Facebook". **Not shown** until `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_FACEBOOK_URL` are set | `shell.footer.social`, `src/lib/env.ts` | — | NEW. Which profiles exist? |
| 10.13 | Landmark label of the floating button: "WhatsApp shortcut" | `shell.floatingWhatsApp.regionLabel` | it shared "Quick contact" with the bottom bar | Not owner-facing |

---

## 11. Phase R5 — catalogue wording from the R5 brief

The brief's own wording, or new copy it made necessary. Where it replaced copy, the
earlier wording is quoted so it can be restored. All keys are in
`src/content/collections.ts` → `catalogueCopy` unless another file is named.

| # | Now | Key | Was | Status |
|---|---|---|---|---|
| 11.1 | Catalogue `h1`: **"Our collections"** | `landing.heading` | "Collections" | The brief's, in the site's sentence case |
| 11.2 | Closing strip on `/collections`: "Not sure what you need?" / "WhatsApp us your guest count and we'll suggest a set." / button "Ask on WhatsApp" | `landing.suggest` | A text link, "Ask for a quote on WhatsApp", under the rates note (removed: the strip is the action now) | The brief's sentence, split into a heading and a line. The button uses the catalogue's existing label |
| 11.3 | The strip's WhatsApp message: "Hello Indian Hirers, I'm not sure what I need. Could you suggest a set? / Number of guests: / Event date:" | `site.ts` → `whatsappMessages.suggestSet` | — | NEW COPY |
| 11.4 | Tab labels, shortened so the row fits a laptop: "All" · "Vintage Collection" · "Bone China" · "Premium Melamine" · "Regular Melamine" · "Chat Plates" · "Chafing Dishes" · "Cutlery" · "Glassware" | `tabs.labels` | — | NEW. Four are shorter than the collection's title ("Vintage & Heritage Silver", "Chat & Snack Plates", "Chafing Dishes & Buffet Display", "Cutlery & Serveware"); the full title is still the page heading and the card title. **Confirmed by the owner, 3 Oct 2026**, with "Vintage Collection" in place of the first draft's "Heritage Silver" |
| 11.5 | A collection with nothing listed (Cutlery & Serveware today): "Collection coming soon" / "WhatsApp us for current stock." Its count line on cards and above the heading still reads "Ask us for the list" | `emptyCollection` | "This list is not on the website yet" / "Tell us what you need and we will confirm what we hold for your date." | The brief's. **It says two things at once** — the collection is still to come, and there is stock to ask about. **Confirmed by the owner, 3 Oct 2026: keep "Collection coming soon"** |
| 11.6 | An item whose pieces are not confirmed shows **"Full catalogue coming soon – WhatsApp us!"** in its details (and in its row, where a collection is a text list) | `item.detailPending` | Nothing was shown | The previous site's card message (`Docs/App_Flow.md`), kept word for word as the brief asks. Shown today on nine items: six Premium Melamine photographs with no confirmed pieces (O3), Tableware (O8), Rectangular and Blue Handle (O5) — it goes away item by item as §9.1's pieces are confirmed |
| 11.7 | Quote list: the floating button reads "Quote list (2)" at every width (the owner's decision, 3 Oct 2026); the send button reads "Send on WhatsApp" | `basket.pillLabel`, `basket.send` | An icon with a count badge, named "Open your quote list, 2 items" · "Send list on WhatsApp" | The brief's |
| 11.8 | Quote list field: label "Event date and guest count", help "Optional, up to 300 characters. It goes into the message with your list." In the message it is the last line: "Event date and guest count: …" | `basket.noteLabel`, `basket.noteHint`, `site.ts` → `whatsappMessages.basketQuote` | — | NEW COPY |
| 11.10 | Filter reset reads "Clear filters", not the brief's "Clear all": the quote list has a "Clear list" beside it in the same session, and each says what it clears. After "Clear list" the announcement is "Quote list and event details cleared" | `filters.clear`, `basket.clearedAnnouncement` | "Quote list cleared" | Say if "Clear all" is wanted |
| 11.9 | Breadcrumb: "Home" / "Collections" / the collection's title | `collectionPage.breadcrumbHome`, `.breadcrumbCollections` | A single back link, "All collections" | Not owner-facing |

---

## 12. Phase R6 — founders, gallery, contact

| # | Now | Key | Was | Status |
|---|---|---|---|---|
| 12.1 | A third card in "Meet the Family": **Jasvantlal Satilal Gabhawala**, role "Founder, Malad, Mumbai, 1977", "Set up the family's first, very small shop in Malad (East), Mumbai, in 1977, and later sent the same idea forward to Vadodara." | `founders.people.profiles[0]` | — (two cards) | NEW COPY, restating the story's first two paragraphs, so the page's "Three Generations" shows three people. Confirm the role and the wording |
| 12.2 | Nikesh's role: **"Founder in Vadodara, 2001"** | `founders.people.profiles[1].role` | "Founder" | Changed: the story credits the 1977 shop to his father. Confirm (O11 also asks about the roles) |
| 12.3 | Pull-quotes: "With nothing more than a handful of steel plates and a will to serve" · "Carried forward across generations, from grandfather to father to son." | `founders.story.sections[*].pullQuote` | — | Excerpts of the family's own story text, not new words (OPEN_ISSUES O42) |
| 12.4 | Timeline entries kept off the page until a year is given: "Premium melamine and glassware" · "Through COVID" | `founders.milestones.items` (`status: "todo"`) | — | The years (O41) |
| 12.5 | Enquiry success: "Thank you, your enquiry is with us" / "We will call or WhatsApp you on the number you gave, as soon as we can during working hours." / "Send another enquiry" | `contact.form.success` | — (toast only) | NEW COPY |
| 12.6 | Phone error: "Enter a 10-digit Indian mobile number, with or without +91." | `contact.form.errors.phoneInvalid` | "Enter a valid phone number." | NEW COPY. Landlines are not accepted (the R6 brief asks for Indian 10-digit validation) — say if banquet desks should be able to give a landline |
| 12.7 | The "Enquiry sent" toast is gone: a sent enquiry is confirmed by the thank-you panel (12.5) alone. Error toasts are unchanged | `contact.form.toasts` | "Enquiry sent" / "Thank you. We will get back to you as soon as we can." | Removed (critique-iter2 m5) |
