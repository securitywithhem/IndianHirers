import { pageMetadata } from "@/components/shared/pageMetadata";
import { TestimonialsEmpty } from "@/components/testimonials/TestimonialsEmpty";
import { TestimonialsList } from "@/components/testimonials/TestimonialsList";
import { routeMetadata } from "@/content/site";
import { hasTestimonials } from "@/content/testimonials";

/* `index: false` in routeMetadata while the list is empty → `noindex, follow`. */
export const metadata = pageMetadata(routeMetadata["/testimonials"]);

export default function TestimonialsPage() {
  return hasTestimonials ? <TestimonialsList /> : <TestimonialsEmpty />;
}
