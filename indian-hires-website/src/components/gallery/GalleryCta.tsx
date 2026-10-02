import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { gallery } from "@/content/gallery";

const HEADING_ID = "gallery-cta-heading";

/** The closing maroon band: not everything is pictured, so ask. Meets the footer directly (§5.2). */
export function GalleryCta() {
  const { cta } = gallery;

  return (
    <Band tone="maroon" glow aria-labelledby={HEADING_ID}>
      <Reveal className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading as="h2" id={HEADING_ID} tone="dark" align="center" heading={cta.heading} />
          <p className="type-lead max-w-measure-tight text-muted-foreground">{cta.body}</p>
        </div>
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
  );
}
