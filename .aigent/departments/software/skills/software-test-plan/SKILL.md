---
name: "software-test-plan"
user-invocable: true
description: >
  Skill for producing a structured test plan: scope, testing levels (unit /
  integration / e2e / performance / security), test cases per level, exit
  criteria and risks. Stack agnostic.
---

# Skill: Test Plan

**Entregable:** archivo `.md` con el plan de test, listo para vivir en `<proyecto>/software/qa/plans/`.

---

## Cuándo usar esta skill

- Hay que decidir qué probar, cómo probar y a qué nivel probar una feature, un módulo o un proyecto completo.
- Se prepara una release y se quiere un plan de regresión documentado.
- Se va a empezar una suite de tests desde cero o a reforzar una existente con cobertura intencional.

**Cuándo NO usar:**

- Para implementar los tests. Esta skill produce el plan; la implementación (escribir el código del test) corresponde a `software-coding` o al desarrollador siguiendo el plan.
- Para una sola anotación de "¿hay test de esto?". Si la respuesta no necesita estructura, va en un comentario del review o en un ticket.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope | ¿Qué se prueba? (feature, módulo, servicio, release completa) |
| Objetivo del plan | ¿Cobertura inicial, regresión, aceptación de release, performance, security? |
| Spec de referencia | ¿Hay PRD, historia de usuario o ADR asociado? |
| Stack y framework de testing | ¿Lenguaje, framework de tests (Jest, PyTest, JUnit, RSpec, etc.), dobles de prueba habituales? |
| Tests previos | ¿Hay suite ya existente? ¿Qué patrón sigue? |
| Restricciones de entorno | ¿Limitaciones de infra para probar? (sin sandbox del proveedor X, sin BD en CI, datos sensibles…) |
| Criterios de salida | ¿Qué tiene que cumplirse para considerar el plan ejecutado? (% cobertura, casos críticos verde, sign-off de un rol) |

---

## Plantilla del entregable

Nombre del archivo: `test-plan-<scope-slug>.md` (ej. `test-plan-oauth-flow.md`, `test-plan-release-1.5.md`).

```markdown
# Test Plan: <Scope>

- **Fecha:** YYYY-MM-DD
- **Autor:** <agente / persona>
- **Estado:** Draft | In Review | Approved | In Execution | Done
- **Scope:** <feature / módulo / release / servicio>
- **Spec de referencia:** <link al PRD / ADR / historia>
- **Stack de testing:** <framework, runners, dobles de prueba habituales>

---

## 1. Objetivo

<Qué se quiere validar con este plan. Una frase.>

## 2. Alcance

**Incluido:**
- <qué entra en este plan>

**Excluido:**
- <qué deliberadamente queda fuera y por qué>

## 3. Estrategia por niveles

> Pirámide por defecto: muchos unit, algunos integration, pocos e2e. Justificar si rompes la proporción.

### 3.1 Unit
**Cobertura objetivo:** <funciones / clases / componentes>
**Dobles de prueba:** <mocks, stubs, fakes habituales>
**Frameworks:** <ej. Jest + sinon, PyTest + unittest.mock>

### 3.2 Integration
**Cobertura objetivo:** <interacciones entre módulos, con BD/servicios>
**Entorno:** <BD efímera, testcontainers, sandbox del proveedor>
**Frameworks:** <ej. supertest + testcontainers>

### 3.3 End-to-end
**Cobertura objetivo:** <flujos de usuario clave>
**Entorno:** <staging-like, datos sintéticos>
**Frameworks:** <ej. Playwright, Cypress, Selenium>

### 3.4 Performance *(solo si aplica)*
**Métricas objetivo:** p50, p95, p99, throughput, error rate.
**Carga:** <perfil esperado: usuarios concurrentes, RPS>
**Herramienta:** <ej. k6, JMeter, Gatling>

### 3.5 Security *(solo si aplica)*
**Amenazas a cubrir:** <de un threat model o de OWASP top 10 básico>
**Escenarios adversarios:** <inputs maliciosos, abuso de auth, etc.>

---

## 4. Casos de test

> Para cada caso: ID, descripción, nivel, prioridad, precondiciones, pasos, resultado esperado.

### TC-001 — <Nombre del caso>
- **Nivel:** unit | integration | e2e | perf | security
- **Prioridad:** P0 (crítico) | P1 (alto) | P2 (medio) | P3 (bajo)
- **Tipo:** happy path | borde | error
- **Precondiciones:** <estado del sistema antes>
- **Pasos:**
  1. <paso 1>
  2. <paso 2>
- **Resultado esperado:** <qué debe ocurrir / qué se debe ver>
- **Datos:** <inputs concretos o [DATA PENDIENTE]>

(repetir por cada caso)

> Los casos simples pueden inline aquí. Los casos e2e o de integración complejos pueden vivir en archivos separados en `qa/cases/` y referenciarse desde aquí.

---

## 5. Criterios de salida

- [ ] <Criterio 1: ej. "100% de P0 en verde"></li>
- [ ] <Criterio 2: ej. "Cobertura de líneas ≥ X% en los módulos del scope">
- [ ] <Criterio 3: ej. "Sign-off de QA y Product owner">

---

## 6. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| <riesgo 1> | Alta/Media/Baja | Alto/Medio/Bajo | <acción> |

---

## 7. Dependencias y bloqueos

- <Dependencia de infra, de otro equipo, de un dato de producción anonimizado, etc.>

---

## 8. Próximos pasos

- <Quién implementa los tests del plan>
- <Cuándo / hito>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin scope y objetivo claros el plan se va de tamaño.
2. **Leer el contexto:** PRD/ADR del scope, suite de tests existente del proyecto, código del scope si es accesible.
3. **Decidir niveles a cubrir:** unit + integration siempre; e2e si hay flujo de usuario completo; perf/security solo si el scope lo pide explícitamente.
4. **Listar casos** por nivel, priorizando happy path crítico → bordes → errores. Mantén el conjunto manejable: un plan con 200 casos sin priorizar no se ejecuta.
5. **Marcar `[DATA PENDIENTE]`** en casos cuyo input concreto necesita aportar el equipo, y `[ENTORNO PENDIENTE]` en lo que depende de infra no disponible.
6. **Definir criterios de salida** verificables (no "todo verde"; mejor "100% de P0 en verde y P1 ejecutados").
7. **Identificar riesgos y dependencias** explícitamente.
8. **Guardar** en `<proyecto>/software/qa/plans/test-plan-<slug>.md` (la ruta exacta la facilita el orquestador o el agente que invoca esta skill).
9. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen: niveles cubiertos, número de casos por nivel, riesgos principales.
   - Lo que queda con `[DATA PENDIENTE]` / `[ENTORNO PENDIENTE]`.
   - Próximo paso sugerido (típicamente: `software-coding` para implementar los tests del plan, o revisar el plan con el product owner si los criterios de aceptación no estaban claros).

---

## Restricciones

- **No implementar el código de los tests.** Esta skill produce el plan; la implementación es trabajo de `software-coding` o del desarrollador.
- **No prometer cobertura del 100%.** Persigues cobertura crítica con criterio, no por la métrica.
- **No diseñar para un entorno ideal inexistente.** Si la infra real tiene limitaciones, el plan las refleja y propone mitigación (mocks, contract tests, smoke en producción).
- **No mezclar el plan con el report de ejecución.** El plan es input para ejecutar; el report del resultado va en otro archivo (`qa/reports/...`) que esta skill no produce.
- **No omitir P0 por falta de datos.** Si un P0 carece de datos concretos, queda `[DATA PENDIENTE]` y se marca como bloqueante para la ejecución.
- Aplican las reglas de output de `_shared/output-rules.md`.
