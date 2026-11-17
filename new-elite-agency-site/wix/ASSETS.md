# Assets 3D attendus

Déposez chaque fichier dans `3d/` (à côté de `index.html`), avec exactement le nom indiqué. Tant qu'un fichier manque, la scène affiche une forme simple à sa place : rien ne casse. Un modèle déposé est mis à l'échelle automatiquement.

Contraintes pour chaque modèle `.glb` :
- moins de 3 Mo par fichier, moins de 15 Mo pour l'ensemble de la scène ;
- compression Draco (géométrie) et textures en 1024 px maximum, idéalement en KTX2 ou WebP ;
- origine au centre de la base de l'objet, hauteur d'environ 1 unité, face avant vers +Z ;
- pas de lumière ni de caméra dans le fichier : l'éclairage studio est fourni par la scène.

Style commun à ajouter à chaque prompt Higgsfield :
> polished metallic gold with deep black accents, luxury product render, soft studio lighting, isolated on a plain neutral background, centered, front three-quarter view, no text, no logo, high detail

## Liste

| Fichier | Scène | Contenu | Prompt Higgsfield | État |
| --- | --- | --- | --- | --- |
| `logo-ne.svg` | 1 et 6 | Logo NE vectoriel, extrudé en 3D par la scène | Aucun : le vrai fichier du logo, pas une image générée | Provisoire, à remplacer |
| `pedestal.glb` | 2 Formations | Piédestal | A luxury black marble pedestal with thin polished gold trim | À fournir |
| `trading.glb` | 2 Formations | Objet Trading | A sculpture of three ascending candlestick chart bars in polished gold | À fournir |
| `marketing.glb` | 2 Formations | Objet Marketing Digital | A sleek polished gold megaphone | À fournir |
| `design.glb` | 2 Formations | Objet Design | A polished gold bezier pen tool nib with a thin curved line | À fournir |
| `code.glb` | 2 Formations | Objet Code | Two polished gold angle brackets forming a code symbol | À fournir |
| `strategie.glb` | 2 Formations | Objet Stratégie | A polished gold chess knight piece on a small black base | À fournir |
| `ebook.glb` | 3 E-books et vidéos | Livre qui s'ouvre (idéalement avec une animation d'ouverture) | A closed black hardcover book with gold-edged pages and a plain cover, slightly open | À fournir |
| `medal-1.glb` … `medal-5.glb` | 4 Niveaux | Médaillons Aspirant (1 barre) à Élite (5 barres) | A circular gold medallion with N vertical bars rising in a stair-step like a skyscraper silhouette (N = 1 à 5) | À fournir |
| `ambiance.mp4` + `ambiance.jpg` | Secours 2D | Boucle vidéo de fond quand la 3D n'est pas affichée, et son image fixe | Slow camera drift through a dark luxury hall, floating gold dust particles, black marble floor reflections, cinematic, no people, seamless loop | À fournir |

## Format du logo SVG

La scène lit `3d/logo-ne.svg` et extrude chaque forme. Pour que l'animation fonctionne :
- `viewBox="0 0 260 150"`, base de toutes les formes sur la ligne y = 140 ;
- une forme pleine par élément, avec ces identifiants : `bar-1` à `bar-5` (barres en escalier, de la plus petite à la plus haute), `letter-n`, `letter-e` ;
- uniquement des formes remplies (`path`, `rect`, `polygon`) : pas de contours seuls, pas de texte, pas d'image.

## Remarque sur Higgsfield

Higgsfield produit d'abord des images. Pour obtenir un `.glb`, chaque image doit être convertie en modèle 3D, puis compressée pour passer sous 3 Mo. Les médaillons et le logo gagnent à être modélisés directement à partir du SVG : la géométrie sera plus nette qu'un modèle reconstruit depuis une image.
