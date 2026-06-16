---
name: "shared-http-download"
user-invocable: true
description: >
  Download one or more files over HTTP(S) GET into a destination directory on
  disk, with safe filename resolution, per-file error isolation and a size cap.
  **Trigger this skill whenever a URL (or a list of URLs) must be fetched and
  saved as a real binary/document file** — typically because another skill or
  tool returned document links (tender specs / pliegos, attachments, exports,
  report URLs) that now need to live on disk for further processing. Works for
  PDF, ZIP, DOC/DOCX, XLS/XLSX, XML, HTML, TXT and any binary blob. Activation
  keywords: "download file", "download url", "fetch binary", "save url to disk",
  "descargar fichero", "descargar pliego", "bajar documento", "GET a disco",
  "descargar adjunto". Ships with `download.cjs` (Node 18+, no dependencies)
  that handles the GET, filename derivation (title / Content-Disposition /
  URL path / Content-Type), directory creation and a JSON report. Does NOT parse
  or summarize the downloaded content — chain it with the `pdf`/`docx` skills for
  that, and with a search/extraction skill to obtain the URLs in the first place.
---

# Skill: HTTP download (GET → fichero)

**Entregable:** uno o varios ficheros materializados en el directorio destino (`outDir`) que decide el agente caller, más un **JSON de reporte** por stdout con la ruta, tamaño y content-type de cada descarga y los errores por URL. El script no interpreta el contenido: solo lo baja a disco.

**Archivos de la skill (fuente de verdad):**

```
shared-http-download/
├── SKILL.md       ← este archivo (prosa + contrato CLI)
└── download.cjs    ← script Node 18+ sin dependencias (fetch global)
```

El script es **parte del contrato**. La prosa describe lo que hace; si diverge, gana el comportamiento real del script y se ajusta la prosa.

---

## Cuándo usar esta skill

- Otra skill o tool ha devuelto **URLs de documentos** (p. ej. pliegos de una licitación, adjuntos, exports) y hay que tenerlos en disco para procesarlos o entregarlos.
- Hace falta bajar un binario por **GET simple** (sin login, sin formularios, sin cabeceras especiales de auth).

**Cuándo NO usar:**

- El contenido **ya viene en base64** en la conversación → usar `shared-base64`.
- La descarga requiere **autenticación, sesión o POST** → no es el caso de uso de esta skill.
- Hay que **leer/resumir** el fichero → primero descargar con esta skill, luego encadenar con `pdf` / `docx`.

---

## Inputs del caller

Se pasan como JSON por `--inputs`:

| Campo | Obligatorio | Default | Notas |
|---|---|---|---|
| `outDir` | sí | — | Directorio destino. Lo crea si no existe. Ruta de entregable que decide el caller (ver "Convención de rutas"). |
| `documentos` | sí* | — | Lista `[{ url, titulo?, tipo? }]`. `url` es lo único obligatorio de cada item. |
| `url` / `titulo` / `tipo` | sí* | — | Atajo para **un solo** documento (se normaliza a un item de `documentos`). |
| `overwrite` | no | `false` | Si `false`, no pisa: añade sufijo `-1`, `-2`… si el nombre ya existe. |
| `timeoutMs` | no | `60000` | Timeout por descarga. |
| `maxBytes` | no | `52428800` (50 MB) | Tope por fichero. Si `content-length` lo supera, se aborta antes de bajar. |
| `quiet` | no | `false` | `true` silencia el progreso por stderr. |

\* Hace falta **al menos** un documento: vía `documentos[]` o vía el atajo `url`.

### Resolución del nombre de fichero

Por orden de preferencia: `titulo` (si trae extensión) → `filename` de la cabecera `Content-Disposition` → último segmento del path de la URL (si trae extensión) → `titulo`/`documento-N` + extensión inferida del `Content-Type`. El nombre se sanea (kebab/espacios, caracteres ilegales a `_`, máx. 180 chars).

---

## Contrato CLI

```
.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-http-download/download.cjs \
  --inputs '{ "outDir": "<ruta>", "documentos": [ { "url": "...", "titulo": "PCAP.pdf", "tipo": "Legal" } ] }'

# Atajo de un solo documento:
.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-http-download/download.cjs \
  --inputs '{ "outDir": "<ruta>", "url": "https://...", "titulo": "PPT.pdf" }'

.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-http-download/download.cjs --help
```

### Output exitoso (stdout, exit `0`)

```json
{
  "ok": true,
  "outDir": "proyecto-x/sales/licitaciones/2026000435",
  "requested": 2,
  "downloaded": [
    { "ok": true, "url": "https://…/pcap", "path": "…/PCAP.pdf", "bytes": 184320, "contentType": "application/pdf", "tipo": "Legal" }
  ],
  "errors": [
    { "ok": false, "url": "https://…/falta", "error": { "code": "HTTP_404", "message": "HTTP 404 en https://…/falta" } }
  ]
}
```

Las descargas se procesan en serie y **un fallo en una URL no aborta el lote**: la URL fallida va a `errors[]` y el resto continúa. El JSON de nivel superior sigue siendo `ok: true` salvo error estructural de argumentos.

### Output con error estructural (stdout + stderr, exit `1`)

```json
{ "ok": false, "error": { "code": "BAD_ARGS", "message": "Falta `outDir`." } }
```

### Códigos de error

| Código | Dónde | Significado |
|---|---|---|
| `BAD_ARGS` | nivel superior | Falta `outDir`, no hay documentos con `url`, o `--inputs` no es JSON válido. |
| `HTTP_<status>` | por documento | El GET devolvió un status ≠ 2xx (p. ej. `HTTP_404`, `HTTP_403`). |
| `TIMEOUT` | por documento | Se superó `timeoutMs`. |
| `TOO_LARGE` | por documento | `content-length` o los bytes descargados superan `maxBytes`. |
| `NETWORK_ERROR` | por documento | Fallo de red/DNS u otra excepción de `fetch`. |
| `INTERNAL` | nivel superior | Excepción no esperada. |

---

## Convención de rutas (`outDir`)

`outDir` es **libre**: el script no impone scope, igual que `shared-base64` con `--output`. Pero el caller debe respetar `_shared/output-rules.md`:

- Si el fichero es **entregable**, `outDir` va a `<proyecto>/<departamento>/…` en la raíz del repo — **nunca** dentro de `.aigent/` ni `.context/`.
- Si el fichero es **transitorio** (se procesa y se descarta), `outDir` puede ser `.context/.temp/<dept>/` y el caller se encarga de borrarlo al terminar.

---

## Restricciones

- Solo **GET** sin autenticación. Sin POST, sin login, sin cookies de sesión.
- **Sin dependencias externas**: solo Node stdlib + `fetch` global (Node 18+).
- No interpreta el contenido descargado (no parsea PDF/XML/HTML). Encadenar con `pdf` / `docx` para eso.
- El caller es responsable de la **procedencia** de las URLs: esta skill baja lo que se le indica.

Aplican las reglas de output de `_shared/output-rules.md`.
