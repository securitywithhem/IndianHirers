"use client";

import {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ClipboardList } from "lucide-react";
import type { BasketCopyView, BasketEntry } from "./types";

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

/* Not copy: the key the list is stored under for the life of the tab. */
const STORAGE_KEY = "indian-hirers:quote-list";
const NOTE_STORAGE_KEY = "indian-hirers:quote-note";
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
  /** The visitor's own words: event date and guest count. Sent with the list. */
  note: string;
  setNote: (note: string) => void;
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
function readStored(key: string): unknown {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: readonly string[] | string): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
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
 * collections. Nothing is sent anywhere until the visitor taps "Send on WhatsApp"
 * in the sheet.
 *
 * Of the items only ids are stored. Names and labels come from `entries`, so
 * no item text read back from storage is ever shown or sent, and an unknown id
 * is dropped. The note is the visitor's own text: it is kept as typed, cut to
 * `copy.noteMaxLength`, and only ever rendered as a field value or
 * URL-encoded into the message.
 */
export function QuoteBasketProvider({ entries, copy, children }: QuoteBasketProviderProps) {
  const [ids, setIds] = useState<readonly string[]>([]);
  const [note, setNoteState] = useState("");
  const [restored, setRestored] = useState(false);
  const restoreStarted = useRef(false);
  const [announcement, setAnnouncement] = useState<Announcement>({ text: "", seq: 0 });

  /* The server and the first client render are an empty list; the stored one
   * is read after hydration, so the markup always matches. */
  useEffect(() => {
    if (restoreStarted.current) return;
    restoreStarted.current = true;

    const storedNote = readStored(NOTE_STORAGE_KEY);
    if (typeof storedNote === "string") {
      /* Anything typed before this effect ran wins over the stored note. */
      setNoteState((current) => (current === "" ? storedNote.slice(0, copy.noteMaxLength) : current));
    }

    const stored = readStored(STORAGE_KEY);
    if (Array.isArray(stored)) {
      const known = stored.filter(
        (id): id is string => typeof id === "string" && Object.prototype.hasOwnProperty.call(entries, id),
      );
      /* Stored order first, then anything added before this effect ran; no id twice. */
      setIds((current) => known.concat(current).filter((id, index, all) => all.indexOf(id) === index));
    }
    setRestored(true);
  }, [copy.noteMaxLength, entries]);

  useEffect(() => {
    if (restored) writeStored(STORAGE_KEY, ids);
  }, [ids, restored]);

  useEffect(() => {
    if (restored) writeStored(NOTE_STORAGE_KEY, note);
  }, [note, restored]);

  const setNote = useCallback(
    (next: string) => setNoteState(next.slice(0, copy.noteMaxLength)),
    [copy.noteMaxLength],
  );

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

  /* The note belongs to the list it was written for: both go together. */
  const clear = useCallback(() => {
    setIds([]);
    setNoteState("");
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
      note,
      setNote,
      announcement,
    }),
    [announcement, clear, copy, entries, ids, note, remove, setNote, toggle],
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
