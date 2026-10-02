import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/** Width / height. The mehrab reads best in portrait; `1/1` is the widest allowed. */
export type ArchAspect = "3/4" | "4/5" | "1/1";

const ASPECT_CLASS: Record<ArchAspect, string> = {
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
};

export interface ArchFrameProps {
  /** Fixed aspect ratio of the frame. Required, so the box is reserved before the image loads. */
  aspect: ArchAspect;
  /** Usually a `next/image` with `fill` and `object-cover`. */
  children: ReactNode;
  /** Draw a thin gold line that follows the arch. Default false. */
  framed?: boolean;
  /** Width of the frame (it is `w-full` by default) and any outer spacing. */
  className?: string;
}

/**
 * Mehrab (pointed palace arch) image frame. Applies the `mask-arch` utility to
 * its child inside a box with a fixed aspect ratio, so it cannot shift layout.
 *
 * The inner box is positioned and `overflow-hidden`: a `next/image fill` child
 * positions against it, and a hover zoom on the image stays inside the arch.
 */
export function ArchFrame({ aspect, children, framed = false, className }: ArchFrameProps) {
  return (
    <div
      /* `w-full` is a zero-specificity default (`:where`): a width in
       * `className` wins without tailwind-merge, which these ornaments avoid
       * so that a client component can import them cheaply. */
      className={cx(
        "relative [:where(&)]:w-full",
        ASPECT_CLASS[aspect],
        framed && "mask-arch bg-hairline/70",
        className,
      )}
    >
      {/* Absolutely positioned so it never depends on a percentage height. */}
      <div
        className={cx(
          "mask-arch absolute overflow-hidden bg-muted",
          framed ? "inset-0.5" : "inset-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}
