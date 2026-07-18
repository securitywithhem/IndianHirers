import { env } from "@/lib/env";

export const homeContent = {
  hero: {
    headline: "25 Years of Making Every Event Unforgettable",
    subheadline: "Premium crockery, cutlery & event essentials — trusted by hotels, caterers, and hosts across the city.",
    ctaPrimary: { label: "Get a Quote on WhatsApp", href: `https://wa.me/${env.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20crockery%20rental%20for%20my%20event.` },
    ctaSecondary: { label: "Call Us Now", href: `tel:${env.phone}` },
    imageAlt: "Elegantly set banquet table with premium crockery and cutlery",
  },
  trustBadges: [
    { id: "years", value: "25+", label: "Years in Business" },
    { id: "events", value: "10,000+", label: "Events Served" },
    { id: "clients", value: "500+", label: "Hotels & Caterers Trust Us" },
    { id: "response", value: "< 2 hrs", label: "Average Response Time" },
  ],
  categories: [
    { id: "crockery", name: "Crockery Sets", description: "Fine china and modern dinnerware for every occasion.", imageAlt: "Stacked white crockery plates" },
    { id: "cutlery", name: "Cutlery & Silverware", description: "Polished cutlery sets for formal and casual events.", imageAlt: "Silver cutlery set arranged on table" },
    { id: "glassware", name: "Glassware", description: "Crystal-clear glasses for every kind of celebration.", imageAlt: "Rows of clean wine and water glasses" },
    { id: "serving", name: "Serving Essentials", description: "Chafing dishes, trays, and everything for seamless service.", imageAlt: "Chafing dishes set up for buffet service" },
  ],
};
