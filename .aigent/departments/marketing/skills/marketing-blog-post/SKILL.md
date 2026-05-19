---
name: "marketing-blog-post"
user-invocable: true
description: >
  Skill for writing a complete, SEO-ready blog post or article from a topic or brief.
  Always creates a dedicated folder with .md and .html files plus assets structure.
---

# Skill: Blog Post

**Entregable:** carpeta completa del post con `.md`, `.html` y estructura `assets/`

---

## Cuándo usar esta skill

Cuando el usuario necesite redactar un post de blog o artículo completo, listo para publicar. Esta skill cubre el ciclo entero: recopilación de información → outline → cuerpo con SEO → versión HTML para preview → fragmento HTML para CMS/WordPress → estructura de carpetas para `assets/` y `analytics/`.

**Cuándo NO usar:**
- Para textos cortos (anuncios, newsletters, scripts) → usar otra skill (`ad-copy`, `email-campaign`, etc.).
- Para optimizar SEO de un post ya redactado → usar `seo-on-page`.
- Para auditar el SEO antes de publicar → usar `publish-checklist`.

---

## Regla absoluta: todo se guarda en archivos

**Esta skill SIEMPRE crea archivos reales usando la herramienta `Write`.** Nunca entregar el contenido solo como texto en el chat. El contenido no existe hasta que está escrito en disco.

Orden de operaciones obligatorio:
1. Recopilar info → 2. Validar outline con el usuario → 3. Escribir `<slug>.md` → 4. Generar `<slug>.html` → 5. Crear carpetas `assets/` y `analytics/` → 6. Confirmar al usuario con links

---

## Estructura de carpeta del post

Cada post vive en su propia carpeta, con el slug del título como nombre:

```
<proyecto>/marketing/posts/<slug-del-titulo>/
├── <slug>.md              ← contenido completo (SEO + cuerpo + imágenes + multiidioma)
├── <slug>.html            ← preview local completo (con head, styles y metadatos)
├── <slug>_content.html    ← solo el fragmento de contenido para WordPress/CMS (sin head ni estilos)
├── assets/                ← imágenes y recursos del post
│   └── .gitkeep
└── analytics/             ← revisiones y análisis de rendimiento post-publicación
    └── .gitkeep
```

**Regla de naming del slug:** a partir del título: minúsculas, espacios → guiones, sin tildes ni caracteres especiales.
Ejemplo: "Cómo usar IA en Marketing" → `como-usar-ia-en-marketing`

**Ruta base:** `<proyecto>/marketing/posts/` donde `<proyecto>` viene del orquestador (que lo deduce de `.context/<proyecto>/`, ver `_shared/conventions.md` §10.1).

---

## Información a recopilar antes de escribir

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Tema / título tentativo | ¿Sobre qué trata el artículo? ¿Tienes ya un título? |
| Keyword principal | ¿Qué término de búsqueda queremos posicionar? |
| Audiencia | ¿Para quién es? (perfil, nivel técnico, sector) |
| Objetivo | ¿Qué queremos que haga el lector al terminar? (suscribirse, comprar, aprender…) |
| Tono | ¿Formal, cercano, técnico, divulgativo? |
| Longitud | ¿Corto 600-900 / Medio 1000-1500 / Largo 1500+? |
| CTA | ¿A dónde dirigir al lector al final? (URL, formulario, demo…) |
| Idiomas | ¿Solo en un idioma o necesita versión en otros? ¿Cuáles? |
| Imágenes | ¿Las generará el usuario, o incluimos prompts para generación con IA? |

---

## Template .md del post — estructura completa

El archivo `<slug>.md` sigue siempre esta estructura:

```markdown
---
# ─── METADATA SEO ────────────────────────────────────────────────────────────
title: "Título del Artículo con Keyword Principal"
slug: "titulo-del-articulo-con-keyword-principal"
meta_title: "Keyword Principal: Título Completo | Marca (50-60 chars)"
meta_description: "Descripción de 150-160 chars que incluye la keyword y un beneficio claro para el lector."
keyword_primary: "keyword principal"
keywords_secondary:
  - "keyword secundaria 1"
  - "keyword secundaria 2"
  - "keyword semántica 3"
author: ""
date_created: "YYYY-MM-DD"
date_modified: "YYYY-MM-DD"
category: ""
tags: []
language: "es"
status: "draft"          # draft | review | ready | published
canonical_url: ""
og_image: "assets/og-imagen.jpg"
internal_links_suggested:
  - anchor: "texto ancla sugerido"
    url: "/ruta/interna"
  - anchor: "otro ancla"
    url: "/otra/ruta"
reading_time_min: 0      # rellenar al final: palabras / 200
word_count: 0            # rellenar al final
---

# Título del Artículo con Keyword Principal

> **Resumen:** Una o dos frases que condensan el valor del artículo. Optimizado para aparecer como featured snippet en Google.

[IMG: Descripción muy detallada del prompt para la imagen hero. Incluir: qué muestra, estilo visual (flat/realista/ilustración), colores, mood, formato 1200x630px para OG. Ej: "Ilustración digital minimalista de una persona frente a pantalla con gráficos de IA, paleta azul-blanco, estilo flat design, 1200x630px, para artículo sobre marketing con inteligencia artificial"]

---

## Introducción

[Párrafo 1 — Gancho. Dato sorprendente, pregunta provocadora o afirmación que conecta con el dolor/deseo del lector. Máx. 3 líneas.]

[Párrafo 2 — Contexto. Por qué este tema es relevante ahora. Incluir la keyword principal de forma natural en este párrafo o en el siguiente.]

[Párrafo 3 — Promesa del artículo. Qué aprenderá el lector y qué podrá hacer diferente al terminar.]

---

## Tabla de contenidos
*(incluir si el artículo supera las 1.500 palabras)*

1. [Sección 1](#seccion-1)
2. [Sección 2](#seccion-2)
3. [Sección 3](#seccion-3)
4. [Conclusión](#conclusion)

---

## Sección 1: [Título H2 con keyword secundaria o variante semántica] {#seccion-1}

[Párrafo introductorio de la sección: qué vamos a tratar y por qué importa. 2-3 líneas.]

[Desarrollo: 3-5 párrafos cortos. Máx. 4 líneas por párrafo. Datos, ejemplos concretos, comparaciones reales.]

[IMG: Prompt para imagen de apoyo de esta sección. Especificar: qué muestra, estilo, dimensiones 800x450px, contexto en el artículo]

**Puntos clave:**
- [Item 1: idea completa desarrollada en 1-2 líneas]
- [Item 2: ídem]
- [Item 3: ídem]

---

## Sección 2: [Título H2 con otra variante de keyword] {#seccion-2}

[Mismo patrón: intro de sección + desarrollo + imagen si aplica + bullets si hay 3+ items del mismo tipo]

---

## Sección 3: [Título H2] {#seccion-3}

[Mismo patrón]

---

## Conclusión {#conclusion}

[Párrafo 1 — Síntesis de los puntos principales. No repetir literalmente; condensar con perspectiva nueva.]

[Párrafo 2 — Reflexión o insight final que deje al lector con algo accionable o en qué pensar.]

[Párrafo 3 — Transición natural al CTA.]

---

## [Acción que invitamos a hacer]

> **[Título del CTA]:** [Descripción de la acción. Ej: "Descarga nuestra guía gratuita sobre X" o "Solicita una demo y ve cómo Y puede ayudarte a lograr Z."]
>
> **[→ Texto del botón / enlace](URL-del-CTA)**

---

*¿Te ha resultado útil este artículo? Compártelo con alguien a quien le pueda ayudar.*

---
<!-- ═══════════════════════════════════════════════════════════════════════════
     VERSIÓN ADICIONAL EN OTRO IDIOMA
     Añadir aquí si se requiere. Misma estructura exacta arriba repetida.
     El bloque de metadata del idioma adicional va en este comentario:

language: "en"
meta_title: "English Meta Title | Brand (50-60 chars)"
meta_description: "English meta description 150-160 chars with keyword and benefit."
keyword_primary: "primary keyword in english"
keywords_secondary: ["secondary kw 1", "secondary kw 2"]
═══════════════════════════════════════════════════════════════════════════ -->

<!-- ENGLISH VERSION — descomenta y rellena si aplica

# Article Title with Primary Keyword

> **Summary:** One or two sentences summarizing the article value.

[IMG: Detailed prompt for hero image — can reuse same prompt as Spanish version with adjusted alt text]

## Introduction

...

## Section 1: Title with Secondary Keyword {#section-1}

...

## Conclusion {#conclusion}

...

## [CTA Action]

> **[CTA Title]:** [Description]
>
> **[→ Button text](CTA-URL)**

-->
```

---

## Proceso paso a paso

### 1. Definir el ángulo único
Antes de escribir: ¿qué hace que ESTE artículo sea diferente a los 10 primeros resultados de Google para la keyword? Identificar el ángulo diferenciador: perspectiva propia, datos exclusivos, caso de uso concreto, o formato superior.

### 2. Crear el outline y validar con el usuario
Generar el esquema H2/H3 y mostrarlo para confirmación antes de redactar. Un outline mal validado = reescritura completa.

### 3. Redactar con calidad de experto
- **Primera línea de cada párrafo:** debe poder leerse sola como un tweet
- **Datos y ejemplos concretos:** nunca generalidades vacías ("las empresas usan X" → "el 67% de las empresas Fortune 500 usa X, según Gartner 2024")
- **Voz activa:** "aumenta las conversiones" en lugar de "las conversiones se ven aumentadas"
- **Keyword principal:** en H1, primeros 100 palabras, al menos un H2, densidad 1-2% (natural, no forzada)
- **Keywords secundarias:** distribuidas en H2/H3 y cuerpo de forma orgánica

### 4. Notación de imágenes [IMG: prompt]
Para cada imagen, escribir un prompt completo listo para cualquier herramienta de generación de imágenes IA:

```
[IMG: {qué muestra} | Estilo: {flat/realista/ilustración/foto} | Colores: {paleta} | Formato: {dimensiones} | Contexto: {dónde va en el artículo}]
```

Ejemplo:
```
[IMG: Diagrama de flujo con las 4 etapas de un embudo de marketing digital, iconos minimalistas para cada etapa | Estilo: flat design, líneas limpias, sin sombras | Colores: azul #0066CC y gris claro #F5F5F5 | Formato: 800x450px horizontal | Contexto: imagen de apoyo para la sección "Cómo funciona el funnel de ventas"]
```

### 5. Escribir el archivo .md con Write tool
```
<proyecto>/marketing/posts/<slug>/<slug>.md
```

### 6. Generar los dos archivos HTML con Write tool

Se generan siempre dos archivos HTML con propósitos distintos:

**6a. Preview local completo → `<slug>.html`**

Versión autocontenida para previsualizar en el navegador antes de publicar. Debe:
- Incluir `<head>` completo: charset, viewport, meta title, meta description, canonical, OG tags (og:title, og:description, og:image, og:type), Twitter Cards
- Usar etiquetas semánticas: `<article>`, `<header>`, `<section>`, `<h1>`-`<h3>`, `<footer>`
- Incluir comentarios `<!-- IMG: [prompt] -->` donde van las imágenes pendientes de generar
- Ser auto-contenido (funciona al abrirlo en un navegador)
- Incluir `<style>` con tipografía legible, line-height generoso, max-width ~740px para el cuerpo
- Si hay multiidioma: secciones `<section lang="es">` y `<section lang="en">` separadas

```
<proyecto>/marketing/posts/<slug>/<slug>.html
```

**6b. Fragmento de contenido para CMS/WordPress → `<slug>_content.html`**

Versión lista para pegar directamente en WordPress (editor HTML / bloque HTML personalizado) o vía WP REST API, Webflow, Shopify u otro CMS. **No incluye nada de estructura de documento**: sin `<!DOCTYPE>`, sin `<html>`, sin `<head>`, sin `<body>`, sin `<style>`.

Solo contiene el HTML semántico del contenido:
- Empezar directamente con `<article>`
- Etiquetas de contenido: `<h1>`-`<h3>`, `<p>`, `<ul>`, `<ol>`, `<blockquote>`, `<strong>`, `<em>`, `<a>`
- Comentarios `<!-- IMG: [prompt] -->` donde van las imágenes
- Si hay multiidioma: usar `<section lang="es">` y `<section lang="en">` dentro del mismo `<article>`
- Cerrar con `</article>`

```
<proyecto>/marketing/posts/<slug>/<slug>_content.html
```

### 7. Crear estructura de carpetas de soporte
```
<proyecto>/marketing/posts/<slug>/assets/.gitkeep
<proyecto>/marketing/posts/<slug>/analytics/.gitkeep
```

> **Orden de escritura recomendado:** primero `.md`, luego `_content.html` (el fragmento es más rápido y es la fuente directa del `.html` completo), luego `.html` completo.

### 8. Checklist SEO final (antes de confirmar al usuario)
- [ ] Keyword en H1, primeros 100 palabras, ≥1 H2
- [ ] Densidad de keyword: 1-2% (natural)
- [ ] Meta title: 50-60 chars, keyword al inicio
- [ ] Meta description: 150-160 chars, beneficio claro + CTA implícito
- [ ] Slug: corto, con keyword, sin stop words, sin tildes
- [ ] Prompt [IMG:] para todas las imágenes necesarias
- [ ] Internal links sugeridos: mínimo 2 (con anchor text descriptivo)
- [ ] CTA claro y específico al final
- [ ] Tabla de contenidos incluida si >1.500 palabras
- [ ] Si multiidioma: misma estructura en todos los idiomas, metadata separada

---

## Variantes de tipo de artículo

| Tipo | Particularidades |
|---|---|
| **How-to / Tutorial** | Pasos numerados; resultado concreto prometido en el título; cada H2 = un paso |
| **Listicle** | Mínimo 5 items; cada uno con H3; intro + conclusión con síntesis |
| **Caso de estudio** | Estructura fija: Situación → Problema → Solución → Resultados (con datos) |
| **Opinión / Thought leadership** | Tesis clara en párrafo 1; argumentos con evidencia; admite posturas fuertes |
| **Comparativa** | Tabla comparativa obligatoria; criterios explícitos; recomendación final clara |
| **Guía definitiva / Pilar** | 2000+ palabras; tabla de contenidos obligatoria; enlaces a artículos cluster |

---

## Plantilla de confirmación al usuario

Al terminar, reportar siempre así:

```
✅ Post creado: "[Título]"

📁 <proyecto>/marketing/posts/<slug>/
   ├── <slug>.md              → Contenido completo con SEO y prompts de imágenes
   ├── <slug>.html            → Preview local completo (con head, styles y metadatos)
   ├── <slug>_content.html    → Fragmento listo para pegar en WordPress / CMS
   ├── assets/                → Aquí irán las imágenes cuando se generen
   └── analytics/             → Aquí irán las revisiones de rendimiento

📊 Stats:
   - Palabras: ~X
   - Tiempo de lectura: ~X min
   - Keyword density: X%
   - Imágenes necesarias: X (prompts [IMG:] incluidos en el .md)

🌍 Idiomas: [lista de idiomas incluidos]
🔗 Internal links sugeridos: [lista]
📋 Siguiente paso: ejecutar skill publish-checklist antes de publicar
```

---

## Restricciones

- No publicar contenido sin revisión humana cuando afecte a la reputación de la marca.
- No inventar datos, citas, estadísticas ni nombres de empresas; si no hay fuente verificable, marcar el dato con `[POR VERIFICAR]`.
- No omitir el bloque de metadata SEO ni los prompts `[IMG: ...]` aunque las imágenes vayan a generarse después.
- No saltarse la validación del outline con el usuario antes de redactar el cuerpo completo: el coste de reescribir un post mal enfocado es alto.
- Aplican las reglas de output de `_shared/output-rules.md`.
