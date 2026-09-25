/* ── Carta de skill: se abre al clickear un fader ── */
import { SEGMENTOS, ruta, escapar } from "../util/contenido.js";

/* SKILLS llega desde main.js, leído de contenido/skills.json */
export function montarCartaSkills(SKILLS = []) {
  const rack = document.getElementById("rack");
  const carta = document.getElementById("carta-skill");
  if (!rack || !carta || !SKILLS.length) return;

  // La tarjeta crece mientras la carta está abierta, para que en celular
  // el texto tenga lugar en vez de quedar recortado.
  const tarjeta = carta.closest(".tarjeta--rack");

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

    const abrev = escapar(s.abrev || s.nombre?.slice(0, 3) || "");
    logo.innerHTML = s.logo
      ? `<img src="${escapar(ruta(s.logo))}" alt="" data-alt="${abrev}"
             onerror="this.replaceWith(this.dataset.alt)">`
      : abrev;
  }

  function abrir(i) {
    pintar(i);
    carta.hidden = false;
    tarjeta?.classList.add("tarjeta--rack-abierta");
    btnCerrar.focus();
  }

  function cerrar() {
    carta.hidden = true;
    tarjeta?.classList.remove("tarjeta--rack-abierta");
    // Devuelve el foco al fader que estaba abierto. Con el carrusel puede
    // haber rotado fuera de vista: en ese caso enfoca el primero visible.
    const destino = rack.querySelector(`.fader[data-indice="${actual}"]`)
      || rack.querySelector(".fader");
    destino?.focus();
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
