/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    // No remotePatterns: every image is now a local asset under /public.
    // The placehold.co allowance is gone along with the last placeholder.
  },
  compress: true,
};

export default nextConfig;
