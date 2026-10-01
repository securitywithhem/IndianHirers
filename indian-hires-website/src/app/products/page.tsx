import type { Metadata } from "next";
import { CategoryCard } from "@/components/products/CategoryCard";
import { allProducts, productCategories } from "@/content/products";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Crockery, Glassware & Chafing Dish Rental — IndianHirers",
  description:
    "Bone china, melamine, glassware and chafing dishes available for hire across Vadodara and Gujarat. Browse the range and check availability on WhatsApp.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">
          What We Rent
        </h1>
        <p className="font-body text-lg text-cream/70 max-w-2xl mx-auto">
          {allProducts.length} designs across {productCategories.length}{" "}
          categories, kept in banquet quantities and delivered ready to lay.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {productCategories.map((category, i) => (
          // Mobile is single-column, so only the first card is above the fold.
          // Preloading all four would compete with it for bandwidth on 3G.
          <CategoryCard
            key={category.slug}
            category={category}
            priority={i === 0}
          />
        ))}
      </div>

      <p className="font-body text-sm text-cream/60 text-center mt-12 max-w-xl mx-auto">
        Quantities and rates depend on your dates and guest count.{" "}
        <a
          href={`https://wa.me/${env.whatsapp}?text=${encodeURIComponent(
            "Hi, I'd like a quote for crockery rental."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cream font-medium underline underline-offset-4 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
        >
          Message us on WhatsApp
        </a>{" "}
        and we&apos;ll come back to you the same day.
      </p>
    </section>
  );
}
