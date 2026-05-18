---
name: "software-bug-report"
user-invocable: true
description: >
  Skill for producing a structured bug report: reproduction steps, expected vs
  actual, severity, scope of impact, environment, regression status, attached
  evidence (logs/screenshots/traces). Reproducible by anyone on the team without
  reaching out to the reporter. Stack-agnostic.
---

# Skill: Bug Report

**Entregable:** archivo `.md` con bug report estructurado, listo para entrar al sistema de tracking (Jira, Linear, GitHub Issues, etc.) o vivir como documento de referencia. Vive en `<proyecto>/software/qa/bugs/<bug-slug>-<YYYY-MM-DD>.md`.

---

## Cuándo usar esta skill

- Hay que documentar un bug detectado por QA, soporte, dogfooding interno o report de usuario.
- Hay que formalizar un report antes de pasarlo a engineering para que reproduzcan y arreglen.
- Hay que documentar un bug recurrente que requiere análisis profundo.
- Hay que estandarizar el formato de bugs entre equipos (QA, soporte, dev).

**Cuándo NO usar:**

- Para una feature request (es otro formato).
- Para un incident post-mortem (formato más amplio con timeline y root cause analysis).
- Para un security report (puede requerir formato confidencial específico).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Título | ¿Cuál es el bug en una línea? |
| Pasos de reproducción | ¿Cómo se reproduce paso a paso? |
| Resultado esperado | ¿Qué debería pasar? |
| Resultado actual | ¿Qué pasa en realidad? |
| Severidad | Critical / Major / Minor / Cosmetic |
| Frecuencia | Always / Often / Sometimes / Rare / Once |
| Entorno | OS, browser, app version, account type |
| Impacto | ¿A cuántos usuarios afecta? ¿Qué pueden hacer mientras se arregla? |
| Reporter | ¿Quién lo detectó? (interno / cliente / soporte ticket) |
| Evidencia | ¿Tenemos logs, screenshots, video, trace? |
| Regresión | ¿Funcionaba antes? Si sí, ¿desde qué versión empezó a fallar? |

---

## Plantilla del entregable

Nombre del archivo: `<bug-slug>-<YYYY-MM-DD>.md`.

```markdown
---
type: "bug-report"
title: "<una línea descriptiva>"
severity: "critical | major | minor | cosmetic"
frequency: "always | often | sometimes | rare | once"
status: "new | confirmed | in-progress | fixed | wont-fix | duplicate"
date_reported: "YYYY-MM-DD"
reporter: "<nombre / soporte / customer>"
linked_ticket: "<URL si está en Jira/Linear/GitHub>"
linked_incident: "<URL si hubo incident asociado>"
component: "<área del producto afectada>"
regression_since: "<versión / commit / fecha si aplica>"
---

# Bug: <Título>

## 0. Resumen — 30 segundos

> 2-3 líneas. Qué falla, dónde, severidad, cuántos afectados.

**Severidad:** <Critical / Major / Minor / Cosmetic>
**Frecuencia:** <Always / Often / Sometimes / Rare / Once>
**Usuarios afectados:** <todos / segmento / cuenta concreta — estimación>

---

## 1. Pasos de reproducción

> Si no se puede reproducir, **no es un bug accionable** todavía. Sin repro, devolver al reporter para más detalle.

### Precondiciones

- <Cuenta tipo X / role / data state inicial>
- <Browser / OS / app version>

### Pasos

1. <Acción concreta>
2. <Acción concreta>
3. <Acción concreta>
4. <Resultado>

**Tasa de reproducción:** <ej. "3/3 veces" / "2/5 con cache limpia" / "solo en Safari">

---

## 2. Resultado esperado vs actual

**Esperado:**
- <Lo que debería pasar — específico y verificable>

**Actual:**
- <Lo que pasa en realidad — específico>

**Diferencia operativa:**
- <Cómo afecta al usuario: bloqueo total, workaround, simple molestia>

---

## 3. Severidad — justificación

> La etiqueta de severidad es subjetiva sin justificación.

**Severidad asignada:** <Critical / Major / Minor / Cosmetic>

**Criterios:**

| Severidad | Criterio aplicado |
|---|---|
| 🔴 Critical | Bloquea operación crítica / data loss / security / outage / no workaround |
| 🟠 Major | Funcionalidad importante no funciona / hay workaround pero costoso |
| 🟡 Minor | Funcionalidad menor / cosmetic con impacto leve en UX |
| 🔵 Cosmetic | Visual o textual sin afectar funcionalidad |

**Por qué este nivel y no superior/inferior:**
<Justificación breve>

---

## 4. Scope e impacto

### Usuarios afectados

- **¿Todos los usuarios?** <Sí / segmento concreto: plan, geo, browser, role>
- **Número estimado:** <% del MAU o cifra absoluta>
- **¿Hay un workaround?** <Sí — descripción / No — bloqueante>

### Impacto en negocio

- <Pérdida de revenue estimada si aplica>
- <Riesgo reputacional / soporte tickets esperados>
- <Riesgo de churn>

---

## 5. Entorno

| Campo | Valor |
|---|---|
| OS | <Windows 11 / macOS 14.5 / Ubuntu 22 / iOS 17 / Android 14> |
| Browser (si web) | <Chrome 124 / Safari 17 / Firefox 125> |
| App version | <vX.Y.Z + commit hash si conocido> |
| Backend / API version | <vX.Y> |
| Region / cloud | <eu-west-1 / us-east-1> |
| Account type / plan | <Free / Pro / Enterprise> |
| User role | <admin / member / viewer> |
| Network / VPN | <típico / corporativo / móvil> |
| Cache state | <fresh / cached / incógnito> |

---

## 6. Regresión

- **¿Funcionaba antes?** <Sí / No / No conocido>
- **Última versión conocida funcional:** <vX.Y o "no se sabe">
- **Versión donde empezó a fallar:** <vX.Y o commit / fecha>
- **Cambio sospechoso (si bisect hecho):** <commit + autor + descripción>

---

## 7. Evidencia

### Logs

```
<Pegar líneas relevantes con request_id / trace_id si tracing>
```

**Link a logs completos:** <Datadog / CloudWatch / Kibana URL>

### Screenshots / video

- ![Screenshot 1](<link>)
- <Video reproducción: link>

### Network trace (si web)

```
<Request relevante: method, URL, status code, response>
```

### Stack trace (si error)

```
<Stack trace o link al error tracking — Sentry, Rollbar, etc.>
```

---

## 8. Análisis técnico inicial *(opcional, si el reporter es ingeniero)*

> Hipótesis del por qué. Útil pero no obligatorio.

**Hipótesis:**
- <ej. "race condition entre call al backend y render del componente">
- <ej. "el cache no se invalida cuando user role cambia">

**Áreas del código sospechosas:**
- `<path/to/file.ext:LXX-LYY>`

**Pruebas para validar la hipótesis:**
- <Test sugerido para confirmar>

> Si no hay análisis técnico, indicar `[A INVESTIGAR]`.

---

## 9. Prioridad y next steps

| Campo | Valor |
|---|---|
| Prioridad sugerida | P0 / P1 / P2 / P3 |
| Justificación P | <combinación severidad × frecuencia × impacto> |
| Owner sugerido | <equipo / persona> |
| Sprint target | <Sprint X / Q-fix / next release> |
| Bloqueador para release | <Sí / No> |

---

## 10. Workaround para usuarios

> Si lo hay, comunicar a soporte para que lo aplique mientras se arregla.

- <Workaround paso a paso>
- **Limitaciones del workaround:** <qué no resuelve>
- **Comunicación a usuarios:** <plantilla de respuesta para soporte>

---

## 11. Histórico del bug *(rellenar durante triage / resolución)*

| Fecha | Acción / Estado | Por |
|---|---|---|
| YYYY-MM-DD | Reportado | <reporter> |
| YYYY-MM-DD | Confirmado, reproducido en staging | <QA> |
| YYYY-MM-DD | Asignado a <equipo> | <PM/EM> |
| YYYY-MM-DD | Fix shipped en v<X.Y> | <eng> |
| YYYY-MM-DD | Verificado en producción | <QA> |

---

## 12. Anexos / links

- **Ticket en tracker:** <URL>
- **PR del fix:** <URL si existe>
- **Tests de regresión añadidos:** <listado>
- **Incident post-mortem (si critical):** <URL>
- **Customer-facing communication:** <link a release notes / status page>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin reproducción confirmada, parar — devolver al reporter pidiendo más detalle.
2. **Validar que se reproduce.** Un bug que no se reproduce no es bug accionable; documentar como "needs more info" y volver al reporter.
3. **Asignar severidad con criterio.** Sin justificación, la severidad es opinión. Crítico = bloqueante, data loss, security.
4. **Cuantificar scope.** "Algunos usuarios" es vago; "20% del MAU en Safari" es accionable.
5. **Documentar entorno completo.** Bugs que parecen aleatorios suelen serlo solo en un entorno específico.
6. **Comprobar regresión.** Si funcionaba antes, hay un commit/PR sospechoso. Bisect si es posible.
7. **Adjuntar evidencia.** Sin logs/screenshots, el bug es palabra contra palabra.
8. **Workaround si lo hay.** Comunicar a soporte y a release notes hasta que se arregle.
9. **Marcar `[A INVESTIGAR]`** lo que requiere análisis técnico más profundo y `[VERIFICAR ENTORNO]` lo que el reporter aún no confirmó.
10. **Guardar** en `<proyecto>/software/qa/bugs/<bug-slug>-<YYYY-MM-DD>.md`. Si el proyecto usa Jira/Linear/GitHub Issues, sincronizar o referenciar.
11. **Reportar** al usuario: ruta, severidad, prioridad sugerida, owner sugerido, workaround si hay.

---

## Restricciones

- **No documentes bug sin pasos de reproducción.** Sin repro, no es bug; es feedback.
- **No infles severidad** para llamar la atención. Saturar "critical" desactiva el sistema de prioridad.
- **No omitas entorno.** Bugs en un OS/browser específico son frecuentes; sin saber, no se reproduce.
- **No pegues stack traces gigantes** sin extraer la parte relevante.
- **No prometas fix sin estimación realista.** Si requiere refactor, decirlo.
- **No olvides el workaround.** Para bugs criticales sin fix inmediato, el workaround es lo que mantiene operativo al usuario.
- **No mezcles varios bugs en un report.** Uno por archivo. Si emergen subbugs durante análisis, abrir aparte.
- Aplican las reglas de output de `_shared/output-rules.md`.
