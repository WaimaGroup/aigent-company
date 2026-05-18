---
name: "shared-agent-scaffold"
user-invocable: true
description: >
  Plantilla única para crear o auditar un system prompt de agente del repo
  (especialista departamental, agente compartido o stub honesto de TODO).
  Decide el modo según el caso, recopila lo necesario, escribe el archivo en
  .aigent/departments/<dept>/agents/<agent>.md (o _shared/agents/) y verifica
  contra _shared/conventions.md §4-§5 y _shared/output-rules.md.
---

# Skill: Agent Scaffold

**Entregable:** un único archivo `.aigent/departments/<dept>/agents/<agent>.md` (o `.aigent/departments/_shared/agents/<agent>.md`) siguiendo las convenciones de `_shared/conventions.md` (§3-§5) y `_shared/output-rules.md`.

---

## Cuándo usar esta skill

Cuando hay que crear un nuevo agente en el repo, auditarlo contra las conventions, o convertir un stub honesto en un agente especialista activado. Esta skill cubre tres modos:

- **Modo `create-specialist`** — agente especialista de un departamento implementado (ej: `marketing-content`, `sales-ae`).
- **Modo `create-shared`** — agente transversal que vive en `_shared/agents/` y aplica a más de un departamento (ej: `shared-prd-agent`, `shared-skill-builder`).
- **Modo `create-stub`** — stub honesto para un departamento marcado como TODO. El frontmatter advierte explícitamente de que el agente no está implementado y no debe ejecutar.
- **Modo `audit`** — revisar un agente existente contra el checklist y proponer correcciones.

**Cuándo NO usar:**

- Para crear o auditar un orquestador → usar directamente `_shared/orchestrator-template.md` (no hay skill envuelta — es una plantilla).
- Para crear o auditar una skill → `skill-scaffold` (con `shared-skill-builder` como agente envuelto).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| `dept` | ¿De qué departamento? (`marketing`, `sales`, `operations`, `_shared`, …) |
| `role` | ¿Cuál es el rol del agente en kebab-case? (ej: `content`, `ae`, `prd-agent`) |
| `mode` | ¿Especialista (`create-specialist`), compartido (`create-shared`), stub (`create-stub`) o auditoría (`audit`)? |
| `entregable_humano` | (Solo specialist/shared) ¿Qué tipo de entregables va a producir el agente? Lista de 1-5 items. |
| `principios` | (Solo specialist/shared) 3-5 principios fundamentales que guían su trabajo. |
| `proceso` | (Solo specialist/shared) ¿Pasos numerados que sigue para responder a una petición típica? |
| `skills_propias` | (Solo specialist/shared) ¿Qué skills (nombre kebab-case) puede invocar este agente? Si ninguna por ahora, indicarlo explícitamente. |
| `restricciones` | (Solo specialist/shared) Lista de 3-5 cosas que el agente NO debe hacer. |
| `dept_status` | (Solo create-stub) ¿Cuáles son los otros agentes stub del mismo dept? Se citan en el body para que el cliente del IDE no se equivoque. |

---

## Plantilla del entregable

### Modo `create-specialist` — agente departamental implementado

```markdown
---
name: "[<Department>] <Role Humano>"
mode: subagent
description: >
  <Una frase clara: dominio, audiencia y casos de uso típicos. Empieza con
  "<Role> specialist for the <Department> department." y enumera disparadores
  típicos (ej. "Use me when you need: ..."). En inglés. >
---

## Rol

Eres el especialista en **<Nombre humano del rol>** del departamento de <Department>. Tu misión es <una línea sobre qué entrega y a quién sirve>.

## Principios fundamentales

- **<Principio 1>:** <una línea>
- **<Principio 2>:** <una línea>
- **<Principio 3>:** <una línea>
- **<Principio 4>:** <opcional>

## Proceso de trabajo

### Cuando recibes una petición de <dominio>:

1. **Clarifica** (si falta info): <preguntas mínimas que necesitas resolver antes de redactar>
2. **<Paso 2 del proceso>**
3. **<Paso 3 del proceso>**
4. **<Paso 4 del proceso>**

## Skills disponibles

Estas son las skills que conoces y puedes invocar cuando la petición encaje con su caso de uso. Cada skill tiene su propio `SKILL.md` con plantilla y proceso.

| Skill | Cuándo usarla |
|---|---|
| `<skill-1>` | <Una línea: qué entrega y cuándo aplica> |
| `<skill-2>` | <Ídem> |

Antes de redactar desde cero, comprueba si hay una skill que cubra el caso. Si la hay, sigue su plantilla y proceso.

> Si el agente todavía no tiene skills propias, sustituir la tabla por una nota explícita: "Este agente no tiene skills propias en este momento. Trabaja directamente con los datos y plantillas proporcionados por el usuario o generados a partir del contexto."

## Restricciones

- <Restricción 1: qué NO hacer>
- <Restricción 2>
- <Restricción 3>
- <Restricción 4>

## Output esperado

Aplican las reglas de output de `_shared/output-rules.md` (resumen: usar `Write`/`Edit`, nunca solo chat; los entregables van fuera de `.aigent/` y `.context/`).

Siempre entregar:
1. **Archivos creados** con la herramienta `Write` (nunca solo texto en el chat).
2. **Ruta exacta** del archivo generado.
3. **Resumen del entregable**: <qué métricas o señales del entregable comunicar al usuario>.
4. **Campos por completar**: marcar con `[COMPLETAR]` lo que el usuario debe verificar o añadir.
5. **Próximo paso sugerido**: qué skill o agente ejecutar a continuación.
```

### Modo `create-shared` — agente transversal `_shared/agents/`

Igual que `create-specialist` con dos diferencias:

- `name` del frontmatter usa `[Shared] <Role>` (ej: `[Shared] PRD — Product Requirements Document`).
- `description` empieza por el rol funcional ("Requirements capture and PRD writing specialist..."), sin prefijo de departamento — el agente sirve a cualquiera.
- El nombre del archivo es `shared-<role>.md` (ej: `shared-prd-agent.md`, `shared-skill-builder.md`).

### Modo `create-stub` — agente de departamento TODO

```markdown
---
name: "[<Department>] <Role Humano> (TODO)"
mode: subagent
description: >
  <Department> specialist for <role> tasks. Department is marked as TODO
  (not yet implemented). Do not act on this agent's invocation: inform the user that
  the <Department> department is not yet active.
---

## Estado

⚠️ Este agente forma parte del departamento de <Department>, que aún no está implementado.

## Qué hacer

Si el cliente te invoca directamente:

1. No ejecutes la tarea. El system prompt completo de este agente todavía no se ha redactado.
2. Informa al usuario de que el departamento de <Department> aún no está activo.
3. Sugiere registrar la petición en `.context/<proyecto>/<department>/tasks.md` (sección "📋 Pendiente — para futura implementación") con la fecha de la solicitud.
4. Si la petición consiste en redactar un PRD, sí puede delegarse al agente compartido `shared-prd-agent`.

Cuando el departamento se implemente, sustituir este archivo siguiendo `_shared/conventions.md` y los agentes de `marketing/agents/` como referencia.
```

---

## Reglas estrictas

### Naming y archivos

- **Carpeta y archivo:** `kebab-case`. Ej: `marketing-content.md`, `sales-ae.md`.
- **Especialistas:** prefijo `<dept>-` obligatorio en el nombre del archivo (`marketing-social.md`, no `social.md`).
- **Compartidos:** prefijo `shared-` obligatorio (`shared-prd-agent.md`, no `prd-agent.md`).
- **Frontmatter `name`:** `[<Department>] <Role>` para especialistas, `[Shared] <Role>` para compartidos. Capitalización correcta del departamento (`[HR]`, `[DevOps]`, no `[Hr]`/`[Devops]`).
- **Idioma:** frontmatter en inglés (campos `name`, `description`). Body en español. Nombres de archivos en inglés kebab-case.

### Frontmatter

- `name`, `mode` y `description` son obligatorios.
- `mode:` clasifica al agente para OpenCode (§5.1 de conventions): orquestadores → `primary`, especialistas y compartidos → `subagent`. Claude Code lo ignora; no rompe nada.
- `description` es lo que el IDE muestra al modelo para decidir si invocar al agente. Tiene que ser claro, accionable y enumerar los disparadores típicos. **NO mencionar MCPs aquí** — eso vive en el config del proyecto, no en el system prompt.
- `description` siempre con `>` (folded scalar) si ocupa varias líneas.

### Body — secciones obligatorias y orden (specialist + shared)

Según `_shared/conventions.md` §5, el body de un agente especialista o compartido tiene que incluir, en este orden:

1. `## Rol`
2. `## Principios fundamentales`
3. `## Proceso de trabajo`
4. `## Skills disponibles` (tabla; si no tiene skills, nota explícita)
5. `## Restricciones`
6. `## Output esperado` (referencia obligatoria a `_shared/output-rules.md`)

Secciones adicionales (frameworks que aplica, tipos de entregables, glosario de plataformas, checklists internos…) son opcionales y van **entre** "Proceso de trabajo" y "Skills disponibles" si añaden contexto operativo, o **dentro** de "Output esperado" si son específicas del cierre.

### Body — agente stub

El body se reduce a `## Estado` + `## Qué hacer`. No tiene "Rol", "Principios", etc. La regla es: si el dept es TODO, el agente no debe pretender capacidad que no tiene. Convención §9.

### Skills disponibles

- La asociación agente → skills vive **solo** en el agente, nunca en la skill. La skill no declara qué agentes la usan.
- Si el agente puede invocar una skill v2 ejecutable, listarla igual; el orquestador del dept ya gestiona el flujo de configuración (`shared-skill-builder configure`) si la skill no está lista. No duplicar ese flujo en el agente.

### MCPs

- **Nunca mencionarlos en el system prompt del agente.** El agente confía en que el IDE expone los MCPs disponibles con buenas `description`. La presencia/ausencia de MCPs en runtime es problema del IDE, no del agente.
- El inventario por proyecto vive en `.context/<proyecto>/config.json → mcps`.

### Output esperado

- **Obligatorio referenciar `_shared/output-rules.md`** en este sección. Una sola línea es suficiente: *"Aplican las reglas de output de `_shared/output-rules.md` (resumen: …)."*
- Las reglas específicas del agente (qué métricas reportar al usuario, dónde marcar `[COMPLETAR]`, etc.) **extienden** la regla universal, no la sustituyen.

---

## Verificación

### Checklist estructural (specialist + shared)

- [ ] Frontmatter parseable: delimitadores `---` correctos, `name` y `description` presentes, idioma inglés.
- [ ] `name` del frontmatter sigue formato `[<Dept>] <Role>` o `[Shared] <Role>`.
- [ ] `mode:` declarado en el frontmatter: `primary` para orquestadores, `subagent` para especialistas y compartidos (§5.1).
- [ ] Nombre del archivo en kebab-case con prefijo `<dept>-` o `shared-`.
- [ ] Body en español.
- [ ] Body contiene en orden: Rol → Principios → Proceso → (extras opcionales) → Skills disponibles → Restricciones → Output esperado.
- [ ] Sección "Skills disponibles" lista skills reales o explicita que no hay.
- [ ] Sección "Output esperado" referencia explícitamente `_shared/output-rules.md`.
- [ ] No se mencionan MCPs en el body.
- [ ] No se declara "qué agentes me usan" — eso no aplica a un agente.

### Checklist estructural (stub)

- [ ] Frontmatter con `name` que termina en `(TODO)` o `(no implementado)`.
- [ ] `description` indica explícitamente que el dept no está activo y que **no se debe ejecutar**.
- [ ] Body solo contiene `## Estado` + `## Qué hacer`.
- [ ] El cuerpo cita los otros agentes stub del mismo dept y advierte que también son stubs.
- [ ] El cuerpo ofrece la alternativa de registrar la petición en `tasks.md` y, si aplica, delegar PRDs en `shared-prd-agent`.

### Cruce con orquestador

- [ ] Si el agente es especialista, está listado en la sección "Agentes disponibles" del orquestador del dept con sus disparadores y casos de uso.
- [ ] La carpeta destino del agente en la "Tabla de outputs" del orquestador coincide con la realidad.

---

## Proceso

1. **Recopilar** los campos comunes (sección "Información a recopilar"). Decidir el modo con el usuario si hay duda.
2. **Decidir el modo** (`create-specialist` / `create-shared` / `create-stub` / `audit`).
3. **(Modos de creación)** Crear la carpeta destino si no existe (`.aigent/departments/<dept>/agents/` o `_shared/agents/`).
4. **(Modos de creación)** Escribir el archivo con la plantilla correspondiente, sustituyendo todos los `<...>`.
5. **(Modo audit)** Leer el archivo existente, evaluarlo contra el checklist, listar correcciones propuestas. Aplicarlas con `Edit` cuando el usuario confirme — o cuando esté claro que no hay decisión pendiente.
6. **Verificar** con el checklist estructural correspondiente.
7. **Cruzar con el orquestador** del dept (si aplica): asegurar que el agente está listado en "Agentes disponibles" y que su carpeta destino aparece en "Reglas de output".
8. **Reportar** al usuario:
   - Ruta del archivo creado o modificado.
   - (Audit) Resumen de correcciones aplicadas y propuestas.
   - Siguiente paso recomendado (registrar el agente en el orquestador, crear su primera skill con `skill-scaffold`, etc.).

---

## Restricciones

- **No crear un agente cuyo trabajo se cubre mejor con una skill.** Antes de crear, comprobar si lo que se quiere es una skill v1 (entregable estandarizado) o una skill v2 (operación HTTP determinista). Si lo es, derivar a `shared-skill-builder`.
- **No declarar capacidad sin body que la respalde.** Convención §9: nunca dejar un agente con `description` afirmando capacidad y body vacío. Si el dept es TODO, el agente es stub.
- **No mencionar MCPs ni nombres de herramientas concretas** (HubSpot, WordPress, Salesforce…) en el body como si fueran obligatorias. El agente debe seguir funcionando si el cliente usa otra herramienta del mismo dominio.
- **No duplicar `_shared/output-rules.md`.** Referenciarlo, no transcribirlo.
- **No declarar dependencias entre agentes en su system prompt.** La coordinación entre agentes la hace el orquestador del dept, no el agente.
- **No tocar `.claude/`, `.opencode/` ni ninguna carpeta de IDE.** Eso es trabajo del installer (`bash .aigent/IDE/install.sh --sync`).
- Aplican las reglas de output de `_shared/output-rules.md` con esta excepción explícita: el entregable de esta skill (el `.md` del agente) sí vive dentro de `.aigent/departments/<dept>/agents/`, porque el motor es lo que se está construyendo.
