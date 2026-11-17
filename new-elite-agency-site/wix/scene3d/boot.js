// Point d'entrée 3D. Léger : ne charge Three.js que sur l'accueil, et seulement si l'appareil peut l'afficher.
// Expose window.NE3D = { mount(stage), unmount() } ; app4.js l'appelle à chaque changement de page.
import { createIntro } from "./intro.js";

const param = new URLSearchParams(location.search).get("3d"); // ?3d=on force la 3D, ?3d=off force la version 2D
const FORCE_ON = param === "on", FORCE_OFF = param === "off";
const LOAD_TIMEOUT = 15000;
let current = null, token = 0, introShown = false;

function prefs() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(pointer: coarse)").matches || innerWidth < 820;
  return { reduced, mobile, force: FORCE_ON };
}

// Vrai si l'appareil a WebGL avec accélération matérielle et assez de mémoire.
function canRun() {
  if (FORCE_OFF) return false;
  if (FORCE_ON) return true;
  const nav = navigator;
  if (nav.connection && nav.connection.saveData) return false;
  if (nav.deviceMemory && nav.deviceMemory <= 2) return false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || c.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    // Rendu logiciel (sans carte graphique) : la 3D bloquerait la page, on reste en 2D.
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    const ext = gl.getExtension("WEBGL_lose_context"); if (ext) ext.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch (e) { return false; }
}

// Attend le chargement de la page puis un moment calme du navigateur (1,5 s au plus).
function afterFirstPaint() {
  const loaded = document.readyState === "complete" ? Promise.resolve() : new Promise((r) => addEventListener("load", r, { once: true }));
  return loaded.then(() => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 1500 }) : setTimeout(r, 200))));
}

function fallback(stage, why) {
  stage.dataset.mode = "2d";
  if (why) console.info("[NE3D] version 2D : " + why);
}

async function mount(stage) {
  unmount();
  if (!stage) return;
  const my = ++token;
  if (!canRun()) return fallback(stage, "appareil ou réglage non compatible");
  stage.dataset.mode = "loading";
  const intro = createIntro(stage, !introShown);
  const timer = setTimeout(() => { if (my === token && stage.dataset.mode === "loading") { unmount(); intro.remove(); fallback(stage, "chargement trop long"); } }, LOAD_TIMEOUT);
  try {
    await afterFirstPaint(); // le texte de la page s'affiche d'abord, la 3D ensuite
    if (my !== token) return intro.remove();
    const core = await import("./core.js");
    if (my !== token) return intro.remove();
    intro.set(0.2);
    const handle = await core.start(stage, Object.assign(prefs(), {
      onProgress: intro.set,
      onFallback: (why) => { if (my === token) { unmount(); fallback(stage, why); } }
    }));
    if (my !== token) { handle.dispose(); return intro.remove(); }
    current = handle;
    stage.dataset.mode = "3d";
    introShown = true;
    intro.done();
  } catch (e) {
    console.warn("[NE3D]", e);
    intro.remove();
    if (my === token) fallback(stage, "erreur de chargement");
  } finally { clearTimeout(timer); }
}

function unmount() {
  token++;
  if (current) { current.dispose(); current = null; }
}

window.NE3D = { mount, unmount };
// Les scripts classiques ont déjà rendu la page : on monte la scène si l'accueil est affiché.
mount(document.getElementById("towerStage"));
