import type { MouseEvent, ReactNode } from "react";
import Image from "next/image";
import { cx } from "@/lib/cx";
import { TEXT_ACTION_CLASS } from "./classes";
import { OutboundLink } from "./OutboundLink";
import { QuoteToggle } from "./QuoteToggle";
import type { CatalogueItemView, ItemCardCopy, ItemHeadingLevel } from "./types";

export interface ItemCardProps {
  item: CatalogueItemView;
  copy: ItemCardCopy;
  /** Tag of the title; it follows the page outline. The type role stays `type-h4`. */
  headingLevel: ItemHeadingLevel;
  /** The crown placeholder, for an item without a photograph. */
  placeholder: ReactNode;
  /**
   * Where the title link points: this page with `?item=<id>`. Omitted in the
   * static (server) card, whose title is plain text — without the interactive
   * catalogue there is no drawer for a link to open.
   */
  href?: string;
  /** Opens the item drawer in place. */
  onOpen?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Only for a photograph in the first viewport at 390px. */
  priority?: boolean;
}

/* Measured: the image box is the column minus the card's 1px borders. The
 * page gutter is fluid (15.5px + 1.143vw), hence the odd factors. */
export const ITEM_CARD_SIZES =
  "(min-width: 1280px) 279px, (min-width: 1024px) calc(24.4vw - 34px), (min-width: 768px) calc(32.6vw - 28px), calc(48.9vw - 26px)";

export function itemTitleId(itemId: string): string {
  return `item-title-${itemId}`;
}

/**
 * Catalogue item card (Docs/UI_UX_V2.md §7.4). The photograph is left clear.
 * Up to three controls, none inside another: the title link — stretched over
 * the card — that opens the item's details, the "Add to quote" toggle, and a
 * quiet "Ask on WhatsApp" text link (one tap from a piece to an enquiry).
 *
 * No directive of its own: the server renders it in the static grid and the
 * interactive catalogue renders the same markup on the client.
 */
export function ItemCard({ item, copy, headingLevel, placeholder, href, onOpen, priority = false }: ItemCardProps) {
  const Heading = headingLevel;
  const titleId = itemTitleId(item.id);
  const { image } = item;

  return (
    <article className="card-royal group flex h-full flex-col rounded-card border border-hairline/40 bg-card text-card-foreground shadow-card">
      {/* 4:3 below `md` (the owner's decision, R5): two cards a row on a phone, and
          more of each card on the first screen. The photographs are square, so
          `object-cover` trims their top and bottom there. Square from `md`. */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-card bg-muted md:aspect-square">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={ITEM_CARD_SIZES}
            priority={priority}
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            className="object-cover motion-safe:transition-transform motion-safe:duration-zoom motion-safe:ease-royal motion-safe:group-hover:scale-104"
          />
        ) : (
          <>
            {placeholder}
            <span className="sr-only">{item.placeholderAlt}</span>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 md:p-6">
        <Heading id={titleId} className="type-h4 text-heading">
          {href !== undefined ? (
            <a
              href={href}
              aria-haspopup="dialog"
              data-item-trigger={item.id}
              data-focus-key={`open-${item.id}`}
              onClick={onOpen}
              className="focus-ring rounded-sm after:absolute after:inset-0"
            >
              {item.name}
            </a>
          ) : (
            item.name
          )}
        </Heading>
        {item.specs ? <p className="type-small text-muted-foreground">{item.specs}</p> : null}
        {item.piecesSummary ? (
          <p className="type-small line-clamp-2 text-muted-foreground">{item.piecesSummary}</p>
        ) : null}
        <p className="type-caption text-kicker">{copy.ratesOnRequest}</p>
        <div className="relative z-10 mt-auto flex flex-col gap-2 pt-2">
          <QuoteToggle itemId={item.id} describedBy={titleId} className="w-full" />
          <OutboundLink
            href={item.askHref}
            aria-label={item.askLabel}
            data-focus-key={`ask-${item.id}`}
            className={cx(TEXT_ACTION_CLASS, "justify-center whitespace-nowrap")}
          >
            {copy.askOnWhatsApp}
          </OutboundLink>
        </div>
      </div>
    </article>
  );
}
