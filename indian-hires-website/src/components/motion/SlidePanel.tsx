"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "@/lib/cx";
import { useMotionPreference } from "@/lib/useMotionPreference";
import { SLIDE_ENTER_MS, SLIDE_EXIT_MS } from "./tokens";

export type SlidePanelSide = "right" | "bottom";

export interface SlidePanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "className"> {
  /** Whether the panel should be showing. */
  open: boolean;
  /** `right`: drawer from the right edge. `bottom`: sheet from the bottom edge. */
  side: SlidePanelSide;
  children: ReactNode;
  /** Classes of the sliding surface: width, background, theme scope, padding. */
  className?: string;
  /** Classes of the backdrop. Default: `maroon-950` at 70%. */
  backdropClassName?: string;
  /** Classes of the fixed root, e.g. a different `z-` layer. Default `z-drawer`. */
  rootClassName?: string;
  /** The backdrop was clicked. The builder decides whether that closes. */
  onBackdropClick?: () => void;
  /** Fires once the panel has finished leaving and is out of the DOM. */
  onExitComplete?: () => void;
}

type Phase = "unmounted" | "closed" | "open";

/*
 * No tailwind-merge in the browser: the classes a caller may want to change
 * (width, height, backdrop colour, layer) are zero-specificity defaults,
 * written `[:where(&)]:…`, so any utility in `className` / `backdropClassName`
 * / `rootClassName` wins whatever the order of the stylesheet.
 *
 * The drawer is full width below `sm` (a 384px drawer on a 390px phone leaves
 * a sliver of page); from `sm` it is 384px.
 */
const SURFACE_CLASS: Record<SlidePanelSide, string> = {
  right:
    "absolute inset-y-0 right-0 overflow-y-auto overscroll-contain [:where(&)]:w-full sm:[:where(&)]:max-w-sm",
  bottom: "absolute inset-x-0 bottom-0 overflow-y-auto overscroll-contain [:where(&)]:max-h-[85dvh]",
};

const DURATIONS = {
  "--slide-enter": `${SLIDE_ENTER_MS}ms`,
  "--slide-exit": `${SLIDE_EXIT_MS}ms`,
} as CSSProperties;

/**
 * Motion shell for the mobile nav drawer, the catalogue item drawer and the
 * quote-basket sheet. The surface slides in with `transform` (500ms), the
 * backdrop fades, and both leave 25% faster (375ms). Interrupting either
 * direction reverses smoothly from where it is.
 *
 * It renders NOTHING while closed (and nothing on the server): the panel is
 * mounted into `document.body` when `open` turns true and removed after the
 * exit has finished, at which point `onExitComplete` fires.
 *
 * It is only the motion shell. The builder owns the dialog contract from
 * `.claude/rules/a11y.md`: `role="dialog"`, `aria-modal`, the label, focus
 * trap, Esc, focus return, `inert` on the background and scroll lock. Extra
 * props and the forwarded ref land on the sliding surface for exactly that.
 * Because the panel is portalled out of its parent, put the theme scope
 * (`theme-dark`) in `className`.
 *
 * It does not depend on the animation library, so it works before a lazy
 * chunk has arrived. Under reduced motion it appears and disappears at once
 * and `onExitComplete` fires immediately; no frame callback or timer is used.
 */
export const SlidePanel = forwardRef<HTMLDivElement, SlidePanelProps>(function SlidePanel(
  {
    open,
    side,
    children,
    className,
    backdropClassName,
    rootClassName,
    onBackdropClick,
    onExitComplete,
    ...surfaceProps
  },
  ref,
) {
  const reduce = useMotionPreference();
  const [phase, setPhase] = useState<Phase>("unmounted");
  const phaseRef = useRef<Phase>("unmounted");
  const exitCallback = useRef(onExitComplete);

  useEffect(() => {
    exitCallback.current = onExitComplete;
  });

  const enter = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  useEffect(() => {
    if (open) {
      /* Already mounted (re-opened mid-exit) or no motion: go straight to open. */
      if (reduce || phaseRef.current !== "unmounted") {
        enter("open");
        return;
      }
      /* Mount off-screen, then open two frames later, so the browser has
       * styled the closed state and the transition has something to run from. */
      enter("closed");
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => enter("open"));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }

    if (phaseRef.current === "unmounted") return;

    const finish = () => {
      enter("unmounted");
      exitCallback.current?.();
    };

    if (reduce) {
      finish();
      return;
    }

    enter("closed");
    const timer = window.setTimeout(finish, SLIDE_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, reduce, enter]);

  if (phase === "unmounted" || typeof document === "undefined") return null;

  return createPortal(
    <div
      data-slide-panel={reduce ? "static" : "animated"}
      data-side={side}
      data-state={phase}
      className={cx("fixed inset-0 [:where(&)]:z-drawer", rootClassName)}
      style={DURATIONS}
    >
      <div
        aria-hidden="true"
        data-slide-backdrop=""
        onClick={onBackdropClick}
        className={cx("absolute inset-0 [:where(&)]:bg-maroon-950/70", backdropClassName)}
      />
      <div
        {...surfaceProps}
        ref={ref}
        data-slide-surface=""
        className={cx(SURFACE_CLASS[side], className)}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
});
