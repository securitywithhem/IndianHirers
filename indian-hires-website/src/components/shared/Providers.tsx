"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
