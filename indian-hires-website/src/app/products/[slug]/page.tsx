import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTile } from "@/components/products/ProductTile";
import { getProductCategory, productCategories } from "@/content/products";
import { env } from "@/lib/env";

interface CategoryPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getProductCategory(params.slug);
  if (!category) return {};

  return {
    title: `${category.name} Rental — ${category.tagline}`,
    description: category.description,
    alternates: { canonical: `/products/${category.slug}` },
    openGraph: {
      title: `${category.name} Rental — IndianHirers`,
      description: category.description,
      // Categories awaiting photography fall back to the brand mark.
      images: [
        category.cover
          ? { url: category.cover.src, alt: category.cover.alt }
          : { url: "/images/brand/logo.webp", alt: "Indian Hirers" },
      ],
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getProductCategory(params.slug);
  if (!category) notFound();

  const message = `Hi, I'd like to enquire about your ${category.name} range.`;

  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/products"
          className="font-body text-sm text-cream/60 hover:text-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
        >
          ← All categories
        </Link>
      </nav>

      <div className="max-w-2xl mb-12">
        <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">
          {category.name}
        </h1>
        <p className="font-body text-lg text-cream/70">{category.description}</p>
      </div>

      {category.products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {category.products.map((product, i) => (
            // Two columns on mobile, so the first row is the first two tiles.
            <ProductTile key={product.slug} product={product} priority={i < 2} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gold/30 bg-surface-2 px-6 py-12 text-center">
          <p className="font-heading text-xl text-cream">
            We&apos;re photographing this range now
          </p>
          <p className="font-body text-sm text-cream/70 mt-2 max-w-md mx-auto">
            The stock is in. Message us and we&apos;ll send photographs of the
            pieces we hold, along with quantities for your date.
          </p>
        </div>
      )}

      <div className="mt-14 rounded-2xl bg-maroon px-6 py-10 text-center">
        <h2 className="font-heading text-2xl md:text-3xl text-white">
          Need {category.name.toLowerCase()} for a date?
        </h2>
        <p className="font-body text-sm text-white/80 mt-2 max-w-md mx-auto">
          Tell us your guest count and event date — we&apos;ll confirm what we
          can hold for you.
        </p>
        <a
          href={`https://wa.me/${env.whatsapp}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center mt-6 min-h-[44px] rounded-full bg-gold px-7 py-3 font-body text-sm font-semibold text-maroon-deep transition-transform duration-200 motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-maroon"
        >
          Enquire on WhatsApp
        </a>
      </div>
    </section>
  );
}
