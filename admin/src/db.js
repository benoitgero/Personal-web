/* ═══════════════════════════════════════════════════════════
   MONGODB ATLAS
   ═══════════════════════════════════════════════════════════

   Colecciones de la base "portfolio":
     contenido  { _id: "perfil" | "skills" | …, datos, actualizado }
     archivos   { _id: "assets/…", tipo, datos (binario), bytes,
                  blobSha, publicado, creado }
     estado     { _id: "publicacion", pendiente, ultima, commit, url }

   En Workers una conexión no se puede reusar entre pedidos, así
   que cada pedido abre su cliente y lo cierra al terminar. */

import { MongoClient } from "mongodb";

export async function conBase(env, fn) {
  if (!env.MONGODB_URI) {
    const e = new Error("Falta el secreto MONGODB_URI en Cloudflare.");
    e.status = 500;
    throw e;
  }
  const cliente = new MongoClient(env.MONGODB_URI, {
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    appName: "portfolio-admin",
  });
  try {
    await cliente.connect();
    return await fn(cliente.db(env.BASE || "portfolio"));
  } finally {
    await cliente.close().catch(() => {});
  }
}

export async function leerContenido(db) {
  const docs = await db.collection("contenido").find({}).toArray();
  const contenido = {};
  for (const d of docs) contenido[d._id] = d.datos;
  return contenido;
}

export async function guardarSeccion(db, seccion, datos) {
  await db.collection("contenido").updateOne(
    { _id: seccion },
    { $set: { datos, actualizado: new Date() } },
    { upsert: true },
  );
}

export async function marcarPendiente(db) {
  await db.collection("estado").updateOne(
    { _id: "publicacion" },
    { $set: { pendiente: true } },
    { upsert: true },
  );
}

export async function leerEstado(db) {
  return (await db.collection("estado").findOne({ _id: "publicacion" })) ?? {};
}

/* Rutas subidas desde el panel que todavía no están en el repo */
export async function rutasPendientes(db) {
  const docs = await db
    .collection("archivos")
    .find({ publicado: false }, { projection: { _id: 1 } })
    .toArray();
  return docs.map((d) => d._id);
}
