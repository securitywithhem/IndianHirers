#!/usr/bin/env node
/**
 * Phase R6 pass: the founders, gallery, testimonials, contact and 404 pages,
 * plus the site-wide width, zoom and reduced-motion checks of the final audit.
 * Prints PASS/FAIL lines and exits 1 on a failure. Viewport captures of each
 * state go to <out-dir>. Needs a server already running.
 *
 *   node scripts/r6-pass.mjs docs/evidence/R6/iter1/states [base-url]
 *
 * The enquiry form is never sent anywhere: Web3Forms is intercepted and
 * answered locally (success, then a 3s delay to capture the spinner).
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const outDir = process.argv[2] ?? "docs/evidence/states";
const base = process.argv[3] ?? "http://localhost:3001";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
let fails = 0;
const check = (name, ok, detail = "") => {
  if (!ok) fails++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};
const shot = (page, name) => page.screenshot({ path: `${outDir}/${name}.png` });

const ROUTES = ["/", "/collections", "/collections/bone-china", "/founders", "/gallery", "/testimonials", "/contact", "/no-such-page"];

async function open(path, options = {}) {
  const width = options.width ?? 1280;
  const context = await browser.newContext({
    viewport: { width, height: options.height ?? (width < 700 ? 844 : 900) },
    deviceScaleFactor: options.scale ?? 1,
    isMobile: options.mobile ?? false,
    hasTouch: options.mobile ?? false,
    reducedMotion: options.reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(800);
  return { context, page };
}

const overflowOf = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

// ---- Gallery ---------------------------------------------------------------
{
  const { context, page } = await open("/gallery");
  const tiles = page.locator("ul.columns-2 > li button");
  const count = await tiles.count();
  check("gallery: tiles render in a CSS-columns list", count > 0, `${count} tiles`);

  const lazy = await page.$$eval("ul.columns-2 img", (imgs) => imgs.filter((img) => img.loading === "lazy").length);
  check("gallery: all but the phone's two column heads are lazy", lazy === count - 2, `${lazy} of ${count} lazy`);

  const alts = await page.$$eval("ul.columns-2 img", (imgs) => imgs.map((img) => img.alt.trim()));
  check("gallery: every image has alt text", alts.every((alt) => alt.length >= 12));

  const caption = (index) =>
    page.evaluate((i) => {
      const span = document.querySelectorAll("ul.columns-2 > li button > span[aria-hidden] > span")[i];
      return Number(getComputedStyle(span).opacity);
    }, index);
  check("gallery: caption hidden at rest (pointer device)", (await caption(1)) === 0);
  await tiles.nth(1).hover();
  await page.waitForTimeout(500);
  check("gallery: caption slides up on hover", (await caption(1)) === 1);
  await shot(page, "gallery-1280-hover-caption");

  await page.mouse.move(5, 5);
  await tiles.nth(2).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(500);
  check("gallery: caption shown on keyboard focus", (await caption(2)) === 1);
  await shot(page, "gallery-1280-focus-caption");

  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  const dialog = page.locator('[role="dialog"]');
  check("gallery: Enter opens the viewer dialog", (await dialog.count()) === 1);
  const focusedLabel = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  check("gallery: focus moves to the close button", focusedLabel !== null && /close/i.test(focusedLabel), String(focusedLabel));
  const position = () => page.locator('[role="dialog"] [aria-live="polite"]').textContent();
  const before = await position();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  const after = await position();
  check("gallery: ArrowRight moves to the next photograph", before !== after, `${before} → ${after}`);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(500);
  check("gallery: ArrowLeft moves back", (await position()) === before);
  await shot(page, "gallery-1280-lightbox");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  check("gallery: Esc closes the viewer", (await dialog.count()) === 0);
  const returned = await page.evaluate(() => document.activeElement?.getAttribute("data-tile-index"));
  check("gallery: focus returns to the tile that opened it", returned === "2", String(returned));
  await context.close();
}

{
  const { context, page } = await open("/gallery", { width: 390, mobile: true });
  const opacity = await page.evaluate(() =>
    Number(getComputedStyle(document.querySelector("ul.columns-2 > li button > span[aria-hidden] > span")).opacity),
  );
  check("gallery 390 touch: captions always visible", opacity === 1);
  await page.evaluate(() => window.scrollTo(0, 420));
  await page.waitForTimeout(500);
  await shot(page, "gallery-390-touch-captions");
  await page.locator("ul.columns-2 > li button").first().tap();
  await page.waitForTimeout(900);
  const position = () => page.locator('[role="dialog"] [aria-live="polite"]').textContent();
  const before = await position();
  const box = await page.locator('[role="dialog"] .touch-pan-y').boundingBox();
  const swipe = async (from, to) => {
    const y = box.y + box.height / 2;
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: from, y }] });
    for (let step = 1; step <= 6; step++) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: from + ((to - from) * step) / 6, y }],
      });
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(600);
  };
  await swipe(box.x + box.width * 0.85, box.x + box.width * 0.15);
  const swiped = await position();
  check("gallery 390: swipe left shows the next photograph", swiped !== before, `${before} → ${swiped}`);
  await swipe(box.x + box.width * 0.15, box.x + box.width * 0.85);
  check("gallery 390: swipe right goes back", (await position()) === before);
  await shot(page, "gallery-390-lightbox");
  await context.close();
}

// ---- Gallery: the computed column heads match the real layout ---------------
for (const width of [390]) {
  const { context, page } = await open("/gallery", { width, mobile: width < 700 });
  const heads = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll("ul.columns-2 > li")];
    const firstByColumn = new Map();
    tiles.forEach((li, index) => {
      const left = Math.round(li.getBoundingClientRect().left);
      if (!firstByColumn.has(left)) firstByColumn.set(left, index);
    });
    return [...firstByColumn.values()].map((index) => {
      const img = tiles[index].querySelector("img");
      return { index, loading: img.loading, priority: img.getAttribute("fetchpriority") };
    });
  });
  check(
    `gallery ${width}: every column head loads eagerly`,
    heads.every((head) => head.loading !== "lazy"),
    heads.map((head) => `#${head.index}:${head.loading}${head.priority ? "/" + head.priority : ""}`).join(" "),
  );
  await context.close();
}

// ---- Contact ---------------------------------------------------------------
{
  const { context, page } = await open("/contact", { width: 390, mobile: true });
  const iframe = page.locator("iframe");
  check(
    "contact: map iframe is lazy and titled",
    (await iframe.getAttribute("loading")) === "lazy" && ((await iframe.getAttribute("title")) ?? "").length > 0,
  );
  const tels = await page.$$eval('main a[href^="tel:"]', (links) => [...new Set(links.map((a) => a.getAttribute("href")))]);
  check("contact: both phone numbers are links", tels.length >= 2, tels.join(", "));
  check("contact: WhatsApp link present", (await page.locator('main a[href^="https://wa.me/"]').count()) > 0);
  check("contact: email link present", (await page.locator('main a[href^="mailto:"]').count()) > 0);

  const form = page.locator("form[aria-labelledby]");
  await form.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await form.getByRole("button").click();
  await page.waitForTimeout(500);
  const invalid = await form.locator('[aria-invalid="true"]').count();
  check("contact: empty submit marks the three required fields invalid", invalid === 3, `${invalid}`);
  const firstFocused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
  check("contact: focus moves to the first invalid field", firstFocused === "name", String(firstFocused));
  const described = await form.locator('input[name="name"]').getAttribute("aria-describedby");
  const errorText = described
    ? await page.evaluate((ids) => ids.split(" ").map((id) => document.getElementById(id)?.textContent ?? "").join(" ").trim(), described)
    : null;
  check("contact: error is linked with aria-describedby", errorText !== null && errorText.length > 0, String(errorText));
  const floatingHidden = await page.evaluate(() => {
    const link = document.querySelector('aside a[href^="https://wa.me/"]');
    return link !== null && getComputedStyle(link).display === "none";
  });
  check("contact 390: floating WhatsApp steps aside while a field has focus", floatingHidden);
  await shot(page, "contact-390-errors");

  const phone = form.locator('input[name="phone"]');
  const phoneError = async (value) => {
    await phone.fill(value);
    await form.getByRole("button").click();
    await page.waitForTimeout(300);
    return (await phone.getAttribute("aria-invalid")) === "true";
  };
  for (const bad of ["12345", "5825037478", "98250374781", "abcdefghij"]) {
    check(`contact: phone "${bad}" is rejected`, await phoneError(bad));
  }
  for (const good of ["9825037478", "+91 98250 37478", "098250-37478", "91 8734090908"]) {
    check(`contact: phone "${good}" is accepted`, !(await phoneError(good)));
  }

  await page.route("https://api.web3forms.com/submit", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
  });
  await form.locator('input[name="name"]').fill("Audit Visitor");
  await phone.fill("98250 37478");
  await form.locator('textarea[name="message"]').fill("Two hundred guests, bone china dinner sets, Akota.");
  await form.getByRole("button").click();
  await page.waitForTimeout(600);
  const busy = await form.getAttribute("aria-busy");
  const spinner = await form.locator("button svg.motion-safe\\:animate-spin").count();
  check("contact: sending shows a spinner and aria-busy", busy === "true" && spinner === 1, `aria-busy=${busy}`);
  await shot(page, "contact-390-sending");
  await page.waitForTimeout(3500);
  const heading = await page.evaluate(() => {
    const el = document.activeElement;
    return el?.tagName === "H3" ? el.textContent : null;
  });
  check("contact: success panel replaces the form; its heading has focus", heading !== null, String(heading));
  const inView = await page.evaluate(() => {
    const box = document.activeElement.getBoundingClientRect();
    return box.top >= 72 && box.bottom <= window.innerHeight - 64;
  });
  check("contact: the success heading is on screen, clear of the header and bottom bar", inView);
  check("contact: success panel shows the crown", (await page.locator(".crown-draw svg").count()) > 0);
  const toast = await page.locator("[data-sonner-toast]").count();
  check("contact: no toast repeats the success panel", toast === 0);
  await shot(page, "contact-390-success");
  await page.getByRole("button", { name: /another/i }).click();
  await page.waitForTimeout(500);
  check("contact: 'send another' brings back an empty form", (await page.locator('input[name="name"]').inputValue()) === "");

  /* A failed send: the form stays filled and a Sonner toast says so. */
  await page.unroute("https://api.web3forms.com/submit");
  await page.route("https://api.web3forms.com/submit", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false }) }),
  );
  await page.locator('input[name="name"]').fill("Audit Visitor");
  await page.locator('input[name="phone"]').fill("98250 37478");
  await page.locator('textarea[name="message"]').fill("Two hundred guests, bone china dinner sets, Akota.");
  await page.locator("form[aria-labelledby]").getByRole("button").click();
  await page.waitForTimeout(1500);
  check("contact: a failed send shows a Sonner toast", (await page.locator("[data-sonner-toast]").count()) > 0);
  check("contact: a failed send keeps what was typed", (await page.locator('input[name="name"]').inputValue()) === "Audit Visitor");
  await shot(page, "contact-390-send-failed");
  await context.close();
}

// ---- 404 ------------------------------------------------------------------
{
  const { context, page } = await open("/no-such-page", { width: 390, mobile: true });
  const hrefs = await page.$$eval("main a", (links) => links.map((a) => a.getAttribute("href")));
  check("404: links to Home and Collections", hrefs.includes("/") && hrefs.includes("/collections"), hrefs.join(", "));
  check("404: crown ornament present", (await page.locator("main svg").count()) > 0);
  await context.close();
}

// ---- Founders -------------------------------------------------------------
{
  const { context, page } = await open("/founders");
  const h1 = await page.locator("h1").count();
  check("founders: one h1", h1 === 1);
  const years = await page.$$eval("main ol time", (times) => times.map((t) => t.textContent));
  check("founders: timeline shows only stated years", years.join(",") === "1977,2001,2015,2023", years.join(","));
  check("founders: no TODO text reaches the page", !(await page.content()).includes("TODO"));
  const medallions = await page.locator("main .rounded-full.ring-1").count();
  check("founders: three circular portraits, one per generation", medallions === 3, `${medallions}`);
  const quotes = await page.locator("main aside[aria-hidden] p").count();
  check("founders: pull-quotes present (hidden from AT)", quotes === 2, `${quotes}`);
  await context.close();
}

// ---- Width, zoom, reduced motion over the routes ----------------------------
for (const route of ROUTES) {
  {
    const { context, page } = await open(route, { width: 320, mobile: true });
    const overflow = await overflowOf(page);
    check(`320px ${route}: no horizontal scroll`, overflow <= 0, `${overflow}px`);
    if (route === "/gallery" || route === "/contact" || route === "/founders") await shot(page, `w320${route.replace(/\//g, "-")}`);
    await context.close();
  }
  {
    /* 200% browser zoom on a 1280px window = a 640 CSS px layout at 2x. */
    const { context, page } = await open(route, { width: 640, height: 450, scale: 2 });
    const overflow = await overflowOf(page);
    check(`200% zoom ${route}: no horizontal scroll`, overflow <= 0, `${overflow}px`);
    if (route === "/contact" || route === "/gallery") await shot(page, `zoom200${route.replace(/\//g, "-")}`);
    await context.close();
  }
  {
    const { context, page } = await open(route, { width: 390, mobile: true, reducedMotion: true });
    /* Scroll through so every in-view primitive has had its chance to run. */
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(400);
    const hidden = await page.evaluate(() => {
      const hiddenText = [];
      for (const el of document.querySelectorAll("main h1, main h2, main h3, main p, main li, main a, main button")) {
        if (el.closest("[aria-hidden='true']")) continue;
        let node = el;
        let visible = true;
        while (node && node !== document.body) {
          const cs = getComputedStyle(node);
          if (Number(cs.opacity) < 1 || cs.visibility === "hidden") visible = false;
          node = node.parentElement;
        }
        if (!visible && el.textContent.trim()) hiddenText.push(el.textContent.trim().slice(0, 30));
      }
      return hiddenText;
    });
    check(`reduced motion ${route}: all content visible`, hidden.length === 0, hidden.slice(0, 3).join(" | "));
    await context.close();
  }
}

// ---- robots, sitemap -------------------------------------------------------
{
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  check("robots.txt allows crawling", /User-Agent: \*\s+Allow: \//i.test(robots), robots.replace(/\n/g, " ").slice(0, 80));
  const sitemap = await fetch(`${base}/sitemap.xml`);
  check("sitemap.xml answers 200", sitemap.status === 200);
}

await browser.close();
console.log(fails === 0 ? "\nr6-pass: ALL PASS" : `\nr6-pass: ${fails} FAILED`);
process.exit(fails === 0 ? 0 : 1);
