# New Elite Academy — aperçu de la plateforme

Prototype cliquable de la plateforme e-learning New Elite Agency, en un seul fichier `index.html` (HTML, CSS, JavaScript, sans dépendance). Il montre les écrans du site final avec des données de démonstration ; il sert à valider le parcours avant la construction réelle (Next.js, Supabase, Stripe, Mux, Resend).

## Écrans

- **Public** : accueil, catalogue (filtres, recherche), pages de formation, e-books et packs, contenus gratuits, l'agence, FAQ, contact, pages légales (squelettes), vérification de certificat, page 404. Sélecteur FR/DE/EN (interface principale), mode sombre.
- **Paiement simulé** : carte, PayPal, Apple Pay, Google Pay, code promo (`ELITE10`, `BIENVENUE15`), paiement en 3 fois, garantie 7 jours.
- **Étudiant** : parcours d'accueil en 3 écrans, tableau de bord, lecteur vidéo (filigrane, vitesse, sous-titres, chapitres, quiz qui débloque la suite, notes), lecteur d'e-book, profil et certificat, classement, forum.
- **Admin** : vue d'ensemble et revenus, contenus et planification, codes promo et remboursements, utilisateurs et droits du forum, annonces.

## Démo

Ouvrir `index.html`. Les identifiants sont préremplis sur la page Connexion, avec un bouton « Connexion administrateur (démo) ». L'état est gardé dans le navigateur (`localStorage`) ; « Réinitialiser la démo » dans l'espace remet tout à zéro. Aucun paiement, e-mail ou upload réel.

## Version Wix

Le dossier `wix/` contient le même site découpé en 6 fichiers (`index.html`, `styles.css`, `app1.js` à `app4.js`), tel qu'il est publié sur Wix (site headless `6aebd35f-a36c-47f5-9c1a-3c5308fcd33c`). Pour mettre le site Wix à jour, renvoyer le fichier modifié, complet, sur ce même site.
