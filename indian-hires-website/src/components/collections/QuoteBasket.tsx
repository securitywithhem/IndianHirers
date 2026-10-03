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
import type { BasketCopyView, BasketEntry } from "./types";

/* Not copy: the key the list is stored under for the life of the tab. */
const STORAGE_KEY = "indian-hirers:quote-list";
const NOTE_STORAGE_KEY = "indian-hirers:quote-note";

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
