// Scène 1 — Accueil : le monogramme NE, extrudé depuis 3d/logo-ne.svg, émerge d'un sol noir brillant.
// Les barres en escalier s'élèvent comme un immeuble. Or métallique, reflet doux, fines particules dorées.
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

const UNIT = 0.02;      // 1 unité SVG = 0,02 unité de scène
const BASE = 140;       // ligne de sol dans le SVG (y)
const CENTER_X = 130;   // milieu du viewBox
const DEPTH = 10;       // épaisseur de l'extrusion, en unités SVG
const LOGO_H = (BASE - 14) * UNIT;
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(16));
const ORDER = ["bar-1", "bar-2", "bar-3", "bar-4", "bar-5", "letter-n", "letter-e"];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function dotTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 32;
  const g = c.getContext("2d"), grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,255,255,1)"); grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad; g.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

export async function buildScene1({ scene, camera, mobile, reduced }) {
  const res = await fetch(new URL("../3d/logo-ne.svg", import.meta.url));
  if (!res.ok) throw new Error("logo-ne.svg introuvable");
  const svg = new SVGLoader().parse(await res.text());

  const group = new THREE.Group();
  scene.add(group);
  const disposables = [];

  // Or métallique (jamais un jaune plat) : tout vient des reflets de la lumière de studio.
  const gold = new THREE.MeshStandardMaterial({ color: 0xc9a24a, metalness: 1, roughness: 0.24, envMapIntensity: 1.25 });
  const goldMirror = new THREE.MeshStandardMaterial({ color: 0x8f7334, metalness: 1, roughness: 0.42, envMapIntensity: 0.7 });
  disposables.push(gold, goldMirror);

  // Deux exemplaires du logo : le vrai, et son reflet retourné sous le sol (reflet peu coûteux, valable sur mobile).
  const logo = new THREE.Group(), mirror = new THREE.Group();
  logo.scale.set(UNIT, -UNIT, UNIT); logo.position.set(-CENTER_X * UNIT, BASE * UNIT, 0);
  mirror.scale.set(UNIT, UNIT, UNIT); mirror.position.set(-CENTER_X * UNIT, -BASE * UNIT, 0);
  group.add(logo, mirror);

  const parts = [];
  svg.paths.forEach((path, n) => {
    const id = (path.userData.node && path.userData.node.id) || "shape-" + n;
    const geo = new THREE.ExtrudeGeometry(SVGLoader.createShapes(path), { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.8, bevelSize: 0.5, bevelSegments: 2, curveSegments: 8 });
    geo.translate(0, -BASE, -DEPTH / 2);
    disposables.push(geo);
    const pivots = [[logo, gold], [mirror, goldMirror]].map(([root, mat]) => {
      const pivot = new THREE.Group(); // pivot posé sur la ligne de sol : la forme grandit depuis sa base
      pivot.position.y = BASE;
      pivot.add(new THREE.Mesh(geo, mat));
      root.add(pivot);
      return pivot;
    });
    const rank = ORDER.indexOf(id);
    parts.push({ pivots, delay: (rank < 0 ? ORDER.length : rank) * 0.17 });
  });

  // Sol noir brillant, légèrement transparent pour laisser voir le reflet.
  const floorGeo = new THREE.PlaneGeometry(120, 120); floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x040404, metalness: 0.2, roughness: 0.45, envMapIntensity: 0.5, transparent: true, opacity: 0.8 });
  group.add(new THREE.Mesh(floorGeo, floorMat));
  disposables.push(floorGeo, floorMat);

  // Lumière de studio : une source chaude en hauteur, un contre-jour doré.
  const key = new THREE.SpotLight(0xfff1d6, 90, 40, 0.5, 1, 2);
  key.position.set(-4, 7, 6); key.target.position.set(0, 1, 0);
  const rim = new THREE.DirectionalLight(0xc9a24a, 1.4);
  rim.position.set(5, 3, -6);
  const fill = new THREE.DirectionalLight(0xffe9c2, 1.2); // éclaire les faces avant, côté caméra
  fill.position.set(3, 4, 9);
  group.add(key, key.target, rim, fill);

  // Fines particules dorées qui montent lentement.
  const count = mobile ? 140 : 380;
  const pos = new Float32Array(count * 3), speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = 0.1 + Math.random() * 5.5;
    pos[i * 3 + 2] = -6 + Math.random() * 10;
    speed[i] = 0.05 + Math.random() * 0.12;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dustTex = dotTexture();
  const dustMat = new THREE.PointsMaterial({ color: 0xe8cf85, map: dustTex, size: 0.05, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
  group.add(new THREE.Points(dustGeo, dustMat));
  disposables.push(dustGeo, dustMat, dustTex);

  // Cadrage : la caméra recule sur écran étroit pour garder le monogramme entier.
  let dist = 9, targetY = 0.6;
  const target = new THREE.Vector3();
  function layout(aspect) {
    dist = Math.max(11, 3.6 / (TAN_HALF_FOV * aspect));
    const visibleH = 2 * dist * TAN_HALF_FOV;
    targetY = LOGO_H / 2 - 0.2 * visibleH; // monogramme dans la moitié haute, le texte en dessous
    scene.fog = new THREE.Fog(0x0a0a0a, dist + 2, dist + 34);
  }

  let lastT = 0;
  function update(t, state) {
    const dt = Math.max(0, Math.min(0.1, t - lastT)); lastT = t;
    // Les formes s'élèvent une à une, de la plus petite barre aux lettres.
    for (const p of parts) {
      const k = reduced ? 1 : easeOut(clamp01((t - 0.4 - p.delay) / 1.6));
      for (const pivot of p.pivots) { pivot.visible = k > 0.001; pivot.scale.y = Math.max(k, 0.001); }
    }
    if (!reduced) {
      const a = dustGeo.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = a.array[i * 3 + 1] + speed[i] * dt;
        if (y > 5.6) y = 0.1;
        a.array[i * 3 + 1] = y;
      }
      a.needsUpdate = true;
    }
    // Caméra : approche lente à l'arrivée, léger balancement, puis descente au défilement.
    const k = reduced ? 1 : easeInOut(clamp01(t / 3.6));
    const f = reduced ? 0 : state.fs;
    const sway = reduced ? 0 : Math.sin(t * 0.17) * 0.035 * dist;
    const x = THREE.MathUtils.lerp(-0.3 * dist, 0.16 * dist, k) + sway;
    const y = THREE.MathUtils.lerp(0.35, targetY + 0.19 * dist, k) + 0.5 * f;
    const z = THREE.MathUtils.lerp(1.22 * dist, dist, k) * (1 - 0.22 * f);
    camera.position.set(x, Math.max(0.25, y), z);
    target.set(0, targetY - 0.9 * f, 0);
    camera.lookAt(target);
  }

  return {
    update, layout,
    dispose() { scene.remove(group); disposables.forEach((d) => d.dispose()); }
  };
}
