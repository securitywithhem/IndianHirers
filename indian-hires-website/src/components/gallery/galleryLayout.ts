import type { CollectionSlug } from "@/content/collections";

/**
 * The gallery's masonry: CSS columns (`columns-2 sm:columns-3 lg:columns-4`),
 * every tile one column wide, its height set by its frame. The rhythm comes
 * from the frames, not from spans:
 *
 *   dinner sets fill the square frame edge to edge     → 1 / 1
 *   chafing dishes stand on a backdrop                 → 4 / 5
 *   glassware is tall and letterboxed by the pipeline  → 3 / 4
 *
 * The photograph is cropped into the frame (`object-cover`); the viewer shows
 * it whole. Columns fill top to bottom, so the DOM order, the reading order
 * and the tab order are the same: down the first column, then the next.
 *
 * Pure and server-side: the page computes the frame and the `sizes` string and
 * passes them to the client grid as props.
 */

export type TileAspect = "1/1" | "4/5" | "3/4";

const COLLECTION_ASPECT: Partial<Record<CollectionSlug, TileAspect>> = {
  "chafing-dishes": "4/5",
  glassware: "3/4",
};

/** The frame a catalogue photograph is shown in. Square unless listed above. */
export function tileAspect(collection: CollectionSlug): TileAspect {
  return COLLECTION_ASPECT[collection] ?? "1/1";
}

/** The nearest frame to a photograph's own ratio (event photographs). */
export function nearestAspect(width: number, height: number): TileAspect {
  const ratio = width / height;
  if (ratio >= 0.9) return "1/1";
  return ratio >= 0.77 ? "4/5" : "3/4";
}

/*
 * Rendered column width, from `columns-2 sm:columns-3 lg:columns-4` with
 * `gap-2 md:gap-3` inside the `shell` (gutter 20px → 32px, content width
 * capped at 1216px). Every tile is one column wide, so one string serves all.
 */
export const TILE_SIZES = [
  "(min-width: 1280px) 295px",
  "(min-width: 1024px) calc(25vw - 25px)",
  "(min-width: 640px) calc(33.3vw - 24px)",
  "calc(50vw - 24px)",
].join(", ");

/**
 * Deals the photographs out one collection at a time (a plate set, a chafer,
 * a glass, …), keeping each collection's own order. CSS columns fill top to
 * bottom, so in catalogue order the first column would be all dinner sets and
 * the last all glassware; dealt out, every column mixes the range.
 */
export function interleaveByCollection<T extends { collection: CollectionSlug }>(photos: readonly T[]): T[] {
  const groups = new Map<CollectionSlug, T[]>();
  for (const photo of photos) {
    const group = groups.get(photo.collection);
    if (group === undefined) groups.set(photo.collection, [photo]);
    else group.push(photo);
  }
  const queues = Array.from(groups.values());
  const dealt: T[] = [];
  while (dealt.length < photos.length) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next !== undefined) dealt.push(next);
    }
  }
  return dealt;
}
