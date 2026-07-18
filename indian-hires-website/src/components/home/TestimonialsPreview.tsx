import Link from "next/link";
import TestimonialCard from "@/components/TestimonialCard";
import { testimonials } from "@/content/testimonials";

export function TestimonialsPreview() {
  const featuredTestimonials = testimonials.filter((t) => t.featured);

  return (
    <section aria-label="Client testimonials" className="py-12 md:py-20 bg-background" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl text-maroon text-center mb-10">
          Trusted by the Best
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index}
              aosOverride={index % 2 === 0 ? "fade-right" : "fade-left"}
              aosAnchorPlacement="top-bottom"
            />
          ))}
        </div>
        <div className="text-center mt-12" data-aos="zoom-in">
          <Link 
            href="/testimonials"
            className="inline-block border-2 border-maroon text-maroon rounded-full px-6 py-2 hover:bg-maroon hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-maroon"
          >
            View All Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
}
