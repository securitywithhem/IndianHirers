import Image from "next/image";
import type { Product } from "@/content/products";
import { env } from "@/lib/env";

interface ProductTileProps {
  product: Product;
  /** Tiles in the first row load eagerly; the rest stay lazy. */
  priority?: boolean;
}

export function ProductTile({ product, priority = false }: ProductTileProps) {
  const message = `Hi, I'd like to check availability for ${product.name}.`;

  return (
    <a
      href={`https://wa.me/${env.whatsapp}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl bg-surface-2 border border-border overflow-hidden transition-shadow duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          priority={priority}
          placeholder="blur"
          blurDataURL={product.image.blurDataURL}
          className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="px-4 py-3">
        <h3 className="font-heading text-base text-cream leading-snug">
          {product.name}
        </h3>
        <span className="font-body text-xs text-cream/60 mt-1 inline-block transition-colors duration-200 group-hover:text-gold-light">
          Check availability →
        </span>
      </div>
    </a>
  );
}
