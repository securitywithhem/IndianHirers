/**
 * Motion values used from JavaScript. The numbers follow the project's
 * motion rule (`.claude/rules/`); the CSS side of the same values lives in the
 * "motion primitives" block of `src/app/globals.css` and in the keyframes of
 * `tailwind.config.ts`. Change a value in both places.
 */

/** Default curve: anything entering or responding. */
export const EASE_ROYAL = [0.23, 1, 0.32, 1] as const;
/** Elements moving on screen (layout re-flow, shared-element zoom). */
export const EASE_MOVE = [0.65, 0, 0.35, 1] as const;

/** Gap between siblings revealed together on scroll. */
export const STAGGER_MS = 70;
/** Items after this one appear together with it. */
export const STAGGER_CAP = 6;

/** Gap between the steps of the above-the-fold (hero) sequence. */
export const STEP_MS = 80;

/** Small entrance (8-16px rise) and large entrance (24px rise, section). */
export const ENTER_MS = 350;
export const ENTER_LG_MS = 500;

/** Drawer / sheet. The exit runs 25% faster than the entrance. */
export const SLIDE_ENTER_MS = 500;
export const SLIDE_EXIT_MS = 375;

/** Trust-stat counter: the one signature moment of its section. */
export const COUNTER_MS = 900;

/** Route-change fade. */
export const PAGE_FADE_MS = 300;

/** Catalogue re-flow, in seconds (the motion library works in seconds). */
export const LAYOUT_S = 0.35;
export const LAYOUT_EXIT_S = 0.26;

/** Lightbox shared-element zoom, in seconds. Close is 25% faster. */
export const ZOOM_OPEN_S = 0.5;
export const ZOOM_CLOSE_S = 0.375;
