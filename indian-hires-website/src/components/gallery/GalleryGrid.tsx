"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cx } from "@/lib/cx";
import { getMotionPreference } from "@/lib/useMotionPreference";
import type {
  SharedZoomBackdropProps,
  SharedZoomPresenceProps,
  SharedZoomProps,
} from "@/components/motion/engine";

/** One photograph, with every string already built on the server. */
export interface GalleryTile {
  /** Unique on the page: it is also the shared-zoom id. */
  id: string;
  image: { src: string; alt: string; width: number; height: number; blurDataURL: string };
  /** Shown under the photograph in the viewer. */
  caption: string;
  /** aria-label of the tile button. */
  openLabel: string;
  /** "Image 3 of 21". */
  positionLabel: string;
  /** Link from the viewer to where the piece lives; null when there is none. */
  link: { href: string; label: string } | null;
  /** Grid span classes and image `sizes`, from `galleryLayout()`. */
  className: string;
  sizes: string;
}

export interface GalleryLabels {
  /** aria-label of the dialog. */
  dialog: string;
  close: string;
  previous: string;
  next: string;
}

export interface GalleryGridProps {
  tiles: GalleryTile[];
  labels: GalleryLabels;
  /** Index of the one tile that is the route's LCP image, if this grid has it. */
  priorityIndex?: number;
}

/**
 * The parts of the animation engine the viewer uses. The engine is NOT in
 * this file's bundle: it is fetched once the page is idle, and never for a
 * visitor on the reduced-motion path. Until it arrives (and without it) the
 * stand-ins below render the same elements with no motion, so the viewer
 * works from the first tap either way.
 */
interface ZoomKit {
  Provider: ComponentType<{ children: ReactNode }>;
  Source: ComponentType<SharedZoomProps>;
  Target: ComponentType<SharedZoomProps>;
  Backdrop: ComponentType<SharedZoomBackdropProps>;
  Presence: ComponentType<SharedZoomPresenceProps>;
}

function PlainBox({ className, children }: SharedZoomProps) {
  return <div className={className}>{children}</div>;
}

function PlainBackdrop({ className, onClick }: SharedZoomBackdropProps) {
  return <div aria-hidden="true" className={className} onClick={onClick} />;
}

function PlainPresence({ children }: SharedZoomPresenceProps) {
  return <>{children}</>;
}

const PLAIN_KIT: ZoomKit = {
  Provider: Fragment,
  Source: PlainBox,
  Target: PlainBox,
  Backdrop: PlainBackdrop,
  Presence: PlainPresence,
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const TILE_INDEX = "data-tile-index";

/* The viewer's fixed rows: a bar for the close button, the photograph, and
 * the caption with the pager. The photograph's box is sized from these, so it
 * is the same box whether or not the bars are on screen. */
const CHROME_HEIGHT = "17rem";
const MAX_WIDTH = "48rem";

/* How long to leave the main thread alone before fetching the engine where
 * `requestIdleCallback` does not exist. */
const IDLE_FALLBACK_MS = 1500;

function aspectRatio(image: GalleryTile["image"]): string {
  return `${image.width} / ${image.height}`;
}

/**
 * The gallery: a grid of photographs, each a button that opens the viewer.
 *
 * Without JavaScript and under reduced motion it is simply the complete grid
 * (every box reserved by its photograph's own ratio, every image with a blur
 * placeholder). With motion, the tile grows into the viewer and shrinks back
 * (`SharedZoom*`), once the engine has been fetched in idle time.
 *
 * The viewer is the dialog contract from `.claude/rules/a11y.md`:
 * - `role="dialog"`, `aria-modal`, labelled; portalled to `<body>`, above everything;
 * - focus moves to the close button and Tab is trapped inside;
 * - Esc, the close button and the scrim close it; Left / Right move between
 *   photographs, as do the previous / next buttons; nothing advances by itself;
 * - while open, the rest of the page is `inert` and does not scroll;
 * - the position ("Image 3 of 21") is a polite live region;
 * - once closed, focus returns to the tile that opened it.
 */
export function GalleryGrid({ tiles, labels, priorityIndex }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  /* The photograph is still shrinking back into its tile (engine only). */
  const [closing, setClosing] = useState(false);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  /* The engine once fetched, and the engine once in use: it is swapped in only
   * while the viewer is shut, because the swap remounts the grid. */
  const [fetchedKit, setFetchedKit] = useState<ZoomKit | null>(null);
  const [kit, setKit] = useState<ZoomKit>(PLAIN_KIT);

  const listRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  /* Index of the tile that opened the viewer; it gets focus back. */
  const openerIndex = useRef<number | null>(null);
  const restoreFocus = useRef(false);
  /* Index of the tile that had focus when the engine was swapped in. */
  const focusAfterSwap = useRef<number | null>(null);

  const animated = kit !== PLAIN_KIT;
  const total = tiles.length;
  const open = openIndex !== null;
  const current = openIndex === null ? undefined : tiles[openIndex];

  const focusTile = useCallback((index: number | null) => {
    if (index === null) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[${TILE_INDEX}="${index}"]`)
      ?.focus({ preventScroll: true });
  }, []);

  /* A node of our own in <body>: outside the page's stacking contexts, and the
   * one thing that stays live while everything else is inert. */
  useEffect(() => {
    const node = document.createElement("div");
    node.setAttribute("data-lightbox-root", "");
    document.body.appendChild(node);
    setPortalNode(node);
    return () => node.remove();
  }, []);

  /* Fetch the engine when the page is idle. Reduced motion: never. A failed
   * import (offline, a blocked chunk) leaves the plain viewer in place. */
  useEffect(() => {
    if (getMotionPreference()) return;

    let live = true;
    const load = () => {
      import("@/components/motion/engine")
        .then((engine) => {
          if (!live) return;
          setFetchedKit({
            Provider: engine.MotionMaxProvider,
            Source: engine.SharedZoomSource,
            Target: engine.SharedZoomTarget,
            Backdrop: engine.SharedZoomBackdrop,
            Presence: engine.SharedZoomPresence,
          });
        })
        .catch(() => undefined);
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(load, { timeout: 3000 });
      return () => {
        live = false;
        window.cancelIdleCallback(handle);
      };
    }
    const timer = window.setTimeout(load, IDLE_FALLBACK_MS);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, []);

  /* Only ever reachable while the viewer is open: Esc, the close button, the scrim. */
  const close = useCallback(() => {
    restoreFocus.current = true;
    /* With the engine, the viewer stays mounted until the zoom back has finished. */
    setClosing(animated);
    setOpenIndex(null);
  }, [animated]);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((index) => (index === null ? index : (index + delta + total) % total));
    },
    [total],
  );

  const handleExitComplete = useCallback(() => setClosing(false), []);

  /* Stable ref callback: runs once, when the close button mounts. */
  const focusOnMount = useCallback((node: HTMLButtonElement | null) => {
    node?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        step(event.key === "ArrowRight" ? 1 : -1);
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (dialog === null) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (first === undefined || last === undefined) {
        event.preventDefault();
        return;
      }

      const active = document.activeElement;
      if (!dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const inerted: HTMLElement[] = [];
    Array.from(document.body.children).forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      if (element.hasAttribute("data-lightbox-root") || element.inert) return;
      element.inert = true;
      inerted.push(element);
    });

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inerted.forEach((element) => {
        element.inert = false;
      });
      root.style.overflow = previousOverflow;
    };
  }, [open, close, step]);

  /* Declared after the effect above, so the page is no longer inert when this
   * runs: once the viewer has gone, focus returns to the tile that opened it. */
  useEffect(() => {
    if (open || closing || !restoreFocus.current) return;
    restoreFocus.current = false;
    focusTile(openerIndex.current);
  }, [open, closing, focusTile]);

  /* Swap the engine in, once, while the viewer is shut. Declared after the
   * effect above, so a tile that has just been given focus back keeps it. */
  useEffect(() => {
    if (fetchedKit === null || animated || open || closing) return;
    const focused = document.activeElement?.closest(`[${TILE_INDEX}]`)?.getAttribute(TILE_INDEX);
    focusAfterSwap.current = focused === null || focused === undefined ? null : Number(focused);
    setKit(fetchedKit);
  }, [fetchedKit, animated, open, closing]);

  /* The swap remounted the tiles: give focus back to the one that had it. */
  useLayoutEffect(() => {
    if (!animated) return;
    focusTile(focusAfterSwap.current);
    focusAfterSwap.current = null;
  }, [animated, focusTile]);

  const { Provider, Source, Target, Backdrop, Presence } = kit;

  return (
    <Provider>
      <ul ref={listRef} className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
        {tiles.map((tile, index) => (
          <li key={tile.id} className={tile.className} style={{ aspectRatio: aspectRatio(tile.image) }}>
            <button
              type="button"
              aria-label={tile.openLabel}
              aria-haspopup="dialog"
              data-tile-index={index}
              onClick={() => {
                openerIndex.current = index;
                setClosing(false);
                setOpenIndex(index);
              }}
              className="focus-ring group block size-full rounded-card"
            >
              <Source id={tile.id} className="size-full overflow-hidden rounded-card bg-muted">
                <Image
                  src={tile.image.src}
                  alt={tile.image.alt}
                  width={tile.image.width}
                  height={tile.image.height}
                  sizes={tile.sizes}
                  placeholder="blur"
                  blurDataURL={tile.image.blurDataURL}
                  priority={index === priorityIndex}
                  className="size-full object-cover motion-safe:transition-transform motion-safe:duration-zoom motion-safe:ease-royal motion-safe:group-hover:scale-104"
                />
              </Source>
            </button>
          </li>
        ))}
      </ul>

      {portalNode !== null && (open || closing)
        ? createPortal(
            <div
              ref={dialogRef}
              role={open ? "dialog" : undefined}
              aria-modal={open ? true : undefined}
              aria-label={open ? labels.dialog : undefined}
              aria-hidden={open ? undefined : true}
              className={cx(
                "theme-dark fixed inset-0 z-lightbox grid grid-rows-[4rem_minmax(0,1fr)_11rem] overscroll-contain text-foreground",
                !open && "pointer-events-none",
              )}
            >
              {current === undefined ? null : (
                <div className="pointer-events-none relative row-start-1 flex items-center justify-end px-2 sm:px-4">
                  <button
                    ref={focusOnMount}
                    type="button"
                    aria-label={labels.close}
                    onClick={close}
                    className="focus-ring pointer-events-auto grid size-11 place-items-center rounded-md text-foreground transition-colors duration-hover ease-royal hover:text-link"
                  >
                    <X aria-hidden="true" className="size-6" />
                  </button>
                </div>
              )}

              <Presence onExitComplete={handleExitComplete}>
                {current === undefined ? null : (
                  /* Opaque once it has faded in: the caption and controls sit on
                     plain maroon-950 (a measured pair), never over the page. */
                  <Backdrop key="scrim" className="absolute inset-0 -z-10 bg-maroon-950" onClick={close} />
                )}
                {current === undefined ? null : (
                  <div key="stage" className="pointer-events-none relative row-start-2 grid place-items-center px-4">
                    {/* Sized here, from the photograph's own ratio, so the box
                        that zooms never changes shape. */}
                    <div
                      style={{
                        aspectRatio: aspectRatio(current.image),
                        width: `min(100%, ${MAX_WIDTH}, calc((100dvh - ${CHROME_HEIGHT}) * ${current.image.width / current.image.height}))`,
                      }}
                    >
                      <Target
                        key={current.id}
                        id={current.id}
                        className="pointer-events-auto size-full overflow-hidden rounded-card bg-muted shadow-lift"
                      >
                        <Image
                          src={current.image.src}
                          alt={current.image.alt}
                          width={current.image.width}
                          height={current.image.height}
                          sizes="(min-width: 800px) 768px, calc(100vw - 32px)"
                          placeholder="blur"
                          blurDataURL={current.image.blurDataURL}
                          className="size-full object-contain"
                        />
                      </Target>
                    </div>
                  </div>
                )}
              </Presence>

              {current === undefined ? null : (
                <div className="pointer-events-none relative row-start-3 flex flex-col items-center justify-start gap-1 px-4 pt-3 text-center">
                  <h2 className="type-h4 text-heading">{current.caption}</h2>
                  {current.link === null ? null : (
                    <Link
                      href={current.link.href}
                      className="type-button focus-ring pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-sm text-link underline decoration-hairline/60 underline-offset-4 transition-colors duration-hover ease-royal hover:decoration-link"
                    >
                      {current.link.label}
                      <ArrowRight aria-hidden="true" className="size-5" />
                    </Link>
                  )}

                  <div className="pointer-events-auto flex items-center gap-2">
                    {total > 1 ? (
                      <button
                        type="button"
                        aria-label={labels.previous}
                        onClick={() => step(-1)}
                        className="focus-ring grid size-11 place-items-center rounded-md text-primary transition-colors duration-hover ease-royal hover:text-primary-hover"
                      >
                        <ChevronLeft aria-hidden="true" className="size-6" />
                      </button>
                    ) : null}
                    <p
                      aria-live="polite"
                      aria-atomic="true"
                      className="type-small min-w-32 tabular-nums text-muted-foreground"
                    >
                      {current.positionLabel}
                    </p>
                    {total > 1 ? (
                      <button
                        type="button"
                        aria-label={labels.next}
                        onClick={() => step(1)}
                        className="focus-ring grid size-11 place-items-center rounded-md text-primary transition-colors duration-hover ease-royal hover:text-primary-hover"
                      >
                        <ChevronRight aria-hidden="true" className="size-6" />
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>,
            portalNode,
          )
        : null}
    </Provider>
  );
}
