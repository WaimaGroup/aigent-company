---
name: "shared-docx-rich"
user-invocable: true
description: >
  Rich Word (.docx) writer built on the npm **`docx`** library — the
  library-backed counterpart of the zero-dependency `shared-office-writer`.
  Use it when a Word deliverable needs formatting that `shared-office-writer`
  cannot do: **embedded images** (logo, screenshots, charts as PNG/JPG),
  **page headers and footers with page numbering**, page breaks, font colors
  and sizes, **styled tables** (shaded header row, zebra striping, column
  widths, per-cell alignment/fill), **landscape sections** for wide tables,
  real Word bullets, paragraph spacing, and a built-in **house style** (legible
  typography, colored headings, themed hyperlinks) applied by default and
  overridable via `theme` — all from a JSON spec. This is a HYBRID skill:
  it installs the `docx` package on first use into a shared, gitignored cache
  (`.context/libs/`) and reuses it; it is NOT zero-dependency and needs `npm`
  available once to bootstrap (bundled or system). **Trigger whenever an agent must
  PRODUCE a Word document with images, headers/footers, page numbers or rich
  styling** — a branded report, a letter with letterhead/logo, a dossier with
  embedded figures. Activation keywords: "Word con logo", "informe con imagen",
  "docx con cabecera", "membrete", "numeración de página", "header/footer en
  Word", "branded report", "Word with embedded image", "letterhead".
  **This is a WRITER only** — it creates new .docx; it does not edit existing
  ones (to read an existing .docx, use a parsing library/MCP). For plain Word
  without images/headers, prefer `shared-office-writer` (deterministic, offline,
  no install). Ships with `docx.cjs` (Node 20+, dependency `docx` bootstrapped
  on demand).
---

# Skill: Word (.docx) rico vía librería `docx`

**Entregable:** un `.docx` con formato que el writer cero-dependencias no alcanza —imágenes embebidas, header/footer con numeración de página, saltos de página, colores y tamaños de fuente, tablas con estilo— generado desde un **spec JSON**. El path resultante se devuelve en el JSON de stdout.

Es la **contraparte con librería** de `shared-office-writer`. Misma filosofía de spec→documento, pero apoyada en la librería npm `docx` para romper el techo de formato. El precio: deja de ser cero-dependencias y necesita `npm` disponible una vez para el bootstrap.

**Archivos de la skill (fuente de verdad):**

```
shared-docx-rich/
├── SKILL.md       ← este archivo (prosa + contrato CLI + spec)
└── docx.cjs       ← script Node 20+ (dependencia `docx`, bootstrap on-demand)
```

El script es **parte del contrato**. La prosa describe lo que hace; si diverge, gana el script y se ajusta la prosa.

**Principio de diseño:** el script es **genérico y bonito por defecto**. Genérico: solo primitivas neutras de documento (heading, paragraph, table, image, sections) — nada de lógica de dominio (no sabe qué es una propuesta, un informe de licitaciones o un contrato; esa composición vive en el spec que emite el caller). Bonito por defecto: todo documento sale con el estilo de casa (tipografía legible, interlineado, headings con color, tablas con cabecera sombreada y bordes finos, pie con paginación) sin que el spec pida nada; `theme` permite desviarse cuando haga falta. Ampliar la skill = añadir primitivas genéricas, nunca plantillas de un caso concreto.

---

## El patrón híbrido (qué la distingue de la v1 cero-deps)

A diferencia de las utility-skills con script cero-dependencias (`shared-office-writer`, `shared-base64`, `shared-pdf-reader`), esta skill **instala una librería npm** y la reutiliza:

- **Caché compartida y gitignored:** `docx` se instala en `.context/libs/node_modules/`. Una sola caché para todas las skills híbridas; vive con los datos del proyecto, fuera de `.aigent/` (no ensucia el código del framework). El script añade `libs/` a `.context/.gitignore` automáticamente: las librerías son grandes y no se commitean, pero se reutilizan en local.
- **Bootstrap on-demand:** el script comprueba si la librería está en la caché; si falta, ejecuta `npm install docx@<pin>` una vez. Las siguientes ejecuciones la reutilizan (`dep_installed_now: false`).
- **npm bundled o del sistema:** el script prefiere un `npm` bundled junto al Node del launcher (`.aigent/IDE/bin/deps/node_modules/npm`) si existe; si no, usa el `npm` del sistema. El campo `installed_via` (`bundled`/`system`) lo indica.
- **No se borra entre usos.** Lo que se limpia son los ficheros temporales (el spec JSON en `.context/.temp/<dept>/`), **nunca** la librería. Reinstalar en cada uso sería desperdiciar 5-15 s de red sin ganar nada.
- **Versión fijada (pin)** en el script (`DEP.version`) para que el resultado sea reproducible. Subir el pin = editar `docx.cjs` y registrarlo.

**Dependencia de entorno:** el launcher `IDE/bin/run` garantiza Node, **no `npm`** (salvo que el runtime bundled conserve npm). Si no hay npm —ni bundled ni del sistema— y la caché está vacía, el script falla limpio con `DEP_UNAVAILABLE` (no rompe a medias). En ese entorno, usar `shared-office-writer` o pre-poblar `.context/libs/`.

---

## Cuándo usar esta skill

- El entregable Word necesita una **imagen embebida**: logo en cabecera, captura, gráfico exportado a PNG/JPG.
- Hace falta **header/footer** con **numeración de página** ("Página X de Y"), o un membrete.
- Se requieren **colores de fuente, tamaños** o **saltos de página** controlados.

**Cuándo NO usar:**

- Word plano (párrafos, headings, tablas simples, hipervínculos) sin imágenes ni cabeceras → **`shared-office-writer`**: determinista, sin red, sin instalar nada. No pagues el coste de una librería si no rompes su techo.
- Hay que **editar un `.docx` existente** → esta skill solo crea ficheros nuevos. La librería `docx` no edita documentos abiertos; usar una librería de parsing/MCP.
- El entorno no tiene `npm` ni red → `shared-office-writer`.
- El entregable es Excel → `shared-office-writer` (xlsx) o una skill xlsx con librería.

---

## Antes de ejecutar (precheck para el agente caller)

1. **Comprobar la dependencia** una vez por sesión antes del primer `build`:

   ```bash
   .aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-docx-rich/docx.cjs deps
   ```

   - `ok: true, installed_now: true` → se instaló ahora (primer uso). Siguientes llamadas: `false`.
   - `ok: false, code: DEP_UNAVAILABLE` → no hay `npm`. No reintentar `build`: caer a `shared-office-writer` o avisar al usuario.

2. Si se quiere fallar rápido sin instalar nada, pasar `--no-install` (devuelve `DEP_MISSING` si la caché está vacía).

`build` también hace el bootstrap por sí mismo; el `deps` previo solo evita un error a mitad de flujo y deja claro el estado.

---

## Formato del spec JSON

```json
{
  "title": "Título (core property)",
  "creator": "Aigent",
  "theme": { "primary": "1F4E79", "secondary": "2E74B5", "baseSize": 11 },
  "header": { "image": { "path": "ruta/logo.png", "format": "png", "width": 70, "height": 35 }, "align": "right", "text": "Membrete opcional" },
  "footer": { "text": "Confidencial", "pageNumbers": true, "align": "center" },
  "sections": [
    { "body": [ "…bloques…" ] },
    { "orientation": "landscape", "body": [ "…tabla ancha…" ] }
  ],
  "body": [
    { "type": "heading", "level": 1, "text": "Título de sección" },
    { "type": "paragraph", "text": "Párrafo simple.", "align": "justify", "spacing": { "before": 6, "after": 10 } },
    { "type": "paragraph", "bullet": true, "runs": [ { "text": "ítem de lista" } ] },
    { "type": "paragraph", "runs": [
      { "text": "normal " },
      { "text": "rojo grande", "bold": true, "color": "C00000", "size": 16 },
      { "text": " y un " },
      { "text": "enlace", "link": "https://ejemplo.com" }
    ]},
    { "type": "image", "path": "ruta/figura.png", "format": "png", "width": 360, "height": 200, "align": "center" },
    { "type": "table", "header": true, "zebra": true, "widths": [2, 5, 1.5],
      "rows": [ ["Col A","Col B","Col C"], ["a1", { "align": "right", "runs": [{ "text": "1.234 €" }] }, "c1"] ] },
    { "type": "pagebreak" }
  ]
}
```

> `sections` y `body` son alternativos: `body` = atajo de una única sección vertical. `sections[]` permite varias secciones, cada una con su `orientation` (`portrait` por defecto | `landscape` — útil para tablas anchas). `header`/`footer` aplican a todas las secciones.

**Estilo de casa (`theme`, opcional):** el documento sale SIEMPRE con un estilo legible por defecto — Calibri 11 pt, interlineado 1,25, espacio tras párrafo, `Heading1` (Calibri Light, color `primary`, regla inferior), `Heading2`/`Heading3` en `secondary`/texto, hipervínculos en `secondary`, header/footer en gris pequeño con regla. Sobreescribible campo a campo: `{ primary, secondary, text, gray, lightGray, zebra, font, headingFont, baseSize (pt), lineSpacing (240=sencillo), paragraphAfter (twips) }`.

**Bloques de `body`:**

- `heading` — `level` 1-6 (estilos `Heading1`..`Heading6`, con el estilo de casa). Acepta `text` o `runs`, y `pageBreakBefore: true`.
- `paragraph` — `text` (atajo, con `bold`/`italic`/`underline`/`color`/`size` a nivel de párrafo) **o** `runs` (control por fragmento). `align`: `left|right|center|justify`. `spacing`: `{ before?, after? }` en **puntos**. `bullet`: `true` o nivel (0,1,…) para viñetas reales de Word. `pageBreakBefore: true` para empezar página.
- `image` — `path` (relativo al cwd) **o** `data` (base64). `format`: `png|jpg|gif|bmp` (si falta, se infiere de la extensión). `width`/`height` en px. `align`.
- `table` — `rows` (matriz). Celda = string, objeto run, array de runs, **o** `{ runs|text, align?, fill? (hex) }` para alinear/sombrear esa celda. Opciones de tabla:
  - `header: true` — primera fila como cabecera: sombreado `theme.primary` (o `headerFill`) con texto blanco en negrita y repetición en cada página.
  - `zebra: true` — filas alternas sombreadas con `theme.zebra`.
  - `firstColumnShaded: true` — primera columna sombreada con etiqueta en negrita color `primary` (estilo "ficha de datos" etiqueta/valor).
  - `widths: [..]` — pesos relativos por columna (se convierten a anchos reales según la orientación de la sección).
  - Siempre: bordes finos `lightGray`, márgenes internos de celda y centrado vertical.
- `pagebreak` — salto de página. También se puede usar string suelto = párrafo.

**Runs** (`paragraph.runs[]` y celdas): `{ "text", "bold"?, "italic"?, "underline"?, "color"? (hex sin #), "size"? (pt), "link"? (URL → hipervínculo externo, azul subrayado por defecto) }`.

**Imágenes en `header`/`footer`:** mismo objeto `image` que en el cuerpo. `footer.pageNumbers: true` añade "Página X de Y".

---

## Contrato CLI

```
.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-docx-rich/docx.cjs <command> [opciones]

command:
  build                    construye un .docx desde un spec JSON.
  deps                     comprueba/instala la dependencia `docx` en la caché.

opciones:
  --spec <path>            Path al spec JSON. Obligatorio en build salvo --stdin.
  --stdin                  Lee el spec JSON desde stdin.
  --output <path>          Obligatorio en build. Ruta del .docx resultante.
  --no-install             No instala la dependencia si falta (falla con DEP_MISSING).
  --help, -h               Ayuda y exit 0.
```

### Output exitoso (stdout, exit `0`)

```json
{ "ok": true, "op": "build", "path": "informes/q2.docx", "bytes": 11939, "blocks": 7, "dep_installed_now": false }
```

```json
{ "ok": true, "op": "deps", "dependency": { "name": "docx", "version": "9.7.1" }, "cache_dir": ".context/libs", "installed_now": false, "installed_via": null }
```

### Output con error (stdout + stderr, exit `1`)

```json
{ "ok": false, "error": { "code": "BAD_SPEC", "message": "Tipo de bloque docx desconocido: 'bogus'" } }
```

### Códigos de error

| Código | Significado |
|---|---|
| `BAD_ARGS` | Comando o argumentos faltantes/mal formados, o argumento desconocido. |
| `SPEC_NOT_FOUND` | El path de `--spec` no existe. |
| `BAD_SPEC_JSON` | El spec no es JSON válido. |
| `BAD_SPEC` | JSON válido pero no cumple el formato (sin `body` ni `sections`, tipo de bloque/imagen no soportado). |
| `IMAGE_NOT_FOUND` | Un bloque `image` con `path` apunta a un fichero inexistente. |
| `DEP_MISSING` | La dependencia no está y `--no-install` impide instalarla. |
| `DEP_UNAVAILABLE` | `npm` no disponible en el entorno; no se puede bootstrappear. |
| `DEP_INSTALL_FAILED` | `npm install` falló (red, permisos, versión inexistente). |
| `INTERNAL` | Cualquier otra excepción no esperada. |

---

## Proceso

1. **(Opcional) `deps`** una vez por sesión para asegurar/instalar la librería y conocer el estado.
2. **Escribir el spec JSON** con `Write` a un `.json` transitorio en `.context/.temp/<dept>/`.
3. **Invocar `build`** con `--spec` y `--output` (este último a la ruta de outputs del dept, fuera de `.aigent/` y `.context/`).
4. **Leer el JSON del stdout** y usar `path` para reportar al usuario.
5. **Limpiar el spec transitorio** (no la caché de librerías).
6. **Si `ok: false`**: `DEP_UNAVAILABLE` → caer a `shared-office-writer`; `BAD_SPEC`/`IMAGE_NOT_FOUND` → corregir el spec.

---

## Limitaciones

- **Solo escribe, no edita** `.docx` existentes.
- **Imágenes**: PNG/JPG/GIF/BMP. SVG no es directo (rasterizar antes a PNG).
- **Gráficos nativos de Word** (charts editables) no están soportados: insertar el gráfico como imagen PNG.
- **Pin de versión**: si la librería publica una versión con breaking change en su API, hay que ajustar `docx.cjs`. El pin protege la reproducibilidad.

---

## Restricciones

- Invocación **siempre** por el launcher `.aigent/IDE/bin/run` — nunca `node` a secas (convención §12.7-bis).
- La dependencia vive en la **caché compartida gitignored** `.context/libs/` — nunca se commitea (el script asegura `libs/` en `.context/.gitignore`).
- `--output` sin restricción de scope, respetando `_shared/output-rules.md` (entregables fuera de `.aigent/` y `.context/`).
- El spec transitorio en `.context/.temp/<dept>/` se borra tras usarse; la caché de librerías **no**.
- Añadir una capacidad (tipo de bloque, opción de run) requiere editar `docx.cjs` y este SKILL.md a la vez.

Aplican las reglas de output de `_shared/output-rules.md`.
