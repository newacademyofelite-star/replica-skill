// Étage 2 — Formations : cinq objets dorés sur piédestaux. Survol : rotation lente et fiche d'information. Clic : page de la formation.
import * as THREE from "three";
import { SHAPES, disposeShape } from "./shapes.js";
import { loadModel } from "./assets.js";
import { fitView } from "./studio.js";

const IDS = ["trading", "marketing", "design", "code", "strategie"];
const WIDE = [[-2.5, -0.7], [-1.25, -0.15], [0, 0.05], [1.25, -0.15], [2.5, -0.7]];       // arc, grand écran
const NARROW = [[-1.15, 0.55], [0, 0.65], [1.15, 0.55], [-0.6, -0.75], [0.6, -0.75]];        // deux rangées, écran étroit

export async function buildFormations({ m, y, glowTex, stage }) {
  const group = new THREE.Group(); group.position.y = y;
  const glowMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xc9a24a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const items = await Promise.all(IDS.map(async (id) => {
    const slot = new THREE.Group();
    const ped = await loadModel("pedestal", () => SHAPES.pedestal(m));
    if (ped.userData.fromFile) ped.scale.setScalar(0.5);
    const obj = await loadModel(id, () => SHAPES[id](m));
    obj.position.y = 0.52;
    obj.scale.setScalar(0.92);
    const glow = new THREE.Sprite(glowMat.clone()); glow.scale.set(1.6, 1.6, 1); glow.position.y = 0.9;
    slot.add(ped, obj, glow);
    obj.traverse((o) => { if (o.isMesh) o.userData.courseId = id; });
    ped.traverse((o) => { if (o.isMesh) o.userData.courseId = id; });
    group.add(slot);
    return { id, slot, ped, obj, glow, spin: 0, lift: 0 };
  }));
  const hits = [];
  items.forEach((it) => { it.slot.traverse((o) => { if (o.isMesh) hits.push(o); }); });

  // Fiche d'information au-dessus de l'objet survolé (doublon visuel des liens du texte, donc masquée aux lecteurs d'écran).
  const card = document.createElement("div");
  card.className = "ne-card"; card.hidden = true; card.setAttribute("aria-hidden", "true");
  stage.appendChild(card);
  let cardFor = null;
  const tmp = new THREE.Vector3();

  function cardHtml(id) {
    const c = window.course && window.course(id);
    if (!c) return "";
    const nVid = c.lessons.length, dur = window.hm ? window.hm(window.mins(c)) : "";
    return '<span class="ne-card-cat">' + c.level + '</span><strong>' + c.title + '</strong><span>' + nVid + ' vidéos · ' + dur + '</span><span class="ne-card-price">' + (window.eur ? window.eur(c.price) : c.price + " €") + '</span><span class="ne-card-go">Voir la formation →</span>';
  }

  let stacked = false;
  function layout(aspect, isStacked) {
    stacked = isStacked;
    const pos = stacked ? NARROW : WIDE;
    items.forEach((it, i) => { it.slot.position.set(pos[i][0], 0, pos[i][1]); });
    return fitView(new THREE.Vector3(0, y + 0.8, 0), stacked ? 3.6 : 6.9, stacked ? 2.6 : 1.9, aspect, stacked, stacked ? 0.45 : 0.28);
  }

  function update(t, dt, s, camera) {
    for (const it of items) {
      const on = s.course === it.id;
      it.lift += ((on ? 1 : 0) - it.lift) * Math.min(1, dt * 5);
      if (on) it.spin += dt * 0.6; else it.spin += (Math.round(it.spin / (Math.PI * 2)) * Math.PI * 2 - it.spin) * Math.min(1, dt * 2);
      it.obj.rotation.y = it.spin;
      it.obj.position.y = 0.52 + 0.06 * it.lift;
      it.glow.material.opacity = 0.55 * it.lift;
    }
    // Fiche : seulement à la souris, et quand l'étage est à l'écran.
    const show = s.pointerCourse && Math.abs(s.fs - 1) < 0.25;
    if (!show) { if (!card.hidden) card.hidden = true; cardFor = null; return; }
    const it = items.find((x) => x.id === s.pointerCourse);
    if (cardFor !== it.id) { card.innerHTML = cardHtml(it.id); cardFor = it.id; }
    it.obj.getWorldPosition(tmp); tmp.y += 1.15; tmp.project(camera);
    const w = stage.clientWidth, h = stage.clientHeight;
    card.style.left = Math.round((tmp.x * 0.5 + 0.5) * w) + "px";
    card.style.top = Math.round((-tmp.y * 0.5 + 0.5) * h) + "px";
    card.hidden = false;
  }

  return {
    group, hits, layout, update,
    dispose() {
      card.remove();
      items.forEach((it) => { disposeShape(it.slot, m); it.glow.material.dispose(); });
      glowMat.dispose();
    }
  };
}
