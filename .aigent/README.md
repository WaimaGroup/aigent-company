# Aigent — Departamentos Agénticos con Claude

> Fuente de verdad del proyecto. Actualizar cuando se tome una decisión relevante.

Sistema de **departamentos de trabajo basados en agentes IA** para automatizar cada área de la empresa con Claude (y otros LLMs vía MCP). Plataforma principal: Claude Code / Cowork. Secundaria: OpenCode.

---

## Estructura

```
<raíz>/
├── .aigent/                          ← motor del sistema
│   ├── README.md · BOSS.md           ← este índice y el routing/bootstrap global
│   ├── departments/
│   │   ├── _shared/                  ← conventions, output-rules, orchestrator-template, agentes y skills compartidas
│   │   └── <dept>/                   ← <dept>-orchestrator.md + agents/ + skills/
│   ├── v2/                           ← engine ejecutable de skills v2 (HTTP)
│   └── IDE/                          ← instaladores, plantillas y runtime (ver IDE/README.md)
│       └── bin/                      ← launcher `run` + Node bundled en bin/deps/ (ver "Runtime")
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
| Software | ✅ implementado | completo | 4 / 4 | 20 (v1 prosa) |
| HR | ✅ implementado | completo | 4 / 4 | 7 (v1 prosa) |
| Product | ✅ implementado | completo | 3 / 3 | 6 (v1 prosa) |
| Finance | ✅ implementado | completo | 3 / 3 | 7 (v1 prosa) |
| Legal | ✅ implementado | completo | 4 / 4 | 6 (v1 prosa) |
| Design | ✅ implementado | completo | 4 / 4 | 6 (v1 prosa) |
| Operations | 🚧 parcial | completo (Redmine) | 0 / 4 (stubs) | 1 (`operations-redmine`, v2 ejecutable) |
| DevOps | 🚧 TODO | stub honesto | 0 / 4 (stubs) | 0 |
| _shared_ | ✅ activo | — | 2 (`shared-prd-agent`, `shared-skill-builder`) | 18 (2 meta + 8 business + 5 utility + 3 híbridas) |

**Stub honesto:** orquestador y agentes existen pero su body indica explícitamente que no deben delegar ni ejecutar, para que un cliente no seleccione un agente vacío. Al activar el dept se sustituyen con `_shared/orchestrator-template.md` y la skill `shared-agent-scaffold`.

> El número de 4 agentes por dept es indicativo, no obligatorio. Al activar un dept, revaluar si esos agentes son necesarios o si parte de su trabajo se cubre mejor con skills (más reutilizables y deterministas). **Más agentes ≠ mejor.**

---

## `_shared/` — transversal

**Agentes**

| Agente | Rol |
|---|---|
| `shared-prd-agent` | Captura de requisitos y redacción de PRDs, optimizado para humanos y agentes IA. |
| `shared-skill-builder` | Crear, auditar y configurar skills (v1 prosa o v2 ejecutable). Modos: `create-v1`, `create-v2`, `configure`, `audit`, `add-action`. |

**Skills** — tres categorías conviven en `_shared/skills/` sin subcarpetas, distinguidas por dominio (no por ubicación). Criterios para que una skill sea compartida en `conventions.md` §7.1; resumen: ≥2 depts la usan, entregable genuinamente idéntico, sin matices fuertes por dept. Se propagan automáticamente con cualquier dept que se instale.

*Meta — para construir el sistema:*

| Skill | Para qué |
|---|---|
| `shared-skill-scaffold` | Plantilla canónica para crear cualquier skill nueva (v1 prosa y v2 ejecutable). La invoca `shared-skill-builder`. |
| `shared-agent-scaffold` | Plantilla canónica para crear o auditar cualquier agente (especialista, compartido o stub). Modos: `create-specialist`, `create-shared`, `create-stub`, `audit`. |

*Business — entregables transversales que ≥2 depts consumen igual:*

| Skill | Para qué | Consumidores |
|---|---|---|
| `shared-competitive-analysis` | Matriz comparativa de competidores con whitespace y threat assessment | `marketing-planning`, `product-strategy-roadmap` |
| `shared-case-study` | Caso de éxito problema → solución → resultados medibles + citas | `marketing-creative`, `sales-enablement` |
| `shared-kpi-dashboard` | Dashboard de KPIs con target × variance × tendencia × commentary | `marketing-planning`, `product-metrics`, `finance-reporting`, `sales-crm` |
| `shared-stakeholder-map` | Mapa influencia × interés × posición × plan de engagement | `product-discovery`, `legal-risk`, `marketing-planning`, `sales-ae` |
| `shared-risk-matrix` | Matriz de riesgos con probabilidad × impacto × mitigación × owner | `legal-risk`, `software-architecture`, `finance-budgeting`, `product-strategy-roadmap` |
| `shared-okr-set` | OKRs (1-3 Os + 2-4 KRs cuantitativos) por ciclo con scoring | `product-metrics`, `hr-evaluation`, `marketing-planning` |
| `shared-journey-map` | Journey con fases × acciones × emociones × pain points × touchpoints | `design-ux-research`, `product-discovery` |
| `shared-deploy-checklist` | Checklist pre/durante/post-deploy adaptado a riesgo y estrategia | `software-architecture`, `software-coding` |

*Utility — utilidades técnicas con script propio, invocables por cualquier agente (corren vía el launcher; ver "Runtime"):*

| Skill | Para qué |
|---|---|
| `shared-base64` | Bidireccional base64 ↔ fichero: **decode** (base64 de un MCP → fichero real en `.context/.temp/<dept>/`, con verificación de magic bytes PNG/JPG/GIF/WEBP/SVG/PDF/ZIP) y **encode** (fichero → `.b64`, opcional data URI). Script `b64.cjs`. |
| `shared-http-download` | Descarga de uno o varios ficheros por GET HTTP(S) con resolución segura de nombre, aislamiento de errores por URL y tope de tamaño. Script `download.cjs`. |
| `shared-office-writer` | Genera `.docx`/`.xlsx` **nuevos** desde un spec JSON, sin dependencias (docx: párrafos, encabezados, negrita, tablas, hipervínculos; xlsx: hojas, número/fecha/fórmulas, ancho, cabecera). Solo escribe, no edita. Script `office.cjs`. |
| `shared-pdf-reader` | Lee **PDF** sin dependencias: extrae texto, metadatos, nº de páginas, busca términos y diagnostica fuentes. Maneja xref/ObjStm, FlateDecode/LZW, Type0/CID vía ToUnicode o cmap embebida (cubre pliegos PLACSP/iText). Solo lee. Script `pdf.cjs`. |
| `shared-logger` | Registro de trabajo (debug) por proyecto: traza estructurada en **JSON Lines** (`.context/<proyecto>/logger/session-<ts>.jsonl`) de delegaciones, skills, entregables, imputaciones, subidas y errores; consolida en un `.json` subible. Se adjunta al imputar/subir salvo que se diga lo contrario. Script `logger.cjs`. |

*Híbridas — tipo Híbrido (§16): instalan una librería npm en la caché compartida `.context/libs/` vía el helper `IDE/bin/lib-bootstrap.cjs` (npm bundled-or-system, versión fijada). Rompen el techo de las Local; coexisten con ellas:*

| Skill | Para qué | Librería |
|---|---|---|
| `shared-docx-rich` | Word con imágenes embebidas, header/footer + numeración de página, saltos de página, colores/tamaños de fuente, tablas con estilo. Contraparte rica de `shared-office-writer` (docx). Script `docx.cjs`. | `docx` |
| `shared-xlsx-rich` | Excel con fills de color, celdas combinadas, bordes, paneles congelados, formatos numéricos e imágenes. Contraparte rica de `shared-office-writer` (xlsx). Script `xlsx.cjs`. | `exceljs` |
| `shared-pdf-toolkit` | Edita/ensambla PDF: **merge** (unir), **split** (extraer páginas), **stamp** (sello/marca de agua). Contraparte escritora de `shared-pdf-reader`. Script `pdf.cjs`. | `pdf-lib` |

---

## Departamentos

### Marketing — ✅ implementado

Orquestador: `marketing-orchestrator.md`. Default de entregable: un solo `.md` (formatos extra solo a petición; excepción: `marketing-elementor-content`, multi-archivo).

| Agente | Cuándo delegarle | Skills |
|---|---|---|
| `marketing-creative` | Copy (blog, email, anuncios, prensa), storytelling y redes sociales (copies por plataforma, calendarios, hashtags, auditoría LinkedIn), voz de marca | `marketing-copy`, `marketing-social`, `marketing-brand-voice-guide`, `shared-case-study` |
| `marketing-planning` | Estrategia (planes, briefings, análisis competitivo, posicionamiento, KPIs/OKRs, lanzamientos) y SEO/analytics | `marketing-strategy`, `marketing-seo`, `shared-competitive-analysis`, `shared-stakeholder-map`, `shared-okr-set`, `shared-kpi-dashboard` |
| `marketing-web` | Landing pages, WordPress/Elementor, arquitectura de información, CRO | `marketing-landing-page`, `marketing-elementor-content`, `marketing-publish-checklist` |

| Skill | Entregable |
|---|---|
| `marketing-copy` | Copy en 4 formatos (`blog`/`email`/`anuncio`/`prensa`): post SEO, email con 3 asuntos A/B, anuncio con variantes y límites por plataforma, o nota de prensa |
| `marketing-social` | Redes en 3 modos: `adaptar`, `calendario` o `linkedin-audit` (alcance + copy plain-text) |
| `marketing-strategy` | Estrategia en 2 modos: `plan` (anual/trimestral) o `brief` (campaña) |
| `marketing-seo` | SEO en 2 modos: `research` (keyword research priorizado) u `on-page` (auditoría + versión optimizada) |
| `marketing-landing-page` | Estructura + copy de landing de conversión |
| `marketing-elementor-content` | Contenido Elementor: JSON `_elementor_data` + HTML fallback + metadata + `assets/` (SVGs y PNG @2x). Page/post/landing/block, widgets core. Multi-archivo |
| `marketing-publish-checklist` | Checklist SEO + UX + técnico antes de publicar en WordPress |
| `marketing-brand-voice-guide` | Guía de voz de marca: tono, vocabulario do/don't, adaptación por canal |

### Sales — ✅ implementado

Orquestador: `sales-orchestrator.md`.

| Agente | Cuándo delegarle | Skills |
|---|---|---|
| `sales-sdr` | Listas de prospectos por ICP, secuencias de outreach, investigación de cuentas, cualificación BANT/MEDDIC | `sales-prospecting-list`, `sales-outreach-sequence`, `sales-account-intelligence` |
| `sales-ae` | Propuestas, discovery calls, renovaciones, argumentarios, cierre | `sales-account-intelligence`, `sales-proposal`, `sales-discovery-call`, `sales-renewal-playbook`, `shared-stakeholder-map` |
| `sales-enablement` | Pitch decks, playbooks, battle cards, objeciones, casos de éxito | `sales-pitch-deck`, `sales-objection-handler`, `sales-playbook`, `shared-case-study` |
| `sales-crm` | Pipeline review, forecast formal, KPI dashboard, estructura de CRM | `sales-pipeline-review`, `sales-forecasting-report`, `shared-kpi-dashboard` |

| Skill | Entregable |
|---|---|
| `sales-prospecting-list` | Tabla de prospectos con investigación, hooks de personalización y campos por verificar |
| `sales-outreach-sequence` | Cadencia multi-step de email/LinkedIn con scripts y variables |
| `sales-account-intelligence` | Informe de Sales Intelligence: stack tech, pain points, stakeholders, secuencia de venta, estimación del deal |
| `sales-proposal` | Propuesta comercial con resumen ejecutivo, problema, solución, ROI, plan y pricing |
| `sales-pitch-deck` | Outline + script slide a slide para presentaciones en vivo |
| `sales-objection-handler` | Guía de objeciones con respuestas, follow-ups y señales excusa vs. real |
| `sales-playbook` | Playbook del proceso comercial: ICP, etapas, scripts, cualificación, métricas, onboarding |
| `sales-discovery-call` | Script + framework BANT/MEDDIC/SPICED con debrief estructurado y red flags |
| `sales-pipeline-review` | Revisión deal-by-deal con weighted forecast, health flags y acciones |
| `sales-renewal-playbook` | Renovación con health signals, timing, scripts por situación y concessions ladder |
| `sales-forecasting-report` | Forecast formal (commit/best/worst) con metodología, segmentación y riesgos. Board-ready |
| `sales-tender-search` | Búsqueda de licitaciones en feeds ATOM (PLACSP) por CPV/fechas/estado + descarga de pliegos (vía `shared-http-download`) y resumen accionable (vía `pdf`). Script `atom-search.cjs` |

### Software — ✅ implementado

Orquestador: `software-orchestrator.md`. Stack-agnóstico: agentes y skills se adaptan al lenguaje/framework del proyecto y no mencionan herramientas concretas en system prompts.

| Agente | Cuándo delegarle | Skills |
|---|---|---|
| `software-architecture` | Onboarding/kickoff de proyecto, diseño de sistemas, ADRs, stacks, runbooks, API/tech specs, spec-review, documentación técnica | `software-project-onboarding`, `software-adr`, `software-runbook`, `software-api-spec`, `software-tech-spec`, `software-spec-review`, `software-readme`, `software-code-docs-style`, `software-dev-guide`, `software-migration-guide`, `shared-risk-matrix`, `shared-deploy-checklist` |
| `software-coding` | Implementación (feature/bugfix/refactor/dependency-bump), commits, PRs, changelog | `software-feature-implementation`, `software-bugfix-workflow`, `software-refactor-plan`, `software-dependency-bump`, `software-commit-message`, `software-pr-description`, `software-changelog-entry`, `shared-deploy-checklist` |
| `software-code-review` | Review de PRs/diffs con severidades, 8 ejes y OWASP básico | `software-code-review-checklist` |
| `software-qa` | Estrategia de testing, planes por nivel, casos, bug reports | `software-test-plan`, `software-bug-report` |

| Skill | Entregable |
|---|---|
| `software-project-onboarding` | Kickoff de proyecto: clasificación NUEVO/EXISTENTE (Paso 0), descubrimiento o auditoría (hallazgos 🔴🟡🟢 + madurez 1-5), síntesis (veredicto, decisiones, plan) e informe persistido |
| `software-adr` | Architecture Decision Record con contexto, drivers, opciones, decisión, consecuencias, riesgos |
| `software-code-review-checklist` | Report de review con veredicto, top 3, hallazgos por severidad y análisis por 8 ejes |
| `software-test-plan` | Plan por niveles con casos priorizados (P0-P3), criterios de salida, riesgos |
| `software-runbook` | Runbook operacional: deploy, monitoring, alertas, playbooks por incidente, escalado |
| `software-api-spec` | Spec de API con endpoints, schemas, errores, pagination, versioning, deprecation |
| `software-tech-spec` | Spec intermedia entre PRD/ADR e implementación: data model, API changes, rollout |
| `software-bug-report` | Bug report con reproducción, expected vs actual, severidad, scope, entorno, evidencia |
| `software-spec-review` | Review y scoring (rubric de 6 dimensiones) de un spec con hallazgos y veredicto |
| `software-commit-message` | Mensaje de commit (Conventional Commits) desde el diff: subject + body + footer |
| `software-pr-description` | Descripción de PR cruzando spec + diff + commits: problema, cambio, testing, impacto |
| `software-changelog-entry` | Entrada Keep a Changelog desde los PRs del release, con BREAKING marcados |
| `software-feature-implementation` | Workflow de feature: pre-flight → ejecución → reporte (archivos, AC, TODOs, siguiente paso) |
| `software-bugfix-workflow` | Workflow de bug: reproduce → diagnose → fix → regression test + reporte al reporter |
| `software-refactor-plan` | Plan de refactor con scope IN/OUT, safety nets, validación, rollback |
| `software-dependency-bump` | Workflow para subir dependencia: assessment, plan de migración, validación, rollback |
| `software-readme` | README del proyecto adaptado al tipo (library/CLI/web/API) |
| `software-code-docs-style` | Guía de documentación inline: qué se comenta, docstrings por lenguaje, política TODO/FIXME |
| `software-dev-guide` | Guía de desarrollo: setup, estructura, common tasks, troubleshooting, workflow |
| `software-migration-guide` | Guía pública de migración X→Y: breaking changes, codemods, pasos, rollback |

### HR — ✅ implementado

Orquestador: `hr-orchestrator.md`. Maneja información sensible (compensación, evaluaciones) por defecto: nada se publica sin confirmar el nivel de privacidad. Solapamiento con Legal en políticas (capa HR vs. capa cumplimiento).

| Agente | Cuándo delegarle | Skills |
|---|---|---|
| `hr-recruitment` | JDs, sourcing, interview kits, scorecards, ofertas, bandas salariales | `hr-job-description`, `hr-compensation-band` |
| `hr-onboarding` | Planes 30/60/90, day-1, welcome pack, evaluación de período de prueba | `hr-onboarding-plan` |
| `hr-evaluation` | Performance reviews, 1:1s, feedback, OKRs personales, PIPs, eNPS, exit interviews | `hr-performance-review`, `hr-one-on-one-framework`, `hr-exit-interview`, `shared-okr-set` |
| `hr-policies` | Handbook, políticas individuales (remoto, vacaciones, conducta), comunicación de cambios | `hr-policy-document` |

| Skill | Entregable |
|---|---|
| `hr-job-description` | JD con EVP, responsabilidades, must/nice, banda salarial (pay-transparency por jurisdicción), proceso |
| `hr-performance-review` | Review con evidencia → impacto → competencias → rating con calibración → growth plan |
| `hr-policy-document` | Política individual con propósito, scope, reglas, procedimiento, excepciones, owner |
| `hr-onboarding-plan` | Plan 30/60/90 con pre-boarding, día 1, buddy program, evaluación de período de prueba |
| `hr-one-on-one-framework` | Framework de 1:1s con agenda recurrente, plantilla de notas, cadencia |
| `hr-compensation-band` | Banda salarial por rol × seniority × geografía con benchmark e internal equity check |
| `hr-exit-interview` | Guion + síntesis con categorización para people analytics agregado |

### Product — ✅ implementado

Orquestador: `product-orchestrator.md`. Strategy y roadmap se fusionan en un solo agente (misma disciplina por dos ejes), aplicando "más agentes ≠ mejor".

| Agente | Cuándo delegarle | Skills |
|---|---|---|
| `product-discovery` | User interviews, JTBD, opportunity-solution trees, validación, personas, journey | `product-user-interview-script`, `shared-stakeholder-map`, `shared-journey-map` |
| `product-strategy-roadmap` | Visión, posicionamiento, competitivo, priorización (RICE/MoSCoW), roadmap, PRDs, release plans | `product-product-roadmap`, `product-feature-prd`, `product-release-plan`, `shared-competitive-analysis`, `shared-stakeholder-map`, `shared-risk-matrix` |
| `product-metrics` | North star, OKRs producto, KPI trees, instrumentación, experiment design (A/B) | `product-north-star-metric`, `product-experiment-design`, `shared-kpi-dashboard`, `shared-okr-set` |

| Skill | Entregable |
|---|---|
| `product-user-interview-script` | Script con calentamiento, exploratorias, profundización, comportamiento, cierre, debrief |
| `product-product-roadmap` | Roadmap por horizonte (now/next/later) con fichas de iniciativa y "lo que NO entra" |
| `product-north-star-metric` | NSM con candidates evaluados, definición operativa, KPI tree, guardraíles |
| `product-feature-prd` | PRD de feature: problema, hipótesis, scope, AC, métricas + guardraíles, rollout |
| `product-experiment-design` | A/B test con MDE, sample size, randomización, decision rules pre-resultado |
| `product-release-plan` | Release end-to-end con hitos, owners, comms, enablement, rollout, kill switch |

### Finance — ✅ implementado

Orquestador: `finance-orchestrator.md`. El Paso 0.5 confirma moneda funcional, marco contable (IFRS/GAAP/PGC), año fiscal y periodicidad de cierre.

| Agente | Cuándo delegarle | Skills |
|---|---|---|
| `finance-budgeting` | Presupuestos, rolling forecasts, scenarios, headcount, capex, política de gastos | `finance-budget-plan`, `finance-expense-policy`, `shared-risk-matrix` |
| `finance-reporting` | Cierres, P&L/Balance/Cash Flow, KPI dashboards, board deck, AR/AP, conciliaciones | `finance-financial-report`, `finance-invoice-template`, `finance-board-deck-financial`, `finance-expense-report`, `shared-kpi-dashboard` |
| `finance-treasury` | Cash management, banca, FX, working capital, cash forecast 13-week | `finance-cash-forecast` |

| Skill | Entregable |
|---|---|
| `finance-budget-plan` | Presupuesto con drivers, P&L mensualizado, headcount, capex, escenarios best/base/worst |
| `finance-financial-report` | Report con P&L + Balance + Cash Flow, KPIs y variance commentary obligatorio |
| `finance-invoice-template` | Factura con campos fiscales del país, numeración consecutiva, impuestos y retenciones |
| `finance-cash-forecast` | 13-week rolling cash forecast con posición semanal, alertas, escenarios, FX |
| `finance-expense-policy` | Política de gastos: categorías, límites, workflow de aprobación, per diem por tier |
| `finance-board-deck-financial` | Sección financiera del board deck: highlights, runway, KPIs, riesgos, asks |
| `finance-expense-report` | Submisión de gastos con detalle, totales, justificantes y self-check contra política |

### Legal — ✅ implementado

Orquestador: `legal-orchestrator.md`. Produce **borradores y estructura, NO asesoría legal**: cada output marca `[REVISAR LEGAL]` los pasajes críticos y todo va validado por counsel humano. El Paso 0.5 confirma jurisdicciones y marcos aplicables. Solapamiento con HR: `legal-policies` cubre políticas externas (cliente); `hr-policies`, internas (empleado).

| Agente | Cuándo delegarle | Skills |
|---|---|---|
| `legal-contracts` | NDAs, MSAs, SOWs, licencias, partnerships, term sheets, LOIs | `legal-contract-template`, `legal-nda-template` |
| `legal-policies` | T&C, ToS, AUP, cookies, SLA público, disclaimers | `legal-terms-of-service` |
| `legal-privacy` | Privacidad, DPAs, DPIAs, ROPA, transferencias internacionales, DSAR, brechas | `legal-privacy-policy`, `legal-dpa-template` |
| `legal-risk` | Risk analysis, compliance por framework, due diligence, litigation, M&A | `legal-compliance-checklist`, `shared-risk-matrix`, `shared-stakeholder-map` |

| Skill | Entregable |
|---|---|
| `legal-contract-template` | Borrador de contrato (MSA/SOW/consulting/partnership/license) con cláusulas críticas marcadas |
| `legal-nda-template` | NDA (mutuo o unilateral) con Información Confidencial, exclusiones, duración, remedies |
| `legal-privacy-policy` | Política de privacidad GDPR/CCPA/LGPD con bases legales, plazos, transferencias, derechos |
| `legal-dpa-template` | DPA Art. 28 GDPR con anexos (TOMs, subprocesadores), notificación de brechas, SCCs |
| `legal-terms-of-service` | T&C/ToS con resumen de 3 min, cuenta, pricing, IP, limitación de responsabilidad, consumo |
| `legal-compliance-checklist` | Checklist contra framework (GDPR/SOC 2/ISO 27001/HIPAA/PCI DSS) con gap analysis y plan |

### Design — ✅ implementado

Orquestador: `design-orchestrator.md`. `design-ux-research` opera de forma autónoma sobre la interfaz (qué tan bien se resuelve), sin coordinación obligatoria con `product-discovery` (qué problema resolver). El Paso 0.5 confirma plataformas, brand de referencia, nivel WCAG (AA por defecto) e idiomas.

| Agente | Cuándo delegarle | Skills |
|---|---|---|
| `design-ui` | Layouts, mockups, prototipos, specs de pantallas/componentes con estados + responsive | `design-ui-component-spec`, `design-design-handoff-checklist` |
| `design-ux-research` | Usability testing, heuristic evaluation, journey mapping, friction analysis | `design-usability-test-plan`, `shared-journey-map` |
| `design-design-system` | Design tokens, foundations, componentes del DS, versionado con deprecations | `design-design-token-set`, `design-ds-component-doc` |
| `design-accessibility` | Audits WCAG 2.2 AA, ARIA, keyboard, screen readers, contraste, remediation plans | `design-accessibility-audit` |

| Skill | Entregable |
|---|---|
| `design-ui-component-spec` | Spec para handoff: anatomía, props/variantes, estados, responsive, tokens, a11y, AC |
| `design-design-token-set` | Tokens (color/spacing/typography/radius/shadow/motion) base + semánticos, light/dark, multi-plataforma, semver |
| `design-accessibility-audit` | Audit WCAG 2.2 con tabla SC, hallazgos por severidad, casos edge, score por nivel |
| `design-usability-test-plan` | Plan de usability test: tasks como objetivos, screener, script, SUS, síntesis con severidad |
| `design-design-handoff-checklist` | Checklist pre-handoff: tokens, estados, responsive, a11y, sign-off designer + eng |
| `design-ds-component-doc` | Doc canónica de componente del DS: variantes, props API, do/don't, a11y, versionado |

### Operations — 🚧 parcial

Orquestador stub honesto; los 4 agentes (`operations-processes`, `operations-automation`, `operations-kpis`, `operations-suppliers`) son stubs sin system prompt. Hay una skill v2 ejecutable funcional:

| Skill | Entregable |
|---|---|
| `operations-redmine` (v2) | Skill ejecutable contra la API REST de Redmine. 10 acciones: `list-issues`, `get-issue`, `create-issue`, `update-issue`, `add-note`, `list-projects`, `log-time`, `list-activities`, `list-time-entries`, `update-time-entry` |

> Se ejecuta vía `.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs run operations-redmine <action>` aunque los agentes del dept no estén implementados todavía.

### DevOps — 🚧 TODO

Orquestador stub honesto y 4 agentes stub previstos (`devops-infrastructure`, `devops-pipeline`, `devops-monitoring`, `devops-incident`). Al activarlo se redactará con `_shared/orchestrator-template.md` y `shared-agent-scaffold`.

---

## Reglas básicas

- **Dónde va cada cosa:** definiciones en `.aigent/`, metadatos (PRD/tasks/config) en `.context/`, entregables **fuera de ambos**. Detalle en `_shared/output-rules.md`.
- **Naming:** prefijo de pertenencia obligatorio — `<dept>-` (especialistas y orquestadores), `shared-` (transversales). `_shared/` es organización del repo, no namespace runtime.
- **Skills:** la skill no declara qué agentes la usan; cada agente lista sus skills en su sección `## Skills disponibles`.
- **Idioma:** frontmatter en inglés, body en español, archivos en kebab-case.

Convenciones detalladas y estructura de `config.json` en `_shared/conventions.md`.

---

## Runtime — el launcher `IDE/bin/run`

Las skills con script (`.cjs`/`.mjs`) y el engine v2 **nunca se invocan con `node` a secas**, sino a través del launcher:

```
.aigent/IDE/bin/run <script> [args...]
```

Los IDEs (Claude Code, OpenCode) se distribuyen como binarios nativos con runtime embebido **no expuesto en el `PATH`**, así que no hay garantía de que el usuario tenga `node`. El launcher lo resuelve dinámicamente: Node **bundled** en `IDE/bin/deps/node[.exe]` → fallback a `node` del sistema en `PATH` → suelo de versión Node ≥ 20 → error claro.

El instalador descarga el Node bundled (versión LTS fijada en `IDE/bin/deps/.node-version`) a `IDE/bin/deps/`; el binario nunca se commitea. Inspección e instalación aislada del runtime:

```
.aigent/IDE/install.sh --node-status          # qué Node hay (sistema + bundled + pin)
.aigent/IDE/install.sh --node-install         # descarga/asegura el Node bundled
```

(o `-NodeStatus` / `-NodeInstall` en `install.ps1`, o el menú interactivo → **Runtime (Node)**). Contrato completo en `_shared/conventions.md` §12.7-bis.

---

## Instalación

```bash
bash .aigent/IDE/install.sh           # Unix / macOS / Git Bash
.\.aigent\IDE\install.ps1             # Windows (PowerShell)
```

El instalador copia agentes y skills al IDE, cablea `BOSS.md` como entrada (referencia dinámica, no copia), asegura el runtime Node y, en deployments, activa el `.gitignore` que ignora la copia vendorizada de `.aigent/`. Detalle y flags en `.aigent/IDE/README.md`.

---

## Cómo extender

| Quieres… | Cómo |
|---|---|
| Añadir dept | Carpeta + copiar `_shared/orchestrator-template.md` + `agents/` (con `shared-agent-scaffold`) + `skills/` + actualizar `BOSS.md` y este README |
| Añadir / auditar agente | Skill `shared-agent-scaffold` (modos `create-specialist` / `create-shared` / `create-stub` / `audit`) |
| Añadir / auditar skill | Agente `shared-skill-builder` (modos `create-v1` / `create-v2` / `audit`); valida con el engine antes de cerrar |
| Añadir acción a skill v2 | `shared-skill-builder` modo `add-action` |
| Configurar skill v2 | `shared-skill-builder` modo `configure` — recoge config y secrets faltantes y los persiste en `.context/` |

Secciones obligatorias exactas en `_shared/conventions.md`; para skills v2 ejecutables, §12-15.

---

## MCPs

Aigent no incluye MCPs ni los exige: cada usuario configura los suyos.

1. **Sin MCPs en system prompts.** Si están en el IDE con buena `description`, el modelo los invoca cuando aplica.
2. **`config.json` es el inventario** vigente (`mcps` en config global y por proyecto). Lo rellena el orquestador del dept la primera vez, confirmando con el usuario. Es expectativa, no garantía — el IDE manda en runtime.

Recomendados por departamento (nombre · para qué), a rellenar a medida que cada dept se activa:

- **Marketing:** Google Analytics, Search Console, WordPress, Brave Search / Firecrawl.
- **Sales:** HubSpot, Salesforce, Pipedrive, LinkedIn / Sales Navigator, Apollo / Hunter.
- **Operations:** Redmine (alternativa: la skill v2 `operations-redmine` ya incluida).
- **Software:** GitHub, GitLab, Filesystem, Git, Sourcegraph / grep MCP.
- **HR:** Greenhouse / Lever / Workable, BambooHR / Personio, LinkedIn Recruiter, DocuSign.
- **Product:** Amplitude / Mixpanel / GA4, Productboard / Linear / Jira, Dovetail / Notion, LaunchDarkly / GrowthBook.
- **Finance:** QuickBooks / Xero / NetSuite / SAP, Plaid / Open Banking, Stripe / Holded, Bill.com / Spendesk, Looker / Tableau / Sheets.
- **Legal:** Ironclad / Juro, DocuSign / Adobe Sign, OneTrust / Drata, Notion / Drive / Confluence.
- **Design:** Figma, FigJam, Notion / ZeroHeight, axe / Lighthouse / WAVE, Maze / UserTesting.
- **DevOps:** 🚧 al activar el dept.

`.aigent/IDE/.mcp.json` y `opencode.json` son plantillas técnicas, no recomendaciones. Ver `.aigent/IDE/README.md`.

---

## Casos de uso por departamento

Cada dept implementado tiene su propio `README.md` con ejemplos detallados por agente y skill (prompt de entrada, output esperado, ruta de guardado):

[`_shared`](./departments/_shared/README.md) · [Marketing](./departments/marketing/README.md) · [Sales](./departments/sales/README.md) · [Software](./departments/software/README.md) · [HR](./departments/hr/README.md) · [Product](./departments/product/README.md) · [Finance](./departments/finance/README.md) · [Legal](./departments/legal/README.md) · [Design](./departments/design/README.md)

> Operations y DevOps no tienen README de casos de uso todavía (stubs).

---

## Para profundizar

- `BOSS.md` — entrada global, bootstrap, routing.
- `_shared/conventions.md` — naming, frontmatter, estructura, `config.json`; §12-15 skills ejecutables (engine-v2), §12.7-bis runtime launcher.
- `_shared/output-rules.md` — regla universal de outputs.
- `_shared/orchestrator-template.md` — plantilla para nuevos orquestadores.
- `_shared/agents/shared-skill-builder.md` — agente para crear / auditar skills.
- `_shared/skills/shared-skill-scaffold/SKILL.md` — plantilla canónica de skills (v1 + v2).
- `_shared/skills/shared-agent-scaffold/SKILL.md` — plantilla canónica de agentes.
- `v2/README.md` — engine ejecutable v2: contrato HTTP, `validate`, `dry-run`, `run`.
- `IDE/README.md` — instaladores, flags, runtime y plantillas de IDE.
