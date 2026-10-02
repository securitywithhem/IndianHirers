/**
 * The testimonial list itself, and nothing else.
 *
 * This file imports nothing on purpose. `site.ts` needs `hasTestimonials` to
 * decide whether the navigation links to /testimonials, and `testimonials.ts`
 * (the page copy) needs `routes` from `site.ts` — keeping the list in a leaf
 * module is what stops those two from importing each other in a circle.
 *
 * Components keep importing `testimonials`, `hasTestimonials` and
 * `Testimonial` from `./testimonials`, which re-exports them.
 *
 * THE LIST IS EMPTY ON PURPOSE. The earlier site carried testimonials that
 * could not be traced to real customers; they were removed and are not
 * coming back. Nothing may be added here unless the owner supplies the words
 * and the customer has agreed to be named.
 */

export interface Testimonial {
  id: string;
  /** The customer's words, exactly as given. */
  quote: string;
  /** The person's name, as they agreed to be credited. */
  name: string;
  /** Their role, e.g. "Banquet Manager". Null if they prefer it left out. */
  role: string | null;
  /** Hotel, caterer or company. Null for a private customer. */
  organisation: string | null;
  /** City. Null if not given. */
  city: string | null;
}

/**
 * TODO(owner): add real, attributed testimonials. One object per customer:
 *
 *   {
 *     id: "slot-1",
 *     quote: "…the customer's own words…",
 *     name: "…",
 *     role: "…" or null,
 *     organisation: "…" or null,
 *     city: "…" or null,
 *   },
 *
 * Slot 1 — TODO(owner)
 * Slot 2 — TODO(owner)
 * Slot 3 — TODO(owner)
 */
export const testimonials: Testimonial[] = [];

/**
 * True once there is at least one testimonial to show. Derived. It switches
 * on, together: the home page section, the Testimonials link in the header,
 * drawer and footer (site.ts → `mainNav`), and the page's `index` flag
 * (site.ts → `routeMetadata`).
 */
export const hasTestimonials: boolean = testimonials.length > 0;
