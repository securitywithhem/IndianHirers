"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  type ForwardedRef,
  type ReactNode,
} from "react";
import { AnimatePresence, LayoutGroup, type MotionProps } from "motion/react";
import * as m from "motion/react-m";
import { useMotionPreference } from "@/lib/useMotionPreference";
import { useMotionReady } from "./MotionProvider";
import { EASE_MOVE, EASE_ROYAL, LAYOUT_EXIT_S, LAYOUT_S } from "./tokens";

/**
 * Layout animation for the catalogue: filter chips and cards that re-flow.
 * Everything here needs `<MotionMaxProvider>` above it. Without the provider,
 * before its chunk has arrived, and under reduced motion, these components
 * pass no motion props at all: an `m.*` element with no motion props is a
 * plain element with no observer, listener or measurement, and it is the same
 * element in every branch, so nothing remounts and nothing shifts.
 *
 * The library animates layout with transforms only.
 */

/** Whether layout motion may run: provider present, chunk loaded, motion allowed. */
export function useLayoutMotion(): boolean {
  const reduce = useMotionPreference();
  const ready = useMotionReady();
  return ready && !reduce;
}

/** Hands a forwarded ref of the general element type to a specific element. */
export function assignRef<T extends HTMLElement>(ref: ForwardedRef<HTMLElement>, node: T | null): void {
  if (typeof ref === "function") ref(node);
  else if (ref !== null) ref.current = node;
}

const InPresence = createContext(false);

const SHOWN = { opacity: 1, scale: 1 };
const HIDDEN = { opacity: 0, scale: 0.96 };
const LEAVING = { ...HIDDEN, transition: { duration: LAYOUT_EXIT_S, ease: EASE_ROYAL } };

export type LayoutItemTag = "div" | "li" | "span";

export interface LayoutItemProps {
  /** Element to render. Default `div`. */
  as?: LayoutItemTag;
  children?: ReactNode;
  className?: string;
  /**
   * Shared identity. Give the same id to an element that is unmounted in one
   * place and mounted in another (the active-chip indicator) and it glides
   * between the two.
   */
  layoutId?: string;
  /**
   * Animate size as well as position. Default false: position only, which
   * never distorts the content. Always on when `layoutId` is set.
   */
  resize?: boolean;
}

/**
 * A box that glides to its new place when the layout around it changes
 * (350ms, ease-move). Inside `<LayoutPresence>` it also fades in when added
 * (opacity + scale 0.96 -> 1, 350ms) and out when removed (260ms). Items that
 * were on the page before motion became available never play the entrance.
 */
export const LayoutItem = forwardRef<HTMLElement, LayoutItemProps>(function LayoutItem(
  { as = "div", children, className, layoutId, resize = false },
  ref,
) {
  const active = useLayoutMotion();
  const inPresence = useContext(InPresence);
  const [activeAtMount] = useState(active);
  const setRef = useCallback((node: HTMLElement | null) => assignRef(ref, node), [ref]);

  let motionProps: MotionProps = {};
  if (active) {
    motionProps = {
      layout: layoutId !== undefined || resize ? true : "position",
      layoutId,
      transition: {
        duration: LAYOUT_S,
        ease: EASE_ROYAL,
        layout: { duration: LAYOUT_S, ease: EASE_MOVE },
      },
    };
    if (inPresence) {
      motionProps.initial = activeAtMount ? HIDDEN : false;
      motionProps.animate = SHOWN;
      motionProps.exit = LEAVING;
    }
  }

  if (as === "li") {
    return (
      <m.li ref={setRef} className={className} {...motionProps}>
        {children}
      </m.li>
    );
  }
  if (as === "span") {
    return (
      <m.span ref={setRef} className={className} {...motionProps}>
        {children}
      </m.span>
    );
  }
  return (
    <m.div ref={setRef} className={className} {...motionProps}>
      {children}
    </m.div>
  );
});

export interface LayoutPresenceProps {
  /** `<LayoutItem>`s as DIRECT children, each with a stable, unique `key`. */
  children: ReactNode;
  /** Fires when the last leaving item has gone. */
  onExitComplete?: () => void;
}

/**
 * Lets `<LayoutItem>`s animate in and out as a filter adds and removes them.
 * A leaving item is taken out of the flow at once, so its neighbours start
 * closing the gap while it fades: the list's container must therefore be
 * positioned (`relative`).
 *
 * Items present on first render do not play their entrance, so the server
 * HTML is the final state.
 */
export function LayoutPresence({ children, onExitComplete }: LayoutPresenceProps) {
  const active = useLayoutMotion();
  return (
    <InPresence.Provider value={true}>
      <AnimatePresence initial={false} mode={active ? "popLayout" : "sync"} onExitComplete={onExitComplete}>
        {children}
      </AnimatePresence>
    </InPresence.Provider>
  );
}

export interface LayoutScopeProps {
  children: ReactNode;
  /** Namespaces every `layoutId` inside, so two lists can reuse the same ids. */
  id?: string;
}

/**
 * Groups components whose layouts affect each other (the chip row and the
 * grid beneath it), so a change in one re-measures the others.
 */
export function LayoutScope({ children, id }: LayoutScopeProps) {
  return <LayoutGroup id={id}>{children}</LayoutGroup>;
}
