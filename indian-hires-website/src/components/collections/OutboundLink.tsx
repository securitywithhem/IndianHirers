import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export interface OutboundLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> {
  /** From `whatsappUrl()`: a web URL, or `/contact` when no number is configured. */
  href: string;
  /**
   * Screen-reader note for a link that opens a new tab, from `shell.newTabNote`.
   * Omit it when the note is already part of `aria-label`.
   */
  newTabNote?: string;
  children: ReactNode;
}

/**
 * `AppLink` for the catalogue's client components. `AppLink` reads
 * `@/content/site`, which would pull the site's copy into the browser bundle,
 * so this one takes the new-tab note as a prop and imports no content. Same
 * behaviour: a web URL opens a new tab and says so; a site path is a
 * `next/link`.
 */
export function OutboundLink({ href, newTabNote, children, ...rest }: OutboundLinkProps) {
  if (!/^https?:\/\//i.test(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      {newTabNote ? <span className="sr-only"> {newTabNote}</span> : null}
    </a>
  );
}
