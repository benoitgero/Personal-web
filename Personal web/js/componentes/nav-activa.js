/* ── Marca en la nav la sección que estás viendo ── */
export function montarNavActiva() {
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
