import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { absoluteUrl } from "@/lib/links";

/**
 * Pages that should stay out of search results say so themselves (`noindex`
 * from `routeMetadata`), which only works if crawlers may fetch them — so
 * nothing is disallowed here. The sitemap line appears only when
 * NEXT_PUBLIC_SITE_URL is set; there is no fallback domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(env.siteUrl ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
