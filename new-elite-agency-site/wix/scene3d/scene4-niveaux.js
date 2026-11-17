// Étage 4 — Niveaux : cinq médaillons (1 à 5 barres) et un grand monogramme dont les barres s'allument une à une,
// jusqu'au monogramme complet pour Élite. Le niveau mis en avant suit la liste du texte, sinon il avance seul.
import * as THREE from "three";
import { medal, disposeShape } from "./shapes.js";
import { loadModel } from "./assets.js";
import { fitView } from "./studio.js";

export async function buildNiveaux({ m, y }) {
  const group = new THREE.Group(); group.position.y = y;

  const medals = await Promise.all([1, 2, 3, 4, 5].map((n) => loadModel("medal" + n, () => medal(m, n))));
  medals.forEach((md) => group.add(md));

  // Grand monogramme : 5 barres en escalier derrière les médaillons. Allumée = or, éteinte = métal sombre.
  const tower = new THREE.Group();
  const bars = [0.7, 1.05, 1.4, 1.75, 2.1].map((h, i) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.26), m.goldDim);
    b.position.set(-0.76 + i * 0.38, h / 2, 0);
    tower.add(b);
    return b;
  });
  tower.position.z = -1.4;
  group.add(tower);

  let stacked = false;
  function layout(aspect, isStacked) {
    stacked = isStacked;
    medals.forEach((md, i) => {
      if (stacked) md.position.set((i % 3 - 1) * 1.05 + (i >= 3 ? 0.52 : 0), i >= 3 ? 0 : 1.15, i >= 3 ? 0.6 : 0.3);
      else md.position.set(-2.4 + i * 1.2, 0, 0.4);
    });
    tower.position.y = stacked ? 0.2 : 0;
    return fitView(new THREE.Vector3(0, y + (stacked ? 1.2 : 1), 0), stacked ? 3.4 : 6.2, stacked ? 2.6 : 2.3, aspect, stacked);
  }

  let current = -1;
  function update(t, dt, s) {
    const active = s.level != null ? s.level : Math.floor(t / 2.4) % 5;
    if (active !== current) {
      current = active;
      bars.forEach((b, i) => { b.material = i <= active ? m.gold : m.goldDim; });
    }
    medals.forEach((md, i) => {
      const on = i === active;
      const k = Math.min(1, dt * 4);
      const sc = md.scale.x + ((on ? 1.15 : 0.92) - md.scale.x) * k;
      md.scale.setScalar(sc);
      md.rotation.y += ((on ? Math.sin(t * 0.8) * 0.35 : 0) - md.rotation.y) * k;
    });
  }

  return {
    group, layout, update,
    dispose() { medals.forEach((md) => disposeShape(md, m)); disposeShape(tower, m); }
  };
}
