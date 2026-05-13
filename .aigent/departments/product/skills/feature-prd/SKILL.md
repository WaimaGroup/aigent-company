---
name: "feature-prd"
description: >
  Skill for producing an operational Product Requirements Document (PRD) for a
  single feature: problem, hypothesis, scope, user stories, success criteria,
  out-of-scope, dependencies, risks, rollout plan. More tactical than the
  shared-prd-agent's project-level PRD; operates at feature-level for engineering
  to implement.
---

# Skill: Feature PRD

**Entregable:** archivo `.md` con PRD operativo de una feature concreta, listo para que ingeniería y diseño la implementen. Vive en `<proyecto>/product/strategy/prds/<feature-slug>.md`.

---

## Cuándo usar esta skill

- Una feature concreta entra al roadmap y necesita documento operativo para implementación.
- Hay que redactar el PRD que diseño y engineering van a consumir directamente.
- Hay que adaptar una iniciativa del roadmap a un nivel ejecutable.

**Cuándo NO usar:**

- Para PRD de proyecto/iniciativa amplia (eso es `shared-prd-agent` con scope mayor — visión, fases, stakeholders amplios).
- Para spec técnica de implementación (eso es `tech-spec` o ADRs de `software-architecture`).
- Para un ticket de bug o tarea operativa pequeña (es scope insuficiente).

> **Diferencia vs `shared-prd-agent`:** el agente compartido produce PRDs de iniciativa o proyecto. Esta skill produce el PRD operativo de **una feature concreta** que típicamente entra en 1-3 sprints. Más táctico, menos estratégico.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Feature | Nombre y descripción en una frase |
| Problema | ¿Qué problema del usuario resuelve? |
| Hipótesis | ¿Si hacemos esto, qué esperamos que pase y por qué? |
| Evidencia | ¿Qué evidencia respalda la hipótesis? (research, data, peticiones recurrentes) |
| Usuarios afectados | Persona / segmento / % del producto que la verá |
| Métrica de éxito | ¿Cuál es el KPI que esperamos mover? Baseline + target |
| Restricciones técnicas | ¿Hay dependencias técnicas conocidas o constraints? |
| Plazo objetivo | ¿Qué sprint / quarter target? |
| Owner | ¿PM responsable? ¿Tech lead? ¿Designer? |

---

## Plantilla del entregable

Nombre del archivo: `<feature-slug>.md` (ej. `inline-comments-on-doc.md`, `dark-mode.md`, `csv-export.md`).

```markdown
---
type: "feature-prd"
feature_name: "<Nombre humano>"
status: "draft | review | approved | in-build | shipped | shelved"
target_sprint_or_quarter: "<Q2 2026 / Sprint 23>"
priority: "P0 | P1 | P2 | P3"
date_created: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
pm_owner: "<nombre>"
tech_lead: "<nombre>"
designer: "<nombre>"
linked_initiative: "<link al roadmap o bet>"
---

# PRD — <Feature Name>

## 0. TL;DR

> 4-6 líneas. Qué construimos, para quién, por qué, qué esperamos lograr.

**Qué:** <una línea>

**Para quién:** <persona / segmento>

**Por qué ahora:** <una línea: evidencia + urgencia>

**Éxito si:** <métrica + delta esperado en plazo>

---

## 1. Problema

> El estado actual. Específico, anclado en evidencia.

<2-3 párrafos. Qué problema vive el usuario hoy, cómo se manifiesta, qué evidencia tenemos.>

**Evidencia:**
- **Cuantitativa:** <data de analytics, funnel, soporte, NPS>
- **Cualitativa:** <quotes de entrevistas, tickets de soporte recurrentes>
- **Volumen del problema:** <X% de usuarios afectados / Y solicitudes/mes>

---

## 2. Hipótesis

> Si construimos X, esperamos Y porque Z.

**Hipótesis principal:**

> *Si construimos `<feature>`, los usuarios `<persona>` lograrán `<outcome>`, lo cual moverá `<métrica>` de `<baseline>` a `<target>` en `<plazo>` porque `<razón causal>`.*

**Hipótesis secundarias / efectos colaterales esperados:**
- <Hipótesis 2: ej. "Reducirá tickets de soporte de tipo X">
- <Hipótesis 3: ej. "Aumentará retention en cohorte Y">

**Hipótesis de riesgo:**
- <Qué podría no funcionar y por qué>

---

## 3. Scope

### In-scope

> Qué construimos. Sé concreto.

- <Funcionalidad 1>
- <Funcionalidad 2>
- <Funcionalidad 3>

### Out-of-scope explícito

> Igual de importante. Lo que NO entra y por qué.

- <Algo que no entra>: <razón>
- <Algo que no entra>: <razón>

### Future / phase 2

> Lo que SÍ haremos pero más adelante. Útil para alinear expectativas.

- <Phase 2 item 1>
- <Phase 2 item 2>

---

## 4. User stories / Acceptance criteria

> Formato Gherkin opcional, pero el spirit es: cada story tiene precondiciones, acción, resultado verificable.

### Story 1 — <Como [persona], quiero [acción], para [outcome]>

**Given** <precondición>
**When** <acción del usuario>
**Then** <resultado esperado>

**Acceptance criteria:**
- [ ] <Criterio 1 verificable>
- [ ] <Criterio 2>
- [ ] <Criterio 3>

### Story 2 — ...

(repetir por cada user story)

### Edge cases / errores

- **Cuando <caso edge>:** <comportamiento esperado>
- **Cuando <caso de error>:** <comportamiento esperado + mensaje al usuario>

---

## 5. Métricas de éxito

### Métrica primaria

| Métrica | Definición operativa | Baseline | Target | Plazo |
|---|---|---|---|---|
| <Métrica principal> | <fórmula> | <valor> | <delta> | <X semanas tras lanzamiento> |

### Métricas secundarias

| Métrica | Por qué la vigilamos |
|---|---|
| <Métrica 2> | <retention, engagement, etc.> |
| <Métrica 3> | |

### Métricas guardraíl (NO queremos que empeoren)

| Métrica | Threshold de alerta |
|---|---|
| <Tiempo de carga> | < +10% vs antes |
| <Error rate> | < +0.5pp |
| <Soporte tickets> | < +20% |

### Análisis post-lanzamiento

- **Cuándo lo medimos:** <2 semanas / 1 mes / 1 trimestre tras shipping>
- **Quién lo analiza:** <PM + analyst si aplica>
- **Decisión derivada:** mantener / iterar / sunset / expandir.

---

## 6. Design y UX

> Link a los mockups + decisiones clave de UX.

- **Figma link:** <URL>
- **Estados cubiertos:** <listado: default, loading, error, empty>
- **Responsive:** <breakpoints>
- **Accesibilidad:** WCAG 2.2 AA target. Auditoría con `accessibility-audit` antes del shipping.

### Decisiones de UX explicadas

- **<Decisión 1>:** elegimos X en lugar de Y porque <razón>.
- **<Decisión 2>:** ...

---

## 7. Implementación — alto nivel

> No es spec técnica, pero sí señala las áreas técnicas tocadas. La spec técnica detallada vive en `tech-spec` o ADR.

- **Áreas del producto tocadas:** <módulos / servicios>
- **Cambios en API:** <sí/no — si sí, link a `api-spec`>
- **Cambios en BD:** <sí/no — si sí, migrations involucradas>
- **Cambios en infra:** <sí/no — si sí, link a runbook>
- **Feature flag:** <sí/no — nombre del flag si sí>
- **Integraciones con terceros:** <listado si aplica>

### Effort estimado

- **Engineering:** <X semanas / story points>
- **Design:** <X semanas>
- **QA:** <X semanas>

---

## 8. Dependencias

| Dependencia | Owner externo | Estado | Bloquea | Plan B si falla |
|---|---|---|---|---|
| <Equipo X entrega API> | <PM equipo X> | <estado> | <qué> | <alternativa> |
| <Provider externo Y> | <vendor> | <estado> | <qué> | <fallback> |
| <Decisión de leadership> | <CEO/CPO> | <estado> | <qué> | <opción degradada> |

---

## 9. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| <Riesgo técnico> | Alta/Media/Baja | Alto/Medio/Bajo | <acción> |
| <Riesgo de UX> | | | |
| <Riesgo de adopción> | | | |
| <Riesgo legal/privacidad> | | | |

---

## 10. Rollout plan

### Estrategia de lanzamiento

- **Tipo de rollout:** <full rollout / staged / canary / dark launch / beta privada>
- **Cohortes iniciales:** <% usuarios, qué cohorte, criterio>
- **Hitos de expansión:** <a 50% en X días si métricas guardraíl OK>

### Plan de comunicación

- **Internamente:** <all-hands, release notes, training a soporte>
- **A usuarios:** <in-app message / email / blog post>
- **Soporte preparado:** <FAQ + scripts para tickets típicos esperados>

### Feature flag / kill switch

- **Flag:** <nombre>
- **Default value:** <on/off>
- **Quién puede activar/desactivar:** <rol>
- **Plan de rollback:** desactivar flag si <condición>.

---

## 11. Decisiones tomadas durante el design

> Living section. Registrar decisiones materiales tomadas durante implementation que cambien el PRD.

| Fecha | Decisión | Por | Implicación |
|---|---|---|---|
| YYYY-MM-DD | <decisión> | <PM/TL/Design> | <qué cambia del PRD original> |

---

## 12. Anexos

- **Iniciativa del roadmap:** <link>
- **Discovery / research previo:** <link>
- **Mockups:** <link Figma>
- **API spec:** <link si aplica>
- **Tech spec / ADRs relacionados:** <link>
- **Plan de instrumentación / events a trackear:** <link>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin problema bien definido y métrica de éxito, parar.
2. **TL;DR primero.** Si no convence en 30 segundos, el PRD no convence.
3. **Anclar el problema en evidencia.** Sin evidencia, la feature es opinión.
4. **Hipótesis con causa explícita.** "Si X entonces Y porque Z" es mejor que "X moverá Y".
5. **In-scope, out-of-scope y future phase** todos explícitos. Out-of-scope es donde más típicamente saltan malentendidos.
6. **User stories con acceptance criteria verificables.** "Mejor UX" no es criterio; "tiempo de completar tarea < 30s" sí.
7. **Métricas primaria + secundarias + guardraíles.** Sin guardraíles, una métrica primaria que sube puede esconder daño en otra parte.
8. **Implementación de alto nivel, no spec detallada.** Esta es PRD, no tech spec.
9. **Dependencias y riesgos con owners y mitigación.** Riesgo sin owner es riesgo huérfano.
10. **Rollout plan con feature flag**, especialmente para features con riesgo de adopción/regresión.
11. **Marcar `[DATA PENDIENTE]`** lo que requiere baseline real, `[DESIGN PENDIENTE]` mockups por hacer, `[DECISIÓN]` lo que requiere ratificación de leadership.
12. **Guardar** en `<proyecto>/product/strategy/prds/<feature-slug>.md`.
13. **Reportar** al usuario: ruta, status (draft/review), métrica primaria, dependencias críticas.

---

## Restricciones

- **No mezcles PRD con tech spec.** PRD es qué/por qué; tech spec es cómo. Separar.
- **No omitas out-of-scope.** Es la sección que más previene scope creep.
- **No prometas métrica sin baseline.** Un target sin baseline no se puede medir.
- **No copies PRDs de otras features.** Cada feature tiene su problema, su evidencia, su hipótesis.
- **No saltes el rollout plan.** Especialmente para features con riesgo de adopción.
- **No olvides análisis post-lanzamiento.** Sin esto, no aprendemos de lo que funciona y lo que no.
- **No publiques PRD sin owner (PM + TL + Designer).** Sin owners, la feature deriva.
- Aplican las reglas de output de `_shared/output-rules.md`.
