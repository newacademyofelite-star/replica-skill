// Moteur de la tour : renderer, éclairage studio, six étages empilés, caméra pilotée par le défilement,
// survol des objets, qualité adaptative, nettoyage complet.
import * as THREE from "three";
import { buildScene1 } from "./scene1.js";
import { buildFormations } from "./scene2-formations.js";
import { buildMedia } from "./scene3-media.js";
import { buildNiveaux } from "./scene4-niveaux.js";
import { buildClassement } from "./scene5-classement.js";
import { FLOOR_GAP, studioEnvironment, createMaterials, dotTexture, easeInOut } from "./studio.js";

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
  const env = studioEnvironment(renderer);
  scene.environment = env;
  onProgress(0.4);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  const m = createMaterials();
  const glowTex = dotTexture();
  // État partagé : étage visé (f), étage lissé (fs), formation et niveau mis en avant.
  const state = { f: 0, fs: 0, course: null, pointerCourse: null, focusCourse: null, level: null };

  const top = await buildScene1({ scene, reduced });
  onProgress(0.6);
  const ctx = { m, glowTex, stage };
  const floors = await Promise.all([
    buildFormations(Object.assign({ y: -FLOOR_GAP }, ctx)),
    buildMedia(Object.assign({ y: -2 * FLOOR_GAP }, ctx)),
    buildNiveaux(Object.assign({ y: -3 * FLOOR_GAP }, ctx)),
    buildClassement(Object.assign({ y: -4 * FLOOR_GAP }, ctx))
  ]);
  onProgress(0.85);

  // Sol noir de chaque étage.
  const floorGeo = new THREE.PlaneGeometry(60, 60); floorGeo.rotateX(-Math.PI / 2);
  floors.forEach((fl) => { fl.group.add(new THREE.Mesh(floorGeo, m.floor)); scene.add(fl.group); });

  // Fines particules dorées sur toute la hauteur de la tour.
  const count = mobile ? 260 : 700, yMin = -4 * FLOOR_GAP - 1, yMax = 6;
  const pos = new Float32Array(count * 3), speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = yMin + Math.random() * (yMax - yMin);
    pos[i * 3 + 2] = -6 + Math.random() * 10;
    speed[i] = 0.05 + Math.random() * 0.12;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0xe8cf85, map: glowTex, size: 0.05, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
  scene.add(new THREE.Points(dustGeo, dustMat));

  // Points de vue : un par étage (0 = monogramme, 1 à 4 = étages, 5 = retour au monogramme).
  let views = [];
  let disposed = false, raf = 0, visible = true, last = 0, time = 0;
  const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3();

  function viewAt(i) {
    if (i <= 0) return top.view(time);
    if (i >= 5) return top.finalView(time);
    return views[i];
  }
  function placeCamera() {
    const f = Math.min(5, Math.max(0, state.fs));
    const i = Math.min(4, Math.floor(f)), frac = easeInOut(f - i);
    const a = viewAt(i), b = viewAt(i + 1);
    camPos.lerpVectors(a.pos, b.pos, frac);
    camTarget.lerpVectors(a.target, b.target, frac);
    camera.position.copy(camPos);
    camera.lookAt(camTarget);
  }
  function render(dt = 0) {
    state.course = state.pointerCourse || state.focusCourse;
    top.update(time);
    top.group.visible = state.fs < 1.3 || state.fs > 3.7;
    floors.forEach((fl, k) => { fl.group.visible = Math.abs(state.fs - (k + 1)) < 1.3; fl.update(time, dt, state, camera); });
    if (!reduced) {
      const a = dustGeo.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = a.array[i * 3 + 1] + speed[i] * dt;
        if (y > yMax) y = yMin;
        a.array[i * 3 + 1] = y;
      }
      a.needsUpdate = true;
    }
    placeCamera();
    renderer.render(scene, camera);
  }
  // En mouvements réduits, pas de boucle : une image à chaque changement.
  let pending = false;
  function requestRender() {
    if (!reduced || pending || disposed) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; if (!disposed) render(0); });
  }

  function resize() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    top.layout(camera.aspect);
    const stacked = w < 820; // même seuil que la mise en page du texte (styles.css)
    views = [null].concat(floors.map((fl) => fl.layout(camera.aspect, stacked)));
    requestRender();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  // Survol et clic sur les objets de l'étage Formations (la souris passe à travers le texte, voir styles.css).
  const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const hits = floors[0].hits;
  function pick(e) {
    if (Math.abs(state.fs - 1) > 0.35) return null;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(hits, false)[0];
    return hit ? hit.object.userData.courseId : null;
  }
  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const id = pick(e);
    if (id !== state.pointerCourse) { state.pointerCourse = id; canvas.style.cursor = id ? "pointer" : ""; requestRender(); }
  };
  const onLeave = () => { state.pointerCourse = null; canvas.style.cursor = ""; requestRender(); };
  const onClick = (e) => { const id = pick(e); if (id) location.hash = "f-" + id; };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("click", onClick);

  // Les liens du texte pilotent la scène : survol ou focus clavier d'une formation ou d'un niveau.
  function fromDom(e, entering) {
    const c = e.target.closest && e.target.closest("[data-course]");
    if (c) { state.focusCourse = entering ? c.dataset.course : null; requestRender(); }
    const l = e.target.closest && e.target.closest("[data-level]");
    if (l && entering) { state.level = +l.dataset.level; requestRender(); }
  }
  const onIn = (e) => fromDom(e, true), onOut = (e) => fromDom(e, false);
  tower.addEventListener("focusin", onIn); tower.addEventListener("mouseover", onIn);
  tower.addEventListener("focusout", onOut); tower.addEventListener("mouseout", onOut);
  const onLevel = (e) => { state.level = e.detail; requestRender(); };
  tower.addEventListener("ne:level", onLevel);

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
    state.fs += (state.f - state.fs) * Math.min(1, dt * 3.2); // lissage du défilement : glissement lent, sans rebond
    render(dt);
    watch(dt);
  }
  function setRunning(on) {
    cancelAnimationFrame(raf);
    if (on && !disposed && !reduced) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }
  // La boucle s'arrête quand la tour sort de l'écran ou que l'onglet est masqué.
  const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; setRunning(visible && !document.hidden); });
  io.observe(stage);
  const onVis = () => setRunning(visible && !document.hidden);
  document.addEventListener("visibilitychange", onVis);
  const onLost = (e) => { e.preventDefault(); onFallback("contexte WebGL perdu"); };
  canvas.addEventListener("webglcontextlost", onLost);

  let unbindScroll = null;
  if (reduced) {
    // Mouvements réduits : pas de trajet de caméra, on saute directement au point de vue de l'étage affiché.
    time = 99;
    const fio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { state.f = state.fs = +en.target.dataset.floor - 1; requestRender(); } });
    }, { threshold: 0.5 });
    tower.querySelectorAll(".floor").forEach((el) => fio.observe(el));
    unbindScroll = () => fio.disconnect();
    render(0);
  } else {
    render(0);
    setRunning(true);
    import("./scroll.js").then((mod) => { if (!disposed) unbindScroll = mod.bindScroll(tower, state); })
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
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      tower.removeEventListener("focusin", onIn); tower.removeEventListener("mouseover", onIn);
      tower.removeEventListener("focusout", onOut); tower.removeEventListener("mouseout", onOut);
      tower.removeEventListener("ne:level", onLevel);
      if (unbindScroll) unbindScroll();
      top.dispose();
      floors.forEach((fl) => fl.dispose());
      floorGeo.dispose(); dustGeo.dispose(); dustMat.dispose(); glowTex.dispose();
      Object.values(m).forEach((mat) => mat.dispose());
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    }
  };
}
