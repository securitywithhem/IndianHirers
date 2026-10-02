import { cx } from "@/lib/cx";
import { CrownDivider } from "./CrownDivider";

export type SectionHeadingLevel = "h1" | "h2" | "h3";
export type SectionHeadingAlign = "start" | "center";
/** The surface the heading sits on: `light` = ivory, `dark` = maroon. */
export type SectionHeadingTone = "light" | "dark";

export interface SectionHeadingProps {
  /** Heading element. One `h1` per page; never skip a level. */
  as: SectionHeadingLevel;
  /** Heading text, from a content file. */
  heading: string;
  /** Small-caps line above the heading. Use sparingly. */
  eyebrow?: string;
  /** One or two sentences under the heading. */
  lead?: string;
  /** Default `start`. */
  align?: SectionHeadingAlign;
  /** Default `light`. Pass `dark` on any maroon surface. */
  tone?: SectionHeadingTone;
  /** Show the crown divider between the heading and the lead. Default false. */
  divider?: boolean;
  /** `id` for the heading element, e.g. for `aria-labelledby` on the section. */
  id?: string;
  className?: string;
}

/* Type role follows the heading level, so the scale cannot drift per page. */
const TYPE_CLASS: Record<SectionHeadingLevel, string> = {
  h1: "type-display max-w-heading",
  h2: "type-h2 max-w-heading-wide",
  h3: "type-h3 max-w-heading-wide",
};

/* Explicit primitives rather than scope-following roles, so the heading is
 * correct even over a photograph that is not inside `.theme-dark`. */
const TONE_CLASS: Record<SectionHeadingTone, { eyebrow: string; heading: string; lead: string }> = {
  light: {
    eyebrow: "text-gold-700",
    heading: "text-maroon-700",
    lead: "text-espresso-600",
  },
  dark: {
    eyebrow: "text-gold-300",
    heading: "text-ivory-50",
    lead: "text-ivory-300",
  },
};

/**
 * Eyebrow + heading + optional lead. All text arrives as props; the component
 * holds no copy of its own.
 */
export function SectionHeading({
  as,
  heading,
  eyebrow,
  lead,
  align = "start",
  tone = "light",
  divider = false,
  id,
  className,
}: SectionHeadingProps) {
  const Heading = as;
  const colours = TONE_CLASS[tone];
  const centred = align === "center";

  return (
    <div
      className={cx(
        "flex flex-col [:where(&)]:gap-4",
        centred ? "items-center text-center" : "items-start text-start",
        className,
      )}
    >
      {eyebrow ? <p className={cx("type-eyebrow", colours.eyebrow)}>{eyebrow}</p> : null}
      <Heading id={id} className={cx(TYPE_CLASS[as], colours.heading)}>
        {heading}
      </Heading>
      {divider ? <CrownDivider className={centred ? "max-w-56" : "mx-0 max-w-56"} /> : null}
      {lead ? <p className={cx("type-lead max-w-measure", colours.lead)}>{lead}</p> : null}
    </div>
  );
}
