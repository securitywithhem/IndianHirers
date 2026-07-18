"use client";

import Link from "next/link";
import { Phone, MessageCircle, Send } from "lucide-react";
import { env } from "@/lib/env";

export function MobileBottomBar() {
  return (
    <nav 
      aria-label="Mobile Bottom Bar"
      className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white border-t border-maroon/10 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-3 divide-x divide-maroon/10">
        {/* Segment 1: Call */}
        <a
          href={`tel:${env.phone}`}
          aria-label="Call"
          className="flex flex-col items-center justify-center py-2.5 gap-0.5 text-maroon hover:bg-maroon/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:z-10"
        >
          <Phone className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          <span className="text-[11px] font-body font-medium">Call</span>
        </a>

        {/* Segment 2: WhatsApp */}
        <a
          href={`https://wa.me/${env.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20crockery%20rental%20for%20my%20event.`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex flex-col items-center justify-center py-2.5 gap-0.5 text-whatsapp hover:bg-whatsapp/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:z-10"
        >
          <MessageCircle className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          <span className="text-[11px] font-body font-medium">WhatsApp</span>
        </a>

        {/* Segment 3: Enquire */}
        <Link
          href="/contact"
          aria-label="Enquire"
          className="flex flex-col items-center justify-center py-2.5 gap-0.5 text-gold-text hover:bg-gold/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:z-10"
        >
          <Send className="w-5 h-5 md:w-[22px] md:h-[22px]" />
          <span className="text-[11px] font-body font-medium">Enquire</span>
        </Link>
      </div>
    </nav>
  );
}
