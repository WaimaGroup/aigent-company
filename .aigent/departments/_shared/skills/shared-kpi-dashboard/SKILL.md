---
name: "shared-kpi-dashboard"
user-invocable: true
description: >
  Shared skill for producing a structured KPI dashboard document for any domain:
  metric × current × target × variance × trend × commentary, with executive
  summary, definitions, and recommended actions. Used cross-department
  (marketing-seo, product-metrics, finance-reporting, sales-crm) with the same
  deliverable structure, regardless of the metric domain.
---

# Skill: KPI Dashboard

**Entregable:** archivo `.md` con dashboard estructurado de KPIs para un periodo y dominio concreto, listo para reuniones de equipo/leadership y como input para variance discussions. Vive en la carpeta del dept que lo solicite — la skill es compartida en `_shared/skills/`, los outputs no.

---

## Cuándo usar esta skill

- Hay que producir el report periódico de KPIs (mensual, trimestral) para un equipo o área.
- Hay que preparar la pantalla "KPI" para board o leadership.
- Se prepara material para una reunión recurrente que necesita los mismos KPIs cada vez.

**Cuándo NO usar:**

- Para definir un KPI individual (su ficha técnica vive donde su dominio: `product-metrics/definitions/`, `finance-reporting/...`, etc.).
- Para análisis profundo de una métrica (eso es un análisis ad-hoc, no un dashboard).
- Para un BI dashboard automatizado (esta skill produce el documento de soporte; el dashboard live vive en Looker/Tableau/etc.).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Dominio | Marketing / Product / Finance / Sales / HR / mixto |
| Audiencia | Equipo operativo, leadership interno, board, externo |
| Periodo | Mes / trimestre / semestre / año |
| KPIs a incluir | Lista concreta (5-15 máximo) con sus definiciones operativas |
| Targets | ¿Hay target / OKR / presupuesto contra el que comparar cada KPI? |
| Histórico | ¿Cuántos periodos atrás se incluyen para tendencia? (típicamente 6) |
| Source of truth | ¿De dónde sale cada KPI? (sistema, fórmula, owner) |
| Variance umbral | ¿Qué consideramos variance significativa? (típicamente ±5% o un valor absoluto) |
| Idioma | Español, inglés, ambos |

---

## Plantilla del entregable

Nombre del archivo: `kpi-dashboard-<dominio>-<periodo>.md` (ej. `kpi-dashboard-marketing-2026-Q1.md`).

```markdown
---
type: "kpi-dashboard"
domain: "marketing | product | finance | sales | hr | mixed"
audience: "team | leadership | board | external"
period: "<YYYY-MM | YYYY-Qn | YYYY>"
date_published: "YYYY-MM-DD"
status: "draft | reviewed | published"
owner: "<rol/persona>"
variance_threshold: "<±X% / ±€Y>"
language: "es | en"
---

# KPI Dashboard — <Dominio> · <Periodo>

## 0. Resumen ejecutivo

> 5-7 líneas adaptadas a la audiencia. Verdict, métricas en verde, métricas que requieren acción, contexto.

**Highlights:**
- <Highlight 1>
- <Highlight 2>
- <Highlight 3>

**Watchpoints:**
- <KPI 1 con variance significativa: causa + acción propuesta>
- <KPI 2>

**Recomendación general:** <una frase>

---

## 1. Dashboard

> Tabla maestra. Las celdas con variance > umbral van comentadas en sección 3.

| KPI | Valor <periodo> | Target | Δ vs target | Δ vs periodo anterior | Tendencia (6P) | Status |
|---|---|---|---|---|---|---|
| <KPI 1> | | | <+X%> | <+Y%> | ↗ / ↘ / → | 🟢 / 🟡 / 🔴 |
| <KPI 2> | | | | | | |
| <KPI 3> | | | | | | |
| ... | | | | | | |

**Leyenda de status:**
- 🟢 En target o mejor; sin acción requerida.
- 🟡 Variance < umbral pero tendencia desfavorable; vigilar.
- 🔴 Variance ≥ umbral; requiere análisis y acción.

---

## 2. Tendencias (últimos 6 periodos)

> Tabla con el histórico para que cada KPI cuente una historia, no solo un dato puntual.

| KPI | <P-5> | <P-4> | <P-3> | <P-2> | <P-1> | <P actual> |
|---|---|---|---|---|---|---|
| <KPI 1> | | | | | | |
| <KPI 2> | | | | | | |
| ... | | | | | | |

> Para visualización real, exportar a una herramienta (Sheets/Looker/Tableau). Esta tabla es el dato.

---

## 3. Análisis de variances significativas

> Por cada KPI con variance ≥ umbral, una entrada. Sin esto el dashboard es un dump de números.

### 🔴 <KPI X>

- **Valor:** <X> vs target <Y>. Variance <Δ%>.
- **Tendencia:** <descripción de los últimos 3-6 periodos>.
- **Causa identificada:** <hecho, no especulación>.
- **Acción propuesta:** <qué hacer, quién, plazo>.
- **Owner:** <persona>.

### 🟡 <KPI Y>

(misma estructura, severidad menor)

---

## 4. Definiciones operativas (apéndice)

> Cada KPI definido con precisión. Sin esto, el dashboard pierde comparabilidad en el tiempo.

| KPI | Definición operativa | Fórmula | Source of truth | Owner | Última revisión |
|---|---|---|---|---|---|
| <KPI 1> | <qué cuenta exactamente> | <fórmula matemática> | <sistema / tabla / evento> | <persona> | <YYYY-MM> |
| <KPI 2> | | | | | |

> Si la definición de un KPI cambia, **renombrar** (`metric_v2`) en lugar de reescribir silenciosamente. Trazabilidad histórica preservada.

---

## 5. Acciones acordadas

> Salidas de la reunión / revisión. Sin esto, el dashboard fue un evento, no una conversación.

| Acción | Owner | Plazo | Resultado esperado |
|---|---|---|---|
| <Acción 1> | <persona> | <fecha> | <métrica objetivo> |
| <Acción 2> | | | |

---

## 6. Apéndices

- Histórico completo (rango > 6 periodos): <link>
- Dashboard live (Looker/Tableau): <link>
- Definiciones detalladas: <link a `definitions/` del dept correspondiente>
- KPI tree / north star tree: <link si aplica>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin lista concreta de KPIs y targets, parar.
2. **Validar fuente** de cada KPI: del sistema correcto, con la definición correcta, sin reclasificaciones silenciosas vs periodos anteriores.
3. **Aplicar umbral de variance** a cada KPI. Todo lo que supere se comenta en sección 3. Variance sin comentary = report incompleto.
4. **Identificar tendencia honestamente.** Un KPI que cumple target pero tiene tendencia desfavorable es 🟡, no 🟢.
5. **Adaptar profundidad a audiencia:**
   - **Equipo operativo:** todas las secciones, foco en sección 3 (variances) y 5 (acciones).
   - **Leadership:** secciones 0, 1, 3 prioritarias; sección 4 (definiciones) como apéndice.
   - **Board:** secciones 0, 1 (selectiva), 3 (solo lo material). Sin tendencia detallada de KPIs operativos.
   - **Externo (investor update):** solo lo que se quiere comprometer. Conservador.
6. **Marcar `[DATO PENDIENTE]`** lo que falta del sistema, `[VARIANCE POR ANALIZAR]` lo que requiere drill-down posterior, `[ACCIÓN POR ASIGNAR]` los items sin owner.
7. **Guardar** en la carpeta del dept (`<proyecto>/marketing/...`, `<proyecto>/product/metrics/...`, `<proyecto>/finance/reporting/...`, etc.) según quien lo solicite. La skill es compartida; el output vive en el dept consumidor.
8. **Reportar** al usuario: ruta, status global (🟢/🟡/🔴), top variances con causa y acción, items pendientes.

---

## Restricciones

- **No inventes cifras.** Cada número viene del sistema o de fuente documentada. Si falta, `[DATO PENDIENTE]`.
- **No omitas variance commentary.** Un dashboard sin "por qué" es ruido visual.
- **No mezcles KPIs con métricas operativas low-level.** 5-15 KPIs máximo en el dashboard. Detalle adicional en apéndices.
- **No reclasifiques sin renombrar.** Si la definición de un KPI cambia, el nuevo es `kpi_name_v2`; el anterior queda histórico.
- **No incluyas KPIs sin owner.** Sin propietario, el KPI drift sin que nadie note.
- **No prometas precisión que no existe.** Si un KPI es estimación (típicamente accruals, attribution), márcalo.
- **No emitas dashboard sin tendencia.** Una cifra puntual sin contexto temporal no informa.
- Aplican las reglas de output de `_shared/output-rules.md`.
