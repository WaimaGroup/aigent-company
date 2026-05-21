---
name: "shared-base64-to-file"
user-invocable: true
description: >
  Decode a base64 (b64) string into a real file on disk under `.context/.temp/<dept>/`,
  with magic-bytes verification of the declared format. **Trigger this skill whenever
  base64 content appears in the conversation and needs to be persisted as a file** —
  typically because an MCP tool returned it (image generation like DALL·E / Stable
  Diffusion / Bria, document retrieval, asset download, screenshot capture, file
  export) or because it was embedded in a data URI (`data:image/png;base64,...`,
  `data:application/pdf;base64,...`). Supported output formats: PNG, JPG, JPEG,
  GIF, WEBP, SVG, PDF, ZIP. Activation keywords and patterns: "base64", "b64",
  "data URI", "data:image/...;base64,", "decode base64", "save base64 as file",
  "materialize base64 to PNG/JPG/SVG/PDF/ZIP", "the MCP returned base64",
  "creativity returned by the image generation tool", "binary blob from API
  response". Ships with `decode.js` (Node 18+, no dependencies) that handles
  validation, decoding, magic-bytes checks, gitignore management and cleanup.
---

# Skill: Base64 → fichero

**Entregable:** un fichero (PNG, JPG, JPEG, GIF, WEBP, SVG, PDF o ZIP) materializado en `.context/.temp/<dept>/`, con verificación de magic bytes contra el formato declarado. El path resultante se devuelve en el JSON de stdout para que el agente caller siga con el flujo.

**Archivos de la skill (fuente de verdad):**

```
shared-base64-to-file/
├── SKILL.md       ← este archivo (prosa + contrato CLI)
└── decode.js      ← script Node 18+ sin dependencias
```

El script es **parte del contrato** de la skill. La prosa describe lo que el script hace; si diverge, gana el comportamiento real del script y se ajusta la prosa.

---

## Cuándo usar esta skill

- Un agente recibe un base64 de un **MCP** (generación de imágenes, descarga de documentos, exportación de assets) y necesita guardarlo como fichero real para procesarlo después (subir a WordPress, adjuntar a un email, mover al output del proyecto, etc.).
- Hace falta **verificar** que el contenido decodificado matchea con el formato declarado (no abrir un "PNG" que era basura).
- El fichero resultante es **transitorio**: vive en `.context/.temp/<dept>/` hasta que el agente decida promocionarlo al directorio de outputs del proyecto, subirlo a un sistema externo o descartarlo.

**Cuándo NO usar:**

- El base64 es el **output de una skill v2 HTTP propia** del repo → eso debería gestionarse por el engine (contrato `outputs.file`, cuando exista), no por esta skill.
- El contenido **ya es texto plano** (no base64) → guardar con `Write` directamente.
- El fichero es un **entregable final** del proyecto → ir directo a la ruta de outputs del dept (`<proyecto>/<dept>/...`), no a `.context/.temp/`. La regla universal de `_shared/output-rules.md` aplica.

---

## Inputs del caller

El agente que invoca esta skill debe tener (o calcular) los siguientes datos antes de llamar al script:

| Campo | Origen | Notas |
|---|---|---|
| `base64_string` | respuesta del MCP / API | Blob a decodificar. **Sin prefijo `data:...;base64,`** si vino de un data URI (ver más abajo). |
| `dept` | identidad del agente caller | Determina el subdirectorio destino: `.context/.temp/<dept>/`. |
| `purpose` | el propio agente | Kebab-case descriptivo. Ej: `hero-banner`, `product-mockup`, `og-image-q3`. |
| `format` | intención del agente | Uno de: `png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`, `pdf`, `zip`. |
| `timestamp` | `date +%s` al inicio del flujo | Timestamp Unix, mismo para el `.b64` intermedio y el binario final. |

### Strip del prefijo data URI

Si el MCP devuelve un data URI completo (`data:image/png;base64,iVBORw0K...`), el agente **debe** descartar el prefijo y conservar solo el payload base64 antes de escribir el `.b64`. El script no hace ese strip — espera base64 puro.

---

## Proceso

1. **Calcular timestamp Unix.** El mismo timestamp se usa para el `.b64` intermedio y el binario final, así un fallo permite identificar y limpiar a mano la pareja con el mismo TS.

   ```bash
   TS=$(date +%s)
   ```

2. **Escribir el base64 a un `.b64` transitorio** usando la tool `Write` en la ruta canónica:

   ```
   .context/.temp/<dept>/<purpose>-<TS>.b64
   ```

3. **Invocar `decode.js`** desde la raíz del repo (donde vive `.context/`):

   ```bash
   node .aigent/departments/_shared/skills/shared-base64-to-file/decode.js \
     --input .context/.temp/<dept>/<purpose>-<TS>.b64 \
     --format <format>
   ```

   El script, internamente:
   - Crea `.context/.temp/<dept>/` si no existe.
   - Crea `.context/.temp/.gitignore` con `*` si no existe (regla universal `_shared/output-rules.md`).
   - Valida que el contenido es base64 (regex `^[A-Za-z0-9+/]+=*$` tras strip de whitespace).
   - Decodifica con `Buffer.from(..., 'base64')`.
   - Verifica magic bytes contra `<format>` (texto inicial para SVG).
   - Escribe en `.context/.temp/<dept>/<purpose>-<TS>.<format>`.
   - Borra el `.b64` (salvo `--keep-input`).
   - Emite JSON a stdout: `{ ok, path, bytes, mime, format }`.

4. **Leer el JSON del stdout** (parsear con `JSON.parse`) y usar `path` para el siguiente paso del flujo del agente: promover al output del proyecto, adjuntar a otro MCP, descartar tras subir, etc.

5. **Si el script falla** (`ok: false` o exit code distinto de 0), leer `error.code` del JSON y actuar según la tabla de "Códigos de error" (ver más abajo). En la mayoría de casos: reintentar la generación del asset upstream o reportar al usuario que el MCP devolvió algo que no parecía base64 válido.

---

## Contrato CLI

```
node .aigent/departments/_shared/skills/shared-base64-to-file/decode.js \
  --input <path>           # obligatorio. Path al .b64. Debe estar bajo .context/.temp/.
  --format <fmt>           # obligatorio salvo que --output traiga la extensión.
                           # Valores: png, jpg, jpeg, gif, webp, svg, pdf, zip.
  --output <path>          # opcional. Override del destino. Debe estar bajo .context/.temp/.
                           # Default: --input con la extensión cambiada a <format>.
  --keep-input             # opcional (flag). No borra el .b64 tras decodificar (debug).
  --help, -h               # imprime ayuda y sale con exit 0.
```

### Output exitoso (stdout, exit `0`)

```json
{
  "ok": true,
  "path": ".context/.temp/marketing/hero-banner-1747824000.png",
  "bytes": 12480,
  "mime": "image/png",
  "format": "png"
}
```

`path` se devuelve en la misma forma (relativa o absoluta) en la que se calculó: si `--output` no se pasó, se deriva de `--input` cambiando la extensión, así que conserva la forma del input.

### Output con error (stdout + stderr, exit `1`)

stdout:

```json
{
  "ok": false,
  "error": {
    "code": "FORMAT_MISMATCH",
    "message": "Decoded bytes do not match expected signature for format 'png'"
  }
}
```

stderr: `[ERROR FORMAT_MISMATCH] Decoded bytes do not match expected signature for format 'png'`

### Códigos de error

| Código | Significado |
|---|---|
| `BAD_ARGS` | Argumentos faltantes, mal formados, formato no soportado, o argumento desconocido. |
| `INPUT_NOT_FOUND` | El path de `--input` no existe en disco. |
| `INPUT_OUT_OF_SCOPE` | El path de `--input` no está bajo `.context/.temp/`. |
| `OUTPUT_OUT_OF_SCOPE` | El path de `--output` no está bajo `.context/.temp/`. |
| `BAD_BASE64` | El contenido del input no es base64 válido (vacío o caracteres ilegales). |
| `EMPTY_DECODE` | El base64 decodifica a 0 bytes. |
| `MISSING_FORMAT` | Ni `--format` ni la extensión de `--output` permiten inferirlo. |
| `FORMAT_MISMATCH` | Los magic bytes (o el contenido textual para SVG) no matchean con `--format`. |
| `WRITE_FAILED` | Error al crear directorios o escribir el binario. |
| `INTERNAL` | Cualquier otra excepción no esperada. |

---

## Formatos soportados

| `--format` | Verificación |
|---|---|
| `png` | bytes `89 50 4E 47 0D 0A 1A 0A` |
| `jpg`, `jpeg` | bytes `FF D8 FF` |
| `gif` | bytes `47 49 46 38` (`GIF8` — cubre `GIF87a` y `GIF89a`) |
| `webp` | bytes 0-3 = `RIFF` y bytes 8-11 = `WEBP` |
| `pdf` | bytes `25 50 44 46` (`%PDF`) |
| `zip` | bytes `50 4B 03 04` (`PK\x03\x04`) |
| `svg` | UTF-8 inicial (256 primeros bytes, trim) empieza por `<?xml` o `<svg` |

Añadir un formato nuevo = editar `decode.js` (catálogo `MAGIC` y mapa `MIME`) **y** esta tabla. No se aceptan formatos ad-hoc fuera del catálogo declarado.

---

## Convenciones que aplican

- **Paths bajo `.context/.temp/<dept>/`** según `_shared/output-rules.md` → "Archivos temporales (.context/.temp/<dept>/)". El script lo valida tanto en `--input` como en `--output`.
- **Naming `<purpose>-<timestamp>.<ext>`** según la misma sección de output-rules. El script no fuerza el patrón del nombre — confía en que el agente caller lo respete —, solo valida el directorio raíz.
- **`.context/.temp/.gitignore` con `*`** creado por el script la primera vez que se ejecuta en un proyecto (regla universal).
- **Borrado del `.b64`** por defecto tras decodificar con éxito. `--keep-input` lo conserva para depurar.
- **Cwd = raíz del proyecto** donde vive `.context/`. El script se invoca desde ahí; los paths que devuelve son relativos al cwd cuando los args entraron relativos.

---

## Restricciones

- El script **solo lee base64 desde un fichero**, no por stdin ni por argumento. Esto evita problemas con blobs grandes y mantiene auditabilidad (el `.b64` queda en disco si se usa `--keep-input`).
- El script **escribe siempre bajo `.context/.temp/`**. Si `--output` apunta fuera, falla con `OUTPUT_OUT_OF_SCOPE`. Para promocionar el asset a la ruta de outputs del proyecto, el agente lo mueve después con `mv`/`Bash` (o lo regenera via `Read`/`Write`).
- El script **no usa dependencias externas**: solo Node stdlib (`fs`, `path`). Compatible con Node 18+.
- El script **no acepta formatos fuera del catálogo declarado**. Añadir uno nuevo requiere editar `decode.js` y este SKILL.md a la vez.
- **No commitear nada de `.context/.temp/`.** El `.gitignore` del directorio se encarga (lo crea el propio script la primera vez).

Aplican las reglas de output de `_shared/output-rules.md`.
