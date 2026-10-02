import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { CollectionTile } from "@/components/shared/CollectionTile";
import { PageHero } from "@/components/shared/PageHero";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { Stagger, StaggerItem } from "@/components/motion";
import { CollectionTextRow } from "@/components/collections/CollectionTextRow";
import { QuoteBasketButton } from "@/components/collections/QuoteBasket";
import { COLLECTION_TILE_GRID_CLASS, COLLECTION_TILE_SIZES } from "@/components/collections/classes";
import {
  catalogueCopy,
  collectionCount,
  collectionsWithPhotograph,
  collectionsWithoutPhotograph,
} from "@/content/collections";
import { routeMetadata, whatsappMessages } from "@/content/site";
import { whatsappUrl } from "@/lib/links";

export const metadata = pageMetadata(routeMetadata["/collections"]);

export default function CollectionsPage() {
  const { landing } = catalogueCopy;

  return (
    <>
      <PageHero eyebrow={landing.eyebrow} heading={landing.heading} lead={landing.lead(collectionCount)} />

      <Band tone="ivory" linen>
        {/* Photographed collections as arch tiles; the rest as a text row — no blank tiles. */}
        <Stagger as="ul" className={COLLECTION_TILE_GRID_CLASS}>
          {collectionsWithPhotograph.map((collection) => (
            <StaggerItem as="li" key={collection.slug}>
              <CollectionTile collection={collection} headingLevel="h2" sizes={COLLECTION_TILE_SIZES} />
            </StaggerItem>
          ))}
        </Stagger>

        <CollectionTextRow collections={collectionsWithoutPhotograph} headingLevel="h2" className="mt-10 md:mt-14" />

        <div className="mt-10 flex flex-col items-center gap-2 text-center md:mt-14">
          <p className="type-body max-w-measure text-muted-foreground">{landing.footnote}</p>
          <ButtonLink href={whatsappUrl(whatsappMessages.general())} variant="link">
            {landing.footnoteCta}
          </ButtonLink>
        </div>
      </Band>

      <QuoteBasketButton />
    </>
  );
}
