/* ═══════════════════════════════════════════════════════════
   PANEL — interfaz en el navegador
   ═══════════════════════════════════════════════════════════

   Flujo:
   1. Editás una sección y tocás "Guardar" → queda en MongoDB
      (borrador). El sitio público no cambia todavía.
   2. "Vista previa" muestra el sitio armado con el borrador.
   3. "Publicar" hace UN commit en GitHub con todo lo guardado
      → Cloudflare redespliega el sitio en uno o dos minutos.

   Las imágenes se achican y pasan a WebP acá mismo, en el
   navegador, antes de subirse. */

/* ── Qué se puede editar ─────────────────────────────────── */
const ESQUEMA = {
  perfil: {
    titulo: "Sobre mí",
    bajada: "Título, texto y foto de la sección de presentación.",
    campos: [
      { n: "titulo", l: "Título", t: "linea", max: 200 },
      { n: "texto", l: "Texto", t: "texto", ayuda: "Línea en blanco = nuevo párrafo" },
      { n: "foto", l: "Foto", t: "imagen", carpeta: "perfil", lado: 1200, ayuda: "De frente o 3/4, luz pareja" },
    ],
  },
  skills: {
    titulo: "Skills",
    bajada: "Los faders del rack. El orden de la lista es el orden en pantalla.",
    lista: true,
    resumen: (s) => [s.nombre || "Sin nombre", `Nivel ${s.nivel ?? 0} de 5`],
    imagenItem: "logo",
    nuevo: () => ({ nombre: "Nueva skill", abrev: "", nivel: 3, logo: "", descripcion: "" }),
    campos: [
      { n: "nombre", l: "Nombre", t: "linea", max: 60 },
      { n: "abrev", l: "Abreviatura", t: "linea", max: 5, ayuda: "Se ve si el logo no carga" },
      { n: "nivel", l: "Nivel", t: "nivel", ayuda: "Segmentos encendidos en el fader" },
      { n: "logo", l: "Logo", t: "imagen", carpeta: "logos", lado: 512, logo: true, ayuda: "Ideal: SVG cuadrado" },
      { n: "descripcion", l: "Descripción", t: "texto", ayuda: "Se ve en la carta al tocar la skill" },
    ],
  },
  historias: {
    titulo: "Historias",
    bajada: "Las columnas con pestaña: estudios y trabajos.",
    lista: true,
    resumen: (h) => [h.tab || "Sin etiqueta", h.titulo],
    imagenItem: "imagen",
    nuevo: () => ({ tab: "NUEVA", titulo: "Nueva historia", imagen: "", texto: "" }),
    campos: [
      { n: "tab", l: "Etiqueta del botón", t: "linea", max: 12, ayuda: "Corta, ej: JAP, FORGE" },
      { n: "titulo", l: "Título", t: "linea", max: 200 },
      { n: "imagen", l: "Imagen", t: "imagen", carpeta: "historias", lado: 1400, ayuda: "Vertical; se recorta para llenar el panel" },
      { n: "texto", l: "Texto", t: "texto", ayuda: "Línea en blanco = nuevo párrafo" },
    ],
  },
  proyectos: {
    titulo: "Proyectos",
    bajada: "Miniatura, galería y descripción de cada proyecto.",
    lista: true,
    resumen: (p) => [p.nombre || "Sin nombre", p.titulo],
    imagenItem: "miniatura",
    nuevo: () => ({ nombre: "Nuevo", titulo: "Nuevo proyecto", miniatura: "", galeria: [], texto: "" }),
    campos: [
      { n: "nombre", l: "Nombre corto", t: "linea", max: 60, ayuda: "Aparece sobre la miniatura" },
      { n: "titulo", l: "Título", t: "linea", max: 200 },
      { n: "miniatura", l: "Miniatura", t: "imagen", carpeta: "proyectos", lado: 900, ayuda: "Horizontal" },
      { n: "galeria", l: "Galería", t: "galeria", carpeta: "proyectos", lado: 1920, max: 12, ayuda: "Hasta 12 imágenes" },
      { n: "texto", l: "Descripción", t: "texto", ayuda: "Línea en blanco = nuevo párrafo" },
      { n: "video", l: "Video (opcional)", t: "linea", max: 300, placeholder: "assets/proyectos/video.mp4", ayuda: "Ruta de un MP4 ya subido al repo" },
      { n: "poster", l: "Imagen previa del video (opcional)", t: "imagen", carpeta: "proyectos", lado: 1920 },
    ],
  },
  resumen: {
    titulo: "Resumen para buscadores",
    bajada: "El HTML que leen Google, LinkedIn y las IAs que no ejecutan JavaScript. Los visitantes no lo ven. Mantenelo al día con el contenido del sitio.",
    campos: [{ n: "html", l: "HTML del resumen", t: "codigo" }],
  },
};
const ORDEN = ["perfil", "skills", "historias", "proyectos", "resumen"];

/* ── Estado ──────────────────────────────────────────────── */
const E = {
  seccion: "perfil",
  datos: {},          // borrador en edición
  guardado: {},       // lo último guardado en Mongo (para saber qué cambió)
  pendientes: new Set(),   // imágenes subidas que todavía no están publicadas
  sitioUrl: "",
  estado: {},
  ocupado: false,
};
const abiertos = new WeakSet();   // ítems de lista desplegados

const $ = (s) => document.querySelector(s);
const clonar = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sucia = (s) => !igual(E.datos[s], E.guardado[s]);
const algunaSucia = () => ORDEN.some(sucia);

/* ── Utilidades de DOM ───────────────────────────────────── */
function el(etiqueta, atributos = {}, ...hijos) {
  const nodo = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(atributos)) {
    if (v === false || v === null || v === undefined) continue;
    if (k === "class") nodo.className = v;
    else if (k.startsWith("on")) nodo.addEventListener(k.slice(2), v);
    else if (k in nodo && typeof v !== "string") nodo[k] = v;
    else nodo.setAttribute(k, v === true ? "" : v);
  }
  for (const h of hijos.flat()) if (h !== null && h !== undefined && h !== false) nodo.append(h);
  return nodo;
}

function avisar(mensaje, { error = false, enlace, ms = 5000 } = {}) {
  const nodo = el("div", { class: `aviso${error ? " aviso--error" : ""}`, role: error ? "alert" : "status" }, mensaje);
  if (enlace) nodo.append(" ", el("a", { href: enlace.href, target: "_blank", rel: "noopener" }, enlace.texto));
  $("#avisos").append(nodo);
  setTimeout(() => nodo.remove(), error ? ms * 2 : ms);
}

/* ── Comunicación con el Worker ──────────────────────────── */
async function api(metodo, ruta, cuerpo, tipo) {
  const opciones = { method: metodo, headers: { "X-Panel": "1" }, credentials: "same-origin", redirect: "manual" };
  if (cuerpo !== undefined) {
    if (tipo) {
      opciones.body = cuerpo;
      opciones.headers["Content-Type"] = tipo;
    } else {
      opciones.body = JSON.stringify(cuerpo);
      opciones.headers["Content-Type"] = "application/json";
    }
  }
  let res;
  try {
    res = await fetch(ruta, opciones);
  } catch {
    throw new Error("No hay conexión con el panel. Revisá internet y probá de nuevo.");
  }
  // Access redirige al login cuando la sesión vence
  if (res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) {
    throw new Error("La sesión expiró. Recargá la página para volver a entrar.");
  }
  const esJson = (res.headers.get("Content-Type") || "").includes("json");
  const datos = esJson ? await res.json() : { error: await res.text() };
  if (!res.ok) throw new Error(datos.error || `Error ${res.status}`);
  return datos;
}

/* ── Imágenes ────────────────────────────────────────────── */
function urlImagen(ruta) {
  if (!ruta) return "";
  return E.pendientes.has(ruta) ? `/api/archivo/${ruta}` : E.sitioUrl + ruta;
}

function imagen(ruta, { logo = false } = {}) {
  const caja = el("div", { class: `miniatura${logo ? " miniatura--logo" : ""}` });
  if (!ruta) {
    caja.append("Sin imagen");
    return caja;
  }
  const img = el("img", { src: urlImagen(ruta), alt: "", loading: "lazy", decoding: "async" });
  // Si el sitio todavía no la tiene (se está redesplegando), se pide a la base
  img.addEventListener("error", () => {
    if (img.dataset.reintento) return;
    img.dataset.reintento = "1";
    img.src = `/api/archivo/${ruta}`;
  });
  caja.append(img);
  if (E.pendientes.has(ruta)) caja.append(el("span", { class: "marca-nueva" }, "NUEVA"));
  return caja;
}

/* Achica y pasa a WebP. SVG y GIF se suben tal cual. */
async function prepararImagen(archivo, lado) {
  if (["image/svg+xml", "image/gif"].includes(archivo.type)) return { blob: archivo, tipo: archivo.type };
  if (!archivo.type.startsWith("image/")) throw new Error(`${archivo.name} no es una imagen`);

  const bmp = await createImageBitmap(archivo);
  const escala = Math.min(1, lado / Math.max(bmp.width, bmp.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(bmp.width * escala);
  lienzo.height = Math.round(bmp.height * escala);
  lienzo.getContext("2d").drawImage(bmp, 0, 0, lienzo.width, lienzo.height);
  bmp.close?.();

  let blob = await new Promise((r) => lienzo.toBlob(r, "image/webp", 0.85));
  if (!blob || blob.type !== "image/webp") blob = await new Promise((r) => lienzo.toBlob(r, "image/jpeg", 0.85));

  // Si el original ya era chico y liviano, no tiene sentido recomprimirlo
  const original = ["image/jpeg", "image/webp", "image/png"].includes(archivo.type);
  if (escala === 1 && original && archivo.size <= blob.size) return { blob: archivo, tipo: archivo.type };
  return { blob, tipo: blob.type };
}

async function subirImagen(archivo, campo) {
  const { blob, tipo } = await prepararImagen(archivo, campo.lado || 1600);
  const params = new URLSearchParams({ carpeta: campo.carpeta, nombre: archivo.name });
  const { ruta } = await api("POST", `/api/archivos?${params}`, blob, tipo);
  E.pendientes.add(ruta);
  E.estado.cambiosSinPublicar = true;
  return ruta;
}

function elegirArchivos({ multiple = false, logo = false } = {}) {
  return new Promise((resolver) => {
    const selector = $("#selector");
    selector.value = "";
    selector.multiple = multiple;
    selector.accept = logo ? "image/svg+xml,image/png,image/webp" : "image/*";
    selector.onchange = () => resolver([...selector.files]);
    selector.click();
  });
}

/* ── Campos ──────────────────────────────────────────────── */
function campo(def, obj, alCambiar) {
  const etiqueta = el("span", { class: "etiqueta" }, def.l, def.ayuda ? el("span", { class: "ayuda" }, def.ayuda) : null);
  const envoltura = el("div", { class: "campo" }, etiqueta);

  switch (def.t) {
    case "linea": {
      envoltura.append(el("input", {
        class: "entrada", type: "text", value: obj[def.n] ?? "", maxLength: def.max ?? 200,
        placeholder: def.placeholder ?? "",
        oninput: (e) => { obj[def.n] = e.target.value; alCambiar(false); },
      }));
      break;
    }
    case "texto":
    case "codigo": {
      const area = el("textarea", {
        class: `area${def.t === "codigo" ? " area--codigo" : ""}`, spellcheck: def.t === "texto",
        oninput: (e) => { obj[def.n] = e.target.value; crecer(e.target); alCambiar(false); },
      });
      area.value = obj[def.n] ?? "";
      envoltura.append(area);
      requestAnimationFrame(() => crecer(area));
      break;
    }
    case "nivel": {
      const grupo = el("div", { class: "niveles", role: "radiogroup", "aria-label": def.l });
      for (let i = 0; i <= 5; i++) {
        grupo.append(el("button", {
          type: "button", class: `nivel${i <= (obj[def.n] ?? 0) && i > 0 ? " nivel--encendido" : ""}`,
          role: "radio", "aria-checked": String(i === obj[def.n]), title: `Nivel ${i}`,
          onclick: () => { obj[def.n] = i; alCambiar(true); },
        }, String(i)));
      }
      envoltura.append(grupo);
      break;
    }
    case "imagen": {
      const caja = el("div", { class: "imagen" });
      const pintarCaja = () => {
        caja.replaceChildren(...[
          imagen(obj[def.n], { logo: def.logo }),
          el("div", { class: "botones" },
            el("button", {
              type: "button", class: "boton boton--chico",
              onclick: async () => {
                const [archivo] = await elegirArchivos({ logo: def.logo });
                if (!archivo) return;
                caja.classList.add("subiendo");
                try {
                  obj[def.n] = await subirImagen(archivo, def);
                  alCambiar(true);
                } catch (e) {
                  avisar(e.message, { error: true });
                } finally {
                  caja.classList.remove("subiendo");
                  pintarCaja();
                }
              },
            }, obj[def.n] ? "Cambiar" : "Subir imagen"),
            obj[def.n] ? el("button", {
              type: "button", class: "boton boton--chico boton--plano boton--peligro",
              onclick: () => { obj[def.n] = ""; alCambiar(true); },
            }, "Quitar") : null,
          ),
          obj[def.n] ? el("span", { class: "ruta" }, obj[def.n]) : null,
        ].filter(Boolean));
      };
      pintarCaja();
      envoltura.append(caja);
      break;
    }
    case "galeria": {
      const lista = (obj[def.n] ??= []);
      const grilla = el("div", { class: "galeria" });
      lista.forEach((ruta, i) => {
        grilla.append(el("div", { class: "cuadro" },
          imagen(ruta),
          el("div", { class: "mini-botones" },
            el("button", { type: "button", class: "boton boton--icono", title: "Mover a la izquierda", disabled: i === 0,
              onclick: () => { [lista[i - 1], lista[i]] = [lista[i], lista[i - 1]]; alCambiar(true); } }, "←"),
            el("button", { type: "button", class: "boton boton--icono", title: "Mover a la derecha", disabled: i === lista.length - 1,
              onclick: () => { [lista[i + 1], lista[i]] = [lista[i], lista[i + 1]]; alCambiar(true); } }, "→"),
            el("button", { type: "button", class: "boton boton--icono boton--peligro", title: "Sacar de la galería",
              onclick: () => { lista.splice(i, 1); alCambiar(true); } }, "✕"),
          ),
        ));
      });
      if (lista.length < (def.max ?? 12)) {
        const agregar = el("button", {
          type: "button", class: "agregar",
          onclick: async () => {
            const archivos = (await elegirArchivos({ multiple: true })).slice(0, (def.max ?? 12) - lista.length);
            if (!archivos.length) return;
            agregar.textContent = "Subiendo…";
            grilla.classList.add("subiendo");
            let ok = 0;
            for (const archivo of archivos) {
              try {
                lista.push(await subirImagen(archivo, def));
                ok++;
              } catch (e) {
                avisar(`${archivo.name}: ${e.message}`, { error: true });
              }
            }
            if (ok) alCambiar(true);
            else pintar();
          },
        }, "+ Agregar imágenes");
        grilla.append(agregar);
      }
      envoltura.append(grilla);
      break;
    }
  }
  return envoltura;
}

function crecer(area) {
  if (area.classList.contains("area--codigo")) return;
  area.style.height = "auto";
  area.style.height = `${area.scrollHeight + 4}px`;
}

/* ── Secciones ───────────────────────────────────────────── */
function pintarObjeto(def, s) {
  const obj = (E.datos[s] ??= {});
  return el("div", { class: "tarjeta" }, def.campos.map((c) => campo(c, obj, cambio)));
}

function pintarLista(def, s) {
  const lista = (E.datos[s] ??= []);
  const contenedor = el("div");

  lista.forEach((item, i) => {
    const [titulo, sub] = def.resumen(item);
    const tituloNodo = el("strong", {}, titulo);
    const subNodo = el("small", {}, sub || "");
    const detalles = el("details", { class: "tarjeta item", open: abiertos.has(item) });
    detalles.addEventListener("toggle", () => {
      detalles.open ? abiertos.add(item) : abiertos.delete(item);
    });

    // Al escribir, el título del ítem se actualiza sin redibujar todo
    const alCambiar = (redibujar) => {
      const [t, st] = def.resumen(item);
      tituloNodo.textContent = t;
      subNodo.textContent = st || "";
      cambio(redibujar);
    };
    const mover = (a) => (e) => {
      e.preventDefault();
      [lista[i], lista[a]] = [lista[a], lista[i]];
      cambio(true);
    };

    detalles.append(
      el("summary", {},
        el("span", { class: "numero" }, String(i + 1)),
        imagen(item[def.imagenItem], { logo: def.imagenItem === "logo" }),
        el("div", { class: "titulo-item" }, tituloNodo, subNodo),
        el("div", { class: "orden" },
          el("button", { type: "button", class: "boton boton--icono", title: "Subir", disabled: i === 0, onclick: mover(i - 1) }, "↑"),
          el("button", { type: "button", class: "boton boton--icono", title: "Bajar", disabled: i === lista.length - 1, onclick: mover(i + 1) }, "↓"),
          el("button", {
            type: "button", class: "boton boton--icono boton--peligro", title: "Eliminar",
            onclick: (e) => {
              e.preventDefault();
              if (!confirm(`¿Eliminar "${titulo}"? Se aplica al guardar.`)) return;
              lista.splice(i, 1);
              cambio(true);
            },
          }, "✕"),
        ),
      ),
      el("div", { class: "cuerpo" }, def.campos.map((c) => campo(c, item, alCambiar))),
    );
    contenedor.append(detalles);
  });

  contenedor.append(el("button", {
    type: "button", class: "boton agregar-item",
    onclick: () => {
      const nuevo = def.nuevo();
      abiertos.add(nuevo);
      lista.push(nuevo);
      cambio(true);
      requestAnimationFrame(() => contenedor.querySelector("details:last-of-type")?.scrollIntoView({ behavior: "smooth", block: "center" }));
    },
  }, `+ Agregar a ${def.titulo.toLowerCase()}`));
  return contenedor;
}

function pintarPestanas() {
  $("#pestanas").replaceChildren(...ORDEN.map((s) => el("button", {
    type: "button",
    class: `pestana${sucia(s) ? " pestana--sucia" : ""}`,
    "aria-current": String(s === E.seccion),
    onclick: () => { E.seccion = s; history.replaceState(null, "", `#${s}`); pintar(); scrollTo({ top: 0 }); },
  }, ESQUEMA[s].titulo.replace(" para buscadores", ""))));
}

function pintarBarraGuardar() {
  let barra = $(".guardar");
  if (!barra) {
    barra = el("div", { class: "guardar", role: "region", "aria-label": "Cambios sin guardar" },
      el("span", {}, "Cambios sin guardar"),
      el("button", { type: "button", class: "boton boton--chico boton--plano", onclick: descartar }, "Descartar"),
      el("button", { type: "button", class: "boton boton--chico boton--primario", onclick: () => guardar(E.seccion) }, "Guardar"),
    );
    document.body.append(barra);
  }
  barra.classList.toggle("guardar--visible", sucia(E.seccion));
}

function pintarEstado() {
  const caja = $("#estado");
  caja.hidden = false;
  const pendiente = E.estado.cambiosSinPublicar || algunaSucia();
  caja.classList.toggle("estado--pendiente", pendiente);
  let txt;
  if (algunaSucia()) txt = "Sin guardar";
  else if (E.estado.cambiosSinPublicar) txt = "Guardado · falta publicar";
  else if (E.estado.ultimaPublicacion) txt = `Publicado ${haceCuanto(E.estado.ultimaPublicacion)}`;
  else txt = "Al día con el sitio";
  $("#estado-texto").textContent = txt;
  $("#publicar").disabled = E.ocupado || !pendiente;
}

function haceCuanto(fecha) {
  const min = Math.round((Date.now() - new Date(fecha)) / 60000);
  if (min < 1) return "recién";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  return new Date(fecha).toLocaleDateString("es-UY", { day: "numeric", month: "short" });
}

function pintar() {
  const def = ESQUEMA[E.seccion];
  pintarPestanas();
  $("#principal").replaceChildren(
    el("div", { class: "cabecera" }, el("div", {}, el("h1", {}, def.titulo), el("p", {}, def.bajada))),
    def.lista ? pintarLista(def, E.seccion) : pintarObjeto(def, E.seccion),
  );
  pintarBarraGuardar();
  pintarEstado();
}

/* Se llama en cada edición. Redibuja solo si cambió la estructura
   (para no perder el foco mientras se escribe). */
function cambio(redibujar) {
  if (redibujar) pintar();
  else {
    pintarPestanas();
    pintarBarraGuardar();
    pintarEstado();
  }
}

/* ── Acciones ────────────────────────────────────────────── */
async function guardar(s, { silencioso = false } = {}) {
  if (!sucia(s)) return true;
  try {
    const { datos } = await api("PUT", `/api/contenido/${s}`, E.datos[s]);
    E.guardado[s] = clonar(datos);
    // Si el servidor normalizó algo (espacios, límites), se refleja acá
    if (!igual(datos, E.datos[s])) {
      E.datos[s] = clonar(datos);
      if (s === E.seccion) pintar();
    }
    E.estado.cambiosSinPublicar = true;
    if (!silencioso) avisar(`${ESQUEMA[s].titulo}: guardado. Falta publicar para que se vea en el sitio.`);
    cambio(false);
    return true;
  } catch (e) {
    avisar(`${ESQUEMA[s].titulo}: ${e.message}`, { error: true });
    return false;
  }
}

function descartar() {
  if (!confirm("¿Descartar los cambios de esta sección?")) return;
  E.datos[E.seccion] = clonar(E.guardado[E.seccion]);
  pintar();
}

async function publicar() {
  const sinGuardar = ORDEN.filter(sucia);
  if (sinGuardar.length) {
    const nombres = sinGuardar.map((s) => ESQUEMA[s].titulo).join(", ");
    if (!confirm(`Hay cambios sin guardar en: ${nombres}.\n¿Guardarlos y publicar?`)) return;
    for (const s of sinGuardar) if (!(await guardar(s, { silencioso: true }))) return;
  } else if (!confirm("¿Publicar los cambios en el sitio?")) {
    return;
  }

  E.ocupado = true;
  const boton = $("#publicar");
  boton.textContent = "Publicando…";
  pintarEstado();
  try {
    const r = await api("POST", "/api/publicar");
    E.pendientes.clear();
    E.estado.cambiosSinPublicar = false;
    if (r.sinCambios) {
      avisar("No había diferencias con lo que ya está publicado.");
    } else {
      E.estado.ultimaPublicacion = new Date().toISOString();
      avisar("Publicado. El sitio se actualiza en uno o dos minutos.", { enlace: { href: r.url, texto: "Ver commit" }, ms: 9000 });
    }
    pintar();
  } catch (e) {
    avisar(`No se pudo publicar: ${e.message}`, { error: true });
  } finally {
    E.ocupado = false;
    boton.textContent = "Publicar";
    pintarEstado();
  }
}

async function importar({ reimportar = false } = {}) {
  if (reimportar && !confirm(
    "Esto reemplaza TODO el borrador por lo que hoy está en GitHub.\nLo guardado y no publicado se pierde. ¿Seguir?",
  )) return;

  const progreso = el("i");
  const texto = el("p", {}, "Leyendo el contenido del repo…");
  $("#principal").replaceChildren(el("div", { class: "tarjeta vacio" },
    el("h1", {}, "Importando"), texto, el("div", { class: "progreso" }, progreso)));

  try {
    const { rutas } = await api("POST", "/api/importar");
    for (let i = 0; i < rutas.length; i += 6) {
      texto.textContent = `Copiando imágenes a la base… ${Math.min(i + 6, rutas.length)} de ${rutas.length}`;
      progreso.style.width = `${Math.round(((i + 6) / rutas.length) * 100)}%`;
      const r = await api("POST", "/api/importar/archivos", { rutas: rutas.slice(i, i + 6) });
      if (r.faltantes?.length) avisar(`No están en el repo: ${r.faltantes.join(", ")}`, { error: true });
    }
    avisar("Listo: el contenido del sitio ya está en la base.");
    await cargar();
  } catch (e) {
    avisar(`No se pudo importar: ${e.message}`, { error: true });
    await cargar();
  }
}

function pintarVacio() {
  $("#pestanas").replaceChildren();
  $("#principal").replaceChildren(el("div", { class: "tarjeta vacio" },
    el("h1", {}, "La base está vacía"),
    el("p", {}, "Primero hay que copiar a MongoDB el contenido que hoy tiene el sitio: textos, skills, historias, proyectos e imágenes. Se hace una sola vez."),
    el("button", { type: "button", class: "boton boton--primario", onclick: () => importar() }, "Importar desde GitHub"),
  ));
}

/* ── Arranque ────────────────────────────────────────────── */
async function cargar() {
  try {
    const r = await api("GET", "/api/estado");
    E.sitioUrl = r.sitioUrl.endsWith("/") ? r.sitioUrl : `${r.sitioUrl}/`;
    E.pendientes = new Set(r.pendientes);
    E.estado = r.estado;
    E.guardado = clonar(r.contenido);
    E.datos = clonar(r.contenido);

    $("#quien").textContent = r.email;
    $("#ver-sitio").href = E.sitioUrl;
    $("#pie-repo").textContent = `Publica en ${r.repo} · rama ${r.rama}`;
    $("#pie").hidden = r.vacio;

    if (r.vacio) {
      pintarVacio();
      $("#estado").hidden = true;
      $("#publicar").disabled = true;
      return;
    }
    const pedida = location.hash.slice(1);
    if (ORDEN.includes(pedida)) E.seccion = pedida;
    pintar();
  } catch (e) {
    $("#principal").replaceChildren(el("div", { class: "tarjeta vacio" },
      el("h1", {}, "No se pudo cargar"), el("p", {}, e.message),
      el("button", { type: "button", class: "boton", onclick: () => location.reload() }, "Reintentar")));
  }
}

$("#publicar").addEventListener("click", publicar);
$("#reimportar").addEventListener("click", () => importar({ reimportar: true }));

addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    guardar(E.seccion);
  }
});
addEventListener("beforeunload", (e) => {
  if (algunaSucia()) e.preventDefault();
});
setInterval(() => { if (!algunaSucia()) pintarEstado(); }, 60000);

cargar();
