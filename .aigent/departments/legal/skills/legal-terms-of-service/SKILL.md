---
name: "legal-terms-of-service"
user-invocable: true
description: >
  Skill for producing a structured Terms of Service (or Terms & Conditions) for a
  product or service: account, pricing & payment, intellectual property,
  acceptable use, liability cap, indemnification, termination, governing law and
  consumer-rights clauses where applicable. NOT legal advice — output requires
  human legal counsel validation.
---

# Skill: Terms of Service

**Entregable:** archivo `.md` con los T&C / Terms of Service listos para ser publicados (tras revisión humana), guardado en `<proyecto>/legal/policies/terms/<producto>-terms-v<X>.md`.

---

## Cuándo usar esta skill

- Hay que publicar los T&C / ToS iniciales de un producto/servicio.
- Hay que actualizarlos por cambio material en el servicio, pricing o modelo de negocio.
- Hay que generar variantes (B2C vs B2B, distintas jurisdicciones, distintos productos).

**Cuándo NO usar:**

- Para un contrato bilateral negociado individualmente (eso es `contract-template`).
- Para política de privacidad (`privacy-policy`).
- Para política de cookies, AUP o SLA público (otras skills futuras).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Producto / servicio | Nombre exacto y URL si aplica |
| Modelo de negocio | B2C / B2B / mixed; suscripción / transaccional / freemium; marketplace |
| Audiencia | Consumidores generales, profesionales, empresas |
| Jurisdicción aplicable | País / región para ley aplicable y resolución de disputas |
| Idioma | Idioma de los T&C (idealmente el del mercado) |
| Pricing / billing | Plan(es), recurrencia, política de refunds, cancelación |
| Cuenta | ¿Se requiere registro? ¿Qué se admite/prohíbe? ¿Hay verificación KYC? |
| IP | Quién es dueño de qué (contenido del usuario, contenido propio, marca) |
| Limitación responsabilidad | Cap propuesto y excepciones |
| Versión vigente | ¿Hay versión actual o es desde cero? |
| Mecanismo de cambios | Cómo se comunican cambios materiales y plazo de aviso |
| Política de menores | ¿Edad mínima? ¿Verificación parental si aplica? |
| Versión consumidores | Si la jurisdicción tiene normativa específica de consumo (UE: Directiva 2011/83), aplicar cláusulas obligatorias |

---

## Plantilla del entregable

```markdown
---
type: "terms-of-service"
product: "<Nombre del producto/servicio>"
business_model: "B2C | B2B | mixed; subscription | transactional | freemium; marketplace"
jurisdiction: "<país/región>"
governing_law: "<ley aplicable>"
forum: "<tribunales o arbitraje>"
language: "es | en | ..."
effective_date: "YYYY-MM-DD"
version: "X"
status: "draft | reviewed | published"
owner: "<rol/persona>"
last_review: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
---

# Términos de Servicio — <Producto>

> **Vigente desde <fecha> · Versión <X>**

## Resumen para el usuario (3 minutos)

> Lo esencial que tienes que saber antes de aceptar. Los términos completos están debajo.

- **Qué es:** <producto> es <descripción>.
- **Quién lo opera:** <Razón social>, <jurisdicción>.
- **Lo que pagas:** <pricing resumen>.
- **Tu contenido:** sigue siendo tuyo. Nos das una licencia para mostrarlo / procesarlo en el servicio.
- **Lo que no puedes hacer:** <usos prohibidos clave>.
- **Cómo cancelar:** <resumen> (sección X).
- **Si hay problemas:** <link a soporte> + jurisdicción aplicable.
- **Si eres consumidor:** tienes derechos adicionales que prevalecen sobre estos términos (sección "Derechos de consumo" si aplica).

---

## 1. Aceptación de los términos

Al crear una cuenta, acceder a o utilizar **<Producto>**, aceptas estos Términos de Servicio (en adelante, **"Términos"**). Si no estás de acuerdo, no uses el servicio.

Si actúas en nombre de una empresa, declaras que tienes autoridad para vincularla.

## 2. Definiciones

- **"Servicio"** o **"Producto":** <Producto> y sus funcionalidades disponibles en <URL>.
- **"Empresa", "nosotros":** <Razón social>, <jurisdicción>, NIF <NIF>.
- **"Usuario", "tú":** la persona física o jurídica que accede al Servicio.
- **"Cuenta":** registro personal o de empresa creado en el Servicio.
- **"Contenido del Usuario":** datos, archivos, textos y demás material aportado por el Usuario al Servicio.
- **"Contenido del Servicio":** el propio Servicio, su software, diseño, marca y contenido provisto por la Empresa.

## 3. Cuenta

- Para usar partes del Servicio puede ser necesario registrarse y mantener una Cuenta.
- Eres responsable de la veracidad de los datos aportados, la seguridad de tus credenciales y la actividad realizada en tu Cuenta.
- Edad mínima: <edad> años. Si eres menor, se requiere consentimiento parental válido en tu jurisdicción.
- Nos reservamos el derecho de suspender o terminar Cuentas que incumplan estos Términos o supongan riesgo de seguridad / abuso (ver sección "Usos prohibidos" y "Terminación").

## 4. Descripción del Servicio

<Descripción precisa de qué hace el Servicio. Si hay tiers / planes, mencionarlo brevemente y referenciar la página de pricing.>

Nos reservamos el derecho a modificar, mejorar o discontinuar funcionalidades. En caso de cambios materiales, te lo comunicaremos con antelación razonable.

## 5. Precio y pago

### 5.1 Planes

<Resumen de planes. Para el detalle siempre prevalece la página de pricing del producto y, en su caso, el order form firmado.>

### 5.2 Facturación

- **Recurrencia:** <mensual / anual / pago único>.
- **Método:** <tarjeta, transferencia, otros>.
- **Renovación:** <automática salvo cancelación / manual>.
- **Impuestos:** los precios excluyen IVA u otros impuestos aplicables, salvo indicación expresa.

### 5.3 Aumentos de precio

Te avisaremos con **<X> días** de antelación. Puedes cancelar antes de la entrada en vigor para evitar el nuevo precio.

### 5.4 Refunds

<Política específica: pago no reembolsable / reembolsable proporcional / 14 días si consumidor UE / etc.>

### 5.5 Impago

Si un pago falla, te notificaremos. Si persiste el impago tras <X> días, podemos suspender el Servicio. Mantienes acceso a tu Contenido del Usuario por un período razonable para exportarlo.

## 6. Tu contenido y propiedad intelectual

### 6.1 Tu contenido

El **Contenido del Usuario** es y sigue siendo tuyo. Nos otorgas una licencia mundial, no exclusiva y gratuita para procesarlo, almacenarlo y mostrarlo **únicamente para prestarte el Servicio** y mejorarlo en formas que no te identifiquen individualmente.

Eres responsable de tener los derechos necesarios sobre tu Contenido (autoría, licencias, consentimientos de terceros).

### 6.2 Nuestro contenido

El **Contenido del Servicio** (software, diseño, marca, documentación) es propiedad de <Empresa> o de sus licenciantes y está protegido por leyes de propiedad intelectual. Te concedemos una licencia limitada, personal, no transferible y revocable para usar el Servicio según estos Términos.

### 6.3 Feedback

Si nos das ideas, sugerencias o feedback, podemos usarlas libremente sin compensación.

## 7. Usos prohibidos (AUP resumido)

No puedes:

- Usar el Servicio para actividad ilegal o que infrinja derechos de terceros.
- Hacer ingeniería inversa, descompilar o intentar acceder al código fuente.
- Realizar scraping masivo, abuso de API o sobrecargar la infraestructura.
- Enviar spam o malware desde el Servicio.
- Suplantar a otra persona o empresa.
- Eludir limitaciones de uso o restricciones de licencia.
- Usar el Servicio para competir con nosotros (si aplica al modelo de negocio).

[REVISAR LEGAL] La AUP completa está en <link a AUP> y se considera parte de estos Términos.

## 8. Limitación de responsabilidad **[REVISAR LEGAL]**

- El Servicio se proporciona "tal cual" y "según disponibilidad", sin garantías expresas o implícitas de exactitud, fitness for purpose, no-infracción o disponibilidad continua, salvo en lo no excluible por ley aplicable.
- La responsabilidad total de <Empresa> hacia el Usuario por cualquier reclamación derivada del Servicio se limita a <importe / cantidad pagada en los últimos X meses / mayor de ambos>.
- Quedan excluidos daños indirectos, consecuenciales, lucro cesante, salvo en supuestos de dolo o cuando la ley aplicable no lo permita.
- **Para consumidores**, lo anterior se aplica sin perjuicio de los derechos imperativos de consumo de tu jurisdicción.

## 9. Indemnización **[REVISAR LEGAL]**

El Usuario indemnizará a <Empresa> por reclamaciones de terceros derivadas de:
- Su Contenido del Usuario (incluida infracción de derechos de terceros).
- Su incumplimiento de estos Términos.
- Su uso indebido del Servicio.

## 10. Terminación

### 10.1 Por el Usuario

Puedes cancelar tu Cuenta y/o suscripción en cualquier momento desde <ubicación de la opción>. Los pagos ya realizados no son reembolsables salvo lo previsto en la sección 5.4.

### 10.2 Por la Empresa

Podemos suspender o terminar tu acceso al Servicio si:
- Incumples estos Términos.
- Hay actividad fraudulenta o ilícita en tu Cuenta.
- Existen riesgos serios de seguridad.
- La ley nos lo exige.

### 10.3 Efectos de la terminación

- Cesa el acceso al Servicio.
- Te facilitamos un plazo razonable para exportar tu Contenido del Usuario.
- Pasado ese plazo, tu Contenido se elimina o se anonimiza según la política de privacidad.
- Las cláusulas que por su naturaleza deban sobrevivir (responsabilidad, propiedad intelectual, jurisdicción) **sobreviven** a la terminación.

## 11. Modificaciones de los Términos

Podemos modificar estos Términos. Para cambios **materiales**, te lo comunicaremos con **<X> días** de antelación por email a usuarios registrados o aviso destacado en el Servicio. Si no estás de acuerdo, puedes cancelar antes de la entrada en vigor.

El uso continuado del Servicio tras la entrada en vigor implica aceptación.

## 12. Privacidad

El tratamiento de datos personales se rige por la **Política de Privacidad** disponible en <link>, que forma parte integrante de estos Términos.

## 13. Ley aplicable y resolución de disputas **[REVISAR LEGAL]**

- **Ley aplicable:** Ley de <jurisdicción>.
- **Resolución de disputas:** <tribunales de [ciudad] / arbitraje en [institución]>.
- **Idioma de procedimiento:** <idioma>.
- **Para consumidores:** lo anterior se aplica sin perjuicio del fuero del consumidor y mecanismos extrajudiciales aplicables (ej. ODR de la UE).

## 14. Disposiciones generales

- **Cesión:** no puedes ceder estos Términos sin nuestro consentimiento. Nosotros podemos cederlos como parte de una operación corporativa con aviso al Usuario.
- **Renuncia:** no actuar ante un incumplimiento no implica renuncia a futuras acciones.
- **Divisibilidad:** si una cláusula se declara inválida, el resto sigue en vigor.
- **Acuerdo completo:** estos Términos, junto con la Política de Privacidad y, en su caso, el order form / AUP, constituyen el acuerdo completo entre las partes sobre el Servicio.
- **Fuerza mayor:** ninguna parte responde por incumplimientos derivados de causas fuera de su control razonable.

## 15. Contacto

Para cualquier consulta sobre estos Términos:
- **Email:** <legal@empresa.com>
- **Dirección postal:** <dirección>

## 16. Derechos de consumo *(si jurisdicción aplica)*

> Sección obligatoria si el Servicio se dirige a consumidores en jurisdicciones con normativa específica (UE: derecho de desistimiento de 14 días, garantías legales, etc.).

[REVISAR LEGAL] Insertar cláusulas específicas según jurisdicción de consumo.

## 17. Historial de versiones

| Versión | Fecha de vigencia | Cambios principales |
|---|---|---|
| <X> | <YYYY-MM-DD> | <Cambios materiales> |
| <X-1> | <YYYY-MM-DD> | <Cambios> |

---

> **[REVISAR LEGAL]** — Estos Términos son un borrador estructurado. Antes de publicarlos, requieren validación por counsel humano para verificar adecuación a la jurisdicción aplicable, coherencia con la operativa real (pricing real, AUP real, política de privacidad real) y compliance con normativa de consumo si aplica.
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin jurisdicción y modelo de negocio, parar.
2. **Adaptar al modelo de negocio:** B2C tiene cláusulas de consumo obligatorias; B2B tiene más flexibilidad; marketplace requiere cláusulas adicionales (responsabilidad por terceros, condiciones para vendedores).
3. **Coherencia con políticas relacionadas:** privacy policy (sección 12), AUP (sección 7), pricing page (sección 5).
4. **Marcar `[REVISAR LEGAL]`** las cláusulas críticas:
   - Limitación de responsabilidad (sección 8).
   - Indemnización (sección 9).
   - Ley aplicable y disputas (sección 13).
   - AUP referenciada (sección 7).
   - Derechos de consumo si aplica (sección 16).
5. **Producir resumen de 3 minutos** al inicio. Es la única parte que muchos usuarios leerán.
6. **Versionado obligatorio.** Fecha de entrada en vigor + tabla de historial.
7. **Plan de comunicación** si es actualización material (sección 11): describir cómo se va a avisar al usuario y con qué antelación.
8. **Guardar** en `<proyecto>/legal/policies/terms/<producto>-terms-v<X>.md`.
9. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen: jurisdicción, modelo, cláusulas críticas, fecha de entrada en vigor.
   - Items `[REVISAR LEGAL]`.
   - Próximo paso: validación con counsel humano, publicación, comunicación a usuarios existentes si actualización material.

---

## Restricciones

- **No emites opinión legal vinculante.** Borrador → counsel humano → publicación.
- **No copies T&C de otra empresa.** Sus cláusulas no son tus cláusulas.
- **No omitas la jurisdicción aplicable.** Sin ella, los T&C son decorativos.
- **No incluyas limitación de responsabilidad que sea inejecutable** en jurisdicciones de consumo (UE: la ley protege al consumidor por encima del contrato).
- **No publiques cambios materiales sin plan de comunicación.** Cambiar términos a usuarios existentes sin aviso es violación frecuente del derecho de consumo.
- **No mezcles plain language con jerigonza legal.** Si quieres plain, sé plain en todo el documento.
- **No olvides el versionado.** Cada T&C dice `Vigente desde YYYY-MM-DD · v<X>`.
- Aplican las reglas de output de `_shared/output-rules.md`.
