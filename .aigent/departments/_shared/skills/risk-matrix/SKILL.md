---
name: "risk-matrix"
description: >
  Shared skill for producing a structured risk matrix: risk identification by
  dimension (operational/financial/legal/technical/market/people), probability ×
  impact scoring, mitigation, owner, residual risk after mitigation, monitoring
  cadence. Used cross-department (legal-risk, software-architecture for ADRs,
  finance-budgeting for scenarios, product-strategy-roadmap) with the same
  structure regardless of domain.
---

# Skill: Risk Matrix

**Entregable:** archivo `.md` con matriz de riesgos estructurada para una iniciativa, decisión o periodo. Vive en la carpeta del dept que la solicite — la skill es compartida en `_shared/skills/`, los outputs no.

---

## Cuándo usar esta skill

- Hay que evaluar riesgos asociados a una decisión / iniciativa / lanzamiento.
- Se prepara material para un comité de riesgos, board o decisión de inversión.
- Se requiere mapeo de riesgos sistemático periódico (anual/trimestral).
- Una decisión técnica grande (en ADR) necesita explicar trade-offs en términos de riesgo.

**Cuándo NO usar:**

- Para análisis de un solo riesgo profundo (eso es un risk assessment dedicado).
- Para riesgos de privacidad específicos (es DPIA, especializado).
- Para riesgos operativos diarios (eso es operations runbook / incident response).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope | ¿Para qué riesgos? (iniciativa, decisión, periodo, M&A target, etc.) |
| Dimensiones a cubrir | Operativa / Financiera / Legal-regulatoria / Técnica / Mercado / People — y otras del dominio |
| Audiencia | Equipo operativo, leadership, board, regulador, auditor externo |
| Plazo / horizonte | ¿Riesgos a 3 meses, 12 meses, multianual? |
| Política de empresa | ¿Hay risk appetite declarado (low/medium/high)? ¿Umbrales para escalado? |
| Riesgos conocidos | Lista de partida (los completamos con investigación) |
| Owners potenciales | ¿Quién puede asumir owner de cada dimensión? |

---

## Plantilla del entregable

Nombre del archivo: `risk-matrix-<scope-slug>-<YYYY-MM>.md`.

```markdown
---
type: "risk-matrix"
scope: "<descripción del scope>"
audience: "team | leadership | board | regulator | auditor"
horizon: "<3 months | 12 months | multi-year>"
date: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
risk_appetite: "low | medium | high"
owner: "<rol/persona>"
status: "draft | reviewed | published"
---

# Risk Matrix — <Scope> · <YYYY-MM>

## 0. Resumen ejecutivo

> 5-7 líneas: top riesgos, niveles de exposición, recomendaciones generales.

**Top 5 riesgos (post-mitigación):**
1. <Riesgo + score>
2.
3.
4.
5.

**Riesgos en zona roja sin mitigación clara:** <listado>

**Recomendación general:** <una frase>

---

## 1. Metodología

### Escalas

**Probabilidad** (basada en evidencia disponible, no en intuición):
- **1 — Muy baja**: requiere coincidencia rara; sin precedentes conocidos.
- **2 — Baja**: posible pero improbable en el horizonte declarado.
- **3 — Media**: realista; al menos un precedente en industria o empresa.
- **4 — Alta**: probable en el horizonte; señales claras presentes.
- **5 — Muy alta**: prácticamente seguro; ya ocurriendo o inminente.

**Impacto** (en outcome del scope):
- **1 — Despreciable**: absorbible sin desviar plan ni recursos.
- **2 — Menor**: requiere reasignación táctica.
- **3 — Moderado**: retraso significativo o coste material; recuperable.
- **4 — Mayor**: impacto severo (financiero, reputacional, regulatorio); recuperación larga.
- **5 — Crítico**: pone en riesgo la viabilidad de la iniciativa o, en casos extremos, de la empresa.

### Score = Probabilidad × Impacto

| Score | Zona | Tratamiento |
|---|---|---|
| 1-4 | 🟢 Verde | Aceptar y monitorizar |
| 5-9 | 🟡 Amarilla | Mitigar; revisar periódicamente |
| 10-16 | 🟠 Naranja | Mitigar prioritariamente; reportar a leadership |
| 17-25 | 🔴 Roja | Mitigación obligatoria antes de proceder; escalar a board si no es posible |

---

## 2. Risk register

> Tabla maestra con todos los riesgos identificados. Las fichas detalladas vienen después.

| ID | Riesgo | Dimensión | P | I | Score pre-mit | Mitigación | P post | I post | Score post-mit | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-001 | <Riesgo> | Operativa | 4 | 4 | 16 🟠 | <breve> | 2 | 3 | 6 🟡 | <persona> | Mitigando |
| R-002 | | Financiera | | | | | | | | | |
| R-003 | | Legal | | | | | | | | | |
| R-004 | | Técnica | | | | | | | | | |
| R-005 | | Mercado | | | | | | | | | |
| R-006 | | People | | | | | | | | | |
| ... | | | | | | | | | | | |

---

## 3. Fichas detalladas (solo riesgos 🟠 y 🔴)

> Una ficha por cada riesgo en zona naranja o roja, antes o después de mitigación.

### R-001 — <Título del riesgo>

- **Dimensión:** <Operativa / Financiera / Legal / Técnica / Mercado / People>
- **Descripción:** <2-3 líneas, factual>
- **Causas raíz identificadas:** <listado>
- **Probabilidad (pre-mitigación):** <1-5, justificada>
- **Impacto (pre-mitigación):** <1-5, justificado>
- **Score pre-mitigación:** <P × I> · <zona>
- **Señales tempranas a monitorizar:** <listado de indicadores que advertirían si el riesgo se materializa>
- **Mitigación propuesta:**
  - <Acción 1>
  - <Acción 2>
- **Coste de la mitigación:** <€/horas/personas>
- **Probabilidad (post-mitigación):** <1-5>
- **Impacto (post-mitigación):** <1-5>
- **Score post-mitigación:** <P × I> · <zona>
- **Riesgo residual aceptable?** Sí / No · <justificación>
- **Plan de contingencia (si se materializa):** <breve>
- **Owner:** <persona>
- **Próxima revisión:** <fecha>

(repetir por cada riesgo 🟠 / 🔴)

---

## 4. Análisis por dimensión

> Resumen por área. Útil cuando una dimensión concentra muchos riesgos o cuando la audiencia consume por área.

### Operativa
- Total: <X riesgos>. Promedio score: <Y>. Mayor preocupación: <riesgo top>.

### Financiera
- Total: <X>. Promedio score: <Y>. Mayor preocupación: <riesgo top>.

### Legal-regulatoria
- Total: <X>. Promedio: <Y>. Mayor: <riesgo top>.

### Técnica
- Total: <X>. Promedio: <Y>. Mayor: <riesgo top>.

### Mercado
- Total: <X>. Promedio: <Y>. Mayor: <riesgo top>.

### People (talento, retención, hiring)
- Total: <X>. Promedio: <Y>. Mayor: <riesgo top>.

---

## 5. Riesgos descartados explícitamente

> Riesgos que se consideraron pero se decidió no incluir. Documentar por qué.

| Riesgo considerado | Por qué se descarta |
|---|---|
| <Riesgo X> | Probabilidad muy baja en horizonte; revisión a 12 meses si cambia |
| <Riesgo Y> | Cubierto por <otro riesgo> en la matriz |

---

## 6. Cadencia de revisión

- **Revisión de matriz completa:** <trimestral / semestral>
- **Revisión de riesgos en zona roja:** <mensual o más frecuente>
- **Triggers de re-evaluación fuera de cadencia:** <eventos que invalidan: regulación nueva, cambio de equipo clave, incidente que muestra que P o I está mal estimado>

---

## 7. Apéndices

- Risk appetite policy de la empresa: <link>
- Risk matrices anteriores del mismo scope: <links>
- Plan de contingencia detallado para riesgos 🔴: <link>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin scope claro, parar.
2. **Identificar riesgos por dimensión.** Pasar por cada dimensión sistemáticamente — no quedarse en los riesgos "obvios" del dominio principal. Una iniciativa técnica también tiene riesgos de mercado, regulatorios y de people.
3. **Evaluar P e I con evidencia.** Si un riesgo se evalúa con "5/5 porque me preocupa", no es análisis. Documentar la base: precedentes, datos, señales tempranas observables.
4. **Calcular score pre-mitigación.** Sirve de baseline.
5. **Proponer mitigación realista.** No "mitigación perfecta" sino lo que el equipo puede ejecutar con sus recursos. Coste explícito.
6. **Recalcular score post-mitigación.** El delta es lo que justifica la inversión en mitigar.
7. **Identificar riesgos residuales aceptables vs no aceptables.** No todos se pueden eliminar; algunos se aceptan y se monitorizan.
8. **Asignar owner a cada riesgo 🟠 / 🔴.** Sin owner, el riesgo huérfano se cumple por sorpresa.
9. **Documentar señales tempranas.** Lo que advertirá si el riesgo se está materializando. Sin esto, la matriz es retroactiva, no predictiva.
10. **Marcar `[OWNER PENDIENTE]`** lo que no tiene dueño, `[VERIFICAR P/I]` lo que requiere más evidencia, `[CONTINGENCIA PENDIENTE]` los 🔴 sin plan B.
11. **Guardar** en la carpeta del dept consumidor (`<proyecto>/legal/risk/`, `<proyecto>/finance/budgeting/scenarios/`, `<proyecto>/product/strategy/roadmap/`, dentro de un ADR de software, etc.). La skill es compartida; el output vive donde lo consume el agente.
12. **Reportar** al usuario: ruta, top 5 riesgos post-mitigación, riesgos 🔴 sin mitigación clara, recomendación de cadencia.

---

## Restricciones

- **No evalúes P e I sin evidencia.** Intuición no es input; precedentes, datos y señales sí.
- **No omitas riesgos por incomodidad.** Si un riesgo es político (incluye a un stakeholder interno), va igual — con tacto, pero va.
- **No prometas mitigación perfecta.** El score post-mitigación raramente es 1×1.
- **No mezcles riesgo con problema actual.** Riesgo es lo que puede pasar; problema es lo que ya está pasando. Si está pasando, no es matriz de riesgos sino incident/issue tracker.
- **No reutilices matriz vieja sin re-evaluar.** Los riesgos envejecen mal; el contexto cambia.
- **No publiques sin owner por riesgo material.** Riesgo 🟠 / 🔴 sin owner es deuda.
- **No olvides documentar lo descartado.** Sección 5 es la que distingue una matriz pensada de una matriz que es solo "lo primero que se me ocurrió".
- Aplican las reglas de output de `_shared/output-rules.md`.
