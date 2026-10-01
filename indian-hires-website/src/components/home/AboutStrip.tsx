import Link from "next/link";
import { homeContent } from "@/content/home";

export function AboutStrip() {
  return (
    <section className="py-16 md:py-24 bg-background text-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl text-cream mb-6">
          {homeContent.about.heading}
        </h2>
        <p className="font-body text-lg text-cream/80 leading-relaxed mb-8">
          {homeContent.about.body}
        </p>
        <Link 
          href="/founders"
          className="inline-block border border-gold/50 text-cream rounded-full px-6 py-2 hover:bg-maroon hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
        >
          Read Our Story
        </Link>
      </div>
    </section>
  );
}
