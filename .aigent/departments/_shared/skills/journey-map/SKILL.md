---
name: "journey-map"
description: >
  Shared skill for producing a structured journey map: phases, actions, thoughts,
  emotions, pain points, opportunities, touchpoints. Used cross-department
  (design-ux-research for interface usage flows, product-discovery for end-to-end
  customer journeys) with identical structure regardless of scope.
---

# Skill: Journey Map

**Entregable:** archivo `.md` con journey map estructurado por fases, listo para informar decisiones de diseño, product, marketing o experiencia. Vive en la carpeta del dept que lo solicite — la skill es compartida en `_shared/skills/`, los outputs no.

---

## Cuándo usar esta skill

- Hay que entender el journey del usuario/cliente para identificar pain points y oportunidades.
- Se prepara un rediseño de flujo (UX) o de experiencia (Product) y se necesita visión completa.
- Se mapea un proceso end-to-end (onboarding, compra, renovación) con múltiples touchpoints.
- Se documenta el journey actual (current state) vs el objetivo (future state) para una iniciativa de mejora.

**Cuándo NO usar:**

- Para personas o JTBD (son artefactos distintos — vive en `product-discovery/personas/`).
- Para wireframes o flow charts técnicos (son entregables de UI, no de journey).
- Para diagramas de procesos internos de la empresa (process map, no journey map de cliente).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope del journey | ¿Customer journey end-to-end / journey de uso de una interfaz / un flow específico (onboarding, compra, soporte)? |
| Persona / segmento | ¿Qué persona o segmento de usuario protagoniza este journey? |
| Current vs future | ¿Documentamos el estado actual, el objetivo, o ambos? |
| Granularidad | ¿Macro (5-7 fases altas) o detallado (subfases, micro-steps)? |
| Touchpoints | ¿Qué canales/puntos de contacto incluimos? (producto, soporte, web, email, físico) |
| Evidencia disponible | ¿Tenemos data cuantitativa (analytics, funnel), cualitativa (entrevistas, reviews), ambas, o ninguna? |
| Audiencia del mapa | ¿Equipo de design, product, marketing, sales, leadership, mixto? |

---

## Plantilla del entregable

Nombre del archivo: `journey-map-<scope-slug>-<YYYY-MM>.md` (ej. `journey-map-onboarding-saas-2026-05.md`, `journey-map-renewal-enterprise-2026-05.md`).

```markdown
---
type: "journey-map"
scope: "<descripción del scope>"
persona: "<persona / segmento>"
journey_type: "current-state | future-state | both"
granularity: "macro | detailed"
audience: "design | product | marketing | sales | leadership | mixed"
date: "YYYY-MM-DD"
last_review: "YYYY-MM-DD"
owner: "<rol/persona>"
status: "draft | reviewed | published"
language: "es | en"
---

# Journey Map — <Persona> · <Scope> · <YYYY-MM>

## 0. Resumen ejecutivo

> 5-7 líneas: qué journey cubre, principales pain points detectados, top 3 oportunidades.

**Top 3 pain points (por impacto en experiencia):**
1.
2.
3.

**Top 3 oportunidades:**
1.
2.
3.

**Recomendación general:** <una frase>

---

## 1. Persona y contexto

> Breve descripción de la persona protagonista (no la persona detallada — eso vive en `discovery/personas/`).

- **Persona:** <nombre del arquetipo>
- **Contexto del journey:** <cuándo entra al journey, qué intenta conseguir, qué le motiva, qué le preocupa>
- **JTBD principal:** "Cuando <situación>, quiero <motivación>, para <outcome esperado>"

> Referencia a la persona detallada: <link a `<proyecto>/product/discovery/personas/<persona-slug>.md>` si existe>

---

## 2. Fases del journey

> Macro view. Listar las fases en orden lógico. Granularidad sugerida: 4-7 fases para macro; 8-15 para detailed.

1. **<Fase 1: ej. Awareness>** — <una línea de qué pasa aquí>
2. **<Fase 2: ej. Consideration>** — <una línea>
3. **<Fase 3: ej. Onboarding>** — <una línea>
4. **<Fase 4: ej. First value>** — <una línea>
5. **<Fase 5: ej. Habitual use>** — <una línea>
6. **<Fase 6: ej. Expansion / Renewal>** — <una línea>

---

## 3. Journey detallado por fase

> Una tabla por fase. Cada fase describe acciones, pensamientos, emociones, pain points, oportunidades, touchpoints.

### Fase 1 — <Nombre>

| Campo | Detalle |
|---|---|
| **Goal del usuario** | <qué quiere conseguir en esta fase> |
| **Acciones** | <qué hace el usuario, paso a paso> |
| **Pensamientos** | <qué piensa, preguntas que se hace, dudas> |
| **Emociones** | <frustración / curiosidad / confianza / etc. — y por qué> |
| **Touchpoints** | <con qué canales interactúa: app, web, email, soporte, físico> |
| **Pain points** | <fricciones detectadas con severidad: 🔴 crítico / 🟠 mayor / 🟡 menor> |
| **Oportunidades** | <ideas para mejorar la experiencia en esta fase> |
| **Métricas observadas** | <data cuantitativa de esta fase si disponible: conversion rate, time-on-step, drop-off> |

### Fase 2 — <Nombre>

(misma estructura)

(repetir por cada fase)

---

## 4. Visualización compacta

> Tabla maestra de un solo vistazo. Útil para presentación.

| Fase | Goal | Acción clave | Emoción dominante | Pain point top | Oportunidad top |
|---|---|---|---|---|---|
| 1. <Fase 1> | <goal> | <acción> | <emoción> | <pain> | <opp> |
| 2. <Fase 2> | | | | | |
| 3. <Fase 3> | | | | | |
| ... | | | | | |

---

## 5. Pain points priorizados

> Lista consolidada de pain points across el journey, con severidad y plan.

| ID | Pain point | Fase | Severidad | Impacto en experiencia | Frecuencia | Quick fix? |
|---|---|---|---|---|---|---|
| P-1 | <descripción> | <fase> | 🔴 Crítico | <impacto> | <% usuarios afectados> | Sí / No |
| P-2 | | | | | | |
| ... | | | | | | |

---

## 6. Oportunidades priorizadas

> Lista consolidada de oportunidades de mejora.

| ID | Oportunidad | Fase | Impacto esperado | Esfuerzo estimado | Métricas a mover |
|---|---|---|---|---|---|
| O-1 | <descripción> | <fase> | Alto/Medio/Bajo | Alto/Medio/Bajo | <KPI> |
| O-2 | | | | | |
| ... | | | | | |

---

## 7. Evidencia que respalda el mapa

> Sin evidencia, el journey es opinión. Citar fuentes para que sea defendible.

- **Cuantitativa:** <analytics, funnel data, A/B test results, customer support tickets agrupados>
- **Cualitativa:** <usability tests, customer interviews, reviews, NPS comments>
- **Heurística:** <si parte del mapa es inferencia experta, marcarlo>

> Marcar cada hallazgo del mapa con su fuente: `[QUANT]`, `[QUAL]`, `[HEURISTIC]`.

---

## 8. Future state *(si aplica)*

> Solo si el mapa documenta el estado objetivo. Mismo formato que sección 3 pero con la experiencia ideal.

<Repetir estructura de fases con el comportamiento esperado tras la intervención. Indicar qué cambia respecto a current state.>

---

## 9. Próximos pasos

- <Acción 1: ej. Validar pain point P-3 con usability test específico>
- <Acción 2: ej. Generar mockup de oportunidad O-1 con `design-ui`>
- <Acción 3: ej. Conectar pain points a roadmap con `product-strategy-roadmap`>

---

## 10. Anexos

- Persona detallada: <link>
- Research que respalda el mapa: <link>
- Data analytics de respaldo: <link>
- Versiones previas del journey map: <links>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin persona definida y scope claro, parar.
2. **Decidir granularidad** (macro 4-7 fases o detailed 8-15). Macro es típicamente más útil para alinear leadership; detailed para informar diseño y producto.
3. **Reunir evidencia** antes de mapear. Sin data cuantitativa ni cualitativa, el journey será heurístico y debe marcarse así.
4. **Documentar fases en orden cronológico** del journey. No saltar pasos por incomodidad — si hay un paso "Soporte tras error", entra.
5. **Por cada fase, capturar acciones, pensamientos, emociones, touchpoints.** No saltarse los pensamientos y emociones — son donde típicamente está el insight.
6. **Identificar pain points con severidad explícita** (🔴 🟠 🟡). Sin severidad, todo se trata igual y nada se prioriza.
7. **Identificar oportunidades sin atascarse en "soluciones".** Una oportunidad puede tener varias soluciones posibles; aquí captura la oportunidad, no la solución.
8. **Triangular con métricas** cuando se puede: drop-off por step, time-on-step, conversion rate. Anclar el journey en data cuando exista.
9. **Marcar `[QUANT]` / `[QUAL]` / `[HEURISTIC]`** cada hallazgo con su origen. Sin esto, el mapa pierde defensibilidad.
10. **Guardar** en la carpeta del dept consumidor:
    - `design-ux-research` → `<proyecto>/design/ux-research/journey-maps/<scope-slug>.md`
    - `product-discovery` → `<proyecto>/product/discovery/research/journey-<scope-slug>.md`
11. **Reportar** al usuario: ruta, resumen ejecutivo, top 3 pain points y oportunidades, próximos pasos.

---

## Restricciones

- **No infieras emociones sin evidencia.** "El usuario se frustra aquí" sin observación es especulación. Marcar `[HEURISTIC]` o no incluir.
- **No documentes future state sin haber documentado current state primero.** Future sin baseline es wishful thinking.
- **No omitas las fases incómodas** (errores, soporte, churn). Esas son donde más se aprende.
- **No reduzcas el journey a un funnel.** Funnel es conversion data; journey es experiencia. Son complementarios pero distintos.
- **No copies plantillas de journey de otros productos.** Cada producto tiene su journey real; la estructura general se mantiene, el contenido cambia.
- **No prometas que el journey será inmutable.** El producto evoluciona y el journey con él. Marcar fecha y plan de revisión.
- Aplican las reglas de output de `_shared/output-rules.md`.
