// Écran d'intro : logo + barre de progression faite des 5 barres NE. Couvre seulement la scène, jamais le texte ni le menu.
export function createIntro(stage, show) {
  if (!show) return { set() {}, done() {}, remove() {} };
  const el = document.createElement("div");
  el.className = "ne-intro";
  el.setAttribute("role", "status");
  el.innerHTML = '<div class="ne-intro-in"><div class="ne-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><span class="ne-intro-label">Chargement de la scène</span></div>';
  stage.appendChild(el);
  const bars = el.querySelectorAll(".ne-bars i");
  return {
    set(p) { bars.forEach((b, i) => b.classList.toggle("on", p >= (i + 1) / 5 - 0.001)); },
    done() { this.set(1); el.classList.add("out"); setTimeout(() => el.remove(), 900); },
    remove() { el.remove(); }
  };
}
