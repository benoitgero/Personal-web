/* Flechas del teclado para moverse entre tabs.
   Utilidad compartida por Historias y Proyectos. */
export function navegarConTeclado(tabs, seleccionar) {
  tabs.forEach((tab, i) => {
    tab.addEventListener("keydown", (e) => {
      let destino = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") destino = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") destino = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") destino = 0;
      if (e.key === "End") destino = tabs.length - 1;
      if (destino === null) return;
      e.preventDefault();
      seleccionar(destino);
      tabs[destino].focus();
    });
  });
}
