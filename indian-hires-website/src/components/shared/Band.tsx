import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BandTone = "ivory" | "ivory-alt" | "maroon" | "maroon-deep";
export type BandTag = "section" | "div" | "header" | "aside" | "article";
/** Vertical padding of the inner column. `hero` is the home hero's (§7.11). */
export type BandSize = "default" | "sm" | "hero" | "none";

export interface BandProps {
  /** Element to render. Default `section`. */
  as?: BandTag;
  /**
   * `ivory` (ivory-50) · `ivory-alt` (ivory-100) · `maroon` (maroon-800) ·
   * `maroon-deep` (maroon-950). The maroon tones apply `.theme-dark`, so the
   * semantic utilities inside flip by themselves.
   */
  tone?: BandTone;
  /** Linen weave. Ivory tones only; at most two per page. */
  linen?: boolean;
  /** Candle glow behind the content. Maroon tones only; one per band, never animated. */
  glow?: boolean;
  /** Default `default` (`py-section`). */
  size?: BandSize;
  /**
   * For a page's FIRST band only, which must be a maroon tone: the fixed,
   * transparent header overlays it, so the band pads its content down by the
   * header's height (`pt-header`). `PageHero` sets this itself.
   * See README → Header offset.
   */
  underHeader?: boolean;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  /** Classes for the full-bleed band. */
  className?: string;
  /** Classes for the inner `shell` column. */
  innerClassName?: string;
  children: ReactNode;
}

const TONE: Record<BandTone, string> = {
  ivory: "bg-background",
  "ivory-alt": "bg-muted",
  maroon: "theme-dark relative isolate overflow-hidden bg-background",
  "maroon-deep": "theme-dark relative isolate overflow-hidden bg-maroon-950",
};

const SIZE: Record<BandSize, string> = {
  default: "py-section",
  sm: "py-section-sm",
  hero: "pb-section pt-section-sm",
  none: "",
};

/**
 * A full-bleed section (Docs/UI_UX_V2.md §7.11): the band grows with the
 * viewport, the content stays in the 1280px `shell`.
 */
export function Band({
  as: Tag = "section",
  tone = "ivory",
  linen = false,
  glow = false,
  size = "default",
  underHeader = false,
  id,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel,
  className,
  innerClassName,
  children,
}: BandProps) {
  const dark = tone === "maroon" || tone === "maroon-deep";

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={cn(
        TONE[tone],
        linen && !dark && "surface-linen",
        underHeader && "pt-header",
        className,
      )}
    >
      {glow && dark ? (
        <div aria-hidden="true" className="candle-glow pointer-events-none absolute inset-0 -z-10" />
      ) : null}
      <div className={cn("shell", SIZE[size], innerClassName)}>{children}</div>
    </Tag>
  );
}
