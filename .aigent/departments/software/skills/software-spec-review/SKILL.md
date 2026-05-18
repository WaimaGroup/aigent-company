---
name: "software-spec-review"
user-invocable: true
description: >
  Skill for reviewing AND scoring a technical specification — PRD, ADR, tech-spec
  or api-spec — against a fixed quality rubric. Produces a structured report with
  per-dimension scores 0-5, findings ranked by severity, top 3, and a verdict
  (approve / approve-with-minor-changes / blocking-revision-needed). Stack
  agnostic.
---

# Skill: Spec Review — review y scoring de especificaciones técnicas

**Entregable:** archivo `.md` con el report de review, listo para vivir en `<proyecto>/software/reviews/` (junto a los reports de code review, pero distinguible por el prefijo `spec-review-*`).

---

## Cuándo usar esta skill

- Hay un PRD, ADR, tech-spec o api-spec ya redactado y queremos validar su calidad antes de implementar o aprobar.
- Se quiere comparar la madurez de varios specs para priorizar cuál está listo para implementación.
- Se quiere dejar trazabilidad del visto bueno (o de los bloqueos) sobre un spec antes de un commit relevante.
- Se quiere usar el spec-review como gate en un flujo de trabajo: ningún spec entra a implementación sin pasar revisión.

**Cuándo NO usar:**

- Para revisar código — eso es `code-review-checklist` (otra skill, otra disciplina).
- Para escribir el spec desde cero — eso son las skills `adr`, `tech-spec`, `api-spec`, o el agente `shared-prd-agent` para PRDs.
- Para una pre-lectura informal de 30 segundos. Esta skill produce un report estructurado; si solo quieres una opinión rápida, no es ese el formato.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Spec a revisar | ¿Cuál es la ruta del archivo o el texto del spec? |
| Tipo de spec | ¿Qué es? (PRD / ADR / tech-spec / api-spec / otro). El rubric se ajusta al tipo. |
| Profundidad | ¿Review ligero (bloqueantes y mayores) o profundo (todo incluyendo nits)? Default: profundo. |
| Contexto del proyecto | ¿Existen ADRs previos, PRD de proyecto, decisiones (`decisions[]` del config) que el spec debería respetar? |
| Audiencia | ¿Para quién es el spec? (eng team, leadership, vendor externo, auditor). Determina expectativas de tono y detalle. |
| Output ruta | ¿Dónde se guarda el report? Default: `<proyecto>/software/reviews/spec-review-<spec-name>.md`. |

---

## Plantilla del entregable

Nombre del archivo: `spec-review-<tipo>-<slug-corto>.md` — ej. `spec-review-adr-008-postgres.md`, `spec-review-prd-checkout-v2.md`.

```markdown
# Spec Review: <Título del spec revisado>

- **Tipo de spec:** PRD | ADR | Tech-spec | API-spec | Otro: <...>
- **Archivo revisado:** <ruta o referencia>
- **Fecha:** YYYY-MM-DD
- **Revisor:** software-architecture (vía skill `spec-review`)
- **Profundidad:** Ligero | Profundo
- **Veredicto:** ✅ Aprobado | 🟠 Aprobado con cambios menores | 🔴 Requiere revisión bloqueante

---

## Resumen ejecutivo

<3-5 líneas. Qué pretende el spec, en qué estado está, qué bloquea (si algo) y qué hace falta para aprobarlo.>

---

## Scoring por dimensiones

Cada dimensión se puntúa 0-5 según el rubric de abajo. La suma da la puntuación total /30 con grado.

| Dimensión | Score | Justificación corta |
|---|---|---|
| Completeness — todas las secciones canónicas del tipo de spec presentes y rellenas | <0-5> | <una línea> |
| Clarity — lectura sin ambigüedad, lector externo entiende qué se decide o construye | <0-5> | <una línea> |
| Testability — criterios de aceptación / consecuencias / contratos son verificables | <0-5> | <una línea> |
| Consistency — coherente con ADRs previos, stack del proyecto, decisions registradas | <0-5> | <una línea> |
| Risk awareness — riesgos, edge cases y no-funcionales identificados explícitamente | <0-5> | <una línea> |
| Actionability — se puede arrancar implementación/decisión con esto sin más rondas | <0-5> | <una línea> |
| **Total** | **<0-30>** | Grado: <ver tabla> |

### Grado del total

| Total | Grado | Interpretación |
|---|---|---|
| 26-30 | 🟢 Excelente | Listo para implementar / aprobar tal cual. |
| 20-25 | 🟡 Bueno con ajustes | Aprobable con cambios menores aplicados antes de implementar. |
| 14-19 | 🟠 Insuficiente | Requiere segunda iteración del autor antes de aprobar. |
| 0-13 | 🔴 Bloqueado | El spec no está listo. Conviene rescribir partes sustanciales o discutir antes de seguir. |

> El grado guía el veredicto pero no lo sustituye: un solo hallazgo 🔴 BLOCKER puede degradar el veredicto aunque el total sea alto.

---

## Rubric — qué se evalúa en cada dimensión

> Esta sección se incluye en el output para que el autor del spec entienda criterios y la review sea aprendizaje, no juicio.

### Completeness (0-5)
- 5: Todas las secciones canónicas del tipo de spec presentes, rellenas y con suficiente densidad.
- 3: Secciones principales presentes, alguna secundaria vacía o "TBD".
- 1: Faltan secciones críticas (decisión, criterios, alternativas, AC…).
- 0: Esqueleto sin contenido.

### Clarity (0-5)
- 5: Lector externo al proyecto entiende qué se decide/construye sin preguntas.
- 3: Lector interno al proyecto entiende; lector externo necesita 1-2 aclaraciones.
- 1: Requiere conocimiento implícito alto, ambigüedad en términos clave.
- 0: No se entiende qué se está proponiendo.

### Testability (0-5)
- 5: Cada criterio de aceptación / consecuencia / endpoint es verificable objetivamente.
- 3: La mayoría son verificables; algún criterio es subjetivo o no medible.
- 1: Predominan los criterios cualitativos sin métrica ("debe ser rápido", "más mantenible").
- 0: No hay criterios o son aspiraciones sin operacionalizar.

### Consistency (0-5)
- 5: Cero conflictos con ADRs previos, decisions del proyecto, stack declarado.
- 3: Coherente en lo principal; algún detalle podría tensionar con decisión previa.
- 1: Contradice un ADR vigente o decisión registrada sin marcar la sobreescritura.
- 0: Decide en otra dirección que el resto del sistema sin justificarlo.

### Risk awareness (0-5)
- 5: Riesgos, edge cases, no-funcionales (perf/seguridad/disponibilidad) cubiertos explícitamente con mitigación.
- 3: Algunos riesgos identificados; faltan no-funcionales o edge cases evidentes.
- 1: Solo camino feliz, sin mención a fallos o degradaciones.
- 0: Ni siquiera se ha pensado en fallar.

### Actionability (0-5)
- 5: Implementador/decisor puede arrancar mañana sin volver al autor.
- 3: Se puede arrancar con 1-2 aclaraciones rápidas.
- 1: Requiere segunda ronda completa con el autor antes de mover.
- 0: No es ejecutable; falta el "qué hacemos".

---

## Hallazgos

Agrupados por severidad y luego por sección del spec.

### 🔴 BLOCKER — deben resolverse antes de aprobar

1. **<sección/línea>** — <descripción del problema, por qué bloquea, sugerencia de dirección>
2. ...

### 🟠 MAJOR — deben resolverse antes de implementar

1. **<sección/línea>** — <descripción + razón + sugerencia>
2. ...

### 🟡 MINOR — conviene corregir pero no bloquea

1. **<sección/línea>** — <descripción + razón>
2. ...

### 🔵 NIT — estilo / preferencia, opcional

1. **<sección/línea>** — <descripción>

---

## Top 3 a atender primero

> Los 3 hallazgos cuya corrección más mejora el spec, por orden.

1. <hallazgo + sección + impacto>
2. <hallazgo + sección + impacto>
3. <hallazgo + sección + impacto>

---

## Lo que está bien hecho

> Importante. Un review con solo problemas pinta peor de lo real. Reconoce las decisiones acertadas.

- <punto positivo 1 con sección referenciada>
- <punto positivo 2>
- ...

---

## Próximos pasos sugeridos

<Qué hacer ahora con el spec:>
- Si veredicto ✅ → implementar o aprobar formalmente.
- Si veredicto 🟠 → autor aplica cambios menores, no requiere re-review formal.
- Si veredicto 🔴 → autor reescribe las secciones señaladas, segunda iteración de spec-review.

---

## Notas

- Sugerencias `[VERIFICAR]` donde el revisor no está 100% seguro (suposiciones sobre el dominio, contexto que no tenía).
- Referencia a ADRs / specs relacionados consultados durante la review.
```

---

## Proceso

1. **Recopilar** la información (sección anterior). Si no se identifica el tipo de spec, leer el archivo y deducirlo del frontmatter / encabezado / contenido.
2. **Leer el spec completo** antes de puntuar nada. No puntuar dimensión por dimensión a vuelapluma sin haber visto el todo.
3. **Leer contexto relevante:**
   - ADRs previos del proyecto en `<proyecto>/software/architecture/adr/`.
   - PRD del proyecto en `.context/<proyecto>/software/prd.md`.
   - `decisions[]` del `config.json` global y del proyecto, filtradas por `area == "software" || area == "global"`.
4. **Aplicar el rubric**: puntuar cada dimensión 0-5 con justificación de una línea por dimensión. Una puntuación sin justificación no es válida.
5. **Detectar hallazgos** pasando el spec por los siguientes ejes:
   - **Completeness:** ¿faltan secciones canónicas del tipo de spec?
   - **Clarity:** ¿términos ambiguos, jerga sin definir, suposiciones implícitas?
   - **Testability:** ¿cada AC / consecuencia / contrato es verificable?
   - **Consistency:** cruzar contra ADRs previos y decisions. Marcar conflictos.
   - **Risk awareness:** ¿riesgos, edge cases, no-funcionales (perf, seguridad, disponibilidad) presentes?
   - **Actionability:** ¿se puede arrancar? ¿qué falta para que el siguiente eslabón (implementador, decisor, vendor) actúe sin volver al autor?
6. **Asignar severidad** a cada hallazgo (🔴/🟠/🟡/🔵). Sin severidad no hay hallazgo.
7. **Calcular el total y grado** (tabla del entregable). Determinar veredicto:
   - ✅ Aprobado si total ≥ 26 y cero 🔴 BLOCKER.
   - 🟠 Aprobado con cambios menores si total ≥ 20, cero 🔴 BLOCKER y ≤ 2 🟠 MAJOR.
   - 🔴 Requiere revisión bloqueante si total < 20 o ≥ 1 🔴 BLOCKER.
8. **Identificar lo que está bien hecho** (mínimo 2 puntos si el spec no es catastrófico).
9. **Top 3** — los 3 hallazgos cuya corrección más mejora el spec.
10. **Guardar** el archivo en la ruta acordada con el orquestador (default: `<proyecto>/software/reviews/spec-review-<tipo>-<slug>.md`).
11. **Reportar** al usuario:
    - Ruta del archivo creado.
    - Veredicto y total /30.
    - Número de hallazgos por severidad.
    - Top 3 a atender primero.
    - Próximo paso sugerido según veredicto.

---

## Restricciones

- **No reescribas el spec del autor.** Señalas dirección, no implementación completa. Si la reescritura es necesaria, marcas como 🔴 BLOCKER y delegas al agente que lo escribió originalmente (típicamente `software-architecture` o `shared-prd-agent`).
- **No confundas opinión con hallazgo.** Si algo no te gusta pero no viola el rubric ni una convención del proyecto, va como 🔵 NIT con etiqueta clara.
- **No puntúes sin haber leído el spec entero.** El total tiene sentido solo si las 6 dimensiones se evaluaron con la misma visibilidad.
- **No mezcles spec-review con code-review.** Si en el camino detectas problemas en el código asociado, los anotas y los pasas a `software-code-review`, pero el output sigue siendo el report del spec.
- **No degrades el veredicto por una preferencia estilística.** Una concentración de 🔵 NIT no es razón para 🔴. La severidad va por impacto en el lector / implementador, no por densidad.
- **No supongas contexto que no tienes.** Si el spec referencia un sistema que no puedes leer, marca `[VERIFICAR]` y no penalices la dimensión por algo no verificable.
- Aplican las reglas de output de `_shared/output-rules.md`.
