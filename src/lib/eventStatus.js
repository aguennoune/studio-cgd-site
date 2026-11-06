// Rule as code: the site never claims a participation that is not real.
// Before the date: "prévu" only once the seat is booked (booked === true), else "non réservé".
// After the date: "a participé" only when attended === true, else "à confirmer".
// EventLine shows the line for "prévu" and "a participé" only.
export function eventStatus(ev, now = new Date()) {
  if (now < new Date(ev.start)) return ev.booked === true ? "prévu" : "non réservé";
  if (ev.attended === true) return "a participé";
  return "à confirmer";
}

export const SHOWN = new Set(["prévu", "a participé"]);
