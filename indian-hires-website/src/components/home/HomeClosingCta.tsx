import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { CallButton } from "@/components/shared/CallButton";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { home } from "@/content/home";

const HEADING_ID = "home-cta-heading";

/**
 * The closing maroon band: one question, and the two ways to answer it. It
 * meets the footer directly (§5.2). The numbers come from `env` through the
 * shared buttons.
 *
 * A gold-gradient hairline closes the band above; the one below it is the
 * footer's own top edge.
 */
export function HomeClosingCta() {
  const { closingCta } = home;

  return (
    <Band tone="maroon" glow aria-labelledby={HEADING_ID}>
      {/* Positioned against the band (the shell is not a positioned box). */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
      <Reveal className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading
            as="h2"
            id={HEADING_ID}
            tone="dark"
            align="center"
            heading={closingCta.heading}
          />
          <p className="type-lead max-w-measure-tight text-muted-foreground">{closingCta.body}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <WhatsAppButton message={closingCta.whatsapp.message} label={closingCta.whatsapp.label} />
          <CallButton label={closingCta.callLabel} />
        </div>
      </Reveal>
    </Band>
  );
}
