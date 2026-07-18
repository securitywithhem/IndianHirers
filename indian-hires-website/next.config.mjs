/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  compress: true,
};

export default nextConfig;
