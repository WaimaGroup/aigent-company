---
name: "refactor-plan"
description: >
  Workflow skill for planning a refactor with bounded scope, safety nets and
  rollback. Produces a plan document BEFORE touching code: motivation (deuda
  declarada), scope IN/OUT, approach, safety nets (tests, characterization,
  feature flag), validation, rollback. Then the implementation follows. Language
  and framework agnostic.
---

# Skill: Refactor Plan — workflow para planificar un refactor

**Entregable:** archivo de plan en `<proyecto>/software/code/.reports/refactor-<slug>.md` que documenta el refactor ANTES de tocar código. Tras aprobado, los cambios al código del repo se realizan con `Edit`/`Write` siguiendo el plan; el reporte se cierra al final con un bloque "Resultado" que documenta lo ejecutado.

---

## Cuándo usar esta skill

- Se ha identificado deuda técnica (acoplamiento, duplicación, módulo difícil de mantener, abstracción equivocada) y se quiere atajarla con un cambio sin alterar comportamiento externo.
- Se va a cambiar el approach interno de un módulo (de un patrón a otro, de una estructura a otra) sin cambiar API pública.
- Se quiere reducir riesgo en un cambio extenso documentando scope, safety nets y rollback antes de empezar.

**Cuándo NO usar:**

- Para añadir funcionalidad nueva — eso es `feature-implementation`.
- Para arreglar un bug — eso es `bugfix-workflow`. (Si en el camino del fix aparece deuda, anotarla como sugerencia separada.)
- Para un cambio de dependencia — eso es `dependency-bump`.
- Para un refactor trivial (renombrar una variable, mover una función a otro archivo) que cabe en un commit pequeño sin plan. El plan tiene overhead — usar criterio.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Motivación / deuda concreta | ¿Qué problema técnico ataca este refactor? (acoplamiento medible, duplicación, comprensión, performance secundario, …) |
| Comportamiento externo a preservar | ¿Qué NO debe cambiar tras el refactor? (API pública, contratos, output observable) |
| Scope IN | ¿Qué módulos / archivos / capas entran en el refactor? |
| Scope OUT | ¿Qué se considera fuera y se aborda en otro paso? |
| Cobertura actual | ¿Hay tests que cubran el comportamiento externo? Si no, ¿podemos añadir characterization tests antes? |
| Safety nets | ¿Feature flag? ¿Deploy gradual? ¿Branch by abstraction? |
| Plazo y reversibilidad | ¿Cuánto puede durar? ¿Cómo se revierte si algo sale mal a mitad? |
| Riesgo principal | ¿Cuál es la peor cosa que puede pasar? |

---

## Plantilla del entregable

### Plan de refactor (`refactor-<slug>.md`)

```markdown
# Refactor Plan: <Título del refactor>

- **Branch:** <nombre>
- **Fecha de inicio:** YYYY-MM-DD
- **Stack:** <lenguaje · framework · runtime>
- **Owner:** software-coding (vía skill `refactor-plan`)
- **Estado:** Planned | In progress | Done | Reverted

---

## 1. Motivación

**Deuda técnica concreta:**
<3-5 líneas. Qué problema atacamos en términos medibles o ejemplos. "Es feo" no es motivación; "el módulo X tiene 14 archivos con responsabilidades solapadas y cualquier cambio rompe 3 tests no relacionados" sí lo es.>

**Por qué ahora:**
<Razón explícita: bloquea una feature próxima, sufrió incidente, va a crecer y conviene atajar antes…>

**Comportamiento externo a preservar:**
- <API pública 1>
- <Contrato observable 2>
- <Performance / latencia equivalente o mejor>

---

## 2. Scope

### IN — qué entra en este refactor

- <módulo/archivo 1>
- <módulo/archivo 2>

### OUT — qué se queda fuera (y se aborda después)

- <ítem fuera + razón>
- <ítem fuera + razón>

**Anti-scope creep:** si durante el refactor aparece deuda relacionada en zonas OUT, anotarla como sugerencia separada — **no se incluye en este refactor**.

---

## 3. Approach

**Approach elegido:** <una línea — del patrón A al patrón B, de la estructura X a la Y>

**Alternativas consideradas:**
- <alternativa 1 — por qué se descarta>
- <alternativa 2 — por qué se descarta>

**Pasos de ejecución:**
1. <paso 1>
2. <paso 2>
3. <paso 3>

**Branch strategy:**
- [ ] All-at-once (un solo PR grande)
- [ ] Branch by abstraction (interfaz nueva + adaptadores, retirada gradual del viejo)
- [ ] Feature flag (rollout controlado)
- [ ] Strangler fig (módulo nuevo absorbe responsabilidades del viejo)

---

## 4. Safety nets

**Tests que cubren el comportamiento externo HOY:**
- <test 1 — qué cubre>
- <test 2 — qué cubre>
- O: insuficientes. Plan para añadir characterization tests antes del refactor: <descripción>

**Characterization tests a añadir antes** (si los actuales son insuficientes):
- <test 1>
- <test 2>

**Monitoring durante / después:**
- <métrica 1 — qué se mira>
- <métrica 2 — qué se mira>

**Feature flag (si aplica):**
- Nombre: `<flag>`
- Strategy: progressive / canary / instant
- Criterio para retirar el flag: <condición>

---

## 5. Validación

Al terminar el refactor:

- [ ] Tests existentes pasan sin modificarlos para que pasen (o cambios mínimos justificados).
- [ ] Characterization tests añadidos pasan.
- [ ] Comportamiento externo idéntico verificado manualmente en al menos 2 caminos.
- [ ] Performance no degrada (medir si aplica).
- [ ] Linter / formatter pasa.
- [ ] Self-review del diff completo.

---

## 6. Rollback

**Punto sin retorno:** <después de qué paso ya no es trivial revertir>

**Plan de rollback antes del punto sin retorno:**
- <pasos para revertir>

**Plan si algo se rompe después del merge:**
- [ ] Revertir el PR (¿es trivial?)
- [ ] Toggle del feature flag
- [ ] Hotfix dirigido
- <otro plan>

---

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| <riesgo 1> | baja/media/alta | <descripción> | <cómo se mitiga> |
| <riesgo 2> | ... | ... | ... |

---

## 8. Resultado (se completa al cerrar)

> Esta sección se rellena tras ejecutar el refactor.

**Estado final:** Done | Reverted | Partial

**Diff stats:**
- Archivos tocados: <N>
- Líneas añadidas: <N>
- Líneas eliminadas: <N>

**Tests:**
- Existentes: pasan / con N cambios
- Characterization añadidos: <N>
- Cobertura antes/después: <%>/<%>

**Sorpresas durante la ejecución:**
- <ítem inesperado y cómo se manejó>

**Decisiones tomadas durante el refactor:**
- <decisión + justificación>

**Próximos pasos sugeridos:**
- [ ] Próximo refactor relacionado (si quedó OUT-of-scope)
- [ ] Notas para el equipo
```

---

## Proceso

### Fase 1 — Planificación (antes de tocar código)

1. **Recoger información** (sección anterior). Si el "por qué ahora" no convence, parar y dejar el refactor para cuando el coste sea menor que el beneficio.
2. **Definir scope IN/OUT explícito.** El refactor con scope abierto es la receta clásica del "yak shaving" — el plan acotado lo evita.
3. **Verificar cobertura del comportamiento externo.** Si no hay tests, **añadir characterization tests antes de refactorizar**. Sin red, el refactor es a ciegas.
4. **Elegir branch strategy** según riesgo y tamaño:
   - All-at-once: cambios pequeños y bien cubiertos.
   - Branch by abstraction: cambios grandes que pueden cohabitar viejo + nuevo.
   - Feature flag: cuando hay impacto en producción y se quiere rollout gradual.
   - Strangler fig: módulos legacy a ir reemplazando.
5. **Identificar riesgos y mitigaciones** explícitamente.
6. **Definir rollback** antes de empezar. Si no hay forma de revertir, no es un refactor — es un rewrite y necesita otro proceso.
7. **Guardar el plan** en `<proyecto>/software/code/.reports/refactor-<slug>.md` con estado `Planned`.
8. **Confirmar el plan con el usuario** antes de ejecutar.

### Fase 2 — Ejecución

9. **Marcar estado como `In progress`** en el archivo del plan.
10. **Seguir los pasos del plan en orden.** Si aparece scope creep, anotar y resistir — no expandir el refactor en mitad de la ejecución.
11. **Mantener los tests verdes** continuamente. Si un test falla, primero entender por qué (¿estoy violando el contrato externo o el test está mal?) antes de modificarlo.
12. **Commits atómicos** que mantengan la suite verde — los reviews y rollback parciales son mucho más fáciles.

### Fase 3 — Cierre

13. **Validar** la checklist de la sección "5. Validación" del plan.
14. **Rellenar la sección "Resultado"** del plan con diff stats, sorpresas, decisiones tomadas y próximos pasos.
15. **Marcar estado como `Done`** (o `Reverted` / `Partial` si aplica).
16. **Reportar al usuario:**
    - Ruta del plan con resultado.
    - Diff stats.
    - Cobertura antes/después.
    - Decisiones de calado tomadas.
    - OUT-of-scope que quedan pendientes para siguientes refactors.
    - Próximos pasos (PR + review, monitoring, retirada de flag si lo hay).

---

## Restricciones

- **No empezar a refactorizar sin plan escrito.** Saltarse el plan convierte el refactor en "exploración" — el riesgo se materializa siempre.
- **No expandir el scope durante la ejecución.** Lo que aparece en el camino y no está en IN se anota como sugerencia y se aborda en otro refactor.
- **No cambiar el comportamiento externo en un refactor.** Si lo cambias, ya no es refactor: es feature o fix. Separar.
- **No refactorizar sin red de tests.** Si los tests son insuficientes, primero añadir characterization tests, después refactorizar.
- **No refactorizar y "arreglar bugs vistos por el camino" en el mismo PR.** Los bugs se arreglan en PRs separados con `bugfix-workflow`.
- **No prometer reversibilidad que no se puede garantizar.** Si la migración del esquema de datos no es reversible, declararlo en el plan y exigir más controles antes de ejecutar.
- Aplican las reglas de output de `_shared/output-rules.md`.
