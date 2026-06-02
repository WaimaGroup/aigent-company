---
name: "marketing-landing-page"
user-invocable: true
description: >
  Skill for writing and structuring conversion-focused landing pages: lead gen, product, event, download.
---

# Skill: Landing Page de Conversión

**Entregable:** estructura + copy completo de landing page listo para implementar en WordPress o cualquier CMS

> **Regla de output (default de Marketing):** se entrega **un solo `.md`** con el copy y la estructura. La versión `.html`/Elementor solo si el usuario la pide (en ese caso, encadenar con `marketing-elementor-content`).

---

## Cuándo usar esta skill

Cuando el usuario necesite crear una página diseñada para convertir: generar leads, vender un producto o servicio, captar registros para un evento, ofrecer una descarga gratuita (lead magnet) o cualquier objetivo de conversión específico.

---

## Información a recopilar

| Campo | Pregunta |
|---|---|
| Objetivo de conversión | ¿Qué acción debe hacer el visitante? (formulario, compra, descarga, registro) |
| Producto / oferta | ¿Qué se ofrece en la página? |
| Audiencia | ¿Quién llegará a esta landing y desde dónde? (anuncio, email, orgánico) |
| Propuesta de valor | ¿Por qué debería convertir aquí y no en otro sitio? |
| Objeciones principales | ¿Qué frena al usuario para no convertir? |
| Prueba social disponible | ¿Hay testimonios, logos, estadísticas, casos de éxito? |
| CTA | ¿Cuál es el texto del botón / formulario? |
| Keyword SEO (si aplica) | ¿La landing debe posicionarse orgánicamente? |

---

## Estructura estándar de landing page

```
SECCIÓN 1 — HERO (above the fold)
├── Headline H1: propuesta de valor en 1 línea (max. 10 palabras)
├── Subheadline: amplía el beneficio o el "para quién" (1-2 líneas)
├── CTA principal: botón con verbo de acción + beneficio
└── Imagen / vídeo de apoyo (producto, resultado, persona usando el servicio)

SECCIÓN 2 — PROBLEMA / CONTEXTO
├── Descripción del dolor o situación actual del usuario
└── Puente hacia la solución (la empresa/producto como respuesta)

SECCIÓN 3 — SOLUCIÓN
├── Qué es el producto / servicio en términos claros
└── Cómo funciona (3 pasos si es posible: simple, claro)

SECCIÓN 4 — BENEFICIOS (no características)
├── 3-6 beneficios clave con icono o ilustración
└── Cada beneficio: titular + 1-2 líneas de explicación

SECCIÓN 5 — PRUEBA SOCIAL
├── Testimonios (nombre, foto, empresa si es B2B, resultado concreto)
├── Logos de clientes / medios
└── Estadísticas o hitos ("+500 empresas", "4.9/5 en G2"...)

SECCIÓN 6 — CTA SECUNDARIO
└── Repetición del CTA con variante de texto o urgencia añadida

SECCIÓN 7 — FAQ
├── 4-6 preguntas que responden las objeciones más comunes
└── Cada respuesta: corta y directa (2-4 líneas)

SECCIÓN 8 — CTA FINAL
├── Headline de cierre: orientado a la transformación del usuario
└── CTA + micro-copy de confianza ("Sin permanencia", "Cancela cuando quieras"...)
```

---

## Reglas de copywriting para landing pages

- **Un objetivo, un CTA.** No distraer con navegación ni enlaces externos
- **Beneficios, no características.** "Ahorra 3 horas a la semana" > "Automatización avanzada"
- **El visitante es el héroe.** La marca/producto es el guía, no el protagonista
- **Urgencia real, no falsa.** Si hay fecha límite o plazas limitadas, usar; si no, no inventar
- **Micro-copy debajo del CTA:** una línea que elimina el miedo a hacer clic ("Sin tarjeta de crédito", "Respuesta en 24h")
- **Mobile-first:** el hero debe convertir en móvil sin hacer scroll

---

## Proceso

1. Definir objetivo de conversión y audiencia
2. Construir el esquema de secciones (wireframe de texto) y validar con el usuario
3. Redactar sección a sección
4. Entregar con:
   - Copy completo por sección
   - Sugerencia de formato visual por sección (imagen, icono, vídeo)
   - Meta title y meta description si la página debe posicionarse
   - Micro-copy del formulario / botón
   - Texto de confirmación post-conversión (mensaje de gracias)

---

## Checklist de calidad

- [ ] El headline responde en ≤2 segundos: "¿qué es esto y para qué sirve?"
- [ ] Hay CTA above the fold visible sin scroll en móvil
- [ ] Los beneficios hablan del resultado del usuario, no del producto
- [ ] Hay al menos un elemento de prueba social
- [ ] El FAQ responde las 3 objeciones principales del buyer persona
- [ ] No hay menú de navegación ni enlaces que saquen al usuario de la página
- [ ] El micro-copy del CTA elimina la principal fricción para convertir

---

## Restricciones

- No incluir menú de navegación ni enlaces externos que saquen al usuario de la página: una landing tiene un único objetivo de conversión.
- No prometer resultados ni testimonios que no sean reales y verificables; si la prueba social es inventada, debilitará la conversión cuando se descubra.
- No usar urgencia falsa ("solo quedan 2 plazas" si no es cierto): perjudica credibilidad de marca a medio plazo.
- Hablar siempre en términos de beneficio para el usuario, no de características del producto.
- Aplican las reglas de output de `_shared/output-rules.md`.
