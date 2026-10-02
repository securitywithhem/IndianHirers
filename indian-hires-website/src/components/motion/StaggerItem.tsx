import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type StaggerItemTag = "div" | "li" | "article" | "figure" | "dd" | "dt";

/** `role`, `aria-*` and other HTML attributes pass through (e.g. `role="listitem"`). */
export interface StaggerItemProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "className"> {
  /** Element to render. Default `div`. */
  as?: StaggerItemTag;
  children: ReactNode;
  className?: string;
}

/**
 * One item of a `<Stagger>`. Plain markup with a marker attribute: no
 * JavaScript of its own, safe in a server component. Outside a `<Stagger>` it
 * is simply static.
 *
 * Fade + 16px rise, 350ms.
 */
export function StaggerItem({ as = "div", children, className, ...rest }: StaggerItemProps) {
  const Tag: ElementType = as;
  return (
    <Tag {...rest} className={className} data-stagger-item="">
      {children}
    </Tag>
  );
}
