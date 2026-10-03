import type { FounderProfile } from "@/content/founders";
import { FounderPortrait } from "./FounderPortrait";

export interface FounderCardProps {
  profile: FounderProfile;
  /** The tag follows the page outline; the type role is always `type-h3`. */
  headingLevel: "h2" | "h3";
}

/**
 * One member of the family: portrait, role, name, and a third-person
 * description.
 *
 * The description is NOT a quotation, so there are no quote marks and no
 * `<blockquote>`. Without a photograph the portrait is the crown medallion
 * (see `FounderPortrait`); a supplied portrait replaces it with no change here.
 */
export function FounderCard({ profile, headingLevel: Heading }: FounderCardProps) {
  return (
    <article className="flex h-full flex-col items-center gap-4 rounded-card border border-hairline/40 bg-card p-6 text-center text-card-foreground shadow-card md:p-8">
      <FounderPortrait profile={profile} />

      <div className="flex flex-col items-center gap-2">
        <p className="type-eyebrow text-kicker">{profile.role}</p>
        <Heading className="type-h3 text-heading">{profile.name}</Heading>
      </div>

      <span aria-hidden="true" className="rule-double w-12" />

      <p className="type-body max-w-measure-tight text-muted-foreground">{profile.description}</p>
    </article>
  );
}
