/* ═══════════════════════════════════════════════════════════
   PUNTO DE ENTRADA
   Orquesta el montaje del sitio:
   1. Arranca el portal (su markup vive en index.html).
   2. Trae en paralelo los partials, el sprite de iconos y el
      contenido editable (contenido/*.json, que edita Pages CMS).
   3. Monta cada componente con sus datos.
   Para desactivar un componente, comentá su línea acá.
   ═══════════════════════════════════════════════════════════ */
import { incluirParciales, inyectarIconos } from "./incluir.js";
import { cargarContenido } from "./util/contenido.js";
import { montarPortal } from "./componentes/portal.js";
import { montarPerfil } from "./componentes/perfil.js";
import { pintarRack } from "./componentes/rack.js";
import { montarCartaSkills } from "./componentes/carta-skill.js";
import { montarHistorias } from "./componentes/historias.js";
import { montarProyectos } from "./componentes/proyectos.js";
import { montarVisor } from "./componentes/visor.js";
import { montarMenu } from "./componentes/menu.js";
import { montarNavActiva } from "./componentes/nav-activa.js";
import { montarRevelado } from "./componentes/revelado.js";
import { montarFormulario } from "./componentes/formulario.js";
import { montarContador } from "./componentes/contador.js";
import { montarTraductor } from "./componentes/traductor.js";
import { montarCV } from "./componentes/cv.js";

async function iniciar() {
  // La pantalla de carga es lo primero que se ve; se retira sola
  // en cuanto las secciones reales están armadas.
  const portalListo = montarPortal();

  // Todo en paralelo: el contenido baja mientras llegan los partials
  const [, , contenido] = await Promise.all([
    inyectarIconos(),
    incluirParciales(),
    cargarContenido(),
  ]);

  // Las secciones reales ya están: el resumen de texto plano (pensado
  // para crawlers sin JavaScript) deja de hacer falta.
  document.getElementById("resumen")?.remove();

  montarPerfil(contenido.perfil);
  pintarRack(contenido.skills);
  montarCartaSkills(contenido.skills);
  montarHistorias(contenido.historias);
  montarProyectos(contenido.proyectos);

  // Con el contenido ya pintado, la pantalla de carga se puede ir
  portalListo();
  montarVisor();
  montarMenu();
  montarNavActiva();
  // montarRevelado();  ← desactivado, igual que en la versión original
  montarFormulario();
  montarContador();
  montarCV();

  // Último a propósito: el widget de Google tiene que encontrar el DOM
  // ya completo (historias y proyectos incluidos) en su primera pasada.
  montarTraductor();
}

document.addEventListener("DOMContentLoaded", iniciar);
