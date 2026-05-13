---
name: "invoice-template"
description: >
  Skill for generating a customer invoice with country-specific fiscal fields,
  consecutive numbering, lines, taxes (VAT/IGIC/sales tax), payment terms and
  legal footer. Currency-aware and jurisdiction-aware.
---

# Skill: Invoice Template

**Entregable:** archivo `.md` con la factura completa (lista para ser convertida a PDF o emitida desde un sistema), guardado en `<proyecto>/finance/reporting/invoices/<YYYY-MM>/<cliente-slug>-<num>.md`.

---

## Cuándo usar esta skill

- Hay que emitir una factura a un cliente para un servicio prestado o producto entregado.
- Hay que rehacer / reemitir una factura existente con cambios.
- Hay que generar nota de crédito (rectificativa) que referencie una factura anterior.

**Cuándo NO usar:**

- Para una propuesta comercial (eso es `sales-proposal` del dept Sales).
- Para una orden de compra de la empresa a un proveedor (es AP, no AR).
- Para un recibo simple sin valor fiscal (eso es un comprobante interno).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Cliente | Razón social completa, NIF/VAT/Tax ID, dirección fiscal |
| Servicios / productos | Descripción, cantidad, precio unitario, descuento si aplica |
| Periodo de servicio | Si aplica (servicios recurrentes), fecha desde-hasta |
| Moneda | Moneda de emisión |
| Jurisdicción de emisión | País de la empresa emisora (define normativa fiscal aplicable) |
| Datos del emisor | Razón social, NIF, dirección, contacto (idealmente en config global) |
| Impuestos | IVA / IGIC / Sales tax aplicables y exenciones si las hay |
| Numeración | Siguiente número correlativo. ¿Hay serie específica (A, B, RECT)? |
| Términos de pago | Plazo (30 días, contado, etc.), método (transferencia, tarjeta, etc.), IBAN si transferencia |
| Referencia interna | PO del cliente, contrato, proyecto |
| Idioma | ¿Español, inglés, ambos? |
| Tipo | Factura normal / rectificativa (con número factura origen) / proforma |

---

## Plantilla del entregable

```markdown
---
type: "invoice"
invoice_type: "factura | rectificativa | proforma"
invoice_number: "<número correlativo>"
invoice_series: "<A | B | RECT | proforma>"
issue_date: "YYYY-MM-DD"
due_date: "YYYY-MM-DD"
service_period_start: "YYYY-MM-DD"
service_period_end: "YYYY-MM-DD"
currency: "EUR | USD | GBP | ..."
jurisdiction: "<país emisor>"
language: "es | en | ..."
issuer_company: "<Razón social>"
issuer_tax_id: "<NIF/VAT>"
customer_company: "<Razón social cliente>"
customer_tax_id: "<NIF/VAT cliente>"
status: "draft | issued | paid | overdue | cancelled"
references_invoice: "<número factura origen si rectificativa>"
---

# FACTURA <serie><número>

---

**<Razón social emisor>**
<Dirección fiscal completa>
NIF/VAT: <NIF emisor>
Email: <email facturación>
Tel: <teléfono>

---

**Facturar a:**

**<Razón social cliente>**
<Dirección fiscal completa cliente>
NIF/VAT: <NIF cliente>
Contacto: <persona / email facturación cliente>

---

| Campo | Valor |
|---|---|
| Número de factura | **<serie><número>** |
| Fecha de emisión | YYYY-MM-DD |
| Fecha de vencimiento | YYYY-MM-DD |
| Periodo de servicio | YYYY-MM-DD a YYYY-MM-DD |
| Referencia | <PO / contrato / proyecto> |
| Idioma | <ES / EN> |

---

## Detalle

| # | Descripción | Cantidad | Precio unitario | Descuento | Subtotal |
|---|---|---|---|---|---|
| 1 | <Descripción del servicio / producto> | <X> | <Y> | <Z%> | <€ neto línea> |
| 2 | ... | | | | |

---

## Resumen

| Concepto | Importe |
|---|---|
| Base imponible | <X> |
| <IVA / IGIC / Sales tax> al <%> | <Y> |
| Retención <ej. IRPF al %> si aplica | <-Z> |
| **TOTAL A PAGAR** | **<W> <moneda>** |

> Si la jurisdicción requiere notas específicas (exención de IVA, inversión del sujeto pasivo, factura intracomunitaria, régimen especial), añadirlas aquí con la base legal correspondiente.

---

## Términos de pago

- **Plazo:** <30 días desde fecha de emisión / contado>
- **Método:** <Transferencia bancaria / Tarjeta / SEPA / Otro>
- **Banco:** <Nombre del banco>
- **IBAN:** <IBAN>
- **BIC/SWIFT:** <BIC>
- **Concepto:** <Indicar siempre el número de factura>

---

## Notas legales

<Nota requerida por la jurisdicción de emisión: ley aplicable, derecho de rectificación, plazo de prescripción, base legal de exenciones, etc.>

<Si es rectificativa: "Esta factura rectificativa reemplaza/modifica la factura <serie><número origen> emitida el <fecha origen>.">

---

> **Documento generado por <Empresa>. Para consultas relacionadas con esta factura, contactar a <email facturación>.**
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin NIF del cliente y sin numeración, parar.
2. **Validar numeración:**
   - Determinar la serie correcta (factura normal, rectificativa, proforma — series distintas, NO compartir contadores).
   - Determinar el siguiente número correlativo leyendo `<proyecto>/finance/reporting/invoices/` o consultando al usuario si no hay registro local.
   - Sin huecos: la numeración debe ser estrictamente consecutiva por serie.
3. **Validar campos fiscales del país emisor.** Cada jurisdicción tiene requisitos específicos: campos obligatorios, formato del NIF, base imponible separada de impuestos, retenciones, mensaje de IVA en operaciones intracomunitarias o exportaciones.
4. **Calcular importes:**
   - Subtotal por línea = cantidad × precio unitario × (1 − descuento%).
   - Base imponible = suma de subtotales.
   - Impuesto = base × tipo.
   - Retención = base × tipo (si aplica).
   - Total = base + impuesto − retención.
5. **Marcar `[VERIFICAR FISCAL]`** todo lo que dependa de normativa local que no está completamente cubierta en `decisions[]` (operaciones intracomunitarias, retenciones específicas, exenciones).
6. **Marcar `[VERIFICAR NUMERACIÓN]`** si no se ha podido confirmar el número correlativo con certeza.
7. **Guardar** en `<proyecto>/finance/reporting/invoices/<YYYY-MM>/<cliente-slug>-<serie><número>.md`.
8. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen: cliente, importe total, fecha emisión, vencimiento, número.
   - Campos `[VERIFICAR FISCAL]` y `[VERIFICAR NUMERACIÓN]` si aplica.
   - Próximo paso: emitir formalmente desde el sistema fiscal/contable (si la empresa usa Holded/Stripe/QuickBooks/etc.), enviar al cliente, registrar en AR aging.

---

## Restricciones

- **No emitas factura sin NIF del cliente** (en muchas jurisdicciones es obligatorio para clientes B2B).
- **No saltes la numeración correlativa.** Huecos o números repetidos son infracciones fiscales en muchos países.
- **No mezcles series.** Facturas normales, rectificativas y proformas usan contadores independientes.
- **No apliques impuestos sin verificar la jurisdicción del cliente.** Operaciones intracomunitarias en UE, exportaciones, B2C vs B2B, todo cambia la lógica del IVA.
- **No publiques sin notas legales del país emisor** cuando son obligatorias.
- **No omitas el método de pago y el IBAN** si la factura se cobra por transferencia.
- **No inventes información del cliente.** Si falta un dato (dirección fiscal completa, NIF correcto), marcar `[CLIENTE PENDIENTE]` y solicitar.
- **No reemplaces el sistema fiscal oficial de la empresa.** Si la empresa usa un software de facturación con su propio control de numeración, este `.md` es un borrador / espejo, no la factura legal vigente.
- Aplican las reglas de output de `_shared/output-rules.md`.
