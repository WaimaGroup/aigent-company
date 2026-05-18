---
name: "sales-discovery-call"
user-invocable: true
description: >
  Skill for producing a structured discovery call script and framework for B2B
  sales: opening, situation questions, problem exploration, implication, payoff,
  qualification (BANT/MEDDIC/SPICED), red flags, next-step. Output is a reusable
  script per ICP/use case plus a one-page debrief template.
---

# Skill: Discovery Call

**Entregable:** archivo `.md` con script de discovery call + framework de cualificación + plantilla de debrief, listo para ser usado por SDRs o AEs en llamadas con prospectos. Vive en `<proyecto>/sales/playbooks/discovery-call-<icp-slug>.md` (o `<proyecto>/sales/scripts/...` según preferencia del proyecto).

---

## Cuándo usar esta skill

- Se prepara una nueva iniciativa de outbound y se necesita script de discovery reproducible entre reps.
- Hay que reescribir el script existente porque cambió el ICP, el producto o el motivo de venta.
- Se onboarda un nuevo rep y necesita el script canónico de discovery.
- El equipo nota que las discovery calls están dejando dudas sin resolver y hay que estructurarlas mejor.

**Cuándo NO usar:**

- Para una demo del producto (eso es script de demo, otra fase).
- Para qualifying call de 5 minutos (eso es un script más corto, "BANT-only").
- Para negotiation call (otra fase del proceso).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| ICP | ¿Cuál es el perfil del cliente ideal? (industria, tamaño, rol) |
| Producto / propuesta | ¿Qué vendemos exactamente? ¿Cuál es el value-prop core? |
| Pain points típicos | ¿Cuáles son los 3-5 problemas más recurrentes que resolvemos? |
| Duración | ¿Cuánto dura la llamada típicamente? (30 min / 45 min / 60 min) |
| Framework de cualificación | ¿BANT / MEDDIC / SPICED / BANT modificado / propio? |
| Outcome esperado | ¿Qué cualifica como "buena discovery"? (next meeting agendada, demo agendada, propuesta solicitada) |
| Idioma | ¿Español, inglés, ambos? |
| Antecedentes | ¿Hay script previo? ¿Qué funciona / qué no? |

---

## Plantilla del entregable

Nombre del archivo: `discovery-call-<icp-slug>.md`.

```markdown
---
type: "discovery-call"
icp: "<perfil del cliente ideal>"
duration_min: 45
framework: "BANT | MEDDIC | SPICED | custom"
status: "draft | approved | in-use"
date: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<rol/persona>"
language: "es | en"
---

# Discovery Call Script — <ICP> · <duración>

> **Audiencia:** SDRs y AEs que conducen primeras llamadas con <ICP>. Adaptar el script en vivo según fluya la conversación; no leerlo verbatim.

## 0. Objetivo de la llamada

> 2-3 líneas. Qué cualifica como "buena discovery". Outcome accionable.

**Outcome ideal:**
- ✅ Identificar pain confirmado + payoff cuantificado + decisor identificado + next step agendado.

**Outcome aceptable:**
- ✅ Identificar pain potencial + agendar segunda call con quien decide.

**No outcome (no es buena discovery):**
- ❌ Hablamos 45 min sin saber qué problema resuelven con nuestra solución.
- ❌ Hicimos demo improvisada porque no había script.

---

## 1. Antes de la llamada (5 min de prep)

- [ ] Revisar el perfil del prospecto en LinkedIn (cargo, antigüedad, posts recientes).
- [ ] Revisar la empresa: web, sector, tamaño, noticias recientes, financiación.
- [ ] Revisar cualquier intel previa (formulario rellenado, descargas, conversaciones previas).
- [ ] Anotar 2-3 hipótesis de pain points que esperaríamos en esta cuenta.
- [ ] Tener el CRM abierto para tomar notas.

---

## 2. Estructura de la llamada (45 min)

### 2.1 Apertura (3-5 min) — Build rapport + agenda

- Saludo cálido pero conciso.
- Confirmar tiempo disponible (¿"sigue siendo bueno 45 min"?).
- Pequeña charla relevante (algo concreto que viste de su LinkedIn o empresa, no clima).
- Agenda explícita: *"La idea para hoy es entender qué problema estáis intentando resolver, ver si tiene sentido lo que hacemos, y al final, si encaja, hablar de un siguiente paso. ¿Te suena bien?"*
- Permiso para tomar notas y grabar (si aplica).

**Frases ancla (adapter):**
- *"Antes de contarte nada de nuestro lado, prefiero entender qué hay en tu mundo. ¿Te parece bien?"*

---

### 2.2 Situation questions (5-7 min) — Contexto actual

> El estado actual. No saltar a problema sin entender contexto.

- *"Cuéntame cómo hacéis hoy <proceso relevante>."*
- *"¿Qué herramientas usáis para esto actualmente?"*
- *"¿Quién en tu equipo está implicado en este proceso?"*
- *"¿Cuándo empezasteis a hacer esto así? ¿Qué había antes?"*

**Objetivo:** entender la situación sin proyectar nuestra solución.

---

### 2.3 Problem questions (10-15 min) — Identificar pain

> El núcleo de la discovery. Pasar de situation a problema real.

- *"En esa forma de trabajar, ¿qué te frustra más?"*
- *"¿Qué intentasteis antes que no funcionó?"*
- *"¿Qué tendría que pasar para que <proceso> fuera <mejor / más rápido / más fiable>?"*
- *"Cuando esto falla, ¿qué consecuencias tiene?"*

**Anti-patterns a evitar:**
- ❌ Preguntar problemas guiados ("¿No tienes el problema de X?").
- ❌ Saltar a la solución antes de cuantificar el dolor.
- ❌ Aceptar "no tenemos problemas" sin profundizar.

**Frases ancla:**
- *"Cuéntame la última vez que <situación de pain>. ¿Qué pasó?"*
- *"Si esto sigue así durante 6 meses más, ¿qué impacto tendrá?"*

---

### 2.4 Implication / consequence (5-10 min) — Cuantificar el coste del problema

> El pain confirmado tiene un coste. El prospecto debe verlo claramente.

- *"¿Cuántas horas al mes os come este proceso?"*
- *"¿Qué le supone esto en €/$ aproximadamente?"*
- *"¿Cuántas personas están involucradas?"*
- *"¿Qué oportunidades dejáis pasar por no tener esto resuelto?"*

**Objetivo:** que el prospecto cuantifique el dolor mentalmente. Sin dolor cuantificado, no hay venta.

---

### 2.5 Payoff / vision (5-7 min) — Cómo se ve la solución

> Pasar de problema a "qué cambia si esto está resuelto".

- *"Si esto estuviera resuelto, ¿qué cambiaría en tu día a día?"*
- *"¿Qué KPI o métrica esperarías mover?"*
- *"¿Qué oportunidad podrías perseguir entonces?"*

**Solo aquí**, brevemente, introducir cómo nuestra solución encaja: *"Eso que describes es exactamente lo que <Producto> resuelve para empresas como <similar>."*

---

### 2.6 Cualificación (5-7 min) — BANT / MEDDIC / SPICED

> Antes de comprometerse a siguiente paso, validar fit comercial.

#### BANT

- **B**udget: *"¿Hay presupuesto asignado para esto este año?"* / *"¿Cómo se aprueban inversiones de este tipo en tu empresa?"*
- **A**uthority: *"¿Quién toma la decisión final?"* / *"¿Hay otros stakeholders que evaluarán esto?"*
- **N**eed: cubierto en sección 2.3-2.5.
- **T**iming: *"¿Cuál sería el horizonte ideal para tener esto en producción?"* / *"¿Hay alguna fecha límite (regulación, lanzamiento, fin de año)?"*

#### MEDDIC (alternativa para deals enterprise)

- **M**etrics: *"¿Qué métrica vamos a mover con esto?"*
- **E**conomic buyer: *"¿Quién firma el presupuesto?"*
- **D**ecision criteria: *"¿Cómo vais a evaluar las opciones?"*
- **D**ecision process: *"¿Cómo es el proceso de decisión típico para algo así?"*
- **I**dentify pain: cubierto.
- **C**hampion: *"¿Quién sería el principal usuario / aliado interno de algo así?"*

#### SPICED (alternativa moderna)

- **S**ituation, **P**ain, **I**mpact, **C**ritical event, **D**ecision.

> Adoptar **un** framework consistentemente — mezclar confunde al rep y al CRM.

---

### 2.7 Next step (3-5 min) — Cierre con commitment

> Toda buena discovery termina con un siguiente paso explícito y agendado.

**Opciones de next step (de mejor a peor):**

1. ✅ **Demo personalizada agendada** con <decisor + champion>, fecha confirmada en calendar.
2. ✅ **Segunda discovery con stakeholder adicional** (decisor que no estaba).
3. 🟡 **Send propuesta o material específico** + follow-up call agendada.
4. 🟡 **Confirmar interés y agendar revisión interna**.
5. ❌ "Te escribo la semana que viene" — vago, casi siempre acaba en churn de pipeline.

**Frase de cierre:**
- *"Basándome en lo que me has contado, creo que tiene mucho sentido enseñarte cómo <feature/use case específico> resuelve <pain específico que mencionaron>. ¿Te parece que agendemos <X> para <fecha>?"*

---

## 3. Después de la llamada (10-15 min de debrief)

### 3.1 Plantilla de debrief (rellenar en caliente, no esperar)

```markdown
## Discovery Debrief — <Empresa> · <YYYY-MM-DD>

**Asistentes:**
- Por el cliente: <nombres + roles>
- Por nosotros: <nombre rep>

**Pain confirmado:** <descripción factual, idealmente verbatim del cliente>

**Pain cuantificado:**
- <ej. "20h/mes perdidas en <proceso>" / "X€ al año en coste oportunidad" / "1 incidencia crítica al mes">

**Vision / payoff:**
- <qué esperan que pase si se resuelve>

**Cualificación (BANT/MEDDIC/SPICED):**
- **Budget:** <estado>
- **Authority:** <decisor identificado / no identificado>
- **Need:** <fuerza del pain: alta / media / baja>
- **Timing:** <horizonte>
- (otros campos según framework)

**Red flags detectadas:**
- <ej. "no había podido ver al decisor, solo al usuario">
- <ej. "presupuesto del año ya cerrado, mejor revisar en Q4">

**Next step agendado:**
- <qué, con quién, fecha>

**Score de cualificación (1-5):**
- <evaluación honesta del rep>

**Notas adicionales:**
- <cualquier intel relevante para el equipo>

**Próximas acciones (CRM):**
- [ ] Actualizar cuenta y oportunidad en CRM
- [ ] <Acción 1>
- [ ] <Acción 2>
```

---

## 4. Red flags durante la llamada (señales de no-fit o bajo cualif.)

> Si dos o más de estas señales aparecen, recalibrar la prioridad del deal.

- 🚩 No quieren cuantificar el problema ("es difícil decir cuánto nos cuesta").
- 🚩 No hay timing concreto ("algún día queremos resolverlo").
- 🚩 No conocen al decisor o no se les puede acceder.
- 🚩 Comparan con muchos competidores sin criterios claros.
- 🚩 Quieren la solución completamente gratuita / con condiciones imposibles.
- 🚩 Hablan solo de features, nunca de problema o impacto.

---

## 5. Tipos de pain — adaptación según ICP

> Pain points típicos del ICP <descripción>. Adaptar las preguntas de la sección 2.3 según el dominio.

| Pain típico | Preguntas para profundizar | Cómo cuantificarlo |
|---|---|---|
| <ej. "tiempo perdido en X"> | <preguntas específicas> | <métrica esperable> |
| <ej. "errores en proceso Y"> | | |
| <ej. "falta de visibilidad sobre Z"> | | |

---

## 6. Recursos para el rep

- **Battle cards** de competidores principales: <link a `<proyecto>/sales/playbooks/battle-cards/`>
- **Case studies** relevantes: <link a `<proyecto>/marketing/posts/<case-study-slug>/`>
- **Pitch deck** completo: <link>
- **One-pager** del producto: <link>

---

## 7. Histórico de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| <vX.Y> | <YYYY-MM-DD> | <cambios> |
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin ICP claro y pain typical, parar.
2. **Adaptar las preguntas al ICP.** Las preguntas genéricas son ruido; el script gana cuando las preguntas son del dominio real del prospecto.
3. **Elegir un solo framework de cualificación** (BANT / MEDDIC / SPICED) y aplicarlo consistentemente. Mezclar confunde.
4. **Validar duración:** sumar tiempos de cada sección. Si excede, recortar situation o implication.
5. **Producir la plantilla de debrief con campos exactos** que se sincronicen con el CRM. Sin esto, el debrief no se hace.
6. **Identificar red flags específicas del ICP** (no genéricas).
7. **Enlazar recursos de apoyo** (battle cards, case studies, pitch) que el rep pueda consultar pre-llamada.
8. **Marcar `[ADAPTAR AL ICP]`** las preguntas que necesitan más concreción según el dominio.
9. **Guardar** en `<proyecto>/sales/playbooks/discovery-call-<icp-slug>.md`.
10. **Reportar** al usuario: ruta, framework de cualificación elegido, próxima revisión recomendada.

---

## Restricciones

- **No incluyas preguntas guiadas (leading).** "¿No te frustra el problema de X?" se reformula a "¿qué te frustra de <proceso>?".
- **No saltes a solución** en la sección de problem questions. Aguantar la curiosidad.
- **No mezcles frameworks.** BANT o MEDDIC o SPICED. Uno.
- **No prometas demo en discovery.** La demo es otra fase; mezclar mata la calidad de ambas.
- **No olvides el debrief.** Sin debrief no hay aprendizaje del equipo.
- **No copies scripts de internet sin adaptar al ICP.** Los scripts genéricos suenan a televenta.
- Aplican las reglas de output de `_shared/output-rules.md`.
