---
name: "exit-interview"
description: >
  Skill for conducting and documenting an exit interview: voluntary or
  involuntary separation, structured questions, anonymized synthesis, learnings
  for retention, action items for the team/manager/company. Confidential and
  designed to extract honest, actionable insight without burning bridges.
---

# Skill: Exit Interview

**Entregable:** archivo `.md` con guion de entrevista + plantilla de síntesis + plan de acción derivado. Vive en `<proyecto>/hr/evaluation/exits/<persona-slug>-exit-<YYYY-MM>.md`. **Confidencial alto.**

---

## Cuándo usar esta skill

- Empleado/a comunica su salida voluntaria.
- Salida involuntaria (despido, no confirmación tras período de prueba, terminación de contrato) — exit interview opcional pero recomendable cuando viable.
- Fin de contrato temporal o internship.
- Cambio interno significativo (movimiento entre departamentos / países) — exit interview "soft" del equipo previo.

**Cuándo NO usar:**

- Para performance review (otro formato).
- Para 1:1 normal (otro formato).
- Cuando la salida es por causa muy adversa (acoso, conflicto grave) — entonces es proceso especial con legal/HR senior, no exit interview estándar.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Persona | Nombre, rol, equipo, tiempo en la empresa, manager actual |
| Tipo de salida | Voluntaria / Involuntaria / Fin de contrato / Movimiento interno |
| Fecha de salida confirmada | Last day |
| Próximo destino | ¿Otra empresa, freelance, descanso, otro? (solo si la persona lo comparte) |
| Razón comunicada | Lo que dijo cuando notificó (puede no coincidir con la razón real — exit profundiza) |
| Quién conduce | Manager, HR, ambos por separado |
| Formato | Presencial / videollamada / asíncrona escrita |
| Grabación | ¿Sí (con consentimiento) o solo notas? |
| Audiencia del report | Manager / HR / People analytics / leadership |

---

## Plantilla del entregable

Nombre del archivo: `<persona-slug>-exit-<YYYY-MM>.md`.

```markdown
---
type: "exit-interview"
person: "<Nombre>"
role: "<Rol>"
team: "<Equipo>"
manager: "<Manager>"
tenure_months: <N>
exit_type: "voluntary | involuntary | contract-end | internal-move"
last_day: "YYYY-MM-DD"
interview_date: "YYYY-MM-DD"
interviewer: "<HR persona / Manager / both>"
format: "in-person | video | async-written"
recorded: true | false
status: "scheduled | done | synthesized | archived"
confidentiality: "high — HR + manager + leadership per persona's consent"
---

# Exit Interview — <Nombre> · <Tipo de salida>

> **Confidencial.** Compartir solo con manager + HR + leadership designado, y según el nivel de consentimiento que dé la persona al cierre.

## 0. Contexto de la salida

> 3-5 líneas. Tipo, momento, razón comunicada, qué esperamos aprender.

**Tipo:** <voluntaria / involuntaria>

**Razón inicial declarada:** <lo que dijo cuando notificó>

**Hipótesis de la razón real (a validar en la entrevista):** <lo que sospecha manager/HR>

---

## 1. Antes de la entrevista (5-10 min de prep)

- [ ] Revisar el journey de la persona en la empresa: hires date, promociones, equipos, performance reviews.
- [ ] Revisar 1:1s recientes (si las notas están disponibles).
- [ ] Identificar 2-3 hipótesis sobre la razón real de la salida.
- [ ] Preparar mensaje de apertura cálido y honesto.
- [ ] Garantizar confidencialidad: claridad sobre qué se compartirá, con quién, en qué formato.

---

## 2. Apertura — 5 min

> Tono: cálido, sin agenda oculta. La persona ya se va, no hay nada que ganar con hostilidad o complacencia.

**Frase de apertura:**

> *"Antes que nada, gracias por tomarte este rato. Sé que tienes la cabeza en mil cosas con la transición. La idea de esta conversación es honesta y simple: queremos aprender de tu experiencia aquí para mejorar para los que se quedan y los que vengan. No hay respuestas correctas ni incorrectas, y lo que digas no afecta a nada (carta de referencia, finiquito, etc., todo eso está ya gestionado independientemente). ¿Te parece bien si grabamos / tomo notas?"*

**Confirmar:**
- Consentimiento de grabación o notas.
- Confidencialidad: con quién se comparte y en qué formato (anónimo en síntesis al equipo, atribuido si lo permite).
- Que la persona puede no responder a cualquier pregunta y que puede pedir off-the-record.

---

## 3. Preguntas core (estructura sugerida — adaptar)

### 3.1 Razón de la salida (10-15 min)

- **"¿Qué te llevó a tomar la decisión de irte?"**
  - (Si voluntaria) Empezar por la pregunta abierta. La razón real suele emerger tras la primera respuesta superficial.
- **"¿En qué momento empezaste a pensar en irte?"**
  - El "cuándo" revela qué evento detonó la decisión.
- **"¿Hubo algo concreto que pudiéramos haber hecho para que te quedaras?"**
  - Si la respuesta es "nada" — probablemente lo decidió hace tiempo. Si es algo concreto — aprendizaje valioso.
- **"¿Cuál fue el momento más frustrante de tu tiempo aquí?"**
- **"¿Y el mejor?"**

### 3.2 Sobre el trabajo y el equipo (10 min)

- **"¿Cómo describirías tu experiencia trabajando en el equipo?"**
- **"¿Sientes que tu trabajo era reconocido y valorado?"**
- **"¿Tenías la autonomía y los recursos que necesitabas?"**
- **"¿Cómo era la relación con tu manager? ¿Qué funcionaba bien? ¿Qué cambiarías?"**
- **"¿Hubo alguna conversación que sentiste que no se tuvo y debió tenerse?"**

### 3.3 Sobre la empresa y la cultura (10 min)

- **"¿Qué crees que esta empresa hace bien que otras no hacen?"**
- **"¿Qué crees que esta empresa hace mal o donde tiene un agujero grande?"**
- **"¿Recomendarías esta empresa a un amigo? ¿Por qué sí o por qué no?"**
- **"¿Has sentido en algún momento que la cultura era diferente a la que se promete en el hiring?"**

### 3.4 Sobre el rol y el growth (5-10 min)

- **"¿Sentías que estabas creciendo profesionalmente?"**
- **"¿Tu rol coincidió con lo que esperabas cuando firmaste?"**
- **"¿Hubo oportunidades que pediste y no se materializaron?"**

### 3.5 Sobre próximos pasos (5 min)

> Solo si la persona lo comparte; no presionar.

- **"¿Qué vas a hacer ahora? ¿Qué te atrae de tu próximo paso?"**
- **"¿Hay algo del próximo destino que aquí debería existir y no existe?"**

### 3.6 Pregunta final abierta (5 min)

- **"¿Hay algo que no te he preguntado y que crees que sería importante que sepamos?"**
- **"Si tuvieras la oportunidad de cambiar UNA cosa de la empresa con una varita mágica, ¿qué sería?"**

---

## 4. Cierre — 3 min

- Agradecer la honestidad.
- Reconfirmar confidencialidad y cómo se compartirá:
  - Síntesis anónima → people analytics y leadership.
  - Patrones detectados → equipo cuando hay 3+ exits con el mismo señalamiento.
  - Si la persona lo permite explícitamente, citas directas (atribuidas o no).
- Preguntar si está dispuesta a:
  - Ser referencia para futuros candidatos (raro pero valioso).
  - Volver a conversar en 6-12 meses (alumni network).
  - Dejarse contactar si tenemos preguntas de seguimiento.
- Desear éxito sinceramente.

---

## 5. Síntesis (rellenar inmediatamente después)

### 5.1 Razón real (mejor interpretación a la luz de la conversación)

> Puede coincidir con la razón inicial declarada o ser distinta. Aplicar criterio.

- **Razón principal:** <una línea>
- **Factores contribuyentes:** <listado>

### 5.2 Categorización (para people analytics agregado)

> Etiquetar la salida en categorías estandarizadas para detectar patrones en el agregado.

- [ ] Falta de growth / promotion
- [ ] Compensación insuficiente vs mercado
- [ ] Relación con manager
- [ ] Carga de trabajo / burnout
- [ ] Cultura / values mismatch
- [ ] Producto / dirección de empresa
- [ ] Oferta externa con mayor scope / interés
- [ ] Razones personales (mudanza, salud, familia)
- [ ] Cambio de carrera fuera del sector
- [ ] Fit del rol (rol no era lo esperado)
- [ ] Conflicto con peer / equipo
- [ ] Otro: <especificar>

### 5.3 Hallazgos relevantes (verbatim cuando posible)

> 3-5 puntos clave. Citas textuales con consentimiento.

- <Hallazgo 1>
- <Hallazgo 2>
- <Hallazgo 3>

### 5.4 Recomendaciones

> Acciones concretas para manager / equipo / empresa derivadas de esta conversación.

| Acción | Owner | Plazo | Razón |
|---|---|---|---|
| <ej. revisar career framework de rol X> | <Head of People> | <Q+1> | Hallazgo de growth bloqueado |
| <ej. ajustar carga del equipo durante hiring> | <Manager> | inmediato | Hallazgo de burnout |
| <ej. revisar comp band de rol Y> | <People Ops> | <Q+1> | Persona se va por oferta significativamente superior |

### 5.5 Tipo de salida (a efectos de tracking)

- **Regrettable** — la empresa hubiera querido mantener a esta persona.
- **Non-regrettable** — fit problemático o performance issues.
- **Neutral** — circunstancias personales / cambio de carrera.

---

## 6. Permisos otorgados por la persona

- [ ] Síntesis anónima a leadership: <Sí / No>
- [ ] Citas anonimizadas en patrones agregados: <Sí / No>
- [ ] Citas atribuidas (con nombre): <Sí / No>
- [ ] Recontacto en 6-12 meses (alumni): <Sí / No>
- [ ] Disponible como referencia para candidatos similares: <Sí / No>

---

## 7. Tracking agregado (responsabilidad de people analytics)

> Esta sección NO se rellena en este documento; alimenta el agregado de exits.

- Categoría principal: <ver 5.2>
- Tenure al salir: <N meses>
- Tipo (regrettable / non-regrettable / neutral)
- Próximo destino (industria, tipo de empresa)

---

## 8. Histórico / next steps

| Fecha | Acción | Por |
|---|---|---|
| YYYY-MM-DD | Entrevista realizada | <interviewer> |
| YYYY-MM-DD | Síntesis revisada con manager | |
| YYYY-MM-DD | Recomendaciones compartidas con leadership | |
| YYYY-MM-DD | Acciones acordadas implementadas | |

---

## 9. Anexos

- Notas crudas / transcripción (si hay): <link, alta confidencialidad>
- Performance reviews previas: <link>
- 1:1s recientes: <link>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin tipo de salida claro y manager involucrado, parar.
2. **Preparar 5-10 min antes**: revisar historia de la persona, hipótesis de la razón real, mensaje de apertura.
3. **Apertura cálida y transparente.** Confidencialidad explícita; sin esto, las respuestas serán superficiales.
4. **Preguntas abiertas primero, específicas después.** No empezar con "¿Te vas por X razón concreta?".
5. **Tolerar silencios.** Lo más valioso suele emerger tras un silencio incómodo.
6. **No defender la empresa durante la entrevista.** Es momento de escuchar, no de explicar.
7. **Síntesis inmediata** (sección 5). En caliente, sin que la memoria filtre lo incómodo.
8. **Categorizar para people analytics agregado** — el patrón de exits es donde más valor hay (un exit individual es anécdota; 5 con la misma causa es señal).
9. **Acciones concretas con owner + plazo.** Sin acción, el exit interview es teatro.
10. **Permisos otorgados** documentados explícitamente — qué se puede compartir, con quién, en qué forma.
11. **Marcar `[CONFIDENCIAL]`** las secciones sensibles, `[OFF-THE-RECORD]` lo que la persona pidió no compartir.
12. **Guardar** en `<proyecto>/hr/evaluation/exits/<persona-slug>-exit-<YYYY-MM>.md` con permisos restringidos.
13. **Reportar** al usuario (manager / HR): ruta, categoría principal, top 3 hallazgos, acciones recomendadas.

---

## Restricciones

- **No promitas confidencialidad que no puedas mantener.** Documentar qué se comparte con quién al inicio.
- **No defendamos la empresa durante la conversación.** Escuchar es el job; defender no.
- **No publiques exits individuales fuera del círculo HR + manager + leadership designado.**
- **No infieras motivaciones sin evidencia conversacional.** Distinguir lo que la persona dijo de lo que tú interpretas.
- **No conviertas la sesión en interrogatorio.** Más preguntas no son mejor; más profundidad por menos preguntas, sí.
- **No omitas el feedback positivo.** Las cosas que funcionaron son tan informativas como las que no.
- **No olvides cerrar con respeto.** La persona aún es alumna; tratar bien también es employer brand.
- **No saltes la categorización.** Sin categorías agregables, cada exit se queda en anécdota.
- **No mezcles exit interview con conversación de despedida del equipo.** Son momentos distintos con propósitos distintos.
- Aplican las reglas de output de `_shared/output-rules.md`.
