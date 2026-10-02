import { TEXT_ACTION_CLASS } from "./classes";
import { itemTitleId } from "./ItemCard";
import { OutboundLink } from "./OutboundLink";
import { QuoteToggle } from "./QuoteToggle";
import type { CatalogueItemView, ItemCardCopy, ItemHeadingLevel } from "./types";

export interface ItemRowProps {
  item: CatalogueItemView;
  copy: ItemCardCopy;
  /** Tag of the title; the type role stays `type-h4`. */
  headingLevel: ItemHeadingLevel;
}

/**
 * One row of the text list shown for a collection that has no photographs:
 * the name, what is confirmed about it, "Rates on request", and the same two
 * actions as a card. No image box and no drawer — there is nothing more to
 * show than the row already says.
 *
 * No directive of its own, like `ItemCard`.
 */
export function ItemRow({ item, copy, headingLevel }: ItemRowProps) {
  const Heading = headingLevel;
  const titleId = itemTitleId(item.id);

  return (
    <article className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="flex flex-col gap-1">
        <Heading id={titleId} className="type-h4 text-heading">
          {item.name}
        </Heading>
        {item.specs ? <p className="type-small text-muted-foreground">{item.specs}</p> : null}
        {item.piecesSummary ? <p className="type-small text-muted-foreground">{item.piecesSummary}</p> : null}
        <p className="type-caption text-kicker">{copy.ratesOnRequest}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2">
        <QuoteToggle itemId={item.id} describedBy={titleId} className="min-w-40" />
        <OutboundLink
          href={item.askHref}
          aria-label={item.askLabel}
          data-focus-key={`ask-${item.id}`}
          className={TEXT_ACTION_CLASS}
        >
          {copy.askOnWhatsApp}
        </OutboundLink>
      </div>
    </article>
  );
}
