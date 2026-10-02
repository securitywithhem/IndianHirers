import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";

export type SlideUpAfterTag = "div" | "nav" | "aside";

export interface SlideUpAfterProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "className"> {
  /** Element to render. Default `div`. */
  as?: SlideUpAfterTag;
  children: ReactNode;
  /** Must include the positioning (`fixed inset-x-0 bottom-0 z-bar …`). */
  className?: string;
}

/**
 * The mobile bottom bar's entrance: it waits 1.2s after load, then slides up
 * from below the screen edge over 500ms (`translateY` only).
 *
 * This component IS the fixed bar, not a wrapper around it: a transformed
 * wrapper would become the containing block of a `position: fixed` child and
 * break it. Other attributes (`aria-label`, `id` …) pass straight through.
 *
 * CSS only: no JavaScript, safe in a server component, and it cannot shift
 * layout (the bar is out of flow and the page already reserves its height).
 * Under `prefers-reduced-motion: reduce` the bar is present from first paint.
 *
 * Class-only equivalent: `motion-safe:animate-bar-rise` on the fixed element.
 */
export function SlideUpAfter({ as = "div", children, className, ...rest }: SlideUpAfterProps) {
  const Tag: ElementType = as;
  return (
    <Tag {...rest} className={cx("motion-safe:animate-bar-rise", className)}>
      {children}
    </Tag>
  );
}
