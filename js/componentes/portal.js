/* ── Pantalla de carga de entrada ──
   Se retira apenas el sitio está listo, no después de un tiempo fijo:
   un reclutador que abre veinte portfolios no tiene por qué esperar.
   Queda un mínimo corto para que no parpadee en conexiones rápidas.

   Además el CSS la retira sola al segundo (ver portal.css): si el JS
   no corre, igual desaparece y no tapa nada. */
const MINIMO = 450;     // ms: evita el parpadeo si carga instantáneo
const MAXIMO = 2500;    // ms: red de seguridad si algo se cuelga

/* Devuelve una función que se llama cuando el sitio ya se armó. */
export function montarPortal() {
  const portal = document.getElementById("portal");
  const nada = () => {};
  if (!portal) return nada;

  // Esta sesión ya la vio: se retira sin mostrarse
  if (document.documentElement.classList.contains("verificado")) {
    portal.remove();
    return nada;
  }

  const inicio = performance.now();
  let retirado = false;
  const rescate = setTimeout(despedir, MAXIMO);

  function despedir() {
    if (retirado) return;
    retirado = true;
    clearTimeout(rescate);
    try { sessionStorage.setItem("portal-ok", "1"); } catch (e) { /* modo privado */ }
    portal.classList.add("portal--saliendo");
    portal.addEventListener("transitionend", () => portal.remove(), { once: true });
    setTimeout(() => portal.remove(), 600);   // por si transitionend no dispara
  }

  // Lo llama main.js cuando las secciones ya están en pantalla
  return function listo() {
    const falta = Math.max(0, MINIMO - (performance.now() - inicio));
    setTimeout(despedir, falta);
  };
}
