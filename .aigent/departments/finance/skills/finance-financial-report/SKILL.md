---
name: "finance-financial-report"
user-invocable: true
description: >
  Skill for producing a structured financial report for a closed period: P&L,
  Balance Sheet, Cash Flow, KPI dashboard, variance analysis vs budget/forecast,
  and audience-aware executive summary. Currency- and accounting-framework-aware.
---

# Skill: Financial Report

**Entregable:** archivo `.md` con el report del periodo, guardado en `<proyecto>/finance/reporting/statements/<YYYY-MM>-statements.md` (mensual/trimestral) o `<YYYY>-statements.md` (anual). Para reports a board, usar `reporting/board/<YYYY-MM>-board.md`.

---

## Cuándo usar esta skill

- Hay que producir el report mensual / trimestral / anual con P&L, Balance, Cash Flow y KPIs.
- Hay que generar materiales para una reunión de board o investor update.
- Hay que documentar el cierre de un periodo con análisis de variance.

**Cuándo NO usar:**

- Para una factura puntual (eso es `invoice-template`).
- Para el cierre operativo paso a paso (eso es un *close checklist* específico).
- Para un dashboard automatizado de BI (la skill produce un documento; el dashboard vive en otra herramienta).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Periodo | Mes, trimestre, año fiscal o ventana específica |
| Audiencia | Board, leadership interno, equipos, externo (investors, banco) |
| Estados | ¿P&L sólo, P&L + Balance, los tres + KPI dashboard? |
| Comparativos | ¿vs mes anterior, mismo periodo año anterior, presupuesto, forecast, combinaciones? |
| Moneda funcional y marco contable | (se leen de `decisions` si están) |
| Fuente de datos | ¿Cierre cerrado en sistema X, exports manuales, mix? |
| KPIs a destacar | Si la audiencia espera 5-10 KPIs específicos |
| Variance | ¿Qué consideramos variance significativa (umbral % / absoluto)? |

---

## Plantilla del entregable

```markdown
---
type: "financial-report"
period: "<YYYY-MM | YYYY-Q[1-4] | YYYY>"
audience: "board | leadership | team | external"
status: "draft | reviewed | published"
date_published: "YYYY-MM-DD"
currency: "EUR | USD | ..."
framework: "IFRS | US GAAP | PGC | ..."
fiscal_year: "FY2027 | ..."
owner: "<rol/persona>"
---

# Financial Report — <Empresa> · <Periodo>

## 0. Resumen ejecutivo

> 5-7 líneas con highlights del periodo. Adaptado a la audiencia (board ve highlights estratégicos; leadership ve operativos).

**Métricas clave:**

| Métrica | <Periodo> | <Comparativo 1> | Δ | <Comparativo 2> | Δ |
|---|---|---|---|---|---|
| Revenue | <X> | <Y> | <+Z%> | <W> | <+V%> |
| Gross Margin | <X%> | <Y%> | <+Z pp> | <W%> | <+V pp> |
| EBITDA | <X> | <Y> | <+Z%> | <W> | <+V%> |
| Net Income | <X> | <Y> | <+Z%> | <W> | <+V%> |
| Cash position EOP | <X> | <Y> | <Δ> | — | — |
| Burn / generation neto | <X> | <Y> | <Δ> | — | — |

**Lo más importante del periodo:**
- <Highlight 1>
- <Highlight 2>
- <Highlight 3>

**Áreas de atención:**
- <Watchpoint 1>

---

## 1. P&L del periodo

| Concepto | <Periodo> | <Periodo anterior> | YoY | Budget | Variance vs budget |
|---|---|---|---|---|---|
| Revenue | | | | | |
| − COGS | | | | | |
| **Gross Profit** | | | | | |
| Gross Margin % | | | | | |
| − Personnel | | | | | |
| − Marketing | | | | | |
| − Infra / SaaS | | | | | |
| − G&A | | | | | |
| **EBITDA** | | | | | |
| EBITDA % | | | | | |
| − D&A | | | | | |
| **EBIT** | | | | | |
| ± Financiero | | | | | |
| − Impuestos | | | | | |
| **Net Income** | | | | | |

### Variance commentary (P&L)

> Cada línea con variance > umbral va comentada.

- **<Línea X>:** real <valor> vs budget <valor>, gap <Δ>. **Por qué:** <causa identificada>.

---

## 2. Balance Sheet

| Concepto | <Periodo> | <Periodo anterior> | Δ |
|---|---|---|---|
| **Activo** | | | |
| Cash & equivalentes | | | |
| AR | | | |
| Inventario | | | |
| Activos fijos (neto) | | | |
| Otros activos | | | |
| **Total Activo** | | | |
| **Pasivo + Patrimonio** | | | |
| AP | | | |
| Deuda corto plazo | | | |
| Deuda largo plazo | | | |
| Otros pasivos | | | |
| Patrimonio | | | |
| **Total Pasivo + Patrimonio** | | | |

### Variance commentary (Balance)

- **<Línea X>:** <comentario>.

---

## 3. Cash Flow Statement

| Concepto | <Periodo> | YTD |
|---|---|---|
| Operating Activities | | |
| ─ Net Income | | |
| ─ + D&A | | |
| ─ Δ Working Capital | | |
| ─ Otros | | |
| **Cash from Operations** | | |
| Investing Activities | | |
| ─ Capex | | |
| ─ Adquisiciones / Desinversiones | | |
| **Cash from Investing** | | |
| Financing Activities | | |
| ─ Deuda emitida / repagada | | |
| ─ Equity emitido | | |
| ─ Dividendos / Recompras | | |
| **Cash from Financing** | | |
| **Net Change in Cash** | | |
| Cash inicial | | |
| **Cash final** | | |

---

## 4. KPI Dashboard

> 5-15 KPIs máximo. Mix financiero + operativo si aplica.

| KPI | <Periodo> | Target | Variance | Tendencia (últ. 6 periodos) | Comentario |
|---|---|---|---|---|---|
| ARR / MRR | | | | <↗ / ↘ / →> | |
| Net Revenue Retention | | | | | |
| Gross Margin % | | | | | |
| CAC payback (meses) | | | | | |
| Burn multiple | | | | | |
| Runway (meses) | | | | | |
| <Operativo 1> | | | | | |

---

## 5. Variance vs Budget — análisis por driver

> Solo si los comparativos incluyen budget. Profundiza en los gaps materiales.

### Revenue
- **Driver: Volume.** Plan <X>, real <Y>. Driver de fondo: <causa>.
- **Driver: Price/Mix.** Plan <X>, real <Y>. Driver de fondo: <causa>.

### Costes
- **Personnel.** Variance <Δ>. Origen: <hires retrasados / extras / on-costs>.
- **<Otra línea material>**.

---

## 6. Forecast actualizado (opcional)

> Si el periodo cambia materialmente la perspectiva del FY, actualizar.

| Métrica | Budget original FY | Forecast actualizado | Δ |
|---|---|---|---|
| Revenue FY | | | |
| EBITDA FY | | | |
| Cash EOP FY | | | |

---

## 7. Acciones recomendadas

- <Acción 1: ej. acelerar AR de cuentas X-Y, ajustar plan de hiring del Q+1>
- <Acción 2>

---

## 8. Apéndices

- Cierre detallado del periodo: <link a `close/<YYYY-MM>.md`>
- Conciliaciones: <link>
- Detalle de KPIs y definiciones: <link>
- Estado de aging AR/AP: <link>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin moneda, marco y comparativos, el report no es comparable.
2. **Validar fuente** de cada bloque: P&L del sistema contable, Balance idem, Cash Flow idem (o derivado de P&L + Δ Balance). Conciliar.
3. **Aplicar el umbral de variance** y comentar todo lo que supere el umbral. Variance sin comentary = report incompleto.
4. **Adaptar profundidad a audiencia:**
   - **Board:** secciones 0, 1 resumido, 3 (cash), 4 (KPI dashboard), 5 (variance commentary alto nivel), 7.
   - **Leadership operativo:** todas las secciones, profundidad media.
   - **Externo (investors, banco):** 0, 1, 2, 3 detallado; KPI selectivos.
5. **Trazabilidad explícita:** cada cifra clave dice de qué fuente sale.
6. **Marcar `[DATO PENDIENTE]`** lo que falta del sistema, `[CONCILIAR]` lo que requiere validación cruzada, `[VERIFICAR FISCAL]` lo dependiente de normativa local.
7. **Guardar** en `<proyecto>/finance/reporting/statements/<periodo>-statements.md` o `<proyecto>/finance/reporting/board/<periodo>-board.md` según audiencia.
8. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen ejecutivo (5-7 líneas adaptadas a audiencia).
   - Variances materiales y su causa.
   - Próximo paso: cash check con `finance-treasury`, presentación al board, ajustes para el siguiente forecast.

---

## Restricciones

- **No inventes cifras.** Cada número viene del sistema o de fuente documentada.
- **No omitas variance commentary.** Un report sin "por qué" es un informe a medias.
- **No mezcles management con statutory.** El report dice claramente su destino.
- **No publiques sin moneda y marco** en el header.
- **No ocultes mala señal.** Si hay deterioro material, el resumen ejecutivo lo dice antes que los aspectos positivos.
- **No prometas precisión que no existe.** Si una cifra es estimación (típicamente accruals), márcalo.
- Aplican las reglas de output de `_shared/output-rules.md`.
