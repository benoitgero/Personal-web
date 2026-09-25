/* ═══════════════════════════════════════════════════════════
   CONTENIDO — lee los JSON de contenido/ que edita Pages CMS
   ═══════════════════════════════════════════════════════════

   Todo el texto e imágenes editables viven en contenido/*.json.
   Pages CMS (app.pagescms.org) edita esos archivos y commitea;
   GitHub Pages republica y el sitio los lee al cargar.
   El formato de cada archivo lo define .pages.yml en la raíz. */

export const SEGMENTOS = 5;   // segmentos por fader del rack

/* Trae un JSON de contenido/. "no-cache" no significa "no guardar":
   significa preguntarle al servidor si cambió antes de usar la copia
   local. Así un cambio hecho en el CMS se ve apenas GitHub publica. */
async function cargar(nombre, porDefecto) {
  try {
    const res = await fetch(`contenido/${nombre}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.error(`No se pudo cargar contenido/${nombre}.json`, e);
    return porDefecto;
  }
}

/* Carga todo en paralelo */
export async function cargarContenido() {
  const [perfil, skills, historias, proyectos] = await Promise.all([
    cargar("perfil", {}),
    cargar("skills", []),
    cargar("historias", []),
    cargar("proyectos", []),
  ]);
  return { perfil, skills, historias, proyectos };
}

/* Rutas de imágenes: el sitio vive en /Personal-web/, así que tienen
   que ser relativas. Si el CMS guardara una con "/" adelante, se lo
   saca; sin esto la imagen apuntaría a la raíz del dominio (404). */
export function ruta(p) {
  return (p || "").replace(/^\/+/, "");
}

/* Escapa texto para meterlo en HTML sin que se interprete como código */
export function escapar(t) {
  return String(t ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/* Texto plano con líneas en blanco entre párrafos → varios <p> */
export function parrafos(texto) {
  return String(texto ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapar(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
