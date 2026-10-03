import { Crown } from "@/components/ornament";
import type { FounderProfile } from "@/content/founders";
import { FounderPortraitPhoto } from "./FounderPortraitPhoto";

export interface FounderPortraitProps {
  profile: FounderProfile;
}

/**
 * A circular, warm-toned portrait in a double gold ring, 160px (176px from `md`).
 *
 * With no photograph (every profile today) the medallion is a maroon cameo
 * with the gold crown and the candle glow: decorative, `aria-hidden`, and it
 * stands for no one — the name beside it carries the card. It is not a
 * stand-in photograph and never a stock image.
 */
export function FounderPortrait({ profile }: FounderPortraitProps) {
  return (
    <div className="rounded-full p-1.5 ring-1 ring-hairline">
      <div className="relative size-40 overflow-hidden rounded-full border border-hairline/60 md:size-44">
        {profile.portrait === null ? (
          <div
            aria-hidden="true"
            className="theme-dark relative isolate grid size-full place-items-center bg-maroon-800 text-hairline"
          >
            <span className="candle-glow absolute inset-0 -z-10" />
            <Crown size="xl" />
          </div>
        ) : (
          <FounderPortraitPhoto image={profile.portrait} alt={profile.portraitAlt} />
        )}
      </div>
    </div>
  );
}
