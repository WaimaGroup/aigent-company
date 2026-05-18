---
name: "hr-performance-review"
user-invocable: true
description: >
  Skill for producing a structured performance review: evidence-based, separating
  what the person did (impact) from how they did it (competencies), with rating
  justified against a rubric and a growth plan for the next cycle.
---

# Skill: Performance Review

**Entregable:** archivo `.md` con el review completo, listo para conversación 1:1 entre manager y persona, guardado en `<proyecto>/hr/evaluation/reviews/<persona-slug>-<ciclo>.md`.

---

## Cuándo usar esta skill

- Llega un ciclo formal de evaluación (anual, semestral, trimestral) y hay que producir reviews estructurados por persona.
- Hay que documentar un review ad-hoc tras un proyecto significativo, una promoción propuesta o una situación que requiere conversación formal.
- Hay que preparar el review como input para una calibración entre managers.

**Cuándo NO usar:**

- Para 1:1s recurrentes (esa cadencia no usa este formato — usar el framework de 1:1 más ligero).
- Para un PIP (es otro documento, otras consecuencias).
- Para feedback informal en el momento (debe darse, pero no en este formato).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Persona | Nombre, rol, equipo, manager, tiempo en la empresa |
| Ciclo | Periodo cubierto (Q1 2026, H2 2025, año 2025…) |
| Framework | ¿Qué competencias y rúbrica usa la empresa? (si no hay, lo proponemos con la plantilla por defecto) |
| Self-review | ¿Existe self-review previo de la persona? Si sí, ¿dónde? |
| Evidencia | Proyectos, entregables, momentos relevantes del periodo (lo que el manager ha observado) |
| Feedback 360 | ¿Se ha recogido feedback de pares/stakeholders? Si sí, ¿dónde? |
| OKRs / objetivos | Si tenía OKRs personales para el ciclo, ¿se cumplieron? Con scoring si aplica |
| Decisión esperada | ¿Hay rating final con consecuencias (comp, promoción)? ¿O es solo desarrollo? |
| Jurisdicción | País/región de empleo (algunos formatos tienen requisitos legales) |

---

## Plantilla del entregable

```markdown
---
type: "performance-review"
person: "<Nombre>"
role: "<Rol>"
team: "<Equipo>"
manager: "<Manager>"
cycle: "<Periodo>"
date: "YYYY-MM-DD"
status: "draft | calibration | delivered | archived"
confidentiality: "manager + HR + person"
---

# Performance Review — <Nombre> · <Ciclo>

> **Confidencial.** Este documento es propiedad de la persona evaluada, su manager y HR.

## 0. Resumen ejecutivo

**Veredicto del ciclo:** <una frase>

**Rating (si aplica):** <valor de la rúbrica> — justificación en sección 5.

**Highlights:**
- <1-3 momentos clave del periodo>

**Áreas de foco para el siguiente ciclo:**
- <1-3 ítems concretos>

---

## 1. Contexto del periodo

<2-4 líneas sobre el momento del equipo y la empresa durante el ciclo. Útil para enmarcar la evidencia. No es una excusa; es contexto.>

---

## 2. Objetivos del ciclo

| Objetivo / OKR | Resultado | Score | Notas |
|---|---|---|---|
| <objetivo 1> | <qué pasó> | <0.0-1.0 o cualitativo> | <breve> |
| <objetivo 2> | ... | ... | ... |

> Si no había objetivos formales, sustituir esta tabla por "Objetivos implícitos del rol" con las 3-5 áreas que el rol esperaba cubrir.

---

## 3. Evidencia e impacto

> Lo que la persona hizo (evidencia factual) y qué cambió por ello (impacto).

### Proyecto / iniciativa: <Nombre>
- **Qué hizo:** <evidencia factual, no etiqueta>
- **Impacto:** <qué cambió por ello — métrica si se puede>
- **Contribución relativa:** <solista / lead / partícipe / soporte>

(repetir por cada momento relevante del periodo, 3-7 items típicamente)

---

## 4. Competencias

> Cómo lo hizo. Cada competencia evaluada contra la rúbrica del framework. Evidencia concreta por competencia.

| Competencia | Nivel observado | Evidencia |
|---|---|---|
| <Competencia 1> | <Excede / Cumple / Por debajo> | <ejemplo concreto> |
| <Competencia 2> | ... | ... |

---

## 5. Rating (si aplica)

**Rating del ciclo:** <valor>

**Justificación contra rúbrica:**
- <Por qué este rating y no el inmediatamente superior>
- <Por qué este rating y no el inmediatamente inferior>

**Calibración:** [CALIBRADO en sesión <fecha> / PENDIENTE de calibrar]

---

## 6. Feedback que la persona debe escuchar

> Mensajes clave a transmitir en la conversación. Cada uno: comportamiento + impacto + qué hacer al respecto.

**Lo que está funcionando bien (continuar):**
- <comportamiento + impacto>

**Lo que conviene ajustar:**
- <comportamiento + impacto + qué hacer>

**Lo que necesita cambio claro:**
- <comportamiento + impacto + qué hacer + cómo lo apoya el manager>

---

## 7. Plan de desarrollo — siguiente ciclo

**Objetivos para el próximo ciclo:**
1. <objetivo 1, conectado a competencia o gap>
2. <objetivo 2>
3. <objetivo 3>

**Cómo lo apoyará el manager / la empresa:**
- <recurso 1: mentor, formación, proyecto de stretch>
- <recurso 2>

**Checkpoints:** <frecuencia y formato del seguimiento>

---

## 8. Feedback de la persona hacia el manager / la empresa

> Espacio para registrar lo que la persona quiere comunicar. Se rellena tras la conversación si aplica.

- <texto recogido>

---

## 9. Decisiones derivadas del review

- [ ] Ajuste de compensación: <sí/no/diferido> — <detalle>
- [ ] Promoción: <sí/no/diferido> — <detalle>
- [ ] Cambio de rol/equipo: <sí/no> — <detalle>
- [ ] PIP: <no aplica / propuesto>
- [ ] Otra: <...>

> Las decisiones derivadas se documentan aquí pero su ejecución (cartas, comunicación) sale del review.

---

## 10. Anexos

- Link a self-review: <ruta / link>
- Link a feedback 360: <ruta / link>
- Link a OKRs del ciclo: <ruta / link>
```

---

## Proceso

1. **Recopilar** la información mínima. La evidencia es lo crítico: sin ella, el review es opinión.
2. **Si hay self-review** de la persona, leerlo antes de redactar. El review consolidado del manager se beneficia de saber qué cuenta la persona sobre su propio ciclo.
3. **Redactar evidencia primero, juicio después.** Sección 3 antes que sección 4 antes que sección 5.
4. **Calibrar el rating** mentalmente contra otros casos del equipo: ¿estoy aplicando los mismos criterios? Marcar `[CALIBRACIÓN PENDIENTE]` si aún no se hizo con otros managers.
5. **Redactar el feedback de la sección 6 con frases listas para entregar**, no notas para que el manager improvise. Frase + contexto + qué hacer.
6. **Diseñar el plan de desarrollo** alineado con OKRs del próximo ciclo si ya están definidos, o con el career framework si existe.
7. **Marcar `[EVIDENCIA PENDIENTE]`** lo que el manager aún tiene que aportar (eventos concretos, métricas) y `[REVISAR CON MANAGER]` lo que requiere validación humana.
8. **Guardar** en `<proyecto>/hr/evaluation/reviews/<persona-slug>-<ciclo>.md`.
9. **Reportar** al manager:
   - Ruta del archivo.
   - Rating propuesto y por qué.
   - Top 3 mensajes a entregar en la conversación.
   - Próximo paso (calibración, conversación 1:1, comunicación de decisiones derivadas).

---

## Restricciones

- **No redactes en lugar del manager.** Esta skill genera la estructura completa; la conversación final la sostiene el manager con sus palabras.
- **No mezcles evidencia con juicio.** "Llegó tarde 3 veces en febrero" (evidencia) ≠ "no le importa el equipo" (juicio sin base).
- **No pongas información sensible en chat.** El review es confidencial; cualquier resumen en chat se mantiene en alto nivel.
- **No recomendar consecuencias contractuales** (despido, ajuste salarial concreto) — esas las decide el manager con HR.
- **No publiques el review** sin pasar por calibración (si la empresa la usa) y sin que el manager lo firme.
- **No olvides la sección 8.** El review es bidireccional o se vuelve teatro.
- Aplican las reglas de output de `_shared/output-rules.md`.
