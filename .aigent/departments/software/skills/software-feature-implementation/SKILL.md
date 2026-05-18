---
name: "software-feature-implementation"
user-invocable: true
description: >
  Workflow skill for implementing a feature from a spec (PRD/ADR/tech-spec/
  ticket). Drives the implementer through pre-flight (spec read, scope agreed,
  tests planned), execution, and post-flight reporting (files touched, tests
  added, TODOs, suggested next step). Language and framework agnostic.
---

# Skill: Feature Implementation — workflow para implementar una feature

**Entregable:** archivos de código en el repo del proyecto (creados/modificados con `Write`/`Edit`) + un **reporte de implementación** en markdown que vive en `<proyecto>/software/code/.reports/feature-<slug>.md` (o donde indique el orquestador), resumiendo el cambio. La feature en sí va al repo del proyecto; el reporte es el "qué se hizo" auditable.

---

## Cuándo usar esta skill

- Hay un spec (PRD / ADR / tech-spec / ticket / historia de usuario) y toca traducirlo a código de producción.
- La feature tiene scope acotado y entregable identificable (no es "mejora general").
- Se quiere dejar trazabilidad del cambio: qué archivos se tocaron, qué tests se añadieron, qué quedó pendiente.

**Cuándo NO usar:**

- Para corregir un bug — eso es `bugfix-workflow`.
- Para refactor sin cambio de comportamiento externo — eso es `refactor-plan`.
- Para subir una dependencia — eso es `dependency-bump`.
- Cuando aún no hay spec. Si el usuario pide "implementa X" sin contexto, primero pasar por `tech-spec` o `feature-prd`.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Spec de referencia | ¿Cuál es el PRD/ADR/tech-spec/ticket? (ruta o link). Si no hay, ¿podemos parar y crear uno antes? |
| Stack y versión | ¿Lenguaje, framework, runtime y versión exacta? (deducible del repo si está accesible) |
| Path de destino | ¿Dónde vive el cambio? (módulo, capa, archivo concreto si ya se sabe) |
| Tests previos | ¿Hay tests que respetar o adaptar? ¿Qué framework de testing? |
| Convenciones del repo | ¿Linter / formatter / naming activos? (deducible mirando archivos vecinos) |
| Dependencias nuevas | ¿La feature exige librerías nuevas? Si sí, ¿hay ADR previo? |
| Tests a producir | ¿La feature exige tests propios? ¿Qué casos críticos? |
| Criterios de aceptación | ¿Cuáles son los AC verificables que cierran la feature? |

---

## Plantilla del entregable

### Reporte de implementación (`feature-<slug>.md`)

```markdown
# Feature Implementation: <Título corto de la feature>

- **Spec de referencia:** <ruta o link al PRD/ADR/tech-spec/ticket>
- **Branch:** <nombre del branch>
- **Fecha de inicio:** YYYY-MM-DD
- **Stack:** <lenguaje · framework · runtime>
- **Implementador:** software-coding (vía skill `feature-implementation`)

---

## Resumen funcional

<2-3 líneas. Qué hace ahora el sistema que antes no, en lenguaje de usuario / consumidor de API, no de implementación.>

---

## Plan ejecutado (pre-flight)

> Esta sección se rellena ANTES de empezar a escribir código, con el plan acordado.

**Scope acordado:**
- <punto 1>
- <punto 2>

**Archivos previstos:**
- `<path>` — <qué se va a tocar>
- `<path>` — <qué se va a tocar>

**Dependencias nuevas:**
- <librería · versión · justificación · ADR si aplica>
- O: ninguna.

**Tests previstos:**
- <test 1 — qué cubre>
- <test 2 — qué cubre>

**Riesgos identificados:**
- <riesgo + cómo se mitiga durante la implementación>

---

## Cambios realizados (post-flight)

> Esta sección se rellena al terminar la implementación. Es la fuente para PR description y commit message.

### Archivos tocados

| Path | Tipo | Resumen del cambio |
|---|---|---|
| `<path>` | new / modified / deleted | <una línea> |
| `<path>` | new / modified / deleted | <una línea> |

### Tests añadidos

- `<path del test>` — <qué cubre>
- `<path del test>` — <qué cubre>

### Tests pendientes (si los hay)

- [TEST PENDIENTE] <caso no cubierto + razón (no testable hoy / requiere infra / scope diferido)>

### TODOs explícitos dejados en el código

- `<path:línea>` — <comentario y motivo>

### Decisiones tomadas durante la implementación

> Pequeños trade-offs locales que no estaban en el spec pero se decidieron al implementar. Si alguno es de calado, marcarlo como candidato a ADR.

- <decisión + justificación>
- <decisión + justificación>

### Dependencias nuevas confirmadas

- <librería · versión · razón final · si se añadió ADR>

---

## Criterios de aceptación (AC)

| AC | Estado | Cubierto por |
|---|---|---|
| <AC 1 del spec> | ✅ / 🟡 (parcial) / ❌ | <test o módulo que lo cubre> |
| <AC 2> | ... | ... |

---

## Próximos pasos sugeridos

- [ ] **`software-code-review`** — review del PR antes de merge (especialmente si hay decisiones nuevas).
- [ ] **`software-qa`** — extender tests si quedaron `[TEST PENDIENTE]`.
- [ ] **`commit-message`** + **`pr-description`** — generar mensajes y descripción del PR.
- [ ] **ADR retrospectivo** si alguna decisión durante la implementación es de calado.
```

---

## Proceso

### Pre-flight (antes de tocar código)

1. **Leer el spec entero.** Si falta scope, AC o decisión técnica, parar y devolver al autor del spec antes de implementar.
2. **Leer contexto del repo:**
   - El archivo o módulo a modificar y sus vecinos similares.
   - Los ADRs relevantes (`<proyecto>/software/architecture/adr/`).
   - `decisions[]` del config global y del proyecto.
   - La suite de tests actual (framework, patrones, dobles de prueba).
3. **Planificar:**
   - Identificar archivos a tocar y qué cambia en cada uno (2-5 viñetas).
   - Identificar dependencias nuevas; si las hay y son sustanciales, parar y proponer ADR vía `software-architecture`.
   - Anticipar impacto: qué se rompe, qué hay que migrar, qué tests fallarán antes de actualizarse.
   - Definir los tests que se van a producir.
4. **Escribir el reporte en estado "Plan ejecutado (pre-flight)"** con `[POST-FLIGHT PENDIENTE]` en la sección de cambios.
5. **Confirmar el plan con el usuario** si:
   - Hay desviación del spec.
   - Se introducen dependencias nuevas.
   - El scope ha crecido más del 20% de lo previsto en el spec.

### Implementación

6. **Aplicar cambios** con `Edit` / `Write` siguiendo el estilo del proyecto (linter/formatter del repo).
7. **Añadir tests** al lado del cambio. Si la suite no soporta el caso, marcar `[TEST PENDIENTE]` y describir qué falta.
8. **Mantener atomicidad.** Si en el camino aparece deuda relacionada, anotarla como sugerencia separada — no mezclar refactor con cambio funcional.
9. **No introducir comentarios** que repiten lo obvio del código. Solo comentar intención no evidente.

### Post-flight

10. **Rellenar la sección "Cambios realizados"** del reporte con los archivos tocados, tests añadidos, TODOs y decisiones tomadas.
11. **Cruzar los AC del spec** con lo implementado y reportar estado (✅ / 🟡 / ❌).
12. **Guardar el reporte** en `<proyecto>/software/code/.reports/feature-<slug>.md`.
13. **Reportar al usuario:**
    - Ruta del reporte y resumen de archivos tocados.
    - Tests añadidos y pendientes.
    - TODOs explícitos.
    - Decisiones de calado tomadas durante la implementación (candidatas a ADR).
    - Próximos pasos sugeridos (`code-review`, `qa`, `commit-message`, `pr-description`).

---

## Restricciones

- **No empezar a escribir código sin pre-flight.** Saltarse el pre-flight produce features que no cubren AC o introducen dependencias no acordadas.
- **No introducir dependencias nuevas** sin marcarlo explícitamente. Para librerías sustanciales, proponer ADR previo.
- **No cambiar decisiones de arquitectura desde implementación.** Si el spec no encaja con el código real, parar y pedir aclaración.
- **No mezclar refactor con cambio funcional** en el mismo entregable. Son dos pasos separados (segundo via `refactor-plan`).
- **No mergear, no hacer deploy, no ejecutar comandos destructivos** (drop, truncate, force push) sin confirmación explícita.
- **No tocar archivos fuera del scope acordado.** Si para implementar X necesitas tocar Y, señalarlo antes de hacerlo.
- **No inventar APIs ajenas.** Si una librería tiene un método que "creemos" que existe pero no se ha visto en docs/types, verificar o marcar `[VERIFICAR API]`.
- Aplican las reglas de output de `_shared/output-rules.md`.
