---
name: "seo-on-page"
description: >
  Skill for optimizing existing content or new pages for on-page SEO: titles, structure, meta tags, internal links.
---

# Skill: Optimización SEO On-Page

**Entregable:** análisis + versión optimizada del contenido con checklist completado

---

## Cuándo usar esta skill

Cuando el usuario necesite optimizar para SEO una página o artículo ya existente, o revisar una pieza de contenido nueva antes de publicarla. También cuando quiera mejorar el posicionamiento de páginas que ya tienen tráfico pero podrían rendir más.

---

## Información a recopilar

| Campo | Pregunta |
|---|---|
| URL / contenido | ¿Cuál es la página o el texto a optimizar? |
| Keyword objetivo | ¿Para qué término principal quiere posicionarse? |
| Keywords secundarias | ¿Hay términos relacionados a incluir? |
| Intención de búsqueda | ¿Qué busca alguien que escribe esa keyword? |
| Competencia | ¿Qué páginas están en el top 3 para esa keyword? |

---

## Checklist de optimización on-page

### Título y meta datos
- [ ] **H1:** contiene la keyword principal; único en la página; máx. 70 chars
- [ ] **Meta title:** 50-60 chars; keyword al inicio; nombre de marca al final si cabe
- [ ] **Meta description:** 150-160 chars; beneficio claro + CTA implícito; incluye keyword
- [ ] **URL slug:** corta, descriptiva, con keyword, sin stop words, sin acentos

### Estructura de contenido
- [ ] **Keyword en los primeros 100 palabras** del cuerpo (naturalmente)
- [ ] **H2 / H3:** estructura lógica; al menos un H2 con variante de la keyword
- [ ] **Densidad de keyword:** natural, sin stuffing (aprox. 1-2% del texto)
- [ ] **LSI / keywords semánticas:** sinónimos y términos relacionados presentes
- [ ] **Párrafos cortos:** máx. 4 líneas; texto escaneable
- [ ] **Bullets y listas** donde haya 3+ items del mismo tipo

### Imágenes
- [ ] **Alt text** en todas las imágenes; descriptivo; incluye keyword si es natural
- [ ] **Nombres de archivo** descriptivos (no "IMG_1234.jpg")
- [ ] **Tamaño optimizado:** imágenes comprimidas (WebP preferiblemente)

### Enlazado
- [ ] **Internal links:** mínimo 2-3 enlaces a otras páginas relevantes del sitio
- [ ] **Anchor text descriptivo:** no "haz clic aquí", sino el tema al que enlaza
- [ ] **External links:** si se cita una fuente externa, que sea de autoridad

### Experiencia de usuario (señales indirectas de SEO)
- [ ] **Responde la intención de búsqueda** en los primeros 2 párrafos
- [ ] **Tabla de contenidos** si el artículo supera 1500 palabras
- [ ] **CTA visible** above the fold o al final de secciones clave
- [ ] **Mobile-friendly:** el contenido se lee bien en móvil (párrafos cortos, headings claros)

---

## Proceso de optimización

1. **Auditar** el contenido actual contra el checklist
2. **Identificar** los 3-5 cambios de mayor impacto (quick wins)
3. **Proponer** la versión optimizada con los cambios aplicados
4. **Entregar:**
   - Checklist completado (✅ bien / ⚠️ mejorable / ❌ falta)
   - Meta title y meta description nuevos
   - H1 optimizado si es necesario
   - Párrafos o secciones reescritas donde aplica
   - Sugerencias de internal links (qué páginas enlazar y con qué anchor)

---

## Plantilla de entrega

```markdown
## ANÁLISIS SEO ON-PAGE — [URL o título de la página]

**Keyword principal:** [keyword]
**Intención de búsqueda:** [informacional / comercial / transaccional]

### Diagnóstico
| Elemento | Estado | Nota |
|---|---|---|
| H1 | ✅ / ⚠️ / ❌ | [observación] |
| Meta title | ✅ / ⚠️ / ❌ | [observación] |
| Meta description | ✅ / ⚠️ / ❌ | [observación] |
| Keyword en primeros 100 words | ✅ / ⚠️ / ❌ | |
| Internal links | ✅ / ⚠️ / ❌ | |
| Imágenes con alt text | ✅ / ⚠️ / ❌ | |

### Versión optimizada
**Nuevo H1:** [texto]
**Nuevo meta title:** [texto] ([N] chars)
**Nueva meta description:** [texto] ([N] chars)
**Nueva URL sugerida:** /[slug]

### Cambios en el cuerpo
[Párrafos reescritos o ajustes señalados]

### Internal links sugeridos
- Enlazar "[anchor text]" a [URL]
- Enlazar "[anchor text]" a [URL]
```

---

## Restricciones

- No recomendar ni aplicar técnicas de Black Hat SEO (keyword stuffing, cloaking, hidden text, redirecciones engañosas).
- No reescribir el contenido al punto de perder la intención original del autor: la optimización es un complemento, no una reinvención.
- Diferenciar entre cambios reversibles (meta tags, alt text) y cambios estructurales (slug, H1) cuando la página ya tiene tráfico orgánico — los segundos requieren revisión y posibles redirecciones 301.
- No prometer resultados rápidos: el SEO orgánico tarda 3-6 meses en consolidarse en posiciones nuevas.
- Aplican las reglas de output de `_shared/output-rules.md`.
