---
name: "software-code-review-checklist"
user-invocable: true
description: >
  Skill for producing a structured code review report: severity-ranked findings
  across correctness, security, tests, readability, idiomatic style, performance,
  maintainability and architecture alignment, ending with a clear verdict.
  Stack agnostic.
---

# Skill: Code Review Checklist

**Entregable:** archivo `.md` con el report de review, listo para vivir en `<proyecto>/software/reviews/`.

---

## Cuándo usar esta skill

- Hay que revisar un PR, un diff, un commit o un módulo y producir un report estructurado.
- Se busca un review reproducible (mismas categorías, mismas severidades) que el autor pueda atender ítem a ítem.
- Se quiere mantener histórico de reviews del proyecto para análisis posterior (qué tipos de hallazgo se repiten, qué módulos generan más bloqueantes).

**Cuándo NO usar:**

- Para reescribir el código del autor. Esta skill produce un report, no parches.
- Para un comentario rápido en chat sin valor histórico. Si es un nit puntual, hablarlo y ya.
- Para auditoría de seguridad profunda (pentest, SAST/DAST automatizados). Esta skill cubre el OWASP básico desde la lectura humana; auditorías exhaustivas piden tooling especializado.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope | ¿Qué se revisa exactamente? (URL del PR, lista de archivos, módulo, commit) |
| Contexto / objetivo del cambio | ¿Hay PRD, ADR, ticket o descripción del PR que indique qué pretende hacer? |
| Stack y convenciones | ¿Lenguaje, framework, linter, style guide del proyecto? |
| Profundidad | Light (solo bloqueantes y majors) / Deep (todo, incluido nits) |
| Foco especial | ¿Hay un eje a priorizar? (seguridad, performance, tests, idiomatic style) |

---

## Plantilla del entregable

Nombre del archivo: `review-<scope-slug>-<YYYY-MM-DD>.md` (ej. `review-pr-142-oauth-2026-05-13.md`).

```markdown
# Code Review: <Título del PR / scope>

- **Fecha:** YYYY-MM-DD
- **Revisor:** <agente / persona>
- **Scope:** <URL del PR / lista de archivos / commit hash>
- **Contexto:** <link al PRD/ADR/ticket si existe, o resumen del propósito del cambio>
- **Profundidad:** Light | Deep
- **Stack:** <lenguaje, framework, versión>

---

## Veredicto

**<✅ Listo para mergear | 🟠 Mergear con cambios menores | 🔴 Requiere cambios bloqueantes>**

**Top 3 a atender primero:**
1. <Hallazgo más crítico, una línea>
2. <Segundo>
3. <Tercero>

**Lo positivo destacable:**
- <Patrón bien resuelto, decisión acertada, test bien planteado>

---

## Resumen por severidad

| Severidad | Cantidad |
|---|---|
| 🔴 BLOCKER | <n> |
| 🟠 MAJOR | <n> |
| 🟡 MINOR | <n> |
| 🔵 NIT | <n> |

---

## Hallazgos

### 🔴 BLOCKER — <Resumen del hallazgo>

- **Archivo:** `<path/al/archivo.ext>:<línea>`
- **Categoría:** Correctness | Security | Tests | Architecture | Other
- **Descripción:** <qué está mal, factualmente>
- **Razón:** <por qué es bloqueante — qué se rompe, qué riesgo introduce>
- **Sugerencia:** <dirección de la corrección, sin escribir la solución completa>
- **Referencias:** <link a OWASP / docs del framework / ADR / regla del style guide, si aplica>

---

### 🟠 MAJOR — <Resumen>

(misma estructura)

---

### 🟡 MINOR — <Resumen>

(misma estructura)

---

### 🔵 NIT — <Resumen>

(misma estructura, puede ser más breve)

---

## Análisis por ejes

> Resumen de qué se ha revisado en cada eje y conclusión. Si un eje no aplica, indicarlo explícitamente.

### Corrección
<Lo que funciona, lo que no, casos borde detectados.>

### Seguridad
<OWASP top 10 básico: inyección, deserialización, secretos, control de acceso, manejo de errores.>

### Tests
<Existencia, calidad, cobertura subjetiva de los casos críticos.>

### Legibilidad
<Nombres, estructura, anidamiento, longitud de funciones.>

### Idiomatic style
<¿Se ve como código natural del lenguaje/framework?>

### Performance
<N+1, loops anidados con I/O, allocations en hot paths. Solo si aplica al scope.>

### Mantenibilidad
<Acoplamiento, duplicación, magic numbers, mocks frágiles.>

### Alineamiento con arquitectura
<Respeto a ADRs previos y a las capas del proyecto.>

---

## Notas para el autor

<Mensaje constructivo cerrando el review. Reconocer el esfuerzo, priorizar lo que pides cambiar, dejar canal abierto.>
```

### Tabla rápida de severidades

| Severidad | Significado | Ejemplos |
|---|---|---|
| 🔴 BLOCKER | No puede mergear así | Bug que rompe casos comunes, secret hardcoded, vulnerabilidad de inyección, romper API pública sin migrar |
| 🟠 MAJOR | Debe arreglarse antes de release | Falta de test en flujo crítico, smell que dificulta mantenimiento real, N+1 en endpoint hot |
| 🟡 MINOR | Conviene arreglar | Naming poco claro, función demasiado larga, log con info útil pero excesiva |
| 🔵 NIT | Opinión / preferencia | Posicionamiento de un import, estilo de string concat, etc. |

---

## Proceso

1. **Recopilar** la información mínima (scope, contexto, profundidad). Si falta el contexto del cambio (no hay PRD/ADR/ticket ni descripción del PR), pedir al usuario que aporte algo — sin contexto del objetivo, el review pierde valor.
2. **Leer el código del scope completo** (no solo el diff si es un PR — los archivos tocados completos, para ver el cambio en su contexto).
3. **Recorrer los ejes** (corrección, seguridad, tests, legibilidad, idiomatic, performance, mantenibilidad, arquitectura). Anotar hallazgos a medida, con archivo:línea y categoría.
4. **Clasificar por severidad** cada hallazgo. Si dudas, baja un nivel (mejor un MINOR sólido que un MAJOR especulativo).
5. **Priorizar nits:** si la profundidad es Light, omite todos los NIT. Si es Deep, limita los NIT a los que aportan algo más que opinión.
6. **Redactar el report** siguiendo la plantilla. El veredicto, el top 3 y los positivos primero — el autor lo lee antes que la cola de hallazgos.
7. **Marcar con `[VERIFICAR]`** los hallazgos donde no estás 100% seguro (suposición sobre comportamiento de una librería, comportamiento en un entorno que no puedes inspeccionar).
8. **Guardar** en `<proyecto>/software/reviews/review-<slug>-<YYYY-MM-DD>.md` (la ruta exacta la facilita el orquestador o el agente que invoca esta skill).
9. **Reportar** al usuario:
   - Ruta del archivo.
   - Veredicto y conteo por severidad.
   - Top 3 a atender.
   - Próximo paso sugerido (`software-coding` para aplicar los bloqueantes, o cerrar el review si es ✅).

---

## Restricciones

- **No escribir la implementación de las correcciones.** Sugieres dirección, no parches.
- **No usar severidad sin justificación.** Un hallazgo `🔴 BLOCKER` sin razón clara queda inflado.
- **No filtrar valores de secretos** detectados en el código en el report. Marcar el hallazgo, no transcribir el secreto.
- **No revisar más allá del scope acordado.** Si el revisor ve algo fuera del diff, lo anota como sugerencia separada al final, no lo cuela como hallazgo del scope.
- **No usar el report para juzgar al autor.** El foco es el código.
- Aplican las reglas de output de `_shared/output-rules.md`.
