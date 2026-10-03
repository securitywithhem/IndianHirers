import type { ReactNode } from "react";
import type { ProductImage } from "@/content/products";

/**
 * What the catalogue's client components receive from the server.
 *
 * `@/content/collections` holds the whole catalogue and the photo manifest, so
 * a client component must never import it. The server builds these plain,
 * serialisable views (`catalogueView.ts`) — every template in `catalogueCopy`
 * is already called — and the client only renders strings.
 */

/** URL search params the catalogue reads and writes. */
export type FacetKey = "material" | "finish" | "piece";

/** Search param that holds the id of the item whose drawer is open. */
export const ITEM_PARAM = "item";

export interface FacetOption {
  /** Value in the URL: a `Material`, `Finish` or `PieceType`. */
  value: string;
  label: string;
  /** Ids of the items `filterItems` returns for this value alone. */
  ids: string[];
}

export interface Facet {
  key: FacetKey;
  label: string;
  options: FacetOption[];
}

export interface CatalogueItemView {
  id: string;
  name: string;
  /** Null → the crown placeholder. */
  image: ProductImage | null;
  /** Text alternative of the crown placeholder. */
  placeholderAlt: string;
  /** Null when the material has not been confirmed: the row is then left out. */
  material: string | null;
  /** Labels of the confirmed finishes; empty when there are none. */
  finishes: string[];
  /** Material and finishes as one line for the card, no word twice; may be empty. */
  specs: string;
  /** Confirmed piece labels; may be empty. */
  pieces: string[];
  /** The pieces as one line for the card; empty when there are none. */
  piecesSummary: string;
  /** WhatsApp link prefilled with this item, or the contact page. */
  askHref: string;
  /** Accessible name of the card's WhatsApp button. */
  askLabel: string;
  /** Accessible name of the item's dialog. */
  dialogLabel: string;
}

export interface ItemCardCopy {
  ratesOnRequest: string;
  /** Visible text of the per-item WhatsApp action. */
  askOnWhatsApp: string;
  /** Shown in a text row whose item has no confirmed pieces yet. */
  detailPending: string;
}

export interface FilterCopyView {
  /** Accessible name of the filter group. */
  heading: string;
  all: string;
  clear: string;
  /** `resultCounts[n]`: the line announced when `n` designs are shown. */
  resultCounts: string[];
  emptyHeading: string;
  emptyBody: string;
  /** WhatsApp fallback in the empty-result state. */
  askCta: string;
  askHref: string;
}

export interface ItemDrawerCopyView {
  close: string;
  collectionLabel: string;
  collectionTitle: string;
  materialLabel: string;
  finishLabel: string;
  piecesHeading: string;
  photoPending: string;
  /** Shown instead of the piece list when no piece is confirmed. */
  detailPending: string;
  ratesOnRequest: string;
  askOnWhatsApp: string;
}

export interface CatalogueCopyView {
  card: ItemCardCopy;
  filters: FilterCopyView;
  drawer: ItemDrawerCopyView;
  /** Shown with the text list of a collection that has no photographs. */
  listNote: string;
  /** Appended, for screen readers, to a link that opens a new tab. */
  newTabNote: string;
}

/** One catalogue item as the quote basket knows it. */
export interface BasketEntry {
  name: string;
  collectionTitle: string;
  removeLabel: string;
  addedAnnouncement: string;
  removedAnnouncement: string;
}

export interface BasketCopyView {
  title: string;
  lead: string;
  closeLabel: string;
  emptyHeading: string;
  emptyBody: string;
  browseCta: string;
  browseHref: string;
  send: string;
  clear: string;
  clearedAnnouncement: string;
  /** Visible label of the card toggle: not in the list / in the list. */
  addToQuote: string;
  added: string;
  /** Label and help text of the free-text field for the event date and guest count. */
  noteLabel: string;
  noteHint: string;
  noteMaxLength: number;
  /** `pillLabels[n]`: visible label of the floating pill holding `n` items. */
  pillLabels: string[];
  /** `counts[n]`: "n items". */
  counts: string[];
}

export type ItemHeadingLevel = "h2" | "h3" | "h4";

/** Props shared by the static (server) catalogue and the interactive one. */
export interface CatalogueProps {
  /** The collection's public items — never `collection.items`. */
  items: CatalogueItemView[];
  /** Filter groups; empty → no filter bar. */
  facets: Facet[];
  copy: CatalogueCopyView;
  /** Tag of the item titles. */
  headingLevel: ItemHeadingLevel;
  /**
   * `grid`: photograph cards that open the item drawer. `list`: text rows,
   * for a collection in which nothing is photographed.
   */
  layout: "grid" | "list";
  /** Ids of the items whose photographs are in the first viewport at 390px. */
  priorityIds: string[];
  /**
   * The crown placeholder, rendered on the server and handed down, so the
   * client bundle does not import the ornament components.
   */
  placeholder: ReactNode;
}
