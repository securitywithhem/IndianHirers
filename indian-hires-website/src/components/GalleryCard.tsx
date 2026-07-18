"use client";

import Image from "next/image";
import { GalleryItem } from "@/content/gallery";

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
}

export default function GalleryCard({ item, index }: GalleryCardProps) {
  return (
    <div
      className="break-inside-avoid mb-4 md:mb-6"
      data-aos="fade-up"
      data-aos-delay={(index % 4) * 100}
    >
      <button 
        className="w-full text-left relative rounded-2xl overflow-hidden shadow-md group cursor-pointer focus:outline-none focus:ring-2 focus:ring-maroon"
        aria-label={item.caption}
      >
        <Image
          src={item.imageUrl}
          alt={item.caption}
          width={item.width}
          height={item.height}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div>
            <span className="block text-gold text-xs uppercase tracking-wide mb-1">
              {item.eventType}
            </span>
            <p className="text-white font-body text-sm font-medium">
              {item.caption}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
