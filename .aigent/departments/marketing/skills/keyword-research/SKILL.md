---
name: "keyword-research"
description: >
  Skill for conducting keyword research: identifying, classifying and prioritizing search terms.
---

# Skill: Keyword Research

**Entregable:** tabla priorizada de palabras clave con intención, volumen estimado y asignación a página

---

## Cuándo usar esta skill

Cuando el usuario necesite identificar qué términos de búsqueda debe atacar para un producto, servicio, temática o nuevo contenido. También cuando quiera revisar si su contenido actual está optimizado para las keywords correctas.

---

## Información a recopilar

| Campo | Pregunta |
|---|---|
| Negocio / sector | ¿A qué se dedica la empresa? ¿Cuál es su nicho? |
| Producto / servicio | ¿Qué quiere posicionar exactamente? |
| Audiencia | ¿Quién busca esto? ¿Qué nivel de conocimiento tiene? |
| Competidores | ¿Quiénes son los referentes en SEO de su sector? |
| Mercado geográfico | ¿España, Latinoamérica, global en español? |
| Objetivo | ¿Informar, generar leads, vender directamente? |

---

## Tipos de intención de búsqueda

| Tipo | Qué quiere el usuario | Ejemplo | Objetivo |
|---|---|---|---|
| **Informacional** | Aprender o resolver una duda | "qué es el email marketing" | Blog, guías, FAQs |
| **Navegacional** | Encontrar una marca o web | "Mailchimp login" | Marca propia |
| **Comercial** | Comparar antes de comprar | "mejor software CRM 2024" | Comparativas, reviews |
| **Transaccional** | Comprar o contratar | "contratar agencia SEO Madrid" | Landing pages, fichas |

---

## Estructura del keyword research

### Fase 1 — Seed keywords (palabras semilla)
Identificar 5-10 términos generales relacionados con el negocio. A partir de estos se expande.

### Fase 2 — Expansión
Para cada seed keyword, explorar:
- Variantes long-tail (3+ palabras)
- Preguntas relacionadas (quién, cómo, qué, cuándo, por qué)
- Sinónimos y variantes semánticas
- Términos de la competencia

### Fase 3 — Clasificación y priorización

```markdown
| Keyword | Intención | Vol. estimado | Dificultad | Prioridad | Página destino |
|---------|-----------|---------------|------------|-----------|----------------|
| [kw 1]  | Info      | Alto          | Media      | Alta      | /blog/[slug]   |
| [kw 2]  | Trans     | Medio         | Baja       | Alta      | /servicios/[x] |
| [kw 3]  | Comercial | Bajo          | Baja       | Media     | Nueva página   |
```

**Criterios de prioridad:**
- **Alta:** alto volumen + baja dificultad, o transaccional con buen volumen
- **Media:** volumen medio o dificultad media, pero alineada con el negocio
- **Baja:** muy competida o poco volumen; anotar para el futuro

---

## Proceso

1. Recopilar seeds con el usuario (5-10 términos que él ya usa o conoce)
2. Expandir cada seed en al menos 5 variantes long-tail
3. Clasificar por intención
4. Estimar competitividad relativa (no requiere herramienta; se puede hacer por sentido común del sector)
5. Mapear cada keyword a una URL existente o proponer nueva página
6. Marcar **quick wins**: keywords de baja dificultad donde el sitio puede posicionarse rápido
7. Entregar tabla priorizada + recomendaciones de acción inmediata

---

## Output final

```markdown
## KEYWORD RESEARCH — [Proyecto]

### Quick Wins (empezar aquí)
[Top 5-10 keywords de baja dificultad y acción rápida]

### Keywords principales a trabajar
[Tabla completa]

### Keywords de autoridad (largo plazo)
[Términos competidos que requieren trabajo sostenido]

### Gaps detectados
[Temas que la competencia ataca y el cliente no]

### Próximos pasos recomendados
1. [acción 1]
2. [acción 2]
```

---

## Restricciones

- No fabricar volúmenes de búsqueda exactos sin acceso a herramientas (SEMrush, Ahrefs, Keyword Planner). Si solo hay estimación cualitativa, indicarlo con `Alto / Medio / Bajo` y nota explícita.
- No recomendar técnicas de keyword stuffing ni keywords de Black Hat SEO.
- No priorizar exclusivamente por volumen: una keyword de bajo volumen y alta intención transaccional suele aportar más que una alta-volumen informacional.
- Diferenciar siempre intención de búsqueda; mapear cada keyword a una página objetivo específica, no a "el blog" en abstracto.
- Aplican las reglas de output de `_shared/output-rules.md`.
