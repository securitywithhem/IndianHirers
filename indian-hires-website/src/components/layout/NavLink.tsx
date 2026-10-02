"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** `page`: this is the route. `true`: the route is underneath it (a collection page under Collections). */
export function currentState(pathname: string, href: string): "page" | "true" | undefined {
  if (pathname === href) return "page";
  if (href !== "/" && pathname.startsWith(`${href}/`)) return "true";
  return undefined;
}

export interface NavLinkProps {
  href: string;
  label: string;
}

/**
 * A desktop header link (Docs/UI_UX_V2.md §7.9). The gold underline grows from
 * the centre on hover and keyboard focus (`scaleX`, off under reduced motion)
 * and stays drawn on the current route. Colours are roles, so the link is
 * right in both header states without per-state classes.
 */
export function NavLink({ href, label }: NavLinkProps) {
  const current = currentState(usePathname(), href);

  return (
    <Link
      href={href}
      aria-current={current}
      className="group/link type-button focus-ring relative inline-flex min-h-11 items-center rounded-sm text-foreground"
    >
      {label}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-2 h-px origin-center scale-x-0 bg-hairline group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100 group-aria-[current]/link:scale-x-100 motion-safe:transition-transform motion-safe:duration-hover motion-safe:ease-royal"
      />
    </Link>
  );
}
