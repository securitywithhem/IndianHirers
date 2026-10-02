import { notFound, permanentRedirect, redirect } from "next/navigation";
import { legacyRedirects } from "@/content/collections";

interface LegacyCategoryPageProps {
  params: { slug: string };
}

/* The parent of this file's route: the old category pages lived under it. */
const LEGACY_PREFIX = "/products/";

/* Only the old category slugs exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return legacyRedirects
    .filter((rule) => rule.source.startsWith(LEGACY_PREFIX))
    .map((rule) => ({ slug: rule.source.slice(LEGACY_PREFIX.length) }));
}

/*
 * /products/<old category> → its new collection (e.g. melamine →
 * /collections/premium-melamine). Issued by the page, so each one is
 * prerendered; the mapping is `legacyRedirects` in the content module.
 */
export default function LegacyCategoryPage({ params }: LegacyCategoryPageProps) {
  const rule = legacyRedirects.find((candidate) => candidate.source === `${LEGACY_PREFIX}${params.slug}`);
  if (!rule) notFound();
  if (rule.permanent) permanentRedirect(rule.destination);
  redirect(rule.destination);
}
