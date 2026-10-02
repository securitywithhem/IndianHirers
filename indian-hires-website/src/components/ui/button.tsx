import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cx } from "@/lib/cx"
import { buttonVariants, type ButtonVariantProps } from "@/components/ui/button-variants"

/*
 * `className` is appended, not merged (no tailwind-merge in the browser): use
 * it to add layout — `w-full`, `self-start`, a margin — and choose colour and
 * size with `variant` / `size`.
 */
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & ButtonVariantProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={(state) =>
        cx(buttonVariants({ variant, size }), typeof className === "function" ? className(state) : className)
      }
      {...props}
    />
  )
}

export { Button, buttonVariants }
