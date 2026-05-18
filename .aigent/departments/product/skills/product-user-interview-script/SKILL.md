---
name: "product-user-interview-script"
user-invocable: true
description: >
  Skill for writing a user interview script with warm-up, open exploratory
  questions, problem deep-dive, behavior probes (no leading questions), and a
  close section. Includes interviewer guidance and a debrief template.
---

# Skill: User Interview Script

**Entregable:** archivo `.md` con el script completo, listo para usar en una sesión, guardado en `<proyecto>/product/discovery/interviews/<tema-slug>-script.md`.

---

## Cuándo usar esta skill

- Hay que conducir entrevistas de usuario (exploratorias, de validación de problema o de validación de solución) y se necesita un script reproducible entre entrevistadores.
- Se va a entrevistar a 5-20 personas sobre el mismo tema y se quiere asegurar comparabilidad.
- El entrevistador no es especialista en discovery y necesita guía de cómo conducir.

**Cuándo NO usar:**

- Para encuestas cuantitativas (eso es otro formato — survey con métricas).
- Para tests de usabilidad (eso es testing de UI, no de problema).
- Para entrevistas con candidatos (eso es `hr-recruitment` con interview kit).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Objetivo | ¿Qué hipótesis o pregunta resuelve esta entrevista? |
| Fase de discovery | ¿Exploratoria (entender un dominio), validación de problema, o validación de solución? |
| Segmento | ¿A quién entrevistamos exactamente? (criterios de screening) |
| Duración | ¿Cuánto durará la sesión? (típicamente 30-45 min, máximo 60) |
| Formato | ¿Presencial / videollamada / asíncrona? ¿Se graba? |
| Incentivo | ¿Hay incentivo para el entrevistado? (tarjeta regalo, créditos del producto, donación) |
| Idioma | ¿Idioma de la entrevista? |
| Entrevistador | ¿Quién la conduce? ¿Hay nota tomador separado? |
| Background asumido | ¿Qué se asume que el entrevistado conoce de la empresa/producto? |

---

## Plantilla del entregable

```markdown
---
type: "interview-script"
topic: "<Tema en una línea>"
phase: "exploratory | problem-validation | solution-validation"
segment: "<Descripción del segmento>"
duration: "<min>"
format: "video | in-person | asynchronous"
language: "es | en"
recorded: true | false
incentive: "<descripción>"
date_created: "YYYY-MM-DD"
owner: "<nombre>"
---

# Script de entrevista — <Tema>

> **Para el entrevistador:** este script es guía, no checklist rígida. Sigue la conversación; usa las preguntas como anclas. El objetivo es entender, no rellenar el script.

## Antes de la entrevista — checklist (5 min)

- [ ] Confirmar consentimiento para grabar (si aplica).
- [ ] Tener listo el incentivo (cómo se entrega tras la sesión).
- [ ] Cerrar otras pestañas / silenciar notificaciones.
- [ ] Tomar nota mentalmente: el entrevistado es el experto, tú eres el aprendiz.

## 1. Calentamiento (3-5 min)

> Objetivo: bajar tensión, contextualizar, obtener permiso para grabar.

- "Hola <nombre>, gracias por dedicarnos este tiempo. Antes de empezar te explico brevemente el formato: vamos a hablar durante ~<X> minutos sobre <tema>. No hay respuestas correctas ni incorrectas; nos interesa tu experiencia real."
- "¿Te parece bien si grabo la conversación? La usamos solo internamente para tomar notas; no se comparte fuera del equipo."
- "Cuéntame brevemente: ¿a qué te dedicas? ¿En qué contexto usas <producto / dominio>?"

## 2. Preguntas exploratorias (10-15 min)

> Objetivo: entender el contexto y el día a día del entrevistado en relación al tema. Preguntas abiertas, sin guiar.

- "Cuéntame la última vez que <situación relevante>. ¿Qué pasó?"
- "Cuando dices que <algo que mencionó>, ¿a qué te refieres exactamente?"
- "¿Cómo te das cuenta de que <X> es un problema / oportunidad?"
- "Si miras las últimas <semanas/meses>, ¿qué cosas te han frustrado más en relación a <tema>?"
- "¿Qué intentas conseguir cuando <acción típica>?"

## 3. Profundización en problemas (10-15 min)

> Objetivo: si en la sección 2 emergió un problema, profundizar con el método "5 whys" suave.

- "¿Por qué eso es un problema para ti? (mientras siga siendo no obvio, repreguntar 2-3 veces el "¿por qué eso es importante?")"
- "¿Qué impacto tiene? (cuantificar si se puede: tiempo perdido, dinero, oportunidades, estrés)"
- "¿Cómo lo resuelves hoy? ¿Qué hace que esa solución no sea suficiente?"
- "Si pudieras agitar una varita y hacer desaparecer este problema, ¿qué cambiaría en tu vida/trabajo?"
- "¿Habías intentado resolverlo antes? ¿Con qué?"

## 4. Preguntas de comportamiento (no de opinión) (5-10 min)

> Objetivo: contrastar lo que dice con lo que hace. Las preguntas hipotéticas mienten; el pasado y el presente, no.

- "Muéstrame, si puedes, cómo lo haces hoy" (si formato lo permite).
- "¿Cuándo fue la última vez que <acción específica>? ¿Qué hiciste exactamente?"
- "Recuerdas tres ocasiones recientes en las que <situación>: ¿qué tuvieron en común?"

> **Evitar preguntas hipotéticas tipo "¿Usarías una herramienta que...?"** — no predicen comportamiento real.

## 5. (Solo solution-validation) Reacción a la propuesta (5-10 min)

> Solo si la fase es validación de solución y el entrevistado ha entendido el problema.

- "Te voy a mostrar/contar una idea. Quiero entender qué te parece, qué te pierdes y qué te sobra. No defendemos la idea — la estamos evaluando contigo."
- (Mostrar prototipo / concept / mockup)
- "¿Qué entiendes que hace?"
- "¿Te resolvería el problema del que hablábamos? ¿Por qué sí / por qué no?"
- "¿Qué te falta?"
- "Si esto existiera mañana, ¿lo usarías? ¿En qué momento?"
- "¿Cuánto crees que valdría una solución así?" (solo si tiene sentido al modelo)

## 6. Cierre (3-5 min)

- "Pregunta libre: ¿hay algo que no te he preguntado y que crees que debería saber sobre <tema>?"
- "¿Conoces a alguien más a quien le venga bien hablar con nosotros sobre esto?" (referral)
- "Gracias por tu tiempo. <Cómo se entrega el incentivo.> ¿Te parece bien si vuelvo a contactarte si surge una pregunta de seguimiento?"

---

## Después de la entrevista — debrief (5-10 min, en caliente)

> Rellenar inmediatamente al cerrar, mientras la memoria es fresca.

- **Hallazgos más fuertes (verbatim si es posible):**
  1.
  2.
  3.

- **Sorpresas (lo que no esperabas):**

- **Hipótesis nuevas que emergieron:**

- **Hipótesis previas confirmadas / desmentidas:**

- **Próximas preguntas a hacer en futuras entrevistas:**

- **Score subjetivo (1-5) de utilidad de la entrevista:** <n>

---

## Notas para el entrevistador

- **No corrijas al entrevistado.** Si dice algo "incorrecto" desde tu perspectiva, igual es revelador. Apúntalo y sigue.
- **No vendas el producto.** No es una demo. Si pregunta "¿y vais a hacer X?", responde "buena pregunta, todavía estamos explorando, ¿qué te parecería si...?".
- **Tolera el silencio.** Después de una respuesta, espera 3 segundos antes de la siguiente. A menudo lo más valioso emerge en ese silencio.
- **Pregunta "¿por qué?" tres veces antes de creer la respuesta superficial.** Pero usa variantes: "¿Qué te llevó a eso?", "¿Qué pasaría si no fuera así?", "¿Cómo te das cuenta?".
- **Captura verbatim.** Las frases textuales valen oro en la síntesis posterior.
```

---

## Proceso

1. **Recopilar** la información mínima. Si no está claro el objetivo o la fase, parar y preguntar.
2. **Determinar la estructura** según la fase: exploratoria omite sección 5; solution-validation incluye sección 5; problem-validation enfatiza sección 3.
3. **Adaptar preguntas** al dominio concreto: las preguntas marcadas con `<...>` se concretan con la temática real.
4. **Validar duración:** sumar los tiempos de cada sección y ajustar al total declarado. Si excede, recortar profundización o cierre.
5. **Marcar `[ADAPTAR]`** las preguntas que asumen información del producto que el entrevistado puede o no conocer.
6. **Guardar** en `<proyecto>/product/discovery/interviews/<tema-slug>-script.md`.
7. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen: objetivo, fase, duración estimada, número de preguntas anchor.
   - Próximo paso: realizar entrevistas, sintetizar en `<tema-slug>-synthesis.md` después de 4-5 sesiones.

---

## Restricciones

- **No incluyas preguntas guiadas (leading questions).** "¿Te resultaría útil X?" se reformula a "¿Cómo resuelves Y hoy? ¿Qué te falta?".
- **No incluyas preguntas hipotéticas como criterio de decisión.** Pueden ser señal débil, no evidencia.
- **No abuses del entrevistado.** 60 min es el límite duro; 45 es lo habitual.
- **No prometas confidencialidad imposible.** Si la grabación va a un sistema con acceso amplio, decirlo.
- **No olvides el incentivo prometido.** Es respeto básico y reputación de futuras invitaciones.
- Aplican las reglas de output de `_shared/output-rules.md`.
