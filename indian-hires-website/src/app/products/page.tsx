import { notFound, permanentRedirect, redirect } from "next/navigation";
import { legacyRedirects } from "@/content/collections";

/* This file's own route: the address the catalogue had before the redesign. */
const LEGACY_ROUTE = "/products";

/*
 * /products → /collections. The redirect is issued by the page itself, so it
 * is prerendered with the rest of the site: no middleware, no API route, no
 * `redirects()` in next.config. The destination comes from `legacyRedirects`.
 */
export default function LegacyProductsPage() {
  const rule = legacyRedirects.find((candidate) => candidate.source === LEGACY_ROUTE);
  if (!rule) notFound();
  if (rule.permanent) permanentRedirect(rule.destination);
  redirect(rule.destination);
}
