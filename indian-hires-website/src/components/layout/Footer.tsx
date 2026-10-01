import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { env } from "@/lib/env";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/founders" },
  { label: "What We Rent", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-maroon-deep text-cream py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: About */}
          <div>
            <h2 className="font-heading text-2xl text-gold mb-2">Indian Hirers</h2>
            <p className="text-[11px] tracking-widest text-gold uppercase mb-6">
              An Occasion With Dignity
            </p>
            <div className="font-body text-sm text-cream/80 leading-relaxed space-y-2">
              <p>3-4 Sandalwood Residency,<br />Nr Urmi Char Rasta, Akota,<br />Vadodara – 390020</p>
              <p className="pt-2 text-cream/60 text-xs">GSTIN: 24AABPG5066D1Z8</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-lg text-cream mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/80 hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-heading text-lg text-cream mb-4">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`tel:${env.phone}`}
                  className="flex items-center gap-3 font-body text-sm text-cream/80 hover:text-gold transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded w-fit"
                >
                  <Phone className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>{env.phone || "9825037478 / 8734090908"}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${env.email || "indianhires@gmail.com"}`}
                  className="flex items-center gap-3 font-body text-sm text-cream/80 hover:text-gold transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded w-fit"
                >
                  <Mail className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>{env.email || "indianhires@gmail.com"}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${env.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20crockery%20rental%20for%20my%20event.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-body text-sm text-cream/80 hover:text-gold transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded w-fit"
                >
                  <MessageCircle className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>WhatsApp Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-cream/20 mt-10 pt-6 text-center text-xs text-cream/60 font-body">
          © {new Date().getFullYear()} IndianHirers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
