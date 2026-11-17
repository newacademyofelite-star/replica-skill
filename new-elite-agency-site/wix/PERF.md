# Rapport de performance — tour 3D complète (étages 1 à 6 + connexion)

Mesures Lighthouse 12 (profil mobile simulé : processeur ralenti 4×, réseau 4G lente), Chromium sans écran, mêmes conditions pour la version d'avant la 3D et la version actuelle, le 17 novembre 2026.

## Avant / après

| Page | Performance avant | Performance après | Accessibilité avant | Accessibilité après | LCP avant → après |
| --- | --- | --- | --- | --- | --- |
| Accueil (`#accueil`) | 86 | 88 | 94 | 98 | 3,0 s → 3,0 s |
| Formation et paiement (`#f-trading`) | 91 | 91 | 93 | 100 | 2,7 s → 2,7 s |
| Lecteur vidéo (`#v-trading-0`) | 91 | 91 | 89 | 93 | 2,7 s → 2,7 s |
| Connexion (`#connexion`) | 91 | 91 | 98 | 100 | 2,8 s → 2,7 s |

- **Paiement et lecteur vidéo** : aucune dégradation. Ils ne chargent ni Three.js ni GSAP, seulement `boot.js` (4 Ko), et aucune scène ne tourne derrière.
- **Blocage du fil principal (TBT)** : 0 ms sur les quatre pages.
- **Décalage de mise en page (CLS)** : 0 sur les quatre pages.
- **Accessibilité** : en hausse partout. Corrections faites à l'étape 1 : contraste AA du gris secondaire, ordre des titres du pied de page, nom du lien du logo.

Ces scores sont mesurés en version 2D : sans carte graphique, la détection écarte la 3D, comme elle le fera sur un appareil faible.

## Poids de la 3D (accueil, quand elle s'affiche)

| Élément | Transféré (compressé) |
| --- | --- |
| Three.js + chargeur SVG | ≈ 150 Ko |
| GSAP + ScrollTrigger (versions minifiées) | ≈ 41 Ko |
| Code des six étages (`scene3d/`) | ≈ 17 Ko |
| Logo SVG | 1 Ko |
| **Total** | **≈ 210 Ko** |

Aucun modèle `.glb` pour l'instant : les objets sont des formes simples calculées dans le navigateur. Budget restant pour les modèles : 15 Mo au total, 3 Mo maximum par fichier.

La page de connexion charge Three.js (≈ 140 Ko) pour son décor, après l'affichage du formulaire.

## Garde-fous en place

- **Chargement** : la 3D n'est chargée que sur l'accueil et la connexion, après le premier affichage du texte. Elle est détruite dès qu'on change de page.
- **Rendu** :
  - une seule scène pour les six étages ;
  - les étages éloignés de la caméra ne sont pas dessinés ;
  - pas d'ombres calculées, pas de post-traitement ;
  - les faisceaux du podium sont des formes transparentes, pas de vraies lumières.
- **Résolution** : plafonnée à 2 (1,5 sur mobile) ; le décor de connexion est en résolution 1.
- **Boucle de rendu** : elle s'arrête quand la scène sort de l'écran ou que l'onglet est masqué.
- **Qualité adaptative** : la résolution baisse si les images par seconde chutent, puis la page bascule en 2D.
- **Version 2D automatique** dans ces cas :
  - WebGL absent ;
  - appareil faible (2 Go de mémoire ou moins, 2 cœurs ou moins) ;
  - économie de données activée ;
  - rendu sans carte graphique.
- **Réduire les animations** : une image fixe par étage, sans trajet de caméra.

## Limites de ces mesures

- **Pas de carte graphique** dans l'environnement de test. La 3D y est calculée par le processeur. Forcer la 3D (`?3d=on`) sous Lighthouse mesure ce rendu logiciel, pas un vrai appareil.
- **Images par seconde non mesurées** : l'objectif de 60 sur ordinateur et 30 sur mobile doit être vérifié sur de vrais appareils (onglet Performance des outils de développement de Chrome).
- **Mesures variables** : les scores varient de 1 à 2 points d'un passage à l'autre.
- **Erreurs 404 normales** : tant que les modèles et la vidéo d'ambiance ne sont pas déposés, la console affiche une erreur 404 par fichier recherché dans `3d/`.
