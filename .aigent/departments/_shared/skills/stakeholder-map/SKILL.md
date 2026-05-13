---
name: "stakeholder-map"
description: >
  Shared skill for producing a structured stakeholder map: identification,
  influence × interest matrix, position (champion/supporter/neutral/blocker),
  motivations, engagement plan per stakeholder. Used cross-department
  (product-discovery, legal-risk, marketing-strategy, sales-ae) with the same
  deliverable structure, regardless of context (initiative, decision, deal).
---

# Skill: Stakeholder Map

**Entregable:** archivo `.md` con mapa de stakeholders estructurado, listo para informar la estrategia de engagement de una iniciativa, decisión o deal. Vive en la carpeta del dept que lo solicite — la skill es compartida en `_shared/skills/`, los outputs no.

---

## Cuándo usar esta skill

- Se prepara una iniciativa que afecta a varias partes (lanzamiento de producto, cambio organizativo, deal complejo, regulación nueva).
- Hay que entender quién decide, quién influye, quién bloquea para una iniciativa.
- Un deal B2B atraviesa varios stakeholders y hay que mapear champions vs blockers.
- Se planifica comunicación de una decisión y se necesita audience map.

**Cuándo NO usar:**

- Para una lista plana de personas a contactar (eso es contact list).
- Para personas/personas de UX (eso es persona, formato distinto — vive en `product-discovery/personas/`).
- Para org chart corporativo (es organizativo, no de engagement).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Contexto / iniciativa | ¿Para qué necesitas el mapa? (lanzamiento, deal, decisión, cambio…) |
| Scope | ¿Stakeholders internos, externos, ambos? |
| Audiencia del mapa | ¿Quién consume el mapa? (equipo de proyecto, leadership, sales squad) |
| Stakeholders iniciales | Lista de partida (los completamos con investigación) |
| Decisión clave | ¿Qué decisión / outcome se busca de estos stakeholders? |
| Plazo | ¿Cuándo se necesita engagement completado? |
| Confidencialidad | ¿El mapa es confidencial? (típicamente sí — incluye juicios sobre personas) |

---

## Plantilla del entregable

Nombre del archivo: `stakeholder-map-<contexto-slug>-<YYYY-MM>.md`.

```markdown
---
type: "stakeholder-map"
context: "<descripción de la iniciativa / deal / decisión>"
scope: "internal | external | mixed"
audience: "project-team | leadership | sales-squad | mixed"
confidentiality: "internal | restricted | confidential"
date: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<rol/persona>"
status: "draft | reviewed | in-execution"
---

# Stakeholder Map — <Contexto> · <YYYY-MM>

> **Confidencial.** Este documento incluye juicios sobre la posición de personas específicas frente a una iniciativa. No compartir fuera del círculo declarado en `audience`.

## 0. Objetivo del mapa

> 1-2 líneas. Qué decisión/outcome estamos persiguiendo y por qué necesitamos mapear stakeholders.

**Decisión objetivo:** <qué queremos que pase>

**Plazo:** <cuándo se necesita el commitment / firma / approval>

---

## 1. Tabla maestra

> Una entrada por stakeholder. Las matrices y planes individuales vienen después.

| Stakeholder | Rol / Cargo | Influencia | Interés | Posición | Owner del engagement |
|---|---|---|---|---|---|
| <Persona A> | <rol> | Alta | Alto | Champion | <quién la trabaja> |
| <Persona B> | <rol> | Alta | Bajo | Neutral | |
| <Persona C> | <rol> | Media | Alto | Supporter | |
| <Persona D> | <rol> | Alta | Alto | Blocker | |
| ... | | | | | |

**Leyenda:**
- **Influencia:** capacidad de mover/bloquear la decisión.
- **Interés:** cuánto le importa el outcome a este stakeholder personalmente.
- **Posición:** Champion (defiende activamente), Supporter (a favor pasivo), Neutral (no opinión clara), Blocker (en contra activo).

---

## 2. Matriz influencia × interés

> Visualización rápida. Cada cuadrante implica una estrategia de engagement distinta.

```
                          INTERÉS
                  ↑ Alto                    ↓ Bajo
              ┌─────────────────┬─────────────────┐
   Influencia │  MANAGE CLOSELY │  KEEP SATISFIED │
       Alta   │  <Persona A>    │  <Persona B>    │
              │  <Persona D>    │                 │
              ├─────────────────┼─────────────────┤
   Influencia │  KEEP INFORMED  │  MONITOR        │
       Baja   │  <Persona C>    │                 │
              │                 │                 │
              └─────────────────┴─────────────────┘
```

**Implicaciones de cada cuadrante:**

- **Manage closely** (alta influencia + alto interés): contacto frecuente, alineación constante, primeros en saber de cambios.
- **Keep satisfied** (alta influencia + bajo interés): updates periódicos breves, evitar que se conviertan en bloqueadores por desinformación.
- **Keep informed** (baja influencia + alto interés): updates regulares, son aliados naturales y multiplicadores.
- **Monitor** (baja influencia + bajo interés): seguimiento mínimo, no consumir energía aquí.

---

## 3. Posiciones — matriz de actitud

| Posición | Stakeholders | Estrategia |
|---|---|---|
| **Champion** | <listado> | Empoderar, dar visibilidad, asegurar continuidad |
| **Supporter** | <listado> | Convertir en Champion, mantener informados |
| **Neutral** | <listado> | Investigar motivaciones, convertir en Supporter |
| **Blocker** | <listado> | Entender motivación, mitigar o neutralizar; en último caso, escalar |

---

## 4. Fichas individuales

> Una ficha por stakeholder de alta influencia o de alto interés. Los de "Monitor" pueden omitir ficha.

### <Persona A> — Champion

- **Rol:** <cargo>
- **Reporta a:** <jefe>
- **Influye sobre:** <a quién mueve>
- **Interés en el outcome:** <por qué le importa, qué gana>
- **Motivaciones:** <qué le mueve personalmente — career, impacto, reputación, etc.>
- **Preocupaciones:** <qué teme de esta iniciativa>
- **Postura observada:** <evidencia: qué ha dicho, qué ha hecho>
- **Canal de comunicación preferido:** <email / cara a cara / Slack>
- **Historia previa:** <interacciones relevantes>
- **Estrategia de engagement:**
  - <Acción 1: ej. "1:1 mensual">
  - <Acción 2: ej. "Incluirlo en el announcement del CEO">
- **Owner del engagement:** <quién la trabaja>
- **Última interacción:** <fecha + breve nota>

(repetir por stakeholder de alta influencia)

---

## 5. Plan de engagement

> Acciones concretas en el tiempo. Sin esto, el mapa es un mapa que se queda en mapa.

| Acción | Stakeholder(s) | Owner | Fecha | Resultado esperado |
|---|---|---|---|---|
| <1:1 con <A> para alinear roadmap> | <A> | <yo> | <DD-MM> | Confirmar champion status |
| <Send brief a <B>> | <B> | <yo> | <DD-MM> | Mantener satisfied |
| <Investigar motivación de <D>> | <D> | <yo> | <DD-MM> | Identificar leverage para mitigar bloqueo |
| ... | | | | |

---

## 6. Riesgos identificados

> Stakeholders que podrían convertirse en bloqueos si no se gestionan.

| Riesgo | Stakeholder | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| <Bloqueo activo> | <D> | Alta | Alto | <acción> |
| <Salida de un Champion> | <A> | Media | Alto | <plan B> |

---

## 7. Cadencia de actualización

- **Frecuencia de revisión:** <semanal / quincenal / mensual según urgencia>
- **Triggers de re-mapeo:** <eventos que invalidan el mapa: cambio organizativo, salida de un stakeholder, escalada del proyecto>
- **Próxima revisión completa:** <fecha>

---

## 8. Anexos

- **Org chart relevante:** <link>
- **Histórico de comunicaciones clave:** <link>
- **Versiones previas del mapa:** <links>
```

---

## Proceso

1. **Recopilar** la información mínima. Sin contexto claro de la iniciativa y stakeholders iniciales, parar.
2. **Identificar todos los stakeholders** relevantes: decisores, influencers, afectados, gatekeepers. Pasar de "obvios" a "los que pueden bloquearte por sorpresa" es la parte clave.
3. **Evaluar influencia e interés con evidencia.** No basar en intuición: ¿qué decisiones recientes muestran su influencia? ¿qué señales muestran su interés?
4. **Asignar posición.** La posición es lo que has observado, no lo que esperarías. Champion sin evidencia de defensa activa es Supporter.
5. **Visualizar en matriz** (sección 2). Identifica al instante en qué cuadrante invertir más energía.
6. **Fichas individuales** solo para los de alta influencia o alto interés. Los de bajo+bajo no merecen ficha — basta con la fila en la tabla.
7. **Plan de engagement con acciones concretas y plazos.** Sin esto, el mapa es decorativo.
8. **Identificar riesgos.** Champions que se van, Neutrales que pueden virar, Blockers que pueden escalar.
9. **Marcar `[VERIFICAR POSICIÓN]`** cuando no hay evidencia firme, `[OWNER PENDIENTE]` lo que no tiene dueño, `[INVESTIGAR MOTIVACIÓN]` lo que requiere conversación.
10. **Guardar** en la carpeta del dept (`<proyecto>/product/strategy/`, `<proyecto>/legal/risk/`, `<proyecto>/sales/`, `<proyecto>/marketing/strategy/`). La skill es compartida; el output vive donde lo consume el agente.
11. **Reportar** al usuario: ruta, número de stakeholders por cuadrante, top 3 acciones inmediatas, riesgos críticos.

---

## Restricciones

- **No publiques el mapa fuera del círculo declarado.** Incluye juicios sobre personas; manejo confidencial.
- **No bases posiciones en intuición sin evidencia.** "Creo que está a favor" no es Champion.
- **No olvides los stakeholders externos** (clientes, reguladores, partners, prensa) cuando aplica.
- **No omitas el plan de engagement.** Un mapa sin acción es un dibujo.
- **No prometas conversiones de posición sin plan.** "Pasar a Champion" requiere acciones concretas.
- **No ignores Blockers.** Es la posición que más fricción genera; merece la mayor inversión analítica.
- **No reutilices mapas viejos sin actualizar.** Las personas cambian de rol, las prioridades cambian, los mapas envejecen rápido.
- Aplican las reglas de output de `_shared/output-rules.md`.
