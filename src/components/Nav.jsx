import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Nav({ sections }) {
  const [active, setActive] = useState(sections[0][0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = sections.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a className="brand" href="#accueil">Studio CGD</a>
        <ThemeToggle />
        <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>
          Menu
        </button>
        <nav id="nav-links" className={open ? "nav-links open" : "nav-links"} aria-label="Sections">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
