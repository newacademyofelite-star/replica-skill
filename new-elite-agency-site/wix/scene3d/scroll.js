// Caméra pilotée par le défilement (GSAP ScrollTrigger), avec un point d'arrêt par étage (.floor).
// state.f vaut 0 sur le premier étage, 1 sur le deuxième, etc. ; core.js le lisse avant de placer la caméra.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function bindScroll(tower, state) {
  const floors = Array.from(tower.querySelectorAll(".floor"));
  const header = parseFloat(getComputedStyle(tower).getPropertyValue("--hdr")) || 71;
  let tops = [], range = 1;

  function measure() {
    const base = tower.getBoundingClientRect().top + scrollY;
    tops = floors.map((el) => el.getBoundingClientRect().top + scrollY - base);
    range = Math.max(1, tower.offsetHeight - floors[floors.length - 1].offsetHeight);
  }
  // Position de défilement → étage (fractionnaire), en suivant le haut réel de chaque étage (ils n'ont pas tous la même hauteur).
  function floorAt(y) {
    for (let i = 0; i < tops.length - 1; i++) {
      if (y < tops[i + 1]) return i + Math.max(0, (y - tops[i]) / (tops[i + 1] - tops[i]));
    }
    return tops.length - 1;
  }

  measure();
  const st = ScrollTrigger.create({
    trigger: tower,
    start: "top " + header + "px",
    end: () => "+=" + range,
    snap: {
      snapTo: (p) => {
        const marks = tops.map((t) => Math.min(1, t / range));
        return marks.reduce((best, x) => (Math.abs(x - p) < Math.abs(best - p) ? x : best), marks[0]);
      },
      duration: { min: 0.5, max: 1.4 }, ease: "power2.inOut", delay: 0.15
    },
    onRefresh: measure,
    onUpdate(self) { state.f = floorAt(self.progress * range); }
  });
  ScrollTrigger.refresh();
  return () => st.kill();
}
