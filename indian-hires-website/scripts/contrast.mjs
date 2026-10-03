#!/usr/bin/env node
/**
 * Contrast for the colour tokens in src/app/globals.css.
 * Reads every `--name: H S% L%;` triplet from :root and computes WCAG ratios.
 *
 *   node scripts/contrast.mjs                    list the tokens
 *   node scripts/contrast.mjs <fg> <bg> [...]    ratio of each pair
 *   node scripts/contrast.mjs --table            every pair the site uses, as Markdown
 *                                                (the tables in Docs/UI_UX_V2.md §3)
 *   node scripts/contrast.mjs --check            same pairs; exit 1 if one is under its floor
 *
 * A colour is `token` or `token/alpha` ("gold-300/65"). A surface may be
 * layered, bottom first: `white+maroon-950/62` is maroon-950 at 62% over a
 * white pixel; `maroon-800+gold-500/18` is the candle glow's peak. `white` is
 * the brightest pixel a photograph can hold — it is not a site colour.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../src/app/globals.css"), "utf8");
const tokens = new Map([["white", [0, 0, 100]]]);
for (const m of css.matchAll(/--([\w-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*;/g)) {
  if (!tokens.has(m[1])) tokens.set(m[1], [Number(m[2]), Number(m[3]), Number(m[4])]);
}

function rgb([h, s, l]) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}
const lum = (c) => {
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const mix = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a));
const hex = (c) => "#" + c.map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();

/** "gold-700" or "espresso-900/70" (alpha composited over `under`). */
function resolveColor(spec, under) {
  const [name, alpha] = spec.split("/");
  const t = tokens.get(name);
  if (!t) throw new Error(`unknown token --${name}`);
  const c = rgb(t);
  return alpha ? mix(c, under, Number(alpha) / 100) : c;
}

/** "ivory-50", or layers bottom first: "white+maroon-950/62". */
function resolveSurface(spec) {
  return spec.split("+").reduce((under, layer) => resolveColor(layer, under), [1, 1, 1]);
}

function ratio(fgSpec, bgSpec) {
  const bg = resolveSurface(bgSpec);
  const fg = resolveColor(fgSpec, bg);
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/* --------------------------------------------------------------------------
 * Every text/background pair the site uses. `min` is the floor the pair must
 * clear: 4.5 body text, 3 large text (>= 24px, or >= 18.66px bold) and UI
 * boundaries / icons / focus rings. `min: 0` = decorative, nothing applies.
 * FORBIDDEN lists pairs that fail and must never be written.
 * -------------------------------------------------------------------------- */
const LINEN = "+gold-700/4+gold-700/3"; // where the two hairline grids cross
const GLOW = "+gold-500/18"; // the candle glow's peak
const SWEEP = "+gold-300/30"; // the button sheen's peak (--sheen-sweep)

const GROUPS = [
  {
    title: "On ivory (default scope and `.theme-light`)",
    rows: [
      ["espresso-900", "ivory-50", 4.5, "all text [`foreground`]"],
      ["espresso-900", "ivory-100", 4.5, "all text"],
      ["espresso-600", "ivory-50", 4.5, "secondary text, captions, placeholders, tags [`muted-foreground`]"],
      ["espresso-600", "ivory-100", 4.5, "secondary text, captions"],
      ["maroon-700", "ivory-50", 4.5, "headings, links, outline-button label [`heading`, `link`, `primary`]"],
      ["maroon-700", "ivory-100", 4.5, "headings, links; secondary-button label"],
      ["gold-700", "ivory-50", 4.5, "eyebrows, small gold labels [`kicker`]"],
      ["gold-700", "ivory-100", 4.5, "eyebrows, small gold labels"],
      ["danger", "ivory-50", 4.5, "form error text [`destructive`]"],
      ["danger", "ivory-100", 4.5, "form error text"],
    ],
  },
  {
    title: "On maroon (inside `.theme-dark`)",
    rows: [
      ["ivory-50", "maroon-950", 4.5, "all text [`foreground`, `heading`]"],
      ["ivory-50", "maroon-800", 4.5, "all text"],
      ["ivory-50", "maroon-700", 4.5, "all text; card text"],
      ["ivory-300", "maroon-950", 4.5, "secondary text [`muted-foreground`]"],
      ["ivory-300", "maroon-800", 4.5, "secondary text"],
      ["ivory-300", "maroon-700", 4.5, "secondary text on a card"],
      ["gold-300", "maroon-950", 4.5, "eyebrows, links, gold text [`kicker`, `link`]"],
      ["gold-300", "maroon-800", 4.5, "eyebrows, links, outline-button label"],
      ["gold-300", "maroon-700", 4.5, "eyebrows, links on a card"],
      ["gold-500", "maroon-950", 4.5, "gold text and icons [`primary`]"],
      ["gold-500", "maroon-800", 4.5, "gold text and icons"],
      ["gold-500", "maroon-700", 4.5, "text >= 16px only - little headroom; prefer `gold-300`"],
    ],
  },
  {
    title: "Fills: buttons, chips, selection",
    rows: [
      ["ivory-50", "maroon-700", 4.5, "primary button and selected chip, on ivory"],
      ["ivory-50", "maroon-800", 4.5, "primary button, hover"],
      ["ivory-50", `maroon-700${SWEEP}`, 4.5, "primary button under the sheen's peak, as hover begins"],
      ["ivory-50", `maroon-800${SWEEP}`, 4.5, "primary button under the sheen's peak, hover"],
      ["maroon-950", "gold-500", 4.5, "gold button; primary button and selected chip in `.theme-dark`; darkest point of `gold-sheen`"],
      ["maroon-950", "gold-300", 4.5, "gold button hover; lightest point of `gold-sheen`"],
      ["ivory-50", "danger", 4.5, "destructive button, hover"],
      ["espresso-900", "whatsapp", 4.5, "the only type or icon colour on WhatsApp green"],
      ["maroon-950", "ivory-50+gold-300/65", 4.5, "selected text on ivory (`::selection`)"],
      ["maroon-950", "ivory-100+gold-300/65", 4.5, "selected text on alternate ivory"],
      ["maroon-950", "maroon-950+gold-300/65", 4.5, "selected text on the deepest maroon"],
      ["maroon-950", "maroon-800+gold-300/65", 4.5, "selected text on maroon"],
      ["maroon-950", "maroon-700+gold-300/65", 4.5, "selected text on a maroon card"],
    ],
  },
  {
    title: "Special surfaces: scrim, glow, linen, translucent bars",
    rows: [
      ["ivory-50", "white+maroon-950/62", 4.5, "text on `hero-scrim` at its lightest, over a white pixel"],
      ["gold-300", "white+maroon-950/78", 4.5, "gold text on `hero-scrim`, lower 40% only, over a white pixel"],
      ["ivory-50", `maroon-800${GLOW}`, 4.5, "heading at the peak of `candle-glow`"],
      ["ivory-300", `maroon-800${GLOW}`, 4.5, "lead at the peak of `candle-glow`"],
      ["gold-300", `maroon-800${GLOW}`, 4.5, "eyebrow, outline-button label at the peak of `candle-glow`"],
      ["ivory-50", `maroon-950${GLOW}`, 4.5, "heading over the glow in the hero band"],
      ["ivory-300", `maroon-950${GLOW}`, 4.5, "lead over the glow in the hero band"],
      ["gold-300", `maroon-950${GLOW}`, 4.5, "eyebrow over the glow in the hero band"],
      ["espresso-900", `ivory-100${LINEN}`, 4.5, "text on `surface-linen`, darkest crossing"],
      ["espresso-600", `ivory-100${LINEN}`, 4.5, "secondary text on `surface-linen`"],
      ["maroon-700", `ivory-100${LINEN}`, 4.5, "headings on `surface-linen`"],
      ["gold-700", `ivory-100${LINEN}`, 4.5, "eyebrows on `surface-linen`"],
      ["espresso-900", "maroon-950+ivory-50/90", 4.5, "solid header (ivory at 90%) over the darkest band"],
      ["maroon-700", "maroon-950+ivory-50/90", 4.5, "solid header: links, current-page text"],
      ["espresso-900", "maroon-950+ivory-50/95", 4.5, "mobile bottom bar (ivory at 95%) over the darkest band"],
    ],
  },
  {
    title: "Non-text: boundaries, icons, focus rings (floor 3:1)",
    rows: [
      ["control-border", "ivory-50", 3, "input, textarea, chip boundary [`input`]"],
      ["control-border", "ivory-100", 3, "input, chip boundary on alternate ivory"],
      ["maroon-700", "ivory-50", 3, "focus ring, outline-button border [`ring`, `primary`]"],
      ["maroon-700", "ivory-100", 3, "focus ring on alternate ivory"],
      ["danger", "ivory-50", 3, "invalid-field border"],
      ["gold-700", "ivory-50", 3, "edge of the gold button on ivory"],
      ["gold-700", "maroon-950+ivory-50/90", 3, "edge of the gold button on the solid header"],
      ["gold-500", `maroon-950${GLOW}`, 3, "icons under the glow on the footer's top edge"],
      ["gold-300", "maroon-950", 3, "focus ring inside `.theme-dark` [`ring`]"],
      ["gold-300", "maroon-800", 3, "focus ring inside `.theme-dark`"],
      ["gold-300", "maroon-700", 3, "focus ring on a maroon card"],
      ["gold-500", "maroon-950", 3, "outline-button border, input boundary in `.theme-dark` [`primary`, `input`]"],
      ["gold-500", "maroon-800", 3, "outline-button border, input boundary"],
      ["gold-500", "maroon-700", 3, "outline-button border, input boundary on a card"],
      ["maroon-700", "maroon-950+ivory-50/95", 3, "mobile bottom bar icons"],
    ],
  },
  {
    title: "Decorative: no requirement applies",
    rows: [
      ["gold-500", "ivory-50", 0, "hairlines, rules, the crown - never text, never a control boundary"],
      ["gold-500/40", "ivory-50", 0, "card and header hairline (`border-hairline/40`)"],
      ["ivory-300", "ivory-50", 0, "quiet structural rule [`border`]"],
      ["maroon-700", "maroon-800", 0, "structural rule inside `.theme-dark` [`border`]"],
    ],
  },
];

const FORBIDDEN = [
  ["gold-500", "ivory-50", "gold as text on ivory - use `gold-700`"],
  ["gold-300", "ivory-50", "gold as text on ivory"],
  ["ivory-50", "gold-500", "light type on a gold fill - use `maroon-950`"],
  ["ivory-50", "gold-300", "light type on a gold fill"],
  ["ivory-50", "whatsapp", "light type on WhatsApp green - use `espresso-900`"],
  ["maroon-950", "gold-700", "type on `bg-gold-gradient` (its dark end) - use `gold-sheen`"],
  ["gold-700", "maroon-950", "`gold-700` on maroon"],
  ["maroon-700", "maroon-950", "maroon as text on maroon"],
  ["espresso-600", "maroon-800", "espresso as text on maroon"],
  ["danger", "maroon-800", "error red on maroon - forms stay on ivory"],
  ["gold-500", `maroon-800${GLOW}`, "`gold-500` text over the candle glow - use `gold-300`"],
  ["gold-500", `maroon-700${GLOW}`, "`gold-500` text over a glow on a card"],
];

const grade = (r, min) => (min === 0 ? "decorative" : r >= min ? (min === 3 ? "pass (3:1)" : "pass (4.5:1)") : "**FAIL**");

function table() {
  const out = [];
  let failures = 0;
  for (const group of GROUPS) {
    out.push(`#### ${group.title}`, "", "| Foreground | Background | Ratio | Floor | Result | Use |", "|---|---|---|---|---|---|");
    for (const [fg, bg, min, use] of group.rows) {
      const r = ratio(fg, bg);
      if (min > 0 && r < min) failures++;
      out.push(`| \`${fg}\` | \`${bg}\` | ${r.toFixed(2)} | ${min === 0 ? "-" : min} | ${grade(r, min)} | ${use} |`);
    }
    out.push("");
  }
  out.push("#### Forbidden: these fail and are never written", "", "| Foreground | Background | Ratio | Why it is listed |", "|---|---|---|---|");
  for (const [fg, bg, why] of FORBIDDEN) out.push(`| \`${fg}\` | \`${bg}\` | ${ratio(fg, bg).toFixed(2)} | ${why} |`);
  return { text: out.join("\n"), failures };
}

const args = process.argv.slice(2);
if (args[0] === "--table" || args[0] === "--check") {
  const { text, failures } = table();
  const required = GROUPS.flatMap((g) => g.rows).filter((row) => row[2] > 0);
  if (args[0] === "--table") console.log(text);
  else {
    for (const [fg, bg, min] of required) {
      const r = ratio(fg, bg);
      if (r < min) console.log(`FAIL  ${fg} on ${bg}: ${r.toFixed(2)} < ${min}`);
    }
    const worst = required.map(([fg, bg, min]) => ({ fg, bg, min, headroom: ratio(fg, bg) - min })).sort((a, b) => a.headroom - b.headroom)[0];
    console.log(`contrast: ${required.length} required pairs, ${failures} under their floor`);
    console.log(`contrast: least headroom - ${worst.fg} on ${worst.bg}: ${ratio(worst.fg, worst.bg).toFixed(2)} (floor ${worst.min})`);
    console.log(failures === 0 ? "contrast: PASS" : "contrast: FAIL");
  }
  process.exit(failures === 0 ? 0 : 1);
}
if (args.length === 0 || args.length % 2) {
  console.log("tokens:");
  for (const [n, t] of tokens) console.log(`  --${n}: ${t[0]} ${t[1]}% ${t[2]}%  ${hex(rgb(t))}`);
  process.exit(0);
}
for (let i = 0; i < args.length; i += 2) {
  const r = ratio(args[i], args[i + 1]);
  const label = r >= 4.5 ? "AA body" : r >= 3 ? "large/UI only" : "FAIL";
  console.log(`${args[i].padEnd(20)} on ${args[i + 1].padEnd(14)} ${r.toFixed(2).padStart(6)}  ${label}`);
}
