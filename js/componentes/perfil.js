/* ── Sobre mí ──
   Datos: contenido/perfil.json (se edita desde Pages CMS).
   El HTML trae el texto de respaldo: si el JSON no carga, se ve igual. */
import { ruta, parrafos } from "../util/contenido.js";

export function montarPerfil(perfil = {}) {
  const foto = document.getElementById("perfil-foto");
  const titulo = document.getElementById("perfil-titulo");
  const texto = document.getElementById("perfil-texto");

  if (foto && perfil.foto) foto.src = ruta(perfil.foto);
  if (titulo && perfil.titulo) titulo.textContent = perfil.titulo;
  if (texto && perfil.texto) texto.innerHTML = parrafos(perfil.texto);
}
