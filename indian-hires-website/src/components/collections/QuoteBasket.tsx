"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { ClipboardList } from "lucide-react";
import type { BasketCopyView, BasketEntry } from "./types";

/* Not copy: the key the list is stored under for the life of the tab. */
const STORAGE_KEY = "indian-hirers:quote-list";
const SHEET_ID = "quote-list-sheet";
/* `id` of <main> in the root layout: where focus goes when the basket button
 * has gone (the list was emptied inside the sheet). */
const MAIN_ID = "main-content";

interface Announcement {
  text: string;
  /** Increases with every announcement, so a repeat is still a change. */
  seq: number;
}

interface QuoteBasketValue {
  /** Ids of the items in the list, in the order they were added. */
  ids: readonly string[];
  entries: Record<string, BasketEntry>;
  copy: BasketCopyView;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  announcement: Announcement;
}

const QuoteBasketContext = createContext<QuoteBasketValue | null>(null);

export function useQuoteBasket(): QuoteBasketValue {
  const value = useContext(QuoteBasketContext);
  if (value === null) throw new Error("useQuoteBasket needs <QuoteBasketProvider> above it");
  return value;
}

/* Storage can be blocked (private mode, a strict browser setting): reading or
 * writing then throws. The list still works for the life of the page. */
function readStored(): unknown {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStored(ids: readonly string[]): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* Nothing to do: the list simply does not survive a reload. */
  }
}

export interface QuoteBasketProviderProps {
  /** Every public item, by id (built on the server). */
  entries: Record<string, BasketEntry>;
  copy: BasketCopyView;
  children: ReactNode;
}

/**
 * The quote list: a client-side list of item ids, kept in React state and
 * mirrored to `sessionStorage` so it survives a reload and a move between
 * collections. Nothing is sent anywhere until the visitor taps "Send list on
 * WhatsApp" in the sheet.
 *
 * Only ids are stored. Names and labels come from `entries`, so nothing read
 * back from storage is ever shown or sent as text, and an unknown id is dropped.
 */
export function QuoteBasketProvider({ entries, copy, children }: QuoteBasketProviderProps) {
  const [ids, setIds] = useState<readonly string[]>([]);
  const [restored, setRestored] = useState(false);
  const restoreStarted = useRef(false);
  const [announcement, setAnnouncement] = useState<Announcement>({ text: "", seq: 0 });

  /* The server and the first client render are an empty list; the stored one
   * is read after hydration, so the markup always matches. */
  useEffect(() => {
    if (restoreStarted.current) return;
    restoreStarted.current = true;

    const stored = readStored();
    if (Array.isArray(stored)) {
      const known = stored.filter(
        (id): id is string => typeof id === "string" && Object.prototype.hasOwnProperty.call(entries, id),
      );
      /* Stored order first, then anything added before this effect ran; no id twice. */
      setIds((current) => known.concat(current).filter((id, index, all) => all.indexOf(id) === index));
    }
    setRestored(true);
  }, [entries]);

  useEffect(() => {
    if (restored) writeStored(ids);
  }, [ids, restored]);

  const announce = useCallback((text: string) => {
    setAnnouncement((previous) => ({ text, seq: previous.seq + 1 }));
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const entry = entries[id];
      if (entry === undefined) return;
      const present = ids.indexOf(id) !== -1;
      setIds(present ? ids.filter((other) => other !== id) : [...ids, id]);
      announce(present ? entry.removedAnnouncement : entry.addedAnnouncement);
    },
    [announce, entries, ids],
  );

  const remove = useCallback(
    (id: string) => {
      const entry = entries[id];
      if (entry === undefined || ids.indexOf(id) === -1) return;
      setIds(ids.filter((other) => other !== id));
      announce(entry.removedAnnouncement);
    },
    [announce, entries, ids],
  );

  const clear = useCallback(() => {
    setIds([]);
    announce(copy.clearedAnnouncement);
  }, [announce, copy.clearedAnnouncement]);

  const value = useMemo<QuoteBasketValue>(
    () => ({
      ids,
      entries,
      copy,
      has: (id: string) => ids.indexOf(id) !== -1,
      toggle,
      remove,
      clear,
      announcement,
    }),
    [announcement, clear, copy, entries, ids, remove, toggle],
  );

  return <QuoteBasketContext.Provider value={value}>{children}</QuoteBasketContext.Provider>;
}

/**
 * Polite live region for changes to the list. One sits beside the basket
 * button; each dialog mounts its own, because the page behind an open dialog
 * is `inert` and an inert live region is not read out. It only speaks about
 * changes made after it mounted.
 */
export function QuoteBasketAnnouncer() {
  const { announcement } = useQuoteBasket();
  const [mountedAt] = useState(announcement.seq);

  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement.seq > mountedAt ? announcement.text : null}
    </p>
  );
}

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
          onClick={() => {
            setRequested(true);
            setSheetPresent(true);
            setOpen(true);
          }}
          className="focus-ring fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-bar grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition-colors duration-hover ease-royal hover:bg-primary-hover md:bottom-24 md:right-6"
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
