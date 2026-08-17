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
    id: "proyecto-2",
    nombre: "Proyecto 2",
    titulo: "Proyecto 2",
    miniatura: "assets/proyectos/p2-thumb.jpg",
    video: "assets/proyectos/p2.mp4",
    poster: "assets/proyectos/p2-poster.jpg",
    galeria: ["assets/proyectos/p2-1.jpg", "assets/proyectos/p2-2.jpg", "assets/proyectos/p2-3.jpg"],
  },
  {
    id: "proyecto-3",
    nombre: "Proyecto 3",
    titulo: "Proyecto 3",
    miniatura: "assets/proyectos/p3-thumb.jpg",
    video: "assets/proyectos/p3.mp4",
    poster: "assets/proyectos/p3-poster.jpg",
    galeria: ["assets/proyectos/p3-1.jpg", "assets/proyectos/p3-2.jpg", "assets/proyectos/p3-3.jpg"],
  },
];
