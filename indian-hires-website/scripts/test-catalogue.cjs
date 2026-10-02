#!/usr/bin/env node
/**
 * Unit tests for src/lib/catalogue.ts and the catalogue data behind it.
 * Run as `npm run test:catalogue`. No test runner is installed, so this is a
 * plain node script: it loads the TypeScript sources through the `typescript`
 * package already in devDependencies and uses node:assert.
 *
 * Covers: the getItems filters, buildWhatsAppQuoteUrl encoding, that every
 * line of the owner's catalogue is in the data exactly once, and that no
 * price-shaped field exists. Prints the count of entries per collection.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const ts = require("typescript");

const SRC = path.resolve(__dirname, "../src");
const WHATSAPP = "919825037478";

// --- load .ts sources and the "@/..." alias --------------------------------

require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  const mapped = request.startsWith("@/") ? path.join(SRC, request.slice(2)) : request;
  return resolveFilename.call(this, mapped, ...rest);
};

/** Loads the catalogue afresh; env.ts reads process.env when it is first required. */
function load(whatsapp) {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(SRC)) delete require.cache[key];
  }
  process.env.NEXT_PUBLIC_WHATSAPP = whatsapp;
  return {
    catalogue: require("@/lib/catalogue"),
    content: require("@/content/collections"),
  };
}

// --- tiny runner -----------------------------------------------------------

let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`  FAIL  ${name}\n        ${String(error.message).split("\n").join("\n        ")}`);
  }
}

const { catalogue, content } = load(WHATSAPP);
const { getCollections, getCollection, getItems, getFeatured, buildWhatsAppQuoteUrl } = catalogue;
const names = (items) => items.map((item) => item.name);
const item = (id) => {
  const found = content.getItem(id);
  assert.ok(found, `no public item ${id}`);
  return found;
};

// --- getCollections / getCollection ---------------------------------------

console.log("\ngetCollections, getCollection");

test("eight collections, in display order", () => {
  assert.deepEqual(
    getCollections().map((c) => c.slug),
    [
      "heritage-silver",
      "bone-china",
      "premium-melamine",
      "regular-melamine",
      "chat-and-snack-plates",
      "chafing-dishes",
      "cutlery-and-serveware",
      "glassware",
    ]
  );
});

test("getCollection finds a slug and returns undefined for an unknown one", () => {
  assert.equal(getCollection("bone-china").title, "Bone China");
  assert.equal(getCollection("no-such-collection"), undefined);
  assert.equal(getCollection(""), undefined);
});

// --- getItems --------------------------------------------------------------

console.log("\ngetItems");

test("no query returns every public item and nothing hidden", () => {
  const all = getItems();
  assert.equal(all.length, content.allPublicItems.length);
  assert.ok(all.every((i) => i.status === "available"));
  assert.equal(new Set(all.map((i) => i.id)).size, all.length, "ids are unique");
});

test("collection filter", () => {
  const items = getItems({ collection: "regular-melamine" });
  assert.deepEqual(names(items), ["Matt", "24KT Gold"]);
  assert.deepEqual(getItems({ collection: "cutlery-and-serveware" }), []);
});

test("hidden entries are never returned", () => {
  const boneChina = names(getItems({ collection: "bone-china" }));
  assert.ok(!boneChina.includes("Yellow"));
  assert.ok(!boneChina.includes("Black-White"));
  const chafing = getItems({ collection: "chafing-dishes" });
  assert.equal(chafing.length, 5);
  assert.ok(chafing.every((i) => !i.slug.startsWith("todo-")));
  assert.ok(!names(getItems({ collection: "chat-and-snack-plates" })).includes("Chat Plate"));
});

test("no hidden entry leaves the module through a collection", () => {
  const hidden = content.collections.flatMap((c) => c.items).filter((i) => i.status !== "available");
  assert.equal(hidden.length, 9, "the fixture has hidden entries to leak");
  const viaList = getCollections().flatMap((c) => c.items);
  const viaSlug = content.collectionSlugs.flatMap((slug) => getCollection(slug).items);
  for (const exposed of [viaList, viaSlug]) {
    assert.equal(exposed.length, content.allPublicItems.length);
    assert.ok(exposed.every((i) => i.status === "available"));
  }
});

test("material filter", () => {
  const items = getItems({ material: "bone-china" });
  assert.ok(items.length > 0);
  assert.ok(items.every((i) => i.collection === "bone-china"));
  assert.deepEqual(names(getItems({ material: "silver-plated" })), [
    "Silver-Plated Plates",
    "Silver-Plated Cutlery",
  ]);
  // No public item has a confirmed steel, brass or copper material.
  assert.deepEqual(getItems({ material: "steel" }), []);
});

test("finish filter matches any of an item's finishes", () => {
  assert.deepEqual(names(getItems({ finish: "rose-gold" })), ["Rose Gold"]);
  assert.ok(names(getItems({ finish: "green" })).includes("Green Golden"));
  assert.ok(names(getItems({ finish: "gold" })).includes("Green Golden"));
  assert.deepEqual(names(getItems({ finish: "marble" })), ["Marble"]);
});

test("pieceType filter", () => {
  const soupSets = getItems({ pieceType: "soup-set" });
  assert.equal(soupSets.length, 12);
  assert.ok(
    soupSets.every((i) =>
      ["bone-china", "premium-melamine", "regular-melamine"].includes(i.collection)
    )
  );
  assert.equal(getItems({ pieceType: "soup-set", collection: "regular-melamine" }).length, 2);
  assert.deepEqual(names(getItems({ pieceType: "mug" })), ["Mug"]);
  assert.deepEqual(
    names(getItems({ pieceType: "bowl", collection: "premium-melamine" })),
    ["Matt Black Series"]
  );
});

test("criteria combine with AND", () => {
  assert.deepEqual(
    names(getItems({ collection: "bone-china", material: "bone-china", finish: "white", pieceType: "dinner-set" })),
    ["White"]
  );
  assert.deepEqual(getItems({ collection: "bone-china", material: "melamine" }), []);
  assert.deepEqual(getItems({ collection: "glassware", pieceType: "dinner-set" }), []);
});

test("getFeatured returns public, photographed items", () => {
  const featured = getFeatured();
  assert.ok(featured.length > 0);
  assert.ok(featured.every((i) => i.featured && i.status === "available" && i.image !== null));
});

// --- buildWhatsAppQuoteUrl -------------------------------------------------

console.log("\nbuildWhatsAppQuoteUrl");

const PREFIX = `https://wa.me/${WHATSAPP}?text=`;
const messageOf = (url) => decodeURIComponent(url.slice(PREFIX.length));

test("one item per numbered line, with its collection", () => {
  const url = buildWhatsAppQuoteUrl([
    item("bone-china--rose-gold"),
    item("chat-and-snack-plates--marble"),
  ]);
  assert.ok(url.startsWith(PREFIX));
  assert.equal(
    messageOf(url),
    "Hello Indian Hirers, I'd like a quote for:\n1. Rose Gold (Bone China)\n2. Marble (Chat & Snack Plates)"
  );
});

test("hidden items are dropped from the message", () => {
  const everything = content.collections.flatMap((c) => c.items);
  const message = messageOf(buildWhatsAppQuoteUrl(everything));
  assert.equal(message.split("\n").length, content.allPublicItems.length + 1);
  for (const name of ["Yellow", "Black-White", "Chat Plate", "TODO"]) {
    assert.ok(!message.includes(name), `"${name}" is in the message`);
  }
  const onlyHidden = everything.filter((i) => i.status !== "available");
  assert.equal(messageOf(buildWhatsAppQuoteUrl(onlyHidden)), messageOf(buildWhatsAppQuoteUrl([])));
});

test("the message is fully percent-encoded", () => {
  const url = buildWhatsAppQuoteUrl([
    item("chat-and-snack-plates--mug"),
    item("premium-melamine--blue-gold-border"),
  ]);
  const text = url.slice(PREFIX.length);
  // encodeURIComponent leaves ( ) ' ! * unescaped; they are safe in a query.
  assert.ok(!/[\s&#?+="]/.test(text), `unencoded character in: ${text}`);
  assert.ok(text.includes("%0A"), "line breaks are %0A");
  assert.ok(text.includes("%26"), "ampersands are %26");
  assert.ok(text.includes("%20"), "spaces are %20, not +");
  assert.equal(url.split("?").length, 2, "exactly one query string");
});

test("an empty list gives the general enquiry", () => {
  assert.equal(
    messageOf(buildWhatsAppQuoteUrl([])),
    "Hello Indian Hirers, I'd like to enquire about crockery on hire for my event."
  );
});

test("falls back to the contact page when no WhatsApp number is set", () => {
  const unset = load("");
  assert.equal(
    unset.catalogue.buildWhatsAppQuoteUrl(unset.catalogue.getItems({ collection: "glassware" })),
    "/contact"
  );
});

// --- the owner's catalogue, line by line -----------------------------------

console.log("\nowner's catalogue");

const BONE_CHINA = ["Dinner Set", "Soup Set", "Quarter Plate"];
const SET = ["Dinner Set", "Soup Set"];
const SIZES = ["Small", "Big"];

/** collection → design name as shown → piece labels. Names drop "Melamine" (naming rule). */
const EXPECTED = {
  "bone-china": {
    "Clay Craft Golden": BONE_CHINA,
    "Rose Gold": BONE_CHINA,
    "Golden Rim": BONE_CHINA,
    "Green Golden": BONE_CHINA,
    Yellow: BONE_CHINA,
    White: BONE_CHINA,
    "Black-White": BONE_CHINA,
  },
  "premium-melamine": {
    "Double Color": SET,
    "24KT Blue": SET,
    "Matt Black Series": [
      "Dinner Set",
      "Soup Set",
      "Chat Bowl (Big)",
      "Chat Bowl (Small)",
      "Snack Plate (Big)",
      "Snack Plate (Small)",
      'Nasta Plate 9"',
    ],
  },
  "regular-melamine": { Matt: SET, "24KT Gold": SET },
  "chat-and-snack-plates": {
    Rectangular: [],
    "Dessert Bowl": ["Dessert Bowl"],
    "Snack Plate": ["Snack Plate"],
    Mug: ["Mug"],
    "Chat Plate": SIZES,
    "Blue Handle": [],
    Marble: SIZES,
    Matt: SIZES,
  },
};

// `collection.items` includes the hidden entries; a catalogue line must be in
// the data even while it is held back from the site.
const allEntries = (slug) => content.getCollection(slug).items;

for (const [slug, designs] of Object.entries(EXPECTED)) {
  test(`${slug}: every catalogue line present exactly once`, () => {
    const entries = allEntries(slug);
    for (const [name, pieces] of Object.entries(designs)) {
      const matches = entries.filter((entry) => entry.name === name);
      assert.equal(matches.length, 1, `"${name}" appears ${matches.length} times`);
      assert.deepEqual(matches[0].pieces.map((piece) => piece.label), pieces, `pieces of "${name}"`);
    }
  });
}

test("chat plates: the catalogue's eleven lines map to eight entries, none extra", () => {
  assert.deepEqual(
    names(allEntries("chat-and-snack-plates")).sort(),
    Object.keys(EXPECTED["chat-and-snack-plates"]).sort()
  );
});

test("placeholders: silver-plated range, six chafing dish designs, cutlery & serveware", () => {
  const silver = names(allEntries("heritage-silver"));
  for (const name of ["Silver-Plated Plates", "Silver-Plated Cutlery", "Tableware"]) {
    assert.equal(silver.filter((n) => n === name).length, 1, name);
  }
  const todo = allEntries("chafing-dishes").filter((entry) => entry.status === "todo");
  assert.equal(todo.length, 6);
  assert.deepEqual(allEntries("cutlery-and-serveware"), []);
});

// The built objects copy a fixed set of keys, so a rate typed on a seed would
// not show up in them. These two read the source files instead.
const CONTENT_SOURCES = ["collections.ts", "site.ts", "types.ts", "home.ts"]
  .map((file) => path.join(SRC, "content", file))
  .concat(path.join(SRC, "lib/catalogue.ts"));

test("no price-shaped property in the content sources", () => {
  // `rate?: never` in the NoPricing guard is the one permitted spelling.
  const property = /\b(price|prices|mrp|rate|rates|setRate|cost|amount|currency|discount|showPrices|SHOW_PRICES)\b\s*(?!\?\s*:\s*never)[?:=]/;
  for (const file of CONTENT_SOURCES) {
    fs.readFileSync(file, "utf8").split("\n").forEach((line, index) => {
      assert.ok(!property.test(line), `${path.basename(file)}:${index + 1}: ${line.trim()}`);
    });
  }
});

test("no rupee figure in any string a visitor can reach", () => {
  const figure = /₹|\bRs\.?\s?\d|\bINR\b|\d\s*\/-|\d\s*(?:per|a)\s+(?:piece|pc|set)\b/i;
  let seen = 0;
  const walk = (value, trail) => {
    if (typeof value === "string") {
      seen += 1;
      assert.ok(!figure.test(value), `${trail}: ${value}`);
    } else if (typeof value === "function") {
      // Copy templates take a name or a count; either argument exercises them.
      for (const arg of ["Golden Rim", 3]) {
        try {
          walk(value(arg, arg), `${trail}()`);
        } catch {
          // A template that needs other arguments is covered by its callers.
        }
      }
    } else if (value !== null && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) walk(child, `${trail}.${key}`);
    }
  };
  walk(content.collections, "collections");
  walk(content.catalogueCopy, "catalogueCopy");
  walk(require("@/content/site").trustBadges, "trustBadges");
  walk(messageOf(buildWhatsAppQuoteUrl(getItems())), "quote message");
  assert.ok(seen > 300, `only ${seen} strings were checked`);
  assert.ok(figure.test("Matt Melamine = 12/-") && figure.test("₹25") && figure.test("Rs 8"), "the pattern matches a rate");
});

test("trust badges: none is renderable until the owner confirms it", () => {
  const badges = require("@/content/site").trustBadges;
  assert.equal(badges.length, 4);
  assert.ok(badges.every((badge) => badge.confirmed === false));
});

// --- counts ----------------------------------------------------------------

console.log("\nEntries per collection\n");
console.log("| Collection | Public | Hidden | Total | With photograph |");
console.log("|---|---:|---:|---:|---:|");
const totals = [0, 0, 0, 0];
for (const collection of content.collections) {
  const shown = collection.items.filter((entry) => entry.status === "available");
  const row = [
    shown.length,
    collection.items.length - shown.length,
    collection.items.length,
    shown.filter((entry) => entry.image !== null).length,
  ];
  row.forEach((n, i) => (totals[i] += n));
  console.log(`| ${collection.title} | ${row.join(" | ")} |`);
}
console.log(`| **Total** | ${totals.join(" | ")} |`);

console.log(failed === 0 ? "\ntest-catalogue: ALL PASS" : `\ntest-catalogue: ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
