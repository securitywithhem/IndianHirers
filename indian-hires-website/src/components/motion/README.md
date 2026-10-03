# Motion primitives

For `ui-builder`. Compose these; never write a duration, easing, delay, keyframe or
`transition-*` value for an entrance yourself. If something is missing, ask
`motion-engineer` for a primitive.

Numbers come from `.claude/rules/motion.md`. Default curve `cubic-bezier(0.23, 1, 0.32, 1)`
(`ease-royal`); moving things use `cubic-bezier(0.65, 0, 0.35, 1)` (`ease-move`).
Everything animates `transform` and `opacity` only.

## No tailwind-merge in here

These components are imported by client components, so they join classes with `cx` from
`@/lib/cx`, not `cn`: tailwind-merge (8.6 kB gzipped) must not reach the browser. Nothing
is merged — your `className` is appended. Where a primitive has a default you may want to
change (`KenBurns` fills its parent, `DrawLine`'s hairline is `h-px w-full bg-hairline`,
`Counter` is `inline-grid`, `SlidePanel`'s sizes), the default is written
`[:where(&)]:…`, which has zero specificity, so your utility wins regardless of order.
Anything else you pass must add to the primitive's classes, not contradict them.

## Two entry points

| Import from | What | Animation library |
|---|---|---|
| `@/components/motion` | `Reveal` `Stagger` `StaggerItem` `DrawLine` `Counter` `KenBurns` `MaskLines` `EnterOnLoad` `SlideUpAfter` `PageFade` `SlidePanel` `useScrolled` | **none** — CSS + one shared IntersectionObserver |
| `@/components/motion/engine` | `MotionMaxProvider` `LayoutItem` `LayoutPresence` `LayoutScope` `SharedZoomSource` `SharedZoomTarget` `SharedZoomBackdrop` `SharedZoomPresence` (`MotionProvider`, `useMotionReady`) | `motion`, loaded lazily |

Import `engine` **only** in the catalogue and gallery client components. Nothing from
`engine` belongs in `src/app/layout.tsx`, the header, the footer or the home page.

Never import `motion` / `motion/react` yourself, and never `framer-motion` or `gsap`.

## How every primitive treats reduced motion

"Reduce" = the OS setting **or** a low-power device (Save-Data, ≤ 2 cores, ≤ 2 GB) —
`src/lib/useMotionPreference.ts`.

- The server HTML and the first paint are always the final, static state.
- Under reduce, the client primitives observe nothing, listen to nothing and schedule
  nothing; they render the same element with the same classes, so the box is identical.
- CSS-only primitives (`KenBurns`, `MaskLines`, `EnterOnLoad`, `SlideUpAfter`) follow
  `prefers-reduced-motion` through `motion-safe:`; they have no JavaScript to gate.
- **No flash.** A scroll primitive whose element is already in the viewport when the page
  becomes interactive leaves it untouched and never animates it. Only elements still
  below the fold are hidden, then revealed when they scroll in. So: above the fold use
  `EnterOnLoad` / `MaskLines` / `KenBurns`; below the fold use `Reveal` / `Stagger`.

---

## Reveal — section entrance on scroll

```tsx
<Reveal as="section" className="shell py-section" lines>
  <SectionHeading as="h2" heading={content.heading} divider />
</Reveal>
```

| Prop | Type | Default | |
|---|---|---|---|
| `as` | `"div" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "figure" \| "ul" \| "ol" \| "li" \| "p" \| "span"` | `"div"` | |
| `children` | `ReactNode` | — | server-rendered children are fine |
| `className` | `string` | — | |
| `y` | `0 \| 8 \| 16 \| 24` | `24` | rise in px; `0` = fade only |
| `delay` | `number` (ms) | `0` | prefer `Stagger` for siblings |
| `lines` | `boolean` | `false` | also grow the rules of each `CrownDivider` inside |
| `id` | `string` | — | |

Fade + rise, once. 500ms (`y` 24) or 350ms (`y` ≤ 16), `ease-royal`. Starts when the first
pixel enters the viewport. Client leaf; no provider. Reduce: static, no observer.

Do not put your own `opacity-*`, `translate-*` or `transition-*` utilities on the same
element — put them on a child.

## Stagger + StaggerItem — lists and card grids

```tsx
<Stagger as="ul" className="grid grid-cols-2 gap-4 md:grid-cols-3">
  {items.map((item) => (
    <StaggerItem as="li" key={item.slug}>
      <ItemCard item={item} />
    </StaggerItem>
  ))}
</Stagger>
```

| Component | Prop | Type | Default |
|---|---|---|---|
| `Stagger` | `as` | `"div" \| "ul" \| "ol" \| "section" \| "dl"` | `"div"` |
| | `children`, `className`, `id`, plus any HTML attribute (`role`, `aria-*`) | | |
| `StaggerItem` | `as` | `"div" \| "li" \| "article" \| "figure" \| "dd" \| "dt"` | `"div"` |
| | `children`, `className`, plus any HTML attribute (`role`, `aria-*`) | | |

A `ul` whose bullets are removed loses its list semantics in Safari with VoiceOver: pass
`role="list"` to `Stagger` (and nothing to the items) to keep them.

Each item: fade + 16px rise, 350ms, `ease-royal`. Items that enter the viewport in the
same frame (a row) are 70ms apart in DOM order, capped at six — later ones appear with
the sixth. Lower rows reveal as they are reached. `Stagger` is the only client component;
`StaggerItem` is plain markup, so a server component can render the list. No provider.
Reduce: static, no observer.

Items are collected when the list mounts. Items added later just appear — for a list
that is filtered on the client use `LayoutItem` instead (below), not both.

## DrawLine — gold rules grow from the centre

```tsx
<DrawLine><CrownDivider /></DrawLine>          {/* the divider's two rules */}
<DrawLine className="mx-auto w-24" />           {/* a standalone hairline */}
```

| Prop | Type | Default | |
|---|---|---|---|
| `as` | `"div" \| "span" \| "li"` | `"div"` | |
| `children` | `ReactNode` | — | anything containing a `CrownDivider`; omit for a single hairline |
| `className` | `string` | — | wrapper: width and spacing |
| `lineClassName` | `string` | — | the standalone hairline (defaults `h-px w-full bg-hairline origin-center`; pass `origin-left` to draw it from its start, as the "how hiring works" steps do) |
| `delay` | `number` (ms) | `0` | |

`scaleX` 0 → 1, 600ms, `ease-royal`, 120ms after it enters, once. For a heading that also
fades in, use `<Reveal lines>` instead of nesting. No provider. Reduce: static.

## Counter — trust stats

```tsx
<p className="type-stat text-heading">
  <Counter value={stat.value} from={stat.from} suffix={stat.suffix} />
</p>
```

| Prop | Type | Default | |
|---|---|---|---|
| `value` | `number` | — | whole number |
| `from` | `number` | `0` | for a year start near it (e.g. 1950 → 1977) |
| `prefix`, `suffix` | `string` | `""` | from a content file |
| `format` | `"plain" \| "grouped"` | `"plain"` | `plain`: `1977`. `grouped`: `12,500`. Years are always `plain` |
| `as` | `"span" \| "div" \| "p" \| "dd"` | `"span"` | |
| `className` | `string` | — | |

Counts up over 900ms (ease-out), once, when it scrolls in. The final text is always in
the DOM — it is the server output, the only thing a screen reader gets, and it reserves
the width, so nothing jitters (tabular numerals are applied). The running digits are an
`aria-hidden` layer written through a ref. No provider. Reduce — and a counter already on
screen at load — shows the final number only.

## KenBurns — hero photograph

```tsx
<ArchFrame aspect="4/5" framed>
  <KenBurns>
    <Image src={hero.src} alt={hero.alt} fill priority sizes="…" className="object-cover" />
  </KenBurns>
</ArchFrame>
```

Props: `children`, `className` (clipping box; default `absolute inset-0`).
`scale` 1 → 1.08 over 20s, one shot, then rests. CSS only, server-safe, starts unscaled so
LCP is unaffected. One per page. Reduce (OS setting): still image.

## MaskLines — hero headline

```tsx
<h1 className="type-display text-heading">
  <MaskLines lines={hero.headlineLines} />
</h1>
```

| Prop | Type | Default |
|---|---|---|
| `lines` | `readonly string[]` | — |
| `className`, `lineClassName` | `string` | — |
| `step` | `0…6` | `0` |

Each line slides up from behind a mask: 700ms, `ease-royal`, 80ms apart, capped at six.
Renders spans only — the `h1` stays one heading and reads as one sentence. CSS only,
server-safe, starts at first paint. Hero only, once per page. Reduce: plain lines.

## EnterOnLoad — the rest of the hero

```tsx
<EnterOnLoad as="p" step={0} className="type-eyebrow text-kicker">{hero.eyebrow}</EnterOnLoad>
<h1 className="type-display"><MaskLines lines={hero.headlineLines} step={1} /></h1>
<EnterOnLoad as="p" step={3} className="type-lead">{hero.lead}</EnterOnLoad>
<EnterOnLoad step={4}>…actions…</EnterOnLoad>
```

| Prop | Type | Default | |
|---|---|---|---|
| `as` | `"div" \| "p" \| "span" \| "ul" \| "li" \| "figure"` | `"div"` | |
| `step` | `0…6` | `0` | 80ms per step |
| `rise` | `boolean` | `true` | `true`: fade + 16px rise, 500ms. `false`: fade, 400ms |
| `children`, `className` | | | |

CSS only, server-safe, starts at first paint. **Never wrap the LCP image or the `h1`** —
something that starts at opacity 0 is not an LCP candidate until it shows. Above the fold
only; below it use `Reveal`. Reduce: simply there.

The hero crown: add the existing `crown-draw` class to a parent of `<Crown>` (draws once,
900ms, off under reduce).

## SlideUpAfter — mobile bottom bar

```tsx
<SlideUpAfter as="nav" aria-label={nav.bottomBarLabel}
  className="fixed inset-x-0 bottom-0 z-bar grid grid-cols-3 bg-background/95 shadow-bar … md:hidden">
  …
</SlideUpAfter>
```

Props: `as` (`"div" | "nav" | "aside"`), `children`, `className`, plus any HTML attribute.
Waits 1.2s, then `translateY` from below the edge, 500ms, `ease-royal`. **It is the fixed
bar itself, not a wrapper** (a transformed wrapper breaks `position: fixed`). CSS only;
no layout shift. Class-only equivalent: `motion-safe:animate-bar-rise` on the fixed
element. Reduce: present from first paint.

## PageFade — route changes

```tsx
// src/app/template.tsx
import { PageFade } from "@/components/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
```

Props: `children`, `className`.

- **First load:** does nothing. Server HTML is visible as sent; LCP is untouched.
- **Client navigation:** the incoming page fades 0 → 1 over 300ms, `ease-royal`. No exit
  fade; no movement.
- **Reduce:** nothing; the page just appears.

Renders one plain `div` around the page. Keep the header, footer and bottom bar in
`layout.tsx`, outside it.

## SlidePanel — nav drawer, item drawer, quote-basket sheet

```tsx
<SlidePanel
  ref={panelRef}
  open={open}
  side="right"
  id="mobile-nav"
  role="dialog"
  aria-modal="true"
  aria-label={nav.drawerLabel}
  className="theme-dark bg-maroon-950 p-6 text-foreground"
  onBackdropClick={close}
  onExitComplete={() => triggerRef.current?.focus()}
>
  …
</SlidePanel>
```

| Prop | Type | Default | |
|---|---|---|---|
| `open` | `boolean` | — | |
| `side` | `"right" \| "bottom"` | — | drawer / sheet |
| `className` | `string` | — | the sliding surface: background, theme scope, width, padding |
| `backdropClassName` | `string` | `bg-maroon-950/70` | |
| `rootClassName` | `string` | `z-drawer` | |
| `onBackdropClick` | `() => void` | — | |
| `onExitComplete` | `() => void` | — | after it has left the DOM |
| `ref`, other HTML attributes | | | land on the sliding surface |

The right-hand drawer is **full width below `sm`** and 384px (`max-w-sm`) from `sm`; the
bottom sheet is at most `85dvh` tall. Those sizes, the backdrop colour and the `z-drawer`
layer are zero-specificity defaults (`[:where(&)]:…`), so any utility you pass in
`className` / `backdropClassName` / `rootClassName` wins — e.g. `md:max-w-md`.

Slides in 500ms, out 375ms (25% faster), `ease-royal`; backdrop fades. **Renders nothing
while closed** and nothing on the server; mounts into `document.body`. No provider, no
library — it works before any lazy chunk loads. Reduce: appears / disappears at once,
`onExitComplete` fires immediately.

It is only the motion shell. You own the dialog contract in `.claude/rules/a11y.md`:
focus in, focus trap, `Esc`, focus back to the trigger, `inert` + scroll lock on the
background. Because it is portalled, the theme class goes in `className`.

**Staggered contents (R4).** Anything inside the panel marked `data-slide-item=""` follows
the surface in: fade + 16px rise, 350ms, `ease-royal`, 60ms apart, starting 140ms after
the panel opens. Give each its position with `style={{ "--slide-item": index }}`; positions
past the sixth enter with the sixth. CSS only (`globals.css`, `motion-slide-item`). While
the panel leaves, the items have no animation and ride out with it. Reduce: no animation,
the items are simply there. The mobile nav drawer uses it for its links; its contact actions stay out of the sequence,
so a control that can take focus is never invisible.

## useScrolled — header state

```tsx
const scrolled = useScrolled(80);
<header data-scrolled={scrolled} className={cn("group fixed …", !scrolled && "theme-dark")}>
```

`useScrolled(threshold = 80): boolean`. No scroll listener: an invisible sentinel watched
by an IntersectionObserver, so state changes only when the boolean flips. `false` on the
server. **Not gated on reduced motion** — the header has to change colour to stay
legible. The visual change is the CSS in `Docs/UI_UX_V2.md` §7.9
(`transition-opacity duration-hover ease-royal` on the backdrop: a fade under 200ms).

### Nav underline (CSS recipe, no primitive)

```tsx
<Link className="group/link type-button focus-ring relative inline-flex min-h-11 items-center" …>
  {label}
  <span aria-hidden="true" className="absolute inset-x-0 bottom-2 h-px origin-center scale-x-0 bg-hairline
    motion-safe:transition-transform motion-safe:duration-hover motion-safe:ease-royal
    group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100" />
</Link>
```

The current page keeps `scale-x-100` and `aria-current="page"`.

---

## Engine primitives (`@/components/motion/engine`)

All of them need **`MotionMaxProvider`** above them. It async-loads the layout feature
bundle (~39 kB, its own chunk, after hydration; not at all for reduce visitors). Until
the chunk arrives, without the provider, and under reduce, these components pass no
motion props: they are plain elements, the same ones, so nothing remounts or shifts.

```tsx
"use client";
import { MotionMaxProvider, LayoutScope, LayoutPresence, LayoutItem } from "@/components/motion/engine";

<MotionMaxProvider>
  <LayoutScope>
    <ul className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <li key={filter.id} className="relative">
          <button type="button" aria-pressed={filter.id === active} className="chip …">{filter.label}</button>
          {filter.id === active ? (
            <LayoutItem as="span" layoutId="active-chip" className="absolute inset-0 -z-10 rounded-full bg-primary" />
          ) : null}
        </li>
      ))}
    </ul>

    <ul className="relative grid grid-cols-2 gap-4">
      <LayoutPresence>
        {visible.map((item) => (
          <LayoutItem as="li" key={item.slug}>
            <ItemCard item={item} />
          </LayoutItem>
        ))}
      </LayoutPresence>
    </ul>
  </LayoutScope>
</MotionMaxProvider>
```

| Component | Props | Motion |
|---|---|---|
| `MotionMaxProvider` | `children` | — mount around catalogue filters + grid, and gallery grid + lightbox. **Never the root layout** |
| `LayoutScope` | `children`, `id?` | groups boxes whose layouts affect each other |
| `LayoutItem` | `as?: "div" \| "li" \| "span"`, `layoutId?`, `resize?` (default `false`), `className`, `children`, `ref` | glides to its new place: 350ms, `ease-move`. Position only unless `resize` / `layoutId` |
| `LayoutPresence` | `children` (LayoutItems as **direct** children with stable `key`s), `onExitComplete?` | added: opacity + scale 0.96 → 1, 350ms. Removed: 260ms. Container must be `relative` |

Gallery lightbox:

```tsx
<MotionMaxProvider>
  {photos.map((photo) => (
    <button key={photo.id} type="button" onClick={() => setOpen(photo)} …>
      <SharedZoomSource id={photo.id} className="relative aspect-square overflow-hidden rounded-card">
        <Image … fill />
      </SharedZoomSource>
    </button>
  ))}

  <SharedZoomPresence onExitComplete={returnFocusToTile}>
    {open ? <SharedZoomBackdrop key="scrim" className="fixed inset-0 z-lightbox bg-maroon-950/90" onClick={close} /> : null}
    {open ? (
      <div key="dialog" role="dialog" aria-modal="true" aria-label={…} className="fixed inset-0 z-lightbox grid place-items-center p-4">
        <SharedZoomTarget id={open.id} className="relative aspect-square w-full max-w-3xl overflow-hidden rounded-card">
          <Image … fill />
        </SharedZoomTarget>
      </div>
    ) : null}
  </SharedZoomPresence>
</MotionMaxProvider>
```

| Component | Props | Motion |
|---|---|---|
| `SharedZoomSource` | `id`, `className`, `children` | the tile; receives the box back on close: 375ms, `ease-move` |
| `SharedZoomTarget` | `id` (same as the tile), `className`, `children`, `ref` | the dialog image; grows from the tile: 500ms, `ease-move` |
| `SharedZoomBackdrop` | `className`, `onClick?` | scrim: fade in 500ms, out 375ms |
| `SharedZoomPresence` | `children` (direct children with `key`s), `onExitComplete?` | keeps the lightbox mounted until it has closed |

Give the target the tile's aspect ratio: a box that changes shape stretches its picture
during the zoom. Dialog semantics, focus trap, `Esc` and arrow keys are yours.

`MotionProvider` (the smaller `domAnimation` bundle) exists for a future `m.*` component
without layout animation. No primitive needs it today — do not mount it.

---

## Already in CSS — use the class, no primitive

| Effect | Class |
|---|---|
| Card hover lift + shadow fade | `card-royal` |
| Card image zoom | `motion-safe:transition-transform motion-safe:duration-zoom motion-safe:ease-royal motion-safe:group-hover:scale-104` |
| Crown self-draw | `crown-draw` on a parent of `<Crown>` |
| WhatsApp pulse ring (6s) | `motion-safe:animate-whatsapp-pulse` |
| Press / hover / colour | `duration-press`, `duration-hover`, `ease-royal` with `transition-colors` / `transition-opacity` / `motion-safe:transition-transform` |

## Where motion is deliberately left out

- **No exit fade between pages.** Holding the old page back costs a navigation delay; the
  incoming page fades, nothing more.
- **No parallax, no scroll-linked motion, no pinning, no smooth-scroll, no scroll hijack.**
- **No auto-playing carousel.** A carousel is a scroll-snap list; it gets no primitive.
- **Candle glow never moves or pulses.** `animate-glow-pulse` has been removed.
- **Nothing already on screen at load is animated by a scroll primitive** (no flash).
- **Header:** the backdrop's opacity fades; height, padding and logo size never animate.
- **Buttons:** colour and a 2px rise at most; no `hover:scale-105`, no `transition-all`.
- **Forms, error messages, toasts, the map, the footer:** no entrance animation. Do not
  put `Reveal` inside the footer.
- **The logo** is never animated, filtered or recoloured.
- **Body copy** is not revealed line by line or word by word; `MaskLines` is for the one
  hero headline per page.
- **Lists longer than one screen** do not animate all at once; `Stagger` reveals by row.
- **Counters do not replay**, and do not run if they were visible at load.
- **Low-power devices** get the static site even without the OS setting (CSS-only
  primitives excepted — they cost nothing on the main thread).
- No bounce, spring overshoot or elastic easing anywhere; nothing starts below scale 0.96.

## Files

`tokens.ts` JS copies of the numbers · `observe.ts` the shared observer ·
keyframes in `tailwind.config.ts` · attribute-driven states in the
`motion primitives` block at the end of `src/app/globals.css`.
