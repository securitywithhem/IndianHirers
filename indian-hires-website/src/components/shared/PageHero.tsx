import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, type SectionHeadingAlign } from "@/components/ornament";
import { Band } from "./Band";

export interface PageHeroProps {
  /** The page's one `h1`. */
  heading: string;
  eyebrow?: string;
  lead?: string;
  /** Default `center`. */
  align?: SectionHeadingAlign;
  /** Crown divider under the heading. Default true (it counts towards the three per page). */
  divider?: boolean;
  /** Candle glow behind the heading. Default true. */
  glow?: boolean;
  /** `id` of the `h1`, e.g. for `aria-labelledby` on a following region. */
  headingId?: string;
  /** Rendered above the heading: a breadcrumb or a back link. */
  before?: ReactNode;
  /** Rendered under the lead: actions, a count, filters. */
  children?: ReactNode;
  className?: string;
}

/**
 * The compact maroon band that opens every inner page (Docs/UI_UX_V2.md §7.11
 * "Inner-page header band"): eyebrow, `h1`, crown divider, lead, then an
 * optional slot.
 *
 * Header offset: handled here. The band starts at the very top of the page,
 * under the transparent header, and pads its content down by the header's
 * height (`underHeader`). It must be the FIRST element of the page.
 */
export function PageHero({
  heading,
  eyebrow,
  lead,
  align = "center",
  divider = true,
  glow = true,
  headingId,
  before,
  children,
  className,
}: PageHeroProps) {
  const centred = align === "center";

  return (
    <Band
      as="div"
      tone="maroon"
      size="sm"
      underHeader
      glow={glow}
      className={className}
      innerClassName={cn("flex flex-col gap-6", centred ? "items-center text-center" : "items-start")}
    >
      {before}
      <SectionHeading
        as="h1"
        tone="dark"
        align={align}
        eyebrow={eyebrow}
        heading={heading}
        lead={lead}
        divider={divider}
        id={headingId}
      />
      {children}
    </Band>
  );
}
