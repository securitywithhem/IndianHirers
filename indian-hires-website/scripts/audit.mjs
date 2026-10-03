#!/usr/bin/env node
/**
 * Accessibility and performance measurements for docs/QA_LOOP.md.
 *
 *   node scripts/audit.mjs axe        [base-url]   axe-core on every route, 390px and 1280px
 *   node scripts/audit.mjs lighthouse [base-url]   Lighthouse mobile + desktop on every route
 *
 * Needs a server already running. Lighthouse numbers from `next dev` are far
 * lower than production; measure against `next start` on port 3001 (after
 * `npm run verify` has built) and say which server the numbers came from.
 * Results are printed as a table and written as JSON to AUDIT_OUT (default
 * docs/evidence/audit).
 *
 * Optional: LH_RUNS=3 runs Lighthouse that many times per route and preset and
 * reports the median by performance score (every run's JSON is kept);
 * LH_PRESETS=mobile limits the presets; PW_CHROMIUM / CHROME_PATH point at a
 * Chromium binary when Playwright's own is not installed.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const mode = process.argv[2];
const base = process.argv[3] ?? "http://localhost:3001";
const outDir = resolve(process.env.AUDIT_OUT ?? "docs/evidence/audit");
mkdirSync(outDir, { recursive: true });

const ROUTES = (process.env.AUDIT_ROUTES ?? "/,/collections,/collections/bone-china,/collections/chafing-dishes,/founders,/gallery,/testimonials,/contact").split(",");
const slug = (route) => (route === "/" ? "home" : route.slice(1).replace(/\//g, "-"));

if (mode === "axe") {
  const { chromium } = await import("playwright");
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  let total = 0;
  const report = {};
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    for (const route of ROUTES) {
      const page = await context.newPage();
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
        .analyze();
      report[`${route}@${width}`] = violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
        help: v.help,
      }));
      total += violations.length;
      console.log(`${route.padEnd(34)} ${String(width).padStart(4)}px  ${violations.length === 0 ? "0 violations" : ""}`);
      for (const v of violations) {
        console.log(`    ${v.id} [${v.impact}] ×${v.nodes.length} — ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) console.log(`      ${n.target.join(" ")}`);
      }
      await page.close();
    }
    await context.close();
  }
  await browser.close();
  writeFileSync(`${outDir}/axe.json`, JSON.stringify(report, null, 2));
  console.log(`\naxe: ${total} violation group(s) across ${ROUTES.length} routes × 2 widths → ${outDir}/axe.json`);
} else if (mode === "lighthouse") {
  const rows = [];
  const runs = Number(process.env.LH_RUNS ?? 1);
  const presets = (process.env.LH_PRESETS ?? "mobile,desktop").split(",");
  for (const preset of presets) {
    for (const route of ROUTES) {
      const results = [];
      let failure = null;
      for (let run = 1; run <= runs; run += 1) {
        const file = `${outDir}/lh-${preset}-${slug(route)}${runs > 1 ? `-run${run}` : ""}.json`;
        const args = [
          "lighthouse",
          base + route,
          "--quiet",
          "--output=json",
          `--output-path=${file}`,
          "--only-categories=performance,accessibility,best-practices,seo",
          "--chrome-flags=--headless=new --no-sandbox",
        ];
        if (preset === "desktop") args.push("--preset=desktop");
        try {
          execFileSync("npx", args, { stdio: ["ignore", "ignore", "pipe"], timeout: 180_000 });
          const lhr = JSON.parse(readFileSync(file, "utf8"));
          const score = (id) => Math.round((lhr.categories[id]?.score ?? 0) * 100);
          const audit = (id) => lhr.audits[id]?.displayValue ?? "—";
          results.push({
            preset,
            route,
            run,
            perf: score("performance"),
            a11y: score("accessibility"),
            bp: score("best-practices"),
            seo: score("seo"),
            lcp: audit("largest-contentful-paint"),
            lcpMs: lhr.audits["largest-contentful-paint"]?.numericValue ?? null,
            cls: audit("cumulative-layout-shift"),
            tbt: audit("total-blocking-time"),
          });
        } catch (error) {
          failure = String(error).slice(0, 160);
        }
      }
      if (results.length === 0) {
        rows.push({ preset, route, error: failure });
        console.log(`${preset.padEnd(8)} ${route.padEnd(32)} ERROR ${failure}`);
        continue;
      }
      const sorted = [...results].sort((a, b) => a.perf - b.perf);
      const median = sorted[Math.floor((sorted.length - 1) / 2)];
      const r = { ...median, runs: results.map(({ perf, lcp }) => ({ perf, lcp })) };
      rows.push(r);
      const all = results.length > 1 ? `  runs ${results.map((x) => `${x.perf}/${x.lcp}`).join(" · ")}` : "";
      console.log(
        `${preset.padEnd(8)} ${route.padEnd(32)} Perf ${r.perf}  A11y ${r.a11y}  BP ${r.bp}  SEO ${r.seo}  LCP ${r.lcp}  CLS ${r.cls}  TBT ${r.tbt}${all}`
      );
    }
  }
  writeFileSync(`${outDir}/lighthouse-summary.json`, JSON.stringify(rows, null, 2));
  console.log(`\nlighthouse: summary → ${outDir}/lighthouse-summary.json`);
} else {
  console.error("usage: node scripts/audit.mjs <axe|lighthouse> [base-url]");
  process.exit(2);
}
