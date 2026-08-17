/* ── Contador de caracteres del mensaje ── */
export function montarContador() {
  const area = document.getElementById("campo-mensaje");
  const contador = document.getElementById("contador-mensaje");
  if (!area || !contador) return;

  const tope = area.maxLength;

  function actualizar() {
    contador.textContent = `${area.value.length} / ${tope}`;
    // Resalta cuando quedan menos de 50 caracteres
    contador.classList.toggle("campo__contador--tope", area.value.length > tope - 50);
  }

  area.addEventListener("input", actualizar);
  // El form.reset() del envío no dispara "input", así que lo escuchamos aparte
  area.form?.addEventListener("reset", () => setTimeout(actualizar));
  actualizar();
}
