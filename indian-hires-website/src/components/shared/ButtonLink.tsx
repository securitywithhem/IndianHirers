import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { AppLink, type AppLinkProps } from "./AppLink";

export type ButtonLinkVariant = "primary" | "secondary" | "link";
export type ButtonLinkSize = "default" | "sm";

export interface ButtonLinkProps extends Omit<AppLinkProps, "children"> {
  /** `primary` §7.1 (one per view) · `secondary` §7.2 outline · `link` §7.3 text link. Default `primary`. */
  variant?: ButtonLinkVariant;
  /** `default` 48px · `sm` 44px. */
  size?: ButtonLinkSize;
  /** Label from a content file; an icon beside it must be `aria-hidden`. */
  children: ReactNode;
}

const VARIANT = {
  primary: "default",
  secondary: "outline",
  link: "link",
} as const;

/**
 * A link that looks like a button (Docs/UI_UX_V2.md §7.1–7.3). Internal paths
 * use `next/link`; web URLs open a new tab; `tel:` / `mailto:` stay in place.
 * The colours are roles, so the same call is maroon on ivory and gold inside
 * `.theme-dark`.
 */
export function ButtonLink({
  variant = "primary",
  size = "default",
  className,
  children,
  ...link
}: ButtonLinkProps) {
  return (
    <AppLink {...link} className={cn(buttonVariants({ variant: VARIANT[variant], size }), className)}>
      {children}
    </AppLink>
  );
}
