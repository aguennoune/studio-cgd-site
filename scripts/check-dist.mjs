// QA test 1 of the plan: the published build holds no JSX source and every asset path honours the base.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const BASE = process.env.SITE_BASE ?? "/studio-cgd-site/";
const fails = [];
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(DIST);

for (const f of files) if (/\.(jsx|tsx)$/.test(f)) fails.push(`JSX source in dist: ${f}`);
const html = readFileSync(join(DIST, "index.html"), "utf8");
for (const [, src] of html.matchAll(/(?:src|href)="(\/[^"]*)"/g))
  if (!src.startsWith(BASE)) fails.push(`asset outside base ${BASE}: ${src}`);
if (html.includes("/src/main.jsx")) fails.push("index.html still points at /src/main.jsx");
if (!files.some((f) => f.endsWith("404.html"))) fails.push("404.html missing");

if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log(`check-dist OK: ${files.length} files, base ${BASE}`);
