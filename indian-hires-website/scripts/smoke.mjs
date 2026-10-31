#!/usr/bin/env node
/**
 * Does the site still do its one job? Checks that the routes answer, the old
 * catalogue URLs still land somewhere, every way to enquire is on the contact
 * page, and no price has reached a page. No dependencies, so it can run against
 * the production URL from a bare checkout.
 *
 *   node scripts/smoke.mjs <base-url>
 */
const base = (process.argv[2] ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("usage: node scripts/smoke.mjs <base-url>");
  process.exit(2);
}

const PAGES = ["/", "/collections", "/collections/bone-china", "/founders", "/gallery", "/testimonials", "/contact"];
const LEGACY = ["/products", "/products/vintage", "/products/bone-china", "/products/melamine", "/products/glassware", "/products/chafing-dishes"];
const ENQUIRY_LINKS = [/wa\.me\/\d{10,}/, /tel:\+\d{10,}/, /mailto:[^"\s]+@/];
const PRICE = /₹|\bRs\.?\s?\d/;

const ATTEMPTS = 3;
const RETRY_MS = 5000;

/** Retries network errors and 5xx: a cold start should not read as an outage. */
async function get(path, redirect = "follow") {
  let last;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(base + path, { redirect, signal: AbortSignal.timeout(30_000) });
      if (response.status < 500) return response;
      last = new Error(`HTTP ${response.status}`);
    } catch (error) {
      last = error;
    }
    if (attempt < ATTEMPTS) await new Promise((done) => setTimeout(done, RETRY_MS));
  }
  throw last;
}

let failures = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`ok    ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL  ${name}: ${error.message}`);
  }
}
const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

console.log(`smoke: ${base}\n`);

for (const page of PAGES) {
  await check(`${page} is up, named, and shows no price`, async () => {
    const response = await get(page);
    expect(response.status === 200, `HTTP ${response.status}`);
    const html = await response.text();
    expect(html.includes("Indian Hirers"), "business name missing");
    expect(!PRICE.test(html), "a price appears on the page");
  });
}

await check("/contact has WhatsApp, phone and email links", async () => {
  const html = await (await get("/contact")).text();
  for (const link of ENQUIRY_LINKS) expect(link.test(html), `no link matching ${link}`);
});

for (const path of LEGACY) {
  await check(`${path} redirects permanently to a live page`, async () => {
    const hop = await get(path, "manual");
    expect(hop.status === 308, `HTTP ${hop.status}, expected 308`);
    const landed = await get(path);
    expect(landed.status === 200, `${landed.url} answered ${landed.status}`);
  });
}

for (const path of ["/robots.txt", "/sitemap.xml"]) {
  await check(`${path} is served`, async () => {
    const response = await get(path);
    expect(response.status === 200, `HTTP ${response.status}`);
  });
}

for (const path of ["/design-system", "/no-such-page"]) {
  await check(`${path} is a 404`, async () => {
    const response = await get(path);
    expect(response.status === 404, `HTTP ${response.status}`);
  });
}

console.log(failures === 0 ? "\nsmoke: ALL PASS" : `\nsmoke: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
