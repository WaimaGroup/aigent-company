---
name: "brand-voice-guide"
description: >
  Skill for producing a brand voice guide: tone attributes, vocabulary do/don't,
  examples of correct/incorrect content per channel, and writing principles. Used
  by marketing-content as the canonical reference to keep tone consistent across
  all outputs (posts, emails, ads, social, web). Living document with versioning.
---

# Skill: Brand Voice Guide

**Entregable:** archivo `.md` con la guía de voz de marca canónica, listo para uso recurrente por cualquier writer/agent que produzca contenido de marca. Vive en `<proyecto>/marketing/strategy/brand-voice-guide.md`.

---

## Cuándo usar esta skill

- Es la primera vez que se codifica la voz de marca de la empresa/producto.
- Hay que actualizar la guía existente porque cambió el posicionamiento o el target.
- Se detecta drift de tono entre piezas de content y conviene volver al canon.
- Se onboarda a un nuevo writer/agencia/freelance y necesita la referencia.

**Cuándo NO usar:**

- Para un copy concreto (eso es trabajo de `blog-post`, `email-campaign`, `ad-copy`, etc.). Esta skill produce el canon, no las piezas.
- Para identidad visual / brand book completo (logos, colores, tipografía visual — eso es trabajo de design coordinado con marketing).
- Para tone of voice de un canal único (LinkedIn vs Instagram). Estas adaptaciones viven dentro de esta guía como sección por canal, no como skills separadas.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Empresa / producto | ¿Cuál es el nombre, qué hace, en una frase? |
| Posicionamiento | ¿Cuál es el posicionamiento vigente? (statement de positioning) |
| Audiencia objetivo | ¿A quién hablamos? (persona / segmento principal) |
| Valores de marca | ¿3-5 valores que guían la marca? |
| Personalidad | ¿Si la marca fuera una persona, cómo sería? (formal/cercano, serio/divertido, expert/peer) |
| Referencias inspiradoras | ¿Qué otras marcas tienen un tono que admiras? ¿Y cuáles NO? |
| Canales activos | ¿Dónde publicamos? (blog, LinkedIn, Instagram, X, email, web, ads) |
| Idiomas | ¿Español, inglés, ambos? ¿Algún matiz local? |
| Histórico | ¿Hay guía previa o partimos de cero? |

---

## Plantilla del entregable

Nombre del archivo: `brand-voice-guide.md` (un solo documento canónico por proyecto, versionado internamente).

```markdown
---
type: "brand-voice-guide"
company: "<Empresa>"
product: "<Producto>"
version: "<vX.Y>"
status: "draft | approved | in-use"
effective_date: "YYYY-MM-DD"
last_review: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<rol/persona>"
languages: ["es", "en"]
---

# Brand Voice Guide — <Empresa> · v<X.Y>

> **Vigente desde <fecha>.** Esta es la fuente de verdad del tono y voz de la marca. Cualquier output de content que se aleje de esta guía debe justificarse o devolverse para reescritura.

## 0. Resumen — la voz en 30 segundos

> 4-6 líneas que capturan la esencia. Para uso rápido por writers nuevos.

**Somos:** <3-4 adjetivos clave que definen el tono>

**No somos:** <3-4 adjetivos que rechazamos explícitamente>

**Hablamos a:** <persona en una línea>

**Para:** <misión / motivo de la comunicación, una línea>

---

## 1. Atributos de tono

> 4-6 atributos canónicos. Cada uno con definición operativa + ejemplos.

### Atributo 1 — <ej. "Cercano sin ser informal">

**Qué significa:** <2-3 líneas: cómo se manifiesta en el texto>

**Cómo se ve:**
- ✅ "Te ayudamos a entender qué pasó con tu suscripción." *(directo, segunda persona, sin jerga)*
- ❌ "El cliente puede consultar las incidencias en su perfil de usuario." *(distante, tercera persona, formal)*

### Atributo 2 — <ej. "Experto pero no condescendiente">

(misma estructura)

### Atributo 3 — <ej. "Honesto sobre limitaciones">

(misma estructura)

### Atributo 4 — <ej. "Optimista basado en datos">

(misma estructura)

---

## 2. Personalidad — si fuéramos una persona

> Útil para que un writer "encarne" la marca al escribir.

- **Edad / generación:** <ej. 35 años, trabaja desde hace tiempo en el sector>
- **Profesión / rol:** <ej. mentor con experiencia que ha visto fallar varias veces>
- **Cómo se comporta en una conversación:** <ej. escucha primero, da contexto, no presume>
- **Qué nunca diría:** <listado de frases o tonos que la marca rechaza>
- **Qué siempre transmite:** <listado>

---

## 3. Vocabulario — Do / Don't

> Lista práctica que el writer puede consultar mientras escribe.

### Palabras y expresiones que usamos

| Usamos | En lugar de | Por qué |
|---|---|---|
| <ej. "ayudamos"> | <ej. "facilitamos soluciones"> | <más directo, menos corporate> |
| <ej. "problema"> | <ej. "issue", "incidencia"> | <usa el idioma del usuario> |
| <ej. "rápido"> | <ej. "ágil", "agilizar"> | <evitar buzzwords> |

### Palabras / expresiones prohibidas

- ❌ "Sinérgico", "disruptivo", "revolucionario" *(buzzwords vacíos)*
- ❌ "Nosotros somos líderes en…" *(autoelogio sin respaldo)*
- ❌ "Empoderar al cliente" *(corporate-speak)*
- ❌ <listado completo según la marca>

### Términos técnicos — cuándo y cómo

- ✅ Términos del dominio del usuario (si vendes a ingenieros, hablas en técnico).
- ❌ Términos internos de la empresa que el usuario no usa.
- 📖 Glosario de términos que sí usamos y los definimos cuando aparecen por primera vez: <listado>

---

## 4. Estructura — cómo construimos textos

### Reglas generales

- **Frases cortas** (máx. 20 palabras en promedio). Las largas reservadas para puntos clave.
- **Voz activa** (95% del tiempo).
- **Segunda persona ("tú" / "tu equipo")** salvo casos formales (legal, anuncios oficiales).
- **Bullets cuando hay 3+ ítems**; prosa cuando es 1-2.
- **Negritas para escaneo**, no para énfasis emocional.

### Estructura de un texto típico

```
Hook (1-2 líneas) → Contexto (3-5 líneas) → Punto principal (1-2 párrafos) → CTA o cierre claro
```

### Lo que SÍ hacemos

- Empezar por el problema del usuario, no por nosotros.
- Citar datos cuando los hay.
- Reconocer límites: "esto funciona para X, no para Y".

### Lo que NO hacemos

- Empezar con "En <Empresa>, somos…".
- Inventar estadísticas o cifras sin fuente.
- Cerrar con "¡Empieza ya tu prueba gratuita!" (overselling).

---

## 5. Adaptación por canal

> La voz es **una sola**; el formato y el registro varían por canal.

### Blog y artículos

- Longitud: 800-2.500 palabras según objetivo.
- Tono: didáctico pero conversacional.
- Headings descriptivos (no clickbait).
- CTA al final, no en mitad del cuerpo.

### Email

- Asunto: claro, sin clickbait. <30-50 caracteres>.
- Cuerpo: breve (150-300 palabras para promocional, más largo para nurturing).
- Un único CTA principal.
- Saludo: <"Hola <nombre>" o "Hi <name>"> según idioma; despedida humana, no "El equipo de <Empresa>".

### LinkedIn

- Tono: profesional pero accesible.
- Gancho en las primeras 2 líneas (es lo que se ve sin "ver más").
- Sin hashtags excesivos (3-5 relevantes).
- Sin enlaces en el primer comentario *(o sí, según política de LinkedIn vigente)*.

### Instagram

- Tono: más visual, más humano.
- Texto que acompaña al visual; el visual es el protagonista.
- Storytelling corto.

### X (Twitter)

- Hilo si la idea no cabe en un post.
- Tono directo, conciso, opinable.

### Anuncios (Google / Meta / LinkedIn Ads)

- Headlines: directos, beneficio claro, dentro del límite de caracteres.
- Sin clickbait, sin promesas exageradas.

### Web — Home / Landing

- Hero: propuesta de valor en una frase, sin jerga.
- Bullets con beneficios (qué consigue el usuario), no features (qué hacemos).
- Tono más persuasivo pero sin overselling.

### Comunicación interna / al cliente (soporte, status updates)

- Más empático.
- Reconocer el problema antes de explicar.
- Acción concreta + plazo.

---

## 6. Ejemplos completos por canal

> Una pieza ejemplar por canal, con anotaciones.

### Ejemplo: post de blog

<Insertar primera párrafo o el lead de un blog post real que represente la voz, con anotaciones de por qué funciona.>

### Ejemplo: email promocional

<Insertar email completo con anotaciones.>

### Ejemplo: post LinkedIn

<Insertar copy LinkedIn con anotaciones.>

(repetir por cada canal activo)

---

## 7. Tono según situación

> La voz se mantiene, pero el "registro emocional" cambia.

| Situación | Registro | Ejemplo |
|---|---|---|
| Lanzamiento de feature | Entusiasta + claro | <ejemplo> |
| Incidencia / outage | Empático + transparente | <ejemplo> |
| Anuncio de cambio de precio | Honesto + justificado | <ejemplo> |
| Email de bienvenida | Acogedor + breve | <ejemplo> |
| Cancelación / churn | Respetuoso + sin presión | <ejemplo> |

---

## 8. Adaptación por idioma

> Si la marca opera en varios idiomas, cada uno tiene matices locales.

### Español

- Variante: <España / Latam neutro / país específico>
- Formalidad: <"tú" universal / "vos" en algunos países>
- Términos a evitar (regionalismos): <listado>

### Inglés

- Variante: <US / UK / international>
- Spelling: <US: color, optimize / UK: colour, optimise>
- Términos a evitar: <listado>

---

## 9. Cómo se usa esta guía

- **Antes de redactar:** writer lee al menos el resumen (sección 0) y los atributos (sección 1).
- **Durante:** consulta vocabulario (sección 3) y la adaptación de canal (sección 5).
- **Tras redactar:** auto-check contra los Do/Don't y los ejemplos.
- **Si un texto se desvía:** justificar en la review o reescribir.

---

## 10. Histórico de versiones

| Versión | Fecha | Cambios principales |
|---|---|---|
| <vX.Y> | <YYYY-MM-DD> | <cambios> |
| <vX.Y-1> | <YYYY-MM-DD> | <cambios> |
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin posicionamiento ni audiencia clara, parar.
2. **Definir 4-6 atributos de tono.** No 10 — saturar pierde foco. Cada atributo con definición operativa + Do/Don't.
3. **Personificar la marca** (sección 2). Útil pedagógicamente para writers nuevos.
4. **Construir el Do/Don't de vocabulario** (sección 3). Esta es la sección más consultada en el día a día — invertir tiempo aquí.
5. **Reglas de estructura** consistentes con los atributos. Si declaramos "directo", las frases largas son inconsistencia.
6. **Adaptación por canal con ejemplos reales** del producto/empresa, no copy genérico.
7. **Ejemplos completos** (sección 6) — la mejor pedagogía. Anotar por qué funciona cada elemento.
8. **Validar coherencia interna:** si un atributo dice "honesto sobre limitaciones" y la sección de ejemplos no muestra ningún ejemplo de admitir limitación, hay drift.
9. **Marcar `[COMPLETAR]`** lo que requiere validación de leadership o ejemplos reales del producto.
10. **Guardar** en `<proyecto>/marketing/strategy/brand-voice-guide.md` (típicamente vive ahí; un solo documento canónico, versionado internamente).
11. **Reportar** al usuario: ruta, atributos definidos, próxima revisión recomendada.

---

## Restricciones

- **No copies brand voice de otras empresas.** El tono es uno de los pocos diferenciadores reales — clonar es perderlo.
- **No declares atributos sin ejemplos.** "Somos cercanos" sin Do/Don't es decorativo.
- **No omitas la prohibición explícita.** Las marcas más fuertes saben qué *no* dicen tanto como qué dicen.
- **No mezcles brand voice con visual identity.** Esta guía es texto. Logos/colores son brand book aparte.
- **No olvides la sección "Cómo se usa".** Una guía que no se sabe consultar termina en el cajón.
- **No congelas la guía.** El producto evoluciona, el público evoluciona, la guía se revisa anualmente.
- **No metas todos los canales si la marca no está en todos.** Mejor 3 canales bien tratados que 10 superficial.
- Aplican las reglas de output de `_shared/output-rules.md`.
