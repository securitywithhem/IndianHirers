import { Band } from "@/components/shared/Band";
import { CollectionTile } from "@/components/shared/CollectionTile";
import { PageHero } from "@/components/shared/PageHero";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { Stagger, StaggerItem } from "@/components/motion";
import { CollectionTabs } from "@/components/collections/CollectionTabs";
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

export const metadata = pageMetadata(routeMetadata["/collections"]);

const SUGGEST_HEADING_ID = "collections-suggest-heading";

export default function CollectionsPage() {
  const { landing } = catalogueCopy;

  return (
    <>
      <PageHero eyebrow={landing.eyebrow} heading={landing.heading} lead={landing.lead(collectionCount)} />

      <CollectionTabs current={null} />

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

        <p className="type-body mx-auto mt-10 max-w-measure text-center text-muted-foreground md:mt-14">
          {landing.footnote}
        </p>
      </Band>

      <QuoteBasketButton />

      <Band
        tone="maroon"
        glow
        size="sm"
        aria-labelledby={SUGGEST_HEADING_ID}
        innerClassName="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:gap-10 md:text-start"
      >
        <div className="flex flex-col gap-2">
          <h2 id={SUGGEST_HEADING_ID} className="type-h3 text-heading">
            {landing.suggest.heading}
          </h2>
          <p className="type-body max-w-measure text-muted-foreground">{landing.suggest.body}</p>
        </div>
        <WhatsAppButton message={whatsappMessages.suggestSet()} label={landing.suggest.cta} className="shrink-0" />
      </Band>
    </>
  );
}
