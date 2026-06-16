---
name: "marketing-elementor-content"
user-invocable: true
description: >
  Skill for producing Elementor-ready content for WordPress: builds the canonical
  `_elementor_data` JSON (sections → columns → widgets with core Elementor widgets),
  rendered HTML fallback, post metadata, and optionally an `assets/` folder with
  SVG vectoriales (icons, decorations, dividers, blob shapes) generated inline +
  rasterized PNG @2x. Covers pages, blog posts, campaign landing pages and reusable
  blocks. Photographic images stay as external placeholders with a visual brief.
  Applies site-specific style tokens from `.context/<proyecto>/config.json → style.elementor`
  before generating any JSON. Publishes via the WordPress MCP available in the IDE
  (idempotent workflow with cache invalidation) — falls back to manual import in the
  Elementor builder if no MCP exposes write access.
---

# Skill: Contenido para Elementor (WordPress)

**Entregable:** carpeta con `_elementor_data.json` (postmeta `_elementor_data`), `content.html` (fallback `post_content`), `metadata.md` (title, slug, meta description, postmetas), `README.md` (cómo publicar vía MCP o manual) y, cuando aplique, subcarpeta `assets/` con SVGs + PNGs @2x.

> **Excepción al default de archivo único:** el resto de skills de Marketing entregan un solo `.md`, pero esta skill es un **entregable técnico multi-archivo por naturaleza** (el JSON del builder, su fallback HTML, los postmetas y los assets son inseparables). Es la única excepción documentada del departamento y solo se invoca cuando el usuario quiere explícitamente contenido montado en Elementor.

**Archivos de la skill (fuente de verdad):**

```
marketing-elementor-content/
├── SKILL.md                                  ← este archivo (prosa + plantillas)
└── scripts/
    └── validate-elementor-data.cjs           ← validador específico (Node 18+, sin deps)
```

El validador es **parte del contrato de la skill** — la skill se ejecuta siempre con él. Si más adelante varios departments necesitan validadores de outputs estructurados, se promueve al engine v2 con un comando `engine.cjs validate-output <type> <file>`. Por ahora vive aquí porque el contrato es 100% específico de Elementor (catálogo de widgets, jerarquía section/column/widget, `isInner` consistency, columnas a 100%, `icon-list` con `_id`).

---

## Cuándo usar esta skill

- **Modo `post`** — Maquetar en Elementor un blog post **ya generado** por `marketing-copy` (formato `blog`). Se ejecuta **siempre después** de generar el copy, sobre la misma carpeta `<proyecto>/marketing/posts/<slug>/`. Lee el `.md` como input, no reescribe el copy.
- **Modo `page`** — Crear una página de WordPress (about, servicio, contacto, pricing) construida con Elementor desde cero, sin blog-post previo.
- **Modo `landing`** — Crear una landing page de campaña con hero + social proof + FAQ + CTAs múltiples lista para clonar, sin blog-post previo.
- **Modo `block`** — Generar bloques reutilizables (secciones sueltas: hero, pricing, testimonios, FAQ) para inyectar en páginas existentes.

### Regla anti-ambigüedad (dept Marketing)

| Tipo de entregable | Skill que se invoca primero | ¿Encadenar Elementor? |
|---|---|---|
| Blog post / artículo editorial | `marketing-copy` formato `blog` (siempre) | Sí, si el sitio usa Elementor → modo `post` sobre la misma carpeta |
| Page (about, servicio, contacto, pricing) | `marketing-elementor-content` modo `page` (directo) | — (esta skill es el único paso) |
| Landing de campaña | `marketing-elementor-content` modo `landing` (directo) | — |
| Bloque reutilizable | `marketing-elementor-content` modo `block` (directo) | — |
| Copy plano sin builder | `marketing-copy` (formato `blog`) o `marketing-landing-page` y se queda ahí | No |

**Nunca invocar esta skill antes que el copy para contenido editorial.** El copy se decide primero (con `marketing-copy` formato `blog`: tono, SEO, estructura) y luego se maqueta.

**Cuándo NO usar:**
- Sitio sin Elementor (Gutenberg puro, WPBakery, Divi).
- Solo necesitas copy plano: usar `marketing-copy` (formato `blog` o `anuncio`).
- Contenido que requiere **Elementor Pro** (Form, Posts Loop, Slides, Price Table avanzada…). Esta skill cubre solo widgets **core**.

---

## Paso 0 — Leer contexto y estilo del site (OBLIGATORIO antes de generar JSON)

Antes de escribir una sola línea de `_elementor_data.json`:

### 0.1 Ruta de salida

Leer `.context/<proyecto>/config.json → paths.marketing.posts` (o `paths.marketing` legacy). Si existe, la carpeta del entregable va ahí. Si no existe, usar el default y persistirlo en el config.

**Convención unificada del dept Marketing (desde framework 3.2.0):** todo el contenido publicable de `marketing-web` y `marketing-creative` (blog posts, páginas WP, landings, contenido Elementor y bloques reutilizables) vive en una **única carpeta `posts/`**, no en `contenido/`, `web/`, `blog-posts/` ni `landing-pages/`.

```
<proyecto>/marketing/posts/<slug>/
```

El `<slug>` describe el tipo cuando ayuda a distinguir (`landing-launch-q3`, `page-about`, `block-hero-default`, `post-como-elegir-crm`). El orquestador `marketing-orchestrator` y `marketing-copy` (formato `blog`) ya usan este path.

### 0.2 Tokens de estilo Elementor

1. Leer `.context/<proyecto>/config.json → style.elementor`.
2. **Si existe** → usar esos tokens directamente (pasar al Paso 1).
3. **Si NO existe**:
   - Llamar a `wp_get_posts` (status: publish, per_page: 3) para obtener IDs de posts recientes.
   - Llamar a `wp_get_post_meta` en el post más reciente con `key: "_elementor_data"`.
   - Extraer todos los `__globals__` usados (colores, tipografías) y cualquier campo extra de plugins (buscar claves como `eael_*`, `pa_*`, `premium_*`).
   - Escribir los tokens en `.context/<proyecto>/config.json → style.elementor`:

```jsonc
"style": {
  "elementor": {
    "tokens_source_post": <post_id>,
    "colors": {
      "primary_heading":  "globals/colors?id=XXXXXXX",
      "accent_heading":   "globals/colors?id=XXXXXXX",
      "body_text":        "globals/colors?id=XXXXXXX",
      "highlight_bg":     "globals/colors?id=XXXXXXX"
    },
    "typography": {
      "counter_title": "globals/typography?id=XXXXXXX"
    },
    "plugin_required_fields": {}
  }
}
```

> **Regla de oro:** nunca hardcodear hex en secciones/widgets si el site tiene tokens globales. Si `style.elementor` define `primary_heading`, usar `"__globals__": {"title_color": "<valor>"}` — nunca `"title_color": "#XXXXXX"`.

### 0.3 Decisiones del proyecto

Leer `.context/<proyecto>/config.json → decisions` y filtrar las de `area: "marketing"` o `area: "global"`. Aplicarlas al tono, estructura y CTA del contenido.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| `tipo` | ¿Es una `page`, un `post` de blog, una `landing` o un `block` reutilizable? |
| `objetivo` | ¿Cuál es el objetivo? (informar, convertir, ranquear SEO…) |
| `titulo` | Título de la página/post (también H1 si es landing; el H1 en posts lo pone el theme) |
| `slug` | Slug URL (kebab-case, sin acentos) |
| `meta_description` | 140–160 caracteres con beneficio + CTA implícito |
| `audiencia` | Persona/segmento |
| `propuesta_valor` | Una frase con el beneficio principal |
| `secciones` | Lista ordenada de secciones y qué va en cada una |
| `cta_principal` | Texto del botón + URL destino |
| `imagenes` | URLs de imágenes en mediateca o placeholders |
| `assets_a_generar` | SVGs a generar (iconos custom, ilustración, divider, blob, badge, patrón). Vacío si no hacen falta. |
| `estilo_visual` | Paleta hex, estilo (`flat`/`geometric`/`abstract`/`isometric-flat`/`mono-line`), detalle (`minimal`/`medium`). Solo si hay `assets_a_generar`. |
| `keyword_seo` | Palabra clave principal si la página debe posicionar |

---

## Modos según `tipo`

### Modo `post` (blog post)

- **Sin hero de sección** al inicio. El theme renderiza título + featured image.
- Empieza con un párrafo introductorio (`text-editor`) tras un `spacer` pequeño.
- Secciones outer usan `margin` (no `padding`) para que el theme controle el espacio interno.
- Multi-columna siempre vía **inner sections** (`isInner: true`) dentro de una columna de la sección outer.
- CTA al final: sección con `background_background: "gradient"` usando tokens de `highlight_bg` + `primary`.

### Modo `page` / `landing`

- Hero prominente full-width al inicio (`layout: "full_width"`, `stretch_section: "section-stretched"`).
- Secciones con `padding` (no `margin`).
- CTAs secundarios intermedios permitidos.
- Hero puede llevar imagen de fondo o color sólido del token `primary_heading` o custom.

### Modo `block`

Solo se genera la sección/inner section reutilizable. Sin `metadata.md` ni `README.md` completos. Se documenta el ID de la sección para importar en cualquier página.

---

## Catálogo de widgets core soportados

| `widgetType` | Para qué | Settings clave |
|---|---|---|
| `heading` | H1–H6 | `title`, `header_size` (`h1`…`h6`), `align`, `title_color` o `__globals__.title_color` |
| `text-editor` | Párrafos con formato (HTML) | `editor` (string HTML), `text_color` o `__globals__.text_color` |
| `image` | Imagen única | `image: { url, id, alt }`, `image_size`, `align`, `link: { url }` |
| `button` | CTA / botón | `text`, `link: { url, is_external, nofollow }`, `align`, `size`, `background_color` o `__globals__.background_color` |
| `icon-box` | Icono + título + descripción | `icon: { value, library }`, `title_text`, `description_text`, `position` |
| `image-box` | Imagen + título + descripción | `image`, `title_text`, `description_text`, `image_position` |
| `icon-list` | Lista de bullets con iconos | `icon_list: [{ text, selected_icon: { value, library }, _id }]`, `view`, `space_between` |
| `spacer` | Separador vertical | `space: { unit: "px", size: N }` |
| `divider` | Línea | `style`, `color`, `weight` |
| `video` | YouTube/Vimeo | `video_type`, `youtube_url` / `vimeo_url`, `aspect_ratio` |
| `testimonial` | Cita + autor | `testimonial_content`, `testimonial_image`, `testimonial_name`, `testimonial_job` |
| `tabs` | Pestañas | `tabs: [{ tab_title, tab_content }]` |
| `accordion` | FAQ | `tabs: [{ tab_title, tab_content }]`, `title_html_tag` |
| `toggle` | Toggle simple | `tabs: [{ tab_title, tab_content }]` |
| `social-icons` | RRSS | `social_icon_list: [{ social_icon: { value, library }, link: { url } }]`, `shape` |
| `counter` | Número animado | `starting_number`, `ending_number`, `duration`, `title`, `suffix` |
| `progress` | Barra de progreso | `title`, `percent: { unit:"%", size }`, `progress_type` |
| `alert` | Aviso | `alert_type`, `alert_title`, `alert_description` |
| `html` | HTML libre | `html` (string) |
| `shortcode` | Shortcode | `shortcode` |
| `google_maps` | Mapa embed | `address`, `zoom`, `height` |

**`icon-list` — atención:** el campo del icono en cada item es `selected_icon` (no `icon`) y cada item necesita su propio `_id` único. Sin `_id`, Elementor mezcla items al editar desde el builder.

```json
{ "text": "Texto del item", "selected_icon": { "value": "fas fa-check", "library": "fa-solid" }, "_id": "a1b2c3d" }
```

> **Iconos Font Awesome 5:** `{ "value": "fas fa-check", "library": "fa-solid" }` / `"fa-brands"` / `"fa-regular"`. Para iconos fuera del catálogo FA → generar como SVG en `assets/` y referenciar desde widget `image` o `html`.

---

## Estructura jerárquica del JSON

```
[ section, section, … ]                    ← _elementor_data (raíz)
   └─ elements: [ column, column, … ]
                  └─ elements: [ widget, widget, … ]
```

Para multi-columna con estilo independiente (borde, fondo, border-radius), usar **inner sections**:

```
section (outer)
  └─ column (100%)
       └─ section (isInner: true)
            ├─ column (isInner: true, 33%)  → widgets
            ├─ column (isInner: true, 33%)  → widgets
            └─ column (isInner: true, 33%)  → widgets
```

Cada nodo tiene 4 claves obligatorias: `id`, `elType`, `settings`, `elements`. Los widgets añaden `widgetType`. Las inner sections añaden `"isInner": true`.

**IDs:** 7-8 caracteres `[a-f0-9]` únicos dentro del JSON. Si el site requiere campos de plugin en cada widget (ver `style.elementor.plugin_required_fields`), añadirlos en `settings` de cada nodo con un `_id` único por item de array.

---

## Ejemplos canónicos

> Estos ejemplos usan `__globals__` (sistema de tokens). Si el site no tiene tokens globales, sustituir por valores hex hardcodeados. Los IDs de token se leen de `style.elementor` del config del proyecto.

### 1. Post blog — sección de texto con H2 (modo `post`)

```json
{
  "id": "b2c3d4e5",
  "elType": "section",
  "settings": {
    "margin": {"unit":"px","top":"20","right":0,"bottom":"20","left":0,"isLinked":false}
  },
  "elements": [{
    "id": "f6a7b8c9",
    "elType": "column",
    "settings": {"_column_size": 100},
    "elements": [
      {
        "id": "d0e1f2a3",
        "elType": "widget",
        "widgetType": "heading",
        "settings": {
          "title": "Título de sección",
          "header_size": "h2",
          "_margin": {"unit":"px","top":"0","right":"0","bottom":"15","left":"0","isLinked":false},
          "__globals__": {"title_color": "globals/colors?id=PRIMARY_TOKEN"}
        },
        "elements": []
      },
      {
        "id": "b4c5d6e7",
        "elType": "widget",
        "widgetType": "text-editor",
        "settings": {
          "editor": "<p>Contenido del párrafo.</p>",
          "_margin": {"unit":"px","top":"10","right":"0","bottom":"10","left":"0","isLinked":false},
          "__globals__": {"text_color": "globals/colors?id=BODY_TEXT_TOKEN"}
        },
        "elements": []
      }
    ]
  }]
}
```

### 2. Stats — inner section 3 columnas con borde

```json
{
  "id": "c3d4e5f6",
  "elType": "section",
  "settings": {
    "margin": {"unit":"px","top":"20","right":0,"bottom":"20","left":0,"isLinked":false}
  },
  "elements": [{
    "id": "a7b8c9d0",
    "elType": "column",
    "settings": {"_column_size": 100},
    "elements": [{
      "id": "i1s2a3b4",
      "elType": "section",
      "isInner": true,
      "settings": {
        "structure": "30",
        "border_border": "solid",
        "border_width": {"unit":"px","top":"2","right":"2","bottom":"2","left":"2","isLinked":true},
        "border_radius": {"unit":"px","top":"20","right":"20","bottom":"20","left":"20","isLinked":true},
        "margin": {"unit":"px","top":"30","right":0,"bottom":"30","left":0,"isLinked":true},
        "__globals__": {"border_color": "globals/colors?id=ACCENT_TOKEN"}
      },
      "elements": [
        {
          "id": "j5k6l7m8",
          "elType": "column",
          "isInner": true,
          "settings": {"_column_size": 33, "text_align": "center"},
          "elements": [{
            "id": "w1a2b3c4",
            "elType": "widget",
            "widgetType": "counter",
            "settings": {
              "starting_number": 0,
              "ending_number": 30,
              "suffix": "%",
              "duration": 500,
              "title": "Descripción del dato estadístico"
            },
            "elements": []
          }]
        },
        {
          "id": "n9o0p1q2",
          "elType": "column",
          "isInner": true,
          "settings": {"_column_size": 33, "text_align": "center"},
          "elements": []
        },
        {
          "id": "r3s4t5u6",
          "elType": "column",
          "isInner": true,
          "settings": {"_column_size": 33, "text_align": "center"},
          "elements": []
        }
      ]
    }]
  }]
}
```

### 3. Feature cards — inner section 3 columnas con fondo

```json
{
  "id": "i2s3c4d5",
  "elType": "section",
  "isInner": true,
  "settings": {
    "structure": "30",
    "border_radius": {"unit":"px","top":"20","right":"20","bottom":"20","left":"20","isLinked":true},
    "margin": {"unit":"px","top":"10","right":0,"bottom":"30","left":0,"isLinked":false},
    "background_background": "classic",
    "__globals__": {"background_color": "globals/colors?id=HIGHLIGHT_BG_TOKEN"}
  },
  "elements": [
    {
      "id": "j1k2l3m4",
      "elType": "column",
      "isInner": true,
      "settings": {"_column_size": 33, "text_align": "center"},
      "elements": [
        {
          "id": "hc1a2b3c",
          "elType": "widget",
          "widgetType": "heading",
          "settings": {
            "title": "🛡️ Título de la card",
            "header_size": "h4",
            "_margin": {"unit":"px","top":"0","right":"0","bottom":"15","left":"0","isLinked":false},
            "__globals__": {"title_color": "globals/colors?id=ACCENT_TOKEN"}
          },
          "elements": []
        },
        {
          "id": "tc1d2e3f",
          "elType": "widget",
          "widgetType": "text-editor",
          "settings": {
            "editor": "<p>Descripción de la card.</p>",
            "_margin": {"unit":"px","top":"10","right":"0","bottom":"10","left":"0","isLinked":false},
            "__globals__": {"text_color": "globals/colors?id=BODY_TEXT_TOKEN"}
          },
          "elements": []
        }
      ]
    }
  ]
}
```

### 4. Hero (modo `page`/`landing`, full width)

```json
{
  "id": "a1b2c3d4",
  "elType": "section",
  "settings": {
    "layout": "full_width",
    "stretch_section": "section-stretched",
    "padding": {"unit":"px","top":80,"right":0,"bottom":80,"left":0,"isLinked":false},
    "background_background": "classic",
    "background_color": "#0F172A"
  },
  "elements": [{
    "id": "b2c3d4e5",
    "elType": "column",
    "settings": {"_column_size": 100, "_inline_size": null},
    "elements": [
      {
        "id": "c3d4e5f6",
        "elType": "widget",
        "widgetType": "heading",
        "settings": {
          "title": "Propuesta de valor en una línea",
          "header_size": "h1",
          "align": "center",
          "title_color": "#FFFFFF",
          "typography_typography": "custom",
          "typography_font_size": {"unit":"px","size":48},
          "typography_font_weight": "700"
        },
        "elements": []
      },
      {
        "id": "d4e5f6a7",
        "elType": "widget",
        "widgetType": "button",
        "settings": {
          "text": "CTA principal",
          "link": {"url": "/contacto", "is_external": false, "nofollow": false},
          "align": "center",
          "size": "lg",
          "__globals__": {"background_color": "globals/colors?id=ACCENT_TOKEN"}
        },
        "elements": []
      }
    ]
  }]
}
```

### 5. Icon-list con `selected_icon` y `_id` por item

```json
{
  "id": "il1d2e3f",
  "elType": "widget",
  "widgetType": "icon-list",
  "settings": {
    "icon_list": [
      {
        "text": "<strong>Primer item.</strong> Descripción.",
        "selected_icon": {"value": "fas fa-check", "library": "fa-solid"},
        "_id": "a1b2c3d"
      },
      {
        "text": "<strong>Segundo item.</strong> Descripción.",
        "selected_icon": {"value": "fas fa-check", "library": "fa-solid"},
        "_id": "b2c3d4e"
      }
    ],
    "_margin": {"unit":"px","top":"10","right":"0","bottom":"10","left":"0","isLinked":false},
    "__globals__": {"text_color": "globals/colors?id=BODY_TEXT_TOKEN"}
  },
  "elements": []
}
```

### 6. CTA final — sección con gradiente (modo `post`)

```json
{
  "id": "a8b9c0d1",
  "elType": "section",
  "settings": {
    "background_background": "gradient",
    "border_radius": {"unit":"px","top":"20","right":"20","bottom":"20","left":"20","isLinked":true},
    "padding": {"unit":"px","top":"20","right":"0","bottom":"30","left":"0","isLinked":false},
    "margin": {"unit":"px","top":"30","right":0,"bottom":"30","left":0,"isLinked":true},
    "__globals__": {
      "background_color":   "globals/colors?id=HIGHLIGHT_BG_TOKEN",
      "background_color_b": "globals/colors?id=PRIMARY_TOKEN"
    }
  },
  "elements": [{
    "id": "e2f3a4b5",
    "elType": "column",
    "settings": {"_column_size": 100},
    "elements": [
      {
        "id": "hcta3h4i",
        "elType": "widget",
        "widgetType": "heading",
        "settings": {
          "title": "¿Listo para empezar?",
          "header_size": "h3",
          "align": "center",
          "title_color": "#FFFFFF",
          "typography_typography": "custom",
          "typography_font_family": "Montserrat",
          "typography_font_weight": "600",
          "typography_font_size": {"unit":"px","size":25}
        },
        "elements": []
      },
      {
        "id": "btcta5l6",
        "elType": "widget",
        "widgetType": "button",
        "settings": {
          "text": "Texto del CTA",
          "link": {"url": "/contacto/", "is_external": false, "nofollow": false},
          "align": "center",
          "__globals__": {"background_color": "globals/colors?id=ACCENT_TOKEN"}
        },
        "elements": []
      }
    ]
  }]
}
```

---

## Generación de assets

### Regla general

La skill genera **SVGs vectoriales** para assets decorativos/icónicos (iconos, ilustraciones planas, dividers, blobs, badges, patrones). Para fotos reales → placeholder `placehold.co` + brief en `metadata.md`.

### SVG vs placeholder externo

| Caso | Resolución |
|---|---|
| Icono custom (fuera de Font Awesome) | SVG en `assets/` |
| Ilustración plana / hero vectorial | SVG en `assets/` |
| Divider decorativo (ola, zigzag) | SVG en `assets/` |
| Badge / sello | SVG en `assets/` |
| Patrón de fondo repetible | SVG en `assets/` |
| Foto de persona, equipo, producto físico | Placeholder `placehold.co` + brief |
| Captura de pantalla / dashboard / mockup foto | Placeholder `placehold.co` + brief |

### Convenciones SVG

- `viewBox` explícito, sin `width`/`height` fijos en el `<svg>` raíz.
- `aria-hidden="true"` si decorativo; `role="img"` + `<title>` si semántico.
- Sin `<script>`, sin metadatos de editor (`<sodipodi:...>`, `<inkscape:...>`).
- Fuentes: `font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"`.
- IDs de gradients/patterns prefijados por nombre del asset: `grad-hero-blob-1`.
- Naming: `hero-blob.svg`, `icon-rocket.svg`, `divider-wave.svg`.

### Rasterización a PNG @2x

```bash
convert -background none -density 192 assets/<name>.svg assets/<name>.png
```

### Placeholder externo

`https://placehold.co/<W>x<H>/<bg_hex>/<text_hex>?text=<descripción+corta>`

---

## Proceso paso a paso

### Paso 0 — Contexto y estilo (ver sección "Paso 0" arriba)
Leer `style.elementor` del config del proyecto. Si no existe, descubrirlo desde un post publicado y persistirlo.

### Paso 1 — Recopilar información
Validar `tipo`, `secciones`, `cta_principal` y, si aplica, `assets_a_generar`. Confirmar el esquema de secciones con el usuario antes de escribir JSON.

### Paso 2 — Generar assets vectoriales (si los hay)
Para cada asset: crear `assets/<name>.svg` → rasterizar a PNG @2x → verificar tamaño (`file assets/<name>.png`). Anotar placeholders de foto con URL `placehold.co` y brief.

### Paso 3 — Construir `_elementor_data.json`
- Usar los ejemplos canónicos como base (no reescribir desde cero).
- Aplicar los tokens de `style.elementor` (nunca hex si hay tokens).
- Si el site tiene `plugin_required_fields` en `style.elementor`, añadirlos en `settings` de cada nodo con `_id` único por item.
- Generar IDs únicos por nodo (7-8 chars `[a-f0-9]`).
- Modo `post`: secciones con `margin`, sin hero, inner sections para multi-col.
- Modo `page`/`landing`: secciones con `padding`, hero full-width al inicio.

### Paso 4 — `content.html` (fallback)
HTML plano equivalente. Etiquetas semánticas (`<section>`, `<h2>`, `<p>`, `<ul>`, `<a>`). No depende de clases Elementor.

### Paso 5 — `metadata.md`
Title SEO, slug, meta description, postmetas (`_elementor_edit_mode: builder`, `_elementor_template_type: wp-page|wp-post|section`), tabla de assets generados, tabla de assets pendientes con briefs.

### Paso 6 — `README.md`
Ruta exacta de la carpeta del entregable, instrucciones de publicación (MCP o manual), pasos para subir assets a la mediateca.

### Paso 7 — Validar el JSON con el validador específico

**No basta con `JSON.parse`.** La skill incluye un validador específico de Elementor (`scripts/validate-elementor-data.cjs`, Node 18+, sin dependencias) que comprueba la estructura completa antes de declarar el JSON listo. Es **obligatorio** ejecutarlo sobre cada `_elementor_data.json` generado:

```bash
.aigent/IDE/bin/run node .aigent/departments/marketing/skills/marketing-elementor-content/scripts/validate-elementor-data.cjs \
  <proyecto>/marketing/posts/<slug>/_elementor_data.json
```

Qué valida:

- Raíz es array de sections (no objeto, no fragmento de widget).
- Cada nodo tiene `id`, `elType`, `settings`, `elements`. Widgets además `widgetType`.
- IDs únicos en todo el árbol.
- `_column_size` de las columnas de cada sección suman 100 (tolerancia ±1).
- `widgetType` ∈ catálogo core (rechaza widgets Pro: `form`, `posts`, `slides`, `price-table`, etc.).
- `isInner: true` consistente entre section padre y columns hijas.
- Items de `icon-list` tienen `_id` único y usan `selected_icon` (no `icon` legacy).
- Widgets `html` con `<script>` → warning.

Exit codes:
- `0` → válido, continuar.
- `1` → errores; **detenerse y corregir el JSON antes de seguir**. El stdout devuelve `{ ok: false, errors: [...], warnings: [...], stats: {...} }` con paths JSON-like (`$[0].elements[1]`) para localizar cada problema.
- `2` → uso incorrecto (path no aportado, archivo no existe).

Flags útiles:
- `--strict` → falla también con warnings (útil en CI o cuando se quiere garantizar limpieza absoluta).
- `--quiet` → solo exit code, sin imprimir el JSON de resumen.

Si el validador devuelve errores, **no continuar al Paso 8**. Corregir el JSON y re-ejecutar hasta `ok: true`. Si un error es genuinamente un falso positivo (regla del validador que no se aplica a tu caso), discutirlo en el catálogo de issues antes de ignorarlo — no comentar la validación.

### Paso 8 — Guardar el entregable
Usar la ruta de `paths.marketing` del config del proyecto (ver Paso 0.1).

### Paso 9 — Publicar vía MCP (si el MCP de WordPress está disponible)
Ver sección "Publicación vía MCP" abajo.

### Paso 10 — Comunicar
Ruta exacta del entregable, URL del post en WordPress (si se publicó), pasos pendientes (featured image, Yoast SEO, revisión en Elementor builder).

---

## Publicación: cómo guardar correctamente `_elementor_data`

> Esta sección es la **fuente principal de fallos** al publicar contenido Elementor vía API/MCP. Leer entera antes de invocar nada que escriba en WordPress. Los matices técnicos aquí documentados son la diferencia entre que el builder abra correctamente o muestre *"Sorry, something went wrong"*.

### Por qué falla normalmente

Elementor guarda `_elementor_data` como **string JSON** en `wp_postmeta.meta_value` — no como array PHP, no como objeto serializado. Cuando el meta se inserta mal, el síntoma típico es:

- La página existe en WP pero abrir el builder Elementor falla / muestra plantilla en blanco.
- El front renderiza el `post_content` (HTML viejo) en lugar del layout Elementor.
- `wp_get_post_meta` devuelve un string que empieza por `a:1:{...}` (serialize PHP) en lugar de `[{...}]` (JSON).

Las 7 causas habituales:

| # | Causa | Síntoma | Cómo evitarlo |
|---|---|---|---|
| 1 | Se pasó un **array/objeto** en `value` en lugar de un string JSON | El meta queda como `a:1:{...}` (PHP serialize) | `JSON.stringify` siempre antes de mandar. `value` debe empezar por `[`. |
| 2 | **Slashes** no aplicados (las `"` internas se rompen) | El builder dice "Failed to load data" | Pasar el string **escapando cada `"` como `\"`** y cada `\` como `\\`. Algunos MCPs hacen `wp_slash()` por ti — verificar leyendo el meta tras escribir. |
| 3 | El meta `_elementor_data` **no está expuesto en REST** | El `POST /wp/v2/pages` se completa pero `meta._elementor_data` no se guarda | Usar la ruta MCP `wp_update_post_meta` en lugar de la REST API estándar, o registrar el meta con `show_in_rest: true` en `functions.php`. |
| 4 | Caché `_elementor_css` no invalidada | El front renderiza HTML viejo aunque el data nuevo está bien | Borrar `_elementor_css` (y `_elementor_inline_svg`) tras cada update de `_elementor_data`. |
| 5 | Falta `_elementor_edit_mode = "builder"` o `_elementor_template_type` | El builder no carga / WP renderiza con theme default | Garantizar siempre los 4 postmetas (ver tabla abajo). |
| 6 | `isInner` inconsistente entre section padre e hijas | El builder abre pero la inner section se renderiza rota | Si `section.isInner: true`, **todas** sus columns hijas también deben tener `isInner: true`. |
| 7 | El `meta_value` excede el límite de la columna en BD | `wp_get_post_meta` devuelve el JSON truncado → JSON inválido | Comprobar tras escribir que el string leído parsea con `JSON.parse`. Si trunca, partir la página en menos secciones o pedir al admin que cambie la columna a `LONGTEXT`. |

### Los 4 postmetas que SIEMPRE deben existir

| Meta | Valor | Notas |
|---|---|---|
| `_elementor_data` | string JSON: `'[{"id":"a1b2c3d4","elType":"section",...}]'` | Empieza por `[`. Es la fuente del builder. |
| `_elementor_edit_mode` | `"builder"` | Exactamente esta string. Si falta, el editor abre Gutenberg en lugar de Elementor. |
| `_elementor_template_type` | `"wp-page"` / `"wp-post"` / `"section"` / `"header"` / `"footer"` / `"archive"` / `"single"` / `"popup"` | Depende del `tipo` del entregable. Las secciones reutilizables usan `"section"`. |
| `_elementor_version` | versión activa en el sitio (ej `"3.21.0"`) | Leer del `style.elementor.elementor_version` del config, o llamar a `wp_get_post_meta` de cualquier post Elementor existente para descubrirla. Si está obsoleto/ausente, Elementor lanza migration y a veces rompe. |

Opcionales pero recomendados:
- `_elementor_page_settings` — settings de página (padding global, breadcrumbs, etc.). Si no se aporta, Elementor usa defaults del theme.
- `_elementor_pro_version` — solo si el sitio tiene Pro.
- `_wp_page_template` — controla el layout del theme (`elementor_canvas`, `elementor_header_footer`, `default`).

### Workflow recomendado

> Asume que tu IDE tiene un MCP de WordPress con escritura. Los nombres de tool (`wp_update_post_meta`, `wp_get_post_meta`, `wp_delete_post_meta`, `wp_get_posts`, `wp_create_post`, `wp_update_post`) son los más habituales — sustituir por los reales que ofrezca tu MCP si difieren.

**Paso A — Asegurar que el post existe (o crearlo):**

Si vas a actualizar un post existente, ya tienes el `post_id`. Si vas a crear uno nuevo:

```
wp_create_post → {
  "post_type": "page" | "post",
  "post_title": "<title>",
  "post_name":  "<slug>",
  "post_status": "draft",
  "post_content": ""              ← se deja vacío; Elementor usa _elementor_data
}
```

Apuntar el `post_id` devuelto.

**Paso B — Preparar el string del `_elementor_data` (escapado y compacto):**

1. Leer `_elementor_data.json` de la carpeta del entregable.
2. Compactarlo (sin pretty-print) — `JSON.parse` + `JSON.stringify` sin segundo argumento.
3. Escapar para que sea seguro pasarlo como string a un tool MCP que no aplica `wp_slash()` por ti:
   - cada `\` → `\\`
   - cada `"` → `\"`
4. Escribir el resultado en `.context/.temp/marketing/elementor-eldata-<timestamp>.tmp` para tenerlo a mano (debug + retry sin re-escapar).

Equivalentes según shell:

```bash
# bash / Linux
TS=$(date +%s)
TMP=".context/.temp/marketing/elementor-eldata-${TS}.tmp"
mkdir -p "$(dirname "$TMP")"
node -e '
  const fs = require("fs");
  const raw = fs.readFileSync(process.argv[1], "utf8");
  const compact = JSON.stringify(JSON.parse(raw));
  const escaped = compact.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
  fs.writeFileSync(process.argv[2], escaped, "utf8");
' "<proyecto>/marketing/posts/<slug>/_elementor_data.json" "$TMP"
```

```powershell
# Windows / PowerShell — UTF-8 obligatorio
$ts      = [int][double]::Parse((Get-Date -UFormat %s))
$tmp     = ".context\.temp\marketing\elementor-eldata-$ts.tmp"
New-Item -ItemType Directory -Force -Path (Split-Path $tmp) | Out-Null
$raw     = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$parsed  = $raw | ConvertFrom-Json
$compact = $parsed | ConvertTo-Json -Compress -Depth 30
$escaped = $compact.Replace('\','\\').Replace('"','\"')
[System.IO.File]::WriteAllText($tmp, $escaped, [System.Text.Encoding]::UTF8)
```

**Paso C — Borrar el meta existente (idempotencia):**

```
wp_delete_post_meta → {"post_id": <id>, "key": "_elementor_data"}
```

Si el meta no existía, devuelve `false` — está bien, ignorar.

**Paso D — Insertar el nuevo meta:**

```
wp_update_post_meta → {
  "post_id": <id>,
  "key":     "_elementor_data",      ← exactamente "key", NO "meta_key"
  "value":   "<contenido de elementor-eldata-<ts>.tmp>"
}
```

Interpretación del `result`:
- `<int positivo>` → inserción exitosa (devuelve `meta_id`).
- `true` → actualización exitosa.
- `false` → **FALLO**. No continuar; investigar (ver "Troubleshooting" abajo).

**Paso E — Garantizar los 3 metas auxiliares:**

```
wp_update_post_meta → {"post_id": <id>, "key": "_elementor_edit_mode",     "value": "builder"}
wp_update_post_meta → {"post_id": <id>, "key": "_elementor_template_type", "value": "wp-page"}   ← según tipo
wp_update_post_meta → {"post_id": <id>, "key": "_elementor_version",       "value": "<ver>"}
```

**Paso F — Invalidar la caché CSS de la página:**

```
wp_delete_post_meta → {"post_id": <id>, "key": "_elementor_css"}
wp_delete_post_meta → {"post_id": <id>, "key": "_elementor_inline_svg"}
```

Si tu MCP soporta un tool `elementor_regenerate_css` o `elementor_clear_cache`, prefiérelo.

**Paso G — Verificar que el meta se guardó como string JSON válido:**

```
wp_get_post_meta → {"post_id": <id>, "key": "_elementor_data"}
```

Cuatro comprobaciones sobre el valor devuelto:
1. **Empieza por `[`.** Si empieza por `a:` o `O:` → fue PHP-serializado, reintentar con `JSON.stringify` explícito.
2. **Parsea como JSON.** Si `JSON.parse` falla, los slashes están mal.
3. **El primer `id` coincide** con el primer `id` del JSON de origen.
4. **El último carácter es `]`.** Si no, el meta fue truncado por límite de columna.

**Paso H — SEO (si el sitio usa Yoast/RankMath y el MCP lo expone):**

```
wp_update_seo_meta → {"post_id": <id>, "title": "...", "description": "...", "focus_keyword": "..."}
```

**Paso I — Borrar archivos temporales:**

```bash
rm .context/.temp/marketing/elementor-eldata-*.tmp
```

**Paso J — Publicar (cuando esté listo y revisado):**

```
wp_update_post → {"post_id": <id>, "post_status": "publish"}
```

Antes: abrir la URL en preview y confirmar visualmente.

### Troubleshooting

| Síntoma | Causa probable | Fix |
|---|---|---|
| `wp_update_post_meta` devuelve `result: false` y no hay error claro | El parámetro key se llamó `"meta_key"` en lugar de `"key"` | Usar exactamente `"key"`. |
| Meta guardado pero builder abre vacío | El `value` fue interpretado como objeto y serializado con PHP serialize | Forzar `JSON.stringify` y pasar el resultado como string. Verificar con `wp_get_post_meta` que el valor empieza por `[`. |
| Builder dice "Failed to load data" | Slashes no aplicados → `"` internas rotas | Re-escapar: cada `"` interna debe quedar como `\"`. Algunos MCPs ya aplican `wp_slash`, otros no — comparar el valor leído con el origen. |
| `wp_get_post_meta` devuelve string truncado | Columna `meta_value` no es `LONGTEXT` o el sitio tiene un proxy que trunca | Reducir el tamaño dividiendo en bloques reutilizables, o pedir al admin migrar la columna. |
| Front renderiza HTML viejo | Caché CSS no invalidada | Borrar `_elementor_css` y `_elementor_inline_svg`. Si el sitio tiene un caché plugin (WP Rocket, W3 Total Cache, LiteSpeed), purgar también su caché. |
| Builder abre pero inner section se ve rota | `isInner: true` falta en columns hijas | Auditar el JSON: si la section es inner, todas sus columns también. |
| El meta se guarda pero al recargar el editor "se vacía" | Probablemente el sitio tiene autosave-revision activo y leyó una revision vieja | Tras escribir el meta, llamar a `wp_update_post → {"post_id": <id>, "post_modified": "<now>"}` para forzar nueva revisión. |
| Caracteres Unicode (emojis, acentos especiales) salen como `?` | BD no es `utf8mb4` o el path PowerShell se hizo sin `UTF-8` | Re-escribir el `.tmp` con `[System.Text.Encoding]::UTF8` explícito; pedir al admin migrar BD a `utf8mb4`. |
| El usuario edita la página en el builder y al guardar pierde widgets | El meta se reescribe con `slashes` distintos a los que Elementor espera | No volver a forzar el meta tras la primera edición humana. Si hay que actualizar el contenido, hacerlo desde el builder o regenerar `_elementor_data` desde la fuente y aplicar el workflow completo (Pasos C-G). |

### Vía alternativa: REST API estándar de WP

Si el MCP no expone `wp_update_post_meta` o lo tienes con permisos limitados, la REST API de WordPress permite hacerlo en una sola llamada — **siempre que los metas Elementor estén registrados con `show_in_rest: true` en el theme/plugin**. Verificarlo con un GET previo:

```
GET /wp-json/wp/v2/pages/<id>?context=edit
```

En la response, `meta._elementor_data` debe estar presente (aunque sea vacío) para que el POST funcione. Si no aparece, el meta no está expuesto y hay que usar la vía MCP de la sección anterior.

Si está expuesto:

```
POST /wp-json/wp/v2/pages/<id>
Content-Type: application/json
Authorization: Basic <base64(user:app_password)>

{
  "meta": {
    "_elementor_data": "[{\"id\":\"a1b2c3d4\",\"elType\":\"section\",...}]",
    "_elementor_edit_mode": "builder",
    "_elementor_template_type": "wp-page",
    "_elementor_version": "3.21.0"
  }
}
```

WP REST aplica `wp_slash()` automáticamente — pasar el JSON con `"` escapadas como `\"` sin doble escape.

### Archivos temporales

Aplica la convención universal `_shared/output-rules.md → "Archivos temporales"`: subdirectorio del dept (`.context/.temp/marketing/`), naming con timestamp Unix, borrar tras usar, nunca commitear (el `.gitignore` del árbol se encarga).

---

## Plantilla del entregable

```
<proyecto>/marketing/posts/<slug>/
├── _elementor_data.json    ← array JSON para el postmeta _elementor_data
├── content.html            ← fallback HTML plano
├── metadata.md             ← title, slug, SEO, postmetas, inventario assets
├── README.md               ← cómo publicar + estado del post en WP
└── assets/                 ← solo si hay SVGs/PNGs generados
    ├── <name>.svg
    └── <name>.png          ← rasterización @2x
```

### `metadata.md` mínimo

```markdown
# <Título>

- **Tipo:** post | page | landing | block
- **Slug:** `<kebab-case>`
- **Post ID:** <id> (si ya existe en WP)
- **Estado:** draft | publish
- **URL preview:** <url>
- **Title (SEO):** <≤60 chars>
- **Meta description:** <140-160 chars>
- **Keyword principal:** <keyword>
- **Imagen destacada:** <URL o pendiente>
- **Categorías:** <nombre (id)>, ...
- **Tags:** <nombre (id)>, ...

## Postmetas Elementor

| Meta | Valor | Estado |
|---|---|---|
| `_elementor_edit_mode` | `builder` | ✅/⏳ |
| `_elementor_data` | array JSON | ✅/⏳ |
| `_elementor_template_type` | `wp-post` / `wp-page` | ✅/⏳ |

## Secciones del entregable

| # | Sección | Widgets | ID outer section |
|---|---|---|---|
| 1 | Intro | text-editor | `a1b2c3d4` |
| 2 | ... | ... | `...` |

## Assets generados

| Archivo | Tipo | viewBox | Uso |
|---|---|---|---|

## Assets pendientes (foto real)

| Placeholder | Tipo | Dimensiones | Brief |
|---|---|---|---|
```

---

## Checklist de calidad

- [ ] `.aigent/IDE/bin/run node .aigent/departments/marketing/skills/marketing-elementor-content/scripts/validate-elementor-data.cjs <path>` devuelve `ok: true` (exit 0). Cualquier error reportado se ha corregido en el JSON antes de seguir.
- [ ] `style.elementor` en el config del proyecto existe (o se descubrió y persistió en este proceso).
- [ ] No hay hex hardcodeados donde el site tiene tokens globales.
- [ ] Todos los `plugin_required_fields` de `style.elementor` están en cada widget/sección.
- [ ] El JSON parsea correctamente (`JSON.parse`).
- [ ] Todos los nodos tienen `id`, `elType`, `settings`, `elements`. Widgets tienen `widgetType`.
- [ ] No hay IDs repetidos dentro del JSON.
- [ ] Todas las columnas dentro de cada sección suman 100 en `_column_size`.
- [ ] Los items de `icon-list` usan `selected_icon` (no `icon`) y tienen `_id` único.
- [ ] Multi-columna con estilo propio (fondo, borde, border-radius) usa inner sections (`isInner: true`).
- [ ] Modo `post`: secciones con `margin`, sin hero.
- [ ] Modo `page`/`landing`: secciones con `padding`, hero full-width al inicio.
- [ ] Todos los `widgetType` están en el catálogo core (sin Pro).
- [ ] `metadata.md` declara `_elementor_template_type` correcto.
- [ ] Los SVGs en `assets/` tienen `viewBox` explícito, sin scripts, sin metadatos de editor.
- [ ] Cada SVG tiene su PNG @2x.
- [ ] Si se publicó vía MCP: `wp_get_post_meta` confirma que el valor del meta empieza por `[` (no `a:`/`O:`), parsea como JSON, el primer `id` coincide con el origen y termina en `]` (no truncado).
- [ ] Si se publicó: `_elementor_edit_mode`, `_elementor_template_type` y `_elementor_version` también están set.
- [ ] Si se publicó: la caché CSS `_elementor_css` (y `_elementor_inline_svg`) fue invalidada.
- [ ] Archivos `.tmp` en `.context/.temp/marketing/` borrados tras el proceso.

---

## Restricciones

- **Solo widgets core.** Para Pro (Form, Posts Loop, Slides, Price Table, Theme Builder, Mega Menu…): avisar y proponer alternativa con widgets core.
- **No inventar IDs de mediateca.** Si un asset no está subido: `id: ""` y URL relativa o placeholder. Avisar al usuario.
- **No generar SVGs fotorrealistas.** SVG = vectorial: iconos, ilustraciones planas, decoraciones, dividers, badges, blobs, patrones. Foto real → placeholder + brief.
- **No incluir `<script>` ni metadatos de editor en SVGs.**
- **No inyectar CSS custom** (`custom_css`, `_element_custom_css`).
- **No publicar directamente** sin que el usuario lo confirme. Esta skill produce el contenido; la publicación es el Paso 9 y requiere confirmación explícita.
- **No saltarse `scripts/validate-elementor-data.cjs`** ni comentar su exit code. Si el validador da error, corregir el JSON; nunca pasar al Paso 8 con `ok: false`. Es la única forma de detectar `_column_size` mal, IDs duplicados, widgets Pro infiltrados, `isInner` inconsistente, o `icon-list` sin `_id` antes de publicar.
- **No dejar archivos `.tmp`** en `.context/.temp/marketing/` tras el proceso (regla universal de `_shared/output-rules.md`).
- Aplican las reglas de output de `_shared/output-rules.md`.
