---
name: "outreach-sequence"
description: >
  Skill for designing a multi-step cold outreach sequence (email and/or LinkedIn).
  Always creates a .md file with each touchpoint scripted, including timing, channel,
  subject lines, and personalization placeholders ready to use or adapt per prospect.
---

# Skill: Secuencia de Outreach

**Entregable:** archivo `.md` con la cadencia completa paso a paso, con scripts listos para usar y variables de personalización marcadas

---

## Cuándo usar esta skill

Cuando el usuario necesite diseñar una secuencia de primer contacto para prospectar un segmento concreto: emails fríos, mensajes de LinkedIn, o una combinación de ambos canales en una cadencia de varios pasos.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| ICP objetivo | ¿A qué perfil de persona nos dirigimos? (cargo, industria, tamaño de empresa) |
| Hipótesis de valor | ¿Qué problema concreto creemos que tiene esta persona? |
| Canal | ¿Email, LinkedIn, o ambos en secuencia? |
| Número de pasos | ¿Cuántos touchpoints quieres? (recomendación: 4-6) |
| Tono | ¿Cómo queremos sonar? (directo, consultivo, casual, formal) |
| CTA del primer mensaje | ¿Qué pedimos en el primer contacto? (llamada de 15 min, respuesta, recurso gratuito) |
| Diferenciador clave | ¿Qué hace diferente a nuestra empresa/producto? |

---

## Plantilla de entregable

```markdown
---
type: "outreach-sequence"
icp: ""
channel: "email | linkedin | email+linkedin"
total_steps: 0
date_created: "YYYY-MM-DD"
status: "draft"
---

# Secuencia de Outreach — [Nombre del Segmento / Campaña]

**ICP objetivo:** [descripción de 1 línea]
**Hipótesis de valor:** [el dolor que asumimos que tienen]
**Canal:** [Email / LinkedIn / Email + LinkedIn]
**Duración total:** [X días]

---

## Paso 1 — [Canal] | Día 1 | Primer contacto

**Objetivo:** despertar curiosidad, no vender
**Tipo de mensaje:** personalizado con señal de contexto

**Asunto (si email):** `[Asunto A]` / `[Asunto B (variante A/B)]`

---

Hola {{nombre}},

[Apertura de 1 línea con señal de personalización real: evento, noticia, publicación reciente, cambio en la empresa — nada genérico]

[Frase de hipótesis de valor: "Muchas empresas como {{empresa}} en [sector] están lidiando con [problema concreto]." No afirmar, sino hipotetizar.]

[Propuesta de valor en 1-2 líneas: qué hacemos y el resultado que conseguimos para empresas similares, con dato concreto si es posible]

¿Tiene sentido explorar si podría aplicarse a vuestro caso?

[Nombre]
[Cargo] | [Empresa]

---

**Notas de personalización:**
- `{{señal}}` → buscar en LinkedIn, noticias o web de la empresa antes de enviar
- El asunto no debe mencionar el nombre de la empresa (reduce apertura)

---

## Paso 2 — [Canal] | Día 3-4 | Follow-up ligero

**Objetivo:** mantenerse visible sin presionar
**Tipo de mensaje:** muy corto, reencuadre desde otro ángulo

---

Hola {{nombre}},

Te escribí hace unos días sobre [tema]. Entiendo que la bandeja de entrada se llena rápido.

Solo quería añadir un ángulo diferente: [nuevo beneficio o caso de uso que no mencionaste en el paso 1].

¿Es esto relevante para vosotros ahora mismo?

[Nombre]

---

## Paso 3 — [Canal] | Día 7-8 | Recurso de valor

**Objetivo:** aportar valor antes de pedir nada
**Tipo de mensaje:** compartir algo útil sin pedir respuesta obligada

---

Hola {{nombre}},

Antes de dejar de escribirte, te comparto [recurso: caso de estudio, artículo, dato relevante del sector] que creo que puede interesarte aunque no trabajemos juntos.

[1-2 frases sobre qué contiene y por qué es relevante para su contexto]

Si en algún momento quieres explorar cómo lo hacemos con [tipo de empresa similar], con gusto lo hablamos.

[Nombre]

---

## Paso 4 — [Canal] | Día 12-14 | Breakup

**Objetivo:** cierre limpio que deja la puerta abierta
**Tipo de mensaje:** directo, sin victimismo, deja opción de respuesta

---

Hola {{nombre}},

Último intento de contacto por mi parte — no quiero ser una molestia.

Si el timing no es el adecuado ahora, no hay problema. Si en algún momento [situación que haría relevante el contacto], encantado de retomarlo.

¿Hay alguien más en el equipo con quien tenga más sentido hablar?

[Nombre]

---

## Resumen de la cadencia

| Paso | Día | Canal | Objetivo | Longitud |
|---|---|---|---|---|
| 1 | 1 | [canal] | Primer contacto con señal | Corto (150-200 palabras) |
| 2 | 3-4 | [canal] | Follow-up ligero | Muy corto (50-80 palabras) |
| 3 | 7-8 | [canal] | Recurso de valor | Medio (100-150 palabras) |
| 4 | 12-14 | [canal] | Breakup | Muy corto (50-80 palabras) |

---

## Variables a personalizar antes de enviar

- `{{nombre}}` — nombre de pila del contacto
- `{{empresa}}` — nombre de la empresa
- `{{señal}}` — dato concreto de personalización (noticia, publicación, evento)
- `[recurso]` — el caso de estudio, artículo o dato a compartir en el paso 3

---

## Notas de uso

- **No enviar el paso 2 si hay respuesta al paso 1**, por obvio que parezca
- El asunto del paso 2 puede ser reply del asunto del paso 1 (Re: [asunto original]) para aumentar apertura
- En LinkedIn: el paso 1 puede ser una solicitud de conexión con nota breve; los siguientes pasos, mensajes directos
```

---

## Proceso

1. **Definir la hipótesis de valor** antes de escribir ningún mensaje: ¿qué problema específico tiene esta persona?
2. **Diseñar la cadencia completa** (todos los pasos) antes de escribir los mensajes individuales: canal, timing, objetivo de cada touchpoint
3. **Escribir de lo más personalizado a lo más genérico**: el paso 1 es el más personalizado; el breakup puede ser casi idéntico para todos
4. **Incluir variantes A/B** en el asunto del paso 1 para testing
5. **Marcar variables**: todo lo que debe personalizarse por prospecto va en `{{doble llave}}`
6. **Guardar el archivo** en `<proyecto>/sales/outreach/<nombre-segmento>-sequence-<fecha>.md`
7. **Informar al usuario** de la ruta y recordar qué variables hay que personalizar antes de enviar

---

## Principios de redacción para outreach

- **Primera línea = gancho personal:** la primera frase decide si se lee el resto
- **Mensajes cortos:** el primer email no debería pasar de 150-200 palabras
- **Una sola CTA:** no pedir dos cosas a la vez
- **Hipótesis, no afirmaciones:** "creo que podéis estar lidiando con X" en lugar de "sé que tenéis el problema X"
- **Sin attachments en primer contacto:** los filtros de spam y la desconfianza lo penalizan
- **Nunca "solo quería saber si...":** frase que mata cualquier mensaje

---

## Restricciones

- No prometer resultados específicos ni cifras de ROI no validadas en mensajes de primer contacto.
- No usar tokens de personalización sin contenido real (`{{empresa}}` enviado literalmente es peor que un mensaje sin token).
- No incluir attachments en el primer mensaje: los filtros de spam y la desconfianza lo penalizan.
- No alargar la cadencia más allá de 5-6 pasos: insistir más allá del breakup degrada la marca.
- Marcar con `{{doble llave}}` todas las variables que el rep debe personalizar antes de enviar.
- Aplican las reglas de output de `_shared/output-rules.md`.
