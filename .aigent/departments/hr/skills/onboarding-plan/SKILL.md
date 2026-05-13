---
name: "onboarding-plan"
description: >
  Skill for producing a structured 30/60/90-day onboarding plan for a new hire:
  pre-boarding checklist, day-1 agenda, first-week meetings, buddy assignment,
  weekly milestones, probation evaluation criteria, and feedback checkpoints at
  30/60/90 days. Adapted by role and team but with a consistent backbone.
---

# Skill: Onboarding Plan

**Entregable:** archivo `.md` con plan completo de incorporación, listo para uso por el manager + buddy + HR + la propia persona que se incorpora. Vive en `<proyecto>/hr/onboarding/<persona-slug>-90day-plan.md` (o `<role>-90day-plan.md` para plantillas reutilizables del equipo).

---

## Cuándo usar esta skill

- Tras firma de oferta, hay que preparar la incorporación de una nueva persona.
- Hay que actualizar el plan estándar de un rol porque cambió el equipo / scope.
- Hay que documentar el plan post-hoc para casos donde se hizo informal y queremos formalizar.
- Onboarding de promociones internas con cambio de scope sustancial.

**Cuándo NO usar:**

- Para day-1 checklist puntual (es subset de este plan, sección 2).
- Para training de una herramienta concreta (eso es documentación de producto/herramienta).
- Para evaluación post-prueba (es sección 6 + documento separado de evaluación si confirma/extiende/no confirma).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Persona | Nombre, rol exacto, fecha de incorporación |
| Equipo | Equipo destino, manager directo |
| Modalidad | Presencial / remoto / híbrido. Ubicación física si aplica |
| Buddy | ¿Asignado? ¿Quién? |
| JD / hiring profile | ¿Existe? (link) — orienta los objetivos del onboarding |
| Outcome esperado a 90 días | ¿Qué debe ser capaz de hacer al cerrar el período de prueba? |
| Herramientas / accesos críticos | Más allá de los estándar (email, Slack), ¿qué requiere el rol? |
| Stakeholders clave | ¿Con quién debe conocerse en primera semana / mes? |
| Onboarding previo | ¿Hay plan estándar del equipo? ¿Onboardings anteriores como referencia? |

---

## Plantilla del entregable

Nombre del archivo: `<persona-slug>-90day-plan.md` (o `<role>-90day-plan.md` para plantilla reutilizable).

```markdown
---
type: "onboarding-plan"
person: "<Nombre>"
role: "<Rol>"
team: "<Equipo>"
manager: "<Manager>"
buddy: "<Buddy>"
start_date: "YYYY-MM-DD"
day_30: "YYYY-MM-DD"
day_60: "YYYY-MM-DD"
day_90: "YYYY-MM-DD"
modality: "in-person | remote | hybrid"
location: "<si aplica>"
status: "draft | approved | in-execution | completed"
confidentiality: "person + manager + HR + buddy"
---

# Plan de Onboarding — <Nombre> · <Rol> · 90 días

> Vigente desde <fecha de incorporación>. Manager owner: <Manager>. Buddy: <Buddy>.

## 0. Outcome esperado a 90 días

> 3-5 líneas que definen "éxito" del período de prueba.

**Al cerrar día 90, <Nombre> es capaz de:**
- <Outcome 1 medible>
- <Outcome 2 medible>
- <Outcome 3 medible>

**Y ha:**
- <Hito concreto: ej. completado un proyecto end-to-end>
- <Hito concreto: ej. conducido N reuniones con stakeholders>

---

## 1. Pre-boarding — antes del día 1

> Tareas que se hacen entre firma de oferta y fecha de incorporación. Owner: HR + IT + Manager.

### Checklist administrativo (HR)

- [ ] Contrato firmado y archivado.
- [ ] Datos para nómina recibidos.
- [ ] Documentación legal (DNI/NIE/Passport, número SS, etc.) recopilada.
- [ ] Bienvenida formal por email con info logística (dirección, horario primer día, contacto buddy).
- [ ] Welcome pack físico/digital preparado.

### Checklist IT / herramientas

- [ ] Equipo (laptop, monitor, periféricos) pedido y entregado el día 1 (o enviado a casa si remoto).
- [ ] Cuenta de email creada y configurada.
- [ ] Acceso a Slack/Teams + canales relevantes invitado.
- [ ] Acceso a herramientas básicas (Calendar, Drive/SharePoint, herramientas del rol).
- [ ] Tarjeta de acceso al edificio (si aplica).

### Checklist manager

- [ ] Agenda del día 1 y semana 1 preparada.
- [ ] Buddy confirmado.
- [ ] Equipo informado de la incorporación.
- [ ] Welcome message en Slack/all-hands.

---

## 2. Día 1 — agenda hora a hora

> El día 1 importa desproporcionadamente. Diseñar con detalle.

| Hora | Actividad | Quién |
|---|---|---|
| 09:00-09:30 | Bienvenida + tour físico (o llamada inicial si remoto) | Manager + Buddy |
| 09:30-10:30 | IT setup: laptop, accesos, contraseñas | IT |
| 10:30-11:00 | Café/break con buddy | Buddy |
| 11:00-12:00 | Reunión con manager: contexto del rol, expectativas del trimestre | Manager |
| 12:00-13:00 | Almuerzo con el equipo (presencial o virtual) | Equipo |
| 13:00-14:00 | Onboarding HR: políticas clave, handbook, beneficios | HR |
| 14:00-15:30 | Tour del producto + acceso a entornos | Buddy o tech lead |
| 15:30-16:30 | Lectura: PRD del equipo, último brief de roadmap, documentos clave | Self |
| 16:30-17:00 | Wrap-up del día 1 con manager: preguntas, expectativas día 2 | Manager |

**Materiales para el día 1:**
- Handbook del empleado.
- Organigrama del equipo + foto/perfil de cada persona.
- Lista de herramientas con su propósito.
- Links a documentos clave (PRD, roadmap, runbooks si software).

---

## 3. Primera semana — agenda diaria

| Día | Actividades principales | Outputs |
|---|---|---|
| Día 1 | Sección 2 | Setup completo, primeras conversaciones |
| Día 2 | 1:1 con cada miembro del equipo directo (30 min cada uno) | Conocimiento del equipo |
| Día 3 | Profundización en el producto / dominio (deep-dive con tech lead o producto) | Entiende qué hace cada parte |
| Día 4 | Primer "shadow" de una reunión recurrente del equipo + lectura técnica | Contexto operativo |
| Día 5 | Retro del día con manager + plan semana 2 | Plan ajustado |

**Meetings recurrentes a las que se incorpora desde semana 1:**
- <Stand-up diario / weekly / 1:1 con manager>

---

## 4. Plan 30/60/90 — objetivos por etapa

### Días 1-30: Aprender

**Tema:** absorber contexto. No se espera output significativo.

**Objetivos:**
- Conocer al equipo y a stakeholders clave (lista de meetings 1:1).
- Entender el producto / dominio / cliente tipo.
- Configurar entorno de trabajo y dominar herramientas básicas.
- Identificar 2-3 áreas donde puede aportar a corto plazo.
- Primera contribución pequeña pero real (PR pequeño, copy revisado, ticket cerrado — según rol).

**Materiales / lecturas:**
- <Listado de docs clave>
- <Cursos internos si los hay>

**Meetings 1:1 (a agendar en primera semana):**
- Manager (semanal)
- Buddy (semanal)
- <Stakeholder 1>
- <Stakeholder 2>
- <Cross-functional partner típico>

**Checkpoint día 30:**
- 1:1 ampliado con manager (45 min en lugar de 30).
- Preguntas: ¿qué te ha sorprendido? ¿qué te frustra? ¿qué falta? ¿cómo te sientes?
- Recoger feedback bidireccional. Documentar en sección 7.

---

### Días 31-60: Contribuir

**Tema:** empezar a producir con supervisión. Outputs reales pero acotados.

**Objetivos:**
- Liderar al menos 1 entrega/feature/iniciativa de tamaño medio.
- Adoptar autonomía sobre <área concreta>.
- Construir relaciones con stakeholders cross-funcional clave.
- Empezar a aportar perspectiva externa (lo que vio en otras empresas / equipos).

**Hitos esperados:**
- <Hito 1 concreto del rol>
- <Hito 2>

**Checkpoint día 60:**
- Misma estructura que día 30.
- Evaluar progreso vs outcomes a 90 días.
- Ajustar plan si hay desviación material.

---

### Días 61-90: Owning

**Tema:** autonomía en áreas asignadas. Salir del período de prueba.

**Objetivos:**
- Owner formal de <áreas concretas del rol>.
- Cierre exitoso de proyecto/iniciativa principal del trimestre.
- Identificación de un proyecto / mejora para los próximos 90 días.

**Hitos esperados:**
- <Hito 1: ej. shippea primera feature end-to-end>
- <Hito 2: ej. presenta en all-hands>

**Checkpoint día 90:**
- Evaluación formal de período de prueba (sección 6).

---

## 5. Buddy program

> El buddy es el "amigo del trabajo" para preguntas operativas. NO es el manager.

**Quién:** <Buddy>

**Cadencia:**
- Día 1: introducción + tour + lunch.
- Semana 1: café diario 15-30 min.
- Semana 2-4: 2-3 cafés/semana.
- Mes 2: 1 café/semana.
- Mes 3: ad-hoc, según necesidad.

**Qué hace el buddy:**
- Resolver dudas operativas (¿dónde está esto? ¿cómo se hace lo otro?).
- Presentar a gente sin agenda formal.
- Dar feedback informal de "cómo está yendo".

**Qué NO hace el buddy:**
- Evaluar performance (eso es manager).
- Resolver problemas de la persona con el manager (eso es HR si escalable).
- Compartir información confidencial sobre la persona con el equipo.

---

## 6. Evaluación del período de prueba (día 90)

> Conversación estructurada entre manager + persona + HR. Decisión documentada.

### Criterios de evaluación

> Definidos al inicio, no inventados al final.

| Criterio | Evidencia esperada | Score (1-5) |
|---|---|---|
| <Outcome 1 del rol> | <qué debería haber pasado> | |
| <Outcome 2 del rol> | | |
| <Cultural fit / colaboración> | | |
| <Aprendizaje / curiosidad> | | |
| <Autonomía progresiva> | | |

### Conversación de cierre

**Preguntas para la persona:**
- ¿Cómo te ha ido? ¿Qué ha funcionado? ¿Qué no?
- ¿Te ves aquí a 1 año? ¿Por qué?
- ¿Qué necesitas del equipo / del manager / de la empresa para crecer?

**Preguntas del manager hacia la persona:**
- Feedback estructurado sobre los criterios.
- Áreas a reforzar.
- Próximos hitos para los siguientes 90 días.

### Decisión

- ✅ **Confirmar** — pasa de prueba a indefinido. Anunciar al equipo si la cultura lo hace.
- 🟡 **Extender** período de prueba <X semanas> — solo si hay un caso concreto recuperable.
- ❌ **No confirmar** — gestionar salida con HR. Coordinar con `legal-policies` según jurisdicción.

---

## 7. Feedback bidireccional — días 30/60/90

> El onboarding también informa a la empresa. Sin esto, los siguientes onboardings repiten errores.

**Preguntas (las mismas en 30/60/90 para tendencia):**

1. ¿Tienes claro qué se espera de ti?
2. ¿Tienes las herramientas y accesos que necesitas?
3. ¿El plan de los primeros días ha sido útil?
4. ¿Estás conectando con la gente que necesitas?
5. ¿Sientes que estás aprendiendo y avanzando?
6. ¿Hay algo que te frustra y que la empresa pueda resolver?
7. Score general (1-5) de tu experiencia hasta hoy.

**Output:** retro del onboarding (`<proyecto>/hr/onboarding/retros/<persona-slug>-retro.md`) compartido a HR para mejorar siguientes incorporaciones.

---

## 8. Recursos

- **Welcome pack:** <link>
- **Handbook del empleado:** <link>
- **Organigrama:** <link>
- **PRD del equipo:** <link>
- **Roadmap actual:** <link>
- **Documentación técnica relevante:** <link>
- **Onboarding previo de referencia:** <link si existe>

---

## 9. Notas adicionales

<Espacio para anotaciones específicas: factores que el manager considera importantes, contexto único de la persona o del equipo en ese momento.>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin rol, manager, fecha y outcomes a 90 días, parar.
2. **Empezar por los outcomes a 90 días** (sección 0). El resto del plan se construye hacia atrás desde ahí.
3. **Pre-boarding con checklists por owner** (HR, IT, manager). Sin esto, día 1 es caótico.
4. **Día 1 hora a hora.** No "el día 1 conocerá al equipo" — agenda concreta.
5. **Primera semana día a día.** Después de la semana 1 el plan se relaja, pero la primera semana sí debe ser estructurada.
6. **Plan 30/60/90 con objetivos y hitos** medibles por etapa.
7. **Buddy program separado del manager** explícitamente. Mezclar roles sobrecarga al manager y empobrece el buddy program.
8. **Criterios de evaluación definidos al inicio**, no al final del día 90.
9. **Feedback bidireccional obligatorio** en 30/60/90 — sin esto, no aprendemos.
10. **Marcar `[BUDDY PENDIENTE]`** si no asignado, `[ACCESOS PENDIENTES]` lo que IT debe configurar, `[STAKEHOLDER POR IDENTIFICAR]` reuniones a agendar.
11. **Guardar** en `<proyecto>/hr/onboarding/<persona-slug>-90day-plan.md`.
12. **Reportar** al usuario: ruta, fechas clave (30/60/90), checkpoints, materiales pendientes.

---

## Restricciones

- **No copies plan de onboarding anterior sin adaptar.** Cada persona y rol son distintos.
- **No satures día 1.** Más de 4 meetings + 50 páginas = nadie absorbe.
- **No mezcles buddy y manager.** Separar roles para no sobrecargar.
- **No omitas la evaluación del período de prueba.** Es la oportunidad estructurada de corregir o cerrar limpio.
- **No publiques feedback recogido del recién incorporado** fuera del círculo manager + HR sin consentimiento.
- **No definas outcomes vagos** ("se integrará bien"). Outcomes medibles, no aspiracionales.
- **No olvides la retro del onboarding.** El aprendizaje se queda en HR para los siguientes.
- Aplican las reglas de output de `_shared/output-rules.md`.
