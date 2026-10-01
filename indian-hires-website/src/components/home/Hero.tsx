import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { homeContent } from "@/content/home";

/**
 * The one dark band at the top of an otherwise ivory page. Oxblood, not black:
 * the wash is built on the logo's own hue, so the china reads as lit by the
 * brand rather than sitting on a neutral backdrop.
 *
 * The china sits right, the lockup sits left in genuine negative space. The
 * photograph is a lit surface, never content competing with the headline.
 */
export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center -mt-20 overflow-hidden bg-maroon-deep text-cream">
      <Image
        src="/images/brand/hero-backdrop.webp"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center] lg:object-right z-0"
      />

      {/* Directional oxblood wash: near-opaque where the type sits, opening up
          across the frame so the gilt rims keep their glow. Heavier below lg,
          where the crop pushes the china behind the copy. */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-r from-maroon-deep from-15% via-maroon-deep/85 via-45% to-maroon-deep/20 max-lg:from-maroon-deep/95 max-lg:via-maroon-deep/85 max-lg:to-maroon-deep/60"
      />
      {/* A touch of the brighter brand red low in the frame, so the band reads
          as oxblood rather than brown. */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-t from-maroon/40 via-transparent to-transparent"
      />
      {/* Grain — breaks the digital flatness of a large flat gradient. */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-20 w-full">
        <div className="container mx-auto px-6 md:px-8 pt-32 pb-20">
          <div className="max-w-2xl">
            <p className="font-body text-[11px] md:text-xs uppercase tracking-[0.3em] text-gold">
              {hero.eyebrow}
            </p>
            <div
              aria-hidden
              className="mt-5 h-px w-14 bg-gradient-to-r from-gold to-gold/0"
            />

            <h1 className="font-heading text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.03] tracking-[-0.02em] mt-7 text-balance">
              {hero.headline}
            </h1>

            <p className="font-body text-base md:text-lg text-cream/75 leading-relaxed mt-6 max-w-[46ch]">
              {hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <a
                href={hero.ctaPrimary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 rounded-full bg-gold text-maroon-deep font-body text-sm font-semibold shadow-[0_10px_34px_-10px_rgba(201,162,39,0.6)] transition-transform duration-200 ease-out active:scale-[0.97] motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-maroon-deep"
              >
                <MessageCircle className="w-[18px] h-[18px]" aria-hidden />
                {hero.ctaPrimary.label}
              </a>
              <Link
                href={hero.ctaSecondary.href}
                className="group inline-flex items-center justify-center gap-2 min-h-[48px] px-7 rounded-full border border-cream/30 text-cream font-body text-sm font-medium transition-colors duration-200 ease-out active:scale-[0.97] hover:border-cream/70 hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/70 focus-visible:ring-offset-2 focus-visible:ring-offset-maroon-deep"
              >
                {hero.ctaSecondary.label}
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
