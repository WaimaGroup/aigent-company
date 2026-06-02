---
name: "marketing-strategy"
user-invocable: true
description: >
  Skill for marketing planning deliverables: a full marketing plan (annual/quarterly, with
  situation analysis, objectives, channel strategy, budget and calendar) and a campaign brief
  (objective, audience, message, channels, assets, timeline, budget, risks). Mode chosen by
  the request: `plan` or `brief`.
---

# Skill: Estrategia de Marketing

**Entregable:** un archivo `.md` en `strategy/`. Cubre dos modos: **plan** (plan de marketing) y **brief** (briefing de campaña).

> **Regla de output (default de Marketing):** un solo `.md`. Sin archivos extra salvo petición.

---

## Cuándo usar esta skill

| `modo` | Cuándo |
|---|---|
| `plan` | Plan de marketing anual, trimestral o de una línea de negocio |
| `brief` | Documentar una campaña concreta (lanzamiento, estacional, lead gen, branding) |

Si el modo no está claro, preguntarlo en la primera tanda.

---

## Modo `plan` — plan de marketing

Recopilar: horizonte temporal, objetivos de negocio/OKRs, presupuesto total, situación actual (qué funciona/qué no, datos históricos), competidores, canales actuales y a explorar, equipo.

Estructura:

```markdown
# PLAN DE MARKETING [PERIODO]
**Empresa/Línea:** [...]  ·  **Periodo:** [...]  ·  **Fecha:** YYYY-MM-DD

## 1. Resumen ejecutivo
[contexto, objetivo principal, palancas clave]

## 2. Análisis de situación
Interno (fortalezas/debilidades/resultados previos) · Externo (oportunidades/amenazas/tendencias) · Competencia (tabla competidor | fortaleza | debilidad | nuestra diferenciación)

## 3. Objetivos y KPIs
| Objetivo SMART | KPI | Baseline | Meta | Plazo |

## 4. Audiencias
| Segmento | Perfil | Momento del funnel | Canal preferente |

## 5. Estrategia por canal
Por canal: objetivo del canal · acciones clave · KPI · presupuesto.

## 6. Presupuesto
| Partida | Q1 | Q2 | Q3 | Q4 | TOTAL |

## 7. Calendario de iniciativas
| Iniciativa | Canal | Q1..Q4 | Responsable |

## 8. Reporting
Frecuencia · dashboard · reunión de seguimiento.

## 9. Riesgos y contingencia
| Riesgo | Probabilidad | Impacto | Acción |
```

Empezar por el análisis (sin datos no hay estrategia; si no hay baseline, marcar el plan como hipotético). Derivar los objetivos de marketing de los de negocio. Priorizar 3-5 palancas medibles (regla orientativa de presupuesto 70/20/10: probado/experimentación/innovación). No comprometer presupuesto sin validación.

---

## Modo `brief` — briefing de campaña

Recopilar: nombre, objetivo de negocio, KPI principal (con objetivo numérico), presupuesto, fechas, audiencia, oferta/gancho, canales, responsables.

Estructura:

```markdown
# BRIEFING DE CAMPAÑA: [NOMBRE]
**Fecha:** YYYY-MM-DD  ·  **Responsable:** [...]  ·  **Estado:** Borrador/Aprobado

## 1. Contexto y objetivo
Objetivo de negocio · objetivo de marketing SMART · KPI principal ([métrica]→[valor] en [plazo]) · KPIs secundarios.

## 2. Audiencia
Segmento principal (perfil, funnel) · secundario · qué sabe de nosotros.

## 3. Mensaje clave
Propuesta de valor en una frase · mensajes de soporte · tono y voz.

## 4. Canales y formatos
| Canal | Formato | Presupuesto | Responsable |

## 5. Activos necesarios
| Asset | Specs | Responsable | Fecha límite |

## 6. Cronograma
| Fase | Descripción | Inicio | Fin |  (Preparación / Lanzamiento / Optimización / Cierre)

## 7. Presupuesto
| Partida | Importe |

## 8. Aprobaciones
| Decisión | Responsable | Fecha límite |

## 9. Riesgos
| Riesgo | Probabilidad | Impacto | Contingencia |
```

Marcar con ⚠️ los campos críticos sin definir y comunicarlos al cerrar. Proponer KPIs si el usuario no los tiene claros. No inventar baseline (`[BASELINE PENDIENTE]` + cómo obtenerlo). No omitir la sección de riesgos. No comprometer presupuesto sin la aprobación indicada.

---

## Proceso (común)

1. Determinar el `modo` y recopilar la info mínima en una sola tanda.
2. Rellenar la plantilla; destacar campos pendientes con ⚠️.
3. Escribir **un único `.md`** con `Write` en `strategy/`.
4. Confirmar la ruta y los próximos pasos inmediatos.

---

## Restricciones

- No proponer estrategia sin análisis/baseline previo; si falta, marcar como hipotético.
- No comprometer presupuesto ni recursos sin autorización.
- No inventar KPIs ni baseline numéricos.
- Default de un solo `.md`; formatos extra solo bajo petición.
- Aplican las reglas de output de `_shared/output-rules.md`.
