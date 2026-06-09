# Finance — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de Finance.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`finance-orchestrator.md`](./finance-orchestrator.md).

> **Importante.** Toda primera petición del dept confirma: moneda funcional, marco contable (IFRS/GAAP/PGC), año fiscal y periodicidad de cierre. Sin esos datos, cualquier output puede estar mal.

---

## Índice

- [Cómo se invoca](#cómo-se-invoca)
- [Agentes](#agentes)
  - [finance-budgeting — Budgeting & Planning](#finance-budgeting--budgeting--planning)
  - [finance-reporting — Reporting (incluye AR/AP/Invoicing)](#finance-reporting--reporting-incluye-arapinvoicing)
  - [finance-treasury — Treasury](#finance-treasury--treasury)
- [Skills](#skills)
  - [budget-plan — Presupuesto con drivers, P&L mensualizado, headcount, capex, escenarios](#budget-plan--presupuesto-con-drivers-pl-mensualizado-headcount-capex-escenarios)
  - [financial-report — Report financiero con P&L + Balance + Cash Flow + KPIs + variance commentary](#financial-report--report-financiero-con-pl--balance--cash-flow--kpis--variance-commentary)
  - [invoice-template — Factura a cliente](#invoice-template--factura-a-cliente)
  - [cash-forecast — 13-week rolling cash forecast](#cash-forecast--13-week-rolling-cash-forecast)
  - [expense-policy — Política de gastos cross-funcional](#expense-policy--política-de-gastos-cross-funcional)
  - [board-deck-financial — Sección financiera del board deck](#board-deck-financial--sección-financiera-del-board-deck)
  - [expense-report — Submisión de gastos individual](#expense-report--submisión-de-gastos-individual)
- [Skills compartidas usadas en este dept](#skills-compartidas-usadas-en-este-dept)
- [Flujo end-to-end típico](#flujo-end-to-end-típico)

---

## Cómo se invoca

1. **Vía orquestador** (recomendado): `finance-orchestrator` enruta a budgeting / reporting / treasury.
2. **Directo a agente** cuando ya sabes (ej. "rolling forecast" → `finance-budgeting`).
3. **Skill directa** para outputs concretos (factura, cash forecast, expense report).

> **¿En Word o Excel?** Por defecto los entregables salen en `.md`. Si prefieres una hoja de Excel (lo natural para presupuestos, forecasts y tablas con fórmulas) o un documento de Word, solo pídelo (p. ej. «el presupuesto 2026 en Excel con fórmulas de totales», «el informe de tesorería en Word»): el sistema genera el `.xlsx`/`.docx` listo para abrir.

---

## Agentes

### `finance-budgeting` — Budgeting & Planning

Presupuestos anuales/trimestrales, rolling forecasts, escenarios, headcount plan, capex, política de gastos.

**Caso de uso:** presupuesto anual.

**Prompt:**
> "Presupuesto 2026 de la empresa. Moneda funcional EUR, IFRS, año fiscal calendario, cierre mensual. Necesito 3 escenarios (best/base/worst) con headcount y P&L mensualizado."

**Output esperado:**
- Ruta: `<proyecto>/finance/budgeting/budget-plan-2026.md`
- Estructura:
  ```markdown
  # Budget Plan 2026

  - Moneda: EUR
  - Marco contable: IFRS
  - Año fiscal: 2026-01-01 a 2026-12-31
  - Periodicidad cierre: mensual

  ## Drivers principales (input acordado con CEO/CFO)
  - Crecimiento ARR: 35% YoY base (45% best / 22% worst)
  - Net retention: 110% base (115% best / 100% worst)
  - Headcount: 240 → 295 end-of-year base
  - Gross margin: 78% (estable)

  ## P&L mensualizado (escenario base, k€)
  | Concepto | Ene | Feb | Mar | ... | Dic | Total |
  | Revenue | 850 | 870 | 890 | ... | 1.180 | 12.450 |
  | COGS | 187 | 191 | 196 | ... | 260 | 2.739 |
  | Gross profit | 663 | 679 | 694 | ... | 920 | 9.711 |
  | S&M | 285 | 290 | 295 | ... | 380 | 4.020 |
  | R&D | 240 | 245 | 250 | ... | 320 | 3.420 |
  | G&A | 95 | 95 | 100 | ... | 130 | 1.320 |
  | OpEx total | 620 | 630 | 645 | ... | 830 | 8.760 |
  | EBITDA | 43 | 49 | 49 | ... | 90 | 951 |

  ## Headcount plan
  | Mes | New hires | Salidas | EoM count |
  | Q1 | 12 | 4 | 248 |
  | Q2 | 14 | 5 | 257 |
  | Q3 | 12 | 4 | 265 |
  | Q4 | 10 | 5 | 270 (revisado vs original 295 por timing) |

  ## CapEx
  - IT infra: 180k€
  - Equipos personal: 95k€ (laptops, periféricos)
  - Mejoras oficina: 40k€
  - Total: 315k€

  ## Escenarios
  | Métrica | Worst | Base | Best |
  | Revenue total | 11.200 | 12.450 | 14.100 |
  | EBITDA | 480 | 951 | 1.620 |
  | Cash end-of-year | 4.200 | 4.950 | 5.800 |
  | Runway | 38 meses | 47 meses | 56 meses |

  ## Sensibilidades
  Cada 1% de crecimiento ARR mueve EBITDA 35k€.
  Cada hire extra cuesta ~85k€/año cargado.
  Cada punto de churn cuesta ~120k€ ARR.

  ## Supuestos clave (trazables)
  1. Pricing estable (no se sube)
  2. Net retention apoyada en 2 features de upsell que entran Q2 y Q3
  3. Hiring slow-down asumido en Q4 vs plan original
  ```

---

### `finance-reporting` — Reporting (incluye AR/AP/Invoicing)

Cierres, P&L/Balance/Cash Flow, KPI dashboards, board financial deck, AR cycle (invoicing), AP cycle, expense reports, conciliaciones.

**Caso de uso:** report financiero mensual a leadership.

**Prompt:**
> "Report financiero del cierre de abril 2026, audiencia leadership. EUR/IFRS. Incluye P&L + balance + cash flow + KPIs + variance commentary."

**Output esperado:**
- Ruta: `<proyecto>/finance/reporting/financial-report-2026-04.md`
- Estructura:
  ```markdown
  # Financial Report — April 2026

  - Audiencia: leadership (CEO, CFO, CRO, CTO, COO)
  - Periodo: 2026-04-01 a 2026-04-30
  - Moneda: EUR / IFRS

  ## Resumen ejecutivo
  Abril cierra con revenue 920k€ (+8% vs plan), EBITDA 65k€ (+34% vs plan).
  Tres motores: 2 deals enterprise cerrados antes de lo esperado, churn
  ligeramente mejor que forecast, y G&A controlado. Cash position fuerte
  con 4.85M€ y 46 meses de runway.

  ## P&L (vs plan)
  | Concepto | Actual | Plan | Variance | % |
  | Revenue | 920 | 850 | +70 | +8% |
  | COGS | 198 | 187 | +11 | +6% |
  | Gross profit | 722 | 663 | +59 | +9% |
  | S&M | 280 | 285 | -5 | -2% |
  | R&D | 238 | 240 | -2 | -1% |
  | G&A | 89 | 95 | -6 | -6% |
  | EBITDA | 65 | 43 | +22 | +51% |

  ## Variance commentary (obligatoria)
  - Revenue +70k€: 2 enterprise deals pulled from May (ACME, BetaPay).
    Implication: May será más bajo de lo planificado.
  - COGS +11k€: hosting cost subió por uso de nuevo cliente enterprise
    (storage). Esperado, controlado.
  - G&A -6k€: 1 hire G&A retrasado (start 1-may en vez de 1-abr).

  ## Balance summary
  - Assets: 8.2M€
    - Cash & equivalents: 4.85M€
    - AR: 1.2M€ (DSO 38 días, mejorado vs 42)
    - Otros: 2.15M€
  - Liabilities: 1.8M€
  - Equity: 6.4M€

  ## Cash flow del mes
  - Cash inflow: 945k€
  - Cash outflow: 875k€
  - Net change: +70k€
  - Position end-of-month: 4.85M€

  ## KPI dashboard
  | KPI | Apr | Target | Var | Trend |
  | ARR | 11.05M | 10.80M | +2.3% | ↑ |
  | New ARR | 215k | 200k | +7.5% | ↑ |
  | Churn $ | 30k | 35k | -14% | → |
  | NRR | 112% | 110% | +2pp | ↑ |
  | CAC | 1.180€ | 1.200€ | -1.7% | → |
  | DSO | 38 | 40 | -2 | ↓ (mejor) |

  ## Riesgos para mayo
  - Pull-forward de 70k€ de revenue → mayo bajará ~70k€
  - Hire de Senior Backend pendiente firma → si no firma, S&M no compensa
  ```

---

### `finance-treasury` — Treasury

Cash management, banca, FX exposure, working capital, cash forecast 13-week, short-term financing.

**Caso de uso:** cash forecast 13 semanas para evitar stress de liquidez.

**Prompt:**
> "Cash forecast 13-week rolling. Tenemos pagos grandes en semanas 5 y 9. Quiero alertas si caemos bajo 3M€ en cualquier semana."

**Output esperado:**
- Ruta: `<proyecto>/finance/treasury/cash-forecast-2026-W19-to-W31.md`
- Estructura:
  ```markdown
  # 13-Week Rolling Cash Forecast — W19-W31 2026

  - Moneda: EUR
  - Mínimo aceptable de cash: 3.000.000€
  - Fecha de generación: 2026-05-08

  ## Posición inicial
  Cash actual (W19 start): 4.850.000€

  ## Inflows estimados por semana
  | Sem | AR cobros | Otros | Total in |
  | 19 | 380.000 | 0 | 380.000 |
  | 20 | 220.000 | 0 | 220.000 |
  | 21 | 195.000 | 0 | 195.000 |
  | 22 | 340.000 | 0 | 340.000 |
  ...

  ## Outflows estimados por semana
  | Sem | Nóminas | Suppliers | Tax | Capex | Otros | Total out |
  | 19 | 0 | 95.000 | 0 | 0 | 25.000 | 120.000 |
  | 20 | 0 | 80.000 | 0 | 0 | 20.000 | 100.000 |
  | 21 | 0 | 110.000 | 0 | 0 | 28.000 | 138.000 |
  | 22 | **425.000** | 90.000 | **180.000 IVA** | 0 | 25.000 | 720.000 |
  ...

  ## Posición semanal proyectada
  | Sem | Net | Position EoW | Alert |
  | 19 | +260 | 5.110 | OK |
  | 20 | +120 | 5.230 | OK |
  | 21 | +57 | 5.287 | OK |
  | 22 | -380 | 4.907 | OK (pago nómina + IVA) |
  | 23 | +220 | 5.127 | OK |
  | 24 | +180 | 5.307 | OK |
  | 25 | -120 | 5.187 | OK |
  | 26 | -250 | 4.937 | OK |
  | 27 | +200 | 5.137 | OK |
  | 28 | -480 | 4.657 | OK (capex IT planeado) |
  | 29 | -650 | 4.007 | OK (pago anual licencias) |
  | 30 | +150 | 4.157 | OK |
  | 31 | +280 | 4.437 | OK |

  ## Escenarios stress
  | Escenario | Position mínima |
  | Base | 4.007 (W29) — holgura cómoda |
  | -20% inflows | 3.450 — sigue OK |
  | -30% inflows | 3.180 — atención |
  | -40% inflows | 2.810 — ⚠️ ALERTA: bajo mínimo en W29-30 |

  ## FX exposure
  - 80% revenue en EUR, 15% USD, 5% GBP
  - Sensibilidad USD/EUR: cada 5% de movimiento mueve cash ~80k€/trimestre
  - Cobertura: 60% del exposure USD vía forwards a 6 meses

  ## Recomendaciones
  - Confirmar timing de pago anual de licencias (W29) — ¿se puede diferir?
  - Mantener position objetivo entre 4M y 5M (no acumular en exceso)
  - Revisar política de cobertura USD si exposure crece
  ```

---

## Skills

### `budget-plan` — Presupuesto con drivers, P&L mensualizado, headcount, capex, escenarios

Ver ejemplo en agente `finance-budgeting` arriba.

---

### `financial-report` — Report financiero con P&L + Balance + Cash Flow + KPIs + variance commentary

Ver ejemplo en agente `finance-reporting` arriba.

---

### `invoice-template` — Factura a cliente

Campos fiscales del país emisor, numeración consecutiva, cálculo impuestos y retenciones, términos.

**Caso de uso:** factura mensual a cliente.

**Prompt:**
> "Factura para ACME Corp por nuestro Plan Pro de mayo 2026. 4.500€ base + IVA 21% (España). Serie 2026-A. Vencimiento 30 días."

**Output esperado:**
- Ruta: `<proyecto>/finance/invoices/2026-A-000124-acme-corp-may.md` (formato base; el PDF se genera del template)
- Contenido (ejemplo en plain text):
  ```markdown
  # FACTURA Nº 2026-A-000124

  ## Emisor
  Aigent Solutions, S.L.
  CIF: B-12345678
  Calle Ejemplo 123, 08001 Barcelona, España

  ## Cliente
  ACME Corp, S.A.
  CIF: A-98765432
  Avenida Cliente 45, 28001 Madrid, España

  ## Datos factura
  - Número: 2026-A-000124
  - Fecha emisión: 2026-05-31
  - Fecha vencimiento: 2026-06-30
  - Referencia: Plan Pro · Mayo 2026
  - Contrato: MSA firmado 2025-08-15

  ## Detalle
  | Concepto | Cantidad | P.unit | Total |
  | Aigent Plan Pro · Mayo 2026 | 1 | 4.500,00€ | 4.500,00€ |

  ## Totales
  - Base imponible: 4.500,00€
  - IVA 21%: 945,00€
  - **TOTAL FACTURA: 5.445,00€**

  ## Términos de pago
  - Vencimiento: 30 días desde emisión (30 junio 2026)
  - Método: transferencia bancaria
  - IBAN: ES12 3456 7890 1234 5678 9012
  - BIC: ABCDESMMXXX
  - Concepto: Factura 2026-A-000124

  ## Notas legales
  - Operación sujeta a IVA según Ley 37/1992.
  - Conserve esta factura durante el plazo legal.
  ```

---

### `cash-forecast` — 13-week rolling cash forecast

Ver ejemplo en agente `finance-treasury` arriba.

---

### `expense-policy` — Política de gastos cross-funcional

Categorías, límites, workflow de aprobación, viajes (per diem), equipamiento, reembolsos.

**Caso de uso:** política nueva.

**Prompt:**
> "Política de gastos completa. Equipo de 240 personas, 60% remoto-first. Cubrir: viajes, hardware, software, comidas con cliente, formación. Per diem por tier de ciudad."

**Output esperado:**
- Ruta: `<proyecto>/finance/budgeting/expense-policy.md`
- Estructura:
  ```markdown
  # Política de Gastos

  - Vigente desde: 2026-06-01
  - Owner: CFO + HR
  - Próxima revisión: 2026-12-01

  ## Principios
  - Confianza con accountability: gastas como si fuera tuyo.
  - Documentado siempre: sin justificante, no hay reembolso.
  - Razonable según ciudad: tiers documentados, no cifras vagas.

  ## Categorías y límites

  ### 1. Viajes corporativos
  Pre-aprobación necesaria para viajes >500€ total.

  | Concepto | Tier 1 (Madrid/Lisboa) | Tier 2 (Barcelona/Porto) | Tier 3 (otros) |
  | Hotel/noche | 200€ | 180€ | 150€ |
  | Comida/día | 75€ | 65€ | 55€ |
  | Transporte local | reasonable | reasonable | reasonable |

  Avión: clase turista. Business solo en vuelos >6h con aprobación VP+.

  ### 2. Hardware
  - Setup nuevo joiner: hasta 2.500€ (laptop + monitor + periféricos)
  - Refresh: cada 3-4 años con aprobación manager
  - Periféricos individuales <250€: directo, sin aprobación

  ### 3. Software / SaaS personal
  - Hasta 100€/mes para herramientas individuales (Notion, Figma, etc.)
  - Por encima: revisión manager + IT

  ### 4. Comidas con cliente
  - Hasta 100€/persona en restaurante mid-range
  - Bebidas alcohólicas: hasta 30€/persona, no obligatorio invitar
  - Justificante con nombre cliente + propósito

  ### 5. Formación
  - Cursos online <500€/año: directo
  - Cursos/conferencias 500€-2.500€: aprobación manager
  - >2.500€: aprobación VP + plan de ROI

  ## Workflow de aprobación
  | Importe | Aprobador |
  | <500€ | Auto (post-hoc con manager review mensual) |
  | 500-2.000€ | Manager directo |
  | 2.000-5.000€ | VP del área |
  | >5.000€ | CFO + VP |

  ## Cómo reportar gastos
  1. Foto del justificante en la app de gastos
  2. Categoría + propósito + cliente (si aplica)
  3. Submission antes del día 5 del mes siguiente
  4. Reembolso con la nómina del mes después

  ## Excepciones
  - Habrá. Pedirlas por escrito a finanzas con justificación.

  ## Consecuencias del incumplimiento
  - Justificante perdido: 1 vez OK. Reiterado: revisión con manager.
  - Abuso evidente: medidas disciplinarias según handbook.
  ```

---

### `board-deck-financial` — Sección financiera del board deck

5-10 slides equivalentes: highlights, P&L, cash + runway, KPIs selectivos, variance, riesgos, asks.

**Caso de uso:** board meeting trimestral.

**Prompt:**
> "Sección financiera del board deck Q2 2026. 8 slides. Audiencia: board (4 investors + CEO). Tono board-audience honesto, no marketing."

**Output esperado:**
- Ruta: `<proyecto>/finance/reporting/board-deck-financial-q2-2026.md`
- Estructura:
  ```markdown
  # Board Deck — Q2 2026 Financial Section

  ## Slide 1 — Headline numbers
  Revenue Q2: 2.78M€ (+12% vs plan, +38% YoY)
  EBITDA: 195k€ (+45% vs plan)
  Cash position: 4.95M€ · Runway: 47 meses
  ARR exit Q2: 11.2M€

  ## Slide 2 — P&L Q2 vs plan
  | | Q2 actual | Q2 plan | Var |
  | Revenue | 2.780 | 2.480 | +12% |
  | Gross profit | 2.175 | 1.940 | +12% |
  | OpEx | 1.980 | 1.880 | +5% |
  | EBITDA | 195 | 60 | +225% |

  ## Slide 3 — KPIs
  - New ARR Q2: 615k€ (vs plan 550k€)
  - Net retention: 113% (vs plan 110%)
  - Churn $: 92k€ (vs plan 105k€) — mejorando
  - CAC: 1.140€ (vs plan 1.200€)
  - LTV/CAC: 5.4x (vs plan 4.8x)

  ## Slide 4 — Cash + runway
  Cash start Q2: 4.85M · Cash end Q2: 4.95M (+100k operativo)
  Runway escenarios:
  - Base: 47 meses
  - Worst (revenue plano): 34 meses
  - Best (crecimiento +50%): 60+ meses

  ## Slide 5 — Variance commentary
  Lo bueno:
  - 2 enterprise deals cerrados antes de tiempo
  - Churn mejorando 3 trimestres seguidos
  - G&A bajo plan (hire diferido)

  Lo a tener en ojo:
  - DSO subió a 41 días (vs 38) — 2 clientes enterprise renegociando terms
  - Hosting cost +18% YoY — revisar contrato AWS en negociación

  ## Slide 6 — Riesgos top 3
  1. **DSO creciente:** si llega a 50 días, working capital -250k€
  2. **Concentración cliente top-5:** 38% del ARR → diversificar
  3. **Hire de VP Sales pendiente:** plan de S&M depende de fill

  ## Slide 7 — H2 forecast
  Revenue H2: 6.1M€ (commit) / 6.8M€ (best) / plan 6.0M€
  ARR exit año: 14.5M€ (commit) / 16M€ (best)

  ## Slide 8 — Asks al board
  1. Aprobar plan de Series B raise objetivo Q1 2027
  2. Aprobar bonus pool 2026 (+15% vs plan original por overperformance)
  3. Discusión: estrategia de adquisición de PequeñaCorp (separate deck)
  ```

---

### `expense-report` — Submisión de gastos individual

Detalle, totales por categoría/proyecto, justificantes, self-check contra expense-policy.

**Caso de uso:** empleado reporta gastos mensuales.

**Prompt:**
> "Necesito reportar mis gastos de abril. Tengo: viaje a Lisboa (hotel 360€, comidas 145€, taxi 28€), conferencia online 199€, software individual Notion Personal 12€."

**Output esperado:**
- Ruta: `<proyecto>/finance/reporting/expense-report-juan-perez-2026-04.md`
- Estructura:
  ```markdown
  # Expense Report — Juan Pérez · Abril 2026

  - Empleado: Juan Pérez · ID: EMP-0234
  - Manager: Carlos M.
  - Periodo: 2026-04-01 a 2026-04-30
  - Total: 744,00€

  ## Detalle

  | Fecha | Concepto | Categoría | Importe | Justificante | OK policy |
  | 04-12 | Hotel Lisboa (2 noches) | Viaje | 360,00€ | adjunto-01.pdf | ✅ (180€/noche, Tier 1) |
  | 04-13 | Comida cliente Lisboa | Comida cliente | 78,00€ | adjunto-02.pdf | ✅ |
  | 04-13 | Cena equipo Lisboa | Comida cliente | 67,00€ | adjunto-03.pdf | ✅ |
  | 04-13 | Taxi aeropuerto | Viaje | 28,00€ | adjunto-04.pdf | ✅ |
  | 04-20 | Conferencia "FinOps Summit" | Formación | 199,00€ | adjunto-05.pdf | ✅ (<500€, auto) |
  | 04-30 | Notion Personal (mensual) | Software | 12,00€ | adjunto-06.pdf | ✅ (<100€/mes) |

  ## Totales por categoría
  | Categoría | Importe |
  | Viaje | 388,00€ |
  | Comida cliente | 145,00€ |
  | Formación | 199,00€ |
  | Software | 12,00€ |
  | **Total** | **744,00€** |

  ## Totales por proyecto
  | Proyecto | Importe |
  | Cliente ACME (viaje Lisboa) | 533,00€ |
  | Desarrollo personal | 211,00€ |

  ## Self-check policy
  ✅ Todo dentro de límites
  ✅ Justificantes adjuntos
  ✅ Pre-aprobación del viaje >500€ obtenida (email del manager 2026-04-10)
  ✅ Submission antes del día 5 del mes siguiente

  ## Workflow
  - Submitted: 2026-05-04
  - Manager approval: pending
  - Reembolso esperado: nómina mayo 2026
  ```

---

## Skills compartidas usadas en este dept

- `kpi-dashboard` (shared) — Dashboard de KPIs financieros. Consumida por `finance-reporting`.
- `risk-matrix` (shared) — Matriz de riesgos del presupuesto. Consumida por `finance-budgeting`.

Ver ejemplos en [`_shared/README.md`](../_shared/README.md).

---

## Flujo end-to-end típico

```
Cierre mensual:
1. finance-reporting   → financial-report del mes
2. finance-reporting   → invoice-template para los clientes del mes
3. finance-treasury    → cash-forecast 13-week actualizado
4. finance-reporting   → kpi-dashboard de business metrics

Trimestral:
1. finance-budgeting   → budget-plan revisado (rolling forecast)
2. finance-reporting   → board-deck-financial sección de Q

Anual:
1. finance-budgeting   → budget-plan completo año siguiente
2. finance-budgeting   → expense-policy revisada
```
