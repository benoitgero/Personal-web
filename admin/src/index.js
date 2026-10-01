/* ═══════════════════════════════════════════════════════════
   PANEL DE ADMINISTRACIÓN — Worker
   ═══════════════════════════════════════════════════════════

   Rutas:
     GET  /                        interfaz del panel
     GET  /api/estado              contenido del borrador + estado
     PUT  /api/contenido/:seccion  guarda una sección en Mongo
     POST /api/archivos            sube una imagen (Mongo + blob en GitHub)
     GET  /api/archivo/<ruta>      sirve una imagen guardada en Mongo
     POST /api/importar            trae el contenido actual del repo
     POST /api/importar/archivos   trae imágenes del repo a Mongo
     POST /api/publicar            commit al repo → el sitio se redespliega
     GET  /vista/…                 el sitio armado con el borrador

   Seguridad, en capas:
   1. Cloudflare Access corta el paso ANTES de llegar acá: solo entra
      quien se identifique con el email permitido.
   2. Este código vuelve a comprobar la identidad (ctx.access) y que
      el email sea ADMIN_EMAIL. Sin Access → 403 a todo.
   3. Los pedidos que cambian algo exigen la cabecera X-Panel y el
      mismo origen: un sitio ajeno no puede dispararlos. */

import { Binary } from "mongodb";
import panelHtml from "./panel/panel.html";
import panelCss from "./panel/panel.css";
import panelJs from "./panel/panel.js";
import {
  conBase, leerContenido, guardarSeccion, marcarPendiente, leerEstado, rutasPendientes,
} from "./db.js";
import * as github from "./github.js";
import {
  SECCIONES, SECCIONES_JSON, normalizar, rutaValida, rutasUsadas,
  extraerResumen, reemplazarResumen, ErrorDeDatos,
} from "./esquema.js";

const MAX_BYTES = 8 * 1024 * 1024;   // por imagen, ya optimizada en el navegador
const CARPETAS = ["perfil", "logos", "historias", "proyectos"];

const TIPOS = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  ico: "image/x-icon",
  pdf: "application/pdf",
  mp4: "video/mp4",
  webm: "video/webm",
  woff2: "font/woff2",
  txt: "text/plain; charset=utf-8",
};
const EXTENSION = {
  "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png",
  "image/svg+xml": "svg", "image/gif": "gif", "image/avif": "avif",
};
const tipoPorRuta = (r) => TIPOS[r.split(".").pop().toLowerCase()] || "application/octet-stream";

/* ── Respuestas ──────────────────────────────────────────── */
const SIN_CACHE = { "Cache-Control": "no-store" };

function json(datos, status = 200) {
  return new Response(JSON.stringify(datos), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...SIN_CACHE },
  });
}

function texto(cuerpo, tipo, extra = {}) {
  return new Response(cuerpo, { headers: { "Content-Type": tipo, ...SIN_CACHE, ...extra } });
}

/* ── Control de acceso ───────────────────────────────────── */
async function quienEntra(request, env, ctx) {
  if (!ctx.access) {
    return { error: "Este panel solo funciona detrás de Cloudflare Access. Activalo en Workers → portfolio-admin → Settings → Access." };
  }
  const identidad = await ctx.access.getIdentity();
  const email = String(identidad?.email ?? "").trim().toLowerCase();
  const permitidos = String(env.ADMIN_EMAIL ?? "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!permitidos.length) return { error: "Falta el secreto ADMIN_EMAIL en Cloudflare." };
  if (!email || !permitidos.includes(email)) return { error: `La cuenta ${email || "(sin email)"} no tiene permiso.` };
  return { email };
}

function pedidoLegitimo(request) {
  if (request.method === "GET" || request.method === "HEAD") return true;
  if (request.headers.get("X-Panel") !== "1") return false;
  const origen = request.headers.get("Origin");
  return !origen || origen === new URL(request.url).origin;
}

/* ── Entrada ─────────────────────────────────────────────── */
export default {
  async fetch(request, env, ctx) {
    try {
      const acceso = await quienEntra(request, env, ctx);
      if (acceso.error) return new Response(acceso.error, { status: 403, headers: SIN_CACHE });
      if (!pedidoLegitimo(request)) return json({ error: "Pedido rechazado (origen no válido)." }, 403);
      return await enrutar(request, env, ctx, acceso);
    } catch (e) {
      console.error(e);
      return json({ error: e.message || String(e) }, e.status || 500);
    }
  },

  /* Lunes: una lectura mínima para que Atlas no pause el cluster */
  async scheduled(_evento, env, ctx) {
    ctx.waitUntil(
      conBase(env, async (db) => {
        await db.collection("estado").updateOne(
          { _id: "latido" }, { $set: { ultimo: new Date() } }, { upsert: true },
        );
      }),
    );
  },
};

async function enrutar(request, env, ctx, acceso) {
  const url = new URL(request.url);
  const camino = decodeURIComponent(url.pathname);
  const m = request.method;

  // Interfaz
  if (m === "GET" && (camino === "/" || camino === "/index.html")) return texto(panelHtml, TIPOS.html);
  if (m === "GET" && camino === "/panel.css") return texto(panelCss, TIPOS.css);
  if (m === "GET" && camino === "/panel.js") return texto(panelJs, TIPOS.js);

  // API
  if (m === "GET" && camino === "/api/estado") return apiEstado(env, acceso);
  if (m === "PUT" && camino.startsWith("/api/contenido/")) return apiGuardar(request, env, camino.slice(15));
  if (m === "POST" && camino === "/api/archivos") return apiSubir(request, env, url);
  if (m === "GET" && camino.startsWith("/api/archivo/")) return apiArchivo(env, camino.slice(13));
  if (m === "POST" && camino === "/api/importar") return apiImportar(env);
  if (m === "POST" && camino === "/api/importar/archivos") return apiImportarArchivos(request, env);
  if (m === "POST" && camino === "/api/publicar") return apiPublicar(env, acceso);

  // Vista previa del borrador
  if (m === "GET" && camino === "/vista") return Response.redirect(url.origin + "/vista/", 302);
  if (m === "GET" && camino.startsWith("/vista/")) return vistaPrevia(env, camino.slice(7));

  return json({ error: "No existe" }, 404);
}

/* ── API: estado y contenido ─────────────────────────────── */
async function apiEstado(env, acceso) {
  return conBase(env, async (db) => {
    const [contenido, estado, pendientes] = await Promise.all([
      leerContenido(db), leerEstado(db), rutasPendientes(db),
    ]);
    return json({
      email: acceso.email,
      repo: env.REPO,
      rama: env.RAMA,
      sitioUrl: env.SITIO_URL,
      vacio: Object.keys(contenido).length === 0,
      contenido,
      pendientes,
      estado: {
        cambiosSinPublicar: Boolean(estado.pendiente),
        ultimaPublicacion: estado.ultima ?? null,
        commitUrl: estado.url ?? null,
      },
    });
  });
}

async function apiGuardar(request, env, seccion) {
  if (!SECCIONES.includes(seccion)) throw new ErrorDeDatos(`Sección desconocida: ${seccion}`);
  const datos = normalizar(seccion, await request.json());
  await conBase(env, async (db) => {
    await guardarSeccion(db, seccion, datos);
    await marcarPendiente(db);
  });
  return json({ ok: true, datos });
}

/* ── API: imágenes ───────────────────────────────────────── */
function nombreSeguro(nombre) {
  return String(nombre || "imagen")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 40) || "imagen";
}

async function apiSubir(request, env, url) {
  const carpeta = url.searchParams.get("carpeta");
  if (!CARPETAS.includes(carpeta)) throw new ErrorDeDatos("Carpeta no permitida");
  const tipo = (request.headers.get("Content-Type") || "").split(";")[0].trim();
  const ext = EXTENSION[tipo];
  if (!ext) throw new ErrorDeDatos(`Formato no admitido: ${tipo || "desconocido"}`);

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (!bytes.length) throw new ErrorDeDatos("El archivo está vacío");
  if (bytes.length > MAX_BYTES) throw new ErrorDeDatos("La imagen pesa más de 8 MB");

  // Nombre único: si se reemplaza una imagen, la nueva nunca choca
  // con la vieja ni con la copia que tenga guardada el navegador.
  const sufijo = crypto.randomUUID().slice(0, 6);
  const ruta = `assets/${carpeta}/${nombreSeguro(url.searchParams.get("nombre"))}-${sufijo}.${ext}`;

  // El blob se crea ya en GitHub (invisible hasta publicar). Si falla,
  // no pasa nada: se vuelve a intentar al publicar.
  let blobSha = null;
  try {
    blobSha = await github.crearBlob(env, bytes);
  } catch (e) {
    console.warn("Blob diferido para", ruta, e.message);
  }

  await conBase(env, async (db) => {
    await db.collection("archivos").insertOne({
      _id: ruta, tipo, datos: new Binary(bytes), bytes: bytes.length,
      blobSha, publicado: false, creado: new Date(),
    });
    await marcarPendiente(db);
  });
  return json({ ok: true, ruta });
}

async function apiArchivo(env, ruta) {
  ruta = rutaValida(ruta);
  const doc = await conBase(env, (db) => db.collection("archivos").findOne({ _id: ruta }));
  if (!doc) return json({ error: "No está en la base" }, 404);
  return new Response(doc.datos.buffer, {
    headers: {
      "Content-Type": doc.tipo || tipoPorRuta(ruta),
      // Los nombres son únicos: el contenido de una ruta nunca cambia
      "Cache-Control": "private, max-age=86400, immutable",
      // Un SVG abierto directo no puede ejecutar nada
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/* ── API: importar desde el repo ─────────────────────────── */
/* Paso 1: los JSON y el resumen. Devuelve la lista de imágenes que
   usa el contenido para que el navegador las traiga de a tandas. */
async function apiImportar(env) {
  const leidos = await Promise.all(
    SECCIONES_JSON.map((s) => github.leerTexto(env, `contenido/${s}.json`)),
  );
  const contenido = {};
  SECCIONES_JSON.forEach((s, i) => {
    if (leidos[i] === null) throw new ErrorDeDatos(`No existe contenido/${s}.json en el repo`);
    contenido[s] = normalizar(s, JSON.parse(leidos[i]));
  });
  const index = await github.leerTexto(env, "index.html");
  const resumen = index ? extraerResumen(index) : null;
  if (resumen !== null) contenido.resumen = { html: resumen };

  await conBase(env, async (db) => {
    for (const [seccion, datos] of Object.entries(contenido)) await guardarSeccion(db, seccion, datos);
    await db.collection("estado").updateOne(
      { _id: "publicacion" }, { $set: { pendiente: false } }, { upsert: true },
    );
  });
  return json({ ok: true, rutas: [...rutasUsadas(contenido)] });
}

/* Paso 2: hasta 6 imágenes por pedido (límite de subpedidos de Workers) */
async function apiImportarArchivos(request, env) {
  const { rutas } = await request.json();
  if (!Array.isArray(rutas) || rutas.length > 6) throw new ErrorDeDatos("Mandá entre 1 y 6 rutas");
  const limpias = rutas.map((r) => rutaValida(r)).filter(Boolean);

  const resultado = await conBase(env, async (db) => {
    const col = db.collection("archivos");
    const ya = new Set(
      (await col.find({ _id: { $in: limpias } }, { projection: { _id: 1 } }).toArray()).map((d) => d._id),
    );
    const res = { importadas: [], existentes: [...ya], faltantes: [] };
    for (const ruta of limpias.filter((r) => !ya.has(r))) {
      const buf = await github.leerArchivo(env, ruta);
      if (!buf) { res.faltantes.push(ruta); continue; }
      const bytes = new Uint8Array(buf);
      await col.insertOne({
        _id: ruta, tipo: tipoPorRuta(ruta), datos: new Binary(bytes), bytes: bytes.length,
        blobSha: null, publicado: true, creado: new Date(),
      });
      res.importadas.push(ruta);
    }
    return res;
  });
  return json({ ok: true, ...resultado });
}

/* ── API: publicar ───────────────────────────────────────── */
async function apiPublicar(env, acceso) {
  return conBase(env, async (db) => {
    const contenido = await leerContenido(db);
    if (!SECCIONES_JSON.every((s) => contenido[s] !== undefined)) {
      throw new ErrorDeDatos("Falta contenido: importá desde GitHub antes de publicar.");
    }
    const archivos = db.collection("archivos");
    const usadas = rutasUsadas(contenido);
    // Solo se publican las imágenes nuevas que el contenido usa;
    // las que se subieron y después se reemplazaron quedan afuera.
    const pendientes = (await archivos
      .find({ publicado: false }, { projection: { datos: 0 } })
      .toArray()).filter((a) => usadas.has(a._id));

    const cabeza = await github.cabezaDeRama(env);

    const entradas = SECCIONES_JSON.map((s) => ({
      path: `contenido/${s}.json`, mode: "100644", type: "blob",
      content: JSON.stringify(contenido[s], null, 2) + "\n",
    }));

    if (contenido.resumen?.html) {
      const index = await github.leerTexto(env, "index.html", cabeza.commit);
      const nuevo = index && reemplazarResumen(index, contenido.resumen.html);
      if (nuevo && nuevo !== index) {
        entradas.push({ path: "index.html", mode: "100644", type: "blob", content: nuevo });
      }
    }

    // Blobs que no se pudieron crear al subir
    async function asegurarBlob(a, forzar = false) {
      if (a.blobSha && !forzar) return;
      const doc = await archivos.findOne({ _id: a._id });
      a.blobSha = await github.crearBlob(env, doc.datos.buffer);
      await archivos.updateOne({ _id: a._id }, { $set: { blobSha: a.blobSha } });
    }
    for (const a of pendientes) await asegurarBlob(a);

    const conImagenes = () => [
      ...entradas,
      ...pendientes.map((a) => ({ path: a._id, mode: "100644", type: "blob", sha: a.blobSha })),
    ];

    let arbol;
    try {
      arbol = await github.crearArbol(env, cabeza.arbol, conImagenes());
    } catch (e) {
      // GitHub limpia los blobs sueltos viejos: si alguno ya no existe,
      // se vuelve a subir desde la copia en Mongo y se reintenta.
      if (e.github !== 422 || !pendientes.length) throw e;
      for (const a of pendientes) await asegurarBlob(a, true);
      arbol = await github.crearArbol(env, cabeza.arbol, conImagenes());
    }

    const marcarPublicado = async (extra) => {
      if (pendientes.length) {
        await archivos.updateMany(
          { _id: { $in: pendientes.map((a) => a._id) } }, { $set: { publicado: true } },
        );
      }
      await db.collection("estado").updateOne(
        { _id: "publicacion" }, { $set: { pendiente: false, ...extra } }, { upsert: true },
      );
    };

    if (arbol === cabeza.arbol) {
      await marcarPublicado({});
      return json({ ok: true, sinCambios: true });
    }

    const n = pendientes.length;
    const mensaje = `contenido: publica desde el panel${n ? ` (+${n} ${n > 1 ? "imágenes" : "imagen"})` : ""}\n\nPublicado por ${acceso.email}`;
    const commit = await github.crearCommit(env, mensaje, arbol, cabeza.commit);
    await github.moverRama(env, commit.sha);
    await marcarPublicado({ ultima: new Date(), commit: commit.sha, url: commit.html_url });
    return json({ ok: true, commit: commit.sha, url: commit.html_url, imagenes: n });
  });
}

/* ── Vista previa ────────────────────────────────────────── */
/* El sitio tal cual está en el repo, salvo el contenido, que sale
   del borrador en Mongo. Las imágenes todavía sin publicar se
   apuntan a /vista/api/archivo/… */
async function vistaPrevia(env, ruta) {
  ruta = ruta.replace(/^\/+/, "") || "index.html";
  if (ruta.endsWith("/")) ruta += "index.html";
  if (ruta.includes("..")) return json({ error: "Ruta inválida" }, 400);

  // Imágenes sin publicar: el sitio les saca la "/" inicial, así que
  // llegan relativas a /vista/
  if (ruta.startsWith("api/archivo/")) return apiArchivo(env, ruta.slice(12));

  const seccion = /^contenido\/(perfil|skills|historias|proyectos)\.json$/.exec(ruta)?.[1];
  if (seccion) {
    const cuerpo = await conBase(env, async (db) => {
      const doc = await db.collection("contenido").findOne({ _id: seccion });
      const pendientes = new Set(await rutasPendientes(db));
      return JSON.stringify(doc?.datos ?? null, (_k, v) =>
        typeof v === "string" && pendientes.has(v) ? `api/archivo/${v}` : v);
    });
    return texto(cuerpo, TIPOS.json);
  }

  const buf = await github.leerArchivo(env, ruta);
  if (!buf) return new Response("No existe en el repo", { status: 404 });

  if (ruta === "index.html") {
    const aviso = `<meta name="robots" content="noindex">`;
    const cinta = `<a href="/" style="position:fixed;left:16px;bottom:16px;z-index:99999;padding:10px 16px;border-radius:999px;background:#2f3640;color:#fff;font:600 13px/1 system-ui,sans-serif;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,.25)">Vista previa del borrador · volver al panel</a>`;
    const html = new TextDecoder().decode(buf)
      .replace("<head>", `<head>\n${aviso}`)
      .replace("</body>", `${cinta}\n</body>`);
    return texto(html, TIPOS.html);
  }
  return texto(buf, tipoPorRuta(ruta), { "Cache-Control": "private, max-age=60" });
}
