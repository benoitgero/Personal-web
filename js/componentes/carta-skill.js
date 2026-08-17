/* ── Carta de skill: se abre al clickear un fader ── */
import { SKILLS, SEGMENTOS } from "../../contenido/skills.js";

export function montarCartaSkills() {
  const rack = document.getElementById("rack");
  const carta = document.getElementById("carta-skill");
  if (!rack || !carta) return;

  const logo = document.getElementById("carta-logo");
  const titulo = document.getElementById("carta-titulo");
  const nivel = document.getElementById("carta-nivel");
  const puntaje = document.getElementById("carta-puntaje");
  const texto = document.getElementById("carta-texto");
  const btnCerrar = document.getElementById("carta-cerrar");
  const btnPrev = document.getElementById("carta-prev");
  const btnNext = document.getElementById("carta-next");

  let actual = 0;

  function pintar(i) {
    // Módulo para que las flechas den la vuelta en los extremos
    actual = (i + SKILLS.length) % SKILLS.length;
    const s = SKILLS[actual];

    titulo.textContent = s.nombre;
    puntaje.textContent = `${s.nivel} / ${SEGMENTOS}`;
    texto.textContent = s.descripcion || "";

    nivel.innerHTML = Array.from({ length: SEGMENTOS }, (_, j) =>
      `<span${j < s.nivel ? ' class="on"' : ""}></span>`
    ).join("");

    logo.innerHTML = s.logo
      ? `<img src="${s.logo}" alt="" onerror="this.replaceWith('${s.abrev}')">`
      : s.abrev;
  }

  function abrir(i) {
    pintar(i);
    carta.hidden = false;
    btnCerrar.focus();
  }

  function cerrar() {
    carta.hidden = true;
    // Devuelve el foco al fader que estaba abierto
    rack.querySelector(`.fader[data-indice="${actual}"]`)?.focus();
  }

  rack.addEventListener("click", (e) => {
    const fader = e.target.closest(".fader");
    if (fader) abrir(+fader.dataset.indice);
  });

  rack.addEventListener("keydown", (e) => {
    const fader = e.target.closest(".fader");
    if (!fader) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir(+fader.dataset.indice);
    }
  });

  btnPrev.addEventListener("click", () => pintar(actual - 1));
  btnNext.addEventListener("click", () => pintar(actual + 1));
  btnCerrar.addEventListener("click", cerrar);

  // Escape cierra; flechas del teclado navegan mientras la carta está abierta
  document.addEventListener("keydown", (e) => {
    if (carta.hidden) return;
    if (e.key === "Escape") cerrar();
    if (e.key === "ArrowLeft") pintar(actual - 1);
    if (e.key === "ArrowRight") pintar(actual + 1);
  });
}
