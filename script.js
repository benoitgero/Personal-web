/* ═══════════════════════════════════════════════════════════
   CONTENIDO — editá solo esta sección para actualizar el sitio
   ═══════════════════════════════════════════════════════════ */

/* Rack de skills.
   nivel: 0 a 5, son los segmentos verdes encendidos.
   logo:  ruta al SVG. Si ponés null, muestra el texto de "abrev".
   El orden del array es el orden de izquierda a derecha en pantalla. */
const SKILLS = [
  { nombre: "HTML5", abrev: "HTML", nivel: 3, logo: "assets/logos/html.svg",
    detalle: "Explicá acá por qué te pusiste este nivel: qué construiste, dónde lo usaste y qué te falta para el siguiente escalón." },

  { nombre: "CSS3", abrev: "CSS", nivel: 3, logo: "assets/logos/css.svg",
    detalle: "Texto sobre tu nivel en CSS." },

  { nombre: "JavaScript", abrev: "JS", nivel: 2, logo: "assets/logos/js.svg",
    detalle: "Texto sobre tu nivel en JavaScript." },

  { nombre: "AWS", abrev: "AWS", nivel: 3, logo: "assets/logos/aws.svg",
    detalle: "Certificación AWS Certified Cloud Practitioner obtenida tras el programa re/Start de Fundación Forge. Manejo los servicios fundamentales y el modelo de responsabilidad compartida." },

  { nombre: "Azure", abrev: "AZ", nivel: 3, logo: "assets/logos/azure.svg",
    detalle: "Texto sobre tu nivel en Azure." },

  { nombre: "Figma", abrev: "FIG", nivel: 3, logo: "assets/logos/figma.svg",
    detalle: "Texto sobre tu nivel en Figma." },

  { nombre: "Linux", abrev: "LNX", nivel: 2, logo: "assets/logos/linux.svg",
    detalle: "Texto sobre tu nivel en Linux." },

  { nombre: "Microsoft Office", abrev: "MS", nivel: 4, logo: "assets/logos/office.svg",
    detalle: "Texto sobre tu nivel en Office." },

  { nombre: "AutoCAD", abrev: "CAD", nivel: 4, logo: "assets/logos/autocad.svg",
    detalle: "Texto sobre tu nivel en AutoCAD." },

  { nombre: "SketchUp", abrev: "SKP", nivel: 4, logo: "assets/logos/sketchup.svg",
    detalle: "Texto sobre tu nivel en SketchUp." },
];

const HISTORIAS = [
  {
    id: "forge",
    tab: "Forge",
    titulo: "Fundación Forge",
    texto: "Entré a Forge sin experiencia formal en tecnología y salí con una certificación internacional. Cursé AWS re/Start, el programa que la fundación desarrolla junto a Amazon Web Services: cuatro meses de clases diarias online, con laboratorios prácticos y ejercicios basados en escenarios reales. Linux, Python, redes, seguridad, bases de datos y los fundamentos de la nube de AWS. En paralelo hice Tu Futuro, la parte socioemocional del programa: comunicación, manejo del tiempo, armado de CV, entrevistas simuladas. Al principio me parecía lo secundario frente a lo técnico; con el tiempo entendí que era justamente lo que marca la diferencia cuando estás sentado frente a un entrevistador. El cierre fue el examen de AWS Certified Cloud Practitioner, que aprobé. Más allá del diploma, Forge me dejó algo más difícil de medir: la certeza de que podía dedicarme a esto.",
    imagen: "assets/historias/forge.jpg",
  },
  { id: "ces",    tab: "CES",    titulo: "CES",    texto: "Texto de la historia CES.",    imagen: "assets/historias/ces.jpg" },
  { id: "jap",    tab: "JAP",    titulo: "JAP",    texto: "Texto de la historia JAP.",    imagen: "assets/historias/jap.jpg" },
  { id: "fadu",   tab: "FADU",   titulo: "FADU",   texto: "Texto de la historia FADU.",   imagen: "assets/historias/fadu.jpg" },
  { id: "tcs",    tab: "TCS",    titulo: "TCS",    texto: "Texto de la historia TCS.",    imagen: "assets/historias/tcs.jpg" },
  { id: "switch", tab: "Switch", titulo: "Switch", texto: "Texto de la historia Switch.", imagen: "assets/historias/switch.jpg" },
];

/* Para agregar un proyecto: copiá un bloque entero y cambiá los datos. */
const PROYECTOS = [
  {
    id: "rocha",
    nombre: "Rocha",
    titulo: "Rocha",
    texto: "Describí el proyecto: el problema, tu rol, las decisiones técnicas y el resultado.",
    miniatura: "assets/proyectos/rocha-thumb.jpg",
    video: "assets/proyectos/rocha.mp4",
    poster: "assets/proyectos/rocha-poster.jpg",
    galeria: [
      "assets/proyectos/rocha-1.jpg",
      "assets/proyectos/rocha-2.jpg",
      "assets/proyectos/rocha-3.jpg",
    ],
  },
  {
    id: "proyecto-2",
    nombre: "Proyecto 2",
    titulo: "Proyecto 2",
    texto: "Descripción del segundo proyecto.",
    miniatura: "assets/proyectos/p2-thumb.jpg",
    video: "assets/proyectos/p2.mp4",
    poster: "assets/proyectos/p2-poster.jpg",
    galeria: ["assets/proyectos/p2-1.jpg", "assets/proyectos/p2-2.jpg", "assets/proyectos/p2-3.jpg"],
  },
  {
    id: "proyecto-3",
    nombre: "Proyecto 3",
    titulo: "Proyecto 3",
    texto: "Descripción del tercer proyecto.",
    miniatura: "assets/proyectos/p3-thumb.jpg",
    video: "assets/proyectos/p3.mp4",
    poster: "assets/proyectos/p3-poster.jpg",
    galeria: ["assets/proyectos/p3-1.jpg", "assets/proyectos/p3-2.jpg", "assets/proyectos/p3-3.jpg"],
  },
];

const SEGMENTOS = 5; // segmentos por fader


/* ═══════════════════════════════════════════════════════════
   A partir de acá es la lógica. No hace falta que la toques.
   ═══════════════════════════════════════════════════════════ */

/* ── Rack de skills ── */
function pintarRack() {
  const rack = document.getElementById("rack");
  const pop = document.getElementById("rack-detalle");
  if (!rack || !pop) return;

  const icono = (s) => s.logo
    ? `<img src="${s.logo}" alt="" onerror="this.replaceWith('${s.abrev}')">`
    : s.abrev;

  /* Los faders */
  rack.innerHTML = SKILLS.map((s, i) => {
    const segs = Array.from({ length: SEGMENTOS }, (_, n) =>
      `<span class="fader__seg${n < s.nivel ? " fader__seg--on" : ""}"></span>`
    ).join("");

    return `
      <li>
        <button class="fader" type="button" data-indice="${i}"
                aria-haspopup="dialog" aria-expanded="false">
          <span class="visually-hidden">${s.nombre}: nivel ${s.nivel} de ${SEGMENTOS}</span>
          <span class="fader__escala" aria-hidden="true">${segs}</span>
          <span class="fader__logo" aria-hidden="true">${icono(s)}</span>
        </button>
      </li>`;
  }).join("");

  /* El armazón del pop-up se crea una sola vez */
  pop.innerHTML = `
    <div class="pop">
      <button class="pop__cerrar" type="button" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor"
                stroke-width="2.4" stroke-linecap="round"/>
        </svg>
      </button>

      <button class="pop__flecha pop__flecha--prev" type="button" aria-label="Anterior">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor"
                stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="pop__contenido" id="pop-contenido"></div>

      <button class="pop__flecha pop__flecha--next" type="button" aria-label="Siguiente">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor"
                stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="pop__puntos" id="pop-puntos"></div>
    </div>`;

  const faders    = [...rack.querySelectorAll(".fader")];
  const caja      = pop.querySelector(".pop");
  const contenido = pop.querySelector("#pop-contenido");
  const puntos    = pop.querySelector("#pop-puntos");
  let indice = null;

  puntos.innerHTML = SKILLS.map((s, i) =>
    `<button class="pop__punto" type="button" data-indice="${i}"
             aria-label="Ir a ${s.nombre}"></button>`).join("");

  function pintarContenido(i, direccion) {
    const s = SKILLS[i];

    contenido.innerHTML = `
      <div class="pop__icono" aria-hidden="true">${icono(s)}</div>
      <h3 class="pop__titulo">${s.nombre}</h3>
      <div class="pop__nivel">
        <span class="pop__num">${s.nivel}</span><span class="pop__total">/ ${SEGMENTOS}</span>
      </div>
      <p class="pop__texto">${s.detalle}</p>`;

    // Reinicia la animación de entrada, deslizando desde el lado correcto
    contenido.classList.remove("entra-izq", "entra-der");
    void contenido.offsetWidth;            // fuerza el reflow
    if (direccion) contenido.classList.add(direccion > 0 ? "entra-der" : "entra-izq");

    faders.forEach((f, j) => {
      f.classList.toggle("fader--activo", j === i);
      f.setAttribute("aria-expanded", String(j === i));
    });
    [...puntos.children].forEach((p, j) =>
      p.classList.toggle("pop__punto--activo", j === i));

    indice = i;
  }

  function abrir(i) {
    pop.hidden = false;
    requestAnimationFrame(() => pop.classList.add("abierto"));
    pintarContenido(i, 0);
    pop.querySelector(".pop__cerrar").focus();
  }

  function cerrar() {
    pop.classList.remove("abierto");
    faders.forEach((f) => {
      f.classList.remove("fader--activo");
      f.setAttribute("aria-expanded", "false");
    });
    const volver = indice;
    setTimeout(() => { pop.hidden = true; }, 260);   // espera el fundido
    if (volver !== null) faders[volver].focus();
    indice = null;
  }

  function mover(paso) {
    if (indice === null) return;
    const siguiente = (indice + paso + SKILLS.length) % SKILLS.length;
    pintarContenido(siguiente, paso);
  }

  faders.forEach((f) =>
    f.addEventListener("click", () => abrir(+f.dataset.indice)));

  pop.querySelector(".pop__cerrar").addEventListener("click", cerrar);
  pop.querySelector(".pop__flecha--prev").addEventListener("click", () => mover(-1));
  pop.querySelector(".pop__flecha--next").addEventListener("click", () => mover(1));

  puntos.addEventListener("click", (e) => {
    const p = e.target.closest(".pop__punto");
    if (!p) return;
    const destino = +p.dataset.indice;
    pintarContenido(destino, destino > indice ? 1 : -1);
  });

  // Tocar el fondo cierra
  pop.addEventListener("click", (e) => { if (e.target === pop) cerrar(); });

  // Teclado: flechas para navegar, Escape para salir
  document.addEventListener("keydown", (e) => {
    if (pop.hidden) return;
    if (e.key === "Escape")     { e.preventDefault(); cerrar(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); mover(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); mover(1); }
  });

  // Deslizar con el dedo
  let inicioX = null;
  caja.addEventListener("touchstart", (e) => {
    inicioX = e.changedTouches[0].clientX;
  }, { passive: true });

  caja.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const recorrido = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(recorrido) > 45) mover(recorrido < 0 ? 1 : -1);
    inicioX = null;
  }, { passive: true });
}

/* ── Tabs de historias ── */
function montarHistorias() {
  const cont = document.getElementById("tabs-historias");
  const titulo = document.getElementById("historia-titulo");
  const texto = document.getElementById("historia-texto");
  const imagen = document.getElementById("historia-imagen");
  if (!cont) return;

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

/* ── Tabs de proyectos ── */
function montarProyectos() {
  const cont = document.getElementById("tabs-proyectos");
  const titulo = document.getElementById("proyecto-titulo");
  const texto = document.getElementById("proyecto-texto");
  const video = document.getElementById("proyecto-video");
  const galeria = document.getElementById("proyecto-galeria");
  if (!cont) return;

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
    video.poster = p.poster;
    video.querySelector("source").src = p.video;
    video.load(); // sin esto el navegador sigue mostrando el video anterior

    galeria.innerHTML = p.galeria
      .map((src) => `<img src="${src}" alt="">`)
      .join("");
  }

  tabs.forEach((t) => t.addEventListener("click", () => seleccionar(+t.dataset.indice)));
  navegarConTeclado(tabs, seleccionar);
  seleccionar(0);
}

/* Flechas del teclado para moverse entre tabs */
function navegarConTeclado(tabs, seleccionar) {
  tabs.forEach((tab, i) => {
    tab.addEventListener("keydown", (e) => {
      let destino = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") destino = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") destino = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") destino = 0;
      if (e.key === "End") destino = tabs.length - 1;
      if (destino === null) return;
      e.preventDefault();
      seleccionar(destino);
      tabs[destino].focus();
    });
  });
}

/* ── Marca en la nav la sección que estás viendo ── */
function montarNavActiva() {
  const enlaces = [...document.querySelectorAll(".nav__enlace")];
  if (!enlaces.length || !("IntersectionObserver" in window)) return;

  const secciones = enlaces
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function marcar(id) {
    enlaces.forEach((a) => {
      const activo = a.getAttribute("href") === "#" + id;
      if (activo) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  const obs = new IntersectionObserver((entradas) => {
    // De todas las secciones visibles, gana la que ocupa más pantalla
    const visible = entradas
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) marcar(visible.target.id);
  }, { rootMargin: "-88px 0px -55% 0px", threshold: [0.1, 0.3, 0.6] });

  secciones.forEach((s) => obs.observe(s));
}

/* ── Menú móvil ── */
function montarMenu() {
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav-principal");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    btn.setAttribute("aria-expanded", String(abierto));
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {   // closest tolera que toques dentro del enlace
      nav.classList.remove("abierto");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ── Revelado suave al hacer scroll ── */
function montarRevelado() {
  const objetivos = document.querySelectorAll(".seccion");
  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  objetivos.forEach((el) => el.classList.add("revelar"));

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  objetivos.forEach((el) => obs.observe(el));
}

/* ── Envío del formulario sin recargar la página ── */
function montarFormulario() {
  const form = document.querySelector(".formulario");
  const estado = document.getElementById("form-estado");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    if (form.action.includes("TU_ID")) {
      e.preventDefault();
      estado.textContent = "Falta configurar el formulario: pegá tu ID de Formspree en el atributo action.";
      return;
    }

    e.preventDefault();
    estado.textContent = "Enviando…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      form.reset();
      estado.textContent = "Mensaje enviado. Te respondo a la brevedad.";
    } catch {
      estado.textContent = "No se pudo enviar. Probá de nuevo o escribime por mail.";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  pintarRack();
  montarHistorias();
  montarProyectos();
  montarMenu();
  montarNavActiva();
  //montarRevelado();
  montarFormulario();
});

