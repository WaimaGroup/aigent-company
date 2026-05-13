---
name: "privacy-policy"
description: >
  Skill for producing a structured privacy policy compliant with one or more
  applicable frameworks (GDPR, CCPA, LGPD, PIPEDA): controller info, data
  categories, purposes with legal bases, retention, recipients, international
  transfers, data subject rights, and contact for DPO/representative. NOT legal
  advice — output requires human privacy counsel validation.
---

# Skill: Privacy Policy

**Entregable:** archivo `.md` con la política de privacidad pública lista para ser publicada (tras revisión humana), guardado en `<proyecto>/legal/privacy/policy/privacy-policy-v<X>.md`.

---

## Cuándo usar esta skill

- Hay que publicar la política de privacidad inicial de un producto/servicio.
- Hay que actualizarla porque cambió la actividad de tratamiento (nuevas finalidades, nuevos proveedores, nuevos países de operación).
- Hay que adaptarla a un marco regulatorio adicional (lanzamiento en California → CCPA, en Brasil → LGPD).

**Cuándo NO usar:**

- Para Data Processing Agreements internos con proveedores (eso es DPA, otro formato).
- Para Records of Processing Activities (ROPA, art. 30 GDPR — formato interno, no público).
- Para responder a un Subject Access Request (DSAR), eso es otro flujo.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Marcos aplicables | ¿GDPR, CCPA, LGPD, PIPEDA, combinaciones? (se leen de `decisions` si están) |
| Responsable | Razón social, NIF, dirección, jurisdicción de constitución |
| Datos de contacto privacy | Email genérico (typo `privacy@`), DPO si designado, representante en UE si controlador no-UE |
| Producto / servicio | A qué aplica esta política (web, app, plataforma B2B, etc.) |
| Categorías de datos recogidos | Concretas: identificadores, contacto, navegación, transacción, ubicación, biométricos, datos sensibles si aplica |
| Finalidades de tratamiento | Lista concreta: cuenta, facturación, comunicación, analítica, marketing, etc. |
| Bases legales | Por finalidad: consentimiento / contrato / obligación legal / interés legítimo / interés vital / interés público |
| Plazos de conservación | Por categoría o finalidad |
| Destinatarios | Proveedores principales (categorías o nombres), terceros relevantes |
| Transferencias internacionales | Países destino fuera de zona de "adecuación", mecanismo (SCCs, BCRs, adequacy) |
| Decisiones automatizadas | ¿Hay perfilado o decisiones automatizadas con efectos legales / similares significativos? |
| Menores | ¿El servicio puede ser usado por menores? ¿Política de verificación? |
| Idioma | Idioma de la política (idealmente el del usuario/jurisdicción) |

---

## Plantilla del entregable

```markdown
---
type: "privacy-policy"
frameworks: ["GDPR", "CCPA", "LGPD"]
controller: "<Razón social>"
controller_tax_id: "<NIF/VAT>"
controller_jurisdiction: "<país>"
dpo_email: "<dpo@empresa.com | n/a>"
eu_representative: "<si aplica>"
language: "es | en | ..."
effective_date: "YYYY-MM-DD"
version: "X"
status: "draft | reviewed | published"
owner: "<DPO / privacy counsel / persona>"
last_review: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
---

# Política de Privacidad — <Empresa> / <Producto>

> **Vigente desde <fecha> · Versión <X>**

## Resumen ejecutivo (1 minuto)

> Qué datos recogemos, para qué, con quién los compartimos y qué derechos tienes. La política completa abajo amplía cada punto.

- **Quién:** <Empresa>, responsable del tratamiento.
- **Qué datos:** identificadores, contacto, navegación, transaccionales <+ otros>.
- **Para qué:** prestar el servicio, facturar, comunicarnos contigo, mejorar el producto, marketing si lo aceptas.
- **Con quién:** proveedores que nos ayudan a operar (cloud, pago, analítica) y autoridades cuando la ley lo exija.
- **Dónde:** algunos proveedores tienen datos en <países> bajo <mecanismo legal>.
- **Qué puedes hacer:** acceder, rectificar, oponerte, borrar, portar tus datos, y retirar consentimiento. Escribe a <contacto>.

---

## 1. Responsable del tratamiento

**<Razón social>** (en adelante, "<Empresa>"), con NIF <NIF>, domicilio en <dirección>, es la responsable del tratamiento de los datos personales descritos en esta política.

Si tienes preguntas o quieres ejercer tus derechos, contacta con:
- **Email:** <privacy@empresa.com>
- **DPO (Delegado de Protección de Datos):** <dpo@empresa.com> (si designado)
- **Representante en la UE:** <si controlador no-UE>

## 2. Qué datos recogemos

Cuando usas <producto/servicio>, recogemos los siguientes datos:

| Categoría | Datos concretos | Origen |
|---|---|---|
| Identificadores | <ej. email, ID usuario, IP> | Directo del usuario / cookies |
| Contacto | <nombre, dirección, teléfono> | Directo |
| Cuenta | <username, password hash, preferencias> | Directo |
| Transaccionales | <historial de pedidos, métodos de pago tokenizados> | Pasarela de pago |
| Navegación | <páginas vistas, clics, dispositivo> | Cookies / analítica |
| <Otras categorías relevantes> | <...> | <...> |

> **No recogemos datos sensibles** (origen racial, salud, biométricos, ideología, religión, orientación sexual, datos de menores sin consentimiento parental) **salvo cuando se indique explícitamente** y con la base legal correspondiente. *(Adaptar si el servicio sí los recoge.)*

## 3. Por qué los recogemos y con qué base legal

| Finalidad | Datos usados | Base legal (GDPR / equivalente) |
|---|---|---|
| Crear y gestionar tu cuenta | Identificadores, cuenta | Ejecución del contrato (art. 6.1.b GDPR) |
| Prestar el servicio contratado | Identificadores, transaccionales | Ejecución del contrato |
| Facturación y obligaciones contables / fiscales | Identificadores, transaccionales | Obligación legal (art. 6.1.c) |
| Comunicaciones operativas (cambios de servicio, incidencias) | Identificadores, contacto | Interés legítimo (art. 6.1.f) |
| Mejora del producto y analítica | Navegación pseudonimizada | Interés legítimo / Consentimiento |
| Marketing y promociones | Identificadores, contacto | Consentimiento (art. 6.1.a) |
| Cumplir requerimientos de autoridades | Lo solicitado por la autoridad | Obligación legal |

> Para finalidades basadas en consentimiento, puedes retirarlo en cualquier momento — ver sección "Tus derechos".

## 4. Cuánto tiempo conservamos tus datos

| Categoría / finalidad | Plazo de conservación |
|---|---|
| Cuenta activa | Mientras dure la relación + plazo legal aplicable |
| Datos contables / fiscales | <X años según jurisdicción local> |
| Comunicaciones de marketing | Hasta retirada del consentimiento |
| Logs de seguridad / acceso | <Y meses> |
| Datos de soporte | Hasta cierre del ticket + X meses |

Pasados los plazos, los datos se **borran** o se **anonimizan** de forma irreversible.

## 5. Con quién compartimos tus datos

Compartimos datos con las siguientes categorías de destinatarios estrictamente necesarios para prestar el servicio:

| Categoría | Para qué | Ubicación |
|---|---|---|
| Proveedores de infraestructura cloud | Hosting, backups, seguridad | <UE / US / etc.> |
| Pasarelas de pago | Procesar pagos | <jurisdicción> |
| Analítica de producto | Mejorar el producto | <jurisdicción> |
| Email transaccional / marketing | Enviar comunicaciones | <jurisdicción> |
| Atención al cliente / CRM | Gestionar soporte | <jurisdicción> |
| Auditores, asesores legales | Cumplimiento | <jurisdicción> |
| Autoridades competentes | Cuando la ley lo exija | <jurisdicción> |

Todos los proveedores que tratan datos por nosotros han firmado un **Data Processing Agreement (DPA)** que garantiza las medidas de seguridad y obligaciones aplicables.

## 6. Transferencias internacionales

Algunos proveedores procesan datos fuera del Espacio Económico Europeo (EEE) / país de residencia. En esos casos garantizamos un nivel de protección adecuado mediante:

- **Decisiones de adecuación** de la Comisión Europea (cuando aplica).
- **Cláusulas Contractuales Tipo (Standard Contractual Clauses)** aprobadas por la Comisión Europea.
- **<Otros mecanismos si aplica:** BCRs, derogaciones art. 49 GDPR**>.**

[REVISAR LEGAL] Verificar Transfer Impact Assessment (TIA) post-Schrems II para destinos relevantes.

## 7. Tus derechos

Tienes los siguientes derechos en relación a tus datos personales:

- **Acceso:** saber qué datos tuyos tenemos y obtener una copia.
- **Rectificación:** corregir datos inexactos o incompletos.
- **Supresión ("derecho al olvido"):** borrar tus datos cuando ya no sean necesarios o retires el consentimiento.
- **Oposición:** oponerte al tratamiento basado en interés legítimo o marketing directo.
- **Limitación:** restringir el uso de tus datos en ciertos casos.
- **Portabilidad:** recibir tus datos en formato estructurado o que los transmitamos a otro responsable.
- **Retirada de consentimiento:** en finalidades basadas en consentimiento.
- **No ser objeto de decisiones automatizadas** con efectos legales significativos sin tu consentimiento explícito.

Para ejercerlos, escribe a **<privacy@empresa.com>**. Atenderemos tu petición en un plazo máximo de **30 días** desde la recepción (ampliable a 60 días si la complejidad lo justifica, con notificación previa).

Si consideras que no hemos atendido correctamente tu petición, puedes reclamar ante la autoridad de control competente:
- **UE:** autoridad nacional de protección de datos de tu país (ej. AEPD en España).
- **California:** California Privacy Protection Agency.
- **Brasil:** ANPD.
- **<Otras jurisdicciones>**.

## 8. Cookies y tecnologías similares

Esta política se complementa con nuestra **<Política de cookies>** disponible en <link>. Allí detallamos los tipos de cookies, su finalidad y cómo gestionar tus preferencias.

## 9. Decisiones automatizadas

<Adaptar:>
- "**No utilizamos** decisiones automatizadas con efectos legales o similares significativos sobre los usuarios."
- *o bien:* "Utilizamos perfilado para <finalidad concreta>. Tienes derecho a no estar sujeto a decisiones basadas únicamente en tratamiento automatizado; contacta con <privacy@> para revisión humana."

## 10. Menores

<Adaptar:>
- "Nuestro servicio **no está dirigido a menores** de <edad mínima según jurisdicción>. No recogemos datos de menores conscientemente. Si crees que un menor nos ha facilitado datos sin consentimiento parental, contáctanos y procederemos a su eliminación."
- *o bien:* "Si nuestro servicio puede ser usado por menores, descripción específica del proceso de consentimiento parental, datos especiales recogidos, plazos reducidos, y verificación."

## 11. Seguridad

Aplicamos medidas técnicas y organizativas razonables para proteger los datos personales contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen <cifrado en tránsito y reposo, control de acceso por rol, registros de auditoría, formación al personal, gestión de incidentes>.

Si se produjera una **brecha de seguridad** con riesgo para tus derechos, te notificaríamos sin dilación indebida, sin perjuicio de la notificación a la autoridad de control competente cuando proceda.

## 12. Cambios en esta política

Podemos actualizar esta política para reflejar cambios en la operativa o en la normativa. Cuando el cambio sea **material**, te avisaremos con antelación razonable (por email a usuarios registrados o aviso destacado en el servicio) **<X> días antes** de su entrada en vigor.

La versión vigente es siempre la publicada en <URL de la política>. El historial de versiones está en la sección 13.

## 13. Historial de versiones

| Versión | Fecha de vigencia | Cambios principales |
|---|---|---|
| <X> | <YYYY-MM-DD> | <Cambios materiales> |
| <X-1> | <YYYY-MM-DD> | <Cambios> |

---

> **[REVISAR LEGAL]** — Esta política es un borrador estructurado. Antes de publicarla, requiere validación por DPO o privacy counsel humano para verificar adecuación a las jurisdicciones aplicables, coherencia con la operativa real (tratamientos reales, proveedores reales, plazos reales) y compliance con normativa actualizada.
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin jurisdicción y marcos aplicables, la política es genérica.
2. **Identificar marcos aplicables** explícitamente (GDPR si UE/UK, CCPA si CA, LGPD si BR, PIPEDA si CA, sectoriales). Cada uno añade obligaciones específicas.
3. **Listar finalidades reales** y asignar a cada una su base legal. NO copiar finalidades genéricas — usar las actividades reales del producto.
4. **Inventariar proveedores** que tratan datos personales y sus jurisdicciones para sección 5 y 6.
5. **Identificar transferencias** fuera de adecuación y declarar el mecanismo de protección.
6. **Marcar `[REVISAR LEGAL]`** decisiones de fondo:
   - Bases legales aplicadas a cada finalidad.
   - Mecanismos de transferencia internacional.
   - Decisiones sobre menores.
   - Plazos de conservación.
   - Existencia o no de decisiones automatizadas con efectos significativos.
7. **Cross-check** con T&C y política de cookies vigentes (vía `legal-policies`) para evitar contradicciones.
8. **Guardar** en `<proyecto>/legal/privacy/policy/privacy-policy-v<X>.md`.
9. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen ejecutivo: marcos cubiertos, finalidades clave, transferencias.
   - Lista de items `[REVISAR LEGAL]`.
   - Próximo paso: validación con DPO/counsel humano, publicación, registro en ROPA.

---

## Restricciones

- **No emites opinión legal vinculante.** Borrador → DPO/counsel → publicación.
- **No declares "GDPR-compliant" / "fully compliant".** Eso lo certifica una auditoría o un counsel humano, no esta skill.
- **No mezcles bases legales por finalidad.** Una finalidad = una base legal aplicable.
- **No copies privacy policy de otra empresa.** Sus finalidades, sus proveedores, su jurisdicción ≠ los tuyos.
- **No omitas el plazo de respuesta a derechos.** 30 días en GDPR. CCPA tiene 45. LGPD tiene 15.
- **No declares "no usamos cookies"** si las usas. La política de cookies se complementa con esta.
- **No publiques sin versión y fecha de vigencia.** Política sin versión es decorativa.
- Aplican las reglas de output de `_shared/output-rules.md`.
