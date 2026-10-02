"use client";

import { forwardRef, useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, type MotionProps } from "motion/react";
import * as m from "motion/react-m";
import { assignRef, useLayoutMotion } from "./LayoutItem";
import { EASE_MOVE, EASE_ROYAL, ZOOM_CLOSE_S, ZOOM_OPEN_S } from "./tokens";

/**
 * Gallery lightbox: the tile grows into the dialog image and shrinks back.
 * The tile and the dialog image share a `layoutId`; the library moves one box
 * into the other with transforms. Needs `<MotionMaxProvider>` around BOTH the
 * grid and the lightbox.
 *
 * Opening uses the target's transition (500ms); closing hands the box back to
 * the tile and uses the tile's transition (375ms, 25% faster).
 *
 * Without the provider, before its chunk has arrived, and under reduced
 * motion, these pass no motion props: the lightbox simply appears and
 * disappears.
 */

const SHOWN = { opacity: 1 };
const HIDDEN = { opacity: 0 };

export interface SharedZoomProps {
  /** The same id on the tile and on the dialog image, unique per picture. */
  id: string;
  children: ReactNode;
  className?: string;
}

/** Wraps the picture in the grid tile. Stays mounted while the lightbox is open. */
export function SharedZoomSource({ id, children, className }: SharedZoomProps) {
  const active = useLayoutMotion();
  const motionProps: MotionProps = active
    ? { layoutId: id, transition: { layout: { duration: ZOOM_CLOSE_S, ease: EASE_MOVE } } }
    : {};
  return (
    <m.div className={className} {...motionProps}>
      {children}
    </m.div>
  );
}

/**
 * Wraps the picture in the dialog. Render it inside `<SharedZoomPresence>`,
 * with a `key`. Give it the tile's aspect ratio: a box that changes shape
 * stretches its picture for the length of the zoom.
 */
export const SharedZoomTarget = forwardRef<HTMLElement, SharedZoomProps>(function SharedZoomTarget(
  { id, children, className },
  ref,
) {
  const active = useLayoutMotion();
  const setRef = useCallback((node: HTMLElement | null) => assignRef(ref, node), [ref]);
  const motionProps: MotionProps = active
    ? { layoutId: id, transition: { layout: { duration: ZOOM_OPEN_S, ease: EASE_MOVE } } }
    : {};
  return (
    <m.div ref={setRef} className={className} {...motionProps}>
      {children}
    </m.div>
  );
});

export interface SharedZoomBackdropProps {
  /** Position, colour and layer of the scrim, e.g. `fixed inset-0 bg-maroon-950/90`. */
  className?: string;
  onClick?: () => void;
}

/**
 * The lightbox scrim: fades in over 500ms, out over 375ms. Render it inside
 * `<SharedZoomPresence>`, with a `key`.
 */
export function SharedZoomBackdrop({ className, onClick }: SharedZoomBackdropProps) {
  const active = useLayoutMotion();
  const [activeAtMount] = useState(active);
  const motionProps: MotionProps = active
    ? {
        initial: activeAtMount ? HIDDEN : false,
        animate: SHOWN,
        exit: { ...HIDDEN, transition: { duration: ZOOM_CLOSE_S, ease: EASE_ROYAL } },
        transition: { duration: ZOOM_OPEN_S, ease: EASE_ROYAL },
      }
    : {};
  return <m.div aria-hidden="true" className={className} onClick={onClick} {...motionProps} />;
}

export interface SharedZoomPresenceProps {
  /**
   * The open lightbox, or nothing. `<SharedZoomBackdrop>` and the element that
   * holds `<SharedZoomTarget>` are DIRECT children, each with a `key`.
   */
  children: ReactNode;
  /** Fires when the lightbox has finished closing: return focus to the tile here. */
  onExitComplete?: () => void;
}

/** Keeps the lightbox in the DOM until its closing animation has finished. */
export function SharedZoomPresence({ children, onExitComplete }: SharedZoomPresenceProps) {
  return <AnimatePresence onExitComplete={onExitComplete}>{children}</AnimatePresence>;
}
