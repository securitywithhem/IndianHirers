import * as React from "react"

import { cx } from "@/lib/cx"

/*
 * Docs/UI_UX_V2.md §7.8: the input recipe with `min-h-32 py-3` instead of
 * `h-12`. The ref is forwarded so react-hook-form can focus an invalid field.
 * `className` is appended, not merged.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<"textarea">>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cx(
          "type-body focus-ring min-h-32 w-full min-w-0 rounded-lg border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)

export { Textarea }
