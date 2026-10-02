# Open issues

Unresolved items from the redesign. Nothing here is silently dropped; each entry
says what is blocking it. Copy assumptions awaiting the owner's confirmation are
listed separately, with file and key and the original wording, in
`docs/COPY_TO_CONFIRM.md`.

## Needs the owner — Phase R1

| # | Item | Where it shows | What is needed |
|---|---|---|---|
| O1 | Live domain unknown | `NEXT_PUBLIC_SITE_URL` is empty; canonical URLs and JSON-LD `url` are omitted and `/sitemap.xml` is empty until it is set | The domain |
| O2 | Bone china photo ↔ name | "Yellow" is probably the "Haldi Ivory" photo and "Black-White" may be "Spiral Motif". Both names are held back (`status: "unconfirmed"`, not rendered) so no design is listed twice | Confirm or correct |
| O3 | Six melamine photos have no owner name | They sit in Premium Melamine under descriptive names. "Double Color" and "24KT Blue" may be among them and are still listed separately | Owner's name for each, premium or regular, and whether the two duplicates should be merged |
| O4 | Glassware kept as an eighth collection | Not in the owner's collection list, but four photographed pieces exist | Keep or remove; is "8 collections" right |
| O5 | Chat & Snack Plates | Seven entries read from a short-hand list; material and sizes are not shown because they were inferred | What each item is, sizes, material |
| O6 | Chafing dishes | Six `status: "todo"` placeholders are hidden. Materials are not shown. The five photographed chafers' names and alt text still name metals (brass, copper, silver, gold) because they come from the generated `products.ts` | The six designs with photographs; the material and the business's name for each (then edit the `KEEP` table in `scripts/normalize-images.py` and re-run both scripts) |
| O7 | Cutlery & Serveware | Collection has no items and shows an "ask us" state | Contents and photographs |
| O8 | Heritage Silver | Five named pieces, no photographs; listed as text. Only the plates and cutlery are shown as silver-plated (the owner's own words) | Photographs; which other pieces are silver-plated |
| O9 | Delivery and collection | "How hiring works" step 3 says delivered clean and collected after. Only "stock we hold and deliver ourselves" is carried over from the previous site | Confirm cleaning and collection |
| O10 | Hours and service areas | Carried over from the previous site; service areas reduced to the five named cities | Confirm they are current |
| O11 | Founders' story wording | "one of the leading rental agencies across Gujarat", "exponential growth" and a typed "twenty-five years" were softened; the originals are quoted in `COPY_TO_CONFIRM.md` §5. Roles "Founder" / "Partner" | Approve the softened wording or restore; confirm roles; confirm bone china was introduced in 2015 (now a headline fact) |
| O12 | Testimonials | None published; the old ones read as invented and were not restored. The page shows an honest empty state, is `noindex`, and is out of the navigation until testimonials exist | Real testimonials with permission to credit |
| O13 | Missing assets | Event photographs, founder portraits, a 1200×630 share image, a transparent logo master, and a hero photograph of at least 1000×1250 (the largest source today gives 947px after the 4:5 crop) | The files |
| O14 | Contact form cannot send | `NEXT_PUBLIC_WEB3FORMS_KEY` is empty; the form is hidden and WhatsApp/call are offered instead | The Web3Forms key |
| O15 | Map embed | `NEXT_PUBLIC_MAP_EMBED_URL` is empty; an "open in Google Maps" link is shown instead | The embed URL |
| O16 | Rates | By the owner's decision no rates exist in the code and there is no price flag | Nothing — recorded so the decision is visible |
| O17 | WhatsApp icon | `lucide-react` has no WhatsApp glyph, so buttons use a generic chat bubble | Approve an SVG asset or an icon package |

## Engineering — Phase R1

| # | Item | Rubric | State | Blocking |
|---|---|---|---|---|
| E1 | First Load JS over budget on five routes in iteration 1 (`/collections` 114/110, `/collections/[slug]` 118/110, `/gallery` 136/110, `/founders` 114/100, `/testimonials` 108/100) | 9 | Fixed in iteration 2: every route within its ceiling (`docs/evidence/R1/verify-iter2.log`); headroom is thin on `/founders`, `/testimonials` (99.8/100) and `/collections/[slug]` (109/110) | — |
| E2 | Mobile LCP above 2.5s on seven routes and Performance below 95 on `/` (93), `/collections/bone-china` (94), `/gallery` (89) in iteration 1 | 9 | Being fixed in iteration 2 (hero text painted at first paint, image `sizes`, lazy tiles) | Re-measure after iteration 2 |
| E3 | Quote list reachable only under `/collections` | 5 | Deferred | Mounting the basket in the root layout adds JS to routes already at their budget; needs a budget decision |
| E4 | Lighthouse measured on localhost only (HTTP/1.1, simulated throttling) | 9 | Not measured on a deployed origin | Deploying is out of scope for this phase |
| E5 | INP not measured | 9 | Lab runs produce no INP; TBT is 0ms on every route | Needs field data |
| E6 | No screen-reader pass (VoiceOver/NVDA) on live regions and dialogs | 10 | DOM state checked by script only | Needs a manual pass |
| E7 | Without JavaScript the mobile menu, filters, item drawer, lightbox and quote list do nothing (all content is still shown; footer nav and bottom bar remain) | 7, 10 | Accepted for now | Progressive enhancement of the menu would need a CSS-only fallback |
| E8 | `public/images/Photos/**` (27 source JPEGs, 4.2 MB) is unreferenced but would ship with a deployment | 9 | Left in place | Deleting or moving files needs the owner's go-ahead |
| E9 | `next-themes`, `shadcn`, `@radix-ui/react-label` and `@radix-ui/react-slot` remain in `dependencies` though unused at runtime | 9 | Left in place | Removing a package needs the owner's approval |
| E10 | `src/content/products.ts` is still the generated photo manifest behind `collections.ts` | — | By design this phase | Folding it into one pipeline is a later clean-up |
