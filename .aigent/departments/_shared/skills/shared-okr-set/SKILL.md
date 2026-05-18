---
name: "shared-okr-set"
user-invocable: true
description: >
  Shared skill for producing a structured OKR set (Objectives + Key Results) for
  any level (company, department, team, individual) and cycle (annual,
  quarterly). 1-3 qualitative objectives × 2-4 quantitative key results each,
  scoring 0.0-1.0, cadence and check-ins documented. Used cross-department
  (product-metrics, hr-evaluation for personal OKRs, marketing-strategy).
---

# Skill: OKR Set

**Entregable:** archivo `.md` con el set de OKRs estructurado para un nivel y ciclo concretos. Vive en la carpeta del dept que lo solicite — la skill es compartida en `_shared/skills/`, los outputs no.

---

## Cuándo usar esta skill

- Llega un nuevo ciclo (trimestre, año) y hay que definir OKRs de empresa, dept, equipo o individual.
- Hay que reescribir OKRs vigentes porque cambió la estrategia.
- Hay que documentar OKRs personales en el marco de un performance review o growth plan.

**Cuándo NO usar:**

- Para definir un KPI individual (esa es la ficha de métrica, no OKR).
- Para roadmap operativo (eso es `product-roadmap`).
- Para to-do list de iniciativas — OKR es outcome, no output.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Nivel | Empresa / departamento / equipo / individual |
| Ciclo | Anual / semestral / trimestral / otro |
| Periodo | Fechas exactas (Q1 2027 = Ene-Mar 2027, etc.) |
| Conexión | ¿De qué OKR superior cuelga este? (OKRs no viven aislados) |
| Estrategia / contexto | ¿Cuál es la prioridad estratégica del periodo? |
| Inputs | Para individuales: career framework + growth plan vigente. Para dept: north star + estrategia. |
| Cadencia de check-in | Semanal / quincenal / mensual |
| Cultura OKR | ¿Es la primera vez con OKRs en este nivel o ya hay madurez? |

---

## Plantilla del entregable

Nombre del archivo: `okrs-<nivel>-<periodo>.md` (ej. `okrs-company-2027-Q1.md`, `okrs-product-team-2027-H1.md`, `okrs-juan-perez-2027-Q1.md`).

```markdown
---
type: "okr-set"
level: "company | department | team | individual"
owner_or_subject: "<empresa / dept / equipo / persona>"
cycle: "annual | biannual | quarterly | custom"
period_start: "YYYY-MM-DD"
period_end: "YYYY-MM-DD"
parent_okrs: "<referencia al set superior si aplica>"
status: "draft | approved | in-execution | scored | retired"
last_check_in: "YYYY-MM-DD"
next_check_in: "YYYY-MM-DD"
cadence: "weekly | biweekly | monthly"
confidentiality: "public | internal | restricted"
language: "es | en"
---

# OKRs — <Nivel / Sujeto> · <Periodo>

## 0. Contexto del periodo

> 3-5 líneas: prioridad estratégica del ciclo, qué quiere lograr el nivel superior, por qué estos OKRs y no otros.

**Conexión con nivel superior:**
- Estos OKRs alimentan a: <parent OKRs reference>
- Outcome principal del periodo: <una frase>

---

## 1. Objectives + Key Results

> Regla de oro: 1-3 objetivos máximo. Cada uno con 2-4 KRs. Más es ruido.

### O1 — <Objetivo cualitativo en lenguaje aspiracional>

> ¿Qué intentamos conseguir? 1 frase memorable, motivadora, sin números.

**Key Results:**

| KR | Métrica | Baseline | Target | Target stretch | Score |
|---|---|---|---|---|---|
| KR1.1 | <métrica clara> | <valor inicial> | <objetivo realista> | <objetivo aspiracional> | <0.0-1.0> |
| KR1.2 | <métrica> | <baseline> | <target> | <stretch> | <score> |
| KR1.3 | <métrica> | | | | |

**Cómo lo vamos a lograr (initiatives):**

> Las initiatives **no son KRs** — son el "cómo". Lista informal de proyectos / acciones que persiguen los KRs. Cambian; los KRs no.

- <Iniciativa 1>
- <Iniciativa 2>
- <Iniciativa 3>

**Confianza inicial (1-5):** <X> · *¿Cómo de seguros estamos de poder mover estos KRs?*

---

### O2 — <Objetivo 2>

(misma estructura)

---

### O3 — <Objetivo 3>  *(opcional, máximo)*

(misma estructura)

---

## 2. Dependencias y bloqueos

> Stakeholders externos o recursos sin los cuales algún KR no se mueve.

| Dependencia | Owner externo | Impacto si falla | Mitigación |
|---|---|---|---|
| <Equipo X entrega <Y>> | <persona> | <KR2.1 imposible> | <plan B> |

---

## 3. Cadencia de check-in

- **Frecuencia:** <semanal / quincenal / mensual>
- **Formato:** <stand-up de 15 min / async update / 1:1 con manager>
- **Quién participa:** <listado>
- **Qué se actualiza cada check-in:** confianza por O, score acumulado por KR, blockers, ajustes de iniciativas (no de KRs).

**Próximo check-in:** <fecha>

---

## 4. Scoring (al cerrar el ciclo)

> Sección que se rellena al final del ciclo. Antes vive vacía o con scores parciales.

### Score por objetivo

| O | KRs | Promedio KR | Score O | Comentario |
|---|---|---|---|---|
| O1 | 0.7 / 0.5 / 0.9 | 0.70 | 0.70 | <breve> |
| O2 | | | | |
| O3 | | | | |

**Score promedio del set:** <X>

### Lectura del score (escala OKR convencional)

- **0.7-1.0:** target cumplido o casi cumplido. Si todo el set sale 1.0 sistemáticamente, los targets son demasiado conservadores.
- **0.3-0.7:** stretch perseguido honestamente. Zona saludable.
- **0.0-0.3:** target no se movió. Investigar: ¿el KR estaba mal? ¿faltó capacidad? ¿se priorizó otra cosa?

---

## 5. Retrospectiva

> Al cerrar el ciclo, rellenar. Antes vive vacío.

**Lo que funcionó:**
- <observación>

**Lo que no funcionó:**
- <observación>

**Aprendizajes para el siguiente ciclo:**
- <aprendizaje>

**Iniciativas que continúan en el siguiente ciclo:**
- <listado>

---

## 6. Aprobaciones (si formal)

| Aprobación | Responsable | Fecha | Estado |
|---|---|---|---|
| Aprobación del set | <CEO / dept lead / manager> | | [PENDIENTE / OK] |
| Aprobación de stretch targets | <mismo> | | [PENDIENTE / OK] |

---

## 7. Anexos

- OKRs del nivel superior: <link>
- Career framework (si individual): <link>
- KPI tree del producto (si product): <link>
- Histórico de OKRs (cycles anteriores): <link>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin conexión a nivel superior, los OKRs viven aislados y se desalinean.
2. **Definir 1-3 objetivos cualitativos.** Cada objetivo memorable, motivador, sin número. "Mejorar engagement" es flojo; "Convertirnos en la herramienta diaria de los growth leads" es mejor.
3. **Por cada objetivo, definir 2-4 KRs cuantitativos.** Cada KR es una métrica + baseline + target. Si un KR no se puede medir numéricamente, no es KR.
4. **Distinguir target vs stretch target.** Target = realista, esperable con esfuerzo razonable. Stretch = aspiracional, 0.7-1.0 si se acierta. Ambos transparentes.
5. **Confianza inicial declarada por objetivo.** Si la confianza es 5/5, probablemente los targets son tibios. Si es 1/5, probablemente son irreales.
6. **Initiatives separadas de KRs.** Las iniciativas son el "cómo" — cambian durante el ciclo. Los KRs son el "qué" — no se cambian a mitad de ciclo salvo causa mayor.
7. **Cadencia de check-in declarada.** Sin check-in, los OKRs se olvidan hasta el último día.
8. **Dependencias explícitas.** OKRs que dependen de un equipo externo y no lo declaran tienen plan de fracaso integrado.
9. **Marcar `[BASELINE PENDIENTE]`** lo que requiere medición previa, `[STAKEHOLDER PENDIENTE]` los dependientes sin coordinación, `[APROBACIÓN PENDIENTE]` lo que necesita ratificación.
10. **Guardar** en la carpeta del dept consumidor:
    - Company / dept-level → `<proyecto>/product/metrics/okrs/` o equivalente del dept.
    - Personal → `<proyecto>/hr/evaluation/<persona-slug>-okrs-<periodo>.md`.
    - Otros → consultar al usuario.
11. **Reportar** al usuario: ruta, número de Os y KRs, próximo check-in, items pendientes.

---

## Restricciones

- **No mezcles initiatives con KRs.** Initiatives son el cómo y cambian; KRs son el qué y no se cambian a mitad de ciclo.
- **No definas más de 3 objetivos.** Más es señal de que no hay foco — y sin foco, los OKRs son una to-do list.
- **No definas KRs sin baseline.** Sin "de dónde partimos", "movimiento" no es comparable.
- **No definas KRs binarios** ("lanzar X feature" sí/no). Eso es output, no outcome. Si el KR no se puede mover por partes, busca una métrica que sí.
- **No declares OKRs sin conexión al nivel superior.** Aislados, derivan al equipo lejos de la estrategia.
- **No copies OKRs del año pasado.** Cada ciclo se redefine, aunque herede iniciativas.
- **No mezcles confidencialidad.** Company OKRs típicamente transparentes; individual OKRs típicamente solo manager + persona + HR.
- **No olvides la retrospectiva al cerrar.** OKRs sin retro repiten errores de ciclos anteriores.
- Aplican las reglas de output de `_shared/output-rules.md`.
