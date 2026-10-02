import { Fragment } from "react";
import { cx } from "@/lib/cx";
import { STAGGER_CAP, STEP_MS } from "./tokens";
import type { EnterStep } from "./EnterOnLoad";

export interface MaskLinesProps {
  /** The headline, one entry per visual line, from a content file. */
  lines: readonly string[];
  /** Classes of the outer span. */
  className?: string;
  /** Classes of each line. */
  lineClassName?: string;
  /** Step of the hero sequence the first line starts on (80ms each). Default 0. */
  step?: EnterStep;
}

/**
 * Hero headline: each line slides up into place from behind a mask, 80ms
 * apart (700ms each, capped at six lines). Render it INSIDE the heading:
 *
 *   <h1 className="type-display"><MaskLines lines={hero.headlineLines} /></h1>
 *
 * It renders spans only, so the heading stays one heading; a space between the
 * lines keeps the words apart for assistive technology. CSS only: it starts at
 * first paint, needs no JavaScript and is safe in a server component. Under
 * `prefers-reduced-motion: reduce` the lines are plain blocks.
 *
 * The mask is a `clip-path` slightly larger than the line box (globals.css),
 * so ascenders and descenders are not cut and layout is identical in every
 * branch.
 */
export function MaskLines({ lines, className, lineClassName, step = 0 }: MaskLinesProps) {
  return (
    <span className={cx("block", className)}>
      {lines.map((line, index) => (
        <Fragment key={`${index}-${line}`}>
          {index > 0 ? " " : null}
          <span data-mask-line="" className="block">
            <span
              className={cx("block motion-safe:animate-mask-line", lineClassName)}
              style={{ animationDelay: `${(step + Math.min(index, STAGGER_CAP - 1)) * STEP_MS}ms` }}
            >
              {line}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
