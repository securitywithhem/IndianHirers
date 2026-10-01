"use client";

import { MessageCircle } from "lucide-react";
import { env } from "@/lib/env";

export function FloatingWhatsApp() {
  return (
    <div
      // Z-index ordering: Header (z-50) > FloatingWhatsApp & MobileBottomBar (z-40)
      // This ensures that when the Header's mobile drawer opens, it sits above this component.
      className="hidden md:flex fixed bottom-6 right-6 z-40"
    >
      <a
        href={`https://wa.me/${env.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20crockery%20rental%20for%20my%20event.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with IndianHirers"
        title="Chat with IndianHirers"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-whatsapp shadow-lg hover:scale-110 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        {/* Pulse Animation Ring */}
        <span className="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-75" />
        
        {/* Icon (Foreground) */}
        <MessageCircle className="relative z-10 w-7 h-7 text-white" />
      </a>
    </div>
  );
}
