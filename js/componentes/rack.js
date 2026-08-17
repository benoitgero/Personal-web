/* ── Rack de skills ──
   Pinta los faders dentro de #rack con los datos de contenido/skills.js */
import { SKILLS, SEGMENTOS } from "../../contenido/skills.js";

export function pintarRack() {
  const rack = document.getElementById("rack");
  if (!rack) return;

  rack.innerHTML = SKILLS.map((s) => {
    const segs = Array.from({ length: SEGMENTOS }, (_, i) =>
      `<span class="fader__seg${i < s.nivel ? " fader__seg--on" : ""}"></span>`
    ).join("");

    // Si el archivo no existe, onerror cambia la imagen por el texto
    const logo = s.logo
      ? `<img src="${s.logo}" alt=""
             onerror="this.replaceWith('${s.abrev}')">`
      : s.abrev;

    return `
      <li class="fader" title="${s.nombre}: ${s.nivel} de ${SEGMENTOS}"
          role="button" tabindex="0" data-indice="${SKILLS.indexOf(s)}">
        <span class="visually-hidden">${s.nombre}: nivel ${s.nivel} de ${SEGMENTOS}. Abrir detalle.</span>
        <span class="fader__escala" aria-hidden="true">${segs}</span>
        <span class="fader__logo" aria-hidden="true">${logo}</span>
      </li>`;
  }).join("");
}
