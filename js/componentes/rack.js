/* ── Rack de skills ──
   Carrusel circular: los faders se muestran siempre en UNA sola fila y
   las flechas rotan el orden, así nunca se parten en varias líneas ni
   quedan cortados, sea cual sea el ancho de la pantalla. */
import { SKILLS, SEGMENTOS } from "../../contenido/skills.js";

export function pintarRack() {
  const rack = document.getElementById("rack");
  const pista = document.getElementById("rack-pista");
  const prev = document.getElementById("rack-prev");
  const next = document.getElementById("rack-next");
  if (!rack) return;

  /* Desplazamiento del carrusel: cuántas posiciones rotó la lista */
  let offset = 0;

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

  /* Cuántos faders entran en el ancho disponible */
  function capacidad() {
    if (!pista) return SKILLS.length;
    const estilo = getComputedStyle(rack);
    const hueco = parseFloat(estilo.gap) || 14;
    const uno = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue("--fader-ancho")) || 52.33;
    // clientWidth incluye el padding lateral de la pista: hay que restarlo
    const relleno = parseFloat(getComputedStyle(pista).paddingLeft) * 2 || 0;
    const util = pista.clientWidth - relleno;
    const cabe = Math.floor((util + hueco) / (uno + hueco));
    return Math.max(1, Math.min(cabe, SKILLS.length));
  }

  function pintar() {
    let n = capacidad();

    // Se dibuja y se comprueba contra la realidad: si el cálculo se pasó,
    // se quita un fader y se vuelve a medir. Más fiable que confiar en
    // la aritmética, que falla con bordes, márgenes o fuentes distintas.
    for (let intento = 0; intento < SKILLS.length; intento++) {
      dibujar(n);
      if (rack.scrollWidth <= pista.clientWidth + 1 || n <= 1) break;
      n--;
    }

    // Si entran todas, las flechas no hacen falta
    const sobran = n < SKILLS.length;
    [prev, next].forEach((b) => { if (b) b.hidden = !sobran; });
    rack.classList.toggle("rack--completo", !sobran);
  }

  function dibujar(n) {
    // Se toman n skills a partir del offset, dando la vuelta al final
    rack.innerHTML = Array.from({ length: n }, (_, i) => {
      const real = (offset + i + SKILLS.length * 10) % SKILLS.length;
      return fader(SKILLS[real], real);
    }).join("");
  }

  function rotar(paso) {
    offset = (offset + paso + SKILLS.length) % SKILLS.length;
    rack.classList.add(paso > 0 ? "rack--sale-izq" : "rack--sale-der");
    // Espera a que termine el desvanecido antes de repintar
    setTimeout(() => {
      pintar();
      rack.classList.remove("rack--sale-izq", "rack--sale-der");
    }, 140);
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

  /* Al cambiar el ANCHO se recalcula cuántos entran y el carrusel vuelve
     al principio, así nunca queda a mitad de camino en un layout nuevo.
     El alto se ignora a propósito: en móvil cambia solo al aparecer y
     desaparecer la barra del navegador, y no afecta cuántos faders caben. */
  let anchoPrevio = window.innerWidth;
  let timer;

  window.addEventListener("resize", () => {
    if (window.innerWidth === anchoPrevio) return;
    anchoPrevio = window.innerWidth;

    clearTimeout(timer);
    timer = setTimeout(() => {
      offset = 0;          // vuelve a la primera skill
      pintar();
    }, 150);
  });

  /* ResizeObserver mira el ancho real de la pista, que puede cambiar sin
     que cambie el de la ventana (por ejemplo al apilarse el layout). */
  if ("ResizeObserver" in window && pista) {
    let anchoPista = 0;
    new ResizeObserver(() => {
      const ancho = Math.round(pista.clientWidth);
      if (ancho === anchoPista) return;
      anchoPista = ancho;
      pintar();
    }).observe(pista);
  }

  /* Rotar el celular también reinicia la posición */
  window.addEventListener("orientationchange", () => {
    offset = 0;
    setTimeout(pintar, 200);   // espera a que el layout se asiente
  });

  pintar();
}
