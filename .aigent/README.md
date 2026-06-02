# Aigent — Departamentos Agénticos con Claude

> Fuente de verdad del proyecto. Actualizar cuando se tome una decisión relevante.

Sistema de **departamentos de trabajo basados en agentes IA** para automatizar cada área de la empresa con Claude (y otros LLMs vía MCP). Plataforma principal: Claude Code / Cowork. Secundaria: OpenCode.

---

## Estructura

```
<raíz>/
├── .aigent/                          ← motor del sistema
│   ├── README.md · BOSS.md           ← entrada global y routing/bootstrap
│   ├── departments/
│   │   ├── _shared/                  ← conventions, output-rules, orchestrator-template, agentes y skills compartidas
│   │   └── <dept>/                   ← <dept>-orchestrator.md + agents/ + skills/
│   ├── v2/                           ← engine ejecutable de skills v2 (HTTP)
│   └── IDE/                          ← instaladores y plantillas (ver IDE/README.md)
├── .context/
│   ├── config.json                   ← config global: empresa, mcps, tools, decisiones
│   ├── .secrets.json                 ← gitignored, secrets de skills v2
│   └── <proyecto>/
│       ├── config.json               ← paths, mcps, tools y decisiones del proyecto
│       └── <dept>/{prd.md, tasks.md}
└── <contenido generado>/             ← entregables, fuera de .aigent y .context
```

---

## Estado de los departamentos

| Departamento | Estado | Orquestador | Agentes | Skills |
|---|---|---|---|---|
| Marketing | ✅ implementado | completo | 3 / 3 | 8 (v1 prosa) |
| Sales | ✅ implementado | completo | 4 / 4 | 12 (v1 prosa) |
| Software | ✅ implementado | completo | 4 / 4 | 19 (v1 prosa) |
| HR | ✅ implementado | completo | 4 / 4 | 7 (v1 prosa) |
| Product | ✅ implementado | completo | 3 / 3 | 6 (v1 prosa) |
| Finance | ✅ implementado | completo | 3 / 3 | 7 (v1 prosa) |
| Legal | ✅ implementado | completo | 4 / 4 | 6 (v1 prosa) |
| Design | ✅ implementado | completo | 4 / 4 | 6 (v1 prosa) |
| Operations | ✅ parcial | completo (Redmine) | 0 / 4 implementados (4 stubs) | 1 (`operations-redmine` v2 ejecutable) |
| DevOps | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| _shared_ | ✅ activo | — | `shared-prd-agent`, `shared-skill-builder` | 2 meta (`shared-skill-scaffold`, `shared-agent-scaffold`) + 8 business compartidas + 3 utility (`shared-base64`, `shared-http-download`, `shared-office-writer`) — todas v1 prosa |

**Stub honesto:** orquestador y agentes existen pero su body indica explícitamente que no deben delegar ni ejecutar. Evita que un cliente seleccione un agente vacío. Cuando el dept se active, se sustituye usando `_shared/orchestrator-template.md` y la skill `shared-agent-scaffold`.

---

## Detalle por departamento

### `_shared/` — transversal

**Agentes:**

| Agente | Rol |
|---|---|
| `shared-prd-agent` | Captura de requisitos y redacción de PRDs, optimizado para humanos y agentes IA. |
| `shared-skill-builder` | Crear, auditar y configurar skills (v1 prosa o v2 ejecutable engine-v2). Cinco modos: `create-v1`, `create-v2`, `configure`, `audit`, `add-action`. |

**Skills:**

`_shared/skills/` aloja tres categorías de skills conviviendo sin subcarpetas, distinguidas por dominio (no por ubicación):

**Meta-skills** — para construir el sistema:

| Skill | Cuándo usarla |
|---|---|
| `shared-skill-scaffold` | Plantilla canónica para crear cualquier skill nueva (modos v1 prosa y v2 ejecutable). La invoca `shared-skill-builder`. |
| `shared-agent-scaffold` | Plantilla canónica para crear o auditar cualquier agente del repo (especialista, compartido o stub honesto). Modos: `create-specialist`, `create-shared`, `create-stub`, `audit`. |

**Business-skills compartidas** — entregables transversales que ≥2 departments consumen con la misma estructura:

| Skill | Cuándo usarla | Agentes consumidores documentados |
|---|---|---|
| `shared-competitive-analysis` | Matriz comparativa estructurada de competidores, whitespace, threat assessment | `marketing-planning`, `product-strategy-roadmap` |
| `shared-case-study` | Caso de éxito de cliente con problema → solución → resultados medibles + citas verbatim | `marketing-creative`, `sales-enablement` |
| `shared-kpi-dashboard` | Dashboard estructurado de KPIs con tendencia, variance y commentary | `marketing-planning`, `product-metrics`, `finance-reporting`, `sales-crm` |
| `shared-stakeholder-map` | Mapa influencia × interés × posición × plan de engagement | `product-discovery`, `legal-risk`, `marketing-planning`, `sales-ae` |
| `shared-risk-matrix` | Matriz de riesgos por dimensión con probabilidad × impacto y mitigación | `legal-risk`, `software-architecture`, `finance-budgeting`, `product-strategy-roadmap` |
| `shared-okr-set` | OKRs estructurados (1-3 Os + 2-4 KRs cuantitativos) por ciclo | `product-metrics`, `hr-evaluation`, `marketing-planning` |
| `shared-journey-map` | Journey map con fases × acciones × pensamientos × emociones × pain points × oportunidades × touchpoints | `design-ux-research`, `product-discovery` |
| `shared-deploy-checklist` | Checklist pre/durante/post-deploy de un release adaptado a riesgo (🟢/🟡/🟠/🔴) y estrategia (instant/canary/blue-green/progressive) | `software-architecture`, `software-coding` (devops cuando se active) |

**Utility-skills compartidas** — utilidades técnicas con script propio que cualquier agente puede invocar:

| Skill | Cuándo usarla | Agentes consumidores documentados |
|---|---|---|
| `shared-base64` | Bidireccional base64 ↔ fichero: **decode** (base64 de un MCP → fichero real bajo `.context/.temp/<dept>/` con verificación de magic bytes: PNG/JPG/GIF/WEBP/SVG/PDF/ZIP) y **encode** (cualquier fichero → `.b64`, opcional data URI). Incluye `b64.cjs` (Node 18+, sin deps) | cualquier agente que reciba base64 de un MCP o necesite re-subir un fichero como base64 (marketing-creative, marketing-web, design-ui, etc.) |
| `shared-http-download` | Descargar uno o varios ficheros por GET HTTP(S) a un directorio destino, con resolución segura de nombre, aislamiento de errores por URL y tope de tamaño. Formatos: PDF, ZIP, DOC/DOCX, XLS/XLSX, XML, HTML, TXT, binario. Incluye `download.cjs` (Node 18+, sin deps) | cualquier agente que reciba URLs de documentos a materializar en disco (p. ej. `sales-tender-search` con los pliegos) |
| `shared-office-writer` | Generar documentos Office **nuevos** sin dependencias: `.docx` (párrafos, encabezados H1-H6, negrita/cursiva/subrayado, tablas simples) y `.xlsx` (varias hojas, texto/número/bool/fecha, fórmulas, ancho de columna, cabecera en negrita) desde un spec JSON. Incluye `office.cjs` (Node 18+, sin deps). Solo escribe, no edita | cualquier agente que deba producir un Word/Excel como entregable (informes, exports tabulares, presupuestos) |

> **Criterios para `_shared/skills/`:** ver `conventions.md` §7.1. Resumen: ≥2 depts la usan + entregable genuinamente idéntico + sin matices fuertes por dept. Si una compartida empieza a divergir entre depts, se duplica en los depts (no se fuerza lo compartido).

> **Distribución:** `_shared/skills/` se propaga automáticamente con cualquier dept que el usuario seleccione en `install.sh` / `install.ps1`. No hay que tocar el installer al añadir una skill compartida nueva.

---

### Marketing — ✅ implementado

**Orquestador:** `marketing-orchestrator.md`

**Agentes (3):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `marketing-creative` | Copy (blog, email, anuncios, prensa), storytelling, y todo lo de redes sociales (copies por plataforma, calendarios, hashtags, auditoría LinkedIn), más voz de marca | `marketing-copy`, `marketing-social`, `marketing-brand-voice-guide` + `shared-case-study` (shared) |
| `marketing-planning` | Planes de marketing, briefings de campaña, análisis competitivo, posicionamiento, KPIs/OKRs, lanzamientos, y SEO/analytics (keyword research, on-page, auditorías, Analytics/Search Console) | `marketing-strategy`, `marketing-seo` + `shared-competitive-analysis`, `shared-stakeholder-map`, `shared-okr-set`, `shared-kpi-dashboard` (shared) |
| `marketing-web` | Landing pages, páginas de WordPress/Elementor, arquitectura de información, CRO | `marketing-landing-page`, `marketing-elementor-content`, `marketing-publish-checklist` |

**Skills (8, todas v1 prosa). Default de entregable: un solo `.md` (formatos extra solo a petición; excepción: `marketing-elementor-content`):**

| Skill | Entregable |
|---|---|
| `marketing-copy` | Copy de marketing en 4 formatos seleccionables (`blog`/`email`/`anuncio`/`prensa`): post SEO, email con 3 asuntos A/B, anuncio con variantes y límites por plataforma, o nota de prensa. Un `.md` |
| `marketing-social` | Redes sociales en 3 modos: `adaptar` (un contenido por plataforma), `calendario` (editorial mensual/semanal) o `linkedin-audit` (alcance orgánico + copy plain-text para pegar) |
| `marketing-strategy` | Estrategia en 2 modos: `plan` (plan de marketing anual/trimestral) o `brief` (briefing de campaña) |
| `marketing-seo` | SEO en 2 modos: `research` (keyword research priorizado) u `on-page` (auditoría + versión optimizada) |
| `marketing-landing-page` | Estructura + copy completo de landing de conversión (en plano) |
| `marketing-elementor-content` | Contenido para Elementor: JSON canónico de `_elementor_data` + HTML fallback + metadata + `assets/` con SVGs vectoriales y PNGs @2x. Cubre page/post/landing/block (solo widgets core). **Entregable multi-archivo (excepción al default)** |
| `marketing-publish-checklist` | Checklist SEO + UX + técnico antes de publicar en WordPress |
| `marketing-brand-voice-guide` | Guía canónica de voz de marca: atributos de tono, vocabulario do/don't, adaptación por canal |

---

### Sales — ✅ implementado

**Orquestador:** `sales-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `sales-sdr` | Listas de prospectos por ICP, secuencias de outreach (email/LinkedIn), investigación de cuentas, calificación BANT/MEDDIC | `sales-prospecting-list`, `sales-outreach-sequence`, `sales-account-intelligence` |
| `sales-ae` | Propuestas, discovery calls, renewal management, argumentarios, estrategia de cierre | `sales-account-intelligence`, `sales-proposal`, `sales-discovery-call`, `sales-renewal-playbook` + `shared-stakeholder-map` (shared) |
| `sales-enablement` | Pitch decks, playbooks, battle cards, guías de objeciones, casos de éxito | `sales-pitch-deck`, `sales-objection-handler`, `sales-playbook` + `shared-case-study` (shared) |
| `sales-crm` | Pipeline review operativo, forecast formal, KPI dashboard, estructura de CRM | `sales-pipeline-review`, `sales-forecasting-report` + `shared-kpi-dashboard` (shared) |

**Skills (12 — v1 prosa; `sales-tender-search` incluye script `atom-search.cjs`):**

| Skill | Entregable |
|---|---|
| `sales-prospecting-list` | Tabla estructurada de prospectos con investigación, hooks de personalización y campos por verificar |
| `sales-outreach-sequence` | Cadencia multi-step de email/LinkedIn con scripts y variables de personalización |
| `sales-account-intelligence` | Informe completo de Sales Intelligence sobre una cuenta: stack tech, pain points, mapeo de servicios, stakeholders, secuencia de venta y estimación del deal |
| `sales-proposal` | Propuesta comercial completa con resumen ejecutivo, problema, solución, ROI, plan, pricing y próximos pasos |
| `sales-pitch-deck` | Outline + script slide a slide del pitch deck para presentaciones en vivo |
| `sales-objection-handler` | Guía estructurada de manejo de objeciones con respuestas, preguntas de seguimiento y señales de excusa vs. real |
| `sales-playbook` | Playbook completo del proceso comercial: ICP, etapas, scripts, framework de cualificación, métricas y onboarding de reps |
| `sales-discovery-call` | Script + framework de cualificación BANT/MEDDIC/SPICED con debrief estructurado y red flags |
| `sales-pipeline-review` | Revisión operativa deal-by-deal con weighted forecast, health flags, acciones acordadas |
| `sales-renewal-playbook` | Playbook de renovación con health signals, timing, scripts por situación (🟢/🟡/🔴), concessions ladder |
| `sales-forecasting-report` | Forecast formal (commit/best/worst) con metodología explícita, segmentación, win rates, riesgos. Board-ready |
| `sales-tender-search` | Búsqueda de licitaciones en feeds ATOM (PLACSP por defecto) filtrando por CPV (mixto exacto+prefijos `722*`), ventana de fechas y estado; descarga de pliegos (vía `shared-http-download`) y resumen accionable por licitación (vía `pdf`). Incluye `atom-search.cjs` (Node 18+, sin deps) |

---

### Software — ✅ implementado

**Orquestador:** `software-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `software-architecture` | Diseño de sistemas, ADRs, evaluación de stacks, modelado de dominio, runbooks operacionales, API specs, tech specs, spec-review, **documentación técnica del proyecto** (README, dev guide, code docs style, migration guides) | `software-adr`, `software-runbook`, `software-api-spec`, `software-tech-spec`, `software-spec-review`, `software-readme`, `software-code-docs-style`, `software-dev-guide`, `software-migration-guide` + `shared-risk-matrix`, `shared-deploy-checklist` (shared) |
| `software-coding` | Implementación con workflows estructurados (feature/bugfix/refactor/dependency-bump), scripts utilitarios, mensajes de commit, descripciones de PR, entradas de changelog | `software-feature-implementation`, `software-bugfix-workflow`, `software-refactor-plan`, `software-dependency-bump`, `software-commit-message`, `software-pr-description`, `software-changelog-entry` + `shared-deploy-checklist` (shared) |
| `software-code-review` | Review estructurado de PRs/diffs con severidades (🔴/🟠/🟡/🔵), 8 ejes, security básico (OWASP) | `software-code-review-checklist` |
| `software-qa` | Estrategia de testing, planes por nivel (unit/integration/e2e/perf/security), casos, criterios de aceptación, bug reports estructurados | `software-test-plan`, `software-bug-report` |

**Skills (19, todas v1 prosa — más 1 compartida `shared-deploy-checklist`):**

| Skill | Entregable |
|---|---|
| `software-adr` | Architecture Decision Record numerado y fechado con contexto, drivers, opciones, decisión, consecuencias y riesgos |
| `software-code-review-checklist` | Report de code review con veredicto, top 3, hallazgos por severidad y análisis por 8 ejes |
| `software-test-plan` | Plan de test por niveles con casos priorizados (P0-P3), criterios de salida verificables, riesgos y dependencias |
| `software-runbook` | Runbook operacional de un servicio: deploy, monitoring, alertas, playbooks por incidente, escalado, dependencias |
| `software-api-spec` | Especificación de API con endpoints, schemas, errores, pagination, versioning, deprecation |
| `software-tech-spec` | Spec técnica intermedia entre PRD/ADR e implementación: data model, API changes, edge cases, performance, security, rollout |
| `software-bug-report` | Bug report estructurado con reproducción, expected vs actual, severidad, scope, entorno, regresión, evidencia |
| `software-spec-review` | Review y scoring (0-30 por rubric de 6 dimensiones) de un spec existente (PRD/ADR/tech-spec/api-spec) con hallazgos por severidad y veredicto |
| `software-commit-message` | Mensaje de commit (Conventional Commits por defecto) a partir del diff: subject + body + footer con refs y breaking changes |
| `software-pr-description` | Descripción de PR/MR cruzando spec asociado + diff + commits: problema, cambio, testing, impacto, checklist |
| `software-changelog-entry` | Entrada `## [X.Y.Z] — YYYY-MM-DD` Keep a Changelog a partir de los PRs merged del release, agrupada por categoría con BREAKING marcados |
| `software-feature-implementation` | Workflow estructurado para implementar una feature: pre-flight (scope, tests previstos) → ejecución → reporte (archivos tocados, AC cubiertos, TODOs, siguiente paso) |
| `software-bugfix-workflow` | Workflow estructurado para arreglar un bug: reproduce → diagnose (root cause) → fix → regression test → validación + reporte con comunicación al reporter |
| `software-refactor-plan` | Plan de refactor con motivación, scope IN/OUT, approach, safety nets (tests, characterization, feature flag), validación, rollback. Ejecución guiada por el plan |
| `software-dependency-bump` | Workflow para subir dependencia: assessment (changelog, breaking, blast radius), plan de migración, validación, rollback. Cubre majors con cuidado |
| `software-readme` | README.md del proyecto: qué resuelve, quick start, uso, configuración, structure, links. Adapta al tipo (library/CLI/web/API) |
| `software-code-docs-style` | Guía canónica de documentación inline del proyecto: qué se comenta, formato de docstrings por lenguaje, política TODO/FIXME, ejemplos |
| `software-dev-guide` | Guía de desarrollo del proyecto: setup del entorno, estructura del repo, common tasks, troubleshooting, workflow. Living document |
| `software-migration-guide` | Guía pública de migración de versión X a Y para consumidores: breaking changes con antes/después, codemods, plan paso a paso, validación, rollback |

> Stack agnóstico: todos los agentes y skills se adaptan al lenguaje/framework del proyecto activo. No mencionan herramientas concretas en system prompts (regla §8 de conventions).

---

### HR — ✅ implementado

**Orquestador:** `hr-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `hr-recruitment` | JDs, sourcing, interview kits, screening, scorecards, ofertas, rejection, bandas salariales | `hr-job-description`, `hr-compensation-band` |
| `hr-onboarding` | Planes 30/60/90, day-1 checklist, welcome pack, evaluación de período de prueba | `hr-onboarding-plan` |
| `hr-evaluation` | Performance reviews, 1:1s, feedback estructurado, OKRs personales, PIPs, eNPS, exit interviews | `hr-performance-review`, `hr-one-on-one-framework`, `hr-exit-interview` + `shared-okr-set` (shared) |
| `hr-policies` | Handbook del empleado, políticas individuales (remoto, vacaciones, conducta), comunicación de cambios | `hr-policy-document` |

**Skills (7, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `hr-job-description` | JD completo con EVP, responsabilidades, must/nice, banda salarial (pay-transparency consciente de jurisdicción), proceso, equidad |
| `hr-performance-review` | Review estructurado con evidencia → impacto → competencias → rating con calibración → feedback listo para entregar → growth plan |
| `hr-policy-document` | Política individual con propósito, scope, reglas, procedimiento, excepciones, consecuencias, owner y fecha de revisión |
| `hr-onboarding-plan` | Plan 30/60/90 con pre-boarding, día 1 hora a hora, buddy program, evaluación de período de prueba, feedback bidireccional |
| `hr-one-on-one-framework` | Framework de 1:1s con principios, agenda recurrente (cómo estás / status / bloqueos / desarrollo / feedback), plantilla de notas, cadencia |
| `hr-compensation-band` | Banda salarial por rol × seniority × geografía con benchmark, internal equity check, decision matrix. Confidencial alto |
| `hr-exit-interview` | Guion + síntesis estructurada de exit con categorización para people analytics agregado y recomendaciones derivadas |

> **Confidencialidad:** HR maneja información sensible por defecto (compensación, evaluaciones, conflictos). El orquestador y los agentes refuerzan que nada se publica sin confirmar nivel de privacidad esperado.
> **Solapamiento con Legal:** las políticas tienen capa HR (cómo aplica al empleado) y capa Legal (cumplimiento). Cuando Legal se active, coordinar entre ambos.

---

### Product — ✅ implementado

**Orquestador:** `product-orchestrator.md`

**Agentes (3):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `product-discovery` | User interviews, JTBD, opportunity-solution trees, validación de problema/solución, personas, customer journey | `product-user-interview-script` + `shared-stakeholder-map`, `shared-journey-map` (shared) |
| `product-strategy-roadmap` | Visión, posicionamiento, análisis competitivo, priorización (RICE/MoSCoW), roadmap, bets, PRDs de feature, release plans | `product-product-roadmap`, `product-feature-prd`, `product-release-plan` + `shared-competitive-analysis`, `shared-stakeholder-map`, `shared-risk-matrix` (shared) |
| `product-metrics` | North star metric, OKRs producto, KPI trees, instrumentación, experiment design (A/B tests) | `product-north-star-metric`, `product-experiment-design` + `shared-kpi-dashboard`, `shared-okr-set` (shared) |

**Skills (6, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `product-user-interview-script` | Script con calentamiento, exploratorias, profundización (5 whys suave), preguntas de comportamiento, cierre, debrief en caliente |
| `product-product-roadmap` | Roadmap por horizonte (now/next/later o quarterly) con fichas de iniciativa, sección "Lo que NO entra (y por qué)", confianza explícita |
| `product-north-star-metric` | NSM con candidates evaluados contra 3 criterios, definición operativa, KPI tree, guardraíles, anti-patrones |
| `product-feature-prd` | PRD operativo de feature: problema, hipótesis, scope, user stories con AC, métricas + guardraíles, rollout plan |
| `product-experiment-design` | Plan de A/B test con hipótesis, MDE, sample size, randomización, decision rules pre-resultado (anti p-hacking) |
| `product-release-plan` | Plan de release end-to-end con hitos, owners por área, comms externa, enablement, rollout strategy, kill switch, post-launch review |

> **Composición revaluada:** los 4 stubs previstos (`product-discovery`, `product-roadmap`, `product-strategy`, `product-metrics`) se fusionan en 3: strategy y roadmap son la misma disciplina por dos ejes (qué/por qué + cuándo) y mantenerlos separados forzaba al orquestador a coordinarlos casi siempre. Aplicación de la regla "más agentes ≠ mejor" del CLAUDE.md.

---

### Finance — ✅ implementado

**Orquestador:** `finance-orchestrator.md`

**Agentes (3):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `finance-budgeting` | Presupuestos anuales/trimestrales, rolling forecasts, scenarios, headcount plan, capex, política de gastos | `finance-budget-plan`, `finance-expense-policy` + `shared-risk-matrix` (shared) |
| `finance-reporting` | Cierres, P&L/Balance/Cash Flow, KPI dashboards, board financial deck, AR cycle (invoicing), AP cycle, expense reports, conciliaciones | `finance-financial-report`, `finance-invoice-template`, `finance-board-deck-financial`, `finance-expense-report` + `shared-kpi-dashboard` (shared) |
| `finance-treasury` | Cash management, banca, FX exposure, working capital, cash forecast 13-week, short-term financing | `finance-cash-forecast` |

**Skills (7, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `finance-budget-plan` | Presupuesto estructurado con drivers, P&L mensualizado, headcount, capex, escenarios (best/base/worst) + sensibilidades, supuestos trazables |
| `finance-financial-report` | Report con resumen adaptado a audiencia (board / leadership / externo), P&L + Balance + Cash Flow comparativos, KPI dashboard, variance commentary obligatorio |
| `finance-invoice-template` | Factura a cliente con campos fiscales del país emisor, numeración consecutiva por serie, cálculo de impuestos y retenciones, términos de pago, notas legales |
| `finance-cash-forecast` | 13-week rolling cash forecast con inflows/outflows por categoría, posición semanal, alertas por debajo de mínimo, escenarios, FX exposure |
| `finance-expense-policy` | Política de gastos cross-funcional: categorías, límites, workflow de aprobación, viajes (per diem por tier), equipamiento, reembolsos |
| `finance-board-deck-financial` | Sección financiera del board deck (5-10 slides): highlights, P&L, cash + runway, KPIs selectivos, variance, riesgos, asks |
| `finance-expense-report` | Submisión de gastos de empleado con detalle, totales por categoría/proyecto, justificantes, self-check contra expense-policy |

> **Composición revaluada:** los 4 stubs previstos (`finance-budgeting`, `finance-invoicing`, `finance-reporting`, `finance-treasury`) se fusionan en 3: la facturación es altamente proceduralizada y vive mejor como skill (`finance-invoice-template`) que como agente. `finance-reporting` absorbe el ciclo AR/AP por encajar con el ciclo contable. Aplicación de la regla "más agentes ≠ mejor" del CLAUDE.md.
> **Paso 0.5 amplía** con confirmación de moneda funcional, marco contable (IFRS/GAAP/PGC), año fiscal y periodicidad de cierre — datos críticos para cualquier output financiero.

---

### Legal — ✅ implementado

**Orquestador:** `legal-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `legal-contracts` | NDAs, MSAs, SOWs, licencias, partnerships, term sheets, LOIs, consulting agreements | `legal-contract-template`, `legal-nda-template` |
| `legal-policies` | T&C, Terms of Service, AUP, cookies, SLA público, disclaimers | `legal-terms-of-service` |
| `legal-privacy` | Política de privacidad, DPAs, DPIAs, ROPA, transferencias internacionales, DSAR handling, gestión de brechas | `legal-privacy-policy`, `legal-dpa-template` |
| `legal-risk` | Risk analysis de decisiones, compliance reviews por framework, due diligence, litigation tracking, M&A, whistleblowing | `legal-compliance-checklist` + `shared-risk-matrix`, `shared-stakeholder-map` (shared) |

**Skills (6, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `legal-contract-template` | Borrador estructurado de contrato (MSA / SOW / consulting / partnership / license) con preámbulo, definiciones, cláusulas críticas marcadas |
| `legal-nda-template` | NDA standalone (mutuo o unilateral) con definición de Información Confidencial, exclusiones, duración, devolución, remedies con injunctive relief |
| `legal-privacy-policy` | Política de privacidad pública GDPR/CCPA/LGPD-compliant con responsable, finalidades con base legal, plazos, destinatarios, transferencias internacionales, derechos |
| `legal-dpa-template` | DPA (Data Processing Agreement) GDPR Art. 28 con anexos (objeto, TOMs, subprocesadores), notificación de brechas (48h al controlador / 72h al supervisor), SCCs |
| `legal-terms-of-service` | T&C / ToS con resumen de 3 minutos, cuenta, pricing, IP, AUP resumido, limitación responsabilidad, indemnización, terminación, derechos de consumo |
| `legal-compliance-checklist` | Checklist estructurada contra framework (GDPR / SOC 2 / ISO 27001 / HIPAA / PCI DSS) con estado por control, gap analysis, remediation plan priorizado |

> **Aviso fundamental:** estos agentes producen **borradores y estructura, NO asesoría legal**. Cada output marca explícitamente `[REVISAR LEGAL]` los pasajes críticos. El orquestador rechaza emitir opinión vinculante; todo va validado por counsel humano antes de aplicarse.
> **Paso 0.5 amplía** con confirmación de jurisdicción principal, jurisdicciones de operación y marcos regulatorios aplicables (GDPR/CCPA/LGPD/sectoriales) — críticos para cualquier output legal.
> **Solapamiento con HR:** `hr-policies` cubre políticas internas (handbook, código de conducta, vacaciones). `legal-policies` cubre políticas externas dirigidas al usuario/cliente (T&C, ToS, AUP). Coordinación cuando una política tiene ambas capas.

---

### Design — ✅ implementado

**Orquestador:** `design-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `design-ui` | Layouts, mockups, prototipos, specs de pantallas/componentes para handoff con estados completos + responsive | `design-ui-component-spec`, `design-design-handoff-checklist` |
| `design-ux-research` | Usability testing, heuristic evaluation, journey mapping, friction analysis, card sorting, tree testing | `design-usability-test-plan` + `shared-journey-map` (shared) |
| `design-design-system` | Design tokens, foundations, componentes del DS con guidelines, versionado serio con deprecations | `design-design-token-set`, `design-ds-component-doc` |
| `design-accessibility` | Audits WCAG 2.2 AA por defecto, ARIA, keyboard, screen readers, contraste, focus management, remediation plans | `design-accessibility-audit` |

**Skills (6, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `design-ui-component-spec` | Spec UI para handoff con anatomía, props/variantes, estados completos, responsive, tokens consumidos, accesibilidad mínima, edge cases, criterios de aceptación |
| `design-design-token-set` | Set de design tokens por categoría (color/spacing/typography/radius/shadow/motion) con base + semánticos, light/dark, multi-plataforma, semver + política de deprecation, tabla de contraste WCAG |
| `design-accessibility-audit` | Audit WCAG 2.2 con scope, metodología, tabla SC con pass/fail/partial/N-A, hallazgos con severidad y categoría (DS fix / engineering fix), casos edge, score por nivel |
| `design-usability-test-plan` | Plan completo de usability test: hipótesis, tasks como objetivos del usuario, N de participantes, screener, script de sesión, SUS, debrief en caliente, síntesis con severidad |
| `design-design-handoff-checklist` | Checklist pre-handoff a engineering: tokens usados, estados completos, responsive, edge cases, accesibilidad mínima, Figma link, AC, sign-off designer + eng |
| `design-ds-component-doc` | Documentación canónica de componente del DS: anatomía, variantes, props/API multi-plataforma, estados, do/don't, audit a11y formal, tokens consumidos, versionado |

> **Decisión operativa clave:** `design-ux-research` opera de forma **autónoma como UX puro** sobre interfaces existentes o propuestas, **sin coordinación obligatoria con `product-discovery`**. Frontera: product-discovery investiga *qué problema resolver*; design-ux-research investiga *qué tan bien se resuelve con la interfaz*. Documentado en el system prompt del agente.
> **Paso 0.5 amplía** con confirmación de plataformas objetivo, brand de referencia (coordinación con marketing si existe), nivel WCAG objetivo (AA por defecto) e idioma(s) de interfaz.

---

### Operations — 🚧 parcial

**Orquestador:** stub honesto. Los 4 agentes (`operations-processes`, `operations-automation`, `operations-kpis`, `operations-suppliers`) son stubs sin system prompt redactado.

**Skills (1, v2 ejecutable):**

| Skill | Entregable |
|---|---|
| `operations-redmine` | Skill ejecutable contra la API REST de Redmine (engine-v2). 10 acciones: `list-issues`, `get-issue`, `create-issue`, `update-issue`, `add-note`, `list-projects`, `log-time`, `list-activities`, `list-time-entries`, `update-time-entry`. |

> La skill `operations-redmine` puede ejecutarse directamente vía `node .aigent/v2/engine/engine.cjs run operations-redmine <action>` aunque los agentes especialistas del dept no estén implementados todavía.

---

### DevOps — 🚧 TODO

Orquestador stub honesto y 4 agentes stub. Cuando se active, se redactará siguiendo `_shared/orchestrator-template.md` y la skill `shared-agent-scaffold`.

| Dept | Agentes stub previstos |
|---|---|
| DevOps | `devops-infrastructure`, `devops-pipeline`, `devops-monitoring`, `devops-incident` |

> El número de 4 agentes por dept es indicativo, no obligatorio. Al activar un dept, revaluar si esos 4 agentes son realmente necesarios o si parte de su trabajo se cubre mejor con skills (más reutilizables y deterministas). **Más agentes ≠ mejor.**

---

## Catálogo rápido — una frase por agente y skill

> Resumen comprimido de todo lo que el sistema entrega. Para detalles, ver la sección "Detalle por departamento" arriba.

### Orquestadores (8)

| Orquestador | Para qué |
|---|---|
| `marketing-orchestrator` | Punto de entrada único para contenido, copy, SEO, redes, web y campañas — delega al especialista adecuado o coordina varios |
| `sales-orchestrator` | Punto de entrada único para prospección, outreach, propuestas, pitch decks, playbooks, pipeline y CRM |
| `software-orchestrator` | Punto de entrada único para arquitectura, ADRs, implementación, code review y QA del ciclo técnico end-to-end |
| `hr-orchestrator` | Punto de entrada único para recruitment, onboarding, evaluación y políticas internas (con confidencialidad por defecto) |
| `product-orchestrator` | Punto de entrada único para discovery, estrategia + roadmap fusionados y métricas/OKRs de producto |
| `finance-orchestrator` | Punto de entrada único para budgeting, reporting (con AR/AP/invoicing) y treasury (con moneda y marco contable explícitos) |
| `legal-orchestrator` | Punto de entrada único para contratos, políticas externas, privacidad y riesgo/compliance — produce borradores, NO asesoría legal |
| `design-orchestrator` | Punto de entrada único para UI, UX research autónomo, design system y accesibilidad (WCAG 2.2 AA por defecto) |

### Agentes transversales (2)

| Agente | Para qué |
|---|---|
| `shared-prd-agent` | Captura de requisitos y redacción de PRDs estructurados optimizados para humanos y agentes IA, válido para cualquier departamento |
| `shared-skill-builder` | Crear, auditar y configurar skills v1 prosa o v2 ejecutables (engine-v2 HTTP) con validación contra el engine |

### Agentes especialistas (29)

**Marketing (3)**

| Agente | Para qué |
|---|---|
| `marketing-creative` | Copy (blog, email, anuncios, prensa), storytelling y todo lo de redes sociales (copies por plataforma, calendarios, hashtags, auditoría LinkedIn) + voz de marca |
| `marketing-planning` | Estrategia (planes, briefings, análisis competitivo, posicionamiento, KPIs/OKRs, lanzamientos) y SEO/analytics (keyword research, on-page, auditorías, Analytics/Search Console) |
| `marketing-web` | Diseñar landing pages, contenido de WordPress/Elementor y arquitectura de información orientada a conversión |

**Sales (4)**

| Agente | Para qué |
|---|---|
| `sales-sdr` | Generar listas de prospectos, secuencias de outreach personalizado y cualificación BANT/MEDDIC inicial |
| `sales-ae` | Redactar propuestas, conducir discovery calls, gestionar renovaciones y cerrar deals con stakeholder mapping |
| `sales-enablement` | Crear pitch decks, playbooks, battle cards, guías de objeciones y case studies para el equipo comercial |
| `sales-crm` | Producir pipeline reviews operativos, forecasts formales y dashboards de KPIs comerciales |

**Software (4)**

| Agente | Para qué |
|---|---|
| `software-architecture` | Diseñar sistemas, redactar ADRs, evaluar stacks, producir runbooks, API specs y tech specs |
| `software-coding` | Implementar features, fixes, refactors y migraciones a partir de specs (PRD/ADR/ticket) |
| `software-code-review` | Producir reviews estructurados de PRs con severidades, 8 ejes y verdict claro |
| `software-qa` | Diseñar estrategia de testing, planes por nivel, casos y bug reports estructurados |

**HR (4)**

| Agente | Para qué |
|---|---|
| `hr-recruitment` | Redactar JDs, diseñar interview kits, comparar candidatos, gestionar bandas salariales y emitir ofertas |
| `hr-onboarding` | Diseñar planes 30/60/90 días, day-1 checklists y evaluación de período de prueba |
| `hr-evaluation` | Estructurar 1:1s, performance reviews, OKRs personales, PIPs, eNPS y exit interviews |
| `hr-policies` | Redactar handbook del empleado y políticas individuales (remoto, vacaciones, conducta, DEI) |

**Product (3)**

| Agente | Para qué |
|---|---|
| `product-discovery` | Conducir user research (entrevistas, JTBD, journey maps, opportunity-solution trees) y validar problema antes de comprometer roadmap |
| `product-strategy-roadmap` | Definir visión, posicionamiento, análisis competitivo, priorización (RICE/MoSCoW), roadmap, PRDs de feature y release plans |
| `product-metrics` | Definir north star, OKRs de producto, KPI trees, plan de instrumentación y experiment design (A/B tests) |

**Finance (3)**

| Agente | Para qué |
|---|---|
| `finance-budgeting` | Construir presupuestos anuales, rolling forecasts, escenarios, headcount plan y políticas de gastos |
| `finance-reporting` | Producir cierres, estados financieros, KPI dashboards, board decks financieros y gestionar AR/AP/invoicing |
| `finance-treasury` | Gestionar cash, banca, FX, working capital y cash forecasts 13-week con alertas de liquidez |

**Legal (4)**

| Agente | Para qué |
|---|---|
| `legal-contracts` | Redactar borradores de contratos comerciales (NDA, MSA, SOW, licencias, partnerships) — NO asesoría legal |
| `legal-policies` | Redactar políticas externas (T&C, ToS, AUP, cookies, SLA público) con plain language y jurisdicción declarada |
| `legal-privacy` | Producir privacy policy, DPAs, DPIAs, ROPA, transferencias internacionales y gestión de DSARs/brechas |
| `legal-risk` | Analizar riesgo legal, compliance reviews por framework (GDPR/SOC 2/ISO/HIPAA), due diligence, litigation tracking |

**Design (4)**

| Agente | Para qué |
|---|---|
| `design-ui` | Diseñar layouts, mockups, prototipos y specs de pantallas/componentes con estados completos para handoff |
| `design-ux-research` | Conducir usability tests, heuristic evaluations, journey maps y friction analysis (autónomo del problema-discovery) |
| `design-design-system` | Mantener el Design System: tokens, foundations, documentación canónica de componentes y versionado |
| `design-accessibility` | Auditar WCAG 2.2 AA, producir remediation plans y patrones accesibles (keyboard, ARIA, screen readers) |

### Skills compartidas (13 = 2 meta + 8 business + 3 utility) — `_shared/skills/`

| Skill | Para qué | Tipo |
|---|---|---|
| `shared-skill-scaffold` | Plantilla canónica para crear cualquier skill nueva (v1 prosa o v2 ejecutable) | meta |
| `shared-agent-scaffold` | Plantilla canónica para crear o auditar cualquier agente del repo (especialista, compartido, stub) | meta |
| `shared-competitive-analysis` | Matriz comparativa estructurada de competidores con whitespace y threat assessment | business |
| `shared-case-study` | Caso de éxito de cliente con problema → solución → resultados medibles + citas verbatim | business |
| `shared-kpi-dashboard` | Dashboard estructurado de KPIs con métricas × target × variance × tendencia × commentary | business |
| `shared-stakeholder-map` | Mapa de stakeholders con matriz influencia × interés × posición × plan de engagement | business |
| `shared-risk-matrix` | Matriz de riesgos por dimensión con probabilidad × impacto × mitigación × owner | business |
| `shared-okr-set` | OKRs estructurados (1-3 Os + 2-4 KRs cuantitativos) por ciclo con scoring | business |
| `shared-journey-map` | Journey con fases × acciones × pensamientos × emociones × pain points × oportunidades × touchpoints | business |
| `shared-deploy-checklist` | Checklist pre/durante/post-deploy de un release adaptado a riesgo (🟢/🟡/🟠/🔴) y estrategia | business |
| `shared-base64` | Bidireccional base64 ↔ fichero: decode (base64 → fichero real bajo `.context/.temp/<dept>/`, magic bytes PNG/JPG/GIF/WEBP/SVG/PDF/ZIP) y encode (fichero → `.b64`, opcional data URI). Incluye `b64.cjs` (Node 18+, sin deps) | utility |
| `shared-http-download` | Descargar ficheros por GET HTTP(S) a un directorio destino, con resolución de nombre, aislamiento de errores por URL y tope de tamaño (PDF/ZIP/DOC/DOCX/XLS/XLSX/XML/HTML/TXT/binario). Incluye `download.cjs` (Node 18+, sin deps) | utility |
| `shared-office-writer` | Generar `.docx`/`.xlsx` **nuevos** sin dependencias desde un spec JSON (docx: párrafos/encabezados/negrita/tablas; xlsx: hojas/número/fecha/fórmulas/ancho/cabecera). Solo escribe, no edita. Incluye `office.cjs` (Node 18+, sin deps) | utility |

### Skills dept-específicas (71)

**Marketing (8)** — default de entregable: un solo `.md` (excepción: `marketing-elementor-content`)

| Skill | Para qué |
|---|---|
| `marketing-copy` | Copy en 4 formatos (`blog`/`email`/`anuncio`/`prensa`): post SEO, email con 3 asuntos A/B, anuncio con variantes y límites de plataforma, o nota de prensa |
| `marketing-social` | Redes en 3 modos: `adaptar` (un contenido por plataforma), `calendario` (editorial) o `linkedin-audit` (alcance + copy plain-text) |
| `marketing-strategy` | Estrategia en 2 modos: `plan` (plan anual/trimestral) o `brief` (briefing de campaña) |
| `marketing-seo` | SEO en 2 modos: `research` (keyword research priorizado) u `on-page` (auditoría + versión optimizada) |
| `marketing-landing-page` | Estructura + copy de landing page de conversión (en plano) |
| `marketing-elementor-content` | Contenido Elementor para WordPress: JSON `_elementor_data` + HTML fallback + metadata + `assets/` con SVGs y PNG @2x. Cubre page/post/landing/block. Multi-archivo (excepción al default) |
| `marketing-publish-checklist` | Checklist SEO + UX + técnico antes de publicar en WordPress |
| `marketing-brand-voice-guide` | Guía canónica de voz de marca: atributos de tono, vocabulario do/don't, adaptación por canal |

**Sales (12)**

| Skill | Para qué |
|---|---|
| `sales-prospecting-list` | Tabla estructurada de prospectos con investigación, hooks y campos por verificar |
| `sales-outreach-sequence` | Cadencia multi-step de email/LinkedIn con scripts y variables de personalización |
| `sales-account-intelligence` | Informe completo de Sales Intelligence sobre una cuenta (stack, pain points, stakeholders) |
| `sales-proposal` | Propuesta comercial con resumen ejecutivo, problema, solución, ROI, plan, pricing |
| `sales-pitch-deck` | Outline + script slide a slide de presentación de ventas |
| `sales-objection-handler` | Guía de manejo de objeciones con respuestas y señales excusa vs problema real |
| `sales-playbook` | Playbook completo del proceso comercial con ICP, etapas, scripts, métricas |
| `sales-discovery-call` | Script + framework de cualificación BANT/MEDDIC/SPICED con debrief estructurado |
| `sales-pipeline-review` | Revisión operativa deal-by-deal con weighted forecast, health flags y acciones acordadas |
| `sales-renewal-playbook` | Playbook de renovación con health signals, timing, scripts por situación y concessions ladder |
| `sales-forecasting-report` | Forecast formal del periodo con commit/best/worst, metodología, segmentación y riesgos |
| `sales-tender-search` | Búsqueda de licitaciones en feeds ATOM (PLACSP) por CPV/fechas/estado + descarga de pliegos y resumen accionable. Incluye `atom-search.cjs` (Node 18+, sin deps) |

**Software (19)**

| Skill | Para qué |
|---|---|
| `software-adr` | Architecture Decision Record numerado y fechado con contexto, opciones, decisión y consecuencias |
| `software-code-review-checklist` | Report de code review con veredicto, top 3, hallazgos por severidad y análisis por 8 ejes |
| `software-test-plan` | Plan de test por niveles con casos priorizados (P0-P3), criterios de salida y riesgos |
| `software-runbook` | Runbook operacional para servicio en producción con deploy, monitoring, alertas y playbooks por incidente |
| `software-api-spec` | Especificación de API con endpoints, schemas, errores, pagination, versioning y deprecation |
| `software-tech-spec` | Spec técnica intermedia entre PRD/ADR e implementación con data model, API changes y rollout |
| `software-bug-report` | Bug report estructurado con reproducción, expected/actual, severidad, scope, entorno y evidencia |
| `software-spec-review` | Review y scoring de spec (PRD/ADR/tech-spec/api-spec) con rubric de 6 dimensiones, hallazgos por severidad y veredicto |
| `software-commit-message` | Mensaje de commit (Conventional Commits por defecto) a partir del diff con subject, body y footer |
| `software-pr-description` | Descripción de PR/MR cruzando spec + diff + commits con problema, cambio, testing, impacto y checklist |
| `software-changelog-entry` | Entrada de CHANGELOG.md (Keep a Changelog) a partir de PRs merged del release con categorías y BREAKING marcados |
| `software-feature-implementation` | Workflow para implementar feature: pre-flight (scope, tests) → ejecución → reporte de cambios con AC, TODOs y siguiente paso |
| `software-bugfix-workflow` | Workflow para arreglar bug: reproduce → diagnose → fix → regression test + reporte con root cause y comunicación al reporter |
| `software-refactor-plan` | Plan de refactor con scope IN/OUT, approach, safety nets, validación y rollback. Ejecución guiada por el plan |
| `software-dependency-bump` | Workflow para subir dependencia con assessment del changelog, plan de migración, validación y rollback |
| `software-readme` | README.md del proyecto con qué resuelve, quick start, uso, configuración y structure adaptado al tipo (library/CLI/web/API) |
| `software-code-docs-style` | Guía canónica de documentación inline: qué se comenta, formato de docstrings por lenguaje, política TODO/FIXME |
| `software-dev-guide` | Guía de desarrollo del proyecto: setup, estructura del repo, common tasks, troubleshooting, workflow |
| `software-migration-guide` | Guía pública de migración de versión X a Y para consumidores con antes/después, codemods, plan paso a paso y rollback |

**HR (7)**

| Skill | Para qué |
|---|---|
| `hr-job-description` | JD completo con EVP, responsabilidades, must/nice, banda salarial y proceso |
| `hr-performance-review` | Performance review con evidencia → impacto → competencias → rating → growth plan |
| `hr-policy-document` | Política individual con propósito, scope, reglas, procedimiento, excepciones y owner |
| `hr-onboarding-plan` | Plan 30/60/90 días con pre-boarding, día 1, buddy program y evaluación de período de prueba |
| `hr-one-on-one-framework` | Framework canónico de 1:1s con agenda, plantilla de notas, cadencia y anti-patrones |
| `hr-compensation-band` | Banda salarial por rol × seniority × geografía con benchmark e internal equity check |
| `hr-exit-interview` | Guion + síntesis con categorización para people analytics agregado y recomendaciones |

**Product (6)**

| Skill | Para qué |
|---|---|
| `product-user-interview-script` | Script de entrevista con calentamiento, preguntas abiertas, profundización y debrief en caliente |
| `product-product-roadmap` | Roadmap por horizonte (now/next/later o quarterly) con fichas de iniciativa y "lo que NO entra" |
| `product-north-star-metric` | NSM con candidates evaluados contra 3 criterios, definición operativa, KPI tree y guardraíles |
| `product-feature-prd` | PRD operativo de feature con problema, hipótesis, scope, AC, métricas + guardraíles y rollout |
| `product-experiment-design` | Plan de A/B test con MDE, sample size, randomización y decision rules pre-resultado |
| `product-release-plan` | Plan de release end-to-end con hitos, owners, comms, enablement, rollout y kill switch |

**Finance (7)**

| Skill | Para qué |
|---|---|
| `finance-budget-plan` | Presupuesto con drivers, P&L mensualizado, headcount, capex y escenarios best/base/worst |
| `finance-financial-report` | Report financiero con P&L + Balance + Cash Flow, KPIs y variance commentary obligatorio |
| `finance-invoice-template` | Factura a cliente con campos fiscales del país, numeración consecutiva e impuestos |
| `finance-cash-forecast` | 13-week rolling cash forecast con posición semanal, alertas y escenarios |
| `finance-expense-policy` | Política de gastos cross-funcional con categorías, límites, workflow y per diem por tier |
| `finance-board-deck-financial` | Sección financiera del board deck con highlights, runway, KPIs selectivos, riesgos y asks |
| `finance-expense-report` | Submisión de gastos del empleado con detalle, totales, justificantes y self-check contra política |

**Legal (6)**

| Skill | Para qué |
|---|---|
| `legal-contract-template` | Borrador estructurado de contrato comercial (MSA/SOW/consulting/partnership/license) |
| `legal-nda-template` | NDA standalone (mutuo o unilateral) con Información Confidencial, exclusiones y remedies |
| `legal-privacy-policy` | Política de privacidad pública GDPR/CCPA/LGPD-compliant con bases legales y derechos |
| `legal-dpa-template` | DPA Art. 28 GDPR con anexos (TOMs, subprocesadores), notificación de brechas y SCCs |
| `legal-terms-of-service` | T&C / ToS con resumen de 3 min, cuenta, pricing, IP, limitación responsabilidad y consumo |
| `legal-compliance-checklist` | Checklist contra framework (GDPR/SOC 2/ISO 27001/HIPAA/PCI DSS) con gap analysis y plan |

**Design (6)**

| Skill | Para qué |
|---|---|
| `design-ui-component-spec` | Spec UI para handoff con anatomía, props, estados completos, responsive, tokens y AC |
| `design-design-token-set` | Set de design tokens (color/spacing/typography/radius/shadow/motion) con base + semánticos y multi-plataforma |
| `design-accessibility-audit` | Audit WCAG 2.2 con tabla SC, hallazgos por severidad, casos edge y score por nivel |
| `design-usability-test-plan` | Plan de usability test con tasks como objetivos, screener, SUS y síntesis con severidad |
| `design-design-handoff-checklist` | Checklist pre-handoff con tokens, estados, responsive, accesibilidad y sign-off designer + eng |
| `design-ds-component-doc` | Documentación canónica de componente del DS con variantes, props API, do/don't y versionado |

### Operations (parcial)

| Skill | Para qué |
|---|---|
| `operations-redmine` (v2 ejecutable) | Skill ejecutable contra Redmine API REST con 10 acciones (issues, projects, time entries) |

---

## Reglas básicas

- **Dónde va cada cosa:** definiciones en `.aigent/`, metadatos (PRD/tasks/config) en `.context/`, entregables **fuera de ambos**. Detalle en `_shared/output-rules.md`.
- **Naming:** prefijo de pertenencia obligatorio: `<dept>-` (especialistas y orquestadores), `shared-` (transversales). `_shared/` es organización del repo, no namespace runtime.
- **Skills:** la skill no declara qué agentes la usan. Cada agente lista sus skills en su sección `## Skills disponibles`.
- **Idioma:** frontmatter inglés, body español, archivos kebab-case.

Convenciones detalladas y estructura de `config.json` en `_shared/conventions.md`.

---

## Instalación

```bash
bash .aigent/IDE/install.sh           # Unix / macOS
.\.aigent\IDE\install.ps1             # Windows
```

El instalador cablea `BOSS.md` como entrada del IDE (referencia dinámica, no copia). Detalle en `.aigent/IDE/README.md`.

---

## Cómo extender

| Quieres… | Pasos |
|---|---|
| Añadir dept | Carpeta + copiar `_shared/orchestrator-template.md` + `agents/` (con `shared-agent-scaffold`) + `skills/` + actualizar BOSS y este README |
| Añadir agente | **Forma recomendada:** invocar la skill `shared-agent-scaffold` (modos `create-specialist` / `create-shared` / `create-stub` / `audit`). Genera el archivo siguiendo `_shared/conventions.md` §4-§5 y verifica el checklist estructural. |
| Auditar agente | Skill `shared-agent-scaffold` modo `audit` — comprueba frontmatter, secciones obligatorias, idioma, referencia a `output-rules.md`, y cruce con el orquestador del dept. |
| Añadir skill | **Forma recomendada:** delegar en `shared-skill-builder` (modos `create-v1` / `create-v2`). Recoge requisitos, lee `shared-skill-scaffold` (que cubre ambos modos en una sola plantilla) y valida con el engine antes de cerrar. |
| Auditar skill | Delegar en `shared-skill-builder` (modo `audit`) — detecta drift entre prosa y manifest, warnings, etc. |
| Añadir acción a skill v2 | Delegar en `shared-skill-builder` (modo `add-action`). |
| Configurar skill v2 | Delegar en `shared-skill-builder` (modo `configure`) — recoge valores de config y secrets faltantes, los persiste en `.context/`. |

Secciones obligatorias exactas en `_shared/conventions.md`. Para skills v2 ejecutables, ver §12-15 del mismo archivo.

---

## MCPs

Aigent no incluye MCPs ni los exige: cada usuario configura los suyos.

1. **Sin MCPs en system prompts.** Si están en el IDE con buena `description`, el modelo los invoca cuando aplique.
2. **Buena `description` siempre.** Es lo que ve el modelo.
3. **`config.json` es el inventario** vigente (`.context/config.json → mcps` para los globales y `.context/<proyecto>/config.json → mcps` para los específicos del proyecto). Lo rellena el orquestador del dept la primera vez, confirmando con el usuario. Es expectativa, no garantía — el IDE manda en runtime.

### Recomendados por departamento

A medida que cada dept se activa se rellena (nombre · para qué · doc oficial).

**Marketing**

| MCP | Para qué | Doc |
|---|---|---|
| Google Analytics | Tráfico y conversión | _pendiente_ |
| Search Console | Indexación, posicionamiento | _pendiente_ |
| WordPress | Lectura/escritura CMS | _pendiente_ |
| Brave Search / Firecrawl | Investigación, scraping | https://github.com/modelcontextprotocol/servers |

**Sales**

| MCP | Para qué | Doc |
|---|---|---|
| HubSpot | CRM, pipeline, contactos | _pendiente_ |
| Salesforce | CRM enterprise, oportunidades, forecasting | _pendiente_ |
| Pipedrive | Pipeline visual, gestión de deals | _pendiente_ |
| LinkedIn / Sales Navigator | Prospección, investigación de cuentas | _pendiente_ |
| Apollo / Hunter | Enriquecimiento de datos, emails verificados | _pendiente_ |

**Operations**

| MCP | Para qué | Doc |
|---|---|---|
| Redmine | Gestión de issues y tiempo (alternativa: usar la skill v2 `operations-redmine` ya incluida) | _pendiente_ |

**Software**

| MCP | Para qué | Doc |
|---|---|---|
| GitHub | Acceso a repos, PRs, issues, releases | _pendiente_ |
| GitLab | Acceso a repos, MRs, issues, pipelines | _pendiente_ |
| Filesystem | Lectura/escritura local del repo del proyecto | https://github.com/modelcontextprotocol/servers |
| Git | Operaciones git locales (status, diff, log, blame) | _pendiente_ |
| Sourcegraph / grep MCP | Búsqueda semántica/léxica en grandes bases de código | _pendiente_ |

**HR**

| MCP | Para qué | Doc |
|---|---|---|
| Greenhouse / Lever / Workable | ATS — gestión de candidatos, vacantes, scorecards | _pendiente_ |
| BambooHR / Personio | HRIS — empleados, ausencias, comp&ben | _pendiente_ |
| LinkedIn Recruiter | Sourcing activo de candidatos pasivos | _pendiente_ |
| DocuSign / HelloSign | Firma electrónica de ofertas y políticas | _pendiente_ |

**Product**

| MCP | Para qué | Doc |
|---|---|---|
| Amplitude / Mixpanel / GA4 | Product analytics, métricas, eventos | _pendiente_ |
| Productboard / Linear / Jira | Roadmap, priorización, gestión de iniciativas | _pendiente_ |
| Dovetail / Notion | Repositorio de research, entrevistas, síntesis | _pendiente_ |
| LaunchDarkly / GrowthBook | Feature flags, experimentos A/B | _pendiente_ |

**Finance**

| MCP | Para qué | Doc |
|---|---|---|
| QuickBooks / Xero / NetSuite / SAP | ERP y contabilidad — actuals, cierres, asientos | _pendiente_ |
| Plaid / Open Banking | Banca: posiciones, movimientos, conciliación | _pendiente_ |
| Stripe Invoicing / Holded | Facturación a clientes (AR) | _pendiente_ |
| Bill.com / Spendesk | AP, gestión de gasto y proveedores | _pendiente_ |
| Looker / Tableau / Google Sheets | BI y reporting financiero | _pendiente_ |

**Legal**

| MCP | Para qué | Doc |
|---|---|---|
| Ironclad / Juro / ContractWorks | CLM — gestión de contratos | _pendiente_ |
| DocuSign / HelloSign / Adobe Sign | Firma electrónica | _pendiente_ |
| OneTrust / Drata | Compliance, privacidad, certificaciones | _pendiente_ |
| Notion / Drive / Confluence | Repositorio documental | _pendiente_ |

**Design**

| MCP | Para qué | Doc |
|---|---|---|
| Figma | Lectura de frames, exports, libreria de componentes | _pendiente_ |
| FigJam | Workshops, journey maps, mapeos colaborativos | _pendiente_ |
| Notion / ZeroHeight | Documentación del design system | _pendiente_ |
| axe / Lighthouse / WAVE | Tooling automatizado de accesibilidad | _pendiente_ |
| Maze / UserTesting / Dovetail | Usability testing y repositorio de research | _pendiente_ |

**DevOps:** 🚧 al activar el dept.

`.aigent/IDE/.mcp.json` y `opencode.json` son plantillas técnicas, no recomendaciones. Ver `.aigent/IDE/README.md`.

---

## Casos de uso por departamento

Cada dept implementado tiene su propio `README.md` con ejemplos detallados de cada agente y cada skill: prompt de entrada, output esperado (estructura completa) y ruta donde se guarda. Útil para:

- Onboarding de usuarios nuevos al sistema.
- Referencia rápida de qué pedir y qué esperar.
- Inspiración cuando dudas si una skill encaja con tu caso.

| Departamento | README de casos de uso |
|---|---|
| `_shared/` (transversal) | [`departments/_shared/README.md`](./departments/_shared/README.md) |
| Marketing | [`departments/marketing/README.md`](./departments/marketing/README.md) |
| Sales | [`departments/sales/README.md`](./departments/sales/README.md) |
| Software | [`departments/software/README.md`](./departments/software/README.md) |
| HR | [`departments/hr/README.md`](./departments/hr/README.md) |
| Product | [`departments/product/README.md`](./departments/product/README.md) |
| Finance | [`departments/finance/README.md`](./departments/finance/README.md) |
| Legal | [`departments/legal/README.md`](./departments/legal/README.md) |
| Design | [`departments/design/README.md`](./departments/design/README.md) |

> Operations y DevOps no tienen README de casos de uso todavía porque están como stubs. Se redactarán cuando los depts se activen.

---

## Para profundizar

- `BOSS.md` — entrada global, bootstrap, routing.
- `_shared/conventions.md` — naming, frontmatter, estructura, `config.json`. Secciones 12-15: skills ejecutables (engine-v2), skills complejas, subset YAML, riesgos.
- `_shared/output-rules.md` — regla universal de outputs.
- `_shared/orchestrator-template.md` — plantilla para nuevos orquestadores.
- `_shared/agents/shared-skill-builder.md` — agente para crear / auditar skills.
- `_shared/skills/shared-skill-scaffold/SKILL.md` — plantilla canónica para skills (v1 + v2).
- `_shared/skills/shared-agent-scaffold/SKILL.md` — plantilla canónica para agentes (especialistas, compartidos, stubs).
- `v2/README.m                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
