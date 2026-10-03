import { DrawLine, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { home } from "@/content/home";

const HEADING_ID = "home-how-heading";

/**
 * How hiring works, in three steps. An ordered list: the large numeral is
 * decoration, the step's number is read from `stepLabel`.
 *
 * From `md` one gold line runs through the three steps and is drawn from the
 * first to the last when the row scrolls in (`scaleX`, once; simply there
 * under reduced motion). A gold bead marks where each step starts; the beads
 * are still and sit on the line, in a grid that mirrors the list's columns.
 * Below `md` the steps stack and each keeps its own rule.
 *
 * From `md` a title keeps room for two lines, so the three bodies start level.
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

      <div className="relative mt-10 md:mt-14">
        {/* Outside the list, so the <ol> holds list items only. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden md:block">
          <DrawLine lineClassName="origin-left" />
          <div className="absolute inset-x-0 top-0 grid grid-cols-3 gap-6 lg:gap-8">
            {howItWorks.steps.map((step) => (
              <span key={step.id} className="size-2 -translate-y-1/2 rounded-full bg-hairline" />
            ))}
          </div>
        </div>

        <Stagger as="ol" className="grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          {howItWorks.steps.map((step, index) => (
            <StaggerItem
              as="li"
              key={step.id}
              className="flex flex-col gap-3 border-t border-hairline/40 pt-6 md:border-t-0 md:pt-8"
            >
              <p>
                <span aria-hidden="true" className="type-stat text-kicker">
                  {index + 1}
                </span>
                <span className="sr-only">{howItWorks.stepLabel(index + 1)}</span>
              </p>
              <h3 className="type-h3 text-heading md:min-h-[2.4em]">{step.title}</h3>
              <p className="type-body max-w-measure-tight text-muted-foreground">{step.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Band>
  );
}
