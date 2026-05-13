---
name: "cash-forecast"
description: >
  Skill for producing a 13-week rolling cash forecast: weekly inflows/outflows by
  category, cash position per week, alerts when position drops below policy
  minimum, FX exposure if multi-currency, scenarios (best/base/worst case),
  variance vs previous forecast.
---

# Skill: Cash Forecast

**Entregable:** archivo `.md` con cash forecast 13 semanas (o periodicidad acordada), listo para reunión de leadership / treasury / board. Vive en `<proyecto>/finance/treasury/cash/cash-13w-<YYYY-MM-DD>.md`.

---

## Cuándo usar esta skill

- Cadencia recurrente de cash management (típicamente semanal o quincenal).
- Antes de una decisión que afecta liquidez (capex grande, hire grande, refinanciación, M&A).
- Tras un evento que cambia el supuesto (impago grande, ronda de inversión, cambio de pricing).
- Cierre de mes/trimestre/año para reporting financiero a leadership.

**Cuándo NO usar:**

- Para presupuesto anual (eso es `budget-plan`).
- Para report periódico de estados financieros (eso es `financial-report`).
- Para análisis estructural de runway con cambios de plan (eso es scenarios / strategy, no forecast operativo).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Periodo | Default 13 semanas (un trimestre); alternativas: 4-8 semanas (más operativo), 26 semanas (más estratégico) |
| Granularidad | Semanal (default), bisemanal, mensual |
| Moneda funcional | Se lee de `decisions`; ¿hay monedas operativas adicionales? |
| Cash position actual | Saldo en banco(s) al cierre del periodo anterior |
| AR aging | Aging de cobros pendientes con fechas esperadas |
| AP aging | Aging de pagos pendientes con fechas comprometidas |
| Pagos recurrentes conocidos | Payroll, alquileres, SaaS, impuestos, deuda |
| Cobros recurrentes conocidos | Suscripciones, contratos firmes |
| Política de cash mínimo | ¿Hay umbral mínimo? (típicamente X meses de OPEX) |
| Líneas de crédito disponibles | ¿Cuánto se puede tirar y a qué coste? |
| FX exposure | ¿Hay flujos en monedas distintas? |

---

## Plantilla del entregable

Nombre del archivo: `cash-13w-<YYYY-MM-DD>.md` (fecha del corte / inicio del forecast).

```markdown
---
type: "cash-forecast"
horizon_weeks: 13
granularity: "weekly"
cutoff_date: "YYYY-MM-DD"
currency_functional: "EUR | USD | ..."
currencies_operational: ["EUR", "USD", "GBP"]
cash_minimum_policy: "<€/$ amount>"
status: "draft | reviewed | published"
owner: "<treasurer / finance lead>"
next_review: "YYYY-MM-DD"
---

# Cash Forecast — <Periodo> · Cutoff <fecha>

## 0. Resumen ejecutivo

> 5-7 líneas. Posición de cash actual, evolución prevista, alertas activas.

**Headline:**
- **Cash position cutoff:** <€/$ X> (todas las monedas convertidas)
- **Cash position end-of-period (13W):** <€/$ Y>
- **Net change esperado:** <€/$ Δ>
- **Runway estimado (a actual burn rate):** <Z meses>
- **Cash mínimo de política:** <€/$ W>

**Alertas activas:**
- 🔴 <Semana N>: cash position cae por debajo del mínimo de política. Ver sección 5.
- 🟠 <Pago grande inesperado / cobro retrasado>: descripción.
- 🟡 <Watchpoint>: ...

**Recomendación:** <una frase>

---

## 1. Posición actual

### Por banco / cuenta

| Banco / Cuenta | Moneda | Saldo | Equivalente moneda funcional | Notas |
|---|---|---|---|---|
| <Banco A — cuenta principal> | EUR | 250.000 | 250.000 | Operativa diaria |
| <Banco A — cuenta ahorro> | EUR | 150.000 | 150.000 | Reserva |
| <Banco B — USD> | USD | 50.000 | 46.000 | Pagos USD |
| <Banco C — UK> | GBP | 30.000 | 35.000 | Operaciones UK |
| **Total** | | | **481.000** | |

### Líneas de crédito disponibles

| Línea | Banco | Disponible | Usado | Coste | Vencimiento |
|---|---|---|---|---|---|
| <Línea 1> | <Banco> | 200.000 | 0 | <€XX/año o tipo> | <fecha> |
| <Línea 2> | <Banco> | 100.000 | 50.000 | <coste> | <fecha> |

**Cash + líneas disponibles total:** <€/$>

---

## 2. Forecast 13 semanas — vista resumida

> Tabla maestra. Una columna por semana. Filas: inflows, outflows, neto, position.

| Concepto | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 | W10 | W11 | W12 | W13 | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Inflows** | | | | | | | | | | | | | | |
| AR cobros previstos | | | | | | | | | | | | | | |
| Nuevas ventas previstas | | | | | | | | | | | | | | |
| Otros (recoveries, intereses) | | | | | | | | | | | | | | |
| **Total inflows** | | | | | | | | | | | | | | |
| **Outflows** | | | | | | | | | | | | | | |
| Payroll | | | | | | | | | | | | | | |
| AP scheduled | | | | | | | | | | | | | | |
| Alquileres / leases | | | | | | | | | | | | | | |
| SaaS / herramientas | | | | | | | | | | | | | | |
| Impuestos | | | | | | | | | | | | | | |
| Deuda (capital + intereses) | | | | | | | | | | | | | | |
| Capex | | | | | | | | | | | | | | |
| Otros | | | | | | | | | | | | | | |
| **Total outflows** | | | | | | | | | | | | | | |
| **Net change** | | | | | | | | | | | | | | |
| **Cash position EOW** | | | | | | | | | | | | | | |

> En documentos reales, exportar también a `.xlsx` para manipulación.

---

## 3. Inflows — detalle

### AR aging y cobros previstos

| Cliente | Factura | Monto | Vencimiento original | Vencimiento esperado | Probabilidad cobro | Semana de cobro asumida |
|---|---|---|---|---|---|---|
| <Cliente A> | INV-2026-001 | 50.000 | 2026-05-15 | 2026-05-22 | 95% | W2 |
| <Cliente B> | INV-2026-007 | 25.000 | 2026-04-30 | 2026-06-15 | 70% | W6 |

> **Conservadurismo:** asumir vencimiento esperado, no original. Cobros < 80% probabilidad → reducir o mover a "best case".

### Nuevas ventas previstas

- Pipeline weighted relevante para el periodo: <€/$>
- % asumido para conservative: <30-50%>
- Distribución temporal: <semana media de cobro tras firma>

### Otros inflows

- <Recuperaciones / intereses / FX gains / etc.>

---

## 4. Outflows — detalle

### Payroll (recurrente)

| Categoría | Frecuencia | Monto típico | Semanas afectadas |
|---|---|---|---|
| Salarios | Mensual | <€X> | W1, W5, W9, W13 |
| Seguridad social | Mensual | <€X> | W2, W6, W10 |
| Bonus / comisiones | Trimestral | <€X> | W12 |

### AP scheduled

| Proveedor | Importe | Vencimiento | Semana de pago planificada |
|---|---|---|---|
| <Proveedor X> | <€> | <fecha> | <Wn> |

### Pagos recurrentes (SaaS, leases, etc.)

| Concepto | Monto | Frecuencia | Próximo pago |
|---|---|---|---|
| <SaaS A> | <€/mes> | Mensual | W1 |
| <Alquiler oficina> | <€/mes> | Mensual | W1 |
| <Leasing equipos> | <€/mes> | Mensual | W5 |

### Impuestos

| Impuesto | Importe estimado | Fecha límite | Semana |
|---|---|---|---|
| IVA trimestral | <€> | <fecha> | <Wn> |
| Sociedades (pago a cuenta) | <€> | <fecha> | <Wn> |

### Deuda

| Préstamo | Capital | Interés | Total semana | Semana |
|---|---|---|---|---|
| <Préstamo X> | <€> | <€> | <€> | <Wn> |

### Capex / inversiones puntuales

- <Item 1: descripción + semana>
- <Item 2: ...>

---

## 5. Alertas y semanas críticas

> Semanas donde la position cae por debajo del mínimo de política o donde hay variance material.

### 🔴 Semana <N>

- **Posición esperada:** <€/$ X> (por debajo del mínimo de <€/$ Y>)
- **Razón:** <ej. coincidencia de payroll + IVA + pago de proveedor grande>
- **Mitigaciones posibles:**
  1. Adelantar cobro de cliente <A> con descuento por pronto pago.
  2. Negociar extensión de pago con proveedor <X>.
  3. Tirar de línea de crédito <Y>.
  4. Aplazar capex no crítico.
- **Decisión propuesta:** <recomendación>

(repetir por cada alerta)

---

## 6. Escenarios

> Best/base/worst case sobre el forecast base.

### Base case (escenario principal del documento)

- Asume probabilidades de cobro estándar y pagos comprometidos.

### Best case

- AR cobra al 100% en vencimiento original.
- Nuevas ventas según pipeline weighted al 50%.
- Cash position end-of-period: <€/$ X> (vs base <€/$ Y>).

### Worst case

- AR sufre 30% de retraso adicional (≥30 días).
- Cliente top con factura grande no paga.
- Nuevas ventas al 10% de pipeline weighted.
- Cash position end-of-period: <€/$ Z>.
- Semanas críticas: <W3, W7, W11>.

**Acciones contingencia para worst case:** <listado>

---

## 7. FX exposure *(si multi-moneda)*

> Solo si la empresa opera en varias monedas.

### Exposure neta por moneda y semana

| Moneda | Inflows W1-W13 | Outflows W1-W13 | Net exposure |
|---|---|---|---|
| USD | 100.000 | 80.000 | +20.000 |
| GBP | 30.000 | 50.000 | -20.000 |

**Tipo de cambio usado:** <fecha + fuente — ej. ECB rate of YYYY-MM-DD>

**Sensibilidad:** si EUR/USD cambia <±5%>, impact en EUR equivalent es <±€X>.

**Recomendación de hedging:** <ninguna / natural hedging suficiente / considerar forward para GBP exposure>.

---

## 8. Variance vs forecast anterior

> Si hay forecast anterior comparable, mostrar qué cambió.

| Semana | Forecast anterior | Forecast actual | Δ | Causa |
|---|---|---|---|---|
| W4 (entonces W11) | <€/$> | <€/$> | <€/$> | <ej. "cobro grande retrasado 2 semanas"> |
| W8 | | | | |

---

## 9. Acciones acordadas

> Salidas concretas del review de cash con leadership/treasury.

| Acción | Owner | Plazo | Resultado esperado |
|---|---|---|---|
| Acelerar cobro de cliente <A> con descuento 2% | <AR responsible> | <fecha> | Cobro 4 semanas antes |
| Negociar extensión 30 días con proveedor <X> | <AP responsible> | <fecha> | Mejora cash en W3 |
| Activar línea de crédito 50k en W7 si forecast se cumple | <treasurer> | W6 | Cubrir W7 dip |

---

## 10. Próxima revisión

- **Cadencia:** <semanal / quincenal / mensual>
- **Próxima revisión completa:** <fecha>
- **Triggers de re-evaluación fuera de cadencia:** <eventos: gran impago, M&A, fundraising, crisis>.

---

## 11. Anexos

- AR aging detallado: <link>
- AP aging detallado: <link>
- Histórico de forecasts anteriores: <links>
- Cálculo de runway con escenarios extendidos: <link a `<proyecto>/finance/budgeting/scenarios/`>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin posición actual, aging AR/AP y pagos recurrentes, parar.
2. **Conservadurismo en planificación.** AR con probabilidad < 80% → reducir o mover a best case, no contar al 100%. Cobros tarde, pagos antes.
3. **Distinguir compromisos vs aspiraciones.** AP scheduled con factura recibida es compromiso; nuevas ventas previstas son aspiración.
4. **Por moneda si multi-currency.** Convertir a moneda funcional para totales, pero el detalle granular en moneda nativa.
5. **Cash mínimo de política explícito.** Sin umbral, las alertas no tienen referencia.
6. **Identificar semanas críticas** y proponer mitigaciones concretas. Sin mitigaciones, las alertas son ruido.
7. **Escenarios best/worst** además del base. Sin escenarios, el forecast se lee como predicción.
8. **FX exposure** solo si material. Si <5% del flujo total, mencionar pero no profundizar.
9. **Variance vs forecast anterior** para mostrar precisión histórica y aprender.
10. **Acciones acordadas con owner + plazo** al cierre del review.
11. **Marcar `[DATO PENDIENTE]`** lo que requiere fuente, `[PROBABILIDAD COBRO POR VALIDAR]` AR con probabilidad subjetiva, `[OWNER PENDIENTE]` acciones sin dueño.
12. **Guardar** en `<proyecto>/finance/treasury/cash/cash-13w-<YYYY-MM-DD>.md`. Acompañar `.xlsx` cuando el detalle numérico lo justifique.
13. **Reportar** al usuario: ruta, position actual, position end-of-period, alertas activas, top acciones.

---

## Restricciones

- **No optimismo en AR.** Cliente que ha pagado tarde 3 veces no paga a tiempo la cuarta.
- **No omitas pagos recurrentes** (SaaS, leases, impuestos). Son sorpresas fáciles de evitar.
- **No mezcles moneda funcional con operativa** en totales sin conversión explícita y fecha.
- **No publiques sin política de cash mínimo declarada.** Sin referencia, las alertas son arbitrarias.
- **No omitas alertas activas.** Si la siguiente semana cae bajo el mínimo, va en sección 0 destacado, no escondido.
- **No prometas acciones de mitigación sin owner + plazo.**
- **No reutilices forecast viejo sin reconciliar.** Cada review actualiza con cobros/pagos reales del periodo previo.
- **No confundir cash forecast con runway.** Cash forecast es operativo a 13 semanas; runway es estratégico a meses con cambios de plan.
- Aplican las reglas de output de `_shared/output-rules.md`.
