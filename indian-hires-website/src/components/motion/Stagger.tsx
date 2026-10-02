"use client";

import { useEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { useMotionPreference } from "@/lib/useMotionPreference";
import { observeReveal } from "./observe";
import { STAGGER_MS } from "./tokens";

export type StaggerTag = "div" | "ul" | "ol" | "section" | "dl";

/**
 * `role`, `aria-*` and any other HTML attribute pass straight through to the
 * element — e.g. `role="list"` on a `ul` whose bullets are removed, which
 * Safari with VoiceOver otherwise stops announcing as a list.
 */
export interface StaggerProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "id"> {
  /** Element to render. Default `div`. */
  as?: StaggerTag;
  /** `<StaggerItem>`s, direct or nested, rendered by a server or client component. */
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Reveals its `<StaggerItem>`s on scroll, 70ms apart, capped at six: items
 * that enter the viewport in the same frame (a row of cards) are delayed in
 * DOM order, and anything after the sixth appears with the sixth. Rows further
 * down the page are revealed as they are reached, not all at once.
 *
 * Only this container is a client component; the items are plain markup, so a
 * server component can render the whole list. Items are collected once, when
 * the list mounts: items added later simply appear (use `<LayoutItem>` for a
 * list that is filtered on the client).
 *
 * Under reduced motion nothing is observed and the list is static.
 */
export function Stagger({ as = "div", children, className, id, ...rest }: StaggerProps) {
  // Widened on purpose: assignment would narrow Tag to the `as` union and reject the HTMLElement ref.
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const reduce = useMotionPreference();

  useEffect(() => {
    if (reduce) return;
    const container = ref.current;
    if (container === null) return;

    const stops = Array.from(container.querySelectorAll<HTMLElement>("[data-stagger-item]"))
      /* An item belongs to its nearest Stagger, so lists can nest. */
      .filter((item) => item.closest("[data-stagger]") === container)
      .map((item) => observeReveal(item, { group: container, staggerMs: STAGGER_MS }));

    return () => stops.forEach((stop) => stop());
  }, [reduce]);

  return (
    <Tag {...rest} ref={ref} id={id} className={className} data-stagger="">
      {children}
    </Tag>
  );
}
