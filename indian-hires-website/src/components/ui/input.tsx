import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cx } from "@/lib/cx"

/*
 * Docs/UI_UX_V2.md §7.8. 48px tall; body-size type also stops iOS zooming on
 * focus. The ref is forwarded so react-hook-form can focus an invalid field.
 * `className` is appended, not merged: add layout, do not restyle the control.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  function Input({ className, type, ...props }, ref) {
    return (
      <InputPrimitive
        ref={ref}
        type={type}
        data-slot="input"
        className={cx(
          "type-body focus-ring h-12 w-full min-w-0 rounded-lg border border-input bg-card px-4 text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)

export { Input }
