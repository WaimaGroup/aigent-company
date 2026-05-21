# Convenciones del repo `.aigent/`

> Documento de referencia rápida. Aplica a cualquier archivo dentro de `.aigent/`.

---

## 1. Estructura de carpetas

```
.aigent/
├── README.md · BOSS.md
├── departments/
│   ├── _shared/
│   │   ├── conventions.md · output-rules.md · orchestrator-template.md
│   │   ├── agents/{shared-prd-agent.md, shared-skill-builder.md}
│   │   └── skills/skill-scaffold/
│   └── <department>/
│       ├── <department>-orchestrator.md
│       ├── agents/<department>-<role>.md
│       └── skills/<skill-name>/SKILL.md
├── v2/
│   └── engine/                       ← engine genérico (transversal)
└── IDE/
    ├── install.sh · install.ps1 · README.md
    └── .mcp.json · opencode.json
```

## 2. `_shared/` no es namespace runtime

`_shared/` solo agrupa archivos transversales en el repo. En runtime los agentes viven en un único directorio plano del cliente y se referencian por su nombre con prefijo. **Todo agente lleva en su nombre el grupo al que pertenece.**

```
✅ Delegar a `shared-prd-agent`
❌ Delegar a `_shared/prd-agent`  ← `_shared/` es solo carpeta
❌ Delegar a `prd-agent`          ← falta prefijo de pertenencia
```

## 3. Idioma

- **Frontmatter (`name`, `description`):** inglés.
- **Body (rol, principios, proceso, tablas, ejemplos):** español.
- **Nombres de archivo y carpeta:** inglés, kebab-case.

## 4. Naming

| Elemento | Regla | Ejemplo |
|---|---|---|
| Carpeta de departamento | inglés, una palabra cuando posible | `marketing`, `sales`, `legal` |
| Orquestador | `<dept>-orchestrator.md` | `marketing-orchestrator.md` |
| Agente especialista | `<dept>-<role>.md` kebab-case | `marketing-social.md` |
| Agente compartido | `shared-<role>.md` | `shared-prd-agent.md`, `shared-skill-builder.md` |
| Skill (carpeta del repo) | `<dept-prefix>-<base>` + `SKILL.md` | `marketing/skills/marketing-blog-post/SKILL.md` |
| Frontmatter `name` skill | igual al nombre de la carpeta | `marketing-blog-post`, `shared-skill-scaffold`, `operations-redmine` |
| Frontmatter `name` orq. | `[Department] Orchestrator` | `[Marketing] Orchestrator` |
| Frontmatter `name` agente | `[Department] <Role>` | `[Marketing] Social Media`, `[Shared] Skill Builder` |
| Capitalización `[Dept]` | título correcto | `[HR]`, `[DevOps]` (no `[Hr]`, `[Devops]`) |

### 4.1 Regla: carpeta y `name:` llevan prefijo del dept, y son iguales

Tanto la **carpeta** como el **`name:` del frontmatter** de toda skill (v1 y v2) llevan el prefijo del departamento al que pertenece, separado por guion. Y coinciden uno a uno: el `name:` es exactamente el nombre de la carpeta.

| Ubicación en el repo | Prefijo de carpeta | Ejemplo |
|---|---|---|
| `departments/<dept>/skills/<x>/` | `<dept>-` | `marketing/skills/marketing-blog-post/` → `name: "marketing-blog-post"` |
| `departments/_shared/skills/<x>/` | `shared-` | `_shared/skills/shared-competitive-analysis/` → `name: "shared-competitive-analysis"` |

**Excepción: no doblar prefijo.** Si la "base" del nombre ya empieza por el prefijo del dept (caso histórico: `marketing-plan`, `product-roadmap`, `sales-playbook`, `design-token-set`...), la carpeta se queda tal cual y el `name:` también. **No** se genera `marketing-marketing-plan/`. Mecánicamente: si `<carpeta>` empieza por `<dept>-`, ya es válida; si no, el nombre canónico es `<dept>-<carpeta>`.

Motivación: evitar colisiones cuando todas las skills acaban en un único directorio plano del IDE (`.claude/skills/`, `.opencode/skills/`), hacer obvio el dept de origen al leer cualquier referencia, y eliminar el drift entre source y stub — el installer ya no manipula el nombre, solo copia.

**Engine v2:** la skill se invoca por su `name:`, que coincide con el dirname. `engine.js run operations-redmine list-issues`. El `path:` de `config:` (p. ej. `tools.redmine.base_url`) es independiente del `name:` y puede mantenerse sin prefijo si la config ya existía — o pasar a `tools.<name>.<...>` para skills nuevas.

**Lint del engine:** `engine.js validate <skill>` emite un warning si `manifest.name` no coincide con el dirname.

## 5. Estructura mínima de un agente

Secciones obligatorias en este orden:

```markdown
---
name: "[Department] Role"
mode: primary | subagent
description: > ...
---

## Rol
## Principios fundamentales
## Proceso de trabajo
## Skills disponibles      ← tabla de skills que este agente puede invocar
## Restricciones
## Output esperado          ← debe contener: "Aplican las reglas de output de _shared/output-rules.md"
```

### 5.1 Campo `mode:` — clasificación para OpenCode

OpenCode lee el frontmatter de los agentes y necesita saber si un agente es **punto de entrada** (el usuario habla con él directamente) o **ejecuta delegado** (otro agente lo invoca como subagente). El campo `mode:` lo declara explícitamente. Claude Code lo ignora; no rompe nada en ningún IDE.

| Tipo de agente | `mode:` | Por qué |
|---|---|---|
| Orquestador (`<dept>-orchestrator.md`) | `primary` | Es la puerta de entrada del departamento. BOSS delega aquí; el orquestador delega luego en especialistas. |
| Especialista (`<dept>-<role>.md`) | `subagent` | Lo invoca su orquestador; el usuario no debería hablarle directamente. |
| Compartido (`shared-<role>.md`) | `subagent` | Lo invocan orquestadores o BOSS; nunca es entrada directa. |

El template `_shared/orchestrator-template.md` lleva `mode: primary`. Los scaffolds de agentes (`shared/skills/agent-scaffold`) deben generar el modo correcto según la subskill (`create-specialist` → `subagent`, `create-shared` → `subagent`, orquestadores → `primary`).

## 6. Estructura mínima de un orquestador

Sigue `_shared/orchestrator-template.md`. Secciones obligatorias: frontmatter, Rol, Paso 0 (proyecto activo), Paso 0.5 (primera vez en proyecto: confirmar `paths` + `mcps`), Ficheros a leer, Gestión de tareas, Agentes disponibles, Proceso de delegación (simple/compuesto/ambiguo), Tabla de decisión rápida, Comportamiento en tareas compuestas, **Manejo de skills v2 — readiness** (precheck proactivo con `doctor` antes de `run` + red de seguridad reactiva tras `CONFIG_ERROR`/`SECRETS_ERROR` → delegar en `shared-skill-builder configure` → reintentar; secrets nunca por chat), Cuándo NO delegar, Restricciones, Reglas de output (referencia a `_shared/output-rules.md` + carpetas del dept), Principio de cierre.

## 7. Estructura mínima de una skill v1

```markdown
---
name: "<dept-prefix>-<carpeta>"   # §4.1 — ej. "marketing-blog-post", "shared-case-study"
description: > ...
user-invocable: true               # §7.1
---

# Skill: <Nombre>
**Entregable:** ...

## Cuándo usar esta skill
## Información a recopilar
## Plantilla de entregable
## Proceso
```

**La skill no declara qué agentes la usan.** El agente conoce sus skills, no al revés. La asociación vive en la sección `## Skills disponibles` del agente.

> **Excepción — utility-skills compartidas** (categoría introducida en framework 3.4.0): no se listan en agentes. Se autodescubren vía la `description` del frontmatter cuando el LLM detecta que el contexto las requiere. Ver §7.1, subsección "Tres categorías: meta, business, utility".

> Para skills v2 (ejecutables por engine), ver §12.

### 7.1 Campo `user-invocable:` — quién puede llamar a la skill

Toda skill del repo (v1 prosa, v2 ejecutable, meta-skill) lleva `user-invocable: true` en el frontmatter. Es la marca que tanto Claude Code como OpenCode usan para decidir si una skill aparece en el menú del usuario o solo está disponible cuando un agente la invoca programáticamente.

Política del repo: **todas las skills son `user-invocable: true`**. La barrera para "esto no lo debería usar el usuario directamente" se pone en la `description` (que explica para quién es) y en la lógica del agente que la consume, no en restringir el flag. Mantener una sola convención simplifica el contrato.

Si en el futuro aparece una skill que de verdad no debe poder lanzarse fuera de su agente caller (caso teórico: una acción peligrosa sin guardrails), se discute caso a caso y se justifica en su `description`. Hasta entonces, **`user-invocable: true` es obligatorio** en todo SKILL.md nuevo o existente.

## 7.1 Skills compartidas en `_shared/skills/`

Una skill puede vivir en dos sitios: en un dept (`.aigent/departments/<dept>/skills/<name>/`) o en `_shared/skills/<name>/`. La segunda ubicación está reservada para skills que **varios agentes de departments distintos consumen con la misma estructura de entregable**.

### Cuándo vive en `_shared/skills/`

Todos los criterios deben cumplirse:

1. **≥2 departments la usan o la usarán razonablemente.** Si solo un dept la necesita, vive en ese dept.
2. **El entregable es genuinamente idéntico.** No solo el nombre coincide: la plantilla, la información a recopilar y el proceso son los mismos. Si cada dept la quiere de forma distinta, son dos skills distintas.
3. **No hay matices fuertes por dept** que justifiquen una plantilla propia. La skill compartida puede tener placeholders genéricos que el agente caller adapta al contexto, pero la estructura del entregable no cambia.

**Si en algún momento una skill compartida empieza a recibir "variantes por dept"**, es señal de que debe duplicarse y vivir en cada dept con su matiz. **No se fuerza** lo compartido; se mantiene compartido solo mientras siga siendo el mismo entregable.

### Naming

- **Sin prefijo.** Las skills compartidas siguen el mismo naming que cualquier skill: kebab-case directo (ej. `competitive-analysis`, `case-study`, `kpi-dashboard`). No llevan `common-` ni `shared-` — la carpeta `_shared/skills/` ya identifica la ubicación, el nombre identifica el entregable. Coherente con `skill-scaffold` y `agent-scaffold` que tampoco llevan prefijo.
- La regla §7 sigue aplicando: la skill no declara qué agentes la usan.

### Tres categorías: meta, business, utility

`_shared/skills/` aloja **tres tipos de skills**, conviviendo en la misma carpeta sin subcarpetas. Se distinguen por dominio (no por ubicación), y **dos de las tres se invocan de forma distinta**:

| Categoría | Ejemplos | Cómo se invoca | Listada en agentes |
|---|---|---|---|
| **Meta-skills** — construyen el sistema | `shared-skill-scaffold`, `shared-agent-scaffold` | Las invoca otra meta-skill o agente compartido (`shared-skill-builder`, `shared-prd-agent`) | No habitualmente; uso interno del framework |
| **Business-skills compartidas** — entregables transversales | `shared-competitive-analysis`, `shared-case-study`, `shared-kpi-dashboard`, `shared-okr-set`, etc. | El agente caller la lista en su `## Skills disponibles` y la invoca explícitamente | **Sí, en cada agente que la use** |
| **Utility-skills** — utilidades técnicas con script propio | `shared-base64-to-file` | **Autodescubrimiento por el LLM** vía `description` del frontmatter cuando el contexto matchea | **No** — sería propagar lo mismo en N agentes sin valor |

Todas siguen las mismas convenciones de naming, frontmatter, idioma y `user-invocable: true`. La diferencia está en el contrato de invocación.

### Contrato de las utility-skills (autodescubrimiento)

Una **utility-skill** cumple los siguientes criterios — si alguno no se cumple, no es utility (es business o meta):

1. **Es una utilidad técnica transversal**, no un entregable de dominio. No produce contenido humano (post, brief, dashboard); produce o transforma un artefacto (decodificar, validar, convertir, hashear, etc.).
2. **Lleva un script propio** al lado del `SKILL.md` (carpeta de la skill con `SKILL.md` + `<script>.js|.mjs|.sh`). El SKILL.md es la prosa, el script es la ejecución.
3. **Ningún dept la "posee"** — cualquier agente, en cualquier dept, puede beneficiarse. Listarla en agentes concretos es ruido (propagas la misma referencia en 5 sitios) o es incompleto (falta en el agente 6 que la necesitaba).
4. **El descubrimiento depende de la `description`**, no de un agente. La `description` del frontmatter debe ser rica en triggers semánticos: vocabulario específico del problema, sinónimos, formatos o sistemas concretos. Si la skill puede aparecer en cualquier conversación, su `description` debe contenerlo para que el LLM la active.

**Implicaciones para el `description`:** las utility-skills son las únicas donde el `description` debe ir más allá de "qué hace": debe incluir explícitamente los **triggers de activación** (palabras, formatos, fuentes de datos típicas). El LLM activa la skill cuando ese vocabulario aparece en el contexto.

**Implicaciones para el `audit`:** una utility-skill **no debería aparecer** en la tabla `## Skills disponibles` de ningún agente. Si aparece, hay que decidir: o la skill no era utility (cambiar categoría) o la referencia en el agente sobra (eliminarla). Mantener referencias inconsistentes es la peor opción.

### Cómo las invocan los agentes (resumen)

- **Business-skill compartida**: el agente la lista en su `## Skills disponibles` y la invoca explícitamente cuando el flujo lo pide. Igual que una skill de dept.
- **Utility-skill compartida**: no se lista en ningún agente. El LLM la descubre vía `description` y la activa cuando el contexto matchea. Cualquier agente puede usarla sin haberla declarado.
- **Meta-skill**: la invoca otra meta-skill o un agente compartido del propio framework (`shared-skill-builder`, `shared-prd-agent`); no es habitual que un agente de dept la liste.

Para business-skills, la referencia en el agente sigue siendo simple:

```markdown
| Skill | Cuándo usarla |
|---|---|
| `shared-competitive-analysis` | Matriz comparativa estructurada de competidores |
| `shared-case-study` | Caso de éxito con problema → solución → resultados medibles |
```

No se referencia la ubicación física en la tabla del agente; el repo sabe dónde encontrarla.

### Distribución (installer)

`install.sh` y `install.ps1` propagan **siempre** `_shared/` a cualquier IDE configurado, independientemente de qué departments el usuario haya seleccionado. Esto significa que toda skill compartida está disponible en cualquier instalación.

**No hay que tocar el installer cada vez que se añade una skill compartida** — basta con dejarla en `_shared/skills/<name>/SKILL.md` y la propagación es automática (regenerable con `bash .aigent/IDE/install.sh --sync`).

### Cuándo NO usar `_shared/skills/`

- Si la skill solo la consume un agente: vive en el dept de ese agente.
- Si el entregable es altamente específico del dominio (ej. `landing-page` cambia mucho entre marketing y product → vive en cada dept).
- Si la skill depende de tooling o terminología muy particular de un dept (ej. `prospecting-list` es de Sales; no se generaliza).

## 8. MCPs

- Lista canónica de recomendados por dept: `.aigent/README.md` (sección MCPs).
- Inventario vigente del proyecto: `.context/<proyecto>/config.json` → `mcps`.
- Lo rellena el orquestador del dept en su Paso 0.5 (primera vez en el proyecto).
- **No se mencionan MCPs en system prompts de agentes.** Buena `description` en el IDE = uso correcto.
- `.aigent/IDE/.mcp.json` y `opencode.json` son plantillas técnicas, no recomendaciones.

## 9. Departamentos implementados vs TODO

- **Implementado:** orquestador con system prompt completo y al menos un agente con system prompt completo.
- **TODO:** orquestador y agentes con frontmatter, pero body que indica explícitamente que no están implementados y no deben delegar/ejecutar.

Nunca dejar un orquestador o agente con `description` afirmando capacidad y body vacío.

## 10. Configuración — dos ficheros, dos niveles

La configuración se divide en dos ficheros con scope distinto. BOSS siempre carga ambos al arrancar (el proyecto sobreescribe o amplía el global).

### 10.1 El proyecto activo no se guarda — se deduce de la estructura

No existe ningún campo `active_project` ni equivalente en `config.json`. **La fuente de verdad es la estructura `.context/`:** cada subcarpeta directa que no empiece por `.` es un proyecto.

Reglas de resolución (las aplica BOSS al inicio de cada delegación, y el engine v2 al cargar config):

1. Si el usuario menciona explícitamente un nombre que existe como `.context/<X>/` → ése.
2. Si hay exactamente **1 carpeta de proyecto** → ése (silencioso).
3. Si hay **varias** y el usuario no mencionó ninguna → **preguntar al usuario cuál**.
4. Si hay **0** y la petición lo requiere → preguntar para crear una.

El engine v2 expone `--project <name>` en `run`, `dry-run` **y `configure --scope project`**. Si solo hay 1 proyecto en `.context/`, lo autodetecta. Si hay >1 y no se pasa el flag (cuando hace falta), devuelve `NO_PROJECT_SPECIFIED` con la lista.

**Patrón habitual de configuración:**
- La gran mayoría de valores van al config global con `engine.js configure <skill> --set ... ` (default `--scope global`). Una sola fuente de verdad por skill, válida para todos los proyectos.
- Cuando un proyecto necesita un **override puntual** (ej. proyecto piloto que usa una URL de Redmine staging mientras el resto usa producción), el agente decide y pasa `--scope project --project <name>`. El valor se escribe en `.context/<proyecto>/config.json` bajo el mismo `path:` declarado en el manifest. En `run`/`dry-run`, el config del proyecto **sobreescribe** al global vía `deepMerge`.
- Las decisiones de qué va en cada nivel las toma el agente caller, no el usuario directamente. El usuario aporta los valores; el agente decide el scope.

Los orquestadores reciben el nombre del proyecto en la delegación de BOSS y lo propagan al engine cuando invocan skills v2.

### `.context/config.json` — global (empresa + entorno)

```json
{
  "company": { "name": "", "industry": "", "tone": "", "audience": "", "value_proposition": "" },
  "mcps": [],
  "tools": {},
  "decisions": [
    { "date": "YYYY-MM-DD", "area": "<dept|global>", "decision": "", "reason": "" }
  ]
}
```

Contiene lo que es estable y compartido entre todos los proyectos: identidad de empresa, MCPs y herramientas disponibles globalmente, y decisiones operativas que aplican a **todos los proyectos** (ej. idioma de publicación, restricciones de marca, herramientas obligatorias). **No hay puntero al proyecto activo**: el proyecto se deduce de la estructura `.context/<proyecto>/` cada vez que se necesita (ver §10.1).

### `.context/<proyecto>/config.json` — por proyecto

```json
{
  "description": "",
  "tone_override": "",
  "mcps": [],
  "tools": {},
  "paths": { "<dept>": { "<carpeta>": "ruta-relativa/" } },
  "decisions": [
    { "date": "YYYY-MM-DD", "area": "<dept|global>", "decision": "", "reason": "" }
  ]
}
```

Contiene lo específico del proyecto: paths de output por dept, MCPs/tools adicionales, y las decisiones operativas tomadas durante el proyecto.

### Quién escribe qué

| Campo | Fichero | Quién | Cuándo |
|---|---|---|---|
| `company.*` | global | usuario (vía BOSS) | bootstrap o cuando lo pida |
| `mcps` (global) | global | BOSS / orquestador | cuando se confirma un MCP transversal |
| `tools` (global) | global | BOSS / usuario | bootstrap o ad hoc |
| `decisions[]` (global) | global | BOSS o cualquier orquestador | decisión que aplica a todos los proyectos |
| `description` | proyecto | BOSS | al crear el proyecto |
| `paths.<dept>` | proyecto | orquestador del dept | Paso 0.5, primera vez en el proyecto |
| `mcps` (proyecto) | proyecto | orquestador del dept | Paso 0.5 |
| `tools` (proyecto) | proyecto | orquestador del dept | Paso 0.5 o ad hoc |
| `decisions[]` (proyecto) | proyecto | cualquier orquestador o BOSS | decisión operativa de este proyecto |

### Reglas

- **Decisión final = del usuario.** Los orquestadores proponen defaults; el usuario aprueba o modifica.
- **Config = expectativa, no garantía.** El IDE manda en runtime.
- **Divergencia disco vs `paths`:** el orquestador avisa al detectar inconsistencia y propone actualizar el config o ajustar el disco. Nunca silenciar.
- **No duplicar el config.** Si una decisión vive aquí, no se repite en system prompts.
- **Dos niveles de decisions operativas:** las que aplican a todos los proyectos van en el `decisions[]` del config global; las específicas de un proyecto van en el `decisions[]` del config de ese proyecto. BOSS fusiona ambas al delegar a un orquestador.
- **Decisiones arquitectónicas no van al config.** Si una decisión cambia cómo funciona el sistema (naming, estructura de agentes, idioma de system prompts…), va a `_shared/conventions.md` — no a `decisions[]`. El campo `decisions[]` es exclusivamente para decisiones operativas.

## 11. La referencia son las plantillas, no los departamentos

Ningún departamento implementado es la "referencia de oro" del repo, por completo o pionero que sea. La referencia para construir un nuevo agente, orquestador o skill son los archivos de `_shared/`:

- `_shared/conventions.md` (este archivo) — naming, frontmatter, estructura mínima, `config.json`, contrato de skills v1 y v2.
- `_shared/orchestrator-template.md` — plantilla canónica del orquestador.
- `_shared/output-rules.md` — regla universal de outputs.

Si una decisión nueva cambia cómo se construye algo, va aquí o en la plantilla — no se infiere mirando al primer dept que pasó por ahí. Conflictos entre un dept implementado y estos archivos: ganan los archivos.

---

## 12. Skills ejecutables (runtime: engine-v2)

Existen dos clases de skills en el repo. Ambas viven en la misma jerarquía y comparten el formato `SKILL.md`, pero el contrato es distinto.

| Clase | Marca | Quién la lee | Qué hace |
|---|---|---|---|
| **v1 — prosa** | (sin `runtime`) | El LLM | Instrucciones que el agente sigue para producir un entregable |
| **v2 — ejecutable** | `runtime: engine-v2` | El engine + el LLM | Frontmatter declarativo + bloques anotados que el engine ejecuta de forma determinista |

### 12.1 Cuándo elegir una u otra

- **v1** cuando el valor está en el razonamiento: redactar, decidir tono, priorizar, estructurar entregables (posts, briefs, planes…). El output es contenido humano.
- **v2** cuando la operación es determinista: leer/escribir contra una API, consultar un sistema, devolver datos estructurados. El output es JSON.
- Si ya existe un MCP fiable para la herramienta → **MCP, no v2**. v2 cubre lo que no tiene MCP, o casos donde se quiere ejecución también vía CLI.
- Si la skill v1 cubre el caso sin coste excesivo de tokens → no migrar por migrar.

### 12.2 Una sola fuente de verdad

`SKILL.md` es la fuente. Si el frontmatter (manifiesto) y la prosa se contradicen, **gana el frontmatter** — es lo que el engine ejecuta. La prosa describe lo declarado, no añade comportamiento.

### 12.3 Frontmatter — contrato declarativo v2

```yaml
---
name: "<dept-prefix>-<carpeta>"             # §4.1 — ej. "operations-redmine"
version: "0.1.0"                            # semver
description: >                              # una frase, qué hace la skill
  ...
user-invocable: true                        # §7.1
runtime: engine-v2                          # marca: skill ejecutable v2

config:                                     # qué necesita de .context/config.json
  base_url:
    type: string
    required: true
    path: tools.<skill>.base_url            # ruta en config.json (notación de puntos)
    description: "..."

secrets:                                    # qué env vars necesita
  - name: SKILL_API_KEY
    required: true
    description: "..."

actions:
  <action-name>:
    description: "..."
    impl: { type: http, ref: "<action-name>" }
    inputs:
      <input-name>:
        type: string | integer | number | boolean | array
        required: true | false
        default: <valor>                    # opcional
        enum: [...]                         # opcional
        description: "..."
    output:
      type: json | text
      description: "forma esperada del output"
---
```

**Reglas:**
- `runtime: engine-v2` es obligatorio para que el engine cargue la skill.
- `name:` sigue §4.1 (`<dept-prefix>-<carpeta>`). Es por este `name` por el que el engine encuentra la skill (`engine.js run operations-redmine ...`), no por dirname.
- `user-invocable: true` es obligatorio (§7.1).
- `config.<key>.path` apunta a la ruta dentro de `.context/config.json` con prefijo `tools.<skill>.<...>` (§10). El `<skill>` del path es independiente del `name:` de la skill — puede mantenerse sin prefijo si la config ya existe (ej. `tools.redmine.base_url`).
- `secrets[].name` es el nombre del env var. Nunca poner valores aquí.
- `actions.<name>.impl.ref` debe coincidir con el atributo `name=` de un bloque de código en el body.
- Inputs con `required: true` y sin `default` hacen fallar la ejecución si no se aportan.

### 12.4 Body — prosa + bloques ejecutables

**Parte 1 — prosa para el LLM** (corta, ~10-30 líneas): cuándo usar, cuándo no, qué hace cada acción en una línea.

**Parte 2 — un bloque ejecutable por acción.** El atributo `name=` debe coincidir con `actions.<name>.impl.ref`.

#### Bloque HTTP

````
```http name="list-issues"
GET {{config.base_url}}/issues.json?project_id={{inputs.project_id?}}&limit={{inputs.limit}}
X-API-Key: {{secrets.API_KEY}}
Accept: application/json
```
````

Primera línea: `<METODO> <URL>`. Líneas siguientes: headers. Línea en blanco separa headers del body.

#### Bloque HTTP con body JSON

````
```http name="create-issue"
POST {{config.base_url}}/issues.json
X-API-Key: {{secrets.API_KEY}}
Content-Type: application/json

{
  "issue": {
    "project_id": "{{inputs.project_id}}",
    "subject": "{{inputs.subject}}",
    "description": "{{inputs.description?}}"
  }
}
```
````

#### Bloque bash 🚧 pendiente

Declarado en el contrato pero aún no implementado en el engine. Cuando una skill entrante lo pida, se añadirá el runner en `engine/bash.js`. Inputs como `INPUT_<NAME>`, secrets como `SECRET_<NAME>`, config como `CONFIG_<KEY>`.

### 12.5 Templating

Tres scopes: `config`, `inputs`, `secrets`.

| Patrón | Significado |
|---|---|
| `{{config.<key>}}` | valor de config (resuelto vía `path` del frontmatter) |
| `{{inputs.<name>}}` | valor del input. Si tiene `default`, se aplica antes |
| `{{inputs.<name>?}}` | input opcional. Si no se aporta, el parámetro entero se omite |
| `{{secrets.<NAME>}}` | valor de env var (o `.context/.secrets.json` como fallback) |

**Reglas de omisión:**
- Sin `?`: si el input está vacío, se sustituye por string vacío.
- Con `?` en query string: el parámetro completo desaparece (no genera `&key=`).
- Con `?` en body JSON: la línea se elimina del objeto y se limpian las comas trailing.

### 12.6 Convención de tipos en body JSON

El render hace **substitución textual**: lo que escribas alrededor del token determina el tipo en el JSON final.

| Input declarado como | Cómo escribirlo en el body | Resultado |
|---|---|---|
| `string` | `"key": "{{inputs.x}}"` | `"key": "valor"` |
| `integer` / `number` / `boolean` | `"key": {{inputs.x}}` (sin comillas) | `"key": 42` |
| Cualquier tipo, opcional | misma sintaxis con `?` — la línea se elimina si ausente | `"key"` no aparece |

### 12.7 Output del engine — contrato fijo

Toda ejecución devuelve **JSON a stdout**:

```json
{ "ok": true, "data": { ... }, "meta": { "status": 200, "duration_ms": 142 } }
```

En error:

```json
{ "ok": false, "error": { "code": "HTTP_404", "message": "...", "details": {} }, "meta": {} }
```

- Exit code `0` solo si `ok: true`.
- Errores también van a stderr en texto humano.
- Sin prompts interactivos. Sin TTY.
- El engine **nunca** escribe valores de `secrets.*` en stdout/stderr.

Códigos de error: `BAD_ARGS`, `BAD_CMD`, `SKILL_NOT_FOUND`, `ACTION_NOT_FOUND`, `PARSE_ERROR`, `INVALID_INPUTS`, `CONFIG_ERROR`, `SECRETS_ERROR`, `INVALID_BODY_JSON`, `HTTP_<status>`, `TIMEOUT`, `NETWORK_ERROR`, `UNSUPPORTED_IMPL`, `VALIDATION_FAILED`, `INTERNAL`.

**Errores de readiness enriquecidos.** `CONFIG_ERROR` y `SECRETS_ERROR` (devueltos por `run`) traen `details` estructurado para que el agente caller no tenga que parsear el `message`:

```json
{
  "ok": false,
  "error": {
    "code": "CONFIG_ERROR",
    "message": "...",
    "details": {
      "skill": "redmine",
      "missing_config": [{ "key": "base_url", "path": "tools.redmine.base_url", "type": "string", "description": "..." }],
      "missing_secrets": [{ "name": "REDMINE_API_KEY", "description": "..." }],
      "secrets_file": "/path/to/.context/.secrets.json",
      "next": ["...comandos exactos a ejecutar..."],
      "rule": "Los secretos NUNCA se aceptan por chat. Solo se le indica al usuario donde ponerlos."
    }
  }
}
```

El agente lee `details.next` y sigue los comandos en orden. Para los secretos pendientes, el agente **nunca** pide el valor por chat — sólo indica al usuario qué fichero/env var rellenar.

### 12.8 CLI del engine

```
node .aigent/v2/engine/engine.js list
  → lista skills cargables (todos los departments con runtime: engine-v2)

node .aigent/v2/engine/engine.js describe <skill>
  → manifiesto en JSON (acciones, inputs, outputs), sin prosa

node .aigent/v2/engine/engine.js validate <skill>
  → parsea, valida y reporta errores SIN ejecutar nada (uso: CI, skill-builder)

node .aigent/v2/engine/engine.js doctor [<skill>]
  → reporta estado de configuración: qué config + secrets faltan por rellenar
  → sin <skill> = reporta todas las skills v2

node .aigent/v2/engine/engine.js configure <skill> --set <path>=<valor> [--scope global|project] [--project <name>]
  → escribe valores en .context/config.json (global, default) o .context/<proyecto>/config.json (--scope project)
  → para --scope project: el agente decide qué proyecto pasar con --project <name>. Si solo hay 1 proyecto
    en .context/ se autodetecta. La mayoría de skills se configuran en global; los overrides por proyecto
    son la excepción puntual (ej. proyecto piloto con URL de staging).
  → valida que <path> está declarado en manifest.config y aplica el type del manifest
  → admite múltiples --set en la misma llamada (atómico: todos o ninguno)

node .aigent/v2/engine/engine.js prepare-secrets <skill>
  → garantiza que .context/.secrets.json existe (lo crea como {} si falta)
  → garantiza que .context/.gitignore existe con .secrets.json dentro
  → añade placeholders para secrets declarados que no estén set
  → devuelve la lista de secrets pendientes; el usuario los rellena a mano
  → NUNCA acepta valores de secret por CLI (los secrets no pasan por la conversación)

node .aigent/v2/engine/engine.js dry-run <skill> <action> [--inputs '{...}'] [--project <name>]
  → para mergear con .context/<proyecto>/config.json hace falta --project (o autodetección si hay 1)
  → si hay >1 proyecto y no se pasa --project, devuelve NO_PROJECT_SPECIFIED con la lista
  → renderiza la request HTTP sin llamarla. Devuelve { method, url, headers, body }
  → secrets cargados se enmascaran como ***SECRET:NAME***
  → secrets/config no configurados aparecen como ***SECRET:NAME:UNSET***

node .aigent/v2/engine/engine.js run <skill> <action> [--inputs '{...}']
  → ejecuta la acción y devuelve { ok, data, meta }
```

Discovery barato: el LLM puede llamar a `describe` para saber qué acciones existen sin leer el `SKILL.md` entero.

**Onboarding automático:** la forma recomendada de configurar una skill recién creada es delegar en `shared-skill-builder` modo `configure`. El agente llama a `doctor` → pregunta al usuario los valores de config faltantes → ejecuta `configure --set ...` → ejecuta `prepare-secrets` → instruye al usuario sobre qué rellenar en el fichero de secrets. Si un orquestador recibe `CONFIG_ERROR` o `SECRETS_ERROR` al ejecutar `run`, debe delegar en este modo y reintentar.

**Precheck proactivo (regla de oro):** un agente o orquestador que va a invocar `run` por primera vez en una sesión sobre una skill v2 **debe** ejecutar antes `doctor <skill>`. Si `data.skills[0].ready === false`, **no llamar a `run`**: iniciar el flujo de configuración (delegando en `shared-skill-builder configure` o ejecutando `configure` + `prepare-secrets` directamente) y reintentar el `run` solo cuando `ready: true`. Llamar a `run` "a ciegas" y esperar al error es una regresión: aunque desde 0.2 del engine los errores `CONFIG_ERROR` / `SECRETS_ERROR` traen `details.missing_config`, `details.missing_secrets` y `details.next` con los comandos exactos, el coste del round-trip y la confusión del usuario lo hace siempre peor que el precheck.

**Secrets nunca por chat (regla de seguridad):** los valores de los secretos (API keys, tokens, contraseñas) **NUNCA** se piden al usuario en la conversación. El flujo correcto siempre es:
- Llamar a `prepare-secrets <skill>` para garantizar que `.context/.secrets.json` existe con placeholders.
- Decir al usuario, en lenguaje natural, qué secretos rellenar y dónde: *"Abre `.context/.secrets.json` y reemplaza el placeholder `<replace_me_FOO>`. Cómo obtenerlo: <descripción/link>. Alternativa: define la variable de entorno `FOO`."*
- Esperar la confirmación del usuario antes de reintentar.

Si el usuario intenta dictar un secreto por chat, rechazarlo: *"Por seguridad, los secretos no pasan por la conversación — déjalos en `.context/.secrets.json` o como variable de entorno."* Esta regla aplica a todo el repo: orquestadores, especialistas, `shared-skill-builder`, e incluso al engine (que no acepta valores de secretos por CLI).

### 12.9 Config y secretos

**Config** vive en `.context/config.json` bajo `tools.<skill>.<...>` (§10). Dos niveles, mergeados al ejecutar: global + proyecto activo.

**Secretos** viven en `.context/.secrets.json` (mismo directorio que el config, pero gitignored vía `.context/.gitignore` — ese fichero excluye `.secrets.json` específicamente, el resto de `.context/` se commitea normal). Dos niveles de precedencia:
1. Variable de entorno (preferido en producción y CI).
2. `.context/.secrets.json` (gitignored, desarrollo local).
3. Si `required: true` y no aparece → el engine falla con error claro.

El engine crea automáticamente `.context/`, `.context/.gitignore` y `.context/.secrets.json` si no existen cuando se llama a `prepare-secrets`. No hay que hacer setup manual.

### 12.10 Discovery por los IDEs y stubs

Cuando `install.sh` / `install.ps1` detecta `runtime: engine-v2` en una skill, en vez de copiar la fuente al IDE genera un **stub ligero** (~1.3 KB vs ~6.7 KB de la fuente):

```
.aigent/departments/<dept>/skills/<skill>/SKILL.md   (fuente)
↓ install.sh
.claude/skills/<dept>-<skill>/SKILL.md               (stub regenerable)
.opencode/skills/<dept>-<skill>/SKILL.md             (idem)
```

El stub contiene `description` copiada y el comando exacto para que el LLM consulte el contrato real vía `engine.js describe`. Reducción típica de contexto en el IDE: ~80%.

**Multi-IDE:** la fuente es única. Cada IDE recibe su stub vía el adaptador correspondiente en `install.sh`. Añadir un IDE nuevo (VS Code, Cursor, etc.) = añadir un destino en el installer, no tocar las skills.

**Regenerar stubs:** correr `install.sh --sync` cuando cambie la fuente. El comentario `<!-- AUTOGENERATED -->` evita que alguien edite el stub a mano.

### 12.11 Crear skills nuevas

La forma recomendada de crear (o auditar) skills es delegar en el agente transversal **`shared-skill-builder`** (en `_shared/agents/`). Recoge requisitos, decide v1 o v2, lee la skill **`skill-scaffold`** (que tiene secciones para ambos modos), genera el SKILL.md y valida el resultado contra el engine antes de cerrar.

Los modos del agente: `create-v1`, `create-v2`, `audit` (revisar skill existente), `add-action` (añadir acción a skill v2 existente).

---

## 13. Skills complejas

Las skills v2 pueden ir más allá de "un manifest + un bloque HTTP". Patrones soportados (✓) y planificados (🚧).

### 13.1 Multi-acción ✓

Una skill = N acciones lógicas en el mismo `SKILL.md`. Redmine es la referencia: 9 acciones (`list-issues`, `get-issue`, `create-issue`, `update-issue`, `add-note`, `list-projects`, `log-time`, `list-activities`, `list-time-entries`). Cada acción tiene su propio bloque ` ```http name="..." ` y su entrada en `actions.<name>` del frontmatter.

**Regla de oro:** una acción = una llamada lógica. Si una operación necesita orquestar 3 llamadas en orden, son 3 acciones + un agente que las componga (no una mega-acción).

### 13.2 Ficheros auxiliares dentro de la carpeta de la skill 🚧

Hoy: solo `<skill>/SKILL.md`. Roadmap: permitir `<skill>/scripts/*.sh`, `<skill>/templates/*.json` que los bloques referencian con `@scripts/foo.sh`. Útil para bash blocks largos o templates JSON que no caben cómodos en el SKILL.md.

### 13.3 Pipelines (acciones compuestas) 🚧

Roadmap: `impl.type: pipeline` que encadena pasos definidos en un bloque YAML, donde el output del paso N alimenta al N+1. Mantiene "una acción = una llamada lógica" pero permite la lógica determinista que hoy obliga a pasar por el agente.

### 13.4 Paginación automática 🚧

Roadmap: flag `paginate: { kind: offset|cursor, page_size: 100, max_pages: 5 }` en una acción HTTP, que recorre y concatena resultados. Hoy: paginar es cosa del agente.

### 13.5 Selectores de output 🚧

Roadmap: `output.select: "$.issues[*].{id, subject, status}"` para que el engine recorte el JSON de respuesta antes de devolverlo. Reduce ruido cuando el agente solo necesita parte del payload.

> **Importante para skills entrantes:** lo marcado 🚧 no está en el engine todavía. Si una skill nueva lo necesita, se añade primero la capacidad al engine y se documenta aquí. No declarar features inexistentes en el frontmatter.

---

## 14. Subset YAML soportado en el frontmatter v2

El engine v2 incluye un parser YAML propio (`engine/yaml.js`, sin dependencias). Cubre solo el subset que necesitan los manifiestos:

| Construcción | Soportado | Ejemplo |
|---|---|---|
| Mappings con indentación | ✓ | `config:\n  base_url:\n    type: string` |
| Scalars: string, integer, float, boolean, null | ✓ | `default: 25`, `required: true` |
| Strings con/sin comillas | ✓ | `name: redmine` o `name: "redmine"` |
| Arrays con `- item` | ✓ | `secrets:\n  - name: ...` |
| Arrays de mappings | ✓ | `- name: X\n    required: true` |
| Folded scalar `>` | ✓ | `description: >\n  texto multilínea` |
| Literal scalar `\|` | ✓ | (preserva saltos de línea) |
| Flow mapping `{ k: v }` | ✓ | `impl: { type: http, ref: "..." }` |
| Flow array `[a, b]` | ✓ | `enum: [open, closed, "*"]` |
| Comentarios `#` | ✓ | tanto líneas enteras como al final |
| Anchors/aliases `&` `*` | ✗ | usar repetición explícita |
| Tags `!!str` | ✗ | el tipo se infiere del literal |
| Múltiples documentos `---` | ✗ | solo un documento por frontmatter |

Si un SKILL.md necesita una construcción no soportada, ampliar `engine/yaml.js` antes que añadir una dependencia externa.

---

## 15. Riesgos y normas para skills v2

- **Drift entre prosa y manifiesto.** El frontmatter manda. La prosa describe lo declarado, no añade comportamiento. Para detectarlo: `engine.js validate <skill>` en CI o `shared-skill-builder` en modo audit.
- **Acciones hinchadas.** Una acción = una llamada lógica. Si una operación necesita orquestar N llamadas en orden, son N acciones + un agente que las componga, no una mega-acción.
- **Secretos en logs.** El engine nunca escribe valores de `secrets.*` en stdout/stderr. No incluirlos tampoco en `description` o ejemplos.
- **Inputs sin schema.** Cada input declara `type` y `required`. Sin esto, el engine rechaza la skill al cargarla.
- **MCP existente.** Si ya existe un MCP fiable para la herramienta, preferir el MCP. v2 cubre lo que no tiene MCP, o casos donde se quiere ejecución también vía CLI.
- **Stubs editados a mano.** El comentario `<!-- AUTOGENERATED -->` advierte; cualquier edición se pierde al re-ejecutar `install.sh`. Editar la fuente, no el stub.
- **Features 🚧 no implementadas.** No declarar pipelines, paginación o bash blocks en una skill si el engine aún no los soporta. Se rechaza al validar.
