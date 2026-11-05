import Nav from "./components/Nav.jsx";
import Accueil from "./sections/Accueil.jsx";
import Competences from "./sections/Competences.jsx";
import Formations from "./sections/Formations.jsx";
import Temoignages from "./sections/Temoignages.jsx";
import Carrieres from "./sections/Carrieres.jsx";
import Ressources from "./sections/Ressources.jsx";
import Contact from "./sections/Contact.jsx";

export const SECTIONS = [
  ["accueil", "Accueil"],
  ["competences", "Compétences"],
  ["formations", "Formations"],
  ["temoignages", "Témoignages"],
  ["carrieres", "Carrières"],
  ["ressources", "Ressources"],
  ["contact", "Contact"],
];

export default function App() {
  return (
    <>
      <a className="skip" href="#competences">Aller au contenu</a>
      <Nav sections={SECTIONS} />
      <main>
        <Accueil />
        <Competences />
        <Formations />
        <Temoignages />
        <Carrieres />
        <Ressources />
        <Contact />
      </main>
      <footer className="wrap footer">
        <p>Studio CGD · Odoo est une marque d'Odoo S.A. Ce site présente le travail du Studio sur Odoo ; il n'est ni édité ni approuvé par Odoo S.A.</p>
      </footer>
    </>
  );
}
