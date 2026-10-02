import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/links";
import { buttonVariants } from "@/components/ui/button-variants";
import { AppLink } from "./AppLink";

export interface WhatsAppButtonProps {
  /** Prefill text, already built with `whatsappMessages.*()` from `@/content/site`. */
  message: string;
  /** Visible label, from a content file. */
  label: string;
  /** Only when the visible label needs more context for a screen reader. */
  ariaLabel?: string;
  /** `default` 48px · `sm` 44px. */
  size?: "default" | "sm";
  className?: string;
}

/**
 * The WhatsApp call to action (Docs/UI_UX_V2.md §7.3): green fill, espresso
 * type and icon — never light type, on any surface. Opens WhatsApp in a new
 * tab; if no number is configured `whatsappUrl` returns `/contact` and this
 * becomes an ordinary internal link.
 */
export function WhatsAppButton({ message, label, ariaLabel, size = "default", className }: WhatsAppButtonProps) {
  return (
    <AppLink
      href={whatsappUrl(message)}
      aria-label={ariaLabel}
      className={cn(buttonVariants({ variant: "whatsapp", size }), className)}
    >
      <MessageCircle aria-hidden="true" />
      {label}
    </AppLink>
  );
}
