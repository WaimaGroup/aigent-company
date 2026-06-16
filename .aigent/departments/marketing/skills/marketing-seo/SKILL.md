---
name: "marketing-seo"
user-invocable: true
description: >
  Skill for SEO work: keyword research (identify, classify by intent and prioritize search
  terms) and on-page optimization (audit + optimized version of an existing or new page:
  titles, meta tags, structure, internal links). Mode chosen by the request: `research` or `on-page`.
---

# Skill: SEO

**Entregable:** un archivo `.md`. Cubre dos modos: **research** (keyword research priorizado) y **on-page** (auditoría + versión optimizada).

> **Regla de output (default de Marketing):** un solo `.md`. Sin archivos extra salvo petición.

---

## Cuándo usar esta skill

| `modo` | Cuándo | Salida |
|---|---|---|
| `research` | Identificar/priorizar keywords para un producto, servicio o contenido | `.md` en `seo/` |
| `on-page` | Optimizar una página/artículo existente o revisar uno nuevo antes de publicar | `.md` en `seo/` (o junto al post si se optimiza uno concreto) |

Si el modo no está claro, preguntarlo en la primera tanda.

**Cuándo NO usar:**
- Checklist técnico completo pre-publicación en WordPress → `marketing-publish-checklist`.
- Trabajo GEO dedicado y profundo (citabilidad en motores generativos: ChatGPT, Perplexity, AI Overviews) → `marketing-geo`. El modo `on-page` de esta skill ya incorpora señales GEO ligeras; para un análisis GEO completo, usar `marketing-geo`.

---

## Modo `research` — keyword research

Recopilar: negocio/sector y nicho, producto/servicio a posicionar, audiencia, competidores SEO, mercado geográfico, objetivo (informar/leads/vender).

Intención de búsqueda: **informacional** (aprender → blog/guías), **navegacional** (marca → web propia), **comercial** (comparar → comparativas/reviews), **transaccional** (comprar → landings/fichas).

Proceso: (1) 5-10 seed keywords con el usuario → (2) expandir cada seed en ≥5 long-tail + preguntas + sinónimos + términos de competencia → (3) clasificar por intención → (4) estimar competitividad → (5) mapear cada keyword a una URL concreta → (6) marcar **quick wins** (baja dificultad, posicionamiento rápido).

Plantilla:

```markdown
## KEYWORD RESEARCH — [Proyecto]

### Quick wins (empezar aquí)
[5-10 keywords de baja dificultad y acción rápida]

### Tabla priorizada
| Keyword | Intención | Vol. estimado | Dificultad | Prioridad | Página destino |
|---|---|---|---|---|---|

### Clusters
1. [cluster] → [página/tipo de contenido]

### Gaps detectados
[temas que ataca la competencia y el cliente no]

### Próximos pasos
1. … 2. …
```

No fabricar volúmenes exactos sin herramienta: usar `Alto/Medio/Bajo` con nota. No priorizar solo por volumen (una transaccional de bajo volumen suele rendir más que una informacional de alto). Mapear cada keyword a una página específica, no "al blog".

---

## Modo `on-page` — auditoría + optimización

Recopilar: URL/contenido a optimizar, keyword objetivo, keywords secundarias, intención, top 3 de competencia.

Auditar contra el checklist y entregar la versión optimizada:

- **Título/meta:** H1 con keyword (único, ≤70 chars); meta title 50-60 chars (keyword al inicio); meta description 150-160 chars (beneficio + keyword); slug corto con keyword, sin stop words ni acentos.
- **Estructura:** keyword en primeros 100 palabras; jerarquía H2/H3 lógica (≥1 H2 con variante); densidad 1-2% natural; LSI/semánticas presentes; párrafos ≤4 líneas; bullets si hay ≥3 items.
- **Imágenes:** alt text descriptivo, nombres de archivo descriptivos, peso optimizado (WebP).
- **Enlazado:** ≥2-3 internal links con anchor descriptivo; external links solo a fuentes de autoridad.
- **UX (señal indirecta):** responde la intención en los primeros 2 párrafos; TOC si >1500 palabras; CTA visible.
- **GEO (señales ligeras — citabilidad por motores de IA):** respuesta directa y auto-contenida en las primeras 1-2 frases de cada sección; algún encabezado redactado como pregunta real; datos concretos con su fuente (los motores generativos citan lo específico y verificable); autoría/fecha visibles. Para un análisis GEO completo (mapa de prompts, schema, señales de entidad), derivar a `marketing-geo`.

Plantilla:

```markdown
## ANÁLISIS SEO ON-PAGE — [URL/título]
**Keyword principal:** [...]  ·  **Intención:** [...]

### Diagnóstico
| Elemento | Estado | Nota |
|---|---|---|
| H1 | ✅/⚠️/❌ | |
| Meta title | ✅/⚠️/❌ | |
| Meta description | ✅/⚠️/❌ | |
| Keyword en primeros 100 words | ✅/⚠️/❌ | |
| Internal links | ✅/⚠️/❌ | |
| Imágenes con alt | ✅/⚠️/❌ | |

### Versión optimizada
**H1:** … · **Meta title:** … ([N] chars) · **Meta description:** … ([N] chars) · **Slug:** /…
### Cambios en el cuerpo
[párrafos reescritos / ajustes]
### Internal links sugeridos
- "[anchor]" → [URL]
```

No aplicar Black Hat (stuffing, cloaking). No reinventar el contenido perdiendo la intención del autor. Distinguir cambios reversibles (meta, alt) de estructurales (slug, H1) cuando la página ya tiene tráfico (posibles 301). No prometer resultados rápidos: el SEO orgánico tarda 3-6 meses.

---

## Proceso (común)

1. Determinar el `modo` y recopilar la info mínima en una sola tanda.
2. Ejecutar según el modo.
3. Escribir **un único `.md`** con `Write` (o `Edit` si se optimiza un post existente; `Read` antes).
4. Confirmar la ruta y los 3-5 cambios de mayor impacto.

---

## Restricciones

- No fabricar métricas exactas sin herramienta; estimación cualitativa con nota explícita.
- No técnicas Black Hat ni keyword stuffing.
- Diferenciar siempre intención y mapear cada keyword a una página objetivo.
- Default de un solo `.md`; formatos extra solo bajo petición.
- Aplican las reglas de output de `_shared/output-rules.md`.
