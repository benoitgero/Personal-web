/* ── Rack de skills ──
   Carrusel circular: los faders van SIEMPRE en una sola fila. Las flechas
   giran la lista como una rueda; a cada lado se dibuja un fader de reserva
   que queda fuera de la pista y es el que entra en escena al girar. */
import { SKILLS, SEGMENTOS } from "../../contenido/skills.js";

export function pintarRack() {
  const rack = document.getElementById("rack");
  const pista = document.getElementById("rack-pista");
  const prev = document.getElementById("rack-prev");
  const next = document.getElementById("rack-next");
  if (!rack) return;

  let offset = 0;                   // cuántas posiciones giró la rueda
  let enPantalla = SKILLS.length;   // cuántos faders se ven ahora
  let girando = false;              // evita encimar dos giros

  function fader(s, indiceReal) {
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
          role="button" tabindex="0" data-indice="${indiceReal}">
        <span class="visually-hidden">${s.nombre}: nivel ${s.nivel} de ${SEGMENTOS}. Abrir detalle.</span>
        <span class="fader__escala" aria-hidden="true">${segs}</span>
        <span class="fader__logo" aria-hidden="true">${logo}</span>
      </li>`;
  }

  /* Ancho realmente disponible dentro de la pista */
  function anchoUtil() {
    if (!pista) return Infinity;
    const e = getComputedStyle(pista);
    const relleno = parseFloat(e.paddingLeft) + parseFloat(e.paddingRight);
    return pista.clientWidth - (relleno || 0);
  }

  /* Separación entre faders, leída del CSS */
  function hueco() {
    return parseFloat(getComputedStyle(rack).gap) || 0;
  }

  /* Ancho de un fader, medido del DOM (más fiable que calcularlo) */
  function anchoFader() {
    const uno = rack.querySelector(".fader");
    return uno ? uno.getBoundingClientRect().width : 52.33;
  }

  /* Escribe los faders. Con reserva: uno extra a cada lado, invisible,
     listo para entrar cuando la rueda gire. */
  function escribir(n, conReserva) {
    const desde = conReserva ? -1 : 0;
    const total = conReserva ? n + 2 : n;

    rack.innerHTML = Array.from({ length: total }, (_, i) => {
      const real = (offset + desde + i + SKILLS.length * 10) % SKILLS.length;
      return fader(SKILLS[real], real);
    }).join("");

    rack.style.transition = "none";
    rack.style.transform = "translateX(0)";
  }

  function pintar() {
    // Primero se dibuja sin reserva para poder medir un fader real
    escribir(Math.min(SKILLS.length, 3), false);

    const w = anchoFader();
    const g = hueco();
    const util = anchoUtil();

    let n = Math.floor((util + g) / (w + g));
    n = Math.max(1, Math.min(n, SKILLS.length));
    enPantalla = n;

    const sobran = n < SKILLS.length;
    escribir(n, sobran);

    [prev, next].forEach((b) => { if (b) b.hidden = !sobran; });
    rack.classList.toggle("rack--completo", !sobran);
    pista?.classList.toggle("rack-pista--recorta", sobran);
  }

  function rotar(dir) {
    if (girando || enPantalla >= SKILLS.length) return;
    girando = true;

    const distancia = (anchoFader() + hueco()) * dir;

    // Reflow para que la transición arranque desde la posición actual
    void rack.offsetWidth;
    rack.style.transition = "transform .42s cubic-bezier(.22, .61, .36, 1)";
    rack.style.transform = `translateX(${-distancia}px)`;

    const terminar = () => {
      rack.removeEventListener("transitionend", terminar);
      offset = (offset + dir + SKILLS.length) % SKILLS.length;
      pintar();            // repinta centrado, sin transición
      girando = false;
    };

    rack.addEventListener("transitionend", terminar, { once: true });
    // Respaldo por si transitionend no llega (pestaña en segundo plano)
    setTimeout(() => { if (girando) terminar(); }, 700);
  }

  prev?.addEventListener("click", () => rotar(-1));
  next?.addEventListener("click", () => rotar(1));

  /* Deslizar con el dedo sobre la pista */
  let inicioX = null;
  pista?.addEventListener("touchstart", (e) => {
    inicioX = e.changedTouches[0].clientX;
  }, { passive: true });

  pista?.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const recorrido = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(recorrido) > 40) rotar(recorrido < 0 ? 1 : -1);
    inicioX = null;
  }, { passive: true });

  /* Al cambiar el ANCHO se recalcula cuántos entran y la rueda vuelve al
     principio. El alto se ignora: en móvil cambia solo al aparecer y
     desaparecer la barra del navegador, y no afecta cuántos faders caben. */
  let anchoPrevio = window.innerWidth;
  let timer;

  window.addEventListener("resize", () => {
    if (window.innerWidth === anchoPrevio) return;
    anchoPrevio = window.innerWidth;

    clearTimeout(timer);
    timer = setTimeout(() => {
      offset = 0;
      pintar();
    }, 150);
  });

  /* Rotar el celular también reinicia la posición */
  window.addEventListener("orientationchange", () => {
    offset = 0;
    setTimeout(pintar, 200);
  });

  /* El ancho de la pista puede cambiar sin que cambie el de la ventana */
  if ("ResizeObserver" in window && pista) {
    let anchoPista = 0;
    new ResizeObserver(() => {
      const ancho = Math.round(pista.clientWidth);
      if (ancho === anchoPista || girando) return;
      anchoPista = ancho;
      pintar();
    }).observe(pista);
  }

  pintar();
}
