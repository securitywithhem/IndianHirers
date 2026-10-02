/**
 * Old catalogue URLs → the collections that replaced them. Declared here so
 * the server answers with a real 308 and a `Location` header; a redirect
 * issued from inside a prerendered page only happens in the browser.
 *
 * The typed source of truth is `legacyRedirects` in
 * src/content/collections.ts (derived from the photo manifest). This file
 * cannot import TypeScript, so the list is repeated — KEEP THE TWO IN STEP.
 * The page-level redirects under src/app/products stay as the fallback.
 */
const legacyRedirects = [
  { source: "/products", destination: "/collections" },
  { source: "/products/vintage", destination: "/collections/heritage-silver" },
  { source: "/products/bone-china", destination: "/collections/bone-china" },
  { source: "/products/melamine", destination: "/collections/premium-melamine" },
  { source: "/products/glassware", destination: "/collections/glassware" },
  { source: "/products/chafing-dishes", destination: "/collections/chafing-dishes" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    // 320 added to Next's defaults: a 2-column card on a phone is ~165–180 CSS px
    // wide, so at 1.75–2x it needs ~320px, and the default list jumps 256 → 384.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 384],
    // No remotePatterns: every image is now a local asset under /public.
    // The placehold.co allowance is gone along with the last placeholder.
  },
  compress: true,
  async redirects() {
    return legacyRedirects.map((redirect) => ({ ...redirect, permanent: true }));
  },
};

export default nextConfig;
