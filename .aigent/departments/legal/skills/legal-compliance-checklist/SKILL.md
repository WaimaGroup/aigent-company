---
name: "legal-compliance-checklist"
user-invocable: true
description: >
  Skill for producing a structured compliance checklist against a specific
  framework (GDPR, SOC 2, ISO 27001, HIPAA, PCI DSS, sectorial): controls,
  current status (pass/fail/partial/N-A), gap analysis, remediation plan with
  priorities, audit-ready output. NOT legal advice — requires human counsel
  validation.
---

# Skill: Compliance Checklist

**Entregable:** archivo `.md` con la checklist completa contra el marco aplicable + gap analysis + remediation plan. Vive en `<proyecto>/legal/risk/reviews/<framework>-compliance-<YYYY-MM>.md`.

---

## Cuándo usar esta skill

- Preparación para auditoría / certificación (SOC 2, ISO 27001, etc.).
- Compliance review periódica (semestral / anual) contra un marco al que la empresa está sujeta.
- Entrada a un mercado nuevo con regulación específica (UE GDPR, US HIPAA, EU NIS2, etc.).
- Cliente importante exige certificación o evidencias de compliance.

**Cuándo NO usar:**

- Para una política individual (cookie policy, privacy policy específicos — usar `privacy-policy` o `terms-of-service`).
- Para análisis de riesgo amplio (es `risk-matrix` — shared).
- Para due diligence M&A (es alcance distinto — el agente `legal-risk` con plantilla interna o sub-skill futura).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Framework | GDPR / SOC 2 / ISO 27001 / HIPAA / PCI DSS / sectorial específico |
| Variante / level | SOC 2 Type I o II / ISO 27001:2022 / etc. |
| Scope | ¿Toda la empresa o un subset (servicio, equipo, mercado)? |
| Estado actual | Primera evaluación / re-evaluación periódica / preparación auditoría externa |
| Auditor externo | Si aplica, ¿quién audita y cuándo? |
| Owner interno | Compliance Officer / Legal / CISO / CFO |
| Evidencias disponibles | Documentación previa, audits anteriores, certificaciones vigentes |
| Plazo objetivo | ¿Para cuándo se necesita estar compliant? |

---

## Plantilla del entregable

Nombre del archivo: `<framework-slug>-compliance-<YYYY-MM>.md` (ej. `gdpr-compliance-2026-05.md`, `soc2-type2-compliance-2026-05.md`).

```markdown
---
type: "compliance-checklist"
framework: "GDPR | SOC 2 Type II | ISO 27001:2022 | HIPAA | PCI DSS | sectorial"
scope: "<descripción del scope>"
status: "draft | reviewed | published | submitted-to-auditor"
review_date: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<rol/persona>"
external_auditor: "<auditor / N/A>"
audit_date_planned: "YYYY-MM-DD | N/A"
confidentiality: "internal | audit-restricted"
counsel_review: "[REVISAR LEGAL]"
---

# Compliance Checklist — <Framework> · <YYYY-MM>

> **[REVISAR LEGAL]** Este documento es una checklist estructurada producida por el agente legal-risk. Antes de presentarlo como evidencia ante un auditor o regulador, requiere validación por counsel humano especializado en el marco aplicable.

## 0. Resumen ejecutivo

> 5-7 líneas. Estado global de compliance, gaps materiales, plan de acción.

**Estado global:** 🟢 Compliant / 🟡 Compliant con gaps menores / 🔴 Non-compliant con gaps materiales

| Estado | Cantidad de controles |
|---|---|
| ✅ Pass | <N> |
| 🟡 Partial | <N> |
| ❌ Fail | <N> |
| ⚪ N/A | <N> |

**% compliance:** <pass / (pass + partial + fail)> = <%>

**Top 5 gaps a resolver primero:**
1. <Control + razón + acción>
2. ...

**Recomendación general:** <una frase>

---

## 1. Metodología

### Marco de referencia

- **Framework:** <nombre + versión / año>
- **Documentación oficial:** <link a estándar — RGPD UE 679/2016, ISO 27001:2022, SOC 2 TSC 2017 con revisiones, etc.>
- **Variante:** <ej. SOC 2 Type II (operating effectiveness sobre 6-12 meses) vs Type I (point-in-time)>

### Scope

- **Incluido en este audit:**
  - <Servicios / sistemas>
  - <Equipos / áreas>
  - <Geografías>
- **Excluido (con justificación):**
  - <Item + razón: ej. "Servicio legacy en sunset, no aplica para audit Y">

### Criterios de evaluación

Por cada control:
- ✅ **Pass:** control implementado, documentado y operando consistentemente con evidencia.
- 🟡 **Partial:** control parcialmente implementado o falta documentación; gap material no.
- ❌ **Fail:** control no implementado o gap material.
- ⚪ **N/A:** control no aplica al scope (justificar).

### Fuentes de evidencia

- Políticas internas existentes.
- Documentación técnica (architecture docs, runbooks).
- Logs de sistemas + dashboards.
- Entrevistas con owners de procesos.
- Audits previos (interno o externo).

---

## 2. Checklist de controles

> Por dominio del framework. Cada control con estado + evidencia + gap si aplica.

### Dominio 1 — <ej. Access Control / Información sobre protección de datos / Confidencialidad>

#### Control 1.1 — <nombre del control>

| Campo | Detalle |
|---|---|
| **ID en framework** | <ej. ISO A.5.15 / SOC 2 CC6.1 / GDPR Art. 32> |
| **Descripción** | <una línea del control esperado> |
| **Estado** | ✅ Pass / 🟡 Partial / ❌ Fail / ⚪ N/A |
| **Evidencia** | <link a política / log / docs / dashboard que demuestra el control> |
| **Owner** | <persona o rol> |
| **Gap (si Partial / Fail)** | <descripción del gap> |
| **Riesgo del gap** | Alto / Medio / Bajo |
| **Plan de remediación** | <acción + owner + plazo> |
| **Última verificación** | <fecha> |

#### Control 1.2 — <nombre>

(misma estructura)

(repetir por control aplicable al dominio)

### Dominio 2 — <nombre>

(misma estructura)

(repetir por dominio del framework)

---

## 3. Gap analysis consolidado

> Vista resumen de todos los gaps detectados.

### Gaps críticos (Fail con riesgo Alto)

| Control | Framework ID | Gap | Riesgo | Plan | Owner | Plazo |
|---|---|---|---|---|---|---|
| <Control X> | <ID> | <descripción> | Alto | <acción> | <persona> | <fecha> |

### Gaps mayores (Partial con riesgo Alto, o Fail con riesgo Medio)

| Control | Framework ID | Gap | Plan | Owner | Plazo |
|---|---|---|---|---|---|

### Gaps menores (Partial con riesgo Medio o Bajo)

| Control | Framework ID | Gap | Plan |
|---|---|---|---|

---

## 4. Plan de remediación priorizado

> Hoja de ruta para cerrar los gaps. Prioridad basada en riesgo + plazo de audit.

### Sprint 1 — gaps críticos (próximas 2-4 semanas)

| Item | Owner | Effort estimado | Bloqueador? |
|---|---|---|---|
| Implementar <control 1> | <persona> | <X días> | Sí — sin esto no podemos certificar |
| Documentar <control 2> | <persona> | <X días> | Sí |

### Sprint 2 — gaps mayores (1-2 meses)

| Item | Owner | Effort | Bloqueador? |
|---|---|---|---|

### Sprint 3 — gaps menores (3 meses)

| Item | Owner | Effort |
|---|---|---|

### Quick wins (resolvibles en días)

- <ej. "Actualizar la política X que está desactualizada y ya cubre el control Y">

---

## 5. Evidencias preparadas para auditor (si aplica)

> Carpeta consolidada de docs que se entregarán al auditor.

| Categoría | Documentos | Status |
|---|---|---|
| Políticas internas | <listado de links> | ✅ Listo / 🟡 En revisión |
| Architecture docs | <link> | |
| Logs samples + retention proof | <link> | |
| Training records | <link> | |
| Incident response evidence | <link> | |
| Penetration test results (si aplica) | <link> | |
| Third-party assessments / DPAs | <link> | |
| Risk assessments | <link a risk-matrix> | |

---

## 6. Riesgos del compliance journey

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| <No llegamos a tiempo para el audit externo planeado> | Media | Alto | Acelerar Sprint 1 + considerar postponer audit 1 mes |
| <Gap material descubierto durante audit> | Media | Alto | Conducir pre-audit interno con auditor externo en mock-mode |
| <Cambio organizativo invalida controles documentados> | Baja | Medio | Re-verificar controles tras cualquier reorg |
| <Dependencia de proveedor sin certificación equivalente> | Variable | Variable | Solicitar DPA + certificaciones del proveedor |

---

## 7. Histórico de compliance reviews

> Track del journey de compliance en el tiempo.

| Fecha | Framework | % compliance | Gaps materiales | Notas |
|---|---|---|---|---|
| <YYYY-MM-DD> | <framework> | <%> | <N> | <evento clave> |
| <YYYY-MM-DD> | <framework> | <%> | <N> | |

---

## 8. Próxima revisión

- **Cadencia:** anual / semestral / trimestral (según criticidad del framework).
- **Próxima revisión completa:** <fecha>.
- **Triggers para re-evaluación fuera de cadencia:** cambio organizativo material, incidente de seguridad, cambio regulatorio, audit externo programado.

---

## 9. Anexos

- **Framework de referencia (link oficial):** <URL>
- **Audits anteriores:** <links>
- **Policy library actualizada:** <link>
- **Risk matrix actualizada:** <link a `<proyecto>/legal/risk/<scope>-risk-matrix.md` con risk-matrix shared>
- **DPAs y certificaciones de proveedores:** <link>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin framework declarado, scope y owner, parar.
2. **Identificar la versión exacta del framework** (ISO 27001:2022 ≠ :2013; SOC 2 Trust Services Criteria 2017 con revisiones).
3. **Mapear controles aplicables al scope.** No todos los controles aplican a todas las empresas; documentar los N/A con justificación.
4. **Recoger evidencia por control.** Sin evidencia, el control no se cuenta como Pass aunque exista la práctica.
5. **Evaluar honestamente.** Pass es Pass; Partial no se sube a Pass por presión. Fail también es honesto y accionable.
6. **Priorizar gaps por riesgo × proximidad de audit.** Sin priorización, el plan se vuelve list inmanejable.
7. **Plan de remediación con sprints**, no "todo el año que viene".
8. **Consolidar evidencias** en una carpeta lista para auditor cuando aplica.
9. **Marcar `[REVISAR LEGAL]`** las interpretaciones del marco que requieren counsel especializado, `[OWNER PENDIENTE]` controles sin dueño, `[EVIDENCE PENDING]` documentación pendiente de generar.
10. **Guardar** en `<proyecto>/legal/risk/reviews/<framework>-compliance-<YYYY-MM>.md`.
11. **Reportar** al usuario: ruta, % compliance, top 5 gaps, fecha de próxima revisión.

---

## Restricciones

- **No emites opinión legal vinculante.** La checklist es estructurada; la decisión final de compliance la da counsel + auditor externo.
- **No declares "fully compliant" sin auditoría externa.** "Internal review completed with X gaps" es honesto.
- **No infles evidencias.** Una política sin enforcement no es evidencia de control.
- **No saltes controles "incómodos".** El framework completo o no.
- **No omitas el plan de remediación.** Checklist sin plan es solo diagnóstico.
- **No copies compliance reviews de otra empresa.** Cada empresa tiene su scope, sus sistemas, sus gaps.
- **No prometas cumplir un audit externo sin haber resuelto los gaps críticos primero.**
- **No olvides re-evaluación periódica.** Controls drift sin re-verificación; los gaps reaparecen.
- **No mezcles framework.** GDPR y SOC 2 son distintos — una checklist por framework.
- Aplican las reglas de output de `_shared/output-rules.md`.
