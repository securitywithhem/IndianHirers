/**
 * Class strings for the catalogue's client components. They are written out
 * in full, never merged: client code joins classes with `cx` (no
 * tailwind-merge in the browser), so a recipe plus an override would leave
 * both classes on the element.
 */

/** Docs/UI_UX_V2.md §7.3, standalone text link: 44px tall, maroon, gold underline. */
export const TEXT_ACTION_CLASS =
  "type-button focus-ring inline-flex min-h-11 items-center gap-2 rounded-sm text-link underline decoration-hairline/60 underline-offset-4 transition-colors duration-hover ease-royal hover:decoration-link";

/** §7.2 outline button at 44px that fills when pressed: the "Add to quote" toggle. */
export const TOGGLE_CLASS =
  "type-button focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary bg-transparent px-3 py-2 text-center text-primary select-none transition-colors duration-hover ease-royal hover:bg-primary hover:text-primary-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground [&_svg]:size-5 [&_svg]:shrink-0";

/** §7.5 filter chip. The recipe lives with the `Chip` primitive; one string, one place. */
export { CHIP_CLASS } from "@/components/ui/chip";

/** Two columns on a phone, three from `md`, four from `lg`. `relative` is for `LayoutPresence`. */
export const ITEM_GRID_CLASS = "relative grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8";

/** The text list of a collection without photographs: one ivory panel, hairlines between rows. */
export const ITEM_LIST_CLASS =
  "relative flex flex-col divide-y divide-hairline/40 rounded-card border border-hairline/40 bg-card px-5 text-card-foreground shadow-card md:px-8";

/** Filter bar above the items. Tight on a phone, so the first row stays on the first screen. */
export const CATALOGUE_STACK_CLASS = "flex flex-col gap-4 md:gap-8";

/** Collection arch tiles: two columns on a phone, four from `md`. */
export const COLLECTION_TILE_GRID_CLASS = "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:gap-8";

/** `sizes` of a tile's arch image in that grid (the tile's own padding and border taken off). */
export const COLLECTION_TILE_SIZES =
  "(min-width: 1280px) 238px, (min-width: 768px) calc(24.4vw - 68px), calc(48.9vw - 58px)";
