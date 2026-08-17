/* ── Revelado suave al hacer scroll ──
   Hoy está desactivado en js/main.js; para encenderlo,
   descomentá la línea montarRevelado() allá. */
export function montarRevelado() {
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
