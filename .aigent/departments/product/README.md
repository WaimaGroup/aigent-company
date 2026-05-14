# Product — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de Product.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`product-orchestrator.md`](./product-orchestrator.md).

---

## Cómo se invoca

1. **Vía orquestador** (recomendado): `product-orchestrator` enruta a discovery / strategy+roadmap / metrics.
2. **Directo a agente** cuando ya sabes (ej. "tengo entrevistas pendientes" → `product-discovery`).
3. **Skill directa** para outputs concretos (PRD, OKRs, north star).

> Frontera con design: **product-discovery** investiga *qué problema resolver*; **design-ux-research** investiga *qué tan bien se resuelve con la interfaz*. Ambos coexisten sin pisarse.

---

## Agentes

### `product-discovery` — Discovery

User interviews, JTBD, opportunity-solution trees, validación problema/solución, personas, journeys.

**Caso de uso:** entrevistas con clientes para validar hipótesis de problema.

**Prompt:**
> "Vamos a hacer 8 entrevistas a heads of finance de SaaS B2B para validar la hipótesis de que el dolor más grande del cierre es la conciliación bancaria. Necesito el script + framework de análisis."

**Output esperado:**
- Ruta: `<proyecto>/product/discovery/user-interview-script-finance-banking-reconciliation.md`
- Estructura del script:
  ```markdown
  # User Interview Script — Heads of Finance · Hipótesis: Reconciliación Bancaria

  ## Objetivo
  Validar (o refutar) que la conciliación bancaria es el cuello de botella
  principal del cierre contable en SaaS B2B 50-300 empleados.

  ## Setup (5 min)
  - Agradecer + permiso para grabar (solo notas)
  - Aclarar que NO es entrevista comercial
  - Pedir que piensen en su última semana de cierre

  ## Calentamiento (5-7 min)
  - "Cuéntame cómo fue tu último cierre de mes, desde el día 28 al día 5"
  - "¿Cuándo supiste que estaba terminado?"

  ## Exploratorias (15 min)
  - "Dentro de ese cierre, ¿qué te dio más dolor?"
  - "Si tuvieras que escoger UNA cosa que cambiarías, ¿cuál sería?"
  - "¿Quién más en tu equipo sufrió ese mismo dolor?"

  ## Profundización (5 whys suave) (10 min)
  Si responden "conciliación bancaria":
  - "¿Qué parte exactamente — extracto vs. movimientos, vs. el match con
    facturas, vs. con plataformas tipo Stripe?"
  - "¿Cuánto tiempo se va en eso?"
  - "¿Qué pasaría si lo tuvieras hecho en 1 hora en lugar de 8?"

  Si responden otra cosa:
  - Anotar el dolor real (puede invalidar hipótesis)
  - Preguntar dónde encajaría la conciliación bancaria en orden

  ## Comportamiento concreto (10 min)
  - "¿Puedes enseñarme cómo lo haces ahora?" (compartir pantalla si posible)
  - "¿Qué herramientas usas?"

  ## Cierre (3 min)
  - "Si pudieras chasquear los dedos, ¿cómo sería?"
  - "¿A quién más conoces que sufra esto?"

  ## Debrief en caliente (post-call, 10 min)
  - Hipótesis confirmada / refutada / matizada
  - 3 frases textuales más importantes
  - Sorpresas inesperadas
  - Siguiente pregunta a investigar

  ## Síntesis cruzada (tras 8 entrevistas)
  Patrón a buscar: ¿cuántos de 8 mencionan reconciliación en top-3 pains?
  - 6-8 → hipótesis fuerte
  - 3-5 → hipótesis matizada (subsegmento)
  - 0-2 → hipótesis refutada, pivote
  ```

---

### `product-strategy-roadmap` — Strategy + Roadmap

Visión, posicionamiento, análisis competitivo, priorización (RICE/MoSCoW), roadmap, bets, PRDs de feature, release plans.

**Caso de uso:** roadmap trimestral con priorización.

**Prompt:**
> "Roadmap Q3-Q4 2026. Hay 14 iniciativas candidatas. Necesito priorización RICE + horizonte now/next/later + sección 'Lo que NO entra'."

**Output esperado:**
- Ruta: `<proyecto>/product/strategy/roadmap-q3-q4-2026.md`
- Estructura:
  ```markdown
  # Roadmap Q3-Q4 2026

  ## Visión del periodo
  Convertir el módulo de conciliación en categoría propia. Reducir time
  to first value de 12 a 6 semanas.

  ## Priorización RICE
  | Iniciativa | Reach | Impact | Confidence | Effort | RICE | Horizonte |
  | AI Insights GA | 80% | 3 | 80% | 5 sem | 38.4 | NOW |
  | Reconciliación auto | 60% | 3 | 90% | 8 sem | 20.3 | NOW |
  | Webhooks externos | 40% | 2 | 70% | 3 sem | 18.7 | NEXT |
  | Mobile app | 70% | 2 | 50% | 12 sem | 5.8 | LATER |
  | Multi-currency | 30% | 3 | 80% | 6 sem | 12.0 | NEXT |
  ...

  ## Now (Q3)
  ### AI Insights GA
  - Owner: Lia (PM) + Plataforma team
  - Deadline: 2026-09-30
  - Métrica de éxito: 30% de cuentas paying activan en primer mes

  ### Reconciliación bancaria automática
  - Owner: Juan (PM) + Finance team
  - Deadline: 2026-09-15
  - Métrica de éxito: time-to-close -25% en cohorte beta

  ## Next (Q4)
  - Webhooks externos
  - Multi-currency
  - Reescritura UI módulo billing

  ## Later
  - Mobile app (pendiente investment case)
  - API pública v2
  - SOC 2 Type II audit (paralelo a Q4)

  ## Lo que NO entra (y por qué)
  - **Integración con Slack** — RICE 4.5, demandado pero impacto bajo en
    el funnel económico. Volveremos en Q1.
  - **Editor de fórmulas avanzado** — demandado por 3 clientes enterprise,
    pero ROI no justifica complejidad. Workaround documentado.
  - **Rediseño de navegación** — research pendiente. No iniciamos sin datos.

  ## Confianza explícita
  - Q3: confianza alta (compromisos firmados con stakeholders)
  - Q4: confianza media (depende de aprendizajes de Q3)
  ```

---

### `product-metrics` — Metrics

North star metric, OKRs producto, KPI trees, instrumentación, experiment design.

**Caso de uso:** A/B test para nueva feature.

**Prompt:**
> "Diseña el A/B test para la nueva pantalla de onboarding. Hipótesis: el flow guiado de 4 pasos mejora activación de día 7 vs el flow actual de 1 pantalla."

**Output esperado:**
- Ruta: `<proyecto>/product/metrics/experiment-design-onboarding-guided-flow.md`
- Estructura:
  ```markdown
  # Experiment Design — Guided Onboarding vs Single Screen

  ## Hipótesis
  Si presentamos el onboarding como un flow guiado de 4 pasos
  (tour → first action → setup → done), entonces la activación de día 7
  subirá ≥ 5 puntos porcentuales vs el flow actual (single screen),
  porque reduce ambigüedad sobre "qué hago primero".

  ## Métrica primaria
  - **Activación día 7:** % de cuentas registradas que completan ≥1 acción
    significativa (definida en `metrics/activation-definition.md`) en los
    primeros 7 días.
  - Baseline actual: 38%
  - MDE (mínimo detectable): 5pp absoluto (de 38% a ≥43%)
  - Direction: subir

  ## Métricas guardraíl
  - **Tasa de bajas día 1:** no debe subir más de 2pp
  - **NPS post-onboarding:** no debe bajar
  - **Time-to-first-action:** no debe degradar más de 30 segundos

  ## Diseño
  - **Randomización:** sticky por user_id, asignación al 50/50.
  - **Variantes:**
    - Control: pantalla actual
    - Variante: flow guiado 4 pasos
  - **Tráfico target:** todo signup nuevo durante el experimento.
  - **Exclusiones:** signups con SSO enterprise (flow diferente).

  ## Tamaño muestral
  Con baseline 38%, MDE 5pp, alfa 0.05, power 80%:
  N = 1.580 usuarios por variante (3.160 total)
  Volumen actual: ~250 signups/semana → ~13 semanas mínimo
  Aproximamos: experimento de 14 semanas (3.5 meses)

  ## Pre-registered decision rules
  - Si lift ≥ 5pp con p < 0.05 → ship variante.
  - Si lift positivo pero no significativo a las 14 semanas → extender 4 semanas.
  - Si lift negativo significativo → ship control (no merge variante).
  - Si guardraíl rompe (tasa de bajas +2pp) → parar early con análisis.

  ## Análisis pre-registrado (anti p-hacking)
  - Cohortes por canal de adquisición (no usado para decidir, solo para
    aprendizaje secundario)
  - Sin slicing por país/plan/etc. para decisión

  ## Riesgos
  - Bias de tráfico estacional (julio bajo signups)
  - Si variante es notablemente peor en primeras 2 semanas → considerar
    early stopping (Bayesian frequentist hybrid)
  ```

---

## Skills

### `user-interview-script` — Script de entrevista

Calentamiento, exploratorias, profundización, comportamiento, cierre, debrief.

Ver ejemplo en agente `product-discovery` arriba.

---

### `product-roadmap` — Roadmap por horizonte

Now/next/later o quarterly, fichas de iniciativa, "Lo que NO entra".

Ver ejemplo en agente `product-strategy-roadmap` arriba.

---

### `north-star-metric` — NSM con candidates evaluados

3 criterios + definición operativa + KPI tree + guardraíles + anti-patrones.

**Caso de uso:** definir north star para el equipo.

**Prompt:**
> "Necesitamos definir north star metric para el equipo de producto. Estamos en SaaS B2B finance, queremos métrica que refleje valor entregado al cliente, no vanity."

**Output esperado:**
- Ruta: `<proyecto>/product/metrics/north-star-metric.md`
- Estructura:
  ```markdown
  # North Star Metric

  ## Candidates evaluados
  | Candidate | Refleja valor cliente | Predictivo revenue | Accionable |
  | MAU | bajo | bajo | media |
  | Closes/mes por cliente | alto | alto | alta |
  | Hours saved en cierre | muy alto | medio | media |
  | Time to first close | alto | alto | alta |

  ## NSM elegido
  **Closes mensuales completados por cuenta activa**

  ### Por qué
  - Refleja valor real: cada close es un mes donde nosotros somos parte
    del proceso financiero del cliente.
  - Predictivo de revenue: clientes que cierran ≥3 meses consecutivos
    tienen retención al año del 92% (vs 41% si cierran <3).
  - Accionable: producto puede mover esta métrica vía mejor activación,
    menos fricción en el cierre, integraciones que cubren más sistemas.

  ### Definición operativa
  - "Close completado" = todos los módulos críticos del cierre marcados
    OK por usuario admin antes del día 15 del mes siguiente.
  - "Cuenta activa" = al menos 1 usuario login en el mes calendario.
  - Reporting: mensual, agregada y por cohorte (mes de signup).

  ## KPI tree (componentes)
  NSM = Cuentas activas × % cuentas con close completado mensual

  Cuentas activas
  ├── New signups
  ├── Activation rate
  └── Retention M3, M6, M12

  % con close completado
  ├── Time to first close (días)
  ├── % close started but abandoned
  └── % close completed within deadline

  ## Guardraíles
  - **NPS:** no debe bajar persiguiendo NSM (evitar oprimir al usuario)
  - **Tickets soporte por cuenta:** no debe subir
  - **Tiempo de cierre subjetivo:** medido en encuesta trimestral

  ## Anti-patrones
  - Subir NSM bajando el listón de "completado" (gaming)
  - Incentivar al equipo a activar cuentas zombi
  - Reportar NSM sin tendencia comparativa
  ```

---

### `feature-prd` — PRD de feature

Problema, hipótesis, scope, user stories con AC, métricas + guardraíles, rollout plan.

**Caso de uso:** PRD de feature mediana.

**Prompt:**
> "PRD para la feature de exportación de reportes a CSV/Excel. Pedida por 4 clientes enterprise. Scope: módulo de reporting actual, con configuración de columnas."

**Output esperado:**
- Ruta: `<proyecto>/product/strategy/feature-prd-export-reports.md`
- Estructura:
  ```markdown
  # Feature PRD — Export de reportes a CSV/Excel

  ## Problema
  4 clientes enterprise han pedido en últimos 3 meses la capacidad de
  exportar los reportes a CSV/Excel para meterlos en su propio BI.
  Hoy hacen captura de pantalla → pegar a Excel → reformatear → analizar.
  Coste estimado por cliente: 4-6h/mes.

  ## Hipótesis
  Si añadimos export con configuración de columnas, entonces el uso del
  módulo de reporting subirá ≥ 30% en cuentas enterprise, porque cubrirá
  el caso de uso real (BI propio) sin obligar al usuario a copiar y pegar.

  ## Scope
  ### IN
  - Botón "Export" en cabecera de cada reporte
  - Modal de configuración: columnas (toggle) + formato (CSV / XLSX)
  - Job en background si > 5k filas → email con link
  - Histórico de exports últimos 30 días

  ### OUT
  - Schedule de exports recurrentes (post-MVP)
  - Export a Google Sheets directo (post-MVP)
  - Reportes custom (cubierto por feature aparte ya en backlog)

  ## User stories con AC

  ### US-1: Admin descarga CSV con todas las columnas
  Given soy admin con permiso "reports.export"
  When clic en "Export" → CSV → "Descargar"
  Then se descarga `.csv` con todas las columnas visibles del reporte

  AC:
  - Encoding UTF-8 con BOM (Excel-friendly)
  - Encabezados en primera fila
  - Decimales según locale del usuario

  ### US-2: Admin configura columnas antes de exportar
  Given quiero exportar solo algunas columnas
  When abro modal de export
  Then puedo seleccionar/deseleccionar columnas

  AC:
  - Mínimo 1 columna seleccionada para activar export
  - Preferencias persisten por usuario y reporte

  ### US-3: Export grande va en background
  Given el reporte tiene > 5k filas
  When solicito export
  Then se procesa en background y recibo email con link cuando esté listo

  AC:
  - Email enviado en < 5 min para reportes hasta 100k filas
  - Link válido 24h
  - Notificación en app además del email

  ## Métricas de éxito
  - Primaria: uso del módulo reporting +30% en cuentas enterprise (M+3)
  - Adoption: 30% de cuentas enterprise usan export ≥1 vez (M+1)
  - Satisfaction: NPS módulo reporting +5pp

  ## Guardraíles
  - Carga servidor: cola dedicada con rate limit por tenant
  - Storage: blobs S3 con lifecycle 30 días auto-delete

  ## Rollout plan
  - Semanas 1-3: implementación + tests
  - Semana 4: rollout 10% enterprise (feature flag)
  - Semana 5: 50%
  - Semana 6: 100% enterprise + 25% pro
  - Semana 7: 100% all plans

  ## Riesgos
  - [R-1] Cliente exporta info sensible → cumplir con permisos existentes
  - [R-2] Spam de exports gigantes → rate limit + cuota por plan
  ```

---

### `experiment-design` — Plan A/B test

Hipótesis, MDE, sample size, randomización, decision rules pre-resultado.

Ver ejemplo en agente `product-metrics` arriba.

---

### `release-plan` — Plan de release end-to-end

Hitos, owners por área, comms externa, enablement, rollout strategy, kill switch.

**Caso de uso:** plan de lanzamiento de feature Major.

**Prompt:**
> "Release plan para el lanzamiento público de AI Insights. Tier Major. Va a producción 2026-09-15. Necesitamos coordinar Product, Eng, Design, Marketing, Sales, Support, Legal."

**Output esperado:**
- Ruta: `<proyecto>/product/strategy/release-plan-ai-insights-launch.md`
- Estructura:
  ```markdown
  # Release Plan — AI Insights Public Launch

  - Tier: Major
  - Go-live date: 2026-09-15
  - Release owner: Lia (Senior PM)
  - Feature flag: `ai-insights-public`

  ## Hitos
  | Fecha | Hito | Owner |
  | Aug 1 | Beta closed (200 cuentas) | PM |
  | Aug 15 | Beta open (signup waitlist) | PM + Marketing |
  | Sep 1 | Feature freeze para launch | Eng |
  | Sep 8 | Press embargo lift | Marketing |
  | Sep 15 | Public launch 100% | Release owner |
  | Sep 22 | Post-launch review | Cross-team |

  ## Owners por área
  | Área | Owner | Entregables |
  | Product | Lia | PRD final, criterios éxito, kill switch protocol |
  | Eng | Carlos | Performance audit, kill switch implementado, SLO definido |
  | Design | Marta | Final UI, marketing assets, in-app onboarding |
  | Marketing | Juan | Press release, blog post pilar, campaña, emails |
  | Sales | Lia2 | Battle card, demo flow, pricing comms |
  | Support | Pedro | Macros de tickets típicos, training, FAQ docs |
  | Legal | Ana | T&C revisado por AI clauses, DPA addendum |

  ## Comms externa
  - **Press release:** embargo lift Sep 8, publicación Sep 15
  - **Blog post pilar:** "Cómo construimos AI Insights" (técnico) + post
    de producto (qué hace + casos)
  - **Email a base:** 8.000 contactos en T-7 y T-1
  - **Social:** thread de lanzamiento Sep 15
  - **Webinar:** Sep 22 (live demo + Q&A)

  ## Enablement
  - **Sales:** training Sep 5, battle card distribuida Sep 8
  - **Support:** training Sep 8, FAQs en intercom Sep 15
  - **CSM:** training Sep 5, agenda de QBR adaptada

  ## Rollout strategy
  - Beta closed: 200 cuentas seleccionadas (Aug 1)
  - Beta open: cualquiera que se apunte (Aug 15)
  - Public 5%: Sep 15 09:00 UTC
  - Public 25%: Sep 15 14:00 UTC (si métricas OK)
  - Public 100%: Sep 15 20:00 UTC

  ## Criterios de éxito + guardraíles
  ### Criterios de éxito (primer mes)
  - 30% de cuentas paying activan AI Insights
  - NPS módulo +5pp
  - 50 menciones / artículos publicados

  ### Guardraíles
  - Error rate AI provider < 2% — si > 5% → kill switch
  - Latency p99 < 3s — si > 5s → degradar a sync mode
  - Tickets soporte AI Insights < 50/día — si > 100 → review urgente

  ## Kill switch
  Protocolo:
  1. Detect: alerta automática + Lia confirma manual
  2. Decide: Lia + CTO en 15 min
  3. Toggle flag `ai-insights-public` a 0
  4. Comms: status page actualizada en <30 min
  5. Postmortem en <72h

  ## Post-launch review (Sep 22)
  - Métricas vs criterios
  - Tickets soporte volumen y temas
  - Sales feedback (top objeciones)
  - Eng learnings (incidentes, performance)
  - Decisiones para v1.1
  ```

---

## Skills compartidas usadas en este dept

- `competitive-analysis` (shared) — Análisis competitivo para roadmap. Consumida por `product-strategy-roadmap`.
- `stakeholder-map` (shared) — Mapeo de stakeholders en discovery y releases. Consumida por `product-discovery`, `product-strategy-roadmap`.
- `risk-matrix` (shared) — Riesgos de iniciativas en roadmap. Consumida por `product-strategy-roadmap`.
- `kpi-dashboard` (shared) — Dashboard de métricas de producto. Consumida por `product-metrics`.
- `okr-set` (shared) — OKRs trimestrales de producto. Consumida por `product-metrics`.
- `journey-map` (shared) — Customer journeys. Consumida por `product-discovery`.

Ver ejemplos en [`_shared/README.md`](../_shared/README.md).

---

## Flujo end-to-end típico

```
1. product-discovery       → user-interview-script + journeys
2. product-discovery       → validación de hipótesis de problema
3. product-strategy-roadmap → product-roadmap con priorización
4. product-strategy-roadmap → feature-prd de la iniciativa elegida
5. product-metrics         → north-star-metric + okr-set + experiment-design
6. product-strategy-roadmap → release-plan para lanzamiento
7. product-metrics         → análisis post-launch del experimento
```
