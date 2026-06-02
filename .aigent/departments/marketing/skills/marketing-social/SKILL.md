---
name: "marketing-social"
user-invocable: true
description: >
  Skill for social media work: adapting one piece of content into platform-optimized
  versions (LinkedIn, Instagram, X, Facebook, TikTok), building monthly/weekly editorial
  calendars, and auditing a LinkedIn company-page post before publishing. Mode chosen by
  the request: `adaptar`, `calendario` or `linkedin-audit`.
---

# Skill: Social Media

**Entregable:** un archivo `.md` con el trabajo de redes según el modo. Cubre tres modos: **adaptar** contenido por plataforma, **calendario** editorial, y **linkedin-audit** (pre-publicación).

> **Regla de output (default de Marketing):** un solo `.md`. No generar archivos extra salvo petición explícita.

---

## Cuándo usar esta skill

| `modo` | Cuándo | Salida |
|---|---|---|
| `adaptar` | Tienes un contenido base y lo quieres en varias redes | `.md` en `social/` |
| `calendario` | Planificar publicaciones de un periodo (semana/mes/trimestre) | `.md` en `social/` |
| `linkedin-audit` | Revisar un post de página de empresa de LinkedIn antes de publicar | edita el `.md` del post |

Si el modo no está claro, preguntarlo en la primera tanda.

---

## Modo `adaptar` — contenido por plataforma

Recopilar: contenido base, plataformas destino, objetivo (alcance/engagement/tráfico/conversión), tono, enlace/CTA.

Identificar el **mensaje central** (la idea que sobrevive en todas las versiones) y adaptarlo respetando el carácter de cada red:

- **LinkedIn:** texto 800-1500 chars, primera línea autosuficiente (gancho), estructura gancho→valor→pregunta, 3-5 hashtags, primera persona profesional.
- **Instagram feed:** gancho en primeros 125 chars, total 150-300 palabras, 8-15 hashtags al final/primer comentario, CTA tipo "guarda"/"link en bio".
- **Instagram Stories:** texto mínimo de apoyo, sticker (encuesta/pregunta), el tono más informal.
- **X / Twitter:** 280 chars o hilo (primer tweet = gancho + "🧵"); directo, 1-2 hashtags máx.
- **Facebook:** 40-80 palabras con imagen, tono de comunidad.
- **TikTok:** caption ≤150 chars (el mensaje va en el vídeo), tono desenfadado, 3-5 hashtags + trending.

Entregar agrupado por plataforma, con hashtags y el formato visual que necesita cada versión. No publicar texto idéntico en redes distintas; el CTA se adapta al canal.

---

## Modo `calendario` — calendario editorial

Recopilar: periodo, plataformas, frecuencia por red, pilares de contenido, fechas/eventos clave, objetivo del periodo.

Mix de pilares por defecto (ajustable): Educativo 30% · Marca/Valores 20% · Producto 20% · Comunidad 15% · Tendencias 10% · Promocional 5%.

Plantilla:

```markdown
# CALENDARIO EDITORIAL — [Mes/Periodo] [Año]
**Objetivo:** [...]  ·  **Plataformas:** [...]

## Mix de pilares
| Pilar | % | Publicaciones |
|---|---|---|

## Semana 1 — [fechas]
| Día | Plataforma | Formato | Pilar | Tema | Gancho/Copy | Estado |
|---|---|---|---|---|---|---|
(repetir por semana)

## Fechas y eventos clave
| Fecha | Evento | Acción |
|---|---|---|

## Notas de producción
Assets necesarios · copies a redactar · aprobaciones.
```

No proponer una frecuencia que el equipo no pueda mantener; marcar los posts que necesitan diseño/producción especial.

---

## Modo `linkedin-audit` — auditoría pre-publicación (página de empresa)

Recopilar: URL de la página de LinkedIn, ruta del `.md` del post, objetivo (alcance/engagement/tráfico). Si la URL es accesible, obtener seguidores y empleados sin preguntar.

Proceso:

1. **Benchmarks actualizados** (nunca >12 meses). Referencia 2026: alcance orgánico company page 1,6-5% de seguidores/post; engagement medio 2,5% (B2B Tech 3,6%); enlace externo en el cuerpo penaliza 30-50% del alcance.
2. **Penalizaciones:** ¿enlace externo en el cuerpo? → recomendar moverlo al primer comentario. ¿formato óptimo para el objetivo? (alcance→texto largo sin enlace; engagement→pregunta+CTA, carrusel/documento nativo; tráfico→enlace en 1er comentario). ¿hay CTA explícita?
3. **Escenarios de impresiones** (`seguidores × reach%`): sin advocacy (1,6-3%), advocacy moderado (×3-5), advocacy activo (×8-12).
4. **Tabla de métricas** por escenario: impresiones, engagement rate (benchmark sector), clics (~1% CTR si enlace en 1er comentario), comentarios.
5. **Recomendación:** cuántos empleados deben interactuar en la primera hora; si el objetivo supera el alcance orgánico, recomendar pago o cambio de formato.
6. **Editar el `.md` del post** añadiendo dos secciones, **sin tocar el copy original**:
   - `## MÉTRICAS OBJETIVO` (contexto, escenarios, recomendación).
   - `## COPY PARA LINKEDIN` — versión **plain-text** lista para pegar (LinkedIn no renderiza markdown). Transformar: quitar `**`/`*`/`#`/`` ` ``; bullets → líneas con emoji consistente (▸/✅/→); enlaces fuera del cuerpo si penalizan (línea `🔗 Enlace en el primer comentario ↓` + URL aparte etiquetada "Pegar en el primer comentario:"); párrafos cortos con línea en blanco entre ellos; 2-5 emojis profesionales bien colocados; hashtags al final separados por línea en blanco.

No publicar métricas objetivo sin completar el análisis ni calcular escenarios sin el número real de seguidores.

---

## Proceso (común)

1. Determinar el `modo` y recopilar la info mínima en una sola tanda.
2. Ejecutar según el modo.
3. Escribir/editar **un único `.md`** con `Write`/`Edit` (en `linkedin-audit`, `Edit` sobre el `.md` del post; siempre `Read` antes).
4. Confirmar al usuario la ruta y, en `linkedin-audit`, recordar que se pega la sección `## COPY PARA LINKEDIN`, no el markdown.

---

## Restricciones

- No publicar el mismo texto en plataformas distintas; adaptar tono y formato, no el mensaje central.
- No exceder límites recomendados de caracteres aunque la plataforma permita más.
- En `linkedin-audit`: nunca benchmarks de más de 12 meses; no modificar el copy original; no saturar de emojis.
- Default de un solo `.md`; formatos extra solo bajo petición.
- Aplican las reglas de output de `_shared/output-rules.md`.
