import { STAGGER_CAP } from "./tokens";

/**
 * One shared IntersectionObserver for every scroll-triggered primitive
 * (Reveal, Stagger, DrawLine, Counter). It is created on first use and
 * disconnected when nothing is left to watch. Nothing here runs under reduced
 * motion: the primitives never call `observeReveal` in their static branch.
 *
 * The no-flash rule. The first notification for an element only classifies it:
 *
 *   - already in the viewport, or already scrolled past  -> left exactly as the
 *     server rendered it, and never animated;
 *   - still below the fold -> marked `pending` (the CSS hides it there, where
 *     nobody can see the change).
 *
 * A pending element is marked `in` the moment a part of it enters the
 * viewport; the CSS transition does the rest. A second later the marker is
 * removed, so the element carries no leftover transition or inline style.
 *
 * The trigger deliberately has no negative root margin: with one, an element
 * near the end of the document could stay hidden for ever.
 *
 * No layout is read here; the observer hands us the geometry.
 */

export interface ObserveOptions {
  /** Attribute that carries the state. Default `data-reveal`. */
  attribute?: string;
  /** Extra delay before the transition starts, in ms. */
  delayMs?: number;
  /**
   * Stagger group. Elements of one group that enter in the same frame are
   * delayed by `staggerMs` each, in DOM order, capped at STAGGER_CAP.
   */
  group?: Element;
  staggerMs?: number;
  /** Called when the element is classified as below the fold. */
  onPending?: () => void;
  /** Called when the element enters the viewport, with the delay it was given. */
  onReveal?: (delayMs: number) => void;
}

interface Watched {
  element: HTMLElement;
  attribute: string;
  phase: "unclassified" | "pending";
  delayMs: number;
  group: Element | undefined;
  staggerMs: number;
  onPending: (() => void) | undefined;
  onReveal: ((delayMs: number) => void) | undefined;
}

const DEFAULT_ATTRIBUTE = "data-reveal";
const DELAY_PROPERTY = "--reveal-delay";
/** Longer than the longest transition a primitive runs (the ceiling is 900ms). */
const SETTLE_MS = 1000;

const watched = new Map<Element, Watched>();
const settleTimers = new Map<Element, number>();
let observer: IntersectionObserver | null = null;

function doNothing(): void {
  return;
}

function release(target: Element): void {
  watched.delete(target);
  if (observer === null) return;
  observer.unobserve(target);
  if (watched.size === 0) {
    observer.disconnect();
    observer = null;
  }
}

function clearMarks(element: HTMLElement, attribute: string): void {
  element.removeAttribute(attribute);
  element.style.removeProperty(DELAY_PROPERTY);
}

function handle(changes: IntersectionObserverEntry[]): void {
  /* Position of each element within its stagger group, for this batch only. */
  const positionInGroup = new Map<Element, number>();

  for (const change of changes) {
    const record = watched.get(change.target);
    if (record === undefined) continue;
    const { element, attribute } = record;

    if (record.phase === "unclassified") {
      const visibleOrPassed = change.isIntersecting || change.boundingClientRect.bottom <= 0;
      if (visibleOrPassed) {
        release(element);
        continue;
      }
      record.phase = "pending";
      element.setAttribute(attribute, "pending");
      record.onPending?.();
      continue;
    }

    if (!change.isIntersecting) continue;

    let delayMs = record.delayMs;
    if (record.group !== undefined) {
      const position = positionInGroup.get(record.group) ?? 0;
      positionInGroup.set(record.group, position + 1);
      delayMs += Math.min(position, STAGGER_CAP - 1) * record.staggerMs;
    }

    element.style.setProperty(DELAY_PROPERTY, `${delayMs}ms`);
    element.setAttribute(attribute, "in");
    record.onReveal?.(delayMs);
    release(element);

    settleTimers.set(
      element,
      window.setTimeout(() => {
        settleTimers.delete(element);
        clearMarks(element, attribute);
      }, delayMs + SETTLE_MS),
    );
  }
}

/**
 * Start watching `element`. Returns a function that stops watching and
 * restores the element to its plain, visible state.
 */
export function observeReveal(element: HTMLElement, options: ObserveOptions = {}): () => void {
  if (typeof IntersectionObserver === "undefined") return doNothing;

  const attribute = options.attribute ?? DEFAULT_ATTRIBUTE;

  if (observer === null) observer = new IntersectionObserver(handle);

  watched.set(element, {
    element,
    attribute,
    phase: "unclassified",
    delayMs: options.delayMs ?? 0,
    group: options.group,
    staggerMs: options.staggerMs ?? 0,
    onPending: options.onPending,
    onReveal: options.onReveal,
  });
  observer.observe(element);

  return () => {
    if (watched.has(element)) release(element);
    const timer = settleTimers.get(element);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      settleTimers.delete(element);
    }
    clearMarks(element, attribute);
  };
}
