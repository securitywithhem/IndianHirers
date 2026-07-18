import { Metadata } from "next";
import TestimonialCard from "@/components/TestimonialCard";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Hear from hotel managers and caterers who trust Indian Hires for reliable, premium event rentals.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <main>
      <section aria-label="Client testimonials" className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-maroon mb-4">
            What Our Clients Say
          </h1>
          <p className="font-body text-lg text-foreground/70 max-w-2xl mx-auto">
            Trusted by hotels, caterers, and event planners for over 25 years.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index} 
              aosDelay={(index % 3) * 100}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
