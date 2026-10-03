#!/usr/bin/env node
/**
 * Keyboard, drawer, reduced-motion, fixed-element and layout-shift pass for
 * docs/QA_LOOP.md (added in R4). Prints PASS/FAIL lines; exits 1 on a failure.
 * Needs a server already running.
 *
 * Usage: node scripts/keyboard-pass.mjs [out-dir-for-captures] [base-url]
 */
import { chromium } from "playwright";
const outDir = process.argv[2] ?? null;
const base = process.argv[3] ?? "http://localhost:3001";
const b = await chromium.launch();
let fails = 0;
const check = (name, ok, detail = "") => { if (!ok) fails++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); };
const active = (p) => p.evaluate(() => { const e = document.activeElement; return { tag: e.tagName, text: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 40), href: e.getAttribute("href") }; });

// ---- Desktop keyboard: skip link, nav, header CTA
{
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.keyboard.press("Tab");
  let a = await active(p);
  check("1280 first Tab stop is the skip link", a.href === "#main-content", JSON.stringify(a));
  const order = [];
  for (let i = 0; i < 8; i++) { await p.keyboard.press("Tab"); order.push((await active(p)).text); }
  console.log("      1280 tab order after skip link: " + order.join(" | "));
  check("1280 header order: logo, nav, Get a quote", order[0].includes("Indian Hirers") && order.includes("Our story") && order.some((t) => t.startsWith("Get a quote")));
  const quote = await p.locator("header a", { hasText: "Get a quote" }).getAttribute("href");
  check("Get a quote opens WhatsApp with the quote request", /^https:\/\/wa\.me\/\d+\?text=.*Event%20date/.test(quote ?? ""), (quote ?? "").slice(0, 40));
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.keyboard.press("Tab"); await p.keyboard.press("Enter");
  a = await p.evaluate(() => document.activeElement.id);
  check("skip link moves focus to #main-content", a === "main-content", a);
  const h1 = await p.locator("h1").allInnerTexts();
  check("one h1, the tagline", h1.length === 1 && h1[0].replace(/\s+/g, " ").trim() === "An Occasion with Dignity", JSON.stringify(h1));
  await c.close();
}

// ---- Mobile drawer
for (const reducedMotion of ["no-preference", "reduce"]) {
  const tag = reducedMotion === "reduce" ? "390 reduced-motion" : "390";
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion });
  const p = await c.newPage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1800);
  const trigger = p.locator("header button[aria-expanded]");
  check(`${tag} drawer trigger aria-expanded=false`, (await trigger.getAttribute("aria-expanded")) === "false");
  await trigger.focus(); await p.keyboard.press("Enter");
  await p.waitForTimeout(900);
  check(`${tag} aria-expanded=true, aria-controls set`, (await trigger.getAttribute("aria-expanded")) === "true" && (await trigger.getAttribute("aria-controls")) === "site-menu");
  let a = await active(p);
  check(`${tag} focus moved to the close button`, a.text === "Close menu", JSON.stringify(a));
  const dialog = p.locator('[role="dialog"]#site-menu');
  check(`${tag} dialog is modal and labelled`, (await dialog.getAttribute("aria-modal")) === "true" && !!(await dialog.getAttribute("aria-label")));
  const size = await p.locator("#site-menu nav a").first().evaluate((e) => ({ font: getComputedStyle(e).fontSize, family: getComputedStyle(e).fontFamily.split(",")[0], h: e.getBoundingClientRect().height }));
  check(`${tag} drawer links are display face at 32px, ≥44px tall`, Math.abs(parseFloat(size.font) - 32) < 0.1 && size.family.includes("Cormorant") && size.h >= 44, JSON.stringify(size));
  const anim = await p.locator("#site-menu [data-slide-item]").first().evaluate((e) => getComputedStyle(e).animationName);
  check(`${tag} drawer stagger ${reducedMotion === "reduce" ? "absent" : "present"}`, reducedMotion === "reduce" ? anim === "none" : anim === "motion-slide-item", anim);
  let inside = true;
  for (let i = 0; i < 12; i++) { await p.keyboard.press("Tab"); inside &&= await p.evaluate(() => !!document.activeElement.closest("#site-menu")); }
  check(`${tag} Tab ×12 stays inside the drawer`, inside);
  for (let i = 0; i < 3; i++) { await p.keyboard.press("Shift+Tab"); inside &&= await p.evaluate(() => !!document.activeElement.closest("#site-menu")); }
  check(`${tag} Shift+Tab stays inside the drawer`, inside);
  const locked = await p.evaluate(() => ({ overflow: document.documentElement.style.overflow, inert: document.querySelector("main").inert }));
  check(`${tag} page scroll locked and background inert`, locked.overflow === "hidden" && locked.inert === true, JSON.stringify(locked));
  await p.keyboard.press("Escape"); await p.waitForTimeout(700);
  a = await active(p);
  check(`${tag} Esc closes, focus back on the trigger`, (await p.locator("#site-menu").count()) === 0 && a.text === "Open menu", JSON.stringify(a));
  const unlocked = await p.evaluate(() => ({ overflow: document.documentElement.style.overflow, inert: document.querySelector("main").inert }));
  check(`${tag} scroll and inert restored`, unlocked.overflow !== "hidden" && unlocked.inert === false);

  // Fixed elements: bar and floating WhatsApp never overlap; body reserves the bar.
  const geo = await p.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const bar = r('nav[aria-label="Quick contact"]'), fab = r('aside[aria-label="WhatsApp shortcut"] a');
    return { barTop: bar.top, barH: bar.height, fabBottom: fab.bottom, fabW: fab.width, pad: getComputedStyle(document.body).paddingBottom };
  });
  check(`${tag} floating WhatsApp sits above the bottom bar`, geo.fabBottom <= geo.barTop - 8 && geo.fabW === 56, JSON.stringify(geo));
  check(`${tag} body reserves the bar's height`, parseFloat(geo.pad) === geo.barH, JSON.stringify(geo));

  if (reducedMotion === "reduce") {
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
    const hidden = await p.evaluate(() => [...document.querySelectorAll("main *, footer *")].filter((e) => e.getClientRects().length && (getComputedStyle(e).opacity === "0") && !e.hasAttribute("aria-hidden") && !e.closest("[aria-hidden]")).length);
    check("reduced motion: no content left at opacity 0", hidden === 0, `${hidden} element(s)`);
    const pending = await p.locator("[data-reveal], [data-draw]").count();
    check("reduced motion: no reveal or draw observer attached", pending === 0, `${pending}`);
    const pulse = await p.locator('aside[aria-label="WhatsApp shortcut"] a span').first().evaluate((e) => getComputedStyle(e).animationName + "/" + getComputedStyle(e).opacity);
    check("reduced motion: WhatsApp ring still and invisible", pulse === "none/0", pulse);
    const stat = await p.locator("[data-count]").first().innerText().catch(() => "n/a");
    console.log("      counter text under reduced motion: " + JSON.stringify(stat));
  }
  await c.close();
}

// ---- Tablet (900px): the gold header button and the drawer trigger coexist
{
  const c = await b.newContext({ viewport: { width: 900, height: 1000 } });
  const p = await c.newPage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.keyboard.press("Tab");
  const order = [];
  for (let i = 0; i < 3; i++) { await p.keyboard.press("Tab"); order.push((await active(p)).text); }
  check("900 header order: logo, Get a quote, menu button", order[0].includes("Indian Hirers") && order[1].startsWith("Get a quote") && order[2] === "Open menu", order.join(" | "));
  await p.keyboard.press("Enter"); await p.waitForTimeout(900);
  let inside = (await active(p)).text === "Close menu";
  for (let i = 0; i < 10; i++) { await p.keyboard.press("Tab"); inside &&= await p.evaluate(() => !!document.activeElement.closest("#site-menu")); }
  check("900 drawer opens from the keyboard and traps focus", inside);
  await p.keyboard.press("Escape"); await p.waitForTimeout(700);
  check("900 Esc closes, focus back on the trigger", (await active(p)).text === "Open menu");
  await c.close();
}

// ---- Collection page at 390 with an item in the quote list: the quote-list
// button takes the floating WhatsApp button's slot, so only one round button
// is ever over the page.
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  await p.goto(base + "/collections/bone-china", { waitUntil: "networkidle" });
  await p.waitForTimeout(1800);
  const fab = p.locator('aside[aria-label="WhatsApp shortcut"] a');
  check("390 collection, empty list: floating WhatsApp shown", await fab.isVisible());
  await p.getByRole("button", { name: /add to quote/i }).first().click();
  await p.waitForTimeout(600);
  check("390 collection, item in list: floating WhatsApp hidden", !(await fab.isVisible()));
  const g = await p.evaluate(() => {
    const r = (e) => e.getBoundingClientRect();
    const quote = r(document.querySelector("[data-quote-button]"));
    const bar = r(document.querySelector('nav[aria-label="Quick contact"]'));
    return { quoteTop: quote.top, quoteBottom: quote.bottom, barTop: bar.top };
  });
  check("390 collection: quote-list button 16px above the bar", g.barTop - g.quoteBottom === 16, JSON.stringify(g));
  const buttons = p.locator("main button", { hasText: /add to quote|added/i });
  const n = await buttons.count();
  let blocked = 0;
  for (let i = 0; i < n; i++) {
    const ok = await buttons.nth(i).evaluate((el) => {
      el.scrollIntoView({ block: "center" });
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)) && el.contains(document.elementFromPoint(r.right - 6, r.top + r.height / 2));
    });
    if (!ok) blocked++;
  }
  check(`390 collection: all ${n} card buttons take a tap at centre and right edge when scrolled to mid-screen`, blocked === 0, `${blocked} blocked`);
  if (outDir) {
    await buttons.nth(1).evaluate((el, top) => { el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); window.scrollBy(0, r.top - (top + 4)); }, g.quoteTop);
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${outDir}/state-quote-button-390.png` });
    console.log(`      capture (worst case, a card button level with the round button): ${outDir}/state-quote-button-390.png`);
  }
  await c.close();
  const d = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const q = await d.newPage();
  await q.goto(base + "/collections/bone-china", { waitUntil: "networkidle" });
  await q.waitForTimeout(1500);
  await q.getByRole("button", { name: /add to quote/i }).first().click();
  await q.waitForTimeout(600);
  const gd = await q.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); return { quoteBottom: r("[data-quote-button]").bottom, fabTop: r('aside[aria-label="WhatsApp shortcut"] a').top }; });
  check("1280 collection: both buttons shown, quote list 16px above WhatsApp", gd.fabTop - gd.quoteBottom === 16, JSON.stringify(gd));
  await d.close();
}

// ---- CLS on / (layout-shift entries over load + 4s), mobile
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(4000);
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
  const cls = await p.evaluate(() => window.__cls);
  check("CLS on / at 390 (load, fonts, bar entrance, full scroll) < 0.05", cls < 0.05, cls.toFixed(4));
  await c.close();
}
await b.close();
console.log(`\n${fails} failure(s)`);
process.exit(fails ? 1 : 0);
