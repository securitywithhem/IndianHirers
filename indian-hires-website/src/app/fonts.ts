import { Cormorant_Garamond, Jost } from "next/font/google";

/**
 * The site's two typefaces — and the only two (performance rule: at most two
 * families, only the weights that are used). Spec: Docs/UI_UX_V2.md §4.
 *
 * Both `.variable` classes are applied to <html> in src/app/layout.tsx.
 */

/**
 * Display serif: headings, stat numerals. Upright only — no italic is loaded.
 * One weight: every display role in tailwind.config.ts (`display`, `h2`, `h3`,
 * `h4`, `stat`) is 600, so 500 and 700 would be downloaded and never used.
 */
export const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  variable: "--font-display",
  display: "swap",
});

/** Body and UI sans: paragraphs, buttons, labels, eyebrows. */
export const fontBody = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  variable: "--font-body",
  display: "swap",
});
