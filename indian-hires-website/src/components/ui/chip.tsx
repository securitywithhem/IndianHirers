import type { ButtonHTMLAttributes, ReactNode } from "react"

import { cx } from "@/lib/cx"

/**
 * Docs/UI_UX_V2.md §7.5 filter chip, as one string. The chip owns its fill
 * and its label colour, so they change together when it is pressed. Roles
 * only: maroon on ivory, gold inside `.theme-dark`.
 */
export const CHIP_CLASS =
  "type-small focus-ring inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-input bg-transparent px-4 text-foreground transition-colors duration-hover ease-royal hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"

/** A finish or material named on a card. Not a control: no hover, no focus, no 44px target. */
export const CHIP_TAG_CLASS =
  "type-caption inline-flex min-h-7 items-center whitespace-nowrap rounded-full border border-hairline/40 px-3 text-muted-foreground"

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "aria-pressed"> {
  /** The pressed state; it is announced (`aria-pressed`) as well as shown. */
  selected: boolean
  /** Label, from a content file. */
  children: ReactNode
}

/*
 * No directive of its own: a Server Component renders it without a handler (a
 * static chip), a client component passes `onClick`. `className` is appended,
 * not merged — use it for layout only.
 */
function Chip({ selected, className, children, ...props }: ChipProps) {
  return (
    <button type="button" aria-pressed={selected} className={cx(CHIP_CLASS, className)} {...props}>
      {children}
    </button>
  )
}

export interface ChipTagProps {
  /** Label, from a content file. */
  children: ReactNode
  className?: string
}

function ChipTag({ children, className }: ChipTagProps) {
  return <span className={cx(CHIP_TAG_CLASS, className)}>{children}</span>
}

export { Chip, ChipTag }
