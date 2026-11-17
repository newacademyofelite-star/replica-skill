# Rapport de performance — étape 1 (scène 1)

Mesures Lighthouse 12 (profil mobile simulé : processeur ralenti 4×, réseau 4G lente), Chromium sans écran, mêmes conditions avant et après, le 17 novembre 2026.

## Avant / après

| Page | Performance avant | Performance après | Accessibilité avant | Accessibilité après | Affichage du contenu (LCP) avant → après |
| --- | --- | --- | --- | --- | --- |
| Accueil (`#accueil`) | 86 | 86 à 88 | 94 | 98 | 3,0 s → 3,0 s |
| Formation et paiement (`#f-trading`) | 90 | 91 | 93 | 100 | 2,8 s → 2,7 s |
| Lecteur vidéo (`#v-trading-0`) | 91 | 91 | 89 | 93 | 2,7 s → 2,8 s |

- **Paiement et lecteur vidéo** : aucune dégradation. Ils ne chargent ni Three.js ni GSAP, seulement `boot.js` (3 Ko), et aucune scène ne tourne derrière.
- **Blocage du fil principal (TBT)** : 0 ms sur les trois pages.
- **Décalage de mise en page (CLS)** : 0 sur les trois pages.
- **Accessibilité** : elle progresse partout. Trois défauts qui existaient déjà ont été corrigés :
  - le gris des textes secondaires passe à un contraste AA de 5,3:1 ;
  - les titres du pied de page ne sautent plus de niveau ;
  - le nom du lien du logo correspond à son texte visible.

## Poids de la 3D (accueil, quand elle s'affiche)

| Élément | Transféré |
| --- | --- |
| Three.js (module, compressé) | 136 Ko |
| GSAP + ScrollTrigger | 89 Ko |
| Chargeur SVG | 13 Ko |
| Code des scènes + logo SVG | 20 Ko |
| **Total ajouté** | **≈ 260 Ko** (page entière : 491 Ko) |

Aucun modèle `.glb` pour l'instant. Le budget restant pour les modèles est de 15 Mo, 3 Mo maximum par fichier.

## Garde-fous en place

- 3D chargée seulement sur l'accueil, après le premier affichage du texte : le titre et les boutons ne l'attendent jamais.
- Résolution plafonnée à 2 (1,5 sur mobile), pas d'ombres calculées, pas de post-traitement, reflet du sol obtenu par un monogramme miroir (sans second rendu).
- Boucle de rendu arrêtée quand la scène sort de l'écran ou que l'onglet est masqué.
- Qualité adaptative : la résolution baisse si les images par seconde chutent, puis bascule en 2D.
- Version 2D automatique sans WebGL, sur appareil faible (2 Go de mémoire ou moins, 2 cœurs ou moins), en économie de données, ou en rendu sans carte graphique.
- « Réduire les animations » : image fixe, aucun mouvement de caméra.

## Limites de ces mesures

- **Pas de carte graphique** dans l'environnement de test. La 3D y est calculée par le processeur. En forçant la 3D (`?3d=on`), Lighthouse donne 49 et un blocage très élevé : cela mesure ce rendu logiciel, pas un vrai appareil. C'est justement le cas que la détection écarte en temps normal.
- **Images par seconde non mesurées** : l'objectif de 60 sur ordinateur et 30 sur mobile doit être vérifié sur de vrais appareils. Ouvrez l'accueil, puis l'onglet Performance des outils de développement de Chrome.
- **Mesures variables** : l'accueil oscille entre 86 et 88 selon les passages. Une mesure de la page formation a montré un décalage de mise en page passager, quand les polices Google arrivaient en retard. Ce défaut existait déjà avant la 3D ; la hauteur de la zone de contenu est désormais réservée pour l'éviter.
