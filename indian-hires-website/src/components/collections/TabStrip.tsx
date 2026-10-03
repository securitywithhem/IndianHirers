"use client";

import { useEffect, useRef, type ReactNode } from "react";

export interface TabStripProps {
  /** Classes of the scrolling `<ul>`. */
  className: string;
  /** The server-rendered `<li>` tabs. */
  children: ReactNode;
}

/* Room left after the current tab, so the next one shows as a cut label. */
const PEEK = 48;

/**
 * The scrolling row of `CollectionTabs`. Its only job on the client: on a
 * phone the current tab may start past the right edge, and only then is the
 * row scrolled, once, on mount, just far enough to show it and the start of
 * the next tab; the tabs before it stay cut by the left edge, which is the
 * cue that the row scrolls back. A tab that is already in view is left where
 * it is. That sets the row's own `scrollLeft` — the page does not move and
 * nothing animates. Without JavaScript the row is the same list, scrolled to
 * its start.
 */
export function TabStrip({ className, children }: TabStripProps) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const strip = ref.current;
    const current = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !current) return;
    const stripBox = strip.getBoundingClientRect();
    const tabBox = current.getBoundingClientRect();
    const overflow = tabBox.right - stripBox.right;
    if (overflow > 0) strip.scrollLeft += overflow + PEEK;
  }, []);

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
