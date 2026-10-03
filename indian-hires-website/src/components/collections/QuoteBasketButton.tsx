"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ClipboardList } from "lucide-react";
import { QuoteBasketAnnouncer, useQuoteBasket } from "./QuoteBasket";

/*
 * Its own module so that the basket (state, context, announcer) never imports
 * the sheet: the sheet reads the basket, and this button loads the sheet.
 * Kept in one file with the basket, the two imported each other
 * (scripts/import-cycles.mjs).
 */

const SHEET_ID = "quote-list-sheet";
/* `id` of <main> in the root layout: where focus goes when the basket button
 * has gone (the list was emptied inside the sheet). */
const MAIN_ID = "main-content";

/* The sheet is fetched the first time the list is opened: it is never part of
 * the route's first load. */
const QuoteSheet = dynamic(() => import("./QuoteSheet").then((loaded) => loaded.QuoteSheet), { ssr: false });

/**
 * Floating button that opens the quote list, with a count badge. It sits in
 * the slot the shell reserves (src/components/shared/README.md → Fixed
 * elements): 16px above the mobile bottom bar below `md`, 16px above the
 * floating WhatsApp button from `md`, same 56px width.
 *
 * Hidden while the list is empty — an empty list has nothing to open, and the
 * cards carry the way in. It stays mounted while its sheet is open or closing
 * so focus has somewhere to return to.
 *
 * It is `fixed`, so where it sits in the DOM only decides when Tab reaches it:
 * each catalogue page renders it straight after its catalogue, not at the end
 * of the page.
 */
export function QuoteBasketButton() {
  const { ids, copy } = useQuoteBasket();
  const [open, setOpen] = useState(false);
  /* True from the first open until the sheet has finished leaving. */
  const [sheetPresent, setSheetPresent] = useState(false);
  const [requested, setRequested] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const count = ids.length;

  const close = useCallback(() => setOpen(false), []);

  const onExitComplete = useCallback(() => {
    const trigger = triggerRef.current;
    if (trigger !== null && trigger.isConnected && count > 0) trigger.focus();
    else document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
    setSheetPresent(false);
  }, [count]);

  return (
    <>
      <QuoteBasketAnnouncer />
      {count > 0 || sheetPresent ? (
        <button
          ref={triggerRef}
          type="button"
          aria-label={copy.openLabels[count] ?? copy.openLabels[0]}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? SHEET_ID : undefined}
          /* Below `md` the floating WhatsApp button steps aside for this one
           * (layout/FloatingWhatsApp.tsx reads the marker with `:has()`). */
          data-quote-button=""
          onClick={() => {
            setRequested(true);
            setSheetPresent(true);
            setOpen(true);
          }}
          className="focus-ring fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom))] right-4 z-bar grid size-14 supports-[selector(:has(*))]:bottom-[calc(5rem+env(safe-area-inset-bottom))] place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition-colors duration-hover ease-royal hover:bg-primary-hover md:bottom-24 md:right-6 md:supports-[selector(:has(*))]:bottom-24"
        >
          <ClipboardList aria-hidden="true" className="size-6" />
          <span
            aria-hidden="true"
            className="type-caption absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1 font-semibold text-accent-foreground ring-2 ring-background"
          >
            {count}
          </span>
        </button>
      ) : null}
      {requested ? <QuoteSheet id={SHEET_ID} open={open} onClose={close} onExitComplete={onExitComplete} /> : null}
    </>
  );
}
