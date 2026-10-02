import * as React from "react"

import { cx } from "@/lib/cx"

/*
 * Docs/UI_UX_V2.md §7.8. The required marker goes inside the label text.
 * `className` is appended, not merged: add spacing, keep the type and colour.
 */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cx(
        "type-small font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
