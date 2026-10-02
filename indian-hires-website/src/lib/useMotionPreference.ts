"use client";

import { useSyncExternalStore } from "react";

/**
 * The reduced-motion gate. Every animated primitive in
 * `src/components/motion/` asks this file whether it may move.
 *
 * "Reduce" means either the OS setting (`prefers-reduced-motion: reduce`) or a
 * coarse low-power signal (Save-Data, <= 2 cores, <= 2 GB), so a weak phone is
 * spared the animation work even when it has not asked for reduced motion.
 *
 * One shared `matchMedia` listener serves every subscriber.
 */

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

type CapabilityNavigator = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

let mediaQuery: MediaQueryList | null = null;
let lowPower: boolean | null = null;
const subscribers = new Set<() => void>();

function notifySubscribers(): void {
  subscribers.forEach((subscriber) => subscriber());
}

function getQuery(): MediaQueryList {
  if (mediaQuery === null) {
    mediaQuery = window.matchMedia(REDUCE_QUERY);
    mediaQuery.addEventListener("change", notifySubscribers);
  }
  return mediaQuery;
}

function isLowPower(): boolean {
  if (lowPower === null) {
    const nav = navigator as CapabilityNavigator;
    lowPower =
      (nav.connection?.saveData ?? false) ||
      (nav.hardwareConcurrency ?? 8) <= 2 ||
      (nav.deviceMemory ?? 8) <= 2;
  }
  return lowPower;
}

/**
 * The preference right now, outside React. `true` = reduce.
 * Always `true` on the server. Call it from effects and event handlers only,
 * never during render (use the hook there, it is hydration-safe).
 */
export function getMotionPreference(): boolean {
  if (typeof window === "undefined") return true;
  return getQuery().matches || isLowPower();
}

function subscribe(onChange: () => void): () => void {
  getQuery();
  subscribers.add(onChange);
  return () => {
    subscribers.delete(onChange);
  };
}

function getServerSnapshot(): boolean {
  return true;
}

/**
 * Whether this visitor should get the reduced-motion path. `true` = reduce.
 *
 * Returns `true` on the server and for the hydration render, so SSR and first
 * paint are always the static path; React then re-renders with the real value
 * before the browser paints. Components mounted later (client navigation) get
 * the real value on their first render. Follows a live change of the OS
 * setting.
 *
 * Named `useMotionPreference` rather than `useReducedMotion` so it is never
 * confused with the motion library's hook of that name.
 */
export function useMotionPreference(): boolean {
  return useSyncExternalStore(subscribe, getMotionPreference, getServerSnapshot);
}
