/* ── Tabs de historias ──
   Datos: contenido/historias.js
   Textos largos: contenido/textos/historias/<id>.txt */
import { HISTORIAS } from "../../contenido/historias.js";
import { navegarConTeclado } from "../util/teclado.js";
import { cargarTexto } from "../util/texto.js";

export async function montarHistorias() {
  const cont = document.getElementById("tabs-historias");
  const titulo = document.getElementById("historia-titulo");
  const texto = document.getElementById("historia-texto");
  const imagen = document.getElementById("historia-imagen");
  if (!cont) return;

  // Trae todos los textos de una vez, desde los .txt editables
  await Promise.all(
    HISTORIAS.map(async (h) => {
      h.texto = await cargarTexto(`contenido/textos/historias/${h.id}.txt`);
    })
  );

  cont.innerHTML = HISTORIAS.map((h, i) => `
    <button class="tab" role="tab" id="tab-${h.id}"
            aria-selected="${i === 0}" data-indice="${i}">${h.tab}</button>
  `).join("");

  const tabs = [...cont.querySelectorAll(".tab")];

  function seleccionar(i) {
    const h = HISTORIAS[i];
    tabs.forEach((t, j) => t.setAttribute("aria-selected", String(j === i)));
    titulo.textContent = h.titulo;
    texto.textContent = h.texto;
    imagen.src = h.imagen;
    imagen.alt = `Imagen de ${h.titulo}`;
  }

  tabs.forEach((t) => t.addEventListener("click", () => seleccionar(+t.dataset.indice)));
  navegarConTeclado(tabs, seleccionar);
  seleccionar(0);
}
