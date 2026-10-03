import { cva, type VariantProps } from "class-variance-authority"

/**
 * Button recipes from Docs/UI_UX_V2.md §7.1–7.3, shared by `ui/button.tsx`
 * (a real <button>), `shared/ButtonLink.tsx` (a link that looks like one) and
 * any component that styles its own element with `buttonVariants()`.
 *
 * Kept in its own file with no client imports, so a Server Component can use
 * the classes without pulling the button primitive into its route.
 *
 * NO CLASS HERE CONFLICTS WITH ANOTHER: sizing and alignment are chosen per
 * variant (compound variants), so the output is correct as a plain string and
 * needs no tailwind-merge. Client components join it with `cx()` from
 * `@/lib/cx`; a caller's extra classes must add, not override.
 *
 * Every variant uses roles, so it is correct on ivory and inside `.theme-dark`
 * unchanged — except `whatsapp` (green fill, espresso type) and `gold` (gold
 * fill, maroon-950 type), which are fixed.
 */
const COLOUR_TRANSITION = "transition-colors duration-hover ease-royal"

/** Everything except `link` is a box with a centred label. */
const BOXED = ["default", "gold", "outline", "secondary", "ghost", "destructive", "whatsapp"] as const

export const buttonVariants = cva(
  "type-button focus-ring inline-flex shrink-0 items-center gap-2 rounded-lg select-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* §7.1 primary. One per view. A gold hairline edges the maroon fill
         * (it disappears into the gold fill inside `.theme-dark`), and
         * `btn-sheen` sends one band of gold light across it on hover. */
        default: `btn-sheen justify-center text-center border border-hairline/60 bg-primary text-primary-foreground ${COLOUR_TRANSITION} hover:bg-primary-hover motion-safe:active:translate-y-px`,
        /* §7.1a gold. A gold fill that does not flip with the scope: the
         * invitation-card action on ivory. `gold-sheen` carries maroon-950
         * type (7.48 at its darkest point); never ivory type on gold. */
        /* The gold-700 edge is the button's boundary on ivory (5.93:1), where
         * the fill alone is 2.21:1; on maroon it disappears into the fill. */
        gold: "btn-sheen gold-sheen justify-center text-center border border-gold-700 text-maroon-950 motion-safe:active:translate-y-px",
        /* §7.2 secondary (outline). The label is the `link` role, not
         * `primary`: maroon-700 on ivory either way, but gold-300 rather than
         * gold-500 inside `.theme-dark`, where gold-500 type over a candle
         * glow is a forbidden pair. The border stays gold-500. */
        outline: `justify-center text-center border border-primary bg-transparent text-link ${COLOUR_TRANSITION} hover:bg-primary hover:text-primary-foreground`,
        secondary: `justify-center text-center bg-secondary text-secondary-foreground ${COLOUR_TRANSITION} hover:bg-primary hover:text-primary-foreground`,
        ghost: `justify-center text-center bg-transparent text-foreground ${COLOUR_TRANSITION} hover:bg-muted`,
        destructive: `justify-center text-center border border-destructive bg-transparent text-destructive ${COLOUR_TRANSITION} hover:bg-destructive hover:text-destructive-foreground`,
        /* §7.3 standalone text link: always 44px tall, no box, whatever the size. */
        link: `min-h-11 justify-start text-start text-link underline decoration-hairline/60 underline-offset-4 ${COLOUR_TRANSITION} hover:decoration-link`,
        /* §7.3 WhatsApp. No hover colour exists for the green; the hover is a 2px rise. */
        whatsapp:
          "justify-center text-center bg-whatsapp text-espresso-900 motion-safe:transition-transform motion-safe:duration-hover motion-safe:ease-royal motion-safe:hover:-translate-y-0.5",
      },
      /* The classes live in the compound variants below. */
      size: {
        /* 48px: primary actions. */
        default: "",
        /* 44px: the floor for a touch target. */
        sm: "",
        lg: "",
        /* 44px square, for an icon-only control (needs an aria-label). */
        icon: "",
      },
    },
    compoundVariants: [
      { variant: [...BOXED], size: ["default", "lg"], class: "min-h-12 px-6 py-3" },
      { variant: [...BOXED], size: "sm", class: "min-h-11 px-4 py-2" },
      { variant: [...BOXED], size: "icon", class: "size-11" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
