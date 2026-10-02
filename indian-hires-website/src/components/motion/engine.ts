/**
 * Motion primitives that use the `motion` library (`m.*` components under
 * `LazyMotion`). Import from here ONLY in the catalogue and gallery client
 * components, so the library's runtime stays out of every other route.
 *
 * Everything else is in `@/components/motion`.
 *
 * Usage, props and the reduced-motion behaviour of each: README.md.
 */

export { MotionProvider, MotionMaxProvider, useMotionReady } from "./MotionProvider";
export type { MotionProviderProps } from "./MotionProvider";

export { LayoutItem, LayoutPresence, LayoutScope } from "./LayoutItem";
export type {
  LayoutItemProps,
  LayoutItemTag,
  LayoutPresenceProps,
  LayoutScopeProps,
} from "./LayoutItem";

export {
  SharedZoomBackdrop,
  SharedZoomPresence,
  SharedZoomSource,
  SharedZoomTarget,
} from "./SharedZoom";
export type {
  SharedZoomBackdropProps,
  SharedZoomPresenceProps,
  SharedZoomProps,
} from "./SharedZoom";
