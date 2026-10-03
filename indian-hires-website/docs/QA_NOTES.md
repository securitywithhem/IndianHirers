# QA notes

Hand-checkable walkthroughs for the interactive parts of the site. Each one is also
run by a script, so the steps below can be repeated by a person or re-run as a check.

## Catalogue — keyboard-only walkthrough (Phase R5)

**Route:** `/collections/bone-china` · **Keys used:** Tab, Shift+Tab, Enter, Space, Esc
— no pointer at any step.
**Scripted run:** `node scripts/collections-pass.mjs <out-dir> <base-url>` at 1280px and
390px; output in `docs/evidence/R5/collections-pass.log` (112 checks, all pass, on the
production build served by `next start`).
**Not done:** a screen-reader pass (VoiceOver / NVDA). Live regions and dialog names
were checked in the DOM only (OPEN_ISSUES E6, E32).

### Filter

| # | Key | What happens |
|---|---|---|
| 1 | Tab, Enter | The skip link is the first stop; Enter moves focus to `<main>` |
| 2 | Tab | Breadcrumb: "Home", then "Collections". From 768px a third crumb, "Bone China", is the current page — text, not a link; on a phone the `h1` below says it |
| 3 | Tab | Collection tabs: "All", then the eight collections. "Bone China" is marked as the current page. Enter on any tab goes to that collection. There is no way to jump past these eleven links to the filters (OPEN_ISSUES E42) |
| 4 | Tab ×10 from the "All" tab (12 from "Home") | The "Gold" chip in the Finish group. Each group is announced by its label ("Finish", "Piece"); each chip is a toggle button |
| 5 | Space (or Enter) | The chip is pressed. Focus stays on it. The grid shows 3 of 7 designs, the count line reads "Showing 3 of 7 designs" (a polite live region), and the address becomes `?finish=gold` |
| 6 | Space again, or Tab to "Clear filters" + Enter | The filter is released and the address is clean again |

A filter in the address is applied on load: `/collections/bone-china?finish=gold`
opens with the Gold chip pressed and only the three gold designs shown. A value the
collection does not offer (`?finish=not-a-finish`) is ignored.

### Open the item dialog

| # | Key | What happens |
|---|---|---|
| 7 | Tab | From the chips, through the count line's "Clear filters", to the first card: its title link ("Golden Rim"), then "Add to quote", then "Ask on WhatsApp" |
| 8 | Enter on the title link | The item dialog opens: a sheet from the bottom on a phone, a drawer from the right from 768px. Focus is on "Close details". The dialog is modal and named "Golden Rim details"; the page behind is inert and does not scroll |
| 9 | Tab / Shift+Tab | Focus cycles inside the dialog only: Close details → Add to quote → Ask on WhatsApp → Close details |

### Add to quote

| # | Key | What happens |
|---|---|---|
| 10 | Tab to "Add to quote", Enter | The button reads "Added" and is pressed. "Golden Rim added to your quote list" is announced from a live region inside the dialog |
| 11 | Esc | The dialog closes. Focus returns to the card's title link. The filter is still applied |

"Add to quote" on the card itself (step 7) does the same without opening the dialog.

### Send

| # | Key | What happens |
|---|---|---|
| 12 | Tab | After the last card comes the button "Quote list (1)". It appears only when the list is not empty. It is a pill with that label at every width; on a phone it sits 16px above the bottom bar, in the floating WhatsApp button's place |
| 13 | Enter | The quote list opens (modal, named "Your quote list"); focus is on "Close quote list". The button reports `aria-expanded` |
| 14 | Tab | The remove button of each item ("Remove Golden Rim from your quote list"), then the field "Event date and guest count". Removing an item moves focus to the remove button of the row that takes its place |
| 15 | Type | Free text, up to 300 characters (the help line under the field says so). Optional |
| 16 | Tab ×2 | "Clear list" (it empties the list and the event details), then "Send on WhatsApp" |
| 17 | Enter | WhatsApp opens in a new tab with one pre-filled message — nothing is sent until the visitor sends it there |
| 18 | Esc | The list closes; focus returns to the "Quote list" button |

The message from the scripted run:

```
Hello Indian Hirers, I'd like a quote for:
1. Golden Rim (Bone China)

Event date and guest count: 14 Feb 2027, 250 guests
```

### Also checked

- **Reload:** the list and the note come back from `sessionStorage`.
- **Storage blocked** (reads and writes throw): no error; the list works for the life
  of the page and is simply not restored after a reload.
- **Phone, 390px:** the same eighteen steps pass. The tab row and each filter row
  scroll sideways; a focused chip or tab scrolls itself into view. The page never
  scrolls sideways. The grid is one column; the tab row stays under the header while scrolling. With any card action scrolled level with the quote pill, the
  action's centre still takes a tap (the pill lies over its right half).
- **Reduced motion** (emulated, 390px and 1280px): the filter applies with nothing
  animating, both dialogs are in place within 150ms, Esc closes them and focus returns
  as above.
- **An item with nothing confirmed yet** (Premium Melamine → "Blue Rim"): its dialog
  shows the note "Full catalogue coming soon – WhatsApp us!" in place of a piece list.
- **A collection with nothing listed** (`/collections/cutlery-and-serveware`):
  "Collection coming soon — WhatsApp us for current stock", one WhatsApp button.
- **axe** (WCAG 2.1 A/AA and best practice), 390px and 1280px: no violations of any
  impact on `/collections`, on `/collections/bone-china?finish=gold`, with the item
  dialog open, with the quote list open, and on the empty collection.
- **The R4 pass** (`scripts/keyboard-pass.mjs`: skip link, header, mobile drawer,
  reduced motion, fixed buttons, layout shift) still passes: 43 checks,
  `docs/evidence/R5/keyboard-reduced-motion.log`.
