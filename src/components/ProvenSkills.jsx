import scope from "../data/scope.json";
import { readUtm } from "./ContactForm.jsx";

// Competences with a delivered proof, from the Key-Badge of Odoo (scope.json, written by npm run scope-sync).
// Only a summary is public. The content itself (README, Manim CE scene, post) is sent on request:
// the visitor asks through the contact form and gives consent there.
export const REQUEST_EVENT = "studio-cgd-request";

export function requestFor(s) {
  return {
    skill: `Contenu · ${s.label}`,
    message: `Je souhaite recevoir le contenu « ${s.format_label} » de la compétence ${s.label}.`,
  };
}

function ask(s) {
  window.dispatchEvent(new CustomEvent(REQUEST_EVENT, { detail: requestFor(s) }));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("cf-name")?.focus({ preventScroll: true });
}

export default function ProvenSkills() {
  if (!scope.skills.length) return null;
  const fromCampaign = readUtm().endsWith(`/${scope.campaign}`);
  return (
    <div className={`proven${fromCampaign ? " from-campaign" : ""}`} id="competences-prouvees">
      <h3>Compétences prouvées</h3>
      <p className="muted small">
        Livrées et testées, pour le profil {scope.profile}. Part des offres d'un échantillon de {scope.sample} annonces Odoo, relevé du {scope.scanned_at}.
        Le contenu détaillé est envoyé sur demande, par le formulaire de contact.
      </p>
      <div className="grid">
        {scope.skills.map((s) => (
          <article key={s.skill} className="card proven-card">
            <span className="code">Citée dans {Math.round(s.share * 100)} % des offres</span>
            <h4>{s.label}</h4>
            <p className="proof"><span className="lbl">Preuve livrée</span>{s.proof}</p>
            <button className="btn" type="button" onClick={() => ask(s)}>Demander le contenu</button>
          </article>
        ))}
      </div>
    </div>
  );
}
