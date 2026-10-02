import {
  allPublicItems,
  catalogueCopy,
  collectionFilterOptions,
  filterItems,
  finishLabels,
  materialLabels,
  pieceTypeLabels,
  publicItems,
  toQuoteLine,
  type CatalogueItem,
  type Collection,
} from "@/content/collections";
import { routes, shell, siteMetadata, whatsappMessages } from "@/content/site";
import { whatsappUrl } from "@/lib/links";
import { isWebUrl } from "@/components/shared/AppLink";
import type {
  BasketCopyView,
  BasketEntry,
  CatalogueCopyView,
  CatalogueItemView,
  Facet,
} from "./types";

/**
 * Server-side builders for the catalogue's client components (see types.ts).
 * Import this file from Server Components only: it reads the whole catalogue.
 */

const listFormat = new Intl.ListFormat(siteMetadata.lang, { style: "short", type: "unit" });

function ids(items: CatalogueItem[]): string[] {
  return items.map((item) => item.id);
}

/** Label of a link for a screen reader, with the new-tab note when it leaves the site. */
function linkLabel(label: string, href: string): string {
  return isWebUrl(href) ? `${label} ${shell.newTabNote}` : label;
}

function toItemView(item: CatalogueItem, collection: Collection): CatalogueItemView {
  const { item: itemCopy, drawer } = catalogueCopy;
  const pieces = item.pieces.map((piece) => piece.label);
  const material = item.material === null ? null : materialLabels[item.material];
  const finishes = item.finishes.map((finish) => finishLabels[finish]);
  /* Brass in brass is said once. */
  const specs = (material === null ? finishes : [material, ...finishes]).filter(
    (label, index, all) => all.findIndex((other) => other.toLowerCase() === label.toLowerCase()) === index,
  );
  const askHref = whatsappUrl(whatsappMessages.itemQuote(item, collection.title));

  return {
    id: item.id,
    name: item.name,
    image: item.image,
    placeholderAlt: itemCopy.placeholderAlt(item.name),
    material,
    finishSummary: listFormat.format(finishes),
    specs: listFormat.format(specs),
    pieces,
    piecesSummary: listFormat.format(pieces),
    askHref,
    askLabel: linkLabel(itemCopy.askOnWhatsAppLabel(item.name), askHref),
    dialogLabel: drawer.label(item.name),
  };
}

/** The collection's public items, ready for the cards and the drawer. */
export function collectionItemViews(collection: Collection): CatalogueItemView[] {
  return publicItems(collection).map((item) => toItemView(item, collection));
}

/**
 * The filter groups of one collection. Only values that occur are offered, and
 * a group with a single value is dropped (it cannot narrow anything). Each
 * option carries the ids `filterItems` returns for it, so the client applies
 * a combination of filters by intersecting lists — the matching rule itself
 * stays in the content module.
 */
export function collectionFacets(collection: Collection): Facet[] {
  const items = publicItems(collection);
  const options = collectionFilterOptions(collection);
  const { filters } = catalogueCopy;

  const facets: Facet[] = [
    {
      key: "material",
      label: filters.materialLabel,
      options: options.materials.map((material) => ({
        value: material,
        label: materialLabels[material],
        ids: ids(filterItems(items, { material })),
      })),
    },
    {
      key: "finish",
      label: filters.finishLabel,
      options: options.finishes.map((finish) => ({
        value: finish,
        label: finishLabels[finish],
        ids: ids(filterItems(items, { finish })),
      })),
    },
    {
      key: "piece",
      label: filters.pieceLabel,
      options: options.pieces.map((piece) => ({
        value: piece,
        label: pieceTypeLabels[piece],
        ids: ids(filterItems(items, { piece })),
      })),
    },
  ];

  return facets.filter((facet) => facet.options.length > 1);
}

/** Every string the catalogue of one collection shows, templates already applied. */
export function collectionCopyView(collection: Collection): CatalogueCopyView {
  const { filters, item, drawer, emptyCollection, textOnly } = catalogueCopy;
  const total = publicItems(collection).length;
  const resultCounts: string[] = [];
  for (let shown = 0; shown <= total; shown += 1) {
    resultCounts.push(filters.resultCount(shown, total, collection.countAs));
  }

  return {
    card: { ratesOnRequest: item.ratesOnRequest, askOnWhatsApp: item.askOnWhatsApp },
    filters: {
      heading: filters.heading,
      all: filters.all,
      clear: filters.clear,
      resultCounts,
      emptyHeading: filters.emptyHeading,
      emptyBody: filters.emptyBody,
      askCta: emptyCollection.cta,
      askHref: whatsappUrl(whatsappMessages.collectionEnquiry(collection.title)),
    },
    drawer: {
      close: drawer.close,
      collectionLabel: drawer.collectionLabel,
      collectionTitle: collection.title,
      materialLabel: drawer.materialLabel,
      finishLabel: drawer.finishLabel,
      piecesHeading: drawer.piecesHeading,
      photoPending: item.photoPending,
      ratesOnRequest: item.ratesOnRequest,
      askOnWhatsApp: item.askOnWhatsApp,
    },
    listNote: textOnly.listNote,
    newTabNote: shell.newTabNote,
  };
}

/**
 * Every public item, keyed by id, as the quote basket lists it. The basket
 * stores ids only; an id that is not in this table (a stale or tampered
 * sessionStorage value, a placeholder) is dropped.
 */
export function basketEntries(): Record<string, BasketEntry> {
  const { basket } = catalogueCopy;
  const entries: Record<string, BasketEntry> = {};
  allPublicItems.forEach((item) => {
    const line = toQuoteLine(item);
    entries[item.id] = {
      name: line.name,
      collectionTitle: line.collectionTitle,
      removeLabel: basket.removeItemLabel(item.name),
      addedAnnouncement: basket.addedAnnouncement(item.name),
      removedAnnouncement: basket.removedAnnouncement(item.name),
    };
  });
  return entries;
}

export function basketCopyView(): BasketCopyView {
  const { basket, item } = catalogueCopy;
  const openLabels: string[] = [];
  const counts: string[] = [];
  for (let count = 0; count <= allPublicItems.length; count += 1) {
    openLabels.push(basket.openLabel(count));
    counts.push(basket.count(count));
  }

  return {
    title: basket.title,
    lead: basket.lead,
    closeLabel: basket.closeLabel,
    emptyHeading: basket.emptyHeading,
    emptyBody: basket.emptyBody,
    browseCta: basket.browseCta,
    browseHref: routes.collections,
    send: basket.send,
    clear: basket.clear,
    clearedAnnouncement: basket.clearedAnnouncement,
    addToQuote: item.addToQuote,
    added: item.added,
    openLabels,
    counts,
  };
}
