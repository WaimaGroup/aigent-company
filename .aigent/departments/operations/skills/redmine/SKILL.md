---
name: "redmine"
version: "0.3.0"
description: >
  Skill ejecutable para Redmine via API REST: gestión de issues (listar, leer, crear, actualizar, comentar)
  y de tiempo (imputar horas, listar y editar imputaciones, listar actividades disponibles).
runtime: engine-v2

config:
  base_url:
    type: string
    required: true
    path: tools.redmine.base_url
    description: "URL base del Redmine sin trailing slash. Vive en .context/config.json bajo tools.redmine.base_url"

secrets:
  - name: REDMINE_API_KEY
    required: true
    description: "API key del usuario, disponible en /my/account de tu Redmine"

actions:
  list-issues:
    description: "Lista issues con filtros. Defaults: assigned_to_id=me, status_id=open, limit=25."
    impl: { type: http, ref: "list-issues" }
    inputs:
      project_id:
        type: string
        required: false
        description: "Identifier o id numérico del proyecto"
      assigned_to_id:
        type: string
        required: false
        default: "me"
        description: "Id de usuario o 'me'"
      status_id:
        type: string
        required: false
        default: "open"
        enum: [open, closed, "*"]
      limit:
        type: integer
        required: false
        default: 25
        description: "Máximo 100 por página"
    output:
      type: json
      description: "{ issues: [...], total_count, offset, limit }"

  get-issue:
    description: "Obtiene una issue por id. Permite incluir journals, attachments, relations."
    impl: { type: http, ref: "get-issue" }
    inputs:
      issue_id:
        type: integer
        required: true
      include:
        type: string
        required: false
        description: "Lista separada por comas: journals, attachments, relations, children, watchers"
    output:
      type: json
      description: "{ issue: {...} }"

  create-issue:
    description: "Crea una issue. Requiere project_id y subject. Resto opcional."
    impl: { type: http, ref: "create-issue" }
    inputs:
      project_id:
        type: string
        required: true
      subject:
        type: string
        required: true
      description:
        type: string
        required: false
      tracker_id:
        type: integer
        required: false
        description: "1=Bug, 2=Feature, 3=Support (depende de la instancia)"
      priority_id:
        type: integer
        required: false
      assigned_to_id:
        type: string
        required: false
    output:
      type: json
      description: "{ issue: {...} } con la issue recién creada"

  update-issue:
    description: "Actualiza una issue. Solo se envían los campos aportados. Para añadir solo un comentario, prefiere add-note."
    impl: { type: http, ref: "update-issue" }
    inputs:
      issue_id:
        type: integer
        required: true
      subject:
        type: string
        required: false
      description:
        type: string
        required: false
      status_id:
        type: integer
        required: false
      assigned_to_id:
        type: string
        required: false
      notes:
        type: string
        required: false
        description: "Comentario público que se añade al historial de la issue"
    output:
      type: json
      description: "204 No Content si OK; el engine devuelve { ok: true, data: null }"

  add-note:
    description: "Añade un comentario al historial de una issue sin tocar otros campos."
    impl: { type: http, ref: "add-note" }
    inputs:
      issue_id:
        type: integer
        required: true
      notes:
        type: string
        required: true
        description: "Texto del comentario"
      private_notes:
        type: boolean
        required: false
        default: false
        description: "Si true, el comentario solo es visible para roles con permiso de notas privadas"
    output:
      type: json
      description: "204 No Content si OK; el engine devuelve { ok: true, data: null }"

  list-projects:
    description: "Lista proyectos visibles para el usuario autenticado."
    impl: { type: http, ref: "list-projects" }
    inputs:
      limit:
        type: integer
        required: false
        default: 25
    output:
      type: json
      description: "{ projects: [...], total_count, offset, limit }"

  log-time:
    description: "Imputa horas a una issue. Requiere issue_id, hours y activity_id (consultar list-activities si dudas)."
    impl: { type: http, ref: "log-time" }
    inputs:
      issue_id:
        type: integer
        required: true
        description: "Id de la issue a la que se imputan las horas"
      hours:
        type: number
        required: true
        description: "Horas trabajadas (decimal). Ejemplos: 1, 0.5, 2.25"
      activity_id:
        type: integer
        required: true
        description: "Id de la actividad (Design, Development, Testing…). Usar list-activities para descubrir los disponibles."
      spent_on:
        type: string
        required: false
        description: "Fecha YYYY-MM-DD. Si se omite, Redmine usa la fecha de hoy."
      comments:
        type: string
        required: false
        description: "Descripción breve de lo que se hizo en ese tiempo"
    output:
      type: json
      description: "{ time_entry: {...} } con la imputación recién creada (HTTP 201)"

  list-activities:
    description: "Lista las actividades disponibles para imputar horas (Design, Development…). Útil antes de log-time."
    impl: { type: http, ref: "list-activities" }
    inputs: {}
    output:
      type: json
      description: "{ time_entry_activities: [{id, name, is_default, active}, ...] }"

  list-time-entries:
    description: "Lista imputaciones de horas con filtros. Defaults: user_id=me, limit=25."
    impl: { type: http, ref: "list-time-entries" }
    inputs:
      user_id:
        type: string
        required: false
        default: "me"
        description: "Id de usuario o 'me'"
      project_id:
        type: string
        required: false
      issue_id:
        type: integer
        required: false
      from:
        type: string
        required: false
        description: "Fecha inicio YYYY-MM-DD (inclusive)"
      to:
        type: string
        required: false
        description: "Fecha fin YYYY-MM-DD (inclusive)"
      limit:
        type: integer
        required: false
        default: 25
    output:
      type: json
      description: "{ time_entries: [...], total_count, offset, limit }"

  update-time-entry:
    description: "Actualiza una imputación existente. Requiere time_entry_id; el resto de inputs son opcionales y solo se aplican si se aportan. Devuelve 204 sin body."
    impl: { type: http, ref: "update-time-entry" }
    inputs:
      time_entry_id:
        type: integer
        required: true
        description: "Id de la imputación a editar (no confundir con issue_id)"
      hours:
        type: number
        required: false
        description: "Nuevas horas (decimal). Si se omite, no cambia."
      activity_id:
        type: integer
        required: false
        description: "Nueva actividad. Usar list-activities para descubrir ids."
      spent_on:
        type: string
        required: false
        description: "Nueva fecha YYYY-MM-DD"
      comments:
        type: string
        required: false
        description: "Nueva descripción"
      issue_id:
        type: integer
        required: false
        description: "Reasignar la imputación a otra issue"
      project_id:
        type: string
        required: false
        description: "Reasignar la imputación a otro proyecto (identifier o id)"
    output:
      type: json
      description: "204 No Content → el engine devuelve data: null. Para verificar el cambio, llamar después a list-time-entries."
---

# Skill: Redmine

Skill ejecutable contra la API REST de Redmine. Cubre operaciones deterministas sobre issues (listar/leer/crear/actualizar/comentar) y sobre imputación de tiempo (log + listado + actividades).

**Cuándo usar esta skill:**
- Necesitas datos de Redmine (issues, proyectos, imputaciones) para que un agente razone sobre ellos.
- Tienes que crear/actualizar tickets o imputar horas desde un proceso automatizado.
- Quieres ejecutar consultas repetitivas con bajo gasto de tokens.

**Cuándo NO usar:**
- Si la operación necesita decidir qué pedir o cómo redactar (descripciones de issues, comentarios elaborados, priorización), eso lo hace el agente; esta skill solo hace la llamada a la API.

**Requisitos:**
- `.context/config.json` con `tools.redmine.base_url` declarado.
- Env var `REDMINE_API_KEY` definido (o entrada en `.context/.secrets.json` para desarrollo local).

---

## Antes de ejecutar (precheck para el agente caller)

Antes de llamar a `run` por primera vez en una sesión, ejecuta el precheck:

```bash
node .aigent/v2/engine/engine.js doctor redmine
```

- Si `data.skills[0].ready === true` → adelante, ejecuta `run`.
- Si `ready: false` → **NO ejecutes `run`**. Inicia el flujo de configuración (delegando en `shared-skill-builder configure` o ejecutando `configure` + `prepare-secrets` directamente). Solo reintenta el `run` cuando un nuevo `doctor` devuelva `ready: true`.

**Regla de seguridad — secrets nunca por chat:** la `REDMINE_API_KEY` no se pide al usuario en la conversación. Si no está set, indícale: *"Abre `.context/.secrets.json` y reemplaza el placeholder `<replace_me_REDMINE_API_KEY>`. La generas en tu Redmine en `/my/account`. Alternativa: define la variable de entorno `REDMINE_API_KEY`."* Si el usuario intenta dictar la key por chat, rechaza el valor explícitamente.

**Errores reactivos.** Si por algún motivo se llamó a `run` sin precheck y devuelve `CONFIG_ERROR` o `SECRETS_ERROR`, leer `error.details.next` (comandos exactos) y `error.details.missing_secrets` (sólo nombres, nunca valores) para resolver el bloqueo.

---

## Acciones

Todas se ejecutan vía:

```
node .aigent/v2/engine/engine.js run redmine <action> --inputs '{"...": "..."}'
```

### list-issues

Lista issues con filtros básicos.

```http name="list-issues"
GET {{config.base_url}}/issues.json?project_id={{inputs.project_id?}}&assigned_to_id={{inputs.assigned_to_id}}&status_id={{inputs.status_id}}&limit={{inputs.limit}}
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Accept: application/json
```

### get-issue

```http name="get-issue"
GET {{config.base_url}}/issues/{{inputs.issue_id}}.json?include={{inputs.include?}}
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Accept: application/json
```

### create-issue

```http name="create-issue"
POST {{config.base_url}}/issues.json
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Content-Type: application/json
Accept: application/json

{
  "issue": {
    "project_id": "{{inputs.project_id}}",
    "subject": "{{inputs.subject}}",
    "description": "{{inputs.description?}}",
    "tracker_id": {{inputs.tracker_id?}},
    "priority_id": {{inputs.priority_id?}},
    "assigned_to_id": "{{inputs.assigned_to_id?}}"
  }
}
```

### update-issue

```http name="update-issue"
PUT {{config.base_url}}/issues/{{inputs.issue_id}}.json
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Content-Type: application/json
Accept: application/json

{
  "issue": {
    "subject": "{{inputs.subject?}}",
    "description": "{{inputs.description?}}",
    "status_id": {{inputs.status_id?}},
    "assigned_to_id": "{{inputs.assigned_to_id?}}",
    "notes": "{{inputs.notes?}}"
  }
}
```

### add-note

```http name="add-note"
PUT {{config.base_url}}/issues/{{inputs.issue_id}}.json
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Content-Type: application/json
Accept: application/json

{
  "issue": {
    "notes": "{{inputs.notes}}",
    "private_notes": {{inputs.private_notes}}
  }
}
```

### list-projects

```http name="list-projects"
GET {{config.base_url}}/projects.json?limit={{inputs.limit}}
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Accept: application/json
```

### log-time

Imputa horas a una issue. Si no sabes qué `activity_id` corresponde, primero `list-activities`.

```http name="log-time"
POST {{config.base_url}}/time_entries.json
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Content-Type: application/json
Accept: application/json

{
  "time_entry": {
    "issue_id": {{inputs.issue_id}},
    "hours": {{inputs.hours}},
    "activity_id": {{inputs.activity_id}},
    "spent_on": "{{inputs.spent_on?}}",
    "comments": "{{inputs.comments?}}"
  }
}
```
### list-activities

```http name="list-activities"
GET {{config.base_url}}/enumerations/time_entry_activities.json
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Accept: application/json
```

### list-time-entries

```http name="list-time-entries"
GET {{config.base_url}}/time_entries.json?user_id={{inputs.user_id}}&project_id={{inputs.project_id?}}&issue_id={{inputs.issue_id?}}&from={{inputs.from?}}&to={{inputs.to?}}&limit={{inputs.limit}}
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Accept: application/json
```

### update-time-entry

Actualiza una imputación existente. Devuelve 204 sin body. Todos los inputs salvo `time_entry_id` son opcionales — solo se aplican si se aportan.

```http name="update-time-entry"
PUT {{config.base_url}}/time_entries/{{inputs.time_entry_id}}.json
X-Redmine-API-Key: {{secrets.REDMINE_API_KEY}}
Content-Type: application/json
Accept: application/json

{
  "time_entry": {
    "hours": {{inputs.hours?}},
    "activity_id": {{inputs.activity_id?}},
    "spent_on": "{{inputs.spent_on?}}",
    "comments": "{{inputs.comments?}}",
    "issue_id": {{inputs.issue_id?}},
    "project_id": "{{inputs.project_id?}}"
  }
}
```

---

## Notas para el engine

- Auth: `X-Redmine-API-Key` en header (preferido sobre `?key=` en query string).
- `Accept: application/json` siempre, `Content-Type: application/json` en POST/PUT.
- `update-issue`, `add-note` y `update-time-entry` devuelven 204 sin body — el engine devuelve `data: null`.
- `log-time` devuelve 201 con el time_entry creado.
- Inputs marcados con `?` y ausentes en la llamada se omiten:
  - En query string: el parámetro completo desaparece (no genera `&key=`).
  - En body JSON: la clave se omite del objeto.
- Convención de tipos en body JSON: `string` con comillas, `integer/number/boolean` sin comillas. Ver convenciones-v2 sección 5.
- Paginación: Redmine usa `offset` y `limit`. Si necesitas paginar más allá del primer page, añade un input `offset` opcional a las acciones de listado.
