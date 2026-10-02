/**
 * One import point for the catalogue's types.
 *
 * Each type is defined beside the data it describes (`collections.ts`,
 * `products.ts`, `site.ts`) and only re-exported here, so there is still one
 * definition of each. Type-only: importing this file adds nothing to a bundle.
 *
 * No type here has a price-shaped field — see `NoPricing`.
 */
export type {
  CatalogueItem,
  Collection,
  CollectionSlug,
  CountNoun,
  FilterOptions,
  Finish,
  ItemFilter,
  ItemStatus,
  Material,
  NoPricing,
  PhotographedCollection,
  Piece,
  PieceType,
} from "./collections";
export type { ProductImage } from "./products";
export type { QuoteLine, TrustBadge } from "./site";
