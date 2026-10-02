import { ArrowRight } from "lucide-react";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { CallButton } from "@/components/shared/CallButton";
import { PageHero } from "@/components/shared/PageHero";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { testimonialsPage } from "@/content/testimonials";

/**
 * /testimonials while no testimonial has been supplied: the page says so, and
 * offers the family instead. Nothing here is, or looks like, a customer's
 * words.
 */
export function TestimonialsEmpty() {
  const { eyebrow, empty } = testimonialsPage;

  return (
    <>
      <PageHero eyebrow={eyebrow} heading={empty.heading} />

      <Band tone="ivory" linen innerClassName="flex flex-col items-center gap-10 text-center">
        <div className="flex max-w-measure-tight flex-col items-center gap-5">
          {empty.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={index === 0 ? "type-lead text-foreground" : "type-body text-muted-foreground"}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex w-full flex-col items-center gap-3 sm:w-auto">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <WhatsAppButton message={empty.whatsappMessage} label={empty.whatsappLabel} />
            <CallButton label={empty.callLabel} />
          </div>
          <ButtonLink href={empty.link.href} variant="link">
            {empty.link.label}
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </Band>
    </>
  );
}
