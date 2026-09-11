/* ── Envío del formulario sin recargar la página ── */
export function montarFormulario() {
  const form = document.querySelector(".formulario");
  const estado = document.getElementById("form-estado");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    // Si el honeypot tiene contenido, lo llenó un bot: se descarta
    // en silencio, con mensaje de éxito para no darle pistas.
    const trampa = form.querySelector('[name="_gotcha"]');
    if (trampa && trampa.value) {
      e.preventDefault();
      estado.textContent = "Mensaje enviado. Te respondo a la brevedad.";
      return;
    }

    if (form.action.includes("TU_ID")) {
      e.preventDefault();
      estado.textContent = "Falta configurar el formulario: pegá tu ID de Formspree en el atributo action.";
      return;
    }

    e.preventDefault();
    estado.textContent = "Enviando…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      form.reset();
      estado.textContent = "Mensaje enviado. Te respondo a la brevedad.";
    } catch {
      estado.textContent = "No se pudo enviar. Probá de nuevo o escribime por mail.";
    }
  });
}
