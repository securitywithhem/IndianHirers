#!/usr/bin/env node
/**
 * VISUAL CHECK step of docs/QA_LOOP.md. Captures every route at 390, 768, 1280
 * and 1920px, plus a reduced-motion set and the open mobile drawer at 390px.
 *
 * Needs a server already running (see "Server discipline" in QA_LOOP.md).
 *
 * Usage: node scripts/screenshots.mjs <out-dir> [base-url]
 *   node scripts/screenshots.mjs docs/evidence/R1/iter1
 * Routes come from ROUTES below, or from a comma-separated SHOT_ROUTES override
 * (`name=/path,name=/path`).
 */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const outDir = resolve(process.argv[2] ?? "docs/evidence/screens");
const base = process.argv[3] ?? "http://localhost:3001";
const WIDTHS = [390, 768, 1280, 1920];

const ROUTES = process.env.SHOT_ROUTES
  ? process.env.SHOT_ROUTES.split(",").map((pair) => pair.split("="))
  : [
      ["home", "/"],
      ["collections", "/collections"],
      ["collections-bone-china", "/collections/bone-china"],
      ["collections-premium-melamine", "/collections/premium-melamine"],
      ["collections-chafing-dishes", "/collections/chafing-dishes"],
      ["collections-heritage-silver", "/collections/heritage-silver"],
      ["collections-cutlery-and-serveware", "/collections/cutlery-and-serveware"],
      ["founders", "/founders"],
      ["gallery", "/gallery"],
      ["testimonials", "/testimonials"],
      ["contact", "/contact"],
      ["not-found", "/this-page-does-not-exist"],
    ];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const failures = [];

/** Scroll through the page so lazy images and in-view reveals have fired. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

async function capture(name, path, width, { reducedMotion = false, state } = {}) {
  const context = await browser.newContext({
    viewport: { width, height: width < 700 ? 844 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
    isMobile: width < 700,
    hasTouch: width < 700,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const suffix = [width, reducedMotion && "reduced-motion", state].filter(Boolean).join("-");
  const file = `${outDir}/${name}-${suffix}.png`;
  try {
    await page.goto(base + path, { waitUntil: "networkidle", timeout: 60_000 });
    await settle(page);
    if (state === "drawer-open") {
      await page.locator("header button[aria-expanded]").first().click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: file });
    } else {
      await page.screenshot({ path: file, fullPage: true });
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (overflow > 1) failures.push(`${name}@${suffix}: horizontal overflow ${overflow}px`);
    for (const e of errors) {
      // The 404 route's own document answers 404 by design.
      if (name === "not-found" && e.includes("status of 404")) continue;
      failures.push(`${name}@${suffix}: console/page error: ${e.slice(0, 200)}`);
    }
    console.log(`ok  ${file}`);
  } catch (error) {
    failures.push(`${name}@${suffix}: ${String(error).slice(0, 200)}`);
    console.log(`ERR ${file}`);
  } finally {
    await context.close();
  }
}

for (const [name, path] of ROUTES) {
  for (const width of WIDTHS) await capture(name, path, width);
  await capture(name, path, 390, { reducedMotion: true });
}
await capture("home", "/", 390, { state: "drawer-open" });

await browser.close();

console.log(`\n${failures.length} problem(s)`);
failures.forEach((f) => console.log(`  ${f}`));
process.exit(failures.length > 0 ? 1 : 0);
