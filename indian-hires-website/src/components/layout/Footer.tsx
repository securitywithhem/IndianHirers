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
    <footer className="bg-maroon text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10" data-aos="fade-up">
          {/* Column 1: About */}
          <div>
            <h2 className="font-heading text-xl text-gold mb-4">Indian Hires</h2>
            <p className="font-body text-sm text-white/80 leading-relaxed max-w-sm">
              For 25 years, Indian Hires has been the trusted crockery, cutlery, and event‑essentials partner for hotels, caterers, and event planners — bringing every occasion to life with reliability and care.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-lg text-white mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/80 hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-heading text-lg text-white mb-4">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`tel:${env.phone}`}
                  className="flex items-center gap-3 font-body text-sm text-white/80 hover:text-gold transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded w-fit"
                >
                  <Phone className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>{env.phone || "+91 98765 43210"}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${env.email}`}
                  className="flex items-center gap-3 font-body text-sm text-white/80 hover:text-gold transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded w-fit"
                >
                  <Mail className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>{env.email || "info@indianhires.com"}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${env.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20crockery%20rental%20for%20my%20event.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-body text-sm text-white/80 hover:text-gold transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded w-fit"
                >
                  <MessageCircle className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>WhatsApp Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-xs text-white/60 font-body">
          © {new Date().getFullYear()} Indian Hires. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
