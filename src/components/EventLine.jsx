import events from "../data/events.json";

// Rule as code: the site never claims a participation that has not happened.
// Before the date -> "prévu". After the date -> "a participé" only when attended === true,
// otherwise "à confirmer" until events.json is updated.
export function eventStatus(ev, now = new Date()) {
  if (now < new Date(ev.start)) return "prévu";
  if (ev.attended === true) return "a participé";
  return "à confirmer";
}

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Casablanca" });

export default function EventLine({ id }) {
  const ev = events.find((e) => e.id === id);
  if (!ev) return null;
  const st = eventStatus(ev);
  if (st === "à confirmer") return null;
  return (
    <p className="event">
      <span className="lbl">Écosystème</span>
      {ev.title}, {ev.city}, {fmt(ev.start)}, organisé par {ev.organizer} : {st === "prévu" ? "participation prévue" : "participation du Studio"}.
    </p>
  );
}
