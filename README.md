# Página personal — Gerónimo Benoit

Sitio estático, sin frameworks ni build. Se sube tal cual a GitHub Pages.

---

## Estructura

```
Personal-web/
├── index.html                  ← esqueleto: solo el portal y los "huecos" de cada parte
│
├── partials/                   ← los pedazos de HTML
│   ├── header.html             ← barra superior: logo + navegación
│   ├── footer.html             ← pie: botón CV + redes
│   └── secciones/
│       ├── sobre-mi.html       ← foto + about + rack de skills + carta
│       ├── historias.html      ← panel de historia + columna de pestañas
│       ├── proyectos.html      ← miniaturas + galería + video
│       ├── banda.html          ← la franja de imagen
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
│       ├── banda.css
│       └── contacto.css
│
├── js/
│   ├── main.js                 ← punto de entrada: enciende todo en orden
│   ├── incluir.js              ← pega los partials y el sprite de iconos
│   ├── componentes/
│   │   ├── portal.js           ← verificación anti-bot
│   │   ├── rack.js             ← dibuja los faders
│   │   ├── carta-skill.js      ← carta que se abre al clickear un fader
│   │   ├── historias.js        ← pestañas de historias
│   │   ├── proyectos.js        ← miniaturas, galería y video
│   │   ├── visor.js            ← lightbox de imágenes
│   │   ├── menu.js             ← hamburguesa en móvil
│   │   ├── nav-activa.js       ← resalta la sección visible
│   │   ├── revelado.js         ← fade-in al scrollear (desactivado)
│   │   ├── formulario.js       ← envío a Formspree sin recargar
│   │   └── contador.js         ← contador de caracteres
│   └── util/
│       ├── teclado.js          ← flechas entre pestañas (compartido)
│       └── texto.js            ← lee los .txt de contenido/
│
├── contenido/                  ← ★ ACÁ EDITÁS EL SITIO, sin tocar lógica
│   ├── skills.js               ← lista de skills, niveles y descripciones
│   ├── historias.js            ← qué historias hay (pestaña, título, imagen)
│   ├── proyectos.js            ← qué proyectos hay (miniatura, video, galería)
│   └── textos/
│       ├── historias/          ← un .txt por historia: forge.txt, ces.txt…
│       └── proyectos/          ← un .txt por proyecto: rocha.txt…
│
└── assets/                     ← imágenes, video, logos, CV
    ├── iconos/sprite.svg       ← todos los iconos SVG en un solo archivo
    ├── logos/                  ← logos de las skills
    ├── historias/              ← fotos de las historias
    ├── proyectos/              ← miniaturas, galería, video, poster
    ├── foto.jpg
    ├── banda.jpg
    └── fondo.svg
```

---

## Cómo edito cada cosa

| Quiero cambiar… | Voy a… |
|---|---|
| El texto de una historia | `contenido/textos/historias/<id>.txt` |
| La descripción de un proyecto | `contenido/textos/proyectos/<id>.txt` |
| Agregar / sacar una historia | `contenido/historias.js` + crear su `.txt` |
| Agregar / sacar un proyecto | `contenido/proyectos.js` + crear su `.txt` |
| Un nivel de skill o su descripción | `contenido/skills.js` |
| Colores, sombras, tipografía | `css/base/variables.css` |
| El texto de "About me" | `partials/secciones/sobre-mi.html` |
| Links de redes o CV | `partials/footer.html` |
| Un ícono | `assets/iconos/sprite.svg` |
| El menú de navegación | `partials/header.html` |

### Agregar una historia, paso a paso

1. En `contenido/historias.js`, copiá una línea:
   ```js
   { id: "nueva", tab: "Nueva", titulo: "Mi historia nueva", imagen: "assets/historias/nueva.jpg" },
   ```
2. Creá `contenido/textos/historias/nueva.txt` y escribí el texto ahí.
3. Poné la foto en `assets/historias/nueva.jpg`.

Listo. No hay que tocar HTML ni JS.

### Agregar un ícono

En `assets/iconos/sprite.svg`, copiá un `<symbol>`, cambiale el `id` y el `path`.
Después usalo donde quieras con:

```html
<svg viewBox="0 0 24 24"><use href="#icono-tu-nombre"/></svg>
```

---

## Probar en local

Los partials y los `.txt` se cargan con `fetch`, así que **no funciona abriendo
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

Botón en el header que traduce la página con el widget de Google.

| Archivo | Rol |
|---|---|
| `js/componentes/traductor.js` | Toda la lógica |
| `css/componentes/traductor.css` | Estilo del botón + oculta lo que inyecta Google |
| `partials/header.html` | El `<button class="idioma-btn">` |

**No funciona en localhost**: Google exige una URL pública. Probalo en GitHub Pages.

Para cambiar el idioma destino, tocá `ORIGEN` / `DESTINO` arriba de `traductor.js`.
Para excluir algo de la traducción, ponele `translate="no"`.

El widget está deprecado desde 2019 y sigue funcionando, pero es un servicio
externo: si deja de responder, el botón no hace nada y el sitio queda intacto.
