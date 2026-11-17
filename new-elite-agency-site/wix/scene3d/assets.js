// Registre des modèles 3D attendus dans 3d/ (voir ASSETS.md). Tant qu'un fichier manque, une forme simple le remplace.
// GLTFLoader et DRACOLoader ne sont téléchargés qu'au premier modèle trouvé.
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

// Remet un modèle à l'échelle commune : environ 1 unité de haut, centré, base sur y = 0.
function normalize(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
  const s = size.y > 0 ? 1 / size.y : 1;
  model.scale.setScalar(s);
  model.position.set(-center.x * s, -box.min.y * s, -center.z * s);
  const wrap = new THREE.Group(); wrap.add(model);
  return wrap;
}

// Charge 3d/<fichier>. Renvoie le modèle, ou fallback() si le fichier est absent ou illisible.
export async function loadModel(key, fallback) {
  const file = ASSETS[key];
  if (!file) return fallback();
  try {
    const head = await fetch(assetUrl(file), { method: "HEAD" });
    if (!head.ok) return fallback();
    const loader = await getLoader();
    const gltf = await loader.loadAsync(assetUrl(file));
    const obj = normalize(gltf.scene);
    obj.userData.fromFile = true;
    return obj;
  } catch (e) { return fallback(); }
}
