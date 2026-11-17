// Étage 3 — E-books et vidéos : un livre qui s'ouvre en arrivant sur l'étage, et un écran avec l'aperçu d'une vidéo d'essai.
import * as THREE from "three";
import { SHAPES, disposeShape } from "./shapes.js";
import { loadModel } from "./assets.js";
import { fitView, clamp01, easeInOut } from "./studio.js";

export async function buildMedia({ m, y }) {
  const group = new THREE.Group(); group.position.y = y;

  const book = await loadModel("ebook", () => SHAPES.ebook(m));
  book.scale.setScalar(1.25);
  book.rotation.y = 0.75;
  group.add(book);

  // Écran : cadre noir, liseré doré, image dessinée dans un canvas (aperçu de la vidéo d'essai).
  const screen = new THREE.Group();
  const SW = 1.9, SH = SW * 9 / 16;
  const border = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.08, SH + 0.08, 0.05), m.gold);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.05, SH + 0.05, 0.07), m.satin);
  const canvas = document.createElement("canvas"); canvas.width = 640; canvas.height = 360;
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  glass.position.z = 0.04;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 16), m.goldSoft);
  stem.position.y = -SH / 2 - 0.2;
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.05, 40), m.satin);
  foot.position.y = -SH / 2 - 0.42;
  screen.add(border, frame, glass, stem, foot);
  screen.position.y = SH / 2 + 0.45;
  screen.rotation.y = -0.35;
  group.add(screen);

  const c = canvas.getContext("2d");
  function draw(p) {
    const g = c.createLinearGradient(0, 0, 640, 360);
    g.addColorStop(0, "#15130e"); g.addColorStop(1, "#050505");
    c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    c.fillStyle = "rgba(201,162,74,.18)"; c.beginPath(); c.arc(520, 70, 170, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#E8CF85"; c.font = "600 15px Jost, sans-serif"; c.fillText("VIDÉO D'ESSAI GRATUITE", 40, 60);
    c.fillStyle = "#FAFAF8"; c.font = "500 38px Cinzel, Georgia, serif"; c.fillText("BIENVENUE", 40, 118); c.fillText("ET MÉTHODE", 40, 162);
    c.fillStyle = "#B9B5AB"; c.font = "400 18px Jost, sans-serif"; c.fillText("Marketing Digital · 6 min", 40, 196);
    c.fillStyle = "#C9A24A"; c.beginPath(); c.arc(320, 268, 34, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#0A0A0A"; c.beginPath(); c.moveTo(310, 252); c.lineTo(334, 268); c.lineTo(310, 284); c.closePath(); c.fill();
    c.fillStyle = "#2A2925"; c.fillRect(40, 330, 560, 4);
    c.fillStyle = "#C9A24A"; c.fillRect(40, 330, 560 * p, 4);
    tex.needsUpdate = true;
  }
  draw(0);
  let last = -1;

  let stacked = false;
  function layout(aspect, isStacked) {
    stacked = isStacked;
    book.position.set(stacked ? -0.75 : -1.05, 0, stacked ? 0.35 : 0.2);
    screen.position.x = stacked ? 0.55 : 0.85;
    screen.position.z = stacked ? -0.25 : 0;
    return fitView(new THREE.Vector3(0, y + 0.8, 0), stacked ? 3.2 : 3.9, stacked ? 2.2 : 1.8, aspect, stacked);
  }

  function update(t, dt, s) {
    // La couverture s'ouvre quand on arrive sur l'étage, se referme quand on le quitte.
    const near = easeInOut(clamp01(1 - Math.abs(s.fs - 2) * 1.6));
    if (book.userData.cover) book.userData.cover.rotation.y = -1.35 * near; // entrouvert : on voit la couverture, l'intérieur et les pages
    // Aperçu vidéo : la barre de lecture avance (image rafraîchie 8 fois par seconde au plus).
    if (Math.abs(s.fs - 2) < 1) {
      const p = (t * 0.06) % 1, step = Math.floor(t * 8);
      if (step !== last) { last = step; draw(p); }
    }
  }

  return {
    group, layout, update,
    dispose() { disposeShape(book, m); disposeShape(screen, m); tex.dispose(); }
  };
}
