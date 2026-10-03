import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  /** Omitted on the last crumb: the current page is text, not a link. */
  href?: string;
}

export interface BreadcrumbProps {
  /** aria-label of the `<nav>`, from a content file. */
  label: string;
  /** From the home page to this page, in order. */
  trail: Crumb[];
}

/**
 * Breadcrumb for the maroon band that opens a collection page (it follows the
 * `.theme-dark` scope: gold links, ivory current page). An ordered list; the
 * last crumb carries `aria-current="page"`. Each link is a 44px target.
 *
 * Below `md` the current crumb is left out: the `h1` straight under it says
 * the same words, and a long title would wrap the trail.
 */
export function Breadcrumb({ label, trail }: BreadcrumbProps) {
  return (
    <nav aria-label={label}>
      <ol className="type-small flex flex-wrap items-center justify-center gap-x-1">
        {trail.map((crumb, index) => (
          <li key={crumb.label} className={crumb.href !== undefined ? "flex items-center gap-x-1" : "hidden items-center gap-x-1 md:flex"}>
            {index > 0 ? <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-hairline" /> : null}
            {crumb.href !== undefined ? (
              <Link
                href={crumb.href}
                className="focus-ring inline-flex min-h-11 items-center rounded-sm px-2 text-link underline decoration-hairline/60 underline-offset-4 transition-colors duration-hover ease-royal hover:decoration-link"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="px-2 text-foreground">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
