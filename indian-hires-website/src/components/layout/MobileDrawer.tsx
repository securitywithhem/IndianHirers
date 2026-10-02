"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SlidePanel } from "@/components/motion";
import { currentState } from "./NavLink";

export interface MobileDrawerLabels {
  open: string;
  close: string;
  /** aria-label of the dialog. */
  dialog: string;
  /** aria-label of the <nav> inside it. */
  nav: string;
}

export interface MobileDrawerProps {
  /** `id` of the dialog; the trigger points at it with `aria-controls` while it is open. */
  id: string;
  nav: readonly { label: string; href: string }[];
  labels: MobileDrawerLabels;
  /** Logo and name for the drawer's top row (server-rendered). */
  brand: ReactNode;
  /** Contact actions at the bottom of the drawer (server-rendered). */
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Tailwind's `lg`: from here the desktop nav replaces the drawer. */
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * The menu button and the navigation drawer it opens (below `lg`).
 *
 * `SlidePanel` is only the motion shell; this component is the dialog
 * contract from `.claude/rules/a11y.md`:
 * - the trigger is a <button> with `aria-expanded`, and `aria-controls` while
 *   the dialog is in the document;
 * - on open, focus moves to the close button and Tab is trapped in the drawer;
 * - Esc, the close button, the backdrop and following a link all close it;
 * - while open, everything else on the page is `inert` and cannot scroll;
 * - once closed, focus returns to the trigger.
 */
export function MobileDrawer({ id, nav, labels, brand, children }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  /* Stable ref callback: runs once, when the panel mounts into the portal. */
  const focusOnMount = useCallback((node: HTMLButtonElement | null) => {
    node?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (panel === null) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (first === undefined || last === undefined) {
        event.preventDefault();
        return;
      }

      const active = document.activeElement;
      if (!panel.contains(active)) {
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

    /* Everything that is on the page now becomes inert; the panel is portalled
     * into <body> after this runs, so it is never in the list. */
    const inerted: HTMLElement[] = [];
    Array.from(document.body.children).forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      if (element.hasAttribute("data-slide-panel") || element.inert) return;
      element.inert = true;
      inerted.push(element);
    });

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    /* The trigger disappears at `lg`; do not leave a drawer open behind it. */
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", onDesktop);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inerted.forEach((element) => {
        element.inert = false;
      });
      root.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  /* Following any link inside the drawer closes it, including a link to the
   * page the visitor is already on. */
  const closeOnLink = (event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a") !== null) close();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={labels.open}
        aria-expanded={open}
        /* The dialog exists only while open, so the reference is set only then. */
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(true)}
        className="focus-ring -mr-2 grid size-11 place-items-center rounded-md text-foreground lg:hidden"
      >
        <Menu aria-hidden="true" className="size-6" />
      </button>

      <SlidePanel
        ref={panelRef}
        open={open}
        side="right"
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={labels.dialog}
        className="theme-dark flex flex-col bg-maroon-950 px-gutter pb-[max(1.5rem,env(safe-area-inset-bottom))] text-foreground"
        onBackdropClick={close}
        onExitComplete={() => triggerRef.current?.focus()}
      >
        <div className="flex h-header shrink-0 items-center justify-between gap-4">
          {brand}
          <button
            ref={focusOnMount}
            type="button"
            aria-label={labels.close}
            onClick={close}
            className="focus-ring -mr-2 grid size-11 place-items-center rounded-md text-foreground"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>

        <nav aria-label={labels.nav} className="border-t border-hairline/40 py-4" onClick={closeOnLink}>
          <ul className="flex flex-col gap-2">
            {nav.map((item) => {
              const current = currentState(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current}
                    className="type-h3 focus-ring flex min-h-12 items-center rounded-sm text-foreground transition-colors duration-hover ease-royal hover:text-link aria-[current]:text-link"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-hairline/40 pt-6" onClick={closeOnLink}>
          {children}
        </div>
      </SlidePanel>
    </>
  );
}
