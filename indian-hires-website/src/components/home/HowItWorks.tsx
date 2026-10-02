import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { home } from "@/content/home";

const HEADING_ID = "home-how-heading";

/**
 * How hiring works, in three steps. An ordered list: the large numeral is
 * decoration, the step's number is read from `stepLabel`.
 */
export function HowItWorks() {
  const { howItWorks } = home;

  return (
    <Band tone="ivory" aria-labelledby={HEADING_ID}>
      <Reveal className="flex flex-col items-center">
        <SectionHeading
          as="h2"
          id={HEADING_ID}
          align="center"
          eyebrow={howItWorks.eyebrow}
          heading={howItWorks.heading}
        />
      </Reveal>

      <Stagger as="ol" className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-6 lg:gap-8">
        {howItWorks.steps.map((step, index) => (
          <StaggerItem
            as="li"
            key={step.id}
            className="flex flex-col gap-3 border-t border-hairline/40 pt-6"
          >
            <p>
              <span aria-hidden="true" className="type-stat text-kicker">
                {index + 1}
              </span>
              <span className="sr-only">{howItWorks.stepLabel(index + 1)}</span>
            </p>
            <h3 className="type-h3 text-heading">{step.title}</h3>
            <p className="type-body max-w-measure-tight text-muted-foreground">{step.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Band>
  );
}
