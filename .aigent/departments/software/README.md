# Software — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de Software.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`software-orchestrator.md`](./software-orchestrator.md).

---

## Cómo se invoca

Tres formas, en orden de fricción creciente para el usuario:

1. **Vía orquestador** (recomendado, default): hablar al `software-orchestrator`. Analiza la petición, identifica al especialista correcto y delega. Si la tarea es compuesta, coordina varios agentes en secuencia.
2. **Directo a agente**: invocar al agente específico cuando ya sabes a quién. Ahorra un salto pero requiere conocer el equipo.
3. **Skill directa**: para tareas muy concretas con input claro (ej. "genera el commit message de este diff" → directo a `software-commit-message`).

> En BOSS-mode (deployments), toda petición de naturaleza técnica entra por el orquestador del dept Software. Los ejemplos de prompts de abajo son lo que el usuario teclea — el orquestador hace el resto.

---

## Agentes

### `software-architecture` — Architecture, Technical Design & Documentation

Decisiones técnicas razonadas, diseños de sistema y documentación técnica del proyecto. No escribe código de producción; decide qué se construye, cómo se estructura y por qué, y deja escrito lo necesario para que otros lo operen. También ejecuta el **onboarding/kickoff** del proyecto: la primera vez que Software entra a un proyecto se sitúa con la skill `project-onboarding` (clasifica NUEVO/EXISTENTE, descubre o audita, y sintetiza) antes de cualquier diseño o código (ver Paso 0.6 del orquestador).

**Caso de uso:** decisión de stack para nuevo servicio.

**Prompt:**
> "Estamos arrancando el servicio de pedidos. Necesito un ADR para decidir entre PostgreSQL y MongoDB como persistencia principal. El equipo tiene experiencia fuerte con SQL pero el catálogo de productos es muy nested."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/adr/adr-004-pick-postgres-over-mongo.md`
- Estructura del ADR:
  ```markdown
  # ADR-004: Adoptar PostgreSQL como persistencia del servicio de pedidos

  - Estado: Accepted
  - Fecha: 2026-05-14
  - Decisores: Tech Lead, Eng Manager
  - Stack del proyecto: TypeScript · NestJS · Node 20

  ## Contexto
  El servicio de pedidos requiere transaccionalidad fuerte (ACID) entre order
  + line_items + inventory. El equipo tiene 5 años de SQL en producción.
  El catálogo de productos tiene atributos variables...

  ## Drivers de decisión
  - Transaccionalidad ACID multi-tabla (alto)
  - Familiaridad del equipo (alto)
  - Flexibilidad de schema para catálogo (medio)

  ## Opciones consideradas
  ### Opción A — PostgreSQL
  Ventajas: ACID, JSONB para schema variable, equipo experto...
  Desventajas: less ergonómico para nested deep...

  ### Opción B — MongoDB
  Ventajas: schema flexible nativo...
  Desventajas: transacciones distribuidas más frágiles...

  ## Decisión
  Se adopta PostgreSQL. JSONB cubre el caso de catálogo nested sin perder ACID.

  ## Consecuencias
  Positivas: reaprovechamos infra de DB existente...
  Riesgos: queries sobre JSONB requieren índices GIN si crecen...
  ```
- Resumen al usuario: número de ADR, decisión adoptada, riesgo principal, próximo paso (típicamente `software-coding` para implementar).

---

### `software-coding` — Implementation

Traduce specs (PRD/ADR/tech-spec/ticket) a código de producción con workflows estructurados. Agnóstico de stack — adopta lenguaje, patrones y estilo del proyecto.

**Caso de uso:** implementación de feature desde un PRD.

**Prompt:**
> "Implementa la feature de export a CSV del listado de pedidos según el PRD que está en `.context/orders-service/software/prd.md`. El stack es Node 20 + TypeScript + NestJS. Branch `feat/orders-csv-export`."

**Output esperado:**
- Archivos creados/modificados en el repo:
  - `src/orders/orders.controller.ts` — nuevo endpoint `GET /orders/export.csv`
  - `src/orders/orders.service.ts` — método `exportToCsv()`
  - `src/orders/csv/csv.formatter.ts` — formatter aislado, testeable
  - `test/orders/csv.formatter.spec.ts` — 8 casos (camino feliz + 7 bordes)
- Reporte: `<proyecto>/software/code/.reports/feature-orders-csv-export.md`
  ```markdown
  # Feature Implementation: Export CSV de pedidos

  ## Resumen funcional
  Los admins pueden descargar el listado filtrado de pedidos como CSV
  con todos los campos de la vista actual + line items expandidos.

  ## Cambios realizados
  | Path | Tipo | Resumen |
  | src/orders/orders.controller.ts | modified | +endpoint export.csv |
  | src/orders/csv/csv.formatter.ts | new | escapado RFC 4180 |

  ## Tests añadidos
  - csv.formatter.spec.ts — 8 casos incluyendo comas, comillas, newlines

  ## Criterios de aceptación
  | AC | Estado |
  | Admin descarga CSV con filtros aplicados | ✅ |
  | Caracteres especiales escapados RFC 4180 | ✅ |
  | Streaming para listados >10k filas | 🟡 (cubierto con cursor pagination) |

  ## Próximos pasos
  - software-code-review del PR
  - commit-message + pr-description
  ```

---

### `software-code-review` — Code Review

Lee código y produce un report estructurado con hallazgos por severidad (🔴/🟠/🟡/🔵), 8 ejes y veredicto explícito.

**Caso de uso:** review de PR antes de merge.

**Prompt:**
> "Hazme un review del PR #142 sobre `feat/orders-csv-export`. Profundidad: deep, incluyendo nits. Foco extra en seguridad ya que el endpoint es público con auth básico."

**Output esperado:**
- Ruta: `<proyecto>/software/reviews/review-pr-142-orders-csv-export.md`
- Estructura:
  ```markdown
  # Code Review: PR #142 — Export CSV de pedidos

  - Veredicto: 🟠 Mergear con cambios menores
  - Profundidad: Deep
  - Hallazgos: 0 🔴 · 2 🟠 · 5 🟡 · 3 🔵

  ## Top 3 a atender primero
  1. 🟠 [SEC] src/orders/orders.controller.ts:42 — filtros del query string
     llegan crudos a SQL builder. Verificar parametrización.
  2. 🟠 src/orders/csv/csv.formatter.ts:67 — `\r\n` literal no funciona en
     buffers UTF-8 si hay BOM. Sugerencia: usar Buffer.from explícito.
  3. 🟡 Cobertura de tests del controller en 60% — falta caso de filtro vacío.

  ## Hallazgos por severidad

  ### 🟠 MAJOR
  1. [SEC] orders.controller.ts:42 — ver Top 3 #1
  2. csv.formatter.ts:67 — ver Top 3 #2

  ### 🟡 MINOR
  1. orders.service.ts:113 — N+1 en line_items, falta JOIN o batch fetch...

  ## Lo positivo destacable
  - csv.formatter.ts está bien aislado y altamente testeable.
  - Tests cubren bordes del CSV (RFC 4180) con rigor.
  ```

---

### `software-qa` — QA & Testing

Decide qué se prueba, cómo y a qué nivel. Produce planes y casos, no código de tests (eso es `software-coding`).

**Caso de uso:** plan de tests para una feature nueva.

**Prompt:**
> "Diseña el test plan para el flujo OAuth con Google que vamos a implementar. Stack: Node 20 + NestJS + Passport. Cubrir unit + integration + e2e + un par de casos de seguridad."

**Output esperado:**
- Ruta: `<proyecto>/software/qa/plans/test-plan-oauth-google.md`
- Estructura:
  ```markdown
  # Test Plan: OAuth flow con Google

  ## Scope
  Cubre el flujo authorization code con PKCE: redirect → callback →
  exchange token → crear/asociar usuario → emitir JWT propio.

  ## Niveles y conteo
  | Nivel | Casos P0 | P1 | P2 | P3 |
  | Unit | 6 | 4 | 2 | 0 |
  | Integration | 4 | 2 | 1 | 0 |
  | E2E | 2 | 1 | 0 | 0 |
  | Security | 3 | 2 | 0 | 0 |

  ## Casos de test

  ### Unit P0
  - [U-001] callback handler con code válido devuelve JWT con claims correctos
  - [U-002] callback handler con state mismatch lanza UnauthorizedException
  - [U-003] PKCE verifier mismatch lanza UnauthorizedException
  - ...

  ### Integration P0
  - [I-001] flujo completo con Google mockeado → usuario nuevo creado en DB
  - [I-002] flujo completo con usuario existente → match por email

  ### Security P0
  - [S-001] CSRF: callback sin state cookie es rechazado
  - [S-002] Open redirect: `redirect_uri` fuera de allowlist es rechazado
  - [S-003] Code replay: mismo authorization code dos veces falla

  ## Criterios de salida
  - 100% casos P0 + P1 pasan
  - Cobertura del módulo auth ≥ 85%
  - Sin vulnerabilidades de Snyk/npm audit medium+

  ## Riesgos
  - [R-001] DATA PENDIENTE — credenciales OAuth de testing en Google Cloud
  - [R-002] ENTORNO PENDIENTE — passport-google-oauth20 mock estable
  ```

---

## Skills propias del dept

### `project-onboarding` — Clasificación y kickoff del proyecto

Guion canónico de arranque que ejecuta `software-architecture`. **Paso 0** clasifica el proyecto NUEVO (greenfield) vs EXISTENTE (brownfield); de ahí bifurca a **Rama A** (descubrir y definir: contexto de negocio, alcance, no-funcionales, stack→ADR, tooling) o **Rama B** (revisar y diagnosticar observando antes de concluir, citando `archivo:línea`); ambas convergen en una síntesis común (veredicto, decisiones, plan de 3-5 pasos, preguntas abiertas). Es la **única fuente de verdad del criterio**: el agente deriva su prompt de aquí, no lo hardcodea.

**Caso de uso:** primera vez que Software entra a un repo existente.

**Prompt:**
> "Acabamos de heredar este repo, ponme en contexto antes de tocar nada."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/project-onboarding.md`
- Clasificación (Paso 0): 🏗️ EXISTENTE — señales: manifiesto sí, código sí, historia git real, sin `.context` previo.
- Ficha técnica (stack, build/test, calidad, config/secretos, git) + arquitectura en una frase.
- Hallazgos priorizados 🔴🟡🟢 (ej. 🔴 secreto en `config/prod.yaml:12` enmascarado; 🟡 sin CI en el repo pese al badge del README) + madurez **2/5**.
- Síntesis: diagnóstico en una frase, decisiones (ahora vs ADR), plan de 3-5 pasos, preguntas abiertas.
- Decisiones y clasificación persistidas en `decisions[]` del config; PRD/ADR de arranque si es greenfield.

> Para un proyecto **nuevo** el mismo prompt-base lleva la Rama A: en vez de auditar, pregunta A1–A8 (una incógnita a la vez) y produce PRD inicial + ADR(s) de stack + scaffolding propuesto. Variante *quick scan* para re-situar un proyecto ya conocido cuando el contexto diverge del disco.

---

### `adr` — Architecture Decision Record

ADR numerado y fechado con contexto, opciones, decisión y consecuencias. Skill canónica de `software-architecture`.

**Caso de uso:** comparar dos approaches de cacheo.

**Prompt:**
> "Necesito un ADR para decidir entre Redis y Memcached como cache de sesiones del API gateway. Tráfico esperado 5k req/s, TTL 30 min."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/adr/adr-007-pick-redis-over-memcached.md`
- Cabecera + 3 opciones (Redis, Memcached, no-cache) con ventajas/desventajas/coste/reversibilidad cada una.
- Decisión: Redis. Justificación: necesitamos persistencia opcional + estructuras de datos (Sorted Sets para rate limiting futuro).
- Consecuencias: + estructuras avanzadas / − un poco más de memoria / Riesgo: failover requiere Sentinel o Cluster.
- Métricas de éxito: p99 de get < 1ms, hit rate > 95% en 30 días.

---

### `code-review-checklist` — Plantilla canónica de code review

Template que sigue `software-code-review`. Veredicto + Top 3 + hallazgos por severidad + análisis por 8 ejes (corrección, seguridad, tests, legibilidad, idiomatic, performance, mantenibilidad, alineamiento con arquitectura).

**Caso de uso:** review de un fix de seguridad.

**Prompt:**
> "Aplica `code-review-checklist` al PR #199 — fix de SQL injection en search endpoint. Profundidad: security-focused."

**Output esperado:**
- Ruta: `<proyecto>/software/reviews/review-pr-199-fix-sqli-search.md`
- Veredicto: 🔴 requiere cambios bloqueantes (1 hallazgo BLOCKER).
- Análisis por 8 ejes con foco extra en seguridad (OWASP A03 Injection).
- Top 3:
  1. 🔴 [SEC] el fix usa string replace en lugar de prepared statement → no resuelve el problema.
  2. 🟠 No hay test de regresión que confirme que el payload original ya no inyecta.
  3. 🟡 Mensaje de error filtra el query a logs.
- Lo positivo: el reporter del bug está mencionado en el body del commit.

---

### `test-plan` — Plan de test por niveles

Plan estructurado (unit/integration/e2e/perf/security) con casos priorizados P0-P3, criterios de salida y riesgos. Skill canónica de `software-qa`.

**Caso de uso:** plan de regresión antes de release.

**Prompt:**
> "Plan de tests de regresión para el release 2.0 del módulo de checkout. Hubo cambios sustanciales en payment provider — quiero asegurarme de no romper nada."

**Output esperado:**
- Ruta: `<proyecto>/software/qa/plans/test-plan-regression-checkout-v2.md`
- Scope: checkout end-to-end con foco en cambio de provider.
- Niveles: unit (32 P0/P1), integration (12), e2e (8), payment-specific (5).
- Casos críticos: 3D Secure flow, retry tras fallo, refund, partial refund, currency conversion.
- Criterios de salida: 100% P0+P1 pasan, smoke test en staging con 50 transacciones reales.
- Riesgos: sandbox del nuevo provider rate-limita a 10 req/min → plan de mitigación con replay de fixtures.

---

### `runbook` — Runbook operacional

Procedimientos para operar un servicio en producción: deploy, monitoring, alertas, playbooks por incidente, escalado, dependencias.

**Caso de uso:** runbook para nuevo servicio.

**Prompt:**
> "Genera el runbook del nuevo servicio `notifications-api` que entra en producción la semana que viene. Stack: Go 1.22, k8s, Redis, RabbitMQ. Owner: payments team."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/runbook-notifications-api.md`
- Estructura:
  ```markdown
  # Runbook: notifications-api

  ## Visión general
  Servicio Go que consume eventos de RabbitMQ y envía push/email/SMS.

  ## Deploy
  - Imagen: ghcr.io/org/notifications-api:vX.Y.Z
  - Comando: helm upgrade notifications ./charts/notifications -f values-prod.yaml
  - Smoke test: GET /health debe devolver 200 en <1s

  ## Monitoring
  - Dashboard Grafana: [link]
  - SLO: 99.5% éxito de envío, p99 < 500ms

  ## Alertas y playbooks
  ### Alert: queue depth > 10k
  1. Comprobar consumer lag en RabbitMQ Management
  2. Si lag crece → escalar replicas: kubectl scale deploy/notifications --replicas=N
  3. Si lag estanca → ver logs del consumer por circuit breaker open

  ### Alert: send_failure_rate > 5%
  1. Identificar provider afectado (Twilio/SES/FCM) por label
  2. Verificar status page del provider
  3. Si provider down → activar fallback con feature flag `force-fallback-X`
  4. Postmortem si > 30 min

  ## Escalado
  - Vertical: requests CPU 200m/limit 500m, mem 128Mi/256Mi
  - Horizontal: HPA al 70% CPU, min 3 max 20

  ## Dependencias
  - Redis (rate limiting): si down → graceful degradation, no se cae
  - RabbitMQ: si down → servicio NO funcional, alerta P1
  - Providers externos: Twilio, SES, FCM (estado: status pages linkadas)

  ## On-call
  - Primary: payments team rotation
  - Escalation: tech lead → CTO
  ```

---

### `api-spec` — Especificación de API

Endpoints con método/path/auth, schemas, errores, pagination, versioning, deprecation.

**Caso de uso:** API spec antes de implementar.

**Prompt:**
> "Especifica la API de gestión de webhooks: registro, listado, edición, borrado, test endpoint, ver eventos disparados. REST + Bearer auth."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/api-spec-webhooks.md`
- Bloque con resumen + auth + versioning:
  ```markdown
  # API Spec: Webhooks v1

  Base URL: https://api.example.com/v1
  Auth: Bearer token (scope `webhooks:read` o `webhooks:write`)

  ## Endpoints

  ### POST /webhooks
  Crea un webhook nuevo.
  Body: { "url": string, "events": string[], "secret": string }
  Returns: 201 + { "id": string, "url": ..., "created_at": ISO8601 }
  Errors:
  - 400 invalid_url — URL no es https o no resuelve
  - 409 duplicate — ya existe webhook con esa url+events
  - 422 too_many_events — máximo 50 events por webhook

  ### GET /webhooks
  Lista webhooks del tenant (paginado cursor-based).
  Query: ?limit=50&cursor=<opaque>
  Returns: 200 + { "data": [...], "next_cursor": string|null }

  ### POST /webhooks/{id}/test
  Dispara un evento de prueba al endpoint configurado.
  Returns: 200 + { "delivery_id": string, "response_status": int, "response_ms": int }

  ## Pagination
  Cursor-based. El cursor es opaco, no derivar nada de él.

  ## Versioning
  - v1 → URL path
  - Breaking changes → nueva versión (v2)
  - Deprecation: header `Sunset: <date>` 6 meses antes
  ```

---

### `tech-spec` — Spec técnica entre PRD/ADR e implementación

Data model, API changes, edge cases, performance, security, testing strategy, rollout plan.

**Caso de uso:** tech spec para feature mediana.

**Prompt:**
> "Tech spec del flujo de invitaciones a equipo: invitar por email, aceptar link, expiración 7 días. PRD ya está en `prd.md`."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/tech-spec-team-invitations.md`
- Secciones: contexto desde PRD, data model (tabla `invitations` con campos exactos), API changes (3 endpoints nuevos con request/response), state machine (`pending` → `accepted` | `expired` | `revoked`), edge cases (email ya en equipo, link reutilizado, invitación a email existente), performance (límite 100 invitaciones por equipo / 24h), security (token aleatorio 32 bytes, expiración server-side, sin enumeración de tokens válidos), testing strategy, rollout plan con feature flag, métricas de éxito (% aceptación, time-to-accept).

---

### `bug-report` — Bug report estructurado

Reproducción, expected vs actual, severidad, scope, entorno, regresión status, evidencia.

**Caso de uso:** documentar bug encontrado por soporte.

**Prompt:**
> "El usuario `acme-corp` reporta que al hacer logout vuelve a estar logueado tras un F5. Estructúrame esto como bug report."

**Output esperado:**
- Ruta: `<proyecto>/software/qa/bugs/bug-logout-persists-after-refresh.md`
- Estructura:
  ```markdown
  # Bug: Logout no persiste tras refresh

  - Severidad: Major (sesión-bug, afecta a privacidad esperada)
  - Scope: Web app, todos los browsers
  - Estado: New
  - Reporter: acme-corp via soporte ticket #4422
  - Reportado: 2026-05-13

  ## Reproducción
  1. Login con credenciales válidas en https://app.example.com
  2. Click en "Cerrar sesión" en el menú superior derecho
  3. Verificar que se redirige a /login
  4. Pulsar F5

  Expected: sigues en /login con form vacío
  Actual: redirige a /dashboard logueado

  ## Entorno
  - Browser: Chrome 124, Firefox 125, Safari 17 (reproducible en los 3)
  - OS: macOS 14, Windows 11
  - Backend: producción, commit 8a2b1c
  - Reproducible localmente: SÍ

  ## Hipótesis
  Cookie de sesión no se borra; solo se limpia localStorage en el logout handler.

  ## Regresión
  Sí — funcionaba en v1.8.2, dejó de funcionar en v1.9.0 (ver git blame de `logout.ts`).

  ## Evidencia
  - DevTools cookies screenshot: [adjunto]
  - HAR de la secuencia logout + F5: [adjunto]
  ```

---

### `spec-review` — Review y scoring de specs

Rubric de 6 dimensiones (Completeness, Clarity, Testability, Consistency, Risk awareness, Actionability), score 0-30, hallazgos por severidad, veredicto ✅/🟠/🔴.

**Caso de uso:** gate antes de implementar un PRD.

**Prompt:**
> "Hazme un spec-review del PRD de la feature de import CSV que está en `.context/orders/software/prd.md`. Quiero saber si está listo para pasar a `software-coding`."

**Output esperado:**
- Ruta: `<proyecto>/software/reviews/spec-review-prd-import-csv.md`
- Veredicto: 🟠 Aprobado con cambios menores.
- Scoring:
  ```
  Completeness    4/5  Falta sección de límites de tamaño/timeout
  Clarity         5/5
  Testability     3/5  AC "el import es rápido" no es verificable
  Consistency     4/5  Tensión con ADR-003 sobre uploads (no bloqueante)
  Risk awareness  3/5  Sin mención de fallos parciales
  Actionability   4/5
  TOTAL          23/30 🟡 Bueno con ajustes
  ```
- Top 3:
  1. 🟠 Definir límite explícito de tamaño (MB) y nº filas + comportamiento on-exceed.
  2. 🟠 Reformular AC "rápido" como "p95 < 30s para 10k filas".
  3. 🟡 Añadir comportamiento para fallos parciales (rollback completo vs commit hasta N).
- Lo positivo: la sección de user flow está excelente, con casos felices y bordes.

---

### `commit-message` — Mensaje de commit Conventional Commits

Subject + body + footer (BREAKING CHANGE, Refs, Closes, Co-authored-by). A partir del diff staged.

**Caso de uso:** preparar commit antes de push.

**Prompt:**
> "Genera el commit message para el diff staged actual. Conventional Commits. El cambio es: añadí endpoint `POST /webhooks/{id}/test` que dispara un evento de prueba. Closes #234."

**Output esperado:**
- Bloque listo para pegar:
  ```
  feat(webhooks): add test endpoint to trigger sample event

  POST /webhooks/{id}/test fires the configured webhook with a synthetic
  payload and returns delivery metadata (status, latency_ms, delivery_id).

  Useful for users to verify their endpoint and auth secret before
  going live without waiting for a real event.

  Closes: #234
  ```
- Notas en el chat: convención Conventional Commits aplicada · sin breaking change detectado · atomicidad OK (un solo cambio lógico).

---

### `pr-description` — Descripción de Pull Request

Cruza spec + diff + commits. Problema, cambio, testing, impacto, checklist.

**Caso de uso:** PR description antes de pedir review.

**Prompt:**
> "Descripción del PR para `feat/webhooks-test-endpoint`. El spec está en `tech-spec-webhooks.md`. 4 commits en el branch."

**Output esperado:**
- Bloque markdown para pegar:
  ```markdown
  ## Qué cambia
  Añade endpoint `POST /webhooks/{id}/test` que dispara un evento de
  prueba contra el endpoint configurado del webhook y devuelve metadata
  de la entrega.

  ## Por qué
  Los usuarios reportan que descubren bugs en su endpoint (auth, parsing,
  SSL) solo cuando llega un evento real en producción. Este endpoint
  permite validar antes de "ir en serio".

  Referencias:
  - Spec: <proyecto>/software/architecture/tech-spec-webhooks.md §4.2
  - Closes: #234

  ## Cómo
  - Nuevo handler en webhooks.controller.ts
  - Service compone payload sintético con `event_type: "test.event"`
  - Reusa el delivery pipeline existente (sin código nuevo de retry/auth)

  ## Cambios principales
  | Archivo | Cambio |
  | webhooks.controller.ts | + endpoint /test |
  | webhooks.service.ts | + testWebhook() |
  | webhooks.test.fixtures.ts | nuevo, payload sintético |
  | test/webhooks.test.spec.ts | 5 casos de test |

  ## Testing
  Tests añadidos:
  - test endpoint con webhook existente devuelve delivery metadata
  - test endpoint con webhook inexistente devuelve 404
  - test endpoint propaga 5xx del destino sin re-tries (es test)

  Manual:
  - probado contra webhook a `https://webhook.site/xxx`
  - probado contra endpoint inexistente (DNS no resuelve)

  ## Impacto
  Breaking changes: No
  Áreas afectadas: módulo webhooks
  Rollback: revertir PR, no hay migration

  ## Checklist
  - [ ] Lint pasa
  - [ ] Tests nuevos cubren camino feliz + 2 bordes
  - [ ] OpenAPI spec actualizada
  - [ ] Sin breaking changes
  ```

---

### `changelog-entry` — Entrada Keep a Changelog

Categorías Added/Changed/Deprecated/Removed/Fixed/Security + BREAKING marcados.

**Caso de uso:** entrada de release.

**Prompt:**
> "Entrada de CHANGELOG para v2.4.0 que se publica hoy. PRs merged desde v2.3.0: #234 (test endpoint webhooks), #237 (fix logout cookie), #240 (deprecate /events/legacy endpoint), #242 (CVE-2026-1234 patch SSRF)."

**Output esperado:**
- Edit en `CHANGELOG.md` del repo, sección encima de `[2.3.0]`:
  ```markdown
  ## [2.4.0] — 2026-05-14

  ### Added
  - Webhooks: nuevo endpoint `POST /webhooks/{id}/test` para validar el endpoint
    configurado disparando un evento sintético (#234).

  ### Fixed
  - Auth: el logout ahora invalida también la cookie de sesión, evitando que un
    F5 tras logout vuelva a loguear al usuario (#237).

  ### Deprecated
  - `GET /events/legacy` queda deprecado y se eliminará en v3.0. Usar
    `GET /events` (mismo response, mejores filtros) (#240).

  ### Security
  - Parche para SSRF en `POST /imports/from-url` (CVE-2026-1234, severity High).
    Recomendado actualizar inmediatamente (#242).
  ```
- Links de comparación al final actualizados:
  ```markdown
  [Unreleased]: .../compare/v2.4.0...HEAD
  [2.4.0]: .../compare/v2.3.0...v2.4.0
  ```

---

### `feature-implementation` — Workflow para implementar una feature

Pre-flight (spec + plan + tests previstos) → ejecución → reporte estructurado.

**Caso de uso:** feature mediana desde tech-spec.

**Prompt:**
> "Implementa la feature de invitaciones a equipo según `tech-spec-team-invitations.md`. Workflow estricto: pre-flight antes de tocar código."

**Output esperado:**
- Pre-flight: reporte inicial con plan de archivos, dependencias (ninguna nueva), tests previstos (12 casos: 6 unit + 4 integration + 2 e2e), riesgos identificados (race condition en aceptación concurrente).
- Confirmación del plan al usuario.
- Ejecución: archivos creados (`invitation.entity.ts`, `invitations.service.ts`, `invitations.controller.ts`, migration SQL, tests).
- Reporte post-flight: `<proyecto>/software/code/.reports/feature-team-invitations.md` con archivos tocados, tests añadidos, AC cubiertos (3 ✅ + 1 🟡), TODOs (`// TODO(@me, #245): admin UI para revocar manual`), decisiones tomadas (UUID v7 para el token, sortable por tiempo), próximo paso (`commit-message` + `pr-description` + `software-code-review`).

---

### `bugfix-workflow` — Workflow para arreglar un bug

Reproduce → diagnose → fix → regression test → comunicación.

**Caso de uso:** fix de bug reportado por soporte.

**Prompt:**
> "Aplica `bugfix-workflow` al bug del logout que no persiste tras F5 (bug-report en `qa/bugs/bug-logout-persists-after-refresh.md`). Branch `fix/logout-cookie-cleanup`."

**Output esperado:**
- Reporte en `<proyecto>/software/code/.reports/fix-logout-cookie-cleanup.md`:
  ```markdown
  # Bugfix: Logout no persiste tras refresh

  ## 1. Reproduce
  Reproducible local (3 navegadores). Pasos del bug-report confirmados.

  ## 2. Diagnose
  Root cause: `logout()` solo limpia localStorage. La cookie `session_token`
  permanece en el navegador con `HttpOnly` y se reenvía en el F5.
  El backend, al ver cookie válida, regenera la sesión.

  Causa secundaria: no había test e2e cubriendo "logout + reload".

  ## 3. Fix
  Approach: añadir endpoint `POST /auth/logout` que setea
  `Set-Cookie: session_token=; Max-Age=0; HttpOnly`. El frontend lo invoca
  antes de limpiar localStorage.

  Archivos tocados:
  - src/auth/auth.controller.ts → +POST /logout
  - src/auth/auth.service.ts → invalidateSession()
  - web/src/auth/logout.ts → fetch al endpoint antes de limpiar local

  ## 4. Regression test
  - test/auth/logout.e2e.spec.ts — caso "logout + reload no recupera sesión"
  - Confirmado: falla en main, pasa con el fix.

  ## 5. Comunicación
  Mensaje para soporte:
  > "El bug está arreglado y será publicado en v2.4.0. La sesión ahora se
  > invalida en backend y la cookie se borra correctamente."

  Changelog: sí, sección Fixed.
  Postmortem: no requerido (Major, no Critical).
  ```

---

### `refactor-plan` — Plan de refactor antes de tocar código

Motivación, scope IN/OUT, approach, safety nets, validación, rollback.

**Caso de uso:** extraer módulo grande en sub-módulos.

**Prompt:**
> "Quiero refactorizar el módulo `payments/` que ya tiene 23 archivos en una sola carpeta y todo el mundo tiene miedo de tocarlo. Plan primero."

**Output esperado:**
- Ruta: `<proyecto>/software/code/.reports/refactor-payments-modularization.md`
- Estado inicial: Planned.
- Plan:
  ```markdown
  ## 1. Motivación
  Deuda concreta: módulo payments con 23 archivos sin sub-estructura.
  Cambiar el flujo de refund obliga a tocar 5 archivos no relacionados...

  ## 2. Scope
  IN: src/payments/* (mover a 5 subcarpetas: providers/, refunds/, charges/, webhooks/, common/)
  OUT: API pública de payments. Tests pueden adaptarse pero no rediseñarse.

  ## 3. Approach
  Branch by abstraction: introducir las nuevas carpetas, mover archivos
  uno a uno con re-exports temporales en los paths viejos.
  Después un PR final que elimina los re-exports.

  ## 4. Safety nets
  Tests existentes cubren camino feliz + refund en ~80%.
  Añadir characterization tests para 2 paths críticos antes de mover:
  - charge → success → webhook
  - charge → 3DS → success
  Monitoring: error_rate de payments durante 48h post-merge.

  ## 5. Rollback
  Punto sin retorno: cuando se eliminen los re-exports viejos.
  Antes: revertir es git revert simple.
  Después: revertir requiere PR inverso.

  ## 6. Riesgos
  | Riesgo | Prob | Impacto | Mitigación |
  | Importaciones rotas | media | medio | re-exports + CI typecheck obligatorio |
  | Tests frágiles que asumen paths | alta | bajo | adaptar antes de mover |
  ```

---

### `dependency-bump` — Workflow para subir dependencia

Assessment del changelog, plan de migración, validación, rollback.

**Caso de uso:** subir un major framework.

**Prompt:**
> "Hay que subir NestJS de 9.x a 10.x. Aplica dependency-bump."

**Output esperado:**
- Ruta: `<proyecto>/software/code/.reports/dep-bump-nestjs-9.x-to-10.x.md`
- Assessment:
  ```markdown
  ## 1.1 Changelog upstream
  Versiones que se saltan: 9.3, 9.4, 10.0-rc, 10.0
  Breaking changes:
  - Node 16 ya no soportado (mínimo Node 18). El repo está en Node 20 ✓
  - @nestjs/core: ApplicationConfig API cambió (mover de `app.get(ApplicationConfig)` a constructor injection)
  - @nestjs/passport: requiere 10.x simultáneamente, suben transitivamente passport@0.7

  ## 1.2 Blast radius
  Paths que usan APIs afectadas:
  - src/main.ts: usa ApplicationConfig → migrar
  - src/auth/*: dependencias de passport → tocar
  - 12 módulos más sin cambios

  ## 1.3 Riesgo
  Madurez: estable (10.3 LTS)
  Adopción comunidad: alta
  Reversibilidad: trivial (lockfile)
  Riesgo global: 🟡 medio
  ```
- Plan de migración detallado paso a paso.
- Tras ejecutar: sección Resultado con diff stats (47 archivos, +210/-180 líneas), sorpresas (passport requirió ajustar 2 strategies no esperadas), próximos pasos (`commit-message` + `pr-description` + `changelog-entry` con BREAKING).

---

### `readme` — README.md del proyecto

Puerta corta del proyecto: qué resuelve, quick start, uso, configuración. Vive en raíz del repo.

**Caso de uso:** README de proyecto greenfield.

**Prompt:**
> "Genera el README.md inicial para `notifications-api`. Es un servicio Go que consume eventos de RabbitMQ y envía push/email/SMS. Audiencia: devs internos."

**Output esperado:**
- Ruta: `<repo>/README.md` (raíz del repo, no dentro de `.aigent/`)
- Contenido:
  ```markdown
  # notifications-api

  Servicio Go que consume eventos de RabbitMQ y dispara notificaciones
  push, email y SMS a través de proveedores externos (FCM, SES, Twilio).

  ## Qué resuelve
  Centraliza el envío de notificaciones para que los servicios productores
  solo emitan eventos, sin conocer cada provider...

  ## Quick start
  ### Requisitos
  - Go 1.22+
  - Docker 20+ (para deps locales)

  ### Instalación
  ```bash
  git clone <repo> && cd notifications-api
  cp .env.example .env
  docker compose up -d  # arranca rabbitmq + redis
  go run ./cmd/server
  ```

  ## Configuración
  | Variable | Default | Para qué |
  | RABBIT_URL | amqp://localhost:5672 | broker de eventos |
  | FCM_KEY | — | clave de Firebase Cloud Messaging |
  ...

  ## Tests
  go test ./... · go test -tags=integration ./...

  ## Documentación adicional
  - Dev guide: docs/dev-guide.md
  - Runbook: docs/runbook.md
  - ADRs: docs/adr/
  ```

---

### `code-docs-style` — Guía canónica de docs inline

Qué se comenta, docstrings por lenguaje, política TODO/FIXME.

**Caso de uso:** primera guía formal del proyecto.

**Prompt:**
> "Necesitamos guía de docs inline para `orders-service`. Es TypeScript estricto, sin generador de docs por ahora. Equipo de 6 devs."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/code-docs-style.md`
- Secciones:
  ```markdown
  ## Principios
  1. Documentar el "por qué", no el "qué"...
  ...

  ## Reglas por lenguaje
  ### TypeScript
  Formato: TSDoc (subset de JSDoc).
  Tags admitidos: @param (solo si añade contexto, no para tipo), @returns,
  @throws, @example, @deprecated, @see.

  Ejemplo canónico:
  ```ts
  /**
   * Resuelve el provider de notificación efectivo según preferencias del
   * destinatario y disponibilidad operativa del provider.
   *
   * Orden de prioridad: preferencia explícita → preferencia inferida del
   * historial → default por tipo de notificación.
   *
   * @throws {NoProviderAvailableError} Si todos los providers están en
   *   circuit-breaker open simultáneamente.
   */
  ```

  ## Convenciones transversales
  ### Idioma: inglés en docstrings, español en discussion comments.
  ### TODO: formato `// TODO(@author, #ticket): descripción`. Sin ticket → bloquea en review.
  ### FIXME: reservado para bugs conocidos no parcheables ahora.

  ## Enforcement
  - Review: comentario con link a esta sección si no se cumple.
  - Linter: eslint-plugin-jsdoc configurado en .eslintrc con reglas mínimas.
  ```

---

### `dev-guide` — Guía de desarrollo del proyecto

Setup, estructura, common tasks, troubleshooting, workflow.

**Caso de uso:** guía para nuevos joiners.

**Prompt:**
> "Necesito una dev guide para `orders-service`. Equipo creció a 8 y el README ya no es suficiente. Stack Node + TS + NestJS + Postgres + Redis. Monorepo con frontend Next.js."

**Output esperado:**
- Ruta: `<proyecto>/docs/dev-guide.md`
- Secciones detalladas:
  - Visión rápida del stack (tabla).
  - Setup paso a paso con comandos verificados contra el repo.
  - Estructura del repo con explicación de cada carpeta.
  - Tests por nivel con tiempos reales.
  - Workflow: branching `feat/`, `fix/`, Conventional Commits, squash on merge, 1 approval mínimo.
  - **Common tasks** ricos: "¿cómo añado un endpoint?" (5 pasos), "¿cómo añado una migration?" (4 pasos), "¿cómo debuggeo con VSCode?" (config en `.vscode/launch.json`).
  - Troubleshooting: síntomas típicos del setup (`docker compose up` falla por puerto 5432, `pnpm install` falla en M1 por arquitectura, …).
  - Recursos adicionales: ADRs, runbook, API spec, design system, canal Slack.

---

### `migration-guide` — Guía pública de migración entre versiones

Breaking changes con antes/después, codemods, plan paso a paso, validación, rollback. Audiencia: consumidores.

**Caso de uso:** migración major de librería pública.

**Prompt:**
> "Estamos publicando `@org/api-client` 2.0. Hay 4 breaking changes. Genera la migration guide para los consumidores."

**Output esperado:**
- Ruta: `<repo>/docs/migrations/migration-1.x-to-2.0.md`
- Contenido:
  ```markdown
  # Migration Guide: 1.x → 2.0

  - Fecha release 2.0: 2026-05-14
  - Soporte de 1.x: hasta 2026-11-14 (6 meses, solo security)
  - Dificultad estimada: 🟡 moderada
  - Tiempo: ~2-4h para un proyecto típico

  ## TL;DR
  4 breaking changes. Hay codemod para 3 de ellos. El 4º (renombrado de
  `Client.fetch()` → `Client.request()`) requiere ajuste manual.

  ## Mapa de cambios
  | Categoría | Qué cambia | Acción |
  | Renamed | `Client.fetch()` → `Client.request()` | codemod manual |
  | Removed | `Client.legacy()` (deprecated en 1.4) | eliminar uso |
  | Signature change | `Client.list(opts)` → `Client.list(filters, paging)` | adaptar llamadas |
  | Default change | `timeout` default 30s → 10s | revisar dependencias |

  ## 1. Renamed: `Client.fetch()` → `Client.request()`
  Antes (1.x):
  ```ts
  const data = await client.fetch('/users');
  ```
  Después (2.0):
  ```ts
  const data = await client.request('/users');
  ```
  Codemod: `npx @org/api-client-codemod rename-fetch`

  ...

  ## Plan paso a paso
  1. Backup / branch
  2. Bump: `npm install @org/api-client@2.0`
  3. Ejecuta codemod
  4. Typecheck
  5. Adapta cambios manuales
  6. Tests
  ```

---

## Skill compartida usada en este dept

### `shared-deploy-checklist` (en `_shared/skills/`)

Checklist pre/durante/post-deploy adaptado a riesgo y estrategia.

**Caso de uso:** preparar checklist de release.

**Prompt:**
> "Genera el deploy-checklist para el release v2.4.0 de `orders-service`. Estrategia canary 5% → 25% → 100%. Hay una migration de schema (añadir columna nullable, reversible)."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/deploy-checklist-v2.4.0.md`
- Cabecera: estrategia canary, riesgo 🟡 medio, owner del deploy + backup, aprobador, spec de referencia (release plan).
- Pre-deploy: 24 checkboxes en 7 sub-secciones (código, docs, env, schema, flags, comms, personas).
- Durante: 6 pasos numerados con timestamps reales + smoke tests por cada fase canary.
- Post-deploy: ventana de observación 24h, métricas con umbrales (error rate < 0.5%, p99 < 800ms), confirmaciones funcionales.
- Rollback: punto sin retorno = retirada del flag de canary; antes trivial vía revertir release; después requiere hotfix + revert de migration (es reversible por diseño).
- Cierre: anuncio en `#deploys`, postmortem solo si incidente.

---

## Flujo end-to-end típico

Para una feature de tamaño medio, los agentes y skills se encadenan así:

```
0. software-architecture         → onboarding/kickoff (primera vez en el proyecto)
   └─ skill: project-onboarding  → clasifica NUEVO/EXISTENTE + síntesis (gate de entrada, Paso 0.6)
1. shared-prd-agent              → captura requisitos / PRD inicial
2. software-architecture         → tech-spec o ADR si hay decisión técnica
   └─ skill: spec-review         → gate antes de implementar
3. software-coding               → implementación
   ├─ skill: feature-implementation → workflow con pre-flight + reporte
   ├─ skill: commit-message      → mensaje del commit
   └─ skill: pr-description      → descripción del PR
4. software-code-review          → review estructurado
   └─ skill: code-review-checklist
5. software-qa                   → plan de test si quedaron gaps
   └─ skill: test-plan
6. software-coding               → cierre del release
   └─ skill: changelog-entry
7. software-architecture         → preparación operativa
   └─ skill: deploy-checklist (shared)
```

Para un bug se simplifica:

```
software-coding → bugfix-workflow → commit-message → pr-description
                                  → (changelog-entry si va en release)
```
