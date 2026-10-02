import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { STEP_MS } from "./tokens";

export type EnterOnLoadTag = "div" | "p" | "span" | "ul" | "li" | "figure";

/** Position in the hero sequence. Each step is 80ms later. */
export type EnterStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface EnterOnLoadProps {
  /** Element to render. Default `div`. */
  as?: EnterOnLoadTag;
  children: ReactNode;
  className?: string;
  /** Default 0. */
  step?: EnterStep;
  /** Fade with a 16px rise (500ms). `false` is a plain 400ms fade. Default true. */
  rise?: boolean;
}

/**
 * Above-the-fold entrance for the hero's eyebrow, lead and actions. A CSS
 * animation, so it starts at first paint with no hydration dependency and no
 * JavaScript; safe in a server component. Under
 * `prefers-reduced-motion: reduce` the element is simply there.
 *
 * Do NOT wrap the route's LCP image or the `<h1>` in it: an element that
 * starts at opacity 0 is not an LCP candidate until it is visible. The image
 * uses `<KenBurns>`, the headline `<MaskLines>`.
 * Below the fold use `<Reveal>` instead.
 */
export function EnterOnLoad({ as = "div", children, className, step = 0, rise = true }: EnterOnLoadProps) {
  const Tag: ElementType = as;
  return (
    <Tag
      className={cx(rise ? "motion-safe:animate-enter-rise" : "motion-safe:animate-enter-fade", className)}
      style={{ animationDelay: `${step * STEP_MS}ms` }}
    >
      {children}
    </Tag>
  );
}
