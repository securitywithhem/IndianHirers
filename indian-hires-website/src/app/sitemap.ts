import { MetadataRoute } from "next";
import { productCategories } from "@/content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://indianhirers.com";
  // /gallery and /testimonials are deliberately absent — both are noindex
  // until the real material exists (event photography, and attributed client
  // quotes). Restore each here at the same time as its page.
  const routes = ["", "/founders", "/products", "/contact"];
  const categoryRoutes = productCategories.map((c) => `/products/${c.slug}`);

  return [...routes, ...categoryRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
