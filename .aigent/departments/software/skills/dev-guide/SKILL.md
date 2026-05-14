---
name: "dev-guide"
description: >
  Skill for writing a developer guide for the project — the document beyond the
  README that an engineer reads on day 1: architecture overview, dev environment
  setup, codebase tour, contribution workflow, common tasks ("how do I add a
  new X"), troubleshooting. Living document. Stack agnostic.
---

# Skill: Dev Guide — guía de desarrollo del proyecto

**Entregable:** archivo `dev-guide.md` que vive en `<proyecto>/docs/` o la raíz del repo (a confirmar con el orquestador). Es el documento que un nuevo dev lee tras el README para tener autonomía operativa en el código del proyecto. Documento vivo: se actualiza cuando cambia el setup o la arquitectura.

---

## Cuándo usar esta skill

- Nuevos devs se incorporan al proyecto repetidamente con las mismas preguntas y conviene cerrar la respuesta por escrito.
- El README ha crecido por encima de su zona razonable (>300 líneas) y conviene desdoblar lo "detallado" en una guía aparte.
- Tras un cambio sustancial de arquitectura, herramientas o workflow.
- Como entregable cuando se cierra un proyecto handoff a otro equipo.

**Cuándo NO usar:**

- Para el README (es la puerta corta del proyecto) — eso es `readme`.
- Para una decisión técnica concreta — eso es un ADR (`adr`).
- Para operación en producción — eso es `runbook`.
- Para guía de migración entre versiones — eso es `migration-guide`.
- Para spec de una feature concreta — eso es `tech-spec` o `feature-prd`.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Audiencia | ¿Dev externo que se incorpora? ¿Dev interno onboardando? ¿Equipo que recibe handoff? |
| Estado del proyecto | Greenfield · early stage · maduro · maintenance. Cambia el nivel de detalle esperado. |
| Stack completo | Lenguajes, frameworks, runtimes, bases de datos, message queues, caches, herramientas de build. |
| Estructura del repo | Carpetas principales y qué hay en cada una. Si es monorepo, packages/apps. |
| Setup local | Pasos exactos para levantar el proyecto en local desde cero (Docker, scripts, env vars). |
| Tests y CI | Cómo se corren los tests, qué cubre cada nivel, cómo es el pipeline. |
| Workflow de desarrollo | Branching strategy, conventional commits, code review, release process. |
| ADRs existentes | ¿Qué decisiones de arquitectura ya están documentadas? Para referenciar, no para repetir. |
| Common tasks | ¿Qué tareas se repiten? (añadir endpoint, añadir migración, añadir test, deployar a staging). |
| Troubleshooting | Problemas típicos de setup / runtime y cómo se resuelven. |

---

## Plantilla del entregable

```markdown
# Developer Guide — <Project Name>

- **Fecha última revisión:** YYYY-MM-DD
- **Versión del doc:** <semver simple>
- **Audiencia:** <new joiners / equipo entero / handoff>
- **Estado del proyecto:** <greenfield / early / maduro / maintenance>

> Si vienes nuevo: lee primero el [README](../README.md), luego sigue esta guía
> en orden. Si solo buscas algo concreto, salta al índice.

---

## Índice

1. [Visión rápida](#visión-rápida)
2. [Setup del entorno](#setup-del-entorno)
3. [Estructura del repo](#estructura-del-repo)
4. [Cómo corre el proyecto en local](#cómo-corre-el-proyecto-en-local)
5. [Tests](#tests)
6. [Workflow de desarrollo](#workflow-de-desarrollo)
7. [Common tasks](#common-tasks)
8. [Decisiones de arquitectura](#decisiones-de-arquitectura)
9. [Troubleshooting](#troubleshooting)
10. [Recursos adicionales](#recursos-adicionales)

---

## Visión rápida

<5-10 líneas. Qué hace el proyecto a nivel funcional, qué stack tiene, qué tipo
de proyecto es (web app, API, library, monorepo). Si hay un diagrama de alto
nivel, ponerlo aquí (ASCII o mermaid).>

**Stack principal:**

| Capa | Tecnología |
|---|---|
| Backend | <lenguaje · framework> |
| Frontend | <lenguaje · framework> |
| Base de datos | <tipo · versión> |
| Cache | <si aplica> |
| Message queue | <si aplica> |
| Infra | <docker / k8s / serverless / VM> |
| CI/CD | <github actions / gitlab ci / jenkins / ...> |

---

## Setup del entorno

### Requisitos del sistema

- <runtime · versión mínima>
- <docker · versión>
- <herramienta CLI · versión>

### Pasos

```bash
# 1. Clone
git clone <repo>
cd <repo>

# 2. Dependencias
<comando de instalación>

# 3. Variables de entorno
cp .env.example .env
# Editar .env con los valores reales (ver "Variables de entorno" abajo)

# 4. Servicios dependientes (DB, cache, ...)
docker compose up -d

# 5. Migraciones / seeds
<comando de setup inicial>

# 6. Levantar la app
<comando para arrancar>
```

### Variables de entorno

| Variable | Default | Para qué | Cómo obtener |
|---|---|---|---|
| `<VAR_1>` | <default> | <una línea> | <link al panel o "preguntar a owner"> |
| `<VAR_2>` | — | <una línea> | <link> |

> Secretos reales NUNCA en `.env.example`. Solo placeholders.

### Comprobación de que el setup funciona

```bash
<comando smoke test>
```

Si ves <output esperado> → estás listo.

---

## Estructura del repo

```
<raíz>/
├── <carpeta 1>/    ← <qué hay aquí, qué pertenece a esta carpeta>
├── <carpeta 2>/    ← ...
├── tests/          ← <organización de tests>
├── docs/           ← documentación extendida (esta guía + ADRs + runbooks)
├── scripts/        ← scripts utilitarios para devs
└── infra/          ← config de infra (compose, k8s, terraform)
```

### Capas / módulos clave

- **`<módulo 1>`** — <qué hace + cómo se relaciona con los demás>
- **`<módulo 2>`** — ...

### Naming conventions

<Reglas de naming relevantes a la estructura. Si está en `code-docs-style.md`,
referenciar y no repetir.>

---

## Cómo corre el proyecto en local

```bash
<comando 1>
<comando 2>
```

- **Puerto local:** <port>
- **Hot reload:** <sí / no / cómo>
- **Acceso a la BD local:** <cómo conectarse, credenciales del compose>

### Endpoints / pantallas principales en local

- <ruta o URL · qué se ve · usuario de prueba si aplica>

---

## Tests

### Pirámide actual

| Nivel | Cantidad aproximada | Comando | Tiempo |
|---|---|---|---|
| Unit | <N> | `<cmd>` | <s> |
| Integration | <N> | `<cmd>` | <s> |
| E2E | <N> | `<cmd>` | <min> |
| Performance | <N> | `<cmd>` | <min> |

### Cómo escribir un test nuevo

<Ejemplo concreto del framework de testing del proyecto. Snippet ejecutable.>

### Cobertura

- **Comando:** `<cmd>`.
- **Target:** <%>.
- **CI gate:** <% mínimo para que el PR mergee>.

---

## Workflow de desarrollo

### Branching strategy

- **Base branch:** `main` (siempre deployable).
- **Branches de feature:** `feat/<short-description>` desde `main`.
- **Branches de fix:** `fix/<short-description>`.
- **Hotfix:** `hotfix/<short-description>` desde el tag de release afectado.

### Commits

- Conventional Commits (ver `commit-message` skill / linter `commitlint`).
- Squash on merge / merge commit / rebase: <regla del proyecto>.

### Pull requests

- Plantilla en `.github/PULL_REQUEST_TEMPLATE.md` (si existe).
- Mínimo <N> approvals.
- CI verde obligatorio.
- Code owners: ver `CODEOWNERS`.

### Release

- Tipo: continuous / on-demand / cadencia fija.
- Versionado: semver / calver / otro.
- Changelog: `CHANGELOG.md` siguiendo Keep a Changelog (skill `changelog-entry`).
- Deploy: ver `runbook` para detalles operativos.

---

## Common tasks

> Recetas para tareas que se repiten. Mantener actualizadas — si una tarea
> cambia de pasos, este es el sitio.

### ¿Cómo añado un endpoint nuevo?

1. <paso 1: dónde se declara la ruta>
2. <paso 2: dónde va el handler>
3. <paso 3: tests asociados>
4. <paso 4: documentar en `api-spec`>

### ¿Cómo añado una migración de BD?

1. <paso 1: comando del migration tool>
2. <paso 2: convenciones de nombre>
3. <paso 3: aplicar en local + verificar rollback>

### ¿Cómo añado un test e2e?

<receta>

### ¿Cómo deployo a staging?

<receta corta — el detalle pleno va en runbook>

### ¿Cómo debuggeo localmente?

<setup del debugger, breakpoints, logs verbose>

---

## Decisiones de arquitectura

> Resumen. El detalle vive en los ADRs de `<proyecto>/software/architecture/adr/`.

| ADR | Decisión | Estado |
|---|---|---|
| [ADR-001](link) | <una línea> | Accepted |
| [ADR-002](link) | <una línea> | Accepted |
| ... | ... | ... |

---

## Troubleshooting

### Problemas comunes de setup

**"<síntoma típico>"** — <causa probable + solución>.

**"<otro síntoma>"** — <causa probable + solución>.

### Logs y monitoring local

- **Logs de la app:** <dónde se ven>
- **Logs del docker compose:** `docker compose logs -f <servicio>`
- **DB logs:** <si aplica>

---

## Recursos adicionales

- 📘 **README** — visión corta del proyecto: [../README.md](../README.md)
- 🧭 **ADRs** — decisiones de arquitectura: <path>
- 🚦 **Runbook** — operación en producción: <path>
- 🌐 **API spec** — contratos públicos: <path>
- 🔄 **Migration guides** — saltos de versión: <path>
- 📐 **Code docs style** — convenciones de doc inline: <path>
- 🎨 **Design System** — componentes UI (si aplica): <path>
- 💬 **Canal de comunicación** — Slack/Discord/Teams: <link>
- 🐛 **Issue tracker:** <link>

---

## Mantenimiento de esta guía

Esta guía es un documento vivo. Si haces un cambio en el proyecto que
invalida una sección, actualízala en el mismo PR. Owner: <equipo o persona>.
```

---

## Proceso

1. **Recopilar** la información (sección anterior).
2. **Inspeccionar el repo** para conocer estructura real, comandos reales (no inventados), variables de entorno reales del `.env.example`.
3. **Mapear el conocimiento tácito a las secciones** — el dev senior del equipo sabe responder "cómo añado un endpoint" sin pensar. Hay que entrevistarlo y plasmarlo.
4. **Reusar lo que ya hay:**
   - Si existe `code-docs-style.md`, link y no repetir.
   - Si existen ADRs, referencia con tabla; el resumen va aquí, el detalle allá.
   - Si existe `runbook`, link en operación / deploy.
5. **Adaptar al estado del proyecto:**
   - Greenfield → guía corta enfocada a "cómo arrancar".
   - Maduro → secciones de common tasks ricas y troubleshooting trabajado.
   - Maintenance → especial cuidado en troubleshooting y owners.
6. **Marcar con `[COMPLETAR]`** lo que dependa de info que no tienes (canales de comunicación, owners por área).
7. **Probar los comandos** del setup en una máquina limpia (o mentalmente con detalle) antes de cerrar.
8. **Guardar** en `<proyecto>/docs/dev-guide.md` (o `<proyecto>/software/architecture/dev-guide.md` si el orquestador prefiere consolidar dentro de software).
9. **Reportar al usuario:**
   - Ruta del archivo creado.
   - Secciones con `[COMPLETAR]` que necesitan input humano.
   - Links que requieren rellenar (canales, dashboards).
   - Próximos pasos: comunicar al equipo, revisión por owner, sincronizar con README.

---

## Restricciones

- **No duplicar contenido entre README y dev-guide.** El README es puerta corta; la dev-guide es profundidad. Si algo está en uno, en el otro va por link.
- **No incluir secretos** (URLs internas privadas, credenciales, tokens, datos sensibles). Para acceso, link a panel o "preguntar a owner".
- **No documentar lo obsoleto.** Si un common task tiene 3 formas de hacerse y dos están deprecadas, documentar solo la vigente y borrar las otras.
- **No prometer "siempre actualizada".** La guía es documento vivo PERO se desactualiza. Marcar fecha de última revisión y pedir que cada PR sustancial actualice lo afectado.
- **No copiar la dev-guide de otro proyecto sin adaptarla.** Una dev-guide genérica es ruido. Cada proyecto tiene sus matices y el valor está ahí.
- **No mezclar dev-guide con runbook.** Dev-guide es "cómo trabajo en este código". Runbook es "cómo opero este servicio en producción". Audiencias distintas, momentos distintos.
- Aplican las reglas de output de `_shared/output-rules.md`.
