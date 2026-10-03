import { notFound } from "next/navigation";
import { Band } from "@/components/shared/Band";
import { CollectionTile } from "@/components/shared/CollectionTile";
import { PageHero } from "@/components/shared/PageHero";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { Crown, CrownPlaceholder, SectionHeading } from "@/components/ornament";
import { Stagger, StaggerItem } from "@/components/motion";
import { Breadcrumb } from "@/components/collections/Breadcrumb";
import { CatalogueIsland } from "@/components/collections/CatalogueIsland";
import { CollectionTabs } from "@/components/collections/CollectionTabs";
import { CollectionTextRow } from "@/components/collections/CollectionTextRow";
import { QuoteBasketButton } from "@/components/collections/QuoteBasketButton";
import { StaticCatalogue } from "@/components/collections/StaticCatalogue";
import { collectionCopyView, collectionFacets, collectionItemViews } from "@/components/collections/catalogueView";
import {
  CATALOGUE_STACK_CLASS,
  COLLECTION_TILE_GRID_CLASS,
  COLLECTION_TILE_SIZES,
} from "@/components/collections/classes";
import type { CatalogueProps } from "@/components/collections/types";
import {
  catalogueCopy,
  collectionCountLabel,
  collectionHasPhotographs,
  collectionSlugs,
  collectionsWithPhotograph,
  collectionsWithoutPhotograph,
  findCollection,
} from "@/content/collections";
import { collectionMetadata, routeMetadata, routes, whatsappMessages } from "@/content/site";
import { collectionItemListJsonLd } from "@/lib/catalogue";

interface CollectionPageProps {
  params: { slug: string };
}

const ITEMS_HEADING_ID = "collection-items-heading";
const OTHERS_HEADING_ID = "other-collections-heading";
const ENQUIRE_HEADING_ID = "collection-enquire-heading";

/* One photograph is preloaded: the first card's, the largest picture on the
 * first screen of a phone. A second preload only competes with it. */
const PRIORITY_PHOTOGRAPHS = 1;

/* Only the eight collections exist; any other slug is a 404, not a render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return collectionSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: CollectionPageProps) {
  const collection = findCollection(params.slug);
  return collection ? pageMetadata(collectionMetadata(collection)) : pageMetadata(routeMetadata.notFound);
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = findCollection(params.slug);
  if (!collection) notFound();

  const { collectionPage, emptyCollection, collectionNotes, textOnly } = catalogueCopy;
  /* `collectionItemViews` is built from `publicItems`: hidden items never reach the page. */
  const items = collectionItemViews(collection);
  const photographed = collectionHasPhotographs(collection);
  const note = collectionNotes[collection.slug];
  const enquiry = whatsappMessages.collectionEnquiry(collection.title);
  const isOther = (other: { slug: string }) => other.slug !== collection.slug;

  const catalogue: CatalogueProps = {
    items,
    facets: collectionFacets(collection),
    copy: collectionCopyView(collection),
    headingLevel: "h3",
    /* Nothing photographed → a text list, not a grid of blank tiles. */
    layout: photographed ? "grid" : "list",
    priorityIds: items
      .slice(0, PRIORITY_PHOTOGRAPHS)
      .filter((item) => item.image !== null)
      .map((item) => item.id),
    placeholder: <CrownPlaceholder aspect="1/1" className="h-full" />,
  };
  /* The interactive catalogue is only fetched where there is something for it
   * to do: filters to apply, or cards whose details open in the drawer. */
  const interactive = catalogue.layout === "grid" || catalogue.facets.length > 0;
  /* `<` is escaped so no string in the schema can close the script element. */
  const itemListJsonLd = JSON.stringify(collectionItemListJsonLd(collection)).replace(/</g, "\\u003c");

  return (
    <>
      {items.length > 0 ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListJsonLd }} />
      ) : null}
      <PageHero
        eyebrow={collectionCountLabel(collection)}
        /* "& Word" stays together, so a line never ends on the ampersand. */
        heading={collection.title.replace(/& /g, "&\u00a0")}
        lead={collection.tagline}
        before={
          <Breadcrumb
            label={collectionPage.breadcrumbLabel}
            trail={[
              { label: collectionPage.breadcrumbHome, href: routes.home },
              { label: collectionPage.breadcrumbCollections, href: routes.collections },
              { label: collection.title },
            ]}
          />
        }
      >
        {/* From `md`. On a phone the tagline alone leads, so the first pieces are on the first screen. */}
        <p className="type-body hidden max-w-measure text-foreground md:block">{collection.description}</p>
      </PageHero>

      <CollectionTabs current={collection.slug} />

      {items.length > 0 ? (
        <Band
          tone="ivory"
          linen
          size="none"
          aria-labelledby={ITEMS_HEADING_ID}
          innerClassName="pb-section pt-6 md:pt-section-sm"
        >
          <h2 id={ITEMS_HEADING_ID} className="sr-only">
            {collectionPage.itemsHeading(collection.title)}
          </h2>
          {photographed ? null : (
            <p className="type-body mb-6 max-w-measure text-muted-foreground">{textOnly.listNote}</p>
          )}
          {interactive ? (
            <CatalogueIsland {...catalogue}>
              <StaticCatalogue {...catalogue} />
            </CatalogueIsland>
          ) : (
            <div className={CATALOGUE_STACK_CLASS}>
              <StaticCatalogue {...catalogue} />
            </div>
          )}
          {note ? <p className="type-small mt-8 max-w-measure text-muted-foreground">{note}</p> : null}
        </Band>
      ) : (
        <Band tone="ivory" linen aria-labelledby={ITEMS_HEADING_ID}>
          <div className="mx-auto flex max-w-measure flex-col items-center gap-4 rounded-card border border-hairline/40 bg-card p-6 text-center text-card-foreground shadow-card md:p-10">
            <Crown size="lg" className="text-hairline" />
            <h2 id={ITEMS_HEADING_ID} className="type-h2 text-heading">
              {emptyCollection.heading}
            </h2>
            <p className="type-body text-muted-foreground">{emptyCollection.body}</p>
            <WhatsAppButton message={enquiry} label={emptyCollection.cta} />
          </div>
        </Band>
      )}

      {/* Fixed to the corner; placed here so Tab reaches it straight after the catalogue. */}
      <QuoteBasketButton />

      <Band tone="ivory-alt" aria-labelledby={OTHERS_HEADING_ID}>
        <SectionHeading as="h2" id={OTHERS_HEADING_ID} heading={collectionPage.otherCollectionsHeading} />
        <Stagger as="ul" className={`mt-10 md:mt-14 ${COLLECTION_TILE_GRID_CLASS}`}>
          {collectionsWithPhotograph.filter(isOther).map((other) => (
            <StaggerItem as="li" key={other.slug}>
              <CollectionTile collection={other} headingLevel="h3" sizes={COLLECTION_TILE_SIZES} />
            </StaggerItem>
          ))}
        </Stagger>
        <CollectionTextRow
          collections={collectionsWithoutPhotograph.filter(isOther)}
          headingLevel="h3"
          className="mt-10 md:mt-14"
        />
      </Band>

      {/* The empty collection's own panel is already the enquiry; one WhatsApp action is enough. */}
      {items.length > 0 ? (
        <Band tone="maroon" glow aria-labelledby={ENQUIRE_HEADING_ID} innerClassName="flex flex-col items-center gap-8">
          <SectionHeading
            as="h2"
            id={ENQUIRE_HEADING_ID}
            tone="dark"
            align="center"
            heading={collectionPage.enquireHeading(collection.title)}
            lead={collectionPage.enquireBody}
          />
          <WhatsAppButton message={enquiry} label={collectionPage.enquireCta} />
        </Band>
      ) : null}
    </>
  );
}
