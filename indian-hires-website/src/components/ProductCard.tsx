"use client";

import Image from "next/image";
import { Product } from "@/content/products";
import { toast } from "sonner";
import { env } from "@/lib/env";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <div 
      className="bg-white shadow-md rounded-2xl overflow-hidden"
      data-aos="zoom-in"
      data-aos-delay={index * 80}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h2 className="font-heading text-xl text-maroon">{product.name}</h2>
        <p className="font-body text-sm text-foreground/70 mt-1">{product.description}</p>
        <button
          onClick={() => {
            toast("Full catalogue coming soon", {
              description: "Chat with us to see our complete range.",
              action: {
                label: "WhatsApp Us",
                onClick: () => {
                  const message = `Hi, I'm interested in your ${product.name} — can you share more details?`;
                  window.open(`https://wa.me/${env.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
                }
              }
            });
          }}
          className="bg-gold text-white rounded-full px-5 py-2 text-sm font-medium hover:scale-105 transition-transform mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:ring-offset-2"
          aria-label={`View items in ${product.name}`}
        >
          View Items
        </button>
      </div>
    </div>
  );
}
