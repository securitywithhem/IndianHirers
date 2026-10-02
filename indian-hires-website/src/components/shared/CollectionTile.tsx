import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArchFrame, CrownPlaceholder } from "@/components/ornament";
import { catalogueCopy, collectionCountLabel, type Collection } from "@/content/collections";
import { collectionPath } from "@/content/site";

export type CollectionTileHeading = "h2" | "h3" | "h4";

export interface CollectionTileProps {
  collection: Collection;
  /** Tag of the title; it follows the page outline. The type role stays `type-h4`. */
  headingLevel: CollectionTileHeading;
  /**
   * `sizes` of the arch image. The default fits the grid
   * `grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8`
   * inside the `shell`. Pass your own if your grid differs — it must match
   * the real rendered width of the PHOTOGRAPH, not of the tile.
   */
  sizes?: string;
  className?: string;
}

/*
 * Width of the photograph = grid column − the tile's padding (32px, 40px from
 * `md`) − its border (2px) − the arch's gold line (4px). Column widths follow
 * from the shell's gutter and the grid's gap at each breakpoint:
 *   < 640    2 columns, gap 16   → 50vw − 66px     (129px at 390)
 *   640–767  3 columns, gap 16   → 33.3vw − 64px   (149px at 640)
 *   768–1023 3 columns, gap 24   → 33.3vw − 79px   (177px at 768)
 *   1024–1279 4 columns, gap 32  → 25vw − 84px     (172px at 1024)
 *   ≥ 1280   the shell stops growing → 234px
 */
const DEFAULT_SIZES =
  "(min-width: 1280px) 234px, (min-width: 1024px) calc(25vw - 84px), (min-width: 768px) calc(33.3vw - 79px), (min-width: 640px) calc(33.3vw - 64px), calc(50vw - 66px)";

/**
 * Arch tile for one collection: its hero photograph (or the crown placeholder
 * when it has none) in a mehrab frame, the title, the tagline and the derived
 * design count. The whole tile is a single link; it lifts on hover and focus
 * (`card-royal`) and the photograph zooms to 1.04 over 700ms — both off under
 * reduced motion.
 *
 * The link is named by `catalogueCopy.landing.cardLinkLabel` and described by
 * the tagline and the count, so a list of links stays short to listen to.
 */
export function CollectionTile({ collection, headingLevel, sizes = DEFAULT_SIZES, className }: CollectionTileProps) {
  const Heading = headingLevel;
  const id = useId();
  const taglineId = `${id}-tagline`;
  const countId = `${id}-count`;
  const { landing } = catalogueCopy;
  const { hero } = collection;

  return (
    <Link
      href={collectionPath(collection.slug)}
      aria-label={landing.cardLinkLabel(collection.title)}
      aria-describedby={`${taglineId} ${countId}`}
      className={cn(
        "card-royal group focus-ring flex h-full flex-col items-center gap-4 rounded-card border border-hairline/40 bg-card p-4 text-center text-card-foreground shadow-card md:p-5",
        className,
      )}
    >
      <ArchFrame aspect="3/4" framed>
        {hero ? (
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            sizes={sizes}
            placeholder="blur"
            blurDataURL={hero.blurDataURL}
            className="object-cover motion-safe:transition-transform motion-safe:duration-zoom motion-safe:ease-royal motion-safe:group-hover:scale-104 motion-safe:group-focus-visible:scale-104"
          />
        ) : (
          <CrownPlaceholder aspect="3/4" className="h-full" />
        )}
      </ArchFrame>
      <div className="flex flex-col items-center gap-2">
        <Heading className="type-h4 text-heading">{collection.title}</Heading>
        <p id={taglineId} className="type-small text-muted-foreground">
          {collection.tagline}
        </p>
        <p id={countId} className="type-caption text-kicker">
          {collectionCountLabel(collection)}
        </p>
      </div>
    </Link>
  );
}
