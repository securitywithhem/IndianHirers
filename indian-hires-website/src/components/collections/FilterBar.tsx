import { CHIP_CLASS, TEXT_ACTION_CLASS } from "./classes";
import type { Facet, FacetKey, FilterCopyView } from "./types";

/** The chosen value of each filter group; a missing key means "All". */
export type FilterSelection = Partial<Record<FacetKey, string>>;

export interface FilterBarProps {
  facets: Facet[];
  selection: FilterSelection;
  copy: FilterCopyView;
  /** Number of designs the current selection shows. */
  shown: number;
  /** `value` null = the group's "All" chip. Absent in the static (server) bar. */
  onSelect?: (key: FacetKey, value: string | null) => void;
  onClear?: () => void;
}

/**
 * Filter chips, the result count and "Clear filters".
 *
 * No directive of its own: the server renders it (no handlers, nothing
 * pressed but "All") as part of the static catalogue, so the bar's box is in
 * the first paint, and the interactive catalogue renders the same markup with
 * handlers on the client.
 *
 * Each group is a row of its own, its label always on screen. Below `md` a
 * row's chips scroll sideways, out to the right edge of the page, with scroll
 * snap (a plain scroll; the page itself never scrolls sideways) — a chip cut
 * by the edge is the cue that there are more. From `md` the chips wrap.
 */
export function FilterBar({ facets, selection, copy, shown, onSelect, onClear }: FilterBarProps) {
  const filtered = facets.some((facet) => selection[facet.key] !== undefined);

  const chip = (facet: Facet, value: string | null, label: string) => {
    const pressed = (selection[facet.key] ?? null) === value;
    return (
      <li key={value ?? ""} className="shrink-0 snap-start">
        <button
          type="button"
          aria-pressed={pressed}
          data-focus-key={`chip-${facet.key}-${value ?? ""}`}
          onClick={onSelect ? () => onSelect(facet.key, pressed ? null : value) : undefined}
          className={CHIP_CLASS}
        >
          {label}
        </button>
      </li>
    );
  };

  return (
    <div role="group" aria-label={copy.heading} className="flex flex-col gap-1 md:gap-3">
      <div className="flex flex-col md:gap-3">
        {facets.map((facet) => {
          const labelId = `filter-${facet.key}`;
          return (
            <div
              key={facet.key}
              role="group"
              aria-labelledby={labelId}
              className="flex items-center gap-2 md:items-baseline md:gap-4"
            >
              <p id={labelId} className="type-small w-16 shrink-0 font-medium text-foreground md:w-20">
                {facet.label}
              </p>
              {/* The padding keeps the focus ring inside the scroll box. */}
              <ul className="-mr-gutter flex min-w-0 flex-1 snap-x snap-proximity scroll-pl-1 gap-2 overflow-x-auto py-1.5 pl-1 pr-gutter [scrollbar-width:none] md:mr-0 md:flex-wrap md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden">
                {chip(facet, null, copy.all)}
                {facet.options.map((option) => chip(facet, option.value, option.label))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <p role="status" aria-live="polite" aria-atomic="true" className="type-small text-muted-foreground">
          {copy.resultCounts[shown]}
        </p>
        {filtered ? (
          <button type="button" data-focus-key="chip-clear" onClick={onClear} className={TEXT_ACTION_CLASS}>
            {copy.clear}
          </button>
        ) : null}
      </div>
    </div>
  );
}
