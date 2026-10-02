"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { LazyMotion, MotionConfig, type FeatureBundle } from "motion/react";
import { getMotionPreference } from "@/lib/useMotionPreference";

/**
 * `true` once the feature bundle of the nearest provider has arrived.
 * Primitives that use `m.*` stay plain elements until then, so nothing is ever
 * hidden or frozen while a chunk is still on the network.
 */
const MotionReadyContext = createContext(false);

export function useMotionReady(): boolean {
  return useContext(MotionReadyContext);
}

export interface MotionProviderProps {
  children: ReactNode;
}

type FeatureLoader = () => Promise<FeatureBundle>;

const loadAnimationFeatures: FeatureLoader = () => import("./features").then((loaded) => loaded.default);
const loadMaxFeatures: FeatureLoader = () => import("./features-max").then((loaded) => loaded.default);

/** A promise that never settles: the chunk is simply not requested. */
function skipLoading(): Promise<FeatureBundle> {
  return new Promise<FeatureBundle>(() => undefined);
}

function LazyFeatures({ load, children }: MotionProviderProps & { load: FeatureLoader }) {
  const [ready, setReady] = useState(false);

  /* LazyMotion calls this once, in an effect after mount. Visitors on the
   * reduced-motion path never download the bundle at all. */
  const features = useCallback<FeatureLoader>(() => {
    if (getMotionPreference()) return skipLoading();
    return load().then((bundle) => {
      setReady(true);
      return bundle;
    });
  }, [load]);

  return (
    <LazyMotion features={features} strict>
      {/* The library's own guard, on top of ours: with the OS setting on,
          transform and layout animations are skipped at run time. */}
      <MotionConfig reducedMotion="user">
        <MotionReadyContext.Provider value={ready}>{children}</MotionReadyContext.Provider>
      </MotionConfig>
    </LazyMotion>
  );
}

/**
 * `LazyMotion` with the default `domAnimation` bundle, loaded asynchronously,
 * `strict` (rendering the library's full component instead of `m` inside it
 * throws in development).
 *
 * None of the primitives in this folder needs it today: scroll reveals, the
 * hero, the drawer and the page fade are CSS. Mount it only around a subtree
 * that really renders `m.*` components without layout animation. Do not put it
 * in the root layout "just in case": it would add the `LazyMotion` runtime to
 * every route and a ~25 kB download after hydration for no visible result.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return <LazyFeatures load={loadAnimationFeatures}>{children}</LazyFeatures>;
}

/**
 * `LazyMotion` with the `domMax` bundle (layout animations and `layoutId`),
 * loaded asynchronously, `strict`.
 *
 * Mount it ONLY around the catalogue filters + grid and around the gallery
 * grid + lightbox. Never in the root layout. `LayoutItem`, `LayoutPresence`
 * and the `SharedZoom*` helpers do nothing without it.
 */
export function MotionMaxProvider({ children }: MotionProviderProps) {
  return <LazyFeatures load={loadMaxFeatures}>{children}</LazyFeatures>;
}
