#!/usr/bin/env node
/**
 * Design-token guard. Fails the build when a colour is written by hand in
 * src/components or src/app instead of going through a token.
 *
 * Colours are defined in exactly two places: the :root block of
 * src/app/globals.css and the theme in tailwind.config.ts. Everything else
 * consumes them as Tailwind utilities (`bg-surface`, `text-gold`).
 *
 * Failing rules:
 *   raw-hex          #abc / #aabbcc / #aabbccdd anywhere in code
 *   raw-color-fn     rgb()/hsl()/oklch()… with literal numbers
 *   arbitrary-color  Tailwind arbitrary values carrying a colour: bg-[#…],
 *                    shadow-[…rgba(…)…], bg-[radial-gradient(…#…)]
 *   inline-style     style={{ color | background | borderColor | fill … }}
 *   stock-white-black  Tailwind's stock `white` / `black` in any colour utility,
 *                    with any variant or opacity: bg-white, text-black,
 *                    hover:border-white/20, ring-offset-black. Use a token
 *                    (ivory-50, espresso-900, maroon-950, foreground …).
 *
 * Non-failing warning:
 *   palette-class    The rest of Tailwind's stock palette (text-red-500,
 *                    bg-slate-100) — not a brand token, review by hand.
 *
 * Escape hatch, for the rare value that cannot be a token (e.g. the
 * `themeColor` meta tag). Put it on the offending line or the line above, and
 * always give a reason:
 *   // check-tokens-ignore: <reason>
 * The `.theme-dark` scope is not detected statically; a stock white/black class
 * that is genuinely required needs this marker like any other exception.
 *
 * Usage: node scripts/check-tokens.mjs [--json]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["src/components", "src/app"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);
// The only files allowed to hold raw colour values.
const ALLOWED = [/(^|\/)globals\.css$/, /(^|\/)tailwind\.config\.(ts|js|mjs|cjs)$/];
const IGNORE_MARKER = /check-tokens-ignore:\s*\S+/;

// Lookahead excludes letters/digits/hyphen but not `_`: Tailwind arbitrary
// values write spaces as underscores (`bg-[radial-gradient(circle,_#C5A44E_0%)]`).
const HEX = String.raw`#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9A-Za-z-])`;
// A colour function fed literal numbers. `hsl(var(--gold))` is a token and passes.
const COLOR_FN = String.raw`(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\([\s_]*[\d.]`;

const RULES = [
  {
    id: "arbitrary-color",
    hint: "use a token utility (bg-gold, shadow-*) or add a token to globals.css",
    re: new RegExp(String.raw`[\w:/!.-]*\[[^\]\n]*(?:${HEX}|${COLOR_FN})[^\]\n]*\]`, "g"),
  },
  {
    id: "raw-hex",
    hint: "move the value into a CSS variable in globals.css",
    // `&#169;` is an HTML entity and `/#anchor` is a link, not a colour.
    re: new RegExp(String.raw`(?<![&\w/])${HEX}`, "g"),
  },
  {
    id: "raw-color-fn",
    hint: "move the value into a CSS variable in globals.css",
    re: new RegExp(String.raw`(?<![\w-])${COLOR_FN}[^)\n]*\)?`, "g"),
  },
];

const STYLE_COLOR_KEY =
  /\b(color|background|backgroundColor|borderColor|border(?:Top|Right|Bottom|Left)Color|outlineColor|caretColor|accentColor|textDecorationColor|fill|stroke|stopColor|floodColor)\s*:/g;

// Colour-utility prefixes, including per-side borders (`border-t-`, `divide-x-`).
const COLOR_UTILITY = String.raw`(?:text|bg|border(?:-[trblxyse])?|ring-offset|ring|from|via|to|fill|stroke|divide(?:-[xy])?|outline|decoration|shadow|accent|caret|placeholder)`;
// Optional opacity modifier: `/40` or `/[0.35]`.
const OPACITY = String.raw`(?:\/(?:\d+|\[[^\]\s]+\]))?`;
const STOCK_HUES =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

// Fails. Variant prefixes (`hover:`, `md:`, `group-hover:`, `data-[x=y]:`) need
// no special handling: the class is matched wherever it starts.
const WHITE_BLACK_CLASS = new RegExp(
  String.raw`(?<![\w-])(?:[\w-]+:)*${COLOR_UTILITY}-(?:white|black)${OPACITY}(?![\w-])`,
  "g"
);
// Warns.
const PALETTE_CLASS = new RegExp(
  String.raw`(?<![\w-])(?:[\w-]+:)*${COLOR_UTILITY}-(?:${STOCK_HUES})-\d{2,3}${OPACITY}(?![\w-])`,
  "g"
);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(extname(name))) out.push(full);
  }
  return out;
}

/** Blank out comments, keeping every newline so line numbers stay true. */
function stripComments(source) {
  const blank = (match) => match.replace(/[^\n]/g, " ");
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    // Only `//` at line start or after whitespace — leaves `https://` alone.
    .replace(/(^|\s)\/\/.*$/gm, blank);
}

function position(source, index) {
  const before = source.slice(0, index);
  const line = before.split("\n").length;
  const col = index - before.lastIndexOf("\n");
  return { line, col };
}

function scan(file) {
  const rel = relative(ROOT, file).split(sep).join("/");
  if (ALLOWED.some((re) => re.test(rel))) return { errors: [], warnings: [] };

  const original = readFileSync(file, "utf8");
  const lines = original.split("\n");
  let code = stripComments(original);

  const ignored = (line) =>
    IGNORE_MARKER.test(lines[line - 1] ?? "") || IGNORE_MARKER.test(lines[line - 2] ?? "");

  const errors = [];
  const warnings = [];
  const report = (list, rule, hint, index, text) => {
    const { line, col } = position(code, index);
    if (ignored(line)) return;
    list.push({ file: rel, line, col, rule, hint, text: text.trim().slice(0, 110) });
  };

  for (const { id, hint, re } of RULES) {
    for (const match of code.matchAll(re)) report(errors, id, hint, match.index, match[0]);
    // Mask what was reported so a later, broader rule doesn't repeat it.
    code = code.replace(re, (m) => " ".repeat(m.length));
  }

  // style={{ … }} — walk to the matching `}}` so multi-line objects are covered.
  for (const open of code.matchAll(/style=\{\{/g)) {
    let depth = 2;
    let i = open.index + open[0].length;
    while (i < code.length && depth > 0) {
      if (code[i] === "{") depth++;
      else if (code[i] === "}") depth--;
      i++;
    }
    const start = open.index + open[0].length;
    const body = code.slice(start, i);
    for (const key of body.matchAll(STYLE_COLOR_KEY)) {
      report(
        errors,
        "inline-style",
        "use a token utility class instead of an inline colour",
        start + key.index,
        `style={{ ${key[0]} … }}`
      );
    }
  }

  for (const match of code.matchAll(WHITE_BLACK_CLASS)) {
    report(
      errors,
      "stock-white-black",
      "use a token: ivory-50 / foreground for light, espresso-900 / maroon-950 for dark",
      match.index,
      match[0]
    );
  }

  for (const match of code.matchAll(PALETTE_CLASS)) {
    report(warnings, "palette-class", "stock Tailwind colour, not a brand token", match.index, match[0]);
  }

  return { errors, warnings };
}

const files = SCAN_DIRS.flatMap((dir) => walk(join(ROOT, dir))).sort();
const errors = [];
const warnings = [];
for (const file of files) {
  const result = scan(file);
  errors.push(...result.errors);
  warnings.push(...result.warnings);
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ filesScanned: files.length, errors, warnings }, null, 2));
  process.exit(errors.length > 0 ? 1 : 0);
}

const print = (item) =>
  console.log(`  ${item.file}:${item.line}:${item.col}  [${item.rule}]  ${item.text}`);

console.log(`check-tokens: scanned ${files.length} files in ${SCAN_DIRS.join(", ")}`);

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s) — stock palette classes, not failing:`);
  warnings.forEach(print);
}

if (errors.length > 0) {
  console.log(`\n${errors.length} offender(s) — raw colour or stock white/black outside the token files:`);
  errors.forEach(print);
  const hints = new Map(errors.map((e) => [e.rule, e.hint]));
  console.log("\nFix:");
  for (const [rule, hint] of hints) console.log(`  [${rule}] ${hint}`);
  console.log("\ncheck-tokens: FAIL");
  process.exit(1);
}

console.log("\ncheck-tokens: PASS — no raw colours or stock white/black outside the token files");
