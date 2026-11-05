import skills from "../data/skills.json";

export default function Accueil() {
  return (
    <section id="accueil" className="wrap hero">
      <p className="eyebrow">ERP · Odoo 20 · open source</p>
      <h1>Les compétences ERP que les entreprises recherchent, montrées sur un vrai déploiement Odoo 20.</h1>
      <p className="lede">
        {skills.length} compétences relevées dans les offres d'emploi et les rapports du marché ERP en 2026.
        Pour chacune : ce qu'elle recouvre, les modules Odoo qu'elle touche et ce que le Studio CGD en a fait.
      </p>
      <div className="cta">
        <a className="btn primary" href="#competences">Voir les compétences</a>
        <a className="btn" href="#contact">Nous contacter</a>
      </div>
    </section>
  );
}
