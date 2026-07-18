import { Testimonial } from "@/content/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
  aosOverride?: string;
  aosAnchorPlacement?: string;
  aosDelay?: number;
}

export default function TestimonialCard({ 
  testimonial, 
  index = 0,
  aosOverride,
  aosAnchorPlacement,
  aosDelay
}: TestimonialCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6"
      data-aos={aosOverride || "fade-up"}
      data-aos-delay={aosDelay !== undefined ? aosDelay : index * 100}
      data-aos-anchor-placement={aosAnchorPlacement}
    >
      <blockquote>
        <p className="font-body italic text-foreground/80 text-base leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <footer className="mt-4">
          <cite className="not-italic">
            <span className="block font-heading text-maroon text-lg">
              {testimonial.clientName}
            </span>
            <span className="block font-body text-sm text-foreground/60">
              {testimonial.clientDesignation}
            </span>
          </cite>
        </footer>
      </blockquote>
    </div>
  );
}
