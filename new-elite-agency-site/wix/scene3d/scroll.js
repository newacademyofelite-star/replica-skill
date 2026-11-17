// Caméra pilotée par le défilement (GSAP ScrollTrigger). Un point d'arrêt par étage (.floor) dès qu'il y en a plusieurs.
// La valeur brute est lissée dans la boucle de rendu (core.js).
// state.f vaut 0 sur le premier étage, 1 sur le deuxième, etc. ; avec un seul étage il va de 0 à 1 pendant qu'on le quitte.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function bindScroll(tower, state, onChange) {
  const floors = tower.querySelectorAll(".floor").length || 1;
  const span = Math.max(1, floors - 1);
  const st = ScrollTrigger.create({
    trigger: tower,
    start: "top top",
    end: floors > 1 ? "bottom bottom" : "bottom top",
    snap: floors > 1 ? { snapTo: 1 / span, duration: { min: 0.4, max: 1.2 }, ease: "power2.inOut", delay: 0.1 } : undefined,
    onUpdate(self) { state.f = self.progress * span; onChange(); }
  });
  return () => st.kill();
}
