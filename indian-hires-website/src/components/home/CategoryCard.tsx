"use client";

import Image from "next/image";

interface CategoryCardProps {
  name: string;
  description: string;
  imageAlt: string;
}

export function CategoryCard({ name, description, imageAlt }: CategoryCardProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src="https://placehold.co/600x400/eeeeee/cccccc.png"
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-heading text-xl text-maroon">{name}</h3>
        <p className="font-body text-sm text-text/70 mt-1 flex-grow">{description}</p>
        <button
          onClick={() => alert("Full catalogue coming soon – WhatsApp us!")}
          className="text-left font-body text-sm text-maroon font-medium mt-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded-sm"
        >
          View Items →
        </button>
      </div>
    </div>
  );
}
