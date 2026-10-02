import { ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ornament";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { CollectionTile } from "@/components/shared/CollectionTile";
import { getCollection } from "@/content/collections";
import { home } from "@/content/home";

const HEADING_ID = "home-collections-heading";

/* The arch inside a tile (tile width less its padding, border and gold line): two tiles
 * a row below `lg`, four from `lg` inside the 1280px shell. */
const TILE_SIZES = "(min-width: 1280px) 235px, (min-width: 1024px) 19vw, (min-width: 480px) 42vw, 34vw";

/**
 * Up to four collections, each one tap from the home page, and the way on to
 * the rest. Which ones is decided in content (`home.featured.collections`:
 * photographed collections only, never the hero's photograph). The tiles are
 * the shared `CollectionTile`.
 */
export function FeaturedCollections() {
  const { featured } = home;

  return (
    <Band tone="ivory-alt" aria-labelledby={HEADING_ID} innerClassName="flex flex-col items-center">
      <Reveal lines>
        <SectionHeading
          as="h2"
          id={HEADING_ID}
          align="center"
          eyebrow={featured.eyebrow}
          heading={featured.heading}
          lead={featured.lead}
          divider
        />
      </Reveal>

      <Stagger as="ul" className="mt-10 grid w-full grid-cols-2 gap-4 md:mt-14 md:gap-6 lg:grid-cols-4 lg:gap-8">
        {featured.collections.map((slug) => (
          <StaggerItem as="li" key={slug}>
            <CollectionTile collection={getCollection(slug)} headingLevel="h3" sizes={TILE_SIZES} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal y={16} className="mt-10 md:mt-14">
        <ButtonLink href={featured.link.href} variant="secondary">
          {featured.link.label}
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </Reveal>
    </Band>
  );
}
