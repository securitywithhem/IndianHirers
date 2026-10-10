import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { PageHero } from "@/components/shared/PageHero";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { TestimonialsEmpty } from "@/components/testimonials/TestimonialsEmpty";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { routeMetadata } from "@/content/site";
import { testimonials, testimonialsJsonLd, testimonialsPage, hasTestimonials } from "@/content/testimonials";

export const metadata = pageMetadata(routeMetadata["/testimonials"]);

const HERO_HEADING_ID = "testimonials-heading";
const PROCESS_HEADING_ID = "process-heading";
const CTA_HEADING_ID = "testimonials-cta-heading";

export default function TestimonialsPage() {
  const { eyebrow, heading, lead, cta, attributionSeparator, processHeading, processLead, processSteps } = testimonialsPage;
  const jsonLd = testimonialsJsonLd();

  return (
    <>
      {jsonLd === null ? null : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      
      {/* Testimonials Section */}
      {hasTestimonials ? (
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
        </>
      ) : (
        <TestimonialsEmpty />
      )}

      {/* How We Work Section */}
      <Band tone="maroon" aria-labelledby={PROCESS_HEADING_ID}>
        <div className="flex flex-col gap-12 lg:gap-16">
          <Reveal className="flex flex-col items-center gap-4 text-center max-w-measure mx-auto">
            <SectionHeading as="h2" id={PROCESS_HEADING_ID} tone="dark" align="center" heading={processHeading} />
            <p className="type-lead text-maroon-100/90">{processLead}</p>
          </Reveal>

          <Stagger as="ul" className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {processSteps.map((step, i) => (
              <StaggerItem as="li" key={i} className="flex h-full flex-col gap-3 p-6 sm:p-8 rounded-sm bg-maroon-900/50 border border-maroon-800">
                <div className="flex items-center gap-3 text-gold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="type-h4 text-ivory">{step.title}</h3>
                </div>
                <p className="type-body text-maroon-200">{step.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Band>

      {/* CTA Section */}
      <Band tone="ivory" aria-labelledby={CTA_HEADING_ID}>
        <Reveal className="flex flex-col items-center gap-8">
          <SectionHeading as="h2" id={CTA_HEADING_ID} tone="light" align="center" heading={cta.heading} />
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
