---
name: "legal-contract-template"
user-invocable: true
description: >
  Skill for producing a structured draft of a commercial contract (NDA, MSA, SOW,
  consulting, partnership) with definitions, critical clauses marked for human
  legal review, jurisdiction declared, and an executive summary for the signer.
  NOT legal advice — output requires human counsel validation.
---

# Skill: Contract Template

**Entregable:** archivo `.md` con el borrador completo del contrato + resumen ejecutivo + lista de items que requieren validación humana, guardado en `<proyecto>/legal/contracts/<tipo>/<contraparte>-<tipo>-<YYYY-MM>.md`.

---

## Cuándo usar esta skill

- Hay que producir un borrador de contrato comercial nuevo desde cero o adaptado de template propio.
- Hay que crear un anexo / SOW bajo un MSA existente.
- Hay que generar variantes de un contrato base (mutuo vs unilateral, B2B vs B2C, distintas jurisdicciones).

**Cuándo NO usar:**

- Para revisar un contrato propuesto por la contraparte (eso es un *redline / review* — formato distinto, comentarios inline).
- Para una opinión legal sobre la validez de un contrato (counsel humano).
- Para emitir un contrato firmado (la firma es decisión del firmante autorizado, fuera del scope).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Tipo de contrato | NDA (mutuo/unilateral), MSA, SOW, consulting, partnership, license, term sheet, LOI, otro |
| Partes | Razón social completa, jurisdicción, NIF/VAT, dirección, rol en la relación |
| Objeto / scope | Qué cubre el contrato: servicio, producto, IP, datos, capital, etc. |
| Importe / términos económicos | Pricing, plazos de pago, condiciones de actualización |
| Duración | Plazo inicial, renovación, terminación |
| Exclusividad | ¿Hay alguna exclusividad de geo, sector, producto, periodo? |
| IP | Quién es dueño de qué (entrega previa, nuevo creado, mejoras) |
| Confidencialidad | Duración del deber de confidencialidad post-contrato |
| Limitación responsabilidad | Cap propuesto (% importe, monto absoluto, etc.) |
| Indemnización | Qué eventos disparan, qué cubre |
| Jurisdicción y idioma | Tribunales o arbitraje aplicables; idioma del contrato |
| Política empresa | ¿Hay cláusulas estándar o non-negotiables de la empresa? |
| Deal context | ¿Cuáles son los puntos importantes para esta operación concreta? |

---

## Plantilla del entregable

```markdown
---
type: "contract-draft"
contract_type: "NDA-mutual | NDA-unilateral | MSA | SOW | consulting | partnership | license | term-sheet | LOI | other"
parties: ["<Parte A: razón social>", "<Parte B: razón social>"]
jurisdiction: "<país/región>"
governing_law: "<ley aplicable>"
forum: "<tribunal o arbitraje>"
language: "es | en | bilingual"
status: "draft | in-review | counterparty-review | finalized | signed"
date_drafted: "YYYY-MM-DD"
effective_date: "YYYY-MM-DD"
term_end_date: "YYYY-MM-DD"
owner: "<rol/persona>"
counsel_review_status: "PENDIENTE [REVISAR LEGAL]"
---

# Resumen Ejecutivo — para el firmante

> Antes del contrato completo. Lo que el firmante necesita saber.

- **Tipo:** <NDA mutuo / MSA / SOW / ...>
- **Partes:** <A> y <B>
- **Objeto en una frase:** <qué se firma>
- **Importe / términos económicos:** <resumen>
- **Duración:** <plazo + condiciones de renovación>
- **Cláusulas críticas a revisar antes de firmar:**
  1. <Cláusula X — por qué importante>
  2. <Cláusula Y>
  3. <Cláusula Z>
- **Riesgos identificados:** <listado breve>
- **Marca:** **[REVISAR LEGAL]** — borrador pendiente de validación humana.

---

# Contrato — <Tipo> entre <Parte A> y <Parte B>

## Preámbulo

En <Ciudad>, a <fecha>, comparecen:

**De una parte, <Razón social A>**, con domicilio en <dirección>, NIF/VAT <NIF>, representada por <Nombre representante> en su calidad de <cargo>, en adelante "**<Apodo A>**".

**Y de otra parte, <Razón social B>**, con domicilio en <dirección>, NIF/VAT <NIF>, representada por <Nombre representante> en su calidad de <cargo>, en adelante "**<Apodo B>**".

Ambas partes reconocen tener capacidad legal suficiente para contratar y, en su virtud, acuerdan suscribir el presente contrato, sujeto a las siguientes:

---

## Cláusulas

### 1. Definiciones

> Términos con mayúscula inicial usados en el contrato.

- **"<Término 1>"** significa <definición>.
- **"<Término 2>"** significa <definición>.
- ...

### 2. Objeto

<Descripción precisa del objeto del contrato. Sin esto el contrato no es ejecutable.>

### 3. Alcance y entregables / servicios *(si aplica)*

<Detalle de qué se entrega o presta, plazos de entrega, criterios de aceptación.>

### 4. Términos económicos *(si aplica)*

- **Pricing:** <detalle>
- **Forma y plazo de pago:** <detalle>
- **Impuestos:** <quién absorbe IVA / retenciones>
- **Actualización de precios:** <criterio>
- **Penalizaciones por retraso de pago:** <si aplica>

### 5. Duración y terminación

- **Plazo inicial:** <duración>
- **Renovación:** <automática / no automática + condiciones>
- **Causales de terminación:**
  - Por incumplimiento sustancial con preaviso de <X> días para subsanar.
  - Por insolvencia o quiebra.
  - Por mutuo acuerdo.
  - Por <otra causal específica>.
- **Consecuencias de la terminación:** <devolución, liquidación, supervivencia de cláusulas>.

### 6. Propiedad intelectual **[REVISAR LEGAL]**

- IP pre-existente: <quién la posee, qué licencia recíproca si aplica>.
- IP creado durante el contrato: <quién la posee, plazos, alcance de cesión>.
- Marcas: <uso permitido, restricciones>.

### 7. Confidencialidad

- Definición de Información Confidencial.
- Obligación de confidencialidad: <duración durante y posterior al contrato>.
- Excepciones: información ya pública, conocida previamente, recibida de tercero sin obligación, desarrollada independientemente, divulgación obligatoria.
- Destrucción / devolución al terminar.

### 8. Limitación de responsabilidad **[REVISAR LEGAL]**

- Cap de responsabilidad: <importe o % del valor del contrato>.
- Tipos de daños excluidos: <indirectos, lucro cesante, etc.>.
- Excepciones al cap: <dolo, indemnización por terceros, brechas de confidencialidad / IP / privacidad>.

### 9. Indemnización **[REVISAR LEGAL]**

- <Parte A> indemnizará a <Parte B> en caso de: <eventos>.
- <Parte B> indemnizará a <Parte A> en caso de: <eventos>.
- Procedimiento: notificación, asunción de defensa, settlement.

### 10. Garantías y declaraciones

- Cada parte declara y garantiza: <capacidad, no conflicto, cumplimiento legal aplicable>.

### 11. Privacidad y protección de datos *(si hay tratamiento)*

> Si hay tratamiento de datos personales, referenciar el DPA suscrito entre las partes (no duplicar). Coordinar con `legal-privacy`.

### 12. Anti-corrupción / compliance *(si aplica)*

<Cumplimiento de leyes anti-soborno, sanciones, exportación cuando relevante.>

### 13. Cesión

<Condiciones bajo las cuales una parte puede ceder el contrato a un tercero.>

### 14. Subcontratación

<Condiciones bajo las cuales se admite subcontratación y responsabilidad por subcontratistas.>

### 15. Fuerza mayor

<Definición y consecuencias: notificación, suspensión de obligaciones, terminación si supera X plazo.>

### 16. Notificaciones

<Canales válidos (email + dirección física), destinatarios, fechas a efectos legales.>

### 17. Ley aplicable y jurisdicción **[REVISAR LEGAL]**

- **Ley aplicable:** <Ley de [país/región]>
- **Resolución de disputas:** <tribunales de [ciudad] / arbitraje en [institución]>
- **Idioma de procedimiento:** <idioma>

### 18. Disposiciones generales

- Acuerdo completo (entire agreement).
- Modificaciones (por escrito firmadas por ambas partes).
- Renuncia.
- Divisibilidad (severability).
- Encabezados (no condicionan la interpretación).

---

## Firma

Y en prueba de conformidad, las partes firman el presente contrato en <X> ejemplares originales, en el lugar y fecha indicados.

**Por <Parte A>:**
___________________________
Nombre: <Nombre>
Cargo: <Cargo>
Fecha: <fecha>

**Por <Parte B>:**
___________________________
Nombre: <Nombre>
Cargo: <Cargo>
Fecha: <fecha>

---

## Anexos (si aplica)

- **Anexo I:** <descripción detallada del scope / SOW / deliverables>.
- **Anexo II:** <pricing detallado>.
- **Anexo III:** <SLAs si aplican>.
- **Anexo IV:** <medidas de seguridad si hay tratamiento de datos>.
```

> Para variantes específicas (NDA mutuo, NDA unilateral, MSA + SOW separados, license, partnership), adaptar las secciones aplicables. El esqueleto se mantiene: preámbulo → definiciones → objeto → cláusulas → firma → anexos.

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin jurisdicción, partes y objeto, parar.
2. **Determinar el tipo exacto** del contrato y adaptar las secciones aplicables (un NDA no necesita pricing detallado; una SOW sí; un term sheet no necesita firma final con todas las cláusulas).
3. **Buscar template propio** de la empresa para este tipo de contrato + jurisdicción. Si existe, partir de ahí, no de cero.
4. **Redactar con definiciones explícitas.** Cada término que aparezca múltiples veces y pueda generar ambigüedad va a la sección 1.
5. **Marcar `[REVISAR LEGAL]`** en las cláusulas críticas:
   - IP (sección 6).
   - Limitación de responsabilidad (sección 8).
   - Indemnización (sección 9).
   - Ley aplicable y jurisdicción (sección 17).
   - Privacidad si hay tratamiento (sección 11).
6. **Producir el resumen ejecutivo** antes del contrato completo. Es la primera lectura del firmante.
7. **Marcar `[NEGOCIAR]`** los puntos identificados como sujetos a negociación con la contraparte y `[VERIFICAR JURISDICCIÓN]` lo dependiente de derecho local que requiere ratificación humana.
8. **Guardar** en `<proyecto>/legal/contracts/<tipo>/<contraparte>-<tipo>-<YYYY-MM>.md`.
9. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen ejecutivo: tipo, partes, importe, duración, cláusulas críticas.
   - Lista de items `[REVISAR LEGAL]`.
   - Próximo paso: validación con counsel humano antes de envío a la contraparte.

---

## Restricciones

- **No emites opinión legal vinculante.** Borrador → counsel humano → firma.
- **No firmes ni recomiendes firmar.** Esa decisión es del firmante autorizado.
- **No asumas jurisdicción.** Sin jurisdicción declarada, el output es genérico y arriesgado.
- **No incluyas cláusulas extremas sin marcarlas** como bandera roja: indemnidad ilimitada, exclusividad eterna, IP transfer total sin contraprestación, jurisdicción opaca.
- **No omitas el resumen ejecutivo.** Un contrato sin executive summary aumenta riesgo de firma mal informada.
- **No copies templates de internet.** Genéricos pero peligrosos. Adaptar a empresa y jurisdicción.
- **No mezcles idiomas en una misma versión.** Si el contrato es bilingüe, dos columnas o dos versiones paralelas, no traducciones inline a mitad de párrafo.
- Aplican las reglas de output de `_shared/output-rules.md`.
