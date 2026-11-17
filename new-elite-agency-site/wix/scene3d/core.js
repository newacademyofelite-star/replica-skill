// Moteur commun aux scènes : renderer, lumière d'ambiance studio, boucle de rendu, qualité adaptative, nettoyage.
import * as THREE from "three";
import { buildScene1 } from "./scene1.js";

// Studio photo virtuel : une pièce noire et quelques grands panneaux lumineux, dont l'or tire tous ses reflets.
function studioRoom() {
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x020202);
  const panel = (w, h, intensity, pos, look, tint) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint || 0xfff2dc).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(pos[0], pos[1], pos[2]); m.lookAt(look[0], look[1], look[2]);
    room.add(m);
  };
  panel(16, 7, 1.15, [0, -1, 12], [0, 1, 0]);            // face : donne leur teinte aux faces avant
  panel(14, 8, 5, [0, 12, 2], [0, 0, 0]);               // plafond : arêtes hautes
  panel(3, 12, 4.5, [-12, 4, 3], [0, 1, 0]);            // bandeau gauche : tranches des barres
  panel(2, 10, 2, [12, 5, -4], [0, 1, 0], 0xc9a24a);    // contre-jour doré à droite
  return room;
}

export async function start(stage, opts) {
  const { reduced, mobile, force, onProgress, onFallback } = opts;
  const tower = stage.closest(".tower") || stage;
  const canvas = document.createElement("canvas");
  canvas.className = "ne-canvas";
  canvas.setAttribute("aria-hidden", "true");
  stage.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
  let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2); // plafonné à 2 (1,5 sur mobile)
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  // Lumière de studio générée en code : pas de fichier HDR à télécharger.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = studioRoom();
  const env = pmrem.fromScene(room, 0.03).texture;
  scene.environment = env;
  pmrem.dispose();
  room.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  onProgress(0.5);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  const state = { f: 0, fs: 0 };
  const scene1 = await buildScene1({ scene, camera, mobile, reduced });
  onProgress(0.8);

  let disposed = false, raf = 0, visible = true, last = 0, time = 0;
  const render = () => { scene1.update(time, state); renderer.render(scene, camera); };

  function resize() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    scene1.layout(camera.aspect);
    if (reduced) render();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  // Qualité adaptative : si l'appareil peine, on baisse la résolution, puis on passe en version 2D.
  let samples = 0, sum = 0, stepsDown = 0;
  function watch(dt) {
    if (time < 4.5) return;
    sum += dt; samples++;
    if (samples < 60) return;
    const avg = sum / samples; samples = 0; sum = 0;
    if (avg > 0.042 && dpr > 1) { dpr = 1; renderer.setPixelRatio(dpr); resize(); stepsDown++; }
    else if (avg > 0.055 && !force) { if (++stepsDown >= 2) onFallback("images par seconde insuffisantes"); }
  }

  function frame(now) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000 || 0.016);
    last = now;
    time += dt;
    state.fs += (state.f - state.fs) * Math.min(1, dt * 4); // lissage du défilement
    render();
    watch(dt);
  }
  function setRunning(on) {
    cancelAnimationFrame(raf);
    if (on && !disposed && !reduced) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }
  // La boucle s'arrête quand la scène sort de l'écran ou que l'onglet est masqué.
  const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; setRunning(visible && !document.hidden); });
  io.observe(stage);
  const onVis = () => setRunning(visible && !document.hidden);
  document.addEventListener("visibilitychange", onVis);
  const onLost = (e) => { e.preventDefault(); onFallback("contexte WebGL perdu"); };
  canvas.addEventListener("webglcontextlost", onLost);

  let unbindScroll = null;
  if (reduced) { time = 99; render(); } // mouvements réduits : image fixe, monogramme déjà en place
  else {
    render();
    setRunning(true);
    import("./scroll.js").then((m) => { if (!disposed) unbindScroll = m.bindScroll(tower, state, () => {}); })
      .catch((e) => console.info("[NE3D] défilement 3D indisponible", e));
  }
  onProgress(1);

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (unbindScroll) unbindScroll();
      scene1.dispose();
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    }
  };
}
