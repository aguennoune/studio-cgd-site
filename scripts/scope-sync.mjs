// Writes src/data/scope.json from the Key-Badge of Odoo (Synthetic Mindware > Output Format Graph Structure).
// Odoo gives a public summary only: proven competences, share of the job postings, proof, format.
// The scope and design content never comes here: it is sent on request, after the contact form with consent.
//   ODOO_URL=… ODOO_DB=… ODOO_API_KEY=… npm run scope-sync -- <badge id>
// Read only on Odoo. The key is read from the environment and never written or printed.
import { writeFileSync } from "node:fs";

const { ODOO_URL, ODOO_DB, ODOO_API_KEY } = process.env;
const id = Number(process.argv[2]);
if (!ODOO_URL || !ODOO_DB || !ODOO_API_KEY || !id) {
  console.error("usage: ODOO_URL=… ODOO_DB=… ODOO_API_KEY=… npm run scope-sync -- <badge id>");
  process.exit(2);
}
const res = await fetch(`${ODOO_URL}/json/2/smw.output.badge/site_export`, {
  method: "POST",
  headers: { Authorization: `bearer ${ODOO_API_KEY}`, "X-Odoo-Database": ODOO_DB, "Content-Type": "application/json" },
  body: JSON.stringify({ ids: [id] }),
});
if (!res.ok) {
  console.error(`Odoo answered ${res.status}`);
  process.exit(1);
}
const [payload] = await res.json();
const KEEP = ["skill", "label", "share", "frequency", "proof", "format", "format_label"];
const out = {
  profile: payload.profile, campaign: payload.campaign, sample: payload.sample, scanned_at: payload.scanned_at,
  skills: payload.skills.map((s) => Object.fromEntries(KEEP.map((k) => [k, s[k]]))),
};
writeFileSync(new URL("../src/data/scope.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`scope.json: ${out.skills.length} proven competence(s), scanned ${out.scanned_at}`);
