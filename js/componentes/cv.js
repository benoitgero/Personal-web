/* ── Desplegable de descarga del CV ──
   Cuatro versiones: español e inglés, con y sin foto.
   Se cierra al elegir una, al tocar fuera o con Escape. */

export function montarCV() {
  const caja = document.getElementById("cv");
  const boton = document.getElementById("cv-boton");
  const menu = document.getElementById("cv-menu");
  if (!caja || !boton || !menu) return;

  const opciones = () => [...menu.querySelectorAll(".cv__opcion")];

  function abrir() {
    menu.hidden = false;
    requestAnimationFrame(() => caja.classList.add("cv--abierto"));
    boton.setAttribute("aria-expanded", "true");
  }

  function cerrar(devolverFoco = false) {
    caja.classList.remove("cv--abierto");
    boton.setAttribute("aria-expanded", "false");
    // Espera al desvanecido antes de sacarlo del flujo
    setTimeout(() => { menu.hidden = true; }, 180);
    if (devolverFoco) boton.focus();
  }

  const abierto = () => boton.getAttribute("aria-expanded") === "true";

  boton.addEventListener("click", (e) => {
    e.stopPropagation();
    abierto() ? cerrar() : abrir();
  });

  // Al elegir una versión, el navegador descarga y el menú se cierra
  menu.addEventListener("click", (e) => {
    if (e.target.closest(".cv__opcion")) cerrar();
  });

  // Tocar fuera cierra
  document.addEventListener("click", (e) => {
    if (abierto() && !caja.contains(e.target)) cerrar();
  });

  // Teclado: Escape cierra, flechas recorren las opciones
  caja.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && abierto()) {
      e.preventDefault();
      cerrar(true);
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!abierto()) { abrir(); return; }

      const lista = opciones();
      const actual = lista.indexOf(document.activeElement);
      const paso = e.key === "ArrowDown" ? 1 : -1;
      const destino = (actual + paso + lista.length) % lista.length;
      lista[actual === -1 ? 0 : destino].focus();
    }
  });
}
