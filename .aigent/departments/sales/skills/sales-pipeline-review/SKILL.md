---
name: "sales-pipeline-review"
user-invocable: true
description: >
  Skill for producing a structured sales pipeline review for a period: deals by
  stage, weighted forecast, deal health flags (stalled, missing data, decision
  maker not identified), pipeline coverage analysis, next-step per deal,
  recommended interventions. Operational deep-dive distinct from kpi-dashboard's
  aggregated metric tracking.
---

# Skill: Pipeline Review

**Entregable:** archivo `.md` con la revisión operativa del pipeline para una cadencia concreta (semanal, quincenal, mensual), enfocada en deals individuales y next steps. Vive en `<proyecto>/sales/pipeline/pipeline-review-<YYYY-MM-DD>.md`.

---

## Cuándo usar esta skill

- Reunión recurrente de pipeline review (típicamente semanal o quincenal).
- Cierre de mes/trimestre: dónde estamos vs cuota, qué deals critical hay que cerrar.
- Preparación de forecast formal antes de comprometer cifra a leadership.
- Diagnóstico tras un mes flojo de cierre: qué deals se están atascando y por qué.

**Cuándo NO usar:**

- Para el dashboard agregado de métricas de pipeline (eso es `kpi-dashboard` — coverage, win rate, deal size, velocity).
- Para un análisis profundo de un solo deal (eso es deal review aparte).
- Para diseñar la estructura del CRM (etapas, criterios) — eso es otra skill futura.

> **Diferencia clave vs `kpi-dashboard`:** `kpi-dashboard` agrega métricas; `pipeline-review` opera deal por deal con next-steps accionables.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Periodo | Semana / quincena / mes / trimestre / fin de Q |
| Scope | Pipeline de un rep concreto, equipo, región, vertical, total |
| Etapas del CRM | ¿Cuáles son las etapas vigentes? (Discovery → Demo → Proposal → Negotiation → Closed Won/Lost o similar) |
| Probabilidad por etapa | Pesos para weighted forecast (ej. Demo 30%, Proposal 60%, Negotiation 80%) |
| Cuota del periodo | ¿Cuál es la cuota / target a comparar? |
| Datos disponibles | ¿Acceso al CRM directo, export, o data en spreadsheet? |
| Deals a destacar | ¿Hay deals concretos sobre los que el usuario quiere foco? |
| Audiencia | Rep individual, equipo de ventas, leadership, board |

---

## Plantilla del entregable

Nombre del archivo: `pipeline-review-<periodo>.md` (ej. `pipeline-review-2026-W19.md`, `pipeline-review-2026-Q2-close.md`).

```markdown
---
type: "pipeline-review"
period: "<YYYY-Wnn | YYYY-MM | YYYY-Qn>"
scope: "rep <nombre> | team <nombre> | region | vertical | total"
quota: "<€/$ amount>"
audience: "rep | sales-team | leadership | board"
status: "draft | reviewed | published"
date: "YYYY-MM-DD"
owner: "<rep / sales manager>"
---

# Pipeline Review — <Scope> · <Periodo>

## 0. Resumen ejecutivo

> 5-7 líneas. Posición global, qué vamos a cerrar, qué deals son críticos, qué bloqueos hay.

**Headline:**
- **Cuota del periodo:** <€/$ X>
- **Closed Won YTD/MTD:** <€/$ Y> (<%> de cuota)
- **Pipeline activo total:** <€/$ Z>
- **Weighted forecast (probabilidad × monto):** <€/$ W>
- **Coverage ratio (pipeline / cuota restante):** <X.x>

**Top 3 deals para cerrar este periodo:**
1. <Cliente — monto — stage — next step crítico>
2.
3.

**Top 3 deals en riesgo (stalled o blocked):**
1. <Cliente — qué pasa — qué hacemos>
2.
3.

**Recomendación general:** <una línea>

---

## 1. Estado del pipeline por etapa

| Etapa | Probabilidad | # Deals | Monto total | Monto weighted | Δ vs review anterior |
|---|---|---|---|---|---|
| Discovery | 10% | | | | |
| Demo | 30% | | | | |
| Proposal | 60% | | | | |
| Negotiation | 80% | | | | |
| Closed Won (acumulado periodo) | 100% | | | | |
| Closed Lost (acumulado periodo) | 0% | | | | |
| **Total activo** | — | | | | |

### Variances notables
- <Cambios materiales respecto al review anterior: deals que avanzaron, retrocedieron, se cerraron>

---

## 2. Cuota vs forecast

| Métrica | Valor |
|---|---|
| Cuota del periodo | <€/$> |
| Closed Won acumulado | <€/$> (<%>) |
| **Commit forecast** (deals high confidence) | <€/$> |
| **Best case** (incluye plausibles) | <€/$> |
| **Pipeline forecast** (weighted total) | <€/$> |
| Gap a cuota (commit) | <€/$> |
| Coverage ratio (pipeline activo / gap) | <X.x> |

**Lectura:**
- Coverage **< 2x** → riesgo alto de no cubrir cuota. Acción urgente.
- Coverage **2-3x** → razonable, vigilar conversion.
- Coverage **> 3x** → saludable; foco en avance de deals.

---

## 3. Deals por revisar (uno a uno)

> Foco en deals activos (no Closed). Por cada deal: estado, próximo paso, owner, riesgos.

### D-001 — <Cliente> · <€/$ monto> · <Stage> · <Probabilidad>

- **Decisor identificado:** <Sí: nombre + rol / No>
- **Champion en la cuenta:** <Sí / No>
- **Pain confirmado:** <descripción factual>
- **Pain cuantificado:** <€/$ / horas / impacto>
- **Última actividad:** <fecha + tipo: call, email, demo, propuesta enviada>
- **Próximo paso comprometido:** <qué + cuándo + con quién>
- **Bloqueos / riesgos:**
  - <ej. "No hemos accedido al CFO aún">
  - <ej. "Compite con <competidor> que está en evaluación más avanzada">
- **Score de salud (1-5):** <X> · *¿Confianza honesta de que se cierra?*
- **Acción inmediata del rep:** <qué tiene que hacer esta semana>

### D-002 — <Cliente>

(misma estructura)

(repetir por deal activo, priorizando los de mayor monto + mayor stage)

---

## 4. Deal health flags

> Deals que requieren atención específica esta semana.

### 🔴 Stalled (sin actividad > 14 días)

| Deal | Cliente | Stage | Días sin actividad | Razón conocida | Acción recomendada |
|---|---|---|---|---|---|
| D-X | | | | | |

### 🟠 Decision maker no identificado

| Deal | Cliente | Stage | Quién tenemos | Quién falta | Plan de acceso |
|---|---|---|---|---|---|
| D-Y | | | | | |

### 🟡 Missing data en CRM

> Deals con campos críticos vacíos que distorsionan el forecast.

- D-Z — <campos pendientes: monto, fecha cierre, próximo paso>

### 🔴 Slipped close date

> Deals cuya fecha de cierre se ha pospuesto 2+ veces.

- D-W — <ej. cerraba en Q1, ahora Q3>

---

## 5. Análisis de avance entre etapas

> Útil para detectar dónde se atascan los deals.

| Movimiento | # Deals esta semana | Notas |
|---|---|---|
| Discovery → Demo | | |
| Demo → Proposal | | |
| Proposal → Negotiation | | |
| Negotiation → Closed Won | | |
| Cualquier etapa → Closed Lost | | <razón principal de pérdida> |

---

## 6. Análisis Win/Loss del periodo (si aplica)

> Solo si el review cubre un periodo completo (mes/trimestre).

### Wins

| Cliente | Monto | Cycle length (días) | Driver principal |
|---|---|---|---|
| | | | <ej. "value-prop encajaba al 100%", "champion fuerte"> |

### Losses

| Cliente | Monto | Razón | Aprendizaje |
|---|---|---|---|
| | | <competidor / no-budget / no-decision / timing> | <qué cambiaríamos> |

---

## 7. Acciones acordadas en el review

> Salidas concretas de la reunión.

| Acción | Owner | Plazo | Resultado esperado |
|---|---|---|---|
| Acceder al CFO en cuenta <X> | <rep> | <fecha> | Identificar Authority |
| Reenviar propuesta a <Y> con ajuste de pricing | <rep> | <fecha> | Mover a Negotiation |
| Cualificar mejor el siguiente deal del pipeline | <rep + manager> | <fecha> | Reducir stall rate |

---

## 8. Próxima review

- **Cuándo:** <fecha + hora>
- **Foco:** <ej. cierre de Q, deals stalled, conversion de Demo→Proposal>

---

## 9. Anexos

- Export del CRM con todos los deals: <link>
- Win/loss histórico: <link a `<proyecto>/sales/analysis/`>
- Battle cards relevantes para deals en curso: <link>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin etapas del CRM ni cuota, parar.
2. **Aplicar pesos consistentes por etapa.** Si el equipo usa 10/30/60/80 para Discovery/Demo/Proposal/Negotiation, mantener; si no, definir y aplicar consistentemente.
3. **Calcular weighted forecast = Σ (monto × probabilidad).** Lo más cercano a la realidad esperable.
4. **Identificar deals stalled** (> 14 días sin actividad) y deals con missing critical data.
5. **Análisis honesto deal-by-deal**. Score de salud 1-5 sin inflar (el optimismo crónico mata el forecast).
6. **Análisis de avance entre etapas** — donde se atascan los deals es donde está la oportunidad de optimización del proceso.
7. **Cerrar con acciones concretas** (sección 7). Sin acciones, el review fue evento social, no operativo.
8. **Marcar `[CRM PENDIENTE]`** los campos que necesitan actualizarse antes de la siguiente review, `[DATO PENDIENTE]` lo que requiere validación con el rep.
9. **Guardar** en `<proyecto>/sales/pipeline/pipeline-review-<periodo>.md`.
10. **Reportar** al usuario: ruta, position vs cuota, top 3 deals críticos, deals stalled, acciones acordadas.

---

## Restricciones

- **No infles forecast.** Wishful thinking es la fuente nº1 de pérdida de credibilidad del equipo de ventas.
- **No omitas deals stalled.** Esconderlos no los hace avanzar.
- **No mezcles pipeline review con análisis de métricas agregadas.** Para eso está `kpi-dashboard`. Aquí: deals individuales.
- **No registres "I'll follow up next week" como next step.** Eso es no-step. Concretar qué, con quién, cuándo.
- **No publiques forecast sin coverage ratio.** Sin coverage, el forecast no se puede juzgar.
- **No cierres review sin acciones asignadas.** Cada deal en riesgo necesita owner + plazo.
- **No reuses pipeline-review.md antiguo** sin actualizar datos del CRM. Datos viejos = decisiones viejas.
- Aplican las reglas de output de `_shared/output-rules.md`.
