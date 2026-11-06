import events from "../data/events.json";
import { eventStatus, SHOWN } from "../lib/eventStatus.js";

export { eventStatus };

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Casablanca" });

export default function EventLine({ id }) {
  const ev = events.find((e) => e.id === id);
  if (!ev) return null;
  const st = eventStatus(ev);
  if (!SHOWN.has(st)) return null;
  return (
    <p className="event">
      <span className="lbl">Écosystème</span>
      {ev.title}, {ev.city}, {fmt(ev.start)}, organisé par {ev.organizer} : {st === "prévu" ? "participation prévue" : "participation du Studio"}.
    </p>
  );
}
