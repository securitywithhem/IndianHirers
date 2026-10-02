# Shared kit

For the page builders. Compose these; do not re-implement a button, a band or a
collection tile. Everything here is a Server Component, takes its text as props (or
reads the brand from `@/content/site`), and uses token utilities only.

Spec: `Docs/UI_UX_V2.md`. Motion: `src/components/motion/README.md`.

| Import | What |
|---|---|
| `@/components/shared/ButtonLink` | a link styled as a primary / secondary button or a text link |
| `@/components/shared/WhatsAppButton` | the green WhatsApp call to action |
| `@/components/shared/CallButton` | a `tel:` button |
| `@/components/shared/AppLink` | the unstyled link all of the above are built on |
| `@/components/shared/Band` | a full-bleed section with the content column inside |
| `@/components/shared/PageHero` | the maroon band that opens every inner page |
| `@/components/shared/CollectionTile` | arch tile linking to a collection |
| `@/components/shared/BrandLogo` | the logo on its plaque |
| `@/components/shared/pageMetadata` | `routeMetadata[...]` → a page's `metadata` export |
| `@/components/ui/button` | a real `<button>` with the same recipes (`Button`) |

---

## Header offset — read this first

The header is `fixed`, always `h-header` (72px) tall, and **overlays the top of every
page**: transparent with ivory type (`theme-dark`) at the top, solid ivory after 80px of
scroll. Its state never moves the page.

1. **`<main>` has no top padding.** Whatever a page renders first starts at the very top
   of the viewport, underneath the header.
2. **Every page must therefore open with a maroon band that pads itself by the header's
   height.** Two ways, and only two:
   - inner pages: `<PageHero>` as the first element — it does this itself;
   - the home page: `<Band tone="maroon-deep" underHeader>` (`underHeader` = `pt-header`).
3. Anything else as a page's first element is a bug: its top 72px is hidden behind the
   header, and on ivory the header's ivory type is invisible.

That covers the 404 (`not-found.tsx` opens with `PageHero`) and a `notFound()` thrown from
a page. Do not add a second `<main>`; pages render fragments or sections. Anchor targets
clear the header already (`scroll-padding-top` on `html`), and below `md` they clear the
bottom bar (`scroll-padding-bottom`).

## Fixed elements — geometry

| Element | Shown | Position | Size | Layer |
|---|---|---|---|---|
| Header | always | `top-0 inset-x-0` | height 72px (`h-header`) | `z-header` (50) |
| Mobile bottom bar | below `md` | `bottom-0 inset-x-0` | height `4rem + env(safe-area-inset-bottom)` | `z-bar` (40) |
| Floating WhatsApp (in its own `<aside>` landmark) | from `md` | `bottom-6 right-6` | 56px circle (`size-14`) | `z-bar` (40) |
| Skip link | while focused | `left-4`, 8px below the header | 48px tall | `z-drawer` (60) |
| Mobile drawer, any `SlidePanel` | when open | `inset-0` | — | `z-drawer` (60) |
| Lightbox | when open | `inset-0` | — | `z-lightbox` (70) |

- `<body>` has `pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0` — exactly the bar's
  height — so the bar never covers the end of the page. Do not add your own bottom spacer.
- The floating WhatsApp button is **hidden below `md`** (the bar carries WhatsApp there).
- **Quote-basket button (catalogue routes):** put it in the free slot above those two:

  ```
  fixed z-bar right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-24
  ```

  Below `md` that is 16px above the bottom bar; from `md` it is 16px above the WhatsApp
  button (24 + 56 + 16 = 96px = `bottom-24`), right edges aligned. Keep it ≤ 56px wide on
  desktop so the two read as one column.
- While the drawer is open the rest of `<body>` is `inert` and the page cannot scroll.
  A `SlidePanel` of your own needs the same contract — copy it from
  `src/components/layout/MobileDrawer.tsx`.

---

## ButtonLink

```tsx
import { ButtonLink } from "@/components/shared/ButtonLink";

<ButtonLink href={routes.collections}>{hero.primaryCta}</ButtonLink>
<ButtonLink href={routes.contact} variant="secondary">{hero.secondaryCta}</ButtonLink>
<ButtonLink href={routes.founders} variant="link">{about.linkLabel}</ButtonLink>
```

| Prop | Type | Default | |
|---|---|---|---|
| `href` | `string` | — | site path, web URL, `tel:` or `mailto:` |
| `variant` | `"primary" \| "secondary" \| "link"` | `"primary"` | §7.1 / §7.2 / §7.3 |
| `size` | `"default" \| "sm"` | `"default"` | 48px / 44px |
| `className`, `aria-label`, other anchor attributes | | | |

Roles only: maroon on ivory, gold inside `.theme-dark`, with no extra classes (the
secondary's label is gold-300 on maroon, its border gold-500). One primary per view. A web URL opens a new tab and announces it; you never write `target` or `rel`.
An icon inside is `aria-hidden` and is sized to 20px automatically.

For a real `<button>` (submit, toggle) use `Button` from `@/components/ui/button`:
`variant`: `default` (primary) · `outline` (secondary) · `secondary` · `ghost` · `link` ·
`whatsapp` · `destructive`; `size`: `default` (48px) · `sm` (44px) · `icon` (44px square).

To style your own element, call `buttonVariants({ variant, size })` from
`@/components/ui/button-variants`. Its output has **no conflicting classes** (sizing is
chosen per variant; `link` is always `min-h-11` with no padding), so it needs no
tailwind-merge: in a client component join it with `cx` from `@/lib/cx`. Classes you add
must add (`w-full`, `self-start`, a margin), not override the recipe.

## WhatsAppButton

```tsx
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { whatsappMessages } from "@/content/site";

<WhatsAppButton message={whatsappMessages.general()} label={cta.whatsappLabel} />
<WhatsAppButton
  message={whatsappMessages.collectionEnquiry(collection.title)}
  label={catalogueCopy.collectionPage.enquireCta}
/>
```

Props: `message` (the prefill text — call the builder yourself, on the server),
`label`, `ariaLabel?`, `size?: "default" | "sm"`, `className?`.
Green fill with espresso type and icon, on any surface; never restyle the colours.
If no WhatsApp number is configured the link goes to `/contact` in the same tab.

In a **client** component, `whatsappMessages` and the `catalogueCopy` templates are
functions and cannot arrive as props: import the content module inside the client
component, or build the string on the server and pass the string.

## CallButton

```tsx
import { CallButton } from "@/components/shared/CallButton";
import { formatPhone } from "@/lib/links";

<CallButton label={cta.callLabel} />
<CallButton label={formatPhone(env.phoneAlt)} phone="alt" variant="link" />
```

Props: `label`, `ariaLabel?`, `phone?: "primary" | "alt"` (default `primary`),
`variant?: "primary" | "secondary" | "link"` (default `secondary`),
`size?: "default" | "sm"`, `className?`. The number comes from `env`.

## AppLink

```tsx
import { AppLink } from "@/components/shared/AppLink";

<AppLink href={mapSearchUrl(brand.address.oneLine)} className="focus-ring text-link underline …">
  {contact.directionsLabel}
</AppLink>
```

Unstyled. Picks `next/link` for a site path, a new-tab anchor (with the screen-reader
note from `shell.newTabNote`) for a web URL, and a plain anchor for `tel:` / `mailto:`.
Use it for any link whose URL comes from `whatsappUrl()`, `telUrl()`, `mailtoUrl()` or
`mapSearchUrl()` — those can return `/contact`, so never hard-code `target="_blank"`.
It reads content, so use it in Server Components; in a client component use `next/link`.

## Band

```tsx
import { Band } from "@/components/shared/Band";

<Band tone="ivory" linen aria-labelledby="collections-heading">…</Band>
<Band tone="ivory-alt">…</Band>
<Band tone="maroon" glow>…</Band>                              {/* the one mid band / closing CTA */}
<Band tone="maroon-deep" glow size="hero" underHeader>…</Band>  {/* a page's first band */}
```

| Prop | Type | Default | |
|---|---|---|---|
| `tone` | `"ivory" \| "ivory-alt" \| "maroon" \| "maroon-deep"` | `"ivory"` | ivory-50 / ivory-100 / maroon-800 / maroon-950. Maroon tones add `theme-dark relative isolate overflow-hidden` |
| `linen` | `boolean` | `false` | ivory tones only; at most two per page |
| `glow` | `boolean` | `false` | maroon tones only; a static candle glow layer |
| `size` | `"default" \| "sm" \| "hero" \| "none"` | `"default"` | `py-section` / `py-section-sm` / `pb-section pt-section-sm` / none |
| `underHeader` | `boolean` | `false` | see Header offset |
| `as` | `"section" \| "div" \| "header" \| "aside" \| "article"` | `"section"` | |
| `id`, `aria-labelledby`, `aria-label` | `string` | — | on the band element |
| `className` / `innerClassName` | `string` | — | the full-bleed band / the inner `shell` |

The band is full-bleed at every width; children sit in the 1280px `shell`. Inside a
maroon tone write roles (`text-foreground`, `text-heading`, `text-kicker`) and pass
`tone="dark"` to `SectionHeading`. A form inside a maroon band goes in a
`theme-light rounded-card bg-card p-6 md:p-8` panel. Rhythm rules: §5.2 (two ivory bands
in a row alternate `ivory` / `ivory-alt`; at most one maroon band between hero and CTA).

## PageHero

```tsx
import { PageHero } from "@/components/shared/PageHero";

<PageHero eyebrow={copy.eyebrow} heading={copy.heading} lead={copy.lead} />

<PageHero heading={collection.title} lead={collection.description} before={<Breadcrumb />}>
  <WhatsAppButton message={…} label={…} />
</PageHero>
```

| Prop | Type | Default | |
|---|---|---|---|
| `heading` | `string` | — | rendered as the page's one `h1` (`type-display`) |
| `eyebrow`, `lead` | `string` | — | |
| `align` | `"start" \| "center"` | `"center"` | |
| `divider` | `boolean` | `true` | the crown divider; counts towards three per page |
| `glow` | `boolean` | `true` | |
| `headingId` | `string` | — | `id` of the `h1` |
| `before` | `ReactNode` | — | above the heading (breadcrumb, back link) |
| `children` | `ReactNode` | — | under the lead (actions) |

Maroon-800 band, `theme-dark`, compact padding. It handles the header itself: it starts
under the transparent header and pads its content by `pt-header`. It must be the **first
element** of /collections, /collections/[slug], /founders, /gallery, /testimonials,
/contact and the 404. It is not a landmark; do not wrap it in `<header>`.

## CollectionTile

```tsx
import { CollectionTile } from "@/components/shared/CollectionTile";
import { collections } from "@/content/collections";

<Stagger as="ul" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
  {collections.map((collection) => (
    <StaggerItem as="li" key={collection.slug}>
      <CollectionTile collection={collection} headingLevel="h3" />
    </StaggerItem>
  ))}
</Stagger>
```

| Prop | Type | Default | |
|---|---|---|---|
| `collection` | `Collection` | — | |
| `headingLevel` | `"h2" \| "h3" \| "h4"` | — | the tag; the type role is always `type-h4` |
| `sizes` | `string` | fits exactly the 2 / 3 / 4-column grid above | **pass your own if your grid differs** — the width of the photograph, which is the tile less 38px (46px from `md`) |
| `className` | `string` | — | |

One link per tile (`h-full`, so tiles in a row are equal height). Shows `collection.hero`
in an `ArchFrame` with the blur placeholder, or the crown placeholder when `hero` is
null; then title, tagline and the count line from `collectionCountLabel(collection)`. Lifts with
`card-royal` and zooms the photograph on hover and focus; both off under reduced motion.
The card uses roles, so it also works inside a maroon band. Never `priority`.

## BrandLogo

```tsx
import { BrandLogo } from "@/components/shared/BrandLogo";

<BrandLogo size="footer" />            {/* alt text from shell.logo.alt */}
<BrandLogo size="header" decorative /> {/* beside the name in text: empty alt */}
```

Props: `size?: "header" | "footer"` (48px / 80px, default `header`), `decorative?`,
`className?`. The supplied file on its gold-ringed ivory plaque (§6.8). Never recolour,
filter, crop, mask or animate it, and never put it in an `ArchFrame`. The `<Crown>`
ornament is not the logo.

## pageMetadata

```tsx
import { pageMetadata } from "@/components/shared/pageMetadata";
import { routeMetadata, collectionMetadata } from "@/content/site";

export const metadata = pageMetadata(routeMetadata["/founders"]);

// /collections/[slug]
export function generateMetadata({ params }: Props) {
  const collection = findCollection(params.slug);
  return collection ? pageMetadata(collectionMetadata(collection)) : pageMetadata(routeMetadata.notFound);
}
```

Sets title (the layout's template appends the brand; the home title is emitted as
absolute), description, `robots` from `index`, canonical and `og:url` (only when
`NEXT_PUBLIC_SITE_URL` is set), Open Graph and Twitter. Every page should export it —
the root layout deliberately sets no canonical.

---

## Things to know

- **No tailwind-merge in the browser.** `cn` (`@/lib/utils`) is for Server Components
  only. A `"use client"` file uses `cx` from `@/lib/cx`, and everything it may import from
  here is merge-free too: `@/components/motion`, `@/components/ornament`,
  `@/components/ui/*`. Those append your `className`; where they have a default you can
  change (`Crown` height, `ArchFrame` / `CrownPlaceholder` width, `CrownDivider` width,
  margin and colour, `SectionHeading` gap) it is a zero-specificity `[:where(&)]:…` class,
  so your utility wins. The components in this folder still use `cn`: keep them out of
  client components.
- **Forms:** `Input`, `Textarea` and `Label` in `@/components/ui/` are at spec §7.8 (48px
  controls, `focus-ring`, `aria-invalid:border-destructive`). `Input` and `Textarea`
  forward their `ref`. `ui/form.tsx` is gone. Do not pass ring or border colour overrides.
- **Toasts:** `toast()` from `sonner` works anywhere; the toaster is mounted in
  `Providers` and loads lazily. It uses the `popover` role — no `richColors`.
- **Focus:** put `focus-ring` on anything interactive you build by hand, plus a radius
  (`rounded-sm` / `rounded-md`) so the ring follows the shape.
- **Client components** must not import `AppLink`, `BrandLogo` or anything else that
  reads `@/content/site` unless they need it — pass rendered nodes or strings from the
  server instead (see how `Header.tsx` feeds `MobileDrawer`).
- **Line length:** `max-w-measure` is now 54ch (≈ 70 characters of Jost) and
  `max-w-measure-tight` 48ch (≈ 63). Both are inside the 45–75 rule; use `measure` for
  leads and paragraphs again.
- **Removed Tailwind aliases:** `cream`, `night`, `surface`, `surface-2`, `ink`, `text-text`,
  bare `maroon` / `maroon-deep` / `maroon-dark`, `gold` / `gold-deep` / `gold-light`,
  `font-heading`, `animate-glow-pulse` no longer generate CSS.
- **Header nav** comes from `mainNav`; the link whose route (or a route under it) is
  current is marked with `aria-current`. Adding a page means adding it to
  `src/content/site.ts`, not to the header.
- **Sitemap / robots** are built from `routes`, `routeMetadata` and `collectionSlugs`.
  They emit no URL until `NEXT_PUBLIC_SITE_URL` is set.
