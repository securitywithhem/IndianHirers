import type { MetadataRoute } from "next";
import { collectionSlugs } from "@/content/collections";
import { collectionPath, routeMetadata, routes } from "@/content/site";
import { env } from "@/lib/env";
import { absoluteUrl } from "@/lib/links";

/**
 * Built from the route table, never from a hand-typed list: every static
 * route whose metadata says `index: true`, plus one entry per collection.
 *
 * A sitemap may only hold absolute URLs and there is no fallback domain, so
 * it is empty until NEXT_PUBLIC_SITE_URL is set (docs/OPEN_ISSUES.md O1).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!env.siteUrl) return [];

  const lastModified = new Date();
  const staticPaths = Object.values(routes).filter((path) => routeMetadata[path].index);
  const collectionPaths = collectionSlugs.map((slug) => collectionPath(slug));

  return [...staticPaths, ...collectionPaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority: path === routes.home ? 1 : 0.8,
  }));
}
