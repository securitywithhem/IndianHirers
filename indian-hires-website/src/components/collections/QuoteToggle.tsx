"use client";

import { Check, Plus } from "lucide-react";
import { cx } from "@/lib/cx";
import { TOGGLE_CLASS } from "./classes";
import { useQuoteBasket } from "./QuoteBasket";

export interface QuoteToggleProps {
  itemId: string;
  /** `id` of the element that names the item (the card title, the dialog heading). */
  describedBy: string;
  /** Layout only (width); the recipe is fixed. */
  className?: string;
}

/**
 * "Add to quote" on a card, a list row and in the item drawer. A toggle
 * button: the visible label is its name ("Add to quote" / "Added"),
 * `aria-pressed` carries the state and the item's title describes it, so the
 * name always contains what is on screen.
 */
export function QuoteToggle({ itemId, describedBy, className }: QuoteToggleProps) {
  const { has, toggle, copy } = useQuoteBasket();
  const added = has(itemId);
  const Icon = added ? Check : Plus;

  return (
    <button
      type="button"
      aria-pressed={added}
      aria-describedby={describedBy}
      data-focus-key={`quote-${itemId}`}
      onClick={() => toggle(itemId)}
      className={cx(TOGGLE_CLASS, className)}
    >
      <Icon aria-hidden="true" className="hidden sm:block" />
      {added ? copy.added : copy.addToQuote}
    </button>
  );
}
