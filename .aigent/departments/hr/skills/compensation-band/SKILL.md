---
name: "compensation-band"
description: >
  Skill for producing a compensation band document for a role: salary range by
  level/seniority, geographic adjustments, base + variable + equity components,
  market benchmark sources, internal equity check, and decision matrix for
  offers/promotions. Jurisdiction-aware.
---

# Skill: Compensation Band

**Entregable:** archivo `.md` con la banda salarial de un rol (o family de roles), lista para uso interno por hiring managers y recruiters al hacer ofertas o promociones. Vive en `<proyecto>/hr/recruitment/compensation/<role-family>-bands-<YYYY>.md`. **Confidencialidad alta** por defecto.

---

## Cuándo usar esta skill

- Hay que definir o actualizar la banda salarial de un rol (recién creado, o existente que se revisa anualmente).
- Hay que justificar una oferta concreta contra una banda.
- Se prepara una conversación de promoción y hay que mirar dónde encaja vs banda.
- Se revisan bandas anualmente con datos de mercado actualizados.

**Cuándo NO usar:**

- Para política general de comp&ben (eso es policy document de HR + plan de variable, equity policy, etc.).
- Para una oferta individual concreta (la oferta se redacta con `job-description` y la negociación se sigue del `sales-proposal`-style — pero en HR).
- Para análisis de gender pay gap u otros temas estructurales (eso es un análisis específico, no banda).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Rol / family | ¿Para qué rol o family? (Backend Engineer, Product Designer, Account Executive, etc.) |
| Niveles | ¿Qué levels existen? (IC1-IC5, M1-M3, Junior / Mid / Senior / Staff / Principal) |
| Geografías | ¿En qué geografías contratamos? (España / UE / US / LATAM / global remote con tiers) |
| Modelo | ¿Solo base? ¿base + variable? ¿base + equity? ¿los tres? |
| Moneda | EUR / USD / múltiples |
| Fuentes de benchmark | ¿Levels.fyi, Pave, Carta, Mercer, glassdoor, propio scrape? |
| Filosofía de comp | ¿Pagamos en mediana de mercado? ¿P75? ¿P90? ¿lower? |
| Pay transparency | ¿Publicamos bandas? ¿En oferta? ¿Internamente abiertas? |
| Última revisión | ¿Cuándo se actualizó última vez? |

---

## Plantilla del entregable

Nombre del archivo: `<role-family>-bands-<YYYY>.md`.

```markdown
---
type: "compensation-band"
role_family: "<ej. Software Engineering, Sales, Design>"
year: "YYYY"
currency_primary: "EUR | USD"
benchmark_sources: ["levels.fyi", "Pave", "Carta", "Mercer", "propio"]
philosophy: "Mediana de mercado | P75 | P90 | Below market"
pay_transparency_external: "yes-band-published | no | only-in-offer"
pay_transparency_internal: "fully-open | bands-shared | manager-only"
status: "draft | approved | in-use"
date: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<People Ops / CPO>"
confidentiality: "restricted"
---

# Compensation Bands — <Role Family> · <YYYY>

> **Confidencial.** Documento de uso interno restringido a hiring managers, recruiters y leadership. No compartir fuera de este círculo sin aprobación explícita de <People Lead>.

## 0. Filosofía de compensación

> 3-5 líneas. La filosofía explica por qué las bandas son las que son.

- **Posicionamiento de mercado:** Pagamos en <P50 / P75 / P90> del mercado para <geografía base>. Justificación: <retención competitiva / atracción de top talent / equilibrio coste-talento>.
- **Pay transparency:** <Internamente todas las bandas son visibles / Solo manager+ las ve / Bandas se publican en JD / No publicamos>.
- **Cómo se decide dentro de la banda:** experiencia relevante, performance histórica, fit del nivel, equity vs cash preferencia.
- **Revisión:** anual con datos de mercado actualizados. Ajustes individuales en performance review.

---

## 1. Estructura de niveles

> Cómo se mapean los niveles del rol a la banda. Definiciones operativas por nivel.

| Nivel | Naming interno | Equivalente típico | Años de experiencia (orientativo) | Scope |
|---|---|---|---|---|
| L1 | <Junior> | Junior / Entry-level | 0-2 | Tareas asignadas con supervisión |
| L2 | <Mid> | Mid-level | 2-5 | Owner de features con supervisión moderada |
| L3 | <Senior> | Senior | 5-8 | Owner end-to-end de proyectos |
| L4 | <Staff> | Staff / Lead | 8-12+ | Impacto cross-team |
| L5 | <Principal> | Principal | 12+ | Impacto cross-org / tech direction |
| M1 | <Engineering Manager> | EM | 5-10 | Manage 3-8 ICs |
| M2 | <Senior Manager> | Sr EM / Director | 8-15 | Manage manages, scope cross-team |

> Los años de experiencia son orientativos, no determinantes. Lo determinante es scope/impacto.

---

## 2. Geographic tiers

> Si la empresa contrata en varias geografías, definir los tiers explícitamente.

### Tier 1 — Hubs principales

- **Geografías:** <ej. Barcelona, Madrid, Berlin>
- **Multiplicador sobre base:** 1.0x (referencia)
- **Justificación:** mercados primarios; primera elección para hiring presencial/híbrido.

### Tier 2 — Mercados secundarios

- **Geografías:** <ej. resto de España, Portugal, Eastern Europe>
- **Multiplicador:** 0.85x
- **Justificación:** coste de vida menor + talento competitivo.

### Tier 3 — Mercados emergentes

- **Geografías:** <ej. LATAM, partes de Asia>
- **Multiplicador:** 0.7x
- **Justificación:** ...

### Tier — Premium (si aplica)

- **Geografías:** <ej. SF Bay Area, NYC, London Zone 1>
- **Multiplicador:** 1.3-1.5x
- **Justificación:** mercados de altísima competitividad.

> Las cifras son ejemplo; ajustar al contexto real.

---

## 3. Bandas — base salary

> Por nivel y geografía. Las cifras son **anuales en moneda local** o convertidas a la moneda primaria.

### En <moneda primaria> · Tier 1 (referencia)

| Nivel | Min | Mid | Max | Spread |
|---|---|---|---|---|
| L1 | 30.000 | 35.000 | 40.000 | 33% |
| L2 | 40.000 | 50.000 | 60.000 | 50% |
| L3 | 60.000 | 75.000 | 90.000 | 50% |
| L4 | 90.000 | 110.000 | 130.000 | 44% |
| L5 | 130.000 | 155.000 | 180.000 | 38% |
| M1 | 70.000 | 85.000 | 100.000 | 43% |
| M2 | 100.000 | 125.000 | 150.000 | 50% |

> Las cifras son ilustrativas. Sustituir por las reales del proyecto.

### Aplicación a otros tiers

Multiplicar por el factor del tier (sección 2). Ejemplo: L3 en Tier 2 = 60.000 × 0.85 a 90.000 × 0.85 = 51.000 a 76.500.

---

## 4. Variable compensation *(si aplica)*

> Solo si el rol incluye variable (Sales, Customer Success en algunos casos).

### Sales

| Nivel | Base | OTE Variable | OTE Total | Acelerador sobre quota | Cap |
|---|---|---|---|---|---|
| Sales SDR | 30.000 | 12.000 | 42.000 | 1.5x sobre 100% | No |
| Sales AE Mid | 50.000 | 50.000 | 100.000 | 1.5x sobre 100% | No |
| Sales AE Sr | 70.000 | 70.000 | 140.000 | 2x sobre 120% | No |

### Reglas

- **Quota:** definida en `sales-playbook` por rol.
- **Pagos:** mensuales / trimestrales según política.
- **Clawback:** si un deal se cancela en X días, comisión se devuelve.

---

## 5. Equity *(si aplica)*

> Grants en forma de RSUs / Options según etapa de la empresa.

### Para early-stage startups (rangos en % de capital)

| Nivel | % equity grant inicial | Refresh anual | Vesting |
|---|---|---|---|
| L1 | 0.01-0.05% | <política> | 4 años, 1 cliff |
| L3 | 0.1-0.3% | | |
| L5 | 0.5-1.0% | | |
| M2 | 0.3-0.8% | | |

### Para empresas con valuation establecida

| Nivel | Valor de grant (USD/EUR) | Refresh anual |
|---|---|---|
| L3 | 100k-150k | 30-50k |

> Adaptar al modelo real de la empresa. Documentar política de ejercicio, dilución prevista, etc., en doc separado de equity.

---

## 6. Benchmark de mercado — fuentes y comparación

> Cómo justificamos las bandas. Sin esto, las bandas envejecen sin fundamento.

### Fuentes consultadas

| Fuente | Cobertura | Última consulta |
|---|---|---|
| Levels.fyi | Tech roles, US-heavy, alguna data EU | YYYY-MM |
| Pave | Compensation benchmarking, suscripción | YYYY-MM |
| Carta | Startup data, equity | YYYY-MM |
| Mercer / Radford | Surveys formales corporate | YYYY-MM |
| Glassdoor / similar | Self-reported, baja fiabilidad | YYYY-MM |
| Datos propios (hires recientes, ofertas competing) | Real-world | YYYY-MM |

### Comparación con benchmark

| Nivel | Nuestra banda (mid) | Mercado P50 | Mercado P75 | Diferencia vs P50 | Diferencia vs P75 |
|---|---|---|---|---|---|
| L3 | 75.000 | 70.000 | 85.000 | +7% | -12% |
| (...) | | | | | |

**Lectura:** estamos al P75 en L3? Bien si filosofía dice P75. Mal si filosofía dice P50 y estamos pagando de menos.

---

## 7. Internal equity check

> Comprobar que dentro de la banda no hay inequidades injustificables.

### Por persona

| Persona | Nivel | Base | Posición en banda | Tiempo en nivel | Notas |
|---|---|---|---|---|---|
| <Persona A> | L3 | 75.000 | Mid (50%) | 18 meses | Performance "exceeds" últimas 2 reviews |
| <Persona B> | L3 | 65.000 | Lower (25%) | 6 meses | Recién promocionada |
| <Persona C> | L3 | 88.000 | Upper (88%) | 30 meses | High performer, expansion futura a L4 |

### Red flags a buscar

- 🚩 Dos personas en mismo nivel + mismo tiempo en nivel + misma performance pero distinta paga.
- 🚩 Gender pay gap dentro del mismo nivel (analizar por nivel y geografía).
- 🚩 Compa-ratio < 80% para nadie sin justificación (sub-pagamos respecto al mid).
- 🚩 Compa-ratio > 110% sin claro path a promoción (over-pagados; topcap antes de promover).

> **Acciones:** marcar `[REVISAR]` lo que no encaje. Llevar a próxima compensation review.

---

## 8. Decision matrix para ofertas y promociones

### Offer letter — dónde dentro de la banda

| Caso | Posición en banda recomendada |
|---|---|
| Candidato con experiencia justo en el rango bajo del nivel | Min - Mid |
| Candidato con experiencia sólida y alineada | Mid |
| Top candidate, competencia activa, scope superior | Mid - Upper |
| Candidato senior excepcional, candidato a promoción rápida | Upper, plan de revisión a 6 meses |

### Promoción interna — dónde dentro de la nueva banda

- Default: **Min de la nueva banda + ajuste para que el incremento sea ≥10%** sobre la actual.
- Si quedaría > Max del nivel previo o si la persona está en lower del nuevo banda con experiencia, considerar ofrecer Mid del nuevo banda.

### Ajustes anuales / merit increases

| Performance review | Ajuste base sugerido (sobre base actual) |
|---|---|
| Exceeds expectations | +5-8% |
| Meets expectations | +2-4% |
| Below expectations | 0% (o PIP path) |

> **Ajustar por inflación** además del ajuste por performance, según política de empresa y geografía.

---

## 9. Pay transparency

### Hacia el candidato externo

- En JD: <publicamos banda completa / publicamos rango "competitivo competitive + benefits" / no publicamos>.
- En entrevista (screening): <recruiter da rango antes de profundizar / lo da al final / cliente lo pregunta y se responde>.

### Internamente

- <Todas las bandas son visibles a empleados / Solo manager + ve la banda del rol que gestiona / Cada persona ve solo su banda>.
- Para promociones: <comunicación al equipo / individual>.

### Cumplimiento normativo

- **UE Pay Transparency Directive (2023/970):** marcar el cumplimiento si aplica.
- **EEUU (California, Colorado, NYC, etc.):** publicación de rango obligatoria si publicas vacante.
- **Otros marcos locales aplicables:** <listado>.

---

## 10. Histórico y próxima revisión

### Última revisión

- **Fecha:** YYYY-MM-DD
- **Cambios principales aplicados:**
  - <Ej. "L3 subió 5% en Tier 1 por presión de mercado">
  - <Ej. "Añadido Tier Premium para SF Bay">

### Próxima revisión

- **Fecha objetivo:** YYYY-MM-DD (típicamente anual)
- **Datos a actualizar:** benchmark de fuentes, internal equity check, ajustes por inflación.

---

## 11. Anexos

- **Política de comp&ben general:** <link>
- **Política de equity:** <link>
- **Política de variable / plan comisional:** <link>
- **Datos de benchmark crudos:** <link a spreadsheet>
- **Histórico de hires y ofertas:** <link>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin filosofía de comp y geografías, parar.
2. **Definir niveles primero**, antes de números. Sin claridad de level definitions, las bandas son arbitrarias.
3. **Estructurar geographic tiers** explícitamente si la empresa contrata en varias geografías.
4. **Construir las bandas base** (sección 3). Las cifras vienen del benchmark + filosofía declarada.
5. **Añadir variable y equity** si aplican al rol/empresa.
6. **Documentar fuentes de benchmark con fechas.** Sin esto, la banda envejece sin que nadie sepa.
7. **Internal equity check** con personas reales (sección 7). Es donde típicamente saltan problemas.
8. **Decision matrix para ofertas y promociones** consistente. Sin matrix, cada manager decide en función de su criterio.
9. **Pay transparency policy** declarada — el silencio se interpreta peor que la verdad.
10. **Marcar `[BENCHMARK PENDIENTE]`** lo que requiere fuente actualizada, `[REVISAR]` el internal equity check, `[VERIFICAR JURISDICCIÓN]` lo que depende de pay transparency local.
11. **Guardar** en `<proyecto>/hr/recruitment/compensation/<role-family>-bands-<YYYY>.md` con confidencialidad alta.
12. **Reportar** al usuario: ruta, niveles definidos, fuentes consultadas, próxima revisión.

---

## Restricciones

- **No publiques este documento fuera del círculo autorizado.** Confidencialidad alta por defecto.
- **No inventes números.** Cada banda viene del benchmark o de decisión justificada de leadership.
- **No omitas filosofía declarada.** P50 vs P75 vs P90 cambia todo el resto del documento.
- **No mezcles base con variable o con equity** en la misma cifra. Cada componente con su sección.
- **No olvides el internal equity check.** Es el componente que más típicamente revela problemas.
- **No copies bandas de otra empresa.** Cada empresa tiene su filosofía, su geografía, su scope.
- **No olvides la próxima revisión.** Bandas sin fecha de update se desactualizan en 12 meses.
- **No comprometas pay transparency externa sin saber el cumplimiento legal** (UE Pay Transparency Directive, leyes estatales US, etc.).
- Aplican las reglas de output de `_shared/output-rules.md`.
