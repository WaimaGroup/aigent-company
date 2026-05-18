---
name: "marketing-linkedin-audit"
user-invocable: true
description: >
  Auditoría pre-publicación de posts de LinkedIn: analiza el alcance orgánico real basado en los seguidores actuales de la página, consulta benchmarks B2B Tech actualizados, detecta penalizaciones algorítmicas (enlaces externos, falta de CTA), genera escenarios de métricas con y sin employee advocacy, y produce un copy plain-text listo para pegar en LinkedIn (sin sintaxis markdown).
---

# Skill: LinkedIn Audit

**Entregable:** dos secciones añadidas al archivo `.md` del post — `## MÉTRICAS OBJETIVO` (contexto del análisis, tabla de escenarios y recomendación de acción) y `## COPY PARA LINKEDIN` (versión plain-text del copy, sin markdown, lista para copiar y pegar). El copy original en markdown se mantiene intacto.

---

## Cuándo usar esta skill

- Antes de publicar cualquier post de LinkedIn desde una página de empresa.
- Cuando se crea un nuevo post con la skill `platform-adapter` o `editorial-calendar`.
- Cuando el usuario pide revisar si un post está optimizado para el algoritmo de LinkedIn.
- Cuando se quiere saber si los objetivos de métricas de un post son realistas.

**Cuándo NO usar:**
- Para posts publicados desde perfiles personales (el alcance orgánico es radicalmente distinto).
- Para campañas de LinkedIn Ads (paid): los benchmarks y escenarios son diferentes.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| URL de la página de LinkedIn | ¿Cuál es la URL de la página de LinkedIn de la empresa? |
| Archivo `.md` del post | ¿Cuál es la ruta del archivo del post a auditar? |
| Objetivo principal del post | ¿El objetivo es alcance/impresiones, engagement o tráfico al sitio web? |

Si la URL de LinkedIn está disponible, acceder a ella para obtener seguidores y empleados actuales sin preguntar al usuario.

---

## Proceso

1. **Obtener datos de la página**
   - Acceder a la URL de LinkedIn de la empresa.
   - Extraer: número de seguidores y número de empleados.
   - Si no es accesible, pedir al usuario ambos datos.

2. **Consultar benchmarks actualizados**
   - Buscar benchmarks de engagement rate y alcance orgánico para company pages B2B Tech en LinkedIn del año en curso.
   - Los datos de LinkedIn cambian rápido: nunca usar cifras de más de 12 meses de antigüedad.
   - Benchmarks de referencia actuales (2026):
     - Alcance orgánico company page: 1,6–5% de seguidores por post
     - Engagement rate medio empresa: 2,5%
     - Engagement rate B2B Tech: 3,6%
     - Posts con enlace externo en el cuerpo: penalización del 30–50% de alcance

3. **Analizar penalizaciones algorítmicas**
   - ¿El post contiene enlaces externos en el cuerpo? → Avisar y recomendar moverlos al primer comentario.
   - ¿El formato es el más competitivo para el objetivo declarado?
     - Reach → texto largo thought leadership, sin enlace en cuerpo
     - Engagement → pregunta directa + CTA explícita, carrusel/documento nativo
     - Tráfico → enlace en primer comentario + CTA que mencione "enlace abajo"
   - ¿Hay CTA explícita para forzar interacción (pregunta, "comenta", "cuéntanos")?

4. **Calcular escenarios de impresiones**

   Fórmula base: `seguidores × reach%`

   | Escenario | Reach % aplicado | Cálculo |
   |---|---|---|
   | Sin advocacy (solo página) | 1,6–3% | seguidores × 0,016 a 0,03 |
   | Advocacy moderado (3–5 empleados) | ×3–5 sobre base | base × 4 |
   | Advocacy activo (8–10+ empleados) | ×8–12 sobre base | base × 10 |

5. **Generar tabla de métricas por escenario**

   Para cada escenario calcular:
   - Impresiones estimadas
   - Engagement rate esperado (aplicar benchmark del sector)
   - Clics al enlace (si hay enlace en primer comentario: ~1% CTR sobre impresiones)
   - Comentarios esperados

6. **Redactar recomendación de acción**
   - Indicar cuántos empleados deben interactuar en la primera hora.
   - Si el objetivo declarado requiere más alcance del alcanzable orgánicamente, recomendar promoción de pago o cambio de formato (carrusel, documento nativo, encuesta).

7. **Añadir sección `## MÉTRICAS OBJETIVO` al archivo `.md` del post**
   - Sustituir o completar la sección `## MÉTRICAS OBJETIVO` existente.
   - Nunca eliminar el copy del post al editar el archivo.

8. **Generar copy plain-text listo para LinkedIn**

   LinkedIn no acepta sintaxis markdown: lo que se pegue tal cual aparece como texto literal (`**negrita**`, `## título`, `- bullet`, `[texto](url)`). Producir una versión limpia del copy, **sin tocar el copy original en markdown**, y añadirla en una sección nueva `## COPY PARA LINKEDIN`.

   Transformaciones a aplicar sobre el copy original:

   | Elemento markdown | Cómo queda en LinkedIn |
   |---|---|
   | `**negrita**` / `__negrita__` | Texto plano (LinkedIn no soporta negrita en el cuerpo del post desde Compose). |
   | `*cursiva*` / `_cursiva_` | Texto plano. |
   | `# Título` / `## Título` / `### Título` | Línea en mayúsculas o terminada en `:` como separador visual, **sin** el `#`. |
   | `- item` / `* item` / `1. item` | Cada item como línea independiente; si conviene, prefijar con un emoji corto (▸, ✅, →) consistente en todo el bloque. |
   | `[texto](https://url)` | `texto` en el cuerpo; la URL se reubica según paso 3 (si penaliza, va al primer comentario y se anota explícitamente más abajo). |
   | `` `código inline` `` | Texto plano. |
   | `> cita` | Línea suelta con — al inicio, o entre comillas tipográficas. |

   Reglas adicionales:
   - **Saltos de línea LinkedIn:** mantener líneas en blanco entre párrafos. LinkedIn colapsa saltos simples en bloques largos, así que párrafos cortos (1–3 frases) + línea en blanco entre ellos.
   - **Gancho:** la primera línea debe seguir funcionando sola (es lo que se ve antes del "ver más" a ~210 chars).
   - **Emojis:** añadir 2–5 emojis profesionales, bien colocados (gancho, puntos clave, CTA). No saturar: tono B2B, no marketing agresivo. Si el copy original ya tenía emojis, respetarlos y no duplicar.
   - **Enlaces:** si en el paso 3 se detectó penalización por enlace externo en el cuerpo, eliminar la URL del cuerpo y dejar al final del copy una línea `🔗 Enlace en el primer comentario ↓` (o equivalente). Listar la URL real fuera del bloque del copy, en una línea aparte etiquetada `Pegar en el primer comentario:` para que la persona la copie aparte.
   - **Hashtags:** mantenerlos al final, separados del cuerpo por una línea en blanco.
   - **CTA:** preservar la CTA explícita detectada en el audit (pregunta directa o invitación a comentar).

9. **Comunicar** al usuario:
   - Ruta del archivo actualizado.
   - Resumen de los 2–3 cambios más importantes detectados (penalizaciones, CTA, advocacy).
   - Recordatorio explícito de que la sección `## COPY PARA LINKEDIN` es la que hay que copiar y pegar en LinkedIn, no el copy en markdown.

---

## Plantilla del entregable

```markdown
## MÉTRICAS OBJETIVO

### Contexto del análisis (<mes> <año>)
- **Seguidores LinkedIn <empresa>:** <N>
- **Empleados:** <N>
- **Alcance orgánico real de company pages en <año>:** <X>–<Y>% de seguidores por post
- **Engagement rate medio B2B Tech:** <X>% (media general empresa: <Y>%)
- **Penalizaciones detectadas:** <lista o "ninguna">

### Escenarios de impresiones según employee advocacy

| Empleados que interactúan | Impresiones estimadas |
|---|---|
| 0 (solo página) | <rango> |
| 3–5 empleados | <rango> |
| 8–10+ empleados | <rango> |

### Métricas objetivo ajustadas

| Métrica | Sin advocacy | Con advocacy (5–8 empleados) |
|---|---|---|
| Impresiones | <rango> | <rango> ← objetivo real |
| Engagement rate | <X>–<Y>% | <X>–<Y>% |
| Clics en enlace | <rango> | <rango> |
| Comentarios | <rango> | <rango> ← objetivo real |

### Acción recomendada
<Texto concreto: cuántos empleados, en qué ventana de tiempo, y qué hacer si el alcance orgánico es insuficiente.>
```

Y debajo, en el mismo archivo, la sección con el copy listo para pegar:

```markdown
## COPY PARA LINKEDIN

> Versión plain-text del copy de arriba, sin sintaxis markdown. **Esto es lo que hay que copiar y pegar en LinkedIn.** El copy en markdown se mantiene como fuente editable.

---
<copy plain-text con saltos de línea respetados y emojis colocados>

<hashtags al final, separados por línea en blanco>
---

Pegar en el primer comentario:
<URL real, sólo si en el audit se movió un enlace fuera del cuerpo>
```

---

## Restricciones

- Nunca publicar métricas objetivo sin haber completado este análisis.
- Nunca usar benchmarks de más de 12 meses de antigüedad: buscar datos actualizados siempre.
- No modificar el copy original (en markdown) del post al editar el archivo `.md`: la sección `## COPY PARA LINKEDIN` es una versión derivada, no un reemplazo.
- No calcular escenarios sin tener el número real de seguidores de la página: los promedios genéricos inducen a error.
- No saturar el copy plain-text con emojis: 2–5 bien colocados, tono B2B.
- Si el audit detectó penalización por enlace externo en el cuerpo, la versión plain-text debe reflejarlo (enlace fuera del cuerpo, anotado para el primer comentario).
- Aplican las reglas de output de `_shared/output-rules.md`.
