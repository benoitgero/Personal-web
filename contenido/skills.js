/* ═══════════════════════════════════════════════════════════
   SKILLS — editá solo este archivo para actualizar el rack
   ═══════════════════════════════════════════════════════════

   nivel: 0 a 5, son los segmentos encendidos.
   logo:  ruta al SVG. Si ponés null, muestra el texto de "abrev".
   El orden del array es el orden de izquierda a derecha en pantalla. */

export const SKILLS = [
  { nombre: "HTML5",            abrev: "HTML", nivel: 3, logo: "assets/logos/html.svg",
    descripcion: "Estructura semántica y accesible. Este mismo sitio está armado a mano con HTML5, sin frameworks." },
  { nombre: "CSS3",             abrev: "CSS",  nivel: 3, logo: "assets/logos/css.svg",
    descripcion: "Grid, flexbox y sistemas de diseño. El estilo neumórfico de esta página está traducido 1:1 desde Figma." },
  { nombre: "JavaScript",       abrev: "JS",   nivel: 2, logo: "assets/logos/js.svg",
    descripcion: "JavaScript vanilla para interactividad: tabs, menús, formularios y esta misma carta que estás viendo." },
  { nombre: "AWS",              abrev: "AWS",  nivel: 3, logo: "assets/logos/aws.svg",
    descripcion: "Certificado AWS Cloud Practitioner a través del programa re/Start: EC2, S3, redes, seguridad y fundamentos de la nube." },
  { nombre: "Azure",            abrev: "AZ",   nivel: 3, logo: "assets/logos/azure.svg",
    descripcion: "Administración de recursos en Azure: máquinas virtuales, Entra ID y servicios de infraestructura." },
  { nombre: "Figma",            abrev: "FIG",  nivel: 3, logo: "assets/logos/figma.svg",
    descripcion: "Diseño de interfaces y prototipos. Antes de escribir una línea de código, lo visualizo en Figma." },
  { nombre: "Linux",            abrev: "LNX",  nivel: 2, logo: "assets/logos/linux.svg",
    descripcion: "Línea de comandos, administración básica de servidores y scripting en entornos Linux." },
  { nombre: "Microsoft Office", abrev: "MS",   nivel: 4, logo: "assets/logos/office.svg",
    descripcion: "Dominio avanzado de la suite: Excel, Word, PowerPoint y herramientas de productividad del día a día." },
  { nombre: "AutoCAD",          abrev: "CAD",  nivel: 4, logo: "assets/logos/autocad.svg",
    descripcion: "Dibujo técnico y planos en 2D. Base de mi mentalidad de diseño aplicada a la infraestructura." },
  { nombre: "SketchUp",         abrev: "SKP",  nivel: 4, logo: "assets/logos/sketchup.svg",
    descripcion: "Modelado 3D para visualizar espacios y proyectos antes de construirlos." },
];

export const SEGMENTOS = 5; // segmentos por fader
