/* ═══════════════════════════════════════════════════════════
   CONTENIDO — editá solo esta sección para actualizar el sitio
   ═══════════════════════════════════════════════════════════ */

/* Rack de skills.
   nivel: 0 a 5, son los segmentos verdes encendidos.
   logo:  ruta al SVG. Si ponés null, muestra el texto de "abrev".
   El orden del array es el orden de izquierda a derecha en pantalla. */
const SKILLS = [
  { nombre: "HTML5",            abrev: "HTML", nivel: 3, logo: "assets/logos/html.svg",
    descripcion: "Estructura semántica y accesible. Este mismo sitio está armado a mano con HTML5, sin frameworks." },
  { nombre: "CSS3",             abrev: "CSS",  nivel: 3, logo: "assets/logos/css.svg",
    descripcion: "Grid, flexbox y sistemas de diseño. El estilo neumórfico de esta página está traducido 1:1 desde Figma." },
  { nombre: "JavaScript",       abrev: "JS",   nivel: 2, logo: "assets/logos/js.svg",
    descripcion: "JavaScript vanilla para interactividad: tabs, menús, formularios y esta misma carta que estás viendo." },
  { nombre: "AWS",              abrev: "AWS",  nivel: 3, logo: "assets/logos/aws.svg",
    descripcion: "Certificado AWS Cloud Practitioner a través del programa re/Start: EC2, S3, redes, seguridad y fundamentos de la nube." },
  { nombre: "Azure",            abrev: "AZ",   nivel: 3, logo: "assets/logos/azure.svg",
    descripcion: "Administración de recursos en Azure: máquinas virtuales, Entra ID y servicios de infraestructura." },
  { nombre: "Figma",            abrev: "FIG",  nivel: 3, logo: "assets/logos/figma.svg",
    descripcion: "Diseño de interfaces y prototipos. Antes de escribir una línea de código, lo visualizo en Figma." },
  { nombre: "Linux",            abrev: "LNX",  nivel: 2, logo: "assets/logos/linux.svg",
    descripcion: "Línea de comandos, administración básica de servidores y scripting en entornos Linux." },
  { nombre: "Microsoft Office", abrev: "MS",   nivel: 4, logo: "assets/logos/office.svg",
    descripcion: "Dominio avanzado de la suite: Excel, Word, PowerPoint y herramientas de productividad del día a día." },
  { nombre: "AutoCAD",          abrev: "CAD",  nivel: 4, logo: "assets/logos/autocad.svg",
    descripcion: "Dibujo técnico y planos en 2D. Base de mi mentalidad de diseño aplicada a la infraestructura." },
  { nombre: "SketchUp",         abrev: "SKP",  nivel: 4, logo: "assets/logos/sketchup.svg",
    descripcion: "Modelado 3D para visualizar espacios y proyectos antes de construirlos." },
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
    nombre: "Laguna Garzon",
    titulo: "Laguna Garzon",
    texto: "Proyecto académico de un edificio multiuso educativo en la Laguna Garzón, pensado como base para los guardaparques y como escuela abierta a la comunidad. La decisión material define el proyecto: los muros son gabiones rellenos con los escombros que quedaron sumergidos tras la construcción del puente de la Laguna Garzón. Lo que era un residuo bajo el agua pasa a ser la estructura y la piel del edificio, un material con historia y kilómetro cero. El programa se organiza en un volumen bajo y alargado que acompaña el horizonte de la laguna, con un deck de madera que se extiende hacia el agua como espacio de encuentro y observación.",
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

/* ── Carta de skill: se abre al clickear un fader ── */
function montarCartaSkills() {
  const rack = document.getElementById("rack");
  const carta = document.getElementById("carta-skill");
  if (!rack || !carta) return;

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

    logo.innerHTML = s.logo
      ? `<img src="${s.logo}" alt="" onerror="this.replaceWith('${s.abrev}')">`
      : s.abrev;
  }

  function abrir(i) {
    pintar(i);
    carta.hidden = false;
    btnCerrar.focus();
  }

  function cerrar() {
    carta.hidden = true;
    // Devuelve el foco al fader que estaba abierto
    rack.querySelector(`.fader[data-indice="${actual}"]`)?.focus();
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

/* ── Visor de imágenes a pantalla completa ──
   Se arma solo desde acá, no hace falta tocar el HTML. */
function montarVisor() {
  const galeria = document.getElementById("proyecto-galeria");
  if (!galeria) return;

  const visor = document.createElement("div");
  visor.className = "visor";
  visor.id = "visor";
  visor.hidden = true;
  visor.setAttribute("role", "dialog");
  visor.setAttribute("aria-modal", "true");
  visor.setAttribute("aria-label", "Imagen ampliada");

  visor.innerHTML = `
    <button class="visor__cerrar" aria-label="Cerrar">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" d="M5 5l14 14M19 5 5 19"/>
      </svg>
    </button>

    <button class="visor__flecha visor__flecha--prev" aria-label="Imagen anterior">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" d="M15 4l-8 8 8 8"/>
      </svg>
    </button>

    <figure class="visor__marco">
      <img class="visor__imagen" alt="">
    </figure>

    <button class="visor__flecha visor__flecha--next" aria-label="Imagen siguiente">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" d="M9 4l8 8-8 8"/>
      </svg>
    </button>

    <p class="visor__contador" aria-live="polite"></p>
  `;
  document.body.appendChild(visor);

  const imagen = visor.querySelector(".visor__imagen");
  const contador = visor.querySelector(".visor__contador");
  const btnCerrar = visor.querySelector(".visor__cerrar");
  const btnPrev = visor.querySelector(".visor__flecha--prev");
  const btnNext = visor.querySelector(".visor__flecha--next");

  let fotos = [];   // las imágenes del proyecto que está abierto
  let actual = 0;

  function pintar(i) {
    if (!fotos.length) return;
    actual = (i + fotos.length) % fotos.length;  // da la vuelta en los extremos
    imagen.src = fotos[actual].src;
    imagen.alt = fotos[actual].alt || "";
    contador.textContent = `${actual + 1} / ${fotos.length}`;
    // Con una sola imagen las flechas no tienen sentido
    const varias = fotos.length > 1;
    btnPrev.hidden = !varias;
    btnNext.hidden = !varias;
    contador.hidden = !varias;
  }

  function abrir(i) {
    fotos = [...galeria.querySelectorAll(".galeria__foto")];
    if (!fotos.length) return;
    pintar(i);
    visor.hidden = false;
    document.body.classList.add("sin-scroll");
    btnCerrar.focus();
  }

  function cerrar() {
    visor.hidden = true;
    document.body.classList.remove("sin-scroll");
    imagen.removeAttribute("src");
    // Devuelve el foco a la miniatura que se abrió
    fotos[actual]?.focus();
  }

  /* Abrir desde la galería, con mouse o teclado */
  galeria.addEventListener("click", (e) => {
    const foto = e.target.closest(".galeria__foto");
    if (foto) abrir(+foto.dataset.indice);
  });

  galeria.addEventListener("keydown", (e) => {
    const foto = e.target.closest(".galeria__foto");
    if (!foto) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir(+foto.dataset.indice);
    }
  });

  btnPrev.addEventListener("click", () => pintar(actual - 1));
  btnNext.addEventListener("click", () => pintar(actual + 1));
  btnCerrar.addEventListener("click", cerrar);

  // Clic en el fondo (fuera de la imagen) también cierra
  visor.addEventListener("click", (e) => {
    if (e.target === visor || e.target.classList.contains("visor__marco")) cerrar();
  });

  document.addEventListener("keydown", (e) => {
    if (visor.hidden) return;
    if (e.key === "Escape") cerrar();
    if (e.key === "ArrowLeft") pintar(actual - 1);
    if (e.key === "ArrowRight") pintar(actual + 1);
  });

  /* Deslizar con el dedo en celular */
  let inicioX = null;
  visor.addEventListener("touchstart", (e) => { inicioX = e.changedTouches[0].clientX; }, { passive: true });
  visor.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const salto = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(salto) > 50) pintar(actual + (salto < 0 ? 1 : -1));
    inicioX = null;
  }, { passive: true });
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

/* ── Contador de caracteres del mensaje ── */
function montarContador() {
  const area = document.getElementById("campo-mensaje");
  const contador = document.getElementById("contador-mensaje");
  if (!area || !contador) return;

  const tope = area.maxLength;

  function actualizar() {
    contador.textContent = `${area.value.length} / ${tope}`;
    // Resalta cuando quedan menos de 50 caracteres
    contador.classList.toggle("campo__contador--tope", area.value.length > tope - 50);
  }

  area.addEventListener("input", actualizar);
  // El form.reset() del envío no dispara "input", así que lo escuchamos aparte
  area.form?.addEventListener("reset", () => setTimeout(actualizar));
  actualizar();
}

document.addEventListener("DOMContentLoaded", () => {
  pintarRack();
  montarCartaSkills();
  montarHistorias();
  montarProyectos();
  montarVisor();
  montarMenu();
  montarNavActiva();
  //montarRevelado();
  montarFormulario();
  montarContador();
});

