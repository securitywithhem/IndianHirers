"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useScrolled } from "@/components/motion";

export interface HeaderFrameProps {
  children: ReactNode;
}

/**
 * The fixed `<header>` and its two states (Docs/UI_UX_V2.md §6.6, §7.9). Only
 * this leaf is a client component; the logo, nav and actions are
 * server-rendered children.
 *
 * On every route the header starts transparent, in the dark scope, over the
 * maroon band that opens the page (the home hero or a `PageHero`), and turns
 * solid after 80px of scroll. Its height is `h-header` in both states, so
 * nothing in the document moves. The solid state is an ivory backdrop whose
 * OPACITY fades in; dropping `theme-dark` flips the text, links and focus
 * ring from ivory/gold to espresso/maroon in the same step.
 *
 * `useScrolled` watches a sentinel with an IntersectionObserver — no scroll
 * listener, no state update per scroll event.
 */
export function HeaderFrame({ children }: HeaderFrameProps) {
  const scrolled = useScrolled(80);

  return (
    <header
      data-scrolled={scrolled}
      className={cx(
        "group fixed inset-x-0 top-0 z-header h-header text-foreground transition-colors duration-hover ease-royal",
        !scrolled && "theme-dark",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 border-b border-hairline/40 bg-ivory-50/90 opacity-0 shadow-header backdrop-blur-md transition-opacity duration-hover ease-royal group-data-[scrolled=true]:opacity-100"
      />
      <div className="shell flex h-full items-center justify-between gap-4">{children}</div>
    </header>
  );
}
