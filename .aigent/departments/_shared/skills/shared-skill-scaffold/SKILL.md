---
name: "shared-skill-scaffold"
user-invocable: true
description: >
  Plantilla única para crear un SKILL.md (v1 prosa o v2 ejecutable engine-v2).
  Decide el modo según el caso de uso, recopila lo necesario, escribe el archivo
  en .aigent/departments/<dept>/skills/<name>/, y valida con el engine si es v2.
---

# Skill: Skill Scaffold

**Entregable:** un único archivo `.aigent/departments/<dept>/skills/<skill-name>/SKILL.md` siguiendo las convenciones de `_shared/conventions.md` (§7 para v1, §12-15 para v2).

---

## Cuándo usar esta skill

Cuando hay que crear una skill nueva en el repo, sea del tipo que sea. Esta skill cubre los dos modos:

- **Modo v1 — prosa.** El valor está en el razonamiento del LLM: redactar, decidir, priorizar, estructurar entregables (posts, briefs, planes, emails, análisis).
- **Modo v2 — ejecutable.** La operación es determinista contra una API HTTP: leer/escribir recursos, listar entidades, postear comentarios, etc. La ejecuta el engine v2.

**Cuándo NO usar:**

- Si ya existe un MCP fiable para la herramienta → preferir el MCP.
- Si la skill necesita ejecutar bash u otra cosa que el engine aún no soporta → 🚧 hoy no disponible (ver `_shared/conventions.md` §13).

## Decidir el modo: v1 o v2

Una sola pregunta al usuario si no está claro:

> *"¿Esta skill va a hacer llamadas HTTP a una API (v2) o es para que un agente redacte/decida algo (v1)?"*

| Pregunta clave | Respuesta → modo |
|---|---|
| ¿La salida es JSON estructurado de un endpoint? | v2 |
| ¿La salida es contenido humano (texto, post, brief)? | v1 |
| ¿Hay que renderizar una request HTTP con templating? | v2 |
| ¿Hay que decidir tono / priorizar / razonar? | v1 |

## Información común a recopilar (ambos modos)

| Campo | Descripción |
|---|---|
| `base` | Kebab-case, único dentro del dept. Ej: `blog-post`, `slack`, `github-issues`. |
| `location` | Dónde vive la skill. Ver "Decidir ubicación" más abajo. Tres opciones: `<dept>` (vive en un departamento), `_shared` (compartida entre depts; ver `conventions.md` §7.1) u `operations` típico para v2 transversal. |
| `folder` y `name` | Iguales entre sí (§4.1). Se calculan como `<dept-prefix>-<base>` salvo que `base` ya empiece por el prefijo (no doblar). Ejemplo: carpeta `marketing/skills/marketing-copy/` + `name: "marketing-copy"`. Para `_shared/skills/` el prefijo es `shared-`: `_shared/skills/shared-competitive-analysis/` + `name: "shared-competitive-analysis"`. |
| `description` | Una frase. Va al frontmatter. |
| `cuando-usar` | 2-4 viñetas de cuándo aplicar la skill. |
| `cuando-no-usar` | 1-2 viñetas de casos fuera de alcance. |

Una vez decidido el modo y la ubicación, saltar a la sección correspondiente de abajo.

## Decidir ubicación: dept o `_shared/`

Antes de escribir, evaluar si la skill es candidata a **compartida** (vive en `_shared/skills/`) o **de departamento** (vive en `<dept>/skills/`). La regla canónica está en `conventions.md` §7.1.

**Vive en `_shared/skills/` si todos los criterios se cumplen:**

1. **≥2 departments la usan o la usarán razonablemente.** Si solo uno la consume, va al dept de ese agente.
2. **El entregable es genuinamente idéntico.** No solo el nombre coincide: la plantilla, la información a recopilar y el proceso son los mismos.
3. **No hay matices fuertes por dept** que justifiquen una plantilla propia. Los placeholders genéricos los adapta el agente caller al contexto, pero la estructura del entregable no cambia.

**Vive en un dept si:**

- Solo un agente la consume.
- El entregable cambia significativamente según contexto (ej. `landing-page` no es lo mismo en marketing que en sales).
- Tiene tooling, vocabulario o normativa muy específicos de un dominio.

**Cuando dudes**, preguntar al usuario con criterios explícitos:

> *"Esta skill `<name>` ¿la consumirán agentes de varios departments con la misma estructura, o es específica de `<dept>`? Si es lo primero, vive en `_shared/skills/`. Si dudamos pero veo solapamiento, propongo `_shared/`; siempre podemos moverla si emerge drift."*

**Anti-drift:** una skill compartida que empieza a recibir variantes por dept es señal de que debe duplicarse y vivir en cada dept con su matiz. No forzar lo compartido.

**Naming**: la carpeta lleva prefijo `shared-` y el `name:` del frontmatter coincide (§4.1): `_shared/skills/shared-competitive-analysis/` con `name: "shared-competitive-analysis"`.

---

## Modo v1 — Skill de prosa

### Información adicional a recopilar

| Campo | Descripción |
|---|---|
| `entregable` | Tipo concreto del output: `.md`, `.html`, carpeta con varios archivos, etc. |
| `info-recopilar` | Tabla de campos que el agente debe pedir al usuario antes de generar. |
| `template` | Estructura del entregable (con marcadores `<...>`). |
| `proceso` | Pasos numerados que el agente sigue: 1. recopilar → 2. validar → 3. generar → … |
| `restricciones` | Qué no puede hacer la skill, errores típicos a evitar. |

### Plantilla v1

```markdown
---
name: "<dept-prefix>-<base>"
user-invocable: true
description: >
  <Una frase clara: qué hace la skill, qué entregable produce, en qué dominio aplica.>
---

# Skill: <Nombre Humano>

**Entregable:** <tipo concreto del output, ej: archivo .md, carpeta con .md+.html, brief en formato markdown>

---

## Cuándo usar esta skill

- <caso 1>
- <caso 2>

**Cuándo NO usar:**
- <fuera de alcance 1>

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| <campo 1> | <pregunta concreta> |
| <campo 2> | <pregunta concreta> |

## Plantilla del entregable

<estructura del archivo final, con marcadores reemplazables>

## Proceso

1. **Recopilar** información (sección anterior). Validar con el usuario si hay campos críticos vacíos.
2. **Generar** el entregable siguiendo la plantilla.
3. **Guardar** en la ruta correspondiente del proyecto activo (ver `_shared/output-rules.md`).
4. **Comunicar** al usuario la ruta exacta del archivo creado.

## Restricciones

- <qué la skill NO debe hacer>
- Aplican las reglas de output de `_shared/output-rules.md`.
```

### Reglas estrictas v1

- **NO incluir `runtime: engine-v2`** — eso es exclusivo de v2.
- Frontmatter en inglés. Body en español.
- `name` del frontmatter = nombre de la carpeta. Kebab-case.
- Estructura mínima del body en este orden: `# Skill: ...` → `**Entregable:** ...` → `## Cuándo usar esta skill` → `## Información a recopilar` → `## Plantilla del entregable` → `## Proceso`.
- Nunca declarar qué agentes usan la skill: la asociación vive en el orquestador / agente.

### Verificación v1 (checklist estructural)

- [ ] Frontmatter parseable: delimitadores `---` correctos, `name` y `description` presentes.
- [ ] Body contiene las secciones obligatorias en el orden indicado.
- [ ] `name` del frontmatter coincide con el nombre de la carpeta.
- [ ] Sin `runtime: engine-v2`.
- [ ] Idioma: frontmatter inglés, body español.

### Referencias canónicas v1

- `marketing/skills/marketing-elementor-content/SKILL.md` — entregable de carpeta con varios archivos.
- `marketing/skills/marketing-copy/SKILL.md` — entregable de archivo único, multiformato (blog/email/anuncio/prensa).
- `marketing/skills/marketing-strategy/SKILL.md` — brief/plan estructurado con campos fijos.

---

## Modo v2 — Skill ejecutable (engine-v2 HTTP)

### Información adicional a recopilar

| Campo | Descripción |
|---|---|
| `version` | Semver, normalmente `0.1.0` para nueva. |
| `base_url` | URL base de la API (sin trailing slash). Va a `tools.<name>.base_url` en `.context/config.json`. |
| `auth` | Esquema: `Authorization: Bearer ...`, `X-API-Key: ...`, `Authorization: Basic ...`. Identificar el nombre del env var (UPPER_SNAKE_CASE). |
| `actions` | Lista de operaciones. |

Para cada acción:

| Campo | Descripción |
|---|---|
| `name` | Kebab-case. Ej: `list-channels`, `post-message`, `get-user`. |
| `description` | Una frase. Qué hace, defaults relevantes. |
| `method + path` | Ej: `GET /channels`, `POST /messages`, `PUT /issues/:id`. |
| `inputs` | Por cada input: nombre, type (`string`/`integer`/`number`/`boolean`/`array`), required, default opcional, enum opcional. |
| `body` | Si POST/PUT con JSON, plantilla del body con marcadores. |
| `output` | `type: json|text` y descripción de la forma esperada. |

### Plantilla v2

```markdown
---
name: "<dept-prefix>-<base>"
version: "0.1.0"
description: >
  <Una frase: qué cubre la skill.>
user-invocable: true
runtime: engine-v2

config:
  base_url:
    type: string
    required: true
    path: tools.<base>.base_url
    description: "URL base de la API <herramienta> sin trailing slash. Vive en .context/config.json bajo tools.<base>.base_url"

secrets:
  - name: <SKILL_NAME>_API_TOKEN
    required: true
    description: "Token de autenticación para <herramienta>. Cómo obtenerlo: <link al panel donde se genera>."

actions:
  <action-1>:
    description: "<una línea>"
    impl: { type: http, ref: "<action-1>" }
    inputs:
      <input-name>:
        type: <string|integer|number|boolean|array>
        required: <true|false>
        default: <opcional>
        enum: <opcional, [...]>
        description: "<contexto del input>"
    output:
      type: json
      description: "<forma esperada del output>"

  <action-2>:
    description: "..."
    impl: { type: http, ref: "<action-2>" }
    inputs: {}
    output:
      type: json
      description: "..."
---

# Skill: <Nombre Humano>

Skill ejecutable contra la API REST de <herramienta>. Cubre <resumen>.

**Cuándo usar:**
- <caso 1>
- <caso 2>

**Cuándo NO usar:**
- Si la operación necesita decidir qué pedir o cómo redactar — eso lo hace el agente.

**Requisitos:**
- `.context/config.json` con `tools.<skill-name>.base_url` declarado.
- Env var `<SKILL_NAME>_API_TOKEN` definido (o entrada en `.context/.secrets.json`).

---

## Antes de ejecutar (precheck para el agente caller)

Antes de llamar a `run` por primera vez en una sesión, ejecuta el precheck:

```bash
node .aigent/v2/engine/engine.cjs doctor <skill-name>
```

- Si `data.skills[0].ready === true` → adelante, ejecuta `run`.
- Si `ready: false` → **NO ejecutes `run`**. Inicia el flujo de configuración (delegando en `shared-skill-builder configure` o ejecutando `configure` + `prepare-secrets` directamente). Solo reintenta el `run` cuando un nuevo `doctor` devuelva `ready: true`.

**Regla de seguridad — secrets nunca por chat:** los valores de los secretos (API keys, tokens) no se piden al usuario en la conversación. Si la skill necesita un secret y no está set, indica al usuario qué placeholder editar en `.context/.secrets.json` (o qué variable de entorno definir) y espera su confirmación. Si el usuario intenta dictar el valor por chat, rechaza el valor explícitamente.

**Errores reactivos.** Si por algún motivo se llamó a `run` sin precheck y devuelve `CONFIG_ERROR` o `SECRETS_ERROR`, leer `error.details.next` (lista de comandos exactos) y `error.details.missing_secrets` (sin valores, sólo nombres) para resolver el bloqueo. El engine NO devuelve valores de secretos en sus respuestas.

---

## Acciones

Todas se ejecutan vía:

```
node .aigent/v2/engine/engine.cjs run <skill-name> <action> --inputs '{"...": "..."}'
```

### <action-1>

<Una línea sobre qué hace.>

```http name="<action-1>"
GET {{config.base_url}}/<path>?<param1>={{inputs.<param1>?}}&<param2>={{inputs.<param2>}}
Authorization: Bearer {{secrets.<SKILL_NAME>_API_TOKEN}}
Accept: application/json
```

### <action-2>

```http name="<action-2>"
POST {{config.base_url}}/<path>
Authorization: Bearer {{secrets.<SKILL_NAME>_API_TOKEN}}
Content-Type: application/json
Accept: application/json

{
  "<key1>": "{{inputs.<key1>}}",
  "<key2>": {{inputs.<key2>}},
  "<key3>": "{{inputs.<key3>?}}"
}
```

---

## Notas para el engine

- Auth: header preferible a query string para tokens.
- Tipos en body JSON: `string` con comillas, `integer/number/boolean` sin comillas. Inputs opcionales con `?` se eliminan de la línea si ausentes.
- Endpoints que devuelven 204 → el engine devuelve `data: null`.
- Paginación: si la API la usa, exponer `limit`/`offset` (o `cursor`) como inputs.
```

### Reglas estrictas v2

#### Frontmatter
- `runtime: engine-v2` **obligatorio** o el engine no carga la skill.
- `name` kebab-case, único en el repo, igual al nombre de la carpeta.
- `version` semver. Empezar en `0.1.0`.
- `description` con `>` (folded) si ocupa varias líneas.
- `config.<key>.path` con prefijo `tools.<skill-name>.` para encajar con `.context/config.json`.
- `secrets[].name` UPPER_SNAKE_CASE (convención de variables de entorno).
- Cada acción declara `impl: { type: http, ref: "<action>" }` donde `ref` coincide con el atributo `name=` del bloque.

#### Inputs
- Cada input declara `type` (`string` / `integer` / `number` / `boolean` / `array`).
- `required: true` sin `default` → falla si el llamante no aporta el input.
- `required: false` con `default` → siempre se aplica el default si no se aporta.
- `enum`: lista de valores permitidos (mismo type que el input).
- **No usar `required: true` con `default`** simultáneamente — el default nunca se aplicaría.

#### Templating
- `{{config.<key>}}` — valor de config.
- `{{inputs.<name>}}` — valor del input.
- `{{inputs.<name>?}}` — input opcional. Si ausente:
  - en URL query string → el `&key=...` desaparece entero.
  - en body JSON → la línea entera se elimina y se limpian comas trailing.
- `{{secrets.<NAME>}}` — secret (env var o `.secrets.json`).

#### Tipos en body JSON

| Input declarado como | Cómo escribirlo en el body | Resultado |
|---|---|---|
| `string` | `"key": "{{inputs.x}}"` | `"key": "valor"` |
| `integer` / `number` / `boolean` | `"key": {{inputs.x}}` (sin comillas) | `"key": 42` |
| Cualquier tipo, opcional | misma sintaxis con `?` — la línea se elimina si ausente | `"key"` no aparece |

#### Bloques de body
- Primera línea: `<METODO> <URL>`.
- Líneas siguientes: headers (`Header-Name: value`).
- **Línea en blanco** separa headers del body (si lo hay).
- Body: JSON válido tras el render. El engine valida con `JSON.parse` antes de llamar a fetch.

#### Multi-acción
- Una acción = una llamada lógica. Si una operación necesita encadenar 3 llamadas, son 3 acciones + un agente que las componga.

### Verificación v2 (con engine — bucle)

0. **Estructura mínima del body.** Comprobar que el SKILL.md tiene, en este orden: `# Skill: ...` → cuándo usar/no usar → `**Requisitos:**` → **`## Antes de ejecutar (precheck para el agente caller)`** (con la regla `doctor` antes de `run` y la regla "secrets nunca por chat") → `## Acciones`. La sección de precheck es **obligatoria** en toda skill v2.

1. **Validar:**
   ```bash
   node .aigent/v2/engine/engine.cjs validate <name>
   ```
   - Si `ok: false` → leer `error.details.errors`, corregir el SKILL.md, re-validar. Iterar hasta `ok: true`.
   - Si `ok: true` con `data.warnings` no vacío → mostrarlos al usuario y proponer corrección si son sustanciales (descripciones faltantes, inputs declarados pero no usados…).

2. **Dry-run** de cada acción con inputs realistas:
   ```bash
   node .aigent/v2/engine/engine.cjs dry-run <name> <action> --inputs '{...}'
   ```
   Comprobar visualmente que `method`, `url`, `headers` y `body` se renderizan correctamente. Los secrets aparecen como `***SECRET:NAME***` (real) o `***SECRET:NAME:UNSET***` (placeholder, normal hasta configurar).

3. **Pedir al usuario** que añada la entrada a `.context/config.json`:
   ```json
   "tools": {
     "<skill-name>": { "base_url": "https://..." }
   }
   ```
   y que defina la env var del secret (o la añada a `.context/.secrets.json` para desarrollo local — el engine crea el fichero y el `.context/.gitignore` automáticamente al llamar a `prepare-secrets`).

4. **Smoke test (opcional, requiere confirmación explícita):** una acción de sólo lectura (`list-*`, `get-*`) contra el endpoint real:
   ```bash
   node .aigent/v2/engine/engine.cjs run <name> <safe-read-action> --inputs '{...}'
   ```

### Referencias canónicas v2

- `operations/skills/operations-redmine/SKILL.md` — referencia completa: 9 acciones, GET con query opcional, POST con body JSON, PUT con notas, defaults, enums.
- `_shared/conventions.md` §12-15 — contrato del frontmatter, body, templating, riesgos.

---

## Proceso (común a ambos modos)

1. **Recopilar** los campos comunes (sección "Información común"). Si dudas entre v1 y v2, preguntar.
2. **Decidir ubicación** según la sección "Decidir ubicación" — dept específico o `_shared/`. Si hay duda y existe solapamiento real entre depts, proponer `_shared/`.
3. **Decidir el modo** según los criterios de arriba (v1 vs v2).
4. **Recopilar** los campos adicionales del modo elegido.
5. **Crear la carpeta** según ubicación:
   - Si la skill es de departamento: `.aigent/departments/<dept>/skills/<name>/`
   - Si la skill es compartida: `.aigent/departments/_shared/skills/<name>/`
6. **Escribir** `<name>/SKILL.md` con la plantilla del modo elegido, sustituyendo todos los `<...>`.
7. **Verificar:**
   - v1 → checklist estructural.
   - v2 → bucle `engine.cjs validate` + `dry-run`.
8. **Si es compartida**, identificar los agentes consumidores conocidos y avisar al usuario para que la añada a su sección `## Skills disponibles`. La skill no se documenta a sí misma con la lista de consumidores (regla §7); el agente conoce a la skill, no al revés.
9. **Reportar** al usuario:
   - Ruta del archivo creado (con la indicación clara de si vive en un dept o en `_shared/`).
   - (v2) Acciones disponibles.
   - (v2) Resultado de `engine.cjs validate`.
   - Comando de propagación al IDE: `bash .aigent/IDE/install.sh --sync --ide all --dept <dept>` (si es compartida, basta con `--ide all` porque `_shared/` se propaga siempre).
   - (v2) Próximo paso: configurar `.context/config.json` y env var del secret.
   - (compartida) Lista de agentes consumidores que conviene actualizar para que la listen en `## Skills disponibles`.

## Restricciones

- Nunca añadir `runtime: engine-v2` a una skill v1. Esa marca es exclusiva del engine.
- Nunca declarar features 🚧 en una skill v2 (pipelines, paginación automática, bash blocks). El engine no los soporta y la skill será rechazada al validar.
- Nunca poner valores de secrets en el SKILL.md, ni en `description`, ni en ejemplos. Sólo el `name` del env var.
- Nunca escribir fuera de `.aigent/departments/<dept>/skills/<name>/`. La fuente de verdad vive ahí; la distribución a IDEs (claude, opencode, vscode, …) es problema de `install.sh`.
- Nunca declarar qué agentes usan la skill dentro del SKILL.md. El agente conoce sus skills, no al revés.
- **No forzar el camino compartido.** Si los criterios de `conventions.md` §7.1 no se cumplen claramente, la skill vive en el dept correspondiente. Mejor empezar específico y promover a compartido si emerge reuso real, que arrancar compartido y descubrir drift entre depts.
- Aplican las reglas de output de `_shared/output-rules.md` con la siguiente excepción: el entregable de esta skill (el SKILL.md generado) sí vive dentro de `.aigent/`, porque el motor es lo que se está construyendo.
