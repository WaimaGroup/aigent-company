# `_shared/` — Casos de uso

> Ejemplos prácticos de uso de los agentes transversales y las skills compartidas que viven en `.aigent/departments/_shared/`.
>
> Para visión general del repo, ver [`.aigent/README.md`](../../README.md).

> **Recordatorio.** `_shared/` es solo organización del repo: no es namespace runtime. Los agentes que viven aquí llevan prefijo `shared-` en su nombre canónico; las skills compartidas se referencian directamente por su nombre (sin prefijo).

---

## Cómo se invoca

Los agentes y skills de `_shared/` están disponibles para cualquier departamento. Se invocan:

1. **Desde un orquestador de dept**: cuando la tarea aplica transversalmente (ej. el orquestador de Sales delega un caso de éxito a `sales-enablement`, que invoca la skill `shared-case-study`).
2. **Directamente al agente transversal**: para tareas que no pertenecen a un dept específico (ej. PRD inicial → `shared-prd-agent`; crear skill nueva → `shared-skill-builder`).
3. **Skill directa**: cuando ya sabes que necesitas un OKR set, una stakeholder map, etc.

---

## Agentes transversales

### `shared-prd-agent` — PRD Capturing & Writing

Captura de requisitos y redacción de PRDs estructurados, optimizado para humanos y agentes IA. Sirve a cualquier dept.

**Caso de uso:** PRD inicial para feature nueva.

**Prompt:**
> "Quiero un PRD para nuestra nueva feature de 'export de reportes a CSV/Excel'. Pedida por 4 clientes enterprise. Aún no tenemos toda la información — guíame con las preguntas."

**Output esperado:**
- Ruta sugerida: `.context/<proyecto>/<dept>/prd.md` o, si es transversal, `<proyecto>/prds/prd-export-reports.md`
- El agente PRIMERO hace una entrevista estructurada (5-10 preguntas) si falta info crítica. DESPUÉS produce el PRD:
  ```markdown
  # PRD — Export de reportes a CSV/Excel

  - Owner: <PM asignado>
  - Estado: Draft → In review → Approved
  - Fecha: 2026-05-14
  - Audiencia del PRD: producto, eng, design, GTM

  ## 1. Problema
  4 clientes enterprise (ACME, BetaPay, Datablend, GammaSoft) han pedido en
  últimos 3 meses exportar reportes a CSV/Excel para meterlos en BI propio.
  Hoy hacen screenshot → pegar → reformatear → analizar (~4-6h/mes/cliente).

  ## 2. Por qué ahora
  Estos 4 clientes representan 280k€ ARR. Dos lo han condicionado a renovación.
  Aigent ya tiene reporting interno fuerte; el gap es el bridge a BI ajeno.

  ## 3. Audiencia y JTBD
  - Heads of finance que usan dashboards externos (Looker/Tableau/Metabase)
  - JTBD: "Cuando termino el cierre, quiero llevarme los números al BI
    de la empresa para analizar tendencias con el resto del data team."

  ## 4. Hipótesis
  Si añadimos export con configuración de columnas, entonces el uso del
  módulo de reporting subirá ≥ 30% en cuentas enterprise.

  ## 5. Solución propuesta (alto nivel)
  - Botón "Export" en cabecera de reporte
  - Modal: selección columnas + formato (CSV/XLSX)
  - >5k filas → email con link (background job)
  - Histórico 30 días de exports

  ## 6. Métricas de éxito
  - Primaria: uso del módulo +30% en enterprise (M+3)
  - Secundaria: 30% cuentas enterprise activan export (M+1)
  - Guardrail: NPS módulo reporting ≥ 0

  ## 7. Out of scope (explícito)
  - Schedule recurrente
  - Export directo a Google Sheets / BI
  - Reportes custom (otra feature)

  ## 8. Open questions
  - [Q1] ¿Permisos por rol o solo admin? — pendiente confirmar con CS
  - [Q2] ¿Quota de exports por plan? — finance evaluará
  - [Q3] ¿Encoding UTF-8 BOM por defecto? — decisión de eng

  ## 9. Stakeholders
  Sponsor: VP Product · Eng owner: TBD · Design: TBD · GTM contact: CS
  ```

---

### `shared-skill-builder` — Skill Builder

Crear, auditar y configurar skills v1 prosa o v2 ejecutables. Cinco modos: `create-v1`, `create-v2`, `configure`, `audit`, `add-action`.

**Caso de uso:** crear skill v2 ejecutable nueva.

**Prompt:**
> "Quiero una skill v2 ejecutable para Slack: 4 acciones (list-channels, post-message, list-users, get-user). Auth: Bot token via env var. Documenta el setup completo."

**Output esperado:**
- Ruta: `.aigent/departments/operations/skills/slack/SKILL.md` (o donde encaje según `shared-skill-scaffold` §"Decidir ubicación")
- Estructura del SKILL.md generado:
  ```markdown
  ---
  name: "slack"
  version: "0.1.0"
  description: >
    Skill ejecutable contra la API de Slack. Cubre lectura de canales y
    usuarios, y publicación de mensajes. Bot token via env var.
  runtime: engine-v2

  config:
    base_url:
      type: string
      required: true
      path: tools.slack.base_url
      description: "URL base de la API Slack. Default: https://slack.com/api"

  secrets:
    - name: SLACK_BOT_TOKEN
      required: true
      description: "Bot token de la app de Slack. Cómo obtenerlo: https://api.slack.com/apps"

  actions:
    list-channels:
      description: "Lista canales públicos del workspace"
      impl: { type: http, ref: "list-channels" }
      inputs:
        limit:
          type: integer
          required: false
          default: 100
      output:
        type: json

    post-message:
      description: "Publica un mensaje en un canal"
      impl: { type: http, ref: "post-message" }
      inputs:
        channel:
          type: string
          required: true
        text:
          type: string
          required: true
      output:
        type: json
  # ... resto de acciones ...
  ---

  # Skill: Slack
  Skill ejecutable contra la API REST de Slack. Cubre canales, mensajes y usuarios.

  **Requisitos:**
  - `.context/config.json` con `tools.slack.base_url` (default https://slack.com/api)
  - Env var `SLACK_BOT_TOKEN` definido

  ## Antes de ejecutar (precheck para el agente caller)
  Antes de invocar `run`, ejecuta:
  ```bash
  node .aigent/v2/engine/engine.cjs doctor slack
  ```
  Si `data.skills[0].ready === false` → flujo de configuración (delegar en
  `shared-skill-builder configure`).

  **Secrets nunca por chat.** Si falta el token, el usuario edita
  `.context/.secrets.json` con su valor (placeholder pre-creado por
  `prepare-secrets`).

  ## Acciones
  ### list-channels
  ```http name="list-channels"
  GET {{config.base_url}}/conversations.list?limit={{inputs.limit}}
  Authorization: Bearer {{secrets.SLACK_BOT_TOKEN}}
  ```

  ### post-message
  ```http name="post-message"
  POST {{config.base_url}}/chat.postMessage
  Authorization: Bearer {{secrets.SLACK_BOT_TOKEN}}
  Content-Type: application/json

  {
    "channel": "{{inputs.channel}}",
    "text": "{{inputs.text}}"
  }
  ```
  ```
- Tras escribir el SKILL.md, el builder ejecuta `engine.cjs validate slack` y reporta `ok: true` antes de cerrar.

---

## Skills meta (para construir el sistema)

### `shared-skill-scaffold` — Plantilla canónica para crear skill

Cubre v1 prosa y v2 ejecutable en un solo SKILL.md. La invoca `shared-skill-builder`.

**Caso de uso:** crear skill v1 prosa para un dept.

**Prompt:** (lo recibe `shared-skill-builder`)
> "Quiero skill v1 prosa `meeting-notes` en operations. Entregable: archivo .md estructurado con asistentes, agenda, decisiones, action items y próximos pasos."

**Output esperado:**
- Ruta: `.aigent/departments/operations/skills/meeting-notes/SKILL.md`
- El builder usa `shared-skill-scaffold` como template y produce:
  ```markdown
  ---
  name: "meeting-notes"
  description: >
    Skill for producing structured meeting notes (.md) with attendees,
    agenda, decisions, action items and next steps.
  ---

  # Skill: Meeting Notes

  **Entregable:** archivo `.md` en `<proyecto>/operations/meetings/<date>-<topic>.md`

  ## Cuándo usar esta skill
  - Reunión con decisiones o action items concretos
  - Reunión de coordinación cross-team

  **Cuándo NO usar:**
  - 1:1s (ver `one-on-one-framework` en HR)
  - Brainstorm sin decisiones — usar formato libre

  ## Información a recopilar
  | Campo | Pregunta |
  | Title | ¿Tema/objetivo de la reunión? |
  | Fecha | YYYY-MM-DD |
  | Asistentes | Quiénes (con rol) |
  | Agenda | ¿Bullet points o adjunto? |

  ## Plantilla del entregable
  ```markdown
  # <Title> — YYYY-MM-DD
  - Asistentes: ...
  - Owner del meeting: ...
  ## Agenda
  ## Decisiones
  ## Action items
  | Owner | Acción | Fecha |
  ## Próximos pasos
  ```

  ## Proceso
  1. Recopilar info
  2. Generar el .md
  3. Guardar en la ruta
  4. Comunicar al usuario

  ## Restricciones
  - No incluir info confidencial sin marcado
  - Aplican reglas de output de _shared/output-rules.md
  ```

---

### `agent-scaffold` — Plantilla canónica para crear o auditar agentes

Modos: `create-specialist`, `create-shared`, `create-stub`, `audit`.

**Caso de uso:** crear agente especialista nuevo (cuando un dept lo demanda).

**Prompt:**
> "Crea agente `operations-suppliers` (especialista de operations). Cuándo delegarle: gestión de proveedores externos, contratos operativos, evaluación, renegociación."

**Output esperado:**
- Ruta: `.aigent/departments/operations/agents/operations-suppliers.md`
- Estructura generada siguiendo §5 de conventions:
  ```markdown
  ---
  name: "[Operations] Suppliers"
  description: >
    Supplier management specialist. Use me when you need: vendor evaluation,
    contract negotiation with operational suppliers, supplier scorecards,
    renewal/exit strategy with suppliers, supplier risk assessment.
  ---

  ## Rol
  Eres el especialista en **gestión de proveedores** del departamento de
  Operations. Tu misión es...

  ## Principios fundamentales
  - **Performance over loyalty**: el supplier merece relación si entrega valor
  - **Diversificar criticidad**: no depender de un único supplier para X
  - **Auditoría continua**: scorecard trimestral, no solo al renovar
  - **Salida planeada**: cada supplier tiene un exit plan documentado
  - **Coste total, no precio**: TCO incluye implementación, switching, riesgo

  ## Proceso de trabajo
  ### Cuando recibes una petición de gestión de supplier:
  1. Clarifica...
  ...

  ## Skills disponibles
  | Skill | Cuándo usarla |
  | (skills futuras) | ... |

  ## Restricciones
  - No negociar sin aprobación de owner
  - No firmar contratos
  - Aplican reglas de output de _shared/output-rules.md
  ```
- El builder verifica checklist estructural antes de cerrar.

---

## Skills business compartidas

### `competitive-analysis` — Análisis competitivo

Matriz comparativa estructurada con whitespace y threat assessment.

**Caso de uso:** análisis competitivo previo a roadmap.

**Prompt:** (desde `marketing-planning` o `product-strategy-roadmap`)
> "Análisis competitivo para nuestro mercado de SaaS financiero B2B. Competidores principales: CompetitorX, NetSuite, in-house. Foco: identificar whitespace para Q3."

**Output esperado:**
- Ruta: `<proyecto>/<dept>/strategy/competitive-analysis-q3-2026.md`
- Estructura:
  ```markdown
  # Competitive Analysis — SaaS Financiero B2B · Q3 2026

  ## Resumen ejecutivo
  3 competidores principales. Whitespace identificado en time-to-value y
  experience del módulo bancario. Threat principal: NetSuite añadiendo
  features mid-market.

  ## Matriz comparativa
  | Dimensión | Aigent | CompetitorX | NetSuite | In-house |
  | Time to first value | 8 sem | 14 sem | 20 sem | ∞ |
  | Integraciones HubSpot | nativa | Zapier | nativa | varia |
  | Pricing entry | 2.000€/mes | 1.400€ | 4.000€ | infra+dev |
  | CSM dedicado Pro | sí | enterprise | enterprise | n/a |
  | SOC 2 Type II | sí | sí | sí | varía |
  | AI Insights | beta | no | roadmap | no |
  | Multi-currency | roadmap Q4 | sí | sí | varía |

  ## Threat assessment
  | Competidor | Severidad | Razón | Mitigación |
  | NetSuite | 🟠 Major | Pricing bajando, mid-market focus | Diferenciar en TTV |
  | CompetitorX | 🟡 Minor | Pricing menor pero gap en integraciones | Mantener narrativa TCO |
  | In-house | 🔵 Nit | Solo en empresas grandes y reluctantes a SaaS | n/a |

  ## Whitespace identificado
  1. **Multi-currency** — todos lo tienen menos nosotros (gap Q4 obligatorio)
  2. **AI Insights** — nadie tiene oferta seria → mantener ventaja Q3
  3. **Experience módulo bancario** — todos lo tienen "técnico", nadie "elegante"

  ## Implicaciones para roadmap
  - Q3: doblar inversión en AI Insights (ventaja se cierra rápido)
  - Q4: cerrar gap multi-currency
  - Q1 2027: re-imaginar módulo bancario como diferenciador
  ```

---

### `case-study` — Caso de éxito de cliente

Problema → solución → resultados medibles + citas verbatim.

**Caso de uso:** case study para marketing/sales.

**Prompt:** (desde `marketing-creative` o `sales-enablement`)
> "Case study de ACME Corp. Pasaron de 11 a 4 días en el cierre. Tengo 2 entrevistas hechas con CFO y Head of Finance. Audiencia: heads of finance de SaaS B2B."

**Output esperado:**
- Ruta: `<proyecto>/marketing/case-studies/case-study-acme-corp.md`
- Estructura:
  ```markdown
  # Case Study: ACME Corp — De 11 a 4 días en cerrar el mes

  ## TL;DR
  ACME Corp redujo su cierre contable de 11 a 4 días en 8 semanas
  implementando Aigent. Liberó 70 horas/mes del equipo finance.

  ## La empresa
  ACME Corp · SaaS B2B de gestión de inventario · 240 empleados ·
  HQ Barcelona · Customers en 8 países europeos.

  ## El problema
  "Tardábamos 11 días en cerrar el mes y siempre llegábamos tarde al board.
  El equipo hacía overtime cada primer viernes." — Marta R., CFO

  Concretamente:
  - 4 hojas de cálculo viviendo en cadenas de email
  - Conciliación bancaria manual con extractos de 3 bancos
  - Visibilidad del progreso real → solo en cabeza del Head of Finance

  ## La solución
  Implementaron Aigent Plan Pro con:
  - Conciliación automática multi-banco (1 día de setup)
  - Workflow de cierre con sign-off por owner
  - Dashboard de progreso accesible para CFO + leadership

  Timeline: 8 semanas. Champion interno: Head of Finance.

  ## Los resultados (medibles)
  | Métrica | Antes | Después | Delta |
  | Días para cerrar | 11 | 4 | -64% |
  | Overtime mensual | 80h | 10h | -88% |
  | Visibilidad cierre | retrospectiva | real-time | — |
  | NPS interno finance | 4 | 8 | +4 |

  ## Citas verbatim
  "El primer mes ya fueron 6 días. El tercero, 4. Pero lo importante no es
  el número: es que ahora puedo decir el día 5 al CEO 'esto va bien' con
  evidencia." — CFO

  "Mi equipo ya no llora el primer viernes." — Head of Finance

  ## Lo que NO contamos
  - Las 2 semanas de pelea con la migración de la herramienta anterior
  - 1 incidente de duplicación de transacciones en la primera concil. auto
  - Que el setup requirió IT más tiempo del estimado

  > Esta sección no se publica. Existe para mantener honestidad interna.

  ## Próximos pasos para ACME
  Evaluando módulo de forecasting (Q3 2026).
  ```

---

### `kpi-dashboard` — Dashboard de KPIs

Métricas × target × variance × tendencia × commentary.

**Caso de uso:** dashboard mensual de un dept.

**Prompt:** (desde `finance-reporting`, `marketing-planning`, `product-metrics` o `sales-crm`)
> "KPI dashboard mensual del dept de Sales para revisión con CEO. Métricas: ARR, MRR, churn, win rate, ciclo de venta, CAC."

**Output esperado:**
- Ruta: `<proyecto>/sales/crm/kpi-dashboard-2026-05.md`
- Estructura:
  ```markdown
  # Sales KPI Dashboard — Mayo 2026

  ## Headline
  Mes sólido: ARR +5.2% vs plan, win rate estable en 39%, ciclo de venta
  bajando ligeramente. CAC mejorando por mejor mix de canales.

  ## KPIs
  | Métrica | Mayo | Target | Variance | Tendencia 6m |
  | ARR (M€) | 11.2 | 10.65 | +5.2% | ↑↑↑↑→↑ |
  | New MRR (k€) | 215 | 200 | +7.5% | ↑↓↑→↑↑ |
  | Churn $ (k€) | 28 | 35 | -20% | ↓↓→↓→↓ |
  | NRR (%) | 113% | 110% | +3pp | ↑→↑↑↑↑ |
  | Win rate (%) | 39% | 38% | +1pp | →↑↑→→→ |
  | Ciclo venta (días) | 56 | 60 | -4 | →↓↓→↓→ |
  | CAC (€) | 1.150 | 1.200 | -4.2% | →↓↑→↓↓ |
  | CAC payback (m) | 9 | 10 | -1 | ↑↓→↑↓→ |

  ## Commentary
  - **ARR:** segundo mes consecutivo por encima del 5% del plan. Sostenible
    si nuevos hires de SDR ramping en H2.
  - **Churn $:** mejora reciente atribuible a programa de health-check
    en plan Pro lanzado en Q1. Mantener observación.
  - **Ciclo de venta:** primera vez bajo 60 días en 4 meses. Hipótesis:
    discovery más cualificada con MEDDIC.
  - **CAC:** ahorro real, no contable. Canal LinkedIn afinó targeting.

  ## Anomalías a investigar
  - **NRR top decile:** subió de 145% a 168%. Verificar concentración.
  - **Win rate por vertical:** SaaS B2B 44%, eCommerce 28% — gap creciente.
  ```

---

### `stakeholder-map` — Mapa de stakeholders

Influencia × interés × posición × plan de engagement.

**Caso de uso:** deal enterprise con múltiples stakeholders.

**Prompt:** (desde `sales-ae`, `product-discovery`, `legal-risk` o `marketing-planning`)
> "Stakeholder map para el deal con ACME Corp. He identificado 5 personas con peso. Necesito influencia × interés × posición × plan."

**Output esperado:**
- Ruta: `<proyecto>/sales/intelligence/stakeholder-map-acme-corp.md`
- Estructura:
  ```markdown
  # Stakeholder Map — ACME Corp

  ## Matriz
  | Stakeholder | Rol | Influencia | Interés | Posición |
  | Carlos M. | CFO | 🔴 alta | 🟡 medio | 🟡 neutral |
  | Marta R. | Head of RevOps | 🟠 alta | 🔴 alto | 🟢 champion |
  | Pedro L. | CRO | 🟡 media | 🟡 medio | ⚪ desconocida |
  | Ana T. | IT Director | 🟡 media | 🟢 bajo | 🟠 reluctante |
  | Luis B. | CEO | 🔴 alta | 🟢 bajo | ⚪ desconocida |

  ## Plan de engagement

  ### Marta R. (Champion potencial)
  - Estado: ya conectada, aliada
  - Plan: cargarla de munición (ROI calc, references), proteger relación
  - Cadencia: 1 call/sem mientras el deal está activo

  ### Carlos M. (CFO, economic buyer)
  - Estado: contactado 1 vez, sin reacción fuerte
  - Plan: pedir reunión específica con ROI traducido a su language
  - Riesgo: si dice no, deal probablemente muere
  - Owner: AE + Marta empujando internamente

  ### Pedro L. (CRO, influence lateral)
  - Estado: no contactado
  - Plan: pedir intro vía Marta o Carlos
  - Por qué: validador potencial, podría ser blocker en process

  ### Ana T. (IT Director, blocker técnico potencial)
  - Estado: por contactar
  - Plan: reunión técnica con foco en SOC 2 + integraciones + permisos
  - Riesgo: típicamente bloquea por defecto; preparar evidencia

  ### Luis B. (CEO)
  - Estado: desconocido, no se involucra hasta cifras finales
  - Plan: no contactar directamente; Marta + Carlos lo subirán

  ## Plan de comunicación
  - Updates semanales a Marta (champion brief)
  - Email cada 2 sem a Carlos con value summary
  - Reunión técnica con Ana semana 3
  - Si Pedro entra: visión de equipo cross-functional
  ```

---

### `risk-matrix` — Matriz de riesgos

Probabilidad × impacto × mitigación × owner.

**Caso de uso:** matriz para acompañar un ADR.

**Prompt:** (desde `software-architecture`, `legal-risk`, `finance-budgeting` o `product-strategy-roadmap`)
> "Matriz de riesgos para el ADR de migración a microservicios. Identifica los 6-8 riesgos principales con probabilidad, impacto, mitigación y owner."

**Output esperado:**
- Ruta: `<proyecto>/software/architecture/risk-matrix-microservices-migration.md`
- Estructura:
  ```markdown
  # Risk Matrix — Microservices Migration

  - Contexto: ADR-009 Migración a microservicios
  - Fecha: 2026-05-14
  - Owner principal: CTO

  ## Matriz
  | # | Riesgo | Prob | Impacto | Score | Owner | Mitigación |
  | 1 | Distributed transactions causan inconsistencias | 🔴 alta | 🔴 alto | 9 | CTO | Saga pattern + outbox, training |
  | 2 | Latencia red entre servicios degrada UX | 🟠 media | 🔴 alto | 6 | Infra Lead | Co-location en mismo VPC + cache |
  | 3 | Coste operacional crece (más infra a gestionar) | 🔴 alta | 🟡 medio | 6 | CFO + CTO | Plan capacidad detallado + alertas |
  | 4 | Equipo no preparado para distributed systems | 🟠 media | 🔴 alto | 6 | Eng Manager | Training + hire 1 Staff con experiencia |
  | 5 | Visibilidad/debugging cae con la migración | 🟠 media | 🟠 alto | 6 | Infra Lead | Distributed tracing antes de migrar |
  | 6 | Migración tarda más del plan (sprint creep) | 🟠 media | 🟠 medio | 4 | CTO | Strangler fig pattern + milestones |
  | 7 | Security surface area crece | 🟡 baja | 🔴 alto | 3 | Security | Service-to-service auth obligatoria |
  | 8 | Cliente percibe degradación durante migración | 🟡 baja | 🟠 medio | 2 | PM | Feature flags + canary rollout |

  ## Heat map
  ```
                  Impacto bajo  medio  alto
  Prob alta       —           #3     #1
  Prob media      —           #6     #2 #4 #5
  Prob baja       —           #8     #7
  ```

  ## Riesgos top 3 a vigilar
  1. **#1 Distributed transactions** — diseño desde día 1
  2. **#3 Coste operacional** — visibilidad financiera mensual
  3. **#4 Equipo no preparado** — hire + training acometido en Q2
  ```

---

### `okr-set` — OKRs estructurados

1-3 Objetivos + 2-4 Key Results cuantitativos por ciclo + scoring final.

**Caso de uso:** OKRs trimestrales de un dept.

**Prompt:** (desde `product-metrics`, `hr-evaluation` o `marketing-planning`)
> "OKRs Q3 2026 del equipo de producto. Tema del trimestre: convertir el módulo de conciliación en categoría propia."

**Output esperado:**
- Ruta: `<proyecto>/product/metrics/okrs-q3-2026.md`
- Estructura:
  ```markdown
  # OKRs Q3 2026 — Product Team

  ## O1 — Convertir el módulo de conciliación en categoría propia
  ### Por qué
  Nuestro pain principal según research es la conciliación. Si dejamos
  de ser "una pieza" y pasamos a ser "la herramienta de conciliación",
  el TAM y el posicionamiento cambian.

  ### KRs
  | KR | Baseline | Target | Actual EOQ | Score |
  | KR1.1 — Usuarios activos del módulo conciliación | 380 | 720 | TBD | 0-1 |
  | KR1.2 — Time to first successful reconciliation (mediana) | 14 días | 3 días | TBD | 0-1 |
  | KR1.3 — NPS del módulo (subsample) | 6 | 8+ | TBD | 0-1 |
  | KR1.4 — Cuentas que mencionan "conciliación" en discovery sales | 12% | 35% | TBD | 0-1 |

  ## O2 — Construir AI Insights como ventaja sostenible
  ### Por qué
  Beta cerrada va bien pero la ventana competitiva es estrecha. Q3
  decide si entramos al mercado con autoridad.

  ### KRs
  | KR | Baseline | Target | Actual EOQ | Score |
  | KR2.1 — Adoption en cuentas paying (M+1 post GA) | 0 | 30% | TBD | 0-1 |
  | KR2.2 — Menciones en prensa SaaS / blogs | 0 | 50 | TBD | 0-1 |
  | KR2.3 — Win rate con AI mentioned en discovery | n/a | 50% | TBD | 0-1 |

  ## O3 — Reducir time-to-first-value de 12 a 6 semanas
  ### Por qué
  Las cuentas que activan en <8 semanas tienen retención M12 de 92%
  vs 56%. Bajar TTV ataca churn estructuralmente.

  ### KRs
  | KR | Baseline | Target | Actual EOQ | Score |
  | KR3.1 — TTV mediano nuevas cuentas | 12 sem | 6 sem | TBD | 0-1 |
  | KR3.2 — Activation rate día 30 | 38% | 55% | TBD | 0-1 |

  ## Calibración OKR
  - 3 Objetivos, 9 KRs total → al borde del límite (≤10 recomendado)
  - Cada O tiene KRs de output (no actividades)
  - Stretch declarado: O2 KR2.2 (menciones prensa) es stretch
  - Confidence inicial: 0.5 todos los KRs (típico al empezar Q)

  ## Cadencia de review
  - Weekly: ownership por KR check-in en standup product
  - Monthly: review formal con leadership
  - End-of-Q: scoring 0-1 por KR + retrospectiva
  ```

---

### `journey-map` — Customer Journey

Fases × acciones × pensamientos × emociones × pain points × oportunidades × touchpoints.

**Caso de uso:** journey actual + propuesto post-rediseño.

**Prompt:** (desde `design-ux-research` o `product-discovery`)
> "Journey map del onboarding actual de un nuevo cliente enterprise. 4 fases: signup, primera semana, primer mes, primer trimestre."

**Output esperado:**
- Ruta: `<proyecto>/design/ux-research/journey-map-onboarding-enterprise.md`
- Estructura:
  ```markdown
  # Journey Map — Onboarding Enterprise (actual)

  ## Fase 1: Signup (día 0-1)
  ### Acciones
  Recibe enlace post-firma · Click · Setup cuenta · Invita primer admin
  ### Pensamientos
  "¿Y ahora qué?" · "¿Cuánto va a tardar esto?"
  ### Emociones
  🙂 expectativa, 😐 incertidumbre
  ### Pain points
  - Email post-firma genérico, no personalizado al deal
  - Setup pregunta cosas que el contrato ya tiene
  ### Oportunidades
  - Personalización email con contexto del deal
  - Pre-poblado de datos conocidos
  ### Touchpoints
  Email de bienvenida · Plataforma · CSM (silencioso aún)

  ## Fase 2: Primera semana (día 1-7)
  ### Acciones
  Define equipo · Configura permisos · Conecta primera fuente (banco/CRM) ·
  Hace primer report
  ### Pensamientos
  "Esto es más complejo de lo que esperaba" · "¿A quién pregunto?"
  ### Emociones
  😟 frustración · 🙏 esperanza condicionada
  ### Pain points
  - Permisos confusos (¿qué puede ver cada rol?)
  - Connector bancario falla la primera vez (auth flow nuevo)
  - Documentación del CSM llega day 5 (tarde)
  ### Oportunidades
  - Wizard de permisos con defaults sensatos
  - Mejor UX del connector bancario (paso 3 del onboarding fail rate 18%)
  - CSM proactivo en día 2, no día 5
  ### Touchpoints
  Plataforma · Docs · CSM · Soporte · Slack interno cliente

  ## Fase 3: Primer mes (día 7-30)
  ### Acciones
  Primer cierre con Aigent · Comparación con proceso viejo · Decisión de
  rollout total o piloto extendido
  ### Pensamientos
  "Funciona pero... ¿es por nosotros o por la herramienta?" ·
  "¿Vale la pena meterse a fondo o esperar al siguiente trimestre?"
  ### Emociones
  🤔 evaluación · 😌 alivio si fue bien · 😤 frustración si fue regular
  ### Pain points
  - QBR llega al final, no a mitad → falta visibilidad ejecutiva
  - Métricas de éxito (TTV, satisfaction) no se comparten back to cliente
  ### Oportunidades
  - Check-in formal día 15 con métricas
  - Casos similares de éxito como benchmark
  ### Touchpoints
  Plataforma · CSM (call recurrente) · Soporte · QBR end-of-month

  ## Fase 4: Primer trimestre (día 30-90)
  ### Acciones
  Adopción full · Casos edge aparecen · Primer release con cambios visibles ·
  Posible expansión a otros equipos
  ### Pensamientos
  "Esto es ya mi herramienta" · "¿Qué más puedo hacer?"
  ### Emociones
  😊 confianza · 🤩 entusiasmo si hubo wins claros
  ### Pain points
  - Falta visibilidad de roadmap → no sabe cuándo viene lo que pidió
  - Cambios de plataforma sin avisar al usuario (release notes débiles)
  ### Oportunidades
  - Public roadmap con cuentas
  - Release notes target audience (no devs)
  ### Touchpoints
  Plataforma · CSM · Comunidad · Producto (release notes)

  ## Síntesis cross-fase
  ### Top 3 oportunidades sistémicas
  1. CSM proactivo en día 2 (no día 5)
  2. UX del connector bancario en fase 1
  3. Métricas/benchmarks compartidos en cierres del mes

  ### Pain crónico
  Visibilidad: cliente nunca sabe del todo "dónde estamos" en su propio
  onboarding. Resolverlo con dashboard de onboarding compartido.
  ```

---

### `deploy-checklist` — Checklist pre/durante/post-deploy

Adaptado a riesgo (🟢/🟡/🟠/🔴) y a estrategia (instant/canary/blue-green/progressive). Hoy lo consume `software-architecture` y `software-coding`; mañana también devops cuando se active.

Ver ejemplo en [`software/README.md`](../software/README.md) — sección "Skill compartida usada en este dept".

---

## Skills utility compartidas

> Utilidades técnicas con script propio (Node, sin dependencias) que **cualquier agente** puede usar. A diferencia de las business-skills, en general **no las pides por su nombre**: el sistema las activa solo cuando hacen falta. Se documentan aquí por transparencia, para que sepas qué ocurre por detrás.

### `shared-office-writer` — entregar en Word (.docx) y Excel (.xlsx)

Convierte un entregable en un fichero de Office de verdad, listo para abrir en Word/Excel (o LibreOffice). No hay que instalar nada.

Por defecto los entregables salen en `.md` (texto plano). Si lo quieres en Word o Excel, **solo tienes que pedirlo en lenguaje normal**:

> "El plan de marketing Q3, pero dámelo en Word."

> "Pásame la tabla de presupuesto a Excel, con una columna de totales."

> "Quiero el resumen de KPIs como hoja de Excel, con la cabecera en negrita."

Qué sabe hacer hoy: **docx** con títulos, párrafos, negrita/cursiva/subrayado y tablas; **xlsx** con varias hojas, texto, números, fechas, fórmulas, ancho de columna y fila de cabecera en negrita. Qué **no** hace (todavía): imágenes, logos, gráficos, colores de celda, bordes a medida. Si necesitas algo de eso, dilo y se valora caso a caso.

### `shared-base64` — base64 ↔ fichero (uso interno)

Fontanería: convierte entre texto "base64" y ficheros reales, en los dos sentidos. La usa un agente cuando, por ejemplo, una herramienta externa devuelve una imagen codificada y hay que guardarla como PNG/PDF, o al revés (preparar un fichero para subirlo a un sistema que solo acepta base64). **No la invocas tú** — el agente la activa cuando toca.

### `shared-http-download` — descargar ficheros por URL (uso interno)

Fontanería: descarga uno o varios ficheros desde una dirección web a disco (PDF, ZIP, documentos...). La usa un agente cuando recibe enlaces a documentos que hay que materializar para procesarlos (p. ej. los pliegos de una licitación). **No la invocas tú** — el agente la activa cuando toca.

---

## Cuándo invocar transversales vs depts

| Necesidad | Invocar |
|---|---|
| Captura inicial de requisitos para una iniciativa nueva | `shared-prd-agent` |
| Crear skill v1 o v2 nueva en el sistema | `shared-skill-builder` (modo `create-v1` o `create-v2`) |
| Auditar drift entre prosa y manifest de una skill v2 | `shared-skill-builder` (modo `audit`) |
| Configurar config + secrets de una skill v2 | `shared-skill-builder` (modo `configure`) |
| Análisis competitivo recurrente | skill `shared-competitive-analysis` (la invoca el dept que lo necesita) |
| Mapear stakeholders de un deal o decisión | skill `shared-stakeholder-map` |
| Dashboard recurrente de KPIs | skill `shared-kpi-dashboard` |
| Caso de éxito de cliente | skill `shared-case-study` |
| Matriz de riesgos | skill `shared-risk-matrix` |
| OKRs por ciclo | skill `shared-okr-set` |
| Journey de usuario | skill `shared-journey-map` |
| Checklist de deploy de release | skill `shared-deploy-checklist` |
| Crear agente nuevo en un dept | skill `shared-agent-scaffold` (la invoca `shared-skill-builder` o el orquestador del dept) |
| Entregar un informe o una tabla como Word o Excel | skill `shared-office-writer` (formato `docx` o `xlsx`) |
| Guardar/recuperar un base64 como fichero (interno) | skill `shared-base64` (la activa el agente, no se pide por nombre) |
| Descargar ficheros desde una URL (interno) | skill `shared-http-download` (la activa el agente, no se pide por nombre) |
