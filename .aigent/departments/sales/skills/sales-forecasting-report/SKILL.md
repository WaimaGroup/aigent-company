---
name: "sales-forecasting-report"
user-invocable: true
description: >
  Skill for producing a formal sales forecasting report for a period (quarter,
  year): commit/best-case/pipeline forecast methodology, coverage analysis vs
  quota, segmented by rep/region/segment, historical win rates and cycle length,
  confidence intervals, risks, recommended interventions. Strategic, board-ready.
  Distinct from pipeline-review (operational, weekly).
---

# Skill: Forecasting Report

**Entregable:** archivo `.md` con forecast formal para un periodo, listo para leadership/board/investor update. Vive en `<proyecto>/sales/forecasts/forecast-<periodo>.md`.

---

## Cuándo usar esta skill

- Cierre de trimestre/año: forecast oficial al board.
- Investor update con métricas de revenue forecasted.
- Decisión estratégica que depende de proyección (hiring plan, funding, M&A).
- Reconciliar bottom-up del equipo de ventas con top-down de leadership.

**Cuándo NO usar:**

- Para revisión operativa weekly del pipeline (eso es `pipeline-review` — deal-by-deal).
- Para dashboard de KPIs de ventas (eso es `kpi-dashboard` — métricas agregadas).
- Para análisis de un deal individual.

> **Diferencia vs `pipeline-review`:** pipeline-review es operativo y semanal, opera deal por deal con next-steps. Forecasting-report es estratégico y trimestral/anual, opera con metodología estadística (weighted, confidence intervals, segmentación).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Periodo objetivo | Trimestre / año fiscal / H1 / H2 |
| Audiencia | Leadership / board / investors / equipo |
| Cuota / target del periodo | Cuál es el objetivo a comparar |
| Datos disponibles | Pipeline activo, win rates históricos, cycle length, datos por segmento |
| Granularidad | Total empresa / por equipo / por rep / por segmento (SMB/mid/enterprise) / por vertical / por geografía |
| Win rates históricos | ¿Por etapa? ¿Por rep? ¿Por segmento? ¿En qué ventana temporal? |
| Cycle length | Histórico — promedio y desviación |
| Política de probabilidades | ¿Pesos por etapa estándar de la empresa? |

---

## Plantilla del entregable

Nombre del archivo: `forecast-<YYYY-Qn-o-FY>.md`.

```markdown
---
type: "sales-forecast"
period: "<YYYY-Qn | YYYY-FY | YYYY-Hn>"
audience: "leadership | board | investors | sales-team"
quota: "<€/$ amount>"
status: "draft | reviewed | published"
date_cutoff: "YYYY-MM-DD"
forecaster: "<rol/persona>"
methodology: "weighted-pipeline | rep-call | historical-conversion | combined"
---

# Sales Forecast — <Periodo>

## 0. Resumen ejecutivo

> 5-7 líneas. Posición vs cuota, forecast central, confianza, riesgos top.

**Forecast central:** <€/$ X> · <% de cuota>

| Escenario | Cifra | Probabilidad | vs cuota |
|---|---|---|---|
| Best case (pipeline + stretch) | <€/$> | <P75-P90> | <%> |
| **Commit (alta confianza)** | <€/$> | <P50-P75> | **<%>** |
| Worst case (conservative) | <€/$> | <P25-P50> | <%> |

**Coverage ratio (pipeline / gap a cuota):** <X.x>

**Top 3 riesgos:** <listado>

**Recomendación general:** <una frase>

---

## 1. Metodología

> Sin metodología explícita, el forecast no se puede defender ni replicar.

### Approach

- **Weighted pipeline:** cada deal abierto se multiplica por probabilidad de la etapa.
- **Rep-call:** cada rep comprometo en commit lo que firma que va a cerrar.
- **Historical conversion:** se aplican win rates históricos por etapa a la mediana de cycle length.
- **Combined:** se hace cada uno por separado y el commit final es el más conservador (o se reconciliará entre los tres).

**Approach usado en este forecast:** `<combined>`. Justificación: <razón>.

### Pesos de probabilidad por etapa

| Etapa | Probabilidad estándar | Probabilidad ajustada (este periodo) |
|---|---|---|
| Discovery | 10% | <ajuste si difiere> |
| Demo | 30% | |
| Proposal | 60% | |
| Negotiation | 80% | |
| Verbal commit / closing | 90% | |

---

## 2. Estado actual

| Métrica | Valor |
|---|---|
| Closed Won YTD/QTD | <€/$> |
| Pipeline activo total | <€/$> |
| Weighted pipeline | <€/$> |
| Coverage ratio | <X.x> |
| Gap a cuota | <€/$> |
| Días restantes en el periodo | <N> |
| Cycle length promedio | <días> |

---

## 3. Forecast por escenario

### Best case

**Supuestos:**
- Todos los deals de Proposal+ cierran este periodo.
- Cierra 30% del pipeline en Discovery/Demo.
- Cycle length se mantiene en promedio histórico.

**Cifra:** <€/$ X>

### Commit

**Supuestos (más conservadores):**
- Solo deals de Negotiation+ con cycle compatible.
- 60% del weighted pipeline de Proposal+.
- Sin cobrar lo que entra a pipeline en última semana del periodo.

**Cifra:** <€/$ Y>

### Worst case

**Supuestos:**
- Solo Closed Won YTD + deals committed verbalmente.
- 30% del weighted pipeline de Proposal+.

**Cifra:** <€/$ Z>

---

## 4. Forecast por segmentación

> Granularidad relevante para la audiencia.

### Por equipo / rep

| Rep | Closed YTD | Commit | Best case | Cuota individual | % de cuota commit |
|---|---|---|---|---|---|
| <Rep A> | | | | | |
| <Rep B> | | | | | |
| Sum / equipo | | | | | |

### Por segmento (si aplica)

| Segmento | Closed | Commit | Pipeline | Best case |
|---|---|---|---|---|
| SMB | | | | |
| Mid-market | | | | |
| Enterprise | | | | |

### Por vertical / geografía (si aplica)

(misma estructura)

---

## 5. Win rates históricos (input al forecast)

| Etapa | Win rate últimos 4 trimestres | Tendencia |
|---|---|---|
| Discovery → Demo | <%> | ↗/↘/→ |
| Demo → Proposal | <%> | |
| Proposal → Negotiation | <%> | |
| Negotiation → Closed Won | <%> | |
| **Overall Discovery → Closed** | <%> | |

> Marcar si hay variación significativa entre reps / segmentos / etapas.

---

## 6. Cycle length

| Métrica | Valor |
|---|---|
| Mediana de cycle (días) | <N> |
| P75 (deals lentos) | <N> |
| P25 (deals rápidos) | <N> |
| Por segmento — SMB | <N> |
| Por segmento — Enterprise | <N> |

**Implicación para el periodo:** un deal que entra al pipeline hoy con <X días> de cycle típico, ¿llega a cerrar dentro del periodo? <sí/no/depende>.

---

## 7. Riesgos del forecast

| Riesgo | Impacto en commit | Probabilidad | Mitigación |
|---|---|---|---|
| <Deal grande X se retrasa> | <€/$ —Y> | Alta/Media/Baja | <acción> |
| <Churn no anticipado en cuenta Z> | <€/$ —Y> | | |
| <Sales hire retrasado> | <pipeline insuficiente> | | |
| <Estacionalidad típica de Q4 / agosto> | <ajuste explícito> | | |

---

## 8. Reconciliación bottom-up vs top-down

> Si la empresa hace ambos, mostrar dónde difieren y por qué.

| Línea | Bottom-up (commit reps) | Top-down (leadership) | Δ | Decisión |
|---|---|---|---|---|
| Total commit | <€/$> | <€/$> | <€/$> | <con cuál cerramos y por qué> |

---

## 9. Acciones recomendadas

> Sin acciones, el forecast es informe, no herramienta de gestión.

| Acción | Owner | Plazo | Impacto esperado |
|---|---|---|---|
| Acelerar deals X, Y, Z (Negotiation > 30 días) | <Sales lead> | <fecha> | +<€/$> al commit |
| Decisión de hiring (acelerar / pausar) | <CRO/CFO> | <fecha> | Coverage Q+1 |
| Push activo en segmento <X> donde coverage está bajo | <Sales lead> | <fecha> | <€/$> |

---

## 10. Comparación con forecast anterior

> Si hubo forecast previo, mostrar variance y razones.

| Métrica | Forecast anterior | Forecast actual | Δ |
|---|---|---|---|
| Commit | <€/$> | <€/$> | <€/$> |
| Best case | | | |
| Coverage | | | |

**Razones del cambio:** <listado breve>

---

## 11. Anexos

- Datos del CRM al cutoff: <link export>
- Win rate detallado por rep / segmento: <link>
- Histórico de forecast vs real (precisión histórica): <link>
- Pipeline review más reciente: <link a `<proyecto>/sales/pipeline/`>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin datos de pipeline activo, win rates históricos y cycle length, parar.
2. **Elegir methodology consciente.** Combined es defensible; rep-call solo es optimista; weighted-only ignora ajustes por contexto.
3. **Construir el forecast por escenario (best/commit/worst)** con supuestos explícitos. Sin supuestos, los números son opacos.
4. **Segmentar al nivel de detalle de la audiencia.** Board ve total + segmentos clave; sales team ve por rep.
5. **Anclar en win rates históricos**, no en deseos. Si win rates están bajando, el forecast debe reflejarlo.
6. **Riesgos explícitos** con impacto en commit. Sin riesgos cuantificados, el forecast se vende como certeza.
7. **Reconciliación bottom-up vs top-down** si ambos existen. Documentar dónde difieren y por qué.
8. **Acciones recomendadas con owner y plazo.** El forecast termina en acciones; si no, es informe.
9. **Comparar con forecast anterior** para mostrar precisión histórica y aprender.
10. **Marcar `[DATA PENDIENTE]`** lo que requiere export adicional, `[VERIFICAR RATE]` win rates que requieren validación, `[DECISION]` acciones que requieren ratificación.
11. **Guardar** en `<proyecto>/sales/forecasts/forecast-<periodo>.md`.
12. **Reportar** al usuario: ruta, commit cifra, coverage, top riesgos, acciones top.

---

## Restricciones

- **No infles forecast.** Wishful thinking es la fuente nº1 de pérdida de credibilidad ante board.
- **No publiques commit sin metodología declarada.** "Commit es 3M" sin explicar de dónde sale es magia.
- **No omitas riesgos.** Esconderlos los multiplica cuando se materializan.
- **No mezcles forecast con pipeline review.** Audiencia y propósito distintos.
- **No reuses pesos de probabilidad** sin validar que reflejan los win rates reales del equipo.
- **No publiques sin comparar con forecast anterior** si lo había. La precisión histórica es info crítica para el lector.
- **No prometas certezas** — siempre rango (commit / best / worst), nunca una sola cifra como "verdad".
- Aplican las reglas de output de `_shared/output-rules.md`.
