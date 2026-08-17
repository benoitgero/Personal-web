/* ── Visor de imágenes a pantalla completa ──
   Se arma solo desde acá, no hace falta tocar el HTML.
   Los iconos salen del sprite (assets/iconos/sprite.svg). */
export function montarVisor() {
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
      <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icono-cerrar-fino"/></svg>
    </button>

    <button class="visor__flecha visor__flecha--prev" aria-label="Imagen anterior">
      <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icono-flecha-izq-fina"/></svg>
    </button>

    <figure class="visor__marco">
      <img class="visor__imagen" alt="">
    </figure>

    <button class="visor__flecha visor__flecha--next" aria-label="Imagen siguiente">
      <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icono-flecha-der-fina"/></svg>
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
