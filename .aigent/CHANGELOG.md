# Changelog

Todas las versiones notables del sistema Aigent se documentan aquí.
Formato: `## X.Y.Z — YYYY-MM-DD` seguido de cambios por departamento.

---

## 1.6.3 — 2026-05-11

### Fix `--dept all` / `-Dept all` en los instaladores

El flag CLI para instalar todos los departamentos no funcionaba: pasaba el literal `"all"` como nombre de departamento, e `install_dept` buscaba `departments/all/`, no encontraba nada e imprimía silenciosamente `📁 all` con `0 archivo(s)` sin instalar nada. El modo interactivo (botón "Todos") sí funcionaba porque ya expandía internamente a la lista real.

**Cambios concretos:**

- `.aigent/IDE/install.sh` (línea 693): tras resolver `$DEPT`, si vale `"all"` se expande a la lista real de departamentos vía `list_departments` antes de iterar. Los otros casos (single, csv, interactivo) siguen split por coma/espacio como antes.
- `.aigent/IDE/install.ps1` (línea 759): mismo fix en PowerShell usando `Get-Departments`.

Verificado: los 4 caminos funcionan — `--dept all` (expande), `--dept marketing` (single), `--dept marketing,sales` (csv) y modo interactivo (que nunca pasa "all" literal, sólo nombres reales).

Bump PATCH.

## 1.6.2 — 2026-05-11

### Migración GitLab → GitHub

El repositorio se ha movido de GitLab (`gitlab.com/cloudappi/i-y-d/aigent-company`) a GitHub (`github.com/WaimaGroup/aigent-company`). Se actualizan las referencias textuales en el README de la raíz y en los instaladores; no cambia el comportamiento del motor ni el contrato de skills.

**Cambios concretos:**

- `README.md` (raíz): sección "Repositorio" ahora apunta a GitHub.
- `.aigent/IDE/install.sh`: mensajes de `--update` y error de fetch ahora dicen GitHub (líneas 112, 131, 571, 591).
- `.aigent/IDE/install.ps1`: mismas correcciones para PowerShell (líneas 417, 444, 672, 691).

Cambio puramente textual sin tocar contrato de engine/skills. Bump PATCH.

## 1.6.1 — 2026-05-11

### Skill `linkedin-audit` — copy plain-text listo para pegar en LinkedIn

LinkedIn no acepta sintaxis markdown en el cuerpo del post: `**negrita**`, `## títulos`, listas con `-` y `[texto](url)` aparecen como texto literal. La skill ahora produce, además del análisis de métricas, una versión plain-text del copy lista para copiar y pegar.

**Cambios concretos en `marketing/skills/linkedin-audit/SKILL.md`:**

- **Entregable ampliado:** ahora son dos secciones añadidas al `.md` del post — `## MÉTRICAS OBJETIVO` (igual que antes) y `## COPY PARA LINKEDIN` (nueva). El copy original en markdown se mantiene intacto como fuente editable.
- **Frontmatter `description`** actualizado para reflejar la nueva capacidad.
- **Nuevo paso 8** en el proceso: "Generar copy plain-text listo para LinkedIn". Incluye tabla de transformaciones (negrita, cursiva, headings, listas, enlaces, código inline, citas) y reglas para saltos de línea, gancho, emojis (2–5 profesionales), enlaces penalizados (movidos a "Pegar en el primer comentario") y hashtags.
- **Plantilla del entregable** ampliada con el bloque `## COPY PARA LINKEDIN`.
- **Restricciones** nuevas: no modificar el copy original al generar la versión plain-text, no saturar con emojis, reflejar en plain-text la penalización de enlace externo si la hubo.
- Paso 9 (antes paso 8): añade recordatorio explícito al usuario de que `## COPY PARA LINKEDIN` es lo que se pega en LinkedIn, no la versión en markdown.

Cambio acotado a una skill v1 prosa; no toca convenciones, orchestrator-template ni engine. Bump PATCH.

## 1.6.0 — 2026-05-11

### Skill nueva - linkedin-audit

Nueva skill para auditar y crear posts de linkedin

## 1.5.0 — 2026-05-08

### Engine v2 — errores de readiness enriquecidos

`engine.js run` ahora devuelve `CONFIG_ERROR` y `SECRETS_ERROR` con `details` estructurado en lugar de sólo un string en `message`. El agente caller no necesita parsear texto: lee directamente qué falta y qué hacer.

**Forma del error:**

```json
{
  "ok": false,
  "error": {
    "code": "CONFIG_ERROR" | "SECRETS_ERROR",
    "message": "...",
    "details": {
      "skill": "<skill>",
      "missing_config":  [{ "key", "path", "type", "description" }],
      "missing_secrets": [{ "name", "description" }],
      "secrets_file": "/abs/path/.context/.secrets.json",
      "next": [ "...comandos exactos a ejecutar..." ],
      "rule": "Los secretos NUNCA se aceptan por chat. Solo se le indica al usuario donde ponerlos."
    }
  }
}
```

Cambios concretos en `engine/engine.js`: nueva función `readinessError(code, message, found)` que reutiliza `doctorOne` (de `configure.js`) para construir el reporte y la lista de pasos siguientes con los comandos exactos (`configure --set ...`, `prepare-secrets`, `doctor`). `runAction` la llama desde los `catch` de `loadConfig` / `loadSecrets`.

### Documentación — precheck proactivo como camino principal

Hasta 1.4.0 la red de seguridad era **reactiva**: el agente llamaba a `run`, recibía el error y entonces delegaba en `shared-skill-builder configure`. El usuario no veía nada hasta que algo fallaba. A partir de 1.5.0 el camino preferido es **proactivo**: ejecutar `doctor <skill>` antes del `run` y, si `ready: false`, lanzar el flujo de configuración antes de pedir inputs reales.

**Archivos actualizados:**

- `_shared/conventions.md`
  - §12.7 — añadido el contrato de los nuevos errores de readiness enriquecidos.
  - §12.8 — dos reglas nuevas en negrita: **Precheck proactivo (regla de oro)** y **Secrets nunca por chat (regla de seguridad)**. La segunda incluye el wording exacto para rechazar al usuario si intenta dictar un secreto.
  - §6 — el título de la sección obligatoria del orquestador pasa de "Manejo de skills v2 no configuradas" a "Manejo de skills v2 — readiness".
- `_shared/orchestrator-template.md` — la sección "Manejo de skills v2 — readiness" se reorganiza en dos caminos (proactivo principal + reactivo fallback) con un único flujo de configuración común y un bloque "Reglas (innegociables)".
- `_shared/skills/skill-scaffold/SKILL.md` — la plantilla v2 ahora obliga a incluir una sección **"Antes de ejecutar (precheck para el agente caller)"** justo después de Requisitos y antes de Acciones. El checklist estructural (paso 0 de la verificación v2) la verifica explícitamente.
- `_shared/agents/shared-skill-builder.md` — el modo `configure` distingue tres disparadores con el mismo proceso: tras `create-v2`, **proactivo** (recomendado: orquestador hace `doctor` y delega antes de `run`), **reactivo** (un `run` ya falló). Refuerzo en el paso 3: la regla "secrets nunca por chat" es **innegociable**, aplica también si el usuario insiste o argumenta entorno de desarrollo.
- `operations/skills/redmine/SKILL.md` — añadida la sección "Antes de ejecutar (precheck)" con el wording específico de la skill (`<replace_me_REDMINE_API_KEY>`, link a `/my/account`).
- `sales/sales-orchestrator.md` — sincronizado con la nueva versión de la plantilla.

### Redmine — nueva acción `update-time-entry` (skill 0.3.0)

Antes la única forma de editar una imputación era ir por web/curl manualmente. Añadida acción `update-time-entry` que mapea a `PUT /time_entries/:id.json`. Inputs: `time_entry_id` (required) + `hours`, `activity_id`, `spent_on`, `comments`, `issue_id`, `project_id` opcionales (sólo se envían si se aportan). Devuelve 204 → `data: null`. La skill pasa de 9 a 10 acciones; `validate` ok con 0 warnings.


## 1.4.0 — 2026-05-08

### Secretos — nueva ubicación: `.context/.secrets.json`

**Cambio limpio (sin retrocompatibilidad — fases iniciales).** Los secretos se mueven de `.aigent/v2/.secrets.json` a `.context/.secrets.json`. Razones:

- `.aigent/` es "el motor", los agentes no escriben ahí. `.context/` sí lo manejan los agentes.
- `.context/` se commitea, pero se añade un `.context/.gitignore` que excluye específicamente `.secrets.json` (el resto de `.context/` sigue commiteándose: config, prd, tasks).
- El engine auto-crea `.context/`, `.context/.gitignore` y `.context/.secrets.json` si no existen al llamar a `prepare-secrets`. Cero setup manual.

### Cambios concretos

- **`engine/configure.js`**: `SECRETS_PATH` apunta a `.context/.secrets.json`. Nueva función `ensureContextWithGitignore()` que se llama desde `prepareSecrets`.
- **`engine/engine.js`**: `SECRETS_PATH` se importa de `configure.js` (ya no se duplica).
- **Eliminado** `.aigent/v2/.secrets.example.json` (innecesario; el engine genera placeholders dinámicamente desde el manifest).
- **Eliminado** `.aigent/v2/.secrets.json` antiguo si existía. `.aigent/v2/.gitignore` simplificado (sólo node_modules y similares).
- **Installers** (`install.sh` / `install.ps1`): nueva función `install_context_secrets` / `Install-ContextSecrets` que crea `.context/.gitignore` y `.context/.secrets.json` vacío en primera pasada (no en `--sync`).
- **Documentación actualizada** en `_shared/conventions.md` (§1, §12.5, §12.8, §12.9), `_shared/agents/shared-skill-builder.md`, `_shared/orchestrator-template.md`, `_shared/skills/skill-scaffold/SKILL.md`, `operations/skills/redmine/SKILL.md`, `v2/README.md`.

### Migración para usuarios existentes

Si tenías `.aigent/v2/.secrets.json` con valores: cópialos manualmente a `.context/.secrets.json` (mismo shape) y bórralo. O ejecuta `prepare-secrets <skill>` y rellena los placeholders. No hay fallback automático del engine (clean cut).

### Triple red de seguridad

El scaffold del fichero (`.context/.gitignore` + `.context/.secrets.json`) lo hacen **tres** sitios independientes para que sea imposible quedarse sin él:

1. **BOSS bootstrap** (al arrancar cada sesión): pasos 2-3 del bootstrap en `BOSS.md`. Si falta, lo crea silenciosamente.
2. **Installer** (`install.sh` / `install.ps1`, primera pasada): función `install_context_secrets`.
3. **Engine** (al llamar `prepare-secrets`): función `ensureContextWithGitignore` en `configure.js`.

Cualquiera de los tres garantiza que la estructura existe. Si el usuario borra el fichero, el siguiente arranque o el siguiente `prepare-secrets` lo restaura.

## 1.3.0 — 2026-05-08

### Orquestadores — red de seguridad para skills v2
- Nueva sección obligatoria en `_shared/orchestrator-template.md`: **"Manejo de skills v2 no configuradas"**.
- Documenta el flujo: cuando un agente reporta `CONFIG_ERROR` o `SECRETS_ERROR` del engine, el orquestador detiene la tarea, delega en `shared-skill-builder configure <skill>`, espera a que la skill esté lista (`doctor` ready), y reintenta el `run` original.
- Refuerza la regla: ni el orquestador ni los agentes aceptan valores de secret por chat. Sólo `shared-skill-builder` toca config/secrets, y vía engine.
- `_shared/conventions.md` §6 (estructura mínima de orquestador) actualizado para incluir esta sección entre las obligatorias.

## 1.2.0 — 2026-05-08

### Engine v2 — onboarding de skills
- Comando `doctor [<skill>]` — reporta estado de config + secrets de una o todas las skills. JSON estructurado: `{ skill, ready, config[], secrets[], missing_count }`.
- Comando `configure <skill> --set <path>=<value> [--scope global|project]` — escribe valores en `.context/config.json` validando contra el manifest. Admite múltiples `--set`. Type-coercion automática (string/integer/number/boolean/array). Atómico (escribe vía .tmp + rename).
- Comando `prepare-secrets <skill>` — garantiza placeholders en `.aigent/v2/.secrets.json` para los secrets pendientes. NUNCA acepta valores por CLI; el usuario los rellena a mano. Reporta los pendientes con instrucciones.
- Nuevo módulo `engine/configure.js`. `engine/config.js` exporta `getByPath`, `GLOBAL_CONFIG`, `CONTEXT_DIR` para reuso.

### Skill builder — modo configure
- Nuevo modo `configure` en `shared-skill-builder` (5º modo: create-v1, create-v2, configure, audit, add-action).
- `create-v2` ahora encadena `configure` automáticamente como paso 6: la skill nace creada **y configurada**. No se cierra create-v2 con la skill sin onboarding.
- El modo `configure` también es punto de entrada para "skill ya existe pero no está set up" o cuando un orquestador re
