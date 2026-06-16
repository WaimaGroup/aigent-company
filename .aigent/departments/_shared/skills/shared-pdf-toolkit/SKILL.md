---
name: "shared-pdf-toolkit"
user-invocable: true
description: >
  PDF manipulation toolkit built on the npm **`pdf-lib`** library — the
  library-backed WRITER/EDITOR counterpart of the zero-dependency
  `shared-pdf-reader` (which only reads). Use it to **merge** several PDFs into
  one, **split**/extract a page range into a new PDF, and **stamp** text (a
  seal, label or watermark) onto pages. This is a HYBRID skill: it installs
  `pdf-lib` on first use into a shared, gitignored cache (`.context/libs/`) and
  reuses it; it is NOT zero-dependency and needs `npm` available once to
  bootstrap (bundled or system). **Trigger whenever an agent must
  EDIT or ASSEMBLE PDFs** — combine downloaded tender annexes into one file,
  pull pages 1-10 out of a long document, stamp "APROBADO"/"CONFIDENCIAL"/a
  reference number onto a contract. Activation keywords: "unir PDFs", "merge
  pdf", "combinar pdf", "partir pdf", "extraer páginas", "split pdf", "sellar
  pdf", "estampar texto", "watermark pdf", "marca de agua", "añadir sello".
  **It does not extract text** (use `shared-pdf-reader`) and does not do OCR or
  rasterize. To read a PDF, pair it with `shared-pdf-reader`. Ships with
  `pdf.cjs` (Node 20+, dependency `pdf-lib` bootstrapped on demand).
---

# Skill: PDF toolkit (merge / split / stamp) vía librería `pdf-lib`

**Entregable:** un `.pdf` resultante de **unir**, **partir** o **sellar** PDFs, escrito en la ruta de outputs del dept. El path y las estadísticas se devuelven en el JSON de stdout.

Es la **contraparte escritora/editora** de `shared-pdf-reader` (cero-deps, solo lee). Juntas cubren el ciclo completo: el reader extrae texto/metadatos/páginas; este toolkit manipula el fichero. Apoyada en `pdf-lib`, paga el coste de una librería para hacer lo que el reader no puede.

**Archivos de la skill (fuente de verdad):**

```
shared-pdf-toolkit/
├── SKILL.md       ← este archivo (prosa + contrato CLI)
└── pdf.cjs        ← script Node 20+ (dependencia `pdf-lib`, bootstrap on-demand)
```

El script es **parte del contrato**. Si la prosa diverge del script, gana el script.

---

## El patrón híbrido (igual que `shared-docx-rich`)

- **Caché compartida y gitignored:** `pdf-lib` se instala en `.context/libs/node_modules/` — la misma caché que usa `shared-docx-rich`, fuera de `.aigent/`. El script asegura `libs/` en `.context/.gitignore`; las librerías no se commitean.
- **Bootstrap on-demand:** comprueba la caché; si falta, `npm install pdf-lib@<pin>` una vez; después reutiliza (`dep_installed_now: false`).
- **npm bundled o del sistema:** prefiere un `npm` bundled junto al Node del launcher (`.aigent/IDE/bin/deps/node_modules/npm`) si existe; si no, el del sistema (`installed_via`).
- **No se borra entre usos.** Se limpian los temporales, nunca la librería.
- **Versión fijada** en `pdf.cjs` (`DEP.version`) para reproducibilidad.
- **Dependencia de entorno:** el launcher garantiza Node, **no `npm`** (salvo que el runtime bundled lo conserve). Sin npm —ni bundled ni del sistema— y con caché vacía → `DEP_UNAVAILABLE` limpio.

---

## Cuándo usar esta skill

- **merge** — unir varios PDFs en uno (anexos de un pliego, capítulos, adjuntos).
- **split** — extraer un rango de páginas a un PDF nuevo (quedarse con las cláusulas relevantes).
- **stamp** — estampar texto en páginas: sello "APROBADO", "CONFIDENCIAL", número de expediente, marca de agua.

**Cuándo NO usar:**

- Hay que **leer/extraer texto, metadatos o buscar** en un PDF → **`shared-pdf-reader`** (cero-deps, sin red).
- PDF **escaneado** que requiere **OCR** → ni el reader ni este toolkit; usar un MCP/servicio de OCR.
- Crear un Word/Excel → `shared-docx-rich` / `shared-office-writer`.
- El entorno no tiene `npm` ni red → no se puede bootstrappear; avisar al usuario.

---

## Antes de ejecutar (precheck para el agente caller)

Una vez por sesión, antes del primer comando real:

```bash
.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-pdf-toolkit/pdf.cjs deps
```

- `ok: true` → librería lista (`installed_now` indica si se instaló ahora).
- `ok: false, code: DEP_UNAVAILABLE` → no hay `npm`: no reintentar, avisar al usuario.

`merge`/`split`/`stamp` también bootstrappean por sí mismos; el `deps` previo evita un error a mitad de flujo.

---

## Contrato CLI

```
.aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-pdf-toolkit/pdf.cjs <command> [opciones]

merge   --files a.pdf,b.pdf,c.pdf  --output out.pdf
        une los ficheros en orden. Mínimo 2.

split   --input in.pdf  --pages <spec>  --output out.pdf
        extrae páginas a un PDF nuevo. <spec> 1-based: all|N|N-M|N-|-M|1,3,5-7.

stamp   --input in.pdf  --text "<texto>"  --output out.pdf
        [--pages all|N|1-3] [--x 40] [--y 40] [--size 12] [--color C00000] [--opacity 1]
        estampa texto en las páginas indicadas (coordenadas en puntos desde abajo-izquierda).

deps    [--no-install]       comprueba/instala la dependencia.

comunes:
  --no-install   no instala la dependencia si falta (falla con DEP_MISSING).
  --help, -h     ayuda y exit 0.
```

### Output exitoso (stdout, exit `0`)

```json
{ "ok": true, "op": "merge", "inputs": 2, "pages": 3, "path": "anexos.pdf", "bytes": 43238, "dep_installed_now": false }
{ "ok": true, "op": "split", "source_pages": 42, "extracted": [1,2,3], "path": "extracto.pdf", "bytes": 8120, "dep_installed_now": false }
{ "ok": true, "op": "stamp", "stamped_pages": [1,2,3], "text": "APROBADO 2026", "path": "sellado.pdf", "bytes": 44159, "dep_installed_now": false }
```

### Códigos de error (stdout + stderr, exit `1`)

| Código | Significado |
|---|---|
| `BAD_ARGS` | Comando o argumentos faltantes/mal formados, rango de páginas inválido, argumento desconocido. |
| `INPUT_NOT_FOUND` | Un fichero de `--input`/`--files` no existe. |
| `BAD_PDF` | Un PDF no se pudo cargar (cifrado o corrupto). |
| `WRITE_FAILED` | Error al escribir el `--output`. |
| `DEP_MISSING` | Dependencia ausente y `--no-install`. |
| `DEP_UNAVAILABLE` | `npm` no disponible; no se puede bootstrappear. |
| `DEP_INSTALL_FAILED` | `npm install` falló. |
| `INTERNAL` | Cualquier otra excepción no esperada. |

---

## Proceso

1. **(Opcional) `deps`** una vez por sesión.
2. **Invocar** `merge` / `split` / `stamp` con sus argumentos; `--output` a la ruta de outputs del dept (fuera de `.aigent/` y `.context/`).
3. **Leer el JSON del stdout** y reportar el `path`.
4. **(Recomendado) verificar** el resultado con `shared-pdf-reader` (`count`, `search`) — round-trip cruzado lector↔escritor.
5. **Si `ok: false`**: `DEP_UNAVAILABLE` → avisar; `BAD_PDF` → el PDF está cifrado/corrupto; `BAD_ARGS` → corregir invocación.

---

## Limitaciones

- **stamp** escribe texto con la fuente estándar Helvetica (WinAnsi). Caracteres fuera de ese set pueden no renderizar; para texto complejo, embeber una fuente (ampliar `pdf.cjs`).
- **No rellena formularios AcroForm** en esta versión (capacidad de `pdf-lib`; añadir como comando `fill-form` cuando se necesite).
- **No descifra** PDFs protegidos con contraseña (`BAD_PDF`).
- **No extrae texto ni hace OCR** — eso es `shared-pdf-reader` / un MCP de OCR.
- **Pin de versión**: subir `DEP.version` requiere editar `pdf.cjs` y registrarlo.

---

## Restricciones

- Invocación **siempre** por el launcher `.aigent/IDE/bin/run` — nunca `node` a secas (convención §12.7-bis).
- Dependencia en la **caché compartida gitignored** `.context/libs/` — nunca se commitea (el script asegura `libs/` en `.context/.gitignore`).
- `--output` sin restricción de scope, respetando `_shared/output-rules.md`.
- Añadir un comando (ej. `fill-form`, `rotate`, `watermark-image`) requiere editar `pdf.cjs` y este SKILL.md a la vez.

Aplican las reglas de output de `_shared/output-rules.md`.
