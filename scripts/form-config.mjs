// Fill src/data/contact.json from a Google Forms pre-filled link (rules as code: no hand-copied entry ids).
// In Google Forms: ⋮ > "Obtenir le lien prérempli", type these exact values, then "Obtenir le lien":
//   Nom = NOM, E-mail = EMAIL, Organisation = ORGANISATION, Compétence = COMPETENCE,
//   Message = MESSAGE, Consentement = CONSENTEMENT
// Usage: npm run form-config -- "<pre-filled link>"
import { writeFileSync } from "node:fs";

const MARKERS = { NOM: "name", EMAIL: "email", ORGANISATION: "organization", COMPETENCE: "skill", MESSAGE: "message", CONSENTEMENT: "consent" };
const link = process.argv[2];
if (!link) { console.error("usage: node scripts/form-config.mjs \"<pre-filled link>\""); process.exit(2); }

const u = new URL(link);
const m = u.pathname.match(/\/forms\/d\/e\/([^/]+)\//);
if (u.hostname !== "docs.google.com" || !m) { console.error("not a docs.google.com/forms/d/e/<id>/viewform link"); process.exit(1); }

const entries = Object.fromEntries(Object.values(MARKERS).map((k) => [k, null]));
for (const [key, val] of u.searchParams) {
  const field = MARKERS[val.trim().toUpperCase()];
  if (key.startsWith("entry.") && field) entries[field] = key;
}
const missing = Object.entries(entries).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) { console.error(`markers not found for: ${missing.join(", ")}`); process.exit(1); }

const out = new URL("../src/data/contact.json", import.meta.url);
writeFileSync(out, JSON.stringify({ formId: m[1], entries }, null, 2) + "\n");
console.log(`contact.json written: form ${m[1]}, ${Object.keys(entries).length} fields`);
