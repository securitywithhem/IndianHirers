"use client";

import Image from "next/image";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { homeContent } from "@/content/home";
import { useMotionPreference } from "@/lib/useMotionPreference";

const { finale } = homeContent;

/** Strong ease-out. The built-in CSS curves are too weak to read as intentional. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function Crest({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/images/brand/logo.webp"
      alt={finale.logoAlt}
      width={512}
      height={512}
      priority={priority}
      sizes="(max-width: 768px) 60vw, 380px"
      className="w-full h-full object-contain"
    />
  );
}

function Tagline() {
  return (
    <>
      <p className="font-heading text-2xl md:text-4xl text-gold tracking-[0.18em] uppercase mt-10">
        {finale.tagline}
      </p>
      <p className="font-body text-sm text-cream/70 mt-4">{finale.body}</p>
    </>
  );
}

export function LogoFinale() {
  const reduce = useMotionPreference();

  return (
    <section className="relative w-full bg-maroon-deep overflow-hidden py-24 md:py-32">
      {/* Gold glow. Sits behind the crest and is purely decorative. */}
      <div
        aria-hidden
        className={`absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[620px] aspect-square rounded-full blur-3xl bg-[radial-gradient(circle,_#C5A44E_0%,_transparent_70%)] opacity-40 ${
          reduce ? "" : "animate-glow-pulse"
        }`}
      />

      <div className="relative text-center px-4 max-w-3xl mx-auto">
        {reduce ? (
          <>
            <div className="w-[55vw] max-w-[320px] md:max-w-[380px] aspect-square mx-auto">
              <Crest />
            </div>
            <Tagline />
          </>
        ) : (
          <LazyMotion features={domAnimation} strict>
            {/* Full transform strings, not framer's x/scale shorthands — the
                shorthands run on the main thread and drop frames under load. */}
            <m.div
              className="w-[55vw] max-w-[320px] md:max-w-[380px] aspect-square mx-auto will-change-[transform,opacity]"
              initial={{ opacity: 0, transform: "scale(0.92)" }}
              whileInView={{ opacity: 1, transform: "scale(1)" }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <Crest />
            </m.div>
            <m.div
              initial={{ opacity: 0, transform: "translateY(12px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
            >
              <Tagline />
            </m.div>
          </LazyMotion>
        )}
      </div>
    </section>
  );
}
