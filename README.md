# aigent-company

**Sistema de departamentos agénticos** para automatizar áreas de la empresa con Claude (y otros LLMs vía MCP). Plataforma principal: Claude Code / Cowork. Secundaria: OpenCode.

Cada departamento (marketing, sales, software, …) tiene su propio **orquestador**, **agentes especialistas** y **skills reutilizables**. El usuario habla con un único punto de entrada (`BOSS`) y el sistema enruta la petición al especialista adecuado, coordina varios cuando hace falta, y guarda los entregables como archivos reales fuera del motor.

## Qué resuelve

- **Departamentos completos sin contratar al departamento.** Cada equipo agéntico cubre el rol esencial de su disciplina con disciplina operativa real (rúbricas, frameworks, checklists, plantillas).
- **Independientes pero coordinados.** Instalas solo los departamentos que necesitas; las skills compartidas (`_shared/`) se cargan siempre — si después añades otro dept, ya está integrado.
- **Outputs auditables.** Cada agente produce archivos (`.md`, `.html`, `.xlsx`, …) en la carpeta del proyecto, no respuestas en chat. Lo que se genera se versiona, se comparte, se itera.
- **Una sola fuente de verdad por skill.** Las skills v1 (prosa para LLM) y v2 (ejecutables contra APIs HTTP) viven en un único `SKILL.md`. El instalador las distribuye al IDE que tengas configurado.

## Estado actual

| Departamento | Estado | Agentes | Skills |
|---|---|---|---|
| Marketing | ✅ implementado | 5 | 13 |
| Sales | ✅ implementado | 4 | 11 |
| Software | ✅ implementado | 4 | 19 |
| HR | ✅ implementado | 4 | 7 |
| Product | ✅ implementado | 3 | 6 |
| Finance | ✅ implementado | 3 | 7 |
| Legal | ✅ implementado | 4 | 6 |
| Design | ✅ implementado | 4 | 6 |
| Operations | 🚧 parcial | — | 1 (`redmine` v2 ejecutable) |
| DevOps | 🚧 TODO | — | — |
| `_shared/` (transversal) | ✅ activo | 2 (PRD + skill-builder) | 10 (2 meta + 8 business compartidas) |

**Total:** 33 agentes activos + 85 skills (75 dept-específicas + 8 business compartidas + 2 meta).

Inventario completo con descripción de cada agente y cada skill: [`.aigent/README.md`](./.aigent/README.md) (sección "Catálogo rápido — una frase por agente y skill").

## Agentes — qué hace cada uno (una frase)

**Orquestadores (8)** — punto de entrada único de cada departamento, deciden a qué especialista delegar:

`marketing-orchestrator` · `sales-orchestrator` · `software-orchestrator` · `hr-orchestrator` · `product-orchestrator` · `finance-orchestrator` · `legal-orchestrator` · `design-orchestrator`

**Transversales (2)** — sirven a cualquier departamento:

| Agente | Para qué |
|---|---|
| `shared-prd-agent` | Captura de requisitos y redacción de PRDs estructurados |
| `shared-skill-builder` | Crear, auditar y configurar skills v1 prosa o v2 ejecutables |

**Especialistas (35)** — agrupados por departamento:

| Agente | Para qué |
|---|---|
| `marketing-content` | Posts, emails, copy publicitario, newsletters, comunicados |
| `marketing-strategy` | Planes de marketing, briefings de campaña, análisis competitivo, posicionamiento |
| `marketing-seo` | Keyword research, SEO on-page, auditoría técnica, Analytics/Search Console |
| `marketing-social` | Contenido por red social (LinkedIn, Instagram, X, TikTok), calendarios editoriales |
| `marketing-web` | Landing pages, contenido WordPress, arquitectura de información, CRO |
| `sales-sdr` | Listas de prospectos, secuencias de outreach personalizado, cualificación BANT/MEDDIC |
| `sales-ae` | Propuestas comerciales, discovery calls, renewal management, cierre de deals |
| `sales-enablement` | Pitch decks, playbooks, battle cards, guías de objeciones, case studies |
| `sales-crm` | Pipeline reviews operativos, forecasts formales, KPI dashboards |
| `software-architecture` | Diseño de sistemas, ADRs, runbooks, API specs, tech specs |
| `software-coding` | Implementación de features, fixes, refactors y migraciones |
| `software-code-review` | Reviews estructurados de PRs con severidades y 8 ejes |
| `software-qa` | Estrategia de testing, planes por nivel, casos, bug reports |
| `hr-recruitment` | JDs, interview kits, scorecards, ofertas, bandas salariales |
| `hr-onboarding` | Planes 30/60/90 días, day-1 checklists, evaluación de período de prueba |
| `hr-evaluation` | 1:1s, performance reviews, OKRs personales, PIPs, eNPS, exit interviews |
| `hr-policies` | Handbook del empleado y políticas individuales (remoto, vacaciones, conducta) |
| `product-discovery` | User research, JTBD, journey maps, validación de problema antes de roadmap |
| `product-strategy-roadmap` | Visión, posicionamiento, priorización, roadmap, PRDs de feature, release plans |
| `product-metrics` | North star, OKRs de producto, KPI trees, instrumentación, experiment design |
| `finance-budgeting` | Presupuestos, rolling forecasts, escenarios, headcount plan, política de gastos |
| `finance-reporting` | Cierres, estados financieros, KPI dashboards, board decks, AR/AP/invoicing |
| `finance-treasury` | Cash management, banca, FX, working capital, cash forecasts |
| `legal-contracts` | Borradores de contratos comerciales (NDA, MSA, SOW, licencias, partnerships) |
| `legal-policies` | Políticas externas (T&C, ToS, AUP, cookies, SLA) |
| `legal-privacy` | Privacy policy, DPAs, DPIAs, ROPA, transferencias internacionales |
| `legal-risk` | Análisis de riesgo, compliance reviews por framework, due diligence |
| `design-ui` | Mockups, prototipos y specs de pantallas/componentes para handoff |
| `design-ux-research` | Usability tests, heuristic evaluations, journey maps, friction analysis |
| `design-design-system` | Mantenimiento del DS: tokens, foundations, componentes canónicos, versionado |
| `design-accessibility` | Audits WCAG 2.2 AA, remediation plans, patrones accesibles |

> Los agentes legales y de HR producen **estructura y borradores, NO asesoría vinculante**. Cada output va marcado para validación humana (counsel legal / decisión final de manager).

## Skills — qué entrega cada una (una frase)

### Compartidas (9) — en `_shared/skills/`, instaladas siempre

**Meta-skills** (para construir el sistema):

| Skill | Para qué |
|---|---|
| `skill-scaffold` | Plantilla canónica para crear cualquier skill nueva (v1 prosa o v2 ejecutable) |
| `agent-scaffold` | Plantilla canónica para crear o auditar cualquier agente del repo |

**Business-skills compartidas** (entregables transversales):

| Skill | Para qué |
|---|---|
| `competitive-analysis` | Matriz comparativa de competidores con whitespace y threat assessment |
| `case-study` | Caso de éxito con problema → solución → resultados medibles + citas verbatim |
| `kpi-dashboard` | Dashboard estructurado de KPIs con tendencia, variance y commentary |
| `stakeholder-map` | Mapa de stakeholders con influencia × interés × posición y plan de engagement |
| `risk-matrix` | Matriz de riesgos por dimensión con probabilidad × impacto y mitigación |
| `okr-set` | OKRs (1-3 Os + 2-4 KRs cuantitativos) por ciclo con scoring |
| `journey-map` | Journey con fases × acciones × pensamientos × emociones × pain points × oportunidades |

### Dept-específicas (63)

**Marketing (13):** `blog-post`, `ad-copy`, `campaign-brief`, `editorial-calendar`, `email-campaign`, `keyword-research`, `landing-page`, `marketing-plan`, `platform-adapter`, `publish-checklist`, `seo-on-page`, `linkedin-audit`, `brand-voice-guide`.

**Sales (11):** `prospecting-list`, `outreach-sequence`, `account-intelligence`, `sales-proposal`, `pitch-deck`, `objection-handler`, `sales-playbook`, `discovery-call`, `pipeline-review`, `renewal-playbook`, `forecasting-report`.

**Software (7):** `adr`, `code-review-checklist`, `test-plan`, `runbook`, `api-spec`, `tech-spec`, `bug-report`.

**HR (7):** `job-description`, `performance-review`, `policy-document`, `onboarding-plan`, `one-on-one-framework`, `compensation-band`, `exit-interview`.

**Product (6):** `user-interview-script`, `product-roadmap`, `north-star-metric`, `feature-prd`, `experiment-design`, `release-plan`.

**Finance (7):** `budget-plan`, `financial-report`, `invoice-template`, `cash-forecast`, `expense-policy`, `board-deck-financial`, `expense-report`.

**Legal (6):** `contract-template`, `nda-template`, `privacy-policy`, `dpa-template`, `terms-of-service`, `compliance-checklist`.

**Design (6):** `ui-component-spec`, `design-token-set`, `accessibility-audit`, `usability-test-plan`, `design-handoff-checklist`, `ds-component-doc`.

**Operations (1, v2 ejecutable):** `redmine` (10 acciones contra Redmine REST API).

Para descripción de cada skill en una frase: [`.aigent/README.md`](./.aigent/README.md) sección "Catálogo rápido".

## Estructura del repo

```
.aigent/                    ← motor del sistema (definiciones de agentes, skills, orquestadores)
.context/                   ← memoria del proyecto (config global y por proyecto, PRDs, tareas)
<contenido generado>/       ← entregables (fuera de .aigent y .context)
```

## Empezar

1. **Instalar el cableado para tu IDE:**
   ```bash
   bash .aigent/IDE/install.sh           # Unix / macOS
   .\.aigent\IDE\install.ps1             # Windows
   ```
   El instalador detecta qué IDEs tienes configurados (Claude Code, OpenCode, …) y propaga los agentes y skills al sitio correcto. `_shared/` se distribuye siempre.

2. **Abrir la carpeta en tu IDE** (Claude Code / Cowork / OpenCode).

3. **Pedir algo a `BOSS`** ("necesito un post sobre X", "prepara una propuesta para la cuenta Y", "redacta el DPA con el proveedor Z", …). El sistema clasifica la petición, decide qué departamento, qué orquestador, qué especialista, y produce los archivos en la carpeta del proyecto.

## Cómo extender

| Quieres… | Ruta |
|---|---|
| Añadir o auditar un agente | Skill `agent-scaffold` (en `.aigent/departments/_shared/skills/shared-agent-scaffold/`) |
| Añadir o auditar una skill | Agente `shared-skill-builder`, que usa `skill-scaffold` y considera ubicación (dept vs `_shared/`) |
| Añadir un departamento nuevo | Copiar `_shared/orchestrator-template.md` + crear agentes con `agent-scaffold` |
| Crear una skill compartida | Aplicar criterios de `conventions.md` §7.1; vive en `_shared/skills/` sin prefijo |

Detalle de convenciones de naming, frontmatter, estructura y skills v2 ejecutables: [`.aigent/departments/_shared/conventions.md`](./.aigent/departments/_shared/conventions.md).

Bootstrap, routing y reglas de oro del sistema en runtime: [`.aigent/BOSS.md`](./.aigent/BOSS.md).

## Documentos clave

- [`.aigent/README.md`](./.aigent/README.md) — Inventario completo + catálogo rápido por agente y skill.
- [`.aigent/BOSS.md`](./.aigent/BOSS.md) — Entrada global del sistema en runtime, bootstrap y routing.
- [`.aigent/CHANGELOG.md`](./.aigent/CHANGELOG.md) — Versiones y cambios material por release.
- [`.aigent/VERSION`](./.aigent/VERSION) — Versión actual del framework.
- [`.aigent/departments/_shared/conventions.md`](./.aigent/departments/_shared/conventions.md) — Convenciones del repo (naming, estructura, skills v2).
- [`.aigent/departments/_shared/output-rules.md`](./.aigent/departments/_shared/output-rules.md) — Regla universal de outputs (archivos reales fuera de `.aigent/` y `.context/`).

## Repositorio

GitHub: [`github.com/WaimaGroup/aigent-company`](https://github.com/WaimaGroup/aigent-company)
