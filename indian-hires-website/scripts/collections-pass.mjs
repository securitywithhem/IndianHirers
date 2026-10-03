#!/usr/bin/env node
/**
 * Catalogue pass for docs/QA_LOOP.md (added in R5). Prints PASS/FAIL lines;
 * exits 1 on a failure. Needs a server already running.
 *
 *   1. Deep link: /collections/bone-china?finish=gold shows only gold
 *      finishes and the chip is selected.
 *   2. Keyboard only, at 1280 and 390: filter → open the item dialog → add to
 *      quote → open the quote list → type the event details → send.
 *   3. Structure: collection tabs, breadcrumb, ItemList JSON-LD, the empty
 *      collection, the "not sure" strip, no sideways page scroll.
 *      Reduced motion: the same dialogs open, close and return focus.
 *   4. axe (WCAG 2.1 A/AA + best practice) on /collections and one collection
 *      page, also with the item dialog and the quote list open.
 *
 * Usage: node scripts/collections-pass.mjs [out-dir-for-captures] [base-url]
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const outDir = process.argv[2] ?? null;
const base = process.argv[3] ?? "http://localhost:3001";
const COLLECTION = "/collections/bone-china";
const browser = await chromium.launch();
let fails = 0;

const check = (name, ok, detail = "") => {
  if (!ok) fails += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const active = (page) =>
  page.evaluate(() => {
    const e = document.activeElement;
    return {
      tag: e.tagName,
      text: (e.getAttribute("aria-label") || e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
      pressed: e.getAttribute("aria-pressed"),
      inDialog: e.closest('[role="dialog"]') !== null,
    };
  });
/** Tab until `test(activeElement)` holds; returns the number of presses, or -1. */
async function tabTo(page, test, limit = 80) {
  for (let presses = 1; presses <= limit; presses += 1) {
    await page.keyboard.press("Tab");
    if (test(await active(page))) return presses;
  }
  return -1;
}
/** Wait for the interactive catalogue to replace the server-rendered one. */
const hydrated = (page) => page.locator('a[aria-haspopup="dialog"]').first().waitFor({ timeout: 15_000 });
const cardNames = (page) => page.locator("main article h3").allInnerTexts();

// ---- 1. Deep link ---------------------------------------------------------
console.log("\n1. Deep link");
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(`${base}${COLLECTION}?finish=gold`, { waitUntil: "networkidle" });
  await hydrated(page);
  await page.waitForTimeout(900);
  const names = await cardNames(page);
  const all = await (async () => {
    const other = await context.newPage();
    await other.goto(base + COLLECTION, { waitUntil: "networkidle" });
    await hydrated(other);
    const list = await cardNames(other);
    await other.close();
    return list;
  })();
  console.log(`      unfiltered: ${all.join(" | ")}`);
  console.log(`      ?finish=gold: ${names.join(" | ")}`);
  check("?finish=gold shows a subset of the collection", names.length > 0 && names.length < all.length, `${names.length} of ${all.length}`);
  // Every card left names Gold in its finish line (the card's specs).
  const specs = await page.locator("main article").evaluateAll((cards) =>
    cards.map((card) => card.querySelector("h3 + p")?.textContent ?? ""),
  );
  check("every card shown has a Gold finish", specs.every((line) => /\bGold\b/.test(line)), specs.join(" | "));
  const pressed = await page.locator('button[aria-pressed="true"]').allInnerTexts();
  check("the Gold chip is selected (aria-pressed) and nothing else in Finish", pressed.filter((t) => t === "Gold").length === 1 && !pressed.includes("Rose gold"), pressed.join(" | "));
  const status = (await page.locator('[role="status"][aria-live="polite"]').first().innerText()).trim();
  check("result count is in a polite live region", /^Showing \d+ of \d+ designs$/.test(status), status);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.waitForTimeout(700);
  check("Clear filters restores the collection and the URL", (await cardNames(page)).length === all.length && !page.url().includes("finish="), page.url());
  await page.goto(`${base}${COLLECTION}?finish=not-a-finish`, { waitUntil: "networkidle" });
  await hydrated(page);
  check("an unknown filter value is ignored", (await cardNames(page)).length === all.length);
  if (outDir) {
    await page.goto(`${base}${COLLECTION}?finish=gold`, { waitUntil: "networkidle" });
    await hydrated(page);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${outDir}/state-deep-link-finish-gold-390.png`, fullPage: false });
  }
  await context.close();
}

// ---- 2. Keyboard walkthrough ----------------------------------------------
for (const width of [1280, 390]) {
  console.log(`\n2. Keyboard only, ${width}px`);
  const context = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 } });
  const page = await context.newPage();
  await page.goto(base + COLLECTION, { waitUntil: "networkidle" });
  await hydrated(page);
  await page.waitForTimeout(600);

  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter"); // skip link → main
  check(`${width} skip link lands in main`, (await page.evaluate(() => document.activeElement.id)) === "main-content");

  let n = await tabTo(page, (a) => a.text === "Home" && a.tag === "A");
  check(`${width} breadcrumb is the first stop in main`, n === 1, `${n} Tab`);
  n = await tabTo(page, (a) => a.text === "All" && a.tag === "A");
  check(`${width} collection tabs follow the breadcrumb`, n === 2, `${n} Tab`);

  n = await tabTo(page, (a) => a.tag === "BUTTON" && a.text === "Gold" && a.pressed === "false");
  check(`${width} Tab reaches the Gold filter chip`, n > 0, `${n} Tab`);
  await page.keyboard.press("Space");
  await page.waitForTimeout(700);
  let a = await active(page);
  check(`${width} Space presses the chip; focus stays on it`, a.text === "Gold" && a.pressed === "true", JSON.stringify(a));
  check(`${width} the URL carries ?finish=gold`, page.url().endsWith("?finish=gold"), page.url());
  const filtered = await cardNames(page);

  n = await tabTo(page, (x) => x.tag === "A" && x.text === filtered[0]);
  check(`${width} Tab reaches the first card's title link`, n > 0, `${n} Tab → ${filtered[0]}`);
  await page.keyboard.press("Enter");
  const itemDialog = page.getByRole("dialog");
  await itemDialog.waitFor();
  await page.waitForTimeout(700);
  a = await active(page);
  check(`${width} Enter opens the item dialog; focus on its close button`, a.inDialog && a.text === "Close details", JSON.stringify(a));
  check(`${width} dialog is modal and named after the item`, (await itemDialog.getAttribute("aria-modal")) === "true" && (await itemDialog.getAttribute("aria-label")) === `${filtered[0]} details`);
  check(`${width} the page behind is inert`, await page.evaluate(() => document.querySelector("main").closest("[inert]") !== null || document.querySelector("main").inert || [...document.body.children].some((el) => el.inert && el.contains(document.querySelector("main")))));
  check(`${width} dialog shows finish chips and the piece list`, (await itemDialog.locator("dd span").count()) > 0 && (await itemDialog.locator("ul li").count()) > 0);

  let trapped = true;
  const seen = [];
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press("Tab");
    const x = await active(page);
    seen.push(x.text);
    if (!x.inDialog) trapped = false;
  }
  check(`${width} Tab stays inside the dialog`, trapped, [...new Set(seen)].join(" | "));

  n = await tabTo(page, (x) => x.tag === "BUTTON" && x.text === "Add to quote" && x.inDialog, 10);
  check(`${width} Tab reaches "Add to quote" in the dialog`, n > 0);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  a = await active(page);
  check(`${width} Enter adds the item; the button reads "Added", pressed`, a.text === "Added" && a.pressed === "true", JSON.stringify(a));
  const announced = (await itemDialog.locator('[role="status"]').innerText()).trim();
  check(`${width} the addition is announced inside the dialog`, announced === `${filtered[0]} added to your quote list`, announced);
  n = await tabTo(page, (x) => x.tag === "A" && x.text.startsWith("Ask on WhatsApp") && x.inDialog, 10);
  check(`${width} "Ask on WhatsApp" is in the dialog's tab order`, n > 0);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  a = await active(page);
  check(`${width} Esc closes; focus returns to the card's title link`, !a.inDialog && a.text === filtered[0] && (await page.getByRole("dialog").count()) === 0, JSON.stringify(a));
  check(`${width} the filter survives the dialog`, page.url().endsWith("?finish=gold"), page.url());

  const pill = page.locator("[data-quote-button]");
  const pillName = await page.getByRole("button", { name: "Quote list (1)", exact: true }).count();
  check(`${width} the pill reads "Quote list (1)", and that is its name`, pillName === 1 && (await pill.innerText()).trim() === "Quote list (1)", await pill.innerText());
  n = await tabTo(page, (x) => x.tag === "BUTTON" && x.text.startsWith("Quote list (1)"));
  check(`${width} Tab reaches the pill straight after the catalogue`, n > 0, `${n} Tab`);
  if (width < 700) {
    const g = await page.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect();
      const fab = document.querySelector('aside[aria-label="WhatsApp shortcut"] a');
      return { pillBottom: r("[data-quote-button]").bottom, barTop: r('nav[aria-label="Quick contact"]').top, fabShown: getComputedStyle(fab).display !== "none" };
    });
    check(`${width} the quote button sits 16px above the bottom bar; the floating WhatsApp button has stepped aside`, g.barTop - g.pillBottom === 16 && !g.fabShown, JSON.stringify(g));
    // Bring every card action level with the quote button: its centre must still take a tap.
    const blocked = await page.evaluate(() => {
      const pillBox = document.querySelector("[data-quote-button]").getBoundingClientRect();
      const level = pillBox.top + pillBox.height / 2;
      const hidden = [];
      const y = window.scrollY;
      for (const el of document.querySelectorAll("main article button, main article a[target]")) {
        const box = el.getBoundingClientRect();
        window.scrollBy(0, box.top + box.height / 2 - level);
        const now = el.getBoundingClientRect();
        const hit = document.elementFromPoint(now.left + now.width / 2, now.top + now.height / 2);
        if (!el.contains(hit)) hidden.push(el.textContent.trim());
      }
      window.scrollTo(0, y);
      return { hidden, pillWidth: pillBox.width };
    });
    // Known and accepted (OPEN_ISSUES E35): the labelled pill covers right-column actions while level with them. Reported, not judged.
    console.log(`NOTE  ${width} card actions whose centre is under the pill when scrolled level with it: ${blocked.hidden.length} of ${await page.locator("main article button, main article a[target]").count()} (pill ${Math.round(blocked.pillWidth)}px wide)`);
    const box = await page.evaluate(() => {
      const image = document.querySelector("main article > div").getBoundingClientRect();
      return { columns: getComputedStyle(document.querySelector("main ul.grid")).gridTemplateColumns.split(" ").length, ratio: Math.round((image.width / image.height) * 100) / 100 };
    });
    check(`${width} the grid is two columns on a phone and the photograph box is 4:3`, box.columns === 2 && Math.abs(box.ratio - 1.33) < 0.02, JSON.stringify(box));
    await page.locator("[data-quote-button]").focus();
  }
  await page.keyboard.press("Enter");
  const sheet = page.getByRole("dialog", { name: "Your quote list" });
  await sheet.waitFor();
  await page.waitForTimeout(700);
  a = await active(page);
  check(`${width} Enter opens the quote list; focus on its close button`, a.inDialog && a.text === "Close quote list", JSON.stringify(a));
  check(`${width} the pill reports aria-expanded`, (await pill.getAttribute("aria-expanded")) === "true");
  check(`${width} the list holds the item with a named remove button`, (await sheet.getByRole("button", { name: `Remove ${filtered[0]} from your quote list` }).count()) === 1);

  n = await tabTo(page, (x) => x.tag === "TEXTAREA", 10);
  check(`${width} Tab reaches the event-details field`, n > 0);
  const field = sheet.getByLabel("Event date and guest count");
  check(`${width} the field has a visible label and a hint`, (await field.count()) === 1 && !!(await field.getAttribute("aria-describedby")));
  await page.keyboard.type("14 Feb 2027, 250 guests");
  n = await tabTo(page, (x) => x.tag === "A" && x.text.startsWith("Send on WhatsApp"), 10);
  check(`${width} Tab reaches "Send on WhatsApp"`, n > 0);
  const href = await sheet.getByRole("link", { name: /Send on WhatsApp/ }).getAttribute("href");
  const message = decodeURIComponent((href ?? "").split("?text=")[1] ?? "");
  console.log(`      message: ${JSON.stringify(message)}`);
  check(
    `${width} one pre-filled message: the item, its collection and the note`,
    /^https:\/\/wa\.me\/\d+\?text=/.test(href ?? "") &&
      message === `Hello Indian Hirers, I'd like a quote for:\n1. ${filtered[0]} (Bone China)\n\nEvent date and guest count: 14 Feb 2027, 250 guests`,
  );
  if (outDir) await page.screenshot({ path: `${outDir}/state-quote-sheet-note-${width}.png` });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  a = await active(page);
  check(`${width} Esc closes the list; focus returns to the quote button`, a.text.startsWith("Quote list (1)") && !a.inDialog, JSON.stringify(a));

  await page.reload({ waitUntil: "networkidle" });
  await hydrated(page);
  await page.waitForTimeout(600);
  check(`${width} after a reload the list is restored from sessionStorage`, (await page.getByRole("button", { name: "Quote list (1)", exact: true }).count()) === 1);
  await pill.click();
  await sheet.waitFor();
  check(`${width} …and so is the note`, (await field.inputValue()) === "14 Feb 2027, 250 guests");

  // Two more items, then remove the middle one: focus moves to the row that takes its place.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  const more = page.locator("main article").getByRole("button", { name: "Add to quote" });
  await more.first().click();
  await more.first().click();
  await pill.click();
  await sheet.waitFor();
  await page.waitForTimeout(600);
  const removes = sheet.locator("[data-remove-item]");
  const third = await removes.nth(2).getAttribute("aria-label");
  await removes.nth(1).focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  a = await active(page);
  check(`${width} removing a row moves focus to the next row's remove button`, a.inDialog && a.text === third.slice(0, 60), JSON.stringify(a));
  await sheet.getByRole("button", { name: "Clear list" }).click();
  await page.waitForTimeout(300);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  await more.first().click();
  await page.locator("[data-quote-button]").click();
  await sheet.waitFor();
  check(`${width} "Clear list" also clears the event details`, (await field.inputValue()) === "");
  await context.close();
}

// ---- sessionStorage blocked -------------------------------------------------
console.log("\n   sessionStorage blocked");
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("blocked", "SecurityError"); } });
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base + COLLECTION, { waitUntil: "networkidle" });
  await hydrated(page);
  await page.getByRole("button", { name: "Add to quote" }).first().click();
  await page.waitForTimeout(400);
  check("with storage blocked the list still works for the life of the page", (await page.getByRole("button", { name: "Quote list (1)", exact: true }).count()) === 1 && errors.length === 0, errors.join("; "));
  await context.close();
}

// ---- 3. Structure ----------------------------------------------------------
console.log("\n3. Structure");
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(base + "/collections", { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").allInnerTexts();
  check("/collections: one h1, \"Our collections\"", h1.length === 1 && h1[0].trim() === "Our collections", JSON.stringify(h1));
  const tabs = page.getByRole("navigation", { name: "Browse by collection" });
  check("/collections: nine tabs, \"All\" is the current page", (await tabs.locator("a").count()) === 9 && (await tabs.locator('a[aria-current="page"]').innerText()) === "All");
  const strip = await tabs.locator("ul").evaluate((ul) => ({ scrolls: ul.scrollWidth > ul.clientWidth, snap: getComputedStyle(ul).scrollSnapType, sticky: getComputedStyle(ul.parentElement).position, minTab: Math.min(...[...ul.querySelectorAll("a")].map((a) => a.getBoundingClientRect().height)) }));
  check("390: the tab row scrolls sideways with snap, sticky, tabs ≥ 44px", strip.scrolls && strip.snap.startsWith("x") && strip.sticky === "sticky" && strip.minTab >= 44, JSON.stringify(strip));
  const edges = await page.evaluate(() => ({ tab: document.querySelector('nav[aria-label="Browse by collection"] a').getBoundingClientRect().left + 12, h2: document.querySelector("main h2").getBoundingClientRect().left }));
  check("390: the first tab's label starts on the page gutter", Math.abs(edges.tab - 20) < 1, JSON.stringify(edges));
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(500);
  const fixed = await page.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    return { header: r("header").height, bar: r('nav[aria-label="Quick contact"]').height, tabsTop: r('nav[aria-label="Browse by collection"]').top, tabs: r('nav[aria-label="Browse by collection"]').height };
  });
  check("390: scrolled, the tabs sit directly under the header (header + tabs + bottom bar = 193px of 844)", fixed.tabsTop === fixed.header && fixed.header + fixed.tabs + fixed.bar === 193, JSON.stringify(fixed));
  if (outDir) await page.screenshot({ path: `${outDir}/state-tabs-stuck-390.png` });
  {
    const wide = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const desk = await wide.newPage();
    await desk.goto(base + "/collections", { waitUntil: "networkidle" });
    await desk.evaluate(() => window.scrollTo(0, 900));
    await desk.waitForTimeout(500);
    const stuck = await desk.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect();
      const nav = document.querySelector('nav[aria-label="Browse by collection"]');
      return { headerBottom: r("header").bottom, tabsTop: nav.getBoundingClientRect().top, bg: getComputedStyle(nav).backgroundColor, fits: nav.querySelector("ul").scrollWidth <= nav.querySelector("ul").clientWidth };
    });
    check("1280: scrolled, the tabs sit directly under the header, opaque, all nine in view", Math.abs(stuck.tabsTop - stuck.headerBottom) < 1 && !/rgba\(.*,\s*0\.\d+\)$/.test(stuck.bg) && stuck.fits, JSON.stringify(stuck));
    if (outDir) await desk.screenshot({ path: `${outDir}/state-tabs-stuck-1280.png` });
    await wide.close();
  }
  const suggest = page.getByRole("region", { name: "Not sure what you need?" });
  const suggestHref = await suggest.getByRole("link").getAttribute("href");
  check("/collections: the \"Not sure what you need?\" strip opens WhatsApp asking for the guest count", /^https:\/\/wa\.me\/\d+\?text=/.test(suggestHref ?? "") && decodeURIComponent(suggestHref).includes("Number of guests:"), decodeURIComponent(suggestHref ?? "").slice(0, 90));
  check("/collections: no sideways page scroll at 390", await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));

  await page.goto(base + "/collections/glassware", { waitUntil: "networkidle" });
  const current = await page.getByRole("navigation", { name: "Browse by collection" }).locator('a[aria-current="page"]').evaluate((a) => {
    const box = a.getBoundingClientRect();
    return { text: a.textContent, left: box.left, right: box.right };
  });
  check("390: the current tab (the last one) is scrolled into view", current.text === "Glassware" && current.left >= 0 && current.right <= 390, JSON.stringify(current));
  await page.goto(base + COLLECTION, { waitUntil: "networkidle" });
  const untouched = await page.getByRole("navigation", { name: "Browse by collection" }).locator("ul").evaluate((ul) => ul.scrollLeft);
  check("390: a current tab that is already in view leaves the row where it is", untouched === 0, String(untouched));
  await page.goto(base + "/collections/glassware", { waitUntil: "networkidle" });
  const crumbs = await page.getByRole("navigation", { name: "Breadcrumb" }).locator("li:visible").allInnerTexts();
  check("390: breadcrumb shows Home / Collections on one line; the title is the h1 below", crumbs.join(" / ") === "Home / Collections" && (await page.locator("h1").innerText()).trim() === "Glassware", crumbs.join(" / "));
  {
    const wide = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const desk = await wide.newPage();
    await desk.goto(base + "/collections/glassware", { waitUntil: "networkidle" });
    const all = await desk.getByRole("navigation", { name: "Breadcrumb" }).locator("li:visible").allInnerTexts();
    check("1280: breadcrumb Home / Collections / title, the last one current", all.join(" / ") === "Home / Collections / Glassware" && (await desk.locator('nav[aria-label="Breadcrumb"] [aria-current="page"]').innerText()) === "Glassware", all.join(" / "));
    await wide.close();
  }
  const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent)));
  const list = ld.find((entry) => entry["@type"] === "ItemList");
  check("collection page: ItemList JSON-LD with every item, no price", !!list && list.numberOfItems === 4 && list.itemListElement.length === 4 && !/offers|price/i.test(JSON.stringify(list)), list ? list.itemListElement.map((e) => e.name).join(" | ") : "missing");
  check("collection page: no sideways page scroll at 390", await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));

  await page.goto(base + "/collections/cutlery-and-serveware", { waitUntil: "networkidle" });
  const empty = await page.locator("main h2").first().innerText();
  check("empty collection: \"Collection coming soon\" with a WhatsApp action", empty.trim() === "Collection coming soon" && (await page.getByText("WhatsApp us for current stock.").count()) === 1 && (await page.locator('main a[href^="https://wa.me/"]').count()) >= 1, empty);
  check("empty collection: no ItemList", (await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.filter((node) => node.textContent.includes("ItemList")).length)) === 0);

  await page.goto(base + "/collections/premium-melamine", { waitUntil: "networkidle" });
  await hydrated(page);
  await page.getByRole("link", { name: "Blue Rim", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  check("an item with no pieces confirmed shows the App_Flow message", (await page.getByRole("dialog").getByRole("note").innerText()).trim() === "Full catalogue coming soon – WhatsApp us!");
  if (outDir) { await page.waitForTimeout(700); await page.screenshot({ path: `${outDir}/state-item-detail-pending-390.png` }); }

  const missing = await page.goto(base + "/collections/not-a-collection");
  check("an unknown collection is a 404", missing.status() === 404, String(missing.status()));
  await context.close();
}

// ---- Reduced motion ---------------------------------------------------------
console.log("\n   Reduced motion");
for (const width of [390, 1280]) {
  const context = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(base + COLLECTION, { waitUntil: "networkidle" });
  await hydrated(page);
  await page.locator("button[aria-pressed]", { hasText: /^Gold$/ }).click();
  await page.waitForTimeout(150);
  const moving = await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length);
  check(`${width} reduced motion: the filter applies at once, nothing is animating 150ms later`, (await cardNames(page)).length === 3 && moving === 0, `${moving} running`);
  const link = page.locator('a[aria-haspopup="dialog"]').first();
  await link.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").waitFor();
  await page.waitForTimeout(150);
  const box = await page.getByRole("dialog").boundingBox();
  const viewport = page.viewportSize();
  check(`${width} reduced motion: the item dialog is in place within 150ms`, (width < 700 ? Math.abs(box.y + box.height - viewport.height) < 1 : Math.abs(box.x + box.width - viewport.width) < 1) && (await active(page)).text === "Close details", JSON.stringify(box));
  if (outDir) await page.screenshot({ path: `${outDir}/state-item-drawer-reduced-motion-${width}.png` });
  await page.getByRole("dialog").getByRole("button", { name: "Add to quote" }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check(`${width} reduced motion: Esc closes it and focus returns to the card`, (await page.getByRole("dialog").count()) === 0 && (await active(page)).tag === "A");
  await page.locator("[data-quote-button]").click();
  await page.getByRole("dialog", { name: "Your quote list" }).waitFor();
  await page.waitForTimeout(150);
  check(`${width} reduced motion: the quote list opens with focus on its close button`, (await active(page)).text === "Close quote list");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check(`${width} reduced motion: Esc closes it and focus returns to the quote button`, (await page.getByRole("dialog").count()) === 0 && (await active(page)).text.startsWith("Quote list (1)"));
  await context.close();
}

// ---- 4. axe ----------------------------------------------------------------
console.log("\n4. axe");
{
  const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];
  const run = async (name, page) => {
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const bad = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    check(`axe ${name}: 0 serious/critical (${violations.length} of any impact)`, bad.length === 0, violations.map((v) => `${v.id} [${v.impact}] ×${v.nodes.length} ${v.nodes[0].target.join(" ")}`).join("; "));
  };
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await context.newPage();
    await page.goto(base + "/collections", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await run(`/collections @${width}`, page);
    await page.goto(base + COLLECTION + "?finish=gold", { waitUntil: "networkidle" });
    await hydrated(page);
    await page.waitForTimeout(1200);
    await run(`${COLLECTION}?finish=gold @${width}`, page);
    await page.locator('a[aria-haspopup="dialog"]').first().click();
    await page.getByRole("dialog").waitFor();
    await page.waitForTimeout(900);
    await run(`${COLLECTION} item dialog open @${width}`, page);
    await page.getByRole("dialog").getByRole("button", { name: "Add to quote" }).click();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(900);
    await page.locator("[data-quote-button]").click();
    await page.getByRole("dialog", { name: "Your quote list" }).waitFor();
    await page.waitForTimeout(900);
    await run(`${COLLECTION} quote list open @${width}`, page);
    await page.goto(base + "/collections/cutlery-and-serveware", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await run(`/collections/cutlery-and-serveware @${width}`, page);
    await context.close();
  }
}

await browser.close();
console.log(fails === 0 ? "\ncollections-pass: ALL PASS" : `\ncollections-pass: ${fails} FAILED`);
process.exit(fails === 0 ? 0 : 1);
