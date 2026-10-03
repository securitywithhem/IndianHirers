"use client";

import { Suspense, lazy, useCallback, useRef, useState } from "react";
import { ClipboardList } from "lucide-react";
import { QuoteBasketAnnouncer, useQuoteBasket } from "./QuoteBasket";

/*
 * Its own module so that the basket (state, context, announcer) never imports
 * the sheet: the sheet reads the basket, and this button loads the sheet.
 * Kept in one file with the basket, the two imported each other
 * (scripts/import-cycles.mjs).
 */

/*
 * The pill, with its label at every width (the owner's decision, R5). Below
 * `md` it takes the floating WhatsApp button's slot, 16px above the bottom
 * bar (one slot higher where `:has()` is not supported and that button
 * cannot step aside); from `md` it sits 16px above that button. On a phone
 * it is about 160px wide and covers a right-column card's "Add to quote"
 * while that button is level with it (docs/OPEN_ISSUES.md E35); the button
 * is clear again a short scroll either way.
 */
const PILL_CLASS =
  "type-button focus-ring fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom))] right-4 z-bar inline-flex min-h-12 items-center gap-2 rounded-full bg-primary py-2 pl-4 pr-5 text-primary-foreground shadow-lift transition-colors duration-hover ease-royal hover:bg-primary-hover supports-[selector(:has(*))]:bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-24 md:right-6 md:supports-[selector(:has(*))]:bottom-24";

const SHEET_ID = "quote-list-sheet";
/* `id` of <main> in the root layout: where focus goes when the basket button
 * has gone (the list was emptied inside the sheet). */
const MAIN_ID = "main-content";

/* The sheet is fetched the first time the list is opened: it is never part of
 * the route's first load. `lazy`, not `next/dynamic`: it is only ever rendered
 * after a click, so nothing needs the loader that `dynamic` would add here. */
const QuoteSheet = lazy(() => import("./QuoteSheet").then((loaded) => ({ default: loaded.QuoteSheet })));

/**
 * Floating pill that opens the quote list: "Quote list (n)". Its visible
 * label is its name. It sits in the slot the shell reserves
 * (src/components/shared/README.md → Fixed elements): 16px above the mobile
 * bottom bar below `md`, 16px above the floating WhatsApp button from `md`.
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
          className={PILL_CLASS}
        >
          <ClipboardList aria-hidden="true" className="size-5 shrink-0" />
          {copy.pillLabels[count] ?? copy.pillLabels[0]}
        </button>
      ) : null}
      {requested ? (
        <Suspense fallback={null}>
          <QuoteSheet id={SHEET_ID} open={open} onClose={close} onExitComplete={onExitComplete} />
        </Suspense>
      ) : null}
    </>
  );
}
