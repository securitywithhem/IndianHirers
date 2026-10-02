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
import { routes, whatsappMessages, type CtaLink } from "./site";

export { hasTestimonials, testimonials } from "./testimonialList";
export type { Testimonial } from "./testimonialList";

export interface TestimonialsEmptyState {
  heading: string;
  paragraphs: string[];
  whatsappLabel: string;
  whatsappMessage: string;
  /** Generic label; build the href with `telUrl()`. */
  callLabel: string;
  link: CtaLink;
}

export interface TestimonialsPageContent {
  eyebrow: string;
  /** Page h1 when there are testimonials to show. */
  heading: string;
  lead: string;
  /** Shown instead of the list while `testimonials` is empty. */
  empty: TestimonialsEmptyState;
  /** Closing call to action under the list, once there is one. */
  cta: {
    heading: string;
    whatsappLabel: string;
    whatsappMessage: string;
    link: CtaLink;
  };
  /** Joins role and organisation in the attribution line. */
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
  cta: {
    heading: "Planning an event?",
    whatsappLabel: "Enquire on WhatsApp",
    whatsappMessage: whatsappMessages.general(),
    link: { label: "See the collections", href: routes.collections },
  },
  attributionSeparator: ", ",
};
