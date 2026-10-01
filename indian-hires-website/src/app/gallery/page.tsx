import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/products/CategoryCard";
import { productCategories } from "@/content/products";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Event Gallery — IndianHirers",
  description:
    "Photographs from real events styled with IndianHirers crockery and equipment.",
  alternates: { canonical: "/gallery" },
  // Nothing worth indexing until real event photography lands. Remove this and
  // restore /gallery to src/app/sitemap.ts once the shoot is done.
  robots: { index: false, follow: true },
};

export default function GalleryPage() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">
          Event Gallery
        </h1>
        <p className="font-body text-lg text-cream/70">
          We&apos;re photographing our setups on site through this season, so
          this page is still filling up. In the meantime, the range itself is
          all here.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center min-h-[44px] rounded-full bg-gold px-7 py-3 font-body text-sm font-semibold text-maroon-deep transition-transform duration-200 motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            Browse what we rent
          </Link>
          <a
            href={`https://wa.me/${env.whatsapp}?text=${encodeURIComponent(
              "Hi, could you send photos of your recent event setups?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[44px] rounded-full border border-maroon px-7 py-3 font-body text-sm font-medium text-cream transition-colors duration-200 hover:bg-maroon hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            Ask us for photos
          </a>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {productCategories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
