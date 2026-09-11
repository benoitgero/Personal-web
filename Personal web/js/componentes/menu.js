/* ── Menú móvil ── */
export function montarMenu() {
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
