import { ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { PageHero } from "@/components/shared/PageHero";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { testimonials, testimonialsPage } from "@/content/testimonials";
import { TestimonialCard } from "./TestimonialCard";

const HERO_HEADING_ID = "testimonials-heading";
const CTA_HEADING_ID = "testimonials-cta-heading";

/**
 * /testimonials once the owner has supplied real, attributed testimonials
 * (`testimonials` in src/content/testimonials.ts). Not rendered while that
 * list is empty — see `TestimonialsEmpty`.
 */
export function TestimonialsList() {
  const { eyebrow, heading, lead, cta, attributionSeparator } = testimonialsPage;

  return (
    <>
      <PageHero eyebrow={eyebrow} heading={heading} lead={lead} headingId={HERO_HEADING_ID} />

      <Band tone="ivory" linen aria-labelledby={HERO_HEADING_ID}>
        <Stagger as="ul" className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <StaggerItem as="li" key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} separator={attributionSeparator} />
            </StaggerItem>
          ))}
        </Stagger>
      </Band>

      <Band tone="maroon" glow aria-labelledby={CTA_HEADING_ID}>
        <Reveal className="flex flex-col items-center gap-8">
          <SectionHeading as="h2" id={CTA_HEADING_ID} tone="dark" align="center" heading={cta.heading} />
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-6">
            <WhatsAppButton
              message={cta.whatsappMessage}
              label={cta.whatsappLabel}
              className="w-full sm:w-auto"
            />
            <ButtonLink href={cta.link.href} variant="link">
              {cta.link.label}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </Band>
    </>
  );
}
