---
name: "usability-test-plan"
description: >
  Skill for producing a structured usability test plan: hypothesis, tasks (with
  success criteria + metrics per task), participants profile and recruitment,
  format (moderated/unmoderated, in-person/remote), session script, debrief
  template, synthesis approach. Pure UX research methodology.
---

# Skill: Usability Test Plan

**Entregable:** archivo `.md` con plan completo de usability test (preparación, ejecución, análisis), listo para conducir sesiones con participantes. Vive en `<proyecto>/design/ux-research/usability-tests/<scope-slug>-plan.md`. El report posterior es `<scope-slug>-report-<YYYY-MM>.md`.

---

## Cuándo usar esta skill

- Hay que evaluar la usabilidad de una interfaz existente o prototipo.
- Antes de un lanzamiento, validar que el flow funciona con usuarios reales.
- Tras detectar fricción cuantitativa (drop-off, errores), validar las hipótesis con usuarios cualitativos.
- Decisión entre dos variantes de diseño que requiere validación con usuarios.

**Cuándo NO usar:**

- Para entrevistas exploratorias de problema (es `user-interview-script` — foco distinto).
- Para card sorting / tree testing (formato distinto aunque relacionado).
- Para A/B test cuantitativo (es `experiment-design`).
- Para encuestas de satisfacción (eso es un survey, no usability test).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope | ¿Qué se prueba? (flow concreto, pantalla, comparativa de variantes) |
| Pregunta de research | ¿Qué decisión va a desbloquear este test? |
| Hipótesis | ¿Qué esperas que pase? |
| Stage del producto | Interfaz actual / prototype hi-fi / prototype lo-fi / wireframes |
| Participantes esperados | Cuántos (típicamente 5-8) y qué perfil (existing users, prospects, nuevos) |
| Formato | Moderado en vivo / no-moderado async / presencial / remoto |
| Duración por sesión | 30 / 45 / 60 min |
| Métricas a capturar | Task completion, time-on-task, error count, SUS, satisfacción cualitativa |
| Reclutamiento | ¿Tenemos base de usuarios? ¿Hace falta servicio de reclutamiento? |
| Incentivo | ¿Tarjeta regalo, créditos del producto, donación? |
| Plazo | Cuándo se necesitan los hallazgos |

---

## Plantilla del entregable

Nombre del archivo: `<scope-slug>-plan.md`.

```markdown
---
type: "usability-test-plan"
scope: "<descripción>"
research_question: "<pregunta principal>"
status: "draft | approved | recruiting | running | completed"
participants_target: 6
sessions_format: "moderated-remote | moderated-in-person | unmoderated-async"
duration_min: 45
start_date: "YYYY-MM-DD"
end_date: "YYYY-MM-DD"
researcher: "<nombre>"
recording: true | false
incentive: "<descripción>"
language: "es | en"
---

# Usability Test Plan — <Scope>

## 0. Resumen

> 4-6 líneas. Qué probamos, con quién, qué esperamos aprender.

**Pregunta principal:** <una línea>

**Hipótesis principal:** <qué esperamos que pase y por qué>

**Decisión que se desbloquea:** <ej. iterar diseño, shippear, parar lanzamiento>

---

## 1. Objetivo y hipótesis

### Pregunta de research

> Una sola pregunta clara. Sin esto, el test no informa decisiones.

**¿<Pregunta>?**

### Hipótesis

- **H1 (primaria):** <descripción + dirección esperada>
- **H2 (secundaria):** <descripción>
- **H3 (riesgo):** <qué podría pasar mal>

### Decisiones por escenario

| Resultado del test | Decisión |
|---|---|
| Hipótesis primaria confirmada | <Shippear / iterar / etc.> |
| Hipótesis primaria refutada | <Rediseño / cancelar / etc.> |
| Resultados ambiguos | <Más research / decidir con leadership> |

---

## 2. Participantes

### Perfil

| Criterio | Inclusión | Exclusión |
|---|---|---|
| Rol / tipo de usuario | <ej. PMs en empresas 10-200 empleados> | <ej. Engineers, recién incorporados> |
| Experiencia con el producto | <existing users con > 3 meses / nuevos / mix> | |
| Sector / vertical | <ej. SaaS B2B> | |
| Geografía | <ej. España / UE> | |
| Idioma | <español nativo / inglés> | |

### Tamaño de muestra

- **N target:** <5-8 sesiones>
- **Justificación:** 5 usuarios suelen detectar ~80% de problemas de usabilidad (regla de Nielsen). Más para mayor confianza o si la audiencia es muy heterogénea.

### Reclutamiento

- **Fuente:** <base de usuarios actuales / lista de prospects / servicio externo (UserInterviews, Respondent)>
- **Owner:** <persona>
- **Plazo:** <X días antes del test>
- **Screener:** ver Anexo I.
- **Slots ofrecidos:** <fechas y horas disponibles>

### Incentivo

- **Tipo:** <ej. tarjeta Amazon 50€ / 1 mes de Pro / donación a ONG elegida>
- **Entrega:** tras completar la sesión, no antes.

---

## 3. Formato y logística

### Formato

- **Modalidad:** <moderado remoto via Zoom / unmoderado en UserTesting / presencial en oficina>
- **Duración:** <30/45/60 min>
- **Grabación:** <sí — con consentimiento del participante / no>
- **Compartición de pantalla:** sí (participante comparte la suya con el prototipo / con el producto live)
- **Tomadora de notas separada:** sí / no

### Herramientas

- **Plataforma de sesión:** <Zoom / Google Meet>
- **Prototipo / app:** <link al Figma / staging URL>
- **Plataforma de testing (si unmoderated):** <Maze / UserTesting / Lookback>
- **Grabación y storage:** <Lookback / Notion / Drive con acceso restringido>

### Checklist pre-sesión (5 min antes)

- [ ] Confirmar grabación con participante.
- [ ] Verificar share-screen + audio funcionan.
- [ ] Tener tasks abiertas en pestaña separada del moderador.
- [ ] Notes doc abierto.
- [ ] Incentivo listo para entregar al cierre.

---

## 4. Estructura de la sesión

> 45 min de ejemplo. Adaptar duración.

### 4.1 Apertura — 5 min

- Bienvenida, presentación.
- Confirmar grabación (verbal explícito).
- Establecer expectativas: *"No estamos evaluándote a ti — estamos evaluando el producto. Si algo es confuso, es problema nuestro de diseño, no tuyo."*
- *"Por favor, piensa en voz alta mientras navegas: qué ves, qué intentas hacer, qué te llama la atención."*

### 4.2 Background — 5 min

- *"Cuéntame brevemente qué haces y qué herramientas usas hoy para <tema>."*
- 2-3 preguntas para entender contexto sin sesgar el test.

### 4.3 Tasks — 25-30 min

> 3-5 tasks. Cada una con criterio de éxito + métricas a capturar.

#### Task 1 — <Nombre breve>

**Setup contextual:** *"Imagina que <situación>. Tu objetivo es <outcome>."*

**Tarea exacta a leer:** *"<Tarea formulada como objetivo, no como pasos>."*

**Criterio de éxito:**
- ✅ Completa en menos de <X min> sin ayuda significativa.
- 🟡 Completa con 1-2 ayudas pequeñas o ≥ <X min>.
- ❌ No completa en <Y min> o abandona.

**Métricas a capturar:**
- Completion (sí/no/con ayuda)
- Time-on-task
- Errors (clicks erróneos, idas y venidas)
- Comentarios verbales relevantes (verbatim)
- Escala de facilidad post-tarea (1-5): *"Del 1 al 5, ¿cómo de fácil te resultó?"*

**Probes (preguntas de seguimiento, solo si necesario):**
- *"¿Qué esperabas que pasara cuando hiciste <acción>?"*
- *"¿Qué te llamó la atención de esta pantalla?"*

#### Task 2 — <Nombre>

(misma estructura)

#### Task 3 — <Nombre>

(misma estructura)

> **Anti-patterns en redacción de tasks:**
> - ❌ Tasks que dan pistas sobre dónde hacer click ("Ve al menú de la izquierda y haz click en X").
> - ❌ Tasks que mencionan elementos UI específicos ("Click en el botón azul").
> - ❌ Tasks que son preguntas ("¿Crees que es fácil?").
> - ✅ Tasks formuladas como objetivo del usuario ("Tu jefe te pide reactivar a un usuario suspendido. Hazlo.").

### 4.4 SUS — System Usability Scale — 3 min

> 10 preguntas estándar con escala Likert 1-5. Da un score 0-100 comparable.

(O usar versión corta — 5 preguntas — si el tiempo aprieta.)

### 4.5 Debrief / preguntas abiertas — 3-5 min

- *"¿Cuál fue la parte más fácil y la más difícil?"*
- *"Si pudieras cambiar UNA cosa, ¿qué sería?"*
- *"¿Cuánta confianza tendrías para usar esto en tu día a día? (1-5)"*
- *"¿Hay algo que no te he preguntado y que quieras compartir?"*

### 4.6 Cierre — 2 min

- Agradecer.
- Explicar próximos pasos (¿comunicarán resultados al participante?).
- Entregar incentivo.
- Confirmar que pueden contactar si tienen feedback adicional.

---

## 5. Plantilla de debrief (en caliente)

> Rellenar inmediatamente al cerrar cada sesión, mientras la memoria es fresca.

```markdown
## Sesión <N> — <Fecha> — Participante <Pseudónimo PXX>

**Perfil:** <breve, anonimizado>

**Tareas:**

| Task | Completion | Time | Errors | Ease score |
|---|---|---|---|---|
| T1 | ✅ | 2:34 | 1 | 4 |
| T2 | 🟡 con ayuda | 5:12 | 3 | 2 |
| T3 | ❌ | abandoned 7:00 | 5 | 1 |

**SUS score:** <0-100>

**Hallazgos clave (verbatim si posible):**
- <Verbatim relevante 1>
- <Verbatim 2>
- <Observación factual>

**Sorpresas:**
- <Lo que no esperaba>

**Hipótesis emergentes:**
- <Nuevas hipótesis a explorar>

**Severidad de problemas:**
- 🔴 <Problema crítico detectado>
- 🟠 <Problema mayor>
- 🟡 <Problema menor>
```

---

## 6. Análisis post-sesiones — proceso

### Síntesis cualitativa

1. **Affinity mapping:** agrupar hallazgos de todas las sesiones por patrón.
2. **Identificar patrones (≥3 participantes confirman):** son hallazgos sólidos.
3. **Identificar señales débiles (1-2 participantes):** se anotan como hipótesis, no como conclusiones.
4. **Verbatim preservados:** cada hallazgo con al menos una cita textual.

### Síntesis cuantitativa

| Métrica | Valor (promedio) | Desviación |
|---|---|---|
| Completion rate Task 1 | <%> | |
| Time-on-task Task 1 | <min:seg> | |
| Errors Task 1 | <promedio> | |
| Ease score Task 1 | <1-5> | |
| SUS score global | <0-100> | |

**Interpretación SUS:**
- > 80: excelente.
- 68-80: bueno (68 es la media benchmark).
- 50-68: pasable, pero hay problemas.
- < 50: usabilidad pobre.

### Problemas priorizados

| ID | Problema | Severidad | Participantes afectados | Recomendación |
|---|---|---|---|---|
| U-1 | <descripción> | 🔴 Crítico | 5/6 | <acción> |
| U-2 | | 🟠 Mayor | 3/6 | |
| U-3 | | 🟡 Menor | 2/6 | |

---

## 7. Outputs y next steps

- **Report final:** `<scope-slug>-report-<YYYY-MM>.md` en la misma carpeta.
- **Presentación a stakeholders:** <fecha + audiencia>.
- **Conexión a roadmap / diseño:**
  - Hallazgos 🔴 → iteración inmediata con `design-ui`.
  - Hallazgos 🟠 → priorizar en próximo sprint.
  - Hallazgos 🟡 → backlog.

---

## 8. Anexos

### Anexo I — Screener para reclutamiento

> Preguntas para validar fit antes de agendar al participante.

```
1. ¿Cuál es tu rol actual?
   (filtro: incluir PMs en empresas SaaS)

2. ¿Cuántos empleados tiene tu empresa?
   (filtro: 10-200)

3. ¿Usas <Producto> actualmente? Si sí, ¿cuánto tiempo llevas usándolo?
   (filtro: > 3 meses)

4. ¿Has participado en otro estudio de usabilidad con nosotros en los últimos 6 meses?
   (filtro: NO — evitar profesionales de research)
```

### Anexo II — Consentimiento informado

> Texto leído al participante al inicio + casilla en formulario previo.

*"Esta sesión será grabada (video + audio + pantalla) para análisis interno de nuestro equipo de research. La grabación no se compartirá fuera del equipo. Tus datos personales se tratan según nuestra política de privacidad. Puedes solicitar la eliminación de la grabación en cualquier momento. ¿Aceptas?"*

### Anexo III — Tasks completas con setup

(versión completa para imprimir / tener al lado durante la sesión)

### Anexo IV — Reference benchmarks

- SUS medio en industria: <enlace a estudio>
- Tiempo medio típico para tareas similares en productos comparables: <referencia>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin pregunta de research clara y N decidido, parar.
2. **Definir hipótesis y decisión-por-escenario** ANTES de las tasks. Sin decisión declarada, los hallazgos no informan acción.
3. **Diseñar tasks como objetivos del usuario**, no como pasos. Si la task menciona elementos UI, sesga el resultado.
4. **5-8 participantes** es default. Menos detecta menos; más raramente justifica el coste.
5. **Plantilla de debrief en caliente.** Sin esto, la síntesis posterior depende de la memoria — perdemos verbatim.
6. **SUS para benchmarking.** Da un score comparable con industria y con tests propios futuros.
7. **Distinguir patrón (≥3 confirman) vs señal débil (1-2).** Confundirlos lleva a iterar sobre opiniones individuales.
8. **Severidad explícita** en los problemas detectados.
9. **Conectar hallazgos a próximas acciones.** Sin esto, el test fue evento, no operativo.
10. **Marcar `[ADAPTAR AL PRODUCTO]`** las tasks que requieren contextualización al dominio real, `[BASELINE PENDIENTE]` métricas comparativas sin referencia.
11. **Guardar** plan en `<proyecto>/design/ux-research/usability-tests/<scope-slug>-plan.md`. El report posterior a las sesiones en `<scope-slug>-report-<YYYY-MM>.md`.
12. **Reportar** al usuario: ruta, N target, fecha de sesiones, decisión que se desbloquea.

---

## Restricciones

- **No formules tasks con instrucciones UI** ("haz click en el menú X"). Tasks son objetivos del usuario.
- **No conduzcas el test sin permiso explícito de grabación.** Confirmación verbal al inicio + escrita en consent.
- **No interrumpas al participante mientras navega.** Probes solo cuando hay silencio o tras un step crítico.
- **No saques conclusiones con n=1 sin marcarlo.** Patrón requiere ≥3; señales débiles van etiquetadas.
- **No omitas el screener.** Reclutar sin filtrar = datos sesgados.
- **No publiques nombres reales de participantes** en reports. Usar pseudónimos (P1, P2, ...).
- **No prometas a participantes** que verán el resultado final salvo que vayas a cumplirlo.
- **No copies plan de test de otro producto sin adaptar tasks.** Cada producto tiene sus flows.
- Aplican las reglas de output de `_shared/output-rules.md`.
