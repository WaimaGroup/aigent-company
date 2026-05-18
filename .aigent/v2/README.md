# Aigent v2 — Engine de skills ejecutables

> Skills declarativas en frontmatter, ejecutadas por un engine genérico (Node) vía HTTP.
> Objetivo: reducir tokens y dependencia del LLM en operaciones deterministas.

## Arquitectura

```
.aigent/
├── departments/
│   ├── _shared/
│   │   ├── conventions.md              ← convenciones unificadas v1 + v2 (§12-15)
│   │   ├── agents/shared-skill-builder.md  ← agente que crea/auditá skills
│   │   └── skills/skill-scaffold/        ← plantilla única (modos v1 y v2)
│   └── <dept>/skills/<name>/SKILL.md   ← FUENTE (manifiesto + bloques http)
├── v2/
│   ├── engine/                         ← engine genérico (transversal)
│   └── .secrets.json                   ← tokens (gitignored)
├── ../.context/
│   ├── config.json                     ← global: tools.<skill>.<key>
│   └── <active_project>/config.json    ← override por proyecto (opcional)
└── IDE/install.{sh,ps1}                ← detecta runtime: engine-v2 → genera STUB
                                          en .claude/skills/<dept>-<name>/SKILL.md
                                          (~80% menos contexto que la fuente)
                                          Multi-IDE: claude, opencode, vscode…
```

**Una sola fuente de verdad:** `.aigent/departments/<dept>/skills/<name>/SKILL.md`.
Los stubs en `.claude/` y `.opencode/` son derivados, regenerables con `install.sh`.

## Estado

Iteración 1 funcional:
- Engine sin dependencias externas (parser YAML propio).
- Skill piloto Redmine en `operations/skills/operations-redmine/`.
- Installer detecta `runtime: engine-v2` y genera stubs (~1.3 KB) en lugar de copiar la fuente (~6.7 KB).
- Tests internos pasan: parser, validate, render de URL/headers/body con omisión de opcionales, integers como números, manejo de 204.

Pendiente: probar `run` contra una instancia real de Redmine; añadir runner `bash` cuando haga falta.

## Estructura de v2/

```
.aigent/v2/
├── README.md                       ← este archivo
├── engine/
│   ├── engine.js                   ← CLI principal (list / describe / validate / dry-run / run)
│   ├── parser.js                   ← parsea SKILL.md → manifest + bloques
│   ├── yaml.js                     ← parser YAML del subset (sin deps)
│   ├── template.js                 ← render con {{config.x}} / {{inputs.x?}} / {{secrets.X}}
│   ├── validate.js                 ← types, enum, required, defaults
│   ├── lint.js                     ← validación profunda del manifest (engine.js validate)
│   ├── dryrun.js                   ← render de la request HTTP sin ejecutar
│   ├── config.js                   ← carga config.json + secretos (env > file)
│   └── http.js                     ← runner HTTP (fetch nativo Node 18+)
├── package.json                    ← sin dependencias
├── .secrets.example.json           ← plantilla de secretos
├── .gitignore                      ← .secrets.json, node_modules
└── .secrets.json                   ← gitignored, lo crea el usuario

(config técnica: en .context/config.json, no aquí)
(convenciones: en departments/_shared/conventions.md, no aquí)
```

Nota: las **skills v2 NO viven en `.aigent/v2/skills/`** — viven en `.aigent/departments/<dept>/skills/<name>/`. El engine las descubre escaneando departments y filtrando por `runtime: engine-v2`.

## Arrancar

Solo requiere Node 18+ (fetch nativo). **No hay `npm install`.**

```bash
# 1. Config: añadir tools.<skill>.<...> en .context/config.json
#    (ver .context/config.example.json como plantilla, o usar `engine.js configure`)
$EDITOR .context/config.json

# 2. Secretos: ejecutar prepare-secrets (crea .context/.secrets.json + .context/.gitignore
#    automáticamente con placeholders para los secrets que la skill declare)
node .aigent/v2/engine/engine.js prepare-secrets <skill>
$EDITOR .context/.secrets.json   # rellenar los placeholders <replace_me_*>

# 3. Generar stubs en el IDE
bash .aigent/IDE/install.sh --ide claude --mode project --dept operations
# (o --ide all, o --dept all)
```

Como alternativa al `.context/.secrets.json`, exportar como variables de entorno (precedencia mayor):

```bash
export REDMINE_API_KEY="..."
```

## Comandos del engine

```bash
# Listar skills cargables (de todos los departamentos con runtime: engine-v2)
node .aigent/v2/engine/engine.js list

# Ver el contrato de una skill (acciones, inputs, outputs) — sin leer la fuente
node .aigent/v2/engine/engine.js describe operations-redmine

# Ejecutar una acción
node .aigent/v2/engine/engine.js run operations-redmine list-issues \
  --inputs '{"project_id":"internal-tools","limit":10}'
```

Output siempre JSON a stdout, errores también a stderr. Exit 0 si `ok:true`, 1 si error.

### Forma del output

```json
{ "ok": true,  "data": { ... }, "meta": { "status": 200, "duration_ms": 142 } }
{ "ok": false, "error": { "code": "HTTP_404", "message": "...", "details": {} }, "meta": {} }
```

Códigos de error que devuelve el engine:

| Código | Significado |
|---|---|
| `BAD_ARGS`, `BAD_CMD` | Uso incorrecto del CLI |
| `SKILL_NOT_FOUND` | Skill no existe en ningún departamento |
| `ACTION_NOT_FOUND` | La skill existe pero la acción no |
| `PARSE_ERROR` | El SKILL.md está malformado |
| `INVALID_INPUTS` | Inputs fallan tipo, enum, required o son desconocidos |
| `CONFIG_ERROR` / `SECRETS_ERROR` | Config o secret no resuelto |
| `INVALID_BODY_JSON` | El body renderizado no es JSON válido |
| `HTTP_<status>` | El endpoint devolvió status no-2xx |
| `TIMEOUT` / `NETWORK_ERROR` | Problema de red |
| `INTERNAL` | Error inesperado |

## Para construir nuevas skills v2

Ver `departments/_shared/conventions.md` §12-15 (convenciones unificadas v1 + v2). Una skill v2 = un `SKILL.md` con frontmatter declarativo + un bloque ` ```http name="..." ` por acción, ubicado en `.aigent/departments/<dept>/skills/<name>/`. No se escribe código por skill — solo el manifiesto y los bloques.

Forma recomendada de crear skills nuevas: delegar en el agente `shared-skill-builder` (en `_shared/agents/`), que recoge requisitos, llama a la skill correspondiente (`skill-scaffold-v1` o `skill-scaffold-v2`) y valida el resultado contra el engine.

El frontmatter usa un subset de YAML que parsea el engine sin dependencias. Tabla del subset soportado: `departments/_shared/conventions.md` §14.

## Cuándo NO usar v2

- Si ya existe un MCP fiable para la herramienta → usar el MCP.
- Si la operación necesita razonamiento (decidir qué pedir, cómo redactar, cómo priorizar) → eso lo hace un agente; v2 es solo la mano determinista.
- Si la skill v1 (instrucción al LLM) cubre el caso sin coste excesivo de tokens → 