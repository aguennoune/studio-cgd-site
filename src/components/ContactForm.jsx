import { useState } from "react";
import config from "../data/contact.json";
import skills from "../data/skills.json";

// The form is drawn by the site (tokens, dark mode) and posts to Google Forms.
// Google answers cross-site posts with an opaque response: the page can tell that the
// request left, not that Google stored it. The wording says exactly that.
const ready = Boolean(config.formId) && Object.values(config.entries).every(Boolean);
const viewUrl = ready ? `https://docs.google.com/forms/d/e/${config.formId}/viewform` : null;

const EMPTY = { name: "", email: "", organization: "", skill: "", message: "", consent: false };

export default function ContactForm() {
  const [v, setV] = useState(EMPTY);
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!ready || state === "sending") return;
    const body = new URLSearchParams();
    const E = config.entries;
    body.append(E.name, v.name.trim());
    body.append(E.email, v.email.trim());
    body.append(E.organization, v.organization.trim() || "Non renseignée"); // required in the Google Form
    body.append(E.skill, v.skill);
    body.append(E.message, v.message.trim());
    body.append(E.consent, `Oui, ${new Date().toISOString()}`);
    setState("sending");
    try {
      await fetch(`https://docs.google.com/forms/d/e/${config.formId}/formResponse`, { method: "POST", mode: "no-cors", body });
      setState("sent");
      setV(EMPTY);
    } catch {
      setState("error");
    }
  }

  if (!ready) {
    return <p className="card empty">Le formulaire de contact arrive bientôt.</p>;
  }

  return (
    <form className="card form" onSubmit={submit} noValidate={false}>
      <div className="row2">
        <label>Nom<input id="cf-name" required autoComplete="name" value={v.name} onChange={set("name")} /></label>
        <label>E-mail<input id="cf-email" type="email" required autoComplete="email" value={v.email} onChange={set("email")} /></label>
      </div>
      <div className="row2">
        <label><span>Organisation <span className="muted">(facultatif)</span></span><input id="cf-org" autoComplete="organization" value={v.organization} onChange={set("organization")} /></label>
        <label>Compétence qui vous intéresse
          <select id="cf-skill" required value={v.skill} onChange={set("skill")}>
            <option value="">Choisir…</option>
            {skills.map((s) => <option key={s.code} value={`${s.code} · ${s.name}`}>{s.code} · {s.name}</option>)}
            <option value="Autre">Autre</option>
          </select>
        </label>
      </div>
      <label>Message<textarea id="cf-message" required rows={5} maxLength={2000} value={v.message} onChange={set("message")} /></label>
      <label className="consent">
        <input id="cf-consent" type="checkbox" required checked={v.consent} onChange={set("consent")} />
        <span>J'accepte que le Studio CGD utilise ces informations pour me répondre. Elles sont enregistrées dans Google Forms (Google), hors du Maroc, et ne servent à rien d'autre.</span>
      </label>
      <div className="form-foot">
        <button className="btn primary" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : "Envoyer"}</button>
        <p className="muted small" aria-live="polite">
          {state === "sent" && "Message envoyé. Si vous n'avez pas de réponse sous 5 jours ouvrés, utilisez le formulaire Google directement."}
          {state === "error" && "L'envoi n'est pas parti (connexion ?). Réessayez ou ouvrez le formulaire Google."}
          {state !== "idle" && state !== "sending" && <> <a href={viewUrl} target="_blank" rel="noopener">Ouvrir le formulaire Google</a></>}
        </p>
      </div>
    </form>
  );
}
