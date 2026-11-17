// Décor léger de la page de connexion : les 5 barres NE en or qui tournent lentement, quelques particules.
// Résolution 1, aucune interaction, boucle arrêtée hors écran. Le formulaire reste du HTML par-dessus.
import * as THREE from "three";
import { studioEnvironment, createMaterials, dotTexture } from "./studio.js";

export async function start(stage, { reduced, onFallback }) {
  const canvas = document.createElement("canvas");
  canvas.className = "ne-canvas"; canvas.setAttribute("aria-hidden", "true");
  stage.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const env = studioEnvironment(renderer);
  scene.environment = env;
  const m = createMaterials();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.4, 9); camera.lookAt(0, 1.2, 0);

  const bars = new THREE.Group();
  const geos = [];
  [0.8, 1.25, 1.7, 2.15, 2.6].forEach((h, i) => {
    const g = new THREE.BoxGeometry(0.32, h, 0.32); geos.push(g);
    const b = new THREE.Mesh(g, m.gold);
    b.position.set(-0.96 + i * 0.48, h / 2, 0);
    bars.add(b);
  });
  scene.add(bars);

  const glow = dotTexture();
  const n = 90, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 12; pos[i * 3 + 1] = Math.random() * 5 - 1; pos[i * 3 + 2] = -4 + Math.random() * 6; }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0xe8cf85, map: glow, size: 0.06, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  function resize() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    // Les barres se placent à côté du formulaire sur grand écran, derrière lui sur écran étroit.
    bars.position.x = w >= 820 ? 3.2 : 0;
    if (reduced) renderer.render(scene, camera);
  }
  const ro = new ResizeObserver(resize); ro.observe(stage); resize();

  let raf = 0, last = 0, t = 0, disposed = false, visible = true;
  function frame(now) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000 || 0.016); last = now; t += dt;
    bars.rotation.y = t * 0.12;
    dust.position.y = (t * 0.08) % 1;
    renderer.render(scene, camera);
  }
  function setRunning(on) { cancelAnimationFrame(raf); if (on && !disposed && !reduced) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; setRunning(visible && !document.hidden); });
  io.observe(stage);
  const onVis = () => setRunning(visible && !document.hidden);
  document.addEventListener("visibilitychange", onVis);
  const onLost = (e) => { e.preventDefault(); onFallback("contexte WebGL perdu"); };
  canvas.addEventListener("webglcontextlost", onLost);
  bars.rotation.y = 0.5;
  renderer.render(scene, camera);
  setRunning(true);

  return {
    dispose() {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      geos.forEach((g) => g.dispose()); dustGeo.dispose(); dustMat.dispose(); glow.dispose();
      Object.values(m).forEach((mat) => mat.dispose()); env.dispose();
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    }
  };
}
