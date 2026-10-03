import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion";
import { founders, type Milestone } from "@/content/founders";

const HEADING_ID = "founders-milestones-heading";

export interface MilestoneTimelineProps {
  /** Grid placement in the parent. */
  className?: string;
}

/**
 * The dates the story states, in order, on a gold rail. An ordered list: the
 * sequence is the point. Every entry restates the story; nothing here is new.
 * From 1977 in Malad to the third generation joining in Vadodara.
 */
export function MilestoneTimeline({ className }: MilestoneTimelineProps) {
  const { heading } = founders.milestones;
  /* A `todo` entry has no year yet and is not shown (src/content/founders.ts). */
  const items = founders.milestones.items.filter(
    (milestone): milestone is Milestone & { year: number } => milestone.status === "shown" && milestone.year !== null,
  );

  return (
    <section aria-labelledby={HEADING_ID} className={className}>
      {/* Sticks below the fixed header while the story scrolls past (md+). */}
      <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
        <h2 id={HEADING_ID} className="type-h2 text-heading">
          {heading}
        </h2>

        <Stagger as="ol" className="mt-8 flex flex-col">
          {items.map((milestone, index) => {
            const last = index === items.length - 1;

            return (
              <StaggerItem as="li" key={milestone.year} className="grid grid-cols-[0.75rem_1fr] gap-x-5">
                {/* Rail: a gold bead, then the line down to the next one. */}
                <span aria-hidden="true" className="flex flex-col items-center pt-5">
                  <span className="size-3 shrink-0 rounded-full border border-hairline bg-background" />
                  {last ? null : <span className="mt-2 w-px flex-1 bg-hairline/50" />}
                </span>

                <div className={cn("flex flex-col gap-1", !last && "pb-10")}>
                  <p className="type-stat text-heading">
                    <time dateTime={String(milestone.year)}>{milestone.year}</time>
                  </p>
                  <h3 className="type-h4 text-foreground">{milestone.title}</h3>
                  <p className="type-small max-w-measure-tight text-muted-foreground">{milestone.body}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
