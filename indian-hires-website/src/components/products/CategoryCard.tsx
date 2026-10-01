import Image from "next/image";
import Link from "next/link";
import type { ProductCategory } from "@/content/products";

interface CategoryCardProps {
  category: ProductCategory;
  /** The first card is above the fold on mobile and loads eagerly. */
  priority?: boolean;
}

export function CategoryCard({ category, priority = false }: CategoryCardProps) {
  const count = category.products.length;

  return (
    <Link
      href={`/products/${category.slug}`}
      className="group block rounded-2xl bg-surface-2 border border-border overflow-hidden transition-shadow duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        {category.cover ? (
          <Image
            src={category.cover.src}
            alt={category.cover.alt}
            fill
            priority={priority}
            placeholder="blur"
            blurDataURL={category.cover.blurDataURL}
            className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          /* Awaiting photography. A composed brand panel rather than a broken
             image or a grey box — the collection is real, the photo isn't yet. */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-maroon text-center px-6">
            <div
              aria-hidden
              className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_35%,_#C5A44E_0%,_transparent_65%)]"
            />
            <Image
              src="/images/brand/logo.webp"
              alt=""
              aria-hidden
              width={96}
              height={96}
              className="relative w-16 h-16 object-contain opacity-90"
            />
            <span className="relative font-body text-[11px] uppercase tracking-[0.22em] text-gold">
              Photography in progress
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-heading text-xl text-cream">{category.name}</h2>
          {category.comingSoon && (
            <span className="shrink-0 mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-gold border border-gold/40 rounded-sm px-2 py-0.5">
              New
            </span>
          )}
        </div>
        <p className="font-body text-sm text-cream/70 mt-1">{category.tagline}</p>
        <p className="font-body text-xs uppercase tracking-wide text-gold mt-3">
          {category.comingSoon
            ? "Enquire for pieces"
            : `${count} ${count === 1 ? "design" : "designs"}`}
        </p>
      </div>
    </Link>
  );
}
