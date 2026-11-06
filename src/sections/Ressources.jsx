import res from "../data/resources.json";

export default function Ressources() {
  return (
    <section id="ressources" className="wrap">
      <p className="eyebrow">Ressources</p>
      <h2>Pour aller plus loin</h2>
      <ul className="res">
        {res.items.map(([title, source, href]) => (
          <li key={href}><a href={href} target="_blank" rel="noopener">{title}</a> <span className="muted">· {source}</span></li>
        ))}
      </ul>
      <p className="muted small">Liens vérifiés le {new Date(res.checked).toLocaleDateString("fr-FR", { timeZone: "UTC" })}.</p>
    </section>
  );
}
