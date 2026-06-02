# HR — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de HR.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`hr-orchestrator.md`](./hr-orchestrator.md).

> **Confidencialidad por defecto.** HR maneja compensación, evaluaciones, conflictos. Nada se publica sin confirmar nivel de privacidad esperado.

---

## Cómo se invoca

1. **Vía orquestador** (recomendado): `hr-orchestrator` enruta a recruitment / onboarding / evaluation / policies.
2. **Directo a agente** cuando la tarea es de su único dominio.
3. **Skill directa** para outputs concretos (job-description de rol específico, etc).

> **¿En Word o Excel?** Por defecto los entregables salen en `.md`. Si lo quieres como documento de Word (cartas de oferta, JDs, políticas) o como hoja de Excel (bandas salariales, planes de headcount), solo pídelo (p. ej. «la carta de oferta en Word», «la tabla de bandas salariales en Excel»): el sistema genera el `.docx`/`.xlsx` listo para abrir.

---

## Agentes

### `hr-recruitment` — Recruitment

JDs, sourcing, interview kits, screening, scorecards, ofertas, rejection, bandas salariales.

**Caso de uso:** JD para puesto nuevo.

**Prompt:**
> "Necesito JD para un Senior Backend Engineer. Equipo de plataforma. Stack Go + Postgres + Kubernetes. Remoto desde España o Portugal. Banda 60-80k€."

**Output esperado:**
- Ruta: `<proyecto>/hr/recruitment/jd-senior-backend-engineer.md`
- Estructura:
  ```markdown
  # Senior Backend Engineer · Plataforma · Remoto ES/PT

  ## Sobre nosotros (EVP)
  Somos un SaaS B2B de 240 personas, Series B, profitable desde 2025.
  Vendemos a finance de empresas medianas. Trabajamos remoto-first con
  hubs en Barcelona y Lisboa. Nuestro stack es Go + Postgres + K8s y nos
  importa el código pequeño y comprensible más que el inteligente.

  ## El rol
  Vas a trabajar en el equipo de plataforma, el que mantiene los servicios
  internos que el resto de equipos consumen (auth, billing engine, audit log).
  Tu día a día será 60% diseño y código, 30% colaboración con otros equipos,
  10% on-call rotacional.

  ## Responsabilidades
  - Diseñar e implementar servicios Go en producción
  - Mantener la salud operativa de los servicios de plataforma
  - Mentoring de 1-2 mid engineers
  - Aportar a las decisiones técnicas del equipo (ADRs)

  ## Must have
  - 5+ años de backend en producción
  - Experiencia sólida con Go (3+ años)
  - Postgres avanzado (no solo CRUD: queries complejas, índices)
  - On-call previo con servicios productivos

  ## Nice to have
  - Experiencia con Kubernetes operativo
  - Background en sistemas distribuidos
  - Liderazgo técnico previo

  ## Banda salarial (pay transparency)
  60.000 - 80.000€ brutos anuales según experiencia + 0.05% stock options.
  Mismo rango para España y Portugal (jurisdicciones diferenciadas en
  beneficios secundarios).

  ## Proceso (4 etapas, 2-3 semanas)
  1. 30 min con hiring manager (cultural + intro al rol)
  2. 60 min coding técnico colaborativo (no leetcode)
  3. 60 min system design + 30 min con futuro compañero
  4. 45 min con CTO

  ## Compromiso de equidad
  Procesos estructurados con scorecards. Sin coding rounds tipo leetcode
  algorítmico. Feedback escrito tras cada etapa, vivas o no.
  ```

---

### `hr-onboarding` — Onboarding

Planes 30/60/90, day-1 checklist, welcome pack, evaluación de período de prueba.

**Caso de uso:** plan 30/60/90 para nuevo Senior Backend.

**Prompt:**
> "Plan 30/60/90 para el Senior Backend que empieza el 1 de junio en el equipo de plataforma. Buddy: María. Manager: Carlos."

**Output esperado:**
- Ruta: `<proyecto>/hr/onboarding/onboarding-plan-senior-backend-junio.md`
- Estructura:
  ```markdown
  # Onboarding Plan — Senior Backend Engineer · Inicio 2026-06-01

  ## Pre-boarding (semana antes del inicio)
  - [ ] HR: contrato firmado, accesos solicitados (Google Workspace, GitHub, Slack)
  - [ ] IT: laptop + periféricos enviados a casa
  - [ ] Manager (Carlos): email de bienvenida + agenda primera semana
  - [ ] Buddy (María): mensaje personal de bienvenida

  ## Día 1
  09:00 — Welcome call con manager (30 min)
  09:30 — Walkthrough de accesos + setup técnico (90 min)
  11:00 — Pausa
  11:30 — Intro al equipo de plataforma (30 min)
  12:00 — Lunch con el equipo (sin agenda)
  14:00 — Sesión con buddy: tour del repo principal (90 min)
  16:00 — Cierre del día: dudas + agenda mañana

  ## Días 30 — Familiarización
  Objetivos:
  - [ ] Repos clave clonados y corriendo en local
  - [ ] Primer PR pequeño mergeado (puede ser doc o test)
  - [ ] Shadow de 2 incidentes (sin estar de guardia)
  - [ ] Reuniones recurrentes en agenda (1:1, retro, demo)
  - [ ] Comprensión del producto desde el punto de vista del cliente

  Check de manager (día 30): 30 min para ajustar expectativas y resolver fricciones.

  ## Días 60 — Contribución
  Objetivos:
  - [ ] Tarea de complejidad media completada end-to-end (spec → PR → ship)
  - [ ] Participación activa en una decisión técnica del equipo
  - [ ] Primera rotación on-call con buddy
  - [ ] Sesión con un cliente (shadow del Head of CS)

  Check de manager (día 60): 60 min de feedback bidireccional formal.

  ## Días 90 — Autonomía
  Objetivos:
  - [ ] Owner de un módulo pequeño del sistema
  - [ ] PRs sin red de buddy salvo cosas críticas
  - [ ] On-call autónomo
  - [ ] Mentoring inicial a un mid engineer del equipo

  Check de manager (día 90): evaluación del período de prueba con scorecard.

  ## Evaluación de período de prueba (día 90)
  Criterios:
  - Calidad técnica (rubric 1-5)
  - Colaboración y comunicación (rubric 1-5)
  - Velocidad de ramp-up (vs media histórica del equipo)
  - Alineación cultural (rubric 1-5)

  Decisión: confirmar / extender 30 días / no continuar.
  Output: scorecard escrito + conversación con la persona.

  ## Feedback bidireccional
  En días 30, 60 y 90 también pedimos feedback DEL NUEVO al equipo:
  - ¿Qué te ha confundido más?
  - ¿Qué echaste de menos en el onboarding?
  - ¿Qué te ha sorprendido positivamente?
  ```

---

### `hr-evaluation` — Performance & Evaluation

Reviews, 1:1s, feedback estructurado, OKRs personales, PIPs, eNPS, exit interviews.

**Caso de uso:** performance review semestral.

**Prompt:**
> "Performance review de Lia, Senior PM del equipo de producto. Periodo: Q1+Q2 2026. Tengo notas de 1:1s, peer feedback de 4 personas, métricas del equipo."

**Output esperado:**
- Ruta: `<proyecto>/hr/evaluations/performance-review-lia-h1-2026.md` (confidencial)
- Estructura:
  ```markdown
  # Performance Review — Lia · Senior PM · H1 2026

  > Confidencial. Comparte solo con Lia y su manager.

  ## Resumen ejecutivo
  H1 sólido con dos highlights: liderazgo en el lanzamiento de Feature X y
  mejora visible en comunicación cross-team. Áreas a trabajar: prioritización
  cuando hay conflictos entre stakeholders.

  ## Evidencia → Impacto

  ### 1. Lanzamiento de Feature X (abril 2026)
  Evidencia: lideró el discovery + PRD + coordinación con eng/design.
  Impacto: feature shipeada en 8 semanas (vs 12 estimadas), adoption en
  semana 4 al 65% (target era 50%).
  Peer quote: "Lia tradujo expectativas confusas a un PRD que dejó al
  equipo enfocado." — Eng Lead.

  ### 2. Comunicación cross-team
  Evidencia: 3 retros mencionan mejora frente a Q4 2025. eNPS interno
  del equipo de producto subió de 6 a 8.
  Peer quote: "Las updates ahora son cortas y accionables." — CSM.

  ### 3. Área de mejora: priorización con stakeholders en conflicto
  Evidencia: 2 ocasiones (feature Y, integración Z) donde demanda de sales
  y solidez técnica chocaron y la decisión llegó tarde.
  Impacto: feature Y se retrasó 3 semanas. Eng feedback negativo en retro.
  Comentario constructivo: necesitamos ver framework explícito para
  tomar trade-offs antes que llegue el deadlock.

  ## Competencias (rubric 1-5 contra rol Senior PM)
  | Competencia | Rating | Calibración con equipo |
  | Product sense | 4 | media |
  | Execution | 4 | media |
  | Comunicación | 4 | sube de 3 en H2-2025 |
  | Influencia | 3 | área foco H2 |
  | Datos / métricas | 4 | media |
  | Strategy | 3 | apropiado para nivel |

  ## Rating global
  Meets+ (cumple expectativas del rol y supera en 2 áreas)
  Calibrado con otros Senior PMs del equipo en sesión del 12 de junio.

  ## Growth plan H2-2026
  - Curso de "tough conversations" interno (octubre)
  - Sombra de Director of Product en 2 decisiones de roadmap conflictivas
  - Review con manager al final de H2 enfocada en influencia/decisión

  ## Comp & promo
  - Promo a Principal PM: aún no, conversación retomada en H2 si crecimiento
    en influencia se materializa.
  - Ajuste comp: dentro de banda Senior PM. Subida según tabla calibrada.
  ```

---

### `hr-policies` — Internal Policies

Handbook del empleado, políticas individuales (remoto, vacaciones, conducta), comunicación de cambios.

**Caso de uso:** política nueva.

**Prompt:**
> "Política de uso de IA generativa para el equipo. Cubre: qué herramientas se pueden usar, qué datos NO se pueden meter, atribución del código, responsabilidad. Audiencia: toda la empresa."

**Output esperado:**
- Ruta: `<proyecto>/hr/policies/policy-ai-generative-use.md`
- Estructura:
  ```markdown
  # Política de uso de IA generativa

  - Versión: 1.0
  - Vigente desde: 2026-06-01
  - Owner: CTO + HR
  - Próxima revisión: 2026-12-01

  ## Propósito
  Define qué uso de IA generativa es aceptable dentro de la empresa,
  qué datos están fuera de límites y qué responsabilidad asume cada
  persona al usarla.

  ## Scope
  Aplica a toda persona empleada o contractor con acceso a sistemas de la
  empresa. Aplica al uso de ChatGPT, Claude, GitHub Copilot, Cursor, y
  cualquier servicio similar.

  ## Reglas

  ### Herramientas aprobadas
  | Herramienta | Plan | Uso permitido |
  | Claude (Anthropic) | Team enterprise | Sí, incluyendo datos no-PII |
  | ChatGPT | Enterprise | Sí, incluyendo datos no-PII |
  | GitHub Copilot | Business | Sí en el repo principal |
  | ChatGPT | Personal Free | NO con datos de la empresa |
  | Otras herramientas | — | Pedir aprobación a IT |

  ### Qué datos NO se pueden meter en ningún caso
  - Información personal de clientes (emails, nombres, datos bancarios)
  - Código con secrets o tokens hardcoded
  - Documentos legales en negociación
  - Información financiera no pública
  - Cualquier cosa marcada "confidencial" o "interno"

  ### Atribución del código asistido por IA
  - Código generado por IA es código tuyo: te lo apropias, lo entiendes,
    lo testeas y firmas el PR como autor.
  - No hace falta marcar "esto lo generó la IA" en commits.
  - SÍ hace falta cumplir las licencias de las sugerencias (Copilot avisa).

  ### Responsabilidad
  - Si un output con IA contiene un error, la responsabilidad es de quien
    lo publica, no de la herramienta.
  - Si dudas si algo es "datos sensibles", trátalo como sensibles.

  ## Procedimiento
  - Acceso a herramientas: solicitud vía IT
  - Revisión de excepciones: HR + CTO
  - Incidentes: reportar a HR + CISO en <24h

  ## Excepciones
  Algunos equipos (research) pueden pedir excepciones explícitas. Caso
  por caso, documentado.

  ## Consecuencias del incumplimiento
  - Primera vez: conversación con manager + HR
  - Reiterado: medidas disciplinarias según handbook
  - Pérdida de datos confidenciales: investigación + posibles consecuencias legales
  ```

---

## Skills

### `job-description` — JD completo

EVP, responsabilidades, must/nice, banda salarial, proceso, equidad.

Ver ejemplo en agente `hr-recruitment` arriba.

---

### `performance-review` — Review estructurado

Evidencia → impacto → competencias → rating con calibración → feedback → growth plan.

Ver ejemplo en agente `hr-evaluation` arriba.

---

### `policy-document` — Política individual

Propósito, scope, reglas, procedimiento, excepciones, consecuencias, owner.

Ver ejemplo en agente `hr-policies` arriba.

---

### `onboarding-plan` — Plan 30/60/90

Pre-boarding, día 1 hora a hora, buddy program, evaluación período de prueba, feedback bidireccional.

Ver ejemplo en agente `hr-onboarding` arriba.

---

### `one-on-one-framework` — Framework canónico de 1:1s

Principios, agenda recurrente, plantilla de notas, cadencia.

**Caso de uso:** framework formal para managers.

**Prompt:**
> "Framework de 1:1 canónico para que los managers tengan estructura. Cadencia semanal/quincenal según seniority. Incluye plantilla de notas."

**Output esperado:**
- Ruta: `<proyecto>/hr/policies/one-on-one-framework.md`
- Contenido:
  ```markdown
  # 1:1 Framework

  ## Principios
  - El 1:1 es del/la reportado/a, no del manager. Su agenda manda.
  - Frecuencia: semanal para nuevos joiners (primeros 90 días) y juniors;
    quincenal para senior y principal.
  - Duración: 30 min default, 45 si hay temas grandes; nunca 60 sin razón.
  - No se mueve el 1:1 sin causa fuerte. Si se cancela, se reagenda en <48h.

  ## Agenda recurrente
  1. **¿Cómo estás?** (5 min) — Persona primero, no contexto.
  2. **Status / bloqueos** (10 min) — Lo que reporta o necesita unblock.
  3. **Desarrollo** (5-10 min) — Avance vs growth plan o un tema rotatorio.
  4. **Feedback** (5 min) — Manager da feedback puntual y pide feedback.
  5. **Action items** (2 min) — Acordar 1-3 cosas concretas.

  ## Plantilla de notas (compartida entre los dos)

  ```markdown
  # 1:1 — [Nombre] · YYYY-MM-DD

  ## Cómo está
  - [una línea sobre estado general]

  ## Status / bloqueos
  - [ítem]
  - [ítem]

  ## Desarrollo
  - [tema de hoy]

  ## Feedback
  - Del manager → reportado: [feedback puntual]
  - Del reportado → manager: [feedback recibido]

  ## Action items
  - [ ] [acción + owner + fecha]
  ```

  ## Cadencia recomendada por seniority
  | Rol | Frecuencia | Duración |
  | New joiner (0-90 días) | semanal | 30 min |
  | Junior | semanal | 30 min |
  | Mid | quincenal | 30 min |
  | Senior+ | quincenal | 30 min |
  | Principal/Staff | quincenal o mensual + ad-hoc | 45 min |

  ## Anti-patrones
  - Manager habla 80% del tiempo
  - 1:1 se convierte en status update
  - Cancelar más de 2 veces seguidas
  - No tomar notas
  - No revisar action items de la sesión previa
  ```

---

### `compensation-band` — Banda salarial por rol × seniority × geografía

Benchmark + internal equity check + decision matrix. Confidencial alto.

**Caso de uso:** banda nueva para rol estratégico.

**Prompt:**
> "Banda salarial para Senior Backend Engineer en España y Portugal. Usar benchmarks 2025 del mercado SaaS B2B mid-market."

**Output esperado:**
- Ruta: `<proyecto>/hr/compensation/comp-band-senior-backend-2026.md` (confidencial alto)
- Estructura:
  ```markdown
  # Compensation Band — Senior Backend Engineer · 2026

  > Confidencial: HR + leadership. No comparte con equipo amplio.

  ## Banda definida
  | Geo | P25 | P50 (target) | P75 | P90 |
  | España | 58k€ | 68k€ | 78k€ | 88k€ |
  | Portugal | 50k€ | 60k€ | 70k€ | 80k€ |

  Diferencial Portugal: -12% vs España por coste de vida y mercado local.

  ## Benchmark usado
  - SourceA 2025 H2: SaaS B2B 100-500 empleados, Iberia
  - SourceB 2025: Tech Iberia Salary Report
  - SourceC (interno): 8 ofertas competidoras en 2025

  ## Internal equity check
  - 4 Senior Backend actuales en España: 62k, 65k, 68k, 71k → todos
    dentro de banda, alineados con tenure.
  - 1 en Portugal: 58k → dentro de banda P50-P75.

  ## Decision matrix
  | Caso | Acción |
  | Nueva contratación | Ofertar P25-P50 según expectativa, dejar 10% margen |
  | Promoción interna | Subir a P25 mínimo de la nueva banda |
  | Equity gap detectado | Ajuste único en siguiente revisión |
  | Counter-offer externa | Capar al P75 si retención merece |
  | Star performer | Hasta P90 con aprobación CTO + HR |

  ## Política de comunicación al candidato/empleado
  - Se comunica la banda al menos al P50-P75.
  - Se explica internal equity sin nombrar a nadie.
  - Se rechaza compartir el detalle interno por privacidad.

  ## Próxima revisión: 2026-12-01
  ```

---

### `exit-interview` — Exit interview con síntesis para people analytics

Categorización estandarizada (regrettable/non-regrettable, motivo principal con etiquetas), recomendaciones derivadas.

**Caso de uso:** exit de Senior PM que renuncia.

**Prompt:**
> "Guion + síntesis para exit interview con Pedro, Senior PM, 2.5 años en la empresa. Renuncia por nueva oportunidad en empresa más grande."

**Output esperado:**
- Ruta: `<proyecto>/hr/evaluations/exit-interview-pedro-2026-06.md` (confidencial)
- Estructura:
  ```markdown
  # Exit Interview — Pedro · Senior PM · Salida 2026-06-30

  > Confidencial. HR + People Analytics agregado únicamente.

  ## Categorización
  - Tipo: regrettable (high performer)
  - Motivo principal: career_growth (oportunidad de escalado)
  - Motivo secundario: comp_external_higher
  - Razón "última gota": none — decisión racional, no emocional

  ## Guion de la conversación (45 min)

  ### Apertura (5 min)
  Agradecer + recordar confidencialidad + tomar notas no es eval.

  ### Bloque 1: contexto del cambio (10 min)
  - ¿Cuándo empezaste a considerar irte?
  - ¿Fue una oferta inesperada o llevabas tiempo buscando?
  - ¿Qué te hubiera hecho quedarte?

  ### Bloque 2: experiencia en la empresa (15 min)
  - ¿Qué fue lo mejor de tu paso por aquí?
  - ¿Qué te frustró más?
  - ¿Cómo describirías el equipo de producto en 3 palabras?
  - ¿Cómo describirías a tu manager?

  ### Bloque 3: producto y procesos (10 min)
  - ¿Qué cambiarías del proceso de producto?
  - ¿Qué le dirías a un PM que entra mañana?

  ### Cierre (5 min)
  - ¿Puedes contactarnos si en el futuro te interesa volver?
  - Logística de salida (último día, accesos, equipo)

  ## Síntesis post-call

  ### Positivos destacados
  - Cultura de feedback honesto (3 menciones)
  - Calidad del equipo de eng (2 menciones)
  - Autonomía real para tomar decisiones de producto

  ### Pain points
  - Compensación: P50 de mercado vs P75 que ofrece nuevo employer
  - Stretch hacia roles Principal/Director limitado por tamaño de empresa
  - Procesos de roadmap percibidos como reactivos a sales

  ### Recomendaciones (agregables con otros exits)
  - Revisar banda Senior PM (3er exit por comp en 12 meses) → señal
  - Definir path Senior → Principal con criterios claros → área de mejora
  - Frontera roadmap product-led vs sales-led → tema crónico
  ```

---

## Flujo end-to-end típico

```
1. hr-recruitment   → job-description + compensation-band
2. hr-recruitment   → entrevistas + scorecards (skill inline en JD)
3. hr-onboarding    → onboarding-plan 30/60/90 + welcome pack
4. hr-onboarding    → evaluación período prueba (día 90)
5. hr-evaluation    → one-on-one-framework (recurrente)
6. hr-evaluation    → performance-review semestral
7. hr-policies      → policy-document si surge necesidad
8. hr-evaluation    → exit-interview si se va alguien
```
