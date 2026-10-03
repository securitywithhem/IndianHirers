import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { EnterOnLoad, KenBurns, MaskLines } from "@/components/motion";
import { ArchFrame, Crown } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { home } from "@/content/home";

const HEADING_ID = "home-hero-heading";

/* The arch is 80% of the column (capped at 384px) below `lg`, and five of the
 * twelve columns of the 1280px shell from `lg`. */
const ARCH_SIZES = "(min-width: 1280px) 488px, (min-width: 1024px) 38vw, (min-width: 540px) 384px, 72vw";

/**
 * The maroon band the page opens on (Docs/UI_UX_V2.md §7.11 "Hero layout"):
 * copy and actions first, the photograph in a mehrab arch beside them from
 * `lg` and under them below it. No text sits over the photograph. The `h1`
 * is the brand tagline.
 *
 * It slides under the fixed header, which is transparent here.
 *
 * Entrance (.claude/rules/motion.md, "Hero entrance"): the crown draws itself,
 * the eyebrow fades and the `h1` lines slide up from behind a mask, all from
 * first paint and done within 900ms. The lead, both calls to action and the
 * photograph are painted at first paint and wait on nothing, so whichever of
 * them is the LCP element is never held back.
 */
export function HomeHero() {
  const { hero } = home;
  const photograph = hero.image;

  return (
    <Band
      tone="maroon-deep"
      size="hero"
      underHeader
      aria-labelledby={HEADING_ID}
      innerClassName="grid items-center gap-12 lg:grid-cols-12 lg:gap-8"
    >
      <div className="relative flex flex-col items-center gap-6 text-center lg:col-span-7 lg:items-start lg:text-start">
        {/* Candle glow, centred behind the headline rather than the band. */}
        <div
          aria-hidden="true"
          className="candle-glow pointer-events-none absolute -inset-x-gutter -inset-y-24 -z-10"
        />

        <div className="crown-draw text-hairline">
          <Crown className="h-9" />
        </div>

        <EnterOnLoad as="p" rise={false} className="type-eyebrow text-kicker">
          {hero.eyebrow}
        </EnterOnLoad>

        <h1 id={HEADING_ID} className="type-display max-w-heading text-heading">
          <MaskLines lines={hero.headline} />
        </h1>

        <p className="type-lead max-w-measure-tight text-muted-foreground">{hero.lead}</p>

        <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:gap-4">
          <WhatsAppButton message={hero.primaryCta.message} label={hero.primaryCta.label} />
          <ButtonLink href={hero.secondaryCta.href} variant="secondary">
            {hero.secondaryCta.label}
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>

      <div className="mx-auto w-4/5 max-w-sm lg:col-span-5 lg:w-full lg:max-w-none">
        {/* A square photograph in a 4:5 arch keeps the middle 80% of its width.
            Centred on purpose: the stacked plates sit under the point of the
            arch and the two front bowls are trimmed evenly at the edges. */}
        <ArchFrame aspect="4/5" framed>
          <KenBurns>
            <Image
              src={photograph.src}
              alt={photograph.alt}
              fill
              priority
              sizes={ARCH_SIZES}
              placeholder={photograph.blurDataURL ? "blur" : "empty"}
              blurDataURL={photograph.blurDataURL}
              className="object-cover object-center"
            />
          </KenBurns>
        </ArchFrame>
      </div>
    </Band>
  );
}
