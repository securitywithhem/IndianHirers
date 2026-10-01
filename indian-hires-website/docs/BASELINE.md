# Baseline — state of the site before the redesign

**Captured:** 2 Oct 2026, Phase R0. Working tree, not `HEAD` — 45 modified/deleted
and 16 untracked paths sit on top of commit `a5b0078`.
**Scope:** facts only. No redesign opinions; those start in R1.

All paths are relative to `indian-hires-website/` unless they start with `Docs/`.

## 1. Verify result on the untouched baseline

`npm run verify` → **exit 1**. Full log: `docs/evidence/R0/verify-baseline.log`.

| Step | Result | Detail |
|---|---|---|
| 1 lint | pass | `next lint` — no warnings or errors |
| 2 typecheck | pass | `tsc --noEmit` — clean |
| 3 build | pass | Next 14.2.35, 17 static pages |
| 4 tokens | **fail** | 6 offenders, 13 warnings |

Token offenders (not fixed in R0, by instruction):

| File:line | Rule | Value |
|---|---|---|
| `src/app/layout.tsx:62` | raw-hex | `themeColor: "#800020"` — the old, wrong maroon (hue 345) |
| `src/components/home/ClosingCTA.tsx:19` | arbitrary-color | `hover:bg-[#1DA851]` |
| `src/components/home/Hero.tsx:76` | arbitrary-color | `shadow-[…rgba(201,162,39,0.6)]` |
| `src/components/home/LogoFinale.tsx:46` | arbitrary-color | `bg-[radial-gradient(circle,_#C5A44E…)]` |
| `src/components/layout/MobileBottomBar.tsx:11` | arbitrary-color | `shadow-[…rgba(0,0,0,0.06)]` |
| `src/components/products/CategoryCard.tsx:37` | arbitrary-color | `bg-[radial-gradient(…#C5A44E…)]` |

Warnings: 13 uses of stock `white` / `black` classes across 8 files (listed in the log).

Build output (First Load JS):

| Route | Type | Size | First Load |
|---|---|---|---|
| `/` | static | 81.3 kB | **182 kB** |
| `/contact` | static | 32.9 kB | 138 kB |
| `/products`, `/gallery`, `/products/[slug]` ×5 | static / SSG | ~190 B | 101 kB |
| `/testimonials` | static | 178 B | 96.2 kB |
| `/founders`, `/_not-found` | static | 142 B | 87.5 kB |
| shared by all | | | 87.3 kB |

Lighthouse and axe were **not run** — neither is installed (see `HARNESS_NOTES.md`).
There are no performance or accessibility numbers for the baseline.

## 2. Stack as installed

| Area | Actual | TRD says |
|---|---|---|
| Framework | Next 14.2.35 App Router, React 18, TS strict | same |
| Styling | Tailwind 3.4, `tailwindcss-animate` **and** `tw-animate-css` | Tailwind |
| UI kit | shadcn `base-nova` style on `@base-ui/react`; `form.tsx` still on `@radix-ui` | shadcn/ui |
| Icons | `lucide-react` ^0.300 | same |
| Motion | `framer-motion` ^12 (1 file) + `gsap` ^3.15 (1 file) | **AOS** |
| Forms | react-hook-form + zod + Web3Forms | same |
| Other | `next-themes` (only `ui/sonner.tsx`), `shadcn` CLI listed as a runtime dependency | — |

- **AOS is already gone**: not in `package.json`, not in `node_modules`, no imports.
  The only trace is a comment in `src/components/Providers.tsx`. TRD and
  Implementation_Plan still describe it.
- **`motion` is not installed.** Moving to it means adding `motion` and removing
  `framer-motion` (and deciding gsap's fate). Needs approval before install.
- `next.config.mjs` has no `output: "export"`. The site builds fully static, but
  `next/image` uses the default optimizer, which a pure static export does not support.
- Node v22.22.2, npm 10.9.7. No test runner, no Playwright, no Lighthouse, no axe.

## 3. Routes

| Route | File | Server/client | Notes |
|---|---|---|---|
| `/` | `src/app/page.tsx` | server, 2 client islands | Hero → Ledger → AboutStrip → HorizontalReveal → LogoFinale → ClosingCTA |
| `/founders` | `src/app/founders/page.tsx` | server | FoundersHero → StorySection → FoundersRow |
| `/products` | `src/app/products/page.tsx` | server | 5 category cards |
| `/products/[slug]` | `src/app/products/[slug]/page.tsx` | SSG ×5 | vintage, bone-china, melamine, glassware, chafing-dishes |
| `/gallery` | `src/app/gallery/page.tsx` | server | placeholder copy + the category cards again; `noindex` |
| `/testimonials` | `src/app/testimonials/page.tsx` | server | placeholder copy, no testimonials; `noindex` |
| `/contact` | `src/app/contact/page.tsx` | server + client form | ContactInfo + ContactForm |
| 404 | `src/app/not-found.tsx` | server | |
| `/sitemap.xml`, `/robots.txt` | `src/app/sitemap.ts`, `robots.ts` | | gallery/testimonials excluded |

Shell (`src/app/layout.tsx`): skip link → JSON-LD → `Providers` (Sonner toaster) →
`Header` → `<main id="main-content" class="pt-20">` → `Footer` → `MobileBottomBar` →
`FloatingWhatsApp`. Fonts: Inter 400/500/600 and Playfair Display 400/700 via `next/font/google`.

## 4. Components (37 files scanned, 2,930 lines in `src/`)

| Component | Lines | Client | Reads |
|---|---|---|---|
| `layout/Header` | 208 | yes | hard-coded nav array |
| `layout/Footer` | 92 | no | `env`, hard-coded nav/address/GSTIN |
| `layout/MobileBottomBar` | 48 | yes | `env` |
| `layout/FloatingWhatsApp` | 29 | yes | `env` |
| `home/Hero` | 97 | no | `content/home` |
| `home/Ledger` | 41 | no | `content/home` |
| `home/AboutStrip` | 23 | no | `content/home` |
| `home/HorizontalReveal` | 141 | yes (gsap) | `content/home`, `content/products` |
| `home/LogoFinale` | 85 | yes (framer-motion) | `content/home` |
| `home/ClosingCTA` | 33 | no | `content/home`, `env` |
| `founders/FoundersHero`, `StorySection`, `FoundersRow`, `FounderProfile` | 12–64 | no | `content/founders` |
| `products/CategoryCard` | 71 | no | `ProductCategory` type |
| `products/ProductTile` | 43 | no | `Product` type, `env` |
| `contact/ContactInfo` | 120 | no | `content/contact`, `env` |
| `contact/ContactForm` | 168 | yes | `lib/validations/contact`, `process.env` directly |
| `ui/*` (button, input, textarea, label, form, sonner) | 18–178 | mixed | shadcn primitives |
| `Providers` | 20 | yes | Sonner only |

Deleted in the working tree, still referenced by older docs: `GalleryCard`,
`ProductCard`, `TestimonialCard`, `home/CategoryCard`, `home/CategoryGrid`,
`home/TestimonialsPreview`, `home/TrustBadges`, `founders/MilestonesTimeline`,
`content/gallery.ts`, `content/testimonials.ts`.

## 5. Content sources

| File | Holds | Typed? |
|---|---|---|
| `src/content/products.ts` (429 lines, **generated**) | 5 categories, 21 products, image dims + blur placeholders | yes — `Product`, `ProductCategory`, `ProductImage`, `NoPricing` guard |
| `src/content/home.ts` | hero, ledger, showcase, finale, about, closing CTA | inferred only |
| `src/content/founders.ts` | hero, 5 story paragraphs, 2 founders | inferred only |
| `src/content/contact.ts` | phone, WhatsApp, email, address, areas, hours, map URL | inferred only |
| `src/lib/env.ts` | `web3FormsKey`, `phone`, `whatsapp`, `email`, `mapEmbedUrl` | — |

Catalogue: Vintage (0 products, `comingSoon`), Bone China (5), Melamine (7),
Glassware (4), Chafing Dishes (5). Flat list — no sub-types, sizes, materials or tags.

Images: 21 product tiles + 1 cover under `public/images/products/**` (square WebP),
`public/images/brand/logo.webp`, `hero-backdrop.webp`; 27 source JPEGs in
`public/images/Photos/**`. Pipeline: `scripts/normalize-images.py` →
`scripts/generate-products-content.py` (Python + Pillow). See `Docs/Phase3_Assets.md`.

**Catalogue PDFs are not in the repo.** `Docs/Phase3_Assets.md` describes two, and
says they carry wholesale rates that must not be published.

`.env.local`: phone, alt phone, WhatsApp and email are set and match the brand facts.
`NEXT_PUBLIC_WEB3FORMS_KEY` and `NEXT_PUBLIC_MAP_EMBED_URL` are **empty**;
`NEXT_PUBLIC_SITE_URL` is not defined anywhere.

## 6. Graphs

- `docs/graphs/baseline.json` / `baseline.html` / `baseline.report.md` — graphify AST
  extraction of `src/` (134 nodes, 102 edges). Open the HTML in a browser.
- `docs/graphs/baseline.mmd` — hand-checked import + data-flow diagram (Mermaid).
- `graphify-out/` (21 Jul) is stale: it still contains `TrustBadges`, `PlateMotif`,
  `TestimonialsPreview`. It was left untouched.

## 7. Reusable as-is

- Token plumbing: bare-HSL CSS variables in `globals.css` wrapped by `tailwind.config.ts`,
  with alpha modifiers working. Measured contrast table in `docs/color-system.md`.
- `src/content/products.ts` types, the `NoPricing` guard, and the two image scripts.
- `src/lib/useMotionPreference.ts` (reduced-motion + low-power gate, static by default on SSR).
- `src/lib/env.ts`, `src/lib/utils.ts` (`cn`), `src/lib/validations/contact.ts`.
- `generateStaticParams` + per-category metadata in `products/[slug]`.
- `next/font` setup, skip link, JSON-LD block, sitemap/robots.
- Product imagery with dimensions and blur placeholders; `next/image` used everywhere
  with `sizes`.
- ContactForm's react-hook-form + zod + Web3Forms + Sonner flow.

## 8. Must be replaced or changed to meet the R0 non-negotiables

Each item is a rule the baseline currently breaks, not a design judgement.

| Rule | Where it breaks |
|---|---|
| Tokens only, no raw colour | the 6 offenders in §1 |
| No hard-coded strings in components | nav arrays (`Header.tsx:10`, `Footer.tsx:5`), address + GSTIN + tagline (`Footer.tsx:21-27`, `Header.tsx:98`), all copy in `gallery/page.tsx`, `testimonials/page.tsx`, `contact/page.tsx`, `not-found.tsx`, `products/page.tsx`, `products/[slug]/page.tsx`; headings in `FoundersRow.tsx:7`, `ContactForm.tsx`, `ContactInfo.tsx`; labels in `CategoryCard.tsx`, `ProductTile.tsx`; the WhatsApp prefill text repeated in 5 files; every `metadata` block |
| Typed content | `home.ts`, `founders.ts`, `contact.ts` have no declared types |
| Env vars for phone/WhatsApp/email/map | `NEXT_PUBLIC_PHONE_ALT` is in `.env.example` but never read; `ClosingCTA` button text hard-codes the number (`content/home.ts:50`); `contact.ts` carries wrong fallbacks (§9) |
| Motion library = `motion` | `framer-motion` in `LogoFinale.tsx`, `gsap` in `HorizontalReveal.tsx` |
| Reduced-motion safe | `animate-ping` in `FloatingWhatsApp.tsx:22` and `hover:scale-*` in 8 places are not gated |
| Static-export friendly | default `next/image` optimizer; no `output: "export"` |

## 9. Existing bugs

### Wrong or conflicting business facts
1. `src/content/contact.ts:2-4` — fallback phone `+91 98254 24773`, WhatsApp
   `919825424773` and email `indianhirers@gmail.com` are **not the business's**
   (correct: 9825037478 / indianhires@gmail.com). They ship if the env vars are unset.
2. Two different addresses: `contact.ts:5` says *Gotri Road, 390021*; `Footer.tsx:26`
   says *Nr Urmi Char Rasta, Akota, 390020* (the latter matches the brand facts).
3. Brand name is written three ways: "IndianHirers" (metadata, drawer, footer ©, form
   subject), "Indian Hirers" (header, footer), "Indian Hires" (package name, all `Docs/`).
4. Domain fallback differs: `layout.tsx:26` uses `indianhires.com`; `robots.ts:4` and
   `sitemap.ts:5` use `indianhirers.com`.
5. `content/home.ts:33` says "Four categories"; there are five. The ledger beside it,
   which is derived, says five.
6. `content/founders.ts:19,26` spell "Jasvantal"; the story text at `:9` spells "Jasvantlal".
7. `content/home.ts:20` "25 years" is hand-typed and will drift; `founders/page.tsx:6`
   and `layout.tsx` descriptions lead with 25 years while the homepage leads with 1977.
8. Tagline casing: code uses "An Occasion With Dignity"; brand facts say "…with Dignity".

### Functional
9. `layout.tsx:50,56` reference `/og-image.jpg`; the file does not exist in `public/`.
10. `layout.tsx:96` JSON-LD `url` is `undefined` (`NEXT_PUBLIC_SITE_URL` unset); no
    address, alt phone or opening hours in the schema.
11. Contact form cannot send: `NEXT_PUBLIC_WEB3FORMS_KEY` is empty, so every submit
    shows "Form is not configured".
12. Contact map shows the developer string "Map preview unavailable — add
    NEXT_PUBLIC_MAP_EMBED_URL" to visitors (`ContactInfo.tsx:114`).
13. Honeypot is inert: `ContactForm.tsx:88` renders an unregistered checkbox and
    `:57` always sends `botcheck: false`.
14. `ContactForm.tsx:97,111` set native `required` without `noValidate`, so the browser's
    own bubble pre-empts the inline zod errors on empty submit.
15. Message is required by the schema (min 10) but its label has no required marker
    (`ContactForm.tsx:137`).
16. `ContactInfo.tsx:38` shows the phone number as the WhatsApp row's text; the second
    phone number appears nowhere on the contact page.
17. `public/` is **untracked in git**, as are `products/[slug]`, `components/products/`,
    five home components and `useMotionPreference.ts`. A deploy from `HEAD` would have
    no images and would not build.

### Accessibility
18. Nested `<main>`: `contact/page.tsx:14` and `testimonials/page.tsx:17` render a second
    `<main>` inside the layout's.
19. Mobile drawer (`Header.tsx:142-205`): no focus trap, focus is not moved in on open or
    returned on close, and the trigger has no `aria-expanded` / `aria-controls`.
20. Contrast failures (computed from the token values):
    cream on WhatsApp green **1.75:1** (`ClosingCTA.tsx:19` button text);
    white icon on WhatsApp green **1.96:1** (`FloatingWhatsApp.tsx:25`, needs 3:1);
    gold-light on gold **1.55:1** (`ClosingCTA.tsx:25` hover state);
    `text-cream/50` on surface-2 **4.47:1** at 12px (`ContactInfo.tsx` labels);
    `text-destructive` on surface-2 **3.15:1** (form error text, `ui/form.tsx:160`);
    input border on surface-2 **1.77:1** (needs 3:1 for a control boundary).
21. Heading order: `StorySection.tsx:11` jumps `h1` → `h3`; `CategoryCard.tsx:55` is an
    `h2` wherever it is used, including under the homepage section `h2`.
22. `AboutStrip.tsx:16` and `ClosingCTA.tsx:19,25` use `focus:` instead of
    `focus-visible:`; ring offsets default to white on dark surfaces.
23. `FounderProfile.tsx:59` wraps a third-person description in quotation marks inside
    a `<blockquote>`; `imageAlt` is passed and never used.

### Typography / styling
24. `contact/page.tsx:16-17`, `ContactForm.tsx:83-84` and all of `ContactInfo.tsx` use
    `font-serif` / `font-sans`, which are Tailwind's system stacks — not Playfair/Inter.
    The contact page headings therefore do not render in the brand typeface.
25. `globals.css:14-17` defines `--font-sans: var(--font-sans)` (self-referential) and
    `:103` applies `font-sans` to `html`.
26. `HorizontalReveal.tsx:48` puts `bg-surface` on a `max-w-7xl` section, so in the
    reduced-motion path the band is not full-bleed.
27. `Hero.tsx:7` comment still describes "an otherwise ivory page"; the site is dark.

### Motion / performance
28. `HorizontalReveal.tsx:78-90` pins the section for `scrollWidth − innerWidth`. With 5
    cards and 21 tiles that is ≈13 viewport-widths of scroll at 390px and ≈3.7 at 1920px
    (from the declared `vw` widths).
29. All 26 track images sit in one horizontal row; none are marked `priority` and all are
    in the DOM at first paint.
30. `Header.tsx:31` scroll listener is not passive and sets state on every scroll event;
    header uses `transition-all`.
31. `/` ships 182 kB First Load JS — both `gsap` and `framer-motion` load on the homepage.

### Stale documentation
32. `README.md` (root) lists the stack as "HTML5, CSS3, JavaScript".
33. `Docs/TRD.md` and `Docs/Implementation_Plan.md` specify AOS.
34. `docs/homepage-architecture.md` diagrams `TrustBadges` and `TestimonialsPreview`,
    both deleted. `Docs/Phase3_Assets.md` references `home CategoryGrid`, deleted, and
    "4 SSG routes" (there are 5).
35. `docs/qa/phase6*.md` sign off a state that no longer exists (e.g. `--gold-text #7A6530`,
    `info@indianhires.com`, "Lighthouse ≥ 95" with no recorded run).
36. `Docs/UI_UX.md` lists gold as `#C5A44E`; the token is `#C9A326`. The two hard-coded
    radial gradients use the former.
