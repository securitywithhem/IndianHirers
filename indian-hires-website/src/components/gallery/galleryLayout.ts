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

/** Height of a frame, in tile widths. */
const ASPECT_HEIGHT: Record<TileAspect, number> = { "1/1": 1, "4/5": 1.25, "3/4": 4 / 3 };

/* The vertical gap between tiles (mb-2, 8px) in tile widths at a phone's
 * column width (~170px). Only used to approximate where columns break. */
const GAP = 0.05;

/**
 * Index of the first tile in each column, for `columns` columns. Mirrors the
 * browser's column balancing: the shortest column height into which the
 * tiles, laid in order, fit in `columns` columns, then the breaks that
 * height gives. An approximation (the browser also rounds pixels), checked
 * against the real layout in scripts/r6-pass.mjs.
 */
export function columnHeads(aspects: readonly TileAspect[], columns: number): number[] {
  const heights = aspects.map((aspect) => ASPECT_HEIGHT[aspect] + GAP);
  const breaks = (limit: number): number[] => {
    const heads = [0];
    let used = 0;
    heights.forEach((height, index) => {
      if (used + height > limit + 1e-9 && used > 0) {
        heads.push(index);
        used = 0;
      }
      used += height;
    });
    return heads;
  };
  let low = Math.max(...heights);
  let high = heights.reduce((sum, height) => sum + height, 0);
  for (let step = 0; step < 40; step += 1) {
    const mid = (low + high) / 2;
    if (breaks(mid).length <= columns) high = mid;
    else low = mid;
  }
  return breaks(high);
}

/**
 * The tiles that head a column on a phone (two columns) load eagerly, and the
 * tallest of them is the route's single `priority` image: the largest image
 * in a phone's first screen, so its LCP element. Only the phone layout is
 * favoured: eager column heads for the wider layouts were measured to cost
 * the phone (they are off its first screen and take its bandwidth), and the
 * desktop scores 100 either way.
 */
export function firstScreenTiles(aspects: readonly TileAspect[]): { eager: number[]; priority: number } {
  const phoneHeads = columnHeads(aspects, 2);
  const eager = phoneHeads;
  const priority = phoneHeads.reduce(
    (best, index) => (ASPECT_HEIGHT[aspects[index] ?? "1/1"] > ASPECT_HEIGHT[aspects[best] ?? "1/1"] ? index : best),
    phoneHeads[0] ?? 0,
  );
  return { eager, priority };
}
