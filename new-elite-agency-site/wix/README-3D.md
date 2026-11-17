# Expérience 3D de l'accueil

L'accueil est une « tour » noir et or : une scène 3D (Three.js) collée en fond, et le texte de chaque étage en vrai HTML par-dessus. Les autres pages (catalogue, formation, paiement, lecteurs, forum, profil, admin) restent en 2D : la scène est détruite dès qu'on quitte l'accueil.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `scene3d/boot.js` | Décide entre 3D et version 2D, affiche l'intro, monte et démonte la scène (`window.NE3D`). Seul fichier chargé sur toutes les pages (3 Ko). |
| `scene3d/core.js` | Moteur commun : rendu, éclairage studio, boucle, qualité adaptative, nettoyage. |
| `scene3d/scene1.js` | Scène 1 : monogramme extrudé depuis `3d/logo-ne.svg`, sol brillant, particules. |
| `scene3d/scroll.js` | Caméra pilotée par le défilement (GSAP ScrollTrigger), un arrêt par étage. |
| `scene3d/assets.js` | Chargement des modèles `.glb` (GLTFLoader + Draco) ; forme simple si le fichier manque. |
| `scene3d/intro.js` | Écran d'intro : barre de progression faite des 5 barres NE. |
| `3d/` | Logo SVG et modèles. Voir `ASSETS.md`. |

Three.js 0.170.0 et GSAP 3.12.5 viennent du CDN jsDelivr, versions figées dans l'`importmap` de `index.html`. Ils ne sont téléchargés que sur l'accueil, et seulement si l'appareil affiche la 3D.

## Remplacer le logo

1. Exportez le logo en SVG en respectant le format décrit dans `ASSETS.md` (identifiants `bar-1` à `bar-5`, `letter-n`, `letter-e`).
2. Remplacez `3d/logo-ne.svg`.
3. Rechargez l'accueil : la scène extrude le nouveau fichier, rien d'autre à changer.

## Remplacer un modèle

1. Déposez le fichier `.glb` dans `3d/` avec le nom prévu dans `ASSETS.md` (par exemple `trading.glb`).
2. C'est tout : `loadModel("trading")` le charge automatiquement à la place de la forme simple.
3. Vérifiez son poids (moins de 3 Mo) et compressez-le si besoin, par exemple : `npx @gltf-transform/cli optimize entree.glb trading.glb --compress draco --texture-compress webp --texture-size 1024`.

Les modèles servent aux scènes 2 à 4, à venir après validation de la scène 1.

## Quand la 3D s'affiche

La 3D s'affiche si l'appareil a WebGL avec une vraie carte graphique, plus de 2 Go de mémoire, plus de 2 cœurs, et pas le mode économie de données. Sinon, la version 2D (monogramme SVG sur fond noir) reste affichée.

- En cours de route, si les images par seconde chutent, la résolution baisse, puis la page bascule en 2D.
- Avec « réduire les animations » activé, la scène s'affiche en image fixe, sans mouvement de caméra.
- Pour tester : ajoutez `?3d=on` (force la 3D) ou `?3d=off` (force la 2D) à l'adresse, par exemple `index.html?3d=off#accueil`.

## Ajouter une scène (étages suivants)

Ajoutez une `<section class="floor">` dans `vHome()` (`app2.js`) : le défilement crée automatiquement un point d'arrêt par étage. La valeur `state.fs` (0 sur le premier étage, 1 sur le deuxième…) pilote la caméra dans `update()`.
