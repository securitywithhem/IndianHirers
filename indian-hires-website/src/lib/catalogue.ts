import {
  allPublicItems,
  collections,
  featuredItems,
  filterItems,
  isCollectionSlug,
  publicItems,
  toQuoteLine,
} from "@/content/collections";
import { collectionPath, whatsappMessages } from "@/content/site";
import type {
  CatalogueItem,
  Collection,
  CollectionSlug,
  Finish,
  Material,
  PieceType,
} from "@/content/types";
import { env } from "@/lib/env";
import { absoluteUrl, whatsappUrl } from "@/lib/links";

/**
 * Queries over the catalogue in `src/content/collections.ts`.
 *
 * Nothing that leaves this module is hidden: a collection's `items` holds
 * its public items only, and an item whose status is "todo" or "unconfirmed"
 * is never returned and never put in a message. Nothing here contains copy
 * or data — the message text is built in `src/content/site.ts`.
 */

const publicCollections: Collection[] = collections.map((collection) => ({
  ...collection,
  items: publicItems(collection),
}));

export interface ItemQuery {
  collection?: CollectionSlug;
  material?: Material;
  finish?: Finish;
  pieceType?: PieceType;
}

/** All collections, in display order. */
export function getCollections(): Collection[] {
  return publicCollections;
}

/** One collection by slug. Undefined for an unknown slug such as a bad route param. */
export function getCollection(slug: string): Collection | undefined {
  return isCollectionSlug(slug)
    ? publicCollections.find((collection) => collection.slug === slug)
    : undefined;
}

/** Public items matching every criterion that is set. An empty query returns all. */
export function getItems(query: ItemQuery = {}): CatalogueItem[] {
  const { collection, material, finish, pieceType } = query;
  const pool =
    collection === undefined
      ? allPublicItems
      : allPublicItems.filter((item) => item.collection === collection);
  return filterItems(pool, { material, finish, piece: pieceType });
}

/** Public items flagged for the home page. */
export function getFeatured(): CatalogueItem[] {
  return featuredItems;
}

/**
 * WhatsApp link that asks for a quote on `items`, one per line with its
 * collection, followed by `note` (the visitor's event date and guest count)
 * when it is not blank. Hidden items are dropped. An empty list gives the
 * general enquiry message. Falls back to the contact page when no WhatsApp
 * number is configured.
 *
 * The quote sheet builds its link from the same message builder
 * (`whatsappMessages.basketQuote`) without importing this module, which
 * would put the whole catalogue in the browser.
 */
export function buildWhatsAppQuoteUrl(items: CatalogueItem[], note = ""): string {
  const quotable = items.filter((item) => item.status === "available");
  return whatsappUrl(whatsappMessages.basketQuote(quotable.map(toQuoteLine), note));
}

export interface ListItemJsonLd {
  "@type": "ListItem";
  position: number;
  name: string;
  image?: string;
}

export interface ItemListJsonLd {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name: string;
  description: string;
  numberOfItems: number;
  url?: string;
  itemListElement: ListItemJsonLd[];
}

/**
 * schema.org `ItemList` for a collection page: its public items, in display
 * order. No offers and no prices. `url` and `image` need an absolute address,
 * so they are left out until NEXT_PUBLIC_SITE_URL is set.
 */
export function collectionItemListJsonLd(collection: Collection): ItemListJsonLd {
  const items = publicItems(collection);
  const absolute = env.siteUrl !== "";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.description,
    numberOfItems: items.length,
    ...(absolute ? { url: absoluteUrl(collectionPath(collection.slug)) } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(absolute && item.image !== null ? { image: absoluteUrl(item.image.src) } : {}),
    })),
  };
}
