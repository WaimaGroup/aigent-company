# Changelog

Todas las versiones notables del sistema Aigent se documentan aquí.
Formato: `## X.Y.Z — YYYY-MM-DD` seguido de cambios por departamento.

---
## 1.16.1 — 2026-05-18

### gitignore

Se ha añadido el gitignore

## 1.16.0 — 2026-05-14

### READMEs de casos de uso por departamento (9 nuevos)

Cada dept implementado (8) más `_shared/` ahora tiene un `README.md` con ejemplos completos de cada agente y cada skill: prompt de entrada realista, output esperado (estructura completa simulada con valores, tablas y snippets de 20-40 líneas) y ruta donde se guarda. Sirven como documentación viva para onboarding de usuarios, referencia rápida y como anti-fricción cuando se duda de qué pedir.

Cobertura total: **~130 casos de uso** (35 agentes especialistas + 2 transversales + 75 skills dept + 10 skills compartidas + flujos end-to-end típicos por dept).

---

### 9 READMEs nuevos

| Archivo | Contenido |
|---|---|
| `.aigent/departments/software/README.md` | 4 agentes + 19 skills + 1 shared. 23 ejemplos + flujo feature y bugfix end-to-end. |
| `.aigent/departments/marketing/README.md` | 5 agentes + 13 skills. 18 ejemplos + flujo de lanzamiento. |
| `.aigent/departments/sales/README.md` | 4 agentes + 11 skills + 3 shared referenciadas. 15 ejemplos + flujo del funnel. |
| `.aigent/departments/hr/README.md` | 4 agentes + 7 skills. 11 ejemplos + flujo recruitment→onboarding→evaluation. |
| `.aigent/departments/product/README.md` | 3 agentes + 6 skills + 6 shared referenciadas. 9 ejemplos + flujo discovery→roadmap→ship. |
| `.aigent/departments/finance/README.md` | 3 agentes + 7 skills + 2 shared referenciadas. 10 ejemplos + cierre mensual/trimestral/anual. |
| `.aigent/departments/legal/README.md` | 4 agentes + 6 skills + 2 shared referenciadas. 10 ejemplos + flujo onboarding cliente + audit. |
| `.aigent/departments/design/README.md` | 4 agentes + 6 skills + 1 shared referenciada. 10 ejemplos + flujo feature visual + DS update. |
| `.aigent/departments/_shared/README.md` | 2 agentes transversales (shared-prd-agent, shared-skill-builder) + 10 skills compartidas (2 meta + 8 business). 12 ejemplos + tabla de "cuándo invocar transversales vs depts". |

Estructura canónica de cada README (acordada con el usuario):

1. **Header** — frase + link al orquestador y al `.aigent/README` maestro.
2. **Cómo se invoca** — 3 vías (orquestador / agente / skill directa).
3. **Agentes** — un caso de uso por cada agente, con prompt + output esperado (estructura completa) + ruta.
4. **Skills propias del dept** — un caso de uso por cada skill (las que ya tienen ejemplo en su agente solo referencian).
5. **Skills compartidas usadas** — listado con referencia a `_shared/README.md`.
6. **Flujo end-to-end típico** — diagrama ASCII de cómo se encadenan agentes y skills en escenarios reales.

---

### Cross-reference desde `.aigent/README.md`

Nueva sección "Casos de uso por departamento" en el `.aigent/README.md` con tabla que linka a los 9 nuevos READMEs.

---

### Archivos editados

**READMEs nuevos:**
- `.aigent/departments/software/README.md` (nuevo)
- `.aigent/departments/marketing/README.md` (nuevo)
- `.aigent/departments/sales/README.md` (nuevo)
- `.aigent/departments/hr/README.md` (nuevo)
- `.aigent/departments/product/README.md` (nuevo)
- `.aigent/departments/finance/README.md` (nuevo)
- `.aigent/departments/legal/README.md` (nuevo)
- `.aigent/departments/design/README.md` (nuevo)
- `.aigent/departments/_shared/README.md` (nuevo)

**Cross-ref + versionado:**
- `.aigent/README.md` (sección "Casos de uso por departamento" añadida)
- `.aigent/VERSION` (1.15.0 → 1.16.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.15.0 — 2026-05-14

### Software — iteraciones 2+3+4: workflow coding + docs técnicas + deploy shared (9 skills nuevas)

Segunda tanda de la ampliación del dept Software. Se cierran las tres iteraciones restantes del plan en un solo release: (2) workflow skills agnósticos de lenguaje para `software-coding`, (3) skills de documentación técnica para `software-architecture` con scope ampliado, y (4) `deploy-checklist` como skill compartida usable por software hoy y devops mañana. Aplicación reiterada de la regla "menos agentes ≠ mejor": ningún agente nuevo, todo encaja como skills colgando de los 4 existentes.

**Estado tras esta versión:** 85 skills totales (75 dept-específicas + 8 business compartidas + 2 meta). Software pasa de 11 a 19 skills (+8 propias + 1 shared accesible). El `_shared/` business pasa de 7 a 8 skills.

---

### Iteración 2 — 4 workflow skills nuevas en `software/skills/` (consumidora: `software-coding`)

- **`feature-implementation`** — Workflow estructurado para implementar una feature desde spec. Pre-flight: lectura del spec, lectura del contexto del repo (módulo + ADRs + decisions + tests existentes), planificación (archivos previstos, dependencias nuevas, tests a producir, riesgos), confirmación con el usuario si hay desviaciones. Ejecución: cambios con `Edit/Write`, tests al lado, atomicidad estricta, sin comentarios redundantes. Post-flight: reporte con archivos tocados, AC cubiertos (✅/🟡/❌), tests añadidos / pendientes, TODOs, decisiones tomadas, próximos pasos. Vive el reporte en `<proyecto>/software/code/.reports/feature-<slug>.md`.
- **`bugfix-workflow`** — Workflow para arreglar un bug en 4 pasos: (1) Reproduce — reproducción confirmada local antes de tocar nada. (2) Diagnose — root cause analysis con evidencia, distingue síntoma de causa. (3) Fix — approach + alternativas descartadas + cambio mínimo. (4) Regression test — debe fallar pre-fix y pasar post-fix. Validación: reproducción original deja de reproducirse, suite verde. Comunicación: mensaje para el reporter sin jerga, decisión sobre nota de changelog y postmortem si Critical.
- **`refactor-plan`** — Plan de refactor escrito ANTES de tocar código. Cubre motivación con deuda concreta, scope IN/OUT explícito (anti-creep), approach con alternativas, branch strategy (all-at-once/branch-by-abstraction/feature-flag/strangler-fig), safety nets (tests existentes + characterization a añadir + monitoring + flag), validación, rollback. Tras ejecutar el plan, se cierra el archivo con bloque "Resultado" (diff stats, sorpresas, decisiones, próximos pasos). Estado del archivo: Planned → In progress → Done | Reverted | Partial.
- **`dependency-bump`** — Workflow para subir una dependencia. Assessment: changelog upstream entre versiones (no se saltan versiones intermedias sin leerlas), breaking changes que afectan al repo concretamente (no en abstracto), deps transitivas, compatibilidad con runtime, riesgo global (🟢/🟡/🟠/🔴). Plan: pasos de bump, código a adaptar, configuración/build, tests. Safety nets + validación + rollback. Cierre con resultado. Cubre majors con cuidado (especial atención a `0.x.y` por convenciones laxas de semver en muchos ecosistemas).

### Iteración 3 — 4 docs skills nuevas en `software/skills/` (consumidora: `software-architecture` con scope ampliado)

- **`readme`** — README.md del proyecto adaptado al tipo (library / CLI / web app / API / monorepo / internal tool). Estructura canónica: one-liner + qué resuelve + quick start (requisitos + instalación + primer uso) + uso/API por tipo + configuración (tabla de env vars sin valores) + estructura del repo + tests + deploy resumido + documentación adicional con links + contribuir + licencia + mantenedores. Reglas estrictas: sin marketing-speak, comandos ejecutables tal cual, versiones explícitas, links relativos. Vive en raíz del repo.
- **`code-docs-style`** — Guía canónica de documentación inline del proyecto. Por cada lenguaje en el repo: formato obligatorio (JSDoc/TSDoc, Google/NumPy docstring, godoc, rustdoc, KDoc, phpDoc), tags admitidos, ejemplo canónico real, anti-patrones. Convenciones transversales: idioma de la doc, naming dentro de la doc, política `TODO`/`FIXME`/`XXX` (formato obligatorio con author + ticket, sin author bloquea en review), comentarios autogenerados. Política de doc generada si aplica. Enforcement por linter/CI. Vive en `<proyecto>/software/architecture/code-docs-style.md`.
- **`dev-guide`** — Guía de desarrollo extendida del proyecto. Documento vivo. Cubre visión rápida, setup del entorno (con `cp .env.example .env`, docker compose, smoke test de "el setup funciona"), estructura del repo, cómo corre en local, tests por nivel con tiempos, workflow (branching, commits, PRs, release), **common tasks** ("¿cómo añado un endpoint / migración / test e2e?"), referencias a ADRs (resumen + link), troubleshooting con síntomas/causas comunes. Mantenida por owner identificado. Vive en `<proyecto>/docs/dev-guide.md`.
- **`migration-guide`** — Guía pública de migración de versión X a Y dirigida a CONSUMIDORES (devs que usan la librería, integradores de API, admins del CLI). Audiencia distinta a dev-guide. Cubre TL;DR + pre-requisitos + mapa de cambios + cada breaking change con antes/después (snippet ejecutable) + cambios silenciosos (defaults que cambian) + deprecations + plan paso a paso + validación + rollback + FAQ + soporte de versión anterior. Codemod recomendado si la migración es mecánica. Difícultad explícita (🟢/🟡/🟠) en TL;DR.

### Iteración 4 — 1 skill shared nueva en `_shared/skills/` (consumidora: `software-architecture`, `software-coding`, futura `devops-pipeline`)

- **`deploy-checklist`** — Checklist completa pre/durante/post-deploy de un release adaptado al riesgo (🟢/🟡/🟠/🔴) y a la estrategia (instant/canary/blue-green/progressive/rolling). Pre-deploy: código & tests (CI verde, tag creado, artefacto publicado), especificación & docs (changelog, migration guide, release notes), configuración del entorno (env vars, secrets aprovisionados, permisos), schema & datos (migration reversible, backup, backfill, orden de despliegue), feature flags (estado inicial, criterio de promoción/retirada), comunicación, personas y roles (owner + backup + aprobador para 🟠/🔴). Durante: tabla de pasos con timestamps reales + smoke tests con health checks + caminos críticos manuales + e2e automatizados. Post-deploy: métricas a vigilar con umbrales y acción si se cruzan, confirmaciones funcionales, comunicación de cierre. Rollback con punto sin retorno explícito. Cierre con notas para el siguiente deploy. **Skill compartida**: hoy la consume software, mañana también devops (`devops-pipeline`/`devops-incident`) cuando el dept se active.

---

### Scope ampliado de `software-architecture` (decisión registrada con el usuario)

El agente pasa de "Architecture & Technical Design" a **"Architecture, Technical Design & Documentation"**. Cambios concretos:

- **Frontmatter `description`** ampliada para mencionar explícitamente la documentación técnica como entregable propio.
- **Sección Rol** reescrita: misión dual (decisiones + documentación humana del proyecto).
- **Sección "Tipos de entregables"** suma "Documentación técnica" con un párrafo por cada uno de los 4 nuevos entregables (README, dev-guide, code-docs-style, migration-guide, deploy-checklist).
- **Sección "Skills disponibles"** ahora lista 5 skills propias previas + 5 docs skills nuevas + 2 shared (`risk-matrix` y `deploy-checklist`).

Razonamiento documentado en el plan acordado con el usuario: la doc técnica del proyecto (README, dev guide, migration guide) tiene proceso propio pero está más cerca del autor del sistema que del implementador de código, por lo que encaja mejor en architecture que en coding. Decisión tomada en lugar de crear un agente `software-docs` separado (aplicación de "menos agentes ≠ mejor").

---

### Agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `readme`, `code-docs-style`, `dev-guide`, `migration-guide` + `deploy-checklist` (shared). Total: 5 propias previas + 4 docs nuevas + 2 shared (risk-matrix y deploy-checklist) = **11 skills accesibles**. |
| `software-coding` | `feature-implementation`, `bugfix-workflow`, `refactor-plan`, `dependency-bump` + `deploy-checklist` (shared). Total: 3 git skills previas + 4 workflow nuevas + 1 shared = **8 skills accesibles**. |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar los nuevos workflows y documentos.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para:

- **`software-architecture`** (skills nuevas docs + deploy + scope ampliado): "README", "documenta el proyecto/módulo", "guía de desarrollo", "dev guide", "guía de migración", "migration guide", "guía de docs", "estilo de docstrings", "deploy checklist", "checklist de release".
- **`software-coding`** (workflows + deploy): "feature-implementation", "bugfix", "subir dependencia", "dep bump", "actualiza la versión de", "deploy checklist", "preparar release".
- **Tabla de decisión rápida**: 4 filas nuevas (docs en architecture, deploy-checklist, dep bump en coding, workflows implícitos via las señales de "implementa/fix el bug/refactoriza" ya existentes).

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos": Software 11 → 19 skills. `_shared/` 7 → 8 business compartidas.
- Sección "Detalle por departamento → `_shared/`": tabla business-skills compartidas añade `deploy-checklist` con consumidores documentados.
- Sección "Detalle por departamento → Software": tabla de agentes refleja skills propias actualizadas y compartidas. Tabla de skills pasa de 11 a 19 filas con las 8 nuevas + nota de "más 1 compartida `deploy-checklist`".
- Catálogo rápido: tabla Software pasa de 11 a 19 filas. Tabla "Skills compartidas" pasa de 9 a 10 con `deploy-checklist`. Encabezado "Skills compartidas (9 = 2 meta + 7 business)" → "Skills compartidas (10 = 2 meta + 8 business)". Encabezado "Skills dept-específicas (67)" → "Skills dept-específicas (75)".

**`README.md` raíz**:

- Tabla de estado: Software 11 → 19. `_shared/` 9 → 10 (8 business).
- Total: 76 → 85 skills (75 dept-específicas + 8 business compartidas + 2 meta).

---

### Archivos editados

**Iteración 2 — workflow coding:**
- `.aigent/departments/software/skills/feature-implementation/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/bugfix-workflow/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/refactor-plan/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/dependency-bump/SKILL.md` (nuevo)

**Iteración 3 — docs technicas:**
- `.aigent/departments/software/skills/readme/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/code-docs-style/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/dev-guide/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/migration-guide/SKILL.md` (nuevo)

**Iteración 4 — deploy shared:**
- `.aigent/departments/_shared/skills/deploy-checklist/SKILL.md` (nueva, compartida)

**Agentes y orquestador:**
- `.aigent/departments/software/agents/software-architecture.md` (scope ampliado + 5 skills nuevas listadas)
- `.aigent/departments/software/agents/software-coding.md` (workflows + deploy listados)
- `.aigent/departments/software/software-orchestrator.md` (señales + tabla de decisión actualizadas)

**Catálogo y versionado:**
- `.aigent/README.md` (tabla estado + sección _shared/ + detalle Software + catálogo rápido + totales)
- `README.md` (raíz) (tabla estado + total)
- `.aigent/VERSION` (1.14.0 → 1.15.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.14.0 — 2026-05-14

### Software — iteración 1: spec-review + git workflow (4 skills nuevas)

Primera tanda de la ampliación del dept Software discutida con el usuario. Se añaden 4 skills v1 prosa que cubren dos huecos identificados: (1) revisión y scoring de specs antes de implementación (`spec-review`), y (2) productos "laterales" del ciclo de implementación que `software-coding` no estaba cubriendo — mensaje de commit, descripción de PR y entrada de changelog. Sin agentes nuevos: aplicación de la regla "menos agentes ≠ mejor" — todo encaja como skills colgando de los agentes existentes.

**Estado tras esta versión:** 76 skills totales (67 dept-específicas + 7 business compartidas + 2 meta). Software pasa de 7 a 11 skills, sigue con 4 agentes. `software-coding` deja de no tener skills propias.

---

### 4 skills dept-específicas nuevas (todas en `software/`)

- **`spec-review`** — Review y scoring de un spec existente (PRD/ADR/tech-spec/api-spec) con rubric de 6 dimensiones (Completeness, Clarity, Testability, Consistency, Risk awareness, Actionability), score 0-5 por dimensión y total /30 con grado (🟢/🟡/🟠/🔴), hallazgos por severidad (🔴/🟠/🟡/🔵), top 3, lo positivo y veredicto (✅ / 🟠 / 🔴). Sirve como gate antes de pasar un spec a implementación. Vive en `<proyecto>/software/reviews/spec-review-<tipo>-<slug>.md`. Consumidora: `software-architecture`.
- **`commit-message`** — Mensaje de commit a partir del diff staged. Default Conventional Commits con tipos canónicos (feat/fix/refactor/perf/docs/test/build/ci/chore/style/revert), scope opcional derivado del path, `!` para breaking, footer con BREAKING CHANGE/Refs/Closes/Co-authored-by. Reglas estrictas: subject < 50 chars, imperativo, sin punto final, atomicidad (rechaza commits que mezclan cambios). Output: bloque en chat para pegar en `git commit`. Consumidora: `software-coding`.
- **`pr-description`** — Descripción de Pull Request cruzando spec asociado + diff + commits. Estructura canónica: Qué cambia / Por qué (con refs) / Cómo (approach) / Cambios principales (tabla archivo→cambio) / Testing (añadidos + pendientes + manual) / Impacto (breaking/áreas/riesgos/rollback) / Screenshots / Checklist autor / Para el reviewer. Respeta plantillas del repo (`.github/PULL_REQUEST_TEMPLATE.md`) si existen. Detecta atomicidad rota y breaking change para alertar. Consumidora: `software-coding`.
- **`changelog-entry`** — Entrada `## [X.Y.Z] — YYYY-MM-DD` Keep a Changelog a partir de PRs merged del release. Mapea Conventional Commits a categorías (Added/Changed/Deprecated/Removed/Fixed/Security) con sección BREAKING CHANGES arriba marcada con ⚠️. Valida coherencia semver (BREAKING → major, Added → minor, Fixed → patch). Filtra commits internos no relevantes para el consumidor. Actualiza también el bloque `[Unreleased]` y los links de comparación al final del archivo. Consumidora: `software-coding`.

---

### 2 agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `spec-review` (ahora 5 skills propias + 1 shared) |
| `software-coding` | `commit-message`, `pr-description`, `changelog-entry` (pasa de "sin skills propias" a 3 skills) |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar las nuevas categorías de output.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para las nuevas skills:

- **`software-architecture`**: "revisa este PRD/ADR/spec", "scoring del spec", "spec review", "está bien este PRD".
- **`software-coding`**: "mensaje de commit", "commit message", "descripción de PR", "PR description", "changelog", "release notes técnicas".
- **Tabla de decisión rápida**: 2 filas nuevas (spec-review y skills de git workflow) más afinado el wording de las filas de code-review para evitar colisión con spec-review.

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos" — Software pasa de 7 a 11 skills.
- Sección "Detalle por departamento → Software" — tabla de agentes (4) refleja nuevas skills propias; tabla de skills (11) incluye las 4 nuevas con su entregable.
- Catálogo rápido — "Software (4 agentes activos + 1 implementador sin skill)" → "Software (4)". Tabla Software del catálogo pasa de 7 a 11 filas.
- "Skills dept-específicas (63)" → "Skills dept-específicas (67)".

**`README.md` raíz**:

- Tabla de estado: Software 7 → 11.
- Total: 72 → 76 skills (67 dept-específicas + 7 business + 2 meta).

---

### Archivos editados

- `.aigent/departments/software/skills/spec-review/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/commit-message/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/pr-description/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/changelog-entry/SKILL.md` (nuevo)
- `.aigent/departments/software/agents/software-architecture.md`
- `.aigent/departments/software/agents/software-coding.md`
- `.aigent/departments/software/software-orchestrator.md`
- `.aigent/README.md`
- `README.md` (raíz)
- `.aigent/VERSION` (1.13.0 → 1.14.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.16.0 — 2026-05-14

### READMEs de casos de uso por departamento (9 nuevos)

Cada dept implementado (8) más `_shared/` ahora tiene un `README.md` con ejemplos completos de cada agente y cada skill: prompt de entrada realista, output esperado (estructura completa simulada con valores, tablas y snippets de 20-40 líneas) y ruta donde se guarda. Sirven como documentación viva para onboarding de usuarios, referencia rápida y como anti-fricción cuando se duda de qué pedir.

Cobertura total: **~130 casos de uso** (35 agentes especialistas + 2 transversales + 75 skills dept + 10 skills compartidas + flujos end-to-end típicos por dept).

---

### 9 READMEs nuevos

| Archivo | Contenido |
|---|---|
| `.aigent/departments/software/README.md` | 4 agentes + 19 skills + 1 shared. 23 ejemplos + flujo feature y bugfix end-to-end. |
| `.aigent/departments/marketing/README.md` | 5 agentes + 13 skills. 18 ejemplos + flujo de lanzamiento. |
| `.aigent/departments/sales/README.md` | 4 agentes + 11 skills + 3 shared referenciadas. 15 ejemplos + flujo del funnel. |
| `.aigent/departments/hr/README.md` | 4 agentes + 7 skills. 11 ejemplos + flujo recruitment→onboarding→evaluation. |
| `.aigent/departments/product/README.md` | 3 agentes + 6 skills + 6 shared referenciadas. 9 ejemplos + flujo discovery→roadmap→ship. |
| `.aigent/departments/finance/README.md` | 3 agentes + 7 skills + 2 shared referenciadas. 10 ejemplos + cierre mensual/trimestral/anual. |
| `.aigent/departments/legal/README.md` | 4 agentes + 6 skills + 2 shared referenciadas. 10 ejemplos + flujo onboarding cliente + audit. |
| `.aigent/departments/design/README.md` | 4 agentes + 6 skills + 1 shared referenciada. 10 ejemplos + flujo feature visual + DS update. |
| `.aigent/departments/_shared/README.md` | 2 agentes transversales (shared-prd-agent, shared-skill-builder) + 10 skills compartidas (2 meta + 8 business). 12 ejemplos + tabla de "cuándo invocar transversales vs depts". |

Estructura canónica de cada README (acordada con el usuario):

1. **Header** — frase + link al orquestador y al `.aigent/README` maestro.
2. **Cómo se invoca** — 3 vías (orquestador / agente / skill directa).
3. **Agentes** — un caso de uso por cada agente, con prompt + output esperado (estructura completa) + ruta.
4. **Skills propias del dept** — un caso de uso por cada skill (las que ya tienen ejemplo en su agente solo referencian).
5. **Skills compartidas usadas** — listado con referencia a `_shared/README.md`.
6. **Flujo end-to-end típico** — diagrama ASCII de cómo se encadenan agentes y skills en escenarios reales.

---

### Cross-reference desde `.aigent/README.md`

Nueva sección "Casos de uso por departamento" en el `.aigent/README.md` con tabla que linka a los 9 nuevos READMEs.

---

### Archivos editados

**READMEs nuevos:**
- `.aigent/departments/software/README.md` (nuevo)
- `.aigent/departments/marketing/README.md` (nuevo)
- `.aigent/departments/sales/README.md` (nuevo)
- `.aigent/departments/hr/README.md` (nuevo)
- `.aigent/departments/product/README.md` (nuevo)
- `.aigent/departments/finance/README.md` (nuevo)
- `.aigent/departments/legal/README.md` (nuevo)
- `.aigent/departments/design/README.md` (nuevo)
- `.aigent/departments/_shared/README.md` (nuevo)

**Cross-ref + versionado:**
- `.aigent/README.md` (sección "Casos de uso por departamento" añadida)
- `.aigent/VERSION` (1.15.0 → 1.16.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.15.0 — 2026-05-14

### Software — iteraciones 2+3+4: workflow coding + docs técnicas + deploy shared (9 skills nuevas)

Segunda tanda de la ampliación del dept Software. Se cierran las tres iteraciones restantes del plan en un solo release: (2) workflow skills agnósticos de lenguaje para `software-coding`, (3) skills de documentación técnica para `software-architecture` con scope ampliado, y (4) `deploy-checklist` como skill compartida usable por software hoy y devops mañana. Aplicación reiterada de la regla "menos agentes ≠ mejor": ningún agente nuevo, todo encaja como skills colgando de los 4 existentes.

**Estado tras esta versión:** 85 skills totales (75 dept-específicas + 8 business compartidas + 2 meta). Software pasa de 11 a 19 skills (+8 propias + 1 shared accesible). El `_shared/` business pasa de 7 a 8 skills.

---

### Iteración 2 — 4 workflow skills nuevas en `software/skills/` (consumidora: `software-coding`)

- **`feature-implementation`** — Workflow estructurado para implementar una feature desde spec. Pre-flight: lectura del spec, lectura del contexto del repo (módulo + ADRs + decisions + tests existentes), planificación (archivos previstos, dependencias nuevas, tests a producir, riesgos), confirmación con el usuario si hay desviaciones. Ejecución: cambios con `Edit/Write`, tests al lado, atomicidad estricta, sin comentarios redundantes. Post-flight: reporte con archivos tocados, AC cubiertos (✅/🟡/❌), tests añadidos / pendientes, TODOs, decisiones tomadas, próximos pasos. Vive el reporte en `<proyecto>/software/code/.reports/feature-<slug>.md`.
- **`bugfix-workflow`** — Workflow para arreglar un bug en 4 pasos: (1) Reproduce — reproducción confirmada local antes de tocar nada. (2) Diagnose — root cause analysis con evidencia, distingue síntoma de causa. (3) Fix — approach + alternativas descartadas + cambio mínimo. (4) Regression test — debe fallar pre-fix y pasar post-fix. Validación: reproducción original deja de reproducirse, suite verde. Comunicación: mensaje para el reporter sin jerga, decisión sobre nota de changelog y postmortem si Critical.
- **`refactor-plan`** — Plan de refactor escrito ANTES de tocar código. Cubre motivación con deuda concreta, scope IN/OUT explícito (anti-creep), approach con alternativas, branch strategy (all-at-once/branch-by-abstraction/feature-flag/strangler-fig), safety nets (tests existentes + characterization a añadir + monitoring + flag), validación, rollback. Tras ejecutar el plan, se cierra el archivo con bloque "Resultado" (diff stats, sorpresas, decisiones, próximos pasos). Estado del archivo: Planned → In progress → Done | Reverted | Partial.
- **`dependency-bump`** — Workflow para subir una dependencia. Assessment: changelog upstream entre versiones (no se saltan versiones intermedias sin leerlas), breaking changes que afectan al repo concretamente (no en abstracto), deps transitivas, compatibilidad con runtime, riesgo global (🟢/🟡/🟠/🔴). Plan: pasos de bump, código a adaptar, configuración/build, tests. Safety nets + validación + rollback. Cierre con resultado. Cubre majors con cuidado (especial atención a `0.x.y` por convenciones laxas de semver en muchos ecosistemas).

### Iteración 3 — 4 docs skills nuevas en `software/skills/` (consumidora: `software-architecture` con scope ampliado)

- **`readme`** — README.md del proyecto adaptado al tipo (library / CLI / web app / API / monorepo / internal tool). Estructura canónica: one-liner + qué resuelve + quick start (requisitos + instalación + primer uso) + uso/API por tipo + configuración (tabla de env vars sin valores) + estructura del repo + tests + deploy resumido + documentación adicional con links + contribuir + licencia + mantenedores. Reglas estrictas: sin marketing-speak, comandos ejecutables tal cual, versiones explícitas, links relativos. Vive en raíz del repo.
- **`code-docs-style`** — Guía canónica de documentación inline del proyecto. Por cada lenguaje en el repo: formato obligatorio (JSDoc/TSDoc, Google/NumPy docstring, godoc, rustdoc, KDoc, phpDoc), tags admitidos, ejemplo canónico real, anti-patrones. Convenciones transversales: idioma de la doc, naming dentro de la doc, política `TODO`/`FIXME`/`XXX` (formato obligatorio con author + ticket, sin author bloquea en review), comentarios autogenerados. Política de doc generada si aplica. Enforcement por linter/CI. Vive en `<proyecto>/software/architecture/code-docs-style.md`.
- **`dev-guide`** — Guía de desarrollo extendida del proyecto. Documento vivo. Cubre visión rápida, setup del entorno (con `cp .env.example .env`, docker compose, smoke test de "el setup funciona"), estructura del repo, cómo corre en local, tests por nivel con tiempos, workflow (branching, commits, PRs, release), **common tasks** ("¿cómo añado un endpoint / migración / test e2e?"), referencias a ADRs (resumen + link), troubleshooting con síntomas/causas comunes. Mantenida por owner identificado. Vive en `<proyecto>/docs/dev-guide.md`.
- **`migration-guide`** — Guía pública de migración de versión X a Y dirigida a CONSUMIDORES (devs que usan la librería, integradores de API, admins del CLI). Audiencia distinta a dev-guide. Cubre TL;DR + pre-requisitos + mapa de cambios + cada breaking change con antes/después (snippet ejecutable) + cambios silenciosos (defaults que cambian) + deprecations + plan paso a paso + validación + rollback + FAQ + soporte de versión anterior. Codemod recomendado si la migración es mecánica. Difícultad explícita (🟢/🟡/🟠) en TL;DR.

### Iteración 4 — 1 skill shared nueva en `_shared/skills/` (consumidora: `software-architecture`, `software-coding`, futura `devops-pipeline`)

- **`deploy-checklist`** — Checklist completa pre/durante/post-deploy de un release adaptado al riesgo (🟢/🟡/🟠/🔴) y a la estrategia (instant/canary/blue-green/progressive/rolling). Pre-deploy: código & tests (CI verde, tag creado, artefacto publicado), especificación & docs (changelog, migration guide, release notes), configuración del entorno (env vars, secrets aprovisionados, permisos), schema & datos (migration reversible, backup, backfill, orden de despliegue), feature flags (estado inicial, criterio de promoción/retirada), comunicación, personas y roles (owner + backup + aprobador para 🟠/🔴). Durante: tabla de pasos con timestamps reales + smoke tests con health checks + caminos críticos manuales + e2e automatizados. Post-deploy: métricas a vigilar con umbrales y acción si se cruzan, confirmaciones funcionales, comunicación de cierre. Rollback con punto sin retorno explícito. Cierre con notas para el siguiente deploy. **Skill compartida**: hoy la consume software, mañana también devops (`devops-pipeline`/`devops-incident`) cuando el dept se active.

---

### Scope ampliado de `software-architecture` (decisión registrada con el usuario)

El agente pasa de "Architecture & Technical Design" a **"Architecture, Technical Design & Documentation"**. Cambios concretos:

- **Frontmatter `description`** ampliada para mencionar explícitamente la documentación técnica como entregable propio.
- **Sección Rol** reescrita: misión dual (decisiones + documentación humana del proyecto).
- **Sección "Tipos de entregables"** suma "Documentación técnica" con un párrafo por cada uno de los 4 nuevos entregables (README, dev-guide, code-docs-style, migration-guide, deploy-checklist).
- **Sección "Skills disponibles"** ahora lista 5 skills propias previas + 5 docs skills nuevas + 2 shared (`risk-matrix` y `deploy-checklist`).

Razonamiento documentado en el plan acordado con el usuario: la doc técnica del proyecto (README, dev guide, migration guide) tiene proceso propio pero está más cerca del autor del sistema que del implementador de código, por lo que encaja mejor en architecture que en coding. Decisión tomada en lugar de crear un agente `software-docs` separado (aplicación de "menos agentes ≠ mejor").

---

### Agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `readme`, `code-docs-style`, `dev-guide`, `migration-guide` + `deploy-checklist` (shared). Total: 5 propias previas + 4 docs nuevas + 2 shared (risk-matrix y deploy-checklist) = **11 skills accesibles**. |
| `software-coding` | `feature-implementation`, `bugfix-workflow`, `refactor-plan`, `dependency-bump` + `deploy-checklist` (shared). Total: 3 git skills previas + 4 workflow nuevas + 1 shared = **8 skills accesibles**. |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar los nuevos workflows y documentos.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para:

- **`software-architecture`** (skills nuevas docs + deploy + scope ampliado): "README", "documenta el proyecto/módulo", "guía de desarrollo", "dev guide", "guía de migración", "migration guide", "guía de docs", "estilo de docstrings", "deploy checklist", "checklist de release".
- **`software-coding`** (workflows + deploy): "feature-implementation", "bugfix", "subir dependencia", "dep bump", "actualiza la versión de", "deploy checklist", "preparar release".
- **Tabla de decisión rápida**: 4 filas nuevas (docs en architecture, deploy-checklist, dep bump en coding, workflows implícitos via las señales de "implementa/fix el bug/refactoriza" ya existentes).

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos": Software 11 → 19 skills. `_shared/` 7 → 8 business compartidas.
- Sección "Detalle por departamento → `_shared/`": tabla business-skills compartidas añade `deploy-checklist` con consumidores documentados.
- Sección "Detalle por departamento → Software": tabla de agentes refleja skills propias actualizadas y compartidas. Tabla de skills pasa de 11 a 19 filas con las 8 nuevas + nota de "más 1 compartida `deploy-checklist`".
- Catálogo rápido: tabla Software pasa de 11 a 19 filas. Tabla "Skills compartidas" pasa de 9 a 10 con `deploy-checklist`. Encabezado "Skills compartidas (9 = 2 meta + 7 business)" → "Skills compartidas (10 = 2 meta + 8 business)". Encabezado "Skills dept-específicas (67)" → "Skills dept-específicas (75)".

**`README.md` raíz**:

- Tabla de estado: Software 11 → 19. `_shared/` 9 → 10 (8 business).
- Total: 76 → 85 skills (75 dept-específicas + 8 business compartidas + 2 meta).

---

### Archivos editados

**Iteración 2 — workflow coding:**
- `.aigent/departments/software/skills/feature-implementation/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/bugfix-workflow/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/refactor-plan/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/dependency-bump/SKILL.md` (nuevo)

**Iteración 3 — docs technicas:**
- `.aigent/departments/software/skills/readme/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/code-docs-style/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/dev-guide/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/migration-guide/SKILL.md` (nuevo)

**Iteración 4 — deploy shared:**
- `.aigent/departments/_shared/skills/deploy-checklist/SKILL.md` (nueva, compartida)

**Agentes y orquestador:**
- `.aigent/departments/software/agents/software-architecture.md` (scope ampliado + 5 skills nuevas listadas)
- `.aigent/departments/software/agents/software-coding.md` (workflows + deploy listados)
- `.aigent/departments/software/software-orchestrator.md` (señales + tabla de decisión actualizadas)

**Catálogo y versionado:**
- `.aigent/README.md` (tabla estado + sección _shared/ + detalle Software + catálogo rápido + totales)
- `README.md` (raíz) (tabla estado + total)
- `.aigent/VERSION` (1.14.0 → 1.15.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.14.0 — 2026-05-14

### Software — iteración 1: spec-review + git workflow (4 skills nuevas)

Primera tanda de la ampliación del dept Software discutida con el usuario. Se añaden 4 skills v1 prosa que cubren dos huecos identificados: (1) revisión y scoring de specs antes de implementación (`spec-review`), y (2) productos "laterales" del ciclo de implementación que `software-coding` no estaba cubriendo — mensaje de commit, descripción de PR y entrada de changelog. Sin agentes nuevos: aplicación de la regla "menos agentes ≠ mejor" — todo encaja como skills colgando de los agentes existentes.

**Estado tras esta versión:** 76 skills totales (67 dept-específicas + 7 business compartidas + 2 meta). Software pasa de 7 a 11 skills, sigue con 4 agentes. `software-coding` deja de no tener skills propias.

---

### 4 skills dept-específicas nuevas (todas en `software/`)

- **`spec-review`** — Review y scoring de un spec existente (PRD/ADR/tech-spec/api-spec) con rubric de 6 dimensiones (Completeness, Clarity, Testability, Consistency, Risk awareness, Actionability), score 0-5 por dimensión y total /30 con grado (🟢/🟡/🟠/🔴), hallazgos por severidad (🔴/🟠/🟡/🔵), top 3, lo positivo y veredicto (✅ / 🟠 / 🔴). Sirve como gate antes de pasar un spec a implementación. Vive en `<proyecto>/software/reviews/spec-review-<tipo>-<slug>.md`. Consumidora: `software-architecture`.
- **`commit-message`** — Mensaje de commit a partir del diff staged. Default Conventional Commits con tipos canónicos (feat/fix/refactor/perf/docs/test/build/ci/chore/style/revert), scope opcional derivado del path, `!` para breaking, footer con BREAKING CHANGE/Refs/Closes/Co-authored-by. Reglas estrictas: subject < 50 chars, imperativo, sin punto final, atomicidad (rechaza commits que mezclan cambios). Output: bloque en chat para pegar en `git commit`. Consumidora: `software-coding`.
- **`pr-description`** — Descripción de Pull Request cruzando spec asociado + diff + commits. Estructura canónica: Qué cambia / Por qué (con refs) / Cómo (approach) / Cambios principales (tabla archivo→cambio) / Testing (añadidos + pendientes + manual) / Impacto (breaking/áreas/riesgos/rollback) / Screenshots / Checklist autor / Para el reviewer. Respeta plantillas del repo (`.github/PULL_REQUEST_TEMPLATE.md`) si existen. Detecta atomicidad rota y breaking change para alertar. Consumidora: `software-coding`.
- **`changelog-entry`** — Entrada `## [X.Y.Z] — YYYY-MM-DD` Keep a Changelog a partir de PRs merged del release. Mapea Conventional Commits a categorías (Added/Changed/Deprecated/Removed/Fixed/Security) con sección BREAKING CHANGES arriba marcada con ⚠️. Valida coherencia semver (BREAKING → major, Added → minor, Fixed → patch). Filtra commits internos no relevantes para el consumidor. Actualiza también el bloque `[Unreleased]` y los links de comparación al final del archivo. Consumidora: `software-coding`.

---

### 2 agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `spec-review` (ahora 5 skills propias + 1 shared) |
| `software-coding` | `commit-message`, `pr-description`, `changelog-entry` (pasa de "sin skills propias" a 3 skills) |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar las nuevas categorías de output.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para las nuevas skills:

- **`software-architecture`**: "revisa este PRD/ADR/spec", "scoring del spec", "spec review", "está bien este PRD".
- **`software-coding`**: "mensaje de commit", "commit message", "descripción de PR", "PR description", "changelog", "release notes técnicas".
- **Tabla de decisión rápida**: 2 filas nuevas (spec-review y skills de git workflow) más afinado el wording de las filas de code-review para evitar colisión con spec-review.

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos" — Software pasa de 7 a 11 skills.
- Sección "Detalle por departamento → Software" — tabla de agentes (4) refleja nuevas skills propias; tabla de skills (11) incluye las 4 nuevas con su entregable.
- Catálogo rápido — "Software (4 agentes activos + 1 implementador sin skill)" → "Software (4)". Tabla Software del catálogo pasa de 7 a 11 filas.
- "Skills dept-específicas (63)" → "Skills dept-específicas (67)".

**`README.md` raíz**:

- Tabla de estado: Software 7 → 11.
- Total: 72 → 76 skills (67 dept-específicas + 7 business + 2 meta).

---

### Archivos editados

- `.aigent/departments/software/skills/spec-review/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/commit-message/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/pr-description/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/changelog-entry/SKILL.md` (nuevo)
- `.aigent/departments/software/agents/software-architecture.md`
- `.aigent/departments/software/agents/software-coding.md`
- `.aigent/departments/software/software-orchestrator.md`
- `.aigent/README.md`
- `README.md` (raíz)
- `.aigent/VERSION` (1.13.0 → 1.14.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.13.0 — 2026-05-13

### 10 skills "Media" — cobertura completa del análisis previo + READMEs actualizados con catálogo completo

Cierre de las skills identificadas en el análisis con lupa de los 8 departments. Tras 1.12.0 (que cubrió las "Alta"), esta versión añade las "Media" — skills útiles desde día 0 que dan flexibilidad y cobertura. El usuario puede descartar alguna después si no se usa, pero el patrón es "mejor tener que no tener".

**Estado tras esta versión:** 72 skills totales (63 dept-específicas + 7 business compartidas + 2 meta). Todo dept implementado tiene cobertura amplia.

---

### 10 skills dept-específicas nuevas

**Sales (1):**
- `forecasting-report` — Forecast formal del periodo (commit/best/worst) con metodología explícita (weighted/rep-call/historical/combined), segmentación por rep/segmento/vertical, win rates históricos, cycle length, riesgos, reconciliación bottom-up vs top-down. Strategic, board-ready. **Distinto operativamente de `pipeline-review`** (que es deal-by-deal semanal).

**Software (2):**
- `bug-report` — Bug report estructurado con reproducción, expected vs actual, severidad justificada (Critical/Major/Minor/Cosmetic), scope, entorno, regresión status, evidencia (logs/screenshots/traces). Reproducible por cualquiera sin reaching out al reporter.
- `tech-spec` — Spec técnica intermedia entre PRD/ADR e implementación: data model, API changes, edge cases, performance & scalability, security, testing strategy, rollout con feature flag. **Distinta de ADR** (que documenta decisión) y de **feature-prd** (que es qué/por qué).

**HR (1):**
- `exit-interview` — Guion + síntesis estructurada con categorización para people analytics agregado (regrettable / non-regrettable / neutral, motivo principal con etiquetas estandarizadas) y recomendaciones derivadas. Confidencialidad alta.

**Product (1):**
- `release-plan` — Plan de release end-to-end con tier explícito (Silent / Beta / Minor / Major / Flagship), hitos por área (Product, Eng, Design, Marketing, Sales, Support, Legal), feature flag obligatorio, criterios de éxito + guardraíles, kill switch, post-launch review programada.

**Finance (2):**
- `board-deck-financial` — Sección financiera del board deck (5-10 slides equivalentes): highlights, P&L summary, cash + runway, KPIs selectivos, variance vs plan, top riesgos, asks al board. Tono board-audience honesto. **Distinto de `financial-report`** (más granular, broader audience).
- `expense-report` — Submisión de gastos individual con detalle por gasto, totales por categoría/proyecto, justificantes adjuntos, self-check contra `expense-policy`, workflow de aprobación tracking.

**Legal (1):**
- `compliance-checklist` — Checklist estructurada contra un framework específico (GDPR / SOC 2 Type II / ISO 27001:2022 / HIPAA / PCI DSS / sectorial) con metodología, estado por control (Pass/Partial/Fail/N-A), gap analysis con priorización por riesgo, remediation plan en sprints, evidencias preparadas para auditor.

**Design (2):**
- `design-handoff-checklist` — Checklist pre-handoff con sign-off de designer + acceptance del eng. Cubre visual y layout, estados completos (default + 6-8 más), responsive, tokens consumidos, edge cases, accesibilidad mínima, assets, acceptance criteria.
- `ds-component-doc` — Documentación canónica de componente del DS oficial (más exhaustiva que `ui-component-spec`): anatomía, matriz de variantes, props/API por plataforma (React/SwiftUI/Compose), estados, do/don't con ejemplos, audit a11y formal referenciado, tokens consumidos, versionado, deprecation policy.

---

### 10 agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `sales-crm` | `forecasting-report` (3 skills totales) |
| `software-qa` | `bug-report` |
| `software-architecture` | `tech-spec` (ahora 4 skills) |
| `hr-evaluation` | `exit-interview` |
| `product-strategy-roadmap` | `release-plan` |
| `finance-reporting` | `board-deck-financial`, `expense-report` (5 skills totales) |
| `legal-risk` | `compliance-checklist` (3 skills totales) |
| `design-ui` | `design-handoff-checklist` |
| `design-design-system` | `ds-component-doc` |

---

### READMEs reescritos con catálogo completo

**`.aigent/README.md`** — actualizado con:

- **Tabla "Estado de los departamentos"** con contadores nuevos de skills (Sales 11, Software 7, HR 7, Product 6, Finance 7, Legal 6, Design 6).
- **Tablas detalladas por dept** actualizadas con todas las skills incluyendo las 10 nuevas Media.
- **Nueva sección "Catálogo rápido — una frase por agente y skill"** al final del README (antes de "Reglas básicas"). Cobertura:
  - 8 orquestadores con frase por cada uno.
  - 2 agentes transversales (shared) con frase.
  - 35 agentes especialistas agrupados por departamento, una frase cada uno.
  - 9 skills compartidas (2 meta + 7 business) con frase.
  - 63 skills dept-específicas en 8 tablas por dept, frase por cada una.
  - 1 skill v2 ejecutable de Operations (`redmine`).

**`README.md` raíz** — reescrito completo:

- **Overview** del sistema con value proposition en 4 bullets ("departamentos completos sin contratar al departamento", "independientes pero coordinados", "outputs auditables", "una sola fuente de verdad por skill").
- **Tabla de estado actualizada** con totales: 33 agentes activos + 72 skills.
- **Sección "Agentes — qué hace cada uno (una frase)"** con tabla de los 35 especialistas + 2 transversales + 8 orquestadores nombrados.
- **Sección "Skills — qué entrega cada una (una frase)"** con 9 shared + listado por dept de las 63 dept-específicas (sin tabla para no inflar el README raíz, listado compacto).
- **Estructura del repo + cómo empezar + cómo extender** preservados y actualizados.
- **Aviso** explícito sobre legal/HR ("estructura y borradores, NO asesoría vinculante").

---

### Cambios en archivos transversales

- `.aigent/VERSION` — bump 1.12.0 → 1.13.0 (MINOR: más skills + READMEs reescritos, sin romper contratos).
- `.aigent/CHANGELOG.md` — esta entrada.
- `.aigent/README.md` — actualizado completo (ver arriba).
- `README.md` raíz — reescrito completo (ver arriba).
- `.aigent/BOSS.md` — sin cambios (no lista skills).

### Próximos pasos

- Activar **DevOps** para cerrar el set de 9 depts (último TODO).
- Considerar activación completa de Operations (sigue 🚧 parcial con skill v2 `redmine` pero sin agentes especialistas).
- Aplicar uso real de las skills creadas; descartar las que no aporten valor real tras 1-2 trimestres de uso.

## 1.12.0 — 2026-05-13

### 17 skills nuevas (16 dept-específicas + 1 shared) — los depts pasan a estar plenamente operativos desde día 0

Tras documentar el patrón de skills compartidas en 1.11.0, esta versión llena los gaps esenciales identificados en el análisis con lupa de los 8 departments. Cada agente que estaba sin skill propia recibe una; cada dept añade las skills "Alta" que faltaban para operar end-to-end.

**Estado tras esta versión:** todos los agentes con skill propia (salvo decisiones explícitas como `software-coding` por su naturaleza basada en repo); 60+ skills totales (52 dept + 7 shared business + 2 meta).

---

### 1 skill compartida nueva

| Skill | Consumidores | Justificación |
|---|---|---|
| `_shared/skills/journey-map/` | `design-ux-research` (journey de uso de interfaz) + `product-discovery` (customer journey end-to-end) | Estructura idéntica: fases × acciones × pensamientos × emociones × pain points × oportunidades × touchpoints. Cumple §7.1 |

---

### 16 skills dept-específicas nuevas

**Marketing (1):**
- `brand-voice-guide` — guía canónica de voz de marca con atributos de tono, vocabulario do/don't, adaptación por canal. Documento de referencia para mantener tono consistente entre piezas de content.

**Sales (3):**
- `discovery-call` — script y framework de discovery call B2B con BANT/MEDDIC/SPICED, debrief estructurado, red flags. **Pieza que faltaba del ciclo SDR/AE.**
- `pipeline-review` — revisión operativa deal-by-deal con weighted forecast, health flags, acciones acordadas. **`sales-crm` ahora opera con skill estandarizada.**
- `renewal-playbook` — playbook de renovación con health signals, timing de outreach, scripts por situación (🟢/🟡/🔴), concessions ladder. Cubre la fase post-deal que no estaba.

**Software (2):**
- `runbook` — documento operacional completo para servicio en producción: deploy, monitoring, alertas, playbooks por incidente, escalado, dependencias.
- `api-spec` — especificación de API con endpoints, schemas, errores, pagination, versioning y deprecation policy.

**HR (3):**
- `onboarding-plan` — plan 30/60/90 días estructurado con pre-boarding, día 1 hora a hora, semana 1, plan por etapas (aprender → contribuir → owning), buddy program, evaluación de período de prueba. **`hr-onboarding` deja de operar con plantilla interna.**
- `one-on-one-framework` — framework canónico de 1:1s con principios, agenda recurrente (cómo estás / status / bloqueos / desarrollo / feedback), plantilla de notas, cadencia, anti-patrones.
- `compensation-band` — banda salarial por rol × seniority × geografía con benchmark de mercado, internal equity check, decision matrix para ofertas y promociones. **Confidencialidad alta.**

**Product (2):**
- `feature-prd` — PRD operativo de feature concreta con problema, hipótesis, scope, user stories con acceptance criteria, métricas + guardraíles, rollout plan con feature flag.
- `experiment-design` — plan de A/B test con hipótesis, métrica primaria, guardraíles, MDE, sample size calculado, randomización, decision rules pre-resultado (anti p-hacking).

**Finance (2):**
- `cash-forecast` — 13-week rolling cash forecast con inflows/outflows por categoría, posición semanal, alertas por debajo de mínimo de política, escenarios best/base/worst, FX exposure si multi-moneda. **`finance-treasury` deja de operar con plantilla interna.**
- `expense-policy` — política de gastos cross-funcional con categorías, límites, workflow de aprobación, viajes (per diem por tier), equipamiento, reembolsos, lista no-reembolsable. Coordinada con HR para incorporar al handbook.

**Legal (2):**
- `dpa-template` — Data Processing Agreement GDPR Art. 28 con anexos (objeto, TOMs, subprocesadores), notificación de brechas (48h al controlador / 72h al supervisor), SCCs UE 2021/914 para transferencias internacionales.
- `nda-template` — NDA standalone mutuo o unilateral con definición de Información Confidencial, exclusiones estándar, divulgación obligatoria por ley, remedies con injunctive relief, jurisdicción. La firma más frecuente en cualquier empresa.

**Design (1):**
- `usability-test-plan` — plan completo de usability test con hipótesis, tasks como objetivos del usuario (sin pistas UI), N de participantes, screener, script de sesión, SUS, debrief en caliente, síntesis con severidad. **`design-ux-research` deja de operar con plantilla interna.**

---

### 14 agentes consumidores actualizados

Cada agente añade las skills que consume a su tabla `## Skills disponibles`:

| Agente | Skills añadidas |
|---|---|
| `marketing-content` | brand-voice-guide |
| `sales-ae` | discovery-call, renewal-playbook |
| `sales-crm` | pipeline-review |
| `software-architecture` | runbook, api-spec |
| `hr-onboarding` | onboarding-plan (deja de no tener skill propia) |
| `hr-evaluation` | one-on-one-framework |
| `hr-recruitment` | compensation-band |
| `product-strategy-roadmap` | feature-prd |
| `product-metrics` | experiment-design |
| `product-discovery` | journey-map (shared) |
| `finance-treasury` | cash-forecast (deja de no tener skill propia) |
| `finance-budgeting` | expense-policy |
| `legal-contracts` | nda-template |
| `legal-privacy` | dpa-template |
| `design-ux-research` | usability-test-plan, journey-map (deja de no tener skill propia) |

---

### Agentes que pasan de "sin skill propia" a "con skill"

- `sales-crm` → `kpi-dashboard` (en 1.11.0) + `pipeline-review` (en 1.12.0)
- `legal-risk` → `risk-matrix` + `stakeholder-map` (en 1.11.0)
- `hr-onboarding` → `onboarding-plan` (1.12.0)
- `finance-treasury` → `cash-forecast` (1.12.0)
- `design-ux-research` → `usability-test-plan` (1.12.0)

Quedan sin skill propia por decisión deliberada:
- `software-coding` — trabaja directamente sobre el repo, sin skill estandarizada.

---

### Cambios en archivos transversales

- `.aigent/VERSION` — bump 1.11.0 → 1.12.0 (MINOR: nuevas capacidades sin romper contratos).
- `.aigent/CHANGELOG.md` — esta entrada.
- `.aigent/README.md` — tabla "Estado de los departamentos" con contadores de skills actualizados; secciones por dept con las nuevas skills documentadas.
- `.aigent/BOSS.md` — sin cambios (no lista skills).
- `_shared/conventions.md`, `skill-scaffold/SKILL.md`, `shared-skill-builder.md` — sin cambios (el patrón se aplica, no cambia).

### Cómo se usan a partir de aquí

Las 17 skills nuevas están disponibles inmediatamente tras `bash .aigent/IDE/install.sh --sync --ide all`. Cada agente consumidor las lista en su `## Skills disponibles`; los orquestadores delegan al agente correcto y este invoca la skill que aplique.

Las 5 skills dept-específicas marcadas "Media" en el análisis previo quedan como roadmap para futuras sesiones cuando emerja el uso real:

- `forecasting-report` (Sales — pero parcialmente cubierto por `pipeline-review` ya).
- `bug-report`, `tech-spec` (Software).
- `exit-interview` (HR).
- `release-plan` (Product).
- `board-deck-financial`, `expense-report` (Finance).
- `compliance-checklist` (Legal).
- `design-handoff-checklist`, `ds-component-doc` (Design).

## 1.11.0 — 2026-05-13

### Skills compartidas en `_shared/skills/` — patrón formalizado + 6 skills business cross-dept

Tras la revisión con lupa de los 8 departments implementados, se identifican skills con estructura idéntica entre dos o más departments. Se formaliza el patrón "skills compartidas en `_shared/skills/`" y se crean las primeras 6 business-skills compartidas, separadas explícitamente de las meta-skills que ya viven en esa carpeta (`skill-scaffold`, `agent-scaffold`).

**Estado tras esta versión:** 8 depts implementados, 6 business-skills + 2 meta-skills en `_shared/skills/`, infraestructura preparada para que cualquier instalación parcial de departments tenga acceso a las skills transversales sin trabajo adicional.

---

### Nueva sección §7.1 en `conventions.md` — Skills compartidas

Documenta cuándo una skill vive en `_shared/skills/` vs en un dept. Criterios canónicos:

1. **≥2 departments la usan o la usarán razonablemente.** Si solo uno la consume, va al dept.
2. **El entregable es genuinamente idéntico.** No solo el nombre coincide: plantilla, información a recopilar y proceso son los mismos.
3. **No hay matices fuertes por dept.** Si los hay, duplicar.

**Anti-drift:** una skill compartida que empieza a recibir variantes por dept es señal de que debe duplicarse y vivir en cada dept con su matiz. No se fuerza lo compartido.

**Naming:** sin prefijo (`competitive-analysis`, no `common-competitive-analysis`). La carpeta `_shared/skills/` identifica ubicación; el nombre identifica entregable. Coherente con `skill-scaffold` y `agent-scaffold` actuales.

**Coexistencia:** las business-skills conviven con las meta-skills en `_shared/skills/` sin subcarpetas. Se distinguen por dominio, no por ubicación.

**Distribución:** `install.sh` / `install.ps1` ya propagan `_shared/` siempre (líneas 282-342 del installer). Ninguna skill compartida nueva requiere cambios en el installer — la propagación es automática.

---

### Actualización de `skill-scaffold/SKILL.md` y `shared-skill-builder.md`

Ambas referencias canónicas de creación de skills se actualizan para considerar explícitamente la ubicación (`dept` vs `_shared/`) durante el proceso de creación de cualquier skill nueva.

- **`_shared/skills/skill-scaffold/SKILL.md`** — añadidos:
  - Campo `location` en "Información común a recopilar".
  - Sección nueva "Decidir ubicación: dept o `_shared/`" con criterios y caso de duda explícitos.
  - Paso adicional en "Proceso" (paso 2) para evaluar ubicación antes de decidir modo.
  - Paso 8 nuevo: si la skill es compartida, identificar agentes consumidores y avisar al usuario para que los actualice.
  - Nueva restricción: "No forzar el camino compartido". Empezar específico, promover a compartido si emerge reuso.

- **`_shared/agents/shared-skill-builder.md`** — añadidos:
  - Modo `create-v1` paso 2: decidir ubicación con criterios explícitos antes de recopilar campos.
  - Modo `create-v2` paso 2: decidir ubicación (las skills v2 a menudo son transversales — los MCPs/APIs típicamente sirven a varios depts; `_shared/` es candidato natural).
  - Modo `create-v1` paso 6: si es compartida, identificar agentes consumidores y avisar al usuario.
  - Nueva restricción: "No forzar el camino compartido", con propuesta de duplicar si emerge drift.

---

### 6 business-skills compartidas creadas

Todas v1 prosa, en `_shared/skills/<name>/SKILL.md`:

| Skill | Agentes consumidores documentados | Justificación |
|---|---|---|
| `competitive-analysis` | `marketing-strategy`, `product-strategy-roadmap` | Matriz comparativa con la misma estructura: landscape, comparison matrix, whitespace, threat assessment. Mismo entregable, scope distinto |
| `case-study` | `marketing-content`, `sales-enablement` | Caso de éxito con problema → solución → resultados verificables + citas verbatim. Idéntica estructura para marketing y sales |
| `kpi-dashboard` | `marketing-seo`, `product-metrics`, `finance-reporting`, `sales-crm` | KPI × target × variance × tendencia × commentary. Mismo esqueleto, scope variable por dominio |
| `stakeholder-map` | `product-discovery`, `legal-risk`, `marketing-strategy`, `sales-ae` | Mapa de influencia × interés × posición × plan de engagement. Útil cross-dept con la misma estructura |
| `risk-matrix` | `legal-risk`, `software-architecture` (ADRs), `finance-budgeting` (escenarios), `product-strategy-roadmap` | Probabilidad × impacto × mitigación × residual × owner. Idéntica metodología, dominios distintos |
| `okr-set` | `product-metrics`, `hr-evaluation` (OKRs personales), `marketing-strategy` | 1-3 Os + 2-4 KRs cuantitativos + scoring 0.0-1.0 + cadencia. Patrón uniforme con scope distinto |

---

### Actualización de 14 agentes consumidores

Cada agente lista las skills compartidas que consume en su tabla `## Skills disponibles`, marcándolas con la nota "Compartida — vive en `_shared/skills/`":

- **Marketing**: `marketing-strategy` (3 nuevas), `marketing-content` (1), `marketing-seo` (1)
- **Sales**: `sales-ae` (1), `sales-enablement` (1), `sales-crm` (1) — **`sales-crm` pasa de no tener skills propias a tener `kpi-dashboard`**
- **Software**: `software-architecture` (1, para ADRs)
- **HR**: `hr-evaluation` (1)
- **Product**: `product-strategy-roadmap` (3), `product-metrics` (2), `product-discovery` (1)
- **Finance**: `finance-budgeting` (1), `finance-reporting` (1)
- **Legal**: `legal-risk` (2) — **`legal-risk` pasa de no tener skills propias a tener `risk-matrix` + `stakeholder-map`**

Total: 14 agentes editados, 22 referencias añadidas a skills compartidas.

**No se modifican las skills propias** ni los orquestadores. La regla §7 sigue vigente: las skills no declaran qué agentes las usan; los agentes referencian skills.

---

### Cambios en archivos transversales

- `.aigent/VERSION` — bump 1.10.0 → 1.11.0 (MINOR: nueva categoría de skills + 6 archivos nuevos, sin romper contratos).
- `.aigent/CHANGELOG.md` — esta entrada.
- `.aigent/departments/_shared/conventions.md` — nueva sección §7.1.
- `.aigent/departments/_shared/skills/skill-scaffold/SKILL.md` — proceso ampliado.
- `.aigent/departments/_shared/agents/shared-skill-builder.md` — modos `create-v1` y `create-v2` ampliados.

**`.aigent/BOSS.md` no se modifica** — BOSS no lista skills, solo orquesta a nivel de dept.

**`.aigent/README.md` no se modifica en esta versión** — la sección de departments sigue válida; las skills compartidas son detalle de implementación que no aparece en la tabla de estado.

### Implicaciones para próximas sesiones

- Toda creación nueva de skill **evaluará la ubicación** vía el proceso documentado en `skill-scaffold` y `shared-skill-builder`. Default sigue siendo el dept; `_shared/` solo cuando los criterios de §7.1 se cumplen claramente.
- Toda nueva business-skill compartida sigue el patrón: archivo en `_shared/skills/<name>/SKILL.md` + actualización de agentes consumidores en sus tablas `## Skills disponibles`.
- Si una skill compartida empieza a divergir entre depts, el flujo correcto es **duplicarla y dejarla específica en cada dept**, no añadir condicionales en la skill compartida.

## 1.10.0 — 2026-05-13

### Departamento Design — activado

Octavo departamento implementado tras Marketing, Sales, Software, HR, Product, Finance y Legal. Design pasa de **stub honesto (🚧 TODO)** a **✅ implementado** con orquestador, 4 agentes especialistas y 3 skills v1 prosa.

**Estado tras esta versión:** 8 depts implementados, 1 parcial (Operations) y 1 TODO (DevOps).

**Composición decidida (revaluación de los 4 agentes stub previstos):**

Composición según README sin cambios (`design-ui`, `design-ux-research`, `design-design-system`, `design-accessibility`), pero con una **decisión operativa clave** sobre `design-ux-research`: opera de forma **autónoma como UX puro** sobre interfaces existentes o propuestas, **sin coordinación obligatoria con `product-discovery`**. La frontera operativa es: `product-discovery` investiga *qué problema resolver*; `design-ux-research` investiga *qué tan bien se resuelve con la interfaz*. Decisión documentada en el system prompt del agente para evitar drift futuro.

**Cambios concretos:**

- `.aigent/departments/design/design-orchestrator.md` — sustituye al stub. Paths default: `ui/{screens,components,prototypes}/`, `ux-research/{usability-tests,journey-maps,heuristic-evals,friction}/`, `design-system/{tokens,foundations,components,docs}/`, `accessibility/{audits,remediation,patterns}/`. Paso 0.5 amplía con confirmación de **plataformas objetivo, brand de referencia (coordinación con marketing si existe), nivel WCAG objetivo (AA por defecto), idioma(s) de interfaz**.
- `.aigent/departments/design/agents/design-ui.md` — sustituye al stub. Foco: layouts, mockups, prototipos, specs para handoff con estados completos (default + hover + focus + active + disabled + loading + error + empty) + responsive. Lista skill `ui-component-spec`.
- `.aigent/departments/design/agents/design-ux-research.md` — sustituye al stub. Foco UX puro autónomo (usability tests, heuristic eval, journey maps, friction analysis, card sorting, tree testing). Restricción explícita de no reemplazar a `product-discovery`. Sin skill propia (plantillas internas por método).
- `.aigent/departments/design/agents/design-design-system.md` — sustituye al stub. Foco: tokens, foundations, componentes con guidelines de uso, versioning serio con semver, deprecations planificadas. Lista skill `design-token-set`.
- `.aigent/departments/design/agents/design-accessibility.md` — sustituye al stub. Foco: audits WCAG 2.2 AA por defecto, ARIA, keyboard, screen readers (VoiceOver/NVDA/JAWS/TalkBack), contraste, focus management. Lista skill `accessibility-audit`.

**Skills v1 nuevas (3):**

- `.aigent/departments/design/skills/ui-component-spec/SKILL.md` — spec UI para handoff con anatomía, props/variantes, estados completos, responsive, tokens consumidos, accesibilidad mínima, edge cases (texto largo, datos vacíos, errores, permisos), criterios de aceptación.
- `.aigent/departments/design/skills/design-token-set/SKILL.md` — set de design tokens por categoría (color/spacing/typography/radius/shadow/motion) con base + semánticos, soporte light/dark, traducción multi-plataforma (web/iOS/Android), versioning semver + política de deprecation, tabla maestra de contraste WCAG para tokens de color.
- `.aigent/departments/design/skills/accessibility-audit/SKILL.md` — audit WCAG 2.2 estructurado con scope, metodología (manual + screen reader + tooling), tabla de SC con pass/fail/partial/N-A, hallazgos individuales con severidad (bloqueante/crítico/mayor/menor/cosmético) y categoría (`[DS FIX]` / `[ENGINEERING FIX]`), casos edge (zoom 200%, reduced motion, high contrast, RTL), score por nivel.

---

### Cambios en archivos transversales

- `.aigent/README.md` — tabla "Estado de los departamentos": Design pasa a ✅ implementado. Nueva sección detallada "### Design — ✅ implementado". Tabla "DevOps...TODO" reducida a solo DevOps. MCPs recomendados añadidos.
- `.aigent/BOSS.md` — tabla "Departamentos": Design pasa a línea de implementados con su disparador.
- `.aigent/VERSION` — bump 1.9.0 → 1.10.0 (MINOR: un dept activado, sin romper contratos previos).
- `.aigent/CHANGELOG.md` — esta entrada.

### Próximos pasos (siguientes sesiones)

- Activar el último dept TODO: **DevOps**.
- Operations sigue ⚠️ parcial (tiene skill v2 `redmine` pero sin agentes especialistas implementados).
- Con 8 de 9 depts implementados, una posible siguiente versión MINOR completaría el set; tras eso, espacio para MAJOR si se rediseña la estructura de orquestación.

## 1.9.0 — 2026-05-13

### Departamentos Finance y Legal — activados

Dos departamentos pasan de **stub honesto (🚧 TODO)** a **✅ implementado** en la misma versión: Finance (3 agentes + 3 skills v1, con fusión deliberada de invoicing) y Legal (4 agentes + 3 skills v1). Sexto y séptimo departamento implementados tras Marketing, Sales, Software, HR y Product.

**Estado tras esta versión:** 7 depts implementados (Marketing, Sales, Software, HR, Product, Finance, Legal), 1 parcial (Operations) y 2 TODO (Design, DevOps).

---

### Finance — 3 agentes (fusión deliberada de invoicing), 3 skills v1

Composición re-evaluada respecto al README: en lugar de 4 agentes (`finance-budgeting`, `finance-invoicing`, `finance-reporting`, `finance-treasury`) se quedan **3** fusionando invoicing en reporting. Invoicing es alta procedural: la skill `invoice-template` cubre el caso de uso, y mantener un agente entero para emitir facturas añadía superficie sin razonamiento exclusivo. `finance-reporting` absorbe el ciclo de AR/AP por encajar con el ciclo contable (issue → record → close).

**Cambios concretos:**

- `.aigent/departments/finance/finance-orchestrator.md` — sustituye al stub. Paths default: `budgeting/{annual,forecasts,scenarios}/`, `reporting/{close,statements,board,kpi,invoices,ap}/`, `treasury/{cash,banking,fx-debt}/`. Paso 0.5 amplía con confirmación de **moneda funcional, marco contable (IFRS/GAAP/PGC), año fiscal y periodicidad de cierre** — datos críticos para cualquier output financiero.
- `.aigent/departments/finance/agents/finance-budgeting.md` — presupuestos anuales/trimestrales, rolling forecasts, scenarios, headcount, capex. Drivers antes que líneas. Lista skill `budget-plan`.
- `.aigent/departments/finance/agents/finance-reporting.md` — cierres mensuales/trimestrales/anuales, P&L/Balance/Cash Flow, KPI dashboard, board reports, AR/AP cycle, conciliaciones. Lista skills `financial-report`, `invoice-template`.
- `.aigent/departments/finance/agents/finance-treasury.md` — cash management, banca, FX exposure, working capital, short-term financing. Restricción explícita de conservadurismo en planificación (cobros tarde, pagos antes).

**Stub pendiente de borrado manual por el usuario** (permiso de delete denegado al agente):
- `.aigent/departments/finance/agents/finance-invoicing.md`

**Skills v1 nuevas (3):**

- `.aigent/departments/finance/skills/budget-plan/SKILL.md` — presupuesto estructurado con drivers, P&L mensualizado, headcount plan, capex plan, escenarios (best/base/worst) + sensibilidades, supuestos trazables y variance framework para futuros ciclos.
- `.aigent/departments/finance/skills/financial-report/SKILL.md` — report financiero con resumen ejecutivo adaptado a audiencia (board / leadership / externo), P&L + Balance + Cash Flow con comparativos, KPI dashboard, variance commentary obligatorio, forecast actualizado opcional.
- `.aigent/departments/finance/skills/invoice-template/SKILL.md` — factura a cliente con campos fiscales del país emisor, numeración consecutiva por serie (factura / rectificativa / proforma), cálculo de impuestos y retenciones, términos de pago, notas legales por jurisdicción.

---

### Legal — 4 agentes, 3 skills v1, con aviso fundamental

Composición según README sin cambios — Privacy lo merece como dominio especializado (GDPR/CCPA/LGPD), risk cubre due diligence y compliance general, policies cubre T&C/AUP externos (distinto de `hr-policies` interno).

**Aviso fundamental añadido a todo el dept:** estos agentes producen **borradores y estructura, NO asesoría legal**. Cada output marca explícitamente `[REVISAR LEGAL]` los pasajes críticos y el orquestador rechaza emitir opinión vinculante. El orquestador y todos los agentes lo recuerdan en sus restricciones.

**Cambios concretos:**

- `.aigent/departments/legal/legal-orchestrator.md` — sustituye al stub. Paths default: `contracts/{nda,msa,sow,licenses,other}/`, `policies/{terms,aup,cookies,sla}/`, `privacy/{policy,dpa,dpia,ropa,transfers,breaches}/`, `risk/{reviews,dd,litigation,ma}/`. Paso 0.5 amplía con confirmación de **jurisdicción principal, jurisdicciones de operación y marcos regulatorios aplicables (GDPR/CCPA/LGPD/sectoriales)** — críticos para cualquier output legal. Nota explícita de solapamiento con `hr-policies` (interno) vs `legal-policies` (externo).
- `.aigent/departments/legal/agents/legal-contracts.md` — NDAs, MSAs, SOWs, licencias, partnerships, term sheets, LOIs, consulting agreements. Equilibrio razonable, cláusulas críticas marcadas, trazabilidad de desviaciones. Lista skill `contract-template`.
- `.aigent/departments/legal/agents/legal-policies.md` — T&C, ToS, AUP, cookies, SLA público, disclaimers. Plain language sin perder rigor, jurisdicción declarada, versionado obligatorio. Lista skill `terms-of-service`.
- `.aigent/departments/legal/agents/legal-privacy.md` — privacy policy, DPAs, DPIAs, ROPA, transferencias internacionales (SCCs/BCRs/adequacy), DSAR, gestión de brechas. Marca regulatorio explícito, plazos de respuesta innegociables (30d DSAR, 72h brecha GDPR). Lista skill `privacy-policy`.
- `.aigent/departments/legal/agents/legal-risk.md` — risk analysis de decisiones, compliance reviews, due diligence, litigation tracking, M&A, whistleblowing channels. Riesgo = probabilidad × impacto, counsel externo en bucle desde día 1 en M&A/litigios.

**Skills v1 nuevas (3):**

- `.aigent/departments/legal/skills/contract-template/SKILL.md` — borrador estructurado de contrato comercial (NDA / MSA / SOW / consulting / partnership) con preámbulo, definiciones, cláusulas (objeto, pricing, IP, confidencialidad, liability cap, indemnización, jurisdicción), resumen ejecutivo para el firmante y marca `[REVISAR LEGAL]` en cláusulas críticas.
- `.aigent/departments/legal/skills/privacy-policy/SKILL.md` — política de privacidad pública compliant con GDPR/CCPA/LGPD: responsable, categorías de datos, finalidades con base legal, plazos, destinatarios, transferencias internacionales, derechos del interesado con plazos, decisiones automatizadas, menores, cambios materiales.
- `.aigent/departments/legal/skills/terms-of-service/SKILL.md` — T&C / ToS estructurados con resumen de 3 minutos, cuenta, pricing & billing, IP del usuario y del servicio, AUP resumido, limitación responsabilidad, indemnización, terminación, modificaciones materiales con plazo de aviso, derechos de consumo si aplican.

---

### Cambios en archivos transversales

- `.aigent/README.md` — tabla "Estado de los departamentos": Finance y Legal pasan a ✅ implementado. Dos nuevas secciones detalladas "### Finance — ✅ implementado" y "### Legal — ✅ implementado". Tabla "Design...TODO" reducida a Design + DevOps. MCPs recomendados añadidos por dept.
- `.aigent/BOSS.md` — tabla "Departamentos": Finance y Legal pasan a líneas de implementados con sus disparadores.
- `.aigent/VERSION` — bump 1.8.0 → 1.9.0 (MINOR: dos depts activados, sin romper contratos previos).
- `.aigent/CHANGELOG.md` — esta entrada.

### Próximos pasos (siguientes sesiones)

- Borrado manual del stub `finance-invoicing.md` (acción del usuario).
- Activar los 2 depts TODO restantes: Design y DevOps.
- Operations sigue ⚠️ parcial (tiene skill v2 `redmine` pero sin agentes especialistas implementados).
- Con 7 de 9 depts implementados, considerar siguiente versión MAJOR si se rediseña la estructura de orquestación o si surge un patrón cross-dept frecuente que justifique extraer al `_shared/`.

## 1.8.0 — 2026-05-13

### Departamentos HR y Product — activados

Dos departamentos pasan de **stub honesto (🚧 TODO)** a **✅ implementado** en la misma versión: HR (4 agentes + 3 skills v1) y Product (3 agentes + 3 skills v1, con fusión deliberada). Cuarto y quinto departamento implementados tras Marketing, Sales y Software.

**Estado tras esta versión:** 5 depts implementados (Marketing, Sales, Software, HR, Product), 1 parcial (Operations) y 4 TODO (Design, DevOps, Finance, Legal).

---

### HR — 4 agentes, 3 skills v1

Composición según README sin cambios. Los 4 stubs originales conservan rol pero se redactan con system prompt completo.

**Cambios concretos:**

- `.aigent/departments/hr/hr-orchestrator.md` — sustituye al stub. Paths default: `recruitment/{jd,interview-kits,candidates,offers}/`, `onboarding/`, `evaluation/{reviews,one-on-ones,pips}/`, `policies/`. Tabla de decisión con disparadores en español. Nota de solapamiento con futuro `legal-policies`.
- `.aigent/departments/hr/agents/hr-recruitment.md` — JDs, sourcing, interview kits, screening, scorecards, ofertas, rejection. Lista skill `job-description`.
- `.aigent/departments/hr/agents/hr-onboarding.md` — plan 30/60/90, day-1 checklist, welcome pack, evaluación de período de prueba, retros de onboarding. Sin skill propia (plantilla interna).
- `.aigent/departments/hr/agents/hr-evaluation.md` — 1:1s, performance reviews, OKRs personales, career growth, PIPs, eNPS. Lista skill `performance-review`. Confidencialidad como restricción explícita.
- `.aigent/departments/hr/agents/hr-policies.md` — handbook, políticas individuales, comunicación de cambios, benchmarks. Lista skill `policy-document`. Marca jurisdicción y coordinación con legal como puntos críticos.

**Skills v1 nuevas (3):**

- `.aigent/departments/hr/skills/job-description/SKILL.md` — JD completo con frontmatter `type`, EVP, responsabilidades, must/nice, banda salarial (con pay-transparency consciente de jurisdicción), proceso, equidad.
- `.aigent/departments/hr/skills/performance-review/SKILL.md` — review estructurado con secciones evidencia → impacto → competencias → rating con calibración → feedback con frases listas → growth plan → feedback bidireccional → decisiones derivadas.
- `.aigent/departments/hr/skills/policy-document/SKILL.md` — política individual con propósito, scope, definiciones, reglas, procedimiento, excepciones, consecuencias, owner y fecha de revisión. Plain language + jurisdicción.

---

### Product — 3 agentes (fusión deliberada), 3 skills v1

Composición re-evaluada respecto al README: en lugar de 4 agentes (`product-discovery`, `product-roadmap`, `product-strategy`, `product-metrics`) se quedan **3** fusionando strategy + roadmap. Aplicación literal de la regla "más agentes ≠ mejor" del CLAUDE.md: strategy decide *qué/por qué* y roadmap decide *cuándo* — son la misma disciplina por dos ejes; mantenerlos separados forzaba al orquestador a coordinarlos casi siempre.

**Cambios concretos:**

- `.aigent/departments/product/product-orchestrator.md` — sustituye al stub. Paths default: `discovery/{interviews,research,personas}/`, `strategy/{vision,competitive,prds,roadmap}/`, `metrics/{definitions,okrs,analysis}/`. Tabla de decisión con disparadores en español.
- `.aigent/departments/product/agents/product-discovery.md` — user interviews, JTBD, opportunity-solution trees, validación de problema y solución, personas, customer journey maps. Lista skill `user-interview-script`. Restricción explícita contra preguntas guiadas, contra personas demográficas vacías, contra declarar problema validado con n=1.
- `.aigent/departments/product/agents/product-strategy-roadmap.md` — agente NUEVO (fusión). Visión, posicionamiento, análisis competitivo, priorización (RICE/MoSCoW/Kano/Cost-of-delay), roadmap por trimestres o now/next/later, bets. Lista skill `product-roadmap`.
- `.aigent/departments/product/agents/product-metrics.md` — north star, OKRs producto, KPI trees, instrumentación, frameworks (AARRR/HEART/Pirate), análisis de experimentos. Lista skill `north-star-metric`. Restricciones explícitas contra métricas vanity, contra confundir correlación con causalidad, contra OKRs sin número.

**Stubs pendientes de borrado manual por el usuario** (permiso de delete denegado al agente):
- `.aigent/departments/product/agents/product-strategy.md`
- `.aigent/departments/product/agents/product-roadmap.md`

**Skills v1 nuevas (3):**

- `.aigent/departments/product/skills/user-interview-script/SKILL.md` — script con calentamiento, exploratorias, profundización (5 whys suave), preguntas de comportamiento (no hipotéticas), reacción a propuesta (solo solution-validation), cierre, debrief en caliente, notas para el entrevistador.
- `.aigent/departments/product/skills/product-roadmap/SKILL.md` — roadmap por horizonte (now/next/later o quarterly), fichas por iniciativa con outcome + hipótesis + dependencias + riesgo + criterio de éxito, sección "Lo que NO está en el roadmap (y por qué)", confianza explícita, cadencia de revisión.
- `.aigent/departments/product/skills/north-star-metric/SKILL.md` — NSM con candidates evaluados contra 3 criterios (valor, accionabilidad, sostenibilidad), definición operativa precisa, KPI tree de inputs, guardraíles, anti-patrones a evitar, cadencia de revisión.

---

### Cambios en archivos transversales

- `.aigent/README.md` — tabla "Estado de los departamentos": HR y Product pasan a ✅ implementado. Dos nuevas secciones detalladas "### HR — ✅ implementado" y "### Product — ✅ implementado". Tabla "Design...TODO" reducida a Design, DevOps, Finance, Legal. MCPs recomendados añadidos por dept.
- `.aigent/BOSS.md` — tabla "Departamentos": HR y Product pasan a líneas de implementados con sus disparadores.
- `.aigent/VERSION` — bump 1.7.0 → 1.8.0 (MINOR: dos depts activados, sin romper contratos previos).
- `.aigent/CHANGELOG.md` — esta entrada.

### Próximos pasos (siguientes sesiones)

- Borrado manual de los stubs `product-strategy.md` y `product-roadmap.md` (acción del usuario).
- Activar los 4 depts TODO restantes: Design, DevOps, Finance, Legal.
- Operations sigue ⚠️ parcial (tiene skill v2 `redmine` pero sin agentes especialistas implementados).

## 1.7.0 — 2026-05-13

### Departamento Software — activado

Tercer departamento implementado tras Marketing y Sales. El dept Software pasa de **stub honesto (🚧 TODO)** a **✅ implementado** con orquestador, 4 agentes especialistas y 3 skills v1 prosa.

**Composición decidida (revaluación de los 4 agentes stub previstos en el README):**

Los 4 agentes stub originalmente listados eran `software-architecture`, `software-code-review`, `software-qa`, `software-docs`. Tras cuestionar la composición (regla "más agentes ≠ mejor" del CLAUDE.md de este repo):

- Se mantienen `software-architecture`, `software-code-review`, `software-qa`.
- Se elimina `software-docs`: su trabajo se reparte — PRDs van a `shared-prd-agent` (ya existente), ADRs a `software-architecture` (con la nueva skill `adr`), y READMEs/runbooks/API docs quedan como candidatos a skills v1 si aparece la necesidad.
- Se añade **`software-coding`** como cuarto agente (implementador): toma specs (PRD/ADR/ticket) y produce código de producción, agnóstico de stack. Cierra el ciclo *architecture → coding → code-review → qa*.

**Cambios concretos:**

- `.aigent/departments/software/software-orchestrator.md` — sustituye al stub. Sigue `_shared/orchestrator-template.md` literalmente: Paso 0 (proyecto activo), Paso 0.5 (paths default + MCPs), gestión de tareas con prefijo `SW-###`, 4 agentes en "Agentes disponibles", tabla de decisión rápida, manejo de skills v2 readiness, reglas de output con subcarpetas (`architecture/{adr,designs,evaluations}/`, `code/` o repo del proyecto, `reviews/`, `qa/{plans,cases}/`).
- `.aigent/departments/software/agents/software-architecture.md` — sustituye al stub. Foco: ADRs, diseños de sistema, evaluaciones de stack, modelado de dominio. Lista la skill `adr`.
- `.aigent/departments/software/agents/software-coding.md` — agente NUEVO. Foco: implementación, fixes, refactors, migraciones. Stack agnóstico. Sin skills propias por ahora (trabaja directamente sobre el repo).
- `.aigent/departments/software/agents/software-code-review.md` — sustituye al stub. Foco: review estructurado con severidades 🔴/🟠/🟡/🔵, 8 ejes (corrección, seguridad, tests, legibilidad, idiomatic, performance, mantenibilidad, arquitectura). Lista la skill `code-review-checklist`.
- `.aigent/departments/software/agents/software-qa.md` — sustituye al stub. Foco: estrategia de testing, planes por nivel (unit/integration/e2e/perf/security), criterios de aceptación. Lista la skill `test-plan`.
- `.aigent/departments/software/agents/software-docs.md` — **pendiente de borrado manual** por el usuario (el agente carecía de permiso de delete; el archivo ya no aparece referenciado por orquestador ni README).

**Skills v1 nuevas (3):**

- `.aigent/departments/software/skills/adr/SKILL.md` — Architecture Decision Record numerado y fechado: contexto, drivers, opciones (mínimo 2), decisión, consecuencias, riesgos. Convención de supersedes para reversiones.
- `.aigent/departments/software/skills/code-review-checklist/SKILL.md` — report estructurado: veredicto (✅/🟠/🔴), top 3, hallazgos por severidad con `archivo:línea/categoría/razón/sugerencia/referencias`, análisis por 8 ejes.
- `.aigent/departments/software/skills/test-plan/SKILL.md` — plan por niveles (unit/integration/e2e/perf/security) con casos `TC-###`, prioridades P0-P3, criterios de salida verificables, riesgos.

**Cambios en archivos transversales:**

- `.aigent/README.md` — tabla "Estado de los departamentos": Software pasa de 🚧 TODO a ✅ implementado (4/4 agentes, 3 skills). Nueva sección "### Software — ✅ implementado" con tabla de agentes y skills. Tabla "Design...Software TODO" reducida (sin Software). MCPs recomendados para Software añadidos (GitHub, GitLab, filesystem, git, search en código).
- `.aigent/BOSS.md` — tabla "Departamentos": Software pasa a línea de implementados con su disparador.
- `.aigent/VERSION` — bump 1.6.3 → 1.7.0 (MINOR: nueva capacidad del sistema, no rompe contratos existentes).
- `.aigent/CHANGELOG.md` — esta entrada.

**Stack agnóstico.** Todos los agentes y skills del dept se adaptan al lenguaje/framework del proyecto activo. No asumen Node/Python/Go/etc. ni mencionan herramientas concretas en system prompts (regla §8 de conventions).

**Próximos pasos (siguientes sesiones):**

- Borrado físico del stub `software-docs.md` (acción manual del usuario).
- Validar la composición en uso real y, si aparecen patrones repetidos, formalizar skills v1 adicionales: candidatas naturales `runbook`, `api-doc`, `tech-spec`, `bug-report`.
- Considerar skills v2 si Aigent quiere ejecutar contra GitHub/GitLab API directamente (cuando no haya MCP fiable).

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
