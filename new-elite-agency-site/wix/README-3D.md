# Expérience 3D de l'accueil

L'accueil est une « tour » noir et or de six étages : une scène 3D (Three.js) collée en fond, et le texte de chaque étage en vrai HTML par-dessus. La caméra descend d'étage en étage au défilement, avec un arrêt sur chacun.

| Étage | Scène | Texte réel dans la page |
| --- | --- | --- |
| 1 | Monogramme NE extrudé qui émerge d'un sol noir brillant | Devise, titre, boutons |
| 2 | 5 objets dorés sur piédestaux ; survol : rotation lente et fiche ; clic : page de la formation | 5 liens vers les formations (le survol ou le focus clavier d'un lien met l'objet en lumière) |
| 3 | Livre qui s'entrouvre en arrivant, écran avec l'aperçu d'une vidéo d'essai | Liens vers les e-books et la vidéo d'essai |
| 4 | 5 médaillons (1 à 5 barres) et un monogramme dont les barres s'allument une à une | 5 boutons de niveau et leurs avantages |
| 5 | Podium du top 5, faisceaux sur l'étudiant de la semaine et celui du mois | Top 5, étudiants de la semaine et du mois, lien vers le classement |
| 6 | Retour sur le monogramme, vue large | Appel à l'action |

La page de connexion a un décor léger : les 5 barres NE en or qui tournent lentement derrière le formulaire. Toutes les autres pages (catalogue, formation, paiement, lecteurs, forum, profil, admin) restent en 2D : la scène est détruite dès qu'on quitte l'accueil ou la connexion.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `scene3d/boot.js` | Décide entre 3D et version 2D, affiche l'intro, monte et démonte les scènes (`window.NE3D`). Seul fichier chargé sur toutes les pages (4 Ko). |
| `scene3d/core.js` | Moteur de la tour : rendu, étages, caméra par point de vue, survol, qualité adaptative, nettoyage. |
| `scene3d/studio.js` | Éclairage studio, matériaux, cadrage commun, courbes d'animation. |
| `scene3d/scene1.js` | Étages 1 et 6 : monogramme extrudé depuis `3d/logo-ne.svg`. |
| `scene3d/scene2-formations.js` … `scene5-classement.js` | Étages 2 à 5. |
| `scene3d/shapes.js` | Formes simples dorées utilisées tant que les modèles ne sont pas déposés. |
| `scene3d/assets.js` | Chargement des modèles `.glb` (GLTFLoader + Draco), mise à l'échelle automatique ; forme simple si le fichier manque. |
| `scene3d/scroll.js` | Défilement (GSAP ScrollTrigger), un arrêt par étage. |
| `scene3d/login.js` | Décor de la page de connexion. |
| `scene3d/intro.js` | Écran d'intro : barre de progression faite des 5 barres NE. |
| `3d/` | Logo SVG, modèles et vidéo d'ambiance. Voir `ASSETS.md`. |

Three.js 0.170.0 et GSAP 3.12.5 (versions minifiées) viennent du CDN jsDelivr, versions figées dans l'`importmap` de `index.html`. Ils ne sont téléchargés que sur l'accueil et la connexion, et seulement si l'appareil affiche la 3D.

## Remplacer le logo

1. Exportez le logo en SVG en respectant le format décrit dans `ASSETS.md` (identifiants `bar-1` à `bar-5`, `letter-n`, `letter-e`).
2. Remplacez `3d/logo-ne.svg`.
3. Rechargez l'accueil : la scène extrude le nouveau fichier, rien d'autre à changer.

## Remplacer un modèle

1. Déposez le fichier `.glb` dans `3d/` avec le nom prévu dans `ASSETS.md` (par exemple `trading.glb`).
2. C'est tout : il remplace la forme simple au prochain chargement, mis automatiquement à la bonne taille (1 unité de haut, posé au sol, centré).
3. Vérifiez son poids (moins de 3 Mo) et compressez-le si besoin, par exemple : `npx @gltf-transform/cli optimize entree.glb trading.glb --compress draco --texture-compress webp --texture-size 1024`.

Pour le livre (`ebook.glb`), l'animation d'ouverture ne fonctionne qu'avec la forme simple ; un modèle déposé s'affiche fermé tant que son animation n'est pas branchée.

## Quand la 3D s'affiche

La 3D s'affiche si l'appareil a WebGL avec une vraie carte graphique, plus de 2 Go de mémoire, plus de 2 cœurs, et pas le mode économie de données. Sinon, la version 2D (monogramme SVG sur fond noir) reste affichée.

- En cours de route, si les images par seconde chutent, la résolution baisse, puis la page bascule en 2D.
- Avec « réduire les animations » activé, chaque étage s'affiche en image fixe : la caméra saute d'un étage à l'autre, sans trajet ni animation.
- Pour tester : ajoutez `?3d=on` (force la 3D) ou `?3d=off` (force la 2D) à l'adresse, par exemple `index.html?3d=off#accueil`.

## Ajouter ou modifier un étage

Chaque étage est une `<section class="floor" data-floor="N">` dans `vHome()` (`app2.js`) et un module `scene3d/sceneN-….js` qui renvoie son groupe 3D, son point de vue (`layout`) et son animation (`update`). Le défilement crée automatiquement un point d'arrêt par section ; `core.js` place la caméra entre les points de vue des étages.

La version 2D (`?3d=off`, appareil sans carte graphique, WebGL absent) affiche le même texte sur fond noir, avec le monogramme SVG, ou `3d/ambiance.mp4` en fond si le fichier a été déposé.
