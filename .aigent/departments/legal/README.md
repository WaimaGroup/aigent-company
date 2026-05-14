# Legal — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de Legal.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`legal-orchestrator.md`](./legal-orchestrator.md).

> **AVISO FUNDAMENTAL.** Los agentes de este dept producen **borradores y estructura, NO asesoría legal**. Cada output marca explícitamente `[REVISAR LEGAL]` los pasajes críticos. Todo va validado por counsel humano antes de aplicarse.
>
> **Primera petición del dept confirma:** jurisdicción principal, jurisdicciones de operación y marcos regulatorios aplicables (GDPR/CCPA/LGPD/sectoriales).

---

## Cómo se invoca

1. **Vía orquestador** (recomendado): `legal-orchestrator` enruta a contracts / policies / privacy / risk.
2. **Directo a agente** cuando ya sabes (ej. "NDA" → `legal-contracts`).
3. **Skill directa** para outputs concretos (privacy-policy, compliance-checklist).

---

## Agentes

### `legal-contracts` — Contracts

NDAs, MSAs, SOWs, licencias, partnerships, term sheets, LOIs, consulting agreements.

**Caso de uso:** MSA para nuevo cliente enterprise.

**Prompt:**
> "Borrador de MSA para ACME Corp. Jurisdicción España. Servicios SaaS B2B. Duración 36 meses con auto-renovación, terminación con 90 días. SLA 99.5%. Pricing fijo."

**Output esperado:**
- Ruta: `<proyecto>/legal/contracts/msa-acme-corp-draft.md`
- Estructura del MSA (con marcas `[REVISAR LEGAL]`):
  ```markdown
  # Master Services Agreement (MSA)

  > ⚠️ BORRADOR. Validar con counsel antes de enviar a contraparte.
  > Marcas `[REVISAR LEGAL]` en pasajes críticos.

  ## Preámbulo
  Entre Aigent Solutions, S.L. ("Proveedor") con CIF B-12345678 y
  domicilio en [...], y ACME Corp, S.A. ("Cliente") con CIF A-98765432
  y domicilio en [...], se acuerda el presente MSA con fecha [FECHA].

  ## Definiciones
  - "Servicios": acceso a la plataforma Aigent + soporte técnico.
  - "Documentación": manuales, guías, materiales accesibles vía la plataforma.
  - "Información Confidencial": cualquier información no pública compartida
    entre las Partes, marcada como tal o evidente por contexto.
  - "Datos del Cliente": datos cargados/generados por el Cliente en la
    plataforma.
  - [REVISAR LEGAL] "Caso de uso permitido" — definir alcance preciso.

  ## 1. Objeto y duración
  - Duración: 36 meses desde fecha efectiva.
  - Auto-renovación: 12 meses, salvo preaviso 90 días.
  - [REVISAR LEGAL] Cláusula de salida anticipada — material breach.

  ## 2. Pricing y facturación
  - Pricing según Order Form anexo (Anexo A).
  - Facturación mensual, pago a 30 días.
  - [REVISAR LEGAL] Ajuste anual por inflación, cap del 5%.

  ## 3. SLA y soporte
  - Disponibilidad mensual: 99.5%
  - Definición de tiempo de inactividad: ver Anexo B
  - Créditos por incumplimiento SLA escalados (5%, 10%, 25%)
  - Soporte en horario laboral (CET), respuesta según severidad.

  ## 4. Propiedad intelectual
  - El Proveedor mantiene la propiedad de la plataforma y la IP relacionada.
  - El Cliente mantiene la propiedad de sus Datos.
  - El Proveedor obtiene licencia limitada para procesar los Datos del
    Cliente solo en cumplimiento del servicio.
  - [REVISAR LEGAL] Cláusula sobre training de modelos con datos del Cliente
    (recomendación: opt-out explícito).

  ## 5. Confidencialidad
  Sigue cláusulas estándar de Información Confidencial (NDA bilateral
  embebida). Duración 5 años post-terminación.

  ## 6. Protección de datos
  El procesamiento de datos personales se regula por el DPA adjunto
  (Anexo C) conforme al Art. 28 GDPR.

  ## 7. Limitación de responsabilidad
  - [REVISAR LEGAL] Cap de responsabilidad: 12 meses de fees pagadas.
  - Excepciones: fraude, mala fe, breach de confidencialidad, IP, GDPR.

  ## 8. Indemnización
  El Proveedor indemnizará al Cliente por reclamaciones de terceros por
  infracción de IP por el uso normal de la plataforma.

  ## 9. Terminación
  - Por incumplimiento material: con preaviso 30 días para curar.
  - Por insolvencia: efecto inmediato.
  - Consecuencias: retorno de datos (30 días), facturación pro-rata.

  ## 10. Ley aplicable y jurisdicción
  Ley española. Tribunales de Barcelona.
  [REVISAR LEGAL] Cláusula de arbitraje (opcional, ICC).

  ## Anexos
  - Anexo A: Order Form (pricing, plan, módulos)
  - Anexo B: SLA detallado
  - Anexo C: DPA (separate file)
  - Anexo D: AUP (Acceptable Use Policy)

  ## Firmas
  [FIRMA PROVEEDOR] · [FECHA]
  [FIRMA CLIENTE] · [FECHA]
  ```

---

### `legal-policies` — External Policies

T&C, Terms of Service, AUP, cookies, SLA público, disclaimers.

**Caso de uso:** Terms of Service de la plataforma.

**Prompt:**
> "Terms of Service de la plataforma SaaS. Jurisdicción España, GDPR. Audiencia: empresas (B2B). Resumen plain language de 3 minutos al principio."

**Output esperado:**
- Ruta: `<proyecto>/legal/policies/terms-of-service.md`
- Estructura completa:
  ```markdown
  # Terms of Service (T&C)

  Última actualización: 2026-05-14

  > ⚠️ BORRADOR. Validar con counsel antes de publicar.

  ## Resumen de 3 minutos

  Para que entiendas lo importante sin leer todo:
  - **Qué es:** Aigent es una plataforma SaaS B2B para gestión financiera.
  - **Quién puede:** empresas con cuenta activa y al menos un usuario admin.
  - **Pricing:** según plan elegido. Mensual o anual, sin pagos ocultos.
  - **Tus datos:** tuyos. Los procesamos solo para darte el servicio.
  - **Tu responsabilidad:** subir datos lícitos, no hacer cosas ilegales,
    no compartir tu cuenta con terceros no autorizados.
  - **Cuando termina:** puedes irte cuando quieras. Te damos tus datos.
  - **Cuando rompemos algo:** te damos créditos según el SLA. Cap total
    a 12 meses de pago.

  Para detalles, sigue leyendo.

  ## 1. Aceptación
  Al usar Aigent, aceptas estos T&C. Si no aceptas, no uses la plataforma.

  ## 2. Cuenta
  - Una cuenta de empresa con uno o más usuarios autorizados.
  - El admin de cuenta es responsable del uso por parte de sus usuarios.
  - [REVISAR LEGAL] Restricciones de elegibilidad por país sancionado.

  ## 3. Pricing y pagos
  - Según plan seleccionado en el panel de tu cuenta.
  - Cargo mensual o anual recurrente.
  - Sin reembolso de meses parciales en cancelación, salvo casos legales.
  - Impagos: suspensión tras 30 días, terminación tras 60.

  ## 4. Uso permitido
  Puedes usar Aigent para gestionar las finanzas de tu empresa según los
  módulos contratados. Ver AUP (anexo) para usos prohibidos.

  ## 5. Propiedad intelectual
  - Nosotros: plataforma, marca, documentación.
  - Tú: tus datos, tu marca, tu configuración.
  - Nadie pierde nada de lo que ya tenía al firmar.

  ## 6. AUP — Acceptable Use Policy
  No puedes:
  - Hacer reverse engineering de la plataforma.
  - Subir contenido ilegal, malware o material que infrinja IP de terceros.
  - Hacer scraping masivo o saturar la API.
  - Revender o sub-licenciar.
  - Usar Aigent para coordinar actividades ilegales.

  ## 7. Limitación de responsabilidad
  - [REVISAR LEGAL] Limitación a 12 meses de fees.
  - No respondemos por: pérdida de profits, daños indirectos, downtime
    fuera del SLA.

  ## 8. Modificación de estos términos
  - Te avisaremos con 30 días de antelación de cambios materiales.
  - Cambios menores (typos, claridad) tienen efecto inmediato.

  ## 9. Terminación
  - Puedes cancelar en cualquier momento desde el panel.
  - Tras cancelación: 30 días para exportar tus datos. Luego se borran
    según política de retención del DPA.

  ## 10. Resolución de disputas
  - Primero: intento de resolución amistosa.
  - Después: tribunales de Barcelona, ley española.
  - [REVISAR LEGAL] Cláusula de arbitraje opcional.

  ## 11. Derechos de consumo
  Estos términos van dirigidos a empresas. Si eres consumidor individual,
  tienes derechos adicionales bajo la legislación de consumo aplicable.

  ## 12. Contacto
  Para cuestiones sobre estos T&C: legal@aigent.example
  ```

---

### `legal-privacy` — Privacy

Privacy policy, DPAs, DPIAs, ROPA, transferencias internacionales, DSAR handling, gestión de brechas.

**Caso de uso:** privacy policy GDPR-compliant para publicar.

**Prompt:**
> "Privacy policy pública. Empresa española, datos de empresas (B2B). Aplica GDPR. Marketing también recolecta cookies. Procesadores: AWS, HubSpot, Stripe. Sin transferencias fuera EU/UK."

**Output esperado:**
- Ruta: `<proyecto>/legal/privacy/privacy-policy.md`
- Estructura:
  ```markdown
  # Política de Privacidad

  Última actualización: 2026-05-14

  > ⚠️ BORRADOR. Validar con DPO/counsel antes de publicar.

  ## 1. Responsable del tratamiento
  Aigent Solutions, S.L. · CIF B-12345678
  Calle Ejemplo 123, 08001 Barcelona, España
  Email DPO: dpo@aigent.example

  ## 2. Datos personales que tratamos
  - **Datos de cuenta** (admins, usuarios): nombre, email, rol.
  - **Datos de facturación**: nombre fiscal, CIF, dirección, IBAN.
  - **Datos de uso**: logs de actividad, telemetría agregada de la plataforma.
  - **Datos de comunicación**: emails con soporte, tickets.
  - **Cookies** (web pública): sesión, analítica, marketing — ver política
    de cookies separada.

  ## 3. Finalidades y bases legales
  | Finalidad | Base legal |
  | Prestar el servicio contratado | Ejecución del contrato (Art. 6.1.b) |
  | Facturación | Obligación legal (Art. 6.1.c) |
  | Soporte técnico | Ejecución del contrato (Art. 6.1.b) |
  | Marketing a usuarios existentes | Interés legítimo (Art. 6.1.f) |
  | Marketing a leads | Consentimiento (Art. 6.1.a) |

  ## 4. Plazos de conservación
  - Datos de cuenta: durante la vigencia + 5 años post-terminación.
  - Datos de facturación: 10 años (obligación fiscal).
  - Logs de uso: 12 meses (granular), 3 años (agregado).
  - Tickets de soporte: 3 años tras cierre.

  ## 5. Destinatarios (procesadores)
  - **AWS** (Frankfurt, Irlanda): hosting de la plataforma
  - **HubSpot** (datos en Frankfurt): CRM y marketing
  - **Stripe** (UE): procesador de pagos
  - **Auth0** (UE): autenticación

  Todos los procesadores tienen DPA Art. 28 firmado.

  ## 6. Transferencias internacionales
  Los datos se mantienen dentro de la UE/EEA. Si en algún momento fuera
  necesaria una transferencia fuera, se haría bajo Standard Contractual
  Clauses (SCC) de la UE 2021 o mecanismo equivalente.

  ## 7. Tus derechos (GDPR)
  Puedes ejercer:
  - Acceso a tus datos
  - Rectificación
  - Supresión ("derecho al olvido")
  - Limitación del tratamiento
  - Portabilidad
  - Oposición
  - No ser objeto de decisiones automatizadas (no aplicamos)

  Para ejercerlos: dpo@aigent.example. Plazo de respuesta: 30 días.

  ## 8. Cómo proteges los datos
  - Cifrado en tránsito (TLS 1.3) y en reposo (AES-256).
  - Acceso mínimo por roles, 2FA obligatorio para staff.
  - Auditoría SOC 2 Type II anual.
  - DPIA realizada (resumen disponible bajo petición).

  ## 9. Reclamaciones
  Tienes derecho a presentar reclamación ante la Agencia Española de
  Protección de Datos (AEPD): www.aepd.es

  ## 10. Cambios en esta política
  Te avisaremos con 30 días antes de cambios materiales.
  ```

---

### `legal-risk` — Risk & Compliance

Risk analysis de decisiones, compliance reviews por framework, due diligence, litigation tracking, M&A, whistleblowing.

**Caso de uso:** compliance review SOC 2.

**Prompt:**
> "Compliance checklist contra SOC 2 Type II. Estamos a 4 meses de auditoría externa. Necesito saber dónde estamos vs los controles, gap analysis y plan."

**Output esperado:**
- Ruta: `<proyecto>/legal/risk/compliance-checklist-soc2-2026.md`
- Estructura:
  ```markdown
  # Compliance Checklist — SOC 2 Type II · Auditoría Sept 2026

  > ⚠️ BORRADOR. Coordinar con auditor + counsel.

  ## Metodología
  Trust Services Criteria 2017 (revisado 2022): Security, Availability,
  Processing Integrity, Confidentiality, Privacy. Scope: Security + Availability.

  ## Estado por categoría

  ### Security (CC1-CC9)
  | Control | Estado | Evidencia | Gap |
  | CC1.1 — Tone at the top | Pass | Código ética publicado, training anual | — |
  | CC2.1 — Communication of security | Pass | Slack #security channel, onboarding | — |
  | CC3.1 — Risk assessment formal | Partial | Risk register existe pero no review trimestral | Implementar review trimestral |
  | CC4.1 — Monitoring of controls | Partial | Algunos automatizados, otros manual | Formalizar dashboard de controls |
  | CC5.1 — Control activities | Pass | Documentadas | — |
  | CC6.1 — Logical access | Pass | RBAC, 2FA, review trimestral | — |
  | CC6.2 — User provisioning/deprov | Pass | Automatizado en off-boarding | — |
  | CC6.3 — Authentication | Pass | SSO obligatorio staff, 2FA en todo | — |
  | CC6.6 — System operations | Partial | Patches OK, vuln scan trimestral | Pasar a mensual |
  | CC7.1 — Detection of incidents | Pass | SIEM en place, on-call rotation | — |
  | CC7.2 — Incident response | Pass | Runbook publicado, drills semestrales | — |

  ### Availability (A1)
  | Control | Estado | Evidencia | Gap |
  | A1.1 — Capacity planning | Pass | Quarterly review documentado | — |
  | A1.2 — Backup and recovery | Partial | Backups OK pero RTO/RPO no testeados en 12m | DR drill en Q3 |
  | A1.3 — Environmental safeguards | N/A | Cloud (AWS) | Inherited control |

  ## Gap analysis priorizado

  ### 🔴 Bloqueantes para audit (3)
  1. Risk assessment trimestral formalizado — owner: CISO · due: Jul 2026
  2. DR drill con tiempos medidos — owner: Infra · due: Aug 2026
  3. Vuln scan mensual + remediation SLA — owner: Security · due: Jun 2026

  ### 🟠 Recomendados pre-audit (5)
  4. Dashboard de control monitoring — owner: Security · due: Aug 2026
  5. Política de incident comms al cliente — owner: Legal · due: Jul 2026
  6. Training adicional para staff nuevo — owner: HR · due: ongoing
  7. Política de retención de logs documentada — owner: Legal · due: Jul 2026
  8. Tabletop exercise de incident response — owner: CISO · due: Aug 2026

  ### 🟡 Mejoras post-audit (4)
  9-12. ...

  ## Remediation plan (sprints)

  ### Sprint Jun 1-15
  - #1 Risk assessment template + primera ejecución
  - #3 Vuln scan mensual setup

  ### Sprint Jun 16-30
  - #5 Política incident comms
  - #7 Política retención logs

  ### Sprint Jul
  - #2 Preparación DR drill
  - #4 Dashboard control monitoring v1

  ### Sprint Aug
  - #2 DR drill ejecutado
  - #8 Tabletop incident response

  ### Sept
  - Audit window — auditor externo

  ## Evidencias preparadas para auditor
  - Carpeta `/evidence/2026-soc2/` con:
    - Políticas
    - Logs de access reviews trimestrales
    - Output de vuln scans
    - Reports de incident response drills
    - Sample de tickets de incident
  ```

---

## Skills

### `contract-template` — Borrador estructurado de contrato comercial

MSA / SOW / consulting / partnership / license.

Ver ejemplo en agente `legal-contracts` arriba.

---

### `nda-template` — NDA standalone

Mutuo o unilateral, con Información Confidencial, exclusiones, duración, remedies.

**Caso de uso:** NDA mutuo para early conversation con partner potencial.

**Prompt:**
> "NDA mutuo entre nosotros y BetaPay para evaluar colaboración. Jurisdicción España. Duración 3 años. Información que incluye: roadmap, pricing, customer data."

**Output esperado:**
- Ruta: `<proyecto>/legal/contracts/nda-mutual-betapay.md`
- Estructura del NDA:
  ```markdown
  # Acuerdo de Confidencialidad Mutuo (Mutual NDA)

  > ⚠️ BORRADOR. Validar con counsel.

  ## Partes
  Aigent Solutions, S.L. ("Parte A")
  BetaPay Tech, S.A. ("Parte B")

  Conjuntamente "las Partes".

  ## Fecha efectiva
  [FECHA DE FIRMA]

  ## 1. Propósito
  Las Partes desean explorar una posible colaboración comercial. Para ello
  intercambiarán Información Confidencial. Este NDA regula dicho intercambio.

  ## 2. Definición de Información Confidencial
  Toda información no pública intercambiada entre las Partes durante o tras
  la firma de este acuerdo, incluyendo a título enunciativo:
  - Roadmap de producto
  - Estructura de pricing
  - Customer data (con compromiso adicional GDPR si aplica)
  - Información financiera no publicada
  - Estrategia comercial
  - Datos técnicos, código, arquitectura

  ## 3. Exclusiones
  No se considera Información Confidencial:
  - Lo que ya era público antes del intercambio
  - Lo que pasa a ser público sin culpa de la parte receptora
  - Lo desarrollado independientemente sin uso de Información Confidencial
  - Lo que un tercero comparte legítimamente sin restricción

  ## 4. Obligaciones de la parte receptora
  Cada parte se compromete a:
  - Usar la Información Confidencial solo para el Propósito (sección 1)
  - Restringir el acceso a empleados/asesores con need-to-know
  - Proteger con el mismo cuidado que su propia información confidencial
    (mínimo razonable)
  - No copiar más de lo necesario para el Propósito

  ## 5. Duración
  - Vigencia del acuerdo: 12 meses desde la firma.
  - Obligaciones de confidencialidad: 3 años post-terminación.
  - [REVISAR LEGAL] Para customer data: aplica indefinidamente.

  ## 6. Devolución o destrucción
  Al terminar el acuerdo o a petición de la parte reveladora, la parte
  receptora destruirá o devolverá toda Información Confidencial en su
  posesión y certificará por escrito el cumplimiento.

  ## 7. Sin licencia
  Este NDA no transfiere ni licencia derecho de IP alguno. La Información
  Confidencial sigue siendo de su propietario original.

  ## 8. Remedies
  - Las Partes reconocen que el incumplimiento causaría daño irreparable.
  - [REVISAR LEGAL] Cada parte podrá solicitar medidas cautelares
    (injunctive relief) sin necesidad de probar daño económico cuantificable.
  - Adicionalmente: indemnización por daños probados.

  ## 9. Ley aplicable y jurisdicción
  Ley española. Tribunales de Barcelona.

  ## Firmas
  [FIRMA PARTE A] · [FECHA]
  [FIRMA PARTE B] · [FECHA]
  ```

---

### `privacy-policy` — Política de privacidad pública GDPR/CCPA/LGPD-compliant

Ver ejemplo en agente `legal-privacy` arriba.

---

### `dpa-template` — DPA Art. 28 GDPR

Anexos (objeto, TOMs, subprocesadores), notificación de brechas, SCCs.

**Caso de uso:** DPA con cliente enterprise.

**Prompt:**
> "DPA para firmar con ACME Corp. Nosotros somos procesador, ACME es responsable. Art. 28 GDPR. Subprocesadores: AWS Frankfurt, HubSpot. Sin transferencias fuera EU."

**Output esperado:**
- Ruta: `<proyecto>/legal/contracts/dpa-acme-corp.md`
- Estructura:
  ```markdown
  # Data Processing Agreement (DPA)

  > ⚠️ BORRADOR. Validar con DPO/counsel.

  ## Partes
  - **Responsable del tratamiento ("Controller"):** ACME Corp, S.A.
  - **Encargado del tratamiento ("Processor"):** Aigent Solutions, S.L.

  ## 1. Objeto
  Este DPA regula el tratamiento por parte del Processor de los datos
  personales del Controller en el marco de la prestación de los Servicios
  según el MSA del [FECHA].

  ## 2. Categorías de datos y sujetos
  Ver Anexo I — Categorías de datos personales tratados.

  ## 3. Duración
  Vigente durante la vigencia del MSA + 30 días tras terminación para
  devolución/borrado.

  ## 4. Obligaciones del Processor
  - Tratar los datos solo bajo instrucciones documentadas del Controller.
  - Garantizar confidencialidad del personal con acceso.
  - Aplicar medidas técnicas y organizativas (Anexo II — TOMs).
  - Asistir al Controller en derechos GDPR de los interesados.
  - Asistir en la gestión de brechas de seguridad.
  - Borrar o devolver los datos al final del servicio.
  - Facilitar auditorías razonables.

  ## 5. Subprocesadores autorizados
  - AWS (Frankfurt, Alemania) — hosting
  - HubSpot (Frankfurt, Alemania) — CRM/marketing
  El Controller autoriza estos subprocesadores. Cualquier cambio se
  notificará con 30 días de antelación; el Controller podrá objetar.

  ## 6. Notificación de brechas
  - Al Controller: en plazo de **48 horas** desde el conocimiento de
    la brecha.
  - Notificación incluirá: descripción, datos afectados, medidas tomadas,
    contacto del DPO.
  - El Controller será responsable de la notificación a la autoridad de
    control (72h GDPR Art. 33) y, si aplica, a los interesados (Art. 34).

  ## 7. Transferencias internacionales
  No hay transferencias fuera de la UE/EEA en el flujo actual. Si las
  hubiera, se realizarán bajo Standard Contractual Clauses 2021/914
  (Módulo 2 Controller-to-Processor o Módulo 3 P-to-P según aplique).

  ## 8. Auditoría
  El Controller podrá realizar auditorías (max 1/año salvo causa fuerte)
  con preaviso 30 días, durante horario laboral, con confidencialidad
  reforzada. Alternativamente, certificación SOC 2 / ISO 27001 puede
  reemplazar la auditoría in-situ.

  ## Anexos
  - **Anexo I:** Categorías de datos personales tratados
  - **Anexo II:** Medidas técnicas y organizativas (TOMs)
  - **Anexo III:** Lista de subprocesadores
  - **Anexo IV:** Standard Contractual Clauses (si aplica)

  ## Firmas
  [FIRMA CONTROLLER] · [FECHA]
  [FIRMA PROCESSOR] · [FECHA]
  ```

---

### `terms-of-service` — T&C / ToS con resumen plain language

Ver ejemplo en agente `legal-policies` arriba.

---

### `compliance-checklist` — Checklist contra framework con gap analysis

Ver ejemplo en agente `legal-risk` arriba.

---

## Skills compartidas usadas en este dept

- `risk-matrix` (shared) — Matriz de riesgos legales y regulatorios. Consumida por `legal-risk`.
- `stakeholder-map` (shared) — Mapeo de stakeholders en M&A o due diligence. Consumida por `legal-risk`.

Ver ejemplos en [`_shared/README.md`](../_shared/README.md).

---

## Flujo end-to-end típico

```
Onboarding nuevo cliente enterprise:
1. legal-contracts → contract-template (MSA)
2. legal-contracts → nda-template (si aún no firmado)
3. legal-privacy   → dpa-template (Anexo del MSA)
4. legal-policies  → AUP referenciado en MSA

Publicar/actualizar website público:
1. legal-policies  → terms-of-service
2. legal-privacy   → privacy-policy
3. legal-policies  → cookies policy

Preparación de auditoría:
1. legal-risk      → compliance-checklist
2. legal-risk      → risk-matrix (riesgos abiertos)
```
