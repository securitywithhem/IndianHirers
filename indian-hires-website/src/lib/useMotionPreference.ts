"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server (where layout effects
 * don't run and React warns). Resolving the preference in a layout effect means
 * the swap from the static path to the animated one happens before the browser
 * paints, so there is no visible jump between the two layouts.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Whether this visitor should get the reduced-motion path.
 *
 * Combines the OS preference with a coarse device-capability check, so a
 * low-core phone on a metered connection is spared the pinned scroll
 * choreography even when it hasn't asked for reduced motion.
 *
 * Named `useMotionPreference` rather than `useReducedMotion` to avoid shadowing
 * framer-motion's hook of that name, which is used elsewhere in the codebase.
 *
 * Returns `true` until the first client effect runs, so SSR and the initial
 * paint render the static path — motion is opt-in, never a flash of animation.
 */
export function useMotionPreference(): boolean {
  const [shouldReduce, setShouldReduce] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const lowPower =
      (nav.connection?.saveData ?? false) ||
      (nav.hardwareConcurrency ?? 8) <= 2 ||
      (nav.deviceMemory ?? 8) <= 2;

    const update = () => setShouldReduce(query.matches || lowPower);
    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return shouldReduce;
}
