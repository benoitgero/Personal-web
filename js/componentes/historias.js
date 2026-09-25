/* ── Tabs de historias ──
   Datos: contenido/historias.json (se edita desde Pages CMS).
   Cada historia: tab (etiqueta del botón), titulo, imagen y texto.
   En el texto, una línea en blanco separa párrafos. */
import { navegarConTeclado } from "../util/teclado.js";
import { ruta, escapar, parrafos } from "../util/contenido.js";

export function montarHistorias(HISTORIAS = []) {
  const cont = document.getElementById("tabs-historias");
  const titulo = document.getElementById("historia-titulo");
  const texto = document.getElementById("historia-texto");
  const imagen = document.getElementById("historia-imagen");
  if (!cont || !HISTORIAS.length) return;

  // El id sale de la posición: así una historia nueva creada en el CMS
  // no necesita que nadie invente un identificador a mano.
  cont.innerHTML = HISTORIAS.map((h, i) => `
    <button class="tab" role="tab" id="tab-historia-${i}"
            aria-selected="${i === 0}" data-indice="${i}">${escapar(h.tab)}</button>
  `).join("");

  const tabs = [...cont.querySelectorAll(".tab")];

  function seleccionar(i) {
    const h = HISTORIAS[i];
    tabs.forEach((t, j) => t.setAttribute("aria-selected", String(j === i)));
    titulo.textContent = h.titulo || "";
    texto.innerHTML = parrafos(h.texto);
    imagen.src = ruta(h.imagen);
    imagen.alt = `Imagen de ${h.titulo || ""}`;
  }

  tabs.forEach((t) => t.addEventListener("click", () => seleccionar(+t.dataset.indice)));
  navegarConTeclado(tabs, seleccionar);
  seleccionar(0);
}
