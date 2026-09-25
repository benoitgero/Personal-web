# Página personal — Gerónimo Benoit

Sitio estático, sin frameworks ni build. Se sube tal cual a GitHub Pages.

---

## Estructura

```
Personal-web/
├── index.html                  ← esqueleto: solo el portal y los "huecos" de cada parte
│
├── partials/                   ← los pedazos de HTML
│   ├── header.html             ← barra superior: logo + navegación + switch de idioma
│   ├── footer.html             ← pie: botón CV + redes
│   └── secciones/
│       ├── sobre-mi.html       ← foto + about + rack de skills + carta
│       ├── historias.html      ← panel de historia + columna de pestañas
│       ├── proyectos.html      ← miniaturas + galería + video
│       └── contacto.html       ← texto + formulario
│
├── css/
│   ├── main.css                ← ÚNICO archivo enlazado en el HTML: importa el resto
│   ├── layout.css              ← la grilla de las secciones
│   ├── base/
│   │   ├── variables.css       ← colores, sombras, tipografías, medidas
│   │   ├── base.css            ← reset, body, fondo, accesibilidad
│   │   └── piezas.css          ← .tarjeta .titulo .rotulo .parrafo
│   ├── componentes/
│   │   ├── header.css
│   │   ├── traductor.css       ← switch ES/EN + oculta el chrome de Google
│   │   ├── columnas.css        ← las pestañas y miniaturas (compartido)
│   │   ├── carta-skill.css
│   │   ├── visor.css           ← lightbox
│   │   ├── portal.css          ← pantalla de carga
│   │   ├── pie.css
│   │   └── revelado.css
│   └── secciones/
│       ├── sobre-mi.css
│       ├── rack.css
│       ├── historias.css
│       ├── proyectos.css
│       └── contacto.css
│
├── js/
│   ├── main.js                 ← punto de entrada: enciende todo en orden
│   ├── incluir.js              ← pega los partials y el sprite de iconos
│   ├── componentes/
│   │   ├── portal.js           ← pantalla de carga
│   │   ├── rack.js             ← dibuja los faders
│   │   ├── carta-skill.js      ← carta que se abre al clickear un fader
│   │   ├── historias.js        ← pestañas de historias
│   │   ├── proyectos.js        ← miniaturas, galería y video
│   │   ├── visor.js            ← lightbox de imágenes
│   │   ├── menu.js             ← hamburguesa en móvil
│   │   ├── nav-activa.js       ← resalta la sección visible
│   │   ├── revelado.js         ← fade-in al scrollear (desactivado)
│   │   ├── traductor.js        ← switch ES/EN (widget de Google, oculto)
│   │   ├── formulario.js       ← envío a Formspree sin recargar
│   │   └── contador.js         ← contador de caracteres
│   └── util/
│       ├── teclado.js          ← flechas entre pestañas (compartido)
│       └── contenido.js        ← lee los JSON de contenido/
│
├── contenido/                  ← ★ ACÁ VIVE EL CONTENIDO (lo edita Pages CMS)
│   ├── perfil.json             ← texto y foto de "Sobre mí"
│   ├── skills.json             ← skills, niveles, logos y descripciones
│   ├── historias.json          ← historias: etiqueta, título, imagen, texto
│   └── proyectos.json          ← proyectos: miniatura, galería, texto, video
│
├── .pages.yml                  ← define la interfaz de edición de Pages CMS
│
└── assets/                     ← imágenes, video, logos, CV
    ├── iconos/sprite.svg       ← todos los iconos SVG en un solo archivo
    ├── logos/                  ← logos de las skills
    ├── historias/              ← fotos de las historias
    ├── proyectos/              ← miniaturas, galería, video, poster
    ├── foto.jpg
    └── fondo.svg
```

---

## Cómo edito cada cosa

### Desde la interfaz (recomendado)

Entrá a **[app.pagescms.org](https://app.pagescms.org)** con tu cuenta de GitHub
y abrí este repositorio. Vas a ver cuatro secciones: **Sobre mí**, **Skills**,
**Historias** y **Proyectos**. Desde ahí podés editar textos, subir imágenes,
agregar, borrar y reordenar ítems.

Cada vez que guardás, Pages CMS hace un commit y GitHub Pages republica solo
en uno o dos minutos. El sitio sigue siendo 100% estático.

La primera vez: iniciá sesión, instalá la GitHub App de Pages CMS **solo en
este repositorio** y abrilo. La configuración ya está en `.pages.yml`.

### A mano

Todo el contenido editable vive en `contenido/`, en JSON:

| Quiero cambiar… | Archivo |
|---|---|
| Texto y foto de "Sobre mí" | `contenido/perfil.json` |
| Skills: nombre, nivel, logo, descripción | `contenido/skills.json` |
| Historias: etiqueta, título, imagen, texto | `contenido/historias.json` |
| Proyectos: miniatura, galería, texto, video | `contenido/proyectos.json` |
| Qué campos muestra la interfaz de edición | `.pages.yml` |
| Colores, sombras, tipografía | `css/base/variables.css` |
| Links de redes o CV | `partials/footer.html` |
| El resumen para crawlers sin JavaScript | bloque `RESUMEN ESTÁTICO` en `index.html` |

En los textos, **una línea en blanco separa párrafos**.

El orden de cada lista es el orden en pantalla.

> **Ojo con el resumen estático.** El bloque `RESUMEN ESTÁTICO` de `index.html`
> es lo que leen las IAs y herramientas de reclutamiento que no ejecutan
> JavaScript. No se actualiza solo desde el CMS: si cambiás de trabajo o sumás
> algo importante, actualizalo también ahí.

### Agregar un ícono

En `assets/iconos/sprite.svg`, copiá un `<symbol>`, cambiale el `id` y el `path`.
Después usalo donde quieras con:

```html
<svg viewBox="0 0 24 24"><use href="#icono-tu-nombre"/></svg>
```

---

## Probar en local

Los partials y los `.json` de contenido se cargan con `fetch`, así que **no funciona abriendo
`index.html` con doble clic** (`file://` los bloquea). Necesitás un servidor:

- **VS Code**: extensión *Live Server* → clic derecho en `index.html` → "Open with Live Server".
- **Python**: `python -m http.server 8000` en la carpeta del proyecto → abrir `http://localhost:8000`.
- **Node**: `npx serve`

En GitHub Pages funciona directo, porque ya sirve por HTTP.

---

## Notas técnicas

- Todas las rutas son **relativas**, así que anda igual en `usuario.github.io/Personal-web/`
  que en la raíz de un dominio propio.
- El JS usa **módulos ES** (`<script type="module">`). Soportado por todos los
  navegadores modernos.
- El bloque del **portal** vive en `index.html` y no en un partial a propósito:
  tiene que pintarse en el primer frame, antes de que se carguen los partials.
- El **CSS mantiene el orden de cascada original**, incluidos los `!important`
  del panel de historias. Si agregás un componente, sumá su `@import` en
  `css/main.css` en el lugar que corresponda.

---

## Traducción ES/EN

Switch en el header que traduce la página con el widget de Google.

| Archivo | Rol |
|---|---|
| `js/componentes/traductor.js` | Toda la lógica |
| `css/componentes/traductor.css` | Estilo del switch + oculta lo que inyecta Google |
| `partials/header.html` | El switch `<button class="idioma" role="switch">` |

Los tres nombres van apareados: el HTML usa `class="idioma"` con `role="switch"`,
el CSS estiliza `.idioma`, y el JS busca `.idioma` y escribe `aria-checked`.
Si uno queda desalineado, el switch se dibuja pero no responde.

**No funciona en localhost**: Google exige una URL pública. Probalo en GitHub Pages.

`montarTraductor()` va último en `main.js` a propósito: para ese momento los
partials, las historias y los proyectos ya están en el DOM, así que el widget
encuentra la página completa en su primera pasada.

Para cambiar el idioma destino, tocá `ORIGEN` / `DESTINO` arriba de `traductor.js`.
Para excluir algo de la traducción, ponele `translate="no"`.

El widget está deprecado desde 2019 y sigue funcionando, pero es un servicio
externo: si deja de responder, el switch no hace nada y el sitio queda intacto.
Tampoco sirve para SEO: la traducción pasa en el navegador del visitante y no
genera URLs indexables en inglés.
