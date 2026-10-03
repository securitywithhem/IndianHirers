import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Band } from "@/components/shared/Band";
import { founders } from "@/content/founders";
import { MilestoneTimeline } from "./MilestoneTimeline";

const HEADING_ID = "founders-story-heading";

/**
 * The family's own account, word for word, beside the four dates it names.
 * From `md` the timeline stays in view while the story is read; below that it
 * follows the story.
 *
 * Pull-quotes — excerpts of the story's own words, set large on a gold rule —
 * sit between paragraphs, away from the sentence they repeat. Each repeats words
 * that are in the story, so it is hidden from assistive technology.
 *
 * Outline: the story region's `h2` is visually hidden (the page `h1` already
 * introduces it), its titled chapters are `h3`; the timeline is its own `h2`.
 */
export function FoundersStory() {
  const { story } = founders;

  return (
    <Band as="div" tone="ivory" linen innerClassName="grid gap-14 md:grid-cols-12 md:gap-8">
      {/* The measure is set here, in body-size characters, so the lead and
          the paragraphs under it share one column edge (about 65 characters). */}
      <section aria-labelledby={HEADING_ID} className="flex max-w-measure-tight flex-col gap-12 md:col-span-7 lg:col-span-6">
        <h2 id={HEADING_ID} className="sr-only">
          {story.heading}
        </h2>
        {story.sections.map((section, sectionIndex) => (
          <div key={section.id} className="flex flex-col gap-5">
            {section.heading === null ? null : (
              <h3 className="type-h3 max-w-heading-wide text-heading">{section.heading}</h3>
            )}
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <Fragment key={paragraph}>
                <p
                  className={cn(
                    "text-foreground",
                    /* The opening paragraph of the story is its lead. */
                    sectionIndex === 0 && paragraphIndex === 0 ? "type-lead" : "type-body",
                  )}
                >
                  {paragraph}
                </p>
                {section.pullQuotes
                  .filter((quote) => quote.afterParagraph === paragraphIndex)
                  .map((quote) => (
                    <aside key={quote.text} aria-hidden="true" className="my-4 border-l-2 border-hairline py-1 pl-6 md:pl-8">
                      <p className="type-h3 max-w-heading-wide text-heading">{quote.text}</p>
                    </aside>
                  ))}
              </Fragment>
            ))}
          </div>
        ))}
      </section>

      <MilestoneTimeline className="md:col-span-5 lg:col-start-8" />
    </Band>
  );
}
