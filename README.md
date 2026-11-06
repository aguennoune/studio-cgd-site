# Studio CGD · Compétences ERP

Site du Studio CGD : les compétences ERP les plus demandées, prouvées sur Odoo 20.
React + Vite (vues JSX), publié sur GitHub Pages, thèmes Auto / Clair / Sombre.

Site : https://aguennoune.github.io/studio-cgd-site/

## Sections

Accueil · Compétences (8 cartes, filtre par famille) · Formations · Témoignages · Carrières · Ressources · Contact (Google Forms).

Le contenu vit dans `src/data/*.json` : modifier une carte, un rôle ou une ressource ne touche pas au code.

## Développer

```bash
npm ci
npm run dev          # http://localhost:5173/studio-cgd-site/
npm run build        # dist/
npm run check-dist   # aucun .jsx dans dist/, chemins sous /studio-cgd-site/
npm run preview      # http://localhost:4173/studio-cgd-site/
```

`SITE_BASE=/` pour un site utilisateur (`<compte>.github.io`).

## Formulaire de contact

Le formulaire est dessiné par le site et envoie vers un Google Form. Il reste inactif tant que
`src/data/contact.json` n'a pas d'identifiant. Pour le relier :

1. Créer un Google Form avec 6 questions en réponse courte ou paragraphe : Nom, E-mail, Organisation, Compétence, Message, Consentement.
2. ⋮ > « Obtenir le lien prérempli », saisir `NOM`, `EMAIL`, `ORGANISATION`, `COMPETENCE`, `MESSAGE`, `CONSENTEMENT`, puis « Obtenir le lien ».
3. `npm run form-config -- "<lien prérempli>"`

## Règles de contenu

- Aucun salaire, prix ou chiffre de marché sans source datée.
- Témoignages publiés seulement avec l'accord écrit de la personne citée.
- Événements : `src/data/events.json` (règle dans `src/lib/eventStatus.js`). Avant la date, « participation prévue » n'apparaît que si `booked` vaut `true` (place réservée) ; après, la mention n'apparaît que si `attended` vaut `true`.
- Odoo est une marque d'Odoo S.A. Ce site présente le travail du Studio sur Odoo ; il n'est ni édité ni approuvé par Odoo S.A.

## Déploiement

`.github/workflows/pages.yml` construit le site à chaque push sur `main` et le publie.
Réglage du dépôt : Settings > Pages > Source : **GitHub Actions**.

## Licence

Code sous licence MIT (voir `LICENSE`). Les textes du site et les captures restent © Studio CGD.
