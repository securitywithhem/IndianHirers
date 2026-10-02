import type { CollectionSlug } from "@/content/collections";

/**
 * The gallery's rhythm: at every column count some tiles are double size
 * (two columns by two rows), placed so the rows around them close up exactly
 * with the grid's ordinary, in-order placement. No `grid-auto-flow: dense`,
 * so the visual order is the DOM order and the tab order.
 *
 * A "block" is a run of consecutive tiles that fills whole rows on its own:
 *
 *   2 columns   [B B]          3 columns   [B B s]      [s B B]
 *                                          [B B s]      [s B B]
 *
 *   4 columns   [B B s s]      [s s B B]
 *               [B B s s]      [s s B B]
 *
 * The list is walked row by row. Where a block is due, it is placed only if
 * the photograph that would be enlarged holds up at that size (see
 * `LARGE_TILE_COLLECTIONS`) and the list is long enough to complete the
 * block; otherwise the row is an ordinary one and the block stays due. So the
 * grid never has a hole, and never ends beside a large tile.
 *
 * Pure and server-side: the page computes the classes and the `sizes` string
 * and passes them to the client grid as props.
 */

/**
 * Collections whose photographs fill the square frame edge to edge (the dinner
 * sets). The others were photographed tall or wide and are letterboxed onto a
 * soft backdrop by the image pipeline: fine as a tile, weak at double size.
 */
const LARGE_TILE_COLLECTIONS: readonly CollectionSlug[] = [
  "bone-china",
  "premium-melamine",
  "regular-melamine",
];

/** Whether a photograph from this collection may take a double-size tile. */
export function holdsUpLarge(collection: CollectionSlug): boolean {
  return LARGE_TILE_COLLECTIONS.includes(collection);
}

type Columns = 2 | 3 | 4;

interface Block {
  /** Tiles in the block. */
  length: number;
  /** Which tile of the block is the large one. */
  large: number;
}

interface Pattern {
  /** The large tile on the left, then on the right; blocks alternate between them. */
  blocks: readonly Block[];
  /**
   * Ordinary rows before the first block. On a phone the first rows are small
   * tiles, so the first screen costs two small images, not one large one.
   */
  rowsBeforeFirst: number;
  /** Ordinary rows between two blocks. */
  rowsBetween: number;
}

const PATTERNS: Record<Columns, Pattern> = {
  2: { blocks: [{ length: 1, large: 0 }], rowsBeforeFirst: 3, rowsBetween: 2 },
  3: {
    blocks: [
      { length: 3, large: 0 },
      { length: 3, large: 1 },
    ],
    rowsBeforeFirst: 0,
    rowsBetween: 1,
  },
  4: {
    blocks: [
      { length: 5, large: 0 },
      { length: 5, large: 2 },
    ],
    rowsBeforeFirst: 0,
    rowsBetween: 1,
  },
};

/** For each tile, whether it is double size at this column count. */
function largeTiles(columns: Columns, eligible: readonly boolean[]): boolean[] {
  const { blocks, rowsBeforeFirst, rowsBetween } = PATTERNS[columns];
  const total = eligible.length;
  const large = eligible.map(() => false);

  let index = 0;
  let rowsUntilBlock = rowsBeforeFirst;
  let placed = 0;

  while (index < total) {
    if (rowsUntilBlock === 0) {
      /* Preferred side first, then the other one. */
      const order = blocks.map((_, offset) => blocks[(placed + offset) % blocks.length]);
      const start = index;
      const block = order.find(
        (candidate) =>
          candidate !== undefined &&
          start + candidate.length <= total &&
          eligible[start + candidate.large] === true,
      );
      if (block !== undefined) {
        large[start + block.large] = true;
        index += block.length;
        rowsUntilBlock = rowsBetween;
        placed += 1;
        continue;
      }
    } else {
      rowsUntilBlock -= 1;
    }
    index += columns;
  }

  return large;
}

export interface TileLayout {
  /** Grid span classes for the tile's `<li>`. */
  className: string;
  /** `sizes` for the tile's image: its rendered width at each breakpoint. */
  sizes: string;
}

/*
 * Rendered widths, from the grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`
 * with `gap-2 md:gap-3` inside the `shell` (gutter 20px → 32px, content width
 * capped at 1216px). Measured in the browser at 390, 768, 1280 and 1920px.
 */
const SIZES = {
  wide: { small: "295px", large: "602px" },
  four: { small: "calc(25vw - 25px)", large: "calc(50vw - 38px)" },
  three: { small: "calc(33.3vw - 24px)", large: "calc(66.6vw - 36px)" },
  two: { small: "calc(50vw - 24px)", large: "calc(100vw - 40px)" },
} as const;

/**
 * Layout of every tile, in order. `eligible[i]` says whether photograph `i`
 * may be enlarged (`holdsUpLarge`).
 */
export function galleryLayout(eligible: readonly boolean[]): TileLayout[] {
  const two = largeTiles(2, eligible);
  const three = largeTiles(3, eligible);
  const four = largeTiles(4, eligible);

  return eligible.map((_, index) => {
    const className = [
      two[index] ? "col-span-2 row-span-2" : "",
      three[index] ? "sm:col-span-2 sm:row-span-2" : "sm:col-span-1 sm:row-span-1",
      four[index] ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1 lg:row-span-1",
    ]
      .filter(Boolean)
      .join(" ");

    const sizes = [
      `(min-width: 1280px) ${four[index] ? SIZES.wide.large : SIZES.wide.small}`,
      `(min-width: 1024px) ${four[index] ? SIZES.four.large : SIZES.four.small}`,
      `(min-width: 640px) ${three[index] ? SIZES.three.large : SIZES.three.small}`,
      two[index] ? SIZES.two.large : SIZES.two.small,
    ].join(", ");

    return { className, sizes };
  });
}
