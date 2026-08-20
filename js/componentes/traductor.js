/* ═══════════════════════════════════════════════════════════
   TRADUCTOR — botón ES/EN en el header

   Usa el widget de Google Translate, pero OCULTO: el <select> que
   Google inyecta en la página nunca se ve; nuestro botón lo maneja
   por código. Así el usuario ve una pieza más del sistema soft-UI
   y no el dropdown de Google.

   Tres advertencias para vos, futuro Gero:

   1. NO FUNCIONA EN LOCALHOST. El widget exige una URL pública
      (Google tiene que poder leer la página). Probalo en
      benoitgero.github.io, no en Live Server.

   2. El widget está DEPRECADO desde diciembre de 2019. Sigue
      andando, pero es un servicio externo sin garantías. Por eso
      todo acá falla en silencio: si Google no responde, el botón
      simplemente no hace nada y el sitio queda intacto.

   3. Esto NO sirve para SEO. La traducción pasa en el navegador
      del visitante; no genera URLs indexables en inglés.
   ═══════════════════════════════════════════════════════════ */

const ORIGEN  = "es";
const DESTINO = "en";

/* El nombre del callback viaja en la URL, así que tiene que ser
   global. Lo colgamos de window más abajo. */
const CALLBACK = "iniciarWidgetTraductor";
const SCRIPT   = `https://translate.google.com/translate_a/element.js?cb=${CALLBACK}`;

let boton  = null;
let activo = false;   // ¿la página está traducida ahora mismo?

/* ── Cookie googtrans ──
   Es lo que hace que la elección sobreviva a una recarga: el widget
   la lee al arrancar y traduce solo. Sin dominio explícito queda
   atada al host, que es lo que queremos en github.io. */
function leerCookie() {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function escribirCookie(valor) {
  document.cookie = valor
    ? `googtrans=${valor}; path=/; max-age=31536000`
    : "googtrans=; path=/; max-age=0";
}

/* El <select> que monta Google. Puede no existir todavía. */
const combo = () => document.querySelector(".goog-te-combo");

/* El widget tarda en montarse (script externo + render). Lo esperamos
   con reintentos en vez de asumir que ya está. */
function esperarCombo(intentos = 60) {
  return new Promise((resolver) => {
    (function tic(n) {
      const c = combo();
      if (c) return resolver(c);
      if (n <= 0) return resolver(null);   // Google nunca respondió
      setTimeout(() => tic(n - 1), 200);
    })(intentos);
  });
}

/* Dispara la traducción tocando el select por debajo. */
function traducir() {
  const c = combo();
  if (!c) return;
  c.value = DESTINO;
  c.dispatchEvent(new Event("change"));
}

function pintarBoton() {
  if (!boton) return;
  const etiqueta = activo ? "Ver esta página en español" : "View this page in English";
  boton.textContent = activo ? "ES" : "EN";
  boton.setAttribute("aria-pressed", String(activo));
  boton.setAttribute("aria-label", etiqueta);
  boton.title = etiqueta;
}

/* ── Contenido que llega después ──
   Las pestañas de historias y las miniaturas de proyectos reemplazan
   texto del DOM con textContent. Google ya tradujo lo que había, así
   que lo nuevo entra en español. Después de cualquier clic dentro del
   contenido le pedimos al widget que vuelva a pasar.
   Escuchamos clics (no un MutationObserver) a propósito: el propio
   widget modifica el DOM al traducir, y un observer genérico se
   morderia la cola. */
function reTraducirTrasClics() {
  let temporizador = null;
  document.addEventListener("click", (e) => {
    if (!activo) return;
    if (!e.target.closest("#contenido")) return;
    clearTimeout(temporizador);
    temporizador = setTimeout(traducir, 350);
  });
}

export function montarTraductor() {
  boton = document.querySelector(".idioma-btn");
  if (!boton) return;   // el partial del header no trae el botón: nada que hacer

  // Contenedor obligatorio del widget. Vive oculto (css/componentes/traductor.css).
  if (!document.getElementById("google_translate_element")) {
    const caja = document.createElement("div");
    caja.id = "google_translate_element";
    document.body.appendChild(caja);
  }

  // Callback global que el script de Google va a invocar al cargar
  window[CALLBACK] = () => {
    /* global google */
    new google.translate.TranslateElement({
      pageLanguage: ORIGEN,
      includedLanguages: DESTINO,
      autoDisplay: false        // que no traduzca solo por el idioma del navegador
    }, "google_translate_element");
  };

  // Estado inicial: si la cookie ya dice inglés, el widget traduce solo
  // al arrancar; acá únicamente ponemos el botón a tono.
  activo = leerCookie().endsWith(`/${DESTINO}`);
  pintarBoton();

  boton.addEventListener("click", async () => {
    if (activo) {
      /* Volver al español: recargar es la única forma limpia de deshacer
         todo lo que el widget tocó (envuelve el texto en <font>, marca
         nodos, etc.). Como el portal ya no se muestra en esta sesión,
         la recarga es instantánea. */
      escribirCookie("");
      location.reload();
      return;
    }

    boton.disabled = true;
    escribirCookie(`/${ORIGEN}/${DESTINO}`);
    const c = await esperarCombo();
    boton.disabled = false;

    if (!c) return;             // servicio caído: no rompemos nada
    activo = true;
    traducir();
    pintarBoton();
  });

  reTraducirTrasClics();

  /* El script de Google se carga acá, al final del montaje: para este
     momento los partials, las historias y los proyectos ya están en el
     DOM, así que el widget encuentra la página COMPLETA en su primera
     pasada. Cargarlo desde <head> traduciría solo el esqueleto. */
  const s = document.createElement("script");
  s.src = SCRIPT;
  s.async = true;
  document.head.appendChild(s);
}
