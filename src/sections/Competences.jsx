import { useState } from "react";
import skills from "../data/skills.json";
import SkillCard from "../components/SkillCard.jsx";
import ProvenSkills from "../components/ProvenSkills.jsx";

const FAMILIES = ["Toutes", "Fonctionnel", "Technique", "Transverse"];

export default function Competences() {
  const [fam, setFam] = useState("Toutes");
  const shown = fam === "Toutes" ? skills : skills.filter((s) => s.family === fam);
  return (
    <section id="competences" className="wrap">
      <p className="eyebrow">Compétences</p>
      <h2>Huit compétences ERP qui reviennent dans les offres</h2>
      <p className="lede">Synthèse d'offres d'emploi Odoo et de rapports de recrutement ERP. Aucun classement officiel n'existe : l'ordre suit la fréquence observée.</p>
      <div className="filters" role="group" aria-label="Filtrer par famille">
        {FAMILIES.map((f) => (
          <button key={f} aria-pressed={fam === f} onClick={() => setFam(f)}>{f}</button>
        ))}
      </div>
      <div className="grid">{shown.map((s) => <SkillCard key={s.code} {...s} />)}</div>
      <ProvenSkills />
    </section>
  );
}
