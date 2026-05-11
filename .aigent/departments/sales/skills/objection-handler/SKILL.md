---
name: "objection-handler"
description: >
  Skill for building a structured objection handling guide for the sales team.
  Always creates a .md file with the most frequent objections, their underlying
  real concern, recommended responses, follow-up questions, and signals to
  distinguish a real objection from a stall.
---

# Skill: Guía de Manejo de Objeciones

**Entregable:** archivo `.md` con la guía completa de objeciones, estructurada por categoría y con respuestas listas para usar en conversaciones de ventas

---

## Cuándo usar esta skill

Cuando el usuario quiera preparar al equipo de ventas para responder con confianza las preguntas difíciles, las dudas de precio o las comparaciones con competidores que aparecen en reuniones y conversaciones con clientes.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Producto / servicio | ¿Qué vendemos? Una línea de descripción es suficiente |
| ICP | ¿A qué tipo de empresa/persona vendemos normalmente? |
| Objeciones conocidas | ¿Cuáles son las 3-5 objeciones que más escucha el equipo? |
| Competidores | ¿Contra quién nos comparan habitualmente? |
| Precio típico | ¿Cuál es el rango de precio del producto? (para contextualizar las respuestas de precio) |
| Casos de éxito disponibles | ¿Hay datos reales o historias de clientes que se puedan usar en las respuestas? |

---

## Plantilla de entregable

```markdown
---
type: "objection-handler"
product: ""
icp: ""
date_created: "YYYY-MM-DD"
status: "draft"
---

# Guía de Manejo de Objeciones — [Producto / Equipo]

**Para:** [SDRs / AEs / Todo el equipo]
**Fecha de creación:** YYYY-MM-DD
**Próxima revisión:** YYYY-MM-DD (recomendada cada 6 meses o tras cambio de oferta/precio)

---

## Cómo usar esta guía

- Leer la objeción y la **preocupación real** detrás de ella antes de responder
- Usar las respuestas sugeridas como guía, no como texto a memorizar palabra por palabra
- Las **preguntas de seguimiento** son tan importantes como la respuesta: convierten la objeción en conversación
- Si la objeción tiene **señal de excusa**, no insistir — cambiar de estrategia o aceptar que no es el momento

---

## Categorías de objeciones

1. [Precio y presupuesto](#precio)
2. [Timing ("ahora no es el momento")](#timing)
3. [Competidores ("ya tenemos X" / "estamos evaluando Y")](#competidores)
4. [Riesgo ("y si no funciona")](#riesgo)
5. [Proceso interno ("necesito consultarlo")](#proceso)
6. [Producto ("nos falta X funcionalidad")](#producto)

---

## 1. Precio y presupuesto {#precio}

### "Es demasiado caro"

**Preocupación real:** No ven suficiente valor para el precio, o no tienen presupuesto aprobado

**Respuesta recomendada:**
> "Entiendo. ¿Puedo preguntarte qué estás comparando para llegar a esa conclusión? ¿Es que el precio supera el presupuesto disponible, o que el valor no justifica la inversión para vuestro caso?"

*(Separar "no tengo presupuesto" de "no lo veo suficientemente valioso" — tienen soluciones distintas)*

**Si es de presupuesto:**
> "¿Cuánto tenéis disponible para esto? Podemos ver si hay una forma de adaptar el alcance para ajustarnos a esa cifra y expandir después."

**Si es de valor:**
> "Tiene sentido querer asegurarse. Si pensamos en [resultado concreto que consiguen], ¿cómo lo estáis cuantificando ahora? Porque en empresas de [perfil similar] eso suele representar [X] al año."

**Preguntas de seguimiento:**
- "¿Con qué lo estáis comparando?"
- "Si el precio no fuera un obstáculo, ¿avanzaríais?"

**Señal de objeción real vs. excusa:**
- Real: pregunta por opciones de pago, preguntan qué incluye exactamente
- Excusa: respuesta vaga sin querer profundizar, no hay interlocutor claro de presupuesto

---

### "No tenemos presupuesto este año"

**Preocupación real:** Presupuesto cerrado, o no han priorizado este gasto

**Respuesta recomendada:**
> "Lo entiendo. ¿Cuándo se abre el próximo ciclo de presupuesto? Me gustaría estar en el proceso desde el principio para que podamos incluirlo."

**Alternativa si hay urgencia:**
> "¿Hay alguna vía de presupuesto no planificado si el ROI está claro? Algunos clientes han conseguido aprobación de gastos excepcionales cuando tenían el ahorro cuantificado. ¿Queréis que trabajemos ese cálculo juntos?"

**Preguntas de seguimiento:**
- "¿Hay decisiones de gasto fuera del presupuesto anual en vuestra empresa?"
- "¿Quién aprueba esos gastos y cuándo?"

---

## 2. Timing {#timing}

### "Ahora no es el momento"

**Preocupación real:** Hay prioridades más urgentes, o no hay un driver claro para actuar ahora

**Respuesta recomendada:**
> "Tiene sentido. ¿Puedo preguntarte qué haría que fuera el momento correcto? ¿Es una cuestión de recursos internos, de otros proyectos en marcha, o de algo más?"

**Si es de prioridad:**
> "Entiendo que hay otras cosas por delante. Solo quiero asegurarme de que si en [X meses] el timing cambia, tengáis toda la información lista para decidir rápido. ¿Puedo dejarte un resumen ejecutivo para ese momento?"

**Preguntas de seguimiento:**
- "¿Cuándo esperáis que el timing mejore?"
- "¿Qué tiene que pasar para que esto sea una prioridad?"

**Señal de objeción real vs. excusa:**
- Real: mencionan un proyecto concreto que bloquea, o una fecha concreta
- Excusa: respuesta genérica, no pueden identificar qué cambiaría la situación

---

### "Necesito ver más resultados / Volver en 6 meses"

**Respuesta recomendada:**
> "Aprecio la honestidad. ¿Qué resultados concretos o evidencias te harían sentir cómodo avanzando? Así puedo darte lo que realmente necesitas, no lo que creo que necesitas."

---

## 3. Competidores {#competidores}

### "Ya tenemos [herramienta X]"

**Preocupación real:** No ven suficiente diferencia para justificar el cambio o la inversión adicional

**Respuesta recomendada:**
> "Tiene sentido. ¿Puedo preguntarte cómo está funcionando X para vosotros ahora mismo? ¿Hay algo que no esté cubriendo bien?"

*(No atacar al competidor directamente. Buscar la brecha que el competidor no cubre.)*

**Si están satisfechos con el competidor:**
> "Me alegra que esté funcionando. Si en algún momento [situación donde vuestro producto gana], estaré aquí. ¿Cuándo os lo revisa el contrato con ellos?"

**Preguntas de seguimiento:**
- "¿Qué es lo que X hace especialmente bien para vosotros?"
- "¿Hay algo que quisiérais que hiciera y no hace?"

---

### "Estamos evaluando [competidor Y]"

**Respuesta recomendada:**
> "Bien. ¿Cuáles son los criterios principales que estáis usando para decidir? Quiero asegurarme de que en nuestra evaluación tengáis la información que realmente importa para esos criterios."

**Preguntas de seguimiento:**
- "¿Cuándo esperáis tomar la decisión?"
- "¿Cuántas opciones estáis evaluando?"
- "¿Hay algún criterio en el que Y esté por delante según lo que habéis visto?"

---

## 4. Riesgo {#riesgo}

### "¿Y si no funciona para nuestro caso?"

**Preocupación real:** Miedo al fracaso de implementación, a desperdiciar tiempo y dinero

**Respuesta recomendada:**
> "Es una pregunta justa. ¿Qué significaría 'que no funcione' para vosotros? Porque dependiendo de lo que estéis cubriendo, puedo mostraros qué garantías tenemos y cómo lo hemos resuelto en casos similares."

**Preguntas de seguimiento:**
- "¿Habéis tenido malas experiencias con implementaciones similares antes?"
- "¿Qué necesitaríais ver para sentiros seguros?"

**Recurso de cierre:**
- Ofrecer referencia de cliente en sector similar
- Proponer un piloto o prueba acotada antes del compromiso completo

---

## 5. Proceso interno {#proceso}

### "Necesito consultarlo con mi equipo / director / comité"

**Preocupación real:** No es el único decisor, o no se siente con suficiente información para defender la decisión internamente

**Respuesta recomendada:**
> "Por supuesto. Para que esa conversación sea lo más fácil posible, ¿qué necesitarías tener preparado? ¿Hay alguien más a quien debería presentarle esto directamente?"

**Preguntas de seguimiento:**
- "¿Cuándo pensáis tener esa conversación?"
- "¿Cuál suele ser el proceso de decisión para este tipo de inversión?"
- "¿Qué objeciones crees que surgirán internamente? Puedo ayudarte a prepararlas."

---

## 6. Producto {#producto}

### "Nos falta [funcionalidad X]"

**Preocupación real:** Hay un requisito específico que no creen que cubramos

**Respuesta recomendada:**
> "Gracias por ser directo. ¿Puedo preguntarte qué workflow concreto necesita esa funcionalidad? Quiero entender si es algo que ya resolvemos de otra forma o si realmente hay una brecha."

**Si la funcionalidad existe:**
> "Déjame enseñarte cómo lo hacemos — creo que puede que no lo hayamos mostrado en el contexto correcto."

**Si la funcionalidad no existe:**
> "Eso es algo que tenemos en el roadmap para [fecha estimada]. ¿Es un bloqueador absoluto o algo que podéis gestionar de forma alternativa hasta entonces?"

**Señal de objeción real vs. excusa:**
- Real: pueden describir exactamente para qué necesitan esa funcionalidad
- Excusa: no saben realmente para qué la usarían si la tuvieran

---

## Plantilla de nueva objeción

Cuando el equipo detecte una objeción nueva, añadir con este formato:

```
### "[Texto de la objeción]"

**Preocupación real:** 

**Respuesta recomendada:**
> 

**Preguntas de seguimiento:**
- 
- 

**Señal de objeción real vs. excusa:**
- Real: 
- Excusa: 
```

---

## Principios de manejo de objeciones

1. **Escuchar completo** antes de responder — nunca interrumpir
2. **Separar el tipo de objeción** (precio, timing, competencia, riesgo) antes de responder
3. **Preguntar antes de argumentar** — la respuesta puede cambiar con más contexto
4. **Nunca atacar al competidor** — criticar a la competencia reduce la credibilidad propia
5. **La objeción es interés** — alguien que no tiene interés no objeta, simplemente no responde
6. **Identificar excusas vs. objeciones reales** — las excusas no se resuelven con más argumentos
```

---

## Proceso

1. **Recopilar las objeciones más frecuentes** del equipo: preguntar a los reps cuáles escuchan más
2. **Identificar la preocupación real** detrás de cada objeción: no siempre es lo que parece
3. **Escribir respuestas que abran conversación**, no que cierren con argumentos
4. **Incluir señales de "excusa vs. objeción real"** — es la parte más valiosa y más difícil de la guía
5. **Marcar con `[DATO REAL NECESARIO]`** donde hace falta un caso de éxito o dato interno concreto
6. **Guardar el archivo** en `<proyecto>/sales/enablement/objection-handler-<fecha>.md`
7. **Recordar al usuario** que la guía debe revisarse cada 6 meses o tras cambios de precio/producto

---

## Restricciones

- No criticar a la competencia directamente: las respuestas que descalifican rivales reducen la credibilidad propia.
- No prometer descuentos, condiciones o funcionalidades sin validación interna previa — la guía propone marcos, no compromisos.
- Si una respuesta requiere casos reales, datos internos o testimonios, marcarlo con `[DATO REAL NECESARIO]` y no inventar.
- Diferenciar siempre objeción real de excusa: la guía sin esa señal es solo argumentos.
- Aplican las reglas de output de `_shared/output-rules.md`.
