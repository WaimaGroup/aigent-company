---
name: "publish-checklist"
description: >
  Skill for reviewing all SEO, UX and technical requirements before publishing any page or post in WordPress.
---

# Skill: Checklist de Publicación WordPress

**Entregable:** checklist completado con estado de cada punto y observaciones

---

## Cuándo usar esta skill

Antes de publicar cualquier página o entrada en WordPress: artículo de blog, página de servicio, landing page, ficha de producto o cualquier contenido nuevo. También para revisar contenido existente que se va a actualizar significativamente.

---

## Cómo usar este checklist

Para cada punto, indicar:
- ✅ Correcto
- ⚠️ Mejorable (añadir nota)
- ❌ Falta / bloqueante (no publicar hasta resolver)

---

## CHECKLIST COMPLETO

### 1. SEO On-Page
- [ ] **H1:** único, con keyword principal, máx. 70 chars
- [ ] **Meta title:** 50-60 chars, keyword al inicio, marca al final si cabe
- [ ] **Meta description:** 150-160 chars, beneficio + llamada a la acción implícita
- [ ] **URL slug:** corta, con keyword, sin acentos, sin stop words
- [ ] **Keyword en los primeros 100 palabras** del cuerpo
- [ ] **Estructura de encabezados correcta:** H1 → H2 → H3 (sin saltos)
- [ ] **Keywords secundarias** distribuidas naturalmente en el texto
- [ ] **Internal links:** mínimo 2, anchor text descriptivo
- [ ] **Canonical tag** correcto (Yoast / RankMath lo gestiona automáticamente)

### 2. Imágenes y media
- [ ] **Imagen destacada** asignada (dimensiones correctas para el tema)
- [ ] **Alt text** en todas las imágenes del artículo
- [ ] **Nombres de archivo** descriptivos (no "foto1.jpg")
- [ ] **Peso optimizado:** imágenes < 200 KB (WebP preferiblemente)
- [ ] **Vídeos:** alojados en YouTube/Vimeo (no subir vídeos directamente a WordPress)

### 3. Contenido y legibilidad
- [ ] **Párrafos cortos:** máx. 4 líneas, con espaciado adecuado
- [ ] **Ortografía y gramática:** revisada (al menos con corrector)
- [ ] **Tono coherente** con la voz de marca
- [ ] **Datos y cifras verificados** (fuentes citadas si es necesario)
- [ ] **Fecha de publicación** correcta (o programada)
- [ ] **Autor** asignado correctamente
- [ ] **Categorías y etiquetas** asignadas (no más de 1-2 categorías principales)

### 4. CTA y conversión
- [ ] **Al menos un CTA** en la página (botón, formulario o enlace interno)
- [ ] **CTA visible sin hacer scroll** en la versión móvil (above the fold si es landing)
- [ ] **Formularios** funcionan y envían a la dirección/CRM correctos
- [ ] **Enlace de CTA** apunta a la URL correcta y sin errores 404

### 5. Técnico
- [ ] **Vista previa en móvil** revisada (texto legible, imágenes correctas, botones accesibles)
- [ ] **Vista previa en escritorio** revisada
- [ ] **Tiempo de carga** razonable (test rápido en PageSpeed si es una landing clave)
- [ ] **No hay enlaces rotos** en el contenido
- [ ] **Comentarios:** activados o desactivados según la política del blog
- [ ] **Noindex / Nofollow** correctamente configurado si es una página de acceso restringido

### 6. Social y distribución
- [ ] **Open Graph** configurado: imagen OG, título y descripción para compartir en redes
- [ ] **Twitter Card** configurada (Yoast / RankMath lo gestiona)
- [ ] **Plan de distribución:** ¿cómo se va a promocionar? (newsletter, redes, paid)

### 7. Post-publicación (recordatorio)
- [ ] Solicitar indexación en **Google Search Console** (URL inspection → Request indexing)
- [ ] Compartir en redes sociales según calendario editorial
- [ ] Añadir el enlace a otros artículos relacionados del blog (internal linking retroactivo)
- [ ] Incluir en próxima newsletter si aplica

### 8. Archivos del post
- [ ] Carpeta del post existe en `<proyecto>/marketing/posts/<slug>/`
- [ ] Archivo `.md` con frontmatter SEO completo y `status: ready`
- [ ] Archivo `.html` presente y revisado visualmente
- [ ] Carpeta `assets/` con todas las imágenes (no quedan `[IMG: prompts]` sin resolver)
- [ ] Carpeta `analytics/` creada
- [ ] Actualizar `status` en el frontmatter del `.md` a `published` al publicar

---

## Seguimiento post-publicación — carpeta analytics/

Una vez publicado, guardar en `<proyecto>/marketing/posts/<slug>/analytics/`:

| Archivo | Cuándo | Contenido |
|---|---|---|
| `review-YYYY-MM-DD.md` | Al publicar | Checklist completado, URL final, fecha de indexación solicitada |
| `performance-1m.md` | Al mes | Tráfico, posición media, CTR, tiempo en página |
| `performance-3m.md` | A los 3 meses | Evolución de rankings, oportunidades de actualización |
| `update-YYYY-MM-DD.md` | Cada actualización | Qué cambió y por qué |

Formato sugerido para `review-YYYY-MM-DD.md`:
```markdown
# Revisión de publicación — [Título del post]
**URL publicada:** [url]
**Fecha de publicación:** YYYY-MM-DD
**Indexación solicitada en GSC:** YYYY-MM-DD
**Indexada en Google:** Sí / No / Pendiente

## Resultado del checklist
| Sección | Estado | Notas |
[tabla del checklist]

## Notas editoriales
[Decisiones tomadas, cambios de última hora]

## Próxima revisión de rendimiento
Programar para: YYYY-MM-DD (30 días tras publicación)
```

---

## Plantilla de entrega del checklist

```markdown
## CHECKLIST DE PUBLICACIÓN — [Título de la página/artículo]

**URL:** [url]
**Fecha de revisión:** YYYY-MM-DD
**Revisado por:** [nombre]

| Sección | Estado | Observaciones |
|---|---|---|
| SEO On-Page | ✅ / ⚠️ / ❌ | [notas] |
| Imágenes | ✅ / ⚠️ / ❌ | [notas] |
| Contenido | ✅ / ⚠️ / ❌ | [notas] |
| CTA y conversión | ✅ / ⚠️ / ❌ | [notas] |
| Técnico | ✅ / ⚠️ / ❌ | [notas] |
| Social | ✅ / ⚠️ / ❌ | [notas] |

**Resultado:** ✅ Listo para publicar / ⚠️ Publicar con reservas / ❌ No publicar

**Puntos bloqueantes (❌):**
1. [punto]

**Mejoras recomendadas (⚠️):**
1. [mejora]
```

---

## Restricciones

- No marcar como ✅ un punto que no se ha verificado: el checklist es una herramienta de calidad, no un trámite.
- No publicar mientras haya puntos bloqueantes (❌): resolver primero o aplazar la publicación.
- No saltarse la vista previa en móvil — más del 60% del tráfico viene de mobile y los errores de renderizado ahí son frecuentes.
- Crear siempre la carpeta `analytics/` aunque esté vacía: marca el compromiso de revisión post-publicación.
- Aplican las reglas de output de `_shared/output-rules.md`.
