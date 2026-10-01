# Panel de administración

Worker privado de Cloudflare para editar el contenido del sitio sin tocar código.

```
Panel (este Worker) ──guardar──▶ MongoDB Atlas (borrador)
        │
        └──publicar──▶ commit en GitHub ──▶ Cloudflare redespliega el sitio público
```

- **Guardar**: deja el cambio en Mongo. El sitio público no cambia.
- **Vista previa**: muestra el sitio armado con el borrador (`/vista/`).
- **Publicar**: un solo commit con los JSON de `contenido/`, el resumen de `index.html` y las imágenes nuevas.

El sitio público nunca consulta la base: sigue leyendo `contenido/*.json`.

## Configuración en Cloudflare

| Qué | Dónde | Valor |
|---|---|---|
| Proyecto | Workers & Pages → Import a repository | repo `Personal-web`, **Root directory: `admin`** |
| `MONGODB_URI` | Settings → Variables and Secrets (tipo **Secret**) | cadena de Atlas del usuario `portfolio-api` |
| `GITHUB_TOKEN` | ídem | token fine-grained: solo `Personal-web`, Contents R/W |
| `ADMIN_EMAIL` | ídem | el email con el que entrás (varios: separados por coma) |
| Acceso | Cloudflare Access sobre este Worker | política: solo tu email |

Sin Cloudflare Access el panel responde 403 a todo.

## Mantenimiento

- **Token de GitHub**: vence al año. Creá uno nuevo con los mismos permisos y reemplazá el secreto.
- **Atlas**: el Worker hace una consulta mínima cada lunes para que el cluster gratis no se pause.
- **Si editás `contenido/*.json` a mano en el repo**: en el panel, "Reimportar desde GitHub". Si no lo hacés, la próxima publicación pisa esos cambios.
- **Videos**: no se suben por el panel (pesan demasiado). Subilos al repo y poné la ruta en el campo "Video".

## Probar en tu PC (opcional)

```
cd admin
npm install
```

Creá `admin/.dev.vars` (ya está en `.gitignore`) con los tres secretos y corré `npx wrangler dev`.
