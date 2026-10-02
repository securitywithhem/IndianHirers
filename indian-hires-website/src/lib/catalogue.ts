import {
  allPublicItems,
  collections,
  featuredItems,
  filterItems,
  isCollectionSlug,
  publicItems,
  toQuoteLine,
} from "@/content/collections";
import { whatsappMessages } from "@/content/site";
import type {
  CatalogueItem,
  Collection,
  CollectionSlug,
  Finish,
  Material,
  PieceType,
} from "@/content/types";
import { whatsappUrl } from "@/lib/links";

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
 * collection. Hidden items are dropped. An empty list gives the general
 * enquiry message. Falls back to the contact page when no WhatsApp number is
 * configured.
 */
export function buildWhatsAppQuoteUrl(items: CatalogueItem[]): string {
  const quotable = items.filter((item) => item.status === "available");
  return whatsappUrl(whatsappMessages.basketQuote(quotable.map(toQuoteLine)));
}
