/* ── Portal de entrada: verificación anti-bot ligera ──
   Tres pruebas que un navegador real pasa sin darse cuenta y que
   los scrapers básicos (curl, requests, muchos headless mal
   configurados) no pasan:
   1. Ejecutar JS (si llegamos acá, ya pasó).
   2. No declararse automatizado (navigator.webdriver).
   3. Producir frames de render reales (requestAnimationFrame). */
export function montarPortal() {
  const portal = document.getElementById("portal");
  if (!portal) return;
  if (document.documentElement.classList.contains("verificado")) {
    portal.remove();
    return;
  }

  const texto = document.getElementById("portal-texto");
  const inicio = performance.now();
  const MINIMO_VISIBLE = 3000; // duración de la pantalla de carga

  let frames = 0;
  function contarFrames() {
    frames++;
    if (frames < 4) requestAnimationFrame(contarFrames);
    else evaluar();
  }
  requestAnimationFrame(contarFrames);

  // Red de seguridad: si algo falla, nadie queda afuera del sitio
  const rescate = setTimeout(() => despedir(), 8000);

  function evaluar() {
    const automatizado = navigator.webdriver === true;
    if (automatizado && texto) {
      texto.textContent = "Navegador automatizado detectado";
    }
    // A los automatizados se los demora; a los humanos se los deja pasar.
    const espera = automatizado ? 5000 : Math.max(0, MINIMO_VISIBLE - (performance.now() - inicio));
    setTimeout(despedir, espera);
  }

  function despedir() {
    clearTimeout(rescate);
    try { sessionStorage.setItem("portal-ok", "1"); } catch (e) {}
    portal.classList.add("portal--saliendo");
    portal.addEventListener("transitionend", () => portal.remove(), { once: true });
    // Por si transitionend no dispara (reduced motion)
    setTimeout(() => portal.remove(), 700);
  }
}
