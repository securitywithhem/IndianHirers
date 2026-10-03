"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";
import { SlidePanel } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button-variants";
import { ChipTag } from "@/components/ui/chip";
import { OutboundLink } from "./OutboundLink";
import { QuoteBasketAnnouncer } from "./QuoteBasket";
import { QuoteToggle } from "./QuoteToggle";
import { useModalDialog, usePanelSide } from "./useModalDialog";
import type { CatalogueItemView, ItemDrawerCopyView } from "./types";

export interface ItemDrawerProps {
  /** The item to show; null closes the drawer. */
  item: CatalogueItemView | null;
  copy: ItemDrawerCopyView;
  newTabNote: string;
  /** The crown placeholder, rendered on the server. */
  placeholder: ReactNode;
  onClose: () => void;
  /** After the drawer has left: return focus to the card of this item. */
  onExitComplete: (itemId: string) => void;
}

const TITLE_ID = "item-drawer-title";

/**
 * Details of one catalogue item: a sheet from the bottom on a phone, a drawer
 * from the right from `md`. `SlidePanel` is the motion shell; the dialog
 * contract (label, focus in, focus trap, Esc, inert background, scroll lock)
 * is `useModalDialog` plus the two focus moves here and in the caller.
 *
 * Loaded on demand, so it is never part of the route's first load.
 */
export function ItemDrawer({ item, copy, newTabNote, placeholder, onClose, onExitComplete }: ItemDrawerProps) {
  /* The last item stays rendered while the panel slides out. */
  const [shown, setShown] = useState(item);
  if (item !== null && item !== shown) setShown(item);

  const open = item !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const side = usePanelSide();
  useModalDialog(open, panelRef, onClose);

  /* Stable ref callback: runs once, when the panel mounts into the portal. */
  const focusOnMount = useCallback((node: HTMLButtonElement | null) => {
    node?.focus({ preventScroll: true });
  }, []);

  if (shown === null) return null;
  const { image } = shown;

  return (
    <SlidePanel
      ref={panelRef}
      open={open}
      side={side}
      role="dialog"
      aria-modal="true"
      aria-label={shown.dialogLabel}
      className="flex flex-col gap-5 rounded-t-card bg-card px-gutter pb-[max(1.5rem,env(safe-area-inset-bottom))] text-card-foreground md:max-w-md md:rounded-none md:px-8"
      onBackdropClick={onClose}
      onExitComplete={() => onExitComplete(shown.id)}
    >
      <div className="sticky top-0 z-10 -mx-gutter flex items-center justify-between gap-4 border-b border-hairline/40 bg-card px-gutter py-2 md:-mx-8 md:px-8">
        <h2 id={TITLE_ID} className="type-h3 text-heading">
          {shown.name}
        </h2>
        <button
          ref={focusOnMount}
          type="button"
          aria-label={copy.close}
          onClick={onClose}
          className="focus-ring -mr-2 grid size-11 shrink-0 place-items-center rounded-md text-foreground"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </div>

      <div className="mx-auto w-2/3 shrink-0 md:w-full">
        <div className="relative aspect-square overflow-hidden rounded-card border border-hairline/40 bg-muted">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 384px, 62vw"
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              className="object-cover"
            />
          ) : (
            placeholder
          )}
        </div>
        {image ? null : <p className="type-caption mt-2 text-center text-muted-foreground">{copy.photoPending}</p>}
      </div>

      {/* Only what has been confirmed: an unknown material, finish or piece list is left out. */}
      <dl className="type-small grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2">
        <dt className="text-muted-foreground">{copy.collectionLabel}</dt>
        <dd className="text-foreground">{copy.collectionTitle}</dd>
        {shown.material !== null ? (
          <>
            <dt className="text-muted-foreground">{copy.materialLabel}</dt>
            <dd className="text-foreground">{shown.material}</dd>
          </>
        ) : null}
        {shown.finishes.length > 0 ? (
          <>
            <dt className="text-muted-foreground">{copy.finishLabel}</dt>
            <dd className="flex flex-wrap gap-2">
              {shown.finishes.map((finish) => (
                <ChipTag key={finish}>{finish}</ChipTag>
              ))}
            </dd>
          </>
        ) : null}
      </dl>

      {shown.pieces.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="type-small font-medium text-foreground">{copy.piecesHeading}</h3>
          <ul className="type-small flex flex-wrap gap-2 text-foreground">
            {shown.pieces.map((piece) => (
              <li key={piece} className="rounded-sm border border-border px-2 py-1">
                {piece}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* Nothing confirmed yet: the previous site's card message, as a note. */
        <p role="note" className="type-small rounded-lg border border-hairline/40 bg-muted px-4 py-3 text-foreground">
          {copy.detailPending}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-3 border-t border-hairline/40 pt-4">
        <p className="type-caption text-kicker">{copy.ratesOnRequest}</p>
        <QuoteToggle itemId={shown.id} describedBy={TITLE_ID} className="w-full" />
        <OutboundLink href={shown.askHref} newTabNote={newTabNote} className={buttonVariants({ variant: "whatsapp" })}>
          <MessageCircle aria-hidden="true" />
          {copy.askOnWhatsApp}
        </OutboundLink>
      </div>

      <QuoteBasketAnnouncer />
    </SlidePanel>
  );
}
