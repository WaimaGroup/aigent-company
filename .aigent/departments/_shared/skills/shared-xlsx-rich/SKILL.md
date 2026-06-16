---
name: "shared-xlsx-rich"
user-invocable: true
description: >
  Rich Excel (.xlsx) writer built on the npm **`exceljs`** library — the
  library-backed counterpart of the zero-dependency `shared-office-writer`.
  Use it when an Excel deliverable needs formatting that `shared-office-writer`
  cannot do: **cell background colors (fills)**, **merged cells**, custom
  **borders**, **frozen panes**, number formats, and **embedded images** — all
  from a JSON spec. This is a HYBRID skill (tipo Híbrido): it installs `exceljs`
  on first use into the shared cache `.context/libs/` via the shared bootstrap
  `.aigent/IDE/bin/lib-bootstrap.cjs`, and reuses it; it is NOT zero-dependency
  and needs `npm` once (bundled or system). **Trigger whenever an agent must
  PRODUCE an Excel file with colors, merges, frozen headers, borders or images**
  — a styled dashboard, a budget with colored totals, a branded data export.
  Activation keywords: "Excel con colores", "celdas combinadas", "merge cells",
  "inmovilizar paneles", "freeze panes", "xlsx con formato", "tabla con estilos
  en Excel", "presupuesto con colores", "Excel con logo". **WRITER only** — does
  not edit existing .xlsx. For plain spreadsheets (text/number/date/formula, bold
  header, column widths) without colors/merges, prefer `shared-office-writer`
  (tipo Local: determinista, offline, sin instalar). Ships with `xlsx.cjs`
  (Node 20+, dependency `exceljs` via lib-bootstrap).
---

# Skill: Excel (.xlsx) rico vía librería `exceljs`

**Entregable:** un `.xlsx` con formato que el writer cero-dependencias no alcanza —fills de color, celdas combinadas, bordes, paneles congelados, formatos numéricos, imágenes embebidas— desde un **spec JSON**. El path resultante se devuelve en el JSON de stdout.

Es la **contraparte con librería** (tipo **Híbrido**) de `shared-office-writer` (tipo **Local**, cero-deps). Misma filosofía spec→documento; apoyada en `exceljs` para romper el techo de formato.

**Archivos de la skill (fuente de verdad):**

```
shared-xlsx-rich/
├── SKILL.md       ← este archivo (prosa + contrato CLI + spec)
└── xlsx.cjs       ← script Node 20+ (dependencia `exceljs` vía lib-bootstrap)
```

El script es **parte del contrato**. Si la prosa diverge del script, gana el script.

**Principio de diseño (espejo de `shared-docx-rich`):** el script es **genérico y bonito por defecto**. Genérico: solo primitivas neutras (hojas, filas, celdas, merges, imágenes) — nada de lógica de dominio (la composición vive en el spec que emite el caller). Bonito por defecto: con `header: true` la hoja sale ya con cabecera sombreada (`theme.primary`, texto blanco negrita) e **inmovilizada**, **autofiltro**, **bordes finos** y **anchos de columna automáticos** sin pedir nada; `theme` permite desviarse. Ampliar la skill = añadir primitivas genéricas, nunca plantillas de un caso concreto.

---

## El patrón híbrido (compartido con docx-rich y pdf-toolkit)

La dependencia se obtiene **siempre** por el helper único `.aigent/IDE/bin/lib-bootstrap.cjs` (convención §16):

- **Caché compartida y gitignored:** `exceljs` se instala en `.context/libs/node_modules/` — la misma caché que `docx` y `pdf-lib`. Fuera de `.aigent/`; el helper asegura `libs/` en `.context/.gitignore`.
- **Bootstrap on-demand:** primera ejecución instala; las siguientes reutilizan (`dep_installed_now: false`).
- **npm bundled o del sistema:** el helper prefiere el npm bundled junto al Node del launcher; si no, el del sistema (`installed_via`).
- **Versión fijada** (`DEP.version` en `xlsx.cjs`) → reproducibilidad.
- **Sin npm** (ni bundled ni del sistema) y caché vacía → `DEP_UNAVAILABLE` limpio → caer a `shared-office-writer`.

---

## Cuándo usar esta skill

- El Excel necesita **colores de celda** (fills), **celdas combinadas**, **bordes** a medida, **paneles congelados** o **imágenes** embebidas.
- Un dashboard, un presupuesto con totales resaltados, un export con cabecera de color y logo.
- Quieres un export tabular que salga **presentable sin esfuerzo** (cabecera de color, freeze, autofiltro, zebra) — basta `header: true`.

**Cuándo NO usar:**

- Excel plano (texto/número/fecha/fórmula, cabecera en negrita, anchos) sin colores ni merges → **`shared-office-writer`** (Local, determinista, sin red, sin instalar).
- Editar un `.xlsx` existente → esta skill solo crea nuevos.
- Sin `npm` ni red → `shared-office-writer`.
- Documento Word/PDF → `shared-docx-rich` / `shared-pdf-toolkit`.

---

## Antes de ejecutar (precheck para el agente caller)

Una vez por sesión antes del primer `build`:

```bash
.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-xlsx-rich/xlsx.cjs deps
```

`ok: false, code: DEP_UNAVAILABLE` → no hay npm: no reintentar, caer a `shared-office-writer`.

---

## Formato del spec JSON

```json
{
  "title": "Presupuesto", "creator": "Aigent",
  "theme": { "primary": "1F4E79", "zebra": "EDF3F9", "baseSize": 11 },
  "sheets": [
    {
      "name": "Resumen",
      "header": true,
      "zebra": true,
      "rows": [
        [ "Concepto", "Importe" ],
        [ "Alpha", { "value": 1250.5, "numFmt": "#,##0.00 €", "align": "right" } ],
        [ { "value": "TOTAL", "bold": true, "fill": "FFF2CC" }, { "formula": "SUM(B2:B2)", "value": 1250.5, "numFmt": "#,##0.00 €", "bold": true } ]
      ],
      "merges": [ "A4:B4" ],
      "image": { "path": "logo.png", "format": "png", "range": "D1:E3" }
    }
  ]
}
```

> Con `header: true` la primera fila **no necesita** estilar a mano: sale sombreada con `theme.primary`, texto blanco en negrita, inmovilizada y con autofiltro. Las demás filas reciben bordes finos y, si `zebra: true`, relleno alterno. Los anchos se autoajustan al contenido (salvo `columns[].width`). En el ejemplo solo se estiló lo que se desvía del default (la fila TOTAL).

- Atajo de una hoja: `rows` (+ opcional `name`/`header`/`zebra`/`columns`/`freeze`/`merges`/`image`) en la raíz, sin `sheets`.
- **Estilo de casa (`theme`, opcional):** sobreescribible campo a campo — `{ primary, secondary, text, gray, lightGray, zebra, headerText, font, baseSize (pt) }`. Mismos nombres que `shared-docx-rich`.
- **Celda** = primitivo (string/number/bool) **o** objeto `{ value, type?, formula?, bold, italic, color, fill, size, numFmt, align, wrap, border }`.
  - `type: "date"` con `value` parseable por `new Date(...)` → fecha (formato `yyyy-mm-dd` salvo `numFmt`).
  - `formula` sin `=` inicial; `value` es el valor cacheado opcional.
  - `color` = color de fuente (hex sin `#`); `fill` = color de fondo (hex, prevalece sobre zebra); `align` = `left|center|right`; `wrap: true` = ajuste de texto. `numFmt` para formato numérico/€/fecha (no se fuerza ninguno por defecto, para no alterar años/IDs). `border: true` se mantiene por compatibilidad (los bordes ya van por defecto).
- **Hoja**: `name` (saneado a reglas Excel: ≤31 chars, sin `\ / ? * [ ] :`), `header: true` (cabecera de casa + freeze + autofiltro), `zebra: true` (filas alternas), `borders: false` (desactiva los bordes por defecto), `columns[].width` (ancho fijo; si se omite, automático), `freeze: { rows, cols }` (sobreescribe el freeze automático de cabecera), `merges: [ "A1:C1", ... ]`, `image: { path|data, format, range }`.

---

## Contrato CLI

```
.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-xlsx-rich/xlsx.cjs <command> [opciones]

command:
  build                    construye un .xlsx desde un spec JSON.
  deps                     comprueba/instala `exceljs` en la caché compartida.

opciones:
  --spec <path>            Path al spec JSON. Obligatorio en build salvo --stdin.
  --stdin                  Lee el spec JSON desde stdin.
  --output <path>          Obligatorio en build. Ruta del .xlsx resultante.
  --no-install             No instala la dependencia si falta (DEP_MISSING).
  --help, -h               Ayuda y exit 0.
```

### Output exitoso (stdout, exit `0`)

```json
{ "ok": true, "op": "build", "path": "presupuesto.xlsx", "sheets": 1, "rows": 5, "dep_installed_now": false }
{ "ok": true, "op": "deps", "dependency": { "name": "exceljs", "version": "4.4.0" }, "cache_dir": ".context/libs", "installed_now": false, "installed_via": null }
```

### Códigos de error (stdout + stderr, exit `1`)

| Código | Significado |
|---|---|
| `BAD_ARGS` | Comando/argumentos faltantes o mal formados, o argumento desconocido. |
| `SPEC_NOT_FOUND` | El path de `--spec` no existe. |
| `BAD_SPEC_JSON` | El spec no es JSON válido. |
| `BAD_SPEC` | JSON válido pero no cumple el formato (sin `sheets`/`rows`, merge inválido, imagen sin `path`/`data`). |
| `IMAGE_NOT_FOUND` | Un `image` con `path` apunta a un fichero inexistente. |
| `BOOTSTRAP_NOT_FOUND` | No se encontró `lib-bootstrap.cjs` (cwd ≠ raíz del proyecto). |
| `DEP_MISSING` / `DEP_UNAVAILABLE` / `DEP_INSTALL_FAILED` | Dependencia: ver convención §16 (emitidos por el helper). |
| `INTERNAL` | Cualquier otra excepción no esperada. |

---

## Proceso

1. **(Opcional) `deps`** una vez por sesión.
2. **Escribir el spec JSON** con `Write` en `.context/.temp/<dept>/`.
3. **Invocar `build`** con `--spec` y `--output` (a la ruta de outputs del dept, fuera de `.aigent/` y `.context/`).
4. **Leer el JSON del stdout** y reportar el `path`.
5. **Limpiar el spec transitorio** (no la caché de librerías).
6. **Si `ok: false`**: `DEP_UNAVAILABLE` → `shared-office-writer`; `BAD_SPEC`/`IMAGE_NOT_FOUND` → corregir el spec.

---

## Limitaciones

- **Solo escribe, no edita** `.xlsx` existentes.
- **Imágenes**: PNG/JPG/GIF. SVG no directo (rasterizar a PNG antes).
- **Gráficos nativos** (charts) no soportados por esta versión (exceljs los soporta de forma limitada; añadir como capacidad deliberada si se necesita).
- **Pin de versión**: un breaking change de `exceljs` obliga a ajustar `xlsx.cjs`.

---

## Restricciones

- Invocación **siempre** por el launcher `.aigent/IDE/bin/run` — nunca `node` a secas (§12.7-bis).
- La dependencia se obtiene **solo** por `lib-bootstrap.cjs`; no se duplica el bootstrap (§16).
- Caché en `.context/libs/` (gitignored); el script no la borra entre usos.
- `--output` sin restricción de scope, respetando `_shared/output-rules.md`.
- Añadir una capacidad (tipo de celda, estilo, gráfico) requiere editar `xlsx.cjs` y este SKILL.md a la vez.

Aplican las reglas de output de `_shared/output-rules.md`.
