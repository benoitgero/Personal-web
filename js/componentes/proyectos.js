/* ── Tabs de proyectos ──
   Datos: contenido/proyectos.json (se edita desde Pages CMS).
   Cada proyecto: nombre (miniatura), titulo, miniatura, galeria,
   texto y, opcional, video + poster. */
import { navegarConTeclado } from "../util/teclado.js";
import { ruta, escapar, parrafos } from "../util/contenido.js";

export function montarProyectos(PROYECTOS = []) {
  const cont = document.getElementById("tabs-proyectos");
  const titulo = document.getElementById("proyecto-titulo");
  const texto = document.getElementById("proyecto-texto");
  const video = document.getElementById("proyecto-video");
  const galeria = document.getElementById("proyecto-galeria");
  if (!cont || !PROYECTOS.length) return;

  cont.innerHTML = PROYECTOS.map((p, i) => `
    <button class="miniatura" role="tab" id="tab-proyecto-${i}"
            aria-selected="${i === 0}" data-indice="${i}">
      <img src="${escapar(ruta(p.miniatura))}" alt="">
      <span class="miniatura__etiqueta">${escapar(p.nombre)}</span>
    </button>
  `).join("");

  const tabs = [...cont.querySelectorAll(".miniatura")];

  function seleccionar(i) {
    const p = PROYECTOS[i];
    tabs.forEach((t, j) => t.setAttribute("aria-selected", String(j === i)));
    titulo.textContent = p.titulo || "";
    texto.innerHTML = parrafos(p.texto);

    video.pause();

    if (p.video) {
      video.hidden = false;
      video.poster = ruta(p.poster);
      video.querySelector("source").src = ruta(p.video);
      video.load(); // sin esto el navegador sigue mostrando el video anterior
    } else {
      // Sin video: se oculta el reproductor en lugar de mostrar el cartel de error
      video.hidden = true;
      video.querySelector("source").removeAttribute("src");
      video.removeAttribute("poster");
      video.load();
    }

    // La galería es una lista de rutas. Todas llenan la tira; al abrirlas,
    // el visor las muestra completas (planos incluidos).
    const alt = escapar(p.titulo || p.nombre || "");
    galeria.innerHTML = (p.galeria || [])
      .map((item, n) => {
        const src = typeof item === "string" ? item : item?.src;   // tolera el formato viejo
        return `<img class="galeria__foto" src="${escapar(ruta(src))}" alt="${alt}, imagen ${n + 1}"
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
