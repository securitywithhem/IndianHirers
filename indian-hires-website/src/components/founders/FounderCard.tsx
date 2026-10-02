import { Crown } from "@/components/ornament";
import type { FounderProfile } from "@/content/founders";

export interface FounderCardProps {
  profile: FounderProfile;
  /** The tag follows the page outline; the type role is always `type-h3`. */
  headingLevel: "h2" | "h3";
}

/**
 * One member of the family: role, name, and a third-person description.
 *
 * The description is NOT a quotation, so there are no quote marks and no
 * `<blockquote>`. There are no portraits yet either, and nothing stands in
 * for one — no stock photograph, no product photograph, no empty frame: the
 * crown and the name carry the card.
 *
 * TODO(owner portraits): `profile.portrait` is null for every profile today,
 * so this card renders no image and the route ships no image code. When a
 * portrait is supplied, add a `FounderPortrait` component beside this file
 * (`next/image` in an `<ArchFrame aspect="4/5" framed>`, `alt` from
 * `profile.portraitAlt`, `sizes="160px"`, blur placeholder) and render it here
 * in place of the crown when `profile.portrait !== null`.
 */
export function FounderCard({ profile, headingLevel: Heading }: FounderCardProps) {
  return (
    <article className="flex h-full flex-col items-center gap-4 rounded-card border border-hairline/40 bg-card p-6 text-center text-card-foreground shadow-card md:p-8">
      <Crown className="h-10 text-hairline" />

      <div className="flex flex-col items-center gap-2">
        <p className="type-eyebrow text-kicker">{profile.role}</p>
        <Heading className="type-h3 text-heading">{profile.name}</Heading>
      </div>

      <span aria-hidden="true" className="rule-double w-12" />

      <p className="type-body max-w-measure-tight text-muted-foreground">{profile.description}</p>
    </article>
  );
}
