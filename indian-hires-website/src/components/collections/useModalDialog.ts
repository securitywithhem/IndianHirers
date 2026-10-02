"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import type { SlidePanelSide } from "@/components/motion";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The dialog contract from `.claude/rules/a11y.md` for a `SlidePanel`, the
 * same one `src/components/layout/MobileDrawer.tsx` implements. While `open`:
 * - Esc closes;
 * - Tab and Shift+Tab stay inside the panel;
 * - everything else on the page is `inert` and the page cannot scroll.
 *
 * Moving focus in (a ref callback on the close button) and back to the
 * trigger (`onExitComplete` of the panel) belong to the caller.
 */
export function useModalDialog(open: boolean, panelRef: RefObject<HTMLElement>, onClose: () => void): void {
  /* The latest `onClose`, so a new function identity does not re-run the effect. */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (panel === null) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (first === undefined || last === undefined) {
        event.preventDefault();
        return;
      }

      const active = document.activeElement;
      if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    /* Everything that is on the page now becomes inert; the panel is portalled
     * into <body> after this runs, so it is never in the list. */
    const inerted: HTMLElement[] = [];
    Array.from(document.body.children).forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      if (element.hasAttribute("data-slide-panel") || element.inert) return;
      element.inert = true;
      inerted.push(element);
    });

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inerted.forEach((element) => {
        element.inert = false;
      });
      root.style.overflow = previousOverflow;
    };
  }, [open, panelRef]);
}

/* Tailwind's `md`. */
const WIDE_QUERY = "(min-width: 768px)";

function subscribeWide(onChange: () => void): () => void {
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isWide(): boolean {
  return window.matchMedia(WIDE_QUERY).matches;
}

function isWideOnServer(): boolean {
  return false;
}

/** A sheet from the bottom on a phone, a drawer from the right from `md`. */
export function usePanelSide(): SlidePanelSide {
  return useSyncExternalStore(subscribeWide, isWide, isWideOnServer) ? "right" : "bottom";
}
