import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { shell } from "@/content/site";

export interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> {
  /** A site path (`/contact`), a web URL (`https://…`) or a `tel:` / `mailto:` link. */
  href: string;
  children: ReactNode;
}

type LinkKind = "internal" | "web" | "protocol";

function kindOf(href: string): LinkKind {
  if (/^https?:\/\//i.test(href)) return "web";
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return "protocol";
  return "internal";
}

/** True when `href` leaves the site in the browser (and so opens a new tab). */
export function isWebUrl(href: string): boolean {
  return kindOf(href) === "web";
}

/**
 * One link element for every destination, so no caller has to decide between
 * `next/link` and `<a>`:
 *
 * - a site path renders `next/link` (client navigation, prefetch);
 * - a web URL opens in a new tab with `rel="noopener noreferrer"`, and says so
 *   to assistive technology (the note is appended to `aria-label` when there
 *   is one, otherwise added as visually hidden text);
 * - `tel:` and `mailto:` render a plain anchor in the same tab.
 *
 * `whatsappUrl()`, `telUrl()` and `mailtoUrl()` fall back to `/contact` when
 * the detail is not configured, which is why the kind is read from the URL
 * and never assumed. It adds no classes of its own.
 */
export function AppLink({ href, children, "aria-label": ariaLabel, ...rest }: AppLinkProps) {
  const kind = kindOf(href);

  if (kind === "internal") {
    return (
      <Link href={href} aria-label={ariaLabel} {...rest}>
        {children}
      </Link>
    );
  }

  if (kind === "protocol") {
    return (
      <a href={href} aria-label={ariaLabel} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ? `${ariaLabel} ${shell.newTabNote}` : undefined}
      {...rest}
    >
      {children}
      {ariaLabel ? null : <span className="sr-only"> {shell.newTabNote}</span>}
    </a>
  );
}
