import careers from "../data/careers.json";

export default function Carrieres() {
  return (
    <section id="carrieres" className="wrap">
      <p className="eyebrow">Carrières</p>
      <h2>Cinq rôles ERP et les compétences qu'ils demandent</h2>
      <div className="tablewrap">
        <table>
          <thead><tr><th>Rôle</th><th>Compétences</th><th>Au quotidien</th></tr></thead>
          <tbody>
            {careers.map((c) => (
              <tr key={c.role}>
                <td>{c.role}</td>
                <td>{c.skills.map((k) => <a key={k} className="chip" href={`#skill-${k}`}>{k}</a>)}</td>
                <td>{c.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">Pas de salaire affiché : les sources consultées divergent. Voir les rapports dans Ressources.</p>
    </section>
  );
}
