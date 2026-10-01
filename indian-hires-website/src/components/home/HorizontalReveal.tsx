"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CategoryCard } from "@/components/products/CategoryCard";
import { ProductTile } from "@/components/products/ProductTile";
import { homeContent } from "@/content/home";
import { allProducts, productCategories } from "@/content/products";
import { useMotionPreference } from "@/lib/useMotionPreference";

gsap.registerPlugin(ScrollTrigger);

const { showcase } = homeContent;

function SectionHeading() {
  return (
    <div className="max-w-xl">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-gold mb-3">
        {showcase.eyebrow}
      </p>
      <h2 className="font-heading text-3xl md:text-4xl text-cream">
        {showcase.heading}
      </h2>
      <p className="font-body text-base text-cream/70 mt-3">{showcase.body}</p>
    </div>
  );
}

function ShowcaseLink() {
  return (
    <Link
      href={showcase.link.href}
      className="font-body text-sm font-medium text-cream underline underline-offset-4 hover:text-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
    >
      {showcase.link.label} →
    </Link>
  );
}

/**
 * Reduced-motion path. A separate component so gsap never runs and no
 * ScrollTrigger is created — the section is a plain vertical grid.
 */
function StackedShowcase() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-surface">
      <SectionHeading />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-10">
        {productCategories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        {allProducts.map((product) => (
          <ProductTile key={product.slug} product={product} />
        ))}
      </div>
      <div className="mt-10">
        <ShowcaseLink />
      </div>
    </section>
  );
}

function PannedShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // gsap.context scopes every tween and ScrollTrigger created inside it, so
    // ctx.revert() on unmount kills them all — no orphaned scroll listeners.
    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        // Linear: scrubbed motion must track the scrollbar 1:1. Any easing here
        // would make the panels lag or lead the user's own scroll.
        ease: "none",
        x: () => -distance(),
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-surface">
      <div className="h-screen flex flex-col justify-center">
        <div className="px-4 md:px-8 max-w-7xl mx-auto w-full shrink-0">
          <SectionHeading />
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 mt-10 px-4 md:px-8 will-change-transform"
        >
          {productCategories.map((category) => (
            <div
              key={category.slug}
              className="w-[70vw] sm:w-[40vw] lg:w-[24vw] shrink-0"
            >
              <CategoryCard category={category} />
            </div>
          ))}
          {/* Every design follows the collections, so the pan reads as the
              full breadth of stock rather than five cover images. */}
          {allProducts.map((product) => (
            <div
              key={`${product.category}-${product.slug}`}
              className="w-[44vw] sm:w-[26vw] lg:w-[15vw] shrink-0"
            >
              <ProductTile product={product} />
            </div>
          ))}
        </div>

        <div className="px-4 md:px-8 max-w-7xl mx-auto w-full mt-10 shrink-0">
          <ShowcaseLink />
        </div>
      </div>
    </section>
  );
}

export function HorizontalReveal() {
  const reduce = useMotionPreference();
  return reduce ? <StackedShowcase /> : <PannedShowcase />;
}
