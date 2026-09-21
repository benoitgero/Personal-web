/* ── Pantalla de carga de entrada ──
   Se muestra 3 segundos una vez por sesión y se retira sola.
   Ya no filtra bots: el sitio tiene que poder leerse también desde
   herramientas automatizadas (reclutadores que usan IA, buscadores).

   Además el CSS la oculta por su cuenta a los 3s (ver portal.css):
   si el JS no corre, la pantalla igual desaparece y no tapa nada. */
const DURACION = 3000;

export function montarPortal() {
  const portal = document.getElementById("portal");
  if (!portal) return;

  // Esta sesión ya la vio: se retira sin mostrarse
  if (document.documentElement.classList.contains("verificado")) {
    portal.remove();
    return;
  }

  setTimeout(despedir, DURACION);

  function despedir() {
    try { sessionStorage.setItem("portal-ok", "1"); } catch (e) { /* modo privado */ }
    portal.classList.add("portal--saliendo");
    portal.addEventListener("transitionend", () => portal.remove(), { once: true });
    // Por si transitionend no dispara (reduced motion)
    setTimeout(() => portal.remove(), 700);
  }
}
