"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useMotionPreference } from "@/lib/useMotionPreference";
import { observeReveal } from "./observe";

/* Height, width and colour are zero-specificity defaults (`:where`), so a
 * utility in `lineClassName` always wins without tailwind-merge. */
const LINE_CLASS =
  "block origin-center [:where(&)]:h-px [:where(&)]:w-full [:where(&)]:bg-hairline";

export type DrawLineTag = "div" | "span" | "li";

export interface DrawLineProps {
  /** Element to render. Default `div`. */
  as?: DrawLineTag;
  /**
   * Anything that contains a `<CrownDivider>` (the divider itself, or a
   * `<SectionHeading divider>`). Omit it to get a single standalone hairline.
   */
  children?: ReactNode;
  /** Wrapper classes: width and spacing. */
  className?: string;
  /** Classes of the standalone hairline (used only without children). */
  lineClassName?: string;
  /** Extra delay in ms. Default 0. */
  delay?: number;
}

/**
 * Grows gold rules from the centre when they scroll into view, once:
 * `scaleX` 0 -> 1 over 600ms on every `[data-divider-rule]` inside (their
 * transform origins already point at the crown), or on its own hairline when
 * it has no children.
 *
 * The wrapper adds no styles of its own, so the box is the same in every
 * branch. Under reduced motion nothing is observed and the rules are static.
 */
export function DrawLine({ as = "div", children, className, lineClassName, delay = 0 }: DrawLineProps) {
  // Widened on purpose: assignment would narrow Tag to the `as` union and reject the HTMLElement ref.
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const reduce = useMotionPreference();

  useEffect(() => {
    if (reduce) return;
    const element = ref.current;
    if (element === null) return;
    return observeReveal(element, { attribute: "data-draw", delayMs: delay });
  }, [reduce, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children ?? (
        <span
          aria-hidden="true"
          data-draw-rule=""
          className={cx(LINE_CLASS, lineClassName)}
        />
      )}
    </Tag>
  );
}
