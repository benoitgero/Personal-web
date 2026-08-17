/* ── Tabs de proyectos ──
   Datos: contenido/proyectos.js
   Descripciones: contenido/textos/proyectos/<id>.txt */
import { PROYECTOS } from "../../contenido/proyectos.js";
import { navegarConTeclado } from "../util/teclado.js";
import { cargarTexto } from "../util/texto.js";

export async function montarProyectos() {
  const cont = document.getElementById("tabs-proyectos");
  const titulo = document.getElementById("proyecto-titulo");
  const texto = document.getElementById("proyecto-texto");
  const video = document.getElementById("proyecto-video");
  const galeria = document.getElementById("proyecto-galeria");
  if (!cont) return;

  // Trae todas las descripciones de una vez, desde los .txt editables
  await Promise.all(
    PROYECTOS.map(async (p) => {
      p.texto = await cargarTexto(`contenido/textos/proyectos/${p.id}.txt`);
    })
  );

  cont.innerHTML = PROYECTOS.map((p, i) => `
    <button class="miniatura" role="tab" id="tab-${p.id}"
            aria-selected="${i === 0}" data-indice="${i}">
      <img src="${p.miniatura}" alt="">
      <span class="miniatura__etiqueta">${p.nombre}</span>
    </button>
  `).join("");

  const tabs = [...cont.querySelectorAll(".miniatura")];

  function seleccionar(i) {
    const p = PROYECTOS[i];
    tabs.forEach((t, j) => t.setAttribute("aria-selected", String(j === i)));
    titulo.textContent = p.titulo;
    texto.textContent = p.texto;

    video.pause();

    if (p.video) {
      video.hidden = false;
      video.poster = p.poster || "";
      video.querySelector("source").src = p.video;
      video.load(); // sin esto el navegador sigue mostrando el video anterior
    } else {
      // Sin video: se oculta el reproductor en lugar de mostrar el cartel de error
      video.hidden = true;
      video.querySelector("source").removeAttribute("src");
      video.removeAttribute("poster");
      video.load();
    }

    // Cada ítem puede ser una ruta suelta o un objeto { src, ajuste: "contener" }
    galeria.innerHTML = p.galeria
      .map((item, n) => {
        const src = typeof item === "string" ? item : item.src;
        const clase = typeof item === "object" && item.ajuste === "contener" ? " contener" : "";
        return `<img class="galeria__foto${clase}" src="${src}" alt="${p.titulo}, imagen ${n + 1}"
                     role="button" tabindex="0" data-indice="${n}">`;
      })
      .join("");
  }

  // Si el archivo está declarado pero no existe en el servidor, también se oculta
  video.addEventListener("error", () => { video.hidden = true; }, true);

  tabs.forEach((t) => t.addEventListener("click", () => seleccionar(+t.dataset.indice)));
  navegarConTeclado(tabs, seleccionar);
  seleccionar(0);
}
