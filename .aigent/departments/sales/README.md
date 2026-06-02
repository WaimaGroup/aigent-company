# Sales — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de Sales.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`sales-orchestrator.md`](./sales-orchestrator.md).

---

## Cómo se invoca

1. **Vía orquestador** (recomendado): `sales-orchestrator` enruta según fase del funnel.
2. **Directo a agente**: sabes que es prospección → `sales-sdr`; closing → `sales-ae`.
3. **Skill directa**: para outputs concretos (pipeline-review semanal, forecast trimestral).

> **¿En Word o Excel?** Por defecto los entregables salen en `.md`. Si lo quieres como documento de Word o como hoja de Excel, solo pídelo (p. ej. «el forecast trimestral en Excel», «la propuesta comercial en Word»): el sistema genera el `.docx`/`.xlsx` listo para abrir.

---

## Agentes

### `sales-sdr` — Sales Development Representative

Listas de prospectos por ICP, secuencias de outreach (email/LinkedIn), investigación de cuentas, calificación BANT/MEDDIC inicial.

**Caso de uso:** lista de prospectos para nuevo segmento.

**Prompt:**
> "Necesito una lista de 30 prospectos para nuestro nuevo ICP: heads of revenue ops de empresas SaaS B2B 50-300 empleados, HQ en España o Portugal, stack con HubSpot o Salesforce."

**Output esperado:**
- Ruta: `<proyecto>/sales/prospecting/prospecting-list-revops-iberia-q3.md`
- Tabla estructurada:
  ```markdown
  # Prospecting List — RevOps Iberia Q3 2026

  ## ICP aplicado
  - Cargo: Head of Revenue Operations / RevOps Lead
  - Empresa: SaaS B2B, 50-300 empleados
  - Geo: España, Portugal
  - Stack: HubSpot o Salesforce confirmado

  ## Lista (30 prospectos)

  | # | Nombre | Cargo | Empresa | Empleados | Stack | Hook personalización | Verificación |
  | 1 | Marta R. | Head of RevOps | TechBoard | 120 | HubSpot | Caso público de migración 2025 | LinkedIn ok, email por verificar |
  | 2 | João S. | RevOps Lead | SaasPay | 80 | Salesforce | Post reciente sobre attribution | LinkedIn ok, email por verificar |
  | 3 | Laura M. | Director RevOps | Datablend | 220 | Both | Equipo creció 3x en 12 meses | LinkedIn ok, email confirmado vía Apollo |
  ...

  ## Campos por verificar antes de outreach
  - Emails marcados "por verificar" → pasar por Hunter / Apollo
  - Cargos cambiantes: revisar últimas 4 semanas en LinkedIn
  ```

---

### `sales-ae` — Account Executive

Propuestas, discovery calls, renewal management, argumentarios, estrategia de cierre.

**Caso de uso:** propuesta comercial para deal late-stage.

**Prompt:**
> "Necesito una propuesta para ACME Corp. Ya hicimos 2 discovery calls. El deal está en evaluación final, compite con CompetitorX. Pricing 4.500€/mes en plan Pro, 36 meses."

**Output esperado:**
- Ruta: `<proyecto>/sales/proposals/proposal-acme-corp.md`
- Estructura:
  ```markdown
  # Propuesta — ACME Corp

  ## Resumen ejecutivo
  ACME necesita reducir el cierre de mes de 11 días a <5, y descubrimos
  en discovery que el cuello es la conciliación manual entre 4 sistemas.
  Esta propuesta cubre la implementación y el primer año de operación.

  ## El problema, en sus palabras
  - "Tardamos 11 días en cerrar y siempre llegamos tarde al board"
  - "Tenemos 4 hojas de cálculo que viven en email"
  - "El equipo de finance hace overtime el primer viernes de mes"
  (Citas verbatim de las discovery calls del 12 y 19 de abril.)

  ## La solución
  Tres capacidades core:
  1. Conciliación automática multi-fuente (cubre vuestros 4 sistemas)
  2. Workflow de aprobación con audit trail
  3. Dashboard de close progress en tiempo real

  ## ROI estimado
  | Métrica | Hoy | Con Aigent | Ahorro |
  | Días para cerrar | 11 | 4 | 7 días |
  | Overtime mensual | 80h | 10h | 70h × 12 = 840h/año |
  | Coste anual estimado | 42k€ | 6k€ | 36k€/año |

  ## Plan de implementación (12 semanas)
  S1-2: Discovery técnica y mapeo de sistemas
  S3-6: Configuración + integraciones
  S7-9: Migración + parallel run
  S10-12: Go-live + handover

  ## Pricing
  Plan Pro 36 meses: 4.500€/mes
  Setup one-time: 12.000€ (waived si firma en mayo)
  Total año 1: 66.000€ — payback ~7 meses

  ## Próximos pasos
  1. Demo técnica con vuestro stack (esta semana)
  2. Review legal del MSA (semana que viene)
  3. Firma objetivo: 30 de mayo
  ```

---

### `sales-enablement` — Sales Enablement

Pitch decks, playbooks, battle cards, guías de objeciones, casos de éxito.

**Caso de uso:** battle card contra competidor.

**Prompt:**
> "Battle card contra CompetitorX. Hemos perdido 3 de las últimas 8 deals contra ellos. Necesito el documento que el AE tenga en pantalla en discovery."

**Output esperado:**
- Ruta: `<proyecto>/sales/enablement/battle-card-competitorx.md`
- Estructura para un solo pager:
  ```markdown
  # Battle Card — Aigent vs CompetitorX

  ## TL;DR para el AE
  Ganamos en: time-to-value (8 sem vs 14), integraciones nativas con HubSpot,
  customer success dedicado en plan Pro.
  Perdemos cuando: precio sin descuento es 30% mayor, prospect lleva 5+ años
  con su stack actual, prospect quiere AI features que aún no tenemos.

  ## Sus fortalezas reales
  - Marca conocida, "nadie nunca fue despedido por elegir CompetitorX"
  - Catálogo de integraciones grande
  - Pricing visible en su web (transparencia)

  ## Nuestras fortalezas vs ellos
  | Factor | Nosotros | CompetitorX |
  | Time to first value | 8 semanas | 14 semanas |
  | Integración HubSpot | nativa | vía Zapier |
  | CSM dedicado plan Pro | sí | solo Enterprise |
  | Precio entry | desde 2.000€/mes | desde 1.400€/mes |
  | Compliance SOC 2 Type II | sí | sí |

  ## Preguntas que matan al competidor
  1. "¿Cuántas semanas tardasteis en ver vuestro primer cierre con CompetitorX?"
  2. "¿Quién es vuestro CSM dedicado allí?" (la respuesta suele ser nadie)
  3. "¿Cómo conectáis con HubSpot? ¿Cuánto cuesta el Zapier extra?"

  ## Objeciones típicas y respuestas
  **"CompetitorX es más barato."**
  → "El precio entry sí. Lo que cambia es lo que cuesta el primer año real
  con onboarding (incluido aquí, extra allí) y el coste de las integraciones
  vía Zapier. ¿Quieres que comparemos TCO?"

  **"Llevan 10 años en el mercado, vosotros 3."**
  → "Cierto. Por eso podemos tener un código sin la deuda de 10 años y
  añadir integraciones nativas modernas que ellos hacen vía middleware."

  ## Lo que NO decir
  - No vamos a hablar mal de ellos
  - No vamos a inventar features que no tenemos
  - No vamos a igualar pricing sin entender el TCO comparado
  ```

---

### `sales-crm` — Sales CRM

Pipeline review operativo, forecast formal, KPI dashboard, estructura de CRM.

**Caso de uso:** revisión semanal de pipeline.

**Prompt:**
> "Pipeline review de esta semana del equipo. Tenemos 22 deals activos. Quiero forecast con commit/best/worst y red flags."

**Output esperado:**
- Ruta: `<proyecto>/sales/crm/pipeline-review-2026-W19.md`
- Estructura:
  ```markdown
  # Pipeline Review — Semana 19 (May 8, 2026)

  ## Resumen
  22 deals activos · 1.85M€ total · Commit 380k€ · Best 720k€

  ## Health del pipeline
  🟢 Saludable: 14 deals (avanzan, fecha clara, stakeholder identificado)
  🟡 Atención: 5 deals (estancados 2+ semanas, falta info)
  🔴 Riesgo: 3 deals (no responde, cambio de stakeholder, deadline pasada)

  ## Deals a discutir esta semana

  ### 🔴 ACME Corp · 168k€ · close target 2026-05-30
  - Sin respuesta del CFO desde el 28 de abril
  - Champion (Head of Finance) ascendió y "ya no es su prioridad"
  - Acción acordada: AE pivota a nuevo champion, deadline 13 mayo

  ### 🟠 BetaPay · 95k€ · close target 2026-06-15
  - 3 reuniones en 4 semanas sin avanzar a propuesta
  - Posible "kicking the can" — discovery insuficiente
  - Acción acordada: pedir compromiso explícito o desqualificar

  ### 🟢 Datablend · 245k€ · close target 2026-05-22
  - Propuesta enviada el 5 mayo, feedback positivo
  - Esperan review legal del MSA
  - Acción: ETA del legal, sin presión

  ## Forecast del trimestre
  | Categoría | € | Probabilidad | Razonamiento |
  | Commit | 380k€ | ≥80% | 6 deals con verbal o LOI |
  | Best | 720k€ | 60-80% | + 5 deals avanzados sin verbal |
  | Worst | 380k€ | — | solo commit |

  ## Acciones del equipo
  | Owner | Acción | Deadline |
  | AE-Maria | Re-engage ACME con nuevo champion | 13 mayo |
  | AE-Juan | Cierre verbal de Datablend | 22 mayo |
  | SDR-Lia | Reactivar BetaPay con discovery v2 | 15 mayo |
  ```

---

## Skills

### `prospecting-list` — Tabla estructurada de prospectos

Investigación + hooks de personalización + campos por verificar.

Ver ejemplo en agente `sales-sdr` arriba.

---

### `outreach-sequence` — Cadencia multi-step de email/LinkedIn

Scripts y variables de personalización.

**Caso de uso:** secuencia para cold outreach.

**Prompt:**
> "Secuencia de outreach para heads of revops de la lista. 7 pasos en 21 días, mix email + LinkedIn. Tono profesional, no agresivo."

**Output esperado:**
- Ruta: `<proyecto>/sales/sequences/sequence-revops-iberia-q3.md`
- Cadencia:
  ```markdown
  # Outreach Sequence — RevOps Iberia Q3

  ## Variables de personalización
  - {first_name}, {company}, {stack_observado}, {hook_específico}

  ## Día 1 — Email 1 (Lunes 09:30)
  Asunto: "{first_name}, una pregunta de RevOps"
  Hola {first_name},
  Vi tu post de la semana pasada sobre {hook_específico} y me hizo pensar
  en un patrón que vemos en empresas como {company}: el time-to-attribution
  en stacks con {stack_observado}.
  ¿Te ha tocado pelearte con eso? Si te encaja, te mando en un email lo que
  hemos visto en 5 empresas similares.
  — [AE name]

  ## Día 3 — LinkedIn connect (sin nota o nota muy corta)

  ## Día 5 — Email 2 (Miércoles 09:30)
  Asunto: "RE: una pregunta de RevOps"
  Hola {first_name}, te dejo el dato:
  En 5 RevOps con {stack_observado} que vimos en 2025, el 67% reportaron
  que el dashboard de attribution les costaba 2-4h cada lunes.
  Si quieres, te paso cómo lo resolvieron 3 de ellos (15 min, sin pitch).

  ## Día 10 — LinkedIn voice note (30 segundos)

  ## Día 14 — Email 3 (Lunes 09:30)
  Asunto: "Un caso concreto que igual te encaja"
  ...(caso de éxito de empresa similar)...

  ## Día 18 — Email 4 (breakup polite)
  Asunto: "¿Tema cerrado por mi parte?"
  Hola {first_name}, sin respuesta es respuesta. Cierro mi ronda por aquí.
  Si te pasa eso del lunes con attribution, sabes dónde encontrarme.

  ## Día 21 — Cierre interno
  Marcar en CRM como "unresponsive" o "qualified for nurture"
  ```

---

### `account-intelligence` — Sales Intelligence sobre cuenta

Stack tech, pain points, mapeo de servicios, stakeholders, secuencia de venta, estimación del deal.

**Caso de uso:** prep antes de discovery con cuenta enterprise.

**Prompt:**
> "Tengo discovery con ACME Corp en 3 días. Necesito account intelligence: quiénes son, qué stack tienen, qué pain points públicos hay, quién decide y cuánto podría ser el deal."

**Output esperado:**
- Ruta: `<proyecto>/sales/intelligence/account-intelligence-acme-corp.md`
- Estructura:
  ```markdown
  # Account Intelligence — ACME Corp

  ## La empresa
  - SaaS B2B de gestión de inventario para retail mediano
  - 240 empleados, HQ Barcelona, oficinas en Lisboa y Milán
  - Funding: Series B 2024, ~$22M total raised
  - Customers públicos: 3 retail chains europeas grandes

  ## Stack tech observado
  - CRM: HubSpot (vía job postings)
  - Data: Snowflake + Looker (post de su VP Data)
  - Web stack: Next.js + TypeScript
  - Cloud: AWS (caso público con AWS Iberia)

  ## Pain points públicos
  - El CEO tuiteó en marzo: "growing pains de escalar revenue ops más rápido
    que la infraestructura interna"
  - 2 posts del Head of Finance sobre cierre contable lento
  - Job postings de RevOps abiertos desde febrero, no se llena

  ## Stakeholder map
  | Persona | Rol | Influencia | Interés | Posición |
  | Carlos M. | CFO | alta | alto | desconocida |
  | Marta R. | Head of RevOps | alta | alto | probable champion |
  | Pedro L. | CRO | media | medio | a investigar |
  | IT Director | aprobador técnico | media | bajo | suele rechazar |

  ## Mapeo de nuestros servicios al pain
  - Cierre contable lento → módulo de conciliación automática (core)
  - RevOps overhead → atribution dashboards (Pro+)
  - Escalado de ops → workflow engine (Pro+)

  ## Secuencia de venta sugerida
  1. Discovery con Marta (champion potencial)
  2. Pedir cita técnica con IT Director (validación stack)
  3. Demo customizada con caso de retail similar
  4. Pitch a CFO con ROI en lenguaje finance
  5. Cierre con Marta empujando internamente

  ## Estimación de deal
  Tamaño esperado: Plan Pro · 4-6k€/mes · 36 meses · ~150-220k€ ACV
  Ciclo esperado: 8-12 semanas dada complejidad y nº stakeholders
  Compite con: CompetitorX, NetSuite (overkill probable), in-house
  ```

---

### `sales-proposal` — Propuesta comercial completa

Ver ejemplo en agente `sales-ae` arriba.

---

### `pitch-deck` — Outline + script slide a slide

Para presentaciones en vivo.

**Caso de uso:** pitch deck para demo.

**Prompt:**
> "Pitch deck de 12 slides para nuestra demo standard de 30 min. Audiencia: heads of finance + IT director. Foco en conciliación automática como core."

**Output esperado:**
- Ruta: `<proyecto>/sales/enablement/pitch-deck-standard-demo.md`
- Outline + script:
  ```markdown
  # Pitch Deck — Standard Demo (30 min)

  ## Slide 1 — Hook (1 min)
  Visual: gráfico de "días de cierre" con línea descendente
  Script: "¿Cuántos días tarda vuestro equipo en cerrar el mes hoy?
  Pregunto porque he visto que en {industria} la media es 9. La buena
  noticia: en este momento, los mejores lo hacen en menos de 4."

  ## Slide 2 — El problema (3 min)
  Visual: diagrama de 4 sistemas + flecha caótica
  Script: "El problema no es vuestro equipo. Es que tenéis 4 sistemas que
  no se hablan: ERP, CRM, banco y hojas de cálculo de los responsables..."

  ## Slide 3 — Lo que cuesta (1 min)
  Visual: 3 números grandes: 40h overtime/mes · 11 días cierre · 0 visibilidad real-time

  ## Slide 4 — La solución en una frase (1 min)
  Visual: la frase grande
  "Conciliamos automáticamente vuestros 4 sistemas y os damos un único
  workflow de cierre auditable, con visibilidad real-time."

  ## Slide 5-9 — Demo en vivo del producto (15 min)
  ...

  ## Slide 10 — Casos de éxito (2 min)
  Visual: 3 logos + 1 quote prominente
  Script: "ACME Corp pasó de 11 a 4 días en 8 semanas. BetaPay reduce
  overtime 70% del equipo finance..."

  ## Slide 11 — Plan de implementación (3 min)
  Visual: timeline 12 semanas con hitos
  Script: "El plan es público. 12 semanas. Hitos cada 2. Si no se cumple,
  invocáis cláusula de salida."

  ## Slide 12 — Próximos pasos (4 min)
  Visual: 3 opciones (sandbox, deep-dive técnico, propuesta)
  Script: "Tres caminos posibles desde aquí, según cómo de listos os sintáis..."
  ```

---

### `objection-handler` — Guía de manejo de objeciones

Respuestas, preguntas de seguimiento, señales de excusa vs real.

**Caso de uso:** preparar al equipo para objeciones típicas.

**Prompt:**
> "Guía de objeciones para las 5 más frecuentes en nuestras demos: precio, timing, ya tienen herramienta, equipo no preparado, esperar a ver resultados de Q3."

**Output esperado:**
- Ruta: `<proyecto>/sales/enablement/objection-handler-top-5.md`
- Estructura por objeción:
  ```markdown
  ## Objeción 1: "Es caro"

  ### Posibles significados
  - Real: pricing fuera de budget asignado
  - Excusa: cubre "no veo el valor"
  - Negociación: probar descuento

  ### Cómo distinguir
  Pregunta: "¿Caro comparado con qué — el coste de no hacerlo, o con
  otra opción que estáis evaluando?"
  - Si responde "con otra opción" → real, sigue con TCO comparado
  - Si responde "con nuestro budget" → real, sigue con phased rollout
  - Si elude la pregunta → probablemente cubre "no veo el valor"

  ### Respuesta dirigida
  Si real-presupuestal: "Entiendo. Hay dos caminos: arrancamos con plan
  básico y crecemos, o miramos juntos qué partes vale la pena meter este
  año vs el siguiente."

  Si real-vs-competidor: "Comparémoslo en TCO al año, no en precio mensual.
  Aquí está incluido X que allí va a parte."

  Si cubre objeción de valor: "Antes de hablar de precio, ¿qué tendría
  que pasar en los próximos 90 días para que esto fuera obvio para ti?"

  ## Objeción 2: "No es buen momento"
  ...
  ```

---

### `sales-playbook` — Playbook del proceso comercial

ICP, etapas, scripts, framework de cualificación, métricas y onboarding de reps.

**Caso de uso:** playbook canónico para nuevos AEs.

**Prompt:**
> "Playbook completo del proceso comercial para onboardar a 3 AEs nuevos. Incluir ICP, etapas del pipeline con criterios de cambio, scripts clave, MEDDIC."

**Output esperado:**
- Ruta: `<proyecto>/sales/enablement/sales-playbook.md`
- Estructura completa:
  ```markdown
  # Sales Playbook

  ## 1. Quiénes somos como Sales
  Misión: vender solo donde hay match real. Filosofía: educar > convencer.

  ## 2. ICP
  ### Primary
  Empresas SaaS B2B 50-300 empleados, EBITDA positivo, con CFO senior y
  Head of Finance/RevOps consolidado, stack moderno (HubSpot/Salesforce + cloud).

  ### Secondary
  Marketplaces y eCommerce de tamaño similar con pain de finanzas operativas.

  ### Anti-ICP (no vender)
  - <50 empleados: pricing nuestro no encaja
  - Régimen contable USA-GAAP estricto sin SOC 2: legal pesado
  - Equipos finance externalizados (gestoría): no toman decisiones

  ## 3. Etapas del pipeline y criterios
  | Etapa | Criterio de entrada | Criterio de salida | Tiempo target |
  | Lead | nuevo, sin contactar | contactado y respuesta | 5 días |
  | Discovery | call agendada | pain + budget + autoridad confirmados | 14 días |
  | Evaluation | proposal enviada | verbal o LOI | 21 días |
  | Negotiation | verbal recibido | contrato firmado | 14 días |
  | Closed | firmado | onboarding kickoff | — |

  ## 4. Framework de cualificación: MEDDIC
  - M (Metrics): qué números mejorarán
  - E (Economic buyer): quién firma el cheque
  - D (Decision criteria): cómo decide la empresa
  - D (Decision process): qué pasos hay
  - I (Implications of pain): cuánto cuesta el problema
  - C (Champion): quién nos empuja internamente

  Sin Champion no se promueve a Evaluation.

  ## 5. Scripts clave
  ### Apertura discovery
  ### Pivote tras objeción de precio
  ### Cierre verbal

  ## 6. Métricas y SLAs
  - Tiempo de respuesta a lead nuevo: < 24h
  - Discovery → Proposal: ≥ 60%
  - Win rate vs CompetitorX: track separado
  - ACV objetivo: 80k€ Plan Pro

  ## 7. Onboarding del rep (4 semanas)
  S1: producto + ICP + shadow 3 discoveries
  S2: 5 cold calls observadas + first discovery propio
  S3: 3 discoveries propios + first proposal
  S4: ramp to full pipeline
  ```

---

### `discovery-call` — Script + framework BANT/MEDDIC

Debrief estructurado + red flags.

**Caso de uso:** preparar primera discovery.

**Prompt:**
> "Script de discovery call para ACME Corp. Tengo 45 minutos con su Head of RevOps. Quiero MEDDIC + 2 preguntas de implicaciones del pain."

**Output esperado:**
- Ruta: `<proyecto>/sales/calls/discovery-script-acme-corp.md`
- Bloque listo para tener delante:
  ```markdown
  # Discovery — ACME Corp · Marta R. · 45 min

  ## Objetivo de la call
  Confirmar pain real + presencia de los 6 vectores de MEDDIC.

  ## Estructura (45 min)
  0:00-2:00 — Setup: agradecer, fijar agenda, pedir permiso para grabar
  2:00-12:00 — Contexto: ellos hablan del estado actual
  12:00-25:00 — Profundización en pain + MEDDIC
  25:00-35:00 — Implicaciones: cuánto cuesta el problema
  35:00-42:00 — Próximos pasos posibles
  42:00-45:00 — Cierre y compromiso del siguiente paso

  ## Apertura (script)
  "Marta, gracias por la media hora. Antes de empezar, ¿te encaja si yo
  pregunto los primeros 20 minutos sobre vuestro proceso actual, luego
  los siguientes 15 yo te cuento lo que vemos típicamente y vemos si tiene
  sentido seguir? ¿Te importa si grabo solo para mi nota?"

  ## Preguntas — bloque de contexto
  1. "¿Cómo cerráis el mes hoy, paso a paso?"
  2. "¿Quién toca esos pasos? ¿Hay overlap o cada uno tiene un trozo?"
  3. "Si pudieras chasquear los dedos y arreglar UNA cosa de ese flujo,
      ¿cuál sería?"

  ## Preguntas — MEDDIC

  **M — Metrics**
  - "Si hicierais lo que estamos hablando, ¿qué métrica concreta tendría
    que moverse para que digáis 'mereció la pena'?"

  **E — Economic buyer**
  - "¿Cómo se aprueban decisiones de software de este tamaño en ACME?
    ¿Quién firma?"

  **D — Decision criteria**
  - "Si comparas opciones, ¿cómo decidís? ¿Por checklist técnico, por
    case study, por POC?"

  ## Preguntas — Implicaciones del pain
  - "¿Cuántas horas/persona/mes calculas que cuesta el cierre actual?"
  - "¿Qué decisiones os llegan tarde por no tener visibilidad real-time?"

  ## Red flags a escuchar
  - "No tengo budget asignado pero a ver" → no es economic buyer
  - "Mi jefe quiere que evalúe X" → falta autonomía
  - "Estamos viendo 5 opciones" → ciclo largo, baja conversión

  ## Debrief post-call (plantilla)
  - MEDDIC marcadas: M ___ E ___ D ___ D ___ I ___ C ___
  - Champion identificado: sí/no
  - Pain confirmado: sí/no
  - Próximo paso acordado: ___
  - Probabilidad subjetiva de cierre: ___%
  ```

---

### `pipeline-review` — Revisión operativa deal-by-deal

Weighted forecast, health flags, acciones acordadas.

Ver ejemplo en agente `sales-crm` arriba.

---

### `renewal-playbook` — Playbook de renovación

Health signals, timing, scripts por situación (🟢/🟡/🔴), concessions ladder.

**Caso de uso:** playbook formal de renovaciones.

**Prompt:**
> "Playbook de renovación para cuentas en plan Pro. Cubre los 3 escenarios: cuenta sana, cuenta con riesgo, cuenta hostil. Concessions ladder por escenario."

**Output esperado:**
- Ruta: `<proyecto>/sales/renewals/renewal-playbook.md`
- Estructura:
  ```markdown
  # Renewal Playbook — Plan Pro

  ## Timing
  - 120 días antes: health check formal con CSM
  - 90 días antes: kickoff de renovación
  - 60 días antes: propuesta de renovación enviada
  - 30 días antes: firma objetivo
  - 0: renovación efectiva

  ## Health signals (pre-conversación)
  | Indicador | Verde | Amarillo | Rojo |
  | DAU/MAU | >40% | 25-40% | <25% |
  | Sponsor original | activo | rotó hace <6m | rotó hace >6m |
  | Tickets soporte | 1-3/mes | 4-6/mes | >6/mes o ninguno |
  | QBR attendance | 2/2 últimos | 1/2 | 0/2 |
  | NPS último | ≥8 | 5-7 | ≤4 |

  ## 🟢 Cuenta sana
  Script: "Vamos a renovar en X. Nuestra recomendación es {plan} con
  ajuste de pricing del 6% por mejoras anuales. ¿Vemos también ampliar a
  feature Y que mencionasteis?"

  Concessions: ninguna por defecto. Si pelean precio: capar subida al 4%.

  ## 🟡 Cuenta con riesgo
  Script: "Antes de hablar de renovación quiero entender cómo estáis con
  {pain area observada}. Hablamos 30 min y luego decidimos."

  Concessions ladder:
  1. Freezar precio (sin subida)
  2. Añadir feature X sin cambio de plan
  3. Pagar trimestral en lugar de anual

  ## 🔴 Cuenta hostil
  Script: "Notamos que el uso bajó / los tickets subieron / no hay sponsor.
  Antes que renovación, hablamos de si esto sigue teniendo sentido para
  vosotros."

  Concessions ladder:
  1. Renovación 12 meses (no 36) con feature flag de salida
  2. Reducir a plan menor + custom support package
  3. Negotiated exit (perderlo bien)
  ```

---

### `forecasting-report` — Forecast formal del periodo

Commit/best/worst con metodología explícita, segmentación, win rates, riesgos.

**Caso de uso:** forecast Q3 para board.

**Prompt:**
> "Forecast formal del Q3 2026 para el board. Tenemos 22 deals abiertos. Necesito metodología explícita, segmentación por rep, win rates históricos."

**Output esperado:**
- Ruta: `<proyecto>/sales/crm/forecasting-report-q3-2026.md`
- Estructura board-ready:
  ```markdown
  # Q3 2026 Sales Forecast — Board Review

  ## Headline numbers
  | Categoría | € | vs Plan |
  | Commit | 1.150k€ | 96% |
  | Best case | 1.940k€ | 162% |
  | Worst case | 1.150k€ | 96% |
  | Plan Q3 | 1.200k€ | — |

  ## Metodología
  - Commit: deals con verbal o LOI firmada, close date ≤ end of Q3
  - Best: commit + deals avanzados sin verbal con probabilidad histórica >40%
  - Worst: solo commit
  - Probabilidades calibradas con histórico Q1-Q2 2026 (win rate 38% para
    stage Evaluation, 72% para Negotiation)

  ## Segmentación por rep
  | Rep | Commit | Best | Plan | Gap |
  | María | 420k€ | 720k€ | 400k€ | +5% |
  | Juan | 380k€ | 680k€ | 400k€ | -5% |
  | Lia | 350k€ | 540k€ | 400k€ | -12% |

  ## Segmentación por vertical
  - SaaS B2B: 65% del pipeline (consistente con Q1-Q2)
  - eCommerce: 20% (sub-representado vs plan 25%)
  - Otros: 15%

  ## Win rates históricos
  - Q1: 41% (n=23 cerrados de 56 entrados a Evaluation)
  - Q2: 39% (n=21 de 54)
  - YTD: 40% — usado para calibrar Best

  ## Riesgos al forecast
  - 3 deals 🔴 representan 280k€ del Best. Si caen, Best → 1.660k€.
  - Ciclo medio creció a 64 días (vs 55 días Q1). Algunos deals que
    parecen Q3 pueden resbalar a Q4.

  ## Reconciliación bottom-up vs top-down
  Top-down (cuota plan): 1.200k€
  Bottom-up (deals): commit 1.150k€
  Gap: 50k€, dentro de buffer aceptable.
  ```

---

## Skills compartidas usadas en este dept

- `case-study` (shared) — Para casos de éxito de cliente. Consumida por `sales-enablement`. Ver ejemplo en `_shared/README.md`.
- `kpi-dashboard` (shared) — Para dashboards de KPIs comerciales. Consumida por `sales-crm`. Ver `_shared/README.md`.
- `stakeholder-map` (shared) — Para mapear decisores en deals enterprise. Consumida por `sales-ae`. Ver `_shared/README.md`.

---

## Flujo end-to-end típico

```
1. sales-sdr      → prospecting-list + outreach-sequence
2. sales-sdr      → account-intelligence (cuenta avanzada)
3. sales-ae       → discovery-call (script + debrief MEDDIC)
4. sales-ae       → sales-proposal (tras discovery exitoso)
5. sales-enablement → pitch-deck si demo intermedia + objection-handler
6. sales-crm      → pipeline-review semanal
7. sales-crm      → forecasting-report trimestral
8. sales-ae       → renewal-playbook (12 meses después del cierre)
```
