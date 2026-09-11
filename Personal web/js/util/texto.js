/* Trae un archivo de texto plano (los .txt de contenido/textos/).
   Si el archivo no existe, devuelve cadena vacía y el sitio sigue. */
export async function cargarTexto(ruta) {
  try {
    const res = await fetch(ruta);
    if (!res.ok) throw new Error();
    return (await res.text()).trim();
  } catch {
    return "";
  }
}
