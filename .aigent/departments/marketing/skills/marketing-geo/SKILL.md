---
name: "marketing-geo"
user-invocable: true
description: >
  Skill for GEO (Generative Engine Optimization): make content discoverable, quotable
  and citable by AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Gemini,
  Claude). Two modes: `research` (map the questions/prompts an audience asks AI and the
  citable angles to own) and `audit` (audit + optimized version of a page for citability:
  extractable answers, factual density, schema, authority signals). Mode chosen by the request.
---

# Skill: GEO (Generative Engine Optimization)

**Entregable:** un archivo `.md`. Cubre dos modos: **research** (mapa de prompts + ángulos citables) y **audit** (auditoría de citabilidad + versión optimizada de una página).

> **Regla de output (default de Marketing):** un solo `.md`. Sin archivos extra salvo petición.

GEO es el primo de SEO para la era de los motores generativos: en vez de "posicionar en la página de resultados", el objetivo es **que el motor de IA cite, resuma o recomiende tu contenido** cuando responde a un usuario. El usuario muchas veces nunca ve un enlace azul: lee la respuesta sintetizada. GEO trabaja para aparecer **dentro** de esa respuesta.

---

## Cuándo usar esta skill

| `modo` | Cuándo | Salida |
|---|---|---|
| `research` | Descubrir qué pregunta la audiencia a los motores generativos y qué ángulos citables puede ganar la marca | `.md` en `seo/` |
| `audit` | Optimizar una página/artículo para que sea extraíble y citable por motores de IA (o revisarla antes de publicar) | `.md` en `seo/` (o junto al post si se optimiza uno concreto) |

Si el modo no está claro, preguntarlo en la primera tanda.

**Cuándo NO usar:**

- Posicionamiento clásico en buscadores (rankings, SERP, keyword research por volumen) → `marketing-seo`. GEO y SEO se complementan: el on-page de `marketing-seo` ya incluye señales GEO ligeras; esta skill es para trabajo GEO **dedicado y profundo**.
- Checklist técnico completo pre-publicación en WordPress → `marketing-publish-checklist`.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| `modo` | ¿`research` (mapa de prompts y ángulos) o `audit` (optimizar una página concreta)? |
| Negocio / sector | ¿Qué hace la empresa y en qué nicho? |
| Producto / servicio | ¿Qué se quiere que la IA recomiende o cite? |
| Audiencia | ¿Quién pregunta y con qué nivel de conocimiento? |
| Motores objetivo | ¿Cuáles importan? (ChatGPT, Perplexity, Google AI Overviews / Gemini, Claude, Copilot) |
| Entidad de marca | Nombre exacto, fundadores, productos clave, fuentes donde ya se la menciona |
| (audit) URL / contenido | Página a optimizar + tema/pregunta que debería responder |

---

## Modo `research` — mapa de prompts + ángulos citables

A diferencia del keyword research clásico (términos cortos por volumen), el research GEO mapea **prompts conversacionales completos**: las preguntas naturales que un usuario teclea a un asistente de IA.

Proceso: (1) con el usuario, listar 5-10 *jobs to be done* del público → (2) expandir cada uno en prompts conversacionales reales ("¿cuál es el mejor CRM para una pyme de servicios?", "compara X vs Y para equipos remotos") → (3) clasificar por etapa (descubrimiento / comparación / decisión) → (4) para cada prompt, identificar qué tipo de respuesta da hoy la IA y qué fuentes cita → (5) detectar **ángulos citables** que la marca puede ganar (dato propio, definición clara, comparativa honesta, experiencia de primera mano) → (6) marcar **quick wins** (prompts donde la IA aún no cita a nadie autoritario o donde la marca ya tiene contenido casi listo).

Plantilla:

```markdown
## GEO RESEARCH — [Proyecto]

### Quick wins (empezar aquí)
[3-8 prompts donde la marca puede ganar cita rápido: hueco de autoridad o contenido casi listo]

### Mapa de prompts
| Prompt conversacional | Etapa | Quién cita hoy la IA | Ángulo citable de la marca | Página destino |
|---|---|---|---|---|

### Ángulos citables a construir
1. [dato/estudio propio] → refuerza autoridad en [tema]
2. [definición canónica de un término] → la IA tiende a citar quien define claro
3. [comparativa honesta X vs Y] → captura prompts de comparación

### Señales de entidad a reforzar
[dónde debería aparecer la marca para que los motores la reconozcan: Wikipedia, perfiles, menciones en medios, datos estructurados]

### Gaps detectados
[prompts importantes donde la marca está ausente y un competidor sí es citado]

### Próximos pasos
1. … 2. …
```

No inventar qué cita hoy cada motor sin verificarlo: si no se ha comprobado en el motor, marcar "sin verificar" y proponer comprobarlo. Priorizar prompts de decisión/comparación sobre los puramente informativos de alto volumen: una cita en "mejor X para Y" rinde más que aparecer en una definición genérica.

---

## Modo `audit` — auditoría de citabilidad + optimización

Recopilar: URL/contenido, pregunta principal que debería responder, motores objetivo, competidores que hoy sí son citados.

Auditar contra el checklist de **citabilidad** y entregar la versión optimizada. Las palancas GEO (distintas, aunque solapan, de las SEO):

- **Respuesta extraíble:** la respuesta directa a la pregunta aparece en las primeras 1-2 frases del bloque, en lenguaje autónomo (entendible fuera de contexto, sin "como decíamos arriba"). Los motores extraen fragmentos auto-contenidos.
- **Estructura para extracción:** encabezados redactados como preguntas reales; respuestas atómicas por sección; listas y tablas para datos comparables (la IA las parsea y reutiliza bien); un TL;DR o bloque de respuesta corta arriba.
- **Densidad factual:** datos concretos, cifras, fechas, nombres propios y citas atribuidas. El contenido vago no se cita; el específico y verificable, sí. Incluir estadísticas con su fuente.
- **Autoridad y procedencia:** autor con credenciales visibles, fuentes citadas y enlazadas, fecha de actualización clara. Señales E-E-A-T (experiencia, pericia, autoridad, fiabilidad) que el motor usa para decidir en quién confiar.
- **Entidad y datos estructurados:** schema.org relevante (`Organization`/`LocalBusiness`, `Article`, `FAQPage`, `HowTo`, `Product`/`SoftwareApplication`). **Generar siempre el JSON-LD listo para pegar, no solo nombrar el tipo** (es barato y siempre útil). Además: nombre de marca/entidad usado de forma consistente y coherente con lo que ya se dice de la marca en otras fuentes.
- **Cobertura de la pregunta:** responder la intención y las sub-preguntas derivadas (la IA premia el contenido que cubre el tema de forma completa y autónoma).

Plantilla:

```markdown
## AUDITORÍA GEO — [URL/título]
**Pregunta objetivo:** [...]  ·  **Motores objetivo:** [...]

### Diagnóstico de citabilidad
| Palanca | Estado | Nota |
|---|---|---|
| Respuesta extraíble en primeras frases | ✅/⚠️/❌ | |
| Encabezados como preguntas reales | ✅/⚠️/❌ | |
| Densidad factual (datos/cifras/fuentes) | ✅/⚠️/❌ | |
| Autoría y E-E-A-T visibles | ✅/⚠️/❌ | |
| Datos estructurados (schema) | ✅/⚠️/❌ | |
| Consistencia de entidad de marca | ✅/⚠️/❌ | |

### Versión optimizada
**Bloque de respuesta corta (TL;DR):** …
**Encabezados reescritos como preguntas:** …
### Cambios en el cuerpo
[párrafos reescritos para extracción: respuesta directa primero, datos con fuente]
### Schema (JSON-LD listo para pegar) — incluir SIEMPRE
Por cada tipo que aplique a la página, generar el bloque `<script type="application/ld+json">` **completo y listo para pegar**, con los campos rellenos a partir del contenido real (nada de placeholders genéricos). Tipos habituales: `Organization`/`LocalBusiness` (entidad), `FAQPage` (preguntas frecuentes), `Article` (blog), `Product`/`SoftwareApplication` (productos), `HowTo` (guías paso a paso).

```html
<script type="application/ld+json">
{ "@context": "https://schema.org", "@type": "...", "...": "..." }
</script>
```

> **No duplicar:** si el plugin SEO (Yoast/RankMath) ya emite `Organization`/`Article`, no repetirlo a mano — entregar solo el schema que falte (típicamente `FAQPage`/`Product`) e indicar cuál ya está cubierto.
> **Vía de inserción (WordPress/Elementor):** bloque o generador de schema del plugin SEO; o, para JSON-LD a medida, Elementor Pro → Custom Code (ubicación `<head>`) o un plugin de snippets (WPCode). La posición exacta (`<head>` o `<body>`) es indiferente para los motores.
### Señales de autoridad a añadir
- [bio de autor / credenciales] · [fuentes a citar] · [fecha de actualización]
```

No inventar datos ni fuentes para subir la densidad factual: la fabricación destruye la fiabilidad (y los motores penalizan la incoherencia con otras fuentes). No sacrificar la legibilidad humana por la máquina: una página optimizada para GEO sigue siendo para personas. No prometer aparición garantizada en una respuesta de IA: los motores son opacos y cambian; GEO mejora la probabilidad, no la asegura.

---

## Proceso

1. **Determinar el `modo`** y recopilar la info mínima en una sola tanda.
2. **Ejecutar** según el modo. Si se afirma qué cita hoy un motor, verificarlo o marcarlo como "sin verificar".
3. **Escribir un único `.md`** con `Write` (o `Edit` si se optimiza un post existente; `Read` antes).
4. **Confirmar** la ruta y los 3-5 cambios de mayor impacto.

---

## Restricciones

- No fabricar datos, cifras, fuentes ni qué cita hoy un motor; verificar o marcar como hipótesis explícita.
- GEO complementa al SEO, no lo reemplaza: no recomendar sacrificar fundamentos SEO/UX por GEO.
- El schema (modo `audit`) se entrega **siempre** como JSON-LD listo para pegar, nunca solo el nombre del tipo. Avisar de no duplicar con el schema que ya emite el plugin SEO.
- No prometer aparición garantizada en respuestas de IA; los motores son opacos y volátiles.
- Optimizar para la máquina sin romper la legibilidad humana.
- Default de un solo `.md`; formatos extra solo bajo petición.
- Aplican las reglas de output de `_shared/output-rules.md`.
