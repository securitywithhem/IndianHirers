"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [pathname]);

  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
}
