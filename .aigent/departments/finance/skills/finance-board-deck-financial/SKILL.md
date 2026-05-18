---
name: "finance-board-deck-financial"
user-invocable: true
description: >
  Skill for producing the financial section of a board deck: highlights, P&L
  summary, cash position and runway, KPI dashboard (selective), variance vs plan,
  key risks, asks. Concise (5-10 slides equivalent), board-audience tone. Distinct
  from the internal financial-report (more granular, broader audience).
---

# Skill: Board Deck — Financial Section

**Entregable:** archivo `.md` con la sección financiera del board deck (5-10 "slides" en formato markdown), lista para llevar al board meeting. Vive en `<proyecto>/finance/reporting/board/<YYYY-MM>-board-financial.md`.

---

## Cuándo usar esta skill

- Próximo board meeting (típicamente trimestral) y hay que preparar la sección financiera.
- Investor update (a veces el mismo deck con menor profundidad).
- M&A: presentación financiera a posible comprador / inversor.
- Comité financiero / audit committee si la empresa lo tiene.

**Cuándo NO usar:**

- Para report financiero interno completo (eso es `financial-report` — más granular).
- Para business review semanal/mensual operativo (eso es operativo, no board).
- Para investor update masivo con métricas detalladas y prosa extensa (a veces overlap pero formato distinto).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Periodo | Q cubierto (Q1 2026 = Ene-Mar 2026 si fiscal year natural) |
| Audiencia | Board completo / audit committee / inversor concreto |
| Tono | Standard board / urgent (mala noticia) / celebratorio (gran trimestre) |
| Foco específico | ¿Hay un tema crítico que el board quiere ver? (cash, growth, profitability, M&A) |
| Asks | ¿Qué decisión necesitas del board? (más capital, decisión sobre headcount, M&A approval) |
| Materiales previos | Slides de board anteriores para coherencia |
| Datos disponibles | Estados financieros del cierre, KPIs, forecast actualizado |

---

## Plantilla del entregable

Nombre del archivo: `<YYYY-Qn>-board-financial.md`.

```markdown
---
type: "board-deck-financial"
period: "<YYYY-Qn | YYYY-FY>"
board_meeting_date: "YYYY-MM-DD"
audience: "full-board | audit-committee | investor"
tone: "standard | urgent | celebratory"
status: "draft | reviewed-by-ceo | final"
ceo_review_date: "YYYY-MM-DD"
prepared_by: "<CFO>"
currency: "EUR | USD"
framework: "IFRS | US GAAP | PGC"
---

# Board Deck — Financial Section · <Periodo>

> CFO: <nombre> · Para board meeting <fecha> · Confidencial.

---

## Slide 1: Highlights del periodo

> 3-5 bullets. Lo más importante. Si el board lee solo este slide, debe quedar con la idea correcta.

- **Revenue:** <€/$ X> · <+/-Y% YoY> · <% de plan>
- **EBITDA:** <€/$ X> · <margen %> · <vs plan>
- **Cash position:** <€/$ X> · <runway Y meses>
- **Headcount:** <N> · <vs plan>
- **Top bet del periodo:** <una línea>

> Tono honesto: si el periodo fue malo, decirlo. Si fue bueno, sin overselling.

---

## Slide 2: P&L summary

> Tabla compacta. Detalle granular vive en `financial-report`.

| Línea | <Periodo> | <Periodo anterior> | YoY % | Plan | Variance vs plan |
|---|---|---|---|---|---|
| Revenue | | | | | |
| Gross Profit | | | | | |
| Gross Margin % | | | | | |
| OPEX | | | | | |
| EBITDA | | | | | |
| EBITDA % | | | | | |
| Net Income | | | | | |

**Variance commentary (1-3 líneas):**
- <Por qué la línea principal con mayor variance se desvió>
- <Qué se está haciendo al respecto>

---

## Slide 3: Cash and runway

> Probablemente el slide que el board mira más. Sin runway, no hay empresa.

| Métrica | <Cierre periodo> | <Cierre periodo anterior> | Δ |
|---|---|---|---|
| Cash position | | | |
| Burn rate mensual (avg últimos 3M) | | | |
| **Runway (meses)** | | | |
| Líneas de crédito disponibles | | | |

**Forecast del cash al final del FY:** <€/$ X> · <runway al cierre Y meses>

**Asunción central del forecast:** <descripción breve>

**Sensitivity:**
- Worst case: <€/$ + runway>
- Best case: <€/$ + runway>

> Si runway < 12 meses, esto es señal a board para discutir fundraising. Reflejarlo claramente.

---

## Slide 4: KPI dashboard selectivo

> 5-8 KPIs máximo. Los que el board quiere ver — no los operativos.

| KPI | <Periodo> | <Periodo anterior> | Δ | Target |
|---|---|---|---|---|
| ARR / MRR | | | | |
| NRR (Net Revenue Retention) | | | | > 100% sano |
| GRR (Gross Revenue Retention) | | | | > 90% |
| New ARR signed | | | | |
| Customer count | | | | |
| Average deal size | | | | |
| Sales cycle (días) | | | | |
| CAC payback (meses) | | | | < 12 SaaS B2B |
| <KPI operativo clave del negocio> | | | | |

**Tendencias destacadas:**
- <Métrica con cambio material y su causa>

---

## Slide 5: Variance vs plan — análisis

> Solo si hay variances materiales que el board necesita entender.

### Revenue variance

- Plan FY: <€/$> · YTD plan: <€/$> · YTD actual: <€/$> · Variance: <€/$ X — Y%>
- **Causa principal:** <una línea>
- **Acciones tomadas:**
  - <Acción 1>
  - <Acción 2>

### OPEX variance

- Plan FY: <€/$> · YTD plan: <€/$> · YTD actual: <€/$> · Variance: <€/$ X — Y%>
- **Causa:** <una línea>
- **Acciones:** <listado>

---

## Slide 6: Forecast actualizado al FY

| Métrica | Plan original FY | Forecast actualizado | Δ |
|---|---|---|---|
| Revenue FY | | | |
| EBITDA FY | | | |
| Cash EOY | | | |
| Headcount EOY | | | |

**Confianza en el forecast:** <Alta / Media / Baja> con justificación breve.

**Triggers para re-forecast:** <eventos que llevarían a revisar el forecast antes de la próxima revisión>.

---

## Slide 7: Top riesgos financieros

> 3-5 riesgos. Cada uno con probabilidad × impacto + acción.

| Riesgo | Probabilidad | Impacto | Mitigación / status |
|---|---|---|---|
| <Cliente top concentración> | Media | Alto | <acción> |
| <Cash runway < 9 meses si recession> | Media | Alto | <plan B: fundraising / reducción> |
| <Deuda con covenant que se acerca al límite> | Baja | Medio | <renegociar antes de Q+2> |
| <FX exposure en mercado X> | Media | Medio | <hedging program> |

---

## Slide 8: Plan de acción

> Lo que vamos a hacer en respuesta a lo que hemos visto. Demuestra agencia.

- **Acción 1:** <descripción> · Owner: <persona> · Plazo: <fecha> · Outcome esperado: <métrica>
- **Acción 2:** <descripción> · Owner: <persona> · Plazo: <fecha>
- **Acción 3:** <descripción>

---

## Slide 9: Asks al board

> Qué decisión necesitamos del board hoy.

### Ask 1: <descripción>

- **Contexto:** <2-3 líneas: por qué necesitamos esta decisión>
- **Opciones consideradas:**
  - <Opción A: pros/contras>
  - <Opción B: pros/contras>
- **Recomendación del management:** <Opción A/B>
- **Riesgo de no decidir hoy:** <consecuencia>

### Ask 2 *(si hay más)*

(misma estructura)

> Si no hay asks específicos, sustituir por: *"No tenemos asks formales para hoy; presentación informativa."*

---

## Slide 10: Apéndices (para Q&A)

> Detalles técnicos que el board puede pedir.

### Anexo: Composición del cash

- Cuentas corrientes operativas: <€/$>
- Reservas: <€/$>
- Línea de crédito disponible: <€/$>
- Equivalents (deposits, money market): <€/$>

### Anexo: Aging AR

- Día actual: <%>
- 1-30 días vencidos: <%>
- 31-60 días: <%>
- 61-90 días: <%>
- > 90 días: <%>

### Anexo: Detalle de OPEX por categoría

| Categoría | YTD | % del total |
|---|---|---|
| Personnel | | |
| Marketing | | |
| Tech / Infra | | |
| G&A | | |
| Otros | | |

### Anexo: Headcount por equipo

| Equipo | EOP | Δ vs plan |
|---|---|---|
| Engineering | | |
| Product | | |
| Sales | | |
| Marketing | | |
| Otros | | |

---

## Notas de presentación

> Solo CFO. No para slides finales.

- **Tiempo asignado en la agenda:** <X min>
- **Punto crítico a transmitir:** <una línea>
- **Pregunta probable del board:** <pregunta + respuesta preparada>
- **Distractores a evitar:** <qué no profundizar salvo que pregunten explícitamente>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin cierre del periodo completo, parar.
2. **Empezar por highlights** (slide 1). Es el más leído.
3. **Tono honesto.** Si el trimestre fue malo, decirlo. Esconderlo erosiona credibilidad con el board.
4. **Cash + runway prominente** (slide 3). Es el slide que más afecta a las decisiones de board.
5. **KPIs selectivos.** 5-8, no 50. El detalle vive en apéndices y en `financial-report`.
6. **Variances materiales con causa y acción.** Variance sin causa es informe; con acción es management activo.
7. **Top riesgos + plan de acción** demuestran agency. Sin esto, el board interpreta "estás esperando que algo cambie".
8. **Asks explícitos** si los hay. Esconder decisiones que necesitas del board las difiere otro trimestre.
9. **Apéndices para Q&A.** El board pregunta detalle; si no lo tienes preparado, la sesión pierde rigor.
10. **Marcar `[DATA PENDIENTE]`** lo que falta del cierre, `[REVIEW CEO]` lo que requiere aprobación antes del board.
11. **Guardar** en `<proyecto>/finance/reporting/board/<YYYY-Qn>-board-financial.md`.
12. **Reportar** al usuario: ruta, highlights top, asks principales, riesgos top.

---

## Restricciones

- **No exageres ni minimices.** El board detecta ambos sesgos rápido.
- **No saltes los asks** si los hay. Mejor decisión en el board que diferirla.
- **No omitas runway** aunque sea malo. Esconder runway corto es de las peores prácticas.
- **No mezcles board deck con investor update masivo.** Audiencias parecidas pero el formato y nivel de detalle difieren.
- **No copies board anterior sin re-anclar en cifras actualizadas.**
- **No publiques antes de revisión CEO.** Discrepancias entre CFO y CEO en board son señal de proceso roto.
- **No prometas variance en P&L sin acción.** Variance sin acción es solo descriptiva — el board espera management.
- **No olvides apéndices** para Q&A. El board pregunta lo no presentado.
- Aplican las reglas de output de `_shared/output-rules.md`.
