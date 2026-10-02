import { Crown } from "@/components/ornament";
import type { Testimonial } from "@/content/testimonials";

export interface TestimonialCardProps {
  testimonial: Testimonial;
  /** Joins role and organisation, from `testimonialsPage.attributionSeparator`. */
  separator: string;
}

/**
 * One customer's words, exactly as given, with the name they agreed to be
 * credited by. A real quotation, so it is a `<blockquote>` inside a
 * `<figure>`; the attribution is the `<figcaption>`. Parts the customer left
 * out (role, organisation, city) are simply not rendered.
 */
export function TestimonialCard({ testimonial, separator }: TestimonialCardProps) {
  const { quote, name, role, organisation, city } = testimonial;
  const position = [role, organisation].filter((part): part is string => part !== null).join(separator);

  return (
    <figure className="flex h-full flex-col gap-6 rounded-card border border-hairline/40 bg-card p-6 text-card-foreground shadow-card md:p-8">
      <Crown className="h-6 text-hairline" />
      <blockquote className="flex-1">
        <p className="type-lead max-w-measure text-foreground">{quote}</p>
      </blockquote>
      <figcaption className="flex flex-col gap-1 border-t border-hairline/40 pt-4">
        <span className="type-h4 text-heading">{name}</span>
        {position === "" ? null : <span className="type-small text-muted-foreground">{position}</span>}
        {city === null ? null : <span className="type-caption text-muted-foreground">{city}</span>}
      </figcaption>
    </figure>
  );
}
