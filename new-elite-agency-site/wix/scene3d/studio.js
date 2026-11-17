// Outils partagés par toutes les scènes : éclairage studio, matériaux, cadrage caméra, courbes d'animation.
import * as THREE from "three";

export const FLOOR_GAP = 10; // distance verticale entre deux étages de la tour
export const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(16)); // champ de vision vertical de 32°

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Studio photo virtuel : une pièce noire et quelques grands panneaux lumineux, dont l'or tire tous ses reflets.
export function studioRoom() {
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x020202);
  const panel = (w, h, intensity, pos, look, tint) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint || 0xfff2dc).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(pos[0], pos[1], pos[2]); m.lookAt(look[0], look[1], look[2]);
    room.add(m);
  };
  panel(16, 7, 1.15, [0, -1, 12], [0, 1, 0]);           // face : donne leur teinte aux faces avant
  panel(14, 8, 5, [0, 12, 2], [0, 0, 0]);               // plafond : arêtes hautes
  panel(3, 12, 4.5, [-12, 4, 3], [0, 1, 0]);            // bandeau gauche : tranches des barres
  panel(2, 10, 2, [12, 5, -4], [0, 1, 0], 0xc9a24a);    // contre-jour doré à droite
  return room;
}

// Carte d'environnement studio pour un renderer donné (pas de fichier HDR à télécharger).
export function studioEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = studioRoom();
  const env = pmrem.fromScene(room, 0.03).texture;
  pmrem.dispose();
  room.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  return env;
}

// Matériaux communs. Or métallique : jamais un jaune plat, tout vient des reflets.
export function createMaterials() {
  return {
    gold: new THREE.MeshStandardMaterial({ color: 0xc9a24a, metalness: 1, roughness: 0.24, envMapIntensity: 1.25 }),
    goldSoft: new THREE.MeshStandardMaterial({ color: 0xb08d3e, metalness: 1, roughness: 0.38, envMapIntensity: 1 }),
    goldDim: new THREE.MeshStandardMaterial({ color: 0x3a3428, metalness: 0.9, roughness: 0.5, envMapIntensity: 0.5 }),
    marble: new THREE.MeshStandardMaterial({ color: 0x0c0c0c, metalness: 0.35, roughness: 0.18, envMapIntensity: 0.9 }),
    satin: new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.4, roughness: 0.42, envMapIntensity: 0.7 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xefe7d2, metalness: 0, roughness: 0.75, envMapIntensity: 0.4 }),
    floor: new THREE.MeshStandardMaterial({ color: 0x040404, metalness: 0.2, roughness: 0.45, envMapIntensity: 0.5 })
  };
}

// Point lumineux doux (particules, halos).
export function dotTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"), grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)"); grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// Point de vue qui cadre une zone (centre, largeur, hauteur) en laissant la place au texte de l'étage :
// sur grand écran le texte est à gauche, l'objet à droite ; sur écran étroit le texte est en bas, l'objet en haut.
export function fitView(center, width, height, aspect, stacked, tilt = 0.28) {
  const fx = stacked ? 0.92 : 0.56, fy = stacked ? 0.46 : 0.82;
  const dist = 1.12 * Math.max(height / (2 * TAN_HALF_FOV * fy), width / (2 * TAN_HALF_FOV * aspect * fx));
  const halfH = dist * TAN_HALF_FOV, halfW = halfH * aspect;
  const target = center.clone();
  if (stacked) target.y -= 0.5 * halfH; else target.x -= 0.42 * halfW;
  const dir = new THREE.Vector3(0, tilt, 1).normalize();
  return { pos: target.clone().addScaledVector(dir, dist), target, dist };
}
