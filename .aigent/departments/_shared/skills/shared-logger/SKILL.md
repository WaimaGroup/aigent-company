---
name: "shared-logger"
user-invocable: true
description: >
  Per-project work/debug logger. Records a structured, auditable trace of what
  the agent system is doing — delegations, skills run, deliverables produced,
  task imputations, uploads, and errors — as **JSON Lines** (one JSON event per
  line) under `.context/<project>/logger/session-<unixts>.jsonl`, and can
  consolidate a session into a single `.json` array ready to upload for
  debugging. **Trigger this skill whenever the system needs to record what it
  did, OR a flow imputes a task / uploads a result and the log should travel with
  it.** Typical moments to log: starting a working session, delegating to a
  specialist agent, running a v2 skill, writing a deliverable, imputing a task to
  a tracker (Redmine, Asana, Jira…), uploading a file (Drive, Box, CMS…), hitting
  an error. Activation keywords: "log", "logger", "registro", "traza", "debug",
  "guarda el log", "qué ha hecho el sistema", "adjunta el log", "log de la
  conversación", "log de la tarea", "session log", "JSONL", "exportar el log",
  "subir el log". Ships with `logger.cjs` (Node 18+, no dependencies) with
  subcommands init | log | end | export | list.
---

# Skill: Logger de trabajo (debug) por proyecto

Utility-skill sin dependencias que mantiene una **traza estructurada del trabajo del sistema**, pensada como herramienta de depuración: qué tarea se hizo, qué agente intervino, qué skills se ejecutaron, qué entregables salieron, qué se imputó o subió, y qué errores ocurrieron. Cada sesión se guarda como **JSON Lines** (un evento JSON por línea) y puede consolidarse en un único `.json` para subirlo de forma rápida.

- **`init`** — arranca una sesión nueva (`session_start`) y devuelve su `session_id`.
- **`log`** — anexa un evento a la sesión actual (o a `--session`). Si no hay sesión abierta, crea una.
- **`end`** — anexa un evento `session_end`.
- **`export`** — consolida la sesión `.jsonl` en un único `.json` (array de eventos) listo para subir; con `--end` la cierra antes.
- **`list`** — lista las sesiones del proyecto con su número de eventos.

El path resultante se devuelve en el JSON de stdout para que el agente caller siga el flujo.

**Archivos de la skill (fuente de verdad):**

```
shared-logger/
├── SKILL.md       ← este archivo (prosa + contrato CLI)
└── logger.cjs     ← script Node 18+ sin dependencias (init | log | end | export | list)
```

El script es **parte del contrato**. La prosa describe lo que el script hace; si diverge, gana el comportamiento real del script y se ajusta la prosa.

---

## Dónde se guarda

```
.context/
└── <proyecto>/
    └── logger/
        ├── session-1717581600.jsonl   ← log JSONL (un evento por línea), append-only
        └── session-1717581600.json    ← consolidado (export), array de eventos
```

`.context/<proyecto>/logger/` es **ruta de sistema** (como `.context/.temp/`), no un entregable de cliente: vive dentro de `.context/` a propósito. Por defecto se **commitea** (auditable; `.context/.gitignore` solo excluye `.secrets.json`). Si en algún proyecto se prefiere no versionar los logs, añadir `logger/` o `*/logger/` a `.context/.gitignore`.

> **Excepción consciente a output-rules.** La regla universal manda los *entregables* fuera de `.aigent/` y `.context/`. El log **no es un entregable**: es traza de depuración del propio sistema, por eso vive bajo `.context/<proyecto>/`.

---

## Cuándo usar esta skill

- Al **iniciar un trabajo** en un proyecto: `init` para abrir una sesión con frontera limpia (recomendado, pero `log` también auto-inicia si no hay sesión).
- En cada **paso relevante** del flujo: delegación a un especialista, ejecución de una skill v2, escritura de un entregable, imputación de una tarea, subida de un resultado, error.
- Cuando un flujo **imputa una tarea** (Redmine, Asana, Jira…) o **sube un resultado** (Drive, Box, CMS…): registrar el evento y, salvo que se diga lo contrario, adjuntar el log consolidado (`export`) junto al resultado.
- Para **depurar**: `export` produce un único `.json` que se sube tal cual para inspeccionar qué hizo el sistema.

**Cuándo NO usar:**

- Para guardar **entregables de cliente** → esos van fuera de `.context/` (ver `output-rules.md`).
- Para **secretos o PII**: el log se commitea por defecto. No registrar tokens, contraseñas ni datos personales sensibles en `--message`/`--data`.
- Como sustituto de `tasks.md`: el logger es traza de ejecución, no la gestión de tareas del proyecto.

---

## Modelo de evento

Cada línea del `.jsonl` es un objeto JSON. Campos fijos: `ts` (ISO 8601), `session_id`, `seq` (correlativo dentro de la sesión), `level`, `type`. El resto son opcionales y solo aparecen si se aportan.

| Campo | Origen | Notas |
|---|---|---|
| `type` | `--type` | `session_start` · `session_end` · `task` · `delegation` · `skill` · `deliverable` · `upload` · `imputation` · `error` · `note`. Cadena libre; usa el catálogo cuando aplique. |
| `level` | `--level` | `debug` · `info` (default) · `warn` · `error`. |
| `agent` | `--agent` | Quién produce el evento (ej. `marketing-orchestrator`). |
| `task` | `--task` | Id o descripción de la tarea (ej. `MKT-007`). |
| `action` | `--action` | Acción concreta (ej. `delegate`, `run`, `write`, `upload`). |
| `skill` | `--skill` | Skill implicada (ej. `marketing-copy`, `operations-redmine`). |
| `deliverable` | `--deliverable` | Ruta del entregable generado. |
| `target` | `--target` | Sistema destino al imputar/subir (ej. `redmine`, `drive`). |
| `status` | `--status` | `ok` · `error` · `pending` · … |
| `message` | `--message` | Texto libre. |
| `data` | `--data` | Objeto JSON arbitrario (payload estructurado). Debe ser JSON válido. |

---

## Proceso típico (para el agente caller)

1. **Resolver cwd** = raíz del proyecto donde vive `.context/` (igual que el resto de skills/engine).
2. **Abrir sesión** una vez al empezar:

   ```bash
   .aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-logger/logger.cjs init \
     --project <proyecto> --agent <orquestador-o-agente> \
     --message "Inicio de sesión: <petición del usuario en una línea>"
   ```

   Guarda el `session_id` devuelto y pásalo como `--session` en los `log` siguientes (frontera limpia). Si lo omites, `log` usa la sesión más reciente del proyecto.

3. **Registrar cada paso relevante:**

   ```bash
   .aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-logger/logger.cjs log \
     --project <proyecto> --session <session_id> \
     --type delegation --agent <orquestador> --action delegate \
     --skill marketing-copy --task MKT-007 \
     --message "Delego redacción del post a marketing-creative"
   ```

   ```bash
   .aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-logger/logger.cjs log \
     --project <proyecto> --session <session_id> \
     --type deliverable --action write --status ok \
     --deliverable "website/marketing/posts/post-x.md" \
     --message "Entregable generado"
   ```

4. **Al imputar una tarea o subir un resultado**, registra el evento y consolida:

   ```bash
   .aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-logger/logger.cjs log \
     --project <proyecto> --session <session_id> \
     --type upload --target drive --action upload --status ok \
     --deliverable "website/marketing/posts/post-x.docx" \
     --message "Subido a la carpeta Drive del cliente"

   .aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-logger/logger.cjs export \
     --project <proyecto> --session <session_id> --end
   ```

   El `.json` resultante se adjunta junto al resultado subido **salvo que el usuario diga lo contrario**.

5. **Leer el JSON de stdout** y usar `session_file` / `export_file` para el siguiente paso. Si `ok:false`, leer `error.code` (tabla más abajo).

---

## Contrato CLI

```
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-logger/logger.cjs <comando> [opciones]

comando:
  init      inicia sesión (evento session_start). Devuelve session_id.
  log       anexa un evento. Si no hay sesión, la crea (auto_inited: true).
  end       anexa un evento session_end.
  export    consolida la sesión .jsonl en un único .json (array). --end la cierra antes.
  list      lista las sesiones del proyecto.

opciones comunes:
  --project <nombre>     proyecto en .context/. Si solo hay 1, se autodetecta.
                         Si hay >1 y no se pasa → NO_PROJECT_SPECIFIED con la lista.
  --session <id>         sesión objetivo (session-1717581600 | 1717581600 | <fichero>.jsonl).
                         Default: la sesión más reciente del proyecto.
  --context-dir <ruta>   raíz del árbol .context/ (default: ".context").

campos del evento (opcionales):
  --type --level --agent --task --action --skill --deliverable --target --status --message --data

export:
  --out <ruta>           ruta del .json de salida (default: <logger>/<session-id>.json).
  --end                  escribe session_end antes de exportar.

  --help, -h             imprime ayuda y sale con exit 0.
```

### Output exitoso — init / log / end (stdout, exit `0`)

```json
{
  "ok": true,
  "op": "log",
  "project": "website-redesign",
  "session_id": "session-1717581600",
  "session_file": ".context/website-redesign/logger/session-1717581600.jsonl",
  "seq": 4,
  "events": 4,
  "auto_inited": false
}
```

### Output exitoso — export (stdout, exit `0`)

```json
{
  "ok": true,
  "op": "export",
  "project": "website-redesign",
  "session_id": "session-1717581600",
  "source": ".context/website-redesign/logger/session-1717581600.jsonl",
  "export_file": ".context/website-redesign/logger/session-1717581600.json",
  "events": 5
}
```

### Output exitoso — list (stdout, exit `0`)

```json
{
  "ok": true,
  "op": "list",
  "project": "website-redesign",
  "sessions": [
    {
      "session_id": "session-1717581600",
      "file": ".context/website-redesign/logger/session-1717581600.jsonl",
      "events": 5,
      "started": "2026-06-05T09:00:00.000Z",
      "modified": "2026-06-05T09:12:00.000Z"
    }
  ]
}
```

### Output con error (stdout + stderr, exit `1`)

stdout:

```json
{ "ok": false, "error": { "code": "NO_PROJECT_SPECIFIED", "message": "...", "details": { "available": ["a", "b"] } } }
```

stderr: `[ERROR NO_PROJECT_SPECIFIED] ...`

### Códigos de error

| Código | Significado |
|---|---|
| `BAD_ARGS` | Argumentos faltantes/mal formados, comando desconocido o `--level` inválido. |
| `NO_PROJECT` | No hay proyectos en `.context/` y no se pasó `--project`. |
| `NO_PROJECT_SPECIFIED` | Hay >1 proyecto y no se indicó cuál (`details.available` trae la lista). |
| `PROJECT_NOT_FOUND` | El `--project` indicado no existe en `.context/`. |
| `NO_SESSION` | (end/export) No hay ninguna sesión en el proyecto. |
| `SESSION_NOT_FOUND` | El `--session` indicado no existe. |
| `BAD_JSON` | `--data` no es JSON válido, o una línea del `.jsonl` está corrupta al exportar. |
| `WRITE_FAILED` | Error al crear el directorio o escribir el `.jsonl`/`.json`. |
| `INTERNAL` | Cualquier otra excepción no esperada. |

---

## Convenciones que aplican

- **Cwd = raíz del proyecto** donde vive `.context/`. Los paths devueltos son relativos al cwd cuando los args entraron relativos.
- **JSONL append-only**: cada `log` añade una línea; nunca reescribe el histórico. `export` deriva un `.json` sin tocar el `.jsonl`.
- **Naming `session-<unixts>.jsonl`** — el timestamp en el nombre da orden cronológico natural.
- **Una sesión = un trabajo/conversación.** Para fronteras limpias, `init` al empezar y pasar el `session_id` a los `log`. Sin `--session`, se usa la sesión más reciente.
- **Sin secretos ni PII en el log.** Se commitea por defecto; tratarlo como código fuente.
- **Invocación SIEMPRE por el launcher** `.aigent/IDE/bin/run`, nunca `node` a secas (convenciones §12.7-bis).

---

## Restricciones

- El script **no usa dependencias externas**: solo Node stdlib (`fs`, `path`). Compatible con Node 18+.
- **No registra automáticamente la transcripción literal del chat**: en un deployment no hay API garantizada para volcarla. El log es fiel al *trabajo* (eventos que el agente anexa), no una grabación textual de cada mensaje.
- **No gestiona rotación ni borrado** de logs antiguos. Si crecen, el mantenimiento es manual o por un proceso externo.
- **No es gestión de tareas**: `tasks.md` sigue siendo la fuente de verdad de tareas del proyecto.

Aplican las reglas de output de `_shared/output-rules.md`, con la excepción explícita de que el log vive bajo `.context/<proyecto>/logger/` (ver sección "Dónde se guarda").
