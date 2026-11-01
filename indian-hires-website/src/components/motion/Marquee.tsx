"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface MarqueeProps {
  /**
   * One complete set, at least as wide as `maxWidthClass`, or the loop shows a
   * blank gap. Rendered twice, so it must hold nothing focusable. Space its
   * items with padding, not `gap`, or the loop jumps by one gap.
   */
  children: ReactNode;
  /** Caps the slider's width on very wide screens; it is centred in the band. */
  maxWidthClass: string;
  /** `aria-label` of the control, from a content file. */
  pauseLabel: string;
  playLabel: string;
}

/**
 * A continuous horizontal slider, driven by `transform` alone. The second copy
 * is hidden from assistive technology, and the track moves by exactly its
 * width (`-50%` of two equal copies), so the loop has no seam.
 *
 * It stops on hover and on the control, which WCAG 2.2.2 requires for anything
 * that moves for longer than five seconds. Under reduced motion it does not
 * move at all: the second copy and the control are gone, and the set is simply
 * there for the children to lay out with `motion-reduce:` classes.
 */
export function Marquee({ children, maxWidthClass, pauseLabel, playLabel }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const clip = useRef<HTMLDivElement>(null);
  const Icon = paused ? Play : Pause;

  // A lazy image in the clipped track only loads once it is on screen, so it
  // would enter blank. Load them all as the section approaches, not at page load.
  // Same query as `motion-safe:`, not useMotionPreference: on a low-power phone
  // that hook says reduce while this CSS animation still runs.
  useEffect(() => {
    const element = clip.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.querySelectorAll("img").forEach((image) => {
          image.loading = "eager";
        });
        observer.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={clip}
        className={cx(
          "group/marquee mx-auto overflow-hidden motion-safe:[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
          maxWidthClass,
        )}
      >
        <div
          className={cx(
            // Hover only where it is real: a tap on a phone would leave a sticky `:hover`.
            "flex w-max [@media(hover:hover)]:group-hover/marquee:![animation-play-state:paused] motion-safe:animate-marquee motion-reduce:w-full",
            // Important: the `animation` shorthand in `motion-safe:` comes later and resets it.
            paused && "![animation-play-state:paused]",
          )}
        >
          <div className="shrink-0 motion-reduce:w-full motion-reduce:shrink">{children}</div>
          <div aria-hidden="true" className="shrink-0 motion-reduce:hidden">
            {children}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? playLabel : pauseLabel}
          className="focus-ring flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-heading"
        >
          <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
        </button>
      </div>
    </>
  );
}
