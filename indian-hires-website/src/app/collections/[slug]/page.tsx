import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Band } from "@/components/shared/Band";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { CollectionTile } from "@/components/shared/CollectionTile";
import { PageHero } from "@/components/shared/PageHero";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { pageMetadata } from "@/components/shared/pageMetadata";
import { Crown, CrownPlaceholder, SectionHeading } from "@/components/ornament";
import { Stagger, StaggerItem } from "@/components/motion";
import { CatalogueIsland } from "@/components/collections/CatalogueIsland";
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

interface CollectionPageProps {
  params: { slug: string };
}

const ITEMS_HEADING_ID = "collection-items-heading";
const OTHERS_HEADING_ID = "other-collections-heading";
const ENQUIRE_HEADING_ID = "collection-enquire-heading";

/* The grid is two columns at 390px: its first row is what the first screen shows. */
const FIRST_ROW_ON_PHONE = 2;

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
      .slice(0, FIRST_ROW_ON_PHONE)
      .filter((item) => item.image !== null)
      .map((item) => item.id),
    placeholder: <CrownPlaceholder aspect="1/1" className="h-full" />,
  };
  /* The interactive catalogue is only fetched where there is something for it
   * to do: filters to apply, or cards whose details open in the drawer. */
  const interactive = catalogue.layout === "grid" || catalogue.facets.length > 0;

  return (
    <>
      <PageHero
        eyebrow={collectionCountLabel(collection)}
        heading={collection.title}
        lead={collection.tagline}
        before={
          <nav aria-label={collectionPage.breadcrumbLabel}>
            <ButtonLink href={routes.collections} variant="link" size="sm">
              <ArrowLeft aria-hidden="true" />
              {collectionPage.backLabel}
            </ButtonLink>
          </nav>
        }
      >
        {/* From `md`. On a phone the tagline alone leads, so the first pieces are on the first screen. */}
        <p className="type-body hidden max-w-measure text-foreground md:block">{collection.description}</p>
      </PageHero>

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
            <Crown className="h-8 text-hairline" />
            <h2 id={ITEMS_HEADING_ID} className="type-h3 text-heading">
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
