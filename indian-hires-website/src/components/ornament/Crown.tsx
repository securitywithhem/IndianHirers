import { cx } from "@/lib/cx";

export interface CrownProps {
  /**
   * Size and colour. Default height is `h-6` (a zero-specificity default, so
   * any `h-*` here wins); stroke follows `currentColor`.
   */
  className?: string;
  /**
   * Accessible name, supplied from a content file. Omit it (the default) and
   * the crown is decorative: `aria-hidden`, no role.
   */
  title?: string;
  /** Stroke width in viewBox units (the viewBox is 64 x 48). Default 2. */
  strokeWidth?: number;
}

/**
 * Lotus-crown ornament: an original outline drawing inspired by the crown in
 * the Indian Hirers mark. It is NOT the logo and never replaces it — the logo
 * is always the supplied image file, used as-is.
 *
 * Every stroke carries `pathLength={1}` and a `data-crown-stroke` attribute
 * ("band" | "petal" | "finial"), so the motion layer can draw it with
 * stroke-dashoffset 1 → 0 without measuring anything. The `crown-draw` class
 * in globals.css does exactly that, once, and is inert under reduced motion.
 */
export function Crown({ className, title, strokeWidth = 2 }: CrownProps) {
  const decorative = title === undefined || title.length === 0;

  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      className={cx("inline-block aspect-[4/3] w-auto shrink-0 [:where(&)]:h-6", className)}
    >
      {decorative ? null : <title>{title}</title>}

      {/* Band: two rules the petals rise from. */}
      <path data-crown-stroke="band" pathLength={1} d="M14 37H50M16 43H48" />

      {/* Outer petals, flaring past the band. */}
      <path
        data-crown-stroke="petal"
        pathLength={1}
        d="M23 37C15.5 34.5 9 29 6 21.5C14 22.5 21 28 23 37Z"
      />
      <path
        data-crown-stroke="petal"
        pathLength={1}
        d="M41 37C48.5 34.5 55 29 58 21.5C50 22.5 43 28 41 37Z"
      />

      {/* Inner petals, crossing behind the centre one. */}
      <path
        data-crown-stroke="petal"
        pathLength={1}
        d="M32 37C26 33 19.5 26 20 15.5C27 19.5 31.5 28 32 37Z"
      />
      <path
        data-crown-stroke="petal"
        pathLength={1}
        d="M32 37C38 33 44.5 26 44 15.5C37 19.5 32.5 28 32 37Z"
      />

      {/* Centre petal. */}
      <path
        data-crown-stroke="petal"
        pathLength={1}
        d="M25.5 37C23.5 28 27.5 20 32 14.5C36.5 20 40.5 28 38.5 37"
      />

      {/* Finial: the diamond above the centre petal. */}
      <path data-crown-stroke="finial" pathLength={1} d="M32 3L35.5 7.5L32 12L28.5 7.5Z" />
    </svg>
  );
}
