---
name: "finance-expense-report"
user-invocable: true
description: >
  Skill for producing an expense report submission for an individual employee:
  list of expenses with date, category, amount, currency, project/cost-center,
  receipt attached, justification, approval workflow tracking. Compliant with
  expense-policy. For the policy itself, see expense-policy skill.
---

# Skill: Expense Report

**Entregable:** archivo `.md` con report de gastos individual (mensual o por viaje), listo para submisión al sistema de reembolsos. Vive en `<proyecto>/finance/reporting/expenses/<persona>-<YYYY-MM>.md` o en su versión final dentro de la herramienta de reembolsos (Spendesk, Pleo, etc.).

---

## Cuándo usar esta skill

- Empleado ha incurrido en gastos durante un periodo y debe submitirlos para reembolso.
- Gastos de un viaje de trabajo concreto que requieren agrupación.
- Reembolso atrasado que el empleado documenta retroactivamente.
- Auditoría: documentación estructurada de gastos para un periodo concreto.

**Cuándo NO usar:**

- Para política de gastos general (eso es `expense-policy`).
- Para factura de proveedor a la empresa (eso es AP — flujo distinto).
- Para purchase order pre-aprobado (PO separado).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Empleado | Nombre, ID interno, equipo, manager (para aprobación) |
| Periodo / motivo | Mensual general / viaje concreto / proyecto específico |
| Lista de gastos | Por cada gasto: fecha, descripción, categoría, monto, moneda, justificante |
| Proyecto / centro de coste | ¿Hay proyecto o cliente al que cargar? |
| Total estimado | Suma aproximada |
| Política de empresa aplicable | Versión vigente de `expense-policy` |
| Herramienta | Spendesk / Pleo / Brex / Expensify / submisión manual |

---

## Plantilla del entregable

Nombre del archivo: `<persona-slug>-<YYYY-MM>-expenses.md` (mensual) o `<persona-slug>-<trip-slug>-expenses.md` (por viaje).

```markdown
---
type: "expense-report"
employee: "<Nombre>"
employee_id: "<ID interno>"
team: "<Equipo>"
manager: "<Manager — aprueba primer nivel>"
report_period: "<YYYY-MM | trip <slug> <fecha-inicio> a <fecha-fin>>"
submission_date: "YYYY-MM-DD"
total_amount: "<€/$ X>"
currency_primary: "EUR | USD"
project_cost_center: "<proyecto / cliente / general>"
status: "draft | submitted | approved | reimbursed | rejected"
policy_version: "<v expense-policy>"
tooling: "<Spendesk | Pleo | manual | etc.>"
---

# Expense Report — <Empleado> · <Periodo>

## 0. Resumen

> 3-4 líneas. Quién, cuándo, total, motivo principal.

**Total:** <€/$ X>
**Número de gastos:** <N>
**Categorías principales:** <listado>
**Justificación / motivo (si viaje o proyecto):** <una línea>

---

## 1. Detalle de gastos

| # | Fecha | Categoría | Descripción | Monto | Moneda | Tipo cambio (si aplica) | Equivalente <moneda primaria> | Proyecto / CC | Justificante | Notas |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-05-03 | Viaje — vuelo | Vuelo MAD-BCN ida y vuelta | 180.00 | EUR | — | 180.00 | <proyecto / general> | ✅ Adjunto | Reunión con cliente X |
| 2 | 2026-05-03 | Viaje — taxi | Taxi aeropuerto-hotel | 35.50 | EUR | — | 35.50 | <proyecto> | ✅ | |
| 3 | 2026-05-04 | Viaje — hotel | Hotel BCN, 2 noches | 290.00 | EUR | — | 290.00 | <proyecto> | ✅ | Aprobado por <manager> el 2026-05-01 |
| 4 | 2026-05-04 | Viaje — comida | Almuerzo con cliente X | 120.00 | EUR | — | 120.00 | <proyecto> | ✅ | Asistentes: <nombres> |
| 5 | 2026-05-05 | Software | License de <tool> 1 año | 99.00 | USD | 0.92 | 91.08 | <general — herramienta para rol> | ✅ | Pre-aprobada por <manager> |

### Totales por categoría

| Categoría | Monto (<moneda primaria>) | % del total |
|---|---|---|
| Viaje — vuelo | | |
| Viaje — hotel | | |
| Viaje — taxi / transporte | | |
| Viaje — comida (per diem aplicable) | | |
| Software / herramientas | | |
| <Otros> | | |
| **Total** | | 100% |

### Totales por proyecto / centro de coste

| Proyecto / CC | Monto |
|---|---|
| <Proyecto X> | |
| General — herramientas/rol | |

---

## 2. Justificantes adjuntos

> Lista de justificantes con su gasto correspondiente. Físicos / PDF / fotos.

| # | Tipo | Archivo / link | Concepto | Importe en justificante |
|---|---|---|---|---|
| 1 | Factura | <link a PDF> | Vuelo MAD-BCN | 180.00 |
| 2 | Recibo | <link a foto> | Taxi | 35.50 |
| 3 | Factura nominativa | <link a PDF> | Hotel | 290.00 |
| ... | | | | |

**Verificación:**
- [ ] Todos los gastos tienen justificante adjunto.
- [ ] Los importes en justificantes coinciden con los declarados.
- [ ] Justificantes con datos fiscales requeridos (CIF, fecha, concepto) cuando aplica.

---

## 3. Cumplimiento de política

> Self-check contra la `expense-policy` vigente. Marcar lo que requiere atención.

### Checks automáticos

- [ ] Todos los gastos están dentro de los límites de su categoría (sección política).
- [ ] Gastos > €/$ 500 tienen aprobación previa documentada (sección 9 de la política).
- [ ] Gastos fuera del país base están autorizados (viaje aprobado previamente).
- [ ] No hay gastos de la lista no-reembolsable (multas, acompañantes, etc.).
- [ ] Per diem de viaje respeta el tier geográfico aplicable.

### Excepciones / aprobaciones especiales

> Items que exceden límite estándar o caen en categoría 🟡. Documentar.

- **Gasto #3 — Hotel BCN — €145/noche** (tier Madrid-BCN: límite €180/noche): dentro de política ✅.
- **Gasto #5 — Software €91** (límite SaaS sin pre-aprobación: €100/mes): dentro ✅.
- **<Excepción cualquiera>:** pre-aprobada por <persona> el <fecha> · justificación: <razón>.

### Items que requieren atención manual

> Lo que el aprobador debería revisar más a fondo.

- <ej. "Comida con cliente excede ligeramente per persona — clarifico número de comensales en notas">
- <ej. "Software nuevo en la lista — agregar a 'SaaS aprobados' si vamos a renovar mensualmente">

---

## 4. Approval workflow

| Paso | Aprobador | Plazo SLA | Status |
|---|---|---|---|
| 1. Submitted | — | — | ✅ <fecha submisión> |
| 2. Manager directo | <manager> | 2 días (política sección 3) | <pendiente / OK <fecha>> |
| 3. Director área *(si > €500)* | <director> | 5 días | <N/A o pendiente / OK> |
| 4. Finance review | <finance lead> | 3 días | <pendiente / OK> |
| 5. Reimbursement | Payroll | Mes siguiente | <fecha esperada> |

---

## 5. Notas para el aprobador

> Contexto que ayude a aprobar sin idas y venidas.

- <Nota 1: ej. "El viaje fue de emergencia por incidente del cliente; aprobación verbal del manager el día anterior">
- <Nota 2: ej. "El software es necesario para el sprint actual; el equivalente que ya teníamos no soporta la integración X">

---

## 6. Histórico de revisiones (si hay cambios pre-submisión)

| Fecha | Cambio | Por |
|---|---|---|
| YYYY-MM-DD | Versión inicial | <empleado> |
| YYYY-MM-DD | Añadido gasto #5 (software), reordenado | <empleado> |
| YYYY-MM-DD | Manager solicitó añadir nota a gasto #4 | <manager> |

---

## 7. Anexos

- Política de gastos vigente: <link a `<proyecto>/finance/budgeting/expense-policy-v<X>.md`>
- Trip authorization (si viaje): <link>
- Project / cost-center reference: <link a la documentación de proyectos>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin lista de gastos con justificantes, parar.
2. **Categorizar cada gasto** según la `expense-policy` vigente. Categorías no estándar = bandera roja.
3. **Verificar justificante por cada gasto**. Sin justificante o ilegible, el gasto no se reembolsa (sección 6 de la política).
4. **Convertir a moneda primaria** si hay multi-currency. Documentar tipo de cambio usado (banco / ECB / tarjeta corporativa).
5. **Self-check contra la política** (sección 3). El empleado se beneficia de pre-detectar problemas; el aprobador agradece la transparencia.
6. **Documentar excepciones** explícitamente: pre-aprobaciones verbales, justificaciones de gasto sobre límite, etc.
7. **Workflow de aprobación clarificado**: quién, plazo SLA. Sin esto, el reembolso se atasca silenciosamente.
8. **Notas para el aprobador** que reducen idas y venidas. Manager con contexto aprueba rápido.
9. **Marcar `[JUSTIFICANTE PENDIENTE]`** lo que falta documentación, `[VERIFICAR LÍMITE]` lo que está cerca o sobre límite, `[CONVERSIÓN PENDIENTE]` lo que requiere validar tipo de cambio.
10. **Guardar** en `<proyecto>/finance/reporting/expenses/<persona>-<periodo>.md`. Si la empresa usa Spendesk/Pleo/Brex/Expensify, esta versión `.md` es draft/espejo; la versión legal vive en la herramienta.
11. **Reportar** al usuario: ruta, total, número de gastos, próximo paso (submisión al sistema).

---

## Restricciones

- **No submitas sin justificantes adjuntos.** Política sección 6.
- **No inventes categoría.** Cada gasto en una categoría de la política vigente.
- **No mezcles gastos personales con corporativos** en el mismo report. Los personales no son reembolsables.
- **No omitas excepciones documentadas.** Mejor reconocer y justificar que esconder.
- **No prometas reembolso "hasta tal fecha".** SLA de aprobación + reembolso es del sistema, no del empleado.
- **No submitas gastos > 30 días sin justificar el retraso.** Política sección 5 (Plazos).
- **No incluyas datos personales sensibles** del empleado o de clientes en el report más allá de lo necesario.
- **No agrupes gastos sin asignar a proyecto / centro de coste** cuando el proyecto los tiene. Es lo que permite a finance saber dónde imputarlos.
- Aplican las reglas de output de `_shared/output-rules.md`.
