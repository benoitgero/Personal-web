/* ═══════════════════════════════════════════════════════════
   HISTORIAS — editá solo este archivo para las pestañas
   ═══════════════════════════════════════════════════════════

   El TEXTO LARGO de cada historia NO va acá: vive en
   contenido/textos/historias/<id>.txt — un archivo de texto plano
   que podés editar sin tocar código.

   Para agregar una historia:
   1. Copiá una línea y cambiá id, tab y titulo.
   2. Creá contenido/textos/historias/<id>.txt con el texto.
   3. Subí la imagen a assets/historias/.

   tab:    etiqueta corta del botón
   titulo: título que aparece en el panel */

export const HISTORIAS = [
  { id: "forge",  tab: "Forge",  titulo: "Fundación Forge", imagen: "assets/historias/forge.jpg" },
  { id: "ces",    tab: "CES",    titulo: "Centro de Ensayos de Software",             imagen: "assets/historias/ces.jpg" },
  { id: "jap",    tab: "JAP",    titulo: "Jóvenes a Programar",             imagen: "assets/historias/jap.jpg" },
  { id: "fadu",   tab: "FADU",   titulo: "Facultad de Arquitectura, Diseño y Urbanismo",            imagen: "assets/historias/fadu.jpg" },
  { id: "tcs",    tab: "TCS",    titulo: "TCS",             imagen: "assets/historias/tcs.jpg" },
  { id: "switch", tab: "Switch", titulo: "Switch",          imagen: "assets/historias/switch.jpg" },
];
