---
name: "software-bugfix-workflow"
user-invocable: true
description: >
  Workflow skill for fixing a reported bug. Drives the engineer through
  reproduce → diagnose → fix → regression test, producing a structured fix
  report that documents root cause, blast radius, and the regression test that
  guarantees the bug doesn't come back. Language and framework agnostic.
---

# Skill: Bugfix Workflow — workflow para arreglar un bug

**Entregable:** archivos de código modificados en el repo del proyecto (fix + test de regresión, ambos con `Edit` / `Write`) + un **reporte de fix** en markdown que vive en `<proyecto>/software/code/.reports/fix-<slug>.md` (o donde indique el orquestador), documentando reproduce, root cause, fix y validación.

---

## Cuándo usar esta skill

- Hay un bug reportado (bug report, ticket, mensaje del usuario) y toca arreglarlo.
- Se ha detectado regresión en tests / CI / producción y hay que entender la causa antes de revertir.
- Se quiere garantizar que el bug no vuelve con un test de regresión específico.

**Cuándo NO usar:**

- Para implementar una feature nueva — eso es `feature-implementation`.
- Para mejorar legibilidad / estructura sin cambio observable — eso es `refactor-plan`.
- Cuando no hay reproducción y no hay forma de obtenerla. En ese caso, primero `bug-report` para estructurar la reproducción.
- Para una hotfix de producción sin testing — eso requiere proceso aparte (escalado al ownership del servicio).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Bug report | ¿Hay un bug report estructurado? (ruta o link). Si no, ¿podemos crearlo antes con la skill `bug-report`? |
| Reproducción | ¿Pasos exactos para reproducir el bug? ¿Lo has reproducido localmente o solo se ve en producción? |
| Comportamiento esperado vs actual | ¿Qué debería pasar vs qué pasa? |
| Severidad y scope | Critical / Major / Minor / Cosmetic. ¿Cuántos usuarios afectados? |
| Stack y versión | ¿Lenguaje, framework, runtime y versión exacta donde ocurre? |
| Hipótesis | ¿Hay sospecha de dónde está el problema? |
| Workaround | ¿Hay workaround temporal mientras se arregla? |
| Regresión | ¿Esto funcionaba antes? Si sí, ¿desde qué versión / commit empezó a fallar? |

---

## Plantilla del entregable

### Reporte de fix (`fix-<slug>.md`)

```markdown
# Bugfix: <Título corto que describe el bug>

- **Bug report:** <ruta o link al bug-report>
- **Branch:** <nombre>
- **Fecha:** YYYY-MM-DD
- **Stack:** <lenguaje · framework · runtime>
- **Severidad:** Critical / Major / Minor / Cosmetic
- **Engineer:** software-coding (vía skill `bugfix-workflow`)

---

## 1. Reproduce

**Pasos para reproducir:**
1. <paso 1>
2. <paso 2>
3. <paso 3>

**Comportamiento esperado:** <una línea>
**Comportamiento actual:** <una línea>
**Entorno:** <local / staging / prod · OS · versión exacta>

**¿Reproducible localmente?** Sí / No (si no, explicar diferencia con el entorno donde se ve).

---

## 2. Diagnose — root cause analysis

**Hipótesis inicial:** <una línea>

**Cómo se localizó:**
- <bisect, logs, debugger, lectura del código, …>

**Root cause:**
<3-5 líneas explicando la causa raíz, no el síntoma. Si la causa es un bug propio del código, indicar archivo:línea. Si es una librería externa o comportamiento documentado mal entendido, indicarlo.>

**Causa secundaria (si aplica):**
<Por qué el bug no se detectó antes: cobertura, tipo de test, deploy sin smoke, etc.>

---

## 3. Fix

**Approach elegido:** <una línea explicando la dirección de la solución>

**Alternativas descartadas:**
- <alternativa 1 — por qué no>
- <alternativa 2 — por qué no>

**Archivos tocados:**

| Path | Cambio |
|---|---|
| `<path>` | <una línea> |
| `<path>` | <una línea> |

**Blast radius:** <qué más puede verse afectado por este cambio>

**Decisiones tomadas durante el fix:**
- <decisión y justificación si aplica>

---

## 4. Regression test

**Test añadido:**
- `<path del test>` — <qué cubre exactamente, qué condición debe cumplirse para que pase>

**¿El test falla en main sin el fix?** Sí / No (debería ser SÍ — un test de regresión debe fallar antes del fix y pasar después, si no, no protege).

**Tests adicionales tocados:** <si el fix obligó a actualizar otros tests existentes>

---

## 5. Validación

- [ ] Reproducción original ya no se reproduce (manual).
- [ ] Test de regresión pasa en local.
- [ ] Suite completa de tests pasa.
- [ ] Linter / formatter pasa.
- [ ] Self-review del diff.
- [ ] Si hay impacto en producción, plan de rollout acordado.

---

## 6. Comunicación

**Mensaje para el reporter del bug** (una línea para pegar en el ticket):
> <Mensaje que explica qué se arregló sin jerga técnica innecesaria.>

**¿Requiere nota en changelog?** Sí / No. Si sí, propuesta de entrada:
> <propuesta>

**¿Requiere postmortem?** Solo si fue Critical o tuvo impacto sustancial en producción. Si sí, marcar siguiente paso.

---

## 7. Próximos pasos

- [ ] **`commit-message`** + **`pr-description`** — preparar PR.
- [ ] **`software-code-review`** — review antes de merge.
- [ ] **`software-qa`** — si el root cause indica gap de cobertura sistemático, plan para reforzar.
- [ ] **Postmortem** si Critical.
- [ ] **`changelog-entry`** si el fix va en una release.
```

---

## Proceso

### 1. Reproduce

1. **Conseguir reproducción local antes de tocar código.** Sin reproducción, cualquier "fix" es a ciegas. Si no es posible localmente, intentar staging o trazas detalladas de producción.
2. **Verificar el comportamiento esperado** contra la spec / docs / código original. A veces el "bug" es el comportamiento correcto y el reporter está equivocado — en ese caso, la skill termina en este paso con una nota de "no es un bug, es comportamiento esperado".

### 2. Diagnose

3. **Aislar la causa antes de proponer el fix.** Resistir el impulso de "yo creo que es X" hasta tener evidencia (bisect del commit que introdujo el bug, logs/stack trace, breakpoint, lectura del código).
4. **Distinguir síntoma de root cause.** Si arreglas el síntoma sin entender la causa, vuelve a aparecer en otra forma.
5. **Identificar la causa secundaria** — por qué el bug no se detectó antes. Esto orienta el test de regresión y, a veces, una revisión más amplia de la cobertura.

### 3. Fix

6. **Considerar al menos una alternativa** antes de implementar la primera idea. Documentar por qué se descarta.
7. **Cambio mínimo necesario.** No refactorizar oportunísticamente — anota la deuda relacionada como sugerencia separada.
8. **Evaluar blast radius.** ¿Qué más puede romperse con este cambio? Si la respuesta es ancha, escalar antes de continuar.

### 4. Regression test

9. **Escribir el test ANTES o después del fix** según preferencia, pero **siempre verificar que el test falla en main sin el fix**. Un test de regresión que pasa siempre no protege.
10. **El test debe nombrar el bug** (referencia al ticket, comentario explicando la condición que se está protegiendo).

### 5. Validación

11. Reproducción original deja de reproducirse.
12. Test de regresión pasa.
13. Suite completa pasa.
14. Linter/formatter pasa.

### 6. Comunicación

15. **Mensaje para el reporter** del bug — corto, claro, sin jerga.
16. **Decidir si va al changelog.** Bugs que afectan a usuarios/consumidores → sí. Bugs internos invisibles → no.
17. **Decidir si requiere postmortem.** Solo Critical o impacto sustancial.

### 7. Reportar al usuario

18. **Guardar el reporte** en `<proyecto>/software/code/.reports/fix-<slug>.md`.
19. **Comunicar:**
    - Ruta del reporte.
    - Root cause en una línea.
    - Archivos tocados y test añadido.
    - Si hay postmortem o nota de changelog pendientes.
    - Próximos pasos (PR + review).

---

## Restricciones

- **No empezar a tocar código sin reproducción confirmada.** "Yo creo que es esto" sin reproducir es gambling.
- **No arreglar el síntoma sin entender la causa.** Si el síntoma desaparece pero no entiendes por qué, no has arreglado nada — has movido el bug.
- **No mezclar el fix con refactor.** Si el fix saca a la luz código mal estructurado, anotarlo como deuda separada (sugerir `refactor-plan`).
- **No mergear sin test de regresión.** Salvo casos donde el test es imposible (entorno inviable de reproducir), siempre dejar un test que falle pre-fix y pase post-fix.
- **No hacer hotfix directo en producción** desde esta skill. Para hotfix urgente, escalar al ownership del servicio con plan explícito.
- **No firmar el fix como "definitivo" si dejas TODOs significativos.** Si quedan, marcarlos claramente en el reporte y en el código.
- Aplican las reglas de output de `_shared/output-rules.md`.
