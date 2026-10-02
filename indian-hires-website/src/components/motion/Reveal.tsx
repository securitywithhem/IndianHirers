"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useMotionPreference } from "@/lib/useMotionPreference";
import { observeReveal } from "./observe";
import { ENTER_LG_MS, ENTER_MS } from "./tokens";

export type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "figure"
  | "ul"
  | "ol"
  | "li"
  | "p"
  | "span";

/** Rise in px. 24 is the section default; 0 is a plain fade. */
export type RevealRise = 0 | 8 | 16 | 24;

export interface RevealProps {
  /** Element to render. Default `div`. */
  as?: RevealTag;
  children: ReactNode;
  className?: string;
  /** Extra delay in ms. Prefer `<Stagger>` for siblings. Default 0. */
  delay?: number;
  /** Rise in px. Default 24 (500ms); 16 and below run in 350ms. */
  y?: RevealRise;
  /**
   * Also grow the rules of each `<CrownDivider>` inside from the centre
   * (e.g. a `<SectionHeading divider>`). Default false.
   */
  lines?: boolean;
  id?: string;
}

/**
 * Fade + rise on scroll, once.
 *
 * The same element is rendered on the server, under reduced motion and when
 * animated, so the box never changes. Under reduced motion nothing is observed.
 * Content already in the viewport when the page becomes interactive is left
 * alone; only content still below the fold is hidden and then revealed.
 */
export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  y = 24,
  lines = false,
  id,
}: RevealProps) {
  // Widened on purpose: assignment would narrow Tag to the `as` union and reject the HTMLElement ref.
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const reduce = useMotionPreference();

  useEffect(() => {
    if (reduce) return;
    const element = ref.current;
    if (element === null) return;
    return observeReveal(element, { delayMs: delay });
  }, [reduce, delay]);

  const style = {
    "--reveal-y": `${y}px`,
    "--reveal-duration": `${y > 16 ? ENTER_LG_MS : ENTER_MS}ms`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={style}
      data-reveal-lines={lines ? "" : undefined}
    >
      {children}
    </Tag>
  );
}
