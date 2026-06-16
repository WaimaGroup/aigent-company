---
name: "shared-base64"
user-invocable: true
description: >
  Bidirectional base64 (b64) ↔ file utility. **DECODE**: turn a base64 string
  into a real file on disk — staged through `.context/.temp/<dept>/`, written to
  the deliverable path of the caller's department, with magic-bytes verification
  of the declared format. **ENCODE**: turn any file into base64, written directly
  to a `.b64` text file (optionally as a `data:<mime>;base64,...` data URI), so it
  can be re-uploaded to a system that only accepts base64. **Trigger this skill
  whenever base64 content needs to be persisted as a file, OR a file needs to be
  turned into base64.** Typical decode sources: an MCP returned base64 (image
  generation like DALL·E / Stable Diffusion / Bria, document retrieval, asset
  download, screenshot capture, file export) or a data URI
  (`data:image/png;base64,...`, `data:application/pdf;base64,...`). Typical encode
  sources: a local asset (PNG/JPG/PDF/ZIP/...) that must be sent to an API/CMS as
  base64 or embedded as a data URI. Supported formats for verification: PNG, JPG,
  JPEG, GIF, WEBP, SVG, PDF, ZIP (encode also handles any other file as raw
  octet-stream). Activation keywords: "base64", "b64", "data URI",
  "data:image/...;base64,", "decode base64", "encode to base64", "file to base64",
  "save base64 as file", "materialize base64 to PNG/JPG/SVG/PDF/ZIP", "the MCP
  returned base64", "re-upload as base64", "binary blob from API response". Ships
  with `b64.cjs` (Node 18+, no dependencies) handling validation, decoding,
  encoding, magic-bytes checks, gitignore management, the `.b64` snapshot, and
  cleanup.
---

# Skill: Base64 ↔ fichero

Utilidad bidireccional sin dependencias para convertir entre base64 y ficheros reales.

- **`decode`** — base64 (texto en un `.b64`) → fichero (PNG, JPG, JPEG, GIF, WEBP, SVG, PDF o ZIP) materializado en la ruta de destino del agente caller, con verificación de magic bytes contra el formato declarado, más una copia `.b64` junto al fichero.
- **`encode`** — cualquier fichero → base64, escrito directamente a un fichero `.b64` de texto (opcionalmente como data URI `data:<mime>;base64,...`), por si hay que re-subirlo a una API/CMS que solo acepta base64.

El path resultante se devuelve en el JSON de stdout para que el agente caller siga con el flujo.

**Archivos de la skill (fuente de verdad):**

```
shared-base64/
├── SKILL.md       ← este archivo (prosa + contrato CLI)
└── b64.cjs        ← script Node 18+ sin dependencias (subcomandos decode | encode)
```

El script es **parte del contrato** de la skill. La prosa describe lo que el script hace; si diverge, gana el comportamiento real del script y se ajusta la prosa.

---

## Cuándo usar esta skill

**Decode:**

- Un agente recibe un base64 de un **MCP** (generación de imágenes, descarga de documentos, exportación de assets) y necesita guardarlo como fichero real para procesarlo o entregarlo.
- Hace falta **verificar** que el contenido decodificado matchea el formato declarado (no abrir un "PNG" que era basura).
- Se quiere conservar el base64 original **junto al fichero decodificado** por si hay que re-subirlo (la copia `.b64` alongside es el default).

**Encode:**

- Un agente tiene un **fichero local** (imagen, PDF, ZIP…) y un sistema externo (API, CMS, MCP) que solo acepta base64 o un data URI.
- Se quiere un **snapshot `.b64`** del fichero, persistido en disco, para pasarlo a otro tool, embeberlo en un payload JSON, o auditarlo.

**Cuándo NO usar:**

- El base64 es el **output de una skill v2 HTTP propia** del repo → eso debería gestionarse por el engine (contrato `outputs.file`, cuando exista), no por esta skill.
- El contenido **ya es texto plano** (no base64) → guardar con `Write` directamente.

---

## DECODE — base64 → fichero

### Inputs del caller

| Campo | Origen | Notas |
|---|---|---|
| `base64_string` | respuesta del MCP / API | Blob a decodificar. **Sin prefijo `data:...;base64,`** si vino de un data URI (ver más abajo). |
| `dept` | identidad del agente caller | Subdirectorio del input intermedio: `.context/.temp/<dept>/`. |
| `purpose` | el propio agente | Kebab-case descriptivo. Ej: `hero-banner`, `product-mockup`. |
| `format` | intención del agente | Uno de: `png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`, `pdf`, `zip`. |
| `timestamp` | `date +%s` al inicio del flujo | Timestamp Unix para el nombre del `.b64` intermedio. |
| `output_path` | ruta de outputs del dept | Path final del fichero decodificado. La copia `.b64` se deja en el mismo directorio con el mismo basename. |

#### Strip del prefijo data URI

Si el MCP devuelve un data URI completo (`data:image/png;base64,iVBORw0K...`), el agente **debe** descartar el prefijo y conservar solo el payload base64 antes de escribir el `.b64`. El script (en decode) espera base64 puro. *(En la dirección inversa, `encode --data-uri` sí añade el prefijo.)*

### Proceso

1. **Calcular timestamp Unix:** `TS=$(date +%s)`.
2. **Escribir el base64 a un `.b64` transitorio** con `Write` en la ruta canónica de staging: `.context/.temp/<dept>/<purpose>-<TS>.b64`.
3. **Invocar `b64.cjs decode`** desde la raíz del repo (donde vive `.context/`):

   ```bash
   .aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-base64/b64.cjs decode \
     --input .context/.temp/<dept>/<purpose>-<TS>.b64 \
     --format <format> \
     --output <ruta-final-del-depto>/<basename>.<format>
   ```

   El script: crea el directorio destino; crea `.context/.temp/.gitignore` con `*` si no existe; valida que el contenido es base64; decodifica; verifica magic bytes; escribe el fichero; copia el `.b64` alongside (salvo `--no-b64-copy`); borra el `.b64` intermedio (salvo `--keep-input` o que coincida con la copia alongside); emite JSON `{ ok, op, path, bytes, mime, format, b64_copy }`.

4. **Leer el JSON del stdout** y usar `path` y `b64_copy` para el siguiente paso.
5. **Si falla** (`ok: false`), leer `error.code` y actuar según la tabla de "Códigos de error".

---

## ENCODE — fichero → base64

### Inputs del caller

| Campo | Origen | Notas |
|---|---|---|
| `source_file` | ruta del fichero a codificar | Cualquier ruta existente. Sin restricción de scope. |
| `output_path` | decisión del agente | Ruta del `.b64` resultante. Para un snapshot transitorio: `.context/.temp/<dept>/<purpose>-<TS>.b64`. Para acompañar a un entregable: junto al fichero. |
| `format` | opcional | Si se aporta, el script verifica los magic bytes del origen antes de codificar. Si no, el mime se infiere de la extensión. |
| `data_uri` | opcional | Si se quiere el prefijo `data:<mime>;base64,` en el `.b64`. |

### Proceso

1. **Invocar `b64.cjs encode`** desde la raíz del repo:

   ```bash
   .aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-base64/b64.cjs encode \
     --input <ruta-del-fichero-origen> \
     --output .context/.temp/<dept>/<purpose>-<TS>.b64
   ```

   Opcional: `--format <fmt>` para verificar el origen; `--data-uri` para el prefijo; `--emit-string` para incluir el base64 completo en el JSON (cuidado con blobs grandes).

   El script: valida que el origen existe y es un fichero; (opcional) verifica magic bytes; lee bytes; codifica a base64; escribe el `.b64` (con prefijo data URI si `--data-uri`); gestiona el gitignore si el output cae bajo `.context/.temp/`; emite JSON.

2. **Leer el JSON del stdout** y usar `b64_path` (snapshot en disco) y, si se pidió, `base64` (string en memoria) para el siguiente paso (p. ej. construir un payload para un MCP).

---

## Contrato CLI

```
.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-base64/b64.cjs <command> [opciones]

command:
  decode                   base64 (.b64) → fichero. (default si el primer arg empieza por --)
  encode                   fichero → base64 (.b64).

decode:
  --input <path>           obligatorio. Path al .b64. Debe estar bajo .context/.temp/.
  --format <fmt>           obligatorio salvo que --output traiga la extensión.
                           Valores: png, jpg, jpeg, gif, webp, svg, pdf, zip.
  --output <path>          opcional. Path final del fichero decodificado. Sin restricción de scope.
                           Default: --input con la extensión cambiada a <format>.
  --keep-input             opcional (flag). No borra el .b64 intermedio (debug).
  --no-b64-copy            opcional (flag). No deja una copia .b64 junto al output.

encode:
  --input <path>           obligatorio. Path al fichero origen a codificar. Sin restricción de scope.
  --output <path>          opcional. Path del .b64 resultante. Sin restricción de scope.
                           Default: --input con la extensión cambiada a .b64 (alongside).
  --format <fmt>           opcional. Si se aporta, verifica magic bytes del origen.
                           Valores: png, jpg, jpeg, gif, webp, svg, pdf, zip.
  --data-uri               opcional (flag). Prefija el contenido con "data:<mime>;base64,".
  --emit-string            opcional (flag). Incluye el base64 completo en el JSON de stdout.

  --help, -h               imprime ayuda y sale con exit 0.
```

### Output exitoso — decode (stdout, exit `0`)

```json
{
  "ok": true,
  "op": "decode",
  "path": "posts/hero-2026-q2/assets/hero.png",
  "bytes": 12480,
  "mime": "image/png",
  "format": "png",
  "b64_copy": "posts/hero-2026-q2/assets/hero.b64"
}
```

`path` y `b64_copy` se devuelven en la misma forma (relativa o absoluta) en la que se calculó `--output`. Si se pasó `--no-b64-copy`, `b64_copy` será `null`. Caso particular: si `--output` se omite y se queda dentro de `.context/.temp/<dept>/`, el script reconoce que la copia alongside coincide con el input, no crea duplicado y preserva el `.b64`.

### Output exitoso — encode (stdout, exit `0`)

```json
{
  "ok": true,
  "op": "encode",
  "b64_path": ".context/.temp/marketing/hero-1717200000.b64",
  "source_path": "posts/hero-2026-q2/assets/hero.png",
  "source_bytes": 12480,
  "b64_chars": 16640,
  "mime": "image/png",
  "format": "png",
  "data_uri": false,
  "base64": null
}
```

`format` será `null` si la extensión del origen no está en el catálogo (mime cae a `application/octet-stream`). `base64` solo trae el string si se pasó `--emit-string`; si no, es `null`.

### Output con error (stdout + stderr, exit `1`)

stdout:

```json
{ "ok": false, "error": { "code": "FORMAT_MISMATCH", "message": "..." } }
```

stderr: `[ERROR FORMAT_MISMATCH] ...`

### Códigos de error

| Código | Significado |
|---|---|
| `BAD_ARGS` | Argumentos faltantes, mal formados, comando o formato no soportado, o argumento desconocido. |
| `INPUT_NOT_FOUND` | El path de `--input` no existe en disco. |
| `INPUT_OUT_OF_SCOPE` | (decode) El path de `--input` no está bajo `.context/.temp/`. |
| `BAD_BASE64` | (decode) El contenido del input no es base64 válido (vacío o caracteres ilegales). |
| `EMPTY_DECODE` | (decode) El base64 decodifica a 0 bytes. |
| `EMPTY_INPUT` | (encode) El fichero origen está vacío (0 bytes). |
| `MISSING_FORMAT` | (decode) Ni `--format` ni la extensión de `--output` permiten inferirlo. |
| `FORMAT_MISMATCH` | Los magic bytes (o el contenido textual para SVG) no matchean con `--format`. |
| `WRITE_FAILED` | Error al crear directorios, escribir el binario/`.b64` o copiar el alongside. |
| `INTERNAL` | Cualquier otra excepción no esperada. |

---

## Formatos soportados (verificación de magic bytes)

| `--format` | Verificación |
|---|---|
| `png` | bytes `89 50 4E 47 0D 0A 1A 0A` |
| `jpg`, `jpeg` | bytes `FF D8 FF` |
| `gif` | bytes `47 49 46 38` (`GIF8` — cubre `GIF87a` y `GIF89a`) |
| `webp` | bytes 0-3 = `RIFF` y bytes 8-11 = `WEBP` |
| `pdf` | bytes `25 50 44 46` (`%PDF`) |
| `zip` | bytes `50 4B 03 04` (`PK\x03\x04`) |
| `svg` | UTF-8 inicial (256 primeros bytes, trim) empieza por `<?xml` o `<svg` |

En `encode` la verificación es **opcional** (solo si se pasa `--format`). Sin `--format`, cualquier fichero se codifica como `application/octet-stream` si su extensión no está en el catálogo. En `decode` el `--format` (o la extensión de `--output`) es **obligatorio** y siempre se verifica.

Añadir un formato nuevo = editar `b64.cjs` (catálogo `MAGIC` y mapa `MIME`) **y** esta tabla.

---

## Convenciones que aplican

- **Decode: input bajo `.context/.temp/<dept>/`** según `_shared/output-rules.md`. El script lo valida. El `--output` no tiene restricción de scope.
- **Encode: sin restricción de scope** en `--input` ni `--output`. Para un snapshot transitorio, el caller apunta `--output` a `.context/.temp/<dept>/<purpose>-<TS>.b64`.
- **Naming `<purpose>-<timestamp>.<ext>`** del fichero intermedio/snapshot según output-rules. El script no fuerza el patrón — confía en el caller.
- **`.context/.temp/.gitignore` con `*`** creado por el script la primera vez que escribe algo bajo `.context/.temp/` (tanto en decode como en encode).
- **Copia `.b64` alongside** por defecto en decode, junto al fichero decodificado. `--no-b64-copy` lo suprime.
- **Borrado del `.b64` intermedio** por defecto tras decode con éxito. `--keep-input` lo conserva.
- **Cwd = raíz del proyecto** donde vive `.context/`. Los paths devueltos son relativos al cwd cuando los args entraron relativos.

---

## Restricciones

- **Decode** solo lee base64 desde un fichero (no por stdin ni por argumento), para evitar problemas con blobs grandes y mantener auditabilidad. **Encode** lee el fichero origen y escribe el `.b64`; el string solo se devuelve en el JSON si se pasa `--emit-string`.
- El **input de decode** siempre bajo `.context/.temp/`. El **output de decode** y **ambos paths de encode** son libres (los decide el agente caller, respetando la convención de outputs del depto).
- El script **no usa dependencias externas**: solo Node stdlib (`fs`, `path`). Compatible con Node 18+.
- El script **no acepta formatos fuera del catálogo declarado** para verificación. Añadir uno nuevo requiere editar `b64.cjs` y este SKILL.md a la vez.
- **No commitear nada de `.context/.temp/`.** El `.gitignore` del directorio se encarga.
- **La copia `.b64` alongside (decode) o el `.b64` de encode pueden vivir fuera de `.context/.temp/`** y, por tanto, ser trackeados por git si el depto así lo decide. Es deliberado.

Aplican las reglas de output de `_shared/output-rules.md`.
