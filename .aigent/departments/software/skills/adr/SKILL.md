---
name: "adr"
description: >
  Skill for writing an Architecture Decision Record (ADR): a numbered, dated
  document that captures one technical decision with its context, the options
  considered, the option chosen, and its consequences. Stack agnostic.
---

# Skill: ADR — Architecture Decision Record

**Entregable:** archivo `.md` numerado y fechado, listo para vivir en `<proyecto>/software/architecture/adr/`.

---

## Cuándo usar esta skill

- Hay que tomar una decisión técnica relevante (elección de stack, patrón, herramienta, modelo de datos, esquema de comunicación entre servicios, política de retención…) y conviene dejar huella del razonamiento.
- Se ha tomado una decisión informalmente y se quiere ratificarla por escrito antes de implementarla.
- Se va a revertir o sustituir una decisión previa: el nuevo ADR sustituye al anterior (con marca `Superseded by ADR-XXX`).

**Cuándo NO usar:**

- Para documentar un diseño completo de un sistema o subsistema (eso va a `architecture/designs/`, no es un ADR).
- Para una decisión trivial sin trade-offs reales (ej. nombre de una variable). Un ADR sin opciones alternativas no aporta.
- Para un plan de implementación. El ADR documenta el "qué" y el "por qué", no el "cómo paso a paso".

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Decisión | ¿Qué decisión hay que tomar/documentar, formulada como pregunta? (ej. "¿Postgres o MongoDB para el servicio de pedidos?") |
| Contexto | ¿Qué hace necesaria esta decisión ahora? (problema actual, restricción nueva, oportunidad) |
| Opciones consideradas | ¿Qué alternativas reales hay? Mínimo 2. ¿"Mantener lo actual / no hacer nada" es una opción válida? |
| Criterios de decisión | ¿Qué pesa para elegir? (performance, coste, equipo, time-to-market, compliance…) |
| Decisión adoptada | ¿Cuál es la opción elegida? Si aún no se ha decidido, el ADR queda en estado `Proposed`. |
| Consecuencias | ¿Qué cambia tras adoptar la decisión? Positivas, negativas y riesgos. |
| Decisor / responsables | ¿Quién toma la decisión y quién la consume? |
| ADRs relacionados | ¿Hay ADRs previos que esta decisión afecta o sustituye? |

---

## Plantilla del entregable

Numeración: lee el último ADR en `<proyecto>/software/architecture/adr/`. Si el último es `adr-007-...md`, el nuevo es `adr-008-...md`. Slug del nombre = decisión en kebab-case ASCII (ej. `adr-008-pick-postgres-over-mongo.md`).

```markdown
# ADR-<NNN>: <Título corto, imperativo o decisión en una línea>

- **Estado:** Proposed | Accepted | Rejected | Superseded by ADR-<NNN> | Deprecated
- **Fecha:** YYYY-MM-DD
- **Decisores:** <nombres / roles>
- **Consultados:** <nombres / roles que aportaron input (opcional)>
- **Stack del proyecto:** <lenguaje, framework, persistencia principal>
- **ADRs relacionados:** ADR-<NNN> (relación: refines / supersedes / extends)

---

## Contexto

<Qué problema hay que resolver. Qué restricciones operan ahora. Qué historia previa importa.
Es la sección que un lector dentro de 6 meses necesita para entender por qué este ADR existe.>

## Drivers de decisión

- <Criterio 1: por qué importa>
- <Criterio 2: ...>
- <Criterio 3: ...>

> Si hay criterios ponderados, indicar la ponderación. Si no, lista ordenada por importancia.

## Opciones consideradas

### Opción A — <Nombre corto>

**Descripción:** <qué es, una línea>

**Ventajas:**
- <ventaja>

**Desventajas:**
- <desventaja>

**Coste de implementación:** Bajo / Medio / Alto — <una línea de detalle>
**Reversibilidad:** Reversible / Costosa / Irreversible — <una línea>

---

### Opción B — <Nombre corto>

(mismas subsecciones)

---

### Opción C — <Nombre corto> *(opcional)*

(mismas subsecciones)

---

## Decisión

**Se adopta la Opción <X>: <nombre corto>.**

<Por qué supera al resto bajo los drivers de decisión. Reconoce explícitamente qué desventaja se asume.>

## Consecuencias

### Positivas
- <Qué mejora con esta decisión>

### Negativas / asumidas
- <Qué se sacrifica o complica>

### Riesgos
- <Riesgo 1>: probabilidad <baja/media/alta>, mitigación <descripción>
- <Riesgo 2>: ...

## Plan de adopción

<Pasos de alto nivel para llevar la decisión a producción. NO es un plan detallado de implementación —
eso vive en un ticket o en `software-coding`. Aquí: hitos principales y dependencias.>

## Métricas de éxito

<Cómo sabremos en 1-3 meses que la decisión fue acertada. Idealmente numéricas.>

## Notas adicionales

<Referencias externas, links a benchmarks, RFCs, librerías evaluadas, threads de discusión.>
```

---

## Proceso

1. **Recopilar** la información (sección anterior). Si no hay al menos 2 opciones reales, parar y discutir con el usuario si la decisión amerita ADR.
2. **Determinar el número del ADR** leyendo el directorio `<proyecto>/software/architecture/adr/`. Empezar en `001` si está vacío.
3. **Si la decisión sustituye un ADR previo:** actualizar también el ADR antiguo con `Estado: Superseded by ADR-<nuevo>` y un link al nuevo.
4. **Rellenar la plantilla** sección a sección, sin saltar Opciones consideradas aunque la decisión "parezca obvia". Si parece obvia, es señal de que conviene escribir por qué.
5. **Marcar con `[COMPLETAR]`** los campos cuyos datos reales (números, fechas, decisores) tiene que aportar el usuario.
6. **Guardar** el archivo en `<proyecto>/software/architecture/adr/adr-<NNN>-<slug>.md` (la ruta exacta la facilita el orquestador o el agente que invoca esta skill).
7. **Reportar** al usuario:
   - Ruta del archivo creado.
   - Estado del ADR (`Proposed` por defecto si no hay confirmación; `Accepted` si el usuario lo confirma).
   - Decisión adoptada en una línea.
   - Lo que queda con `[COMPLETAR]`.
   - Próximo paso sugerido (típicamente: implementar la decisión con `software-coding`, o validar con el equipo si está en `Proposed`).

---

## Restricciones

- **No documentar decisiones sin opciones alternativas reales.** Un ADR con una sola opción es un memo, no un ADR.
- **No mezclar varias decisiones en un mismo ADR.** Si la conversación las junta, separa antes de escribir: una decisión = un ADR.
- **No inventar números.** Si una opción dice "10x más rápida", o hay benchmark, o se marca con `[BENCHMARK PENDIENTE]`.
- **No editar ADRs Accepted retroactivamente** para cambiar la decisión. Para cambiar de opinión, se crea un nuevo ADR que supersedes el viejo.
- **No incluir secretos** (URLs internas confidenciales, credenciales, datos de clientes) en el ADR. Es documento de equipo, no privado del autor.
- Aplican las reglas de output de `_shared/output-rules.md`.
