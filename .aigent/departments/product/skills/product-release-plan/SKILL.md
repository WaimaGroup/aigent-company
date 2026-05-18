---
name: "product-release-plan"
user-invocable: true
description: >
  Skill for producing a release plan with GTM checklist: scope, target date,
  dependencies, communication plan (internal + external), enablement (sales,
  support, success), launch tier (silent/beta/major), success criteria,
  monitoring plan, rollback plan, post-launch review schedule.
---

# Skill: Release Plan

**Entregable:** archivo `.md` con plan de release ejecutable de extremo a extremo. Vive en `<proyecto>/product/strategy/roadmap/releases/<release-slug>.md`.

---

## Cuándo usar esta skill

- Hay un lanzamiento con coordinación entre Product, Engineering, Marketing, Sales y Support.
- Una feature material entra a producción y necesita comunicación + enablement organizado.
- Se prepara un release "major" (cambio visible al usuario) o un "beta" (cohort restringida).
- Se documenta el lanzamiento de una feature pequeña pero que requiere coordinación cross-team.

**Cuándo NO usar:**

- Para deploy técnico estándar (eso es runbook + pipeline CI/CD).
- Para release notes finales (eso es un output puntual; el release-plan incluye drafts pero las finales son derivadas).
- Para feature pequeña sin impacto en usuarios o que no requiere coordinación (basta con feature-prd + PR).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Feature / release | Nombre y descripción |
| Tier | Silent (sin comunicación) / Beta (cohort restringida) / Minor / Major / Flagship |
| Fecha objetivo | Día/semana de lanzamiento |
| PRD link | Documento source-of-truth |
| Audiencia | ¿Todos los usuarios? ¿Segmento? ¿Solo enterprise? |
| Equipos implicados | Product, Eng, Design, Marketing, Sales, Support, Legal |
| Dependencias críticas | Otros lanzamientos, integraciones externas, compliance |
| Riesgo / reversibilidad | ¿Reversible vía feature flag? ¿Migraciones de datos? |

---

## Plantilla del entregable

Nombre del archivo: `<release-slug>.md` (ej. `webhooks-v1-release.md`).

```markdown
---
type: "release-plan"
release_name: "<Nombre>"
release_slug: "<kebab-case>"
tier: "silent | beta | minor | major | flagship"
target_date: "YYYY-MM-DD"
status: "draft | approved | in-execution | shipped | post-mortem"
prd_link: "<URL>"
audience: "all-users | segment <name> | beta-cohort | internal-only"
pm_owner: "<nombre>"
release_manager: "<nombre>"
date_created: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
---

# Release Plan — <Release Name>

## 0. TL;DR

> 5-7 líneas. Qué lanzamos, cuándo, para quién, riesgo principal, rollback plan.

**Tier:** <Silent / Beta / Minor / Major / Flagship>

**Target date:** <fecha>

**Audiencia:** <descripción>

**Status overall:** <on-track / at-risk / blocked>

---

## 1. Scope del release

### In-scope

- <Funcionalidad 1>
- <Funcionalidad 2>
- <Funcionalidad 3>

### Out-of-scope (explícito)

- <Lo que NO entra en este release>
- <Phase 2 anunciada>

---

## 2. Equipos y owners

| Área | Owner | Notas |
|---|---|---|
| Product (PM) | <nombre> | Source of truth del PRD |
| Engineering | <tech lead> | Build + deploy |
| Design | <designer> | Mockups + handoff |
| Marketing | <marketing lead> | Comms externa + content |
| Sales | <sales lead> | Enablement equipo comercial |
| Support / CS | <support lead> | FAQ + training a soporte |
| Legal (si aplica) | <legal> | Revisión T&C / privacy si cambia |
| Release Manager | <persona> | Coordinación general |

---

## 3. Timeline y hitos

| Hito | Fecha objetivo | Owner | Status |
|---|---|---|---|
| Feature complete (code freeze para release) | <fecha> | Eng | <on-track/at-risk> |
| QA + bug fixes round | <fecha> | QA | |
| Internal dogfooding | <fecha> | All | |
| Marketing content listo (blog post, email, social) | <fecha> | Marketing | |
| Sales enablement listo (deck update, battle cards) | <fecha> | Sales | |
| Support FAQ + training | <fecha> | Support | |
| Beta cohort acceso (si tier = beta o staged) | <fecha> | PM | |
| Full launch | <fecha> | RM | |
| Post-launch review | <fecha + 1 semana> | PM | |

---

## 4. Dependencias

| Dependencia | Owner externo | Estado | Bloquea release? |
|---|---|---|---|
| <Migración de DB en producción> | DBA team | <estado> | Sí — sin esto no se puede activar |
| <Integración con proveedor X> | <Vendor> | <estado> | Solo si está activado para enterprise |
| <Decisión legal sobre T&C nuevo> | Legal | <estado> | Solo si afecta a contratación nueva |

---

## 5. Rollout strategy

### Tier-specific approach

#### Silent

- Deploy a producción sin comunicación externa.
- Feature flag off por default.
- Activación manual cuando un cliente concreto la pide.

#### Beta

- Feature flag on para cohort beta (5-50 cuentas seleccionadas).
- Comunicación a beta cohort: email + in-app banner.
- Feedback channel: <Slack channel / form / dedicated CSM>.
- Duración beta: <X semanas>.
- Criterios para pasar a Minor/Major: <listado>.

#### Minor

- Activación gradual: 10% → 50% → 100% en 2-3 semanas si monitoring OK.
- Comunicación externa modesta: blog post + email a usuarios afectados.
- Sin in-app push.

#### Major

- Activación gradual con monitor diario.
- Comunicación externa amplia: blog post, email, social, in-app announcement, video opcional.
- Sales enablement actualizado.
- Soporte preparado con FAQ + scripts.

#### Flagship

- Como Major + posible press release + investor update + co-marketing.
- Pre-briefing a clientes top antes del launch.
- Q&A live al día siguiente.

### Plan de rollout para este release

| Stage | % tráfico / cohort | Duración | Criterio para pasar al siguiente |
|---|---|---|---|
| Internal | Empleados | 1 semana | Sin bugs críticos |
| Beta | 5% cuentas selectas | 2 semanas | Adopción > 60% + sin churn cohort |
| Stage 1 | 25% tráfico | 3 días | Métricas guardraíl OK |
| Stage 2 | 100% | — | — |

---

## 6. Feature flag y kill switch

- **Flag name:** `<flag_name>`
- **Default value:** off
- **Quién puede activar/desactivar:** <rol>
- **Granularidad:** <por cuenta / por usuario / por % tráfico>
- **Kill switch en producción:** desactivar flag completamente. Tiempo aproximado: <X min>.

---

## 7. Comunicación externa

### A usuarios afectados

| Canal | Contenido | Owner | Fecha |
|---|---|---|---|
| Email | Anuncio del release a usuarios | Marketing | <fecha launch> |
| In-app banner | Notificación visible al login | Product + Eng | <fecha launch> |
| Blog post | Detalle de la feature, casos de uso | Marketing | <fecha launch> |
| Help center / docs | Documentación actualizada | Support | <pre-launch> |
| Changelog / release notes | Línea concisa | PM | <fecha launch> |

### A non-users (potential customers)

| Canal | Contenido | Owner | Fecha |
|---|---|---|---|
| Social posts (LinkedIn, X, …) | Anuncio + hilo de detalle | Marketing | <fecha + days> |
| Webinar / demo (si aplica) | Live demo de la feature | Product + Sales | <fecha + week> |
| Press release (si flagship) | Comunicado de prensa | Marketing + PR | <fecha launch> |

### Templates a preparar

> Cada item linkea al draft o location donde se guardará.

- [ ] Draft email a usuarios: `<link>`
- [ ] Draft blog post: `<link>`
- [ ] Draft social copy (LinkedIn, X, Instagram, …): `<link>`
- [ ] Draft in-app message: `<link>`
- [ ] Draft FAQ: `<link>`

---

## 8. Enablement interno

### Sales

- [ ] Pitch deck actualizado con la feature: <link>
- [ ] Battle cards actualizadas: <link>
- [ ] Training session a equipo de ventas: <fecha>
- [ ] FAQ específica para sales: <link>
- [ ] Casos de uso para venta cross-sell/upsell: <link>

### Support / Customer Success

- [ ] FAQ pública: <link>
- [ ] Macros de soporte preparadas (frases comunes con respuesta): <link>
- [ ] Training a equipo de support: <fecha>
- [ ] Escalation paths para casos límite: <link a runbook>

### Marketing

- [ ] Activos visuales (screenshots, video corto): <link a carpeta de assets>
- [ ] Content calendar actualizado con posts del release: <link>
- [ ] SEO keywords objetivo: <listado>
- [ ] Influencers / partners notificados: <listado>

---

## 9. Criterios de éxito y monitoring

### Métricas de éxito (días/semanas post-launch)

| Métrica | Baseline | Target | Plazo |
|---|---|---|---|
| % cuentas que adoptan la feature | <0%> | <X%> | <4 semanas> |
| Tickets de soporte relacionados | <baseline> | <% increase tolerable> | <2 semanas> |
| Engagement (sessions feature/MAU) | — | <X> | <4 semanas> |
| Retention de cohort que adopta | <baseline> | <+X pp vs no-adopters> | <12 semanas> |

### Métricas guardraíl (NO deben empeorar)

| Métrica | Threshold |
|---|---|
| Error rate global | < +0.5% |
| P99 latency | < +10% |
| Soporte ticket volume total | < +20% |
| Churn rate en cohort que adopta | < baseline |

### Dashboards y alertas

- **Dashboard de adopción:** <link>
- **Dashboard técnico de salud:** <link al runbook>
- **Alertas activas durante rollout:** <listado>

---

## 10. Riesgos y mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| <Adopción muy baja> | Media | Medio | Push activo desde sales + email follow-up |
| <Bug crítico en producción> | Baja | Alto | Feature flag rollback + comunicación en status page |
| <Carga inesperada del backend> | Media | Alto | Pre-load test + alerta en queue depth |
| <Reacción negativa de usuarios power> | Baja | Medio | Pre-briefing a 5 cuentas top antes del launch |
| <Confusión con feature anterior similar> | Media | Bajo | FAQ específico + macros de soporte |

---

## 11. Rollback plan

### Triggers para rollback

- 🔴 Bug crítico que afecta a >1% usuarios → rollback inmediato.
- 🟠 Métrica guardraíl empeora ≥ threshold 24h → evaluar rollback.
- 🟡 Adopción <5% del target tras 2 semanas → considerar reposicionamiento, no rollback automático.

### Procedimiento de rollback

1. **Decisor:** Release Manager + Tech Lead.
2. **Comando:** desactivar feature flag `<flag_name>` (<X min>).
3. **Comunicación inmediata:**
   - Internal Slack #releases: anuncio.
   - Status page si es visible al usuario.
   - Soporte: macro de respuesta preparada.
4. **Post-rollback:**
   - Bug fix y re-release tras validación.
   - Comunicación a usuarios afectados con explicación + plazo nuevo.
   - Post-mortem.

---

## 12. Post-launch review

> Fecha: <1 semana / 1 mes post-launch>.

### Preguntas a responder

- ¿Métricas de éxito en track o desviadas?
- ¿Métricas guardraíl OK?
- ¿Feedback cualitativo de usuarios?
- ¿Qué funcionó del rollout?
- ¿Qué no funcionó?
- ¿Aprendizajes para próximos releases?

### Decisión derivada

- ☐ **Mantener feature shippada** — análisis final en <fecha>.
- ☐ **Iterar feature** — backlog de mejoras detectadas.
- ☐ **Sunset feature** — adopción no justifica mantener.
- ☐ **Reposicionar** — adopción baja porque el target audience no la entiende; ajustar comunicación.

---

## 13. Comunicación interna del estado del release

> Updates regulares al equipo durante la preparación.

- **Frecuencia:** semanal antes del launch, diaria los días anteriores.
- **Canal:** <Slack #releases / standup recurrente>
- **Owner del update:** Release Manager.
- **Formato del update:** status by area + bloqueos + decisiones pendientes.

---

## 14. Anexos

- PRD: <link>
- Tech spec: <link>
- Design / mockups: <link>
- API spec (si aplica): <link>
- Runbook del servicio (si aplica): <link>
- Drafts de comunicación: <link a carpeta>
- Lessons learned de releases anteriores comparables: <link>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin PRD aprobado y tier definido, parar.
2. **Definir tier explícitamente.** Silent ≠ Beta ≠ Minor ≠ Major ≠ Flagship — cada uno con esfuerzo de comms y enablement distinto.
3. **Timeline con hitos y owners por área**. Sin owners, los items se quedan huérfanos.
4. **Coordinar todos los equipos involucrados**: Product, Eng, Design, Marketing, Sales, Support, Legal. Cada uno tiene su lista de tareas en sección 8.
5. **Feature flag obligatorio** para releases con riesgo de regresión. Sin flag, rollback es deploy completo (riesgoso).
6. **Criterios de éxito y guardraíl** declarados antes del launch — para evaluar honestamente después.
7. **Riesgos identificados con mitigación**. Cada riesgo material con owner y acción.
8. **Rollback plan con triggers y procedimiento**. Sin esto, en crisis se improvisa mal.
9. **Post-launch review programada** desde antes — sin esto, el aprendizaje se pierde.
10. **Marcar `[CONTENT PENDIENTE]`** drafts de comms aún por hacer, `[OWNER PENDIENTE]` items sin dueño, `[DEPENDENCY PENDING]` los bloqueos no confirmados.
11. **Guardar** en `<proyecto>/product/strategy/roadmap/releases/<release-slug>.md`.
12. **Reportar** al usuario: ruta, tier, target date, status overall, top riesgos.

---

## Restricciones

- **No prometas fecha sin code freeze validado.** Engineering tiene que confirmar.
- **No omitas el plan de rollback.** Releases sin rollback son apuesta.
- **No copies plan de release anterior** sin adaptar a esta feature y tier.
- **No olvides enablement de Sales y Support.** Sin estos, el equipo comercial improvisa.
- **No publiques antes de feature complete.** Tentación de adelantar marketing siempre acaba mal.
- **No prometas adopción sin medir.** Targets de adopción siempre con baseline + plazo.
- **No saltes el post-launch review.** Sin él, próximos releases repiten errores.
- **No mezcles release plan con tech spec.** Tech spec es cómo construir; release plan es cómo lanzar lo construido.
- Aplican las reglas de output de `_shared/output-rules.md`.
