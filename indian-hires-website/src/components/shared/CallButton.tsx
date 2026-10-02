import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { telUrl } from "@/lib/links";
import { buttonVariants } from "@/components/ui/button-variants";
import { AppLink } from "./AppLink";
import type { ButtonLinkSize, ButtonLinkVariant } from "./ButtonLink";

export interface CallButtonProps {
  /** Visible label, from a content file (or `formatPhone()` for the number itself). */
  label: string;
  /** Only when the visible label needs more context for a screen reader. */
  ariaLabel?: string;
  /** Which number to dial. Default `primary`. */
  phone?: "primary" | "alt";
  /** Default `secondary` (outline), so it can sit beside a primary or WhatsApp button. */
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  className?: string;
}

const VARIANT = {
  primary: "default",
  gold: "gold",
  secondary: "outline",
  link: "link",
} as const;

/**
 * A `tel:` link styled as a button. The number comes from `env`; if it is not
 * configured `telUrl` returns `/contact`, so the button is never dead.
 */
export function CallButton({
  label,
  ariaLabel,
  phone = "primary",
  variant = "secondary",
  size = "default",
  className,
}: CallButtonProps) {
  return (
    <AppLink
      href={telUrl(phone === "alt" ? env.phoneAlt : env.phone)}
      aria-label={ariaLabel}
      className={cn(buttonVariants({ variant: VARIANT[variant], size }), className)}
    >
      <Phone aria-hidden="true" />
      {label}
    </AppLink>
  );
}
