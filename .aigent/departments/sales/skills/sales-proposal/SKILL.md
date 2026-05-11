---
name: "sales-proposal"
description: >
  Skill for writing a complete, structured sales proposal from a deal brief.
  Always creates a .md file with all sections: executive summary, problem diagnosis,
  proposed solution, scope, pricing, ROI estimate, timeline, and next steps.
---

# Skill: Propuesta Comercial

**Entregable:** documento de propuesta comercial completo en formato `.md`, listo para compartir con el cliente o convertir a PDF/presentación

---

## Cuándo usar esta skill

Cuando el usuario necesite redactar una propuesta formal para un cliente concreto, ya sea en fase de evaluación, negociación o como respuesta a una RFP/solicitud de oferta.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Nombre del cliente | ¿Cómo se llama la empresa cliente? |
| Interlocutor(es) | ¿A quién va dirigida la propuesta? (nombre, cargo) |
| Problema identificado | ¿Cuál es el problema o necesidad que el cliente ha expresado? |
| Solución propuesta | ¿Qué producto/servicio vamos a proponer? ¿Con qué alcance? |
| Precio | ¿Cuánto cuesta? ¿Es precio fijo, por uso, suscripción? |
| ROI o beneficio estimado | ¿Qué ahorro o ganancia puede esperar el cliente? ¿Hay dato concreto? |
| Timeline | ¿Cuándo empieza el proyecto? ¿Cuánto dura? ¿Hay hitos clave? |
| Competidores en evaluación | ¿Está comparando con alguien? ¿Cuál es nuestro diferenciador? |
| Próximo paso | ¿Qué queremos que haga el cliente tras leer la propuesta? |

---

## Plantilla de entregable

```markdown
---
type: "sales-proposal"
client: ""
contact: ""
date_created: "YYYY-MM-DD"
valid_until: "YYYY-MM-DD"
status: "draft | sent | accepted | rejected"
deal_value: ""
---

# Propuesta Comercial
## [Nombre del Proyecto / Solución]
**Preparada para:** [Nombre del contacto], [Cargo] — [Empresa cliente]
**Preparada por:** [Nombre del rep], [Cargo] — [Nuestra empresa]
**Fecha:** YYYY-MM-DD | **Válida hasta:** YYYY-MM-DD

---

## Resumen ejecutivo

[2-3 párrafos que condensan todo lo importante para un decisor sin tiempo:
1. El problema que tiene el cliente (validado en conversaciones previas)
2. La solución que proponemos y por qué somos la mejor opción
3. El resultado que puede esperar y el siguiente paso recomendado]

---

## El reto que queréis resolver

[Descripción del problema o necesidad del cliente, en sus propios términos si es posible.
Demostrar que entendemos el contexto: qué está pasando ahora, qué consecuencias tiene no resolverlo,
qué han intentado ya. Esta sección debe hacer que el cliente piense "exactamente, nos entienden".]

**Impacto actual del problema:**
- [Consecuencia 1: coste, tiempo perdido, riesgo...]
- [Consecuencia 2]
- [Consecuencia 3]

---

## Nuestra propuesta

[Descripción clara de la solución: qué incluye, cómo funciona, qué hace el cliente y qué hacemos nosotros.
No es un catálogo de funcionalidades — es la historia de cómo resolvemos el problema descrito arriba.]

### Lo que incluye esta propuesta

| Elemento | Descripción |
|---|---|
| [Componente 1] | [Qué es y para qué sirve en el contexto del cliente] |
| [Componente 2] | |
| [Componente 3] | |

### Lo que NO incluye (alcance)

- [Exclusión 1 — para evitar malentendidos]
- [Exclusión 2]

---

## Resultado esperado

[Qué puede esperar el cliente como resultado. Cuantificar siempre que sea posible.]

| Métrica | Situación actual | Con nuestra solución |
|---|---|---|
| [Métrica 1] | [Dato actual o estimado] | [Mejora esperada] |
| [Métrica 2] | | |

**ROI estimado:** [cálculo simplificado: inversión vs. ahorro/ganancia en X meses]

> [Si no tienes datos reales, usar: "Basándonos en proyectos similares con empresas de [perfil], los clientes consiguen [X resultado] en [Y plazo]. [COMPLETAR con dato real si está disponible]"]

---

## Por qué nosotros

[3-5 razones concretas por las que somos la mejor opción para este cliente concreto.
No el típico "somos los mejores" — diferenciadores reales para su caso específico.]

- **[Diferenciador 1]:** [por qué importa para este cliente]
- **[Diferenciador 2]:** [ídem]
- **[Diferenciador 3]:** [ídem]

**Referencia relevante:** [Nombre de empresa similar / caso de uso parecido — si se puede compartir]

---

## Plan de implementación

| Fase | Descripción | Duración | Responsable |
|---|---|---|---|
| Fase 1: [nombre] | [qué pasa] | [X semanas] | [quién lidera] |
| Fase 2: [nombre] | | | |
| Fase 3: [nombre] | | | |

**Fecha estimada de inicio:** [si se confirma antes de YYYY-MM-DD]
**Go-live estimado:** YYYY-MM-DD

---

## Inversión

| Concepto | Precio |
|---|---|
| [Concepto 1] | [€/$/precio] |
| [Concepto 2] | |
| **Total** | **[COMPLETAR]** |

**Modalidad de pago:** [pago único / mensual / por hitos]
**Condiciones:** [plazo de pago, renovación automática, etc.]

> Esta propuesta es válida hasta el **[fecha]**. Después de esta fecha, los precios pueden variar.

---

## Próximos pasos

Para avanzar, necesitamos:

1. **Tu feedback sobre esta propuesta** — ¿hay algo que ajustar antes de proceder?
2. **Confirmación de la fecha de inicio** — ¿cuándo queréis arrancar?
3. **Firma del contrato / PO** — podemos tenerlo listo en [X días hábiles]

¿Podemos agendar una llamada de **30 minutos** esta semana para revisar juntos y resolver dudas?

**[→ Agenda aquí](COMPLETAR URL de calendario)**

---

## Apéndice (opcional)

### Preguntas frecuentes

**¿Qué pasa si necesitamos cambiar el alcance?**
[Respuesta]

**¿Cómo es el proceso de soporte post-implementación?**
[Respuesta]

**¿Cuáles son los términos de cancelación?**
[Respuesta]
```

---

## Proceso

1. **Entender el deal antes de escribir**: leer el contexto del cliente, las notas de discovery y las conversaciones previas
2. **Empezar por el problema**: si el resumen ejecutivo no describe con precisión el dolor del cliente, reescribir hasta que sí lo haga
3. **Personalizar la sección "por qué nosotros"** para el cliente concreto, no copiar y pegar de propuestas anteriores
4. **Cuantificar el ROI**: aunque sea estimado, los números concretos aumentan la tasa de cierre
5. **Marcar todo lo que falta** con `[COMPLETAR]` para que el rep lo complete con datos reales antes de enviar
6. **Guardar el archivo** en `<proyecto>/sales/proposals/<nombre-cuenta>/proposal-<fecha>.md`
7. **Informar al usuario** de la ruta y los campos marcados como `[COMPLETAR]`

---

## Checklist antes de enviar al cliente

- [ ] El resumen ejecutivo describe el problema del cliente en sus propios términos
- [ ] Todos los `[COMPLETAR]` están rellenados con datos reales
- [ ] El precio está confirmado internamente antes de enviarlo
- [ ] La fecha de validez es razonable (ni demasiado corta ni abierta indefinidamente)
- [ ] El próximo paso tiene una acción concreta (no "cuéntanos si tienes dudas")
- [ ] La propuesta no tiene más de 8-10 páginas (en PDF equivalente) — si es más larga, crear versión resumen ejecutivo

---

## Restricciones

- No incluir compromisos de entrega, SLAs, garantías ni hitos de implementación que no hayan sido validados internamente.
- No fijar precios, descuentos o condiciones de pago sin confirmación del responsable comercial.
- No copiar y pegar la sección "Por qué nosotros" de propuestas anteriores: tiene que estar adaptada al cliente concreto.
- Marcar con `[COMPLETAR]` todo dato pendiente y comunicárselo al rep antes de cerrar.
- Diferenciar siempre estimaciones (`[ESTIMADO]`) de compromisos: el cliente debe saber qué número es contractual y qué número es indicativo.
- Aplican las reglas de output de `_shared/output-rules.md`.
