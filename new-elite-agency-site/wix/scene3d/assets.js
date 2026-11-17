// Registre des modèles 3D attendus dans 3d/ (voir ASSETS.md). Tant qu'un fichier manque, une forme simple le remplace.
// GLTFLoader et DRACOLoader ne sont téléchargés qu'au premier modèle demandé.
import * as THREE from "three";

export const ASSETS = {
  pedestal: "pedestal.glb",
  trading: "trading.glb",
  marketing: "marketing.glb",
  design: "design.glb",
  code: "code.glb",
  strategie: "strategie.glb",
  ebook: "ebook.glb",
  medal1: "medal-1.glb", medal2: "medal-2.glb", medal3: "medal-3.glb", medal4: "medal-4.glb", medal5: "medal-5.glb"
};
const DRACO_PATH = "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/";
let loaderPromise = null;

function getLoader() {
  if (!loaderPromise) loaderPromise = Promise.all([
    import("three/addons/loaders/GLTFLoader.js"),
    import("three/addons/loaders/DRACOLoader.js")
  ]).then(([g, d]) => {
    const draco = new d.DRACOLoader(); draco.setDecoderPath(DRACO_PATH);
    const loader = new g.GLTFLoader(); loader.setDRACOLoader(draco);
    return loader;
  });
  return loaderPromise;
}

export function assetUrl(file) { return new URL("../3d/" + file, import.meta.url).href; }

// Forme simple dorée, à la taille d'un objet posé sur piédestal (≈ 1 unité).
export function placeholder(material) {
  return new THREE.Mesh(new THREE.BoxGeometry(0.7, 1, 0.7), material);
}

// Charge 3d/<fichier>. Renvoie la scène du modèle, ou la forme simple si le fichier est absent ou illisible.
export async function loadModel(key, material) {
  const file = ASSETS[key];
  if (!file) return placeholder(material);
  try {
    const head = await fetch(assetUrl(file), { method: "HEAD" });
    if (!head.ok) return placeholder(material);
    const loader = await getLoader();
    const gltf = await loader.loadAsync(assetUrl(file));
    return gltf.scene;
  } catch (e) { return placeholder(material); }
}
