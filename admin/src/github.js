/* ═══════════════════════════════════════════════════════════
   GITHUB — leer archivos del repo y publicar en un solo commit
   ═══════════════════════════════════════════════════════════

   Usa la API de bajo nivel de Git (blobs → árbol → commit → ref)
   para que una publicación sea UN commit con todos los cambios,
   y por lo tanto un solo redespliegue del sitio. */

import { Buffer } from "node:buffer";

function base(env) {
  return `${env.GITHUB_API || "https://api.github.com"}/repos/${env.REPO}`;
}

function cabeceras(env, extra = {}) {
  if (!env.GITHUB_TOKEN) {
    const e = new Error("Falta el secreto GITHUB_TOKEN en Cloudflare.");
    e.status = 500;
    throw e;
  }
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-admin",
    ...extra,
  };
}

async function pedir(env, metodo, camino, cuerpo) {
  const res = await fetch(base(env) + camino, {
    method: metodo,
    headers: cabeceras(env, cuerpo ? { "Content-Type": "application/json" } : {}),
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!res.ok) {
    const detalle = (await res.text()).slice(0, 300);
    const e = new Error(`GitHub respondió ${res.status} a ${metodo} ${camino}: ${detalle}`);
    e.status = 502;
    e.github = res.status;
    throw e;
  }
  return res.status === 204 ? null : res.json();
}

const codificarRuta = (ruta) => ruta.split("/").map(encodeURIComponent).join("/");

/* Contenido crudo de un archivo del repo (ArrayBuffer), o null si no existe */
export async function leerArchivo(env, ruta, ref = env.RAMA) {
  const res = await fetch(
    `${base(env)}/contents/${codificarRuta(ruta)}?ref=${encodeURIComponent(ref)}`,
    { headers: cabeceras(env, { Accept: "application/vnd.github.raw+json" }) },
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const e = new Error(`GitHub respondió ${res.status} al leer ${ruta}`);
    e.status = 502;
    e.github = res.status;
    throw e;
  }
  return res.arrayBuffer();
}

export async function leerTexto(env, ruta, ref) {
  const buf = await leerArchivo(env, ruta, ref);
  return buf === null ? null : new TextDecoder().decode(buf);
}

/* Sube los bytes de un archivo como blob suelto. No cambia nada
   visible en el repo hasta que un commit lo referencie. */
export async function crearBlob(env, bytes) {
  const r = await pedir(env, "POST", "/git/blobs", {
    content: Buffer.from(bytes).toString("base64"),
    encoding: "base64",
  });
  return r.sha;
}

/* Último commit de la rama y su árbol */
export async function cabezaDeRama(env) {
  const ref = await pedir(env, "GET", `/git/ref/heads/${env.RAMA}`);
  const commit = await pedir(env, "GET", `/git/commits/${ref.object.sha}`);
  return { commit: commit.sha, arbol: commit.tree.sha };
}

export async function crearArbol(env, arbolBase, entradas) {
  const r = await pedir(env, "POST", "/git/trees", { base_tree: arbolBase, tree: entradas });
  return r.sha;
}

export async function crearCommit(env, mensaje, arbol, padre) {
  return pedir(env, "POST", "/git/commits", { message: mensaje, tree: arbol, parents: [padre] });
}

export async function moverRama(env, sha) {
  return pedir(env, "PATCH", `/git/refs/heads/${env.RAMA}`, { sha, force: false });
}
