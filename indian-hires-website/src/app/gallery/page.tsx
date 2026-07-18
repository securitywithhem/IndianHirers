import { Metadata } from "next";
import GalleryCard from "@/components/GalleryCard";
import { galleryItems } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse real event setups styled with Indian Hires crockery and equipment for hotels, weddings, and corporate functions.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <main>
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-maroon mb-4">
            Our Gallery
          </h1>
          <p className="font-body text-lg text-foreground/70 max-w-2xl mx-auto">
            A glimpse into the events we&apos;ve helped bring to life.
          </p>
        </div>
        
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
          {galleryItems.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
