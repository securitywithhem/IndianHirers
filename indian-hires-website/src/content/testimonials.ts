/**
 * Testimonials (`/testimonials`, and the home page section).
 *
 * THE LIST IS EMPTY ON PURPOSE, and it lives in `./testimonialList.ts` (a
 * module with no imports, so `site.ts` can read `hasTestimonials` without a
 * circular import). Add testimonials THERE. This file re-exports the list
 * and holds the page copy.
 *
 * While the list is empty:
 * - the home page testimonials section renders nothing;
 * - the header, drawer and footer do not link to /testimonials
 *   (site.ts → `mainNav`, `footerNav`);
 * - /testimonials still exists, shows `testimonialsPage.empty` — an honest
 *   invitation to speak to the family — and is not indexed
 *   (site.ts → routeMetadata, derived from `hasTestimonials`).
 */
import { brand, routes, whatsappMessages, type CtaLink } from "./site";
import { testimonials } from "./testimonialList";

export { hasTestimonials, testimonials } from "./testimonialList";
export type { Testimonial } from "./testimonialList";

export interface ProcessStep {
  title: string;
  description: string;
}

export interface TestimonialsEmptyState {
  heading: string;
  paragraphs: string[];
  whatsappLabel: string;
  whatsappMessage: string;
  callLabel: string;
  link: CtaLink;
}

export interface TestimonialsPageContent {
  eyebrow: string;
  /** Page h1 when there are testimonials to show. */
  heading: string;
  lead: string;
  empty: TestimonialsEmptyState;
  
  processHeading: string;
  processLead: string;
  processSteps: ProcessStep[];

  cta: {
    heading: string;
    whatsappLabel: string;
    whatsappMessage: string;
    link: CtaLink;
  };
  attributionSeparator: string;
}

export const testimonialsPage: TestimonialsPageContent = {
  eyebrow: "Testimonials",
  heading: "What our customers say",
  lead: "In the words of the hotels, caterers and planners who hire from us.",
  empty: {
    heading: "We would rather you asked us directly",
    paragraphs: [
      "We have not published any testimonials yet. When we do, each one will carry the name of the customer who gave it — we will not fill this page with words nobody said.",
      "If you want to know how we work, speak to the family. Call or message us and ask whatever you need to.",
    ],
    whatsappLabel: "Message us on WhatsApp",
    whatsappMessage: whatsappMessages.speakToFamily(),
    callLabel: "Call us",
    link: { label: "See the collections", href: routes.collections },
  },
  processHeading: "How we work",
  processLead: "Our commitment to quality, timing, and hygiene is what builds trust with the industry's best.",
  processSteps: [
    {
      title: "Pristine Cleaning & Hygiene",
      description: "Every piece of crockery, glassware, and cutlery is washed, sanitized, and polished before it ever reaches your venue. We maintain hotel-grade hygiene standards so your setup is spotless.",
    },
    {
      title: "Careful Handling & Packaging",
      description: "Tableware is fragile, but our handling is precise. We use custom-padded crates and secure packaging to ensure zero chipping or breakage during transit.",
    },
    {
      title: "Punctual Delivery",
      description: "In the events industry, time is everything. We coordinate closely with planners and venues to ensure your items arrive exactly when you need them, ready for setup.",
    },
    {
      title: "Seamless Support",
      description: "From last-minute additions to quick replacements, we stand by you throughout the event to ensure everything goes off without a hitch.",
    }
  ],
  cta: {
    heading: "Planning an event?",
    whatsappLabel: "Enquire on WhatsApp",
    whatsappMessage: whatsappMessages.general(),
    link: { label: "See the collections", href: routes.collections },
  },
  attributionSeparator: ", ",
};

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

export interface ReviewJsonLd {
  "@type": "Review";
  author: { "@type": "Person"; name: string };
  reviewBody: string;
}

export interface TestimonialsJsonLd {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  review: ReviewJsonLd[];
}

/**
 * schema.org reviews for /testimonials, built from the real list. Returns
 * null while the list is empty, so no structured data is emitted for reviews
 * that do not exist. No rating is given: the customers gave words, not stars.
 */
export function testimonialsJsonLd(): TestimonialsJsonLd | null {
  if (testimonials.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brand.name,
    review: testimonials.map((testimonial) => ({
      "@type": "Review",
      author: { "@type": "Person", name: testimonial.name },
      reviewBody: testimonial.quote,
    })),
  };
}
