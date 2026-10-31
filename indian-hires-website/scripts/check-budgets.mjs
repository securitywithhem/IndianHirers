#!/usr/bin/env node
/**
 * Fails when a route's First Load JS is over its ceiling. Reads the route table
 * that `next build` prints, so the numbers are the ones the phase evidence quotes.
 *
 *   npm run verify 2>&1 | tee build.log
 *   npm run check:budgets -- build.log
 *
 * The ceilings repeat the table in .claude/rules/performance.md — KEEP THE TWO
 * IN STEP. A route with no ceiling is listed but does not fail.
 */
import { readFileSync } from "node:fs";

const SHARED_CEILING = 105;
const CEILINGS = {
  "/": 185,
  "/contact": 140,
  "/collections": 120,
  "/collections/[slug]": 120,
  "/gallery": 120,
  "/founders": 110,
  "/testimonials": 110,
  "/_not-found": 110,
};

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/check-budgets.mjs <next-build-log>");
  process.exit(2);
}

const UNITS = { B: 1 / 1000, kB: 1, MB: 1000 };
const ROUTE_ROW = /^[┌├└]\s+\S\s+(\/\S*)\s+[\d.]+\s+(?:B|kB|MB)\s+([\d.]+)\s+(B|kB|MB)\s*$/;
const SHARED_ROW = /First Load JS shared by all\s+([\d.]+)\s+(B|kB|MB)/;

const routes = new Map();
let shared = null;
for (const line of readFileSync(file, "utf8").split("\n")) {
  const row = line.match(ROUTE_ROW);
  if (row) routes.set(row[1], Number(row[2]) * UNITS[row[3]]);
  const sharedRow = line.match(SHARED_ROW);
  if (sharedRow) shared = Number(sharedRow[1]) * UNITS[sharedRow[2]];
}

// An empty table means the format changed, not that every budget was met.
if (routes.size === 0 || shared === null) {
  console.error(`check-budgets: no route table found in ${file}`);
  process.exit(1);
}

let failures = 0;
const report = (name, size, ceiling) => {
  const over = ceiling !== undefined && size > ceiling;
  if (over) failures += 1;
  const limit = ceiling === undefined ? "no ceiling" : `ceiling ${ceiling} kB`;
  console.log(`${over ? "OVER" : "ok  "}  ${name.padEnd(24)} ${String(size).padStart(6)} kB  ${limit}`);
};

report("shared by all", shared, SHARED_CEILING);
for (const [route, size] of routes) report(route, size, CEILINGS[route]);

for (const route of Object.keys(CEILINGS)) {
  if (!routes.has(route)) {
    console.error(`MISSING  ${route} has a ceiling but is not in the build`);
    failures += 1;
  }
}

console.log(failures === 0 ? "\ncheck-budgets: all within budget" : `\ncheck-budgets: ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
