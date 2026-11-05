import EventLine from "./EventLine.jsx";

export default function SkillCard({ code, family, name, status, what, modules, proof, links, events = [] }) {
  return (
    <article className="card skill" id={`skill-${code}`}>
      <div className="skill-hd">
        <div>
          <span className="code">{code} · {family}</span>
          <h3>{name}</h3>
        </div>
        <span className={`status s-${status}`} title={status === "V" ? "Lu dans une source citée" : "Proposition à confirmer"}>
          {status === "V" ? "Source citée" : "À confirmer"}
        </span>
      </div>
      <ul>{what.map((w) => <li key={w}>{w}</li>)}</ul>
      <div className="mods" aria-label="Modules Odoo">{modules.map((m) => <code key={m}>{m}</code>)}</div>
      <p className="proof"><span className="lbl">Preuve Studio</span>{proof}</p>
      {events.map((id) => <EventLine key={id} id={id} />)}
      <div className="links">
        {links.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noopener">{label}</a>)}
      </div>
    </article>
  );
}
