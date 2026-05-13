---
name: "budget-plan"
description: >
  Skill for producing a structured annual or quarterly budget plan: drivers,
  monthly P&L by category, headcount plan, capex plan, scenario modeling
  (best/base/worst), explicit assumptions and variance framework. Currency- and
  accounting-framework-aware.
---

# Skill: Budget Plan

**Entregable:** archivo `.md` con el plan completo (estructura cuantitativa + supuestos + escenarios), guardado en `<proyecto>/finance/budgeting/annual/budget-<FY>.md`. Opcionalmente, archivo `.xlsx` adicional con las tablas mensualizadas si el contexto lo justifica.

---

## Cuándo usar esta skill

- Hay que producir el presupuesto anual (o trimestral) del ejercicio.
- Hay que rehacer un budget existente porque cambiaron drivers materiales (pivote de producto, recesión, fundraising, M&A).
- Hay que estructurar el ejercicio bottom-up + top-down con cierre conciliado.

**Cuándo NO usar:**

- Para un rolling forecast (eso usa el `budget-plan` como base pero el output es distinto — `forecasts/`).
- Para un análisis de escenarios puntual (se documenta en `scenarios/`).
- Para presupuesto operativo de una campaña concreta (eso es responsabilidad del dept que la lanza, con apoyo financiero).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Fiscal year | ¿Qué FY cubre? (calendario natural / FY personalizado con inicio en mes X) |
| Horizonte | ¿Anual / trimestral / multianual? |
| Granularidad | ¿P&L empresa / por departamento / por línea de negocio o producto? |
| Moneda funcional | ¿Cuál? (se lee de `decisions` si está) |
| Marco contable | IFRS / US GAAP / PGC español / otro |
| Drivers principales | ¿Cuáles son los drivers de revenue y de coste material? |
| Approach | Bottom-up con managers, top-down desde leadership, o ambos reconciliados |
| Inputs base | ¿Actuals del último cierre? ¿Forecast vigente? ¿Inputs de managers? |
| Restricciones / supuestos | ¿Techos de gasto, congelación de headcount, fundraising previsto, eventos one-off? |
| Escenarios | ¿Qué 1-3 drivers movemos para best/worst case? |

---

## Plantilla del entregable

```markdown
---
type: "budget-plan"
fiscal_year: "FY2027 (Ene-Dic 2027) | FY27 (Jul 2026-Jun 2027)"
status: "draft | approved | in-force | superseded"
date: "YYYY-MM-DD"
owner: "<rol/persona>"
currency: "EUR | USD | GBP | ..."
framework: "IFRS | US GAAP | PGC | ..."
approach: "top-down | bottom-up | reconciled"
horizon: "annual | quarterly | multi-year"
granularity: "company-level | by-department | by-line-of-business"
---

# Presupuesto <FY> — <Empresa>

## 0. Resumen ejecutivo

> 5-7 líneas con las cifras clave del base case.

| Métrica | <FY anterior actual / forecast> | <FY budget> | Δ |
|---|---|---|---|
| Revenue | <X> | <Y> | <+Z%> |
| Gross Margin | <X%> | <Y%> | <+Z pp> |
| EBITDA | <X> | <Y> | <+Z%> |
| Net Income | <X> | <Y> | <+Z%> |
| Cash burn / generation | <X> | <Y> | <+Z%> |
| Headcount EOP | <X> | <Y> | <+Z> |

**Bets principales del año:** <1-3 puntos>.

---

## 1. Drivers

> Drivers críticos y su valor base. Justifica cada uno.

### Revenue
- **<Driver 1: ej. número de cuentas activas>:** <valor base>. Fuente: <CRM / actuals / supuesto>.
- **<Driver 2: ej. ARPU>:** <valor base>. Fuente: <...>.
- **<Driver 3: ej. crecimiento neto mensual %>:** <valor base>. Fuente: <...>.

### Costes variables
- **<Driver 1: ej. cost-of-serve por cliente>:** <valor base>.

### Headcount
- **<Driver 1: ej. ramp-up de hiring por trimestre>:** <plan>.

### Capex
- **<Driver 1: ej. capex de IT por nuevo empleado>:** <valor base>.

---

## 2. P&L mensualizado — base case

| Concepto | Ene | Feb | Mar | Q1 | Abr | May | Jun | Q2 | ... | FY total |
|---|---|---|---|---|---|---|---|---|---|---|
| Revenue | | | | | | | | | | |
| − COGS | | | | | | | | | | |
| **Gross Profit** | | | | | | | | | | |
| − Personnel | | | | | | | | | | |
| − Marketing | | | | | | | | | | |
| − Infra / SaaS | | | | | | | | | | |
| − G&A | | | | | | | | | | |
| **EBITDA** | | | | | | | | | | |
| − D&A | | | | | | | | | | |
| **EBIT** | | | | | | | | | | |
| ± Financiero | | | | | | | | | | |
| − Impuestos | | | | | | | | | | |
| **Net Income** | | | | | | | | | | |

> Si la tabla es demasiado ancha para markdown, mantener el resumen Q1-Q4 inline y exportar el detalle mensual a `.xlsx`.

---

## 3. Plan de headcount

| Equipo | EOP <FY-1> | Hires Q1 | Hires Q2 | Hires Q3 | Hires Q4 | EOP <FY> | Coste anualizado |
|---|---|---|---|---|---|---|---|
| Engineering | | | | | | | |
| Product | | | | | | | |
| Marketing | | | | | | | |
| Sales | | | | | | | |
| G&A | | | | | | | |
| **Total** | | | | | | | |

**On-costs aplicados:** <% sobre salario bruto: seguridad social patronal, formación, equipamiento, etc.>

---

## 4. Plan de capex (si aplica)

| Categoría | Inversión <FY> | Mes adquisición | Vida útil (años) | Depreciación mensual |
|---|---|---|---|---|
| Hardware | | | | |
| Software (license activos) | | | | |
| Mobiliario / instalaciones | | | | |
| **Total** | | | | |

---

## 5. Escenarios

| Escenario | Drivers que cambian | Revenue | EBITDA | Cash burn / generation |
|---|---|---|---|---|
| **Best case** | <ej. crecimiento neto +25% vs base> | | | |
| **Base case** | <referencia> | | | |
| **Worst case** | <ej. crecimiento neto −15% vs base, churn +30%> | | | |

**Sensibilidades (1 driver, 1 efecto):**

| Driver | ±10% en driver | Δ Revenue | Δ EBITDA |
|---|---|---|---|
| <Driver 1> | | | |
| <Driver 2> | | | |

---

## 6. Supuestos clave (trazabilidad)

> Cada cifra que pueda ser cuestionada va aquí con su supuesto.

| Supuesto | Valor | Fuente / racional | Riesgo si falla |
|---|---|---|---|
| <Supuesto 1> | <valor> | <fuente> | <impacto> |
| <Supuesto 2> | <valor> | <fuente> | <impacto> |

---

## 7. Reconciliación bottom-up vs top-down (si aplica)

| Línea | Top-down (leadership) | Bottom-up (managers) | Gap | Decisión |
|---|---|---|---|---|
| Revenue | | | | <con cuál cerramos y por qué> |
| Personnel | | | | |
| Marketing | | | | |

---

## 8. Variance framework para futuros cierres

- **Umbral de variance significativa:** ±X% o ±€Y (lo que sea mayor).
- **Cadencia de revisión:** mensual durante el cierre + revisión completa al final de cada trimestre.
- **Triggers de re-presupuesto:** <eventos que obligan a abrir el budget, p. ej. caída de revenue >15%, M&A>.

---

## 9. Aprobaciones

| Decisión | Responsable | Fecha límite | Estado |
|---|---|---|---|
| Aprobación del presupuesto | <CEO / Board> | | [PENDIENTE] |
| Aprobación de plan de hiring | <CEO / CFO / Head of People> | | [PENDIENTE] |
| Aprobación de capex | <CFO> | | [PENDIENTE] |

---

## 10. Anexos

- Actuals del cierre <FY-1>: <link a `reporting/close/`>
- Forecast vigente: <link>
- Detalle mensual completo: <`.xlsx` si aplica>
- Decisiones globales aplicadas: <link>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin moneda funcional, marco contable y FY, parar.
2. **Leer actuals** del último cierre + forecast vigente si existen. El presupuesto sin base de actuals es ficción.
3. **Identificar drivers** críticos y documentarlos antes de mover una sola cifra al P&L.
4. **Construir el P&L mensualizado** desde drivers, no desde "el año pasado + 10%". Cada línea sale de un cálculo trazable.
5. **Plan de headcount con detalle** por equipo y mes de incorporación. Es la línea de coste más material en la mayoría de empresas; merece su tabla.
6. **Tres escenarios** + sensibilidad mínima a 2 drivers. Sin escenarios el presupuesto se lee como predicción.
7. **Documentar supuestos** en sección 6 con su fuente. Cada supuesto que falle debe poder rastrearse y comunicarse en variance posteriores.
8. **Si hay approach reconciliado**, sección 7 documenta las diferencias bottom-up vs top-down y por qué cierras donde cierras.
9. **Marcar `[DATO PENDIENTE]`** lo que requiere fuente, `[APROBAR]` lo que necesita ratificación, `[BENCHMARK PENDIENTE]` lo que pide validación externa.
10. **Guardar** en `<proyecto>/finance/budgeting/annual/budget-<FY>.md`. Si los números requieren manipulación cuantitativa, exportar también `.xlsx` con la skill `xlsx`.
11. **Reportar** al usuario:
    - Ruta del archivo.
    - Resumen ejecutivo: revenue, EBITDA, cash, headcount EOP.
    - Items críticos pendientes.
    - Próximo paso: cash check con `finance-treasury`, aprobaciones, reconciliación final.

---

## Restricciones

- **No inventes cifras.** Cada línea sale de driver + supuesto, o de un dato real.
- **No prometas precisión que no existe.** El presupuesto es un plan, no una predicción.
- **No omitas escenarios.** Tres siempre (best/base/worst).
- **No publiques sin moneda y marco** en el header.
- **No mezcles management con statutory.** Si el budget va a ser auditado o presentado externamente con criterios contables específicos, marcarlo.
- **No prometas headcount sin política aprobada.** El plan de hiring requiere aprobación de leadership.
- Aplican las reglas de output de `_shared/output-rules.md`.
