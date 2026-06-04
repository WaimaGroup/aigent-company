---
name: "software-project-onboarding"
user-invocable: true
description: >
  Skill that runs the canonical kickoff flow for any software project: STEP 0
  classifies NEW (greenfield) vs EXISTING (brownfield), then branches into
  discovery (Branch A) or audit (Branch B), and converges on a shared synthesis
  (verdict, decisions, next steps, open questions). Produces a persisted
  onboarding report plus PRD/ADR seeds so the next agent never starts from zero.
  Stack agnostic. This file is the single source of truth of the criterion — the
  caller derives its concrete prompt from here, it does not hardcode the steps.
---

# Skill: Project Onboarding — clasificar, descubrir o auditar, y sintetizar

**Entregable:** archivo `.md` de onboarding en `<proyecto>/software/architecture/project-onboarding.md` (la síntesis y el veredicto), acompañado de los entregables canónicos que la rama produzca: PRD en `.context/<proyecto>/software/prd.md` (rama NUEVO), ADR(s) en `<proyecto>/software/architecture/adr/`, y decisiones registradas en `decisions[]` del config del proyecto.

> **Principio rector — el porqué antes del cómo.** Entender el problema de negocio precede a cualquier decisión técnica. Esta skill no salta a analizar código ni a proponer stack: primero clasifica, luego observa, y solo entonces concluye.

> **Esta skill es la única fuente de verdad del criterio.** El agente que la consume **deriva su prompt concreto** de los pasos de aquí — no los lleva hardcodeados. Si un dominio necesita afinar el flujo (más profundidad, un paso extra, la variante *quick scan*), lo deriva de este documento, que sigue mandando.

---

## Cuándo usar esta skill

- Es la **primera vez** que el departamento de Software entra en un proyecto y hay que situarse antes de hacer cualquier trabajo de especialista (diseño, código, review, QA).
- El usuario pide explícitamente "clasifica el proyecto", "onboarding", "audita el repo", "ponme en contexto", "¿qué tenemos aquí?", "arranquemos este proyecto desde cero".
- Se incorpora un módulo nuevo a un proyecto existente y hay que decidir cómo tratarlo (caso mixto).
- El contexto persistido (`.context`) ha divergido del disco y conviene re-situar el proyecto (variante *quick scan*).

**Cuándo NO usar:**

- Para revisar un spec ya redactado → `software-spec-review`.
- Para revisar código → `software-code-review-checklist`.
- Para escribir un ADR puntual de una decisión concreta → `software-adr` directamente.
- Para implementar una feature/bugfix → skills de `software-coding`.
- Cuando el proyecto **ya tiene** su `project-onboarding.md` y el contexto coincide con el disco: leer lo persistido, no re-ejecutar el flujo completo (a lo sumo, *quick scan*).

---

## Información a recopilar

El **Paso 0** se resuelve observando el proyecto, no preguntando. Solo se pregunta lo que no se puede inferir. Regla: **una incógnita a la vez** — si falta info del usuario, se pregunta de forma puntual; no se asume ni se avanza a ciegas.

| Campo | Pregunta / cómo obtenerlo |
|---|---|
| Proyecto activo | Lo pasa el orquestador. Si no, resolver según `conventions.md` §10.1 (listar `.context/`). |
| Clasificación | **Se infiere** del Paso 0 (señales abajo). Solo se pregunta si el caso es ambiguo. |
| Profundidad | ¿*Full onboarding* (default) o *quick scan* (re-situar rápido un proyecto ya conocido)? |
| Ruta del código | ¿Dónde vive el repo/código del proyecto? (para Rama B; si Rama A, ¿dónde se hará el scaffolding?) |
| Acceso | ¿Hay algo que la skill no pueda leer (repos privados, sistemas externos) y deba marcar `[VERIFICAR]`? |

> Para la **Rama A** la mayor parte de la información se extrae del usuario durante el descubrimiento (preguntas A1–A8, una incógnita a la vez). Para la **Rama B** la mayor parte se observa en el repo (B1–B10, citando `archivo:línea`).

---

## PASO 0 — Clasificación (decisión raíz)

Antes de nada, responder: **¿proyecto NUEVO o EXISTENTE?** Esta decisión bifurca todo lo demás.

| Señal | Apunta a NUEVO | Apunta a EXISTENTE |
|---|---|---|
| ¿Hay manifiesto? (`package.json`, `pom.xml`, `pyproject.toml`, `go.mod`, …) | No | Sí |
| ¿Hay código fuente? | Repo vacío / solo scaffolding | Sí, con módulos |
| ¿Hay historia de git? | 0-1 commits | Historia real |
| ¿Hay contexto previo? (`.context`, docs, ADRs) | No | Sí |

Resolución:

- **Caso claro** → tomar la rama correspondiente.
- **Caso ambiguo** (ej. repo recién creado pero con intención clara) → **preguntar al usuario** qué espera antes de bifurcar (una sola pregunta).
- **Caso mixto** (proyecto existente al que se añade un módulo nuevo) → **Rama B para el todo** + **Rama A acotada al módulo nuevo**.

> **La ausencia es información.** "No hay tests", "no hay CI", "no hay dueño definido", "no hay manifiesto" son **hallazgos**, no silencios. Se registran como tales.

El resultado del Paso 0 determina qué guion sigue el agente: descubrimiento (Rama A) o auditoría (Rama B).

---

## RAMA A — Proyecto NUEVO (greenfield): DESCUBRIR y DEFINIR

Aquí **no se revisa nada: se pregunta y se define.** El arquitecto extrae del usuario lo que aún no está escrito y propone lo que falta. Preguntar una incógnita a la vez; no avanzar a ciegas.

- **A1 · Contexto de negocio** — ¿Qué problema resuelve? ¿Para quién? ¿Cuál es la métrica de éxito? ¿Por qué ahora?
- **A2 · Alcance** — Casos de uso principales. Y explícitamente **qué NO entra** (el anti-alcance evita el scope creep).
- **A3 · Restricciones** — Plazo, presupuesto, tamaño y skills del equipo, plataformas objetivo, normativa/compliance aplicable.
- **A4 · Requisitos no funcionales** — Escala esperada, rendimiento, disponibilidad, seguridad, privacidad de datos, i18n. Definirlos pronto: condicionan el stack.
- **A5 · Integraciones y datos** — Sistemas externos, APIs, fuentes de datos, autenticación, qué se reutiliza vs. qué se construye.
- **A6 · Decisión de stack** — Candidatos, criterios de elección, trade-offs. → se registra como **ADR** (skill `software-adr`).
- **A7 · Estructura y tooling de arranque** — Layout inicial, convenciones de código, lint/format, tests y CI desde el día 1, gestión de secretos.
- **A8 · Riesgos y supuestos iniciales** — Lo que aún no sabemos y lo que asumimos; cómo se validará.

**Salida de la Rama A:** PRD inicial + ADR(s) de arranque + estructura/scaffolding propuesta + lista de supuestos a validar. Todo persistido (ver Fase común). El PRD se delega al agente `shared-prd-agent`; los ADRs se producen con `software-adr`.

---

## RAMA B — Proyecto EXISTENTE (brownfield): REVISAR y DIAGNOSTICAR

Aquí **sí se revisa lo que hay.** Observar antes de concluir; **citar `archivo:línea`** en cada hallazgo verificable.

- **B1 · Estructura y puntos de entrada** — Layout, monorepo o no, dónde vive el código, los límites arquitectónicos (capas, módulos, procesos).
- **B2 · Stack y versiones** — Lenguajes, frameworks, runtime requerido, versión del producto.
- **B3 · Dependencias y salud** — Runtime vs. dev, deps nativas, obsoletas o con CVEs, deps que definen el proyecto.
- **B4 · Ejecución, build y test** — Comandos reales (dev/build/test/lint/package/release) + requisitos del entorno.
- **B5 · Calidad** — ¿Tests? ¿runner? ¿cobertura? Linter/formatter. CI/CD y quality gates. Distinguir "badge en README" de "pipeline en el repo".
- **B6 · Configuración y secretos** — Archivos de config, env vars, y ⚠️ **secretos expuestos** (reportar enmascarados, severidad alta).
- **B7 · Documentación y decisiones previas** — README, CHANGELOG, docs, ADRs, `.context`. ¿Coinciden con el código o han divergido?
- **B8 · Preparación agéntica** — ¿`CLAUDE.md` / `AGENTS.md` / `.aigent` / `opencode.json` / `.mcp.json`? ¿Qué instrucciones cargan los agentes? Inventario de agentes (rol/estado), skills (v1/v2) y MCPs disponibles.
- **B9 · Estado de git** — Rama, cambios sin commitear, historia reciente, convención de commits.
- **B10 · Riesgos y deuda** — Lista priorizada: seguridad, ausencia de tests, deps obsoletas, divergencia docs↔código, TODOs/FIXMEs.

**Salida de la Rama B:** informe de onboarding (ficha técnica + arquitectura en una frase + hallazgos priorizados 🔴🟡🟢 + madurez 1-5). Persistido (ver Fase común).

### Madurez (1-5) — escala para B

| Nivel | Interpretación |
|---|---|
| 1 | Caótico: sin tests, sin CI, sin docs fiables, deps sin gestionar. |
| 2 | Básico: build reproducible, algo de docs, tests testimoniales. |
| 3 | Funcional: tests con cobertura parcial, CI básico, docs que mayormente coinciden con el código. |
| 4 | Sólido: buena cobertura, CI/CD con gates, docs y ADRs al día, deps gestionadas. |
| 5 | Excelente: observabilidad, seguridad activa, quality gates estrictos, documentación viva y decisiones trazadas. |

---

## FASE COMÚN — Síntesis y plan (ambas ramas convergen aquí)

Las dos ramas terminan en la misma síntesis. **Decidir lo mínimo, documentar la decisión** (ADR) para que el siguiente no la re-discuta. No sobre-diseñar.

1. **Diagnóstico / veredicto** — En una frase: dónde estamos.
2. **Decisiones** — Las que hay que tomar ahora y las que se registran como ADR.
3. **Plan de próximos pasos** — 3-5 acciones priorizadas y accionables.
4. **Preguntas abiertas** — Lo que queda por resolver con el equipo/usuario.
5. **Persistencia** — Escribir PRD/ADR/informe en disco y anotar las decisiones en el contexto. **El config es expectativa; el disco manda.**

---

## Plantilla del entregable

Archivo: `<proyecto>/software/architecture/project-onboarding.md` (uno por proyecto; en *quick scan* se actualiza el existente con una nueva entrada de fecha).

```markdown
# Project Onboarding: <Nombre del proyecto>

- **Fecha:** YYYY-MM-DD
- **Autor:** software-architecture (vía skill `software-project-onboarding`)
- **Profundidad:** Full onboarding | Quick scan
- **Clasificación (Paso 0):** 🆕 NUEVO (greenfield) | 🏗️ EXISTENTE (brownfield) | 🔀 Mixto (existente + módulo nuevo)
- **Señales observadas:** <manifiesto sí/no · código sí/no · historia git · contexto previo>

---

## Diagnóstico en una frase

<Dónde estamos, en una sola frase.>

## Arquitectura en una frase
> Solo Rama B / Mixto. Qué es el sistema y cómo está construido, en una frase.

<...>

---

<!-- ===== BLOQUE RAMA A (NUEVO) — incluir solo si aplica ===== -->
## Descubrimiento (proyecto nuevo)

| Eje | Hallazgo / decisión |
|---|---|
| A1 · Contexto de negocio | <problema, para quién, métrica de éxito, por qué ahora> |
| A2 · Alcance | IN: <...> · **NO entra:** <anti-alcance> |
| A3 · Restricciones | <plazo, presupuesto, equipo, plataformas, compliance> |
| A4 · No funcionales | <escala, perf, disponibilidad, seguridad, privacidad, i18n> |
| A5 · Integraciones y datos | <sistemas externos, APIs, auth, reutilizar vs construir> |
| A6 · Stack | <candidatos + decisión> → ADR: adr-<n>-<slug> |
| A7 · Estructura y tooling | <layout, lint/format, tests, CI día 1, secretos> |
| A8 · Riesgos y supuestos | <lo que no sabemos / asumimos + cómo se valida> |

**Scaffolding propuesto:** <árbol de carpetas inicial o referencia al ADR/diseño>
**Supuestos a validar:** <lista>

<!-- ===== BLOQUE RAMA B (EXISTENTE) — incluir solo si aplica ===== -->
## Ficha técnica (proyecto existente)

| Campo | Valor |
|---|---|
| Estructura / puntos de entrada (B1) | <monorepo?, dónde vive el código, límites> |
| Stack y versiones (B2) | <lenguajes, frameworks, runtime, versión producto> |
| Dependencias y salud (B3) | <runtime/dev, obsoletas, CVEs, deps clave> |
| Ejecución/build/test (B4) | `dev:` … · `build:` … · `test:` … · `lint:` … |
| Calidad (B5) | tests: <…> · cobertura: <…> · CI/CD: <pipeline real / badge> · gates: <…> |
| Configuración y secretos (B6) | <config files, env vars> · ⚠️ secretos expuestos: <enmascarados> |
| Documentación y decisiones (B7) | <README/CHANGELOG/ADRs> · ¿coinciden con el código? |
| Preparación agéntica (B8) | <CLAUDE.md/AGENTS.md/.aigent/.mcp.json> · agentes/skills/MCPs |
| Estado de git (B9) | rama: <…> · sin commitear: <…> · convención commits: <…> |

### Hallazgos priorizados

**🔴 Crítico**
1. **<área — archivo:línea>** — <hallazgo + por qué crítico>

**🟡 Importante**
1. **<área — archivo:línea>** — <hallazgo>

**🟢 Menor / mejora**
1. **<área — archivo:línea>** — <hallazgo>

### Madurez: <1-5> — <etiqueta>
<Una línea justificando el nivel.>

<!-- ===== FASE COMÚN — siempre ===== -->
---

## Decisiones

- **Tomadas ahora:** <lista>
- **Registradas como ADR:** adr-<n>-<slug> (<una línea cada uno>)

## Plan de próximos pasos

1. <acción priorizada y accionable — agente/skill sugerido>
2. <...>
3. <...>

## Preguntas abiertas

- <lo que queda por resolver con el equipo/usuario>

## Rastro persistido

- PRD: `.context/<proyecto>/software/prd.md` (si aplica)
- ADR(s): `<proyecto>/software/architecture/adr/adr-<n>-<slug>.md`
- Decisiones en `decisions[]` del config del proyecto: <ids>
```

---

## Variante *quick scan*

Cuando el proyecto ya tiene `project-onboarding.md` y solo hay que re-situarse (sesión nueva, o el contexto persistido diverge del disco):

- **No** se re-ejecuta el flujo completo. Se lee lo persistido y se contrasta contra el disco.
- Se recorre una versión ligera del guion: Paso 0 (¿ha cambiado la clasificación?), los ejes B/A que más probablemente cambian (deps, git, calidad, alcance), y se anota **solo el delta**.
- Se **añade una entrada fechada** al `project-onboarding.md` existente (no se reescribe el histórico) y se actualizan las decisiones que hayan cambiado.

---

## Proceso

1. **Resolver proyecto activo** (lo pasa el orquestador o `conventions.md` §10.1) y leer el contexto: `.context/<proyecto>/config.json` (`decisions[]` con `area == "software" || "global"`), `prd.md`, `tasks.md`, y `project-onboarding.md` si ya existe.
2. **Paso 0 — Clasificar.** Observar las 4 señales (manifiesto, código, git, contexto). Determinar NUEVO / EXISTENTE / Mixto. Si es ambiguo, **preguntar una sola cosa** al usuario antes de bifurcar.
3. **Elegir profundidad.** Si ya hay `project-onboarding.md` y no se pidió full → *quick scan*. Si no, *full onboarding*.
4. **Recorrer la rama** que toque, derivando el prompt concreto de los pasos de arriba (no hardcodearlos):
   - **Rama A:** preguntar A1–A8 una incógnita a la vez; observar nada, definir todo.
   - **Rama B:** observar B1–B10 antes de concluir; citar `archivo:línea`; tratar la ausencia como hallazgo.
   - **Mixto:** Rama B para el todo + Rama A acotada al módulo nuevo.
5. **Converger en la Fase común:** diagnóstico en una frase, decisiones (ahora vs ADR), plan de 3-5 pasos, preguntas abiertas.
6. **Producir los entregables canónicos de la rama:**
   - PRD inicial (Rama A) → delegar a `shared-prd-agent`, guardar en `.context/<proyecto>/software/prd.md`.
   - ADR(s) de las decisiones tomadas → skill `software-adr` en `<proyecto>/software/architecture/adr/`.
   - Scaffolding/diseño propuesto (Rama A) → describir en el informe; si es un diseño amplio, `architecture/designs/`.
7. **Escribir el informe** `project-onboarding.md` con la plantilla, incluyendo solo el bloque de rama que aplique + la Fase común. En *quick scan*, añadir entrada fechada al existente.
8. **Persistir las decisiones** en `decisions[]` del config del proyecto (incluida la clasificación del Paso 0, con `area: "software"`). El config es expectativa; el disco (informe + ADRs) manda.
9. **Actualizar `tasks.md`** con las acciones del plan que se conviertan en tareas (`SW-###`).
10. **Reportar** al usuario: clasificación resuelta, diagnóstico en una frase, ruta del `project-onboarding.md`, rutas de PRD/ADR generados, plan de próximos pasos y preguntas abiertas. Sugerir el siguiente agente/skill (típicamente `software-architecture` para profundizar diseño, `shared-prd-agent` para el PRD, o el especialista que arranque el plan).

---

## Restricciones

- **Clasificar antes de actuar.** No se analiza ni se propone nada antes de resolver el Paso 0. La rama equivocada invalida todo lo que sigue.
- **Observar antes de concluir (Rama B).** No emitir un hallazgo sin haberlo visto en el repo. Todo hallazgo verificable cita `archivo:línea`; lo no verificable se marca `[VERIFICAR]` y no penaliza la madurez.
- **No preguntar lo que se puede observar (Rama B) ni observar lo que no existe (Rama A).** En greenfield no hay código que revisar; se pregunta y se define.
- **Una incógnita a la vez.** Si falta información del usuario, se pregunta de forma puntual; no se asume ni se avanza a ciegas.
- **La ausencia es información.** "No hay tests / CI / dueño / manifiesto" se registra como hallazgo, no se omite.
- **No sobre-diseñar.** Decidir lo mínimo y documentarlo (ADR). No proponer arquitectura de más para un problema que aún no se entiende.
- **Secretos enmascarados.** Si se detectan secretos expuestos (B6), reportarlos enmascarados con severidad alta. Nunca volcar el valor real en el informe.
- **No escribir código de implementación.** Esta skill clasifica, descubre, audita y sintetiza. La implementación la arranca `software-coding` después, siguiendo el plan.
- **Dejar rastro.** Todo lo aprendido/decidido se persiste (informe + ADR + decisiones en config). El siguiente agente no debe empezar de cero.
- Aplican las reglas de output de `_shared/output-rules.md`.
