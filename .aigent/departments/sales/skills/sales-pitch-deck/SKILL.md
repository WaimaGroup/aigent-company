---
name: "sales-pitch-deck"
user-invocable: true
description: >
  Skill for creating a sales pitch deck outline and presenter script, slide by slide.
  Always creates a .md file with each slide's content, key message, and what the rep
  should say. Designed for live demos or client-facing presentations.
---

# Skill: Pitch Deck de Ventas

**Entregable:** archivo `.md` con el guión slide a slide del pitch deck, listo para usar como script de presentación o como brief para diseño

---

## Cuándo usar esta skill

Cuando el usuario necesite crear o estructurar una presentación de ventas para demos, reuniones de descubrimiento avanzado, presentaciones a comités de compra o cualquier contexto donde el rep presente en vivo ante el cliente.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Audiencia | ¿Quiénes estarán en la sala? (roles, nivel de seniority, técnico vs. negocio) |
| Duración | ¿Cuánto tiempo tiene el rep para presentar? (sin contar Q&A) |
| Objetivo de la reunión | ¿Qué queremos conseguir al terminar? (avanzar a propuesta, cerrar, etc.) |
| Contexto del cliente | ¿Ya conocen el producto o es una primera presentación? |
| Pain point principal | ¿Cuál es el problema que más resuena en este cliente? |
| Diferenciadores clave | ¿Qué hace diferente a nuestra empresa/producto para este caso? |
| ¿Hay demo en vivo? | ¿El rep va a mostrar el producto durante la presentación? |

---

## Plantilla de entregable

```markdown
---
type: "pitch-deck"
audience: ""
duration_min: 0
objective: ""
date_created: "YYYY-MM-DD"
status: "draft"
---

# Pitch Deck — [Nombre del Producto / Campaña]

**Audiencia:** [roles y perfil]
**Duración:** [X minutos] | **Slides:** [N]
**Objetivo de la reunión:** [qué debe pasar al terminar]

---

## Estructura del deck

| # | Slide | Propósito | Duración estimada |
|---|---|---|---|
| 1 | Apertura + agenda | Crear confianza, marcar las reglas | 2 min |
| 2 | Contexto del cliente (el problema) | Demostrar que los entendemos | 3 min |
| 3 | Por qué ahora (urgencia) | El coste de no actuar | 2 min |
| 4 | Nuestra solución (overview) | La propuesta de valor de 1 minuto | 2 min |
| 5 | Cómo funciona (demo flow) | Mostrar, no solo contar | 8-10 min |
| 6 | Prueba social (resultados) | Credibilidad con datos reales | 2 min |
| 7 | Diferenciadores clave | Por qué nosotros sobre los demás | 2 min |
| 8 | Próximos pasos | Cierre de reunión con compromiso | 2 min |

---

## Slide 1 — Apertura y agenda

**Mensaje clave:** "Vamos a hablar de vuestro contexto, no de nuestro catálogo"

**Contenido de la slide:**
- Logo + nombre del rep
- Agenda de la sesión (3-4 puntos)
- Tiempo previsto

**Script del rep:**
> "Gracias por el tiempo. Antes de empezar, quería confirmar que tenemos [X minutos] — ¿es correcto?
>
> Mi idea es hacer esto en tres partes: primero entender dónde estáis ahora, luego mostraros cómo funciona [producto] en un caso como el vuestro, y al final decidir si tiene sentido avanzar juntos. ¿Os parece bien ese orden?"

**Nota:** Empezar pidiendo permiso para la agenda genera compromiso implícito y reduce resistencia.

---

## Slide 2 — El problema (espejo del cliente)

**Mensaje clave:** "Sabemos lo que estáis viviendo"

**Contenido de la slide:**
- Título: "Lo que nos contasteis / Lo que vemos en empresas como la vuestra"
- 3-4 bullets con los pain points específicos del cliente (de notas de discovery)
- Dato o estadística del sector que amplifique el problema

**Script del rep:**
> "Basándome en lo que hablamos [en nuestra llamada anterior / con [nombre de contacto]], tengo entendido que los principales retos que estáis afrontando son:
>
> [Leer los bullets adaptados al cliente, no al genérico]
>
> ¿Sigo capturando bien la situación o hay algo que quieras matizar?"

**Nota:** Siempre confirmar antes de seguir. Si el rep dice algo inexacto, el cliente lo corregirá y eso reabre el discovery.

---

## Slide 3 — El coste de no actuar

**Mensaje clave:** "No hacer nada también tiene un precio"

**Contenido de la slide:**
- Impacto cuantificado del problema: tiempo perdido, coste, riesgo
- Dato concreto: benchmark del sector o cálculo para su tamaño de empresa

**Script del rep:**
> "Lo que vemos en empresas de [perfil similar] es que este problema les cuesta aproximadamente [X: tiempo, dinero, oportunidad]. En vuestro caso, con [tamaño / volumen], eso podría representar [cálculo aproximado].
>
> El punto no es asustar — es que cuando sumamos el coste de seguir igual, la conversación de inversión cambia."

---

## Slide 4 — Nuestra solución (overview de 60 segundos)

**Mensaje clave:** "Lo que hacemos, en una línea"

**Contenido de la slide:**
- Nombre del producto + tagline
- 3 beneficios clave (no funcionalidades) alineados con los pains del cliente
- Logotipo de 3-5 clientes conocidos (si los hay)

**Script del rep:**
> "[Producto] es [categoría de solución] que permite a [tipo de empresa] [resultado principal].
>
> Los tres resultados que más valoran nuestros clientes son: [beneficio 1], [beneficio 2] y [beneficio 3].
>
> Ahora os lo muestro funcionando."

---

## Slide 5 — Demo / Cómo funciona

**Mensaje clave:** "Ver para creer"

**Contenido de la slide:**
- Esta slide puede ser una pantalla en blanco con el logo mientras el rep cambia a la demo
- O un "mapa de la demo": qué va a ver el cliente en los próximos minutos

**Script del rep:**
> "Voy a mostraros [X y Y], que son los dos flujos más relevantes para vuestro caso. Me centro en eso y dejamos el resto para preguntas."

**Estructura de la demo:**
1. **Situación de partida:** [cómo llega el usuario a la herramienta, desde el problema]
2. **Acción clave 1:** [mostrar la funcionalidad más impactante — la que resuelve el pain principal]
3. **Resultado visible:** [qué ve el cliente inmediatamente, qué ha cambiado]
4. **Acción clave 2:** [segunda funcionalidad relevante]
5. **Cierre de demo:** [resultado global — dashboard, reporte, métrica mejorada]

**Nota:** No mostrar todo el producto. Solo lo que resuelve el problema que han confirmado tener.

---

## Slide 6 — Prueba social

**Mensaje clave:** "No somos los únicos que lo decimos"

**Contenido de la slide:**
- 1-2 casos de éxito concretos (empresa similar + resultado cuantificado)
- Cita de cliente si está disponible
- Logos de clientes reconocibles en el sector (si los hay)

**Script del rep:**
> "[Empresa similar] tenía [problema parecido]. En [X semanas/meses] de uso consiguieron [resultado concreto].
>
> [Si hay más tiempo] ¿Queréis que os conecte con su responsable de [área]? Pueden contaros de primera mano cómo ha sido el proceso."

**Nota:** Ofrecer referencias en vivo es una de las herramientas de cierre más potentes.

---

## Slide 7 — Por qué nosotros

**Mensaje clave:** "Aquí está la diferencia que importa para vuestro caso"

**Contenido de la slide:**
- 3 diferenciadores clave vs. alternativas — específicos para el cliente, no genéricos
- Tabla "Nosotros vs. [alternativa principal]" si hay competidor conocido en la evaluación

**Script del rep:**
> "Si estáis evaluando opciones, las preguntas que suelen marcar la diferencia son [X, Y, Z]. En esas tres, aquí está dónde estamos:
>
> [Explicar cada diferenciador en 1 frase]"

---

## Slide 8 — Próximos pasos

**Mensaje clave:** "¿Cómo avanzamos desde aquí?"

**Contenido de la slide:**
- 3 opciones concretas de siguiente paso (no "cuéntanos si hay interés")
- Timeline estimado

**Script del rep:**
> "Basándome en todo lo que hemos visto, hay tres caminos posibles desde aquí:
>
> 1. Si tiene sentido, podemos prepararos una propuesta con el alcance y el precio esta semana.
> 2. Si queréis involucrar a [otro stakeholder], puedo preparar una versión más corta para ellos.
> 3. Si hay dudas técnicas, podemos agendar una sesión con nuestro equipo de implementación.
>
> ¿Cuál tiene más sentido para vosotros ahora mismo?"

---

## Checklist antes de usar el deck

- [ ] Los pain points del slide 2 están personalizados para este cliente concreto (no son genéricos)
- [ ] El demo flow cubre solo las funcionalidades relevantes para sus pains
- [ ] La prueba social es de empresas del mismo sector o tamaño que el cliente
- [ ] Los diferenciadores del slide 7 responden a la competencia que el cliente está evaluando
- [ ] El slide 8 tiene 3 opciones de siguiente paso concretas y no genéricas
```

---

## Proceso

1. **Recopilar las notas de discovery** antes de escribir ningún slide: qué dijo el cliente, qué pain confirmó, quiénes estarán en la reunión
2. **Diseñar la estructura** (tabla de slides) antes de escribir los scripts individuales
3. **Personalizar el slide 2** (el problema) con los pains exactos del cliente — es el slide más importante
4. **Definir el flujo de demo** antes del día: qué mostrar, en qué orden, qué no mostrar
5. **Escribir los scripts** como guías, no como textos a memorizar
6. **Guardar el archivo** en `<proyecto>/sales/decks/<nombre-cliente>-pitch-<fecha>.md`
7. **Informar al usuario** de la ruta y recordar personalizar el slide 2 y 7 antes de cada reunión

---

## Restricciones

- No usar pitch genérico de producto: el slide 2 (problema) tiene que estar adaptado al cliente concreto, no al ICP en abstracto.
- No mostrar funcionalidades del producto que no resuelven los pains confirmados del cliente: la demo se acota.
- No incluir prueba social inventada o de empresas que no se pueden mencionar; si no hay caso público, marcar `[CASO REAL NECESARIO]`.
- Cerrar siempre con tres opciones concretas de siguiente paso, no con "cuéntanos si tenéis dudas".
- Aplican las reglas de output de `_shared/output-rules.md`.
