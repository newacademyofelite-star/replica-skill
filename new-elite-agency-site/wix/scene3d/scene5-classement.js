// Étage 5 — Classement : podium du top 5, faisceaux de lumière sur l'étudiant de la semaine et celui du mois.
// Les noms et les points sont dans le texte de l'étage (pas de texte 3D).
import * as THREE from "three";
import { medal, disposeShape } from "./shapes.js";
import { fitView } from "./studio.js";

// Ordre des marches de gauche à droite : 4e, 2e, 1er, 3e, 5e.
const ORDER = [3, 1, 0, 2, 4];
const HEIGHTS = [1.0, 0.78, 0.62, 0.46, 0.34];

export async function buildClassement({ m, y, glowTex }) {
  const group = new THREE.Group(); group.position.y = y;
  const top = (window.board ? window.board() : []).slice(0, 5);
  const lvl = (p) => (window.levelIdx ? window.levelIdx(p) : 0);
  const week = window.boardFor ? window.boardFor("semaine")[0] : null;
  const month = window.boardFor ? window.boardFor("mois")[0] : null;

  const steps = [];
  ORDER.forEach((rank, col) => {
    const h = HEIGHTS[rank];
    const step = new THREE.Group();
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.9, h, 0.9), m.marble);
    block.position.y = h / 2;
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.02, 0.92), m.gold);
    trim.position.y = h;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.01), m.gold); // plaque du rang
    plate.position.set(0, h - 0.18, 0.455);
    const md = medal(m, (top[rank] ? lvl(top[rank].p) : 0) + 1);
    md.scale.setScalar(0.55); md.position.y = h - 0.02;
    step.add(block, trim, plate, md);
    step.userData = { rank, h, col };
    group.add(step);
    steps.push(step);
  });

  // Faisceau : cône lumineux transparent + halo au sol (aucune vraie lumière ajoutée, pour rester léger).
  const beamGeo = new THREE.CylinderGeometry(0.18, 0.62, 4, 40, 1, true);
  beamGeo.translate(0, 2, 0);
  const beams = [];
  function beamOn(name, tint) {
    const i = top.findIndex((r) => r.n === name);
    if (i < 0) return;
    const step = steps.find((s) => s.userData.rank === i);
    const mat = new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const beam = new THREE.Mesh(beamGeo, mat);
    beam.position.y = step.userData.h;
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: tint, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.scale.set(1.5, 1.5, 1); halo.position.y = step.userData.h + 0.4;
    step.add(beam, halo);
    beams.push({ beam, halo, phase: beams.length * 1.7 });
  }
  if (week) beamOn(week.n, 0xffe7a8);
  if (month && (!week || month.n !== week.n)) beamOn(month.n, 0xc9a24a);

  let stacked = false;
  function layout(aspect, isStacked) {
    stacked = isStacked;
    const gap = stacked ? 0.96 : 1.02;
    steps.forEach((s) => { s.position.set((s.userData.col - 2) * gap, 0, -Math.abs(s.userData.col - 2) * 0.18); });
    return fitView(new THREE.Vector3(0, y + 0.85, 0), stacked ? 5.2 : 6.4, 2.2, aspect, stacked, 0.3);
  }

  function update(t) {
    beams.forEach((b) => {
      const k = 0.85 + 0.15 * Math.sin(t * 0.9 + b.phase);
      b.beam.material.opacity = 0.12 * k;
      b.halo.material.opacity = 0.55 * k;
    });
  }

  return {
    group, layout, update,
    dispose() {
      steps.forEach((s) => s.traverse((o) => { if (o.isSprite) o.material.dispose(); }));
      beams.forEach((b) => b.beam.material.dispose());
      beamGeo.dispose();
      steps.forEach((s) => disposeShape(s, m));
    }
  };
}
