import { cx } from "@/lib/cx";
import { Crown } from "./Crown";

/** Width / height of the tile. Match the aspect of the photographs beside it. */
export type PlaceholderAspect = "1/1" | "4/5" | "3/4" | "4/3";

const ASPECT_CLASS: Record<PlaceholderAspect, string> = {
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
};

export interface CrownPlaceholderProps {
  /** Fixed aspect ratio, so the tile reserves the same box a photograph would. */
  aspect: PlaceholderAspect;
  className?: string;
}

/**
 * Branded stand-in for a catalogue piece that has no photograph yet: an ivory
 * linen tile with the crown and a short double rule.
 *
 * Decorative (`aria-hidden`) — the piece's name is the card's text, so this
 * tile carries no accessible name and no copy. It is always ivory, also inside
 * a `.theme-dark` band.
 */
export function CrownPlaceholder({ aspect, className }: CrownPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "surface-linen flex flex-col items-center justify-center gap-3 bg-ivory-100 text-gold-500 [:where(&)]:w-full",
        ASPECT_CLASS[aspect],
        className,
      )}
    >
      <Crown className="h-10" />
      <span className="rule-double w-12" />
    </div>
  );
}
