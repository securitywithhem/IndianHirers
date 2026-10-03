"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { MessageCircle, Trash2, X } from "lucide-react";
import { SlidePanel } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button-variants";
import { whatsappUrl } from "@/lib/links";
import { shell, whatsappMessages, type QuoteLine } from "@/content/site";
import { Label } from "@/components/ui/label";
import { NOTE_FIELD_CLASS, TEXT_ACTION_CLASS } from "./classes";
import { OutboundLink } from "./OutboundLink";
import { QuoteBasketAnnouncer, useQuoteBasket } from "./QuoteBasket";
import { useModalDialog, usePanelSide } from "./useModalDialog";

export interface QuoteSheetProps {
  /** `id` of the dialog; the basket button points at it with `aria-controls`. */
  id: string;
  open: boolean;
  onClose: () => void;
  /** After the sheet has left: return focus to the basket button. */
  onExitComplete: () => void;
}

const TITLE_ID = "quote-list-title";
const NOTE_ID = "quote-list-note";
const NOTE_HINT_ID = "quote-list-note-hint";
const REMOVE = "data-remove-item";

/**
 * The quote list: every item with its collection, a remove control each, a
 * free-text field for the event date and guest count, "Clear list", and one
 * action — send it all on WhatsApp as a single message. The message is
 * `whatsappMessages.basketQuote(lines, note)`, the builder behind
 * `buildWhatsAppQuoteUrl` in `@/lib/catalogue`; the link is
 * `whatsappUrl(message)`, which is the contact page when no number is
 * configured.
 *
 * Loaded the first time the list is opened (it is the only catalogue client
 * component that reads `@/content/site`, for the message builder), so none of
 * it is part of the route's first load.
 */
export function QuoteSheet({ id, open, onClose, onExitComplete }: QuoteSheetProps) {
  const { ids, entries, copy, remove, clear, note, setNote } = useQuoteBasket();
  const panelRef = useRef<HTMLDivElement>(null);
  const side = usePanelSide();
  useModalDialog(open, panelRef, onClose);

  /* Stable ref callback: runs once, when the panel mounts into the portal. */
  const focusOnMount = useCallback((node: HTMLButtonElement | null) => {
    node?.focus({ preventScroll: true });
  }, []);

  const listed = ids.flatMap((itemId) => {
    const entry = entries[itemId];
    return entry === undefined ? [] : [{ itemId, entry }];
  });
  const lines: QuoteLine[] = listed.map(({ entry }) => ({
    name: entry.name,
    collectionTitle: entry.collectionTitle,
  }));

  /* Removing a row removes the button that had focus. Focus goes to the remove
   * button of the row that takes its place (or the one before it); with the
   * list empty, to the close button. */
  const removeItem = (itemId: string) => {
    const panel = panelRef.current;
    const rows = Array.from(panel?.querySelectorAll<HTMLElement>(`[${REMOVE}]`) ?? []);
    const index = rows.findIndex((row) => row.getAttribute(REMOVE) === itemId);
    const next = rows[index + 1] ?? rows[index - 1] ?? panel?.querySelector<HTMLElement>("button");
    remove(itemId);
    next?.focus({ preventScroll: true });
  };

  return (
    <SlidePanel
      ref={panelRef}
      open={open}
      side={side}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      className="flex flex-col gap-4 rounded-t-card bg-card px-gutter pb-[max(1.5rem,env(safe-area-inset-bottom))] text-card-foreground md:max-w-md md:rounded-none md:px-8"
      onBackdropClick={onClose}
      onExitComplete={onExitComplete}
    >
      <div className="sticky top-0 z-10 -mx-gutter flex items-center justify-between gap-4 border-b border-hairline/40 bg-card px-gutter py-2 md:-mx-8 md:px-8">
        <h2 id={TITLE_ID} className="type-h3 text-heading">
          {copy.title}
        </h2>
        <button
          ref={focusOnMount}
          type="button"
          aria-label={copy.closeLabel}
          onClick={onClose}
          className="focus-ring -mr-2 grid size-11 shrink-0 place-items-center rounded-md text-foreground"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </div>

      {listed.length > 0 ? (
        <>
          <p className="type-small text-muted-foreground">{copy.lead}</p>
          <ul className="flex flex-col">
            {listed.map(({ itemId, entry }) => (
              <li key={itemId} className="flex items-center gap-3 border-b border-border py-2">
                <div className="min-w-0 flex-1">
                  <p className="type-body font-medium text-foreground">{entry.name}</p>
                  <p className="type-caption text-muted-foreground">{entry.collectionTitle}</p>
                </div>
                <button
                  type="button"
                  aria-label={entry.removeLabel}
                  data-remove-item={itemId}
                  onClick={() => removeItem(itemId)}
                  className="focus-ring grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-hover ease-royal hover:text-foreground"
                >
                  <Trash2 aria-hidden="true" className="size-5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <Label htmlFor={NOTE_ID}>{copy.noteLabel}</Label>
            <textarea
              id={NOTE_ID}
              rows={3}
              maxLength={copy.noteMaxLength}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-describedby={NOTE_HINT_ID}
              className={NOTE_FIELD_CLASS}
            />
            <p id={NOTE_HINT_ID} className="type-caption text-muted-foreground">
              {copy.noteHint}
            </p>
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between gap-4">
              <p className="type-small text-muted-foreground">{copy.counts[listed.length]}</p>
              <button type="button" onClick={clear} className={TEXT_ACTION_CLASS}>
                {copy.clear}
              </button>
            </div>
            <OutboundLink
              href={whatsappUrl(whatsappMessages.basketQuote(lines, note))}
              newTabNote={shell.newTabNote}
              className={buttonVariants({ variant: "whatsapp" })}
            >
              <MessageCircle aria-hidden="true" />
              {copy.send}
            </OutboundLink>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start gap-3 py-4">
          <h3 className="type-h4 text-heading">{copy.emptyHeading}</h3>
          <p className="type-small text-muted-foreground">{copy.emptyBody}</p>
          <Link href={copy.browseHref} onClick={onClose} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {copy.browseCta}
          </Link>
        </div>
      )}

      <QuoteBasketAnnouncer />
    </SlidePanel>
  );
}
