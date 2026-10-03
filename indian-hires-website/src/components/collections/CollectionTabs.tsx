import Link from "next/link";
import { catalogueCopy, collections, type CollectionSlug } from "@/content/collections";
import { collectionPath, routes } from "@/content/site";
import { COLLECTION_TAB_CLASS } from "./classes";
import { TabStrip } from "./TabStrip";

export interface CollectionTabsProps {
  /** The collection whose page this is; null on the catalogue landing page. */
  current: CollectionSlug | null;
}

/**
 * One row of links to every collection, on both catalogue routes: "All" and
 * the eight collections, the current one marked `aria-current="page"`. Any
 * collection is one tap from any other.
 *
 * It sticks under the fixed header (`top-header`) once the page's maroon band
 * has scrolled away — by then the header is solid ivory, and the two read as
 * one bar. That holds on a phone too (the owner's decision, R5), where the
 * header, this row and the bottom bar together take 193px. Below the width
 * that fits them, the tabs scroll sideways inside the row with scroll
 * snap; the page itself never scrolls sideways.
 *
 * The row is opaque ivory, so its text pairs are the ordinary ones on
 * `ivory-50` whatever scrolls beneath it.
 *
 * These are links between pages, so it is a `<nav>` of links, not an ARIA
 * tablist. They are not prefetched: nine links are in view the moment either
 * catalogue page opens, and prefetching them would fetch every collection
 * (about 100 kB) on a phone before the visitor has chosen one. Must be a direct child of the page, or `sticky` has nothing to
 * travel in.
 */
export function CollectionTabs({ current }: CollectionTabsProps) {
  const { tabs } = catalogueCopy;

  return (
    <nav
      aria-label={tabs.navLabel}
      className="sticky top-header z-bar border-b border-hairline/40 bg-background"
    >
      {/* The vertical padding keeps the focus ring inside the scroll box. */}
      <TabStrip className="shell flex snap-x snap-proximity scroll-px-gutter gap-2 overflow-x-auto py-1.5 [scrollbar-width:none] lg:justify-center [&::-webkit-scrollbar]:hidden">
        {/* -ml-3: the first label, not its padding, sits on the page gutter. */}
        <li className="-ml-3 shrink-0 snap-start lg:ml-0">
          <Link
            href={routes.collections}
            prefetch={false}
            aria-current={current === null ? "page" : undefined}
            className={COLLECTION_TAB_CLASS}
          >
            {tabs.all}
          </Link>
        </li>
        {collections.map((collection) => (
          <li key={collection.slug} className="shrink-0 snap-start">
            <Link
              href={collectionPath(collection.slug)}
              prefetch={false}
              aria-current={collection.slug === current ? "page" : undefined}
              className={COLLECTION_TAB_CLASS}
            >
              {tabs.labels[collection.slug]}
            </Link>
          </li>
        ))}
      </TabStrip>
    </nav>
  );
}
