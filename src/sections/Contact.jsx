import ContactForm from "../components/ContactForm.jsx";

export default function Contact() {
  return (
    <section id="contact" className="wrap">
      <p className="eyebrow">Contact</p>
      <h2>Parlons de votre projet ERP</h2>
      <p className="lede">Dites-nous quelle compétence vous intéresse : formation, accompagnement ou projet Odoo.</p>
      <ContactForm />
    </section>
  );
}
