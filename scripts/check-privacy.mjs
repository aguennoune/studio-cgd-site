// QA test 9: nothing private reaches the public site or repository.
// Scans dist/ (what is served) and src/ (what is published on GitHub).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const RULES = [
  [/(?:\+212|00212|\b0)[\s.-]?[5-7](?:[\s.-]?\d){8}\b/, "Moroccan phone number"],
  [/[A-Za-z0-9._%+-]+@(?!example\.)[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, "e-mail address"],
  [/localhost:8069|db_dev0|nx_dev_db/, "internal Odoo address or database name"],
  [/ODOO_API_KEY|bearer\s+[A-Za-z0-9]{16,}|sk-ant-[A-Za-z0-9-]+/i, "secret or API key"],
  [/\bS0000\d\b/, "internal sale order reference"],
];
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = ["dist", "src"].flatMap((d) => walk(join(ROOT, d))).filter((f) => /\.(html|js|jsx|json|css|md|txt)$/.test(f));
const hits = [];
for (const f of files) {
  const text = readFileSync(f, "utf8");
  for (const [re, what] of RULES) {
    const m = text.match(re);
    if (m) hits.push(`${f.replace(ROOT, "")}: ${what} (${m[0].slice(0, 40)})`);
  }
}
if (hits.length) { console.error("NOT CLEAN\n" + hits.join("\n")); process.exit(1); }
console.log(`CLEAN: ${files.length} files scanned`);
