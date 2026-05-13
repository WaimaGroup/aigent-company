---
name: "competitive-analysis"
description: >
  Shared skill for producing a structured competitive analysis: landscape mapping
  (direct/indirect/alternative competitors), comparison matrix by user-centric
  criteria, whitespace identification, threat assessment, and recommendations.
  Used cross-department (marketing-strategy, product-strategy-roadmap, sales-ae)
  with the same deliverable structure regardless of context.
---

# Skill: Competitive Analysis

**Entregable:** archivo `.md` con análisis competitivo estructurado, listo para uso interno (decisiones de strategy / roadmap / positioning) o externo adaptado (deck a board, asset de venta). Vive en la carpeta del dept que la solicite (`<proyecto>/<dept>/...`) — la skill es compartida en `_shared/skills/`, los outputs no.

---

## Cuándo usar esta skill

- Hay que tomar una decisión de posicionamiento o roadmap y se necesita visión clara del landscape.
- Se prepara material para board/investors que requiere "vista del mercado".
- Se identifican gaps (whitespace) o amenazas para priorizar.
- Se actualiza el análisis competitivo periódicamente (típicamente semestral).

**Cuándo NO usar:**

- Para benchmarking puntual de una feature concreta (eso es scope reducido, una ficha por competidor basta).
- Para investigación de mercado a nivel de problema (eso pertenece a `product-discovery` para validación de problema).
- Para battle cards de venta tácticas — son derivadas del competitive analysis, pero formato distinto.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope del análisis | ¿Producto/servicio/categoría completa? ¿Geografía? |
| Audiencia del entregable | Leadership interno, board, equipo de marketing/sales, todo |
| Lista inicial de competidores | ¿Qué competidores te vienen a la cabeza? Los completamos con investigación |
| Criterios de comparación | ¿Qué pesa para tu usuario tipo? (precio, features, soporte, integración, etc.) |
| Fase del producto | Early / scale / mature — afecta a qué se compara |
| Profundidad | Light (5-7 competidores, vista alta) / Deep (10-15, con detalle) |
| Plazo de vigencia | ¿Cuándo se volverá a revisar? (Para marcar fecha de obsolescencia) |

---

## Plantilla del entregable

Nombre del archivo: `competitive-analysis-<scope-slug>-<YYYY-MM>.md` (ej. `competitive-analysis-saas-billing-2026-05.md`).

```markdown
---
type: "competitive-analysis"
scope: "<descripción del scope>"
audience: "leadership | board | marketing | sales | mixed"
depth: "light | deep"
date: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<rol/persona>"
status: "draft | reviewed | published"
---

# Análisis Competitivo — <Scope> · <YYYY-MM>

## 0. Resumen ejecutivo

> 5-7 líneas: cómo está el mercado, dónde estamos, principales amenazas, principales oportunidades, recomendación general.

**Top 3 amenazas:**
1.
2.
3.

**Top 3 oportunidades (whitespace):**
1.
2.
3.

**Recomendación general:** <una frase de positioning o de roadmap>

---

## 1. Landscape

> Categorías de competidores. No todo lo que compite con nosotros lo hace de la misma forma.

### 1.1 Competidores directos

Mismo segmento, mismo problema, propuesta similar.

- **<Empresa A>** — descripción en 1 línea
- **<Empresa B>** — descripción en 1 línea
- ...

### 1.2 Competidores indirectos

Resuelven el mismo problema con propuesta distinta.

- **<Empresa C>** — descripción en 1 línea
- ...

### 1.3 Alternativas no obvias

Lo que el usuario usa hoy para resolver el problema sin un producto dedicado (Excel, email, status quo).

- **<Alternativa X>** — descripción

---

## 2. Matriz de comparación

> Por criterio relevante para el usuario, no por feature. Si el criterio es "se integra con Salesforce", listar a quién sí y a quién no, no decir "feature X tiene flag Y".

| Criterio (peso) | Nosotros | <Comp A> | <Comp B> | <Comp C> | <Comp D> |
|---|---|---|---|---|---|
| <Criterio 1> (alto) | | | | | |
| <Criterio 2> (medio) | | | | | |
| <Criterio 3> (alto) | | | | | |
| <Criterio 4> (medio) | | | | | |
| Pricing entry | | | | | |
| Target segment | | | | | |
| Tracción/notoriedad | | | | | |
| Última verificación | [FECHA] | [FECHA] | [FECHA] | [FECHA] | [FECHA] |

> Cada celda con marca de verificación de fecha. Los datos de competidores envejecen rápido — `[VERIFICADO YYYY-MM]` es obligatorio.

---

## 3. Posicionamiento por competidor

> Una ficha breve por competidor relevante (no todos).

### <Competidor A>

- **Propuesta de valor (cómo se vende):** <1 línea con su propio mensaje>
- **Pricing:** <modelo + tiers principales>
- **Target:** <segmento que persiguen>
- **Fortalezas vs nosotros:** <2-3 bullets factuales>
- **Debilidades vs nosotros:** <2-3 bullets factuales>
- **Tracción (señales):** <fundraising reciente, hires clave, números públicos>
- **Riesgo si nos pasan por encima:** <bajo / medio / alto>
- **Última verificación:** <YYYY-MM>

(repetir por cada competidor relevante; light = 5-7, deep = 10-15)

---

## 4. Whitespace — oportunidades sin cubrir

> Espacios donde el mercado no tiene una propuesta clara. Cada uno: descripción + por qué existe + tamaño estimado + cómo podríamos atacarlo.

- **<Oportunidad 1>:** <descripción> · Tamaño: <pequeño/medio/grande> · Cómo: <breve>
- **<Oportunidad 2>:** ...

---

## 5. Threat assessment honesto

> Dónde nos pueden pasar por encima si no actuamos. Severidad explícita.

| Amenaza | Origen | Probabilidad | Impacto | Tiempo | Mitigación propuesta |
|---|---|---|---|---|---|
| <Amenaza 1> | <Competidor / market shift> | Alta/Media/Baja | Alto/Medio/Bajo | <inmediato/medio/largo> | <breve> |

---

## 6. Implicaciones para nosotros

> Lo que esta visión sugiere accionar. Conectar a roadmap, marketing, sales o pricing.

- **Roadmap:** <qué construir/priorizar>
- **Positioning:** <cómo nos contamos vs competencia>
- **Pricing:** <ajustes si emergen>
- **Sales enablement:** <battle cards a generar a partir de esto>

---

## 7. Fuentes y metodología

- Sitios web de competidores (revisados [FECHA])
- Análisis de pricing públicos
- LinkedIn / Crunchbase / G2 / Capterra (revisados [FECHA])
- Conversaciones con clientes que han evaluado competidores
- Otras: <...>

> Marcar cada dato relevante con `[VERIFICADO YYYY-MM]` y `[FUENTE: …]` para que en la próxima revisión sea claro qué hay que actualizar.
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Si la lista inicial de competidores está vacía, parar — el usuario tiene que aportar al menos un punto de partida.
2. **Investigar** cada competidor en sitio web, pricing público, redes profesionales, reviews independientes (G2, Capterra). Anotar fecha de cada fuente.
3. **Definir criterios desde el ojo del usuario**, no desde el ojo del equipo. "Se integra con X" es criterio user; "tiene microservicios bien diseñados" no.
4. **Rellenar la matriz** con datos factuales. Donde no hay info, `[NO VERIFICADO]` explícito; nunca inventar.
5. **Generar las fichas por competidor** con foco en fortalezas/debilidades vs nosotros, no solo descripción genérica.
6. **Identificar whitespace** mirando los gaps de la matriz. No todo gap es whitespace — solo cuando hay demanda real evidente.
7. **Threat assessment honesto.** Si un competidor está creciendo más rápido y ofrece más por menos, decirlo. La complacencia mata.
8. **Implicaciones accionables.** El análisis termina con qué hacemos con él. Si no termina en acción, es informe pero no análisis.
9. **Marcar `[NO VERIFICADO]`** lo que requiere ratificación y `[VERIFICADO YYYY-MM]` cada dato relevante con fecha.
10. **Guardar** en la carpeta del dept que solicita el análisis (`<proyecto>/<dept>/...`). La skill es compartida; el output vive en el dept que la consume.
11. **Reportar** al usuario: ruta, resumen ejecutivo de 5-7 líneas, top 3 amenazas y oportunidades, próxima revisión recomendada.

---

## Restricciones

- **No copies marketing copy de competidores como datos.** Lo que dicen ellos de sí mismos es input, no verdad. Verificar con fuentes independientes cuando se pueda.
- **No omitas la fecha de verificación.** Datos sin fecha envejecen sin que nadie se entere.
- **No prometas certezas sobre la estrategia de competidores.** "Parece que X se centra en Y" es honesto; "X va a hacer Z" es especulación.
- **No publiques análisis sin implicaciones.** Sección 6 es obligatoria — análisis sin acción es ruido.
- **No mezcles competitive analysis con battle cards.** Las battle cards salen de aquí pero son otro entregable (más operativo para sales).
- **No reuses análisis del año pasado sin re-verificar.** El landscape cambia rápido.
- Aplican las reglas de output de `_shared/output-rules.md`.
