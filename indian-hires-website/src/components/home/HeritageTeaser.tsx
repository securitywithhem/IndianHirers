import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { home } from "@/content/home";

const HEADING_ID = "home-heritage-heading";

/**
 * The short version of the family's story, and the page's one maroon band
 * between the hero and the closing call to action (§5.2). The full account is
 * on /founders — it reads better whole than cut up across the home page.
 */
export function HeritageTeaser() {
  const { heritage } = home;

  return (
    <Band tone="maroon" glow aria-labelledby={HEADING_ID}>
      <Reveal lines className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading
            as="h2"
            id={HEADING_ID}
            tone="dark"
            align="center"
            eyebrow={heritage.eyebrow}
            heading={heritage.heading}
            divider
          />
          {/* Not the heading's `lead`: three sentences need the tighter measure. */}
          <p className="type-lead max-w-measure-tight text-muted-foreground">{heritage.body}</p>
        </div>
        <ButtonLink href={heritage.link.href} variant="link">
          {heritage.link.label}
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </Reveal>
    </Band>
  );
}
