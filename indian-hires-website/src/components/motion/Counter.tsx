"use client";

import { useEffect, useRef, type ElementType } from "react";
import { cx } from "@/lib/cx";
import { useMotionPreference } from "@/lib/useMotionPreference";
import { observeReveal } from "./observe";
import { COUNTER_MS } from "./tokens";

export type CounterTag = "span" | "div" | "p" | "dd";

/** `plain`: 1977 -> "1977". `grouped`: 12500 -> "12,500" (Indian grouping). */
export type CounterFormat = "plain" | "grouped";

export interface CounterProps {
  /** The final number. Whole numbers only. */
  value: number;
  /** Where the count starts. Default 0; for a year pass something near it. */
  from?: number;
  /** Text before / after the number, from a content file. */
  prefix?: string;
  suffix?: string;
  /** Default `plain`. Use `plain` for years. */
  format?: CounterFormat;
  /** Element to render. Default `span`. */
  as?: CounterTag;
  /** Usually `type-stat` plus a colour. */
  className?: string;
}

const groupedFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function formatNumber(value: number, format: CounterFormat): string {
  const whole = Math.round(value);
  return format === "grouped" ? groupedFormatter.format(whole) : String(whole);
}

/** The default curve (0.23, 1, 0.32, 1) is an ease-out quint; this is its formula. */
function easeOutQuint(progress: number): number {
  return 1 - Math.pow(1 - progress, 5);
}

/**
 * Counts up to `value` once, when it scrolls into view.
 *
 * Two layers share one grid cell. The final text is always in the document:
 * it is what the server renders, what assistive technology reads, and what
 * fixes the width, so nothing shifts while the digits run. The running number
 * is a second, `aria-hidden` layer drawn on top; it is written through a ref,
 * never through React state.
 *
 * Under reduced motion, and for a counter that is already on screen when the
 * page becomes interactive, only the final text is ever shown.
 */
export function Counter({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  format = "plain",
  as = "span",
  className,
}: CounterProps) {
  // Widened on purpose: assignment would narrow Tag to the `as` union and reject the HTMLElement ref.
  const Tag = as as ElementType;
  const rootRef = useRef<HTMLElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const reduce = useMotionPreference();

  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    const live = liveRef.current;
    if (root === null || live === null) return;

    let frame = 0;
    let startTimer = 0;
    let shown = Number.NaN;

    const show = (current: number) => {
      if (current === shown) return;
      shown = current;
      live.textContent = `${prefix}${formatNumber(current, format)}${suffix}`;
    };

    const run = () => {
      let startedAt = 0;
      const tick = (now: number) => {
        if (startedAt === 0) startedAt = now;
        const progress = Math.min(1, (now - startedAt) / COUNTER_MS);
        show(Math.round(from + (value - from) * easeOutQuint(progress)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const stop = observeReveal(root, {
      attribute: "data-count",
      onPending: () => show(from),
      onReveal: (delayMs) => {
        startTimer = window.setTimeout(run, delayMs);
      },
    });

    return () => {
      stop();
      window.clearTimeout(startTimer);
      cancelAnimationFrame(frame);
      live.textContent = "";
    };
  }, [reduce, value, from, prefix, suffix, format]);

  return (
    <Tag ref={rootRef} className={cx("lining-nums tabular-nums [:where(&)]:inline-grid", className)}>
      <span data-count-final="" className="col-start-1 row-start-1">
        {prefix}
        {formatNumber(value, format)}
        {suffix}
      </span>
      <span
        ref={liveRef}
        aria-hidden="true"
        data-count-live=""
        className="invisible col-start-1 row-start-1"
      />
    </Tag>
  );
}
