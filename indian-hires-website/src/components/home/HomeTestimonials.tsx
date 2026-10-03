import { ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { home } from "@/content/home";
import { hasTestimonials, testimonials, testimonialsPage, type Testimonial } from "@/content/testimonials";

const HEADING_ID = "home-testimonials-heading";

/** How many the home page shows; the rest are on /testimonials. */
const SHOWN = 3;

/** "Role, Organisation, City" — only the parts the customer gave. */
function attribution(testimonial: Testimonial): string {
  return [testimonial.role, testimonial.organisation, testimonial.city]
    .filter((part): part is string => part !== null && part.length > 0)
    .join(testimonialsPage.attributionSeparator);
}

/**
 * What customers say — in their words, with their names. Renders NOTHING
 * while `testimonials` is empty: the business has published none, and none
 * may be invented (see src/content/testimonials.ts).
 */
export function HomeTestimonials() {
  if (!hasTestimonials) return null;

  const copy = home.testimonials;

  return (
    <Band tone="ivory-alt" aria-labelledby={HEADING_ID} innerClassName="flex flex-col items-center">
      <Reveal>
        <SectionHeading
          as="h2"
          id={HEADING_ID}
          align="center"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
        />
      </Reveal>

      <Stagger as="ul" className="mt-10 grid w-full gap-4 md:mt-14 md:grid-cols-3 md:gap-6 lg:gap-8">
        {testimonials.slice(0, SHOWN).map((testimonial) => {
          const credit = attribution(testimonial);

          return (
            <StaggerItem as="li" key={testimonial.id}>
              <figure className="flex h-full flex-col gap-5 border-l-2 border-hairline pl-5 md:pl-6">
                <blockquote className="type-lead grow text-foreground">
                  <p>{testimonial.quote}</p>
                </blockquote>
                <figcaption className="flex flex-col gap-1">
                  <span className="type-h4 text-heading">{testimonial.name}</span>
                  {credit ? <span className="type-small text-muted-foreground">{credit}</span> : null}
                </figcaption>
              </figure>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal y={16} className="mt-10 md:mt-14">
        <ButtonLink href={copy.link.href} variant="link">
          {copy.link.label}
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </Reveal>
    </Band>
  );
}
