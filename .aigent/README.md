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
| Marketing | ✅ implementado | completo | 5 / 5 | 13 (v1 prosa) |
| Sales | ✅ implementado | completo | 4 / 4 | 11 (v1 prosa) |
| Software | ✅ implementado | completo | 4 / 4 | 7 (v1 prosa) |
| HR | ✅ implementado | completo | 4 / 4 | 7 (v1 prosa) |
| Product | ✅ implementado | completo | 3 / 3 | 6 (v1 prosa) |
| Finance | ✅ implementado | completo | 3 / 3 | 7 (v1 prosa) |
| Legal | ✅ implementado | completo | 4 / 4 | 6 (v1 prosa) |
| Design | ✅ implementado | completo | 4 / 4 | 6 (v1 prosa) |
| Operations | 🚧 parcial | stub honesto | 0 / 4 implementados | 1 (`redmine` v2 ejecutable) |
| DevOps | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| _shared_ | ✅ activo | — | `shared-prd-agent`, `shared-skill-builder` | 2 meta (`skill-scaffold`, `agent-scaffold`) + 7 business compartidas (v1 prosa) |

**Stub honesto:** orquestador y agentes existen pero su body indica explícitamente que no deben delegar ni ejecutar. Evita que un cliente seleccione un agente vacío. Cuando el dept se active, se sustituye usando `_shared/orchestrator-template.md` y la skill `agent-scaffold`.

---

## Detalle por departamento

### `_shared/` — transversal

**Agentes:**

| Agente | Rol |
|---|---|
| `shared-prd-agent` | Captura de requisitos y redacción de PRDs, optimizado para humanos y agentes IA. |
| `shared-skill-builder` | Crear, auditar y configurar skills (v1 prosa o v2 ejecutable engine-v2). Cinco modos: `create-v1`, `create-v2`, `configure`, `audit`, `add-action`. |

**Skills:**

`_shared/skills/` aloja dos categorías de skills conviviendo sin subcarpetas, distinguidas por dominio (no por ubicación):

**Meta-skills** — para construir el sistema:

| Skill | Cuándo usarla |
|---|---|
| `skill-scaffold` | Plantilla canónica para crear cualquier skill nueva (modos v1 prosa y v2 ejecutable). La invoca `shared-skill-builder`. |
| `agent-scaffold` | Plantilla canónica para crear o auditar cualquier agente del repo (especialista, compartido o stub honesto). Modos: `create-specialist`, `create-shared`, `create-stub`, `audit`. |

**Business-skills compartidas** — entregables transversales que ≥2 departments consumen con la misma estructura:

| Skill | Cuándo usarla | Agentes consumidores documentados |
|---|---|---|
| `competitive-analysis` | Matriz comparativa estructurada de competidores, whitespace, threat assessment | `marketing-strategy`, `product-strategy-roadmap` |
| `case-study` | Caso de éxito de cliente con problema → solución → resultados medibles + citas verbatim | `marketing-content`, `sales-enablement` |
| `kpi-dashboard` | Dashboard estructurado de KPIs con tendencia, variance y commentary | `marketing-seo`, `product-metrics`, `finance-reporting`, `sales-crm` |
| `stakeholder-map` | Mapa influencia × interés × posición × plan de engagement | `product-discovery`, `legal-risk`, `marketing-strategy`, `sales-ae` |
| `risk-matrix` | Matriz de riesgos por dimensión con probabilidad × impacto y mitigación | `legal-risk`, `software-architecture`, `finance-budgeting`, `product-strategy-roadmap` |
| `okr-set` | OKRs estructurados (1-3 Os + 2-4 KRs cuantitativos) por ciclo | `product-metrics`, `hr-evaluation`, `marketing-strategy` |
| `journey-map` | Journey map con fases × acciones × pensamientos × emociones × pain points × oportunidades × touchpoints | `design-ux-research`, `product-discovery` |

> **Criterios para `_shared/skills/`:** ver `conventions.md` §7.1. Resumen: ≥2 depts la usan + entregable genuinamente idéntico + sin matices fuertes por dept. Si una compartida empieza a divergir entre depts, se duplica en los depts (no se fuerza lo compartido).

> **Distribución:** `_shared/skills/` se propaga automáticamente con cualquier dept que el usuario seleccione en `install.sh` / `install.ps1`. No hay que tocar el installer al añadir una skill compartida nueva.

---

### Marketing — ✅ implementado

**Orquestador:** `marketing-orchestrator.md`

**Agentes (5):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `marketing-content` | Posts de blog, emails, anuncios, comunicados, copy persuasivo | `blog-post`, `email-campaign`, `ad-copy` |
| `marketing-strategy` | Planes de marketing, briefings de campaña, análisis competitivo, KPIs, lanzamientos | `marketing-plan`, `campaign-brief` |
| `marketing-seo` | Keyword research, optimización on-page, auditoría SEO, lectura de Analytics/Search Console | `keyword-research`, `seo-on-page` |
| `marketing-social` | Copies por plataforma (LinkedIn, Instagram, X, TikTok, FB), calendarios, hashtag strategy | `editorial-calendar`, `platform-adapter` |
| `marketing-web` | Landing pages, páginas de WordPress, arquitectura de información, CRO | `landing-page`, `publish-checklist` |

**Skills (11, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `blog-post` | Carpeta completa del post: `.md` + `.html` preview + `_content.html` para CMS + `assets/` + `analytics/` |
| `ad-copy` | Copy publicitario para Google/Meta/LinkedIn Ads con variantes A/B y respeto de límites por plataforma |
| `campaign-brief` | Briefing de campaña completo (objetivo, audiencia, canales, presupuesto, riesgos) |
| `editorial-calendar` | Calendario editorial mensual o semanal de redes sociales con pilares y mix |
| `email-campaign` | Email de marketing con asunto (3 variantes), preheader, cuerpo y CTA |
| `keyword-research` | Tabla priorizada de keywords con intención, volumen, dificultad y página destino |
| `landing-page` | Estructura + copy completo de landing de conversión |
| `marketing-plan` | Plan de marketing (anual o trimestral) con análisis, objetivos, canales, presupuesto y calendario |
| `platform-adapter` | Versiones de un mismo contenido adaptadas a cada red social |
| `publish-checklist` | Checklist completo SEO + UX + técnico antes de publicar en WordPress |
| `seo-on-page` | Auditoría + versión optimizada de contenido para SEO on-page |

---

### Sales — ✅ implementado

**Orquestador:** `sales-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `sales-sdr` | Listas de prospectos por ICP, secuencias de outreach (email/LinkedIn), investigación de cuentas, calificación BANT/MEDDIC | `prospecting-list`, `outreach-sequence`, `account-intelligence` |
| `sales-ae` | Propuestas, discovery calls, renewal management, argumentarios, estrategia de cierre | `account-intelligence`, `sales-proposal`, `discovery-call`, `renewal-playbook` + `stakeholder-map` (shared) |
| `sales-enablement` | Pitch decks, playbooks, battle cards, guías de objeciones, casos de éxito | `pitch-deck`, `objection-handler`, `sales-playbook` + `case-study` (shared) |
| `sales-crm` | Pipeline review operativo, forecast formal, KPI dashboard, estructura de CRM | `pipeline-review`, `forecasting-report` + `kpi-dashboard` (shared) |

**Skills (11, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `prospecting-list` | Tabla estructurada de prospectos con investigación, hooks de personalización y campos por verificar |
| `outreach-sequence` | Cadencia multi-step de email/LinkedIn con scripts y variables de personalización |
| `account-intelligence` | Informe completo de Sales Intelligence sobre una cuenta: stack tech, pain points, mapeo de servicios, stakeholders, secuencia de venta y estimación del deal |
| `sales-proposal` | Propuesta comercial completa con resumen ejecutivo, problema, solución, ROI, plan, pricing y próximos pasos |
| `pitch-deck` | Outline + script slide a slide del pitch deck para presentaciones en vivo |
| `objection-handler` | Guía estructurada de manejo de objeciones con respuestas, preguntas de seguimiento y señales de excusa vs. real |
| `sales-playbook` | Playbook completo del proceso comercial: ICP, etapas, scripts, framework de cualificación, métricas y onboarding de reps |
| `discovery-call` | Script + framework de cualificación BANT/MEDDIC/SPICED con debrief estructurado y red flags |
| `pipeline-review` | Revisión operativa deal-by-deal con weighted forecast, health flags, acciones acordadas |
| `renewal-playbook` | Playbook de renovación con health signals, timing, scripts por situación (🟢/🟡/🔴), concessions ladder |
| `forecasting-report` | Forecast formal (commit/best/worst) con metodología explícita, segmentación, win rates, riesgos. Board-ready |

---

### Software — ✅ implementado

**Orquestador:** `software-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `software-architecture` | Diseño de sistemas, ADRs, evaluación de stacks, modelado de dominio, runbooks operacionales, API specs, tech specs intermedias entre PRD e implementación | `adr`, `runbook`, `api-spec`, `tech-spec` + `risk-matrix` (shared) |
| `software-coding` | Implementación de features/fixes/migraciones a partir de specs (PRD/ADR/ticket), refactor, scripts utilitarios | (sin skills propias; trabaja sobre el repo del proyecto) |
| `software-code-review` | Review estructurado de PRs/diffs con severidades (🔴/🟠/🟡/🔵), 8 ejes, security básico (OWASP) | `code-review-checklist` |
| `software-qa` | Estrategia de testing, planes por nivel (unit/integration/e2e/perf/security), casos, criterios de aceptación, bug reports estructurados | `test-plan`, `bug-report` |

**Skills (7, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `adr` | Architecture Decision Record numerado y fechado con contexto, drivers, opciones, decisión, consecuencias y riesgos |
| `code-review-checklist` | Report de code review con veredicto, top 3, hallazgos por severidad y análisis por 8 ejes |
| `test-plan` | Plan de test por niveles con casos priorizados (P0-P3), criterios de salida verificables, riesgos y dependencias |
| `runbook` | Runbook operacional de un servicio: deploy, monitoring, alertas, playbooks por incidente, escalado, dependencias |
| `api-spec` | Especificación de API con endpoints, schemas, errores, pagination, versioning, deprecation |
| `tech-spec` | Spec técnica intermedia entre PRD/ADR e implementación: data model, API changes, edge cases, performance, security, rollout |
| `bug-report` | Bug report estructurado con reproducción, expected vs actual, severidad, scope, entorno, regresión, evidencia |

> Stack agnóstico: todos los agentes y skills se adaptan al lenguaje/framework del proyecto activo. No mencionan herramientas concretas en system prompts (regla §8 de conventions).

---

### HR — ✅ implementado

**Orquestador:** `hr-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `hr-recruitment` | JDs, sourcing, interview kits, screening, scorecards, ofertas, rejection, bandas salariales | `job-description`, `compensation-band` |
| `hr-onboarding` | Planes 30/60/90, day-1 checklist, welcome pack, evaluación de período de prueba | `onboarding-plan` |
| `hr-evaluation` | Performance reviews, 1:1s, feedback estructurado, OKRs personales, PIPs, eNPS, exit interviews | `performance-review`, `one-on-one-framework`, `exit-interview` + `okr-set` (shared) |
| `hr-policies` | Handbook del empleado, políticas individuales (remoto, vacaciones, conducta), comunicación de cambios | `policy-document` |

**Skills (7, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `job-description` | JD completo con EVP, responsabilidades, must/nice, banda salarial (pay-transparency consciente de jurisdicción), proceso, equidad |
| `performance-review` | Review estructurado con evidencia → impacto → competencias → rating con calibración → feedback listo para entregar → growth plan |
| `policy-document` | Política individual con propósito, scope, reglas, procedimiento, excepciones, consecuencias, owner y fecha de revisión |
| `onboarding-plan` | Plan 30/60/90 con pre-boarding, día 1 hora a hora, buddy program, evaluación de período de prueba, feedback bidireccional |
| `one-on-one-framework` | Framework de 1:1s con principios, agenda recurrente (cómo estás / status / bloqueos / desarrollo / feedback), plantilla de notas, cadencia |
| `compensation-band` | Banda salarial por rol × seniority × geografía con benchmark, internal equity check, decision matrix. Confidencial alto |
| `exit-interview` | Guion + síntesis estructurada de exit con categorización para people analytics agregado y recomendaciones derivadas |

> **Confidencialidad:** HR maneja información sensible por defecto (compensación, evaluaciones, conflictos). El orquestador y los agentes refuerzan que nada se publica sin confirmar nivel de privacidad esperado.
> **Solapamiento con Legal:** las políticas tienen capa HR (cómo aplica al empleado) y capa Legal (cumplimiento). Cuando Legal se active, coordinar entre ambos.

---

### Product — ✅ implementado

**Orquestador:** `product-orchestrator.md`

**Agentes (3):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `product-discovery` | User interviews, JTBD, opportunity-solution trees, validación de problema/solución, personas, customer journey | `user-interview-script` + `stakeholder-map`, `journey-map` (shared) |
| `product-strategy-roadmap` | Visión, posicionamiento, análisis competitivo, priorización (RICE/MoSCoW), roadmap, bets, PRDs de feature, release plans | `product-roadmap`, `feature-prd`, `release-plan` + `competitive-analysis`, `stakeholder-map`, `risk-matrix` (shared) |
| `product-metrics` | North star metric, OKRs producto, KPI trees, instrumentación, experiment design (A/B tests) | `north-star-metric`, `experiment-design` + `kpi-dashboard`, `okr-set` (shared) |

**Skills (6, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `user-interview-script` | Script con calentamiento, exploratorias, profundización (5 whys suave), preguntas de comportamiento, cierre, debrief en caliente |
| `product-roadmap` | Roadmap por horizonte (now/next/later o quarterly) con fichas de iniciativa, sección "Lo que NO entra (y por qué)", confianza explícita |
| `north-star-metric` | NSM con candidates evaluados contra 3 criterios, definición operativa, KPI tree, guardraíles, anti-patrones |
| `feature-prd` | PRD operativo de feature: problema, hipótesis, scope, user stories con AC, métricas + guardraíles, rollout plan |
| `experiment-design` | Plan de A/B test con hipótesis, MDE, sample size, randomización, decision rules pre-resultado (anti p-hacking) |
| `release-plan` | Plan de release end-to-end con hitos, owners por área, comms externa, enablement, rollout strategy, kill switch, post-launch review |

> **Composición revaluada:** los 4 stubs previstos (`product-discovery`, `product-roadmap`, `product-strategy`, `product-metrics`) se fusionan en 3: strategy y roadmap son la misma disciplina por dos ejes (qué/por qué + cuándo) y mantenerlos separados forzaba al orquestador a coordinarlos casi siempre. Aplicación de la regla "más agentes ≠ mejor" del CLAUDE.md.

---

### Finance — ✅ implementado

**Orquestador:** `finance-orchestrator.md`

**Agentes (3):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `finance-budgeting` | Presupuestos anuales/trimestrales, rolling forecasts, scenarios, headcount plan, capex, política de gastos | `budget-plan`, `expense-policy` + `risk-matrix` (shared) |
| `finance-reporting` | Cierres, P&L/Balance/Cash Flow, KPI dashboards, board financial deck, AR cycle (invoicing), AP cycle, expense reports, conciliaciones | `financial-report`, `invoice-template`, `board-deck-financial`, `expense-report` + `kpi-dashboard` (shared) |
| `finance-treasury` | Cash management, banca, FX exposure, working capital, cash forecast 13-week, short-term financing | `cash-forecast` |

**Skills (7, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `budget-plan` | Presupuesto estructurado con drivers, P&L mensualizado, headcount, capex, escenarios (best/base/worst) + sensibilidades, supuestos trazables |
| `financial-report` | Report con resumen adaptado a audiencia (board / leadership / externo), P&L + Balance + Cash Flow comparativos, KPI dashboard, variance commentary obligatorio |
| `invoice-template` | Factura a cliente con campos fiscales del país emisor, numeración consecutiva por serie, cálculo de impuestos y retenciones, términos de pago, notas legales |
| `cash-forecast` | 13-week rolling cash forecast con inflows/outflows por categoría, posición semanal, alertas por debajo de mínimo, escenarios, FX exposure |
| `expense-policy` | Política de gastos cross-funcional: categorías, límites, workflow de aprobación, viajes (per diem por tier), equipamiento, reembolsos |
| `board-deck-financial` | Sección financiera del board deck (5-10 slides): highlights, P&L, cash + runway, KPIs selectivos, variance, riesgos, asks |
| `expense-report` | Submisión de gastos de empleado con detalle, totales por categoría/proyecto, justificantes, self-check contra expense-policy |

> **Composición revaluada:** los 4 stubs previstos (`finance-budgeting`, `finance-invoicing`, `finance-reporting`, `finance-treasury`) se fusionan en 3: la facturación es altamente proceduralizada y vive mejor como skill (`invoice-template`) que como agente. `finance-reporting` absorbe el ciclo AR/AP por encajar con el ciclo contable. Aplicación de la regla "más agentes ≠ mejor" del CLAUDE.md.
> **Paso 0.5 amplía** con confirmación de moneda funcional, marco contable (IFRS/GAAP/PGC), año fiscal y periodicidad de cierre — datos críticos para cualquier output financiero.

---

### Legal — ✅ implementado

**Orquestador:** `legal-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `legal-contracts` | NDAs, MSAs, SOWs, licencias, partnerships, term sheets, LOIs, consulting agreements | `contract-template`, `nda-template` |
| `legal-policies` | T&C, Terms of Service, AUP, cookies, SLA público, disclaimers | `terms-of-service` |
| `legal-privacy` | Política de privacidad, DPAs, DPIAs, ROPA, transferencias internacionales, DSAR handling, gestión de brechas | `privacy-policy`, `dpa-template` |
| `legal-risk` | Risk analysis de decisiones, compliance reviews por framework, due diligence, litigation tracking, M&A, whistleblowing | `compliance-checklist` + `risk-matrix`, `stakeholder-map` (shared) |

**Skills (6, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `contract-template` | Borrador estructurado de contrato (MSA / SOW / consulting / partnership / license) con preámbulo, definiciones, cláusulas críticas marcadas |
| `nda-template` | NDA standalone (mutuo o unilateral) con definición de Información Confidencial, exclusiones, duración, devolución, remedies con injunctive relief |
| `privacy-policy` | Política de privacidad pública GDPR/CCPA/LGPD-compliant con responsable, finalidades con base legal, plazos, destinatarios, transferencias internacionales, derechos |
| `dpa-template` | DPA (Data Processing Agreement) GDPR Art. 28 con anexos (objeto, TOMs, subprocesadores), notificación de brechas (48h al controlador / 72h al supervisor), SCCs |
| `terms-of-service` | T&C / ToS con resumen de 3 minutos, cuenta, pricing, IP, AUP resumido, limitación responsabilidad, indemnización, terminación, derechos de consumo |
| `compliance-checklist` | Checklist estructurada contra framework (GDPR / SOC 2 / ISO 27001 / HIPAA / PCI DSS) con estado por control, gap analysis, remediation plan priorizado |

> **Aviso fundamental:** estos agentes producen **borradores y estructura, NO asesoría legal**. Cada output marca explícitamente `[REVISAR LEGAL]` los pasajes críticos. El orquestador rechaza emitir opinión vinculante; todo va validado por counsel humano antes de aplicarse.
> **Paso 0.5 amplía** con confirmación de jurisdicción principal, jurisdicciones de operación y marcos regulatorios aplicables (GDPR/CCPA/LGPD/sectoriales) — críticos para cualquier output legal.
> **Solapamiento con HR:** `hr-policies` cubre políticas internas (handbook, código de conducta, vacaciones). `legal-policies` cubre políticas externas dirigidas al usuario/cliente (T&C, ToS, AUP). Coordinación cuando una política tiene ambas capas.

---

### Design — ✅ implementado

**Orquestador:** `design-orchestrator.md`

**Agentes (4):**

| Agente | Cuándo delegarle | Skills propias |
|---|---|---|
| `design-ui` | Layouts, mockups, prototipos, specs de pantallas/componentes para handoff con estados completos + responsive | `ui-component-spec`, `design-handoff-checklist` |
| `design-ux-research` | Usability testing, heuristic evaluation, journey mapping, friction analysis, card sorting, tree testing | `usability-test-plan` + `journey-map` (shared) |
| `design-design-system` | Design tokens, foundations, componentes del DS con guidelines, versionado serio con deprecations | `design-token-set`, `ds-component-doc` |
| `design-accessibility` | Audits WCAG 2.2 AA por defecto, ARIA, keyboard, screen readers, contraste, focus management, remediation plans | `accessibility-audit` |

**Skills (6, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `ui-component-spec` | Spec UI para handoff con anatomía, props/variantes, estados completos, responsive, tokens consumidos, accesibilidad mínima, edge cases, criterios de aceptación |
| `design-token-set` | Set de design tokens por categoría (color/spacing/typography/radius/shadow/motion) con base + semánticos, light/dark, multi-plataforma, semver + política de deprecation, tabla de contraste WCAG |
| `accessibility-audit` | Audit WCAG 2.2 con scope, metodología, tabla SC con pass/fail/partial/N-A, hallazgos con severidad y categoría (DS fix / engineering fix), casos edge, score por nivel |
| `usability-test-plan` | Plan completo de usability test: hipótesis, tasks como objetivos del usuario, N de participantes, screener, script de sesión, SUS, debrief en caliente, síntesis con severidad |
| `design-handoff-checklist` | Checklist pre-handoff a engineering: tokens usados, estados completos, responsive, edge cases, accesibilidad mínima, Figma link, AC, sign-off designer + eng |
| `ds-component-doc` | Documentación canónica de componente del DS: anatomía, variantes, props/API multi-plataforma, estados, do/don't, audit a11y formal, tokens consumidos, versionado |

> **Decisión operativa clave:** `design-ux-research` opera de forma **autónoma como UX puro** sobre interfaces existentes o propuestas, **sin coordinación obligatoria con `product-discovery`**. Frontera: product-discovery investiga *qué problema resolver*; design-ux-research investiga *qué tan bien se resuelve con la interfaz*. Documentado en el system prompt del agente.
> **Paso 0.5 amplía** con confirmación de plataformas objetivo, brand de referencia (coordinación con marketing si existe), nivel WCAG objetivo (AA por defecto) e idioma(s) de interfaz.

---

### Operations — 🚧 parcial

**Orquestador:** stub honesto. Los 4 agentes (`operations-processes`, `operations-automation`, `operations-kpis`, `operations-suppliers`) son stubs sin system prompt redactado.

**Skills (1, v2 ejecutable):**

| Skill | Entregable |
|---|---|
| `redmine` | Skill ejecutable contra la API REST de Redmine (engine-v2). 9 acciones: `list-issues`, `get-issue`, `create-issue`, `update-issue`, `add-note`, `list-projects`, `log-time`, `list-activities`, `list-time-entries`. |

> La skill `redmine` puede ejecutarse directamente vía `node .aigent/v2/engine/engine.js run redmine <action>` aunque los agentes especialistas del dept no estén implementados todavía.

---

### DevOps — 🚧 TODO

Orquestador stub honesto y 4 agentes stub. Cuando se active, se redactará siguiendo `_shared/orchestrator-template.md` y la skill `agent-scaffold`.

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

### Agentes especialistas (35)

**Marketing (5)**

| Agente | Para qué |
|---|---|
| `marketing-content` | Redactar posts de blog, emails, copy publicitario, newsletters, comunicados y otros textos de marca |
| `marketing-strategy` | Diseñar planes de marketing, briefings de campaña, análisis competitivo y posicionamiento |
| `marketing-seo` | Investigar palabras clave, optimizar SEO on-page, auditar técnicamente y leer Analytics/Search Console |
| `marketing-social` | Adaptar contenido a redes sociales (LinkedIn, Instagram, X, TikTok) y mantener calendarios editoriales |
| `marketing-web` | Diseñar landing pages, contenido de WordPress y arquitectura de información orientada a conversión |

**Sales (4)**

| Agente | Para qué |
|---|---|
| `sales-sdr` | Generar listas de prospectos, secuencias de outreach personalizado y cualificación BANT/MEDDIC inicial |
| `sales-ae` | Redactar propuestas, conducir discovery calls, gestionar renovaciones y cerrar deals con stakeholder mapping |
| `sales-enablement` | Crear pitch decks, playbooks, battle cards, guías de objeciones y case studies para el equipo comercial |
| `sales-crm` | Producir pipeline reviews operativos, forecasts formales y dashboards de KPIs comerciales |

**Software (4 agentes activos + 1 implementador sin skill)**

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

### Skills compartidas (9 = 2 meta + 7 business) — `_shared/skills/`

| Skill | Para qué | Tipo |
|---|---|---|
| `skill-scaffold` | Plantilla canónica para crear cualquier skill nueva (v1 prosa o v2 ejecutable) | meta |
| `agent-scaffold` | Plantilla canónica para crear o auditar cualquier agente del repo (especialista, compartido, stub) | meta |
| `competitive-analysis` | Matriz comparativa estructurada de competidores con whitespace y threat assessment | business |
| `case-study` | Caso de éxito de cliente con problema → solución → resultados medibles + citas verbatim | business |
| `kpi-dashboard` | Dashboard estructurado de KPIs con métricas × target × variance × tendencia × commentary | business |
| `stakeholder-map` | Mapa de stakeholders con matriz influencia × interés × posición × plan de engagement | business |
| `risk-matrix` | Matriz de riesgos por dimensión con probabilidad × impacto × mitigación × owner | business |
| `okr-set` | OKRs estructurados (1-3 Os + 2-4 KRs cuantitativos) por ciclo con scoring | business |
| `journey-map` | Journey con fases × acciones × pensamientos × emociones × pain points × oportunidades × touchpoints | business |

### Skills dept-específicas (63)

**Marketing (13)**

| Skill | Para qué |
|---|---|
| `blog-post` | Post de blog completo con SEO, `.md` + `.html` y carpeta `assets/` |
| `ad-copy` | Copy publicitario para Google/Meta/LinkedIn Ads con variantes A/B y respeto de límites de plataforma |
| `campaign-brief` | Briefing de campaña con objetivo, audiencia, canales, presupuesto, KPIs y riesgos |
| `editorial-calendar` | Calendario editorial mensual/semanal de redes sociales con pilares y mix de contenido |
| `email-campaign` | Email de marketing con asunto (3 variantes), preheader, cuerpo y CTA |
| `keyword-research` | Tabla priorizada de keywords con intención, volumen, dificultad y página destino |
| `landing-page` | Estructura + copy de landing page de conversión |
| `marketing-plan` | Plan de marketing anual/trimestral con análisis, objetivos, canales, presupuesto y calendario |
| `platform-adapter` | Versiones de un contenido adaptadas a cada red social respetando límites |
| `publish-checklist` | Checklist SEO + UX + técnico antes de publicar en WordPress |
| `seo-on-page` | Auditoría + versión optimizada de contenido para SEO on-page |
| `linkedin-audit` | Análisis y optimización de un post de LinkedIn con copy plain-text listo para pegar |
| `brand-voice-guide` | Guía canónica de voz de marca con atributos de tono, vocabulario do/don't y adaptación por canal |

**Sales (11)**

| Skill | Para qué |
|---|---|
| `prospecting-list` | Tabla estructurada de prospectos con investigación, hooks y campos por verificar |
| `outreach-sequence` | Cadencia multi-step de email/LinkedIn con scripts y variables de personalización |
| `account-intelligence` | Informe completo de Sales Intelligence sobre una cuenta (stack, pain points, stakeholders) |
| `sales-proposal` | Propuesta comercial con resumen ejecutivo, problema, solución, ROI, plan, pricing |
| `pitch-deck` | Outline + script slide a slide de presentación de ventas |
| `objection-handler` | Guía de manejo de objeciones con respuestas y señales excusa vs problema real |
| `sales-playbook` | Playbook completo del proceso comercial con ICP, etapas, scripts, métricas |
| `discovery-call` | Script + framework de cualificación BANT/MEDDIC/SPICED con debrief estructurado |
| `pipeline-review` | Revisión operativa deal-by-deal con weighted forecast, health flags y acciones acordadas |
| `renewal-playbook` | Playbook de renovación con health signals, timing, scripts por situación y concessions ladder |
| `forecasting-report` | Forecast formal del periodo con commit/best/worst, metodología, segmentación y riesgos |

**Software (7)**

| Skill | Para qué |
|---|---|
| `adr` | Architecture Decision Record numerado y fechado con contexto, opciones, decisión y consecuencias |
| `code-review-checklist` | Report de code review con veredicto, top 3, hallazgos por severidad y análisis por 8 ejes |
| `test-plan` | Plan de test por niveles con casos priorizados (P0-P3), criterios de salida y riesgos |
| `runbook` | Runbook operacional para servicio en producción con deploy, monitoring, alertas y playbooks por incidente |
| `api-spec` | Especificación de API con endpoints, schemas, errores, pagination, versioning y deprecation |
| `tech-spec` | Spec técnica intermedia entre PRD/ADR e implementación con data model, API changes y rollout |
| `bug-report` | Bug report estructurado con reproducción, expected/actual, severidad, scope, entorno y evidencia |

**HR (7)**

| Skill | Para qué |
|---|---|
| `job-description` | JD completo con EVP, responsabilidades, must/nice, banda salarial y proceso |
| `performance-review` | Performance review con evidencia → impacto → competencias → rating → growth plan |
| `policy-document` | Política individual con propósito, scope, reglas, procedimiento, excepciones y owner |
| `onboarding-plan` | Plan 30/60/90 días con pre-boarding, día 1, buddy program y evaluación de período de prueba |
| `one-on-one-framework` | Framework canónico de 1:1s con agenda, plantilla de notas, cadencia y anti-patrones |
| `compensation-band` | Banda salarial por rol × seniority × geografía con benchmark e internal equity check |
| `exit-interview` | Guion + síntesis con categorización para people analytics agregado y recomendaciones |

**Product (6)**

| Skill | Para qué |
|---|---|
| `user-interview-script` | Script de entrevista con calentamiento, preguntas abiertas, profundización y debrief en caliente |
| `product-roadmap` | Roadmap por horizonte (now/next/later o quarterly) con fichas de iniciativa y "lo que NO entra" |
| `north-star-metric` | NSM con candidates evaluados contra 3 criterios, definición operativa, KPI tree y guardraíles |
| `feature-prd` | PRD operativo de feature con problema, hipótesis, scope, AC, métricas + guardraíles y rollout |
| `experiment-design` | Plan de A/B test con MDE, sample size, randomización y decision rules pre-resultado |
| `release-plan` | Plan de release end-to-end con hitos, owners, comms, enablement, rollout y kill switch |

**Finance (7)**

| Skill | Para qué |
|---|---|
| `budget-plan` | Presupuesto con drivers, P&L mensualizado, headcount, capex y escenarios best/base/worst |
| `financial-report` | Report financiero con P&L + Balance + Cash Flow, KPIs y variance commentary obligatorio |
| `invoice-template` | Factura a cliente con campos fiscales del país, numeración consecutiva e impuestos |
| `cash-forecast` | 13-week rolling cash forecast con posición semanal, alertas y escenarios |
| `expense-policy` | Política de gastos cross-funcional con categorías, límites, workflow y per diem por tier |
| `board-deck-financial` | Sección financiera del board deck con highlights, runway, KPIs selectivos, riesgos y asks |
| `expense-report` | Submisión de gastos del empleado con detalle, totales, justificantes y self-check contra política |

**Legal (6)**

| Skill | Para qué |
|---|---|
| `contract-template` | Borrador estructurado de contrato comercial (MSA/SOW/consulting/partnership/license) |
| `nda-template` | NDA standalone (mutuo o unilateral) con Información Confidencial, exclusiones y remedies |
| `privacy-policy` | Política de privacidad pública GDPR/CCPA/LGPD-compliant con bases legales y derechos |
| `dpa-template` | DPA Art. 28 GDPR con anexos (TOMs, subprocesadores), notificación de brechas y SCCs |
| `terms-of-service` | T&C / ToS con resumen de 3 min, cuenta, pricing, IP, limitación responsabilidad y consumo |
| `compliance-checklist` | Checklist contra framework (GDPR/SOC 2/ISO 27001/HIPAA/PCI DSS) con gap analysis y plan |

**Design (6)**

| Skill | Para qué |
|---|---|
| `ui-component-spec` | Spec UI para handoff con anatomía, props, estados completos, responsive, tokens y AC |
| `design-token-set` | Set de design tokens (color/spacing/typography/radius/shadow/motion) con base + semánticos y multi-plataforma |
| `accessibility-audit` | Audit WCAG 2.2 con tabla SC, hallazgos por severidad, casos edge y score por nivel |
| `usability-test-plan` | Plan de usability test con tasks como objetivos, screener, SUS y síntesis con severidad |
| `design-handoff-checklist` | Checklist pre-handoff con tokens, estados, responsive, accesibilidad y sign-off designer + eng |
| `ds-component-doc` | Documentación canónica de componente del DS con variantes, props API, do/don't y versionado |

### Operations (parcial)

| Skill | Para qué |
|---|---|
| `redmine` (v2 ejecutable) | Skill ejecutable contra Redmine API REST con 10 acciones (issues, projects, time entries) |

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
| Añadir dept | Carpeta + copiar `_shared/orchestrator-template.md` + `agents/` (con `agent-scaffold`) + `skills/` + actualizar BOSS y este README |
| Añadir agente | **Forma recomendada:** invocar la skill `agent-scaffold` (modos `create-specialist` / `create-shared` / `create-stub` / `audit`). Genera el archivo siguiendo `_shared/conventions.md` §4-§5 y verifica el checklist estructural. |
| Auditar agente | Skill `agent-scaffold` modo `audit` — comprueba frontmatter, secciones obligatorias, idioma, referencia a `output-rules.md`, y cruce con el orquestador del dept. |
| Añadir skill | **Forma recomendada:** delegar en `shared-skill-builder` (modos `create-v1` / `create-v2`). Recoge requisitos, lee `skill-scaffold` (que cubre ambos modos en una sola plantilla) y valida con el engine antes de cerrar. |
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
| Redmine | Gestión de issues y tiempo (alternativa: usar la skill v2 `redmine` ya incluida) | _pendiente_ |

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

## Para profundizar

- `BOSS.md` — entrada global, bootstrap, routing.
- `_shared/conventions.md` — naming, frontmatter, estructura, `config.json`. Secciones 12-15: skills ejecutables (engine-v2), skills complejas, subset YAML, riesgos.
- `_shared/output-rules.md` — regla universal de outputs.
- `_shared/orchestrator-template.md` — plantilla para nuevos orquestadores.
- `_shared/agents/shared-skill-builder.md` — agente para crear / auditar skills.
- `_shared/skills/skill-scaffold/SKILL.md` — plantilla canónica para skills (v1 + v2).
- `_shared/skills/agent-scaffold/SKILL.md` — plantilla canónica para agentes (especialistas, compartidos, stubs).
- `v2/README.md` — engine ejecutable v2 (HTTP, validate, dry-run).
