import { Metadata } from "next";
import Link from "next/link";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "References — IndianHirers",
  description:
    "References from hotel banquet managers and caterers who work with IndianHirers in Vadodara.",
  alternates: { canonical: "/testimonials" },
  // Nothing to index until real, attributed quotes exist. Remove this and
  // restore /testimonials to src/app/sitemap.ts at the same time.
  robots: { index: false, follow: true },
};

export default function TestimonialsPage() {
  return (
    <main>
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
            References
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mt-5 mb-5 text-balance">
            We&apos;d rather name real customers than invent them.
          </h1>
          <p className="font-body text-lg text-cream/70 leading-relaxed">
            We&apos;re collecting written references from the banquet managers
            and caterers we work with across Vadodara. Until those are signed
            off, this page stays empty — we aren&apos;t going to fill it with
            quotes nobody said.
          </p>
          <p className="font-body text-base text-cream/60 leading-relaxed mt-5">
            If you&apos;re considering us and want to speak to an existing
            customer first, just ask — we&apos;ll put you in touch.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <a
              href={`https://wa.me/${env.whatsapp}?text=${encodeURIComponent(
                "Hi, could you put me in touch with a customer I can ask about your service?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] rounded-full bg-gold px-7 py-3 font-body text-sm font-semibold text-maroon-deep transition-transform duration-200 ease-out active:scale-[0.97] motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ask for a reference
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center min-h-[48px] rounded-full border border-cream/30 px-7 py-3 font-body text-sm font-medium text-cream transition-colors duration-200 hover:border-cream/70 hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See what we rent
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
