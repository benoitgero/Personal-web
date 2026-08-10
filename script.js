/* ═══════════════════════════════════════════════════════════
   CONTENIDO — editá solo esta sección para actualizar el sitio
   ═══════════════════════════════════════════════════════════ */

/* Rack de skills. nivel va de 0 a 5 (segmentos verdes encendidos).
   Los niveles salieron de tu diseño; los nombres son mi lectura de
   los iconos, ajustalos. En "logo" podés poner "assets/logos/x.svg"
   y se muestra la imagen en vez de las iniciales. */
const SKILLS = [
  { nombre: "Windows Server", abrev: "WIN",  nivel: 3, logo: null },
  { nombre: "VMware",         abrev: "VM",   nivel: 3, logo: null },
  { nombre: "JavaScript",     abrev: "JS",   nivel: 2, logo: null },
  { nombre: "Linux",          abrev: "LNX",  nivel: 3, logo: null },
  { nombre: "Azure",          abrev: "AZ",   nivel: 3, logo: null },
  { nombre: "Microsoft 365",  abrev: "M365", nivel: 3, logo: null },
  { nombre: "Docker",         abrev: "DOC",  nivel: 2, logo: null },
  { nombre: "Python",         abrev: "PY",   nivel: 4, logo: null },
  { nombre: "Proxmox",        abrev: "PVE",  nivel: 4, logo: null },
  { nombre: "Cisco",          abrev: "CIS",  nivel: 4, logo: null },
];

const HISTORIAS = [
  {
    id: "forge",
    tab: "Forge",
    titulo: "Forge",
    texto: "Contá acá de qué se trató esta experiencia: qué hiciste, con qué herramientas y qué aprendiste. Dos o tres párrafos alcanzan.",
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
  if (!rack) return;

  rack.innerHTML = SKILLS.map((s) => {
    const segs = Array.from({ length: SEGMENTOS }, (_, i) =>
      `<span class="fader__seg${i < s.nivel ? " fader__seg--on" : ""}"></span>`
    ).join("");

    const logo = s.logo
      ? `<img src="${s.logo}" alt="">`
      : s.abrev;

    return `
      <li class="fader" title="${s.nombre}: ${s.nivel} de ${SEGMENTOS}">
        <span class="visually-hidden">${s.nombre}: nivel ${s.nivel} de ${SEGMENTOS}</span>
        <span class="fader__escala" aria-hidden="true">${segs}</span>
        <span class="fader__logo" aria-hidden="true">${logo}</span>
      </li>`;
  }).join("");
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
    if (e.target.matches("a")) {
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
  montarRevelado();
  montarFormulario();
});
