/* ═══════════════════════════════════════════════════════════
   PUNTO DE ENTRADA
   Orquesta el montaje del sitio:
   1. Arranca el portal (su markup vive en index.html).
   2. Trae los partials de HTML y el sprite de iconos.
   3. Monta cada componente.
   Para desactivar un componente, comentá su línea acá.
   ═══════════════════════════════════════════════════════════ */
import { incluirParciales, inyectarIconos } from "./incluir.js";
import { montarPortal } from "./componentes/portal.js";
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

async function iniciar() {
  // El portal no espera a nada: es lo primero que se ve
  montarPortal();

  // El resto del sitio necesita que los partials ya estén en el DOM
  await Promise.all([inyectarIconos(), incluirParciales()]);

  pintarRack();
  montarCartaSkills();
  await Promise.all([montarHistorias(), montarProyectos()]);
  montarVisor();
  montarMenu();
  montarNavActiva();
  // montarRevelado();  ← desactivado, igual que en la versión original
  montarFormulario();
  montarContador();
}

document.addEventListener("DOMContentLoaded", iniciar);
