import type { Metadata } from "next";
import { env } from "@/lib/env";
import { routeMetadata, siteMetadata, type RouteMetadata } from "@/content/site";

/**
 * Turns one entry of `routeMetadata` (or `collectionMetadata(collection)`)
 * into a page's `metadata` export:
 *
 *   export const metadata = pageMetadata(routeMetadata["/founders"]);
 *
 * - The layout's title template appends the brand name; the home title is the
 *   full default title already, so it is emitted as `absolute`.
 * - `index: false` becomes `noindex, follow` and drops the canonical.
 * - The not-found entry emits no robots tag of its own: Next.js already adds
 *   `noindex` to every 404 response, and a second tag would duplicate it.
 * - Canonical and `og:url` are emitted only when NEXT_PUBLIC_SITE_URL is set —
 *   there is no fallback domain.
 * - `og:image` is emitted only when `siteMetadata.ogImage.src` exists and
 *   NEXT_PUBLIC_SITE_URL is set (it must resolve to an absolute URL; without
 *   `metadataBase` Next.js would point it at localhost).
 *
 * Next.js replaces `openGraph` and `twitter` wholesale per segment, so the
 * site-level fields are repeated here rather than inherited.
 */
/** The share image for `openGraph.images`, or undefined when it cannot be absolute. */
export function shareImages(): { url: string; width: number; height: number; alt: string }[] | undefined {
  const { ogImage } = siteMetadata;
  if (ogImage.src === null || env.siteUrl === "") return undefined;
  return [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }];
}

export function pageMetadata(route: RouteMetadata): Metadata {
  const isDefaultTitle = route.title === siteMetadata.defaultTitle;
  const fullTitle = isDefaultTitle
    ? route.title
    : siteMetadata.titleTemplate.replace("%s", route.title);
  const hasSiteUrl = env.siteUrl !== "";
  const images = shareImages();

  return {
    title: isDefaultTitle ? { absolute: route.title } : route.title,
    description: route.description,
    robots: route === routeMetadata.notFound ? null : { index: route.index, follow: true },
    ...(hasSiteUrl && route.index ? { alternates: { canonical: route.path } } : {}),
    openGraph: {
      type: "website",
      locale: siteMetadata.locale,
      siteName: siteMetadata.siteName,
      title: fullTitle,
      description: route.description,
      ...(hasSiteUrl ? { url: route.path } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: fullTitle,
      description: route.description,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
  };
}
