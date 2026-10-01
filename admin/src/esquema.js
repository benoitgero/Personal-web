/* ═══════════════════════════════════════════════════════════
   ESQUEMA — qué forma tiene cada sección del contenido
   ═══════════════════════════════════════════════════════════

   Todo lo que llega del navegador pasa por normalizar() antes de
   guardarse en Mongo: tipos correctos, largos máximos y rutas de
   imagen válidas. Es la misma forma que tienen contenido/*.json
   en el repo, que es lo que lee el sitio público. */

export const SECCIONES = ["perfil", "skills", "historias", "proyectos", "resumen"];
export const SECCIONES_JSON = ["perfil", "skills", "historias", "proyectos"];

export class ErrorDeDatos extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.status = 400;
  }
}

/* Texto largo: conserva saltos de línea (los párrafos se separan
   con una línea en blanco), solo normaliza los fines de línea. */
function texto(v, max = 20000) {
  return String(v ?? "").replace(/\r\n?/g, "\n").slice(0, max);
}

/* Texto de una línea: sin saltos ni espacios dobles */
function linea(v, max = 200) {
  return texto(v, max).replace(/\s+/g, " ").trim();
}

/* Ruta de un archivo del repo: relativa y dentro de assets/ */
export function rutaValida(v, campo = "ruta") {
  const r = linea(v, 300).replace(/^\/+/, "");
  if (!r) return "";
  if (r.includes("..") || r.includes("://") || r.includes("\\") || !r.startsWith("assets/")) {
    throw new ErrorDeDatos(`${campo}: "${r}" no es una ruta de assets/ válida`);
  }
  return r;
}

function lista(v, max, nombre) {
  if (!Array.isArray(v)) throw new ErrorDeDatos(`${nombre} tiene que ser una lista`);
  if (v.length > max) throw new ErrorDeDatos(`${nombre}: máximo ${max} elementos`);
  return v;
}

function objeto(v, nombre) {
  if (!v || typeof v !== "object" || Array.isArray(v)) {
    throw new ErrorDeDatos(`${nombre} tiene que ser un objeto`);
  }
  return v;
}

const NORMALIZAR = {
  perfil(d) {
    objeto(d, "perfil");
    return {
      titulo: linea(d.titulo),
      texto: texto(d.texto),
      foto: rutaValida(d.foto, "foto"),
    };
  },

  skills(d) {
    return lista(d, 60, "skills").map((s, i) => {
      objeto(s, `skill ${i + 1}`);
      const nivel = Math.round(Number(s.nivel));
      return {
        nombre: linea(s.nombre, 60),
        abrev: linea(s.abrev, 5),
        nivel: Number.isFinite(nivel) ? Math.min(5, Math.max(0, nivel)) : 0,
        logo: rutaValida(s.logo, `logo de ${s.nombre || "skill " + (i + 1)}`),
        descripcion: texto(s.descripcion, 2000),
      };
    });
  },

  historias(d) {
    return lista(d, 30, "historias").map((h, i) => {
      objeto(h, `historia ${i + 1}`);
      return {
        tab: linea(h.tab, 12),
        titulo: linea(h.titulo),
        imagen: rutaValida(h.imagen, `imagen de ${h.tab || "historia " + (i + 1)}`),
        texto: texto(h.texto),
      };
    });
  },

  proyectos(d) {
    return lista(d, 40, "proyectos").map((p, i) => {
      objeto(p, `proyecto ${i + 1}`);
      const nombre = p.nombre || `proyecto ${i + 1}`;
      const salida = {
        nombre: linea(p.nombre, 60),
        titulo: linea(p.titulo),
        miniatura: rutaValida(p.miniatura, `miniatura de ${nombre}`),
        galeria: lista(p.galeria ?? [], 12, `galería de ${nombre}`)
          .map((g) => rutaValida(g, `galería de ${nombre}`))
          .filter(Boolean),
        texto: texto(p.texto),
      };
      // Opcionales: solo se escriben si tienen valor, igual que en el repo
      const video = rutaValida(p.video, `video de ${nombre}`);
      const poster = rutaValida(p.poster, `imagen previa de ${nombre}`);
      if (video) salida.video = video;
      if (poster) salida.poster = poster;
      return salida;
    });
  },

  /* El resumen estático de index.html (lo que leen buscadores y
     crawlers sin JavaScript). Es HTML tal cual. */
  resumen(d) {
    objeto(d, "resumen");
    return { html: texto(d.html, 60000) };
  },
};

export function normalizar(seccion, datos) {
  const fn = NORMALIZAR[seccion];
  if (!fn) throw new ErrorDeDatos(`Sección desconocida: ${seccion}`);
  return fn(datos);
}

/* Todas las rutas de archivos que usa el contenido */
export function rutasUsadas(contenido) {
  const rutas = new Set();
  const p = contenido.perfil;
  if (p?.foto) rutas.add(p.foto);
  for (const s of contenido.skills ?? []) if (s.logo) rutas.add(s.logo);
  for (const h of contenido.historias ?? []) if (h.imagen) rutas.add(h.imagen);
  for (const pr of contenido.proyectos ?? []) {
    for (const r of [pr.miniatura, pr.poster, ...(pr.galeria ?? [])]) if (r) rutas.add(r);
  }
  return rutas;
}

/* ── Resumen estático dentro de index.html ───────────────── */
const RE_RESUMEN = /(<section\b[^>]*\bid="resumen"[^>]*>)([\s\S]*?)(<\/section>)/;

export function extraerResumen(html) {
  const m = RE_RESUMEN.exec(html);
  return m ? m[2] : null;
}

export function reemplazarResumen(html, interior) {
  if (!RE_RESUMEN.test(html)) return null;
  return html.replace(RE_RESUMEN, (_, abre, __, cierra) => abre + interior + cierra);
}
