---
name: "shared-pdf-reader"
user-invocable: true
description: >
  Zero-dependency reader for **PDF** files: extract text, metadata and page
  counts, or search a term — with no external packages. A PDF is a graph of
  indirect objects whose content streams are normally FlateDecode-compressed,
  and Node's stdlib `zlib` is enough to inflate them. **Trigger this skill
  whenever an agent needs to READ or EXTRACT content from a .pdf** — read a
  tender/pliego, pull text from a contract or invoice, count pages, grab the
  Title/Author, or find where a clause appears. Commands: `text` (per page or
  joined, with a `--pages` range), `meta` (Info dict + page count), `count`
  (page count only), `search` (term → matching pages with snippets), `fonts`
  (per-page font diagnostics). Handles classic xref, cross-reference streams,
  object streams (ObjStm), FlateDecode / LZW / ASCIIHex / ASCII85 filters,
  WinAnsi/Latin1 text and Type0/CID fonts — via `/ToUnicode` when present, and
  via the embedded TrueType `cmap` (CIDFontType2 + FontFile2) when it is not
  (covers iText / Spanish PLACSP tenders). Activation keywords: "read PDF", "extract text from PDF",
  "leer un PDF", "extraer texto", "pliego", "PPT.pdf", "contrato en PDF",
  "cuántas páginas", "buscar en el PDF", "metadatos del PDF". **This is a READER
  only** — it does not create or edit PDFs (for writing .docx/.xlsx use
  `shared-office-writer`). Ships with `pdf.cjs` (Node 18+, no dependencies).
---

# Skill: PDF reader (text / meta / count / search) sin dependencias

**Entregable:** el contenido textual de un PDF, devuelto como **JSON por stdout** (o texto plano con `--raw`, o volcado a un fichero con `--out`). Sin dependencias externas: el contenido de un PDF vive en streams normalmente comprimidos con FlateDecode, y el script los descomprime con `zlib` de stdlib. Es la **contraparte lectora** de `shared-office-writer` (que solo escribe `.docx`/`.xlsx`).

**Archivos de la skill (fuente de verdad):**

```
shared-pdf-reader/
├── SKILL.md       ← este archivo (prosa + contrato CLI + formato de salida)
└── pdf.cjs        ← script Node 18+ sin dependencias (comandos text | meta | count | search)
```

El script es **parte del contrato**. La prosa describe lo que hace; si diverge, gana el script y se ajusta la prosa.

---

## Cuándo usar esta skill

- Un agente necesita **leer texto de un PDF**: un pliego de licitación, un contrato, una factura, un informe recibido.
- Hace falta saber **cuántas páginas** tiene un PDF o sus **metadatos** (título, autor, fechas) antes de decidir cómo procesarlo.
- Hay que **localizar un término o cláusula** dentro de un PDF y saber en qué página aparece.
- Se quiere extracción **determinista y sin red**, sin instalar `pdfplumber`, `pdf-parse` ni ningún paquete.

**Cuándo NO usar:**

- Hay que **crear o editar** un `.pdf` (rellenar formularios, fusionar, partir, rasterizar) → esta skill solo lee texto/metadatos. Usar un MCP dedicado o una librería de manipulación.
- El PDF es **escaneado / solo imagen** → no hay texto que extraer sin **OCR**, que esta skill no hace (devuelve `NO_TEXT`). Usar un MCP/servicio de OCR.
- El PDF está **cifrado con contraseña** → la skill lo detecta (`ENCRYPTED`) pero no descifra. Usar una herramienta que acepte la password.
- El entregable es **producir** un Word/Excel → usar `shared-office-writer`.

---

## Alcance soportado

**Estructura del PDF (robusta):**

- Indexado de objetos por **escaneo bruto** de `N G obj` — no depende de que el xref esté intacto.
- **Object streams** (`/Type /ObjStm`) descomprimidos para recuperar el árbol de páginas (PDF 1.5+).
- Trailer clásico y **cross-reference streams** (`/Type /XRef`) para localizar `/Root` e `/Info`.
- Recorrido del **page tree** (`/Pages` → `/Kids` → `/Page`) con herencia de `/Resources`. Fallbacks en cascada si el árbol no resuelve.
- **Form XObjects**: el operador `Do` se sigue **recursivamente** hacia los XObjects de formulario (`/Subtype /Form`), usando los `/Resources` propios de cada XObject (que pueden tener sus propias fuentes). Así se empaquetan los documentos firmados de la administración española (@Firma / VeriFirma / iText): el cuerpo real del pliego vive en un Form XObject y el content stream de la página solo lleva el overlay de firma + un `Do`. Con guarda de ciclos y de profundidad.

**Filtros de stream:** `FlateDecode` (con predictores PNG/TIFF), `LZWDecode`, `ASCIIHexDecode`, `ASCII85Decode`. Filtros de imagen (`DCTDecode`, `CCITTFax`, `JBIG2`, `JPX`) se ignoran (no son texto).

**Texto:** operadores `Tj`, `TJ` (con inserción de espacios por kerning), `'`, `"`, y saltos de línea por `Td`/`TD`/`T*`/`Tm`/`ET`. Decodificación **WinAnsi/Latin1** para fuentes simples (incluye €, comillas tipográficas, guiones – —) y **Type0/CID de 2 bytes** por dos vías:

1. **`/ToUnicode`** cuando el PDF lo trae (lo más común en generadores modernos).
2. **Fallback por `cmap` embebida** cuando NO hay `/ToUnicode`: para fuentes **CIDFontType2** con **FontFile2** (TrueType embebido), la skill lee la tabla `cmap` del propio programa de fuente y reconstruye código→GID→Unicode (respetando `CIDToGIDMap`, Identity o stream). Es la vía determinista que usan extractores como pdfminer, y cubre los pliegos de **PLACSP / iText** de la administración pública española.

El comando `fonts` permite diagnosticar de antemano si un PDF es recuperable (ver abajo). Lo que el fallback **no** cubre: fuentes CFF/Type1C (`FontFile3`) y fuentes a las que el subsetting les eliminó la tabla `cmap` (`fonts` lo reporta como `embedded_cmap: false`).

---

## Comandos y formato de salida

Todo se invoca con el launcher del repo (nunca `node` a secas — convención §12.7-bis):

```bash
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-pdf-reader/pdf.cjs <command> [opciones]
```

### `text` — extraer texto

```bash
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-pdf-reader/pdf.cjs text \
  --input <ruta.pdf> [--pages <spec>] [--max-pages N] [--by-page] [--out <f.txt>] [--raw]
```

- Por defecto: JSON con el texto en el campo `text` (páginas unidas por línea en blanco).
- `--by-page`: devuelve `pages: [{ page, text }]` en vez del texto unido.
- `--out <f.txt>`: escribe el texto plano a un fichero y devuelve solo estadísticas (útil para PDFs grandes).
- `--raw`: imprime **texto plano** a stdout (sin JSON). Ideal para `| head` o lectura humana rápida.
- `--pages <spec>`: selección 1-based. Ejemplos: `all` (defecto), `3`, `1-15`, `2-`, `-10`, `1,4,7-9`.
- `--max-pages N`: tope de páginas a extraer (tras aplicar `--pages`).

```json
{ "ok": true, "op": "text", "input": "pliego.pdf", "total_pages": 42, "extracted_pages": [1,2,3], "chars": 5120, "text": "..." }
```

### `meta` — metadatos + nº de páginas

```bash
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-pdf-reader/pdf.cjs meta --input <ruta.pdf>
```

```json
{ "ok": true, "op": "meta", "input": "pliego.pdf", "total_pages": 42, "encrypted": false,
  "info": { "title": "...", "author": "...", "subject": "...", "creator": "...", "producer": "...", "creationdate": "2026-06-08T09:18:48", "moddate": "..." } }
```

Si el PDF está cifrado, `info` es `null` y se añade `note` (los strings del Info están cifrados). `total_pages` sigue siendo fiable (la estructura no está cifrada).

### `count` — solo nº de páginas

```bash
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-pdf-reader/pdf.cjs count --input <ruta.pdf>
```

```json
{ "ok": true, "op": "count", "input": "pliego.pdf", "total_pages": 42 }
```

### `search` — buscar un término

```bash
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-pdf-reader/pdf.cjs search \
  --input <ruta.pdf> --query <texto> [--pages <spec>] [--ignore-case] [--context N]
```

- `--ignore-case`: búsqueda insensible a mayúsculas.
- `--context N`: caracteres de contexto a cada lado del match en los snippets (defecto 40).

```json
{ "ok": true, "op": "search", "input": "pliego.pdf", "query": "penalización", "total_pages": 42,
  "total_hits": 3, "pages_with_hits": 2,
  "matches": [ { "page": 12, "hits": 2, "snippets": ["... penalización del 5% por demora ..."] } ] }
```

### `fonts` — diagnóstico de fuentes

Útil cuando `text` devuelve `NO_TEXT` o sale vacío: dice **por qué** y si el texto es recuperable.

```bash
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-pdf-reader/pdf.cjs fonts --input <ruta.pdf> [--pages <spec>]
```

```json
{ "ok": true, "op": "fonts", "input": "pliego.pdf", "total_pages": 42,
  "pages": [ { "page": 1, "fonts": [
    { "key": "F2", "source": "page", "subtype": "Type1", "base_font": "Helvetica", "recoverable": true },
    { "key": "F1", "source": "page/Xf1", "subtype": "Type0", "base_font": "ABCDEE+Arial", "encoding": "Identity-H",
      "to_unicode": false, "cid_subtype": "CIDFontType2", "cid_to_gid": "Identity",
      "font_file": "FontFile2", "embedded_cmap": true, "recovered_via": "truetype-cmap", "recoverable": true } ] } ] }
```

Cómo leerlo:

- `source` → dónde vive la fuente: `page` (recursos de la página) o `page/Xf1` (dentro del Form XObject `Xf1`). En pliegos firmados, el cuerpo aparece bajo un `page/<xobject>`.
- `recoverable: true` → la skill puede extraer el texto de esa fuente.
- `to_unicode: true` → vía `/ToUnicode` (caso ideal).
- `recovered_via: "truetype-cmap"` → recuperado por la `cmap` embebida (CID sin `/ToUnicode`).
- `font_file: "FontFile3"` → fuente CFF, **no** soportada por el fallback → texto no recuperable sin OCR/otra herramienta.
- `embedded_cmap: false` → al subset le quitaron la `cmap` → no recuperable por esta vía.

---

## Contrato CLI

```
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-pdf-reader/pdf.cjs <command> [opciones]

command:
  text     extrae texto (por página o unido).
  meta     Info dictionary (title/author/subject/creator/producer/fechas) + nº de páginas.
  count    nº total de páginas.
  search   busca un término; devuelve páginas con coincidencias y snippets.
  fonts    diagnóstico de fuentes por página (subtype, encoding, ToUnicode,
           FontFile, cmap embebida, y si el texto es recuperable).

opciones comunes:
  --input <path>     Obligatorio. Ruta al .pdf. Sin restricción de scope (lectura).
  --help, -h         Imprime ayuda y sale con exit 0.

opciones de text:
  --pages <spec>     Selección 1-based: all|N|N-M|N-|-M|lista. Defecto: all.
  --max-pages N      Tope de páginas tras aplicar --pages.
  --by-page          Devuelve pages:[{page,text}] en vez del texto unido.
  --out <path>       Escribe texto plano a fichero; devuelve solo estadísticas.
  --raw              Imprime texto plano a stdout (sin JSON).

opciones de search:
  --query <str>      Obligatorio. Término a buscar (se escapa como literal).
  --pages <spec>     Igual que en text.
  --ignore-case      Búsqueda insensible a mayúsculas.
  --context N        Caracteres de contexto por lado en snippets (defecto 40).
```

### Output con error (stdout + stderr, exit `1`)

```json
{ "ok": false, "error": { "code": "NO_TEXT", "message": "..." } }
```

### Códigos de error

| Código | Significado |
|---|---|
| `BAD_ARGS` | Comando o argumentos faltantes/mal formados, o argumento desconocido. |
| `INPUT_NOT_FOUND` | El path de `--input` no existe. |
| `NOT_A_PDF` | El fichero no tiene cabecera `%PDF-` (ni en el primer KB). |
| `ENCRYPTED` | El PDF está cifrado; esta skill no descifra. Usar una herramienta con la password. |
| `NO_TEXT` | No hay texto extraíble: PDF escaneado/solo-imagen (necesita OCR), o fuentes sin `/ToUnicode`. |
| `PARSE_ERROR` | El PDF no pudo parsearse (corrupto o estructura no soportada). |
| `WRITE_FAILED` | Error al escribir el fichero de `--out`. |
| `INTERNAL` | Cualquier otra excepción no esperada. |

---

## Proceso

1. **(Opcional) Sondear primero** con `count` o `meta` para saber cuántas páginas hay y de qué documento se trata, antes de extraer todo.
2. **Extraer** con `text`. Para documentos largos, acotar con `--pages` (p. ej. `1-15`) o volcar a fichero con `--out` en vez de inflar el stdout.
3. **Leer el JSON del stdout** (campo `text` / `pages` / `matches`) y usarlo en el siguiente paso del agente.
4. **Si `ok: false`**, leer `error.code`:
   - `NO_TEXT` → el PDF es probablemente escaneado; escalar a un MCP/servicio de OCR.
   - `ENCRYPTED` → pedir la versión sin contraseña o una herramienta que la acepte.
   - El resto → corregir la invocación (ruta, argumentos).

---

## Limitaciones (importante)

- **Solo lee, no escribe ni edita.** No rellena formularios, no fusiona, no parte, no rasteriza. Para eso, MCP o librería de manipulación.
- **Sin OCR.** Un PDF escaneado (solo imagen) no tiene texto que extraer → `NO_TEXT`. Es el mismo techo que `pdfplumber` sin OCR.
- **Fuentes Type0/CID sin `/ToUnicode`.** Se recuperan si son **CIDFontType2 con FontFile2** y la fuente conserva su tabla `cmap` (caso PLACSP/iText, cubierto por el fallback). **No** se recuperan: fuentes **CFF/Type1C** (`FontFile3`) ni fuentes con la `cmap` eliminada en el subsetting → sus glifos se **omiten** (en vez de emitir ruido). Usar `fonts` para saber de antemano en qué caso estás; si no es recuperable, recurrir a OCR/otra herramienta.
- **No descifra.** PDFs con `/Encrypt` se detectan y se reportan; no se intenta romper ni aplicar contraseña.
- **El layout no se preserva.** Se extrae el flujo de texto con saltos de línea heurísticos; las **tablas** salen como texto secuencial, no como cuadrícula. Para estructura tabular fiel, valorar un MCP especializado.
- **Codificaciones exóticas.** Fuera de WinAnsi/Latin1 y `/ToUnicode`, caracteres muy raros pueden no mapearse. Cubre el caso común (incluido español con acentos, €, comillas y guiones tipográficos).

---

## Restricciones

- El script **no usa dependencias externas**: solo Node stdlib (`fs`, `path`, `zlib`). Compatible con Node 18+.
- Invocación **siempre** por el launcher `.aigent/IDE/bin/run` — nunca `node` a secas (convención §12.7-bis).
- `--input` no tiene restricción de scope (es lectura). Si se usa `--out`, el fichero de texto resultante respeta `_shared/output-rules.md` (los entregables van fuera de `.aigent/` y `.context/`).
- Añadir una capacidad nueva (filtro, codificación, comando) requiere editar `pdf.cjs` y este SKILL.md a la vez.

Aplican las reglas de output de `_shared/output-rules.md`.
