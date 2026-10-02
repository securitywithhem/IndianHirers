/**
 * Motion primitives that do NOT load the animation library: CSS transitions
 * and keyframes, driven by one shared IntersectionObserver where needed.
 * Importing from here can never add `motion` to a route's JavaScript.
 *
 * The primitives that do need the library (layout animation, shared-element
 * zoom, the LazyMotion providers) live in `@/components/motion/engine`.
 *
 * Usage, props and the reduced-motion behaviour of each: README.md.
 */

/* Scroll-triggered (client leaf components; children pass through). */
export { Reveal } from "./Reveal";
export type { RevealProps, RevealRise, RevealTag } from "./Reveal";
export { Stagger } from "./Stagger";
export type { StaggerProps, StaggerTag } from "./Stagger";
export { StaggerItem } from "./StaggerItem";
export type { StaggerItemProps, StaggerItemTag } from "./StaggerItem";
export { DrawLine } from "./DrawLine";
export type { DrawLineProps, DrawLineTag } from "./DrawLine";
export { Counter } from "./Counter";
export type { CounterFormat, CounterProps, CounterTag } from "./Counter";

/* Above the fold (CSS only, server-safe). */
export { KenBurns } from "./KenBurns";
export type { KenBurnsProps } from "./KenBurns";
export { MaskLines } from "./MaskLines";
export type { MaskLinesProps } from "./MaskLines";
export { EnterOnLoad } from "./EnterOnLoad";
export type { EnterOnLoadProps, EnterOnLoadTag, EnterStep } from "./EnterOnLoad";
export { SlideUpAfter } from "./SlideUpAfter";
export type { SlideUpAfterProps, SlideUpAfterTag } from "./SlideUpAfter";

/* Chrome. */
export { PageFade } from "./PageFade";
export type { PageFadeProps } from "./PageFade";
export { SlidePanel } from "./SlidePanel";
export type { SlidePanelProps, SlidePanelSide } from "./SlidePanel";
export { useScrolled } from "./useScrolled";
