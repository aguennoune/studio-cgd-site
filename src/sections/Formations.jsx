const LEVELS = [
  ["Découvrir", "Cours en ligne gratuits d'Odoo pour prendre en main chaque application.", ["Odoo eLearning", "https://www.odoo.com/slides"]],
  ["Pratiquer", "Parcours du Studio sur Odoo eLearning, accompagné d'un tuteur IA, sur des cas réels anonymisés.", null],
  ["Certifier", "Préparation à la certification Odoo, souvent demandée dans les offres de consultant.", ["Documentation Odoo", "https://www.odoo.com/documentation/"]],
];

export default function Formations() {
  return (
    <section id="formations" className="wrap">
      <p className="eyebrow">Formations</p>
      <h2>Trois niveaux, du premier clic à la certification</h2>
      <ol className="levels">
        {LEVELS.map(([t, d, link]) => (
          <li key={t} className="card">
            <h3>{t}</h3>
            <p>{d}</p>
            {link ? <a href={link[1]} target="_blank" rel="noopener">{link[0]}</a> : <span className="muted">Programme et tarifs publiés prochainement</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
