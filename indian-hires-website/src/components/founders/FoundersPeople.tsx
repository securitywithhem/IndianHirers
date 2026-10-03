import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { founders } from "@/content/founders";
import { FounderCard } from "./FounderCard";

const HEADING_ID = "founders-people-heading";

/** The people the visitor will actually speak to, named. */
export function FoundersPeople() {
  const { people } = founders;

  return (
    <Band tone="ivory-alt" aria-labelledby={HEADING_ID}>
      <Reveal lines>
        <SectionHeading as="h2" id={HEADING_ID} align="center" heading={people.heading} divider />
      </Reveal>

      <Stagger
        as="ul"
        /* Three generations: one column, centred, until three fit side by side. */
        className="mx-auto mt-10 grid max-w-md gap-4 md:mt-14 md:gap-6 lg:max-w-6xl lg:grid-cols-3 lg:gap-8"
      >
        {people.profiles.map((profile) => (
          <StaggerItem as="li" key={profile.id}>
            <FounderCard profile={profile} headingLevel="h3" />
          </StaggerItem>
        ))}
      </Stagger>
    </Band>
  );
}
