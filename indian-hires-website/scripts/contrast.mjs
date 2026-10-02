#!/usr/bin/env node
/**
 * Contrast table for the colour tokens in src/app/globals.css.
 * Reads every `--name: H S% L%;` triplet from :root and prints the WCAG ratio
 * for each pair listed in PAIRS. Usage: node scripts/contrast.mjs [fg bg ...]
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../src/app/globals.css"), "utf8");
const tokens = new Map();
for (const m of css.matchAll(/--([\w-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*;/g)) {
  if (!tokens.has(m[1])) tokens.set(m[1], [Number(m[2]), Number(m[3]), Number(m[4])]);
}

function rgb([h, s, l]) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}
const lum = (c) => {
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const mix = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a));
const hex = (c) => "#" + c.map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();

/** "gold-700" or "espresso-900/70" (alpha composited over the background). */
function resolveColor(spec, bg) {
  const [name, alpha] = spec.split("/");
  const t = tokens.get(name);
  if (!t) throw new Error(`unknown token --${name}`);
  const c = rgb(t);
  return alpha ? mix(c, bg, Number(alpha) / 100) : c;
}

const args = process.argv.slice(2);
if (args.length === 0 || args.length % 2) {
  console.log("tokens:");
  for (const [n, t] of tokens) console.log(`  --${n}: ${t[0]} ${t[1]}% ${t[2]}%  ${hex(rgb(t))}`);
  process.exit(0);
}
for (let i = 0; i < args.length; i += 2) {
  const bg = resolveColor(args[i + 1], [1, 1, 1]);
  const fg = resolveColor(args[i], bg);
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  const ratio = (a + 0.05) / (b + 0.05);
  const grade = ratio >= 4.5 ? "AA body" : ratio >= 3 ? "large/UI only" : "FAIL";
  console.log(`${args[i].padEnd(20)} on ${args[i + 1].padEnd(14)} ${ratio.toFixed(2).padStart(6)}  ${grade}`);
}
