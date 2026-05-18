---
name: "product-north-star-metric"
user-invocable: true
description: >
  Skill for selecting and defining a product North Star Metric: candidates
  evaluated against value/movement/sustainability criteria, operational
  definition, and a KPI tree of input metrics that drive it.
---

# Skill: North Star Metric

**Entregable:** archivo `.md` con la NSM elegida, su definición operativa y el árbol de inputs, guardado en `<proyecto>/product/metrics/definitions/north-star.md`.

---

## Cuándo usar esta skill

- La empresa o el producto aún no tiene una métrica north star clara, o la actual no refleja el valor entregado.
- Llega un cambio de fase del producto (early → growth, growth → scale) y hay que revisar si la NSM sigue siendo válida.
- El equipo entra en discusión sobre qué optimizar y faltan criterios de decisión claros.

**Cuándo NO usar:**

- Para métricas operativas (latencia, uptime, error rate). Esas son guardraíl o de salud, no north star.
- Para OKRs trimestrales (la NSM informa OKRs, no los sustituye).
- Para un dashboard de "métricas que vemos cada lunes". Eso es operativo.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Producto | ¿Qué producto / línea? |
| Modelo de negocio | ¿B2C, B2B, SaaS, marketplace, transactional, content, otro? |
| Fase | ¿Pre-PMF, post-PMF early, growth, scale? |
| Audiencia/segmento | ¿Quién es el usuario principal cuyo "éxito" queremos medir? |
| Valor entregado | ¿Qué valor entrega el producto? (idealmente en una frase del usuario) |
| Datos disponibles | ¿Qué se trackea hoy? ¿Existe analytics y con qué calidad? |
| NSM previa | ¿Hay una NSM en uso? ¿Qué ha funcionado y qué no? |
| Restricciones | ¿Hay métricas heredadas que no podemos cambiar a corto plazo (reporting a board, contrato con inversores, etc.)? |

---

## Plantilla del entregable

```markdown
---
type: "north-star-metric"
product: "<Producto>"
business_model: "B2C | B2B | SaaS | marketplace | transactional | content | other"
phase: "pre-PMF | early | growth | scale"
status: "draft | approved | in-use | retired"
effective_date: "YYYY-MM-DD"
last_review: "YYYY-MM-DD"
owner: "<rol/persona>"
---

# North Star Metric — <Producto>

## 0. Resumen

**North Star Metric:** <Nombre canónico de la métrica>

**Definición en una frase:** <qué cuenta exactamente y por qué representa el valor entregado>

**Target para <periodo>:** <valor objetivo> (baseline actual: <valor>)

---

## 1. Por qué esta métrica

> Justificación contra los tres criterios fundamentales.

### Criterio 1 — Representa valor entregado al usuario

<Por qué mover esta métrica significa que el usuario obtiene más del producto. Conectar al value proposition o al JTBD principal.>

### Criterio 2 — Se mueve con acción del equipo

<Por qué el equipo puede mover esta métrica con su trabajo. Si la métrica depende de factores externos (mercado, estacionalidad, viralidad pura), señalarlo.>

### Criterio 3 — Sostiene el modelo de negocio

<Por qué optimizar esta métrica conduce a un negocio sostenible. Conectar a revenue/retention/unit economics.>

---

## 2. Definición operativa

### Qué se cuenta

<Definición exacta y comparable: qué evento/acción/estado representa "1 unidad" de la métrica.>

### Cómo se cuenta

- **Fuente de datos:** <herramienta + tabla/evento>
- **Fórmula:** <fórmula matemática completa>
- **Granularidad temporal:** <diaria / semanal / mensual / trimestral>
- **Ventana:** <rolling 7d / mes calendario / quarter / lifetime>

### Qué se excluye

- <Exclusión 1: ej. bots, internos de empresa, accounts de QA>
- <Exclusión 2>

### Cuándo se calcula

<Frecuencia de actualización del cálculo + horario aproximado.>

### Ficha técnica

| Campo | Valor |
|---|---|
| Nombre canónico | `<snake_case>` |
| Tipo | counter / ratio / percentile / monetary |
| Unidad | usuarios / sesiones / € / horas / ... |
| Reset | nunca / mensual / anual |
| Owner | <persona> |
| Última definición revisada | YYYY-MM-DD |

---

## 3. Alternativas evaluadas

> Mostrar el trabajo: qué otras métricas se consideraron y por qué no se eligieron.

| Métrica candidata | Pros | Contras | Por qué no es NSM |
|---|---|---|---|
| <Candidate A> | <pros> | <contras> | <razón> |
| <Candidate B> | ... | ... | ... |
| <Candidate C> | ... | ... | ... |

---

## 4. Árbol de inputs (KPI tree)

> Descomposición de la NSM en métricas de input que el equipo puede mover directamente.

```
<NSM>
├── <Input 1: ej. activated users>
│   ├── <Sub-input 1.1: ej. signup conversion>
│   └── <Sub-input 1.2: ej. activation rate>
├── <Input 2: ej. retention rate>
│   ├── <Sub-input 2.1: ej. D7 retention>
│   └── <Sub-input 2.2: ej. M3 retention>
└── <Input 3: ej. engagement frequency>
    ├── <Sub-input 3.1: ej. sessions per active user>
    └── <Sub-input 3.2: ej. core action frequency>
```

Para cada input crítico, documentar:
- Definición operativa breve.
- Baseline actual.
- Palanca conocida que la mueve.

---

## 5. Métricas guardraíl

> Métricas que NO queremos que empeoren al optimizar la NSM. Si una iniciativa sube la NSM pero rompe una guardraíl, se reconsidera.

- **<Guardraíl 1>:** <ej. NPS, churn, customer support tickets>
- **<Guardraíl 2>:** ...

---

## 6. Anti-patrones a evitar

> Comportamientos que mueven la NSM pero no aportan valor real ("gaming the metric"). Hay que vigilarlos.

- <Anti-patrón 1: ej. dark patterns para forzar signup>
- <Anti-patrón 2: ej. inflar sesiones con notificaciones agresivas>

---

## 7. Cadencia de revisión

- **Revisión completa de definición:** <anual / semestral>
- **Revisión de target:** <trimestral>
- **Reporting operativo del valor:** <semanal / mensual>

---

## 8. Anexos

- Análisis de fase y modelo de negocio: <link>
- Discovery / research que respalda el "valor entregado": <link>
- Versión previa de la NSM si existió: <link al archivo retired>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin claridad sobre fase y modelo de negocio, la NSM se acaba pareciendo a la de otra empresa, no a la del producto real.
2. **Generar candidates** (3-5). Mirar referencias del modelo:
   - **Marketplace:** GMV ajustada, transacciones por usuario activo, repeat buyer rate.
   - **SaaS B2B:** Weekly Active Accounts (depende de adopción), Net Revenue Retention.
   - **B2C consumo:** Weekly Active Users haciendo la acción core, tiempo en core action.
   - **Content/media:** tiempo de consumo de contenido valioso (no solo "page views").
   - **Transactional/utility:** transacciones completadas con éxito por usuario activo.
3. **Evaluar cada candidate contra los tres criterios** (representa valor, se mueve con acción, sostiene negocio). Una métrica que falla en cualquiera de los tres queda fuera.
4. **Recomendar una** y mostrar el trabajo (sección 3 con los alternativos descartados).
5. **Definir operativamente** con precisión. La sección 2 debe ser tan exacta que un analista nuevo puede calcular la métrica sin preguntar.
6. **Construir el árbol de inputs.** Mínimo 2 niveles. Cada hoja debe ser una métrica que un equipo puede mover.
7. **Añadir guardraíles.** Sin guardraíles, una optimización fuerte de la NSM puede dañar el producto.
8. **Marcar `[BASELINE PENDIENTE]`** y `[INSTRUMENTAR]` lo que aún no se mide o no tiene valor inicial.
9. **Guardar** en `<proyecto>/product/metrics/definitions/north-star.md`.
10. **Reportar** al usuario:
    - Ruta del archivo.
    - NSM propuesta + por qué.
    - Lo que falta para hacerla operativa (instrumentación, baseline).
    - Próximo paso: validar con leadership, instrumentar (delegar a `software-coding` para implementación, a `product-metrics` para coordinar el plan de instrumentación), y conectar a OKRs trimestrales.

---

## Restricciones

- **No propongas vanity como NSM.** Page views, downloads, signups totales — fuera salvo justificación extraordinaria.
- **No elijas una métrica que el equipo no puede mover.** Si la NSM depende casi enteramente del mercado o de canales externos, no es accionable.
- **No mezcles NSM con OKR.** La NSM es estructural y de largo plazo; el OKR es del trimestre.
- **No propongas más de una NSM.** Si parece que hacen falta dos, alguna es un input, no una NSM.
- **No omitas guardraíles.** Una NSM sin contrapesos invita a optimizar dañando.
- **No definas la NSM sin owner.** Sin propietario, drift y abandono garantizados.
- **No reescribas la definición sin renombrar.** Si la fórmula cambia significativamente, la métrica nueva tiene nombre nuevo (sufijo `_v2` o renombrado). Trazabilidad histórica preservada.
- Aplican las reglas de output de `_shared/output-rules.md`.
