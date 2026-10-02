"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { getMotionPreference } from "@/lib/useMotionPreference";
import { PAGE_FADE_MS } from "./tokens";

/* Layout effect on the client so the fade is armed before the new page is
 * painted; plain effect on the server, where layout effects do not run. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** False until the first page of this visit has mounted. */
let firstPageHasMounted = false;

export interface PageFadeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Route-change fade for `src/app/template.tsx`: opacity 0 -> 1 over 300ms,
 * nothing else. There is no exit fade (the old page is replaced at once).
 *
 * First load: does nothing at all. The server HTML is fully visible, the
 *   first PageFade to mount only records that the visit has started, and LCP
 *   is untouched.
 * Client navigation: `template.tsx` remounts, so a new PageFade mounts and
 *   fades the incoming page in. The marker is set in a layout effect, before
 *   that page is painted, and removed when the fade is over.
 * Reduced motion / low-power device: nothing is set; the page just appears.
 *
 * It renders one plain `div` in every case, so the box never changes.
 */
export function PageFade({ children, className }: PageFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  /* Decided once per instance, so a development double-run cannot turn the
   * first load into a fade. */
  const shouldFade = useRef<boolean | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (shouldFade.current === null) {
      shouldFade.current = firstPageHasMounted;
      firstPageHasMounted = true;
    }
    if (!shouldFade.current || getMotionPreference()) return;

    const element = ref.current;
    if (element === null) return;

    element.setAttribute("data-page-fade", "in");
    const timer = window.setTimeout(() => element.removeAttribute("data-page-fade"), PAGE_FADE_MS + 100);

    return () => {
      window.clearTimeout(timer);
      element.removeAttribute("data-page-fade");
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
