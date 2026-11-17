// Formes simples dorées, en attendant les modèles Higgsfield (voir ASSETS.md).
// Chaque forme mesure environ 1 unité de haut, base posée sur y = 0, face avant vers +Z.
import * as THREE from "three";

function extrude(points, depth, mat) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 2, curveSegments: 10 });
  geo.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geo, mat);
}

// Trading : trois bougies de cours qui montent.
function trading(m) {
  const g = new THREE.Group();
  [[-0.27, 0.12, 0.42], [0, 0.26, 0.5], [0.27, 0.44, 0.52]].forEach(([x, y0, h]) => {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.17, h, 0.17), m.goldSoft); // un peu satiné : les faces planes restent lisibles
    body.position.set(x, y0 + h / 2, 0);
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, h + 0.22, 8), m.goldSoft);
    wick.position.set(x, y0 + h / 2, 0);
    g.add(body, wick);
  });
  return g;
}

// Marketing digital : mégaphone.
function marketing(m) {
  const g = new THREE.Group();
  const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.1, 0.7, 40, 1, true), m.gold);
  horn.material = m.gold.clone(); horn.material.side = THREE.DoubleSide;
  horn.rotation.z = -Math.PI / 2;
  const back = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 24), m.goldSoft);
  back.rotation.z = -Math.PI / 2; back.position.x = -0.42;
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), m.goldSoft);
  handle.position.set(-0.18, -0.2, 0); handle.rotation.z = 0.25;
  const head = new THREE.Group(); head.add(horn, back, handle);
  head.position.y = 0.56; head.rotation.z = 0.32; head.rotation.y = -0.5;
  g.add(head);
  g.userData.dispose = [horn.material];
  return g;
}

// Design : plume de l'outil plume, avec une fine courbe.
function design(m) {
  const g = new THREE.Group();
  const nib = extrude([[0, 0.98], [0.2, 0.62], [0.24, 0.32], [0.12, 0.08], [0, 0.02], [-0.12, 0.08], [-0.24, 0.32], [-0.2, 0.62]], 0.1, m.gold);
  const slit = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.42, 0.12), m.satin);
  slit.position.y = 0.76;
  const curve = new THREE.CatmullRomCurve3([[-0.45, 0.05, 0.2], [-0.3, 0.5, 0.25], [0, 0.18, 0.28], [0.32, 0.7, 0.25], [0.48, 0.42, 0.2]].map((p) => new THREE.Vector3(...p)));
  const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.012, 8, false), m.goldSoft);
  g.add(nib, slit, line);
  return g;
}

// Code : deux chevrons < >.
function code(m) {
  const g = new THREE.Group();
  const pts = [[0.3, 0.42], [0.38, 0.34], [0.12, 0], [0.38, -0.34], [0.3, -0.42], [-0.04, 0]];
  const left = extrude(pts, 0.14, m.gold); left.position.set(-0.32, 0.5, 0);
  const right = extrude(pts.map(([x, y]) => [-x, y]), 0.14, m.gold); right.position.set(0.32, 0.5, 0);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.8, 0.1), m.goldSoft);
  bar.position.set(0, 0.5, 0); bar.rotation.z = -0.32;
  g.add(left, right, bar);
  return g;
}

// Stratégie : cavalier d'échecs sur un petit socle noir.
function strategie(m) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.12, 40), m.satin);
  base.position.y = 0.06;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.1, 40), m.gold);
  collar.position.y = 0.17;
  const head = extrude([[-0.22, 0], [0.22, 0], [0.2, 0.16], [0.1, 0.28], [0.17, 0.42], [0.3, 0.5], [0.29, 0.62], [0.12, 0.7], [0.03, 0.84], [-0.05, 0.75], [-0.14, 0.72], [-0.22, 0.56], [-0.18, 0.36], [-0.24, 0.16]], 0.2, m.gold);
  head.position.y = 0.22;
  g.add(base, collar, head);
  return g;
}

// Piédestal en marbre noir, fin liseré doré.
function pedestal(m) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.5, 48), m.marble);
  body.position.y = 0.25;
  const trim = new THREE.Mesh(new THREE.TorusGeometry(0.465, 0.012, 8, 64), m.gold);
  trim.rotation.x = Math.PI / 2; trim.position.y = 0.5;
  const foot = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.01, 8, 64), m.gold);
  foot.rotation.x = Math.PI / 2; foot.position.y = 0.01;
  g.add(body, trim, foot);
  return g;
}

// E-book : livre noir à tranches dorées ; la couverture (userData.cover) pivote pour s'ouvrir.
function ebook(m) {
  const g = new THREE.Group();
  const W = 0.78, H = 1, T = 0.035;
  const back = new THREE.Mesh(new THREE.BoxGeometry(W, H, T), m.satin);
  back.position.set(W / 2, H / 2, -0.09);
  const pagesMat = [m.gold, m.gold, m.gold, m.gold, m.paper, m.paper];
  const pages = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, H - 0.04, 0.15), pagesMat);
  pages.position.set(W / 2, H / 2, 0);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.03, H, 0.22), m.gold);
  spine.position.set(0, H / 2, 0);
  const cover = new THREE.Group(); cover.position.set(0, 0, 0.09);
  const front = new THREE.Mesh(new THREE.BoxGeometry(W, H, T), m.satin);
  front.position.set(W / 2, H / 2, 0);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(W - 0.14, H - 0.14, 0.004), m.gold);
  frame.position.set(W / 2, H / 2, T / 2 + 0.002);
  const inner = new THREE.Mesh(new THREE.BoxGeometry(W - 0.17, H - 0.17, 0.006), m.satin);
  inner.position.set(W / 2, H / 2, T / 2 + 0.004);
  cover.add(front, frame, inner);
  g.add(back, pages, spine, cover);
  g.position.x = -W / 2;
  const wrap = new THREE.Group(); wrap.add(g);
  wrap.userData.cover = cover;
  return wrap;
}

// Médaillon de niveau : disque doré et N barres en escalier, comme la silhouette d'un immeuble.
export function medal(m, n) {
  const g = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.07, 64), m.goldSoft);
  disc.rotation.x = Math.PI / 2;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.025, 12, 80), m.gold);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.008, 8, 80), m.gold);
  inner.position.z = 0.04;
  g.add(disc, rim, inner);
  if (n >= 5) { const outer = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.01, 8, 80), m.gold); g.add(outer); }
  const w = 0.07, gap = 0.035, total = n * w + (n - 1) * gap;
  for (let i = 0; i < n; i++) {
    const h = 0.12 + i * 0.07 + (5 - n) * 0.03;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), m.gold);
    bar.position.set(-total / 2 + w / 2 + i * (w + gap), -0.2 + h / 2, 0.06);
    g.add(bar);
  }
  g.position.y = 0.62;
  const wrap = new THREE.Group(); wrap.add(g);
  return wrap;
}

export const SHAPES = { trading, marketing, design, code, strategie, pedestal, ebook };

// Libère géométries et matériaux propres à une forme (les matériaux partagés sont libérés par la scène).
export function disposeShape(obj, shared) {
  const owned = new Set(Object.values(shared));
  obj.traverse((o) => {
    if (o.geometry && !o.isSprite) o.geometry.dispose(); // la géométrie des sprites est partagée par Three.js
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach((mat) => { if (!owned.has(mat)) mat.dispose(); });
  });
}
