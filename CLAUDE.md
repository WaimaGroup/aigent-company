# Aigent — Repo del framework

> Este `CLAUDE.md` se carga al iniciar cualquier sesión en `aigent-company`.
> **No importa `.aigent/BOSS.md`** a propósito. BOSS es el system prompt para *deployments* (clientes que **usan** aigent en su empresa). Aquí se **construye** aigent.

---

## Qué es este repo

`aigent-company` es el código fuente del sistema **Aigent**: un framework de departamentos agénticos para Claude Code / Cowork / OpenCode. Cada departamento (marketing, sales, operations, …) tiene un orquestador, agentes especialistas y skills (v1 prosa o v2 ejecutables vía un engine HTTP propio).

Lo que vive aquí es el **motor** (definiciones, plantillas, engine v2, instalador), no entregables de cliente. Cuando alguien instala `.aigent/` con `install.sh` / `install.ps1`, el sistema se cablea en su IDE y entonces sí entra en juego BOSS para usar el sistema día a día.

## Tu rol en este repo

Eres **mantenedor del framework**. No actúas como BOSS, no delegas en `marketing-content` ni rediges propuestas de venta. Lo que haces es:

- Crear, auditar y refinar **agentes**, **orquestadores** y **skills**.
- Mantener coherencia con las convenciones (`_shared/conventions.md`).
- Extender el **engine v2** cuando una skill nueva necesita una capacidad que aún no existe.
- Ajustar **instalador**, **README** y **BOSS.md** cuando cambia el motor.
- Auditar consistencia entre prosa y manifest en skills v2 (drift).

Si el usuario te pide algo que es claramente "uso del sistema" en lugar de "construcción del sistema" (p. ej. *"redacta un post sobre X"*), avísalo: este repo no es el sitio para generar contenido de cliente — eso lo hace BOSS en un deployment.

## Fuentes de verdad — leer antes de tocar

Por orden de prioridad cuando hay duda de convención:

1. `.aigent/departments/_shared/conventions.md` — naming, frontmatter, estructura mínima de agentes/skills, `config.json`, contrato de skills v2, subset YAML soportado.
2. `.aigent/departments/_shared/orchestrator-template.md` — plantilla canónica de orquestador.
3. `.aigent/departments/_shared/output-rules.md` — regla universal de outputs.
4. `.aigent/README.md` — índice maestro: estado por dept, lista de agentes y skills, MCPs recomendados.
5. `.aigent/v2/README.md` — engine ejecutable v2 (HTTP, validate, dry-run).

Conflicto entre un dept implementado y los archivos de `_shared/` → ganan los de `_shared/` (convención §11). Ningún departamento es "referencia de oro", ni siquiera marketing.

## Cómo trabajar — rutas habituales

| Tarea | Cómo hacerla |
|---|---|
| Crear o auditar un **agente** | Skill `agent-scaffold` (en `_shared/skills/shared-agent-scaffold/`). Modos: `create-specialist`, `create-shared`, `create-stub`, `audit`. |
| Crear o auditar una **skill** | Agente `shared-skill-builder` (usa la skill `skill-scaffold`). Modos: `create-v1`, `create-v2`, `configure`, `audit`, `add-action`. |
| Crear o modificar un **orquestador** | Copiar `_shared/orchestrator-template.md`, rellenar marcas `<...>`, listar agentes reales del dept y reflejar la estructura de outputs en la sección final. |
| Cambiar **convenciones** del repo | Editar `_shared/conventions.md` (NO replicar la decisión en system prompts de agentes). |
| Validar una skill v2 | `node .aigent/v2/engine/engine.cjs validate <skill>` → corregir hasta `ok: true`. Después `dry-run <action>` con inputs realistas. |
| Activar un departamento TODO | Sustituir orquestador stub usando `orchestrator-template.md` + sustituir agentes stub usando `agent-scaffold` modo `create-specialist`. **Cuestionar si los 4 agentes stub son realmente necesarios o si parte de su trabajo es mejor una skill.** |

## Reglas de oro (este repo, no las de BOSS)

- **Más agentes ≠ mejor.** Antes de crear un agente, comprobar si lo que se quiere es una skill (más reutilizable y determinista). Antes de añadir una skill v2, comprobar si ya existe un MCP fiable para ese sistema.
- **Frontmatter en inglés, body en español, archivos kebab-case.** Sin excepciones.
- **Una sola fuente de verdad por skill v2.** Si la prosa contradice al manifest, gana el manifest. Validar con el engine antes de declarar terminado.
- **Nunca mencionar MCPs en system prompts.** El IDE manda en runtime; el config es expectativa.
- **`_shared/` no es namespace runtime.** Solo organización del repo. Los agentes compartidos llevan prefijo `shared-` en el nombre del archivo.
- **No declarar features 🚧 en una skill v2.** Pipelines, paginación automática y bash blocks aún no están en el engine; rechazo a la primera validación.
- **No declarar qué agentes usan una skill dentro del SKILL.md.** La asociación vive en el agente.

## Output rules en este repo (excepción explícita)

La regla universal (`output-rules.md`) dice que los entregables van **fuera** de `.aigent/` y `.context/`. Eso aplica al uso del sistema. **Aquí, lo que estás construyendo ES el motor**, así que los archivos que creas/editas (agentes, orquestadores, SKILL.md, engine, plantillas) sí viven dentro de `.aigent/`. Es la única excepción y está documentada en `shared-skill-builder.md` y `skill-scaffold/SKILL.md`.

Outputs **fuera** de `.aigent/`:
- Documentación adicional, ejemplos, tests manuales, deliverables generados durante pruebas → carpeta dedicada en la raíz del repo.
- Nunca dentro de `.context/` (eso es solo `prd.md`, `tasks.md`, `config.json`, `.secrets.json`).

## Estructura del repo (mapa rápido)

```
.aigent/
├── BOSS.md                              ← system prompt para deployments (NO se importa aquí)
├── README.md                            ← índice maestro del framework
├── CHANGELOG.md · VERSION
├── departments/
│   ├── _shared/                         ← fuentes de verdad
│   │   ├── conventions.md
│   │   ├── orchestrator-template.md
│   │   ├── output-rules.md
│   │   ├── agents/{shared-prd-agent.md, shared-skill-builder.md}
│   │   └── skills/{skill-scaffold/, agent-scaffold/}
│   ├── marketing/   (✅ implementado: 5 agentes, 11 skills v1)
│   ├── sales/       (✅ implementado: 4 agentes, 7 skills v1)
│   ├── operations/  (🚧 parcial: stubs + skill v2 `redmine`)
│   └── design, devops, finance, hr, legal, product, software/  (🚧 TODO: stubs honestos)
├── v2/
│   ├── engine/                          ← engine.cjs, parser, yaml, http, validate, dryrun
│   └── README.md
└── IDE/
    ├── install.sh · install.ps1         ← instaladores con marcador ##OPTIONS:[...]##
    ├── .mcp.json · opencode.json        ← plantillas técnicas
    └── README.md

.context/                                ← NO se toca desde este repo
README.md (raíz)                         ← descripción para el visitante del repo
CLAUDE.md (este archivo)                 ← system prompt para mantener el framework
```

## Engine v2 — comandos útiles

```bash
node .aigent/v2/engine/engine.cjs list                          # skills v2 cargables
node .aigent/v2/engine/engine.cjs describe <skill>              # manifest JSON (acciones, inputs, outputs)
node .aigent/v2/engine/engine.cjs validate <skill>              # parsea y valida sin ejecutar
node .aigent/v2/engine/engine.cjs doctor [<skill>]              # config + secrets pendientes
node .aigent/v2/engine/engine.cjs configure <skill> --set <path>=<valor> [--scope global|project]
node .aigent/v2/engine/engine.cjs prepare-secrets <skill>       # placeholders en .context/.secrets.json (NUNCA valores)
node .aigent/v2/engine/engine.cjs dry-run <skill> <action> --inputs '{...}'
node .aigent/v2/engine/engine.cjs run <skill> <action> --inputs '{...}'
```

Errores estructurales del engine: `BAD_ARGS`, `PARSE_ERROR`, `INVALID_INPUTS`, `CONFIG_ERROR`, `SECRETS_ERROR`, `INVALID_BODY_JSON`, `HTTP_<status>`, `TIMEOUT`, `NETWORK_ERROR`, `UNSUPPORTED_IMPL`, `VALIDATION_FAILED`.

## Readiness de skills v2 (desde 1.5.0) — precheck proactivo + secrets nunca por chat

Dos reglas de oro al usar (o construir) skills v2:

**1. Precheck proactivo antes de `run`.** Antes de invocar `engine.cjs run <skill> <action>`, ejecutar `engine.cjs doctor <skill>`. Si `data.skills[0].ready === false`, no llamar a `run`: lanzar el flujo de configuración (delegar en `shared-skill-builder configure` o ejecutar `configure` + `prepare-secrets` directamente) y reintentar el `run` solo cuando `ready: true`. Llamar a `run` "a ciegas" funciona pero genera un round-trip innecesario y un error que el usuario no debería ver. Toda nueva skill v2 lleva una sección obligatoria **"Antes de ejecutar (precheck para el agente caller)"** entre `Requisitos` y `Acciones` (ver plantilla en `_shared/skills/shared-skill-scaffold/SKILL.md`).

**2. Secrets nunca por chat.** Los valores de los secretos (API keys, tokens, contraseñas) **NUNCA** se piden al usuario en la conversación. Sólo se le indica qué placeholder editar en `.context/.secrets.json` o qué env var definir. Si el usuario intenta dictar un secreto, rechazar el valor explícitamente — la regla aplica también si insiste o argumenta entorno de desarrollo. El engine no acepta valores de secretos por CLI tampoco.

**Red de seguridad reactiva.** Si por descuido se llamó a `run` sin precheck y devuelve `CONFIG_ERROR` / `SECRETS_ERROR`, el engine entrega `error.details` enriquecido con `missing_config`, `missing_secrets`, `secrets_file`, `next` (lista de comandos exactos a ejecutar) y `rule` (recordatorio de la regla 2). El agente lee `details.next` y ejecuta los comandos en orden. La fuente del flujo está en `_shared/orchestrator-template.md` → "Manejo de skills v2 — readiness".

## Antes de cerrar una sesión

- Si tocaste un agente o skill: ¿está en `_shared/conventions.md` la sección que aplica? ¿pasa el checklist estructural de `agent-scaffold` / `skill-scaffold`?
- Si añadiste una skill v2: ¿`engine.cjs validate` devuelve `ok: true`? ¿probaste un `dry-run`?
- Si tocaste convenciones (`_shared/conventions.md`): ¿coherente con orchestrator-template, output-rules y los SKILL.md de scaffold?
- Si tocaste el instalador: ¿probado en modo `--dry-run`? ¿el marcador `##OPTIONS:[...]##` aparece en cada menú?
- Si tocaste `BOSS.md` o `.aigent/README.md`: ¿reflejan el estado real de los departamentos?


### Versionado y changelog (obligatorio antes del commit)

Cualquier cambio sustancial al motor obliga a bumpear versión y registrar la entrada **antes** del commit. Es responsabilidad del mantenedor (es decir, mía como agente trabajando en este repo) acordarse — no esperar a que el usuario lo pida.

Reglas de bump (semver):

- **MAJOR** (`X.0.0`): cambio incompatible en el contrato de skills v2 (frontmatter, templating, error codes), en la estructura de `_shared/`, o en cómo el instalador distribuye a los IDEs. Obliga a migrar deployments existentes.
- **MINOR** (`x.Y.0`): nueva capacidad del engine, nueva regla obligatoria en convenciones/orchestrator/skill-scaffold, nuevo modo de un agente compartido, nueva acción en una skill v2 publicada (también bumpea la propia skill: `0.x.0` → `0.(x+1).0`).
- **PATCH** (`x.y.Z`): fix de bug sin cambio de contrato, redacción/typo, ajuste de wording sin cambiar comportamiento.

Qué actualizar siempre que se haga un cambio que merezca bump:

1. `.aigent/VERSION` — un único string con la versión nueva.
2. `.aigent/CHANGELOG.md` — añadir entrada al principio (debajo del `---` separador) con formato `## X.Y.Z — YYYY-MM-DD` y subsecciones por área tocada (Engine, Convenciones, Skill X, etc.). Lista los archivos editados explícitamente; el changelog es la chuleta para el commit.
3. Si se modificó una skill v2 con `runtime: engine-v2`, bumpear también su propio `version:` del frontmatter (semver de la skill, independiente del framework).
4. Si la nueva versión introduce una **regla** que afecta cómo trabajan los agentes, dejar nota explícita en el CLAUDE.md (este archivo) para que la próxima sesión lo lea al arrancar — como ya se hizo con la sección "Readiness de skills v2 (desde 1.5.0)".

Cuando el usuario pida hacer commit o pase de una tanda de cambios sustanciales sin haber bumpeado: avisar y proponer el bump antes de seguir.

## Instrucciones del usuario

El usuario es **Denis (denis.yeromenko@cloudappi.net)**. Idioma de trabajo: **español**. Hoy: **2026-05-08**.
