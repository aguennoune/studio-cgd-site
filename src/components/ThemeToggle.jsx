import { useEffect, useState } from "react";

const KEY = "studio-cgd-theme";
const MODES = [["auto", "Auto"], ["light", "Clair"], ["dark", "Sombre"]];

function read() {
  try { return localStorage.getItem(KEY) || "auto"; } catch { return "auto"; }
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(read);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
    try { localStorage.setItem(KEY, mode); } catch { /* private mode: keep for this visit only */ }
  }, [mode]);
  return (
    <div className="theme" role="group" aria-label="Thème">
      {MODES.map(([m, label]) => (
        <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{label}</button>
      ))}
    </div>
  );
}
