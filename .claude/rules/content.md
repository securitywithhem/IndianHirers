---
paths:
  - "indian-hires-website/src/**/*.{ts,tsx}"
  - "indian-hires-website/scripts/*.py"
---

# Content

All catalogue data and all copy live in `src/content/*.ts`. Components render
content; they do not contain it.

- **No string literals a visitor can read or hear inside `src/components` or
  `src/app`.** That covers headings, body, button labels, nav labels, alt text,
  `aria-label`s, form labels, placeholders, error and toast messages, WhatsApp prefill
  text, and `metadata` titles/descriptions.
- **Every content export has an explicit TypeScript type**, exported from the same
  file (`export const homeContent: HomeContent = …`). No inferred shapes, no `any`,
  no `as` casts to make data fit.
- One fact, one place. Brand name, tagline, address, GSTIN, phones and email are
  defined once and imported everywhere. Numbers that describe the catalogue
  (`21 designs`, `5 collections`) are derived from the data, never typed by hand.
- Contact details come from env vars through `src/lib/env.ts`
  (`NEXT_PUBLIC_PHONE`, `_PHONE_ALT`, `_WHATSAPP`, `_EMAIL`, `_MAP_EMBED_URL`,
  `_WEB3FORMS_KEY`, `_SITE_URL`). Components never read `process.env` directly.
  No fallback may be a real-looking but wrong number or address.
- **No pricing, ever.** No `price`, `rate`, `cost`, `mrp`, `amount`, `currency`,
  `discount`. The `NoPricing` type makes these compile errors; keep it on every
  catalogue type.
- `src/content/products.ts` is **generated**. Change the tables in
  `scripts/normalize-images.py` and `scripts/generate-products-content.py`, then
  re-run both. Hand edits are overwritten.
- Every image entry carries `src`, `alt`, `width`, `height` and `blurDataURL`.
- Catalogue taxonomy (categories, sub-types, tags) is a typed union, so an unknown
  slug is a compile error.
- Do not invent facts, testimonials, client names, counts or dates. If the business
  has not supplied it, leave it out and add a line to `docs/OPEN_ISSUES.md`.
- Spellings are fixed: "Indian Hirers", "Gabhawalas", "An Occasion with Dignity",
  "Jasvantlal".
