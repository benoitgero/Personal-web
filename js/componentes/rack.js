/* ── Rack de skills ──
   Rueda de scroll libre: la lista se dibuja tres veces seguidas y el
   scroll nativo se reposiciona al llegar a los bordes, así el giro es
   infinito y con inercia. Si todas las skills entran en pantalla, no
   hay scroll ni flechas: se muestran centradas y listo. */
import { SKILLS, SEGMENTOS } from "../../contenido/skills.js";

const COPIAS = 3;   // bloques idénticos: el del medio es el que se ve
const UMBRAL = 6;   // px que hay que mover el mouse para que cuente como arrastre

export function pintarRack() {
  const rack = document.getElementById("rack");
  const pista = document.getElementById("rack-pista");
  const prev = document.getElementById("rack-prev");
  const next = document.getElementById("rack-next");
  if (!rack || !pista) return;

  let anchoBloque = 0;     // ancho de una vuelta completa
  let infinito = false;    // ¿hace falta el bucle?
  let acomodando = false;  // evita reentrar al reposicionar

  function fader(s, indiceReal, clon) {
    const segs = Array.from({ length: SEGMENTOS }, (_, i) =>
      `<span class="fader__seg${i < s.nivel ? " fader__seg--on" : ""}"></span>`
    ).join("");

    // Si el archivo no existe, onerror cambia la imagen por el texto
    const logo = s.logo
      ? `<img src="${s.logo}" alt=""
             onerror="this.replaceWith('${s.abrev}')">`
      : s.abrev;

    // Las copias no se anuncian dos veces a los lectores de pantalla
    const oculto = clon ? ' aria-hidden="true" tabindex="-1"' : ' tabindex="0"';

    return `
      <li class="fader" title="${s.nombre}: ${s.nivel} de ${SEGMENTOS}"
          role="button" data-indice="${indiceReal}"${oculto}>
        <span class="visually-hidden">${s.nombre}: nivel ${s.nivel} de ${SEGMENTOS}. Abrir detalle.</span>
        <span class="fader__escala" aria-hidden="true">${segs}</span>
        <span class="fader__logo" aria-hidden="true">${logo}</span>
      </li>`;
  }

  function anchoUtil() {
    const e = getComputedStyle(pista);
    const relleno = parseFloat(e.paddingLeft) + parseFloat(e.paddingRight);
    return pista.clientWidth - (relleno || 0);
  }

  function hueco() {
    return parseFloat(getComputedStyle(rack).gap) || 0;
  }

  function pintar() {
    // Una pasada para medir un fader real
    rack.innerHTML = SKILLS.map((s, i) => fader(s, i, false)).join("");

    const uno = rack.querySelector(".fader");
    const w = uno ? uno.getBoundingClientRect().width : 52.33;
    const g = hueco();
    const necesario = SKILLS.length * w + (SKILLS.length - 1) * g;

    infinito = necesario > anchoUtil() + 1;

    if (infinito) {
      // Tres vueltas seguidas: el scroll salta de una a otra sin que se note
      let html = "";
      for (let c = 0; c < COPIAS; c++) {
        html += SKILLS.map((s, i) => fader(s, i, c !== 1)).join("");
      }
      rack.innerHTML = html;
      anchoBloque = SKILLS.length * (w + g);

      // Arranca en el bloque del medio, con margen para girar a los dos lados
      acomodando = true;
      pista.scrollLeft = anchoBloque;
      requestAnimationFrame(() => { acomodando = false; });
    }

    pista.classList.toggle("rack-pista--desliza", infinito);
    rack.classList.toggle("rack--centrado", !infinito);
    [prev, next].forEach((b) => { if (b) b.hidden = !infinito; });
  }

  /* Bucle infinito: al pasar de un bloque, se salta al equivalente del medio */
  pista.addEventListener("scroll", () => {
    if (!infinito || acomodando || !anchoBloque) return;

    const x = pista.scrollLeft;
    if (x < anchoBloque * 0.5) {
      acomodando = true;
      pista.scrollLeft = x + anchoBloque;
      requestAnimationFrame(() => { acomodando = false; });
    } else if (x > anchoBloque * 1.5) {
      acomodando = true;
      pista.scrollLeft = x - anchoBloque;
      requestAnimationFrame(() => { acomodando = false; });
    }
  }, { passive: true });

  /* Flechas: desplazan poco más de un fader, con scroll suave */
  function empujar(dir) {
    if (!infinito) return;
    const uno = rack.querySelector(".fader");
    const paso = (uno ? uno.getBoundingClientRect().width : 52) + hueco();
    pista.scrollBy({ left: paso * 2 * dir, behavior: "smooth" });
  }

  prev?.addEventListener("click", () => empujar(-1));
  next?.addEventListener("click", () => empujar(1));

  /* Arrastrar con el mouse en desktop (en celular ya funciona el táctil) */
  let arrastrando = false;
  let partidaX = 0;
  let partidaScroll = 0;
  let movido = 0;

  pista.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || !infinito) return;
    arrastrando = true;
    movido = 0;
    partidaX = e.clientX;
    partidaScroll = pista.scrollLeft;
    // La clase "agarrada" NO se pone acá: si se pusiera al apretar,
    // un simple clic se trataría como arrastre y no abriría la carta.
  });

  window.addEventListener("pointermove", (e) => {
    if (!arrastrando) return;
    const avance = e.clientX - partidaX;
    movido = Math.max(movido, Math.abs(avance));

    // Recién con un desplazamiento real se considera arrastre
    if (movido > UMBRAL) {
      pista.classList.add("rack-pista--agarrada");
      pista.scrollLeft = partidaScroll - avance;
    }
  });

  window.addEventListener("pointerup", () => {
    if (!arrastrando) return;
    arrastrando = false;
    pista.classList.remove("rack-pista--agarrada");
  });

  /* Si se arrastró, el click no debe abrir la carta de la skill */
  pista.addEventListener("click", (e) => {
    if (movido > UMBRAL) {
      e.stopPropagation();
      e.preventDefault();
      movido = 0;
    }
  }, true);

  /* Rueda del mouse en vertical → giro horizontal */
  pista.addEventListener("wheel", (e) => {
    if (!infinito) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;  // ya es horizontal
    e.preventDefault();
    pista.scrollLeft += e.deltaY;
  }, { passive: false });

  /* Al cambiar el ancho se recalcula. El alto se ignora: en móvil cambia
     solo al aparecer y desaparecer la barra del navegador. */
  let anchoPrevio = window.innerWidth;
  let timer;

  window.addEventListener("resize", () => {
    if (window.innerWidth === anchoPrevio) return;
    anchoPrevio = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(pintar, 150);
  });

  window.addEventListener("orientationchange", () => setTimeout(pintar, 200));

  if ("ResizeObserver" in window) {
    let anchoPista = 0;
    new ResizeObserver(() => {
      const ancho = Math.round(pista.clientWidth);
      if (ancho === anchoPista) return;
      anchoPista = ancho;
      pintar();
    }).observe(pista);
  }

  pintar();
}
