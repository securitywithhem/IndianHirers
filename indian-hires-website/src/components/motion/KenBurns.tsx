import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface KenBurnsProps {
  /** The image: a `next/image` with `fill` and `object-cover`. */
  children: ReactNode;
  /**
   * Classes of the clipping box. It fills its positioned parent by default
   * (`absolute inset-0`), which is what `<ArchFrame>` needs; pass `relative`
   * plus an aspect-ratio class to use it on its own.
   */
  className?: string;
}

/**
 * The hero photograph's slow push-in: `scale` 1 -> 1.08 over 20s, once, then
 * it rests (an approved exception to the 900ms ceiling). CSS only, so it needs
 * no JavaScript and is safe in a server component.
 *
 * The first frame is the full, unscaled image, so it does not delay LCP.
 * Under `prefers-reduced-motion: reduce` the image is simply still.
 */
export function KenBurns({ children, className }: KenBurnsProps) {
  return (
    <div className={cx("overflow-hidden [:where(&)]:absolute [:where(&)]:inset-0", className)}>
      <div className="absolute inset-0 motion-safe:animate-ken-burns">{children}</div>
    </div>
  );
}
