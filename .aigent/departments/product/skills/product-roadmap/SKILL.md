---
name: "product-roadmap"
description: >
  Skill for producing a structured product roadmap by horizon (now/next/later or
  by quarter) with outcomes per initiative, owners, dependencies, risks and
  success criteria. Roadmap as objective, not contract.
---

# Skill: Product Roadmap

**Entregable:** archivo `.md` con la hoja de ruta, listo para presentación interna y como input para planificación de equipos, guardado en `<proyecto>/product/strategy/roadmap/roadmap-<periodo>.md`.

---

## Cuándo usar esta skill

- Hay que producir el roadmap del próximo trimestre / semestre / año.
- Hay que actualizar un roadmap previo porque cambió la priorización, llegó nueva información o cambió capacidad.
- Hay que comunicar a leadership / equipo / stakeholders externos lo que viene y por qué.

**Cuándo NO usar:**

- Para el backlog tactical de un sprint (eso es otro nivel, vive en la herramienta de tracking).
- Para un plan de proyecto interno (cómo se ejecuta una iniciativa concreta — eso es planning, no roadmap).
- Para la priorización aislada (eso es output previo: prioritization document). El roadmap consume la priorización ya hecha.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Horizonte | ¿Now/Next/Later o por trimestres (Q1-Q4) o por release? |
| Periodo cubierto | ¿Qué ventana de tiempo? (ej. Q2-Q4 2026, H2 2025…) |
| Audiencia | ¿Para quién lo presentamos? (equipo, leadership, board, externo) |
| Iniciativas candidatas | Lista priorizada de iniciativas (de un prioritization previo, de OKRs, de stakeholders) |
| Capacidad estimada | ¿Cuántos equipos / personas / story points por trimestre? |
| Outcomes vinculados | ¿Qué outcomes/OKRs se quieren mover? |
| Restricciones | Dependencias técnicas, hitos comerciales, regulatorias, otras |
| Estilo visual | ¿Tabla, gantt, swim-lane? (por defecto: tabla en markdown; gantt se puede acompañar como anexo) |

---

## Plantilla del entregable

```markdown
---
type: "product-roadmap"
period: "<Q2-Q4 2026 | now/next/later | H2 2025>"
audience: "team | leadership | board | external"
last_updated: "YYYY-MM-DD"
status: "draft | reviewed | published"
owner: "<rol/persona>"
horizon_style: "now-next-later | quarterly | release-based"
---

# Product Roadmap — <Periodo>

## 0. Resumen ejecutivo

> 5-7 líneas. Qué outcomes perseguimos, qué bets clave hay y qué se queda fuera y por qué.

**North Star vigente:** <métrica + valor objetivo del periodo>

**Bets / temas estratégicos del periodo:**
1. <Bet 1>
2. <Bet 2>
3. <Bet 3>

**Notas sobre confianza:** este roadmap refleja la mejor planificación con la información disponible a <fecha>. Se actualiza con cadencia <X>. Las iniciativas en "Later" tienen menor confianza por diseño.

---

## 1. Horizonte

### NOW (en ejecución / Q en curso)

> Iniciativas comprometidas, en discovery activo o en build. Confianza alta.

| Iniciativa | Outcome objetivo | Owner | Equipo | Estado | Riesgo principal | Criterio de éxito |
|---|---|---|---|---|---|---|
| <Iniciativa 1> | <métrica + delta> | <owner> | <equipo> | discovery / build / launch | <riesgo> | <KPI ≥ X> |
| <Iniciativa 2> | ... | ... | ... | ... | ... | ... |

### NEXT (próximo Q)

> Iniciativas a las que apostamos en el siguiente trimestre. Confianza media-alta. Pueden ajustarse según lo que aprendamos en NOW.

| Iniciativa | Outcome objetivo | Owner | Hipótesis principal | Discovery necesario | Riesgo principal |
|---|---|---|---|---|---|
| <Iniciativa 3> | ... | ... | ... | sí / no | ... |

### LATER (más allá)

> Apuestas más lejanas. Confianza baja. Se exploran, pero no se compromete fecha.

- <Iniciativa 4>: <una línea sobre el outcome esperado y la hipótesis>
- <Iniciativa 5>: ...

---

## 2. Roadmap por trimestre *(usar si horizon_style = quarterly)*

| Trimestre | Iniciativa | Outcome objetivo | Confianza | Owner |
|---|---|---|---|---|
| Q2 2026 | <Iniciativa A> | <outcome> | Alta | <owner> |
| Q2 2026 | <Iniciativa B> | <outcome> | Alta | <owner> |
| Q3 2026 | <Iniciativa C> | <outcome> | Media | <owner> |
| Q4 2026 | <Iniciativa D> | <outcome> | Baja | <owner> |

> **Confianza:**
> - **Alta** — discovery validado, capacidad asignada, dependencias resueltas.
> - **Media** — discovery parcial; capacidad provisional.
> - **Baja** — solo hipótesis y/o capacidad por confirmar.

---

## 3. Por iniciativa — ficha breve

> Una sección breve por iniciativa "NOW" y "NEXT". "LATER" puede quedar como bullet.

### <Iniciativa 1>

- **Outcome objetivo:** <métrica + delta>
- **Hipótesis principal:** <si hacemos X, esperamos Y porque Z>
- **Discovery vinculado:** <ruta a research/discovery>
- **PRD vinculado:** <ruta a prd>
- **Métrica de éxito:** <KPI + threshold>
- **Dependencias:** <listado>
- **Riesgo principal:** <riesgo + mitigación>
- **Owner:** <persona>
- **Equipo asignado:** <equipo>
- **Hitos:**
  - <hito 1 con fecha objetivo>
  - <hito 2>

(repetir por iniciativa)

---

## 4. Lo que NO está en el roadmap (y por qué)

> Las cosas que se descartaron o aplazaron son tan informativas como las que entran. Permite alinear stakeholders que esperaban algo.

| Item | Por qué no entra ahora | Cuándo revisitar |
|---|---|---|
| <Item descartado> | <razón: priorización baja, falta discovery, dependencia, capacidad> | <ciclo siguiente o "indefinido"> |

---

## 5. Riesgos del roadmap

> Riesgos que pueden invalidar el roadmap entero (no solo una iniciativa).

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| <Riesgo de capacidad / mercado / dependencia> | Alta/Media/Baja | Alto/Medio/Bajo | <acción> |

---

## 6. Cadencia de revisión

- **Próxima revisión completa:** <fecha>
- **Touchpoints quincenales:** <breve descripción del checkpoint>
- **Trigger de re-priorización fuera de cadencia:** <qué eventos lo gatillan>

---

## 7. Anexos

- Priorización subyacente: <link al prioritization-<ciclo>.md>
- OKRs vinculados: <link al okrs-<ciclo>.md>
- Visualización (gantt / swim-lane si se generó): <link al asset>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin priorización previa y sin capacidad estimada, el roadmap es wishful thinking.
2. **Decidir horizon style:**
   - `now/next/later` por defecto, especialmente para producto en fase early/scale.
   - `quarterly` si la empresa funciona en ritmo trimestral con compromisos firmes.
   - `release-based` solo si hay releases enumeradas y predecibles.
3. **Mapear cada iniciativa a un outcome.** Si una iniciativa "no tiene outcome claro" la marca queda como `[OUTCOME PENDIENTE]` y se devuelve a `product-discovery` o `product-metrics`.
4. **Asignar confianza honesta.** Resistir la presión de marcar todo como "Alta". Confianza baja en LATER es saludable.
5. **Cubrir explícitamente lo que NO entra.** Es la sección que más alinea.
6. **Adaptar el lenguaje a la audiencia:**
   - Equipo: tabla técnica + dependencias claras.
   - Leadership: bets y outcomes; ocultar detalles operativos.
   - Board: visión y outcomes; sin nombres internos.
   - Externo: solo lo que la empresa quiere comprometer públicamente; etiquetar como "directional".
7. **Marcar `[CAPACIDAD POR CONFIRMAR]`** lo que asume disponibilidad de equipo aún no asignada, y `[DISCOVERY PENDIENTE]` lo que entra sin evidencia suficiente.
8. **Guardar** en `<proyecto>/product/strategy/roadmap/roadmap-<periodo>.md`.
9. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen ejecutivo de 5-7 líneas.
   - Items marcados como pendientes.
   - Próximo paso: presentación a leadership, alineamiento con engineering capacity, vinculación con OKRs en `product-metrics`.

---

## Restricciones

- **No comprometas fechas que el equipo no ha validado.** Roadmap = objetivo, no contrato. Comunicarlo así.
- **No empaquetes tareas técnicas internas como iniciativas de producto.** Refactors, migraciones y deuda técnica viven en el roadmap de software/engineering, no en el de producto.
- **No omitas la sección 4 (lo que no entra).** Es el segundo entregable de valor del roadmap.
- **No metas iniciativas sin owner.** Sin owner queda huérfana y nadie la avanza.
- **No publiques roadmap sin cadencia de revisión declarada.** Un roadmap sin actualización es un fósil que confunde más que ayuda.
- **No mezcles backlog táctico.** Si un item es más pequeño que "feature/proyecto", probablemente va al backlog, no al roadmap.
- Aplican las reglas de output de `_shared/output-rules.md`.
