---
name: "shared-office-writer"
user-invocable: true
description: >
  Zero-dependency writer for Office documents: build minimal-but-valid **.docx**
  (Word) and **.xlsx** (Excel) files from a JSON spec, with no external packages.
  A .docx/.xlsx is just an OPC package (a ZIP of XML parts) and Node's stdlib
  `zlib` is enough to assemble it. **Trigger this skill whenever an agent needs to
  PRODUCE a Word or Excel file as a deliverable** — a report, memo, letter, table
  export, budget, summary, data dump, or any tabular/textual document the user will
  open in Microsoft Office or LibreOffice. Supported (scope "Práctico"): docx with
  paragraphs, headings (H1-H6), bold/italic/underline, and simple bordered tables;
  xlsx with multiple sheets, text/number/boolean/date cells, formulas, column
  widths, and a bold header row. Activation keywords: "Word document", "docx",
  "Excel", "xlsx", "spreadsheet", "export to Excel", "generate a report as docx",
  "tabla a Excel", "informe en Word", "hoja de cálculo", "budget", "data export".
  **This is a WRITER only** — it creates new files; it does not read or edit
  existing .docx/.xlsx (use a dedicated MCP or library for that). Ships with
  `office.cjs` (Node 18+, no dependencies).
---

# Skill: Office writer (.docx / .xlsx) sin dependencias

**Entregable:** un fichero `.docx` o `.xlsx` válido, generado en la ruta de outputs del depto a partir de un **spec JSON**. Sin dependencias externas: un documento OOXML es un ZIP de partes XML, y el script lo construye con `zlib` de stdlib. El path resultante se devuelve en el JSON de stdout.

**Archivos de la skill (fuente de verdad):**

```
shared-office-writer/
├── SKILL.md       ← este archivo (prosa + contrato CLI + formato del spec)
└── office.cjs     ← script Node 18+ sin dependencias (subcomandos docx | xlsx)
```

El script es **parte del contrato**. La prosa describe lo que hace; si diverge, gana el script y se ajusta la prosa.

---

## Cuándo usar esta skill

- Un agente necesita **producir** un entregable Word o Excel: informe, memo, carta, export tabular, presupuesto, resumen de datos.
- El destino es un fichero que el usuario abrirá en Microsoft Office o LibreOffice.
- No hay un MCP de Office/Google disponible, o se quiere generación **determinista y sin red**.

**Cuándo NO usar:**

- Hay que **leer o editar** un `.docx`/`.xlsx` existente → esta skill solo escribe ficheros nuevos. Usar un MCP dedicado o una librería de parsing.
- Se necesita formato rico fuera del alcance (imágenes, gráficos, headers/footers, TOC, colores de celda, merges, bordes a medida) → ver "Limitaciones". Valorar un MCP o ampliar el script de forma deliberada.
- El entregable es texto plano o Markdown → usar `Write` directamente.

---

## Alcance soportado ("Práctico")

**docx:**

- Párrafos (texto plano o *runs* con `bold` / `italic` / `underline`).
- Encabezados nivel 1-6 (estilos `Heading1`..`Heading6`).
- Tablas simples con bordes; fila de cabecera opcional en negrita.

**xlsx:**

- Varias hojas (`sheets`); nombres saneados a las reglas de Excel (≤31 chars, sin `\ / ? * [ ] :`, sin duplicados).
- Celdas tipo texto, número, booleano y **fecha** (con formato `yyyy-mm-dd`).
- **Fórmulas** (se escribe la fórmula y un valor cacheado opcional; Excel/LibreOffice recalcula al abrir).
- Ancho de columna y fila de cabecera en negrita.

---

## Formato del spec JSON

### docx

```json
{
  "title": "Título opcional (core property)",
  "body": [
    { "type": "heading", "level": 1, "text": "Mi título" },
    { "type": "paragraph", "text": "Párrafo simple." },
    { "type": "paragraph", "runs": [
      { "text": "normal " },
      { "text": "negrita", "bold": true },
      { "text": " y ", "italic": false },
      { "text": "cursiva", "italic": true }
    ]},
    { "type": "table", "header": true, "rows": [
      ["Col A", "Col B"],
      ["a1", "b1"]
    ]}
  ]
}
```

- Un string suelto en `body` equivale a `{ "type": "paragraph", "text": "..." }`.
- `paragraph` admite `text` (atajo, con `bold`/`italic`/`underline` a nivel de párrafo) **o** `runs` (control por fragmento).
- `table.rows` es una matriz de filas; cada fila es una lista de celdas (strings). `header: true` pone la primera fila en negrita.

### xlsx

```json
{
  "title": "Título opcional",
  "sheets": [
    {
      "name": "Resumen",
      "header": true,
      "columns": [ { "width": 22 }, { "width": 12 } ],
      "rows": [
        ["Concepto", "Importe"],
        ["Alpha", { "type": "number", "value": 1250.5 }],
        ["Fecha", { "type": "date", "value": "2026-06-01" }],
        ["Activo", { "type": "bool", "value": true }],
        ["Total", { "type": "formula", "formula": "SUM(B2:B2)", "value": 1250.5 }]
      ]
    }
  ]
}
```

- Atajo de una sola hoja: spec con `rows` (y opcional `name`/`header`/`columns`) en la raíz, sin `sheets`.
- Una celda puede ser un **primitivo** (string → texto, number → número, boolean → bool) o un **objeto** `{ "type": "...", "value": ... }` con `type` ∈ `text|number|bool|date|formula`.
- `date.value` admite cualquier cosa parseable por `new Date(...)` (ISO `"2026-06-01"` recomendado). Se almacena como número de serie de Excel con formato `yyyy-mm-dd`.
- `formula.formula` es la fórmula sin `=` inicial (se acepta con o sin él); `value` es el valor cacheado opcional.
- `header: true` pone la primera fila en negrita.

---

## Proceso

1. **Escribir el spec JSON** con `Write` (a un `.json` transitorio en `.context/.temp/<dept>/` o donde convenga).
2. **Invocar `office.cjs`** desde la raíz del repo:

   ```bash
   node .aigent/departments/_shared/skills/shared-office-writer/office.cjs docx \
     --spec .context/.temp/<dept>/<purpose>-<TS>.json \
     --output <ruta-de-outputs-del-depto>/<nombre>.docx
   ```

   Para Excel, `xlsx` en lugar de `docx` y `.xlsx` en el output. Alternativa sin fichero: `--stdin` (el spec por pipe).

3. **Leer el JSON del stdout** y usar `path` para el siguiente paso o para reportar al usuario.
4. **Si falla** (`ok: false`), leer `error.code` (ver tabla) y corregir el spec.

---

## Contrato CLI

```
node .aigent/departments/_shared/skills/shared-office-writer/office.cjs <command> [opciones]

command:
  docx                     construye un .docx desde un spec JSON.
  xlsx                     construye un .xlsx desde un spec JSON.

opciones:
  --spec <path>            Path al spec JSON. Obligatorio salvo --stdin.
  --stdin                  Lee el spec JSON desde stdin en vez de --spec.
  --output <path>          Obligatorio. Ruta del fichero resultante. Sin restricción de scope.
  --help, -h               Imprime ayuda y sale con exit 0.
```

### Output exitoso (stdout, exit `0`)

docx:

```json
{ "ok": true, "op": "docx", "path": "informes/q2.docx", "bytes": 2625, "blocks": 5 }
```

xlsx:

```json
{ "ok": true, "op": "xlsx", "path": "informes/ventas.xlsx", "bytes": 3076, "sheets": 2, "rows": 6 }
```

### Output con error (stdout + stderr, exit `1`)

```json
{ "ok": false, "error": { "code": "BAD_SPEC", "message": "Unknown docx block type: 'bogus'" } }
```

### Códigos de error

| Código | Significado |
|---|---|
| `BAD_ARGS` | Comando o argumentos faltantes/mal formados, o argumento desconocido. |
| `SPEC_NOT_FOUND` | El path de `--spec` no existe. |
| `BAD_SPEC_JSON` | El spec no es JSON válido. |
| `BAD_SPEC` | El spec es JSON válido pero no cumple el formato (falta `body`/`sheets`/`rows`, tipo de bloque o celda no soportado, fecha inválida). |
| `WRITE_FAILED` | Error al crear directorios o escribir el fichero. |
| `INTERNAL` | Cualquier otra excepción no esperada. |

---

## Limitaciones (importante)

- **Solo escribe, no lee ni edita.** No abre ficheros existentes ni hace merge. Para eso, MCP o librería de parsing.
- **Techo de formato fijo (alcance "Práctico").** Fuera de alcance en docx: imágenes, headers/footers de página, TOC, footnotes, comentarios, control de cambios, listas numeradas/viñetas avanzadas. Fuera de alcance en xlsx: colores de celda, bordes a medida, merges, gráficos, pivots, formato condicional, validación de datos, paneles congelados. Añadirlos = ampliar `office.cjs` y este SKILL.md de forma deliberada (cuestionar antes si compensa frente a un MCP).
- **Fórmulas sin motor de cálculo.** Se escribe la fórmula y un valor cacheado opcional; el recálculo lo hace Excel/LibreOffice al abrir. Un lector programático que no recalcule verá el cacheado (o nada si no se aportó).
- **OOXML estricto.** El escape XML y la estructura OPC se generan a mano; cualquier ampliación debe mantener el paquete válido (verificar abriendo el resultado).

---

## Restricciones

- El script **no usa dependencias externas**: solo Node stdlib (`fs`, `path`, `zlib`). Compatible con Node 18+.
- `--output` no tiene restricción de scope: lo decide el agente caller, respetando `_shared/output-rules.md` (los entregables van fuera de `.aigent/` y `.context/`).
- El spec transitorio en `.context/.temp/<dept>/` se borra tras usarse (regla de output-rules); el entregable `.docx`/`.xlsx` va a la ruta de outputs del proyecto.
- Añadir una capacidad nueva (tipo de bloque, tipo de celda, formato) requiere editar `office.cjs` y este SKILL.md a la vez.

Aplican las reglas de output de `_shared/output-rules.md`.
