#!/usr/bin/env node
/**
 * Import-cycle check for src/. Reads every .ts/.tsx file, resolves its
 * relative and "@/" imports (type-only imports included: a cycle through
 * types is still a design smell), and reports every strongly connected
 * component with more than one file, or a file that imports itself.
 * Exits 1 when a cycle exists.
 *
 *   node scripts/import-cycles.mjs [--json out.json]
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const SRC = join(ROOT, "src");
const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(ts|tsx)$/.test(name) && !name.endsWith(".d.ts") ? [path] : [];
  });
}

function resolveImport(from, specifier) {
  let base;
  if (specifier.startsWith("@/")) base = join(SRC, specifier.slice(2));
  else if (specifier.startsWith(".")) base = resolve(dirname(from), specifier);
  else return null;
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXTENSIONS) if (existsSync(base + ext)) return base + ext;
  return null;
}

const IMPORT = /(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
const files = walk(SRC);
const graph = new Map();
let edgeCount = 0;
for (const file of files) {
  const targets = new Set();
  for (const match of readFileSync(file, "utf8").matchAll(IMPORT)) {
    const target = resolveImport(file, match[1] ?? match[2]);
    if (target !== null) targets.add(target);
  }
  edgeCount += targets.size;
  graph.set(file, [...targets]);
}

/* Tarjan's strongly connected components. */
let index = 0;
const stack = [];
const meta = new Map();
const components = [];
function connect(node) {
  meta.set(node, { index, low: index, onStack: true });
  index += 1;
  stack.push(node);
  for (const next of graph.get(node) ?? []) {
    if (!meta.has(next)) {
      connect(next);
      meta.get(node).low = Math.min(meta.get(node).low, meta.get(next).low);
    } else if (meta.get(next).onStack) {
      meta.get(node).low = Math.min(meta.get(node).low, meta.get(next).index);
    }
  }
  if (meta.get(node).low === meta.get(node).index) {
    const component = [];
    let member;
    do {
      member = stack.pop();
      meta.get(member).onStack = false;
      component.push(member);
    } while (member !== node);
    components.push(component);
  }
}
for (const file of files) if (!meta.has(file)) connect(file);

const cycles = components
  .filter((c) => c.length > 1 || (graph.get(c[0]) ?? []).includes(c[0]))
  .map((c) => c.map((f) => relative(ROOT, f)).sort());

console.log(`import-cycles: ${files.length} files, ${edgeCount} internal import edges`);
if (cycles.length === 0) console.log("import-cycles: none");
for (const cycle of cycles) console.log(`CYCLE (${cycle.length} files): ${cycle.join(" → ")}`);

const jsonAt = process.argv.indexOf("--json");
if (jsonAt !== -1 && process.argv[jsonAt + 1]) {
  writeFileSync(process.argv[jsonAt + 1], JSON.stringify({ files: files.length, edges: edgeCount, cycles }, null, 2));
}
process.exit(cycles.length === 0 ? 0 : 1);
