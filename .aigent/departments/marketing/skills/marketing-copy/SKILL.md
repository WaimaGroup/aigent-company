---
name: "marketing-copy"
user-invocable: true
description: >
  Skill for writing any marketing copy deliverable: long-form blog posts and articles,
  marketing emails (promo, nurturing, newsletter), paid ad copy (Google/Meta/LinkedIn),
  and press releases. One skill, four formats, selected by the `formato` of the request.
---

# Skill: Copy de Marketing

**Entregable:** un archivo `.md` con el copy listo para usar. Cubre cuatro formatos: **blog/artículo**, **email**, **anuncio** y **nota de prensa**.

> **Regla de output (default de Marketing):** por defecto se entrega **un solo `.md`**. Los formatos extra (`.html` de preview, `_content.html` para CMS, carpetas `assets/` o `analytics/`) **solo se generan si el usuario los pide explícitamente**. No crear carpetas de soporte "por si acaso".

---

## Cuándo usar esta skill

Siempre que el entregable principal sea **texto persuasivo de marketing**. El formato concreto se decide al inicio:

| `formato` | Cuándo | Salida |
|---|---|---|
| `blog` | Post de blog, artículo, guía, pieza editorial SEO | `<slug>.md` en `posts/<slug>/` |
| `email` | Email promocional, nurturing, onboarding, newsletter, anuncio | `.md` en `emails/` |
| `anuncio` | Google Search Ads, Meta Ads, LinkedIn Ads, display | `.md` en `ads/` |
| `prensa` | Comunicado / nota de prensa | `.md` en `press/` |

Si la petición es ambigua sobre el formato, preguntarlo en la primera tanda de preguntas.

**Cuándo NO usar:** optimizar SEO de un post ya escrito → `marketing-seo`. Adaptar a redes sociales → `marketing-social`. Copy de una landing → `marketing-landing-page`.

---

## Información a recopilar (común)

Si no se ha dado, preguntar en **una sola tanda**: tema/mensaje, audiencia (perfil, qué sabe de la marca), objetivo (qué hace el lector al terminar), tono, y CTA/destino. Según el formato, añadir:

- **blog:** keyword principal, longitud (corto 600-900 / medio 1000-1500 / largo 1500+), idiomas.
- **email:** tipo (promo/nurturing/newsletter…), oferta o gancho, segmento.
- **anuncio:** plataforma, URL destino, propuesta de valor / oferta.
- **prensa:** hecho noticiable, cita atribuible, datos de contacto.

---

## Formato `blog` — post / artículo

Estructura del `.md` (frontmatter SEO + cuerpo):

```markdown
---
title: "Título con keyword principal"
slug: "titulo-con-keyword-principal"
meta_title: "Keyword: Título | Marca (50-60 chars)"
meta_description: "150-160 chars con keyword + beneficio claro."
keyword_primary: "keyword principal"
keywords_secondary: ["kw secundaria 1", "kw semántica 2"]
language: "es"
status: "draft"          # draft | review | ready | published
---

# Título con keyword principal

> **Resumen:** 1-2 frases que condensan el valor (apto para featured snippet).

[IMG: prompt detallado de imagen hero — qué muestra, estilo, paleta, 1200x630px]

## Introducción
Gancho (dato/pregunta) → contexto con keyword → promesa del artículo.

## Sección 1: H2 con variante de keyword
Desarrollo en párrafos cortos (máx. 4 líneas). Datos concretos, voz activa.

## Sección 2 / 3 …
Mismo patrón. [IMG: ...] donde aporte.

## Conclusión
Síntesis + insight accionable + transición al CTA.

## [CTA]
> **[Título del CTA]:** acción concreta. **[→ Botón](URL)**
```

Reglas de calidad blog: keyword en H1, primeros 100 palabras y ≥1 H2 (densidad 1-2%, natural); cada primera línea de párrafo legible sola; nunca inventar datos (marcar `[POR VERIFICAR]`); validar el outline con el usuario antes de redactar el cuerpo completo; tabla de contenidos si >1500 palabras. Variantes: how-to (pasos numerados), listicle (≥5 items), caso de estudio (situación→problema→solución→resultados), comparativa (tabla obligatoria), pilar (2000+, enlaza a cluster).

**Multiidioma:** si se piden varios idiomas, repetir la misma estructura con su propio bloque de metadata.

---

## Formato `email`

```
ASUNTO:    3 variantes (A beneficio / B curiosidad / C urgencia) · máx. 50 chars · sin spam words
PREHEADER: 40-90 chars · amplía el asunto, no lo repite

SALUDO     personalizado si es posible
INTRO      1-2 líneas: por qué escribimos hoy
CUERPO     2-3 párrafos cortos (máx. 3 líneas); bullets si hay >2 puntos
CTA        un único botón/enlace, texto accionable ("Ver la demo", no "Haz clic aquí")
CIERRE     1 línea de refuerzo
FIRMA      nombre, cargo, empresa
```

Reglas de oro: un email = un objetivo = un CTA principal; el asunto es lo más importante (siempre 3 variantes); evitar palabras spam (GRATIS, ¡¡¡, caps abusivo); 150-300 palabras (newsletter hasta 600); incluir enlace de baja (legalmente obligatorio).

---

## Formato `anuncio`

Entregar siempre **3 variantes A/B**: (A) beneficio principal, (B) problema/dolor, (C) urgencia o prueba social. Respetar límites de la plataforma:

| Plataforma | Titular | Texto / descripción | Notas |
|---|---|---|---|
| Google RSA | 30 chars (hasta 15) | descripción 90 chars (hasta 4) | titulares legibles por separado (se combinan) |
| Meta | 40 chars | texto principal 125 chars | lo demás se corta en móvil |
| LinkedIn | 70 chars | intro 150 chars / descr. 100 | |

Fórmulas útiles: PAS (problema→agitación→solución), FAB (feature→advantage→benefit), prueba social. Indicar qué variante testear primero y por qué. No usar claims absolutos ("garantizado", "100%") en plataformas que los penalizan; coherencia copy↔landing.

---

## Formato `prensa`

Estructura: titular (claro, noticiable) → entradilla (qué, quién, cuándo, dónde, por qué en 1 párrafo) → cuerpo (2-4 párrafos, del dato más importante al menos) → **cita atribuible** a un portavoz → boilerplate de la empresa → datos de contacto de prensa. Tono informativo, no publicitario. No atribuir citas inventadas a personas reales; dejar la cita como `[CITA PENDIENTE DE APROBACIÓN]` si no se ha confirmado.

---

## Proceso

1. Determinar el `formato` y recopilar la info mínima (una sola tanda de preguntas).
2. Para `blog`: validar el outline con el usuario antes de redactar.
3. Redactar respetando las reglas del formato.
4. **Escribir un único `.md`** con `Write` en la carpeta que corresponda (ver tabla de "Cuándo usar"). Generar `.html`/`_content.html`/`assets/` **solo si el usuario lo pidió**.
5. Confirmar al usuario la ruta del archivo y, si aplica, el siguiente paso sugerido (p. ej. `marketing-seo` para auditar, `marketing-social` para difundir).

---

## Restricciones

- No inventar datos, citas, estadísticas ni nombres; sin fuente verificable, marcar `[POR VERIFICAR]`.
- No publicar contenido que afecte a la reputación de la marca sin revisión humana.
- Respetar siempre los límites de caracteres en `anuncio` y las palabras-spam en `email`.
- No saltarse la validación del outline en `blog`: reescribir un post mal enfocado es caro.
- Default de un solo `.md`; formatos extra solo bajo petición explícita.
- Aplican las reglas de output de `_shared/output-rules.md`.
