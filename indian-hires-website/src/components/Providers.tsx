"use client";

import dynamic from "next/dynamic";

/*
 * The toaster is only ever needed after a visitor submits the enquiry form,
 * so it loads as its own chunk after hydration instead of riding in every
 * route's first-load JavaScript.
 */
const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((module) => module.Toaster),
  { ssr: false }
);

/**
 * Client-side singletons for the whole site. There is deliberately no motion
 * provider here: the shell uses the library-free primitives from
 * `@/components/motion`, and the animation engine is mounted only by the
 * catalogue and gallery (see src/components/motion/README.md).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  );
}
