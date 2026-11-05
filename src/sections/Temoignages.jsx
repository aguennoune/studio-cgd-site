// Testimonials are published only with the written consent of the person quoted.
const TESTIMONIALS = [];

export default function Temoignages() {
  return (
    <section id="temoignages" className="wrap">
      <p className="eyebrow">Témoignages</p>
      <h2>Ce qu'en disent les experts et les clients</h2>
      {TESTIMONIALS.length === 0 ? (
        <p className="card empty">Témoignages en cours de recueil. Chacun sera publié avec l'accord écrit de la personne citée.</p>
      ) : (
        <div className="grid">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card">
              <blockquote>{t.quote}</blockquote>
              <figcaption>{t.name}, {t.role} · {t.date}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
