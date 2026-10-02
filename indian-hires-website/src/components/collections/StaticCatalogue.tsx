import { ITEM_GRID_CLASS, ITEM_LIST_CLASS } from "./classes";
import { FilterBar } from "./FilterBar";
import { ItemCard } from "./ItemCard";
import { ItemRow } from "./ItemRow";
import type { CatalogueProps } from "./types";

/**
 * The whole collection, unfiltered, rendered on the server: the filter bar
 * (nothing pressed but "All") when there are filters, and every item — as
 * photograph cards, or as text rows for a collection without photographs.
 *
 * This is what the HTML contains, what a visitor without JavaScript gets, and
 * what stays on screen until the interactive catalogue has loaded and takes
 * its place with the same markup. Card titles are plain text here: only the
 * interactive catalogue has a drawer for a title link to open.
 */
export function StaticCatalogue({ items, facets, copy, headingLevel, layout, priorityIds, placeholder }: CatalogueProps) {
  return (
    <>
      {facets.length > 0 ? (
        <FilterBar facets={facets} selection={{}} copy={copy.filters} shown={items.length} />
      ) : null}
      {layout === "grid" ? (
        <ul className={ITEM_GRID_CLASS}>
          {items.map((item) => (
            <li key={item.id}>
              <ItemCard
                item={item}
                copy={copy.card}
                headingLevel={headingLevel}
                placeholder={placeholder}
                priority={priorityIds.indexOf(item.id) !== -1}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul className={ITEM_LIST_CLASS}>
          {items.map((item) => (
            <li key={item.id}>
              <ItemRow item={item} copy={copy.card} headingLevel={headingLevel} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
