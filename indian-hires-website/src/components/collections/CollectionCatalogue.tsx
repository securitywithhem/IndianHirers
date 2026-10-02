"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition, type MouseEvent, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { LayoutItem, LayoutPresence, LayoutScope, MotionMaxProvider } from "@/components/motion/engine";
import { buttonVariants } from "@/components/ui/button-variants";
import { ITEM_GRID_CLASS, ITEM_LIST_CLASS } from "./classes";
import { FilterBar, type FilterSelection } from "./FilterBar";
import { ItemCard } from "./ItemCard";
import { ItemRow } from "./ItemRow";
import { OutboundLink } from "./OutboundLink";
import { ITEM_PARAM, type CatalogueProps, type Facet, type FacetKey } from "./types";

/* Fetched when an item is first opened, not before. */
const ItemDrawer = dynamic(() => import("./ItemDrawer").then((loaded) => loaded.ItemDrawer), { ssr: false });

const TRIGGER = "data-item-trigger";

/** The filter values in the URL that this collection actually offers. */
function readSelection(params: URLSearchParams, facets: Facet[]): FilterSelection {
  const selection: FilterSelection = {};
  facets.forEach((facet) => {
    const value = params.get(facet.key);
    if (value !== null && facet.options.some((option) => option.value === value)) {
      selection[facet.key] = value;
    }
  });
  return selection;
}

/* The layout engine (and its async feature chunk) only where something can
 * re-flow: a collection with nothing to filter never asks for it. */
function LayoutMotion({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  if (!enabled) return <>{children}</>;
  return (
    <MotionMaxProvider>
      <LayoutScope>{children}</LayoutScope>
    </MotionMaxProvider>
  );
}

/**
 * The interactive catalogue of one collection: filter chips, the grid (or the
 * text list), the empty-result state and the item drawer.
 *
 * State lives in the URL, so a view can be shared and the back button works:
 * `?material=…&finish=…&piece=…` for the filters, `?item=<id>` for the open
 * item. A filter change replaces the history entry (`router.replace`, no
 * scroll); the chips answer at once from an optimistic copy while that
 * navigation is pending. Opening an item pushes an entry, so Back closes it.
 *
 * Matching is not decided here: each option carries the ids `filterItems`
 * returned for it on the server, and a combination is their intersection.
 */
export function CollectionCatalogue({
  items,
  facets,
  copy,
  headingLevel,
  layout,
  priorityIds,
  placeholder,
}: CatalogueProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasDrawer = layout === "grid";

  /* ---- filters ---- */
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<FilterSelection | null>(null);
  const urlSelection = useMemo(() => readSelection(searchParams, facets), [searchParams, facets]);
  const selection = pending && optimistic !== null ? optimistic : urlSelection;

  const hrefFor = useCallback(
    (next: FilterSelection, itemId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      facets.forEach((facet) => {
        const value = next[facet.key];
        if (value === undefined) params.delete(facet.key);
        else params.set(facet.key, value);
      });
      if (itemId === null) params.delete(ITEM_PARAM);
      else params.set(ITEM_PARAM, itemId);
      const query = params.toString();
      return query === "" ? pathname : `${pathname}?${query}`;
    },
    [facets, pathname, searchParams],
  );

  const applySelection = (next: FilterSelection) => {
    setOptimistic(next);
    startTransition(() => {
      router.replace(hrefFor(next, null), { scroll: false });
    });
  };

  const onSelect = (key: FacetKey, value: string | null) => {
    const next: FilterSelection = { ...selection };
    if (value === null) delete next[key];
    else next[key] = value;
    applySelection(next);
  };

  const visible = useMemo(() => {
    const allowed = facets.flatMap((facet) => {
      const value = selection[facet.key];
      const option = value === undefined ? undefined : facet.options.find((candidate) => candidate.value === value);
      return option === undefined ? [] : [option.ids];
    });
    return items.filter((item) => allowed.every((ids) => ids.indexOf(item.id) !== -1));
  }, [facets, items, selection]);

  /* ---- item drawer (photograph cards only) ---- */
  const openId = hasDrawer ? searchParams.get(ITEM_PARAM) : null;
  const openItem = useMemo(
    () => (openId === null ? null : (items.find((item) => item.id === openId) ?? null)),
    [items, openId],
  );
  const [drawerRequested, setDrawerRequested] = useState(false);
  if (openItem !== null && !drawerRequested) setDrawerRequested(true);
  /* True when this page pushed the history entry of the open item: closing is then Back. */
  const pushedHere = useRef(false);

  useEffect(() => {
    if (openItem === null) pushedHere.current = false;
  }, [openItem]);

  const onOpen = (itemId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    /* A modified click keeps the browser's own behaviour (new tab, new window). */
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    pushedHere.current = true;
    /* The native History API: Next.js keeps `useSearchParams` in step with it,
     * with no request to the server, so the drawer opens at once. */
    window.history.pushState(null, "", hrefFor(selection, itemId));
  };

  const closeItem = useCallback(() => {
    if (pushedHere.current) {
      pushedHere.current = false;
      window.history.back();
    } else {
      /* Arrived on a shared `?item=` link: there is no entry of ours to go back to. */
      window.history.replaceState(null, "", hrefFor(urlSelection, null));
    }
  }, [hrefFor, urlSelection]);

  const returnFocus = useCallback((itemId: string) => {
    const container = containerRef.current;
    if (container === null) return;
    const trigger = Array.from(container.querySelectorAll<HTMLElement>(`[${TRIGGER}]`)).find(
      (element) => element.getAttribute(TRIGGER) === itemId,
    );
    /* The card can be gone if the address changed underneath: fall back to the first control. */
    (trigger ?? container.querySelector<HTMLElement>("button, a[href]"))?.focus();
  }, []);

  return (
    <div ref={containerRef} className="contents">
      <LayoutMotion enabled={facets.length > 0}>
        {facets.length > 0 ? (
          <FilterBar
            facets={facets}
            selection={selection}
            copy={copy.filters}
            shown={visible.length}
            onSelect={onSelect}
            onClear={() => applySelection({})}
          />
        ) : null}

        <ul className={hasDrawer ? ITEM_GRID_CLASS : ITEM_LIST_CLASS} hidden={!hasDrawer && visible.length === 0}>
          <LayoutPresence>
            {visible.map((item) => (
              <LayoutItem as="li" key={item.id}>
                {hasDrawer ? (
                  <ItemCard
                    item={item}
                    copy={copy.card}
                    headingLevel={headingLevel}
                    placeholder={placeholder}
                    href={hrefFor(selection, item.id)}
                    onOpen={onOpen(item.id)}
                    priority={priorityIds.indexOf(item.id) !== -1}
                  />
                ) : (
                  <ItemRow item={item} copy={copy.card} headingLevel={headingLevel} />
                )}
              </LayoutItem>
            ))}
          </LayoutPresence>
        </ul>
      </LayoutMotion>

      {visible.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-card border border-hairline/40 bg-card p-6 text-card-foreground md:p-8">
          <h3 className="type-h4 text-heading">{copy.filters.emptyHeading}</h3>
          <p className="type-small max-w-measure text-muted-foreground">{copy.filters.emptyBody}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={() => applySelection({})} className={buttonVariants({ variant: "outline" })}>
              {copy.filters.clear}
            </button>
            <OutboundLink
              href={copy.filters.askHref}
              newTabNote={copy.newTabNote}
              className={buttonVariants({ variant: "whatsapp" })}
            >
              <MessageCircle aria-hidden="true" />
              {copy.filters.askCta}
            </OutboundLink>
          </div>
        </div>
      ) : null}

      {drawerRequested ? (
        <ItemDrawer
          item={openItem}
          copy={copy.drawer}
          newTabNote={copy.newTabNote}
          placeholder={placeholder}
          onClose={closeItem}
          onExitComplete={returnFocus}
        />
      ) : null}
    </div>
  );
}
