/* ═══════════════════════════════════════════════════════════
   PROYECTOS — editá solo este archivo para las miniaturas
   ═══════════════════════════════════════════════════════════

   La DESCRIPCIÓN de cada proyecto NO va acá: vive en
   contenido/textos/proyectos/<id>.txt — texto plano editable.

   Para agregar un proyecto:
   1. Copiá un bloque entero y cambiá los datos.
   2. Creá contenido/textos/proyectos/<id>.txt con la descripción.
   3. Subí miniatura, fotos, video y poster a assets/proyectos/.

   Cada ítem de "galeria" puede ser una ruta suelta o un objeto
   { src: "...", ajuste: "contener" } para planos y láminas que
   deben verse enteros en vez de recortados. */

export const PROYECTOS = [
  {
    id: "rocha",
    nombre: "Laguna Garzon",
    titulo: "Laguna Garzon",
    miniatura: "assets/proyectos/rocha-thumb.jpg",
    video: "assets/proyectos/rocha.mp4",
    poster: "assets/proyectos/rocha-poster.jpg",
    galeria: [
      "assets/proyectos/rocha-1.jpg",
      "assets/proyectos/rocha-2.jpg",
      "assets/proyectos/rocha-3.jpg",
    ],
  },
  {
    id: "tokyo",
    nombre: "Tokyo",
    titulo: "Tokyo",
    miniatura: "assets/proyectos/tokyo-thumb.jpg",
    galeria: [
      "assets/proyectos/tokyo-1.jpg",
      // Los planos van "contener" para que se vean enteros, sin recortar
      { src: "assets/proyectos/tokyo-2.jpg", ajuste: "contener" },
      { src: "assets/proyectos/tokyo-3.jpg", ajuste: "contener" },
    ],
  },
  {
    id: "winserver",
    nombre: "Windows Server",
    titulo: "Windows Server",
    miniatura: "assets/proyectos/winserver-thumb.jpg",
    galeria: [
      // Diagramas y capturas: "contener" para que se lean enteros
      { src: "assets/proyectos/winserver-1.jpg", ajuste: "contener" },
      "assets/proyectos/winserver-2.jpg",
      { src: "assets/proyectos/winserver-3.jpg", ajuste: "contener" },
    ],
  },
  {
    id: "pwc",
    nombre: "PwC",
    titulo: "PricewaterhouseCoopers",
    miniatura: "assets/proyectos/pwc-thumb.jpg",
    galeria: [
      // Capturas de interfaz: "contener" para que el texto se lea entero
      { src: "assets/proyectos/pwc-1.jpg", ajuste: "contener" },
      { src: "assets/proyectos/pwc-2.jpg", ajuste: "contener" },
      { src: "assets/proyectos/pwc-3.jpg", ajuste: "contener" },
    ],
  },
];
