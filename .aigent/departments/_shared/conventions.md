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
│   │   └── skills/shared-<skill-name>/   ← meta (shared-skill-scaffold, shared-agent-scaffold), business y utility
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
| Agente especialista | `<dept>-<role>.md` kebab-case | `marketing-creative.md` |
| Agente compartido | `shared-<role>.md` | `shared-prd-agent.md`, `shared-skill-builder.md` |
| Skill (carpeta del repo) | `<dept-prefix>-<base>` + `SKILL.md` | `marketing/skills/marketing-copy/SKILL.md` |
| Frontmatter `name` skill | igual al nombre de la carpeta | `marketing-copy`, `shared-skill-scaffold`, `operations-redmine` |
| Frontmatter `name` orq. | `[Department] Orchestrator` | `[Marketing] Orchestrator` |
| Frontmatter `name` agente | `[Department] <Role>` | `[Marketing] Creative`, `[Shared] Skill Builder` |
| Capitalización `[Dept]` | título correcto | `[HR]`, `[DevOps]` (no `[Hr]`, `[Devops]`) |

### 4.1 Regla: carpeta y `name:` llevan prefijo del dept, y son iguales

Tanto la **carpeta** como el **`name:` del frontmatter** de toda skill (v1 y v2) llevan el prefijo del departamento al que pertenece, separado por guion. Y coinciden uno a uno: el `name:` es exactamente el nombre de la carpeta.

| Ubicación en el repo | Prefijo de carpeta | Ejemplo |
|---|---|---|
| `departments/<dept>/skills/<x>/` | `<dept>-` | `marketing/skills/marketing-copy/` → `name: "marketing-copy"` |
| `departments/_shared/skills/<x>/` | `shared-` | `_shared/skills/shared-competitive-analysis/` → `name: "shared-competitive-analysis"` |

**Excepción: no doblar prefijo.** Si la "base" del nombre ya empieza por el prefijo del dept (caso histórico: `product-roadmap`, `sales-playbook`, `design-token-set`...), la carpeta se queda tal cual y el `name:` también. **No** se genera `product-product-roadmap/`. Mecánicamente: si `<carpeta>` empieza por `<dept>-`, ya es válida; si no, el nombre canónico es `<dept>-<carpeta>`.

Motivación: evitar colisiones cuando todas las skills acaban en un único directorio plano del IDE (`.claude/skills/`, `.opencode/skills/`), hacer obvio el dept de origen al leer cualquier referencia, y eliminar el drift entre source y stub — el installer ya no manipula el nombre, solo copia.

**Engine v2:** la skill se invoca por su `name:`, que coincide con el dirname. `engine.cjs run operations-redmine list-issues`. El `path:` de `config:` (p. ej. `tools.redmine.base_url`) es independiente del `name:` y puede mantenerse sin prefijo si la config ya existía — o pasar a `tools.<name>.<...>` para skills nuevas.

**Lint del engine:** `engine.cjs validate <skill>` emite un warning si `manifest.name` no coincide con el dirname.

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

El template `_shared/orchestrator-template.md` lleva `mode: primary`. Los scaffolds de agentes (`_shared/skills/shared-agent-scaffold`) deben generar el modo correcto según la subskill (`create-specialist` → `subagent`, `create-shared` → `subagent`, orquestadores → `primary`).

## 6. Estructura mínima de un orquestador

Sigue `_shared/orchestrator-template.md`. Secciones obligatorias: frontmatter, Rol, Paso 0 (proyecto activo), Paso 0.5 (primera vez en proyecto: confirmar `paths` + `mcps`), Ficheros a leer, Gestión de tareas, Agentes disponibles, Proceso de delegación (simple/compuesto/ambiguo), Tabla de decisión rápida, Comportamiento en tareas compuestas, Cuándo NO delegar, Restricciones, Reglas de output (referencia a `_shared/output-rules.md` + carpetas del dept), Principio de cierre.

**Sección condicional — Manejo de skills v2 — readiness.** El bloque de readiness de skills v2 (precheck proactivo con `doctor` antes de `run` + red de seguridad reactiva tras `CONFIG_ERROR`/`SECRETS_ERROR` → delegar en `shared-skill-builder configure` → reintentar; secrets nunca por chat) se incluye en el orquestador **solo si el departamento tiene al menos una skill v2** (`runtime: engine-v2`). Un departamento cuyas skills son todas v1 prosa **no debe** arrastrar el bloque: lo sustituye por una nota de una línea (ver `orchestrator-template.md`) indicando que no aplica y que, si en el futuro se añade una skill v2, se copia el bloque desde la plantilla. Esto evita ~80 líneas de instrucciones inejecutables en orquestadores sin v2. *(Regla desde framework 3.10.0; antes el bloque era obligatorio en todos los orquestadores.)*

## 7. Estructura mínima de una skill v1

```markdown
---
name: "<dept-prefix>-<carpeta>"   # §4.1 — ej. "marketing-copy", "shared-case-study"
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

- **Prefijo `shared-` obligatorio.** Las skills compartidas llevan el prefijo `shared-` tanto en la carpeta como en el `name:` del frontmatter, igual que toda skill lleva el prefijo de su dept (§4.1). Ej: `shared-competitive-analysis`, `shared-case-study`, `shared-kpi-dashboard`. Coherente con las meta-skills `shared-skill-scaffold` / `shared-agent-scaffold` y con los agentes compartidos `shared-prd-agent` / `shared-skill-builder`. El prefijo evita colisiones cuando todas las skills acaban en un único directorio plano del IDE y hace obvio el origen al leer cualquier referencia. (Antes de framework 3.x esta subsección decía "sin prefijo"; quedó obsoleta cuando §4.1 unificó el prefijo para todas las skills.)
- La regla §7 sigue aplicando: la skill no declara qué agentes la usan.

### Tres categorías: meta, business, utility

`_shared/skills/` aloja **tres tipos de skills**, conviviendo en la misma carpeta sin subcarpetas. Se distinguen por dominio (no por ubicación), y **dos de las tres se invocan de forma distinta**:

| Categoría | Ejemplos | Cómo se invoca | Listada en agentes |
|---|---|---|---|
| **Meta-skills** — construyen el sistema | `shared-skill-scaffold`, `shared-agent-scaffold` | Las invoca otra meta-skill o agente compartido (`shared-skill-builder`, `shared-prd-agent`) | No habitualmente; uso interno del framework |
| **Business-skills compartidas** — entregables transversales | `shared-competitive-analysis`, `shared-case-study`, `shared-kpi-dashboard`, `shared-okr-set`, etc. | El agente caller la lista en su `## Skills disponibles` y la invoca explícitamente | **Sí, en cada agente que la use** |
| **Utility-skills** — utilidades técnicas con script propio | `shared-base64` | **Autodescubrimiento por el LLM** vía `description` del frontmatter cuando el contexto matchea | **No** — sería propagar lo mismo en N agentes sin valor |

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
- La gran mayoría de valores van al config global con `engine.cjs configure <skill> --set ... ` (default `--scope global`). Una sola fuente de verdad por skill, válida para todos los proyectos.
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
- `name:` sigue §4.1 (`<dept-prefix>-<carpeta>`). Es por este `name` por el que el engine encuentra la skill (`engine.cjs run operations-redmine ...`), no por dirname.
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

### 12.7-bis Runtime: el launcher `IDE/bin/run` (regla dura)

**Ninguna skill ni el engine v2 se invoca jamás con `node` a secas.** Siempre a través del launcher:

```
.aigent/IDE/bin/run <script.cjs|.mjs> [args...]
```

**Por qué.** Claude Code y OpenCode se distribuyen como binarios nativos que embeben su propio runtime (Bun) — ese runtime NO se expone en el `PATH`, así que no hay garantía de que el usuario tenga `node` ejecutable. El launcher elimina esa dependencia del entorno.

**Qué hace el launcher** (resolución dinámica en cada ejecución, sin reinstalar al cambiar de runtime):

1. Usa el Node **bundled** que el instalador descarga a `.aigent/IDE/bin/deps/node` (Unix/mac) o `.aigent/IDE/bin/deps/node.exe` (Windows).
2. Si no está, cae al `node` del sistema en `PATH`.
3. Suelo de versión **Node ≥ 20**; si nada cumple, error claro pidiendo reinstalar.

**Piezas (en `IDE/bin/`):**

- `run` — launcher bash (lo usan los dos IDEs, cuyo shell de herramienta es bash; en Windows vía Git-Bash).
- `run.cmd` — cortesía para shells PowerShell/cmd nativos.
- `deps/.node-version` — **única fuente de verdad** de la versión fijada (la leen ambos instaladores; convención compatible con nvm/fnm). Sí va en git.
- `deps/node[.exe]` — el binario descargado. **Nunca va en git** (`IDE/bin/.gitignore`).

**Inspección/instalación del runtime:** `install.sh --node-status` / `install.ps1 -NodeStatus` reporta qué Node hay (sistema + bundled + pin) y qué resolvería el launcher; `--node-install` / `-NodeInstall` (con `--force` / `-Force` para re-descargar) lo instala de forma aislada. También vía el menú interactivo → opción **Runtime (Node)**. La instalación completa además asegura el runtime automáticamente (idempotente por versión).

**Al crear o auditar una skill v1 con script** (`.cjs`/`.mjs`): toda invocación documentada en su `SKILL.md` debe empezar por `.aigent/IDE/bin/run`, nunca por `node`. El instalador no reescribe nada en runtime — el contrato vive en el texto de la skill.

### 12.8 CLI del engine

```
.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs list
  → lista skills cargables (todos los departments con runtime: engine-v2)

.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs describe <skill>
  → manifiesto en JSON (acciones, inputs, outputs), sin prosa

.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs validate <skill>
  → parsea, valida y reporta errores SIN ejecutar nada (uso: CI, skill-builder)

.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs doctor [<skill>]
  → reporta estado de configuración: qué config + secrets faltan por rellenar
  → sin <skill> = reporta todas las skills v2

.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs configure <skill> --set <path>=<valor> [--scope global|project] [--project <name>]
  → escribe valores en .context/config.json (global, default) o .context/<proyecto>/config.json (--scope project)
  → para --scope project: el agente decide qué proyecto pasar con --project <name>. Si solo hay 1 proyecto
    en .context/ se autodetecta. La mayoría de skills se configuran en global; los overrides por proyecto
    son la excepción puntual (ej. proyecto piloto con URL de staging).
  → valida que <path> está declarado en manifest.config y aplica el type del manifest
  → admite múltiples --set en la misma llamada (atómico: todos o ninguno)

.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs prepare-secrets <skill>
  → garantiza que .context/.secrets.json existe (lo crea como {} si falta)
  → garantiza que .context/.gitignore existe con .secrets.json dentro
  → añade placeholders para secrets declarados que no estén set
  → devuelve la lista de secrets pendientes; el usuario los rellena a mano
  → NUNCA acepta valores de secret por CLI (los secrets no pasan por la conversación)

.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs dry-run <skill> <action> [--inputs '{...}'] [--project <name>]
  → para mergear con .context/<proyecto>/config.json hace falta --project (o autodetección si hay 1)
  → si hay >1 proyecto y no se pasa --project, devuelve NO_PROJECT_SPECIFIED con la lista
  → renderiza la request HTTP sin llamarla. Devuelve { method, url, headers, body }
  → secrets cargados se enmascaran como ***SECRET:NAME***
  → secrets/config no configurados aparecen como ***SECRET:NAME:UNSET***

.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs run <skill> <action> [--inputs '{...}']
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

El stub contiene `description` copiada y el comando exacto para que el LLM consulte el contrato real vía `engine.cjs describe`. Reducción típica de contexto en el IDE: ~80%.

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

El engine v2 incluye un parser YAML propio (`engine/yaml.cjs`, sin dependencias). Cubre solo el subset que necesitan los manifiestos. **La fuente de verdad es el comentario de cabecera de `yaml.cjs`**; esta tabla lo refleja.

### Soportado

| Construcción | Ejemplo |
|---|---|
| Mappings con indentación (cualquier nivel, consistente) | `config:` ⏎ `  base_url:` ⏎ `    type: string` |
| Scalar string (sin comillas) | `type: string` |
| Scalar string entre comillas dobles (escapes `\"` y `\\`) | `description: "dice \"hola\""` |
| Scalar string entre comillas simples (escape `''`) | `name: 'O''Brien'` |
| Scalar integer | `limit: 25` |
| Scalar float (incl. exponente) | `ratio: 0.5` · `n: 1.2e-3` |
| Scalar boolean | `required: true` |
| Scalar null (`null` o `~`) | `default: null` |
| Array con `- item` (escalar) | `- list-issues` ⏎ `- get-issue` |
| Array de mappings inline `- key: value` (+ sublíneas anidadas) | `- name: SLACK_TOKEN` ⏎ `  required: true` |
| Array/valor anidado por indentación | `inputs:` ⏎ `  limit:` ⏎ `    type: integer` |
| Folded scalar `>` (líneas siguientes unidas con espacios) | `description: >` ⏎ `  línea 1` ⏎ `  línea 2` → `"línea 1 línea 2"` |
| Literal scalar `\|` (líneas siguientes preservadas con `\n`) | `body: \|` ⏎ `  línea 1` ⏎ `  línea 2` → `"línea 1\nlínea 2"` |
| Flow mapping `{ k: v, ... }` | `impl: { type: http, ref: "list" }` |
| Flow array `[a, b, ...]` | `enum: [asc, desc]` |
| Comentarios `#` (línea completa o al final de línea tras espacio, fuera de comillas) | `limit: 25  # tope por página` |

### NO soportado (intencional)

Si un manifiesto los usa, falla el parseo — no se "arreglan" en el SKILL.md, se evitan:

| Construcción | Alternativa |
|---|---|
| Anchors / aliases (`&ancla` / `*ancla`) | Repetir el valor explícitamente |
| Tags (`!!str`, `!!int`, …) | Confiar en la inferencia de tipos del scalar |
| Múltiples documentos (`---` como separador interno) | Un solo documento por frontmatter |
| Claves complejas (`?`) | Solo claves escalares |
| Strings de comillas dobles multilínea | Usar folded `>` o literal `\|` |

Ampliar el subset = editar `engine/yaml.cjs` (y su comentario de cabecera) **y** esta tabla a la vez.

---

## 15. Logging de trabajo (debug) — `shared-logger`

El sistema mantiene una **traza de depuración** de su propio trabajo mediante la utility-skill **`shared-logger`** (`_shared/skills/shared-logger/`). Es una utility-skill con script propio (`logger.cjs`, Node sin dependencias), por tanto **no se lista en la tabla `## Skills disponibles` de ningún agente** (§7.1, contrato de utility-skills) — el logging es un **comportamiento transversal**, no un entregable que un agente "elige".

- **Dónde:** `.context/<proyecto>/logger/session-<unixts>.jsonl` (JSON Lines, un evento por línea, append-only) + `.json` consolidado al exportar. Es **ruta de sistema**, no entregable → vive dentro de `.context/` como **excepción consciente** a output-rules (mismo criterio que `.context/.temp/`).
- **Formato:** solo JSON. Cada evento lleva `ts`, `session_id`, `seq`, `level`, `type` + campos opcionales (`agent`, `task`, `action`, `skill`, `deliverable`, `target`, `status`, `message`, `data`).
- **Quién registra:** los orquestadores (y BOSS) anexan eventos en los pasos relevantes — ver el bloque "Logging de trabajo" de `orchestrator-template.md` y la regla en `output-rules.md`.
- **Adjuntar al imputar/subir:** cuando un flujo imputa una tarea o sube un resultado, se registra el evento y se adjunta el log consolidado **salvo que el usuario diga lo contrario**.
- **Se commitea por defecto** (auditable). Nunca secretos ni PII en el log.

Contrato CLI completo en `_shared/skills/shared-logger/SKILL.md`; regla de comportamiento en `_shared/output-rules.md`.

---

## 16. Tipos de skill por ejecución: Prosa / Local / Híbrido

Eje **ortogonal** a las categorías de §7.1 (meta/business/utility, que dicen *quién* la usa) y a `runtime: engine-v2` (§12, que dice *cómo la ejecuta el engine*). Este eje describe **dónde vive el trabajo** de la skill y, con ello, qué garantías ofrece. La prosa del `SKILL.md` es el *manual* de toda skill y no determina el tipo; el tipo lo fija dónde está el valor.

| Tipo | Pregunta que lo define | Naturaleza | Ejemplos |
|---|---|---|---|
| **Prosa** | ¿Hay libertad creativa, el LLM compone? | Razonamiento; dos ejecuciones pueden diferir y ambas valer. Output = contenido humano. | `marketing-copy`, `shared-case-study` |
| **Local** | ¿Hay una respuesta correcta y estricta? | Código determinista, **cero dependencias npm**. Mismo input → mismo output. Datos y decisiones estrictas. Incluye **llamadas a APIs definidas** (endpoint/método/params fijos). | `shared-base64`, `shared-office-writer`, `shared-pdf-reader`, `shared-logger`, skills `runtime: engine-v2` (HTTP) |
| **Híbrido** | ¿Lo anterior **+ necesita una librería npm externa**? | Local o Prosa apoyado en una librería de terceros para dar mejor resultado. | `shared-docx-rich`, `shared-pdf-toolkit`, `shared-xlsx-rich` |

**Regla en una línea:** *creativo →* **Prosa**; *estricto/determinista (incluida API) →* **Local**; *lo anterior + librería npm →* **Híbrido**.

### 16.1 HTTP/API no es un tipo aparte

Hablar con un sistema remoto es una **capacidad**, no un tipo. Una skill HTTP es **Local** por defecto: la llamada (endpoint, método, params, manejo de errores) es una decisión estricta y determinista — la variabilidad está en la *respuesta* del API, no en el *comportamiento* de la skill. **Asciende a Híbrido** solo cuando necesita una **librería npm** para trabajar datos alrededor de la llamada (firmar requests HMAC/OAuth1, JWT de terceros, formatos exóticos). El módulo `crypto` **nativo** de Node es stdlib → sigue siendo Local; Híbrido es cuando la dependencia viene de npm.

> Recomendado para skills HTTP: externalizar la definición de la API (endpoints/inputs/outputs, estilo OpenAPI) a un fichero aparte en la carpeta de la skill, referenciado desde la prosa. Es el "artefacto Local" (datos estrictos) separado del manual, se copia tal cual en el instalador y mantiene la carpeta autocontenida. *(Migrar el manifest del frontmatter a un JSON aparte es un cambio del engine v2 — ver roadmap, no es gratis.)*

### 16.2 Contrato de las skills Híbridas (obligatorio)

Toda skill Híbrida cumple, **sin excepción**:

1. **La dependencia se obtiene SIEMPRE por el helper único `.aigent/IDE/bin/lib-bootstrap.cjs`.** Nunca se copia un bloque de bootstrap propio en el script. El patrón canónico:

   ```js
   const path = require('path');
   const DEP = { name: '<paquete>', version: '<pin-exacto>' };   // versión SIEMPRE fijada
   function ensureDep(autoInstall) {
     const boot = path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'lib-bootstrap.cjs');
     let lib; try { lib = require(boot); }
     catch (e) { emitError('BOOTSTRAP_NOT_FOUND', '... cwd debe ser la raíz del proyecto'); }
     return lib.ensureDep(DEP, { autoInstall, skillRef: '<ruta-del-script>' });
   }
   // ... const { module: LIB, installed, via } = ensureDep(!args.noInstall);
   ```

2. **Las librerías viven en `.context/libs/node_modules/`** — caché **compartida** por todas las skills híbridas, basada en `process.cwd()` (la raíz del proyecto donde vive `.context/`). El helper la crea y añade `libs/` a `.context/.gitignore` (las librerías **no se commitean**; se reutilizan en local). Es una **excepción consciente** a output-rules, igual que `.context/.temp/` y el logger (§15). Las librerías son **runtime**, nunca entregables.

3. **El script de la skill NO vive en `libs/`.** Vive en su carpeta (`_shared/skills/<x>/` en el repo, `.claude/skills/<x>/` en deployment) y se ejecuta in situ; solo hace `require()` de la librería por ruta absoluta a la caché. El instalador copia la carpeta de la skill tal cual.

4. **Versión fijada (pin)** en `DEP.version` → reproducibilidad. Subir el pin = editar el script y registrarlo en CHANGELOG. (Aprendido a la mala: una versión publicada puede traer un build CJS roto.)

5. **npm bundled o del sistema:** el helper prefiere el npm que el instalador conserva junto al Node bundled (`.aigent/IDE/bin/deps/node_modules/npm`); si no, el del sistema. El campo `installed_via` (`bundled`/`system`) lo indica. Sin ninguno → `DEP_UNAVAILABLE`.

6. **Códigos de error de dependencia uniformes** (los emite el helper, iguales para todas): `DEP_MISSING` (falta y `--no-install`), `DEP_UNAVAILABLE` (no hay npm), `DEP_INSTALL_FAILED`. El script añade `BOOTSTRAP_NOT_FOUND` si no encuentra el helper.

7. **Precheck `deps`:** toda skill híbrida expone un comando `deps` (`run <skill> deps`) que asegura/instala la dependencia y reporta `installed_now`/`installed_via`. El agente caller lo invoca una vez por sesión antes del primer uso; si `DEP_UNAVAILABLE`, cae a la skill **Local** equivalente (p. ej. `shared-docx-rich` → `shared-office-writer`) o avisa.

8. **Coexistencia con la Local equivalente:** si existe una skill Local que cubre el caso básico sin red ni instalación, la Híbrida **no la sustituye** — se usa solo cuando se necesita romper el techo (imágenes, colores, merges, edición de PDF…). No pagar el coste de una librería si la Local basta.

Cualquier skill híbrida nueva se construye con `shared-skill-scaffold` (modo correspondiente), que genera este contrato. Divergir del helper = bug a corregir en la primera auditoría.
