---
name: "dpa-template"
description: >
  Skill for producing a Data Processing Agreement (DPA) compliant with GDPR Art.
  28 (and equivalent frameworks): roles (controller/processor), subject matter,
  duration, nature/purpose, categories of data and data subjects, processor
  obligations, sub-processors authorization, technical/organizational measures,
  international transfers (SCCs/IDTA), audit rights, breach notification. NOT
  legal advice — requires human counsel validation.
---

# Skill: DPA Template

**Entregable:** archivo `.md` con el borrador de DPA (Data Processing Agreement), listo para firma tras revisión humana legal. Vive en `<proyecto>/legal/privacy/dpa/<contraparte>-dpa.md` (uno por contraparte: proveedor o cliente).

---

## Cuándo usar esta skill

- Contratamos un proveedor que va a tratar datos personales en nuestro nombre (cloud hosting, email marketing, analytics, CRM, etc.).
- Un cliente nuestro requiere DPA antes de firmar el contrato principal (común en B2B SaaS).
- Hay que actualizar un DPA vigente por cambio regulatorio (post-Schrems II, nuevas SCCs UE) o de operativa (nuevo sub-procesador, nueva categoría de datos).
- Hay que producir el DPA "standard" reusable de la empresa para ofrecer a clientes/proveedores.

**Cuándo NO usar:**

- Para política de privacidad pública (eso es `privacy-policy`).
- Para contrato comercial principal con la contraparte (eso es `contract-template`; el DPA se anexa).
- Para registro interno de actividades de tratamiento (eso es ROPA — formato distinto).
- Para Data Protection Impact Assessment (eso es DPIA — análisis de riesgo, no contrato).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Contraparte | Razón social completa, NIF/VAT, dirección, jurisdicción |
| Rol nosotros | ¿Somos controlador (cliente firma como processor) o processor (proveedor firma como controlador)? |
| Servicio principal | ¿Qué servicio motiva el DPA? (referencia al contrato principal) |
| Categorías de datos | ¿Qué datos personales se tratan? (identificadores, contacto, financieros, ubicación, biométricos, sensibles, menores) |
| Categorías de interesados | ¿De quién son los datos? (empleados del cliente, end users finales, contactos B2B, etc.) |
| Duración | ¿Mientras dure el contrato principal o plazo específico? |
| Sub-procesadores | ¿Cuáles usamos? (lista de proveedores que también tratan los datos) |
| Ubicación de los datos | ¿Países donde se almacenan/procesan? Si fuera del EEE, ¿qué mecanismo? |
| Marco regulatorio | GDPR principal. ¿Aplica también CCPA / LGPD / otros? |
| Auditorías | ¿Cómo se manejan? (SOC 2 informes, audit on-site previa notificación, etc.) |
| Idioma | Español, inglés, ambos |

---

## Plantilla del entregable

Nombre del archivo: `<contraparte-slug>-dpa.md`.

```markdown
---
type: "dpa"
counterparty: "<Razón social>"
counterparty_tax_id: "<NIF/VAT>"
counterparty_jurisdiction: "<país>"
our_role: "controller | processor | joint-controller"
counterparty_role: "controller | processor | joint-controller"
main_contract_reference: "<MSA / SaaS Agreement / contract reference>"
effective_date: "YYYY-MM-DD"
duration: "<mientras dure el contrato principal | hasta YYYY-MM-DD>"
frameworks: ["GDPR", "CCPA", "LGPD"]
language: "es | en | bilingual"
status: "draft | counterparty-review | approved | signed"
counsel_review_status: "[REVISAR LEGAL] — borrador pendiente de counsel"
date_drafted: "YYYY-MM-DD"
---

# Acuerdo de Tratamiento de Datos (DPA)

> Entre **<Razón social A>** y **<Razón social B>**, en relación al servicio **<Servicio>** regulado por el contrato principal **<referencia>** firmado el <fecha>.

> **[REVISAR LEGAL]** Este DPA es un borrador estructurado. Antes de firmarlo, requiere validación por counsel humano para verificar adecuación al marco regulatorio aplicable, coherencia con la operativa real y la implementación efectiva de las medidas técnicas y organizativas declaradas.

---

## 1. Definiciones

> Términos con mayúscula usados en este DPA.

- **"Datos Personales"** tiene el significado del Art. 4(1) GDPR (o equivalente en marco aplicable): cualquier información sobre persona física identificada o identificable.
- **"Controlador"** = quien determina los fines y medios del tratamiento (Art. 4(7) GDPR).
- **"Procesador"** = quien trata los datos por cuenta del Controlador (Art. 4(8) GDPR).
- **"Subprocesador"** = procesador subcontratado por el Procesador para parte del tratamiento.
- **"Interesado"** = persona física a quien se refieren los datos personales.
- **"Brecha de Seguridad"** = violación de seguridad que cause destrucción, pérdida, alteración o acceso no autorizado a Datos Personales.
- **"SCCs"** = Standard Contractual Clauses adoptadas por la Comisión Europea para transferencias internacionales.
- **"EEE"** = Espacio Económico Europeo.

---

## 2. Roles

- **<Empresa A>** actúa como **<Controlador / Procesador>** de los Datos Personales descritos en el Anexo I.
- **<Empresa B>** actúa como **<Procesador / Controlador>** de esos mismos Datos en relación al servicio prestado bajo el contrato principal.

> *Joint-controller: si ambas partes determinan conjuntamente los fines y medios, ajustar este DPA a esquema de co-controlling (Art. 26 GDPR) con asignación clara de obligaciones.*

---

## 3. Objeto, duración, naturaleza y finalidad del tratamiento

Ver **Anexo I** para detalle completo. En resumen:

- **Objeto:** tratamiento de Datos Personales por <Procesador> en el contexto del servicio <Servicio>.
- **Duración:** durante la vigencia del contrato principal + plazos legales de conservación aplicables.
- **Naturaleza:** <hosting / análisis / envío de comunicaciones / etc.>
- **Finalidad:** únicamente para prestar el servicio descrito en el contrato principal.

---

## 4. Obligaciones del Procesador

El Procesador se obliga a:

### 4.1 Tratamiento conforme a instrucciones

Tratar los Datos únicamente conforme a las instrucciones documentadas del Controlador (en este DPA y en el contrato principal). Si el Procesador entiende que una instrucción infringe el GDPR u otra normativa aplicable, lo notificará inmediatamente al Controlador.

### 4.2 Confidencialidad

Garantizar que las personas autorizadas a tratar los Datos están bajo obligación de confidencialidad (contrato laboral, NDA específico, o equivalente legal).

### 4.3 Medidas técnicas y organizativas (TOMs)

Implementar las medidas descritas en el **Anexo II**, que incluyen al menos:

- Cifrado en tránsito y en reposo de Datos Personales.
- Control de acceso por rol (least-privilege).
- Logs de auditoría con retención mínima de <12 meses>.
- Backups regulares con cifrado.
- Plan de continuidad y recuperación documentado y testado.
- Formación periódica al personal sobre protección de datos.
- Proceso de gestión de incidentes.

### 4.4 Subprocesadores

- El Controlador autoriza al Procesador el uso de los subprocesadores listados en el **Anexo III**.
- El Procesador notificará por escrito al Controlador con **<30 días>** de antelación cualquier intención de añadir o sustituir subprocesador.
- El Controlador podrá objetar razonablemente la designación. Si la objeción no se resuelve, podrá terminar el contrato.
- El Procesador firmará con cada subprocesador acuerdos que impongan las mismas obligaciones que este DPA en lo aplicable.

### 4.5 Asistencia al Controlador

Asistir al Controlador en:

- Atender solicitudes de los interesados sobre sus derechos (acceso, rectificación, supresión, portabilidad, oposición, limitación).
- Gestionar Data Protection Impact Assessments (DPIAs) cuando aplique.
- Notificación de brechas de seguridad (sección 4.6).
- Consulta previa al supervisor cuando se requiera.

### 4.6 Notificación de brechas

- El Procesador notificará al Controlador cualquier Brecha de Seguridad **sin dilación indebida** y, en cualquier caso, dentro de las **<48 horas>** del conocimiento de la misma.
- La notificación incluirá: naturaleza de la brecha, categorías y número aproximado de interesados y registros afectados, consecuencias probables, medidas adoptadas o propuestas, contacto del DPO/responsable.
- El Procesador asistirá al Controlador en la gestión de la brecha y, si aplica, la notificación al supervisor en 72h (Art. 33 GDPR).

### 4.7 Devolución o supresión de datos al finalizar

A la terminación del contrato, el Procesador, a elección del Controlador:
- Devolverá los Datos Personales en formato estructurado y de uso común; o
- Suprimirá los Datos y certificará por escrito su eliminación.

Salvo obligación legal de conservación, en cuyo caso se indicará plazo y motivo.

### 4.8 Auditorías

- El Controlador (o un tercero acordado, bajo NDA) podrá auditar el cumplimiento del Procesador con este DPA mediante:
  - Informes de certificación reconocidos (SOC 2 Type II, ISO 27001, etc.) cuando el Procesador los disponga.
  - Auditorías on-site con preaviso razonable (<30 días>), durante horario laboral, no más de **<1 vez/año>** salvo brecha o incidente.
- El coste de la auditoría: a cargo del Controlador salvo si revela incumplimiento material del Procesador.

---

## 5. Transferencias internacionales

### 5.1 Países cubiertos

Los Datos se tratan principalmente en: **<lista de países>**. Ver Anexo III para detalle por subprocesador.

### 5.2 Transferencias fuera del EEE

Cuando los Datos se transfieran fuera del EEE a un país sin decisión de adecuación de la Comisión Europea, las partes:

- Aplicarán las **Standard Contractual Clauses (SCCs)** adoptadas por la Comisión Europea el 4 de junio de 2021 (Implementing Decision (EU) 2021/914), módulo adecuado según el rol.
- Realizarán un **Transfer Impact Assessment (TIA)** post-Schrems II para evaluar si la legislación del país destino permite cumplir las salvaguardas.
- Implementarán medidas técnicas y contractuales suplementarias cuando el TIA lo requiera.

### 5.3 Reino Unido

Para transferencias al/del Reino Unido, las partes incorporan el **UK International Data Transfer Addendum (IDTA)** o las **UK Addendum to EU SCCs** según corresponda.

---

## 6. Responsabilidades **[REVISAR LEGAL]**

Cada parte responderá por los daños causados por incumplimiento de sus obligaciones bajo este DPA y la normativa aplicable, conforme al Art. 82 GDPR y la limitación de responsabilidad del contrato principal.

---

## 7. Duración, terminación y supervivencia

- **Duración:** vigente desde la firma hasta finalización del contrato principal.
- **Terminación:** automática con el contrato principal o por incumplimiento material del DPA con preaviso de subsanación.
- **Supervivencia:** las obligaciones de confidencialidad, devolución/supresión de datos, asistencia ante reclamaciones de interesados y responsabilidades sobreviven a la terminación.

---

## 8. Ley aplicable y resolución de disputas **[REVISAR LEGAL]**

Conforme al contrato principal.

---

## 9. Firma

Y en prueba de conformidad, las partes firman el presente DPA en el lugar y fecha indicados.

**Por <Empresa A>:** ___________________ · Nombre · Cargo · Fecha
**Por <Empresa B>:** ___________________ · Nombre · Cargo · Fecha

---

# ANEXOS

## Anexo I — Detalle del tratamiento

- **Objeto del tratamiento:** <descripción>
- **Duración:** <misma que contrato principal + plazos legales>
- **Naturaleza y finalidad:** <descripción>
- **Tipos de Datos Personales tratados:**
  - Identificadores: <email, nombre, ID interno>
  - Contacto: <teléfono, dirección>
  - Cuenta: <username, password hash, preferencias>
  - Navegación: <IP, user agent, eventos>
  - Transaccionales: <historial, métodos pago tokenizados>
  - <Otras categorías relevantes>
  - **Categorías especiales (Art. 9 GDPR):** <ninguna / listar si aplica con base legal específica>
- **Categorías de Interesados:**
  - <ej. empleados del Controlador, end users del producto, prospects en marketing, etc.>

## Anexo II — Medidas Técnicas y Organizativas (TOMs)

### Confidencialidad

- Cifrado en tránsito: TLS 1.2+.
- Cifrado en reposo: AES-256 o equivalente.
- Control de acceso: role-based access control (RBAC); MFA obligatorio para acceso administrativo.
- Logs de auditoría con retención de <12 meses>.

### Integridad

- Backups diarios encriptados; restauración testada al menos trimestralmente.
- Versionado y trazabilidad de cambios en sistemas críticos.
- Protección contra modificación no autorizada (write-once para logs, checksum en backups).

### Disponibilidad

- Plan de continuidad documentado y testado anualmente.
- RTO: <X horas>. RPO: <Y minutos/horas>.
- Infraestructura redundante; failover automático para servicios críticos.

### Resiliencia

- Pruebas de disaster recovery anuales.
- Monitorización 24/7 de sistemas críticos.

### Procesos organizativos

- Política de seguridad de la información documentada.
- Formación obligatoria a empleados sobre protección de datos (anual).
- Proceso de onboarding/offboarding con revocación inmediata de accesos.
- Acuerdo de confidencialidad firmado por todos los empleados y contractors.

### Certificaciones

- <ISO 27001 / SOC 2 Type II / otras certificaciones aplicables — fecha de última auditoría>

## Anexo III — Subprocesadores autorizados

| Subprocesador | Servicio prestado | Ubicación (país) | Mecanismo de transferencia (si fuera EEE) |
|---|---|---|---|
| <AWS / GCP / Azure> | Cloud hosting | EU (Frankfurt / Ireland) | N/A — dentro EEE |
| <SendGrid / Mailgun> | Email transaccional | EEUU | SCCs + TIA |
| <Stripe> | Procesamiento de pagos | EEUU | SCCs + TIA |
| <Datadog / NewRelic> | Observability | EEUU | SCCs + TIA |
| <(otros)> | | | |

## Anexo IV — Datos de contacto

**Por el Controlador:**
- Email general: <contacto>
- DPO: <dpo@empresa.com> (si designado)
- Representante en la UE: <si aplica>

**Por el Procesador:**
- Email general: <contacto>
- DPO: <dpo@procesador.com>
- Representante en la UE: <si aplica>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin claridad de roles (controlador vs procesador), datos tratados y subprocesadores, parar.
2. **Definir roles primero.** ¿Somos controlador o procesador en esta relación? El DPA cambia significativamente según el rol.
3. **Anexo I completo:** sin descripción exacta del objeto, datos y finalidades, el DPA es genérico (y por tanto débil ante un supervisor).
4. **Anexo II — TOMs reales.** No copiar boilerplate; reflejar lo que la empresa hace de verdad. Si declaramos "cifrado AES-256" debe ser cierto.
5. **Anexo III — lista de subprocesadores actual.** Importantísimo mantenerlo vivo; cambios deben comunicarse con preaviso.
6. **Plazo de notificación de brecha** explícito (48h al Controlador, 72h al supervisor para GDPR).
7. **Mecanismo de transferencia internacional** específico. SCCs UE módulo correcto + TIA post-Schrems II si aplica.
8. **Marcar `[REVISAR LEGAL]`** todas las cláusulas críticas (responsabilidad, jurisdicción, alcance), `[VERIFICAR ANEXO II]` las TOMs reales pendientes de validación con seguridad/infra.
9. **Coordinar con `legal-contracts`** para asegurar que el contrato principal referencia este DPA correctamente.
10. **Guardar** en `<proyecto>/legal/privacy/dpa/<contraparte-slug>-dpa.md`.
11. **Reportar** al usuario: ruta, roles asignados, fecha objetivo de firma, items `[REVISAR LEGAL]`.

---

## Restricciones

- **No emites opinión legal vinculante.** Borrador → counsel humano → firma.
- **No firmes ni recomiendes firmar.** La decisión es del firmante autorizado.
- **No declares medidas técnicas que no implementas.** Si dices "cifrado AES-256" sin que sea cierto, expones a la empresa.
- **No omitas subprocesadores reales** en el Anexo III. Cualquier supervisor lo cruza con la realidad operativa.
- **No copies DPA de otro proveedor sin adaptar.** Cada empresa tiene su contexto, su stack y su rol específico.
- **No olvides el mecanismo de transferencia internacional** si los datos salen del EEE. SCCs (UE), IDTA (UK), o BCRs si aplican.
- **No descuides la coherencia con la privacy policy pública** (`privacy-policy`) — los subprocesadores y categorías deben coincidir.
- **No prometas SLAs de notificación de brecha imposibles** (ej. "24h al supervisor" en lugar del 72h GDPR — si lo prometes, lo cumples).
- Aplican las reglas de output de `_shared/output-rules.md`.
