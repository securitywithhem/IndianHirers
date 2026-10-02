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
 * Below `md` every group sits in ONE row that scrolls sideways inside the page
 * gutter (a plain scroll; the page itself never scrolls sideways), so the
 * first cards stay on the first screen; from `md` each group is a row of its
 * own and the chips wrap.
 */
export function FilterBar({ facets, selection, copy, shown, onSelect, onClear }: FilterBarProps) {
  const filtered = facets.some((facet) => selection[facet.key] !== undefined);

  const chip = (facet: Facet, value: string | null, label: string) => {
    const pressed = (selection[facet.key] ?? null) === value;
    return (
      <li key={value ?? ""} className="shrink-0">
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
      {/* The vertical padding keeps the focus ring inside the scroll box. */}
      <div className="-mx-gutter flex gap-x-6 overflow-x-auto px-gutter py-1.5 md:mx-0 md:flex-col md:gap-y-3 md:overflow-visible md:p-0">
        {facets.map((facet) => {
          const labelId = `filter-${facet.key}`;
          return (
            <div
              key={facet.key}
              role="group"
              aria-labelledby={labelId}
              className="flex shrink-0 items-center gap-3 md:shrink md:items-baseline md:gap-4"
            >
              <p id={labelId} className="type-small shrink-0 font-medium text-foreground md:w-20">
                {facet.label}
              </p>
              <ul className="flex gap-2 md:flex-wrap">
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
