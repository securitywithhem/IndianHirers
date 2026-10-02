"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { CATALOGUE_STACK_CLASS } from "./classes";
import type { CatalogueProps } from "./types";

export interface CatalogueIslandProps extends CatalogueProps {
  /** The server-rendered `<StaticCatalogue>`: the full, unfiltered grid. */
  children: ReactNode;
}

const FOCUS_KEY = "data-focus-key";

/**
 * Shows the server-rendered catalogue, then swaps in the interactive one
 * (filters in the URL, layout animation, item drawer) once its code has
 * arrived. The interactive part is fetched after hydration — it is what makes
 * the chips and the cards respond — so neither it nor the animation wrappers
 * are in the route's first load, and the page is complete before, and
 * without, JavaScript. A collection with nothing to filter and no drawer (a
 * text list) does not use this component at all.
 *
 * The interactive catalogue reads `useSearchParams`; it renders inside a
 * Suspense boundary whose fallback is the server grid, and never during the
 * static prerender, so the route stays statically generated.
 *
 * If the import fails (offline, a blocked chunk) the static grid simply stays.
 */
export function CatalogueIsland({ children, ...catalogue }: CatalogueIslandProps) {
  const [Interactive, setInteractive] = useState<ComponentType<CatalogueProps> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  /* The control that had focus in the static grid, to focus its twin after the swap. */
  const focusKey = useRef<string | null>(null);

  useEffect(() => {
    let current = true;
    import("./CollectionCatalogue")
      .then((loaded) => {
        if (!current) return;
        const active = document.activeElement;
        focusKey.current =
          active !== null && containerRef.current?.contains(active) ? active.getAttribute(FOCUS_KEY) : null;
        setInteractive(() => loaded.CollectionCatalogue);
      })
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, []);

  useLayoutEffect(() => {
    const key = focusKey.current;
    if (Interactive === null || key === null) return;
    focusKey.current = null;
    Array.from(containerRef.current?.querySelectorAll<HTMLElement>(`[${FOCUS_KEY}]`) ?? [])
      .find((element) => element.getAttribute(FOCUS_KEY) === key)
      ?.focus({ preventScroll: true });
  }, [Interactive]);

  return (
    <div ref={containerRef} className={CATALOGUE_STACK_CLASS}>
      {Interactive === null ? children : (
        <Suspense fallback={children}>
          <Interactive {...catalogue} />
        </Suspense>
      )}
    </div>
  );
}
