#!/usr/bin/env node
/**
 * Interactive-state captures for the VISUAL CHECK step of docs/QA_LOOP.md:
 * filtered grid, item drawer, quote list, gallery lightbox, scrolled header,
 * a keyboard focus state and the open mobile drawer — at 390 and 1280px.
 * Viewport shots (not full page). Needs a server already running.
 *
 * Usage: node scripts/screenshots-states.mjs <out-dir> [base-url]
 */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const outDir = resolve(process.argv[2] ?? "docs/evidence/states");
const base = process.argv[3] ?? "http://localhost:3001";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const problems = [];

async function state(name, width, path, act) {
  const context = await browser.newContext({
    viewport: { width, height: width < 700 ? 844 : 900 },
    isMobile: width < 700,
    hasTouch: width < 700,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => problems.push(`${name}@${width}: ${e.message.slice(0, 160)}`));
  try {
    await page.goto(base + path, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(1200);
    await act(page);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${outDir}/${name}-${width}.png` });
    console.log(`ok  ${name}-${width}.png`);
  } catch (error) {
    problems.push(`${name}@${width}: ${String(error).split("\n")[0].slice(0, 200)}`);
    console.log(`ERR ${name}-${width}.png`);
  } finally {
    await context.close();
  }
}

const collection = "/collections/bone-china";
const addToQuote = (page, index) => page.getByRole("button", { name: /add to quote/i }).nth(index).click();

for (const width of [390, 1280]) {
  await state("state-header-scrolled", width, "/", async (page) => {
    await page.mouse.wheel(0, 700);
  });
  await state("state-focus-first-cta", width, "/", async (page) => {
    for (let i = 0; i < (width < 700 ? 4 : 9); i += 1) await page.keyboard.press("Tab");
  });
  await state("state-filtered-grid", width, collection, async (page) => {
    await page.locator("button[aria-pressed]", { hasText: /^Gold$/ }).first().click();
  });
  await state("state-item-drawer", width, collection, async (page) => {
    await page.locator('a[aria-haspopup="dialog"]').first().click();
    await page.getByRole("dialog").waitFor();
  });
  await state("state-quote-list", width, collection, async (page) => {
    await addToQuote(page, 0);
    await addToQuote(page, 0);
    await page.getByRole("button", { name: /quote list/i }).first().click();
    await page.getByRole("dialog").waitFor();
  });
  await state("state-lightbox", width, "/gallery", async (page) => {
    await page.locator("main button:has(img)").first().click();
    await page.getByRole("dialog").waitFor();
  });
  await state("state-text-list-collection", width, "/collections/heritage-silver", async () => {});
  await state("state-contact-panel", width, "/contact", async (page) => {
    await page.mouse.wheel(0, 500);
  });
}
await state("state-mobile-drawer", 390, "/", async (page) => {
  await page.locator("header button[aria-expanded]").first().click();
  await page.getByRole("dialog").waitFor();
});

await browser.close();
console.log(`\n${problems.length} problem(s)`);
problems.forEach((p) => console.log(`  ${p}`));
process.exit(problems.length > 0 ? 1 : 0);
