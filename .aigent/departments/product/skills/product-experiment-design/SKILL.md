---
name: "product-experiment-design"
user-invocable: true
description: >
  Skill for producing a structured A/B test or experiment plan: hypothesis,
  variants, primary metric, guardrail metrics, minimum detectable effect (MDE),
  sample size and duration estimation, randomization unit, success/failure
  criteria, ramping plan, and shipping decision. Methodologically rigorous,
  shipping-oriented.
---

# Skill: Experiment Design

**Entregable:** archivo `.md` con plan de experimento listo para implementación técnica (instrumentación + ramping) y análisis posterior. Vive en `<proyecto>/product/metrics/analysis/<experiment-slug>-plan.md`. El report post-experimento es otro documento (`<experiment-slug>-report.md`).

---

## Cuándo usar esta skill

- Hay que validar una hipótesis de producto con un A/B test antes de comprometer rollout.
- Se quiere medir el impacto de un cambio de UX/copy/pricing/feature.
- Se evalúa una idea que tiene incertidumbre material sobre su impacto.
- Hay que documentar el plan de un experimento que ya se está implementando.

**Cuándo NO usar:**

- Para feature flags binarios sin medición controlada (eso es rollout strategy, no experiment).
- Para test sin tráfico suficiente (si N < MDE, mejor ship + medir, no experiment).
- Para cambios obviamente positivos donde el coste de no shippar pesa más (ej. bug fix).
- Para cambios cualitativos no medibles (ej. tono de un copy nuevo sin métrica clara).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Hipótesis | ¿Qué crees que pasará y por qué? |
| Variantes | Control + treatment(s) — descripción de cada uno |
| Métrica primaria | ¿Cuál es el outcome principal? |
| Métricas guardraíl | ¿Qué métricas NO queremos que empeoren? |
| MDE esperado | ¿Qué tan grande tiene que ser el efecto para ser práctico? |
| Tráfico disponible | ¿Cuántos usuarios/sesiones/eventos por unidad de tiempo? |
| Randomización | ¿Por usuario, por sesión, por device, por cuenta B2B? |
| Tooling | ¿LaunchDarkly, GrowthBook, Optimizely, propio? |
| Tiempo disponible | ¿Cuánto puede correr el test antes de que necesitemos decidir? |
| Audiencia objetivo | ¿Todos los usuarios o segmento específico? |

---

## Plantilla del entregable

Nombre del archivo: `<experiment-slug>-plan.md`.

```markdown
---
type: "experiment-plan"
experiment_name: "<Nombre humano>"
experiment_slug: "<kebab-case>"
status: "draft | approved | running | analyzed | shipped | reverted"
hypothesis_type: "uplift | parity | risk-mitigation"
randomization_unit: "user | session | device | account"
tooling: "<LaunchDarkly | GrowthBook | Optimizely | propio>"
start_date: "YYYY-MM-DD"
planned_end_date: "YYYY-MM-DD"
actual_end_date: "YYYY-MM-DD"
owner_pm: "<nombre>"
owner_data: "<nombre / analyst>"
owner_eng: "<nombre / tech lead>"
---

# Experiment Plan — <Nombre del experimento>

## 0. Resumen ejecutivo

> 4-6 líneas. Hipótesis, variantes, qué medimos, qué decidiremos según resultados.

**Hipótesis:** <una línea>

**Variantes:**
- **Control (A):** <descripción>
- **Treatment (B):** <descripción>
- (Si multi-arm: C, D, ...)

**Métrica primaria:** <KPI + cómo se mide>

**Decisión esperada al final:**
- Si treatment gana significativamente: shippear a 100%.
- Si gana pero no significativo: extender o ship con riesgo.
- Si pierde o empata: descartar / iterar.

---

## 1. Hipótesis

> Estructura: si hacemos X, esperamos Y porque Z.

**Hipótesis principal:**
> *Si mostramos `<variante>` en lugar de `<control>`, los usuarios `<persona>` cambiarán `<comportamiento>`, lo cual moverá `<métrica>` en `<delta>` porque `<causa>`.*

**Hipótesis nula (lo que asumimos por defecto):**
> *No hay diferencia significativa en `<métrica>` entre control y treatment.*

**Tipo de hipótesis:**
- ☐ **Uplift** — esperamos que treatment sea mejor.
- ☐ **Parity** — esperamos que treatment sea igual (típico en migraciones técnicas o cambios "neutrales").
- ☐ **Risk mitigation** — queremos asegurar que un cambio aparentemente positivo no rompa algo.

---

## 2. Variantes

### Control (A)

- **Descripción:** <qué ve el usuario en control>
- **Por qué es el control:** <es el comportamiento actual / es la versión "segura">
- **% tráfico asignado:** <50% típico>

### Treatment 1 (B)

- **Descripción:** <qué cambia respecto al control>
- **Por qué esta variante específica:** <razón>
- **% tráfico asignado:** <50% típico>

### Treatment 2 (C) *(si multi-arm)*

(misma estructura)

> **Recomendación:** mantener máximo 2-3 variantes salvo justificación. Multi-arm requiere muestras mayores y complica el análisis.

---

## 3. Métrica primaria

| Campo | Detalle |
|---|---|
| **Nombre** | <KPI canónico — ej. "Activation rate" o "Conversion to paid"> |
| **Definición operativa** | <fórmula exacta: numerador / denominador / ventana> |
| **Source of truth** | <herramienta + tabla / evento> |
| **Baseline actual** | <valor — basado en últimas 4 semanas típicamente> |
| **MDE (Minimum Detectable Effect)** | <ej. +2pp absolutos / +5% relativos> |
| **Dirección esperada** | <sube / baja según hipótesis> |

> **MDE justification:** ¿por qué este MDE? Razón típica: por debajo de este efecto, no compensa el coste de implementación; o por debajo, no es práticamente relevante.

---

## 4. Métricas guardrail (no deben empeorar)

| Métrica | Threshold tolerable | Por qué la vigilamos |
|---|---|---|
| <Métrica guardrail 1> | < +X% / +Ypp | <razón: no romper retention, no perder revenue, no aumentar churn> |
| <Métrica guardrail 2> | | |
| <Tiempo de carga / performance> | < +10% | <evitar regresiones técnicas> |

**Decision rule:** si treatment gana la primaria PERO empeora guardrail ≥ threshold → no shippar; reconsiderar.

---

## 5. Sample size y duración

### Cálculo de sample size

**Inputs:**
- **Baseline conversion (de la métrica primaria):** <X%>
- **MDE absoluto:** <Y pp>
- **Significance level (α):** 0.05 (default)
- **Statistical power (1-β):** 0.80 (default)
- **One-tail o two-tail:** <two-tail típico>

**Resultado del cálculo:**
- **N por variante:** <X usuarios/sesiones>
- **N total:** <Y usuarios/sesiones>

> Cálculo con calculadora estándar (Optimizely, Evan Miller, etc.) o fórmula:
> `n ≈ 16 × p(1-p) / (MDE²)` aproximación simple para conversion rates.

### Duración estimada

- **Tráfico estimado:** <Z usuarios/sesiones por día>
- **Días para llegar a N:** <N / Z>
- **Duración mínima recomendada:** **14 días** (cubrir 2 ciclos semanales, evitar bias por día de la semana).
- **Duración máxima:** <X días — fechar el cutoff explícito>.

> **Regla de oro:** si la duración necesaria es > 4 semanas, replantear MDE o segmentar audiencia.

---

## 6. Randomización

- **Unit:** <user / session / device / account>
- **Asignación:** sticky por unit (un usuario no cambia de bucket).
- **Hash de asignación:** <user_id + experiment_id → bucket>
- **Tráfico no incluido:** <bots, internos de empresa, usuarios opt-out>.
- **Segmentación pre-experimento:** <todos los usuarios / segmento específico (geo, plan, recientes)>.

### Sample ratio mismatch (SRM) check

> Si después de empezar, la proporción real de usuarios entre variantes difiere ≥ 1pp de lo asignado, hay bug en la asignación. Parar y diagnosticar.

---

## 7. Instrumentación

> Qué eventos se trackean y cómo se identifican los buckets.

**Eventos a instrumentar:**
- `<event_name>` con propiedad `experiment_<slug>: control | treatment`
- <Otros eventos necesarios para la métrica primaria y guardrails>

**Coordinación con engineering:**
- Quién implementa la asignación: <equipo>
- Quién verifica la instrumentación en QA: <persona>
- Test pre-lanzamiento: <% de tráfico bajo durante 1 día para verificar SRM, métricas se mueven, no hay crashes>.

---

## 8. Decision rules

> Reglas decididas ANTES de ver resultados. Esto evita p-hacking.

### Si primary metric WINS (p < 0.05 + dirección esperada)

- Y guardrails OK → **shippear a 100%**.
- Y guardrails empeoran ≥ threshold → **no shippar**, reconsiderar.

### Si primary metric LOSES (p < 0.05 + dirección opuesta)

- **No shippar**. Documentar aprendizaje, iterar hipótesis.

### Si NO SIGNIFICATIVO (p ≥ 0.05)

- **No declarar ganador**. Opciones:
  - Si tras duración planeada → terminar y no shippar.
  - Si MDE no se ha alcanzado y duración no ha llegado al máximo → extender.
  - Si claramente plano → terminar; el "win" no existe.

### Si guardrail empeora aunque primaria gane

- **No shippar**. La primaria no compensa el daño en guardraíl, salvo análisis adicional que justifique trade-off.

---

## 9. Riesgos del experimento

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Sample ratio mismatch (bug en asignación) | Media | SRM check diario los primeros 3 días |
| Bias por novedad (treatment efecto solo al inicio) | Media | Duración mínima 14 días para capturar steady-state |
| Network effect (treatment afecta a control) | Baja | <Si aplica, randomización por cluster> |
| Métricas con varianza alta (no detecta efectos pequeños) | <Alta/Media/Baja> | Considerar CUPED u otra reducción de varianza |
| <Otro riesgo específico> | | |

---

## 10. Ramping plan (si rollout progresivo)

> Si el experimento se hace al 100% desde día 1 o si rampea.

- **Día 0:** <5% tráfico — verificar instrumentación + ausencia de crashes>
- **Día 1 (si OK):** <50% tráfico — empezar análisis>
- **Día 14 (si OK):** <evaluar resultados — decisión>

---

## 11. Análisis post-experimento

> Sección que se rellena al cerrar el experimento. Antes vive vacía o con resultados parciales.

### Resultados

| Métrica | Control | Treatment | Δ absoluto | Δ relativo | p-value | Significativo? |
|---|---|---|---|---|---|---|
| <Métrica primaria> | | | | | | |
| <Guardrail 1> | | | | | | |
| <Guardrail 2> | | | | | | |

### Análisis por segmento

> A veces el efecto está concentrado en un segmento. Vale la pena romper la primaria por geo/plan/cohorte.

| Segmento | Δ primaria | Significativo? |
|---|---|---|
| <Segmento A> | | |

### Veredicto

- ☐ **Win — shippar a 100%**
- ☐ **Loss — descartar**
- ☐ **No conclusive — terminar / extender / iterar**

### Aprendizajes (independientemente del veredicto)

- <Aprendizaje 1>
- <Aprendizaje 2>

---

## 12. Anexos

- **Hipótesis de roadmap:** <link al feature-prd / roadmap>
- **Mockups si visuales:** <link Figma>
- **Tabla de eventos / instrumentación:** <link>
- **Cálculo de sample size:** <link a calculator output o cálculo>
- **Dashboard del experimento:** <link>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin baseline de métrica primaria y MDE razonable, parar.
2. **Validar que el experimento es viable.** Si tráfico × tiempo < N requerido para detectar el MDE, **no se debería correr** — buscar alternativa (medir post-ship, A/A test antes para entender varianza, segmentar).
3. **Definir hipótesis con causa explícita.** "Treatment subirá la métrica" sin causa no es hipótesis.
4. **Una sola métrica primaria.** Si hay 2-3 candidates, elegir la más alineada con outcome de negocio. Las otras pasan a secundarias.
5. **Guardraíles obligatorios.** Sin ellos, una primaria que sube puede esconder daño.
6. **Calcular sample size con calculadora estándar.** No improvisar; documentar inputs.
7. **Decision rules ANTES de ver resultados.** Si decides el shipping criteria después, hay sesgo.
8. **Coordinación con engineering** documentada — quién implementa, quién valida.
9. **Marcar `[BASELINE PENDIENTE]`** si no hay valor inicial confirmado, `[INSTRUMENTAR]` los eventos pendientes, `[QA PENDIENTE]` la validación pre-lanzamiento.
10. **Guardar** en `<proyecto>/product/metrics/analysis/<experiment-slug>-plan.md`. El report posterior es `<experiment-slug>-report.md`.
11. **Reportar** al usuario: ruta, sample size, duración estimada, riesgos top, decisión esperada.

---

## Restricciones

- **No correr experimento sin sample size suficiente.** Ruido > señal.
- **No mirar resultados antes de la duración mínima** (14 días típico). El peeking es la fuente nº1 de falsos positivos.
- **No cambiar decision rules a mitad de experimento.** Lo decidido antes manda.
- **No ignorar guardraíles** aunque la primaria gane.
- **No omitir SRM check.** Asignación rota = experimento inválido.
- **No declarar ganador con p > 0.05** salvo justificación adicional (efecto grande, segmento clave).
- **No shippar sin verificar** que el efecto se sostiene en cohorte estable post-novedad.
- **No publicar resultados** sin segmentación por geo/plan/cohorte cuando es relevante.
- Aplican las reglas de output de `_shared/output-rules.md`.
