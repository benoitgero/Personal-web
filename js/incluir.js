/* ═══════════════════════════════════════════════════════════
   CARGADOR DE PARTIALS
   Reemplaza cada <div data-include="ruta.html"> por el contenido
   del archivo indicado, y mete el sprite de iconos en el body.
   Necesita un servidor HTTP (GitHub Pages, Live Server…):
   con file:// el navegador bloquea fetch.
   ═══════════════════════════════════════════════════════════ */

export async function incluirParciales() {
  const marcas = [...document.querySelectorAll("[data-include]")];

  await Promise.all(
    marcas.map(async (marca) => {
      const ruta = marca.dataset.include;
      const res = await fetch(ruta);
      if (!res.ok) throw new Error(`No se pudo cargar el partial: ${ruta}`);
      marca.outerHTML = await res.text();
    })
  );
}

export async function inyectarIconos(ruta = "assets/iconos/sprite.svg") {
  try {
    const res = await fetch(ruta);
    if (!res.ok) return;
    const molde = document.createElement("div");
    molde.innerHTML = await res.text();
    const sprite = molde.querySelector("svg");
    if (sprite) document.body.prepend(sprite);
  } catch (e) {
    /* Sin sprite el sitio sigue funcionando; solo faltan los iconos. */
  }
}
