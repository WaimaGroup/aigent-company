# Aigent — Departamentos Agénticos con Claude

> Fuente de verdad del proyecto. Actualizar cuando se tome una decisión relevante.

Sistema de **departamentos de trabajo basados en agentes IA** para automatizar cada área de la empresa con Claude (y otros LLMs vía MCP). Plataforma principal: Claude Code / Cowork. Secundaria: OpenCode. Racional del stack en `../.docs/decision-stack.docx`.

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
| Marketing | ✅ implementado | completo | 5 / 5 | 11 (v1 prosa) |
| Sales | ✅ implementado | completo | 4 / 4 | 7 (v1 prosa) |
| Operations | 🚧 parcial | stub honesto | 0 / 4 implementados | 1 (`redmine` v2 ejecutable) |
| Design | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| DevOps | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| Finance | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| HR | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| Legal | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| Product | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| Software | 🚧 TODO | stub honesto | 0 / 4 stub | 0 |
| _shared_ | ✅ activo | — | `shared-prd-agent`, `shared-skill-builder` | `skill-scaffold`, `agent-scaffold` |

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

| Skill | Cuándo usarla |
|---|---|
| `skill-scaffold` | Plantilla canónica para crear cualquier skill nueva (modos v1 prosa y v2 ejecutable). La invoca `shared-skill-builder`. |
| `agent-scaffold` | Plantilla canónica para crear o auditar cualquier agente del repo (especialista, compartido o stub honesto). Modos: `create-specialist`, `create-shared`, `create-stub`, `audit`. |

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
| `sales-ae` | Propuestas comerciales, argumentarios para reuniones, estrategia de cierre, análisis de deal | `account-intelligence`, `sales-proposal` |
| `sales-enablement` | Pitch decks, playbooks, battle cards, guías de objeciones, materiales de onboarding comercial | `pitch-deck`, `objection-handler`, `sales-playbook` |
| `sales-crm` | Reportes de pipeline, forecasting, análisis win/loss, estructura de CRM, métricas comerciales | (sin skills; trabaja sobre datos del usuario) |

**Skills (7, todas v1 prosa):**

| Skill | Entregable |
|---|---|
| `prospecting-list` | Tabla estructurada de prospectos con investigación, hooks de personalización y campos por verificar |
| `outreach-sequence` | Cadencia multi-step de email/LinkedIn con scripts y variables de personalización |
| `account-intelligence` | Informe completo de Sales Intelligence sobre una cuenta: stack tech, pain points, mapeo de servicios, stakeholders, secuencia de venta y estimación del deal |
| `sales-proposal` | Propuesta comercial completa con resumen ejecutivo, problema, solución, ROI, plan, pricing y próximos pasos |
| `pitch-deck` | Outline + script slide a slide del pitch deck para presentaciones en vivo |
| `objection-handler` | Guía estructurada de manejo de objeciones con respuestas, preguntas de seguimiento y señales de excusa vs. real |
| `sales-playbook` | Playbook completo del proceso comercial: ICP, etapas, scripts, framework de cualificación, métricas y onboarding de reps |

---

### Operations — 🚧 parcial

**Orquestador:** stub honesto. Los 4 agentes (`operations-processes`, `operations-automation`, `operations-kpis`, `operations-suppliers`) son stubs sin system prompt redactado.

**Skills (1, v2 ejecutable):**

| Skill | Entregable |
|---|---|
| `redmine` | Skill ejecutable contra la API REST de Redmine (engine-v2). 9 acciones: `list-issues`, `get-issue`, `create-issue`, `update-issue`, `add-note`, `list-projects`, `log-time`, `list-activities`, `list-time-entries`. |

> La skill `redmine` puede ejecutarse directamente vía `node .aigent/v2/engine/engine.js run redmine <action>` aunque los agentes especialistas del dept no estén implementados todavía.

---

### Design, DevOps, Finance, HR, Legal, Product, Software — 🚧 TODO

Cada uno con un orquestador stub honesto y 4 agentes stub. Cuando se activen, se redactarán siguiendo `_shared/orchestrator-template.md` y la skill `agent-scaffold`.

| Dept | Agentes stub previstos |
|---|---|
| Design | `design-ui`, `design-ux-research`, `design-design-system`, `design-accessibility` |
| DevOps | `devops-infrastructure`, `devops-pipeline`, `devops-monitoring`, `devops-incident` |
| Finance | `finance-budgeting`, `finance-invoicing`, `finance-reporting`, `finance-treasury` |
| HR | `hr-recruitment`, `hr-onboarding`, `hr-evaluation`, `hr-policies` |
| Legal | `legal-contracts`, `legal-policies`, `legal-privacy`, `legal-risk` |
| Product | `product-discovery`, `product-roadmap`, `product-strategy`, `product-metrics` |
| Software | `software-architecture`, `software-code-review`, `software-qa`, `software-docs` |

> El número de 4 agentes por dept es indicativo, no obligatorio. Al activar un dept, revaluar si esos 4 agentes son realmente necesarios o si parte de su trabajo se cubre mejor con skills (más reutilizables y deterministas). **Más agentes ≠ mejor.**

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

**Design, DevOps, Finance, HR, Legal, Product, Software:** 🚧 al activar cada dept.

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
- `../.docs/decision-stack.docx` — racional del stack.
