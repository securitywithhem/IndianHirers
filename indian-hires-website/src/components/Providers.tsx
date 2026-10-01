"use client";

import { Toaster } from "@/components/ui/sonner";

/**
 * AOS was removed here. The site had three motion systems running at once —
 * AOS across fourteen files, framer-motion in the crest, gsap in the range —
 * which is a large part of why the page felt like several different websites.
 *
 * Scroll-driven motion is now gsap + ScrollTrigger; discrete entrances are
 * framer-motion. Both gate on src/lib/useMotionPreference.ts.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
