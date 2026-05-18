---
name: "hr-one-on-one-framework"
user-invocable: true
description: >
  Skill for producing a 1:1 framework: standard agenda (status, blockers,
  development, feedback), cadence recommendations, note-taking template, action
  follow-up tracking, escalation guidance. Used by hr-evaluation as the canonical
  reference for managers' weekly/bi-weekly 1:1s with team members.
---

# Skill: One-on-One Framework

**Entregable:** archivo `.md` con framework canónico de 1:1s + plantilla de notas + guía para managers. Vive en `<proyecto>/hr/evaluation/one-on-ones/<persona-o-template>-template.md` (plantilla por persona o por rol). Las sesiones puntuales se guardan en `<proyecto>/hr/evaluation/one-on-ones/<persona-slug>-<YYYY-MM-DD>.md` siguiendo este framework.

---

## Cuándo usar esta skill

- Un manager va a empezar 1:1s con un nuevo reporta y necesita estructura.
- El equipo nota que los 1:1s están siendo improvisados / poco útiles y conviene canonizar.
- Hay que onboardear un manager nuevo y necesita guía operativa de cómo conducir 1:1s.
- Se rediseña la cadencia (cambia frecuencia, duración, formato) y conviene documentar el cambio.

**Cuándo NO usar:**

- Para performance review formal (eso es `performance-review`).
- Para skip-level meetings (1:1s con manager del manager — formato distinto).
- Para career growth plan (es output ocasional del 1:1, no la estructura recurrente).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Persona | Para quién es este framework (template por persona) o ¿template del equipo? |
| Manager | Quién conduce |
| Cadencia | Semanal / quincenal / mensual |
| Duración | 30 min / 45 min / 60 min |
| Formato | Presencial / videollamada / asíncrono (rare) |
| Antigüedad de la persona | Recién incorporada (más estructurado) / consolidada (más conversacional) |
| Documentación previa | ¿Hay framework existente del equipo? |

---

## Plantilla del entregable

Nombre del archivo: `<persona-slug>-template.md` para template por persona, `<role>-1on1-template.md` para template de rol, `<persona-slug>-<YYYY-MM-DD>.md` para una sesión puntual.

```markdown
---
type: "one-on-one-framework"
template_type: "person | role | session"
person: "<Nombre o '-'>"
role: "<Rol o '-'>"
manager: "<Manager>"
cadence: "weekly | biweekly | monthly"
duration_min: 30
format: "in-person | video | async"
status: "active | paused"
last_review: "YYYY-MM-DD"
---

# 1:1 Framework — <Persona / Rol>

> Vigente desde <fecha>. Manager: <Manager>. Cadencia: <cadencia> · <duración> min.

## 0. Principios del 1:1

> Antes de la agenda, los principios que guían cada sesión.

- **Es de la persona, no del manager.** El 1:1 sirve a la persona; el manager facilita. Si la conversación va siempre sobre los temas del manager, falló el formato.
- **No es status report.** El status va a otro canal (stand-up, Slack, herramienta). 1:1 es para lo que NO cabe en otros canales: bloqueos, desarrollo, feedback, dudas, mood.
- **Cancelar es peor que sea breve.** Si hay 10 min, son 10 min. La cancelación recurrente daña la confianza.
- **Confidencialidad.** Lo que se dice en 1:1 no sale sin consentimiento, salvo escalado por integridad / seguridad.
- **Bidireccional.** El manager también recibe feedback. Si no fluye, el formato está mal.

---

## 1. Agenda recurrente

> Mismo esqueleto cada vez. Reduce fricción y facilita compararse en el tiempo.

### Sección 1: Cómo estás (5 min)

Apertura humana. No es small talk de "qué tal el finde".

- *"¿Qué tal la semana? En una palabra, ¿cómo te sientes?"*
- *"¿Hay algo que te haya pesado o energizado esta semana?"*

> Esta sección es la más fácil de saltar; es la más importante. Indicadores tempranos de burnout, frustración o churn aparecen aquí.

### Sección 2: Status crítico — solo lo que NO cupo en otros canales (5-10 min)

No repetir el stand-up. Lo que aquí entra:

- Decisiones que requieren input del manager.
- Información de contexto que el manager no tiene.
- Riesgos / problemas que el equipo no debe enterarse en formato grupal.

> Si no hay nada aquí esta semana, **no inventes**. Saltar a la siguiente sección.

### Sección 3: Bloqueos y necesidades (5-10 min)

- *"¿Qué necesitas de mí esta semana?"*
- *"¿Hay algo que esté bloqueando tu trabajo y no he visto?"*
- *"¿Hay decisiones pendientes que necesitas para avanzar?"*

> El rol del manager aquí es desbloquear, no resolver. Anota acciones para sí mismo.

### Sección 4: Desarrollo y crecimiento (5-10 min)

Rotar por temas semana a semana — no todos cada vez:

- **Carrera:** *"¿Sigues queriendo crecer hacia <X>? ¿Qué te falta? ¿Qué proyecto te acercaría?"*
- **Aprendizaje:** *"¿Qué estás aprendiendo? ¿Qué te frustra no aprender?"*
- **Skills:** *"¿Qué skill estás priorizando este trimestre?"*
- **Mentores / referentes:** *"¿Hay alguien en o fuera del equipo de quien quieras aprender?"*
- **Feedback recibido reciente:** *"¿Qué feedback has recibido de alguien y cómo lo estás procesando?"*

### Sección 5: Feedback bidireccional (5 min)

#### Del manager a la persona

- 1 cosa que ha visto y le ha gustado.
- 1 área en la que pediría ajuste si aplica.

> **No acumular feedback** para el 1:1. Si algo es importante, decirlo cuando pasa. El 1:1 consolida, no es el único canal.

#### De la persona al manager

- *"¿Hay algo que pueda hacer mejor como manager para ti?"*
- *"¿Algo del equipo que crees que deberíamos cambiar?"*

> Si esta sección está siempre vacía, no es que no haya feedback — es que la confianza no está. Investigar.

### Sección 6: Cierre — acciones acordadas (3 min)

- Confirmar 2-3 acciones que cada uno se lleva.
- Próximo 1:1: confirmar cadencia, posponer si necesario.

---

## 2. Plantilla de notas (por sesión)

> Notas ligeras, no acta. Bullets pre/post.

```markdown
# 1:1 — <Persona> · YYYY-MM-DD

## Pre-sesión (escribe antes; ambos contribuyen)

**De la persona — temas a tratar:**
-
-

**Del manager — temas a tratar:**
-
-

---

## Durante la sesión

### Cómo está la persona
<Una línea: estado emocional / energía / preocupaciones>

### Status crítico
<Lo que no cupo en otros canales. Si vacío, omitir>

### Bloqueos
- <Bloqueo 1>
- <Bloqueo 2>

### Desarrollo (tema de hoy)
<Qué tema de la sección 4 rotamos esta semana + notas>

### Feedback
**Para la persona:** <breve>
**Para el manager:** <breve>

---

## Acciones acordadas

- [ ] **Persona:** <acción + plazo>
- [ ] **Manager:** <acción + plazo>

## Próximo 1:1
- Fecha: <YYYY-MM-DD>
- Temas a recordar: <listado>
```

---

## 3. Cadencia y duración

### Cadencia recomendada por situación

| Situación | Cadencia | Duración | Notas |
|---|---|---|---|
| Recién incorporado/a (primeros 90 días) | **Semanal** | 45 min | Estructurada para onboarding |
| Consolidado/a en su rol | **Quincenal** | 30 min | Conversacional |
| Cambio de scope reciente / nuevo proyecto | **Semanal por 4-6 semanas** | 30-45 min | Volver a quincenal cuando estable |
| Manager con muchos reportas (>8) | **Quincenal** | 30 min | Por logística; semanal sería ideal pero no factible |
| Período de evaluación (review formal próxima) | **Semanal** | 45 min | Por 2-3 semanas antes de la review |
| Persona en PIP | **Semanal** | 45 min | Mientras dure el PIP |

### Reglas

- **No saltar 1:1 sin reagendar.** "Cancelado" sin reagendar = "tu trabajo no me importa".
- **Si la cadencia se hace difícil de mantener**, conversación abierta: ¿cambiamos a quincenal? ¿reducimos a 25 min? Preferible reducir que cancelar.

---

## 4. Tipos de 1:1 (cuando rotamos foco)

> Sobre la base de la agenda recurrente, rotar foco para no quedarse en la superficie.

### Quincenal-A: Foco operativo

- Status crítico + bloqueos = el centro.
- Desarrollo = breve.

### Quincenal-B: Foco desarrollo

- Status crítico = breve.
- Desarrollo = el centro (carrera, skills, aprendizaje).

### Mensual: Foco amplio

- Una vez al mes, 60 min en lugar de 30. Conversación más profunda.
- Carrera, mood, equipo, ambiciones.

### Trimestral: Foco objetivos

- Coincide con cierre de OKRs.
- Revisión de OKRs personales del trimestre.
- Definición de OKRs del siguiente.

---

## 5. Preguntas potentes — banco para rotar

> Útiles para sacar al 1:1 de la rutina. Una por sesión, no todas.

**Sobre energía:**
- ¿Qué te ha dado energía esta semana? ¿Qué te la ha quitado?

**Sobre el trabajo:**
- Si tuvieras un día entero sin reuniones, ¿en qué lo invertirías?
- ¿Qué parte de tu trabajo te gustaría dejar de hacer?
- ¿Qué cosa del trabajo te orgullece más de las últimas 2 semanas?

**Sobre el equipo:**
- ¿Hay alguien en el equipo con quien quieras trabajar más?
- ¿Hay tensiones que crees que estoy ignorando?

**Sobre el manager:**
- ¿Qué decisión mía reciente te parece dudosa o te gustaría entender?
- Si fueras mi mentor, ¿qué me dirías que cambie?

**Sobre carrera:**
- En 12 meses, ¿qué te gustaría estar haciendo que ahora no haces?
- ¿Qué rol fuera del nuestro te interesa entender mejor?

---

## 6. Escalado — cuándo el 1:1 pasa a otro formato

- **Performance review formal:** trimestral / semestral / anual, **no** se hace en el 1:1 (es otro documento).
- **PIP:** decisión que sale del 1:1 cuando hay patrón de underperformance — ejecutar con HR, no en 1:1 normal.
- **Salida de la empresa:** conversación dedicada, no en 1:1 normal.
- **Conflicto con otro miembro del equipo:** evaluar si el manager facilita o lo escala a HR.

---

## 7. Anti-patrones a evitar

- ❌ **1:1 como status report.** Si la sesión es siempre "qué hiciste esta semana", está mal.
- ❌ **Manager habla > 50% del tiempo.** Es el 1:1 de la persona.
- ❌ **Sin notas.** Sin notas, el seguimiento se pierde y nada se accionable.
- ❌ **Cancelar por meetings importantes.** Los 1:1s SON meetings importantes.
- ❌ **Pretender confidencialidad y luego compartir.** Una vez perdida la confianza, no se recupera.
- ❌ **Acumular feedback negativo para el 1:1.** Decirlo en el momento; el 1:1 consolida.
- ❌ **Hablar de otra persona del equipo en su ausencia.** Excepción: si afecta directamente a la persona en el 1:1.

---

## 8. Recursos

- **Camille Fournier — The Manager's Path** (cap. sobre 1:1s).
- **Lara Hogan — Resilient Management.**
- **Plantilla colaborativa de notas (Notion / Google Doc):** <link>
- **Listado de preguntas adicional:** <link a banco interno si existe>
```

---

## Proceso

1. **Recopilar** la información mínima. Si es plantilla por persona, recoger antigüedad; si es por rol, recoger cadencia típica.
2. **Adaptar la cadencia y duración** a la situación. Recién incorporado/a ≠ consolidado/a.
3. **Definir agenda recurrente** con las 6 secciones. Mismo esqueleto cada sesión reduce fricción.
4. **Crear plantilla de notas** ligera. Sin notas, no hay seguimiento de acciones acordadas.
5. **Documentar tipos de 1:1** (operativo, desarrollo, mensual amplio, trimestral OKRs). Rotar foco evita rutina.
6. **Banco de preguntas potentes** para usar una por sesión y no quedarse en la superficie.
7. **Reglas de escalado** explícitas — qué SÍ va al 1:1 vs qué requiere otro formato.
8. **Anti-patrones documentados** — el formato falla típicamente de las mismas maneras.
9. **Marcar `[COMPLETAR]`** lo que requiere validación del manager (cadencia exacta, formato preferido) y `[ADAPTAR]` lo que cambia según la persona.
10. **Guardar** en `<proyecto>/hr/evaluation/one-on-ones/<...>.md` según tipo de plantilla.
11. **Reportar** al usuario: ruta, cadencia/duración recomendada, próximo paso (agendar primer 1:1 si es nueva persona; revisar formato en 30 días).

---

## Restricciones

- **No conviertas el 1:1 en status report.** Eso va a otros canales.
- **No saltes secciones por sistema.** Si la 4 (desarrollo) siempre se omite "por falta de tiempo", es señal de que el 1:1 está mal calibrado.
- **No publiques notas del 1:1** sin consentimiento de la persona.
- **No acumules feedback negativo** para el 1:1. El feedback puntual se da en el momento.
- **No prometas confidencialidad y luego escales** sin avisar a la persona, salvo en casos de integridad/seguridad/legal.
- **No copies plantillas genéricas de internet sin adaptar** al equipo y la cultura.
- **No olvides revisar el formato cada 3-6 meses.** Lo que funcionó al inicio puede no funcionar después.
- Aplican las reglas de output de `_shared/output-rules.md`.
