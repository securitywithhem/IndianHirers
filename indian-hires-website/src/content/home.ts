import { env } from "@/lib/env";
import { allProducts, productCategories } from "./products";

export const homeContent = {
  hero: {
    // Both dates, deliberately. The family has been in service since 1977;
    // Vadodara is the 25-year chapter. The old headline claimed only the 25.
    eyebrow: "Since 1977 · Vadodara since 2001",
    headline: "Since 1977, one family has laid the table.",
    subheadline: "From a very small shop in Malad to banquet halls across Gujarat — three generations of crockery, glassware and service-ware, and the quiet certainty that everything arrives spotless and on time.",
    ctaPrimary: { label: "Enquire on WhatsApp", href: `https://wa.me/${env.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20crockery%20rental%20for%20my%20event.` },
    ctaSecondary: { label: "See what we rent", href: `/products` },
    imageAlt: "Elegantly set banquet table with premium crockery and cutlery",
  },
  // Facts the business can stand behind, in place of the old badges — which
  // repeated the 25 years and presented a GST number as an achievement.
  ledger: [
    { id: "origin", value: "1977", label: "Where it began, in Malad" },
    { id: "generations", value: "Three", label: "Generations of the family" },
    { id: "vadodara", value: "25 years", label: "Serving Vadodara" },
    // Derived, never hand-typed — a claim about stock must not be able to drift
    // out of step with the catalogue it describes.
    {
      id: "designs",
      value: `${allProducts.length}`,
      label: `Designs across ${productCategories.length} collections`,
    },
  ],
  // Category cards read from `productCategories` in ./products.ts so the
  // homepage and /products can never drift apart.
  showcase: {
    eyebrow: "The Range",
    heading: "Four categories, banquet quantities",
    body: "Everything below is stock we hold and deliver ourselves.",
    link: { label: "See the full range", href: "/products" },
  },
  finale: {
    tagline: "An Occasion With Dignity",
    body: "Serving Vadodara since 2001.",
    logoAlt: "IH Gabhawalas — Indian Hirers crest",
  },
  about: {
    heading: "Why IndianHirers",
    body: "We're not a retailer, and we're not event planners — we're the rental partner hotels and caterers count on to keep their events running smoothly. Since 2001, that's meant one thing: showing up with the right crockery, cutlery, and equipment, in the right quantity, every single time.",
  },
  closingCta: {
    heading: "Planning an Event? Let's Talk.",
    body: "Get a quote in minutes — no forms, no waiting. Reach us directly on WhatsApp or call.",
    whatsappButton: "WhatsApp Us",
    callButton: "Call +91 98250 37478",
  }
};
